// 编辑器内上传文件
uploadFile = function ($el, files) {
    var formData = new FormData();
    formData.append("file", files[0]);
    $.ajax({
        data: formData,
        type: "POST",
        url: ctxPath + "/common/file/upload?dir=editor",
        cache: false,
        contentType: false,
        processData: false,
        dataType: "json",
        success: function (data) {
            if (!data.success) {
                KfJs.error('上传失败：' + data.message);
            }
            if (data.success) {
                $el.summernote('insertImage', ctxPath + '/common/file/show?path=' + data.data);
            }
        },
        error: function () {
            KfJs.error("上传失败");
        }
    });
};

// 选择职位对话框
function openSelectPosition(opt, callback) {
    var option = $.extend({
        multiSelect: false
    }, opt);

    layer.open({
        type: 2,
        title: '职位选择',
        area: ['800px', '600px'],
        content: ctxPath + '/system/position/select?' + $.param(option),
        btn: ['确定', '取消'],
        yes: function(index, layero){
            var obj = $('#layui-layer-iframe' + index)[0].contentWindow.selectData();
            if (obj.ok) {
                callback && callback(obj.data);
                layer.close(index);
            }
        }
    });
}

