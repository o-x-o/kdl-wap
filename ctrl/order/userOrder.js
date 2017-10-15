(function(){
	/*公用变量和方法*/
	//离开页面的时候清除
	FORMAT({
		
		 /*零售订单提交*/
	    "order/retailOrder": {
	        _title: "提交订单",
	        _footer: false,
	        _template:{url:"view/order/userOrder/retailOrder.ejs"},
	        _links:{
	        	"js/inputValidate.js":"js",
        		"plugin/jquery.md5.js" : "js"
	        },
	        _datas: {
	        	data:GET("order/toRetailOrder.shtml",{skuId:PARAM("skuId",null),quantity:PARAM("quantity",1),shopId:PARAM("shopId",null),speConId:PARAM("speConId",null)},function(data,ctrl){
	        		if(data instanceof Error){
	        			ctrl._goError=false;
	    				ctrl._goShow=false;
	    				history.go(-1);
	    				alerts(data.message);
	    			}
	        		return data;
	        	}),
	        },
	        curOrderInfos : null,
	        curUpIndex : -1,
			pIsHasInvoice : false,
			pIsCurInvoice : false,
			paymentAmount : null,
			submitFlag : true,
			submitCount : 0,
	        _show : function(){
	        	if(this._param.shippingAddressId!=null){
	        		if($("#toShippingAddress").length>0){
	        			$("#toShippingAddress").empty();
	        		}else{
	        			$("#addAddressBtn").before("<div class='hd more'  onclick='this.ctrl.toShippingAddress(this);' id='toShippingAddress'></div>");
	        			$("#addAddressBtn").remove();
	        		}
	        		var html = "<input type='hidden' name='ShippingAddressId' value='"+this._param.shippingAddressId+"'/>"
			        		 + "<i class='iconfont'>&#xe616;</i>" 
			        		 + "<div>"
			                 + 		"<span>收货人："+this._param.receiver+"</span>"
			                 +		"<span class='kdl-right'>"+this._param.phone+"</span>"
			                 + "</div>"
			                 + "<p class='ellips'>收货地址："+this._param.address+"</p>";
	        		$("#toShippingAddress").append(html);
	        	}
	        	if(this._param.type=="noInvoice"){
	        		$("#type").val("");
	        		$("#title").val("")
	        		$("#content").val("");
	        		if(this.pIsHasInvoice && this.pIsCurInvoice){
	        			this.calSubmit();
	        		}
	        		$("#toInvoice").children("a").html("发票类型：无需发票");
	        	}else if(this._param.type!="" && this._param.type!=null){
	        		$("#type").val(this._param.type);
	        		$("#title").val(this._param.title)
	        		$("#content").val(this._param.content);
	        		if(this.pIsHasInvoice && !this.pIsCurInvoice){
	        			this.calSubmit();
	        		}
	        		$("#toInvoice").children("a").html("发票类型：增值税发票");
	        	}
	        },
	        _load: function () {
	        	var ctrl = this;
	        	this.curOrderInfos = this._datas.data.orderInfos;
	        	this.pIsHasInvoice = this._datas.data.isHasInvoice;
				this.pIsCurInvoice = this._datas.data.isCurInvoice;
				this.hasPayPassword = this._datas.data.isHasPayPassword;

	            /*协议勾选*/
	            $("#useBalanceBtn").click(function(){
	                if($(".footer .money>i").text()==""){
	                    $(".footer .money>i").html("");
	                    $(".footer .money>i").addClass("color-red");
	                    $("#useBalance").val("true");
	                }
	                else{
	                    $(".footer .money>i").html("");
	                    $(".footer .money>i").removeClass("color-red");
	                    $("#useBalance").val("false");
	                }
	                ctrl.calSubmit();
	            })
	            $("#useBalanceBtn").click();
	            /*优惠券*/
	            $(".favorable").click(function(){
	                $(".theme-popover-mask").show(200);
	                $(".ticket").show(300);
	            })
	            $(".ticket button").click(function(){
	            	var curInfoId = $(this).parent().attr("name").trim();
	            	var curCardId = ctrl.curOrderInfos[curInfoId].randomCardUserId;
	            	var selCardId = $("*[name='orderInfos["+curInfoId+"].randomCardUserId']").val().trim()=="" ? null :  $("*[name='orderInfos["+curInfoId+"].randomCardUserId']").val().trim();
	            	if(curCardId != selCardId){
	            		ctrl.curUpIndex = curInfoId;
	            		ctrl.calSubmit();
	            	}
	            	$(".theme-popover-mask").hide();
	            	$(".ticket").hide();
	            })
	            $(".ticket li").not(":eq(0)").click(function(){
	            	$(".ticket li").removeClass("cur");
	            	$(this).addClass("cur");
	            	//$("input[name='randomCardUserId']").val($(this).find("input")[0].value);
	            	if($(this).attr("name") == "noUsed"){
	            		$(this).siblings("input").val($(this).find("input")[0].value);
	            	}else{
	            		$(this).parent().siblings("input").val($(this).find("input")[0].value);
	            	}
	            	if($(this).find("input").val()==""){
	            		$($($(".ticket").prev().find("li")[0]).find("span")[0]).html($(".ticket input:first").val());
	            		$($($(".ticket").prev().find("li")[0]).find("span")[1]).html("未使用");
	            	}else{
	            		$($($(".ticket").prev().find("li")[0]).find("span")[0]).html($(this).find("input")[1].value);
	            		$($($(".ticket").prev().find("li")[0]).find("span")[1]).html("已使用");
	            	}
	            })
	            $(".bd button").click(function(){
	            	$(this).parent().siblings("input").val($(this).next().val());
	            	var curInfoId = $(this).parent().attr("name").trim();
	            	var curShipId = ctrl.curOrderInfos[curInfoId].shippingMethodId;
	            	var selShipId = $("*[name='orderInfos["+curInfoId+"].shippingMethodId']").val().trim()=="" ? null :  $("*[name='orderInfos["+curInfoId+"].shippingMethodId']").val().trim();
	            	if(curShipId != selShipId){
	            		ctrl.curUpIndex = curInfoId;
	            		ctrl.calSubmit();
	            	}
	            	$(this).addClass("cur").siblings("button").removeClass("cur");
	            })
	            $("#toInvoice").click(function(){
	            	if(typeof(ctrl._param.skuId) != "undefined"){
	            		GO("order/invoiceInformation",{shopId:ctrl._param.shopId,skuId:ctrl._param.skuId,quantity:ctrl._param.quantity,type:$("#type").val(),title:$("#title").val(),content:$("#content").val()},".sub_container");
	            	}else if(typeof(ctrl._param.speConId) != "undefined"){
	            		GO("order/invoiceInformation",{shopId:ctrl._param.shopId,speConId:ctrl._param.speConId,quantity:ctrl._param.quantity,type:$("#type").val(),title:$("#title").val(),content:$("#content").val()},".sub_container");
	            	}else{
	            		GO("order/invoiceInformation",{type:$("#type").val(),title:$("#title").val(),content:$("#content").val()},".sub_container");
	            	}
	            })
	            $(".pwdpollue>button").click(function(){
	            	var inputPay = $("#payPassword").val();
	            	if(inputPay=="" || inputPay.length<6){
	            		$("#payError").html("请输入6位支付密码!");
	            	}else{
	            		$("#md5PayPassword").val($.md5(inputPay.trim()));
	            		ctrl.toSubmitOrder();
	            	}
	            })
	            $(".pwdpollue>span").click(function(){
	            	$("#payPassword").val("");
	            	$("#payError").html("");
	            	$(".theme-popover-mask").hide(500);
	            	$(".pwdpollue").hide(300);
	            })
	            $("#findPayPassword").click(function(){
	            	$("#payPassword").val("");
	            	$("#payError").html("");
	            	$(".theme-popover-mask").hide(500);
	            	$(".pwdpollue").hide(300);
	            	GO("ucenter/PayPassword",{toHistory:true},".sub_container");
	            })
	            $("#submitOrderBtn").click(function(){
	            	if(ctrl.paymentAmount==0){
	            		if(ctrl.hasPayPassword){
	            			/*输入支付密码*/
	            			$(".theme-popover-mask").show(300);
	            			$(".pwdpollue").show(500);
	            		}else{
	            			if(ctrl.submitCount==0){
	            				ctrl.submitCount = ctrl.submitCount+1;
	            				$(".theme-popover-mask").hide(500);
		    	            	$(".pwdpollue").hide(300);
		            			GO("ucenter/PayPassword",{toHistory:true},".sub_container");
	            			}else{
	            				$.ajax({
	            					url:"ucenter/checkHavePayPwd.shtml",
	            					data:null,
	            					async:false,
	            					dataType:"json",
	            					type:"get",
	            					success:function(data){
	            						if(data.status==0){
	            							alert(data.errorMsg);
	            							return false;
	            						}else{
	            							if(data.data.hasPayPassword){
	            								/*输入支付密码*/
	            								$(".theme-popover-mask").show(300);
	            								$(".pwdpollue").show(500);
	            							}else{
	            								$(".theme-popover-mask").hide(500);
	            		    	            	$(".pwdpollue").hide(300);
	            		            			GO("ucenter/PayPassword",{toHistory:true},".sub_container");
	            							}
	            						}
	            					},
	            					error:function(data){
	            						alert("亲，系统错误请您稍后再试！");
	            					}
	            				});
	            			}
	            		}
	            	}else{
	            		ctrl.toSubmitOrder();
	            	}
                    return false;
	            }),
	            $("#payPassword").keyup(function(){
	            	$("#payError").html("");
	            })
	        },
	        toSubmitOrder: function(){
	        	if(!this.submitFlag){
	        		alert("请稍后~~~");
	        		return false;
	        	}
	        	this.submitFlag = false;
	        	var shippingAddressId = $("input[name='ShippingAddressId']").val();
	        	if(shippingAddressId=="" || shippingAddressId==null){
	        		alert("亲,请添加收货地址!");
	        		return false;
	        	}
	        	$("#orderForm").attr("action",Config.basePath+"/order/subRetailOrder.shtml")
	        	$("#orderForm").attr("call","this.ctrl.submitCall")
	        	$("#orderForm").submit();
	        },
	        toGoodsDetails : function(goodsId,shopId,speConId){
	        	if(speConId==null){
	        		GO("goods/details",{goodsId:goodsId,shopId:shopId},".sub_container");
	        	}else{
	        		GO("goods/details",{goodsId:goodsId,shopId:shopId,specialtyContentId:speConId},".sub_container");
	        	}
	        },
	        calSubmit : function(){
	        	$("#orderForm").attr("action",Config.basePath+"/order/calRetailOrder.shtml")
            	$("#orderForm").attr("call","this.ctrl.calCall")
            	$("#orderForm").submit();
	        },
	        submitCall : function(response){
	        	if(response.status == 0){
	        		if(response.errorCode==2001){
	        			this.submitFlag = true;
	        			$("#payError").html(response.errorMsg);
	        			return false;
	        		}
	        		alert(response.errorMsg);
	        		return false;
	        	}
	        	$(".theme-popover-mask").hide(500);
            	$(".pwdpollue").hide(300);
	        	if(response.data.status=="pePay"){
	        		GO("pay/cashierDesk",{sn:response.data.orderSn});
//	        		GO("pay/cashierDesk",{orderId:response.data.order.id,payAmount:response.data.order.payAmount});
	        	}else{
	        		GO("pay/paySuccess",{sn:response.data.orderSn});
	        	}
	        },
	        calCall : function(response){
	        	this.curOrderInfos = response.data.orderInfos;
	        	this.pIsCurInvoice = response.data.isCurInvoice;
	        	if(this.curUpIndex != -1){
	        		$("span[name='orderInfo_"+this.curUpIndex+"_subTotal']").html(this.curOrderInfos[this.curUpIndex].paymentPrice.toFixed(2));
	        		$("span[name='orderInfo_"+this.curUpIndex+"_freight']").html(this.curOrderInfos[this.curUpIndex].freight.toFixed(2));
	        	}
	        	this.curUpIndex = -1;
	        	this.paymentAmount=response.data.pAmount;
	        	$("#curPayAmount").html(response.data.pAmount.toFixed(2));
	        },
	        toShippingAddress : function(obj){
	        	var ctrl = this;
            	var addressId = $(obj).children("input").val();
	        	if(typeof(ctrl._param.skuId) != "undefined"){
	        		GO("ucenter/shippingAddress",{toOrder:true,addressId:addressId,shopId:ctrl._param.shopId,skuId:ctrl._param.skuId,quantity:ctrl._param.quantity},".sub_container");
	        	}else if(typeof(ctrl._param.speConId) != "undefined"){
	        		GO("ucenter/shippingAddress",{toOrder:true,addressId:addressId,shopId:ctrl._param.shopId,speConId:ctrl._param.speConId,quantity:ctrl._param.quantity},".sub_container");
	        	}else{
	        		GO("ucenter/shippingAddress",{toOrder:true,addressId:addressId},".sub_container");
	        	}
	        },
	        toAddAddress : function(){
	        	var ctrl = this;
	        	var addressId = $(this).children("input").val();
	        	if(typeof(ctrl._param.skuId) != "undefined"){
	        		GO("ucenter/addAddress",{toOrder:true,shopId:ctrl._param.shopId,skuId:ctrl._param.skuId,quantity:ctrl._param.quantity},".sub_container");
	        	}else if(typeof(ctrl._param.speConId) != "undefined"){
	        		GO("ucenter/addAddress",{toOrder:true,shopId:ctrl._param.shopId,speConId:ctrl._param.speConId,quantity:ctrl._param.quantity},".sub_container");
	        	}else{
	        		GO("ucenter/addAddress",{toOrder:true},".sub_container");
	        	}
	        },
	        toShop : function(shopId){
	        	GO("shop/shops",{shopId:shopId},".sub_container");
	        }
	    },
	    /*发票信息*/
	    "order/invoiceInformation": {
	        _title: "发票信息",
	        _footer: false,
	        _template:{url:"view/order/userOrder/invoiceInformation.ejs"},
	        _load: function () {
	        	var ctrl = this;
	        	$(".footer-btn").css("z-index","99");
	            $(".con-type li").click(function(){
	                $(this).addClass("cur").siblings().removeClass("cur");
	                var typenum=$(this).index();
	                if(typenum==0){
	                	$("#inType").val("");
	                    $(".con-type>p").hide();
	                    $(".theme-popover-mask").show();
	                	$(".footer-btn").css("z-index","99");
	                }else{
	                	$("#inType").val("eInvo");
	                    $(".con-type>p").show();
	                    $(".theme-popover-mask").hide();
	                    $(".footer-btn").css("z-index","0");
	                }
	            })

	            $(".invoice-con li").click(function(){
	                $(this).find("i").html("");
	                $(this).siblings().find("i").html("");
	                $(this).find("i").addClass("color-red");
	                $(this).siblings().find("i").removeClass("color-red");
	                $("#inContent").val($(this).children("span").html());
	            })
	            $("#selInvoice").click(function(){
	            	$(".theme-popover-mask").hide();
	            	if(typeof(ctrl._param.skuId) != "undefined"){
	            		GO("order/retailOrder",{shopId:ctrl._param.shopId,skuId:ctrl._param.skuId,quantity:ctrl._param.quantity,type:$("#inType").val()=="" ? "noInvoice" : $("#inType").val(),title:$("#inTitle").val()==""?"个人":$("#inTitle").val(),content:$("#inContent").val()});
	            	}else if(typeof(ctrl._param.speConId) != "undefined"){
	            		GO("order/retailOrder",{shopId:ctrl._param.shopId,speConId:ctrl._param.speConId,quantity:ctrl._param.quantity,type:$("#inType").val()=="" ? "noInvoice" : $("#inType").val(),title:$("#inTitle").val()==""?"个人":$("#inTitle").val(),content:$("#inContent").val()});
	            	}else{
	            		GO("order/retailOrder",{type:$("#inType").val()=="" ? "noInvoice" : $("#inType").val(),title:$("#inTitle").val()==""?"个人":$("#inTitle").val(),content:$("#inContent").val()});
	            	}
	            })
	        },
	        _show : function(){
	        	var thisPram = this._param;
	        	if(thisPram.type!="" && thisPram.type!=null ){
	        		$("#inType").val("eInvo");
                    $(".con-type>p").show();
                    $(".theme-popover-mask").hide();
                    $("#gInvoice").addClass("cur").siblings().removeClass("cur");
	        	}
	        	if(thisPram.title!="" && thisPram.title!=null){
	        		$("#inTitle").val(this._param.title);
	        	}
	        	if(thisPram.content!="" && thisPram.content!=null){
	        		$.each($(".invoice-con li"),function(i,cur){
	        			if($(cur).children("span").html().trim()==thisPram.content.trim()){
	        				$(cur).find("i").html("");
	    	                $(cur).siblings().find("i").html("");
	    	                $(cur).find("i").addClass("color-red");
	    	                $(cur).siblings().find("i").removeClass("color-red");
	    	                $("#inContent").val($(this).children("span").html());
	        			}
	        		})
	        	}
	        },
	    },
	    
	    /*服务订单提交*/
	    "order/serviceOrder": {
	        _title: "提交订单",
	        _footer: false,
	        _links:{
	        	"js/inputValidate.js":"js",
	        	"plugin/jquery.md5.js" : "js"
	        },
	        _template:{url:"view/order/userOrder/serviceOrder.ejs"},
	        curCardId : null,
	        hasPayPassword : null,
	        paymentAmount : null,
	        submitCount : 0,
	        submitFlag:true,
	        _datas: {
	        	data:GET("order/toServiceOrder.shtml",{skuId:PARAM("skuId",0),quantity:PARAM("quantity",0),shopId:PARAM("shopId",null),speConId:PARAM("speConId",null)},function(data,ctrl){
	        		if(data instanceof Error){
	        			ctrl._goError=false;
	    				ctrl._goShow=false;
	    				history.go(-1);
	    				alerts(data.message);
	    			}
	        		return data;
	        	}),
	        },
	        _load: function () {
	        	var ctrl = this;
	        	this.curCardId = this._datas.data.curCardId;
	        	this.hasPayPassword = this._datas.data.isHasPayPassword;
	            /*协议勾选*/
	            $("#useBalanceBtn").click(function(){
	                if($(".footer .money>i").text()==""){
	                    $(".footer .money>i").html("");
	                    $(".footer .money>i").addClass("color-red");
	                    $("#useBalance").val("true");
	                }
	                else{
	                    $(".footer .money>i").html("");
	                    $(".footer .money>i").removeClass("color-red");
	                    $("#useBalance").val("false");
	                }
	                ctrl.calSubmit();
	            })
	             $("#useBalanceBtn").click();
	            /*优惠券*/
	            $(".ticket button").click(function(){
	            	var inputCardId = $(".ticket input[name='randomCardUserId']").val().trim()=="" ? null : parseFloat($(".ticket input[name='randomCardUserId']").val().trim());
	            	if(ctrl.curCardId!=inputCardId){
	            		ctrl.calSubmit();
	            	}
	            	$(".theme-popover-mask").hide();
	            	$(".ticket").hide();
	            })
	            $(".ticket li").not(":eq(0)").click(function(){
	            	$(".ticket li").removeClass("cur");
	            	$(this).addClass("cur");
	            	$("input[name='randomCardUserId']").val($(this).find("input")[0].value);
	            	if($(this).find("input").val()==""){
	            		$($($(".ticket").prev().find("li")[0]).find("span")[0]).html($(".ticket input:first").val());
	            		$($($(".ticket").prev().find("li")[0]).find("span")[1]).html("未使用");
	            	}else{
	            		$($($(".ticket").prev().find("li")[0]).find("span")[0]).html($(this).find("input")[1].value);
	            		$($($(".ticket").prev().find("li")[0]).find("span")[1]).html("已使用");
	            	}
	            })
	             $(".pwdpollue>button").click(function(){
	            	var inputPay = $("#payPassword").val();
	            	if(inputPay=="" || inputPay.length<6){
	            		$("#payError").html("请输入6位支付密码!");
	            	}else{
		            	$("#md5PayPassword").val($.md5(inputPay.trim()));
	            		ctrl.toSubmitOrder();
	            	}
	            })
	            $(".pwdpollue>span").click(function(){
	            	$("#payPassword").val("");
	            	$("#payError").html("");
	            	$(".theme-popover-mask").hide(500);
	            	$(".pwdpollue").hide(300);
	            })
	            $("#findPayPassword").click(function(){
	            	$("#payPassword").val("");
	            	$("#payError").html("");
	            	$(".theme-popover-mask").hide(500);
	            	$(".pwdpollue").hide(300);
	            	GO("ucenter/PayPassword",{toHistory:true},".sub_container");
	            })
	            $("#submitOrderBtn").click(function(){
	            	if(ctrl.paymentAmount==0){
	            		if(ctrl.hasPayPassword){
	            			/*输入支付密码*/
	            			$(".theme-popover-mask").show(300);
	            			$(".pwdpollue").show(500);
	            		}else{
	            			if(ctrl.submitCount==0){
	            				ctrl.submitCount = ctrl.submitCount+1;
	            				$(".theme-popover-mask").hide(500);
		    	            	$(".pwdpollue").hide(300);
		            			GO("ucenter/PayPassword",{toHistory:true},".sub_container");
	            			}else{
	            				$.ajax({
	            					url:"ucenter/checkHavePayPwd.shtml",
	            					data:null,
	            					async:false,
	            					dataType:"json",
	            					type:"get",
	            					success:function(data){
	            						if(data.status==0){
	            							alert(data.errorMsg);
	            							return false;
	            						}else{
	            							if(data.data.hasPayPassword){
	            								/*输入支付密码*/
	            								$(".theme-popover-mask").show(300);
	            								$(".pwdpollue").show(500);
	            							}else{
	            								$(".theme-popover-mask").hide(500);
	            		    	            	$(".pwdpollue").hide(300);
	            		            			GO("ucenter/PayPassword",{toHistory:true},".sub_container");
	            							}
	            						}
	            					},
	            					error:function(data){
	            						alert("亲，系统错误请您稍后再试！");
	            					}
	            				});
	            			}
	            		}
	            	}else{
	            		ctrl.toSubmitOrder();
	            	}
                    return false;
	            }),
	            $("#payPassword").keyup(function(){
	            	$("#payError").html("");
	            })
	        },
	        toSubmitOrder: function(){
	        	if(!this.submitFlag){
	        		alert("请稍后~~~");
	        		return false;
	        	}
	        	this.submitFlag = false;
	        	$("#orderForm").attr("action",Config.basePath+"/order/subServiceOrder.shtml")
            	$("#orderForm").attr("call","this.ctrl.submitCall")
            	$("#orderForm").submit();
	        },
	        submitCall : function(response){
	        	if(response.status == 0){
	        		if(response.errorCode==2001){
	        			this.submitFlag = true;
	        			$("#payError").html(response.errorMsg);
	        			return false;
	        		}
	        		alert(response.errorMsg);
	        		return false;
	        	}
	        	$(".theme-popover-mask").hide(500);
            	$(".pwdpollue").hide(300);
	        	if(response.data.status=="pePay"){
	        		GO("pay/cashierDesk",{sn:response.data.orderSn});
//	        		GO("pay/cashierDesk",{orderId:response.data.order.id,payAmount:response.data.order.payAmount});
	        	}else{
	        		//GO("pay/cashierDesk",{orderSn:response.data.orderSn});
//	        		GO("pay/paySuccess",{orderId:response.data.order.id,orderType:response.data.order.type});
	        		GO("pay/paySuccess",{sn:response.data.orderSn});
	        	}
	        },
	        calCall : function(response){
	        	this.curCardId = response.data.curCardId;
	        	this.paymentAmount = response.data.pAmount;
	        	$("#curTotal").html(response.data.subtotal.toFixed(2));
	        	$("#curPayAmount").html(response.data.pAmount.toFixed(2));
	        },
	        toGoodsDetails : function(goodsId,shopId,speConId){
	        	if(speConId==null){
	        		GO("goods/details",{goodsId:goodsId,shopId:shopId},".sub_container");
	        	}else{
	        		GO("goods/details",{goodsId:goodsId,shopId:shopId,specialtyContentId:speConId},".sub_container");
	        	}
	        },
	        openRandoms: function(){
	        	$(".theme-popover-mask").show(200);
                $(".ticket").show(300);
	        },
	        calSubmit : function(){
	        	$("#orderForm").attr("action",Config.basePath+"/order/calServiceOrder.shtml")
            	$("#orderForm").attr("call","this.ctrl.calCall")
            	$("#orderForm").submit();
	        },
	        toShop : function(shopId){
	        	GO("shop/shops",{shopId:shopId},".sub_container");
	        }
	    },
	    
	    /*用户订单列表*/
	    "order/userOrders": {
	    	_title: "订单列表",
	    	_footer: false,
	    	_links:{
	        	"js/inputValidate.js":"js",
	        	"plugin/jquery.md5.js" : "js"
	        },
	    	_template:{url:"view/order/userOrder/userOrders.ejs"},
	    	/*
	    	_datas: {
	    		data:POST("order/toServiceOrder.shtml",{skuId:PARAM("skuId",0),quantity:PARAM("quantity",0),shopId:PARAM("shopId",null)},function(data){
	    			return data;
	    		}),
	    	},
	    	*/
	    	pageNum : 1,
	        pageSize : 5,
	        defaultPageNum : 1,
	        defaultpageSize : 5,
	        continueLoad : true,
	        curStatus : null,
	        curOrderId : null,
	        hasPayPassword : null,
	        scrollTop : null,
	        submitCount : 0,
	        _show: function(){
	        	if(this.scrollTop != null){
	        		document.body.scrollTop=this.scrollTop;
	        		this.scrollTop=null;
	        	}
	        },
	    	_load: function () {
	    		var ctrl = this;
	    		/*下拉列表*/
	    		$(".screen>ul>li").click(function(){
	    			$(this).addClass("cur").siblings().removeClass("cur");
	    			$($(this).find("i")).show();
	    			$(this).siblings().find("i").hide();
	    			$(".nav-header>cite").html($(this).find("span").html());
	    			$(".screen").hide();
	    			$(".theme-popover-mask").hide();
	    			ctrl.statusLoad($(this).attr("id"));
	    		})
	    		var showMsg = this._param.showMsg;
	        	if(showMsg!=null && showMsg!=""){
	        		if(showMsg.trim()=="evaluate"){
	        			alert(null,null,"感谢您的评价~,评价的内容将在审核通过后展示!",5000);
	        		}
	        	}
	    		var statusStr = this._param.statusStr;
	        	if(statusStr!=null && statusStr!=""){
	        		$("#"+statusStr.trim()).click();
	        	}else{
	        		this.loadData(ctrl.pageNum,ctrl.pageSize,null);
	        	}
	            $(".nav-header").click(function(){
	            	if($(".screen").is(":hidden")){
	            		$(".screen").show();
	            		$(".theme-popover-mask").show();
	            	}else{
	            		$(".screen").hide();
	            		$(".theme-popover-mask").hide();
	            	}
	            })
	            
	            $(".abolish").click(function(){
	            	$(".causeList").show(500);
	            	$(".theme-popover-mask").show();
	            })
	            $(".abrogate").click(function(){
	            	$(".causeList").hide(200);
	            	$(".theme-popover-mask").hide(300);
	            })
	            $(".causeList li").click(function(){
	            	$(".causeList").hide(200);
	            	$(".theme-popover-mask").hide(300);
	            	//取消订单的ajax,取消成功刷新当前数据;
	            	$.ajax({
	    				url:"order/orderCancel.shtml",
	    				data:{"orderId":ctrl.curOrderId},
	    				async:false,
	    				dataType:"json",
	    				type:"post",
	    				success:function(data){
	    					if(data.status==0){
	    						ctrl.curOrderId = null;
	    						ctrl.statusLoad(ctrl.curStatus);
	    						alert(data.errorMsg);
	    					}else{
	    						ctrl.curOrderId = null;
	    						ctrl.statusLoad(ctrl.curStatus);
	    						alert(null,null,"取消成功!",1000);
	    					}
	    				},
	    				error:function(data){
	    					alert("亲，系统错误请您稍后再试！");
	    				}
	    			});
	            	return false;
	            })
	            $(".pwdpollue button").click(function(){
	            	var payPassword = $(".pwdpollue input").val();
	            	if(payPassword==""){
	            		alert("支付密码不可以为空!");
	            		return false;
	            	}
	            	payPassword = $.md5(payPassword);
	            	//确认订单的ajax,取消成功刷新当前数据;
	            	$.ajax({
	    				url:"order/orderSign.shtml",
	    				data:{"orderId":ctrl.curOrderId,"payPassword":payPassword},
	    				async:false,
	    				dataType:"json",
	    				type:"post",
	    				success:function(data){
	    					if(data.status==0){
	    						if(data.errorCode==2001){
	    		        			$("#payError").html(data.errorMsg);
	    		        			return false;
	    		        		}
	    						alert(data.errorMsg);
	    						return false;
	    					}else{
	    						ctrl.curOrderId = null;
	    						ctrl.statusLoad(ctrl.curStatus);
	    						$(".pwdpollue").hide(300);
	    						$(".theme-popover-mask").hide(200);
	    					}
	    					alert(null,null,"操作成功!",1000);
	    				},
	    				error:function(data){
	    					alert("亲，系统错误请您稍后再试！");
	    				}
	    			});
	            	return false;
	            })
	            $("#findPayPassword").click(function(){
	            	$("#payPassword").val("");
	            	$("#payError").html("");
	            	$(".pwdpollue").hide(300);
					$(".theme-popover-mask").hide(200);
	            	GO("ucenter/PayPassword",{toHistory:true});
	        		return false;
	            })
	            $("#colsePassword").click(function(){
	            	$("#payPassword").val("");
	            	$("#payError").html("");
	            	$(".pwdpollue").hide(300);
					$(".theme-popover-mask").hide(200);
	            	return false;
	            })
	            $("#payPassword").keyup(function(){
	            	$("#payError").html("");
	            })
	            setREG("document_scroll", ctrl._name, function(){
	            	ctrl.scrollLoad();
	            });
	    	},
	    	submitCall : function(response){
	    		if(response.status==0){
	        		alert(response.errorMsg);
	        		return false;
	        	}
	    	},
	    	loadData : function(pageNum,pageSize,strStatus){
	        	var ctrl =this;
	        	$.ajax({
    				url:"order/userOrders.shtml",
    				data:{"pageNum":pageNum,"pageSize":pageSize,"strStatus":strStatus},
    				async:false,
    				dataType:"json",
    				type:"GET",
    				success:function(data){
    					if(data.status==0){
    						alert(data.errorMsg);
    						if(data.errorCode==1000){
    							DO("passport/login");
    						}else{
    							DO("error", data);
    						}
    						return false;
    					}
    					if(ctrl.hasPayPassword==null){
    						ctrl.hasPayPassword = data.data.hasPayPassword;
    					}
    					var html ="";
    					if(data.data.page.list.length==0){
    						ctrl.continueLoad = false;
    						$("html,body").loadingWrapCancel();
    						if(pageNum == 1){
    							html+="<div class='reminder'>"
    								+ "		<i class='iconfont color-gray9'>&#xe663;</i>"
    								+ "		<h5 class='m-top40 color-gray9'>您还没有相关订单哦~~</h5>"
    								+ "</div>"
    						}
    						$("#userOrderList").append(html);
    						return false;
    					}
    					if(data.data.page.list.length<ctrl.pageSize){
    						ctrl.continueLoad = false;
    					}
					    $.each(data.data.page.list, function (oIndex,orders) {
					    	var shopName=""
					    	var toShop="";
					    	var shopImage="";
					    	if(orders.shopId!=null){
					    		shopName=orders.shopName+">"
					    		shopImage="<img src='"+Config.imgPre+orders.shopHead+"'/>";
					    		toShop="onclick='this.ctrl.toShop("+orders.shopId+")'";
					    	}
					    	var orderStatus = Config.message.orders.status[orders.status];
					    	if(orders.status == "hasShi" && orders.shippingMethod=="general"){
					    		orderStatus = "卖家已发货";
					    	}else if(orders.status == "hasShi" && orders.shippingMethod!="general"){
					    		orderStatus = "等待买家收货";
					    	}
					    	html+="<div class='con-list'>"
							    +"    <div class='hd bg-white' "+toShop+">"
							    +"        <a href='javascript:;'>"
							    +"            <span>"
							    +"            	"+shopImage
							    +"            </span>"
						        +"         	  "+shopName
							    +"        </a>"
							    +"        <span class='kdl-right color-red'>"+orderStatus+"</span>"
							    +"    </div>"
							    +"    <ul  onclick=\"this.ctrl.toOrderDetails("+orders.id+",\'"+orders.type.toString()+"\')\">"
							    if(orders.type == "geOrd"){
							    	$.each(orders.orderItems, function (oiIndex, oItem) {
							    		var skuValue = oItem.skuValue==null?"":oItem.skuValue
							    		html+="<li>"
							    			+"  	<a href='javascript:void(0);'>"
							    			+"   	<div class='pic'>"
							    			+"       	<img src='"+Config.imgPre+oItem.thumbnail+"'/>"
							    			+"       </div>"
							    			+"       <div class='txt'>"
							    			+"       	<h6 class='color-gray6 ellips1'>"+oItem.name+"</h6>"
							    			+"			<p class='color-gray9'>"+skuValue+"</p>"
							    			+"       </div>"
							    			+"       <div class='jiage'>"
							    			+"       	<span class='color-gray3'>￥"+oItem.price.toFixed(2)+"</span>"
							    			+"       	<p class='color-gray6'>x"+oItem.quantity+"</p>"
							    			+"       </div>"
							    			+"    </a>";
							    			if(orders.orderItems.length==(oiIndex+1) && orders.status=="hasShi" && orders.shippingMethod=="ownTake" && orders.expiryTime!=null){
							    				html+="<div class='m-top10 color-gray6'>有效期至:"+orders.expiryTime+"</div>";
							    			}
							    		html+=" </li>";
							    	})
							    }else{
							    	var skuValue = orders.orderItems[0].skuValue==null?"":orders.orderItems[0].skuValue;
							    	var expiryTime = orders.status=="noCon" && orders.expiryTime!=null?"<div class='m-top10 color-gray6'>有效期至:"+orders.expiryTime+"</div>":"";
							    	html+="<li>"
						    			+"  	<a href='javascript:void(0);'>"
						    			+"   	<div class='pic'>"
						    			+"       	<img src='"+Config.imgPre+orders.orderItems[0].thumbnail+"'/>"
						    			+"       </div>"
						    			+"       <div class='txt'>"
						    			+"       	<h6 class='color-gray6 ellips1'>"+orders.orderItems[0].name+"</h6>"
						    			+"			<p class='color-gray9'>"+skuValue+"</p>"
						    			+"       </div>"
						    			+"       <div class='jiage'>"
						    			+"       	<span class='color-gray3'>￥"+orders.orderItems[0].price.toFixed(2)+"</span>"
						    			+"       	<p class='color-gray6'>x"+orders.quantity+"</p>"
						    			+"       </div>"
						    			+"    </a>"
						    			+expiryTime
						    			+" </li>"
							    }
						    var oFreight = "";
						    var oPrice = "";
					    	if(orders.type == "geOrd"){
					    		oFreight = "(含运费<cite>￥"+orders.freight.toFixed(2)+"</cite>)"
					    	}
					    	if(orders.status == "pePay"){
					    		oPrice = "实付款:<cite class='h5'>￥"+orders.payAmount.toFixed(2)+"</cite>";
					    	}else{
					    		oPrice = "合计：<cite class='h5'>￥"+orders.totalPrice.toFixed(2)+"</cite>";
					    	}
					    	var oHandleBtn = "";
					    	if(orders.status == "pePay"){
					    		oHandleBtn ="<button type='button' onclick='this.ctrl.cancelBtn("+orders.id+")'>取消订单</button>"
					    				   +"<button type='button' onclick=\"this.ctrl.payBtn('"+orders.sn+"\')\" class='cur'>付款</button>";
					    	}else if(orders.status == "peShip" && orders.shippingMethod=="general"){
					    		oHandleBtn ="<button type='button' onclick='this.ctrl.remindShippingBtn("+orders.id+")' class='cur'>提醒发货</button>";
					    	}else if(orders.status == "hasShi" && orders.shippingMethod=="general"){
					    		oHandleBtn ="<button type='button' onclick=\"this.ctrl.shipingInfoBtn('"+orders.trackingNo+"',\'"+orders.expressCom+"\')\">查看物流</button>"
				                           +"<button type='button' onclick='this.ctrl.signBtn("+orders.id+")' class='cur'>确认收货</button>";
					    	}else if(orders.status == "hasCom" && orders.type =="geOrd" && orders.shippingMethod=="general"){
					    		oHandleBtn ="<button type='button' onclick=\"this.ctrl.shipingInfoBtn('"+orders.trackingNo+"',\'"+orders.expressCom+"\')\">查看物流</button>";
					    	}else if(orders.status == "hasRec"){
					    		if(orders.shippingMethod=="general"){
					    			oHandleBtn+="<button type='button' onclick=\"this.ctrl.shipingInfoBtn('"+orders.trackingNo+"',\'"+orders.expressCom+"\')\">查看物流</button>";
					    		}
					    		oHandleBtn+="<button type='button' onclick='this.ctrl.evaluateBtn("+orders.id+")' class='cur'>评价</button>";
					    	}else if(orders.status == "hasCon" ){
					    		oHandleBtn ="<button type='button' onclick='this.ctrl.evaluateBtn("+orders.id+")' class='cur'>立即评价</button>";
					    	}
			
							html+="    </ul>"
								+"     <div class='bd'>"
								+"         <div>"
								+"共"+orders.quantity+"件商品 "+oPrice+oFreight
								+"         </div>"
								+"         <div>"
								+				oHandleBtn
								+"         </div>"
								+"     </div>"
								+" </div>"
			            });
					    $("#userOrderList").append(html);
					    $("html,body").loadingWrapCancel();
    				},
    				error:function(data){
    					alert("亲，系统错误请您稍后再试！");
    				}
    			});
	        },
	        cancelBtn : function(orderId){
	        	$(".causeList").show(500);
            	$(".theme-popover-mask").show();
            	this.curOrderId = orderId;
	        },
	        _pass:function(){
	        	$(document).unbind("scroll");
	        },
	        scrollLoad : function(){
	        	 if($.getScrollBottom()<3){
            		 if(this.continueLoad){
            			 this.pageNum = this.pageNum+1;
            			 this.loadData(this.pageNum,this.pageSize,this.curStatus);
            		 }
            	 }
	        },
	        statusLoad : function(oStatus){
	        	$("#userOrderList").empty();
                document.getElementsByTagName('body')[0].scrollTop = 0;
                this.pageNum = this.defaultPageNum;
                this.pageSize = this.defaultpageSize;
                this.curStatus = oStatus;
                this.continueLoad = true;
                this.loadData(this.pageNum,this.pageSize,this.curStatus);
	        },
	        toOrderDetails : function(orderId,orderType){
	        	this.scrollTop = document.body.scrollTop;
	        	if(orderType == "geOrd"){
	        		GO("order/retailDetails",{orderId:orderId},".sub_container");
	        	}else{
	        		GO("order/serviceDetails",{orderId:orderId},".sub_container");
	        	}
	        },
	        payBtn : function(orderSn){
	        	GO("pay/cashierDesk",{sn:orderSn});
	        },
	        signBtn : function(orderId){
	        	var ctrl = this;
	        	if(this.hasPayPassword==true){
        			/*输入支付密码*/
	        		this.curOrderId = orderId;
	        		$(".pwdpollue").show(300);
	        		$(".theme-popover-mask").show(200);
        		}else{
        			if(this.submitCount==0){
        				this.submitCount = this.submitCount+1;
        				$(".theme-popover-mask").hide(500);
    	            	$(".pwdpollue").hide(300);
            			GO("ucenter/PayPassword",{toHistory:true},".sub_container");
        			}else{
        				$.ajax({
        					url:"ucenter/checkHavePayPwd.shtml",
        					data:null,
        					async:false,
        					dataType:"json",
        					type:"get",
        					success:function(data){
        						if(data.status==0){
        							alert(data.errorMsg);
        							return false;
        						}else{
        							if(data.data.hasPayPassword){
        								/*输入支付密码*/
        								ctrl.curOrderId = orderId;
        				        		$(".pwdpollue").show(300);
        				        		$(".theme-popover-mask").show(200);
        							}else{
        								$(".theme-popover-mask").hide(500);
        		    	            	$(".pwdpollue").hide(300);
        		            			GO("ucenter/PayPassword",{toHistory:true},".sub_container");
        							}
        						}
        					},
        					error:function(data){
        						alert("亲，系统错误请您稍后再试！");
        					}
        				});
        			}
        		}
	        },
	        shipingInfoBtn : function(trackingNo,expressCom){
	        	open("http://www.kuaidi100.com/chaxun?com="+expressCom+"&nu="+trackingNo);
	        },
	        remindShippingBtn : function(){
	        	alert("提醒发货功能正在研发中!");
	        },
	        toShop : function(shopId){
	        	this.scrollTop = document.body.scrollTop;
	        	GO("shop/shops",{shopId:shopId},".sub_container");
	        },
	        evaluateBtn : function(orderId){
	        	this.scrollTop = document.body.scrollTop;
	        	GO("order/evaluate",{orderId:orderId},".sub_container");
	        }
	    },
	    /*零售订单详情*/
	    "order/retailDetails": {
	    	_title: "订单详情",
	    	_footer: false,
	    	_template:{
	    		url:"view/order/userOrder/retailOrderDetails.ejs"
	    	},
	    	_links:{
	        	"plugin/qrcode.js":"js",
	        	"plugin/jquery.qrcode.js":"js"
	        },
	    	orderStatus : null,
	    	_datas: {
	    		data:GET("order/orderDetails.shtml",{orderId:PARAM("orderId",null)},function(data,ctrl){
	    			if(data instanceof Error){
	    				ctrl._goShow=false;
	    				DO("error", data);
	    			}
	    			return data;
	    		}),
	    	},
	    	_show :function(){
	    		var rSta = this._param.rSta;
	    		if(rSta!=null && rSta!=""){
	    			this.orderStatus=rSta;
	    		}
	    	},
	    	_load: function () {
	    		var ctrl = this;
	    		$("#returnBtn").click(function(){
	    			if(ctrl.orderStatus == null){
	    				history.go(-1);
	    			}else{
	    				GO("order/userOrders",{statusStr:ctrl.orderStatus});
	    			}
	    		})
	    	},
	    	toProductDetails : function(goodsId,shopId,speConId){
            	if(speConId==null){
	        		GO("goods/details",{goodsId:goodsId,shopId:shopId},".sub_container");
	        	}else{
	        		GO("goods/details",{goodsId:goodsId,shopId:shopId,specialtyContentId:speConId},".sub_container");
	        	}
            },
	    	shipingInfoBtn : function(trackingNo,expressCom){
	    		open("http://www.kuaidi100.com/chaxun?com="+expressCom+"&nu="+trackingNo);
	    	},
	    	toShop : function(shopId){
	        	GO("shop/shops",{shopId:shopId},".sub_container");
	        },
	        toCallBus : function(){
	        	GO("message/messageLists",{userType:member});
	        },
	        applyReturns : function(orderId){
	        	GO("returns/selectReturns",{orderId:orderId});
	        },
	        payCancel : function(orderId){
	        	var ctrl = this;
	        	$.ajax({
					url:"order/isInvalid.shtml",
					data:{orderId:orderId},
					async:false,
					dataType:"json",
					type:"get",
					success:function(data){
						if(data.status==0){
							alert(data.errorMsg);
							return false;
						}else{
							var alertInfo = "您的订单已支付成功,确认要取消吗?";
							if(data.data.isInvalid){
								alertInfo =  "订单取消后,您本单所使用的优惠券将会失效,是否继续?";
							}
							alert(alertInfo,true,function(flag){
								if(flag){
									ctrl.submitPayCancel(orderId);
									return false;
								}
							});
						}
					},
					error:function(data){
						alert("亲，系统错误请您稍后再试！");
					}
				});
	        },
	        submitPayCancel : function(orderId){
	        	$.ajax({
					url:"order/payCancel.shtml",
					data:{orderId:orderId},
					async:false,
					dataType:"json",
					type:"get",
					success:function(data){
						if(data.status==0){
							alert(data.errorMsg);
							return false;
						}else{
							$("#curStatus").html("已取消(支付成功)");
							var html=""
									+"<div class='schedule more bg-white' onclick='this.ctrl.refundsDetails("+data.data.refundsId+")'>"
									+"	<a href='javascript:void(0);'>"
									+"  	退款进度"
									+"  </a>"
					    			+"</div>"
							$("#receiver").after(html);
							$("#payCancelBtn").remove();
							alert(null,null,"取消成功!",1000);
						}
					},
					error:function(data){
						alert("亲，系统错误请您稍后再试！");
					}
				});
	        },
	        refundsDetails : function(refundsId){
	        	GO("returns/reimburseDetail?refundsId="+refundsId);
	        },
	        evaluateBtn : function(orderId){
	        	this.scrollTop = document.body.scrollTop;
	        	GO("order/evaluate",{orderId:orderId},".sub_container");
	        },
	        generateRetailCode:function(orderId){
	        	$.get("order/generateRetailCode.shtml",{orderId:orderId},function(data){
	        		if(data.status == 1){
	        			var width=$("body").width()/640*400;
	        			alert($('<div style="margin:.5rem 0;"></div>').qrcode({
        					width:width,
        					height:width,
        					text:data.data.url
        				}),'<p>若要使用该二维码，请出示给对应的商家</p>',false);
	        		}else{
	        			alert(data.errorMsg);
	        		}
	        	});
	        }
	    },
	    /*服务订单详情页面*/
	    "order/serviceDetails": {
	    	_title: "订单详情",
	    	_footer: false,
	    	_template:{url:"view/order/userOrder/serviceOrderDetails.ejs"},
	    	orderStatus : null,
	    	_links:{
	        	"plugin/qrcode.js":"js",
	        	"plugin/jquery.qrcode.js":"js"
	        },
	    	_datas: {
	    		data:GET("order/orderDetails.shtml",{orderId:PARAM("orderId",null)},function(data,ctrl){
	    			if(data instanceof Error){
	    				ctrl._goShow=false;
	    				DO("error", data);
	    			}
	    			return data;
	    		}),
	    	},
	    	_show :function(){
	    		var rSta = this._param.rSta;
	    		if(rSta!=null && rSta!=""){
	    			this.orderStatus=rSta;
	    		}
	    	},
	    	_load: function () {
	    		var ctrl = this;
	    		$("#returnBtn").click(function(){
	    			if(ctrl.orderStatus == null){
	    				history.go(-1);
	    			}else{
	    				GO("order/userOrders",{statusStr:ctrl.orderStatus});
	    			}
	    		})
	    	},
	    	toProductDetails : function(goodsId,shopId,speConId){
            	if(speConId==null){
	        		GO("goods/details",{goodsId:goodsId,shopId:shopId},".sub_container");
	        	}else{
	        		GO("goods/details",{goodsId:goodsId,shopId:shopId,specialtyContentId:speConId},".sub_container");
	        	}
            },
	    	toShop : function(shopId){
	        	GO("shop/shops",{shopId:shopId},".sub_container");
	        },
	        toCallBus : function(){
	        	GO("message/messageLists",{userType:member});
	        },
	        payCancel : function(orderId){
	        	var ctrl = this;
	        	$.ajax({
					url:"order/isInvalid.shtml",
					data:{orderId:orderId},
					async:false,
					dataType:"json",
					type:"get",
					success:function(data){
						if(data.status==0){
							alert(data.errorMsg);
							return false;
						}else{
							var alertInfo = "您的订单已支付成功,确认要取消吗?";
							if(data.data.isInvalid){
								alertInfo =  "订单取消后,您本单所使用的优惠券将会失效,是否继续?";
							}
							alert(alertInfo,true,function(flag){
								if(flag){
									ctrl.submitPayCancel(orderId);
									return false;
								}
							});
						}
					},
					error:function(data){
						alert("亲，系统错误请您稍后再试！");
					}
				});
	        },
	        submitPayCancel : function(orderId){
	        	$.ajax({
					url:"order/payCancel.shtml",
					data:{orderId:orderId},
					async:false,
					dataType:"json",
					type:"get",
					success:function(data){
						if(data.status==0){
							alert(data.errorMsg);
							return false;
						}else{
							var html=""
								+"<div class='schedule more bg-white' onclick='this.ctrl.refundsDetails("+data.data.refundsId+")'>"
								+"	<a href='javascript:void(0);'>"
								+"  	退款进度"
								+"  </a>"
				    			+"</div>"
			    			$("#receiver").after(html);
							$("#payCancelBtn").remove();
							alert(null,null,"取消成功!",1000);
						}
					},
					error:function(data){
						alert("亲，系统错误请您稍后再试！");
					}
				});
	        },
	        refundsDetails : function(refundsId){
	        	GO("returns/reimburseDetail?refundsId="+refundsId);
	        },
	        genarateCode:function(orderItemId){
	        	$.get("order/genarateCode.shtml",{orderItemId:orderItemId},function(data){
	        		if(data.status == 1){
	        			var width=$("body").width()/640*400;
	        			alert($('<div style="margin:.5rem 0;"></div>').qrcode({
        					width:width,
        					height:width,
        					text:data.data.url
        				}),'<p>若要使用该二维码，请出示给对应的商家</p>',false);
	        		}else{
	        			alert(data.errorMsg);
	        		}
	        	});
	        }
	    },
        /*评价*/
        "order/evaluate": {
            _title: "评价",
            _template:{url:"view/order/userOrder/evaluate.ejs"},
            _footer: false,
            _links:{
	        	"js/extra.js":"js",
	        },
            _datas: {
	    		data:GET("order/toEvaluate.shtml",{orderId:PARAM("orderId",null)},function(data,ctrl){
	    			if(data instanceof Error){
	    				ctrl._goShow=false;
	    				DO("error", data);
	    			}
	    			return data;
	    		}),
	    	},
            _load: function () {
                //content最小高度
                var higao= ($(window).height())-($("footer").height()*2.81);
                $(".content").css("min-height",higao);
            	var ctrl = this;
            	if(this._datas.data.status==0){
            		alert(_datas.data.errorMsg);
            		return false;
            	}
            	/*鲜花*/
                $(".con-evaluate>ul>li").click(function(){
                   var sum= $(this).index();
                   if(sum==0){
                       $(this).children("a").addClass("bg-red color-white");
                       $(this).next().children("a").removeClass("bg-orange color-white");
                       $(this).next().next().children("a").removeClass("bg-grayc color-white");
                       $(this).removeClass("color-white");
                   }else if(sum==1){
                       $(this).children("a").addClass("bg-orange color-white");
                       $(this).prev().children("a").removeClass("bg-red color-white");
                       $(this).prev().children("a").addClass("color-red");
                       $(this).next().children("a").removeClass("bg-grayc color-white");
                   }else{
                       $(this).children("a").addClass("bg-grayc color-white");
                       $(this).prev().prev().children("a").removeClass("bg-red color-white");
                       $(this).prev().prev().children("a").addClass("color-red");
                       $(this).prev().children("a").removeClass("bg-orange color-white");
                   }
                   $(this).siblings("input").val($(this).attr("score"));
                })
                /*匿名*/
                $(".Comment>h5").click(function(){
                    if($(".Comment>h5>i").text()==""){
                        $(".Comment>h5>i").text("");
                        $(".Comment>h5>i").addClass("color-red");
                        $(this).prev().val("true");
                    }else{
                        $(".Comment>h5>i").text("");
                        $(".Comment>h5>i").removeClass("color-red");
                        $(this).prev().val("false");
                    }
                })
                /*点击评星*/
                $(".Comment .star>i").click(function(){
                    var star=($(this).index())+1;
                    $(this).siblings("input").val(star);
                    $(this).parents(".star").children("i").removeClass("color-orange");
                    for(var i=0;i<star;i++){
                        $(this).parents(".star").children("i").eq(i).addClass("color-orange");
                    }
                })
            },
	    	toGoodsDetails : function(goodsId,shopId){
	        	GO("goods/details",{goodsId:goodsId,shopId:shopId});
	        },
	        toUpload : function(cObj,index){
	        	var obj = $(cObj).parent().next().children("ul");
            	var imgQuantity = obj.find("li").length;
            	if(imgQuantity>=4){
            		alert("一个商品最多可上传4张图片!");
            		return false;
            	}
            	this.uploadImage(obj,index);
	        },
	        deleteImage : function($li){
	        	alert("确认删除图片吗？",true,function(flag){
	        		if(flag){
	        			var liParent = $li.parent();
		        		$li.remove();
		        		var inputs=$(liParent.find("input"));
		        		if(inputs.length>0){
		        			$.each(inputs,function(index,item){
		        				var itemName=$(item).attr("name");
		        				itemName = itemName.replace(/imageSrcs\[[0-9]+\]/,"imageSrcs["+index+"]");
		        				$(item).attr("name",itemName);
		        			});
		        		}
		        		$(".ptos>ul>li").initImgTouch();
	        		}
	        	});
	        },
	        uploadImage : function(obj,index){
	        	$.simpleUpload({
            		multiple:false,
            		size:"10M",
            		process:function(e,files){
            			$.getMaxWrap().loadingWrap();
            		},
            		load:function(data){
            			$("html,body").loadingWrapCancel();
            			if(data==""){
            				return false;
            			}else{
            				var url=Config.imgPre+(data && data[0]);
            				var src=data&&data[0];
            				var liLength = $(obj).children("li").length;
            				var imgUrl="evaluateItems["+index+"].imageSrcs["+liLength+"].src";
            				$(obj).append("<li style='background-image:url("+url+")'><span onclick='$.stopPropagation();this.ctrl.deleteImage($(this).parent())' class='close'>x</span><input type='hidden' name='"+imgUrl+"' value='"+src+"'/></li>");
            			}
            			$(".ptos>ul>li").initImgTouch();
            		}
            	});
	        },
	        evaluateBtn : function(){
	        	var description= $("input[name='description']").val();
	        	if(description=="" || parseFloat(description)<=0 || parseFloat(description)>5){
	        		alert("商品描述至少一颗星最多五颗星哦！");
	        		return false;
	        	}
	        	var service = $("input[name='service']").val();
	        	if(service=="" || parseFloat(service)<=0 || parseFloat(service)>5){
	        		alert("卖家服务至少一颗星最多五颗星哦！");
	        		return false;
	        	}
	        	var logistics = $("input[name='logistics']").val();
	        	if(logistics=="" || parseFloat(logistics)<=0 || parseFloat(logistics)>5){
	        		alert("物流服务至少一颗星最多五颗星哦！");
	        		return false;
	        	}
	        	$(".page_container").empty();
	        	$("form").submit();
	        },
	        submitCall : function(response){
	        	if(response.status==0){
	        		alert(response.errorMsg);
	        		return false;
	        	}
	        	GO("order/userOrders",{statusStr:"peEvaluate",showMsg:"evaluate"});
	        }
        },
        /*售后服务*/
        "order/aftermarketServer": {
            _title: "售后服务",
            _template:{url:"view/order/userOrder/aftermarketServer.ejs"},
            _footer: false,
            _load: function () {
            	$(".middle-bd>ul>li>i").click(function(){
            		if($(this).text()==""){
            			$(this).html("");
            			$(this).addClass("color-red");
            		}else{
            			$(this).html("");
            			$(this).removeClass("color-red");
            		}
            	})
            }
        }
	});
})();
