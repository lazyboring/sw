layui.use(['form', 'table','layer'], function() {
    var form = layui.form,
        table = layui.table,
        layer = layui.layer;

    table.render({
        elem: '#driver_info_tb',
        url:'/admin/driverInfo/queryDriverList',
        toolbar: '#toolbarDriver',
        defaultToolbar: [ ],
        autoSort: false,
        editMode: 'forward',
        title: '司机信息记录',
        cols: [[
            {field:'name', title:'姓名', edit: 'text'}
            ,{field:'driverDept', title:'部门', edit: 'text'}
            ,{field:'telephone', title:'电话号码'}
            ,{field:'status', title:'状态', templet:function (res) {
                    return $('#status').find("option[value="+res.status+"]").text();
                }}
            ,{align: 'center', toolbar: '#tableBar', title: '操作', minWidth: 50}
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
    table.on('toolbar(driver_info_tb)', function(obj) {
        if(obj.event == 'add') {
            layer.open({
                type: 2,
                title: '新增司机信息',
                content: '/admin/driverInfo/add',
                area: ['900px','650px'],
                end:function (){
                    table.reload("driver_info_tb");
                }
            });
        }
    });

    //表格行事件
    table.on('tool(driver_info_tb)', function(obj) {
        var data = obj.data;
        var event = obj.event;
        if(event == 'edit') {
            layer.open({
                type: 2,
                title: '修改司机信息',
                content: '/admin/driverInfo/edit/'+data.id,
                area: ['900px','650px'],
                end:function (){
                    table.reload("driver_info_tb");
                }
            });
        }
    });
    //监听提交
    form.on('submit(form_driver_query)', function(data){
        var queryParams = {};
        for (var key in data.field){
            var value = data.field[key]?data.field[key]:null;
            queryParams[key] = value;
        }
        table.reload('driver_info_tb',{
            where: queryParams
            ,page: {
                curr: 1 //重新从第 1 页开始
            }
        });
        return false;
    });
});