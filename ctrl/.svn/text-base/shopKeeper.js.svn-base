(function(){
	/*公用变量和方法*/
	var adMarquee;
	
FORMAT({

    /*店主店铺*/
    "shopKeeper/shopKeeperShops":{
    	_title:"店主店铺",
    	_datas: {/*动态数据 视图中也能使用全局变量 此处取名_datas区别于视图中所有变量的附属对象_data 在js中也可通过DATA(dom)获取该视图的数据 dom为该视图中的任意dom*/
        	data:GET("shop/sInfo.shtml",{shopId:PARAM("shopId")},function(data){
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
        	DO("shopKeeper/allGoods",{},".goodsContent");
            /*滑动栏下跟随划动*/
            $(".navigation li").click(function(){
                $(this).parent().siblings("span").stop().animate({left:$(this).index()*33.33+"%"});
                var listnum  = $(this).index();
                $(".goodsContent").empty();
                if(listnum == "0"){//店铺首页
                	DO("shopKeeper/allGoods",{},".goodsContent");
                }else if(listnum == "1"){//店主推荐
                	DO("shopKeeper/recommend",{},".goodsContent");
                }else if(listnum == "2"){//新品上架
                	DO("shopKeeper/newArrival",{},".goodsContent");
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
            					GO('passport/login',{backUrl:'#shopKeeper/shopKeeperShops?shopId='+$("#shopId").val()}) 
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
            					GO('passport/login',{backUrl:'#shopKeeper/shopKeeperShops?shopId='+$("#shopId").val()})
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
    "shopKeeper/shopKeeperSearch":{
    	_title:"商品搜索",
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
    "shopKeeper/allGoods":{
    	_title:"店铺首页",
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
    "shopKeeper/recommend":{
    	_title:"店主推荐",
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
    "shopKeeper/newArrival": {
    	_title:"新品上架",
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
    
    
    /*店主信息*/
    "shopKeeper/shopKeeperInfo": {
        _title:"店主信息",
        _datas:GET("shopKeeper/toShopKeeperInfo.shtml",function(datas,ctrl){
        	if(datas.noKeeper){
        		ctrl._goShow=false;
        		DO("ucenter/applyShopKeeper");
        		return;
        	}
        	return datas;
        }),
        _load: function(){
        	//文字无缝滚动
        	$(function(){
        		//文字无缝滚动
        		Marquee("headLine",3000);
        	})
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
        },
        _pass: function(){
        	clearInterval(adMarquee);
        },
    	_events: {
    		"#addMerchandise":{
    			click:function(){
                    $(".opo").show(500);
                    $(".theme-popover-mask").show(200);
                }
    		},
    		".opo span.iconfont":{
    			click:function(){
                    $(".opo").hide(500);
                    $(".theme-popover-mask").hide(200);
                }
    		}
    	}
    },
    
    
    /*宝贝管理*/
    "shopKeeper/toGoodOfManage": {
        _title:"宝贝管理",
        pageIsMarketer : null,
    	pageOrder : null,
    	pageGoodsTypeId : null,
        _datas: GET("shopKeeper/getOwnGoods.shtml",{pageNum:PARAM("pageNum",1),pageSize:PARAM("pageSize",6)},function(datas,ctrl){
    		if(datas instanceof Error){
    			ctrl._goError = false;
    			DO('error',datas);
    		}
    		return datas;
        }),
        _footer:false,
        _events:{
        	".loadingWrap":{
        		click:function(){
                    $(this).parent().loadingWrapCancel();
                    $(".screenbox").children().hide();
                    $(".opo").hide();
                }
        	}
        },
        _load: function(){
        	var ctrl = this;
            $("#screen>li").click(function(){
                $(this).addClass("cur").siblings().removeClass("cur");
                $(".screenbox").children().hide();
                var listval=$(this).index();
                if(listval == 0){
                    $("#putaway").show();
                    $(".contentLi").loadingWrap({"z-index":2},"none");
                }else if(listval == 1){
                    $("#Sort").show();
                    $(".contentLi").loadingWrap({"z-index":2},"none");
                }else if(listval == 2){
                    $(".box3").show();
                    $(".contentLi").loadingWrap({"z-index":2},"none");
                }
            })
            $(".screenbox ul>li").click(function(){
                $(this).addClass("cur").siblings().removeClass("cur");
            })


            /*批量管理*/
            $("#BulkManage").click(function(){
                $(".footer").toggleState({style:"display:block"},{style:"display:none"});
                if($(".footer").attr("style") == "display:block"){
                	$(".content>ul").addClass("batch");
                }else{
                	$(".content>ul").removeClass("batch");
                }
                //$(".content>ul>li>a>div.pic>i").toggleState({style:"display:block"},{style:"display:none"});
                if($(".content>ul>li>a>div.pic>i").is(":hidden")){
                	$(".content>ul>li>a>div.pic").unbind("click",$.stopPropagation);
                }else{
                	$(".content>ul>li>a>div.pic").click($.stopPropagation);
                }
            })
             //打开添加宝贝商品面板
            $("#addMerchandise").click(function(){
                $(".opo").show(500);
                $(".theme-popover-mask").show(200);
                $(".theme-popover-mask").css({"top":"0","z-index":"10"});
            }),
            //触底加载数据
            setREG("document_scroll", ctrl._name, function(){
            	if($.getScrollBottom()<3){
            		if(ctrl._datas.isHave){
            			ctrl._datas.ownGoods.pageNum = ctrl._datas.ownGoods.pageNum+1;
       			 		$.getMaxWrap().loadingWrap();
       			 		ctrl.loadMore(ctrl._datas.ownGoods.pageNum,ctrl._datas.ownGoods.pageSize,ctrl.pageIsMarketer,ctrl.pageOrder,ctrl.pageGoodsTypeId);
            		}
            	}
            });
        },
        //关闭添加宝贝商品面板
        closeAddPanel : function(){
        	$(".opo").hide(500);
            $(".theme-popover-mask").hide(200);
        },
        //点击加载更多
        toLoadMore : function(){
        	this._datas.ownGoods.pageNum = this._datas.ownGoods.pageNum+1;
		 	$.getMaxWrap().loadingWrap();
		 	this.loadMore(this._datas.ownGoods.pageNum,this._datas.ownGoods.pageSize,this.pageIsMarketer,this.pageOrder,this.pageGoodsTypeId);
        },
        //加载更多商品
        loadMore : function(pageNum,pageSize,isMarketer,orders,goodsTypeId){
        	var ctrl = this;
        	$.get(
    			"shopKeeper/getOwnGoods.shtml",
    			{
    				pageNum : pageNum,
    				pageSize : pageSize,
    				isMarketer : isMarketer,
    				orders : orders,
    				goodsTypeId : goodsTypeId
    			},
    			function(datas){
    				$("html,body").loadingWrapCancel();
    				var ownGoodsList = datas.data.ownGoods.list;
    				$(".reminderDiv").show();
    				$("#noDataDiv").hide();
    				$(".contentLi").show();
    				if(ownGoodsList != null && ownGoodsList.length > 0){
    					var ownGoodsLength = ownGoodsList.length;
    					var temp = "";
    					for(var i = 0;i<ownGoodsLength;i++){
    						temp += '<li class="clearfix ">' +
		    				            '<a href="javascript:;" onclick="GO(\'goods/details\',{isExist:true,goodsId:'+ownGoodsList[i].goodsId+',isMarketer:'+ownGoodsList[i].isMarketer+',sellCount:'+ownGoodsList[i].goods.sales+',shopId:1})" class="clearfix">' +
				    		                '<div class="pic">' +
				    		                    '<i class="iconfont goodsItem" itemId="'+ownGoodsList[i].goodsId+'" onclick="this.ctrl.chooseItem(this)">&#xe63d;</i>' +
				    		                    '<img src="'+Config.imgPre+ownGoodsList[i].goods.image+'"/>' +
				    		                    '<div class="bt">' +
				    		                        '<div></div>' +
				    		                        '<p>'+ownGoodsList[i].shop.shopName+'</p>' +
				    		                    '</div>' +
				    		                '</div>' +
				    		                '<div class="txt">' +
				    		                    '<h6 class="ellips">'+ownGoodsList[i].goods.name+'</h6>' +
				    		                    '<h5 class="color-red">￥'+ownGoodsList[i].goods.price.toFixed(2)+'</h5>' +
				    		                    '<p class="color-gray6">'+ownGoodsList[i].goods.sales+'人在卖</p>' +
				    		                    '<div>' +
				    		                        '<button disabled="disabled">' +
				    		                        (ownGoodsList[i].isMarketer?'已上架':'未上架')+
				    		                        '</button>' +
				    		                        '<i class="iconfont" onclick="$.stopPropagation();GO(\'shopKeeper/Management\',{goodsId:'+ownGoodsList[i].goodsId+',isMarketer:'+ownGoodsList[i].isMarketer+',isRecommend:'+ownGoodsList[i].isRecommend+',sellCount:'+ownGoodsList[i].goods.sales+'})"></i>' +
				    		                    '</div>' +
				    		                '</div>' +
				    		            '</a>' +
				    		            '<div class="box clearfix">' +
				    		                '<ul class="clearfix">' +
				    		                    '<li>消费返现:<em class="color-red">¥'+ownGoodsList[i].goods.consumeTips.toFixed(2)+'</em></li>' +
				    		                    '<li>销售提成:<em class="color-red">¥'+ownGoodsList[i].goods.sellTips.toFixed(2)+'</em></li>' +
				    		                    '<li>推广佣金:<em class="color-red">¥'+ownGoodsList[i].goods.expandTips.toFixed(2)+'</em></li>' +
				    		                '</ul>' +
				    		            '</div>' +
				    		        '</li>';
    					}
    					if(pageNum == 1){
    						$(".contentLi").html("");
    					}
    					$(".contentLi").append(temp);
    					ctrl._datas.isHave = true;
    	                if($(".content>ul>li>a>div.pic>i").is(":hidden")){
    	                	$(".content>ul>li>a>div.pic").unbind("click",$.stopPropagation);
    	                }else{
    	                	$(".content>ul>li>a>div.pic").click($.stopPropagation);
    	                }

    				}
    				if(ownGoodsList == null || ownGoodsList.length == 0){
    					ctrl._datas.isHave = false;
    					if(pageNum == 1){
    						$(".contentLi").html("");
    						$(".contentLi").hide();
    						$("#noDataDiv").show();
    						$(".reminderDiv").hide();
    					}else{
    						$("#loadMore").html("没有更多");
    					}
    				}else if(ownGoodsList.length < 6){
    					ctrl._datas.isHave = false;
    					$("#loadMore").html("没有更多");
    				}
    			},
    			"json"
    		);
        },
        checkContent:function(){
        	var li=this._dom.find(".contentLi li");
        	if(li.length>0){
        		li.find("div.pic").hide();
        	}else{
        		li.find("div.pic").show();
        	}
        },
        //选择是否上架
        choosePageIsMarketer : function(tempIsMarketer,tempVal){
        	this.pageIsMarketer = tempIsMarketer;
        	this._datas.ownGoods.pageNum = 1;
        	this.loadMore(1,6,this.pageIsMarketer,this.pageOrder,this.pageGoodsTypeId);
        	this.checkContent();
        	$("#putaway").hide();
        	$(".contentLi").loadingWrapCancel();
        	$("#putawaySpan").html(tempVal);
        },
        //改变排序方式
        choosePageOrder : function(tempOrder,tempVal){
        	this.pageOrder = tempOrder;
        	this._datas.ownGoods.pageNum = 1;
        	this.loadMore(1,6,this.pageIsMarketer,this.pageOrder,this.pageGoodsTypeId);
        	this.checkContent();
        	$("#Sort").hide();
        	$(".contentLi").loadingWrapCancel();
        	$("#sortSpan").html(tempVal);
        },
        //选择商品类型
        choosePageGoodsTypeId : function(tempPageGoodsTypeId){
        	this.pageGoodsTypeId = tempPageGoodsTypeId;
        	this._datas.ownGoods.pageNum = 1;
        	this.loadMore(1,6,this.pageIsMarketer,this.pageOrder,this.pageGoodsTypeId);
        	this.checkContent();
        	$(".box3").hide();
        	$(".contentLi").loadingWrapCancel();
        },
        //选择要操作的商品
        chooseItem : function(item){
        	if($(item).hasClass("color-red")){
        		$(item).removeClass("color-red");
        		if($(".color-red.goodsItem").length != $(".goodsItem").length){
        			$(".allItemBtn").removeClass("color-red").addClass("color-gray6");
        		}
        	}else{
        		$(item).addClass("color-red");
        		if($(".color-red.goodsItem").length == $(".goodsItem").length){
        			$(".allItemBtn").removeClass("color-gray6").addClass("color-red");
        		}
        	}
        },
        //全选操作
        chooseAllItem : function(item){
        	if($(item).hasClass("color-red")){
        		$(".goodsItem").removeClass("color-red");
        		$(item).removeClass("color-red");
        		$(item).addClass("color-gray6");
        	}else{
        		$(".goodsItem").addClass("color-red");
        		$(item).addClass("color-red");
        		$(item).removeClass("color-gray6");
        	}
        },
        //上架商品
        marketerGoods : function(){
        	var goodsIds = $(".color-red.goodsItem").map(function(){
        		return $(this).attr("itemId");
        	}).get();
        	if(goodsIds == null || goodsIds.length < 1){
        		alert("请先选择要操作的商品");
        		return;
        	}
        	$.post(
        		"shopKeeper/changeShopKeeperGoods.shtml",
        		{
        			goodsIds : goodsIds,
        			isMarketer : true
        		},
        		function(datas){
        			if(datas.status == 1){
    					alert(datas.data.content,RELOAD);
    				}else{
    					alert(datas.errorMsg);
    				}
        		},
        		"json"
        	);
        },
        //下架商品
        unMarketerGoods : function(){
        	var goodsIds = $(".color-red.goodsItem").map(function(){
        		return $(this).attr("itemId");
        	}).get();
        	if(goodsIds == null || goodsIds.length < 1){
        		alert("请先选择要操作的商品");
        		return;
        	}
        	$.post(
        			"shopKeeper/changeShopKeeperGoods.shtml",
        			{
        				goodsIds : goodsIds,
            			isMarketer : false
            		},
        			function(datas){
        				if(datas.status == 1){
        					alert(datas.data.content,RELOAD);
        				}else{
        					alert(datas.errorMsg);
        				}
        			},
        			"json"
        	);
        },
        //取消商品代销
        deleteGoods : function(){
        	var goodsIds = $(".color-red.goodsItem").map(function(){
        		return $(this).attr("itemId");
        	}).get();
        	if(goodsIds == null || goodsIds.length < 1){
        		alert("请先选择要操作的商品");
        		return;
        	}
        	$.post(
        			"shopKeeper/changeShopKeeperGoods.shtml",
        			{
            			goodsIds : goodsIds,
            			type : "delete"
            		},
        			function(datas){
            			if(datas.status == 1){
            				GO("shopKeeper/toGoodOfManage");
        				}else{
        					alert(datas.errorMsg);
        				}
        			},
        			"json"
        	);
        },
        _pass:function(){
        	//接触滚动绑定
        	$(document).unbind("scroll");
        },
    },
    
    
    /*商品管理*/
    "shopKeeper/Management": {
        _title: "商品管理",
        _links:{
            "./css/ios-switch.css":"css"
        },
        _footer:false,
        _load: function () {
        	var goodsId = _param.goodsId;
            //上下架商品
            $("#goodsShelf").click(function(){
                var text =$("#goodsShelf>p").text();
                if(text=="上架"){
                    //上架商品
                    $.post(
            			"shopKeeper/changeShopKeeperGoods.shtml",
            			{
                			goodsIds : goodsId,
                			isMarketer : true
                		},
            			function(datas){
                			if(datas.status == 1){
            					alert(datas.data.content);
            					if(datas.data.flag){
            						//成功
            						$("#goodsShelf>p").text("下架");
            	                    $("#goodsShelf>i").text("");
            					}
            				}else{
            					alert(datas.errorMsg);
            				}
            			},
            			"json"
                	);
                }else{
                	//下架商品
                	$.post(
            			"shopKeeper/changeShopKeeperGoods.shtml",
            			{
                			goodsIds : goodsId,
                			isMarketer : false
                		},
            			function(datas){
                			if(datas.status == 1){
            					alert(datas.data.content);
            					if(datas.data.flag){
            						//成功
            						$("#goodsShelf>p").text("上架");
            	                    $("#goodsShelf>i").text("");
            					}
            				}else{
            					alert(datas.errorMsg);
            				}
            			},
            			"json"
                	);
                }
            })
        },
        //取消代销
        deleteGoods : function(){
        	$.post(
				"shopKeeper/changeShopKeeperGoods.shtml",
				{
	    			goodsIds : _param.goodsId,
	    			type : "delete"
	    		},
				function(datas){
	    			if(datas.status == 1){
	    				GO("shopKeeper/toGoodOfManage");
					}else{
						alert(datas.errorMsg);
					}
				},
				"json"
	    	);
        },
        //选择是否店长推荐
        switchRecommend : function(item){
        	if($("#goodsShelf>p").text() == "上架"){
        		alert("请先上架当前商品才能进行推荐！");
        		$(item).removeAttr("checked");
        		return;
        	}
        	$.post(
				"shopKeeper/recommendShopKeeperGoods.shtml",
				{
					goodsId : _param.goodsId,
	    		},
				function(datas){
	    			if(datas.status == 1){
	    				if(!datas.data.flag){
	    					$(item).removeAttr("checked");
	    				}
						alert(datas.data.content);
					}else{
						$(item).removeAttr("checked");
						alert(datas.errorMsg);
					}
				},
				"json"
	    	);
        }
    },
    
    /**小铺头条列表*/
    "shopKeeper/shopTop": {
        _title: "小铺头条",
        _footer: false,
        pageNum : 1,
        pageSize : 6,
        _datas:GET("shopTop/getShopTopList.shtml",{
        	pageNum : 1,
        	pageSize : 6
        },function(datas,ctrl){
        	return datas;
        }),
        _load: function () {
        	var ctrl = this;
        	//触底加载数据
            setREG("document_scroll", ctrl._name, function(){
            	if($.getScrollBottom()<3){
            		if($("#loadMore").attr("hasMore") == "true"){
            			ctrl.loadMore();
            		}
            	}
            });
        },
        //加载更多
        loadMore : function(){
        	var ctrl = this;
        	if($("#loadMore").attr("hasMore") == "true"){
        		$.get("shopTop/getShopTopList.shtml",{
        			pageNum : ++ctrl.pageNum,
                	pageSize : ctrl.pageSize
        		},function(datas){
        			var shopTopList = datas.data.shopTopList;
        			if(shopTopList != null && shopTopList.length > 0){
        				var temp  = "";
        				for(var i=0;i < shopTopList.length;i++){
        					temp += '<li onclick="GO(\'shopKeeper/shopTopInfo\',{id:'+shopTopList[i].id+'})">'+
		        			            '<a href="javascript:;">'+
				        	                '<h5>'+shopTopList[i].title+'</h5>'+
				        	                '<p>'+shopTopList[i].createDate+'</p>'+
				        	            '</a>'+
				        	        '</li>';
        				}
        				$("#shopTopsContent").append(temp);
        				if(shopTopList.length < 6){
        					$("#loadMore").attr("hasMore",false);
            				$("#loadMore").html("没有更多");
        				}else{
        					$("#loadMore").attr("hasMore",true);
        					$("#loadMore").html("加载更多");
        				}
        			}else{
        				//没有更多
        				$("#loadMore").attr("hasMore",false);
        				$("#loadMore").html("没有更多");
        			}
        		});
        	}
        }
    },
    
    /**小铺头条列表内容*/
    "shopKeeper/shopTopInfo": {
        _title: "小铺头条内容",
        _footer: false,
        _datas:GET("shopTop/toShopTopDetail.shtml",{id:PARAM("id",null)},function(data){
        	return data;
        }),
        _load: function () {
        }
    },
    
    /**首页店主小铺*/
    "shopKeeper/shopkeeperShop": {
        _title: "店主小铺",
        _footer: false,
        pageNum : 1,
        loadMoreFlag : true,
        _datas:GET("shop/toShopkeepShop.shtml",function(data){
        	return data;
        }),
        _load: function () {
        	var ctrl = this;
        	if(ctrl._datas.shopId != null){ //已登录
    			$("#aboutXiaoPu").html("我的小铺");
    		}else{ //未登录或没有店主小铺
    			$("#aboutXiaoPu").html("开启小铺");
    		}
            $(".content .hd>ul>li").click(function(){
                $(this).addClass("cur").siblings().removeClass("cur");
            });
            
          //触底加载数据
            setREG("document_scroll", ctrl._name, function(){
            	if($.getScrollBottom()<3 && $("#loadMore").html() == "加载更多"){
            		//加载页面数据
                    ctrl.loadKeeperShop();
            	}
            });
            //加载页面数据
            ctrl.loadKeeperShop();
        },
        //加载店主小铺
        loadKeeperShop : function(orderType){
        	var ctrl = this;
        	if(!ctrl.loadMoreFlag){
        		return;
        	}
        	$.ajax({
        		url:Config.basePath + "shop/getShopkeepShop.shtml",
        		data:{
        			keyword : $("#keyword").val(),
        			orderType : orderType,
            		pageNum : ctrl.pageNum,
            		pageSize : 6
        		},
        		dataType:"json",
        		async:false,
        		type:"get",
        		success:function(datas){
            		if(datas.data && datas.data.shopList && datas.data.shopList.length > 0){
            			var shopList = datas.data.shopList;
            			if(shopList.length < 6){
            				ctrl.loadMoreFlag = false;
            				$("#loadMore").html("亲，已经到底了~~");
            			}else if(shopList.length <= 0 && shopList.length > 6){
            				return;
            			}
            			ctrl.pageNum++;
            			var temp = "";
            			for(var i = 0;i < shopList.length;i++){
            				var shop = shopList[i];
            				var goodsList = shop.goodsList;
            				var goodsTemp = "";
            				if(goodsList != null && goodsList.length > 0){
            					for(var j = 0;j<goodsList.length;j++){
            						var goods = goodsList[j];
            						goodsTemp += '<li>\
    				                                <a href="javascript:;" onclick="GO(\'goods/details\',{goodsId:'+goods.id+',shopId:'+shop.id+'})">\
    				                                    <div class="pto">\
    				                                        <img src="'+Config.imgPre + goods.image +'"/>\
    				                                    </div>\
    				                                    <div class="mask"></div>\
    				                                    <p class="color-white">返￥'+goods.consumeTips.toFixed(2)+'</p>\
    				                                </a>\
    				                            </li>';
            					}
            				}
            				temp += '<li>\
    		        		            <div class="tit" onclick="GO(\'shopKeeper/shopKeeperShops\',{shopId:'+shop.id+'})">\
    				                        <div class="pic">\
    				                            <img src="'+Config.imgPre + shop.avatar+'"/>\
    				                        </div>\
    				                        <div class="txt">\
    				                            <h5 class="color-gray6">'+shop.shopName+'</h5>\
    				                            <img src="'+Config.imgPre + shop.shopRank.icon+'"/><span class="color-gray9 kdl-right" style="margin-top: .15rem;">订单量（'+shop.ordersCount+'）</span>\
    				                            <h6 class="color-gray6">销售收入：<cite class="color-red">￥'+shop.user.sumSellTips.toFixed(2)+'</cite></h6>\
    				                        </div>\
    				                    </div>\
    				                    <div class="tit-con">\
    				                        <div class="txt color-gray6">返现最高</div>\
    				                        <ol class="clearfix">\
    				                            '+goodsTemp+'\
    				                        </ol>\
    				                    </div>\
    				                </li>';
            			}
            			$("#shopContent").append(temp);
            			$(".reminder").css("display","none");
            			$("#loadMore").show();
            		}else{
            			ctrl.loadMoreFlag = false;
            			$("#loadMore").html("亲，已经到底了~~");
            			if($("#shopContent").children("li").length < 1){
            				$(".reminder").css("display","block");
            				$("#loadMore").hide();
            			}
            		}
        		}
        	});
        },
        //点击加载更多
        loadMore :function(){
        	this.loadKeeperShop($("ul.clearfix").find("li.cur").attr("orderType"));
        },
        //选择排序方式
        chooseOrderType : function(orderType){
        	$("#loadMore").html("加载更多");
        	this.loadMoreFlag = true;
        	$("#shopContent").empty();
        	this.pageNum = 1;
        	this.loadKeeperShop(orderType);
        },
        //开启小铺、我的小铺按钮
        aboutXiaoPu : function(){
        	var ctrl = this;
        	if($("#aboutXiaoPu").html() == "我的小铺"){ //已登录
        		GO("shopKeeperManage/shopKeeperShops");
        	}else{ //未登录
        		if(!ctrl._datas.isLogin){
        			GO("passport/login",{backUrl:"#shopKeeperManage/shopkeeperShop"});
        		}else{
        			GO("ucenter/applyShopKeeper");
        		}
        	}
        }
    },
    
    /**等级详情*/
    "shopKeeper/gradeDetails": {
        _title: "等级详情",
        _footer: false,
        _datas: GET("shop/personalShop.shtml",{type:PARAM("type","sKeeper")},function(data,ctrl){
    		if(data instanceof Error){
    			ctrl._goError = false;
    			DO('error',data);
    		}
    		return data;
        }),
        _load: function () {
        	
        }
    },
    
    /** 返现专区 */
    "shopKeeper/cashBack" : {
    	_title: "返现专区",
        _footer: false,
        _datas:GET("goods/toCashBack.shtml",{areaId:function(){return Config.area.id}},function(data){
        	return data;
        }),
        goodsCategoryId : null, //商品分类Id
        categoryId : null, //生活分类Id
        areaId : null, //地区Id
        pageNum : 1, 
        orders : null, //排序方式
        keyword : null, //关键字
        hasMore : true, //是否可以加载
        isLocal : null, //是否是本地商品
        _load: function () {
        	this.loadCashBackGoods();
        	var ctrl =this;
    		if(_param.keyword){
    			ctrl.keyword=_param.keyword;
    			$("#keyword").text(_param.keyword);
    		}else{
    			$("#keyword").text("搜索店内商品/服务");
    		}
    		/*切换风格*/
            $("#conList").click(function(){
                var text =$(this).text();
                if($(this).text()==""){
                    $(this).text("");
                    $(".listid").removeClass('biserial');
                }
                else{
                    $(this).text("");
                    $(".listid").addClass('biserial');
                }
            });
            /*tab切换*/
            var hi=$(document).height();
            $("#screen>li").click(function(){
                $(this).addClass("cur").siblings().removeClass("cur");
                var listval=$(this).index();
                if(listval == 0){
                    $("#classify").siblings().hide();
                    $("#classify").toggle();
                    if($("#classify").css('display')=='block'){
                        $(".theme-popover-mask").show();
                        $("body").css({"height":hi,"overflow":"hidden"});
                    }
                    else{
                    	$("body").css({"height":"auto","overflow":"scroll"});
                        $(".theme-popover-mask").hide();
                        if($("#hasSelCategory").html().trim() != $("#categoryList .cur").find("a").html().trim()){
                        	 $("#categoryList li").each(function(){
                        		 if($(this).find("a").html().trim() == $("#hasSelCategory").html().trim()){
                        			 $(this).addClass("cur").siblings().removeClass("cur");
                        		 }
                        	 })
                        }
                    }
                }else if(listval == 1){
                    $("#Sort").siblings().hide();
                    $("#Sort").toggle();
                    if($("#Sort").css('display')=='block'){
                        $(".theme-popover-mask").show();
                        $("body").css({"height":hi,"overflow":"hidden"});
                    }
                    else{
                        $(".theme-popover-mask").hide();
                        $("body").css({"height":"auto","overflow":"scroll"});
                    }
                }else if(listval == 2){
                    $("#city").siblings().hide();
                    $("#city").toggle();
                    if($("#city").css('display')=='block'){
                        $(".theme-popover-mask").show();
                        $("#city").css({"overflow-y":"scroll"});
                        $("body").css({"height":hi,"overflow":"hidden"});
                    }
                    else{
                        $(".theme-popover-mask").hide();
                        $("body").css({"height":"auto","overflow":"scroll"});
                    }
                }
            })
            $(".theme-popover-mask").click(function(){
                $(this).hide();
                $("body").css({"height":"auto","overflow":"scroll"});
                $("#classify").siblings().hide();
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
                var num=sum-(nav*6);
                $('#classify,#city').css("height",num);
            });
            //选择排序方式
            $("#Sort li").click(function(){
            	if($(this).hasClass("cur")){
            		$(".screen-box").children().hide();
	        		$(".theme-popover-mask").hide();
            		return false;
            	}
            	var curOrders = $(this).find("input").val();
            	$(this).addClass("cur").siblings().removeClass("cur");
            	if(curOrders==""){
            		ctrl.orders = null;
            	}else{
            		ctrl.orders = curOrders;
            	}
            	ctrl.pageNum = 1;
            	ctrl.hasMore = true;
            	$("#hasMore").html("加载更多");
		        $("#hasSelOrders").html($(this).find("font").html());
		        $(".screen-box").children().hide();
        		$(".theme-popover-mask").hide();
		        $("#goodsContents").empty();
		        ctrl.loadCashBackGoods();
            })
            
            //滚动条下滑
            setREG("document_scroll", ctrl._name, function(){
            	 if(ctrl.hasMore && $.getScrollBottom()<3){
            		 ctrl.loadCashBackGoods();
            	 }
            });
            
            
        },
        //选择生活分类
        selCategory : function(obj,categoryId,categoryName){
        	$.ajax({
				url:"category/getGoodsCategory.shtml",
				data:{"categoryId":categoryId},
				async:false,
				dataType:"json",
				type:"post",
				success:function(data){
					if(data.status==0){
						alert(data.errorMsg);
						return false;
					}
					$("#addGoodsCate").siblings().remove();
					var html = "";
					$.each(data.data.goodsCategory, function (n, obj) {
						html+=  "<li onclick='this.ctrl.selGoodsCategory(this,"+obj.id+","+categoryId+");'>"
	                    		   +"<a href='javascript:'>"
								   		+obj.name
								   +"</a>"
								+"</li>";
					});
					$("#addGoodsCate").show()
					$("#addGoodsCate").after(html);
					$(obj).addClass("cur").siblings().removeClass("cur");
				},
				error:function(data){
					alert("亲，系统错误请您稍后再试！");
				}
			});
        },
        //选择商品分类
        selGoodsCategory : function(obj,goodsCategoryId,categoryId){
        	this.categoryId = categoryId;
        	$(obj).addClass("cur");
    		$("#hasSelCategory").html($("#categoryList .cur").find("a").html().trim());
        	$(obj).addClass("cur").siblings().removeClass("cur");
        	if(!$("#categoryList .cur").find("a").html().trim()=="全部"){
        		if(goodsCategoryId==null || goodsCategoryId == ""){
        			if($("#hasSelCategory").html().trim() == $("#categoryList .cur").find("a").html().trim()){
        				$(".screen-box").children().hide();
        				$(".theme-popover-mask").hide();
        				return false;
        			}
        		}else{
        			if($("#hasSelCategory").html().trim() == $(obj).find("a").html().trim()){
        				$(".screen-box").children().hide();
        				$(".theme-popover-mask").hide();
        				return false;
        			}
        		}
        	}
	        this.goodsCategoryId = goodsCategoryId;
	        this.pageNum = 1;
	        this.hasMore = true;
	        $("#hasMore").html("加载更多");
	        $(".screen-box").children().hide();
    		$(".theme-popover-mask").hide();
	        $("#goodsContents").empty();
	        if(!this.categoryId){
	        	$("#addGoodsCate").siblings().remove();
	        	$("#addGoodsCate").hide();
	        }
	        this.loadCashBackGoods();
        },
        //选择地区
        selArea : function(obj,areaId){
        	if($(obj).hasClass("cur")){
        		$(".screen-box").children().hide();
         		$(".theme-popover-mask").hide();
        		return false;
        	}
        	$(obj).addClass("cur").siblings().removeClass("cur");
        	this.areaId=areaId;
        	this.pageNum = 1;
	        this.hasMore = true;
	        $("#hasMore").html("加载更多");
	        $("#hasSelArea").html($(obj).find("font").html());
	        $(".screen-box").children().hide();
    		$(".theme-popover-mask").hide();
	        $("#goodsContents").empty();
	        this.loadCashBackGoods();
        },
        //根据关键字搜索
        searchByKeyword : function(){
        	this.pageNum = 1;
        	this.hasMore = true;
        	$("#hasMore").html("加载更多");
        	 $("#goodsContents").empty();
        	this.loadCashBackGoods();
        },
        //加载返现商品
        loadCashBackGoods : function(){
        	var ctrl = this;
        	if(this.hasMore){
        		var position = null;
        		$.getPosition(function(x,y){
        			position = x+","+y;
        			$.ajax({
        				url:Config.basePath + "goods/search.shtml",
        				data:{
        					position : position,
        					cityName : function(){return Config.area.name},
        					isLocal : ctrl.isLocal,
        					keyword : $("#keyword").val(),
        					categoryId : ctrl.categoryId,
        					goodsCategoryId : ctrl.goodsCategoryId,
        					cityId : function(){return Config.area.id;},
        					areaId : ctrl.areaId,
        					orders : ctrl.orders,
        					cowrieStatus : "pass",
        					pageNum : ctrl.pageNum,
        					pageSize : 6
        				},
        				dataType:"json",
        				async:false,
        				type:"get",
        				success:function(datas){
        					$(".reminder").css("display","none");
        					if(datas.data && datas.data.goodsList && datas.data.goodsList.length){
        						ctrl.isLocal = datas.data.local;
        						if(datas.data.goodsList.length < 6){
        							ctrl.hasMore = false;
        							$("#hasMore").html("暂无更多");
        						}
        						var goodsList = datas.data.goodsList;
        						var temp = "";
        						for(var i =0;i<goodsList.length;i++){
        							var item = goodsList[i];
        							var distance = "无法获取";
        							if(datas.data.local){
        								distance = item._district;
        							}else{
        								distance = item._distance+"m";
        							}
        							temp += "<a href='javascript:;' onclick='GO(\"goods/details\",{goodsId:"+item.goodsId+",shopId:1})'>\
        							<div class='pic'>\
        							<img src='"+Config.imgPre + item.image+"'/>\
        							<div class='bt'>\
        							<div></div>\
        							<p>"+item.shopName+"</p>\
        							</div>\
        							</div>\
        							<div class='txt'>\
        							<h6 class='ellips'>"+item._name+"</h6>\
        							<h5 class='color-red'>￥<font>"+item.price.toFixed(2)+"</font><span class='cashback'>返￥"+item.consumeTips.toFixed(2)+"</span></h5>\
        							<p class='color-gray9'>好评率"+item.score+"%</p>\
        							<p class='color-gray9'>销量："+item.sales+"<em class='kdl-right color-red'>"+distance+"</em></p>\
        							</div>\
        							</a>";
        						}
        						$("#goodsContents").append(temp);
        						ctrl.pageNum++;
        						$("body").css({"height":"auto","overflow":"scroll"});
        					}else{
        						if($("#goodsContents a").length < 1){
        							//没有任何商品
        							ctrl.hasMore = false;
        							$("#hasMore").html("");
        							$(".reminder").css("display","block");
        						}else{
        							ctrl.hasMore = false;
        							$("#hasMore").html("暂无更多");
        						}
        					}
        				}
        			});
        		})
        	}
        }
    }
});

})();