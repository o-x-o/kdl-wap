(function(){
	/* 关于
	 * 可复用渲染组件
	 * 
	 * 声明：
	 * var list = RENDER( {url:"include/shoplist.ejs"}, POST(url,param,callback) ); 
	 * 或 var list = RENDER( {text:"<div>模版内容</div>"}, dataJson );
	 * 第二个参数可省略。代表默认的请求。
	 * 
	 * 使用：
	 * list.post(url,param,callback) 或 list.ajax(param) 或 list(dataJson) 或 list() 都可以进行模版渲染，返回渲染结果。
	 * 并将之前用list在页面上渲染过的DOM重新渲染
	 * 
	 * */
	
	/*公用变量和方法*/
	/*滚动触发key*/
	var adMarquee=0;
FORMAT({
    index: {
    	_template:null,/*指定模版 两种方式 url指定{url:"view/index.ejs"} 文本指定{text:"<div>模版内容</div>"} 若为空则根据Ctrl名来找模版*/
        _container:".page_container",/*渲染位置的父节点*/
        _links:{
            "./plugin/swipe.js":"js",
            "./plugin/jquery.lazyload.js":"js",
            "./css/index.css":"css",
            "":"img",
            "":"link",
            "":"script"
        },
        _title:"开店啦_实体商家网上免费开店 _精准引流_吸引用户_用户便捷付款_互联网创业开店",/*切换至该视图时 页面的title*/
        _style:"",/*内置样式*/
        _vars: {/*放置全局的变量*/
        },
        _datas: {/*动态数据 视图中也能使用全局变量 此处取名_datas区别于视图中所有变量的附属对象_data 在js中也可通过DATA(dom)获取该视图的数据 dom为该视图中的任意dom*/
        	promotion1:POST("common/promotion.shtml",{areaId:function(){return Config.area.id;},promotionType:1},function(datas){
        		return datas.promotions;
        	}),
        	promotion2:POST("common/promotion.shtml",{areaId:function(){return Config.area.id;},promotionType:2},function(datas){
        		return datas.promotions;
        	}),
        	promotion3:POST("common/promotion.shtml",{areaId:function(){return Config.area.id;},promotionType:3},function(datas){
        		return datas.promotions;
        	}),
        	//加载中上部
        	promotion4:POST("common/promotion.shtml",{areaId:function(){return Config.area.id;},promotionType:4},function(datas){
        		return datas.promotions;
        	}),
        	//加载中底部
        	promotion5:POST("common/promotion.shtml",{areaId:function(){return Config.area.id;},promotionType:5},function(datas){
        		return datas.promotions;
        	}),
        	//加载icon分类部分
        	/*promotion6:POST("common/promotion.shtml",{areaId:function(){return Config.area.id;},promotionType:6},function(datas){
        		return datas.promotions;
        	})*/
        },
        _events: {
        },
        /*模版加载执行*/
        _load: function(){
        	/*引导层*/
        	$(".index-cose").click(function(){
        		$(".index-mask").hide(300);
        		$(".theme-popover-mask").hide(500);
        	})
        	$(".index-mask>cite").click(function(){
        		GO("etc/discover");
        		$(".index-mask").hide(300);
        		$(".theme-popover-mask").hide(500);
        	})
        	/*何时显示引导层*/
        	var firstTime = localStorage.getItem("firstTime");
        	var noShowLeadPage = localStorage.getItem("noShowLeadPage");
        	if(!firstTime && !noShowLeadPage){//第一次
        		$(".index-mask").show();
        		$(".theme-popover-mask").show();
        		localStorage.setItem("firstTime",new Date());
        	}else if(!noShowLeadPage){//第二次
        		var currentTime = new Date();
        		var leftTime = currentTime.getTime()-new Date(firstTime).getTime();
        		if(leftTime/(3600*1000) >= 72){
        			$(".index-mask").show();
        			$(".theme-popover-mask").show();
        			localStorage.del("firstTime");
        			localStorage.setItem("noShowLeadPage",true);
        		}
        	}
            /*轮播图播放*/
            $(".wrap img").show();
            var length=$("#slider .swipe-wrap").children().length;
            $("#circle").empty();
            for(var n=0;n<length;n++){
            	$("#circle").append("<li></li>");
            }
            var diandian = document.getElementById('circle').getElementsByTagName('li');
            $(diandian).click(function(){slider.next();slider.slide($(this).index());}).eq(0).addClass("current");
			setTimeout(function(){$("#circle").css("margin-left",-$("#circle").width()/2);},1000);
            var slider =
                Swipe(document.getElementById('slider'), {
                    auto: 3000,// 每3秒切换图片
                    continuous: true,
                    callback: function(pos) { //pos  返回的是索引值
                        for(var i=0;i<=diandian.length;i++){
                            $(diandian[i]).removeClass("current");
                            $(diandian[pos]).addClass("current");
                            $("#circle").css("margin-left",-$("#circle").width()/2); 
                        }
                    }
                });
            $("#circle").css("margin-left",-$("#circle").width()/2);
            setREG("resize",this._name,function(){
            	$("#circle").css("margin-left",-$("#circle").width()/2);
            });
            /*轮番图结束*/
            /*同城头条滑动*/
            /*文字无缝滚动*/
            Marquee("headLine",3000);
            function Marquee(obj,speed){
                $("#"+obj).hover(function(){
                    clearInterval(adMarquee);
                },function(){
                    adMarquee=setInterval(function(){
                        $("#"+obj).prepend($("#"+obj+" li").last().hide().detach());
                        $("#"+obj+" li").eq(1).hide();
                        $("#"+obj+" li").first().slideDown(500);
                        $("#"+obj+" li").eq(1).fadeIn(50);
                    },speed);
                }).trigger("mouseleave");
            }
            /*点击选择城市*/
        	$(".nav-city").click(function(){
        		GO("ucenter/positioning");
        	})
        	/*给超级返填充数据*/
        	 $.get("specialtyContent/specialtyContents.shtml",{
      			 specialtyDisplayId:$("#superReturn").val(),
      			 areaId:Config.area.id,
      			 pageNum:1,
      			 pageSize:3
      		 },function(data){
      			var specialtyContentList = "";
        		if(data && data.data && data.data.specialtyContentList && data.data.specialtyContentList.length > 0){
        			specialtyContentList = data.data.specialtyContentList;
        		}else{
        			return false;
        		}
        		var temp="";
        		for(var i=0;i<specialtyContentList.length;i++){
        			var param = "";
					if(specialtyContentList[i].goods.cowrieStatus=="pass"){
						param = "&shopId=1";
					}
        			temp += '<li>'+
        							'<a href="#goods/details?goodsId='+specialtyContentList[i].goodsId+'&specialtyContentId='+specialtyContentList[i].id+param+'">'+
					                    '<div class="pic">'+
					                        '<img url="'+Config.imgPre+specialtyContentList[i].goods.image+'"/>'+
					                    '</div>'+
					                    '<div class="txt">'+
					                        '<p><span class="color-red h5">¥'+specialtyContentList[i].price.toFixed(2)+'</span><del>¥'+specialtyContentList[i].goods.originalPrice.toFixed(2)+'</del></p>'+
					                        '<span class="color-orange">返现¥'+specialtyContentList[i].consumeTips.toFixed(2)+'</span>'+
					                    '</div>'+
					                '</a>'+
					            '</li>';
        		}
      			$(".fanxian>ul").append(temp);
      			$(".fanxian .pic img").lazyload();
      		 });
        	$(".advertising img").lazyload();
        	
        	//获取同城资讯数据
        	$.get(Config.basePath+"index/getHomePageCityNews.shtml",{
        		areaId : Config.area.id,
        		pageNum : 1,
        		pageSize : 12
        	},function(datas){
        		var activityList = datas.data.activityList;
        		var temp = "";
        		if(datas.data != null && activityList != null && activityList.length > 0){
        			for(var i = 0;i<activityList.length;i++){
        				temp += '<li class="ellips1" onclick="this.ctrl.toActivityDetail('+activityList[i].activityId+',\''+activityList[i].activityType+'\','+activityList[i].shopId+',\''+activityList[i].forwardId+'\')">\
		                            <i></i>\
		                            <a href="javascript:;">&nbsp;&nbsp;'+activityList[i].title+'</a>\
		                         </li>';
        			}
        			$("#headLine").append(temp);
        		}else{
        			$("#activityTitle").hide();
        		}
        	});
        	
        	var accessToken = localStorage.getItem("accessToken");
        	if(accessToken && accessToken != null && accessToken != ""){
        		$.ajax({
        			url:Config.basePath+"index/openWapLog.shtml",
        			async:true,
        			data:{"accessToken":accessToken},
        			type:"post",
        			dataType:"json",
        			success:function(data){
        				if(data.status == 1){
        					
        				}
        			},
        			error:function(data){
        				
        			}
        		});
        	}
        	//根据当前时间判断是否更新红点状态
        	if(localStorage.getItem("accessToken")){ //当前已登录
        		if(localStorage.getItem("homeRedpoint_"+_user.id) == null || (new Date().getTime() - localStorage.getItem("homeRedpoint_"+_user.id) > 60000)){
        			//本地记录最后更新首页红点时间为null或者最后时间与当前时间大于10分钟
        			$.post("index/getRedPoint.shtml",{
        				accessToken:localStorage.getItem("accessToken"),
        				actTime:localStorage.getItem("actRedpoint_"+_user.id),
        				infoTime:localStorage.getItem("infoRedpoint_"+_user.id)
        			},function(datas){
        				localStorage.setItem("homeRedpoint_"+_user.id,new Date().getTime());//设置最后更新红点时间
        				if(_user && datas.data.homeRedpoint){
        					localStorage.setItem("allRedpoint_"+_user.id, true);
        				}else{
        					localStorage.setItem("allRedpoint_"+_user.id, false);
        				}
        				$.showUnRead();
        			}); 
        		}
        	}
        },
        //进入活动详情
        toActivityDetail : function(activityId,activityType,shopId,forwardId){
        	if(activityType == "sales"){
        		GO("cityNews/promotionDetails",{activityId:activityId});
        	}else if(activityType == "forward"){
        		GO("forwardingGifts/forwardingDetails",{shopId:shopId,forwardingGiftsId:forwardId});
        	}else if(activityType == "shop"){
        		GO("cityNews/activityDetails",{activityId:activityId});
        	}
        },
        /*页面显示执行 与_load的区别是container切换导致页面不卸载 再次打开的时候不执行_load只执行_show*/
        _show: function(){
        	
        },
        /*模版卸载执行*/
        _pass: function(){
        	clearInterval(adMarquee);
        }
    },
    
    error:{
    	_load:pageAdjust
    },

    404:{
    	_load:pageAdjust
    }
});

function pageAdjust(){
	this._dom.find(".error-wrap").css({height:$("html").height()-parseInt($("body").css("padding-bottom"))});
}

})();