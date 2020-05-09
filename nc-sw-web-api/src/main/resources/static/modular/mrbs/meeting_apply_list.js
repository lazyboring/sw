layui.config({
    base:'/layui/layui_exts/'
});
layui.use(['form', 'layedit', 'laydate','table','layer','excel','treeSelect'], function(){
    var form = layui.form
        ,layer = layui.layer
        ,laydate = layui.laydate
        ,table = layui.table
        ,layer = layui.layer,
        excel = layui.excel,
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

    table.render({
        elem: '#meeting_apply_tb',
        url:'/admin/meetingAplly/queryMeetingApplyList',
        toolbar: '#toolbarDemo',
        defaultToolbar: [ ],
        autoSort: false,
        cellMinWidth: 80,
        method: 'post',
        title: '会议申请记录',
        cols: [[
            {field:'id', title:'审批编号',  edit: 'text'}
            ,{field:'creationTimeStr', title:'提交时间',  edit: 'text', sort: true}
            ,{field:'type', title:'会议类型', templet:function (res) {
                    return $('#meeting_type').find("option[value="+res.type+"]").text();
                }}
            ,{field:'applicant', title:'申请人',}
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
    //头工具栏事件
    table.on('toolbar(meeting_apply_tb)', function(obj){
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
    var exportExcelData = function(tabObj){
        var queryParams = {};
        $.each($('#meeting_apply_form').serializeArray(),function () {
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
            var meetingTypesJson = {};
            for (var i = 0 ;i <  res.data.meetingTypes.length ;i++){
                meetingTypesJson[res.data.meetingTypes[i].value] = res.data.meetingTypes[i].typeName;
            }
            var meetingApplyData = res.data.meetingApplyData;
            for (var i = 0 ;i < meetingApplyData.length ;i++ ){
                var meetingApply = res.data.meetingApplyData[i];
                meetingApply['serialNumber'] = (i + 1);
                meetingApply['approvalStatus'] =  approvalStatusJson[meetingApply.approvalStatus];
                meetingApply['type'] =  meetingTypesJson[meetingApply.type];
            }
            // 1. 数组头部新增表头
            meetingApplyData.unshift({serialNumber: '序号',id: '审批编号', creationTime: '提交时间', type: '会议类型',
                meetingRootName: '预定会议室',applicant: '会务申请人',svName: '旗舰店名称',scene: '场次',telephone: '电话号码',attendees: '参会人员',
                remarks: '会议需求',siteCost: '场地费用',airConditioningCost: '空调费用',applicationDate: '会议时间',
                approvalStatus: '审批状态',approvers: '审批人',copyGive: '抄送人'});
            // 2. 如果需要调整顺序，请执行梳理函数
            var data = excel.filterExportData(meetingApplyData, [
                'serialNumber','id','creationTime','type','meetingRootName','applicant','svName','scene','telephone','attendees',
                'remarks','siteCost','airConditioningCost','applicationDate','startTime','endTime',
                'approvalStatus','approvers','copyGive',
            ]);
            // 3. 执行导出函数，系统会弹出弹框
            excel.exportExcel({
                sheet1: data
            }, '会议申请记录.xlsx', 'xlsx');
        }
        $.ajax({
            url:'/admin/meetingAplly/queryExportMeetingApplyData',
            data:queryParams,
            type:'POST',
            dataType:'JSON',
            success:function (res) {
                exportExcel(res);
            },error:function (er) {
                layer.msg('获取数据失败');
            }
        });
    }
    //监听排序事件
    table.on('sort(meeting_apply_tb)', function(obj) { //注：sort 是工具条事件名，test 是 table 原始容器的属性 lay-filter="对应的值"
        //尽管我们的 table 自带排序功能，但并没有请求服务端。
        //有些时候，你可能需要根据当前排序的字段，重新向服务端发送请求，从而实现服务端排序，如：
        table.reload('meeting_apply_tb', {
            initSort: obj //记录初始排序，如果不设的话，将无法标记表头的排序状态。
            , where: { //请求参数（注意：这里面的参数可任意定义，并非下面固定的格式）
                field: 'CREATION_TIME', //排序字段
                order: obj.type //排序方式
            }
        });
    });
    //监听提交
    form.on('submit(form_meeting_query)', function(data){
        var queryParams = {};
        for (var key in data.field){
            var value = data.field[key]?data.field[key]:null;
            queryParams[key] = dateStrOption(key,value);
        }
        table.reload('meeting_apply_tb',{
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