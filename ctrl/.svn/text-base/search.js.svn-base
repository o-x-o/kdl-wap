(function(){
	/*公用变量和方法*/


FORMAT({
    /*搜索*/
    "search/search": {
        _title:"搜索",
        _footer:false,
        _load: function(){
        	//切换商品、店铺搜索标签
            $(".icon-search").click(function(){
               $(".searchbox").toggle();

            });
            //选择商品、店铺标签
            $(".searchbox li").click(function(){
            	var searchType = $(this).find("cite").html();
                $("#Handover em").html(searchType);
                $(".searchbox").hide();
                if(searchType == "商品"){
                	$(".goodsHot").show();
                	$(".shopHot").hide();
                	$("#searchValue").attr("placeHolder","请输入商品名称");
                	$("#searchUrl").attr("searchUrl","search/goodsSearch");
                }else{
                	$(".goodsHot").hide();
                	$(".shopHot").show();
                	$("#searchValue").attr("placeHolder","请输入店铺名称");
                	$("#searchUrl").attr("searchUrl","search/shopSearch");
                }
            });
            $(".hotSearch > li").click(function(){
            	var searchValue=$(this).find("a").html();
            	$("#searchValue").val(searchValue);
            	$("#searchBtn").click();
            });
        },
        toSearch : function(item){
        	if($("#searchValue").val() == ""){
        		alert("请先输入要搜索的内容");
        		return;
        	}
        	var $cont=this._dom.find(".content");
        	$cont.loadingWrap({top:".9rem"});
        	$.getPosition(function(x,y,cityname){
        		$cont.loadingWrapCancel();
        		var a = 0;
        		var b = 0;
        		if(x){
        			a = x;
        		}
        		if(y){
        			b=y;
        		}
     			var searchUrl = $("#searchUrl").attr("searchUrl") + "?position=" + a + "," + b + "&cityName="+Config.area.name+"&keyword=" + $("#searchValue").val() + "&cityId=" + Config.area.id;
     			//var searchUrl = $("#searchUrl").attr("searchUrl") + "?position=123.480862,41.787606&keyword=" + $("#searchValue").val() + "&cityId=466";
     			GO(searchUrl);
     		});
        },
        monitor:function(){
        	if(event.keyCode == 13){
        		$("#searchBtn").click();
        	}
        }
        
    },
	

	/** 商品搜索 */
	"search/goodsSearch": {
	    _title:"商品搜索",
	    _footer:false,
	    isHave : true,
	    pageOrders : null,
    	pageMinPrice : null,
    	pageMaxPrice : null,
    	pageAreaId : null,
    	pageCowrieStatus : null,
    	isLocal:null,
    	pagePageNum : 1,
	    _datas: {
        	data:GET("goods/search.shtml",
        		 {
        			position:PARAM("position"),
        			keyword:PARAM("keyword"),
        			categoryId:PARAM("categoryId"),
        			goodsCategoryId:PARAM("goodsCategoryId"),
        			cityId:function(){return Config.area.id;},
        			cityName:function(){return Config.area.name;},
        			isLocal:PARAM("isLocal"),
        			areaId:PARAM("areaId"),
        			minPrice:PARAM("minPrice"),
        			maxPrice:PARAM("maxPrice"),
        			goodsTypeId:PARAM("goodsTypeId"),
        			orders:PARAM("orders"),
        			cowrieStatus:PARAM("cowrieStatus"),
        			pageNum:PARAM("pageNum",1),
        			pageSize:PARAM("pageSize",6)
        		 },
        		 function(data,ctrl){
        			ctrl.isLocal = data.local;
    				return data;
        	})
        },
	    _load: function(){
	    	var pageThis = this;
	        //获取地区
	        $.get("area/findAreas.shtml",{
	        	grade : 2,
	        	parentId : _param.cityId
	        },function(datas){
	        	var areaList = datas.data.areaList;
	        	if(areaList != null && areaList.length > 0){
	        		var temp = "";
	        		for(var i = 0;i < areaList.length;i++){
	        			temp += '<li>'+
				                    '<a href="javascript:;" onclick="this.ctrl.toSearchByCity(this,'+areaList[i].id+')"><span>'+areaList[i].name+'</span><i class="kdl-right iconfont">&#xe653;</i></a>'+
				                '</li>';
	        		}
	        		$("#areaUl").append(temp);
	        	}
	        });
	        
	        //触底加载
	        setREG("document_scroll", pageThis._name, function(){
            	if($.getScrollBottom()<3 && pageThis.isHave){
            		pageThis.pagePageNum++;
            		pageThis.searchFun();
            	}
            });
	        
	        /*tab切换*/
	        $("#screen>li").click(function(){
	            $(this).addClass("cur").siblings().removeClass("cur");
	            var listval=$(this).index();
	            if(listval == 1){
	            	$(".siftingbox>div").hide();
	            	$(".siftingbox").hide();
	            	$(".theme-popover-mask").hide();
	            }else if(listval == 0){
	                $(".Sort").siblings().hide();
	                $(".Sort").toggle();
	                if($(".Sort").css('display')=='block'){
	                    $(".theme-popover-mask").show();
	                    $(".siftingbox").show();
	                }
	                else{
	                    $(".theme-popover-mask").hide();
	                    $(".siftingbox").hide();
	                }
	            }else if(listval == 2){
	                $(".city").siblings().hide();
	                $(".city").toggle();
	                if($(".city").css('display')=='block'){
	                    $(".theme-popover-mask").show();
	                    $(".siftingbox").show();
	                }
	                else{
	                    $(".theme-popover-mask").hide();
	                    $(".siftingbox").hide();
	                }
	            }else if(listval == 3){
	                $(".screening").siblings().hide();
	                $(".screening").toggle();
	                if($(".screening").css('display')=='block'){
	                    $(".theme-popover-mask").show
	                    ();
	                    $(".siftingbox").show();
	                }
	                else{
	                    $(".theme-popover-mask").hide();
	                    $(".siftingbox").hide();
	                }
	            }
	        });
	        $(".char li").click(function(){
	            $(this).addClass("cur").siblings().removeClass("cur");
	        });
	        $(".theme-popover-mask").click(function(){
	            $(".siftingbox>div").hide();
	            $(this).hide();
	        });
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
	            $('.city').css("height",num);
	        });
	        
	    },
	    //搜索商品
	    searchFun : function(){
	    	var pageDatas = this;
	    	var keyword = $("#searchValue").val();
	    	var cityId = Config.area.id;
	    	var cityName = Config.area.name;
	    	var ctrl=this;
	    	var param={
	    			position : _param.position,
	    			keyword : keyword,
	    			cityName:cityName,
	    			cityId : cityId,
	    			areaId : pageDatas.pageAreaId,
	    			minPrice : pageDatas.pageMinPrice,
	    			maxPrice : pageDatas.pageMaxPrice,
	    			isLocal : pageDatas.isLocal,
	    			orders : pageDatas.pageOrders,
	    			cowrieStatus : pageDatas.pageCowrieStatus,
	    			pageNum : pageDatas.pagePageNum,
	    			pageSize : 6
	    		};
	    	$.get("goods/search.shtml",param,function(datas){
	    		history.replaceState({},"","#"+$.joinUrl(ctrl._name,$.extend(ctrl._param,$.extend(param, {pageNum:1}))));
    			if(datas.status == 0){
    				alert(datas.errorMsg);
    				return;
    			}
    			var goodsList = datas.data.goodsList;
    			if(goodsList == null || goodsList.length < 6){
    				pageDatas.isHave = false;
    			}
    			if(pageDatas.pagePageNum == 1){
    				$("#goodsListUl").empty();
    			}
    			if(datas.data.local){
    				pageDatas.isLocal = datas.data.local;
    			}
    			var temp = "";
    			if(goodsList != null && goodsList.length > 0){
    				for(var i = 0;i<goodsList.length;i++){
    					var consumeTips = "";
    					if(goodsList[i].consumeTips != null && goodsList[i].consumeTips != ""){
    						consumeTips = '<button>返￥'+goodsList[i].consumeTips.toFixed(2)+'</button>';
    					}
    					var tempUrl = "";
    					if(goodsList[i].cowrieStatus =="pass"){
    						tempUrl = "#goods/details?goodsId="+goodsList[i].goodsId+"&shopId=1";
    					}else{
    						tempUrl = "#goods/details?goodsId="+goodsList[i].goodsId;
    					}
    					temp += '<li>'+
		    		                '<a href="'+tempUrl+'">'+
					                    '<div class="pic">'+
					                        '<img src="'+Config.imgPre+goodsList[i].image+'"/>'+
					                        '<div class="bt">'+
					                            '<div></div>'+
					                            '<p>'+goodsList[i].shopName+'</p>'+
					                        '</div>'+
					                    '</div>'+
					                    '<div class="txt">'+
					                        '<h6 class="color-gray6 ellips">'+goodsList[i]._name+'</h6>'+
					                        '<h5 class="color-red h3 m-top10">'+
					                        	'￥'+goodsList[i].price.toFixed(2)+
					                        	consumeTips+
					                        '</h5>'+
					                        '<div class="color-gray9 p m-top10">好评率:'+goodsList[i].score+'%</div>'+
					                        '<p class="color-gray9 clearfix m-top10">'+
					                        	'<span class="kdl-left">销量：'+
					                        		goodsList[i].sales+
					                        	'</span>';
					                        	if(datas.data.local){
					                        		temp += '<span class="kdl-right color-red h5">'+
								                        		goodsList[i]._district+
									                        '</span>';
					                        	}else{
					                        		temp += '<span class="kdl-right color-red h5">'+
								                        		goodsList[i]._distance+
									                        'm</span>';
					                        	}
					                        	temp +=
					                        '</p>'+
					                    '</div>'+
					                '</a>'+
					            '</li>';
    				}
    				$(".reminder").css("display","none");
    				$("#goodsListUl").append(temp);
    			}else if(pageDatas.pagePageNum == 1 && !(goodsList != null && goodsList.length > 0)){
    				$(".reminder").css("display","block");
    			}
    		});
	    },
	    //点击搜索按钮搜索
	    toSearch : function(){
	    	this.pagePageNum = 1;
	    	this.isHave = true;
	    	this.searchFun();
	    },
	    enterKey:function(){
	    	var keyCode=event.keyCode;
	    	if(keyCode == 13){
	    		$("#searchBtn").click();
	    	}
	    },
	    //排序
	    toSearchByOrder : function(item,orderType){
	    	$(item).closest("li").addClass("cur").siblings("li").removeClass("cur");
	    	if(orderType == "priceAsc"){
	    		$(item).attr("onclick","this.ctrl.toSearchByOrder(this,'priceDesc')");
	    		$("#priceName").html("价格▴");
	    	}else if(orderType == "priceDesc"){
	    		$(item).attr("onclick","this.ctrl.toSearchByOrder(this,'priceAsc')");
	    		$("#priceName").html("价格▾");
	    	}else{
	    		$("#ordersName").html($(item).find("span").html());
	    	}
	    	this.pagePageNum = 1;
	    	this.isHave = true;
	    	this.pageOrders = orderType;
	    	this.searchFun();
	    	$(".Sort").hide();
	    	$(".theme-popover-mask").hide(); 
	    },
	    //筛选城市
	    toSearchByCity : function(item,areaId){
	    	$(item).closest("li").addClass("cur").siblings("li").removeClass("cur");
	    	$("#cityName").html($(item).find("span").html());
	    	this.pagePageNum = 1;
	    	this.isHave = true;
	    	this.pageAreaId = areaId;
	    	this.searchFun();
	    	$(".city").hide();
	    	$(".theme-popover-mask").hide(); 
	    },
	    //选择商品类型
	    chooseCow : function(item){
	    	$(item).addClass("cur").siblings("li").removeClass("cur");
	    },
	    //其他筛选
	    toSearchByOther : function(){
	    	this.isHave = true;
	    	this.pageMinPrice = $("#pagePriceMin").val();
	    	this.pageMaxPrice = $("#pagePriceMax").val();
	    	this.pageCowrieStatus = $("ul[cowGoods]").find("li.cur").attr("pageCowrieStatus");
	    	this.pagePageNum = 1;
	    	this.searchFun();
	    	$(".screening").hide();
	    	$(".theme-popover-mask").hide(); 
	    }
	    
	},

    
    /** 店铺搜索 */
	"search/shopSearch": {
	    _title:"店铺搜索",
	    _footer:false,
	    isHave : true,
	    pageOrders : null,
    	pageAreaId : null,
    	pageCategoryId : null,
    	pageIndustryCategoryId : null,
    	isLocal:null,
    	pagePageNum : 1,
	    _datas: {
        	data:GET("shop/search.shtml",
        		 {
        			position:PARAM("position"),
        			keyword:PARAM("keyword"),
        			categoryId:PARAM("categoryId"),
        			industryCategoryId:PARAM("industryCategoryId"),
        			cityId:function(){return Config.area.id;},
        			cityName:function(){return Config.area.name;},
        			areaId:PARAM("areaId"),
        			orders:PARAM("orders"),
        			pageNum:PARAM("pageNum",1),
        			pageSize:PARAM("pageSize",6)
        		 },
        		 function(data,ctrl){
        			 ctrl.isLocal = data.local;
        			 return data;
        	})
        },
	    _load: function(){
	    	var pageThis = this;
	    	
	    	//加载生活分类
	    	$.get("category/getCategory.shtml",function(datas){
	    		var tempCate = datas.data.category;
	    		if(tempCate != null && tempCate.length > 0){
	    			var temp = '<li class="cur">'+
				                    '<a href="javascript:;" onclick="this.ctrl.chooseCate(this,\'all\',\'\')">'+
					                   '全部' +
					                '</a>'+
					            '</li>';;
	    			for(var i = 0;i < tempCate.length;i++){
	    				temp += '<li>'+
				                    '<a href="javascript:;" onclick="this.ctrl.loadIndust(this,'+tempCate[i].id+')">'+
				                        tempCate[i].name +
				                    '</a>'+
				                '</li>';
	    			}
	    			$("#categoryContent").append(temp);
	    		}
	    	});
	    	
	    	//获取地区
	        $.get("area/findAreas.shtml",{
	        	grade : 2,
	        	parentId : _param.cityId
	        },function(datas){
	        	var areaList = datas.data.areaList;
	        	if(areaList != null && areaList.length > 0){
	        		var temp = "";
	        		for(var i = 0;i<areaList.length;i++){
	        			temp += '<li>'+
				                    '<a href="javascript:;" onclick="this.ctrl.toSearchByCity(this,'+areaList[i].id+')"><span>'+areaList[i].name+'</span><i class="kdl-right iconfont">&#xe653;</i></a>'+
				                '</li>';
	        		}
	        		$("#areaUl").append(temp);
	        	}
	        });
	    	
	        //触底加载
	        setREG("document_scroll", pageThis._name, function(){
            	if($.getScrollBottom()<3 && pageThis.isHave){
            		pageThis.pagePageNum++;
            		pageThis.searchFun();
            	}
            });
	        
	        /*tab切换*/
	        $("#screen>li").click(function(){
	            $(this).addClass("cur").siblings().removeClass("cur");
	            var listval=$(this).index();
	            if(listval == 0){
	            	$("#classify").siblings().hide();
	                $("#classify").toggle();
	                if($("#classify").css('display')=='block'){
	                    $(".theme-popover-mask").show();
	                    $(".siftingbox").show();
	                }
	                else{
	                    $(".theme-popover-mask").hide();
	                    $(".siftingbox").hide();
	                }
	            }else if(listval == 1){
	                $(".Sort").siblings().hide();
	                $(".Sort").toggle();
	                if($(".Sort").css('display')=='block'){
	                    $(".theme-popover-mask").show();
	                    $(".siftingbox").show();
	                }
	                else{
	                    $(".theme-popover-mask").hide();
	                    $(".siftingbox").hide();
	                }
	            }else if(listval == 2){
	                $(".city").siblings().hide();
	                $(".city").toggle();
	                if($(".city").css('display')=='block'){
	                    $(".theme-popover-mask").show();
	                    $(".siftingbox").show();
	                }
	                else{
	                    $(".theme-popover-mask").hide();
	                    $(".siftingbox").hide();
	                }
	            }
	        })
	        $(".char li").click(function(){
	            $(this).addClass("cur").siblings().removeClass("cur");
	        })
	        $(".theme-popover-mask").click(function(){
	            $(".siftingbox>div").hide();
	            $(this).hide();
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
	            $('#classify ').css("height",num);
                $('.city ').css("height",num);
	        });

	        /*评星*/
	        var starsum=(($(".starbg>span").attr("width")/10)/2)-1;
	        var starsumt=parseInt(($(".starbg>span").attr("width")/10)/2);
	        for(var i=0; i<starsum; i++){
	            $(".bgtwo i").eq(i).addClass("color-orange");
	        }
	        if(starsum%1!=0){
	            $(".bgtwo i").eq(starsumt).html("");
	            $(".bgtwo i").eq(starsumt).addClass("color-orange");
	        }else{
	
	        }
	
	    },
	    //搜索店铺
	    searchFun : function(){
	    	var pageDatas = this;
	    	var keyword = $("#searchValue").val();
	    	var cityId=Config.area.id;
	    	var cityName=Config.area.name;
	    	$.get("shop/search.shtml",{
    			position : _param.position,
    			keyword : keyword,
    			isLocal : pageDatas.isLocal,
    			cityId : cityId,
    			cityName:cityName,
    			areaId : pageDatas.pageAreaId,
    			orders : pageDatas.pageOrders,
    			categoryId : pageDatas.pageCategoryId,
    			industryCategoryId : pageDatas.pageIndustryCategoryId,
    			pageNum : pageDatas.pagePageNum,
    			pageSize : 6
    		},function(datas){
    			if(datas.status == 0){
    				alert(datas.errorMsg);
    				return;
    			}
    			var shopList = datas.data.shopList;
    			if(shopList == null || shopList.length < 6){
    				pageDatas.isHave = false;
    			}
    			if(pageDatas.pagePageNum == 1){
    				$("#shopListUl").empty();
    			}
    			var temp = "";
    			if(shopList != null && shopList.length > 0){
    				for(var i = 0;i<shopList.length;i++){
    					temp += '<li>'+
		    		                '<a href="#shop/shops?shopId='+shopList[i].shopId+'">'+
				                        '<div class="pic">'+
				                            '<img src="'+Config.imgPre+shopList[i].shopImage+'"/>'+
				                        '</div>'+
				                        '<div class="txt">'+
				                            '<h6 class="color-gray6 ellips">'+shopList[i]._name+'</h6>'+
				                            '<div class="starbg">'+
				                                '<img src="'+Config.imgPre+shopList[i].shopRankIcon+'"/>'+
				                            '</div>'+
				                            '<p class="color-gray9 clearfix m-top10">'+
				                            	'<span class="kdl-left">'+
				                            		shopList[i].industryName+
				                            	'</span>';
				                            	if(datas.data.local){
				                            		temp+='<span class="kdl-right color-red h5">'+shopList[i]._district+'</span>';
				                            	}else{
				                            		temp+='<span class="kdl-right color-red h5">'+shopList[i]._distance+'m</span>';
				                            	}
				                            '</p>'+
				                        '</div>'+
				                    '</a>'+
				                '</li>';
    				}
    				$(".reminder").css("display","none");
    				$("#shopListUl").append(temp);
    			}else if(pageDatas.pagePageNum == 1 && !(shopList != null && shopList.length > 0)){
    				$(".reminder").css("display","block");
    			}
    		});
	    },
	    //点击搜索按钮搜索
	    toSearch : function(){
	    	this.pagePageNum = 1;
	    	this.isHave = true;
	    	this.searchFun();
	    },
	    //加载生活分类对应的行业分类
	    loadIndust : function(item,cateId){
	    	$(item).closest("li").addClass("cur").siblings("li").removeClass("cur");
	    	$.get("category/getIndustryCategory.shtml",{
	    		categoryId : cateId
	    	},function(datas){
	    		$("#industContent").empty();
	    		var tempIndust = datas.data.industryCategory;
	    		if(tempIndust != null && tempIndust.length > 0){
	    			var temp = '<li>'+
	    							'<a href="javascript:;" onclick="this.ctrl.chooseCate(this,\'cate\','+cateId+')">'+
					                    '全部'+
					                '</a>'+
					            '</li>';
	    			for(var i = 0;i < tempIndust.length;i++){
	    				temp += '<li>'+
				                    '<a href="javascript:;" onclick="this.ctrl.chooseCate(this,\'indust\','+tempIndust[i].id+')">'+
				                    	tempIndust[i].name +
				                    '</a>'+
				                '</li>';
	    			}
	    			$("#industContent").append(temp);
	    		}
	    	});
	    },
	    //选择分类搜索
	    chooseCate : function(item,type,typeId){
	    	if(type == "all"){
	    		$("#industContent").empty();
	    	}
    		$(item).closest("li").addClass("cur").siblings("li").removeClass("cur");
	    	this.pagePageNum = 1;
	    	if(type == "cate"){
	    		this.pageCategoryId = typeId;
	    		this.pageIndustryCategoryId = null;
	    	}else if(type == "indust"){
	    		this.pageCategoryId = null;
	    		this.pageIndustryCategoryId = typeId;
	    	}else{
	    		this.pageCategoryId = null;
	    		this.pageIndustryCategoryId = null;
	    	}
	    	this.searchFun();
	    	$(".cateBox").hide();
	    	$(".theme-popover-mask").hide(); 
	    },
	    //排序
	    toSearchByOrder : function(item,orderType){
	    	$(item).closest("li").addClass("cur").siblings("li").removeClass("cur");
    		$("#ordersName").html($(item).find("span").html());
	    	this.pagePageNum = 1;
	    	this.pageOrders = orderType;
	    	this.searchFun();
	    	$(".Sort").hide();
	    	$(".theme-popover-mask").hide(); 
	    },
	    //筛选城市
	    toSearchByCity : function(item,areaId){
	    	$(item).closest("li").addClass("cur").siblings("li").removeClass("cur");
	    	$("#cityName").html($(item).find("span").html());
	    	this.pagePageNum = 1;
	    	this.pageAreaId = areaId;
	    	this.searchFun();
	    	$(".city").hide();
	    	$(".theme-popover-mask").hide(); 
	    },
	}
	

});

})();