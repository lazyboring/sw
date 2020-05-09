layui.use(['form','laytpl','layer','element'], function() {
    var form = layui.form,
        laytpl = layui.laytpl,
        layer = layui.layer ,
        element = layui.element;

    //绑定可见范围按钮点击事件
    $('#visible_dept_btn').on('click',function(){

        var getTpl = dept_tree_tpl.innerHTML;
        laytpl(getTpl).render({}, function(html){
            var layerAttribute = {
                area: ['500px', '600px']
            }
            var callBackFun = function () {
                var visibleDeptData = [];
                for (var i = 0 ;i < $('.selected-dept').length ; i++){
                    visibleDeptData.push({deptCode:$($('.selected-dept')[i]).data('id'),
                        deptName:$($('.selected-dept')[i]).data('name')});
                }
                renderTpl(visible_dept_tpl,'visible_dept_div',{list:visibleDeptData},false);
                layer.close(index);
            }
            var index = openDialog(html,'选择可见部门',layerAttribute,callBackFun);
            var zTreeOnCheck = function (event, treeId, treeNode) {
                if (treeNode.checked){
                    renderTpl(select_dept_tpl,'select_dept',treeNode,true);
                } else {
                    $('div').remove('#select_dept_'+treeNode.id);
                }
            }
            var treeCheckedSelectDept = function () {
                var selectedDeptCodes = $('.deptCode');
                var treeObj = $.fn.zTree.getZTreeObj("dept_tree");
                for (var i =0 ;i < selectedDeptCodes.length ;i++){
                    var deptCode = selectedDeptCodes[i].value;
                    var node = treeObj.getNodesByParam("id", deptCode, null);
                    //treeObj.setChkDisabled(node[0], false);
                    treeObj.checkNode(node[0], true, false, true);

                }
            }
            var renderTree = function(treeNode){
                initThisZtree('dept_tree',treeNode,zTreeSetiingParam({check:{enable: true,chkboxType:{ "Y" : "", "N" : ""}},callback: {
                        onCheck: zTreeOnCheck
                    }}));
                fuzzySearch('dept_tree','#search_dept',false,true);
                setTimeout(treeCheckedSelectDept(),500);
            }
            getDeptData(renderTree);


        });
    });
    //获取最后一级的部门
    var getLastDept = function (treeId,treeNode,checked) {
        var treeObj = $.fn.zTree.getZTreeObj(treeId);
        treeNode.checked = checked;
        treeObj.updateNode(treeNode);
        if (!treeNode.children || treeNode.children.length == 0){
            if (treeNode.checked){
                renderTpl(select_dept_tpl,'select_dept',treeNode,true);
            } else {
                $('div').remove('#select_dept_'+treeNode.id);
            }
        } else {
            for (var i = 0 ;i < treeNode.children.length ;i++){
                getLastDept(treeId,treeNode.children[i],checked);
            }
        }
    }
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

    //给移除节点图标绑定点击事件
    $(document).on("click", ".rm-img", function () {
        var parentNode = $(this).parent();
        var parentNodeId = parentNode.attr('id');
        var parentNodeClass = parentNode.attr('class');
        if (parentNodeClass === 'approver-content-dev'){
            var lineId = parentNode.next().attr('id');
            if (lineId){
                $('div').remove('#' + lineId);
            }
        }
        $('div').remove('#'+ parentNodeId);
    })
    $(document).on("click", ".delete-img", function () {
        var parentNode = $(this).parent().parent();
        var parentNodeId = parentNode.attr('id');
        $('div').remove('#'+ parentNodeId);
        var treeObj = $.fn.zTree.getZTreeObj("dept_tree");
        var node = treeObj.getNodesByParam("id", parentNode.data('id'), null);
        treeObj.checkNode(node[0], false, true);
    })
    $(document).on("click", ".person-in-charge-rm-img", function () {
        var parentNode = $(this).parent();
        var tplData = {
            deptName:parentNode.data('deptname'),
            deptCode:parentNode.data('deptcode'),
            approverCode:null
        };
        renderTpl(dialog_person_in_charge_tpl,'person_in_charge_tpl_div',tplData,false);
        renderTpl(dialog_selected_person_in_charge_tpl,'person_in_charge_'+tplData.deptCode,tplData,false);
    })
    //给添加审批人图标绑定点击事件
    var approver_index = 0;
    $('#approver_add').on('click',function(){
        var getTpl = personnel_tree_tpl.innerHTML;
        laytpl(getTpl).render({}, function(html){
            var callBackFun = function () {
                var treeObj = $.fn.zTree.getZTreeObj("personnel_tree");
                var nodes = treeObj.getCheckedNodes(true);
                if (nodes.length == 0){
                    layer.msg("请选择审批人！");
                    return false;
                }
                var treeNode = nodes[0];
                if (treeNode.children){
                    layer.msg("审批人不能是部门");
                    return false;
                }
                approver_index = $('#approver_div').find('.approver-content-dev').length;
                if (approver_index !== 0){
                    approver_index++;
                }
                treeNode['step'] = approver_index;
                treeNode['approverCode'] = treeNode.id;
                treeNode['approverName'] = treeNode.name;
                treeNode['approverPhoto'] = treeNode.photo;
                treeNode['deptCode'] = treeNode.parentId;
                renderTpl(approver_tpl,'approver_div',treeNode,true);
                layer.close(index);
            };

            var index = openDialog(html,'选择审批人',{},callBackFun);

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
                        return "/wx/getUser?deptId="+treeNode.id + "&checked=" + treeNode.checked;
                    }
                } ,
                callback: {
                    beforeExpand: function (treeId, treeNode) {
                        var zTree = $.fn.zTree.getZTreeObj(treeId);
                        if (!treeNode.isLoadChildren){
                            if (treeNode.children.length === 0){
                                zTree.reAsyncChildNodes(treeNode, "refresh", true);
                            }else {
                                //并不是所以的员工都在最后一级的部门下面
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
    
    //给添加部门负责人图标绑定点击事件
    $('#person_in_charge_add').on('click',function(){

        var getSelectPersonInCharge = function () {
            var personInChargeEl = $('.person-in-charge-dev');
            for (var i = 0 ;i < personInChargeEl.length ;i++){
                var data = {};
                var inputEl = $(personInChargeEl[i]).find('input');
                for (var j = 0 ;j < inputEl.length ;j++){
                    var name = $(inputEl[j]).attr("name");
                    var value = inputEl[j].value;
                    data[name.split(".")[1]] = value;
                }
                if (!$.isEmptyObject(data)){
                    renderTpl(dialog_selected_person_in_charge_tpl,'person_in_charge_'+data.deptCode,data,false);
                }
            }

        }
        //获取部门负责人部门数据跟负责人数据
        var getDeptPersonInCharge = function (render) {
            $.ajax({
                type : 'get',
                url : '/wx/depts',
                dataType : 'json',
                beforeSend:function(){
                    layer.load();
                },
                success:function (res) {
                    var data = res.data;
                    render(data);
                    layer.closeAll('loading');
                } ,
                error:function (e) {
                    layer.closeAll('loading');
                }
            });
        }
        var getTpl = person_in_charge_dialog_tpl.innerHTML;
        laytpl(getTpl).render({}, function(html){
            var callBackFun = function () {
                var deptPersonInChargeEl = $('.dept-person-in-charge');
                var deptPersonInChargeDataArr = [];
                for (var i = 0 ;i < deptPersonInChargeEl.length ;i++){
                    var data = {};
                    var approverCode = $($('.dept-person-in-charge')[i]).find('input[name="approverCode"]').val();
                    if (approverCode){
                        data['approverCode'] = approverCode;
                        data['approverName'] = $($('.dept-person-in-charge')[i]).find('input[name="approverName"]').val();
                        data['approverPhoto'] = $($('.dept-person-in-charge')[i]).find('input[name="approverPhoto"]').val();
                        data['deptCode'] = $($('.dept-person-in-charge')[i]).find('input[name="deptCode"]').val();
                    }
                    if (!$.isEmptyObject(data)){
                        deptPersonInChargeDataArr.push(data);
                    }

                }
                renderTpl(person_in_charge_tpl,'person_in_charge_div',{list:deptPersonInChargeDataArr},false);
                layer.close(index);
            }
            var layerAttribute = {
                area: ['500px', '600px']
            }
            var index = openDialog(html,'选择部门负责人',layerAttribute,callBackFun);
            var render = function(data){
                renderTpl(dept_tree_list_tpl,'dept_tree_list_dev',{list:data},false);
                getSelectPersonInCharge();

            }
            getDeptPersonInCharge(render);
        });

    });
    //获取部门下的人员
    var getUserByDeptId = function (treeId,treeNode,checked) {
        var url = "/wx/getUser?deptId="+treeNode.id;
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
    //绑定选择部门负责人的按钮点击事件
    $(document).on("click", "#person_in_charge_ad", function () {
        var deptName = $(this).data('deptname');
        var deptCpde = $(this).data('deptcode')
        var getTpl = select_person_in_charge_tree_tpl.innerHTML;
        laytpl(getTpl).render({}, function(html){
            var callBackFun = function () {
                var treeObj = $.fn.zTree.getZTreeObj('select_person_in_charge_tree');
                var nodes = treeObj.getCheckedNodes(true);
                if (nodes.length == 0){
                    layer.msg("请选择部门负责人！");
                    return false;
                }
                if (nodes[0].type === 'dept'){
                    layer.msg("部门负责人不能是部门！");
                    return false;
                }
                var allNodes = treeObj.getNodes();
                var personInChargeData = {
                    deptName:allNodes[0].name,
                    deptCode:allNodes[0].id,
                    approverCode:nodes[0].id,
                    approverPhoto:nodes[0].photo,
                    approverName:nodes[0].name,

                }
                renderTpl(dialog_person_in_charge_tpl,'person_in_charge_tpl_div',personInChargeData,false);
                renderTpl(dialog_selected_person_in_charge_tpl,'person_in_charge_'+personInChargeData.deptCode,personInChargeData,false);
                layer.close(index);
            }


            var index = openDialog(html,deptName,{},callBackFun);

            var renderTree = function (data) {
                var treeSetting = {
                    check: {
                        enable: true,
                        chkStyle: "radio",
                        radioType: "all"
                    },
                    async: {
                        type: "get",
                        enable: true,
                        url: function (treeId, treeNode) {
                            return "/wx/getUser?deptId="+treeNode.id;
                        }
                    } ,
                    callback: {
                        beforeExpand: function (treeId, treeNode) {
                            var zTree = $.fn.zTree.getZTreeObj(treeId);
                            if (!treeNode.isLoadChildren){
                                if (treeNode.children.length === 0){
                                    zTree.reAsyncChildNodes(treeNode, "refresh", true);
                                }else {
                                    //并不是所以的员工都在最后一级的部门下面
                                    getUserByDeptId(treeId, treeNode);
                                }
                                treeNode.isLoadChildren = true;
                            }
                        }
                    }
                }
                initThisZtree('select_person_in_charge_tree',data,zTreeSetiingParam(treeSetting));
            }
            $.ajax({
                type:'POST',
                dataType:'JSON',
                data:{deptId:deptCpde},
                url:'/wx/getDeptsByParentDept',
                beforeSend:function(){
                    layer.load();
                },
                error:function (e) {
                    layer.closeAll('loading');
                },
                success:function (res) {
                    renderTree(res.data);
                    layer.closeAll('loading');
                }
            })

        });
    });
    //绑定添加部门负责人弹窗中的部门点击事件
    $(document).on("click", ".two-level-dept", function () {
        var deptId = $(this).data('id');
        var deptName = $(this).data('name');
        var data = {
            deptName:deptName,
            deptCode:deptId,
            approverCode:$('#approver_code_'+deptId).val()?$('#approver_code_'+deptId).val():null,
            approverName:$('#approver_name_'+deptId).val(),
            approverPhoto:$('#approver_photo_'+deptId).val()
        };
        renderTpl(dialog_person_in_charge_tpl,'person_in_charge_tpl_div',data,false);
    });
    //给添加抄送人图标绑定点击事件
    var cc_index = 0;
    $('#cc_add').on('click',function(){
        var getTpl = personnel_tree_tpl.innerHTML;
        var treeCheckedSelectCc = function () {
            var selectedDeptCodes = $('.cc-dept-code');
            var treeObj = $.fn.zTree.getZTreeObj("personnel_tree");
            for (var i =0 ;i < selectedDeptCodes.length ;i++){
                var deptCode = selectedDeptCodes[i].value;
                expandParentNode(treeObj,deptCode);

            }
        }
        laytpl(getTpl).render({}, function(html){
            var callBackFun = function () {
                var treeObj = $.fn.zTree.getZTreeObj("personnel_tree");
                var nodes = treeObj.getCheckedNodes(true);
                if (nodes.length == 0){
                    layer.msg("请选择抄送人！");
                    return false;
                }
                var userArr = [];
                for (var i = 0 ;i < nodes.length ;i++){
                    var treeNode = nodes[i];
                    if (treeNode.type === 'user') {
                        var data = {ccCode:treeNode.id,ccName:treeNode.name,
                            ccPhoto:treeNode.photo,deptCode:treeNode.parentId};
                        userArr.push(data);
                    }
                }
                renderTpl(cc_tpl,'cc_div',{list:userArr},false);
                layer.close(index);
            };
            var index = openDialog(html,'选择抄送人',{},callBackFun);
            var render = function(data){
                initThisZtree('personnel_tree',data,zTreeSetiingParam(userCheckBoxSetting('cc')));
                fuzzySearch('personnel_tree','#search_personnel',false,true,true,loadChildrenFunc);
                treeCheckedSelectCc();
            }
            getDeptData(render);
        });

    });
    //展开父节点（将选中的用户回显到用户树上）
    var expandParentNode = function(treeObj, id){
        var nodes = treeObj.getNodesByParam("id", id, null);
        if (nodes.length != 0){
            var parentId = nodes[0].parentId;
            expandParentNode(treeObj,parentId);
        }
        treeObj.expandNode(nodes[0], true, false , false, true);
    }
    //添加管理者图标绑定点击事件
    $('#meeting_admin_add').on('click',function () {
        var getTpl = personnel_tree_tpl.innerHTML;
        var treeCheckedSelectAdmin = function () {
            var selectedDeptCodes = $('.admin-dept-code');
            var treeObj = $.fn.zTree.getZTreeObj("personnel_tree");
            for (var i =0 ;i < selectedDeptCodes.length ;i++){
                var deptCode = selectedDeptCodes[i].value;
                expandParentNode(treeObj,deptCode);
            }
        }
        laytpl(getTpl).render({}, function(html){
            var callBackFun = function () {
                var treeObj = $.fn.zTree.getZTreeObj('personnel_tree');
                var nodes = treeObj.getCheckedNodes(true);
                if (nodes.length == 0){
                    layer.msg("请选择管理者！");
                    return false;
                }
                var userArr = [];
                for (var i = 0 ;i < nodes.length ;i++){
                    var treeNode = nodes[i];
                    var parentNode =  treeNode.getParentNode();
                    if (treeNode.type === 'user') {
                        var data = {adminCode:treeNode.id,adminName:treeNode.name,
                            adminPhoto:treeNode.photo,deptCode:treeNode.parentId,deptName:parentNode.name};
                        userArr.push(data);
                    }
                }
                renderTpl(admin_tpl,'meeting_admin_div',{list:userArr},false);
                layer.close(index);
            }
            var index = openDialog(html,'选择管理者',{},callBackFun);


            var render = function(data){
                initThisZtree('personnel_tree',data,zTreeSetiingParam(userCheckBoxSetting('admin')));
                fuzzySearch('personnel_tree','#search_personnel',false,true,true,loadChildrenFunc);
                treeCheckedSelectAdmin();
            }
            getDeptData(render);

        });
    })
    //用户checkbox选中操作
    var userCheckOption = function (treeId,treeNode,checked) {
        var treeObj = $.fn.zTree.getZTreeObj(treeId);
        treeNode.checked = checked;
        treeObj.updateNode(treeNode);
        if (!treeNode.children || treeNode.children.length == 0){
            if (treeNode.checked && !treeNode.isLoadChildren){
                treeObj.reAsyncChildNodes(treeNode, "refresh", true);
            }
        } else {
            //并不是所以的员工都在最后一级的部门下面
            if (!treeNode.isLoadChildren){
                getUserByDeptId(treeId, treeNode,checked);
            }
            for (var i = 0 ;i < treeNode.children.length ;i++){
                userCheckOption(treeId,treeNode.children[i],checked);
            }
        }
        treeNode.isLoadChildren = true;
    }
    //用户 checkbox设置
    var userCheckBoxSetting = function(optionFlag){
        var selectedNode = function(treeId, treeNode) {
            var selectedCodes ;
            if (optionFlag === 'admin'){
                selectedCodes = $('.admin-code');
            } else if (optionFlag === 'cc'){
                selectedCodes = $('.cc-code');
            }
            var treeObj = $.fn.zTree.getZTreeObj(treeId);
            for (var i =0 ;i < selectedCodes.length ;i++){
                var adminCode = selectedCodes[i].value;
                var userNodes = treeObj.getNodesByParam("id", adminCode, treeNode);
                if (userNodes.length > 0){
                    treeObj.checkNode(userNodes[0], true, true);
                }
            }
        }
        var setting = {
            check: {
                enable: true,
                chkStyle: "checkbox"
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
                    return "/wx/getUser?deptId="+treeNode.id + "&checked=" + treeNode.checked;
                }
            } ,
            callback: {
                beforeExpand: function (treeId, treeNode) {
                    var zTree = $.fn.zTree.getZTreeObj(treeId);
                    if (!treeNode.isLoadChildren){
                        if (treeNode.children.length === 0){
                            //getUserByDeptId(treeId, treeNode);
                            zTree.reAsyncChildNodes(treeNode, "refresh", true, true);
                        }else {
                            //并不是所以的员工都在最后一级的部门下面
                            getUserByDeptId(treeId, treeNode);
                        }
                        treeNode.isLoadChildren = true;
                    }
                },
                onCheck: function (event, treeId, treeNode) {
                    userCheckOption(treeId,treeNode,treeNode.checked);
                },
                onExpand:function (event, treeId, treeNode) {
                    setTimeout(function () {
                        selectedNode(treeId, treeNode);
                    },500);
                },
                onAsyncSuccess:function (event, treeId, treeNode, msg) {
                    selectedNode(treeId, treeNode);
                }
            }
        };
        return setting;
    }
    //监听提交
    form.on('submit(formSubmit)', function(data){
        var type = data.field.workflowType;
        //
        var data = {};
        $.each($('#rule_form').serializeArray(),function () {
            if (this.name.indexOf('depts') >= 0 || this.name.indexOf('copyPeoples') >= 0
                || this.name.indexOf('admins') >= 0 || this.name.indexOf('approvers') >= 0
                || this.name.indexOf('personInCharges') >= 0){
                var key = this.name.split('[')[0];
                var index = 0;
                //var index = Number(this.name.split('[')[1].split(']')[0]);
                var parentClass = "";
                if (this.name.indexOf('approvers') >= 0){
                    parentClass = 'approver-content-dev';
                }else if (this.name.indexOf('depts') >= 0){
                    parentClass = 'visible-dept-content-dev';
                }else if (this.name.indexOf('copyPeoples') >= 0){
                    parentClass = 'cc-content-dev';
                }else if (this.name.indexOf('admins') >= 0){
                    parentClass = 'admin-content-dev';
                }else if (this.name.indexOf('personInCharges') >= 0){
                    parentClass = 'person-in-charge-dev';
                }
                var index = $('.'+ parentClass).index($("input[name='"+this.name+"']").parent());
                if ( !data[key]){
                    var dt = {};
                    dt[this.name.split('.')[1]] = this.value;
                    dt['step'] = index;
                    data[key] = [dt];
                }else {
                    var dataArr = data[key];
                    if ($.isEmptyObject(dataArr[index])) {
                        var dt = {};
                        dt[this.name.split('.')[1]] = this.value;
                        data[key].push(dt);
                    }else {
                        dataArr[index][this.name.split('.')[1]] = this.value;
                    }
                }

            } else  {
                data[this.name] = this.value;
            }
        });
        if (!data['workflowType']){//审批类型
            layer.msg("请选择审批类型");
            return false;
        }
        /*if (!data['depts'] && type != "3"){//可见范围
            layer.msg("请选择可见范围");
            return false;
        }*/
        if (data['workflowType'] !== '1'){//其他审批
            if (!data['personInCharges']){//部门负责人
                layer.msg("请选择部门负责人");
                return false;
            }
        }
        if (!data['approvers']){//审批人
            layer.msg("请选择审批人");
            return false;
        }
        if (!data['copyPeoples']){//抄送者
            layer.msg("请选择抄送者");
            return false;
        }
        if (data['workflowType'] === '1'){//会议预定
            if (!data['admins']){//会议管理者
                layer.msg("请选择会议管理者");
                return false;
            }
        }

        $.ajax({
            data:JSON.stringify(data),
            type:'POST',
            dataType:'JSON',
            url:'/admin/workflowRule/saveRule',
            contentType : 'application/json',
            beforeSend:function(){
                layer.load();
            },
            success:function (res) {
                layer.closeAll('loading');
                if (res.success){
                    layer.msg("保存成功");
                }
            },
            error:function (e) {
                layer.closeAll('loading');
            }
        })
        return false;
    });
    //审批类型下拉列表事件
    form.on('select(slectWorkflowType)', function(data){
        var value = data.value;
        $('#chargeAirConditioningCost').hide();
        if(value === '3'){
            $('.dept-visible').hide();
        }else{
            $('.dept-visible').show();
        }
        if (value === '1' ) {
            $('#admin_div').show();
            $('#person_in_charge').hide();
            $('#chargeAirConditioningCost').show();
        }else if (value === '3'){
            $('#admin_div').show();
            $('#person_in_charge').show();
        } else{
            $('#admin_div').hide();
            $('#person_in_charge').show();
        }
        $.ajax({
            url:'/admin/workflowRule/findWorkflowRule',
            data:{workflowType:value},
            dataType:'JSON',
            type:'POST',
            beforeSend:function(){
                layer.load();
            },
            success:function (res) {
                layer.closeAll('loading');
                if (res.success){
                    var data = res.data;
                    form.val('workflowTypeForm', {
                        "ccNotification": data.ccNotification // "name": "value"
                        ,"revocationAuthority": data.revocationAuthority
                    });
                    //可见范围
                    renderTpl(visible_dept_tpl,'visible_dept_div',{list:data.depts},false);
                    //审核者
                    $('#approver_div').html('');
                    if (data.approvers){
                        for(var i = 0 ;i < data.approvers.length ;i++){
                            approver_index = i;
                            renderTpl(approver_tpl,'approver_div',data.approvers[i],true);
                        }
                    }
                    //抄送者
                    $('#cc_div').html('');
                    if (data.copyPeoples){
                        renderTpl(cc_tpl,'cc_div',{list:data.copyPeoples},false);
                    }
                    //管理员
                    $('#meeting_admin_div').html('');
                    if (data.admins){
                        renderTpl(admin_tpl,'meeting_admin_div',{list:data.admins},false);
                    }
                    //部门负责人
                    $('#person_in_charge_div').html('');
                    if (data.personInCharges){
                        renderTpl(person_in_charge_tpl,'person_in_charge_div',{list:data.personInCharges},false);
                    }


                }
            },
            error:function (e) {
                layer.closeAll('loading');
            }
        })
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
    //渲染模板
    var renderTpl = function (tpl,domId,data,isAppend) {
        //审批者
        var getTpl1 = tpl.innerHTML;
        laytpl(getTpl1).render(data, function(html){
            if (isAppend){
                $('#'+domId).append(html);
            } else {
                $('#'+domId).html(html);
            }
        });
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