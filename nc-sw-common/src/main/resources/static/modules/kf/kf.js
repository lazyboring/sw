//封装常用功能
layui.define(['jquery', 'admin', 'table', 'ax'], function (exports) {
    var $ = layui.$;
    var admin = layui.admin;
    var table = layui.table;
    var $ax = layui.ax;

    var kf = {};

    // 表格封装
    kf.table = function (opt, tableOpt, dialogOpt) {
        // 参数
        this._opt = $.extend(true, {
            tableId: 'dataTable',           // 表格元素Id
            modalName: '',                  // 模块名字，显示在对话框标题，如“用户”
            tipColumnName: 'name',          // 用于界面提示的取值，如“删除”确认框
            editMode: 'dialog',             // 编辑模式：dialog=弹出对话框，forward=跳转页面
            addUrl: '',                     // 新增页面url
            updateUrl: '',                  // 编辑页面url
            delUrl: '',                     // 删除url
            searchFormId: 'inputForm',
            btnSearchId: 'btnSearch',
            btnAddId: 'btnAdd',
            btnExportId: 'btnExport',
            tablebarFun: {},                // 表格中列操作按钮，edit、delete不需要配置
            toolbarFun: {}                  // 工具栏按钮，add、edit不需要配置
        }, opt);
        // table参数
        this._tableOpt = $.extend(true, {
            elem: '#' + this._opt.tableId,
            url: '',
            cols: [],
            toolbar: '#toolbar',
            defaultToolbar: ['filter'],
            height: "full-158",
            page: true,
            cellMinWidth: 40,
            autoSort: false,
            where: this.getWhere()
        }, tableOpt);
        // 对话框参数
        this._dialogOpt = $.extend(true, {}, dialogOpt);

        this.tableObj = null;
    };

    kf.table.prototype = {
        init: function () {
            var that = this;
            var opt = this._opt;
            var tableOpt = this._tableOpt;

            // 初始化表格
            that.tableObj = table.render(tableOpt);

            // 绑定按钮事件
            opt.btnSearchId && $('#' + opt.btnSearchId).bind('click', function () {
                that.search();
            });
            opt.btnAddId && $('#' + opt.btnAddId).bind('click', function () {
                that.add();
            });
            opt.btnExportId && $('#' + opt.btnExportId).bind('click', function () {
                that.export();
            });

            // 排序
            table.on('sort(' + opt.tableId + ')', function(obj){
                table.reload(opt.tableId, {
                    initSort: obj,
                    where: {
                        sort: KfJs.toLine(obj.field),
                        order: obj.type
                    }
                });
            });
            // 绑定表格中列操作按钮事件
            table.on('tool(' + opt.tableId + ')', function (obj) {
                var data = obj.data;
                var layEvent = obj.event;

                if (layEvent === 'edit') {
                    that.edit(data);
                } else if (layEvent === 'delete') {
                    that.delete(data);
                } else {
                    $.each(that._opt.tablebarFun, function(k, fun){
                        if (obj.event === k) {
                            fun(data);
                        }
                    });
                }
            });
            // 表头工具栏事件
            table.on('toolbar(' + opt.tableId + ')', function(obj){
                var checkStatus = table.checkStatus(obj.config.id);
                if (obj.event == 'add') {
                    that.add();
                } else if (obj.event == 'edit') {
                    if (checkStatus.data.length == 0) {
                        KfJs.info('请选择要操作的数据！');
                        return;
                    }
                    if (checkStatus.data.length > 1) {
                        KfJs.info('只能选择一条数据！');
                        return;
                    }
                    that.edit(checkStatus.data[0]);
                } else {
                    $.each(that._opt.toolbarFun, function(k, fun){
                        if (obj.event === k) {
                            fun(checkStatus);
                        }
                    });
                }
            });
        },
        reload: function () {
            table.reload(this._opt.tableId);
        },
        getWhere: function() {
            var data = $('#' + this._opt.searchFormId).serializeArray();
            var obj = {};
            $.each(data, function (i, v) {
                obj[v.name] = v.value;
            });
            return obj;
        },
        search: function () {
            table.reload(this._opt.tableId, {where: this.getWhere()});
        },
        add: function () {
            var that = this;
            if (that._isDialogMode()) {
                admin.putTempData('formOk', false);
                var opt = $.extend({
                    type: 2,
                    title: '添加' + that._opt.modalName,
                    content: that._opt.addUrl,
                    end: function () {
                        admin.getTempData('formOk') && that.reload();
                    }
                }, that._dialogOpt);
                // top.layui.admin.open(opt);
                layui.layer.open(opt);
            } else {
                location.href = that._opt.addUrl;
            }
        },
        edit: function (data) {
            var that = this;
            if (that._isDialogMode()) {
                admin.putTempData('formOk', false);
                var opt = $.extend({
                    type: 2,
                    title: '修改' + that._opt.modalName,
                    content: that._opt.updateUrl.replace("{id}", data.id).replace("{systemId}",data.systemId),
                    end: function () {
                        admin.getTempData('formOk') && that.reload();
                    }
                }, that._dialogOpt);
                layui.layer.open(opt);
            } else {
                location.href = that._opt.updateUrl.replace("{id}", data.id).replace("{systemId}",data.systemId);
            }
        },
        delete: function (data) {
            var that = this;
            var operation = function () {
                var ajax = new $ax(that._opt.delUrl, function () {
                    KfJs.success("删除成功!");
                    table.reload(that._opt.tableId);
                }, function (data) {
                    KfJs.error("删除失败!" + data.responseJSON.message + "!");
                });
                ajax.set("id", data.id);
                ajax.set("systemId", data.systemId);
                ajax.start();
            };
            KfJs.confirm("确认删除"+ that._opt.modalName + "“" + data[that._opt.tipColumnName] + "”吗？", operation);
        },
        export: function () {
            var checkRows = table.checkStatus(this._opt.tableId);
            if (checkRows.data.length === 0) {
                KfJs.error("请选择要导出的数据");
            } else {
                table.exportFile(this._opt.tableId, checkRows.data, 'xls');
            }
        },
        _isDialogMode: function () {
            return this._opt.editMode === 'dialog';
        }
    };

    exports('kf', kf);
});