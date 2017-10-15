(function(){
	/*公用变量和方法*/
	FORMAT({
	    /*商品详情*/
	    "goods/details":{
	        _title:"商品详情",
	        _template:{url:"view/goods/details.ejs"},
	        _links:{
	            "./plugin/swipe.js":"js",
	            "./js/extra.js":"js",
	            "./css/productDetails.css":"css"
	        },
	        _datas: GET("goods/info.shtml",{
	        	isExist:PARAM("isExist",null),
				goodsId:PARAM("goodsId",null),
				shopId:PARAM("shopId",null),
				specialtyContentId:PARAM("specialtyContentId",null),
				isMarketer:PARAM("isMarketer",null),
				sellCount:PARAM("sellCount",null)
			},function(datas,ctrl){
	    		if(datas instanceof Error){
	    			if(datas.code==4001 || datas.code == 4002){
	    				ctrl._goError = false;
	    				/*跳转下架页面*/
	    				DO("goods/goodsUnShelve",ctrl._param);
	    			}
	    		}
	    		return datas;
	        }),
	        pageNum : 1,
	        pageSize : 5,
	        goodsId : null,
	        continueLoad : true,
	        scrollTops : null,
	        activityInterval : null,//促销倒计时
	        countDown : 0, //倒计时时间
	        openTime : null,
	        _footer:false,
	        _load:function(){
	        	this.openTime = new Date().getTime();
	        	var ctrl = this;
	        	//活动倒计时
	        	this.countDown = _datas.countDown;
	        	if(_datas.actStatus == "none"){
	        		$(".Preferential").hide(); //隐藏活动倒计时
	        	}else{
	        		if(_datas.minPrice){
	        			$("#minPrice").show();
	        			$("#minPrice").html("￥"+_datas.minPrice.toFixed(2));
	        		}
	        		if(_datas.actStatus == "before"){
		        		$("#actContent").html("距促销开始：");
		        		$("#t_d").hide();
		        		ctrl.openCountDown();
		        	}else if(_datas.actStatus == "after"){
		        		$("#actContent").html("距促销结束：");
		        		ctrl.openCountDown();
		        	}
	        	}
	        	
	        	$.wxShare();
	        	$(".evaluate-con .list>div.pic>span>img").initImgTouch();
            	this.goodsId = this._param.goodsId; 
	            /*轮播图播放*/
	            $(".wrap img").show();
	            var slider =
	                Swipe(document.getElementById('slider'), {
	                    auto: 3000,// 每3秒切换图片
	                    continuous: true,
	                    callback: function(pos) { //pos  返回的是索引值
	                        for(var i=0;i<=diandian.length;i++){
	                            $(diandian[i]).removeClass("current");
	                            $(diandian[pos]).addClass("current");
	                        }
	                        $("#circle").css("margin-left",-$("#circle").width()/2);
	                    }
	                });
	            var diandian = document.getElementById('circle').getElementsByTagName('li');
	            $(diandian).click(function(){slider.next();slider.slide($(this).index());}).eq(0).addClass("current");
	            setTimeout(function(){$("#circle").css("margin-left",-$("#circle").width()/2);},1000);
	            $("#circle").css("margin-left",-$("#circle").width()/2);
	            setREG("resize",this._name,function(){
	            	$("#circle").css("margin-left",-$("#circle").width()/2);
	            });
	            /*轮番图结束*/
	            /*收藏状态*/
	            if(!$("#specialtyContentId").val()){//展位内容商品暂不支持收藏
	            	$.get("goods/favorite.shtml",{skuId:$("#skuIdTrack").val(),shopId:$("#shopId").val()},function(data){
	            		if(data.data.isFavorite){
	            			$("#enshrine").addClass("color-red");
	            			$("#enshrine").children("i").text("");
	            		}
	            	})
	            }
	            /*添加或取消收藏*/
	            $("#enshrine").click(function(){
	            	if($("#specialtyContentId").val()){alert("活动商品暂不支持收藏！");return false;}
	                var enshrine=$(this);
	                if(enshrine.hasClass("color-red")){
	                    $.delete("goods/favorite.shtml",{skuId:$("#skuIdTrack").val(),shopId:$("#shopId").val()},function(data){
	            			if(data.status == "1"){
	            				$(enshrine).removeClass("color-red");
                                $("#enshrine").children("i").text("");
	            			}else{
	            				if(data.status == "0" && data.errorCode == "1000"){//未登录
	            					GO('passport/login',{backUrl:'#goods/details?goodsId='+$("#goodsId").val()+'&shopId='+$("#shopId").val()}) 
	    							return false;
	            				}else{
	            					alert(data.errorMsg);
	            				}
	            			}
	            		});
	                }
	                else{
	                	$.post("goods/favorite.shtml",{skuId:$("#skuIdTrack").val(),shopId:$("#shopId").val()},function(data){
	            			if(data.status == "1"){
	            				$(enshrine).addClass("color-red");
                                $("#enshrine").children("i").text("");
	            			}else{
	            				if(data.status == "0" && data.errorCode == "1000"){//未登录
	            					GO('passport/login',{backUrl:'#goods/details?goodsId='+$("#goodsId").val()+'&shopId='+$("#shopId").val()})
	    							return false;
	            				}else{
	            					alert(data.errorMsg);
	            				}
	            			}
	            		});
	                }
	            });
	            
	            /*添加浏览记录*/
	            /*$.post("goods/browse.shtml",{skuId:$("#skuIdTrack").val(),shopId:$("#shopId").val()},function(data){
        		});*/
	            
	            /*不支持物流的商品、服务商品 、版块商品取消加入购物车*/
	            if(!_datas.isAddCowrie){ //非添加宝贝库商品
		            if(_datas.goods.isDelivery == false || _datas.goods.goodsTypeId == "4" || (_datas.specialtyContentId != null && _datas.specialtyContentId != "")){
		            	$("#addCardBtn").remove();
		            	$("#buyNowBtn").css("width","100%");
		            	$(".footer .kdl-right").css("width","30%");
		            	$(".footer .kdl-left").css("width","70%");
		            	$("#chooseOperation>li:first-child").remove();
		            	$("#chooseOperation>li").css("width","100%");
		            }
	            }
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
	            
	            //加载当前商品所属店铺的部分信息（全部商品、多少人在卖、收藏人数）
	            var shopId = this._datas.goods.shopId;
	            $.ajax({
	            	url:Config.basePath + "/shop/aboutBusinessShop.shtml",
	            	tpye : "POST",
	            	dataType : "json",
	            	data : {
	            		shopId : shopId
	            	},
	            	success : function(datas){
	            		if(datas != null){
	            			$(".allGoodsCount").html(datas.data.allGoodsCount);
	            			$(".newGoodsCount").html(datas.data.newGoodsCount);
	            			$(".attentionPeoples").html(datas.data.attentionPeoples);
	            		}
	            	}
	            })
	            
	            //加载类似商品
	            var position = "";
	            var goodsCategoryId = this._datas.goodsCateId;
	            $.getPosition(function(x,y,cityname){
	            	position += x +"," + y;
	            	$.ajax({
	            		url:Config.basePath + "goods/similarityGoods.shtml",
	            		type : "POST",
	            		dataType : "json",
	            		data : {
	            			position : position,
	            			goodsCategoryId : goodsCategoryId, //商品二级分类
	            			pageNum : "1",
	            			pageSize : "6"
	            		},
	            		success : function(data){
	            			if(data != null && data.count > 0){
	            				var goodsList = data.datas;
	            				var temp = "";
	            				for(var i = 0;i < goodsList.length;i++){
	            					var goods = goodsList[i];
	            					temp += '<li>'+
				                                '<a href="#goods/details?goodsId='+goods.goodsId+'">'+
				                                    '<div class="pic">'+
				                                        '<img src="'+Config.imgPre + goods.image+'"/>'+
				                                    '</div>'+
				                                    '<div class="txt">'+
				                                        '<h6 class="ellips1">'+goods._name+'</h6>'+
				                                        '<div class="clearfix m-top5">'+
				                                            '<span class="kdl-left color-red">￥'+goods.price.toFixed(2)+'</span>'+
				                                            '<span class="kdl-right color-red">返￥23.00</span>'+
				                                        '</div>'+
				                                        '<p class="color-gray9 clearfix m-top10">'+
				                                            '<del class="kdl-left">￥'+goods.originalPrice.toFixed(2)+'</del>'+
				                                            '<span class="kdl-right">销量:'+goods.sales+'</span>'+
				                                        '</p>'+
				                                    '</div>'+
				                                '</a>'+
				                            '</li>';
	            				}
	            				$(".similarGoods").append(temp);
	            				$(".reminder").css("display","none");
	            			}else{
	            				$(".reminder").css("display","block");
	            			}
	            		}
	            	})
	            });
	            
	            /*加入购物车 或立即购买的确定按钮*/
	            $("#makeChoose").click(function(data){
	            	if($("#makeChoose").hasClass("disabled")){
	            		return;
	            	}
	            	if($("#skuStock").html()== "0"){
        				alert("库存不足！");
        				return;
        			}
	            	$(".theme-popover-mask").hide(300);
                    $(".standard-con").hide(50);
	            	if($(this).attr("url")){ //如果是加入购物车
	            		$.get($(this).attr("url")+"&quantity="+$("#quantity").val(),function(data){
	            			if(data.status == "1"){
	            				alert("加入购物车成功",2000);
	            			}else{
	            				if(data.status == "0" && data.errorCode == "1000"){//未登录
	            					var shopId = $("#shopId").val();
	            					var param = "";
	            					if(shopId){
	            						param = "&shopId="+shopId;
	            					}
	            					GO('passport/login',{backUrl:'#goods/details?goodsId='+$("#goodsId").val()+param})
	    							return false;
	            				}else{
	            					alert(data.errorMsg);
	            				}
	            			}
	            		})
	            	}else{ //立即购买
	            		$("#makeChoose").attr("href",$("#makeChoose").attr("href")+"&quantity="+$("#quantity").val()+"(-!-)");
	            	}
	            }),
	            
	            $("#allEvaluates").click(function(){
	            	ctrl.scrollTops = document.body.scrollTop;
	            	console.log(ctrl.scrollTops);
	            	setREG("document_scroll", ctrl._name, function(){
	 	            	ctrl.scrollLoad();
	 	            });
	            	document.getElementsByTagName('body')[0].scrollTop = 0;
	            	$("#detailsContent").hide();
	            	$("#detailsHead").hide();
	            	$("#evaluateHead").show();
	            	$("#evaluateContent").show().css("padding-top",".81rem");
	            	if(ctrl.continueLoad && ctrl.pageNum==1){
	            		 $("#evaluateList").empty();
	            		ctrl.loadData(ctrl.pageNum,ctrl.pageSize);
	            	}
	            }),
	            $("#returnBtn").click(function(){
	            	//document.getElementsByTagName('body')[0].scrollTop = 0;
	            	$("#detailsContent").show();
	            	$("#detailsHead").show();
	            	$("#evaluateHead").hide();
	            	$("#evaluateContent").hide();
	            	$("#circle").css("margin-left",-$("#circle").width()/2);
	            	if(ctrl.scrollTops!=null){
	            		document.body.scrollTop=ctrl.scrollTops;
	            		ctrl.scrollTops=null;
	            	}
	            }),
	            $("#tocart").click(function(){
	            	GO("cart/shoppingCart");
	            })
	            if(_datas.goods.goodsTypeId == 4){
	            	$(".treasureTab1").show();
        			$(".treasureTab2").hide();
	            }else{
	            	$(".treasureTab1").show();
	            	$(".treasureTab2").hide();
	            }
	            
	            //进入地图
		        $("#entryMap").click(function(){
		        	var shopId = $(this).attr("shopId");
		        	GO("shop/atlas",{shopId:shopId});
		        })
	        },
	        _events: {
	            //图文详情
	            "#treasureTab1" : {
	            	click : function(){
	            		$.stopPropagation();/*阻止冒泡*/
	            		$(this).closest("li").addClass("cur").siblings().removeClass("cur");
            			$(".treasureTab1").show();
            			$(".treasureTab2").hide();
            			$(".similarClauses").show();
	            	}
	            },
	            //商品参数、购买须知
	            "#treasureTab2" : {
	            	click : function(){
	            		$.stopPropagation();/*阻止冒泡*/
	            		$(this).closest("li").addClass("cur").siblings().removeClass("cur");
            			$(".treasureTab1").hide();
            			$(".treasureTab2").show();
            			$(".similarClauses").hide();
	            	}
	            },
	        	//打开选择商品规格面板
	        	"#chooseSku" : {
	        		click : function(){
	        			//给加入购物车、立即购买按钮href赋值
	        			$("#makeChoose").attr("type","").hide();
	            		$("#chooseOperation").show();
	        			this.ctrl.openSkuPanel();
	        			//如果当前规格不存在禁用加入购物车按钮、禁用立即购买按钮
	        			if($("#toBuyUrl").hasClass("disabled")){
	        				$("#toBuyUrl").attr("href","javascript:;");
	        				$("#toCardUrl").attr("href","javascript:;");
	        				return;
	        			}
	        			//库存为0，禁用加入购物车、立即购买按钮
	        			if($("#skuStock").html() == "0"){
	        				$("#toBuyUrl").attr("href","javascript:;");
	        				$("#toCardUrl").attr("href","javascript:;");
	        				return;
	        			}
	        			$("#toCardUrl").attr("url","cart/add.shtml?shopId="+$("#shopId").val()+"&skuId="+$("#skuIdTrack").val());
	        			if($("#goodsTypeId").val().trim()=="1"){
	        				if($("#specialtyContentId").val() && parseInt($("#specialtyContentId").val()) > 0){
	        					$("#toBuyUrl").attr("href","#order/retailOrder?shopId="+$("#shopId").val()+"&speConId="+$("#specialtyContentId").val());
	        				}else{
	        					$("#toBuyUrl").attr("href","#order/retailOrder?shopId="+$("#shopId").val()+"&skuId="+$("#skuIdTrack").val());
	        				}
	        			}else{
	        				if($("#specialtyContentId").val() && parseInt($("#specialtyContentId").val()) > 0){
	        					$("#toBuyUrl").attr("href","#order/serviceOrder?shopId="+$("#shopId").val()+"&speConId="+$("#specialtyContentId").val());
	        				}else{
	        					$("#toBuyUrl").attr("href","#order/serviceOrder?shopId="+$("#shopId").val()+"&skuId="+$("#skuIdTrack").val());
	        				}
	        			}
	        		}
	        	},
	        	//关闭选择规格面板
	        	"#closeSkuPanel" : {
	        		click : function(){
	        			$(".theme-popover-mask").hide(300);
	                    $(".standard-con").hide(50);
	        		}
	        	},
	        	//选择规格面板中的添加购物车
	        	"#toCardUrl" : {
	        		click : function(){
	        			if($("#toCardUrl").hasClass("disabled")){
		            		return;
		            	}
	        			if($("#skuStock").html() == "0"){
	        				alert("库存不足！");
	        				return;
	        			}
	        			$(".theme-popover-mask").hide(300);
	                    $(".standard-con").hide(50);
	                    $.get($(this).attr("url")+"&quantity="+$("#quantity").val(),function(data){
	            			if(data.status == "1"){
	            				alert("加入购物车成功",2000);
	            			}else{
	            				if(data.status == "0" && data.errorCode == "1000"){//未登录
	            					var shopId = $("#shopId").val();
	            					var param = "";
	            					if(shopId){
	            						param = "&shopId="+shopId;
	            					}
	            					GO('passport/login',{backUrl:'#goods/details?goodsId='+$("#goodsId").val()+param})
	    							return false;
	            				}else{
	            					alert(data.errorMsg);
	            				}
	            			}
	            		})
	        		}
	        	},
	        	//选择规格面板中的立即购买
	        	"#toBuyUrl" : {
	        		click : function(){
	        			if($("#toBuyUrl").hasClass("disabled")){
		            		return;
		            	}
	        			if($("#skuStock").html() == "0"){
	        				alert("库存不足！");
	        				return;
	        			}
	        			$("#toBuyUrl").attr("href",$("#toBuyUrl").attr("href")+"&quantity="+$("#quantity").val());
	        			$(".theme-popover-mask").hide(300);
	        			$(".standard-con").hide(50);
	        		}
	        	}
	        },
	        //打开选择规格面板
	        openSkuPanel : function(){
	        	$(".theme-popover-mask").show(50);
	            $(".standard-con").show(500);
	        },
	        //获取选中规格
	        chooseItem : function(item,goodsId){
	        	//添加选中样式
	        	var skuItemVals = "";//选中规格组值
	        	$(item).parent("li").addClass('cur').siblings().removeClass('cur');
	        	var itemArray = $(".tone .m-top20").find(".cur").map(function(){
	        		skuItemVals += $(this).html() + "/";
	        		return $(this).attr("skuItemId");
	        	});
	        	//查找选中的规格
	        	$.ajax({
	        		url : Config.basePath + "goods/getChooseSku.shtml",
	        		type : "POST",
	        		async : false,
	        		data : $.param({
	        			goodsId : goodsId,
	        			specialtyDisplayId : $("#specialtyDisplayId").val(),
	        			itemArray : $.extend([],itemArray),
	        			areaId:Config.area.id
	        		},true),
	        		success : function(datas){
	        			$("#skuChooseInfo").html("请选择您需要的商品规格");
	        			$("#makeChoose").css({"background-color":"#F72B2E","color":"#fff"}); //恢复按钮
	        			$("#makeChoose").removeClass("disabled"); //去除不可用标识
	        			$("#toCardUrl").css({"background-color":"#ff9933","color":"#fff"}); //恢复加入购物车按钮
	        			$("#toCardUrl").removeClass("disabled"); //去除不可用标识
	        			$("#toBuyUrl").css({"background-color":"#F72B2E","color":"#fff"}); //恢复购买按钮
	        			$("#toBuyUrl").removeClass("disabled"); //去除不可用标识
	        			if(datas.status == "0"){
	        				//没有当前规格组合
	        				$("#skuChooseInfo").html("<font color='red'>暂无当前规格</font>");
	        				$("#makeChoose").css({"background-color":"#ccc","color":"#333"}); //置灰按钮
	        				$("#makeChoose").addClass("disabled"); //不可用标识
	        				$("#makeChoose").attr("href","javascript:;"); //不可用标识
	        				$("#toCardUrl").css({"background-color":"#ccc","color":"#333"}); //置灰按钮
	        				$("#toCardUrl").addClass("disabled"); //不可用标识
	        				$("#toCardUrl").attr("href","javascript:;"); //不可用标识
	        				$("#toBuyUrl").css({"background-color":"#ccc","color":"#333"}); //置灰按钮
	        				$("#toBuyUrl").addClass("disabled"); //不可用标识
	        				$("#toBuyUrl").attr("href","javascript:;"); //不可用标识
	        				return;
	        			}
	        			var data = datas.data.sku;
	        			$("#skuIdTrack").val(data.id);
	        			$("#skuImage").attr("src",Config.imgPre + data.image);
	        			$("#skuPrice").html(data.price.toFixed(2));
	        			$("#skuStock").html(data.stock);
	        			if($("#specialtyContentId")){
	        				$("#specialtyContentId").val(data.exchangePoint);
	        			}
	        			$("#skuPrompt").html("规格："+skuItemVals.substring(0, skuItemVals.length-1));
	        			if($("#makeChoose").attr("type") == ""){
	        				$("#toCardUrl").attr("url","cart/add.shtml?shopId="+$("#shopId").val()+"&skuId="+data.id);
	        				if($("#goodsTypeId").val().trim()=="1"){
	        					if($("#specialtyContentId").val() && parseInt($("#specialtyContentId").val()) > 0){
		        					$("#toBuyUrl").attr("href","#order/retailOrder?shopId="+$("#shopId").val()+"&speConId="+$("#specialtyContentId").val());
		        				}else{
		        					$("#toBuyUrl").attr("href","#order/retailOrder?shopId="+$("#shopId").val()+"&skuId="+data.id);
		        				}
		    	    		}else{
		    	    			if($("#specialtyContentId").val() && parseInt($("#specialtyContentId").val()) > 0){
		        					$("#toBuyUrl").attr("href","#order/serviceOrder?shopId="+$("#shopId").val()+"&speConId="+$("#specialtyContentId").val());
		    	    			}else{
		        					$("#toBuyUrl").attr("href","#order/serviceOrder?shopId="+$("#shopId").val()+"&skuId="+data.id);
		        				}
		    	    		}
	        			}else if($("#makeChoose").attr("type") == "addCard"){
	        				$("#makeChoose").attr("url","cart/add.shtml?shopId="+$("#shopId").val()+"&skuId="+data.id);
	        			}else if($("#makeChoose").attr("type") == "buyNow"){
	        				if($("#goodsTypeId").val().trim()=="1"){
	        					if($("#specialtyContentId").val() && parseInt($("#specialtyContentId").val()) > 0){
		        					$("#makeChoose").attr("href","#order/retailOrder?shopId="+$("#shopId").val()+"&speConId="+$("#specialtyContentId").val());
		        				}else{
		        					$("#makeChoose").attr("href","#order/retailOrder?shopId="+$("#shopId").val()+"&skuId="+data.id);
		        				}
		    	    		}else{
		    	    			if($("#specialtyContentId").val() && parseInt($("#specialtyContentId").val()) > 0){
		        					$("#makeChoose").attr("href","#order/serviceOrder?shopId="+$("#shopId").val()+"&speConId="+$("#specialtyContentId").val());
		        				}else{
		        					$("#makeChoose").attr("href","#order/serviceOrder?shopId="+$("#shopId").val()+"&skuId="+data.id);
		        				}
		    	    		}
	        			}
	        			$("#skuIdTrack").val(data.id);
	        			//如果规格库存为0，禁用立即购买
	        			if(data.stock == "0"){
	        				$("#toBuyUrl").attr("href","javascript:;");
	        				$("#makeChoose").attr("href","javascript:;");
	        			}
	        		}
	        	});
	        },
	        //减少规格选择数量
	        subtraction : function(){
	        	var quantity = +$("#quantity").val();
	        	quantity = quantity -1;
	        	if(quantity < 1){
	        		return false;
	        	}
	        	$("#quantity").val(quantity);
	    	},
	    	//增加规格选择数量
	    	addition : function(){
	    		if(+$("#quantity").val() >= +$("#skuStock").html()){
	    			return;
	    		}
	    		if($("#limitCount").val() != "0" && $("#specialtyContentId").val() && $("#limitCount").val() && +$("#quantity").val() >= +$("#limitCount").val()){
	    			alert("限购数量为"+$("#limitCount").val());
	    			return;
	    		}
	    		$("#quantity").val((+$("#quantity").val())+1);
	    	},
	    	//添加购物车按钮，进入规格选择面板
	    	addCart : function(){
	    		$("#makeChoose").attr("href","javascript:;");
	    		$("#makeChoose").attr("type","addCard").attr("url","cart/add.shtml?shopId="+$("#shopId").val()+"&skuId="+$("#skuIdTrack").val()).show();
	    		$("#chooseOperation").hide();
	    		this.openSkuPanel();
	    	},
	    	//立即购买按钮，进入规格选择面板
	    	buyNow : function(){
	    		$("#chooseOperation").hide();
	    		this.openSkuPanel();
	    		$("#makeChoose").attr("url",null);
	    		if($("#goodsTypeId").val().trim()=="1"){
	    			if($("#specialtyContentId").val() && parseInt($("#specialtyContentId").val()) > 0){
    					$("#makeChoose").attr("type","buyNow").attr("href","#order/retailOrder?shopId="+$("#shopId").val()+"&speConId="+$("#specialtyContentId").val()).show();
    				}else{
    					$("#makeChoose").attr("type","buyNow").attr("href","#order/retailOrder?shopId="+$("#shopId").val()+"&skuId="+$("#skuIdTrack").val()).show();
    				}
	    		}else{
	    			if($("#specialtyContentId").val() && parseInt($("#specialtyContentId").val()) > 0){
    					$("#makeChoose").attr("type","buyNow").attr("href","#order/serviceOrder?shopId="+$("#shopId").val()+"&speConId="+$("#specialtyContentId").val()).show();
    				}else{
    					$("#makeChoose").attr("type","buyNow").attr("href","#order/serviceOrder?shopId="+$("#shopId").val()+"&skuId="+$("#skuIdTrack").val()).show();
    				}
	    		}
    			//库存为0，立即购买按钮
    			if($("#skuStock").html() == "0"){
    				$("#makeChoose").attr("href","javascript:;");
    			}

	    	},
	    	//代销、取消代销或上下架操作(当前对象，类型，商品Id，在卖人数)
	        sellOrMarketer : function(obj,type,goodsId){
	        	var isMarketer = null; 
	        	var sellType = null;
	        	if(type=="sell"){
	        		if($(obj).hasClass("bg-orange")){
		        		sellType = "add";
		        		isExistSign = true;
		        	}else{
		        		sellType = "delete";
		        	}
	        	}else{
	        		if($(obj).hasClass("bg-red")){
	        			isMarketer = true;
		        	}else{
		        		isMarketer = false;
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
    			        		$(obj).addClass("cowrieBtn");
    			        		$(obj).html("取消代销");
    			        	}else{ //取消代销，下架
    			        		$(obj).removeClass("cowrieBtn");
    			        		$(obj).addClass("bg-orange");
    			        		$(obj).html("代销");
    			        		$(obj).next().removeClass("cowrieBtn");
    			        		$(obj).next().addClass("bg-red");
    			        		$(obj).next().html("上架");
    			        	}
    		        	}else{
    		        		if($(obj).hasClass("bg-red")){ //上架，代销
    			        		$(obj).removeClass("bg-red");
    			        		$(obj).addClass("cowrieBtn");
    			        		$(obj).html("下架");
    			        		$(obj).prev().removeClass("bg-orange")
    			        		$(obj).prev().addClass("cowrieBtn");;
    			        		$(obj).prev().html("取消代销");
    			        	}else{ //下架
    			        		$(obj).removeClass("cowrieBtn");
    			        		$(obj).addClass("bg-red");
    			        		$(obj).html("上架");
    			        	}
    		        	}
    				},
    				error:function(data){
    					alert("亲，系统错误请您稍后再试！");
    				}
    			});
	        },
	    	loadData : function(pageNum,pageSize){
	        	var ctrl =this;
	        	$.ajax({
    				url:"goods/goodsEvaluate.shtml",
    				data:{"pageNum":pageNum,"pageSize":pageSize,"goodsId":ctrl.goodsId},
    				async:false,
    				dataType:"json",
    				type:"GET",
    				success:function(data){
    					//console.log("第"+pageNum+"页");
    					if(data.status==0){
    						alert(data.errorMsg);
    						if(data.errorCode==1000){
    							DO("passport/login");
    						}else{
    							DO("error", data);
    						}
    						return false;
    					}
    					var html="";
    					if(data.data.evaluateItems.length==0){
    						ctrl.continueLoad = false;
    						$("html,body").loadingWrapCancel();
    						if(pageNum == 1){
    							html+="<div class='reminder'>"
    								+ "		<i class='iconfont color-gray9'>&#xe663;</i>"
    								+ "		<h5 class='m-top40 color-gray9'>您还没有相关评价哦~~</h5>"
    								+ "</div>"
    						}
    						$("#evaluateList").append(html);
    						return false;
    					}
    					if(data.data.evaluateItems.length<ctrl.pageSize){
    						ctrl.continueLoad = false;
    					}
					    $.each(data.data.evaluateItems, function (oIndex,eItem){
					    	var score = eItem.evaluateScore;
					    	html+="<div class='list'>"
					            +    "<h5>"
					            +        "<em>"
					            +        "<img width='100%' src='"+Config.imgPre+eItem.evaluateIcon+"' />"
					            +        "</em>"
					            +        	eItem.evaluateUsername
					            +        "<div class='starbg kdl-right'>"
					            +        	 "<span width='70'></span>"
					            +            "<div class='bgone'>"
					            +                "<i class='iconfont'>&#xe642;</i>"
					            +                "<i class='iconfont'>&#xe642;</i>"
					            +                "<i class='iconfont'>&#xe642;</i>"
					            +                "<i class='iconfont'>&#xe642;</i>"
					            +                "<i class='iconfont'>&#xe642;</i>"
					            +            "</div>"
					            +            "<div class='bgtwo'>";
					            for (var i = 0; i < score; i++) {
					            	html+="<i class='iconfont color-orange'>&#xe642;</i>";
					            };
				            html+=            "</div>"
					            +        "</div>"
					            +    "</h5>"
					            +    "<p class='m-top20'>"+eItem.evaluateContent+"</p>"
					            +    "<div class='pic clearfix m-top20'>"
					            +        "<span>";
					    	if(eItem.evaluateImageSrcs!=null && eItem.evaluateImageSrcs.length>0){
					    		$.each(eItem.evaluateImageSrcs, function (iIndex, image) {
					    			html+="<img src='"+Config.imgPre+image+"'/>";
					    		})
					    	}else{
					    		html+="";
					    	}
						    	
					    	html+=   	"</span>"
					            +    "</div>"
					            +    "<div class='list-info m-top30 color-gray9 clearfix'>"
					            +        "<span class='kdl-left'>"+eItem.evaluateDate+"</span>"
					            +        "<span class='kdl-right'>"+eItem.evaluateSkuValue+"</span>"
					            +    "</div>"
					            +"</div>"
			            });
					    $("#evaluateList").append(html);
					    $("html,body").loadingWrapCancel();
					    $(".evaluate-con .list>div.pic>span>img").initImgTouch();
    				},
    				error:function(data){
    					alert("亲，系统错误请您稍后再试！");
    				}
    			});
	        },
	        //滚动条
	        scrollLoad : function(){
	        	 if($.getScrollBottom()<3){
	           		 if(this.continueLoad){
	           			 this.pageNum = this.pageNum+1;
	           			 this.loadData(this.pageNum,this.pageSize);
	           		 }
	        	 }
	        }, 
	        _pass:function(){
	        	$(document).unbind("scroll");
	        	clearInterval(this.activityInterval); //关闭活动倒计时
	        	
	        	if(localStorage.getItem("accessToken")==null){
	        		return false;
	        	}
	        	//停留时间
	        	var leaveTime = new Date().getTime();
	        	var stayTime = leaveTime-this.openTime;
	        	//访问时间  this.opTime;
	        	var goodsId = this._param.goodsId;
	        	var preUrl = _lastCtrl && _lastCtrl._hash;
	        	var nextUrl = location.hash;
	        	var specialtyContentId = this._param.specialtyContentId;
	        	var shopId = this._param.shopId;
	        	$.ajax({
    				url:"goods/addGoodsBrowseLog.shtml",
    				data:{"goodsId":goodsId,"shopId":shopId,"stayTime":stayTime,"nextUrl":nextUrl,"preUrl":preUrl,"specialtyContentId":specialtyContentId},
    				async:true,
    				dataType:"json",
    				type:"post",
    				success:function(data){
    					
    				},
    				error:function(data){
    					alert("亲，系统错误请您稍后再试！");
    				}
    			});

	        	//shopId
	        },
	        //打开活动倒计时
	        openCountDown : function(){
	        	var ctrl = this;
	        	ctrl.activityInterval = setInterval(function(){
	        		if(ctrl.countDown == 86400 || ctrl.countDown == 0){
	        			RELOAD(true);
	        		}
        			var d=Math.floor(ctrl.countDown/60/60/24);
        			var h=Math.floor(ctrl.countDown/60/60%24);
        			var m=Math.floor(ctrl.countDown/60%60);
        			var s=Math.floor(ctrl.countDown%60);
        			document.getElementById("t_d").innerHTML = d + "天";
        			document.getElementById("t_h").innerHTML = h + "时";
        			document.getElementById("t_m").innerHTML = m + "分";
        			document.getElementById("t_s").innerHTML = s + "秒";
				    ctrl.countDown--;
	        	},1000);
	        }
	    },
        /*商品分类*/
        "goods/goodsCategory": {
            _title:"商品分类",
            _footer:false,
            pageSize:6,
            pageNum:1,
            flag:true,
            isLocal:null,
            _load: function(){
            	/**加载数据*/
            	//获取地区
    	        $.get("area/findAreas.shtml",{
    	        	grade : 2,
    	        	parentId : Config.area.id
    	        },function(data){
    	        	var areaList = data.data.areaList;
    	        	if(areaList != null && areaList.length > 0){
    	        		var temp = "";
    	        		for(var i = 0;i < areaList.length;i++){
    	        			temp += '<li>'+
    				                    '<a href="javascript:;" onclick="this.ctrl.toSetArea(this,'+areaList[i].id+')"><span>'+areaList[i].name+'</span><i class="kdl-right iconfont">&#xe653;</i></a>'+
    				                '</li>';
    	        		}
    	        		$("#areaUl").append(temp);
    	        	}
    	        });
    	        //获取商品分类
    	        $.get("category/loadSubGoodsCategorys.shtml",{
    	        	goodsCategoryId:_param.goodsCategoryId,
    	        	grade:1
    	        },function(data){
    	        	$("#cateNameTitle").html(data.data.rootCate.name);
    	        	var goodsCategoryList = data.data.subGoodsCategorys;
    	        	if(goodsCategoryList && goodsCategoryList.length > 0){
    	        		var temp = "";
    	        		for(var i=0;i<goodsCategoryList.length;i++){
    	        			temp += '<li>'+
		                    			'<a href="javascript:;" onclick="this.ctrl.toSetGoodsCategory(this,'+goodsCategoryList[i].id+')"><span>'+goodsCategoryList[i].name+'</span><i class="kdl-right iconfont">&#xe653;</i></a>'+
		                    	    '</li>';
    	        		}
    	        		$("#goodsCategoryUl").append(temp);
    	        	}
    	        })
            	var ctrl = this;
            	ctrl.loadData();
            	setREG("document_scroll", ctrl._name, function(){
                    if($.getScrollBottom()<3 && ctrl.flag){
                    	ctrl.pageNum++;
	            		ctrl.loadData();
	            	}
                });
                /*tab切换*/
                var hi=$(document).height();
                $("#screen>li").click(function(){
                    $(this).addClass("cur").siblings().removeClass("cur");
                    var listval=$(this).index();
                    if(listval == 0){
                        $(".clssfiy").siblings().hide();
                        $(".clssfiy").toggle();
                        if($(".clssfiy").css('display')=='block'){
                            $(".theme-popover-mask").show();
                            $(".siftingbox").show();
                            $("body").css({"height":hi,"overflow":"hidden"});
                        }
                        else{
                            $(".theme-popover-mask").hide();
                            $(".siftingbox").hide();
                            $("body").css({"height":"auto","overflow":"inherit"});
                        }
                    }else if(listval == 1){
                        $(".Sort").siblings().hide();
                        $(".Sort").toggle();
                        if($(".Sort").css('display')=='block'){
                            $(".theme-popover-mask").show();
                            $(".siftingbox").show();
                            $("body").css({"height":hi,"overflow":"hidden"});
                        }
                        else{
                            $(".theme-popover-mask").hide();
                            $(".siftingbox").hide();
                            $("body").css({"height":"auto","overflow":"inherit"});
                        }
                    }else if(listval == 2){
                        $(".city").siblings().hide();
                        $(".city").toggle();
                        if($(".city").css('display')=='block'){
                            $(".theme-popover-mask").show();
                            $(".siftingbox").show();
                            $("body").css({"height":hi,"overflow":"hidden"});
                        }
                        else{
                            $(".theme-popover-mask").hide();
                            $(".siftingbox").hide();
                            $("body").css({"height":"auto","overflow":"inherit"});
                        }
                    }else if(listval == 3){
                        $(".screening").siblings().hide();
                        $(".screening").toggle();
                        if($(".screening").css('display')=='block'){
                            $(".theme-popover-mask").show();
                            $(".siftingbox").show();
                            $("body").css({"height":hi,"overflow":"hidden"});
                        }
                        else{
                            $(".theme-popover-mask").hide();
                            $(".siftingbox").hide();
                            $("body").css({"height":"auto","overflow":"inherit"});
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
                    $('.city>ul,.clssfiy>ul').css("max-height",num);
                });
              
            },
            toSetArea:function(obj,areaId){
            	$(obj).closest("li").addClass("cur").siblings("li").removeClass("cur");
            	$("#areaId").val(areaId);
            	
            	$(obj).closest("div").hide();
            	$(".theme-popover-mask").hide();
            	$("body").css({"height":"auto","overflow":"inherit"});
            	$("#screen>li:nth-child(3)").find("span").html($(obj).find("span").text());
            	
            	this.reloadData();
            },
            toSetGoodsCategory:function(obj,goodsCategoryId){
            	$(obj).closest("li").addClass("cur").siblings("li").removeClass("cur");
            	$("#goodsCategoryId").val(goodsCategoryId);
            	
            	$(obj).closest("div").hide();
            	$(".theme-popover-mask").hide();
            	$("body").css({"height":"auto","overflow":"inherit"});
            	$("#screen>li:nth-child(1)").find("a").html($(obj).find("span").text()+"<cite>▾</cite>");
            	
            	this.reloadData();
            },
            toSetOrders:function(obj,orders){
            	$(obj).closest("li").addClass("cur").siblings("li").removeClass("cur");
            	$("#orders").val(orders);
            	
            	$(obj).closest("div").hide();
            	$(".theme-popover-mask").hide();
            	$("body").css({"height":"auto","overflow":"inherit"});
            	$("#screen>li:nth-child(2)").find("a").html($(obj).find("span").text());
            	
            	this.reloadData();
            },
            toSetCowrieStatus:function(){
            	var index = $(".char .cur").index();
            	if(index == 0){
            		$("#cowrieStatus").val("");
            	}else if(index == 1){
            		$("#cowrieStatus").val("pass");
            	}else{
            		$("#cowrieStatus").val("unSubmit");
            	}
            	
            	$(".screening").hide();
            	$(".theme-popover-mask").hide();
            	$("body").css({"height":"auto","overflow":"inherit"});
            	
            	this.reloadData();
            },
            reloadData:function(){
            	this.pageNum = 1;
            	this.flag = true;
            	$(".goodsContent>ul").empty();
            	this.loadData();
            },
            loadData:function(){
            	var ctrl = this;
            	 $.getPosition(function(x,y,cityname){
            		 $.post("goods/search.shtml",{
            			 position:x+","+y,
            			 cityName:cityname?cityname:Config.area.name,
            			 isLocal:ctrl.isLocal,
            			 goodsCategoryId:$("#goodsCategoryId").val(),//二级
            			 oneGoodsCategoryId:!$("#goodsCategoryId").val()?_param.goodsCategoryId:"",//一级
            			 cityId:Config.area.id,
            			 areaId:$("#areaId").val(),
            			 minPrice:$("#minPrice").val(),
            			 maxPrice:$("#maxPrice").val(),
            			 goodsTypeId:"",
            			 orders:$("#orders").val(),
            			 cowrieStatus:$("#cowrieStatus").val(),
            			 pageNum:ctrl.pageNum,
            			 pageSize:ctrl.pageSize
            		 },function(data){
            			ctrl.isLocal = data.data.local;
            			var goodsList = "";
                  		if(data && data.data.goodsList && data.data.goodsList.length > 0){
                  			goodsList = data.data.goodsList;
                  		}
                  		if(ctrl.pageNum == 1 && !goodsList){
                  			$(".warn").html(REND("include/empty",{icon:"&#xe660;",tip:"sorry,没有搜到您要找的商品哦~",price:"1",display:"block",paddingbottom:"1"}));
                  			return false;
                  		}else{
                  			$(".warn").empty();
                  		}
                  		if(goodsList.length < ctrl.pageSize){
                  			ctrl.flag = false;
                  		}
                  		$.each(goodsList,function(i,o){
                  			var consumeTipsBtn = "";
                  			var param = "";
                  			if(o.consumeTips){
                  				consumeTipsBtn = '<button>返￥'+o.consumeTips.toFixed(2)+'</button>';
                  				param = "&shopId=1"
                  			}
                  			var temp = "";
                  			if(ctrl.isLocal){
                  				temp = o._district;
                  			}else{
                  				temp = o._distance+"m";
                  			}
                 			$('\
                 	                    <li>\
                 	                       <a href="#goods/details?goodsId='+o.goodsId+param+'">\
                 	                           <div class="pic">\
                 	                               <img src="'+Config.imgPre+o.image+'"/>\
                 	                               <div class="bt">\
                 	                                   <div></div>\
                 	                                   <p class="ellips1">'+o.shopName+'</p>\
                 	                               </div>\
                 	                           </div>\
                 	                           <div class="txt">\
                 	                               <h6 class="color-gray6 ellips">'+o._name+'</h6>\
                 	                               <h5 class="color-red h3 m-top10">￥'+o.price.toFixed(2)+consumeTipsBtn+'</h5>\
                 	                               <div class="color-gray9 p m-top10">好评率:'+o.score+'%</div>\
                 	                               <p class="color-gray9 clearfix m-top10"><span class="kdl-left">销量：'+o.sales+'</span><span class="kdl-right color-red h5">'+temp+'</span></p>\
                 	                           </div>\
                 	                       </a>\
                 	                   </li>\
                 			').appendTo($(".goodsContent>ul"));
                 			
                 		});
            		 })
            	 });
            }
        },
    	/*全部分类*/
    	"goods/allClassify": {
        	_title:"全部分类",
        	_footer:false,
        	_load: function(){
        		$.get("category/getGoodsCateGoodsType.shtml",{},function(data){
        			if(data.data.goodsCateGoodsTypeList && data.data.goodsCateGoodsTypeList.length > 0){
        				var goodsCateGoodsTypes = data.data.goodsCateGoodsTypeList;
        				for(var i=0;i<goodsCateGoodsTypes.length;i++){
        					var localLife = "";
        					var shoppingCenter = "";
        					if(goodsCateGoodsTypes[i].goodsType.id == 4){//服务
        						localLife += '<li>'+
				        			                '<a href="#goods/goodsCategory?goodsCategoryId='+goodsCateGoodsTypes[i].goodsCategoryId+'">'+
						        	                    '<span>'+
						        	                        '<img src="'+Config.imgPre+goodsCateGoodsTypes[i].goodsCategory.image+'"/>'+
						        	                    '</span>'+
						        	                    '<p>'+goodsCateGoodsTypes[i].goodsCategory.name+'</p>'+
						        	                '</a>'+
						        	            '</li>';
        					}
        					if(goodsCateGoodsTypes[i].goodsType.id == 1){//零售
        						shoppingCenter += '<li>'+
				    			                '<a href="#goods/goodsCategory?goodsCategoryId='+goodsCateGoodsTypes[i].goodsCategoryId+'">'+
					        	                    '<span>'+
					        	                        '<img src="'+Config.imgPre+goodsCateGoodsTypes[i].goodsCategory.image+'"/>'+
					        	                    '</span>'+
					        	                    '<p>'+goodsCateGoodsTypes[i].goodsCategory.name+'</p>'+
					        	                '</a>'+
					        	            '</li>';
        					}
        					$(".content>div:first>ul").append(localLife);
        					$(".content>div:nth-child(2)>ul").append(shoppingCenter);
        				}
        			}
        		})
        	}
    	},
    	 /*广告位*/
        "goods/homeBooth": {
            _title:"广告位",
            _footer:false,
            pageNum:1,
    		pageSize:6,
    		flag:true,
    		style:1,
            _load: function(){
            	var ctrl = this;
            	ctrl.loadData();
            	if($("body").height()<$(window).height()){
            		this._dom.find(".content").css("min-height",$(window).height()-$(window).width()*500/640);
            	}
            	setREG("document_scroll", ctrl._name, function(){
                    if($.getScrollBottom()<3 && ctrl.flag){
                    	ctrl.pageNum++;
	            		ctrl.loadData();
	            	}
                });
            },
            loadData:function(){
            	 var ctrl = this;
           		 $.get("specialtyContent/specialtyContents.shtml",{
           			 specialtyDisplayId:_param.specialtyDisplayId,
           			 areaId:Config.area.id,
           			 pageNum:ctrl.pageNum,
           			 pageSize:ctrl.pageSize
           		 },function(data){
           			if(data.data && data.data.specialtyDisplay){
          				var specialtyDisplay = data.data.specialtyDisplay;
          				ctrl.style=specialtyDisplay.templateSign;
          				$("#subtitle").text(specialtyDisplay.title);//标题
          				$(".content").css("background-image",'url('+Config.imgPre+specialtyDisplay.bannerImage+')');//横幅
          				$(".content").css("background-color",specialtyDisplay.backColor);//背景色
          				$("head title").html("开店啦-"+specialtyDisplay.title);
          			}
           			var specialtyContentList = "";
                 		if(data.data && data.data.specialtyContentList){
                 			specialtyContentList = data.data.specialtyContentList;
                 		}else{
                 			return false;
                 		}
                 		
                 		if(specialtyContentList.length < ctrl.pageSize){
                 			ctrl.flag = false;
                 		}
                 		if(ctrl.pageNum > 1){
                 			var temp = '';
                 			if(ctrl.style == "1"){
                 				for(var i=0;i<specialtyContentList.length;i++){
                 					temp += ctrl.styleFun1(specialtyContentList[i]);
                     			}
                 				$(".commodity1>ul").append(temp);
                 			}else if(ctrl.style == "2"){
                 				for(var i=0;i<specialtyContentList.length;i++){
                 					temp += ctrl.styleFun2(specialtyContentList[i]);
                     			}
                 				$(".commodity2>ul").append(temp);
                 			}else if(ctrl.style == "3" || ctrl.style == "4"){
                 				for(var i=0;i<specialtyContentList.length;i++){
                 					temp += ctrl.styleFun3(specialtyContentList[i]);
                     			}
                 				$(".commodity3>ul").append(temp);
                 			}
                 			
                 		}else{//第一次加载
                 			if(ctrl.style == "1"){
                 				var temp = '';
                 				for(var i=0;i<specialtyContentList.length;i++){
                 					temp += ctrl.styleFun1(specialtyContentList[i]);
                     			}
                 				$(".commodityList").append('<div class="commodity1 clearfix"><ul>'+temp+'</ul></div>');
                 			}else if(ctrl.style == "2"){
                 				var temp = '';
                 				for(var i=0;i<specialtyContentList.length;i++){
                 					temp += ctrl.styleFun2(specialtyContentList[i]);
                     			}
                 				$(".commodityList").append('<div class="commodity2 clearfix"><ul>'+temp+'</ul></div>');
                 			}else if(ctrl.style == "3"){
                 				var temp = '';
                 				for(var i=0;i<specialtyContentList.length;i++){
                 					temp += ctrl.styleFun3(specialtyContentList[i]);
                     			}
                 				$(".commodityList").append('<div class="commodity3 clearfix"><ul>'+temp+'</ul></div>');
                 			}else if(ctrl.style == "4"){
                 				var str1 = "";
                     			var str2 = "";
                     			var str3 = "";
                 				for(var i=0;i<specialtyContentList.length;i++){
                 					if(i==0){
                 						str1 += ctrl.styleFun1(specialtyContentList[i]);
                 					}else if(i==1){
                 						str2 += ctrl.styleFun2(specialtyContentList[i]);
                 					}else{
                 						str3 += ctrl.styleFun3(specialtyContentList[i]);
                 					}
                     			}
                 				var str = '<div class="commodity1"><ul>'+str1+'</ul></div>'+
                 				'<div class="commodity2"><ul>'+str2+'</ul></div>'+
                 				'<div class="commodity3"><ul class="clearfix">'+str3+'</ul></div>';
                 				$(".commodityList").append(str);
                 			}
                 		}
           		 })
            },
            styleFun1:function(obj){
            	var param = "";
				var consumeTipsSpan = "";
				if(obj.goods.cowrieStatus=="pass" && parseFloat(obj.consumeTips)>0){
					param = "&shopId=1";
					consumeTipsSpan = '<span>返￥'+obj.consumeTips.toFixed(2)+'</span>';
				}
 				return '<li>'+
 				'<a href="#goods/details?goodsId='+obj.goodsId+'&specialtyContentId='+obj.id+param+'">'+
 				'<div class="pic">'+
 				'<img src="'+Config.imgPre+obj.goods.image+'"/>'+
 				'<span></span>'+
 				'<h6 class="ellips1">'+obj.shop.shopName+'</h6>'+
 				'</div>'+
 				'<div class="txt">'+
 				'<h5 class="ellips">'+obj.goods.name+'</h5>'+
 				'<h3 class="color-red m-top20">￥'+obj.price.toFixed(2)+consumeTipsSpan+'</h3>'+
 				'<del class="color-gray9">￥'+obj.goods.originalPrice.toFixed(2)+'</del>'+
 				'</div>'+
 				'</a>'+
 				'</li>'
            },
            styleFun2:function(obj){
            	var param = "";
				var consumeTipsDiv = "";
				if(obj.goods.cowrieStatus=="pass" && parseFloat(obj.consumeTips)>0){
					param = "&shopId=1";
					consumeTipsDiv = '<p class="color-red">￥'+obj.consumeTips.toFixed(2)+'</p>'+
									'<p class="color-red">返现</p>';  
         								
				}
 				return  '<li>'+
 				'<a href="#goods/details?goodsId='+obj.goodsId+'&specialtyContentId='+obj.id+param+'">'+
                        '<div class="pic">'+
                            '<img src="'+Config.imgPre+obj.goods.image+'"/>'+
                            '<span></span>'+
                            '<h6 class="ellips1">'+obj.shop.shopName+'</h6>'+
                        '</div>'+
                        '<div class="hd clearfix">'+
                            '<div class="txt kdl-left clearfix">'+
                                '<h5 class="ellips">'+obj.goods.name+'</h5>'+
                                '<h3 class="color-red m-top10">￥'+obj.price.toFixed(2)+'<del class="color-gray9">￥'+obj.goods.originalPrice.toFixed(2)+'</del></h3>'+
                            '</div>'+
                            '<div class="kdl-left">'+consumeTipsDiv+'</div>'+
                        '</div>'+
                    '</a>'+
                    '<button class="color-white bg-red m-top10" onclick="GO(\'goods/details?goodsId='+obj.goodsId+'&specialtyContentId='+obj.id+param+'\')">立即抢购</button>'+
                '</li>'
            },
            styleFun3:function(obj){
            	var param = "";
				var consumeTipsSpan = "";
				if(obj.goods.cowrieStatus=="pass" && parseFloat(obj.consumeTips)>0){
					param = "&shopId=1";
					consumeTipsSpan = '<span class="m-top10">返￥'+obj.consumeTips.toFixed(2)+'</span>';
				}
 				return '<li>'+
 				'<a href="#goods/details?goodsId='+obj.goodsId+'&specialtyContentId='+obj.id+param+'">'+
 				'<div class="pic">'+
 				'<img src="'+Config.imgPre+obj.goods.image+'"/>'+
 				'<span></span>'+
 				'<h6 class="ellips1">'+obj.shop.shopName+'</h6>'+
 				'</div>'+
 				'<div class="txt">'+
 				'<h5 class="ellips">'+obj.goods.name+'</h5>'+
 				'<h3 class="color-red m-top20">￥'+obj.price.toFixed(2)+'</h3>'+
 				consumeTipsSpan+
 				'</div>'+
 				'</a>'+
 				'</li>'
            }
        },
         /*活动专区*/
        "goods/activityArea": {
            _title:"活动专区",
            _footer:false,
            pageNum:1,
    		pageSize:6,
    		flag:true,
    		style:4,
           /* _datas:{
            	specialtyDisplay:GET("common/specialtyDisplayInfo.shtml",{specialtyDisplayId:PARAM("specialtyDisplayId")},function(data){
            		return data.specialtyDisplay;
            	})
            },*/
            _load: function(){
            	var ctrl = this;
            	ctrl.loadData();
            	setREG("document_scroll", ctrl._name, function(){
                    if($.getScrollBottom()<3 && ctrl.flag){
                    	ctrl.pageNum++;
	            		ctrl.loadData();
	            	}
                });
            },
            loadData:function(){
           	 var ctrl = this;
          		 $.get("specialtyContent/specialtyContents.shtml",{
          			 specialtyDisplayId:_param.specialtyDisplayId,
          			 areaId:Config.area.id,
          			 pageNum:ctrl.pageNum,
          			 pageSize:ctrl.pageSize
          		 },function(data){
	          			if(data.data && data.data.specialtyDisplay){
	          				var specialtyDisplay = data.data.specialtyDisplay;
	          				ctrl.style=specialtyDisplay.templateSign;
	          				$("#subtitle").text(specialtyDisplay.subtitle);//副标题
	          				$("#bannerImage").attr("src",Config.imgPre+specialtyDisplay.bannerImage);//横幅
	          				$(".content").css("background-color",specialtyDisplay.backColor);//背景色
	          				$("#introduce").text(specialtyDisplay.introduce);//介绍
	          			}
	          			var specialtyContentList = "";
                		if(data.data && data.data.specialtyContentList){
                			specialtyContentList = data.data.specialtyContentList;
                		}else{
                			return false;
                		}
                		
                		if(specialtyContentList.length < ctrl.pageSize){
                			ctrl.flag = false;
                		}
                		
                		if(ctrl.pageNum == 1 && specialtyContentList.length == 0){
                			$(".content").css("background-color","#f0f0f0");//背景色
                			$(".warn").html(REND("include/empty",{icon:"&#xe660;",tip:"sorry,未加载出相关商品",price:"1",display:"block",paddingbottom:"1"}));
                			return false;
                		}else{
                			$(".warn").html("");
                		}
                		if(ctrl.pageNum > 1){
                			var temp = '';
                			if(ctrl.style == "1"){
                				for(var i=0;i<specialtyContentList.length;i++){
                    				temp += ctrl.styleFun1(specialtyContentList[i]);
                    			}
                				$(".commodity1>ul").append(temp);
                			}else if(ctrl.style == "2"){
                				for(var i=0;i<specialtyContentList.length;i++){
                					temp += ctrl.styleFun2(specialtyContentList[i]);
                    			}
                				$(".commodity2>ul").append(temp);
                			}else if(ctrl.style == "3" || ctrl.style == "4"){
                				for(var i=0;i<specialtyContentList.length;i++){
                					temp += ctrl.styleFun3(specialtyContentList[i]);
                    			}
                				$(".commodity3>ul").append(temp);
                			}
                			
                		}else{//第一次加载
                			if(ctrl.style == "1"){
                				var temp = '';
                				for(var i=0;i<specialtyContentList.length;i++){
                					temp += ctrl.styleFun1(specialtyContentList[i]);
                    			}
                				$(".commodityList").append('<div class="commodity1 clearfix"><ul>'+temp+'</ul></div>');
                			}else if(ctrl.style == "2"){
                				var temp = '';
                				for(var i=0;i<specialtyContentList.length;i++){
                					temp += ctrl.styleFun2(specialtyContentList[i]);
                    			}
                				$(".commodityList").append('<div class="commodity2 clearfix"><ul>'+temp+'</ul></div>');
                			}else if(ctrl.style == "3"){
                				var temp = '';
                				for(var i=0;i<specialtyContentList.length;i++){
                					temp += ctrl.styleFun3(specialtyContentList[i]);
                    			}
                				$(".commodityList").append('<div class="commodity3 clearfix"><ul>'+temp+'</ul></div>');
                			}else if(ctrl.style == "4"){
                				var str1 = "";
                    			var str2 = "";
                    			var str3 = "";
                				for(var i=0;i<specialtyContentList.length;i++){
                					if(i==0){
                						str1 += ctrl.styleFun1(specialtyContentList[i]);
                					}else if(i==1){
                						str2 += ctrl.styleFun2(specialtyContentList[i]);
                					}else{
                						str3 += ctrl.styleFun3(specialtyContentList[i]);
                					}
                    			}
                				var str = '<div class="commodity1"><ul>'+str1+'</ul></div>'+
                				'<div class="commodity2"><ul>'+str2+'</ul></div>'+
                				'<div class="commodity3"><ul class="clearfix">'+str3+'</ul></div>';
                				$(".commodityList").append(str);
                			}
                		}
          		 })
           },
           styleFun1:function(obj){
        	   var param = "";
				var consumeTipsSpan = "";
				if(obj.goods.cowrieStatus=="pass" && parseFloat(obj.consumeTips)>0){
					param = "&shopId=1";
					consumeTipsSpan = '<span>返￥'+obj.consumeTips.toFixed(2)+'</span>';
				}
				return '<li>'+
				'<a href="#goods/details?goodsId='+obj.goodsId+'&specialtyContentId='+obj.id+param+'">'+
				'<div class="pic">'+
				'<img src="'+Config.imgPre+obj.goods.image+'"/>'+
				'</div>'+
				'<div class="txt">'+
				'<h5 class="ellips">'+obj.goods.name+'</h5>'+
				'<h3 class="color-red m-top20">￥'+obj.price.toFixed(2)+consumeTipsSpan+'</h3>'+
				'<del class="color-gray9">￥'+obj.goods.originalPrice.toFixed(2)+'</del>'+
				'</div>'+
				'</a>'+
				'</li>'
           },
           styleFun2:function(obj){
        	   var param = "";
				var consumeTipsDiv = "";
				if(obj.goods.cowrieStatus=="pass" && parseFloat(obj.consumeTips)>0){
					param = "&shopId=1";
					consumeTipsDiv = '<p class="color-red">￥'+obj.consumeTips.toFixed(2)+'</p>'+
									'<p class="color-red">返现</p>'; 
            								
				}
				return '<li>'+
				'<a href="#goods/details?goodsId='+obj.goodsId+'&specialtyContentId='+obj.id+param+'">'+
                       '<div class="pic">'+
                           '<img src="'+Config.imgPre+obj.goods.image+'"/>'+
                       '</div>'+
                       '<div class="hd clearfix">'+
                           '<div class="txt kdl-left clearfix">'+
                               '<h5 class="ellips">'+obj.goods.name+'</h5>'+
                               '<h3 class="color-red m-top10">￥'+obj.price.toFixed(2)+'<del class="color-gray9">￥'+obj.goods.originalPrice.toFixed(2)+'</del></h3>'+
                           '</div>'+
                           '<div class="kdl-left">'+consumeTipsDiv+'</div>'+
                       '</div>'+
                   '</a>'+
                   '<button class="color-white bg-red m-top10" onclick="GO(\'goods/details?goodsId='+obj.goodsId+'&specialtyContentId='+obj.id+param+'\')">立即抢购</button>'+
               '</li>'
           },
           styleFun3:function(obj){
        	   var param = "";
				var consumeTipsSpan = "";
				if(obj.goods.cowrieStatus=="pass" && parseFloat(obj.consumeTips)>0){
					param = "&shopId=1";
					consumeTipsSpan = '<span class="m-top10">返￥'+obj.consumeTips.toFixed(2)+'</span>';
				}
				return '<li>'+
				'<a href="#goods/details?goodsId='+obj.goodsId+'&specialtyContentId='+obj.id+param+'">'+
				'<div class="pic">'+
				'<img src="'+Config.imgPre+obj.goods.image+'"/>'+
				'</div>'+
				'<div class="txt">'+
				'<h5 class="ellips">'+obj.goods.name+'</h5>'+
				'<h3 class="color-red m-top20">￥'+obj.price.toFixed(2)+'</h3>'+
				consumeTipsSpan+
				'</div>'+
				'</a>'+
				'</li>'
           }
        },
        /*超高返*/
        "goods/superReturn": {
            _title:"超级返现",
            _footer:false,
            pageNum:1,
    		pageSize:6,
    		flag:true,
            _load: function(){
            	var ctrl = this;
            	ctrl.loadData();
            	setREG("document_scroll", ctrl._name, function(){
                    if($.getScrollBottom()<3 && ctrl.flag){
                    	ctrl.pageNum++;
	            		ctrl.loadData();
	            	}
                });
            },
            loadData:function(){
           	 	var ctrl = this;
          		 $.get("specialtyContent/specialtyContents.shtml",{
          			 specialtyDisplayId:_param.specialtyDisplayId,
          			 areaId:Config.area.id,
          			 pageNum:ctrl.pageNum,
          			 pageSize:ctrl.pageSize
          		 },function(data){
          			var specialtyContentList = "";
            		if(data.data && data.data.specialtyContentList){
            			specialtyContentList = data.data.specialtyContentList;
            		}else{
            			return false;
            		}
            		if(ctrl.pageNum == 1 && specialtyContentList.length == 0){
            			$(".warn").html(REND("include/empty",{icon:"&#xe660;",tip:"sorry,没有搜到您要找的商品哦~",price:"1",display:"block",paddingbottom:"1"}));
            			return false;
            		}else{
            			$(".warn").html("");
            		}
            		
            		if(specialtyContentList.length < ctrl.pageSize){
            			ctrl.flag = false;
            			$("#warn").show();
            		}else{
            			$("#warn").hide();
            		}
            		if(specialtyContentList.length==0){
            			return false;
            		}
        			var temp = '';
    				for(var i=0;i<specialtyContentList.length;i++){
    					var param = "";
    					var consumeTipsBtn = "";
    					if(specialtyContentList[i].goods.cowrieStatus=="pass" && parseFloat(specialtyContentList[i].consumeTips)>0){
    						param = "&shopId=1";
    						consumeTipsBtn =  '<button>返￥'+specialtyContentList[i].consumeTips.toFixed(2)+'</button>';
    					}
        				temp += '<li>'+
        							'<a href="#goods/details?goodsId='+specialtyContentList[i].goodsId+'&specialtyContentId='+specialtyContentList[i].id+param+'">'+
			                            '<div class="pic">'+
			                                '<img src="'+Config.imgPre+specialtyContentList[i].goods.image+'"/>'+
			                                '<div class="bt">'+
			                                    '<div></div>'+
			                                    '<p>'+specialtyContentList[i].shop.shopName+'</p>'+
			                                '</div>'+
			                            '</div>'+
			                            '<div class="txt">'+
			                                '<h6 class="color-gray6 ellips">'+specialtyContentList[i].goods.name+'</h6>'+
			                                '<h5 class="color-red h3 m-top10">￥'+specialtyContentList[i].price.toFixed(2)+consumeTipsBtn+'</h5>'+
			                                '<div class="color-gray9 p m-top10">好评率:'+specialtyContentList[i].goods.score+'%</div>'+
			                                '<p class="color-gray9 clearfix m-top10"><span class="kdl-left">销量：'+specialtyContentList[i].goods.sales+'</span></p>'+
			                            '</div>'+
			                        '</a>'+
			                    '</li>';
        			}
    				$(".content>div>ul").append(temp);
          		 })
            }
        },
        /*超值购*/
        "goods/overflowPurchase":{
            _title: "超值购",
            _footer: false,
            pageNum:1,
    		pageSize:6,
    		flag:true,
            _load: function () {
            	$(".navbar").css("top","0");
            	$(".RegisterNow").hide();
	        	 $(".RegisterNow>i").click(function(){
	                 $(".RegisterNow").hide();
	                 $(".navbar").css("top","0");
	                 $(".content").removeClass("cur");
	             })
	             $.getUser(function(user){
	            	 if(!user && _param.tjrxx){
	            		 $(".RegisterNow").show();
	            		 $(".navbar").css("top",".8rem");
	            		 $(".content").addClass("cur");
	            	 }
	             })
                var ctrl = this;
            	ctrl.loadData();
            	setREG("document_scroll", ctrl._name, function(){
                    if($.getScrollBottom()<3 && ctrl.flag){
                    	ctrl.pageNum++;
	            		ctrl.loadData();
	            	}
                });
            },
            loadData:function(){
           	 	var ctrl = this;
           	 	if(_param.tjrxx){
           	 		localStorage.set("KAIDIANLAATJR", _param.tjrxx,20*60*1000);
           	 		//$.addCookie("KAIDIANLAATJR", _param.tjrxx,{expires:20*60});
           	 	}
          		 $.get("specialtyContent/specialtyContents.shtml",{
          			 specialtyDisplayId:_param.specialtyDisplayId,
          			 areaId:_param.areaId?_param.areaId:Config.area.id,
          			 pageNum:ctrl.pageNum,
          			 pageSize:ctrl.pageSize
          		 },function(data){
          			var specialtyContentList = "";
            		if(data.data && data.data.specialtyContentList){
            			specialtyContentList = data.data.specialtyContentList;
            		}
            		if(ctrl.pageNum == 1 && specialtyContentList.length == 0){
            			$(".warn").html(REND("include/empty",{icon:"&#xe660;",tip:"sorry,还没有特价的商品哦~",price:"1",display:"block",paddingbottom:"1"}));
            			return false;
            		}
            		
            		if(specialtyContentList.length < ctrl.pageSize){
            			ctrl.flag = false;
            			if(ctrl.pageNum > 1){
            				$("#warn").show();
            			}
            		}
        			var temp = '';
    				for(var i=0;i<specialtyContentList.length;i++){
    					var param = "";
    					var consumeTipsBtn = "";
    					if(specialtyContentList[i].goods.cowrieStatus=="pass" && parseFloat(specialtyContentList[i].consumeTips)>0){
    						param = "&shopId=1";
    						consumeTipsBtn =  '<button>返￥'+specialtyContentList[i].consumeTips.toFixed(2)+'</button>';
    					}
        				temp += '<li>'+
        							'<a href="#goods/details?goodsId='+specialtyContentList[i].goodsId+'&specialtyContentId='+specialtyContentList[i].id+param+'">'+
			                            '<div class="pic">'+
			                                '<img src="'+Config.imgPre+specialtyContentList[i].goods.image+'"/>'+
			                                '<div class="bt">'+
			                                    '<div></div>'+
			                                    '<p>'+specialtyContentList[i].shop.shopName+'</p>'+
			                                '</div>'+
			                            '</div>'+
			                            '<div class="txt">'+
			                                '<h6 class="color-gray6 ellips">'+specialtyContentList[i].goods.name+'</h6>'+
			                                '<h5 class="color-red h3 m-top10">￥'+specialtyContentList[i].price.toFixed(2)+'<button>原价'+specialtyContentList[i].goods.price.toFixed(2)+'<s class="triangle-up"></s></button></h5>'+
			                                '<div class="color-gray9 p m-top10">好评率:'+specialtyContentList[i].goods.score+'%</div>'+
			                                '<p class="color-gray9 clearfix m-top10"><span class="kdl-left">销量：'+specialtyContentList[i].goods.sales+'</span></p>'+
			                            '</div>'+
			                        '</a>'+
			                    '</li>';
        			}
    				$(".content>div>ul").append(temp);
    				
    				if(ctrl._param.ANDROID=="true" || ctrl._param.ANDROID==true){
    					//alert(window.WebViewJavascriptBridge);
						$(".con-list>ul>li>a").each(function(){
							//console.log($(this).attr("href"));
						});
    				}
    				
          		 })
            }
        },
        /*商品下架页面*/
        "goods/goodsUnShelve": {
            _title:"商品下架",
            _footer:false,
            _datas: GET("goods/getSimilarityGoods.shtml",{
            	goodsId:PARAM("goodsId",null)
			}),
            _load: function(){
            },
        }

	});
})();