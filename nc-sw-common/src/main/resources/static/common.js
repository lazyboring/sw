// layui配置
layui.config({
    base: ctxPath + '/modules/'
}).extend({
    ax: 'ax/ax',
    kf: 'kf/kf',
    bodyTab: 'bodyTab/bodyTab',
    tableChild: 'tableChild/tableChild',
    treeGrid:'treeGrid/treeGrid',
    eleTree:'eleTree/eleTree',
    citypicker: 'city-picker/city-picker',
    step: 'step-lay/step'
}).use(['admin'], function () {
    var $ = layui.$;
    var admin = layui.admin;

    // 单标签模式需要根据子页面的地址联动侧边栏的选中，用于适配浏览器前进后退按钮
    if (window != top && top.layui && top.layui.index && !top.layui.index.pageTabs) {
        top.layui.admin.activeNav(location.href.substring(ctxPath.length));
    }

    // 移除loading动画
    setTimeout(function () {
        admin.removeLoading();
    }, window == top ? 300 : 150);

});



// console
window.console = window.console || {
    log : function(){}
};



// Kf
window.KfJs = {};
// 对话框
KfJs.info = function (info) {
    top.layer.msg(info, {icon: 6});
};
KfJs.success = function (info) {
    top.layer.msg(info, {icon: 1});
};
KfJs.error = function (info) {
    top.layer.alert(info, {icon: 2, title: '错误'});
};
KfJs.confirm = function (tip, ensure) {
    top.layer.confirm(tip, {
        skin: 'layui-layer-admin'
    }, function () {
        ensure();
    });
};
// 下划线转换驼峰
KfJs.toHump = function (name) {
    return name.replace(/\_(\w)/g, function(all, letter){
        return letter.toUpperCase();
    });
};
// 驼峰转换下划线
KfJs.toLine = function (name) {
    return name.replace(/([A-Z])/g,"_$1").toLowerCase();
};
// 转换为日期
KfJs.strToDate = function (date) {
    return new Date(date.replace(/-/g, "/"));
};
// 日期加减
KfJs.addDate = function (date, dadd) {
    date = date.valueOf();
    date = date + dadd * 24 * 60 * 60 * 1000;
    return new Date(date);
};
KfJs.toDecimal = function (value, digits) {
    if (!value) {
        return '0';
    }
    var n = Number(value);
    if (isNaN(n)) {
        return '0';
    }
    return parseFloat(n.toFixed(digits === undefined ? 2 : digits));
};
// 图片预览
KfJs.openImage = function(obj, opt) {
    this._opt = $.extend(true, {
        heightScale: 0.6
    }, opt);
    var scale = obj.naturalWidth / obj.naturalHeight;
    var vh = $(window).height() * this._opt.heightScale;
    layer.open({
        type: 1,
        title: false,
        area: [scale * vh + 'px' , vh + 'px'],
        shadeClose: true,
        content: '<img style="width: 100%;" src="' + $(obj).attr('src') + '"/>'
    });
};



// jQuery扩展
$.fn.extend({
    // input元素自动格式化数字
    fixNumber: function() {
        $(this).blur(function () {
            $(this).val(KfJs.toDecimal($(this).val(), $(this).data('fix-digits')));
        });
    }
});



// 初始化
$(document).ready(function() {
    // 初始化fixNumber
    $('.fixNumber').fixNumber();
    // 初始化图片预览
    $('img.open-image').on('click', function () {
        KfJs.openImage(this);
    });

});

