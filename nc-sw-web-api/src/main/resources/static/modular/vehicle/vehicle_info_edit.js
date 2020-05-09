var is_add = !id;

layui.use(['form','layer','admin'], function() {
    var form = layui.form,
        layer = layui.layer,
        admin = layui.admin;

    //监听提交
    form.on('submit(btnSubmit)', function() {
        var data = {};
        $.each($('#inputForm').serializeArray(),function () {
            data[this.name] = this.value;
        });
        $.ajax({
            data:JSON.stringify(data),
            type:'POST',
            dataType:'JSON',
            url:'/admin/vehicleInfo/'+ (is_add ? 'save' : 'update'),
            contentType : 'application/json',
            beforeSend:function(){
                layer.load();
            },
            success:function (res) {
                layer.closeAll('loading');
                if (res.success){
                    layer.msg("保存成功");
                }
                admin.putTempData('formOk', true);
                admin.closeThisDialog();
            },
            error:function (e) {
                layer.closeAll('loading');
            }
        })
        return false;
    });
});