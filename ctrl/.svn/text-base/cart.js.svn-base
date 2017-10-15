(function(){
	/*公用变量和方法*/


FORMAT({
    /*购物车*/
    "cart/shoppingCart": {
        _title:"购物车",
        _datas:GET("ucenter/shoppingCart.shtml",function(data){
        	return data;
        }),
        _template:{url:"./view/cart/shoppingCart.ejs"},
        _load: function(){
        	//content最小高度
        	var higao= ($(window).height())-($("footer").height()*2.81);
            $(".content").css("min-height",higao);
        	var ctrl = this;
        	ctrl.init();
        	ctrl.setTotal();
            /*点击单个*/
            $(".cart-con-h .bd>i:first-child").click(function() {
            	if($(this).closest("div").find(".failure").length > 0){
            		return false;
            	}
                var text = $(this).text();
                if ($(this).text() == "") {
                    $(this).text("");
                    $(this).addClass("color-red");
                    $(this).addClass("isBuy");
                    //获取显示购买数量的input框
                    var inp = $(this).closest("div").find("input");
        			var skuId=inp.attr("skuId");
        			var shopId=inp.attr("shopId");
        			ctrl.setIsBuy(skuId,shopId,true);
                }
                else {
                    $(this).text("");
                    $(this).removeClass("color-red");
                    $(this).removeClass("isBuy");
                    $(this).closest(".cart-con-h").find(".hd>i:first-child").removeClass("color-red").text("");//去掉店铺的全选
                    $(".con-footer>span:first-child>i").removeClass("color-red").text("");//去掉整个购物车的全选
                    //获取显示购买数量的input框
                    var inp = $(this).closest("div").find("input");
        			var skuId=inp.attr("skuId");
        			var shopId=inp.attr("shopId");
                    ctrl.setIsBuy(skuId,shopId,false);
                }
               //初始化按钮
                ctrl.init();
            });
            /*编辑状态：点击单个*/
            $(".cart-con-h .bd>i:nth-child(2)").click(function() {
            	var text = $(this).text();
            	if ($(this).text() == "") {
            		$(this).text("");
            		$(this).addClass("color-red");
            		$(this).addClass("deleteItem");
            	}
            	else {
            		$(this).text("");
            		$(this).removeClass("color-red");
            		$(this).removeClass("deleteItem");
            		$(this).closest(".cart-con-h").find(".hd>i:nth-child(2)").removeClass("color-red").text("");//去掉店铺的全选
            		$(".con-footer>span:nth-child(2)>i").removeClass("color-red").text("");//去掉整个购物车的全选
            	}
            	//初始化店铺全选按钮
            	$(".cart-con-h .hd").each(function(){
            		if($(this).closest(".cart-con-h").find(".bd").length==$(this).closest(".cart-con-h").find(".deleteItem").length){
            			$(this).closest(".cart-con-h").find(".hd>i:nth-child(2)").text("").addClass("color-red").addClass("deleteShop");
            		}
            	});
            	if($(".cart-con-h .hd").length==$(".cart-con-h .hd .deleteShop").length){
            		$(".con-footer>span:nth-child(2)>i").text("").addClass("color-red");
            	}
            });
            /*点击店铺*/
            $(".cart-con-h .hd>i:first-child").click(function(){
                var text=$(this).text();
                if($(this).text()==""){
                    $(this).text("");
                    $(this).addClass("color-red");
                    $(this).parents().siblings(".bd").children("i:first-child").each(function(){
                    	if(!$(this).hasClass("color-red") && $(this).closest("div").find(".failure").length == 0){
                    		$(this).text("");
                    		$(this).addClass("color-red");
                    		$(this).addClass("isBuy");
                    	}
                    });
                    ctrl.setShopIsBuy($(this).closest("div").attr("shopId"),true);
                    
                }
                else{
                    $(this).text("");
                    $(this).removeClass("color-red");
                    $(".con-footer>span:first-child>i").removeClass("color-red").text("");//去掉整个购物车的全选
                    $(this).parents().siblings(".bd").children("i:first-child").each(function(){
                    	if($(this).hasClass("color-red")){
                    		$(this).text("");
                    		$(this).removeClass("color-red");
                    		$(this).removeClass("isBuy");
                    	}
                    });
                    ctrl.setShopIsBuy($(this).closest("div").attr("shopId"),false);
                }
                ctrl.init();
            })
            /*编辑状态：点击店铺*/
            $(".cart-con-h .hd>i:nth-child(2)").click(function(){
            	var text=$(this).text();
            	if($(this).text()==""){
            		$(this).text("");
            		$(this).addClass("color-red").addClass("deleteShop");
            		$(this).parents().siblings(".bd").children("i:nth-child(2)").each(function(){
            			if(!$(this).hasClass("color-red")){
            				$(this).click();
            			}
            		});
            	}
            	else{
            		$(this).text("");
            		$(this).removeClass("color-red").removeClass("deleteShop");
            		$(".con-footer>span:nth-child(2)>i").removeClass("color-red").text("");//去掉整个购物车的全选
            		$(this).parents().siblings(".bd").children("i:nth-child(2)").each(function(){
            			if($(this).hasClass("color-red")){
            				$(this).click();
            			}
            		});
            	}
            })
            /*点击全选*/
            $(".con-footer>span:first-child>i").click(function(){
                var text=$(this).text();
                if($(this).text()==""){
                    $(this).text("");
                    $(this).addClass("color-red");
                    $(".bd>i:first-child").each(function(){
                    	if($(this).closest("div").find(".failure").length == 0){
                    		$(this).text("");
                    		$(this).addClass("color-red");
                    		$(this).addClass("isBuy");
                    	}
                    });
                    $(".hd>i:first-child").text("");
                    $(".hd>i:first-child").addClass("color-red");
                    ctrl.setAllIsBuy(true);
                    $("#footerId").find("a").eq(0).removeClass("bg-grayc").addClass("bg-red").attr("href","#order/retailOrder");
                }
                else{
                    $(this).text("");
                    $(this).removeClass("color-red");
                    $(".bd>i:first-child").text("");
                    $(".bd>i:first-child").removeClass("color-red");
                    $(".bd>i:first-child").removeClass("isBuy");
                    $(".hd>i:first-child").text("");
                    $(".hd>i:first-child").removeClass("color-red");
                    ctrl.setAllIsBuy(false);
                    $("#footerId").find("a").eq(0).removeClass("bg-red").addClass("bg-grayc").attr("href","javascript:;");
                }
            })
            /*编辑状态：点击全选*/
            $(".con-footer>span:nth-child(2)>i").click(function(){
            	var text=$(this).text();
            	if($(this).text()==""){
            		$(this).text("");
            		$(this).addClass("color-red");
            		$(".bd>i:nth-child(2)").text("");
            		$(".bd>i:nth-child(2)").addClass("color-red");
            		$(".bd>i:nth-child(2)").addClass("deleteItem");
            		$(".hd>i:nth-child(2)").text("");
            		$(".hd>i:nth-child(2)").addClass("color-red");
            	}
            	else{
            		$(this).text("");
            		$(this).removeClass("color-red");
            		$(".bd>i:nth-child(2)").text("");
            		$(".bd>i:nth-child(2)").removeClass("color-red");
            		$(".bd>i:nth-child(2)").removeClass("deleteItem");
            		$(".hd>i:nth-child(2)").text("");
            		$(".hd>i:nth-child(2)").removeClass("color-red");
            	}
            	/*$(this).toggleState({innerHTML:""},{innerHTML:""})*/
            })
            /*完成编辑切换*/
            $(".hd>span").click(function(){
                $(this).toggleState({innerHTML:"完成"},{innerHTML:"编辑"})
                if($(this).text() == "完成"){
                    $(this).closest(".hd").siblings(".bd").find(".txt,.jiage").hide().end().find(".numadd,.del").show();
                    $(this).closest(".hd").find("i:nth-child(2)").show().siblings("i").hide();
                    $(this).closest(".hd").siblings(".bd").find("i:nth-child(2)").show().siblings("i").hide();
                }else{
                    $(this).closest(".hd").siblings(".bd").children(".bd-l").children(".txt").show();
                    $(this).closest(".hd").siblings(".bd").children(".bd-l").children(".jiage").show();
                    $(this).closest(".hd").siblings(".bd").children(".bd-l").children(".numadd").hide();
                    $(this).closest(".hd").siblings(".bd").children(".bd-l").children(".del").hide();
                    $(this).closest(".hd").find("i:nth-child(2)").hide().siblings("i").show();
                    $(this).closest(".hd").siblings(".bd").find("i:nth-child(2)").hide().siblings("i").show();
                }

            })

            /*全部完成编辑切换*/
            $(".nav-wrap-right>a:first-child").click(function(){
                $(this).toggleState({innerHTML:"完成"},{innerHTML:"编辑"});
                    if($(this).text() == "完成"){
                        $(".bd-l .txt").hide();
                        $(".bd-l .jiage").hide();
                        $(".numadd").show();
                        $(".bd .bd-l").css("padding-right",".2rem");
                        $("#footerId").find("a").eq(0).hide();
                        $("#footerId").find("a").eq(1).show();
                        $("#footerId").find("div").eq(0).hide();
                        $("#footerId").find("div").eq(1).show();
                        $(".hd>span").hide();//隐藏店铺中的编辑按钮
                        $(".hd>i:first-child").hide().siblings("i").show();
                        $(".bd>i:first-child").hide().siblings("i").show();
                        $(".con-footer>span:first-child").hide().siblings("span").show();
                    }else{
                        $(".bd-l .txt").show();
                        $(".bd-l .jiage").show();
                        $(".numadd").hide();
                        $(".bd .bd-l").css("padding-right","1.2rem");
                        $("#footerId").find("a").eq(1).hide();
                        $("#footerId").find("a").eq(0).show();
                        $("#footerId").find("div").eq(1).hide();
                        $("#footerId").find("div").eq(0).show();
                        $(".hd>span").show();//显示店铺中的编辑按钮
                        $(".hd>i:first-child").show().siblings("i").hide();
                        $(".bd>i:first-child").show().siblings("i").hide();
                        $(".con-footer>span:first-child").show().siblings("span").hide();
                    }


            })

            /**/
            $(".numadd>a").click(function(){
                var goodsId = $(this).attr("goodsId");
                var skuId = $(this).attr("skuId");
                $("#currentSkuId").val(skuId);
                $("#currentQuantity").val($(this).closest("div").find("input").val());
                ctrl.openStandard(goodsId,skuId);
               /* $(".theme-popover-mask").show();
                $(".standard-con").show();*/
            })
            
        },
        /*_load中需要调用的话，方式为：this.addcart(),前台调用：this.ctrl.addcart()*/
        //页面加载完需要执行的函数
        init:function init(){
        	//初始化店铺全选按钮
        	$(".cart-con-h .hd").each(function(){
        		if($(this).closest(".cart-con-h").find(".bd").length==$(this).closest(".cart-con-h").find(".isBuy").length+$(this).closest(".cart-con-h").find(".failure").length
        				&& $(this).closest(".cart-con-h").find(".isBuy").length != 0){
        			$(this).closest(".cart-con-h").find(".hd>i:first-child").text("").addClass("color-red");
        		}
        	});
        	if($(".cart-con-h .hd").length==$(".cart-con-h .hd .color-red").length){
        		$(".con-footer>span:first-child>i").text("").addClass("color-red");
        	}
        	if(!$(".cart-con-h .hd") || $(".cart-con-h .hd").length == 0){
        		$("#footerId").hide();
        	}
        	if(!$(".cart-con-h .bd>i:first-child").hasClass("isBuy")){
        		$("#footerId").find("a").eq(0).removeClass("bg-red").addClass("bg-grayc").attr("href","javascript:;");
        	}else{
        		$("#footerId").find("a").eq(0).removeClass("bg-grayc").addClass("bg-red").attr("href","#order/retailOrder");
        	}
        },
        //更改商品数量
        addCart:function addCart(skuId,shopId,type){
        	var inp = $("#text_box_"+skuId+"_"+shopId);
        	if($(inp).closest(".bd").find(".failure").length == 1){
        		return false;
        	}
            if(type == "reduce" && parseInt(inp.val()) <= 1){
            	alert("购物数量至少为1");
            	return;
            }
    		var quantity = 0;
    		if(type == "add"){
    			quantity = 1;
    		}else if(type == "reduce"){
    			quantity = -1;
    		}
    		var flag=false;
    		var ctrl = this;
    		$.post("cart/add.shtml",{shopId:shopId,skuId:skuId,quantity: quantity},function(data){
        		if(data.status == "1"){
        			if(type == "add"){
        				ctrl.addSku(skuId,shopId);
					}else if(type == "reduce"){
						ctrl.reduceSku(skuId,shopId);
					}
        		}else{
        			alert(data.errorMsg);
					flag = false;
        		}
        		//$("#text_box_"+skuId+"_"+shopId).closest(".cart-con-h").find(".bd").find(".txt,.jiage").hide().end().find(".numadd,.del").show();
        	});
    	},
      //添加页面商品 数量
        addSku:function addSku(skuId,shopId){
    		var t=$("#text_box_"+skuId+"_"+shopId);
    		t.val(parseInt(t.val())+1);
    		$("#sku_price_"+skuId+"_"+shopId).closest("div").find("p").html("x"+t.val());
    		this.setTotal();
    		this.setShow(skuId,shopId);
    	},
    	
    	//减少页面商品数量
    	reduceSku:function reduceSku(skuId,shopId,specialtyContentId){
    		var t=$("#text_box_"+skuId+"_"+shopId);
    		t.val(parseInt(t.val())-1);
    		$("#sku_price_"+skuId+"_"+shopId).closest("div").find("p").html("x"+t.val());
    		this.setTotal();
    		this.setShow(skuId,shopId);
    	},
    	deleteSku:function deleteSku(obj,skuId,shopId){
    		var ctrl = this;
    		Choose("确认要删除这个宝贝吗？",function(){
    			$.post("cart/deleteCartItem.shtml",{shopId:shopId,skuId:skuId},function(data){
            		if(data.status == "1"){
            			var shopItem = $(obj).closest(".cart-con-h");
            			$("#"+skuId+"_"+shopId).remove();
            			if(!shopItem.find("input").is(":visible")){//店铺中无商品显示，则店铺同时删除
            				shopItem.remove();
            			}
            			ctrl.setTotal();
            			if($(".hd").length == 0){
            				$(".noData").show();
            				$("#footerId").hide();
            			}
            		}else{
            			alert(data.errorMsg);
						return false;
            		}
            	});
    		});
    	},
    	batchDeleteSku:function deleteSku(){
    		var ctrl = this;
    		Choose("确认要删除宝贝吗？",function(){
    			var arrDiv = $(".deleteItem").closest(".bd");
    			var ids = new Array();
    			if(arrDiv && arrDiv.length>0){
    				for(var i=0;i<arrDiv.length;i++){
    					ids.push($(arrDiv[i]).attr("id"));
    				}
    			}else{
    				return false;
    			}
    			$.post("cart/batchDeleteCartItems.shtml",{ids:ids},function(data){
    				if(data.status == "1"){
    					for(var i=0;i<arrDiv.length;i++){
    						var shopItem = $(arrDiv[i]).closest(".cart-con-h");
    						$(arrDiv[i]).remove();
                			if(!shopItem.find("input").is(":visible")){//店铺中无商品显示，则店铺同时删除
                				shopItem.remove();
                			}
    					}
            			ctrl.setTotal();
            			if($(".hd").length == 0){
            				$(".noData").show();
            				$("#footerId").hide();
            			}
    				}else{
    					alert(data.errorMsg);
    					return false;
    				}
    			});
    		});
    	},
    	batchAddGoodsFavorite:function batchAddGoodsFavorite(){
    		var ctrl = this;
    		Choose("确认将选中商品移入收藏夹吗？",function(){
    			var arrDiv = $(".deleteItem").closest(".bd");
    			var ids = new Array();
    			if(arrDiv && arrDiv.length>0){
    				for(var i=0;i<arrDiv.length;i++){
    					ids.push($(arrDiv[i]).attr("id"));
    				}
    			}else{
    				return false;
    			}
    			$.post("cart/batchAddGoodsFavorite.shtml",{ids:ids},function(data){
    				if(data.status == "1"){
    					alert("移入成功");
    				}else{
    					alert(data.errorMsg);
    					return false;
    				}
    			});
    		});
    	},
    	//计算总价格和总数量
    	setTotal:function setTotal(){
    		var totalCount=0;
    		var totalNum = 0;
    		$(".isBuy").each(function(){
    			var inp = $(this).closest("div").find("input");
    			var num=inp.val();
    			var skuId=inp.attr("skuId");
    			var shopId=inp.attr("shopId");
				var skuPrice=$("#sku_price_"+skuId+"_"+shopId).html();
				totalCount += parseInt(num) * parseFloat(skuPrice);
				totalNum += parseInt(num);
    		});
    		
    	    $("#totalPrice").html(totalCount.toFixed(2));
    	    $("#totalNum").html(totalNum);
    	},
    	
    	//更新减少按钮的状态
    	setShow:function setShow(skuId,shopId){
//    		var getNum=parseInt($("#text_box_"+skuId+"_"+shopId).val());
//    	    if(getNum<2){
//    	    	$("#min_"+skuId+"_"+shopId).attr("disabled","disabled");
//    		}else{
//    			$("#min_"+skuId+"_"+shopId).removeAttr("disabled");
//    		}
    	},
    	//更改是否购买的选中状态
    	setIsBuy:function setIsBuy(skuId,shopId,isBuy){
    		var ctrl = this;
        	$.post("cart/setIsBuy.shtml",{shopId:shopId,skuId:skuId,quantity: 0,isBuy: isBuy},function(data){
        		ctrl.setTotal();
        	});
        },
        //全选
        setAllIsBuy:function setAllIsBuy(isBuy){
        	var ctrl = this;
        	var divArr = $(".hd");
        	var shopIds = new Array();
        	if(divArr.length > 0){
        		for(var i=0;i<divArr.length;i++){
        			shopIds.push($(divArr[i]).attr("shopId"));
        		}
        	}
        	$.post("cart/setShopsIsBuy.shtml",{isBuy: isBuy,shopIds:shopIds},function(data){
        		ctrl.setTotal();
        	});
        },
        //店铺全选
        setShopIsBuy:function setShopIsBuy(shopId,isBuy){
        	var ctrl = this;
        	var shopIds = new Array();
        	shopIds.push(shopId);
        	$.post("cart/setShopsIsBuy.shtml",{isBuy: isBuy,shopIds:shopIds},function(data){
        		ctrl.setTotal();
        	});
        },
        //打开规格选择页面
        openStandard:function openStandard(goodsId,skuId){
        	$.get("goods/standard.shtml",{goodsId:goodsId,skuId:skuId},function(data){
        		$(".standard-con").html(REND('cart/standard',{data:data.data}));
        		$(".theme-popover-mask").show();
                $(".standard-con").show();
        	});
        },
      //获取选中规格
        chooseItem : function(item,goodsId,shopId){
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
        		data : $.param({
        			goodsId : goodsId,
        			itemArray : $.extend([],itemArray),
        			areaId:Config.area.id
        		},true),
        		success : function(data){
        			if(!data.data){
        				alert(data.errorMsg);
        				return;
        			}
        			$("#skuImage").attr("src",Config.imgPre+data.data.sku.image);
        			$("#skuPrice").html(data.data.sku.price.toFixed(2));
        			$("#skuStock").html(data.data.sku.stock);
        			$("#skuPrompt").html("规格："+skuItemVals.substring(0, skuItemVals.length-1));
    				$("#makeChoose").attr("url","cart/update.shtml?shopId="+shopId+"&quantity="+$('#currentQuantity').val()+"&currentSkuId="+$('#currentSkuId').val()+"&skuId="+data.data.sku.id);
        			$("#skuIdTrack").val(data.data.sku.id);
        		}
        	});
        }
        
    }
	
});

})();