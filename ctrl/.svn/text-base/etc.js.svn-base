(function(){
	/*公用变量和方法*/
    function slideBtn(ctrl){
    	$(ctrl._dom).find('.list>ul>li').each(function(){
        	if($(this).attr("isDiscount")=="0"){
        		$(this).find(".sou").after('<img src="./img/chapter.png"/>');
        	}else{
        		function slide(event) {
            		if(!$(this).is(".share")){
	                    event.preventDefault();
	                    var el = this;
	                    var evnt = event.originalEvent;
	                    var curX = evnt.clientX!=undefined?evnt.clientX:evnt.touches&&evnt.touches[0].pageX;
	                    var margin=parseInt($("#page-wrap").css("margin-left"));
	                    var offset=($(window).width()-$("body").width())/2;
	                    var btn_half=$(el).width()/2;
	                    var distance=$("body").width()-margin*2-btn_half-2;
	                    var moveX = curX-offset-margin;
	                    if(moveX <= btn_half){
	                    	el.style.webkitTransform = 'translateX(0px)';
	                    	return;
	                    }
	                    if(moveX >= distance){
	                    	$(el).addClass("share");
	                    	el.style.webkitTransform = 'translateX('+(distance-btn_half)+'px)';
	                    	/*
	                    	 * TODO 获得券触发的请求 
	                    	 */
	                    	var shopId = $(el).closest("li").attr("shopId");
	                    	var secret = $(el).closest("li").find("input[name='secret']").val();
	                    	var key = $(el).closest("li").find("input[name='key']").val();
	                    	$.get("randomCard/getRandomCard.shtml",{shopId:shopId,secret:secret,key:key,path:"free"},function(data){
	                    		if(data.errorCode == 1000){
	                    			alert("请登录后再嗖一下！");
	                    			return false;
	                    		}
	                    		data = data.data;
	                    		if(data && data.randomCard){
	                    			var temp = "";
	                    			//var message = "恭喜你获得"+data.randomCard.money+"元嗖劵";
	                    			temp += '\
                    						<div class="green">\
	                    						<span class="color-white">'+data.randomCard.money+'</span>\
	                    						<p class="color-white" style="left: 0.42rem;">(仅本店使用)</p>\
	                    						<div class="txt-center">\
	                    							<h2 class="color-white">满'+data.randomCard.minPrice+'元可用</h2>\
	                    							<h6 class="color-white p">'+data.randomCard.memo+'前有效</h6>\
	                    						</div>\
	                    					</div>\
	                    				';
	                    			
	                    			$(el).closest("li")
	                    				.append('<div class="arch">'+temp+'</div>')
			                    		.find(".arch").slideDown();
			                    	if(!data.success){
	                    				alert(data.content);
	                    				return false;
	                    			}
//			                    	alert(message);
	                    		}
	                    		if(data && data.isShare){
	                    			$(el).closest("div").find("span").html("分享可增加一次机会");
	                    		}
	                    		if(data && data.content){
	                    			alert(data.content);
	                    		}
	                    		$(".cardInfo").hide(); //嗖券详情页面，清除文案
	                    	});
	                    	return;
	                    }
	                    el.style.webkitTransform = 'translateX(' + (moveX-btn_half) + 'px)';
            		}
                }
        		function release(event) {
            		if(!$(this).is(".share")){
            			this.style.webkitTransition = '-webkit-transform 0.3s ease-in';
	                    this.addEventListener( 'webkitTransitionEnd', function( event ) { this.style.webkitTransition = 'none'; }, false );
	                    this.style.webkitTransform = 'translateX(0px)';
            		}
            		$(document).unbind("mousemove", slide_mouse).unbind("mouseup", release_mouse).unbind("selectstart", noselect);;
                }
        		var slide_mouse;
        		var release_mouse;
        		function noselect(){return false;}
        		$(this).find("#slider").bind('touchmove', slide).bind('touchend', release).bind("mousedown",function(){
        			slide_mouse=slide.bind(this);
            		release_mouse=release.bind(this);
        			$(document).bind("mousemove", slide_mouse).bind("mouseup", release_mouse).bind("selectstart", noselect);
        		});
        	}
        });
    }

FORMAT({
	/*发现*/
	"etc/discover":{
		_title:"发现",
        _load: function(){

        },
        _style:"\
           .navbar2{ background-image:none;border-bottom:1px solid #e5e5e5; }\
           .content{background-color:#fff;}\
           .content>ul>li{border-bottom:1px solid #e5e5e5; height:1rem; line-height:1rem;}\
           .content>ul>li>a{display:block; position:relative; padding:0 1rem 0;}\
           .content>ul>li>a>span{ font-size:.32rem; color:#333;}\
           .content>ul>li>a>em{ position:absolute; left:.3rem;  top:0; font-size:.42rem;}\
           .content>ul>li>a>i{ position:absolute; right:.2rem; top:0; font-size:.42rem; color:#9e9e9e;}\
        "
    },
    /*附近折扣*/
    "etc/discount":{
    	_title:"附近折扣",
        _load:function(){
            $(".content .hd>ul>li").click(function(e){
                var num=$(this).index();
                $.stopPropagation(e);/*阻止冒泡*/
                if($("#contentid>div").eq(num).css("display")=="none"){
                    $("#contentid>div").eq(num).show();
                    $(".theme-popover-mask").show();
                }else{
                    $("#contentid>div").eq(num).hide();
                    $(".theme-popover-mask").hide();
                }
            });
            $(document).click(function(event) {
                $("#contentid>div").hide();
                $(".theme-popover-mask").hide();
            });
        },
        _style:"\
         .navbar2{ background-image:none;border-bottom:1px solid #e5e5e5; }\
        .content .hd{top:.9rem; background:#fff; border-bottom:1px solid #e5e5e5; position: absolute; z-index: 5;width: 100%;min-width: 320px;max-width: 640px;}\
        .content .hd>ul>li{ width:33.33%; height:.8rem; line-height:.8rem; float:left; }\
        .content .hd>ul>li.cur>a{ color:#df494a;}\
        .content .hd>ul>li>a{display:block; text-align:center; font-size:.3rem;}\
        .content .hd>ul>li>a>i{vertical-align: middle; font-size:.26rem; margin-left:.12rem;}\
        .content .list>ul>li{border-bottom:1px solid #e5e5e5;}\
        .content .list>ul>li>a{ height:2rem; padding:.2rem; box-sizing:border-box; display:block;}\
        .content .list>ul>li>a .pic{ height:1.6rem; width:2.2rem;}\
        .content .list>ul>li>a .pic img{ width:100%; height:100%;}\
        .content .list>ul{margin-top:.8rem;}\
        .content .list .con .txt{ margin-left:.2rem;width: 3.6rem;}\
        .content .list .con .txt h2{ font-size:.3rem; color:#666;}\
        .content .list .con .star{position:relative; width:120px;}\
        .vote-star{display:inline-block;margin-right:6px;width:120px;height:20px;overflow:hidden;vertical-align:middle;background:url(img/star.gif) repeat-x 0 -20px;}\
        .vote-star i{display:inline-block;height:28px;background:url(img/star.gif) repeat-x 0 0;}\
        .classify,.sort,.region{ z-index:5; position:absolute;width: 100%;min-width: 320px;max-width: 640px; display:none; background:#fff;top: 1.71rem;}\
        .classifylist li,#sortDiv li,#cityDiv>li{height:.8rem;line-height:.8rem; padding:0 .2rem; box-sizing:border-box; border-bottom:1px solid #e5e5e5; color:#666; cursor:pointer;}\
        "
    },
    /*嗖一下*/
    "etc/whoosh":{
    	_title:"嗖一下",
        _footer:false,
        _links:{
            "./plugin/jquery-ui.min.js":"js",
            "img/find_share.png":"img",
            "img/find_whoosh.png":"img"
        },
        pageNum:1,
        flag:true,
        _load: function(){
        	var hi=$(document).height();
        	$("#screen>li").click(function(){
        		if($("#classify").css('display')=='none'){
                    $(".theme-popover-mask").show();
                    $("body").css({"height":hi,"overflow":"hidden"});
                    $("#classify").show();
                }else{
                	$("body").css({"height":"auto","overflow-y":"scroll"});
                    $(".theme-popover-mask").hide();
                    $("#classify").hide();
                }
            })
        	$(".theme-popover-mask").click(function(){
                $(this).hide();
                $("body").css({"height":"auto","overflow-y":"scroll"});
                $("#classify").hide();
            })

            $(document).not(".screen-box").click(function(){
                if($(".option").css('display')=='block'){
                    $(".option").hide();
                }
            });
            /*分类列表的*/
            $(document).ready(function(){
                var sum=$(window).height();
                var nav=$('header').height();
                var num=sum-(nav*7);
                $('#classify').css("height",num);
            });
            $.get("category/getAllCategory.shtml",{},function(data){
            	if(data.status && data.status == 1){
            		data = data.data.category;
            		var html = "";
            		for(var i=0;i<data.length;i++){
            			html += '<li onclick="this.ctrl.loadIndustryByCatgory(this,'+data[i].id+',\''+data[i].name+'\');">'+
	    		            		'<a href="javascript:void(0);">'+
	    		            			data[i].name
	    		            		'</a>'+
	    		            	'</li>';
            		}
            		$("#categoryUl").append(html);
            	}
            });
        	
        	var ctrl = this;
            if(_param && _param.data && _param.data.shopList.length>0){
            	ctrl.loadData(_param);
            	slideBtn(ctrl);
            }else{
                $.getPosition(function(x,y,cityname){
                	//$.get("shop/searchDiscount.shtml",{position:"123.470024,41.788609",areaId:499,pageNum:1,pageSize:6}, function(data){ 
         			$.get("shop/searchDiscount.shtml",{position: x + "," + y,areaId:Config.area.id,pageNum:1,pageSize:6}, function(data){ 
                    	ctrl.loadData(data);
                    	slideBtn(ctrl);
                    });
         		});
            }
        	 //触底加载
        	setREG("document_scroll", ctrl._name, function(){
            	if($.getScrollBottom()<3 && ctrl.flag){
            		ctrl.pageNum++;
            		ctrl.loadData();
            		slideBtn(ctrl);
            	}
            });
        },
        _events:{
        	"strong.share":{
        		click:function(){
        			alert("请下载开店啦app，通过手机客户端参与分享才能再嗖一下哦！");
        		}
        	}
        },
        _style:"\
        .content .list>ul>li{margin-bottom: .1rem;}\
        .content .list>ul>li>div{padding-bottom:.1rem; background-color:#fff; position:relative;}\
        .content .list>ul>li>div>a{ height:1.7rem; padding:.2rem; box-sizing:border-box; display:block;}\
        .content .list>ul>li>div>img{ position:absolute; right:1.2rem; bottom:.2rem; z-index:9;width: 1.8rem;}\
        .content .list>ul>li>div>a .pic{ width:1.8rem;}\
        .content .list>ul>li>div>a .pic img{ width:100%; height:100%;}\
        .content .list .con .txt{ margin-left:.2rem;width: 3.6rem;}\
        .content .list .con .txt>img{height:.4rem;}\
        .content .list .con .txt h2{ font-size:.3rem; color:#666;}\
        .content .list .con .star{position:relative;width:120px;}\
        .vote-star{display:inline-block;margin-right:6px;width:120px;height:20px;overflow:hidden;vertical-align:middle;background:url(img/star.gif) repeat-x 0 -20px;}\
        .vote-star i{display:inline-block;height:28px;background:url(img/star.gif) repeat-x 0 0;}\
        .content .list>ul>li>div>a { border-bottom:1px solid #e5e5e5; }\
        .content .list>ul>li>div>a .sou{box-sizing:border-box;}\
        ",
        loadData :function(param){
        	var ctrl = this;
        	if(param && param.data && param.data.shopList.length>0){
        		ctrl.appendData(param);
        	}else{
        		var result = "";
        		var keyword = $("#keyword").val();
        		var categoryId = $("#categoryId").val();
        		var industryCategoryId = $("#industryCategoryId").val();
        		 $.getPosition(function(x,y,cityname){
        			 $.get("shop/searchDiscount.shtml",{
        				 position:x+","+y,
        				 areaId:Config.area.id,
        				 pageNum:ctrl.pageNum,
        				 pageSize:6,
        				 categoryId:categoryId,
        				 industryCategoryId:industryCategoryId,
        				 keyword:keyword
        			 },function(data){
        				 if(data && data.data.shopList.length<6){
        					 ctrl.flag = false;
        				 }
        				 result = data;
        				 ctrl.appendData(result);
        			 });
        		 });
        	}
        	//shopId="'+o._id+'"
        },
        //添加数据
        appendData : function(result){
        	if(result && result.data.shopList.length>0){
    			$.each(result.data.shopList,function(i,o){
    				var html = '<li isDiscount="'+o.isDiscount+'" shopId="'+o.shopId+'">'+
    								'<div>'+
    									'<a href="#shop/shops?shopId='+o.shopId+'">'+
    										'<div class="con">'+
    											'<div class="pic kdl-left">'+
    												'<img src="'+Config.imgPre + o.shopImage+'"/>'+
    											'</div>'+
    											'<div class="txt kdl-left">'+
    												'<h2 class="ellips1">'+o._name+'</h2>'+
    												'<img src="'+Config.imgPre + o.shopRankIcon+'"/>'+
    												'<div class="clearfix m-top20">'+
    													'<span class="color-gray9 h3 kdl-left">'+o.industryName+'</span>'+
    													'<span class="kdl-right color-gray9"><i class="iconfont color-orange">&#xe616;</i> '+o._distance+'m</span>'+
    												'</div>'+
    											'</div>'+
    										'</div>'+
    									'</a>'+
    									'<div class="sou">'+
    										'<div id="page-wrap" class="bg-white">'+
    											'<div id="well">'+
    												'<h2>'+
    													'<strong id="slider"></strong><span class="color-gray9">嗖出惊喜</span>'+
    												'</h2>'+
    											'</div>'+
    										'</div>'+
    									'</div>'+
    									'<input type="hidden" name="secret" value="'+result.data.secret+'" />'+
    									'<input type="hidden" name="key" value="'+result.data.key+'" />'+
    							'</div>';
    				var randomCardUserList = o.randomCardUser;
    				if(randomCardUserList && randomCardUserList.length > 0){
    					for(var j=0;j<randomCardUserList.length;j++){
    						html += '<div class="arch" style="display: block;">'+
    									'<div class="green">'+
    										'<span class="color-white">'+randomCardUserList[j].money+'</span>'+
    										'<p class="color-white" style="left: 0.42rem;">(仅本店使用)</p>'+
    										'<div class="txt-center">'+
    											'<h2 class="color-white">满'+randomCardUserList[j].minPrice+'元可用</h2>'+
            		            				'<h6 class="color-white p">'+randomCardUserList[j].memo+'前有效</h6>'+
    										'</div>'+
    									'</div>'+
    								'</div';
    					}
    				}
    				html += '</li>';
    				$(html).appendTo($(".list>ul"));
    			});
    			$(".reminder").css("display","none");
    		}else{
    			if($(".list ul li").length<1)$(".reminder").css("display","block");
    		}
        },
        loadIndustryByCatgory:function(obj,categoryId,categoryName){
        	$(obj).siblings().removeClass("cur");
        	$(obj).addClass("cur");
        	var html = '<li onclick="this.ctrl.selectCategory(this,'+categoryId+',\''+categoryName+'\')">'+
						    '<a href="javascript:void(0);">'+
					        	'全部'+
					        '</a>'+
					    '</li>';
        	$.get("category/getIndustryCategory.shtml",{categoryId:categoryId},function(data){
        		if(data && data.status == 1){
        			data = data.data.industryCategory;
        			for(var i=0;i<data.length;i++){
        				html += '<li onclick="this.ctrl.selectIndustryCategory(this,'+categoryId+','+data[i].id+',\''+data[i].name+'\')">'+
									'<a href="javascript:void(0);">'+
							        	data[i].name+
							        '</a>'+
							    '</li>';
        			}
        		}
        		$("#indutryCategory").html(html);
        	});
        },
        selectCategory:function(obj,categoryId,categoryName){
        	$(obj).siblings().removeClass("cur");
        	$(obj).addClass("cur");
        	$("#shopList").html("");
        	$("#categoryId").val(categoryId);
        	$("#industryCategoryId").val("");
        	$("#showCategoryTxt").html(categoryName);
        	$("body").css({"height":"auto","overflow-y":"scroll"});
        	$(".theme-popover-mask").hide();
        	$("#classify").hide();
        	this.pageNum =1;
        	this.loadData();
        },
        selectIndustryCategory:function(obj,categoryId,industryCategoryId,industryCategoryName){
        	$(obj).siblings().removeClass("cur");
        	$(obj).addClass("cur");
        	$("#shopList").html("");
        	$("#categoryId").val(categoryId);
        	$("#industryCategoryId").val(industryCategoryId);
        	$("#showCategoryTxt").html(industryCategoryName);
        	$("body").css({"height":"auto","overflow-y":"scroll"});
        	$(".theme-popover-mask").hide();
        	$("#classify").hide();
        	this.pageNum =1;
        	this.loadData();
        },
        keywordSearch:function(){
        	$("#shopList").html("");
        	this.loadData();
        }
    },
    
    /*嗖一下*/
    "etc/swish":{
        _title:"嗖一下",
        _footer:false,
        _load: function(){
            $(window).ready(function () {
                setTimeout(function () {
                	setTimeout(function () {
                        $('#container').append('<div class="dot" style="top:50%;left:50%;"></div>')
                    }, 3500);
                	setTimeout(function () {
                        $('#container').append('<div class="dot" style="top:50%;left:50%;"></div>')
                    }, 3000);
                    setTimeout(function () {
                        $('#container').append('<div class="dot" style="top:50%;left:50%;"></div>')
                    }, 2500);
                    setTimeout(function () {
                        $('#container').append('<div class="dot" style="top:50%;left:50%;"></div>')
                    }, 2000);
                    setTimeout(function () {
                        $('#container').append('<div class="dot" style="top:50%;left:50%;"></div>')
                    }, 1500);
                    setTimeout(function () {
                        $('#container').append('<div class="dot" style="top:50%;left:50%;"></div>')
                    }, 500);
                    setTimeout(function () {
                        $('#container').append('<div class="dot" style="top:50%;left:50%;"></div>')
                    }, 0);
                    setTimeout(function () {
                        $('#container .dot').remove();
                    }, 4000);
                }, 0);
            });
            var wait1s=$.Deferred(); 
            var request=$.Deferred();
            setTimeout(function(){ wait1s.resolve(); }, 3500);
            var param; 
            $.getPosition(function(x,y,cityname){
            	//$.get("shop/searchDiscount.shtml",{position:"123.726039,41.822148",areaId:499,pageNum:1,pageSize:6}, function(data){ 
     			 $.get("shop/searchDiscount.shtml",{position: x + "," + y,areaId:Config.area.id,pageNum:1,pageSize:6}, function(data){ 
                	param=data;
                	request.resolve(); 
                });
     		});
            
            $.when(wait1s, request).then(function(){
            	DO("etc/whoosh", param);
            });
            
        }
    },
    /*嗖券指南*/
    "etc/whooshGuide": {
        _title: "嗖券指南",
        _footer: false,
        _load: function () {
        	
        }
    },
    /*嗖一下详情*/
    "etc/swishInfo":{
        _title:"嗖一下详情",
        _footer:false,
        _links:{
            "./plugin/swipe.js":"js"
        },
        _datas: GET("shop/getShareShop.shtml",{shopId:PARAM("shopId",null)}),
        secretKey : null,
        randomCardUserId : null,
        _load: function(){
        	var ctrl=this;
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
            //初始化手机号
            if(localStorage.getItem("swishPhone")){
            	$(".numberBox").find("input").val(localStorage.getItem("swishPhone"));
            }
            //滑动按钮
            $(ctrl._dom).find('.list>ul>li').each(function(){
            	if($(this).attr("isDiscount")=="0"){
            		$(this).find(".sou").after('<img src="./img/chapter.png"/>');
            	}else{
            		function slide(event) {
                		if(!$(this).is(".share")){
    	                    event.preventDefault();
    	                    var el = this;
    	                    var evnt = event.originalEvent;
    	                    var curX = evnt.clientX!=undefined?evnt.clientX:evnt.touches&&evnt.touches[0].pageX;
    	                    var margin=parseInt($("#page-wrap").css("margin-left"));
    	                    var offset=($(window).width()-$("body").width())/2;
    	                    var btn_half=$(el).width()/2;
    	                    var distance=$("body").width()-margin*2-btn_half-2;
    	                    var moveX = curX-offset-margin;
    	                    if(moveX <= btn_half){
    	                    	el.style.webkitTransform = 'translateX(0px)';
    	                    	return;
    	                    }
    	                    if(moveX >= distance){
    	                    	if(!$(this).is(".share")){
	    	                    	$(el).addClass("share");
	    	                    	el.style.webkitTransform = 'translateX('+(distance-btn_half)+'px)';
	    	                    	var shopId = $(el).closest("li").attr("shopId");
	    	                    	var secret = $(el).closest("li").find("input[name='secret']").val();
	    	                    	var key = $(el).closest("li").find("input[name='key']").val();
	    	                    	$.get("common/swishInfoGetRandomCard.shtml",{
	    	                    		shopId:shopId,
	    	                    		secret:secret,
	    	                    		key:key,
	    	                    		path:"free"
	    	                    	},function(data){
	    	                    		if(data.status == 0){
	    	                    			alert(data.errorMsg);
	    	                    			release.call($(el).removeClass("share")[0]); //滑动块回到原位置
	    	                    			return;
	    	                    		}
	    	                    		data = data.data;
	    	                    		if(data && data.randomCard){
	    	                    			var temp = "";
	    	                    			//var message = "恭喜你获得"+data.randomCard.money+"元嗖劵！";
	    	                    			temp += '\
	                        						<div class="green">\
	    	                    						<span class="color-white">'+data.randomCard.money+'</span>\
	    	                    						<p class="color-white" style="left: 0.42rem;">(仅本店使用)</p>\
	    	                    						<div class="txt-center">\
	    	                    							<h2 class="color-white">满'+data.randomCard.minPrice+'元可用</h2>\
	    	                    							<h6 class="color-white p">'+data.randomCard.memo+'前有效</h6>\
	    	                    						</div>\
	    	                    					</div>\
	    	                    				';
	    	                    			
	    	                    			$(el).closest("li")
	    	                    				.append('<div class="arch">'+temp+'</div>')
	    			                    		.find(".arch").slideDown();
	    			                    	if(!data.success){
	    	                    				alert(data.content);
	    	                    				return false;
	    	                    			}
	    			                    	if(!data.isLogin){
	    			                    		//message += "请输入您的手机号领取使用！";
	    			                    		$(".numberBox").show();
	    			                    		ctrl.secretKey = data.secretKey;
	    			                    		ctrl.randomCardUserId = data.randomCard.id;
	    			                    	}
	    			                    	//alert(message);
	    	                    		}
	    	                    		if(data && data.isShare){
	    	                    			$(el).closest("div").find("span").html("分享可增加一次机会");
	    	                    		}
	    	                    		if(data && data.content){
	    	                    			alert(data.content);
	    	                    		}
	    	                    		$(".cardInfo").hide(); //嗖券详情页面，清除文案
	    	                    		$(".infoText").show(); //嗖券详情页面，清除文案
	    	                    	});
    	                    	}
    	                    	return;
    	                    }
    	                    el.style.webkitTransform = 'translateX(' + (moveX-btn_half) + 'px)';
                		}
                    }
            		function release(event) {
                		if(!$(this).is(".share")){
                			this.style.webkitTransition = '-webkit-transform 0.3s ease-in';
    	                    this.addEventListener( 'webkitTransitionEnd', function( event ) { this.style.webkitTransition = 'none'; }, false );
    	                    this.style.webkitTransform = 'translateX(0px)';
                		}
                		$(document).unbind("mousemove", slide_mouse).unbind("mouseup", release_mouse).unbind("selectstart", noselect);;
                    }
            		var slide_mouse;
            		var release_mouse;
            		function noselect(){return false;}
            		$(this).find("#slider").bind('touchmove', slide).bind('touchend', release).bind("mousedown",function(){
            			slide_mouse=slide.bind(this);
                		release_mouse=release.bind(this);
            			$(document).bind("mousemove", slide_mouse).bind("mouseup", release_mouse).bind("selectstart", noselect);
            		});
            	}
            });
            
            $.wxShare();
        },
        _events:{
        	"strong.share":{
        		click:function(){
        			alert("领取更多嗖券请下载开店啦app！");
        		}
        	}
        },
        // 点击输入手机号领取嗖券
        getCard : function(item){
        	var ctrl = this;
        	if(!$(item).prev("input").val()){
        		alert("请输入手机号！");
        		return;
        	}
        	if(!/^1[3|4|5|7|8]\d{9}$/.test($(item).prev("input").val())){
        		alert("手机号格式有误！");
        		return;
        	}
        	// 绑定手机号,并领取嗖券
        	$.post(Config.basePath+"/common/bindUserCard.shtml",{
        		username:$(item).prev("input").val(),
        		randomCardUserId:ctrl.randomCardUserId,
        		secretKey:ctrl.secretKey
        	},function(datas){
        		if(datas.status == 0){
        			alert(datas.errorMsg);
        			return;
        		}
        		localStorage.setItem("swishPhone",$(item).prev("input").val());
        		alert("您已成功获得该券，是否查看更多？",true,function(flag){
        			flag?DO("index"):null;
        		});
        	});
        }
    }

    
});

})();