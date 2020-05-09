layui.config({
    base:'/layui/layui_exts/'
});
layui.use(['form', 'layedit', 'laydate','table','layer','excel','treeSelect'], function(){
    var form = layui.form,
        layer = layui.layer,
        laydate = layui.laydate,
        table = layui.table,
        layer = layui.layer,
        treeSelect = layui.treeSelect;

    //日期
    laydate.render({
        elem: '#start_time'
        ,format: 'yyyy年MM月dd日'
    });
    laydate.render({
        elem: '#end_time'
        ,format: 'yyyy年MM月dd日'
    });
    table.render({
        elem: '#vehicle_apply_tb',
        url:'/admin/vehicleApply/queryVehicleApplyList',
        toolbar: '#toolbarVehicle',
        defaultToolbar: [ ],
        autoSort: false,
        cellMinWidth: 80,
        title: '用车申请记录',
        cols: [[
            {field:'id', title:'审批编号', edit: 'text'}
            ,{field:'creationTimeStr', title:'提交时间', edit: 'text', sort: true}
            ,{field:'applicant', title:'申请人'}
            ,{field:'applicationDept', title:'申请部门'}
            ,{field:'approvalStatus', title:'审批状态',templet:function (res) {
                    return $('#approvalStatus').find("option[value="+res.approvalStatus+"]").text();
                }}
        ]],
        page: true,
        parseData: function(res){ //res 即为原始返回的数据
            return {
                "code": 0, //解析接口状态
                "msg": '', //解析提示文本
                "count": res.data.total, //解析数据长度
                "data": res.data.list //解析数据列表
            };
        },
        where:{

        }
    });
    var rendTreeSelect = function(){
        treeSelect.render({
            // 选择器
            elem: '#applicationDept_select',
            // 数据
            data: '/wx/getDeptsTree',
            hideNameElId:'applicationDept',
            // 异步加载方式：get/post，默认get
            type: 'post',
            // 占位符
            placeholder: '请选择部门',
            // 是否开启搜索功能：true/false，默认false
            search: true,
            // 点击回调
            click: function(d){
                $('#applicationDept').val(d.current.name);
            },
            // 加载完成后的回调函数
            success: function (d) {
            }
        });
    }
    rendTreeSelect();
    //头工具栏事件
    table.on('toolbar(vehicle_apply_tb)', function(obj) {
        switch(obj.event){
            //自定义头工具栏右侧图标 - 提示
            case 'table_export':
                exportExcelData(table);
                break;
        };
    });
    /**
     * 获取导出excel的数据
     */
    var exportExcelData = function(){
        var queryParams = {};
        $.each($('#vehicle_apply_form').serializeArray(),function () {
            var value = this.value;
            if (value) {
                var field = this.name;
                queryParams[field] = dateStrOption(field,value);
            }
        });
        if ($.isEmptyObject(queryParams)){
            layer.msg('查询条件不能为空');
            return false;
        }

        var exportExcel = function(res){
            var approvalStatusJson = {};
            for (var i = 0 ;i <  res.data.approvalStatus.length ;i++){
                approvalStatusJson[res.data.approvalStatus[i].value] = res.data.approvalStatus[i].typeName;
            }
            var vehicleApplyData = res.data.vehicleApplyData;
            for (var i = 0 ;i < vehicleApplyData.length ;i++ ){
                var vehicleApply = res.data.vehicleApplyData[i];
                vehicleApply['serialNumber'] = (i + 1);
                vehicleApply['approvalStatus'] =  approvalStatusJson[vehicleApply.approvalStatus];
            }
            // 1. 数组头部新增表头
            vehicleApplyData.unshift({serialNumber: '序号',id: '审批编号', creationTime: '提交时间',
                applicant: '申请人',applicationDept: '申请部门',telephone: '电话号码',usingVehicleCause: '用车事由',
                vehicleType: '车辆类型',startTime: '开始时间',endTime: '结束时间',number: '人数',startPlace: '出发地',
                stopPlace: '目的地',driveMode: '驾车方式',driver: '司机',approvalStatus: '审批状态',approverName: '部门负责人',
                approvers: '审批人',copyGive: '抄送人',remarks: '备注'});
            // 2. 如果需要调整顺序，请执行梳理函数
            var data = excel.filterExportData(vehicleApplyData, [
                'serialNumber','id','creationTime','applicant','applicationDept','telephone','usingVehicleCause',
                'vehicleType','startTime','endTime','number','startPlace','stopPlace',
                'driveMode','driver','approvalStatus','approverName','approvers','copyGive','remarks'
            ]);
            // 3. 执行导出函数，系统会弹出弹框
            excel.exportExcel({
                sheet1: data
            }, '用车申请记录.xlsx', 'xlsx');
        }
        $.ajax({
            url:'/admin/vehicleApply/queryExportVehicleApplyData',
            data:queryParams,
            type:'POST',
            dataType:'JSON',
            success:function (res) {
                exportExcel(res);
            },error:function (err) {
                layer.msg('获取数据失败');
            }
        });
    }
    //监听排序事件
    table.on('sort(vehicle_apply_tb)', function(obj) { //注：sort 是工具条事件名，test 是 table 原始容器的属性 lay-filter="对应的值"
        //尽管我们的 table 自带排序功能，但并没有请求服务端。
        //有些时候，你可能需要根据当前排序的字段，重新向服务端发送请求，从而实现服务端排序，如：
        table.reload('vehicle_apply_tb', {
            initSort: obj //记录初始排序，如果不设的话，将无法标记表头的排序状态。
            , where: { //请求参数（注意：这里面的参数可任意定义，并非下面固定的格式）
                field: 'CREATION_TIME', //排序字段
                order: obj.type //排序方式
            }
        });
    });
    //监听提交
    form.on('submit(form_vehicle_query)', function(data){
        var queryParams = {};
        for (var key in data.field){
            var value = data.field[key]?data.field[key]:null;
            queryParams[key] = dateStrOption(key,value);
        }
        table.reload('vehicle_apply_tb',{
            where: queryParams
            ,page: {
                curr: 1 //重新从第 1 页开始
            }
        });
        return false;
    });
    var dateStrOption = function (field,dateStr) {
        if ((field === 'startDate' || field === 'endDate') && dateStr){
            dateStr = dateStr.replace('年','-').replace('月','-').replace('日','');
            if (field === 'startDate'){
                dateStr += ' 00:00:00';
            }else {
                dateStr += ' 23:59:59';
            }
        }
        return dateStr;
    }
});