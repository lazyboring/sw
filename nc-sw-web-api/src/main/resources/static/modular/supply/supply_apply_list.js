layui.config({
    base: '/layui/layui_exts/'
});
layui.use(['form', 'layedit', 'laydate', 'table', 'layer', 'excel'], function () {
    var form = layui.form,
        layer = layui.layer,
        laydate = layui.laydate,
        table = layui.table,
        layer = layui.layer,
        excel = layui.excel;

    //日期
    laydate.render({
        elem: '#start_time'
        , format: 'yyyy年MM月dd日'
    });
    laydate.render({
        elem: '#end_time'
        , format: 'yyyy年MM月dd日'
    });
    table.render({
        elem: '#supply_apply_tb',
        url: '/admin/supply/applications',
        toolbar: '#toolbarSupply',
        defaultToolbar: [],
        autoSort: false,
        cellMinWidth: 80,
        title: '用品申请记录',
        cols: [[
            {field: 'id', title: '审批编号', edit: 'text'}
            , {field: 'creationTime', title: '提交时间', edit: 'text', sort: true}
            , {field: 'applicant', title: '申请人'}
            , {field: 'applicantDept', title: '申请部门'}
            , {field: 'statusName', title: '审批状态'}
        ]],
        page: true,
        parseData: function (res) { //res 即为原始返回的数据
            return {
                "code": 0, //解析接口状态
                "msg": '', //解析提示文本
                "count": res.data.total, //解析数据长度
                "data": res.data.list //解析数据列表
            };
        },
        where: {}
    });
    //头工具栏事件
    table.on('toolbar(supply_apply_tb)', function (obj) {
        switch (obj.event) {
            //自定义头工具栏右侧图标 - 提示
            case 'table_export':
                exportExcelData(table);
                break;
        }
        ;
    });
    /**
     * 获取导出excel的数据
     */
    var exportExcelData = function () {
        var queryParams = {};
        $.each($('#supply_apply_form').serializeArray(), function () {
            var value = this.value;
            if (value) {
                var field = this.name;
                queryParams[field] = dateStrOption(field, value);
            }
        });
        if ($.isEmptyObject(queryParams)) {
            layer.msg('查询条件不能为空');
            return false;
        }

        var exportExcel = function (res) {
            var supplyApplyData = res.data;
            // 1. 数组头部新增表头
            supplyApplyData.unshift({
                id: '审批编号', creationTime: '提交时间',
                applicant: '申请人', applicantDept: '申请部门', originIncident: '用车事由',
                supplies: '所申请物品', totalAmount: '总金额', approvalName: '审批状态', approverName: '部门负责人',
                approvers: '审批人', copies: '抄送人', remarks: '备注'
            });
            // 2. 如果需要调整顺序，请执行梳理函数
            var data = excel.filterExportData(supplyApplyData, [
                'id', 'creationTime', 'applicant', 'applicantDept', 'originIncident', 'supplies',
                'totalAmount', 'approvalName', 'approverName', 'approvers', 'copies', 'remarks'
            ]);
            // 3. 执行导出函数，系统会弹出弹框
            excel.exportExcel({
                sheet1: data
            }, '用品申请记录.xlsx', 'xlsx');
        }
        $.ajax({
            url: '/admin/supply/export',
            data: queryParams,
            type: 'POST',
            dataType: 'JSON',
            success: function (res) {
                exportExcel(res);
            }, error: function (err) {
                layer.msg('获取数据失败');
            }
        });
    }
    //监听排序事件
    table.on('sort(supply_apply_tb)', function (obj) { //注：sort 是工具条事件名，test 是 table 原始容器的属性 lay-filter="对应的值"
        //尽管我们的 table 自带排序功能，但并没有请求服务端。
        //有些时候，你可能需要根据当前排序的字段，重新向服务端发送请求，从而实现服务端排序，如：
        table.reload('supply_apply_tb', {
            initSort: obj //记录初始排序，如果不设的话，将无法标记表头的排序状态。
            , where: { //请求参数（注意：这里面的参数可任意定义，并非下面固定的格式）
                field: 'CREATION_TIME', //排序字段
                order: obj.type //排序方式
            }
        });
    });
    //监听提交
    form.on('submit(form_supply_query)', function (data) {
        var queryParams = {};
        for (var key in data.field) {
            var value = data.field[key] ? data.field[key] : null;
            queryParams[key] = dateStrOption(key, value);
        }
        table.reload('supply_apply_tb', {
            where: queryParams
            , page: {
                curr: 1 //重新从第 1 页开始
            }
        });
        return false;
    });
    var dateStrOption = function (field, dateStr) {
        if ((field === 'startDate' || field === 'endDate') && dateStr) {
            dateStr = dateStr.replace('年', '-').replace('月', '-').replace('日', '');
            if (field === 'startDate') {
                dateStr += ' 00:00:00';
            } else {
                dateStr += ' 23:59:59';
            }
        }
        return dateStr;
    }
});