(function(){
	/*公用变量和方法*/
	
	FORMAT({
		/*加载宝贝库分类*/
	    "shopKeeper/cowrieCategory": {
	    	_template:{url:"view/shopKeeper/cowrie/cowrieCategory.ejs"},
	        _title:"宝贝库分类",
	        _links:{
	        	"js/extra.js":"js"
	        },
	        _datas: {
	        	data:POST("category/getCategory.shtml",{},function(data){
	        		return data;
	        	}),
	        },
	        _footer:false,
	        _load: function(){
	        },
	        toSearch : function(){
	        	GO('shopKeeper/cowrieSearch')
	        }
	    } ,
	    
	    /*选择城市*/
	    "shopKeeper/positioning": {
	        _title:"选择城市",
	        _footer:false,
	        _datas:GET("area/openCitys.shtml",function(data){return data}),
	        _template:{url:"view/shopKeeper/cowrie/positioning.ejs"},
	        _load: function(){
	            $(".searchBox input").keyup(function(){
	            	var Inp = this;
	            	$.get("area/match.shtml",{content:Inp.value},function(data){
	            		var areas = data.data.areas;
	            		if(areas.length>0){
	            			$("#warn").html("");
	            			$(".matchAreas").html(REND('shopKeeper/cowrie/matchAreas',{list:data.data.areas}));
	            		}else{
	            			$("#warn").html("抱歉，未找到相关位置，可尝试重新输入");
	            			$(".matchAreas").html(REND('shopKeeper/cowrie/matchAreas',{list:data.data.areas}));
	            		}
	            	})
	            }),
	            $(".openAreas ul li a").click(function(){
	               var obj = this;
	               alert("选择"+$(obj).html()+"为当前城市",function(flag){
	                     if(flag){
	                     	$.get("area/location.shtml",{cityName:$(obj).html()},function(data){
	                     		if(data.status == "1"){//设置当前城市成功
	                    			Config.shopArea = data.data.area;
	                    			if(_param.flag=="1"){
	                    				GO("shopKeeper/cowrieCategory");
	                    			}else{
	                    				GO("shopKeeper/noRequiredCowrielist",{categoryId:_param.categoryId});
	                    			}
	                    		}else if(data.status == "0"){
	                    			alert("系统正忙，稍后重试");
	                    		}
	                     	});
	                     }
	                },true);
	          });
	        }
	    },
	    
	    /*宝贝库商品列表*/
	    "shopKeeper/noRequiredCowrielist": {
	    	_template:{url:"view/shopKeeper/cowrie/noRequiredCowrielist.ejs"},
	    	_title:"宝贝库商品",
	    	_links:{
	    		"js/extra.js":"js"
	    	},
	    	_style:"\
	    		.reminder{ text-align: center; margin-top: 2rem; display: none;}\
	    		.reminder>i{ font-size: 1.5rem;}\
	    		"
	    	,
	    	pageNum : 1,
	        pageSize : 6,
	        continueLoad : true,
	        keyword : null,
	        categoryId : null,
	        goodsCategoryId : null,
	        cityId : null,
	        countyId : null, 
	        orders : null,
	        _datas: {
	        	data:POST("shopKeeper/loadingData.shtml",{categoryId:PARAM("categoryId",0),areaId:function(){return Config.shopArea!=null ? Config.shopArea.id:Config.area.id;}},function(data,ctrl){
	        		ctrl.categoryId = !data.category?null:data.category.id;
	        		ctrl.cityId = data.area.id;
 	        		return data;
	        	}),
	        },
	        _footer:false,
	    	_load: function(){
	    		var ctrl =this;
	    		if(_param.keyword){
	    			ctrl.keyword=_param.keyword;
	    			$("#keyword").text(_param.keyword);
	    		}else{
	    			$("#keyword").text("搜索店内商品/服务");
	    		}
	    		if(_param.categoryId)ctrl.categoryId=_param.categoryId;
	    		if(_param.goodsCategoryId)ctrl.goodsCategoryId=_param.goodsCategoryId;
	    		if(_param.cityId)ctrl.cityId=_param.cityId;
	    		if(_param.countyId)ctrl.countyId=_param.countyId;
	    		if(_param.orders)ctrl.orders=_param.orders;
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
	            	ctrl.pageSize = 10;
			        $("#hasSelOrders").html($(this).find("font").html());
			        $(".screen-box").children().hide();
	        		$(".theme-popover-mask").hide();
			        $("#addList").empty();
			        ctrl.loadData(ctrl.pageNum,ctrl.pageSize,ctrl.keyword,ctrl.categoryId,ctrl.goodsCategoryId,ctrl.cityId,ctrl.countyId,ctrl.orders);
	            })
	    		this.loadData(this.pageNum,this.pageSize,this.keyword,this.categoryId,this.goodsCategoryId,this.cityId,this.countyId,this.orders);
	            setREG("document_scroll", ctrl._name, function(){
	            	 if($.getScrollBottom()<3){
	            		 ctrl.pageNum = ctrl.pageNum+1;
	            		 if(ctrl.continueLoad){
	            			 $.getMaxWrap().loadingWrap();
	            			 ctrl.loadData(ctrl.pageNum,ctrl.pageSize,ctrl.keyword,ctrl.categoryId,ctrl.goodsCategoryId,ctrl.cityId,ctrl.countyId,ctrl.orders);
	            		 }
	            	 }
	            });
	            
	    	},
	    	loadData : function(pageNum,pageSize,keyword,categoryId,goodsCategoryId,cityId,countyId,orders){
	        	var ctrl =this;
	        	$.ajax({
    				url:"shopKeeper/getStoreGoods.shtml",
    				data:{"pageNum":pageNum,"pageSize":pageSize,"categoryId":categoryId,"goodsCategoryId":goodsCategoryId,"cityId":cityId,"countyId":countyId,"orders":orders,"keyword":keyword},
    				async:false,
    				dataType:"json",
    				type:"post",
    				success:function(data){
    					if(data.status==0){
    						alert(data.errorMsg);
    						return false;
    					}
    					
    					var html ="";
    					if(pageNum==1 && data.data.goods.length==0){
    						ctrl.continueLoad = false;
    						html += '<div id="noDataDiv" class="reminder">'+
			    		        		'<i class="iconfont color-gray9">&#xe65c;</i>'+
			    		        		'<h5 class="m-top40 color-gray9">sorry,没有查询到宝贝库商品~</h5>'+
			    		            '</div>';
    						 $("#addList").before(html);
    						 $("#noDataDiv").show();
    						 $(".load_more").hide();
    						$("html,body").loadingWrapCancel();
    						return false;
    					}else{
    						$("#noDataDiv").hide();
    					}
    					if(data.data.goods.length<ctrl.pageSize){
    						ctrl.continueLoad = false;
    						$(".load_more").show().find("span").html("没有更多");
    					}else{
    						$(".load_more").show().find("span").html("加载更多");
    					}
						$.each(data.data.goods, function (n, obj) {
					    	var isExist = "";
					    	var exist = "";
					    	var isMarketer ="";
					    	var marketer = "";
					    	if(!obj.isExist){
					    		isExist = "bg-orange";
					    		exist = "代销";
					    	}else{
					    		exist = "取消代销";
					    	}
					    	if(!obj.isMarketer){
					    		isMarketer = "bg-red";
					    		marketer = "上架";
					    	}else{
					    		marketer = "下架";
					    	}
					    	html+= "<li class='clearfix'>"
						           	   +"<a href='#goods/details?isExist="+obj.isExist+"&goodsId="+obj.id+"&isMarketer="+obj.isMarketer+"&sellCount="+obj.count+"&shopId=1'>"
						               	   +"<div class='pic'>"
						                   	   +"<img src='"+Config.imgPre+obj.image+"'/>"
							                   +"<div class='bt'>"
							                     	+"<div></div>"
							                        +"<p>"+obj.shopName+"</p>"
							                   +"</div>"
							               +"</div>"
							               +"<div class='txt'>"
							                    +"<h6 class='ellips'>"+obj.name+"</h6>"
							                    +"<h5 class='color-red'>￥"+obj.price.toFixed(2)+"</h5>"
							                    +"<p class='color-gray6'>"+obj.count+"人在卖</p>"
							                    +"<p class='color-gray9'>消费返现：<em class='color-red'>￥"+obj.consumeTips.toFixed(2)+"</em></p>"
							                    +"<p class='color-gray9'>销售提成：<em class='color-red'>￥"+obj.sellTips.toFixed(2)+"</em></p>"
							               +"</div>"
							           +"</a>"
							           +"<div class='box clearfix'>"
							               +"<div class='clearfix'>"
							                   +"<a href='javascript:;' class='"+isExist+" btn kdl-left' onclick='this.ctrl.sellOrMarketer(this,\"sell\","+obj.id+","+obj.count+");'>"+exist+"</a>"
							                   +"<a href='javascript:;' class='"+isMarketer+" btn kdl-right' onclick='this.ctrl.sellOrMarketer(this,\"marketer\","+obj.id+","+obj.count+");'>"+marketer+"</a>"
							               +"</div>"
							           +"</div>"
							        +"</li>";
			            });
					    
					    $("#addList").append(html);
					    $("html,body").loadingWrapCancel();
					    $("body").css({"height":"auto","overflow":"scroll"});
    				},
    				error:function(data){
    					alert("亲，系统错误请您稍后再试！");
    				}
    			});
	        },
	        _pass:function(){
	        	$(document).unbind("scroll");
	        },
	        selCategory : function(obj,categoryId){
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
    					$(".theme-popover-mask").hide();
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
	        selGoodsCategory : function(obj,goodsCategoryId){
	        	$(obj).addClass("cur").siblings().removeClass("cur");
	        	if(!$("#categoryList .cur").find("a").html().trim()=="全部"){
	        		if(goodsCategoryId==null || goodsCategoryId == ""){
	        			if($("#hasSelCategory").html().trim() == $("#categoryList .cur").find("a").html().trim()){
	        				$(".screen-box").children().hide();
	        				$(".theme-popover-mask").hide();
	        				return false;
	        			}
	        			$("#hasSelCategory").html($("#categoryList .cur").find("a").html());
	        		}else{
	        			if($("#hasSelCategory").html().trim() == $(obj).find("a").html().trim()){
	        				$(".screen-box").children().hide();
	        				$(".theme-popover-mask").hide();
	        				return false;
	        			}
	        			$("#hasSelCategory").html($(obj).find("a").html());
	        		}
	        	}
		        this.goodsCategoryId = goodsCategoryId;
		        this.categoryId = $("#categoryList .cur").find("input").val();
		        this.pageNum = 1;
		        this.pageSize = 10;
		        this.continueLoad = true;
		        $(".screen-box").children().hide();
        		$(".theme-popover-mask").hide();
		        $("#addList").empty();
		        if(!this.categoryId){
		        	$("#addGoodsCate").siblings().remove();
		        	$("#addGoodsCate").hide();
		        }
		        $("#hasSelCategory").text($(obj).find("a").text());
		        this.loadData(this.pageNum,this.pageSize,this.keyword,this.categoryId,this.goodsCategoryId,this.cityId,this.countyId,this.orders);
	        },
	        selArea : function(obj,areaId){
	        	if($(obj).hasClass("cur")){
	        		$(".screen-box").children().hide();
	         		$(".theme-popover-mask").hide();
	        		return false;
	        	}
	        	$(obj).addClass("cur").siblings().removeClass("cur");
	        	this.countyId=areaId;
	        	this.pageNum = 1;
		        this.pageSize = 10;
		        this.continueLoad = true;
		        $("#hasSelArea").html($(obj).find("font").html());
		        $(".screen-box").children().hide();
        		$(".theme-popover-mask").hide();
		        $("#addList").empty();
		        this.loadData(this.pageNum,this.pageSize,this.keyword,this.categoryId,this.goodsCategoryId,this.cityId,this.countyId,this.orders);
	        },
	        //代销、取消代销或上下架操作(当前对象，类型，商品Id，在卖人数)
	        sellOrMarketer : function(obj,type,goodsId,sellCount){
	        	var isExistSign = null; //是否代销
	        	var isMarketerSign = null; //是否上架
	        	var isMarketer = null; 
	        	var sellType = null;
	        	if(type=="sell"){
	        		if($(obj).hasClass("bg-orange")){
		        		sellType = "add";
		        		isExistSign = true;
		        		if($(obj).siblings("a").hasClass("bg-red")){
		        			isMarketerSign = false;
			        	}else{
			        		isMarketerSign = true;
			        	}
		        	}else{
		        		sellType = "delete";
		        		isExistSign = false;
		        		isMarketerSign = false;
		        	}
	        	}else{
	        		if($(obj).hasClass("bg-red")){
	        			isMarketer = true;
	        			isMarketerSign = true;
	        			isExistSign = true;
		        	}else{
		        		isMarketer = false;
		        		isMarketerSign = false;
		        		if($(obj).siblings("a").hasClass("bg-orange")){
		        			isExistSign = false;
		        		}else{
		        			isExistSign = true;
		        		}
		        	}
	        	}
	        	$.ajax({
    				url:"shopKeeper/addOwnGoods.shtml",
    				data:{"goodsId":goodsId,"isMarketer":isMarketer,"type":sellType},
    				async:false,
    				dataType:"json",
    				type:"post",
    				success:function(data){
    					if(data.status==0){
    						alert(data.errorMsg);
    						return false;
    					}
    					if(type=="sell"){
    		        		if($(obj).hasClass("bg-orange")){ //代销
    			        		$(obj).removeClass("bg-orange");
    			        		$(obj).html("取消代销");
    			        	}else{ //取消代销，下架
    			        		$(obj).addClass("bg-orange");
    			        		$(obj).html("代销");
    			        		$(obj).next().addClass("bg-red");
    			        		$(obj).next().html("上架");
    			        	}
    		        	}else{
    		        		if($(obj).hasClass("bg-red")){ //上架，代销
    			        		$(obj).removeClass("bg-red");
    			        		$(obj).html("下架");
    			        		$(obj).prev().removeClass("bg-orange");
    			        		$(obj).prev().html("取消代销");
    			        	}else{ //下架
    			        		$(obj).addClass("bg-red");
    			        		$(obj).html("上架");
    			        	}
    		        	}
    					var tempHref = "#goods/details?goodsId="+goodsId+"&isExist="+isExistSign+"&isMarketer="+isMarketerSign+"&sellCount="+sellCount;
    					$(obj).closest("li.clearfix").children("a").attr("href",tempHref);//改变进入详情页连接
    				},
    				error:function(data){
    					alert("亲，系统错误请您稍后再试！");
    				}
    			});
	        },
	        toSearch : function(obj){
	        	var keyword = $(obj).find("span").text();
	        	if("搜索店内商品/服务" == keyword){
	        		keyword = "";
	        	}
	        	GO('shopKeeper/cowrieSearch',{categoryId:this.categoryId,cityId:this.cityId,keyword:keyword})
	        }
	    },
	    

		/*搜索宝贝库商品*/
	    "shopKeeper/cowrieSearch": {
	        _title:"搜索",
	        _footer:false,
	        _template:{url:"view/shopKeeper/cowrie/cowrieSearch.ejs"},
	        _load: function(){
	        	$("#keyword").val(_param.keyword);
	            $(".hotSearch > li").click(function(){
	            	var searchValue=$(this).find("a").html();
	            	$("#keyword").val(searchValue);
	            	$("#searchBtn").click();
	            });
	        },
	        toSearch : function(item){
	        	GO("shopKeeper/noRequiredCowrielist",{keyword:$("#keyword").val(),categoryId:_param.categoryId,cityId:_param.cityId});
	        },
	        monitor:function(){
	        	if(event.keyCode == 13){
	        		$("#searchBtn").click();
	        	}
	        }
	        
	    }
	})
})()