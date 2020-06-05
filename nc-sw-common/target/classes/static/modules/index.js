var $,tab,dataStr,layer;
layui.use(['bodyTab','form','element','layer','jquery'],function(){
	var element = layui.element;
		$ = layui.$;
    	layer = parent.layer === undefined ? layui.layer : top.layer;
		tab = layui.bodyTab({
			openTabNum : "50"  //最大可打开窗口数量
		});

	//隐藏左侧导航
	$(".hideMenu").click(function(){
		if($(".topLevelMenus li.layui-this a").data("url")){
			layer.msg("此栏目状态下左侧菜单不可展开");  //主要为了避免左侧显示的内容与顶部菜单不匹配
			return false;
		}
		$(".layui-layout-admin").toggleClass("showMenu");
		//渲染顶部窗口
		tab.tabMove();
	});

	// 添加新窗口
	$("body").on("click",".layui-nav .layui-nav-item a:not('.mobileTopLevelMenus .layui-nav-item a')",function(){
		//如果不存在子级
		if($(this).siblings().length === 0){
			addTab($(this));
		}
		$(this).parent("li").siblings().removeClass("layui-nav-itemed");
	});


	function generateLeftChildrenMenu(menu) {
		var children = menu.children;
		var hl = '';
		if(children === undefined || children.length <1){
			return hl;
		}

		hl +='<dl class="layui-nav-child">';
		for(var i=0;i<children.length;i++){
			hl += '<dd>';
			var href  = children[i].url === ''? 'javascript:;': children[i].url;
			if(children[i].icon !==''){
				hl +='<i class="'+children[i].icon+'"></i>';
			}
			hl +='<a id="menuId'+children[i].menuId+'" data-url="'+href+'"><cite>'+children[i].menuName+'</cite></a>';
			hl += generateLeftChildrenMenu(children[i]);
			hl += '</dd>';
		}
		hl += '</dl>';
		return hl;
	}

	function generateLeftMenu(){
		var menusStr = $("#leftMenu").val();
		var menus = eval(menusStr);
		//生成左侧边栏
		var menuHtml = '<li class="layui-nav-item layui-this"><a href="javascript:;" data-url="main.html"><cite>后台首页</cite></a></li>';
		for(var i=0;i<menus.length;i++){
			var menu = menus[i];
			var href = menu.url === ''? 'javascript:;':menu.url;
			menuHtml += '<li class="layui-nav-item">';
			if(menu.icon !==''){
				menuHtml +='<i class="'+menu.icon+'"></i>';
			}
			menuHtml +='<a id="menuId'+menu.menuId+'" data-url="'+href+'"><cite>'+menu.menuName+'</cite></a>';
			menuHtml += generateLeftChildrenMenu(menu);
			menuHtml +='</li>';
		}

		var ul = $("ul.layui-nav-tree");
		ul.append(menuHtml);
	}

	$(document).ready(function() {
		generateLeftMenu();
		element.init();
	});
});

//打开新窗口
function addTab(_this){
	tab.tabAdd(_this);
}
