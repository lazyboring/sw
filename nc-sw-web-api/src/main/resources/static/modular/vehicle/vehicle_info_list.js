layui.config({
    base:'/layui/layui_exts/'
});
layui.use(['form','table','layer'], function(){
    var form = layui.form,
        table = layui.table,
        layer = layui.layer;

        table.render({
            elem: '#vehicle_set_tb',
            url:'/admin/vehicleInfo/queryVehicleList',
            toolbar: '#toolbarVehicle',
            defaultToolbar: [ ],
            autoSort: false,
            title: '车辆信息记录',
            cols: [[
                {field:'name', title:'车辆名称', edit: 'text'}
                ,{field:'vehicleCode', title:'车牌号', edit: 'text'}
                ,{field:'color', title:'颜色'}
                ,{field:'seatNumber', title:'座位数'}
                ,{field:'status', title:'车辆状态', templet:function (res) {
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
    table.on('toolbar(vehicle_set_tb)', function(obj) {
        if(obj.event == 'add') {
            layer.open({
                type: 2,
                title: '新增车辆信息',
                content: '/admin/vehicleInfo/add',
                area: ['450px','400px'],
                end:function (){
                    table.reload("vehicle_set_tb");
                }
            });
        }
    });

    //表格行事件
    table.on('tool(vehicle_set_tb)', function(obj) {
        var data = obj.data;
        var event = obj.event;
        if(event == 'edit') {
            layer.open({
                type: 2,
                title: '修改车辆信息',
                content: '/admin/vehicleInfo/edit/'+data.id,
                area: ['450px','400px'],
                end:function (){
                    table.reload("vehicle_set_tb");
                }
            });
        }
    });

    //监听提交
    form.on('submit(form_vehicle_query)', function(data){
        var queryParams = {};
        for (var key in data.field){
            var value = data.field[key]?data.field[key]:null;
            queryParams[key] = value;
        }
        table.reload('vehicle_set_tb',{
            where: queryParams
            ,page: {
                curr: 1 //重新从第 1 页开始
            }
        });
        return false;
    });
});