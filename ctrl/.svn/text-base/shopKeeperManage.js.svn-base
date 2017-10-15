(function(){
	/*公用变量和方法*/
	var adMarquee;
	
FORMAT({

    /*店主店铺*/
    "shopKeeperManage/shopKeeperShops":{
    	_title:"店主店铺",
    	_template:{url:"./view/shopKeeper/shopKeeperShops.ejs"},
    	_datas: {/*动态数据 视图中也能使用全局变量 此处取名_datas区别于视图中所有变量的附属对象_data 在js中也可通过DATA(dom)获取该视图的数据 dom为该视图中的任意dom*/
        	data:GET("ucenter/sKeeperShopOwnInfo.shtml",function(data){
        		return data;
        	})
        	,
        	isFavorite:GET("shop/favorite.shtml",{shopId:PARAM("shopId")},function(data){
    			return data.isFavorite;
    		})
        },
        _load:function(){
        	$.wxShare();
        	//加载全部商品数据
        	DO("shopKeeperManage/allGoods",{},".goodsContent");
            /*滑动栏下跟随划动*/
            $(".navigation li").click(function(){
                $(this).parent().siblings("span").stop().animate({left:$(this).index()*33.33+"%"});
                var listnum  = $(this).index();
                $(".goodsContent").empty();
                if(listnum == "0"){//店铺首页
                	DO("shopKeeperManage/allGoods",{},".goodsContent");
                }else if(listnum == "1"){//店主推荐
                	DO("shopKeeperManage/recommend",{},".goodsContent");
                }else if(listnum == "2"){//新品上架
                	DO("shopKeeperManage/newArrival",{},".goodsContent");
                }
            })
            /*收藏*/
            $(".collect").click(function(){
            	if($(this).hasClass("active")){//已收藏
            		$.delete("shop/favorite.shtml",{shopId:$("#shopId").val()},function(data){
            			if(data.status == "1"){
            				$(".collect").removeClass("active");
            				$("#attentionPeoples").text(+$("#attentionPeoples").text()-1);
            			}else{
            				if(data.status == "0" && data.errorCode == "1000"){//未登录
            					GO('passport/login',{backUrl:'#shopKeeperManage/shopKeeperShops'}) 
    							return false;
            				}else{
            					alert(data.errorMsg);
            				}
            			}
            		});
            	}else{//未收藏
            		$.post("shop/favorite.shtml",{shopId:$("#shopId").val()},function(data){
            			if(data.status == "1"){
            				$(".collect").addClass("active");
            				$("#attentionPeoples").text(+$("#attentionPeoples").text()+1);
            			}else{
            				if(data.status == "0" && data.errorCode == "1000"){//未登录
            					GO('passport/login',{backUrl:'#shopKeeperManage/shopKeeperShops'})
    							return false;
            				}else{
            					alert(data.errorMsg);
            				}
            			}
            		});
            	}
            });
            $.post("shop/shopBrowse.shtml",{shopId:$("#shopId").val()},function(data){})
        },
        _style:"\
        li .pic>img{width:100%;}\
        .content section{position:relative; height:2rem; background:url(img/shopkeeperShops-banner.jpg);z-index: 2; background-size: cover;}\
        .content section .section-con{ position:absolute; bottom:.15rem; width:100%; height:1rem}\
        .content section .pic{width:1rem; height:1rem; border-radius:50%; overflow:hidden; margin-left:.1rem;border: 1px solid #fff;box-sizing: border-box;}\
        .content section .pic img{width:100%;height:100%;}\
        .content section .txt{ margin-left:.2rem; margin-top: 0.1rem;}\
        .content section .txt .bg-grade{ color:#fff; background-size: contain; text-align:left;text-indent: .52rem;margin-top:.2rem; background-image:url(img/bg-grade.png); width:1.2rem; height:.36rem; display:block;}\
        .content section .collect{ width:1rem; height:.7rem;text-align:center; display:block; position:absolute;right:-.05rem; border-radius:3px; bottom: .08rem; color:#666; background-color:#fff; font-size:.24rem; }\
        .content section .collect>i{display:inline-block; margin-top:1px;}\
		.content section .collect>p{line-height: .24rem;}\
        .content section .collect .iconfont:before{content:attr(icon1);}\
        .content section .collect.active{color:#df494a; background-color:#fff;bottom: .04rem;}\
        .content section .collect.active .iconfont:before{content:attr(icon2);}\
        .content section .collect.active p:before{content:'已';}\
        .navigation,.sifting,.Sort{position:relative; z-index:2;}\
        .navigation{padding:.2rem 0;box-sizing:border-box; border-bottom:1px solid #e5e5e5; position:relative;}\
        .navigation>span{width:33.33%; heigth:2px; border-bottom:2px solid #df494a; position:absolute; left:0; bottom:0;}\
        .navigation>ul>li{width:33.33%; float:left;}\
        .navigation>ul>li>a{text-align:center; display:block;}\
        .navigation>ul>li>a>i{font-size:.42rem;}\
        .navigation>ul>li>a>p{ margin-top:.15rem;}\
        .sifting>ul{width:80%; float:left;}\
        .sifting>ul>li{float:left; width:30%; height:.8rem; line-height:.8rem;}\
        .sifting>ul>li:first-child{ width:40%!important;}\
        .sifting>a{float:left; box-sizing:border-box; border-left:1px solid #e5e5e5; line-height:.4rem; width:20%;margin-top: .2rem;text-align: center;}\
        .sifting>ul>li>a{position:relative;display:block; text-align:center;}\
        .sifting>ul>li.cur>a{ color:#df494a;}\
        .sifting>ul>li.cur>a>i{    border-top-color: #DF494A;}\
        .sifting>ul>li>a>i{ transform: rotate(180deg); position:relative; border-width: 5px;right: initial; margin-left:.1rem; top: 0.2rem; border-bottom-color: transparent;   border-top-color: #3d3d3d;}\
        .con-list>ul>li{height:2.55rem;margin-top: .05rem;}\
        .con-list>ul>li>a{display:block;}\
        .con-list>ul>li>a .pic{width:2.5rem; float:left; height:2.4rem;overflow:hidden; background:url(./img/list-ptobg.jpg) no-repeat;background-size: contain;}\
        .con-list>ul>li>a>div.pic>img{width:100%; height:100%;}\
        .con-list>ul>li>a .txt{float:right; height:2.55rem; width:3.8rem; padding:.05rem .15rem;box-sizing:border-box; border-bottom: 1px solid #e5e5e5;}\
        .con-list2>ul{ padding-left:.1rem; box-sizing:border-box;}\
        .con-list2>ul>li{float:left; width:50%; padding-right:.1rem; box-sizing:border-box;height: 5.2rem;}\
        .con-list2>ul>li .pic{width:100%;height:2.9rem; overflow:hidden; background:url(./img/list-ptosbg.jpg) no-repeat;background-size: contain;}\
        .con-list2>ul>li .pic>img{width:100%; height:100%;}\
        .con-list2>ul>li .txt>h6{border-bottom:1px solid #e5e5e5; padding:.1rem 0; height:.7rem; line-height:.4rem;}\
        .con-list2>ul>li .txt p{display:none;}\
        .Sort{display:none;}\
        .Sort>ul{border-bottom:1px solid #e5e5e5;}\
        .Sort>ul>li{ height:.8rem; line-height:.8rem; border-top:1px solid #e5e5e5; padding:0 .2rem; box-sizing:border-box;}\
        .Sort>ul>li>a>i{ color:#fff;}\
        .Sort>ul>li.cur a{ color:#df494a;}\
        .Sort>ul>li.cur a>i{ color:#df494a;}\
        .Sort>ul>li>a{display:block;}\
        .population{position: absolute; right: 1.1rem; text-align: center;color: #fff; bottom: .12rem;}\
        .section-con>p{color:#fff; font-size:.22rem; margin-top: .55rem; text-indent:.07rem; position: relative; left:-.5rem;}\
        "
    },
    
    
    /*店主店铺商品搜索*/
    "shopKeeperManage/shopKeeperSearch":{
    	_title:"商品搜索",
    	_template:{url:"./view/shopKeeper/shopKeeperSearch.ejs"},
        _load: function(){
            /*滑动栏下跟随划动*/
            $(".navigation li").click(function(){
                $(this).parent().siblings("span").stop().animate({left:$(this).index()*33.33+"%"});
            })
            $(".sifting>ul>li").click(function(){
                $(this).addClass("cur").siblings().removeClass("cur");
            })
            /*切换风格*/
            $("#conList").click(function(){
                if($(this).text()==""){
                    $(this).text("");
                    $(".listid").addClass('con-list2').removeClass('con-list')
                    $(".con-list2>ul>li>a p").hide();
                }
                else{
                    $(this).text("");
                    $(".listid").addClass('con-list').removeClass('con-list2')
                    $(".con-list2>ul>li>a p").show();
                }
            });

            $(".sifting li:eq(0)").click(function(e){
                $.stopPropagation(e);/*阻止冒泡*/
                if($(".Sort").css("display")=="none"){
                    $(".Sort").show();
                    $(".theme-popover-mask").show();
                }else{
                    $(".Sort").hide();
                    $(".theme-popover-mask").hide();
                }
            });
            $(document).click(function(event) {
                $(".Sort").hide();
                $(".theme-popover-mask").hide();
            });
        },
        _style:"\
        li .pic>img{width:100%;}\
        .navigation,.sifting,.Sort{position:relative; z-index:2;}\
        .navigation{padding:.2rem 0;box-sizing:border-box; border-bottom:1px solid #e5e5e5; position:relative;}\
        .navigation>span{width:33.33%; heigth:2px; border-bottom:2px solid #df494a; position:absolute; left:0; bottom:0;}\
        .navigation>ul>li{width:33.33%; float:left;}\
        .navigation>ul>li>a{text-align:center; display:block;}\
        .navigation>ul>li>a>i{font-size:.42rem;}\
        .navigation>ul>li>a>p{ margin-top:.15rem;}\
        .sifting>ul{width:80%; float:left;}\
        .sifting>ul>li{float:left; width:30%; height:.8rem; line-height:.8rem;}\
        .sifting>ul>li:first-child{ width:40%!important;}\
        .sifting>a{float:left; box-sizing:border-box; border-left:1px solid #e5e5e5; line-height:.4rem; width:20%;margin-top: .2rem;text-align: center;}\
        .sifting>ul>li>a{position:relative;display:block; text-align:center;}\
        .sifting>ul>li.cur>a{ color:#df494a;}\
        .sifting>ul>li.cur>a>i{    border-top-color: #DF494A;}\
        .sifting>ul>li>a>i{ transform: rotate(180deg); position:relative; border-width: 5px;right: initial; margin-left:.1rem; top: 0.2rem; border-bottom-color: transparent;   border-top-color: #3d3d3d;}\
        .con-list>ul>li{height:2.55rem;margin-top: .05rem;}\
        .con-list>ul>li>a{display:block;}\
        .con-list>ul>li>a .pic{width:2.6rem; float:left; height:2.5rem;overflow:hidden; background:url(./img/list-ptobg.jpg) no-repeat;background-size: contain;}\
        .con-list>ul>li>a>div.pic>img{width:100%;}\
        .con-list>ul>li>a .txt{float:right; height:2.55rem; width:3.8rem; padding:.05rem .15rem;box-sizing:border-box; border-bottom: 1px solid #e5e5e5;}\
        .con-list2>ul{ padding-left:.1rem; box-sizing:border-box;}\
        .con-list2>ul>li{float:left; width:50%; padding-right:.1rem; box-sizing:border-box;height: 5.2rem;}\
        .con-list2>ul>li .pic{width:100%; height:2.9rem; overflow:hidden; background:url(./img/list-ptosbg.jpg) no-repeat;background-size: contain;}\
        .con-list2>ul>li .pic>img{width:100%; height:100%;}\
        .con-list2>ul>li .txt>h6{border-bottom:1px solid #e5e5e5; padding:.1rem 0; height:.7rem; line-height:.4rem;}\
        .con-list2>ul>li .txt p{display:none;}\
        .Sort{display:none;}\
        .Sort>ul>li{ height:.8rem; line-height:.8rem; border-top:1px solid #e5e5e5; padding:0 .2rem; box-sizing:border-box;}\
        .Sort>ul>li>a>i{ color:#fff;}\
        .Sort>ul>li.cur a{ color:#df494a;}\
        .Sort>ul>li.cur a>i{ color:#df494a;}\
        .Sort>ul>li>a{display:block;}\
        "
    },
    

    /*店铺首页*/
    "shopKeeperManage/allGoods":{
    	_title:"店铺首页",
    	_template:{url:"./view/shopKeeper/allGoods.ejs"},
    	pageNum:1,
    	pageSize:6,
    	flag:true,
    	orders:"",
    	_load: function() {
    		var ctrl = this;
        	ctrl.loadData();
        	
        	$(".sifting>ul>li").click(function(){
                $(this).addClass("cur").siblings().removeClass("cur");
                var listnum = $(this).index();
                if(listnum == "1"){//售价
                	 //价格排序
	            	if($(this).find("cite").text()=="▼"){
	            		$(this).find("cite").text("▲");
	            		reloadData("priceAsc");
	            	}
	            	else{
	            		$(this).find("cite").text("▼");
	            		reloadData("priceDesc");
	            	}
                }else if(listnum == "2"){//佣金
                	reloadData("consumeTips");
                }
            })
            
            /*切换风格*/
            $("#conList").click(function(){
                if($(this).text()==""){
                    $(this).text("");
                    $(".listid").addClass('con-list2').removeClass('con-list')
                    $(".con-list2>ul>li>a p").hide();
                }
                else{
                    $(this).text("");
                    $(".listid").addClass('con-list').removeClass('con-list2')
                    $(".con-list2>ul>li>a p").show();
                }
            });

            $(".sifting li:eq(0)").click(function(e){
                $.stopPropagation(e);/*阻止冒泡*/
                if($(".Sort").css("display")=="none"){
                    $(".Sort").show();
                    //$(".theme-popover-mask").show();
                }else{
                    $(".Sort").hide();
                    //$(".theme-popover-mask").hide();
                }
            });
            $(document).click(function(event) {
                $(".Sort").hide();
                $(".theme-popover-mask").hide();
            });
            $(".Sort>ul>li").click(function(){
            	var listnum = $(this).index();
            	$(this).addClass("cur").siblings().removeClass("cur");
            	if(listnum == "0"){//最新排序
            		$("#sortid>a").html("最新排序<i class='triangle-up'></i>");
            		reloadData("");
            	}else if(listnum == "1"){//销量排序
            		$("#sortid>a").html("销量排序<i class='triangle-up'></i>");
            		reloadData("sales");
            	}
            });
            //重新加载商品数据
            function reloadData(orders){
            	ctrl.orders = orders;
            	ctrl.pageNum = 1;
            	ctrl.flag = true;
            	ctrl.loadData();
            }
            //触底加载
            setREG("document_scroll", ctrl._name, function(){
                if($.getScrollBottom()<3 && ctrl.flag){
            		ctrl.pageNum++;
            		ctrl.loadData();
            	}
            });
    	},
    	 loadData:function(){
         	var ctrl = this;
         	$.get("shop/sKeeperAllGoods.shtml",{
         		shopId:$("#shopId").val(),
         		orders:ctrl.orders,
         		pageNum:ctrl.pageNum,
         		pageSize:ctrl.pageSize
         	},function(data){
         		var goodsList = "";
         		if(data.data && data.data.goodsList){
         			goodsList = data.data.goodsList;
         		}
         		if(ctrl.pageNum == 1){
         			$(".listid>ul").empty();
         		}
         		if(ctrl.pageNum == 1 && (!goodsList || goodsList.length==0)){
         			$(".goodsContent").html(REND("include/empty",{icon:"&#xe678;",tip:"sorry,该店铺暂无商品哦~",price:"1",display:"block",paddingbottom:"1"}));
         		}
         		if(goodsList.length < ctrl.pageSize){
         			ctrl.flag = false;
         		}
         		//<span class="kdl-right">收藏：65</span>暂时先不显示
         		$.each(goodsList,function(i,o){
         			$('\
         				<li>\
         	                <a href="#goods/details?goodsId='+o.id+'&shopId='+$("#shopId").val()+'">\
         	                    <div class="pic">\
         	                        <img src="'+Config.imgPre+o.image+'"/>\
         	                    </div>\
         	                    <div class="txt">\
         	                        <h6 class="color-gray9 ellips">'+o.name+'</h6>\
         	                        <div class="m-top10"><span class="color-red h5">￥'+o.price.toFixed(2)+'</span> <del class="color-gray9 p">￥'+o.originalPrice.toFixed(2)+'</del></div>\
         	                        <div class="color-gray9 p m-top10">返现 <span class="color-gray3">￥'+o.consumeTips.toFixed(2)+'</span></div>\
         	                        <p class="color-gray9 m-top10"><span class="kdl-left">销量：'+o.sales+'</span></p>\
         	                    </div>\
         	                </a>\
         	               <i class="kdl-right iconfont h1" onclick="$.stopPropagation();GO(\'shopKeeper/Management\',{goodsId:'+o.id+',isMarketer:'+o.isMarketable+',isRecommend:'+o.isRecommend+',sellCount:'+o.sales+'})">&#xe643;</i>\
         	            </li>\
         			').appendTo($(".listid>ul"));
         			
         		});
         	})
         },
         _style:"\
         li .pic>img{width:100%;}\
         .content section{position:relative; height:2rem; background:url(img/shopkeeperShops-banner.jpg);z-index: 2;     background-size: cover;}\
         .content section .section-con{ position:absolute; bottom:.15rem; width:100%; height:1rem}\
         .content section .pic{width:1rem; height:1rem; border-radius:50%; overflow:hidden; margin-left:.1rem;border: 1px solid #fff;box-sizing: border-box;}\
         .content section .pic img{width:100%;height:100%;}\
         .content section .txt{ margin-left:.2rem; }\
         .content section .txt .bg-grade{ color:#fff; background-size: contain; text-align:left;text-indent: .52rem;margin-top:.2rem; background-image:url(img/bg-grade.png); width:1.2rem; height:.36rem; display:block;}\
         .content section .collect{ width:1rem; height:.7rem;text-align:center; display:block; position:absolute;right:-.05rem; border-radius:3px; bottom:.08rem; color:#666; background-color:#fff; font-size:.24rem; }\
         .content section .collect>i{display:inline-block; margin-top:1px;}\
		 .content section .collect>p{line-height: .24rem;}\
         .content section .collect .iconfont:before{content:attr(icon1);}\
         .content section .collect.active{background-color:#fff;color:#df494a;}\
         .content section .collect.active .iconfont:before{content:attr(icon2);}\
         .content section .collect.active p:before{content:'已';}\
         .navigation,.sifting,.Sort{position:relative; z-index:2;}\
         .navigation{padding:.2rem 0;box-sizing:border-box; border-bottom:1px solid #e5e5e5; position:relative;}\
         .navigation>span{width:33.33%; heigth:2px; border-bottom:2px solid #df494a; position:absolute; left:0; bottom:0;}\
         .navigation>ul>li{width:33.33%; float:left;}\
         .navigation>ul>li>a{text-align:center; display:block;}\
         .navigation>ul>li>a>i{font-size:.42rem;}\
         .navigation>ul>li>a>p{ margin-top:.15rem;}\
         .sifting>ul{width:80%; float:left;}\
         .sifting>ul>li{float:left; width:30%; height:.8rem; line-height:.8rem;}\
         .sifting>ul>li:first-child{ width:40%!important;}\
         .sifting>a{float:left; box-sizing:border-box; border-left:1px solid #e5e5e5; line-height:.4rem; width:20%;margin-top: .2rem;text-align: center;}\
         .sifting>ul>li>a{position:relative;display:block; text-align:center;}\
         .sifting>ul>li.cur>a{ color:#df494a;}\
         .sifting>ul>li.cur>a>i{    border-top-color: #DF494A;}\
         .sifting>ul>li>a>i{ transform: rotate(180deg); position:relative; border-width: 5px;right: initial; margin-left:.1rem; top: 0.2rem; border-bottom-color: transparent;   border-top-color: #3d3d3d;}\
         .con-list>ul>li{height:2.55rem;margin-top: .05rem; position:relative;}\
         .con-list>ul>li>a{display:block;}\
         .con-list>ul>li>a .pic{width:2.6rem; float:left; height:2.5rem;overflow:hidden; background:url(./img/list-ptobg.jpg) no-repeat;background-size: contain;}\
         .con-list>ul>li>a>div.pic>img{width:100%;}\
         .con-list>ul>li>a .txt{float:right; position:relative; height:2.55rem; width:3.8rem; padding:.05rem .15rem;box-sizing:border-box; border-bottom: 1px solid #e5e5e5;}\
         .con-list>ul>li>i{position:absolute; right:.15rem; bottom:.1rem; z-index:3; color:#666; font-size:.42rem!important;}\
         .con-list2>ul{ padding-left:.1rem; box-sizing:border-box;}\
         .con-list2>ul>li{float:left; width:50%; padding-right:.1rem; padding-bottom:.1rem; box-sizing:border-box;height:5.2rem;}\
         .con-list2>ul>li .pic{width:100%;height:2.9rem; overflow:hidden; background:url(./img/list-ptosbg.jpg) no-repeat;background-size: contain;}\
         .con-list2>ul>li .pic>img{width:100%; height:100%;}\
         .con-list2>ul>li .txt>h6{border-bottom:1px solid #e5e5e5; padding:.1rem 0; height:.7rem; line-height:.4rem;}\
         .con-list2>ul>li .txt p{display:none;}\
         .con-list2>ul>li>i{display:none;}\
         .Sort{display:none;}\
         .Sort>ul>li{ height:.8rem; line-height:.8rem; border-top:1px solid #e5e5e5; padding:0 .2rem; box-sizing:border-box;}\
         .Sort>ul>li>a>i{ color:#fff;}\
         .Sort>ul>li.cur a{ color:#df494a;}\
         .Sort>ul>li.cur a>i{ color:#df494a;}\
         .Sort>ul>li>a{display:block;}\
         "
    },
    /*店主推荐*/
    "shopKeeperManage/recommend":{
    	_title:"店主推荐",
    	_template:{url:"./view/shopKeeper/recommend.ejs"},
        _load: function() {
           this.loadData();
        },
        loadData:function(){
        	 $.get("shop/sKeeperRecommendGoods.shtml",{
         		shopId:$("#shopId").val()
         	},function(data){
         		var goodsList = "";
         		if(data.data && data.data.goodsList){
         			goodsList = data.data.goodsList;
         			$(".listid>ul").empty();
         		}else{
         			alert("网络异常，请稍后重试！");
         			return false;
         		}
         		if(goodsList.length == 0){
         			$(".goodsContent").html(REND("include/empty",{icon:"&#xe631;",tip:"sorry,该店铺暂无推荐的商品哦~",price:"1",display:"block",paddingbottom:"1"}));         			return;
         		}
         		//暂时取消
         		/*<div class="kdl-right">
                 <div class="color-gray6 kdl-left">
                     <span>1.2人</span>
                     <p>加入购物车</p>
                 </div>\
                 <i class="iconfont kdl-left">&#xe625;</i>
                </div>*/
         		$.each(goodsList,function(i,o){
         			$('\
         	           <li>\
         	                <a href="#goods/details?goodsId='+o.id+'&shopId='+$("#shopId").val()+'">\
         	                    <div class="pic">\
         	                        <img src="'+ Config.imgPre +o.image+'"/>\
         	                    </div>\
         	                    <div class="txt">\
         	                        <div class="clearfix headline">\
         	                            <div class="kdl-left">\
         	                                <h6 class="color-gray3 ellips">'+o.name+'</h6>\
         	                                <p class="ellips1 color-gray9">'+o.caption+'</p>\
         	                            </div>\
         	                            <div class="kdl-right p color-red">\
         	                                <p>返现</p>\
         	                               <span>￥'+o.consumeTips.toFixed(2)+'</span>\
         	                            </div>\
         	                        </div>\
         	                        <div class="clearfix m-top30 cost">\
         	                            <div class="kdl-left">\
         	                                <span class="color-red h5">￥'+o.price.toFixed(2)+'</span>\
         	                                <del class="color-gray9 p">￥'+o.originalPrice.toFixed(2)+'</del>\
         	                            </div>\
         	                        </div>\
         	                    </div>\
         	                </a>\
         	            </li>\
         			').appendTo($(".listid>ul"));
         		});
         		
         	})
        },
        _style:"\
         .content section{position:relative; height:2rem; background:url(img/shopkeeperShops-banner.jpg);z-index: 2;    background-size: cover;}\
        .content section .section-con{ position:absolute; bottom:.15rem; width:100%; height:1rem}\
        .content section .pic{width:1rem; height:1rem; border-radius:50%; overflow:hidden; margin-left:.1rem;border: 1px solid #fff;box-sizing: border-box;}\
        .content section .pic img{width:100%;height:100%;}\
        .content section .txt{ margin-left:.2rem; }\
        .content section .txt .bg-grade{ color:#fff; background-size: contain; text-align:left;text-indent: .52rem;margin-top:.2rem; background-image:url(img/bg-grade.png); width:1.2rem; height:.36rem; display:block;}\
        .content section .collect{ width:1rem; height:.7rem;text-align:center; display:block; position:absolute;right:-.05rem; border-radius:3px; bottom:.08rem; color:#666; background-color:#fff; font-size:.24rem; }\
        .content section .collect>i{display:inline-block; margin-top:1px;}\
		.content section .collect>p{line-height: .24rem;}\
        .content section .collect .iconfont:before{content:attr(icon1);}\
        .content section .collect.active{background-color:#fff;color:#df494a;}\
        .content section .collect.active .iconfont:before{content:attr(icon2);}\
        .content section .collect.active p:before{content:'已';}\
        .navigation,.sifting,.Sort{position:relative; z-index:2;}\
        .navigation{padding:.2rem 0;box-sizing:border-box; border-bottom:1px solid #e5e5e5; position:relative;}\
        .navigation>span{width:33.33%; heigth:2px; border-bottom:2px solid #df494a; position:absolute; left:0; bottom:0;}\
        .navigation>ul>li{width:33.33%; float:left;}\
        .navigation>ul>li>a{text-align:center; display:block;}\
        .navigation>ul>li>a>i{font-size:.42rem;}\
        .navigation>ul>li>a>p{ margin-top:.15rem;}\
        .listid>ul>li>a{dispaly:block;}\
        .listid .txt{padding:.2rem; box-sizing:border-box;}\
        .listid .txt .headline .kdl-left{width:4.5rem;}\
        .listid .txt .headline .kdl-right{width:1rem;box-sizing:border-box; text-align:center; border-left:1px solid #e5e5e5; line-height:.38rem;}\
        .listid .txt .cost .kdl-right{ cursor:pointer;   position: relative; z-index: 2; padding:.04rem 0;  width:2.3rem;height:.6rem; border:1px solid #e5e5e5; border-radius:.1rem;}\
        .listid .txt .cost .kdl-right>div{ text-align:center; font-size:.22rem; width:1.5rem;}\
        .listid .txt .cost .kdl-right>i{width:.78rem; text-align:center; font-size:.42rem; line-height:.6rem; border-left:1px solid #e5e5e5;}\
        .reminder{ text-align: center; margin-top: 2rem; display: block;}\
        .reminder>i{ font-size: 1.5rem;}\
        "
    },
    
    /*新品上架*/
    "shopKeeperManage/newArrival": {
    	_title:"新品上架",
    	_template:{url:"./view/shopKeeper/newArrival.ejs"},
        _load: function () {
        	this.loadData();
        },
        loadData:function(){
        	 $.get("shop/sKeeperNewGoods.shtml",{
          		shopId:$("#shopId").val()
          	},function(data){
          		var goodsList = "";
          		if(data && data.data.goodsList){
          			goodsList = data.data.goodsList;
          			$(".listid>ul").empty();
          		}else{
          			alert("网络异常，请稍后重试！");
          			return false;
          		}
          		if(!goodsList || goodsList.length==0){
         			$(".goodsContent").html(REND("include/empty",{icon:"&#xe62d;",tip:"sorry,还没有新上架的商品哦~",price:"1",display:"block",paddingbottom:"1"}));
         			return;
         		}
          		//<li>收藏：65</li>\暂时先不先显示
          		$.each(goodsList,function(i,o){
          			$('\
          				<li>\
          	                <a href="#goods/details?goodsId='+o.id+'&shopId='+$("#shopId").val()+'">\
          	                    <div class="pic">\
          	                        <img src="'+Config.imgPre+o.image+'"/>\
          	                        <span class="new">'+$.Date(o.createDate).format("MM月DD日")+'上新</span>\
          	                    </div>\
          	                    <div class="txt">\
          	                        <div class="clearfix headline">\
          	                            <div class="kdl-left">\
          	                                <h6 class="color-gray3 ellips">'+o.name+'</h6>\
          	                                <p class="ellips1 color-gray9">'+o.caption+'</p>\
          	                            </div>\
          	                        </div>\
          	                        <div class="clearfix m-top10">\
          	                            <span class="color-red h5">￥'+o.price.toFixed(2)+'</span>\
          	                            <del class="color-gray9 p">￥'+o.originalPrice.toFixed(2)+'</del>\
          	                        </div>\
          	                        <ul class="clearfix m-top10 color-gray9">\
          	                            <li>返现 <span class="color-gray3">￥'+o.consumeTips.toFixed(2)+'</span></li>\
          	                            <li>销量：'+o.sales+'</li>\
          	                        </ul>\
          	                    </div>\
          	                </a>\
          	            </li>\
          			').appendTo($(".listid>ul"));
          		});
          		
          	})
        },
        _style: "\
        li .pic>img{width:100%;}\
        .content section{position:relative; height:2rem; background:url(img/shopkeeperShops-banner.jpg);z-index: 2;    background-size: cover;}\
        .content section .coll{margin-left: 1.6rem;margin-top: .12rem;color: #fff;font-size: .22rem;text-align: center;}\
        .content section .section-con{ position:absolute; bottom:.15rem; width:100%; height:1rem}\
        .content section .pic{width:1rem; height:1rem; border-radius:50%; overflow:hidden; margin-left:.1rem;border: 1px solid #fff;box-sizing: border-box;}\
        .content section .pic img{width:100%;height:100%;}\
        .content section .txt{ margin-left:.2rem; }\
        .content section .txt .bg-grade{ color:#fff; background-size: contain; text-align:left;text-indent: .52rem;margin-top:.2rem; background-image:url(img/bg-grade.png); width:1.2rem; height:.36rem; display:block;}\
        .content section .collect{ width:1rem; height:.7rem;text-align:center; display:block; position:absolute;right:-.05rem; border-radius:3px; bottom:.08rem; color:#666; background-color:#fff; font-size:.22rem; }\
        .content section .collect>i{display:inline-block; margin-top:1px;}\
		.content section .collect>p{line-height: .24rem;}\
        .content section .collect .iconfont:before{content:attr(icon1);}\
        .content section .collect.active{background-color:#fff;color:#df494a;}\
        .content section .collect.active .iconfont:before{content:attr(icon2);}\
        .content section .collect.active p:before{content:'已';}\
        .navigation,.sifting,.Sort{position:relative; z-index:2;}\
        .navigation{padding:.2rem 0;box-sizing:border-box; border-bottom:1px solid #e5e5e5; position:relative;}\
        .navigation>span{width:33.33%; heigth:2px; border-bottom:2px solid #df494a; position:absolute; left:0; bottom:0;}\
        .navigation>ul>li{width:33.33%; float:left;}\
        .navigation>ul>li>a{text-align:center; display:block;}\
        .navigation>ul>li>a>i{font-size:.42rem;}\
        .navigation>ul>li>a>p{ margin-top:.15rem;}\
        .listid .pic{ position:relative;}\
        .listid .pic span{ position:absolute; top:.3rem; font-size:.24rem; text-indent: .15rem; right:-.2rem; width:2rem; background:#454642; color:#fff;border-radius:.15rem; height:.5rem;line-height:.5rem;}\
        .listid .txt{ padding:.2rem; box-sizing:border-box;}\
        .listid .txt>ul>li{ width:33.33%; float:left; text-align:left;}\
        "
    },
    
});

})();