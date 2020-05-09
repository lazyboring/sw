var is_add = !id;

layui.use(['form','laytpl','layer','admin'], function() {
    var form = layui.form;
    var layer = layui.layer;
    var laytpl = layui.laytpl;
    var admin = layui.admin;

    if(id != null && id != "" && typeof(id) != "undefined") {
        $("#dept").show();
    }

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
            url:'/admin/driverInfo/'+ (is_add ? 'save' : 'update'),
            contentType : 'application/json',
            beforeSend:function(){
                layer.load();
            },
            success:function (res) {
                layer.closeAll('loading');
                if (res.success){
                    layer.msg("保存成功",{icon: 1});
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

    //获取部门tree数据
    var getDeptData = function (render) {
        $.ajax({
            url:'/wx/depts',
            type:'get',
            dataType:'JSON',
            beforeSend:function(){
                layer.load();
            },
            success:function (res) {
                var deptData = res.data;
                render(deptData)
                layer.closeAll('loading');
            },
            error:function (e) {
                layer.closeAll('loading');
            }
        })
    }
    var loadChildrenFunc = function(name,treeObj,searchNodeLazy){
        $.ajax({
            url:'/wx/getUserByName',
            data:{name:name},
            dataType:'JSON',
            type:'POST' ,
            beforeSend:function(){
                layer.load();
            },
            success:function (res) {
                layer.closeAll('loading');
                if (res.success){
                    var deptUsers = res.data;
                    for (var key in deptUsers){
                        var parentNode = treeObj.getNodesByParam("id", key, null);
                        if (!parentNode[0].isLoadChildren) {
                            treeObj.addNodes(parentNode[0], deptUsers[key]);
                            parentNode[0].isLoadChildren = true;
                        }

                    }
                    searchNodeLazy(name);
                }
            },
            error:function (e) {
                layer.closeAll('loading');
            }
        });
    }
    //给司机姓名输入框绑定点击事件
    $('#driverName').on('click',function() {
        $("#dept").show();
        var getTpl = personnel_tree_tpl.innerHTML;
        laytpl(getTpl).render({}, function(html){
            var callBackFun = function () {
                var treeObj = $.fn.zTree.getZTreeObj("personnel_tree");
                var nodes = treeObj.getCheckedNodes(true);
                if (nodes.length == 0){
                    layer.msg("请选择司机姓名！");
                    return false;
                }
                var treeNode = nodes[0];
                if (treeNode.children){
                    layer.msg("司机姓名不能是部门");
                    return false;
                }

                $("#code").val(treeNode.id);
                $("#driverName").val(treeNode.name);
                $("#photo").val(treeNode.photo);
                $("#driverDept").val(treeNode.deptName);
                layer.close(index);
            };

            var index = openDialog(html,'选择司机人员',{},callBackFun);

            var setting = {
                check: {
                    enable: true,
                    chkStyle: "radio",
                    radioType: "all"
                },
                view: {
                    // 使用ztree自定义高亮时，一定要设置fontCss,setHighlight是自定义高亮方法
                    //fontCss: setHighlight,
                    nameIsHTML: true, //允许name支持html
                    selectedMulti: false
                },
                edit: {
                    enable: false,
                    editNameSelectAll: false
                },
                data: {
                    key: {
                        name: "name"
                    }
                },
                async: {
                    type: "get",
                    enable: true,
                    url: function (treeId, treeNode) {
                        return "/wx/getDriver?deptId="+treeNode.id + "&checked=" + treeNode.checked;
                    }
                } ,
                callback: {
                    beforeExpand: function (treeId, treeNode) {
                        var zTree = $.fn.zTree.getZTreeObj(treeId);
                        if (!treeNode.isLoadChildren){
                            if (treeNode.children.length === 0){
                                zTree.reAsyncChildNodes(treeNode, "refresh", true);
                            }else {
                                //并不是所有的员工都在最后一级的部门下面
                                getUserByDeptId(treeId, treeNode);
                            }
                            treeNode.isLoadChildren = true;
                        }
                    }
                }
            };
            var renderTree = function(data){
                initThisZtree('personnel_tree',data,zTreeSetiingParam(setting));
                fuzzySearch('personnel_tree','#search_personnel',false,true,true,loadChildrenFunc);
            }
            getDeptData(renderTree);
        });
    });

    /**
     * 初始化ztree
     *
     * @param {Object} data
     */
    function initThisZtree(demId,data,setting){
        //初始化ztree三个参数分别是(jQuery对象,ztree设置,树节点数据)
        var treeObj = $.fn.zTree.init($("#"+demId), setting, data);
        //treeObj.expandAll(true);
    }

    //获取部门下的人员
    var getUserByDeptId = function (treeId,treeNode,checked) {
        var url = "/wx/getDriver?deptId="+treeNode.id;
        if (checked){
            url += "&checked=" + checked;
        }
        $.ajax({
            url:url,
            type:'get',
            dataType:'json',
            success:function (res) {
                var zTree = $.fn.zTree.getZTreeObj(treeId);
                zTree.addNodes(treeNode, res);
            }
        })
    }

    //ztree配置
    var zTreeSetiingParam = function (param) {
        var setting = {
            check: {
                enable: true//checkbox
            },
            view: {
                // 使用ztree自定义高亮时，一定要设置fontCss,setHighlight是自定义高亮方法
                //fontCss: setHighlight,
                nameIsHTML: true, //允许name支持html
                selectedMulti: false
            },
            edit: {
                enable: false,
                editNameSelectAll: false
            },
            data: {
                key: {

                }
            }
        };
        $.extend(setting,param);
        return setting;
    }

    //打开弹窗
    var openDialog = function(content,title,params,callBackFun){
        var layerAttribute = {
            type:1
            ,title:title
            ,content: content
            ,shade: 0
            ,btnAlign: 'r'
            ,area: ['280px', '600px']
            ,cancel: function(index, layero){
                //右上角关闭回调
                layer.close(index);
                //return false 开启该代码可禁止点击该按钮关闭
            },
            btn: ['确定', '取消']
            ,yes: function(index, layero){
                //按钮【按钮一】的回调
                callBackFun();
            }
            ,btn2: function(index, layero){
                //按钮【按钮二】的回调
                layer.close(index);
                //return false 开启该代码可禁止点击该按钮关闭
            }
        };
        $.extend(layerAttribute,params)
        var index = layer.open(layerAttribute);
        return index;
    }

    /**
     *
     * @param zTreeId ztree对象的id,不需要#
     * @param searchField 输入框选择器
     * @param isHighLight 是否高亮,默认高亮,传入false禁用
     * @param isExpand 是否展开,默认合拢,传入true展开
     * @param isAsyncChildrenNode 是否加载子节点
     * @param loadChildrenFunc 加载子节点方法
     * @returns
     */
    var fuzzySearch = function(zTreeId, searchField, isHighLight, isExpand, isAsyncChildrenNode, loadChildrenFunc){
        var zTreeObj = $.fn.zTree.getZTreeObj(zTreeId);//获取树对象
        if(!zTreeObj){
            alter("获取树对象失败");
        }
        var nameKey = zTreeObj.setting.data.key.name; //获取name属性的key
        isHighLight = isHighLight===false?false:true;//除直接输入false的情况外,都默认为高亮
        isExpand = isExpand?true:false;
        zTreeObj.setting.view.nameIsHTML = isHighLight;//允许在节点名称中使用html,用于处理高亮
        isAsyncChildrenNode = isAsyncChildrenNode;
        loadChildrenFunc = loadChildrenFunc;
        var metaChar = '[\\[\\]\\\\\^\\$\\.\\|\\?\\*\\+\\(\\)]'; //js正则表达式元字符集
        var rexMeta = new RegExp(metaChar, 'gi');//匹配元字符的正则表达式

        // 过滤ztree显示数据
        function ztreeFilter(zTreeObj,_keywords,callBackFunc) {
            if(!_keywords){
                _keywords =''; //如果为空，赋值空字符串
            }

            // 查找符合条件的叶子节点
            function filterFunc(node) {
                if(node && node.oldname && node.oldname.length>0){
                    node[nameKey] = node.oldname; //如果存在原始名称则恢复原始名称
                }
                //node.highlight = false; //取消高亮
                zTreeObj.updateNode(node); //更新节点让之前对节点所做的修改生效
                if (_keywords.length == 0) {
                    //如果关键字为空,返回true,表示每个节点都显示
                    zTreeObj.showNode(node);
                    //zTreeObj.expandNode(node,isExpand); //关键字为空时是否展开节点
                    return true;
                }
                //节点名称和关键字都用toLowerCase()做小写处理
                if (node[nameKey] && node[nameKey].toLowerCase().indexOf(_keywords.toLowerCase())!=-1) {
                    if(isHighLight){ //如果高亮，对文字进行高亮处理
                        //创建一个新变量newKeywords,不影响_keywords在下一个节点使用
                        //对_keywords中的元字符进行处理,否则无法在replace中使用RegExp
                        var newKeywords = _keywords.replace(rexMeta,function(matchStr){
                            //对元字符做转义处理
                            return '\\' + matchStr;

                        });
                        node.oldname = node[nameKey]; //缓存原有名称用于恢复
                        //为处理过元字符的_keywords创建正则表达式,全局且不分大小写
                        var rexGlobal = new RegExp(newKeywords, 'gi');//'g'代表全局匹配,'i'代表不区分大小写
                        //无法直接使用replace(/substr/g,replacement)方法,所以使用RegExp
                        node[nameKey] = node.oldname.replace(rexGlobal, function(originalText){
                            //将所有匹配的子串加上高亮效果
                            var highLightText =
                                '<span style="color: whitesmoke;background-color: darkred;">'
                                + originalText
                                +'</span>';
                            return  highLightText;
                        });
                        //================================================//
                        //node.highlight用于高亮整个节点
                        //配合setHighlight方法和setting中view属性的fontCss
                        //因为有了关键字高亮处理,所以不再进行相关设置
                        //node.highlight = true;
                        //================================================//
                        zTreeObj.updateNode(node); //update让更名和高亮生效
                    }
                    zTreeObj.showNode(node);//显示符合条件的节点
                    return true; //带有关键字的节点不隐藏
                }

                zTreeObj.hideNode(node); // 隐藏不符合要求的节点
                return false; //不符合返回false
            }
            var nodesShow = zTreeObj.getNodesByFilter(filterFunc); //获取匹配关键字的节点
            processShowNodes(nodesShow, _keywords);//对获取的节点进行二次处理
        }

        /**
         * 对符合条件的节点做二次处理
         */
        function processShowNodes(nodesShow,_keywords){
            if(nodesShow && nodesShow.length>0){
                //关键字不为空时对关键字节点的祖先节点进行二次处理
                if(_keywords.length>0){
                    $.each(nodesShow, function(n,obj){
                        var pathOfOne = obj.getPath();//向上追溯,获取节点的所有祖先节点(包括自己)
                        if(pathOfOne && pathOfOne.length>0){ //对path中的每个节点进行操作
                            // i < pathOfOne.length-1, 对节点本身不再操作
                            for(var i=0;i<pathOfOne.length-1;i++){
                                zTreeObj.showNode(pathOfOne[i]); //显示节点
                                zTreeObj.expandNode(pathOfOne[i],true); //展开节点
                            }
                        }
                    });
                }else{ //关键字为空则显示所有节点, 此时展开根节点
                    var rootNodes = zTreeObj.getNodesByParam('level','0');//获得所有根节点
                    /*$.each(rootNodes,function(n,obj){
                        zTreeObj.expandNode(obj,true); //展开所有根节点
                    });*/
                }
            }
        }

        //监听关键字input输入框文字变化事件
        $(searchField).bind('input propertychange', function() {
            var _keywords = $(this).val();
            if (isAsyncChildrenNode && _keywords){
                loadChildrenFunc(_keywords,zTreeObj,searchNodeLazy);
            }else {
                searchNodeLazy(_keywords); //调用延时处理
            }
        });

        var timeoutId = null;
        // 有输入后定时执行一次，如果上次的输入还没有被执行，那么就取消上一次的执行
        function searchNodeLazy(_keywords) {
            if (timeoutId) { //如果不为空,结束任务
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(function() {
                ztreeFilter(zTreeObj,_keywords);    //延时执行筛选方法
                $(searchField).focus();//输入框重新获取焦点
            }, 500);
        }
    }
});