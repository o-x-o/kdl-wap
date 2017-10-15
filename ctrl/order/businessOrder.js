(function(){
    /*公用变量和方法*/
    FORMAT({
    	 /*商家订单列表*/
	    "order/busOrders": {
	    	_title: "商家订单列表",
	    	_footer: false,
	    	_links:{
	        	"js/inputValidate.js":"js",
	        	"plugin/jquery.md5.js" : "js"
	        },
	    	_template:{url:"view/order/businessOrder/busOrders.ejs"},
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
	        scrollTop : null,
	        curSearValue : null,
	        _show : function(){
	        	if(this.scrollTop != null){
	        		document.body.scrollTop=this.scrollTop;
	        		this.scrollTop=null;
	        	}
	        },
	    	_load : function () {
	    		var ctrl = this;
	    		 /*下拉列表*/
	            $(".screen>ul>li").click(function(){
	                $(this).addClass("cur").siblings().removeClass("cur");
	                $($(this).find("i")).show();
	                $(this).siblings().find("i").hide();
	                $(".nav-header>cite").html($(this).find("span").html());
	                $(".screen").hide();
	                $(".theme-popover-mask").hide();
	                ctrl.statusLoad($(this).attr("name"));
	            })
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
	            
	            setREG("document_scroll", ctrl._name, function(){
	            	ctrl.scrollLoad();
	            });
	            $("#searchBtn").click(function(){
	            	var searValue= $(this).prev().val();
	            	if(searValue==""){
	            		if(ctrl.curSearValue==null){
	            			return false;
	            		}else{
	            			ctrl.curSearValue = null;
	            		}
	            	}else{
	            		ctrl.curSearValue = searValue;
	            	}
	            	ctrl.statusLoad(ctrl.curStatus);
	            })
	            $("#searchContent").keyup(function(){
	            	if($(this).val()!=""){
	            		$("#delBtn").show();
	            	}else{
	            		$("#delBtn").hide();
	            	}
	            }),
	            $("#delBtn").click(function(){
	            	$("#searchContent").val("");
	            })
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
    				url:"order/busOrders.shtml",
    				data:{"pageNum":pageNum,"pageSize":pageSize,"strStatus":strStatus,"searValue":ctrl.curSearValue},
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
					    	html+="<div class='con-list'>"
							    +"    <div class='hd bg-white'>"
							    +"        <a href='javascript:;'>"
						        +"         	  "+orders.userNickName
							    +"        </a>"
							    +"        <span class='kdl-right color-red'>"+Config.message.orders.busStatus[orders.status]+"</span>"
							    +"    </div>"
							    +"    <ul onclick='this.ctrl.toOrderDetails("+orders.id+")'>"
							    if(orders.type == "geOrd"){
							    	$.each(orders.orderItems, function (oiIdex, oItem) {
							    		var skuValue = oItem.skuValue==null?"":oItem.skuValue;
							    		html+="<li>"
							    			+"  	<a href='javascript:void(0);'>"
							    			+"   	<div class='pic'>"
							    			+"       	<img src='"+Config.imgPre+oItem.thumbnail+"'/>"
							    			+"       </div>"
							    			+"       <div class='txt'>"
							    			+"       	<h6 class='color-gray6 ellips'>"+oItem.name+"</h6>"
							    			+"			<p class='color-gray9'>"+skuValue+"</p>"
							    			+"       </div>"
							    			+"       <div class='jiage'>"
							    			+"       	<span class='color-gray3'>￥"+oItem.price.toFixed(2)+"</span>"
							    			+"       	<p class='color-gray6'>x"+oItem.quantity+"</p>"
							    			+"       </div>"
							    			+"    </a>"
							    			+" </li>"
							    	})
							    }else{
							    	var skuValue = orders.orderItems[0].skuValue==null?"":orders.orderItems[0].skuValue;
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
						    			+" </li>"
							    }
						    var oFreight = "";
					    	if(orders.type == "geOrd"){
					    		oFreight = "（含运费<cite>￥"+orders.freight.toFixed(2)+"</cite>）"
					    	}
					    	
					    	var oHandleBtn = "";
					    	if(orders.type == "geOrd" && (orders.status == "hasShi" || orders.status == "hasRec" || orders.status == "hasCom") && orders.shippingMethod=="general"){
					    		oHandleBtn ="<button type='button' onclick=\"this.ctrl.shipingInfoBtn(\'"+orders.trackingNo+"\',\'"+orders.expressCom+"\')\">查看物流</button>";
					    	}
			
							html+="    </ul>"
								+"     <div class='bd'>"
								+"         <div>"
								+"          共"+orders.quantity+"件商品 合计：<cite class='h5'>￥"+orders.totalPrice.toFixed(2)+"</cite>"+oFreight
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
        		GO("order/busDetails",{orderId:orderId},".sub_container");
	        },
	        shipingInfoBtn : function(trackingNo,expressCom){
	        	open("http://www.kuaidi100.com/chaxun?com="+expressCom+"&nu="+trackingNo);
	        },
	        toShop : function(shopId){
	        	this.scrollTop = document.body.scrollTop;
	        	GO("shop/shops",{shopId:shopId},".sub_container");
	        },
	    },
        /*商家订单详情*/
        "order/busDetails": {
        	_title: "商家订单详情",
	    	_footer: false,
	    	_links:{
	        	"js/inputValidate.js":"js",
	        },
	    	_template:{url:"view/order/businessOrder/busDetails.ejs"},
	    	orderStatus : null,
	    	_datas: {
	    		data:GET("order/busDetails.shtml",{orderId:PARAM("orderId",null)},function(data,ctrl){
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
	    		var showMsg = this._param.showMsg;
	    		if(showMsg!=null && showMsg!=""){
	    			if(showMsg.trim()=="ship"){
	    				alert(null,null,"发货成功!",1000);
	    			}
	    		}
	    		$("#returnBtn").click(function(){
	    			var userType = ctrl._datas.data.userType;
	    			if(ctrl.orderStatus == null){
	    				history.go(-1);
	    			}else{
	    				if(userType=="member"){
	    					GO("shopPersonnel/orderSearch");
	    				}else{
	    					GO("order/busOrders");
	    				}
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
            toShipping : function(orderId){
            	GO("order/busShipments",{orderId:orderId});
            },
            toCallUser : function(){
	        	GO("message/messageLists",{userType:"member"});
	        },
            toConsume : function(obj,orderId){
            	var consumeCode = $(obj).prev().val();
            	if(consumeCode.trim()=="" ){
            		alert("消费码不可以空！");
            		return false;
            	}
            	if(consumeCode.replace(/\s/g, "").length!=9){
            		alert("请输入9位消费密码！");
            		return false;
            	}
            	alert("确认要消费吗？", function(flag){
            		if(flag){
            			$.ajax({
    	    				url:"order/busConsume.shtml",
    	    				data:{"orderId":orderId,"consumeCode":consumeCode.replace(/\s/g, "")},
    	    				async:false,
    	    				dataType:"json",
    	    				type:"post",
    	    				success:function(data){
    	    					if(data.status==0){
    	    						alert(data.errorMsg);
    	    						return false;
    	    					}else{
			            			alert(null,null,"消费成功",1000);
			            			$(obj).prev().remove();
			            			$(obj).removeClass("bg-red color-white ");
			            			$(obj).addClass("bg-gray color-gray6 ");
			            			$(obj).before("<span>"+consumeCode+"</span>");
			            			$(obj).html("已消费");
			            			$(obj).attr("onclick","return false");
			            			if($("#allConsume li").children("input").length<=0){
			            				$("#oStatus").html(Config.message.orders.busStatus["hasCon"]);
			            			}
    	    					}
    	    				},
    	    				error:function(data){
    	    					alert("亲，系统错误请您稍后再试！");
    	    				}
    	    			});
            		}
            	},true); 
            },
            toTakenCode : function(obj,orderId){
            	var takenCode = $(obj).prev().val();
            	if(takenCode.trim()=="" ){
            		alert("消费码不可以空！");
            		return false;
            	}
            	if(takenCode.replace(/\s/g, "").length!=6){
            		alert("请输入6位取货码！");
            		return false;
            	}
            	alert("确认要提货吗？", function(flag){
            		if(flag){
            			$.ajax({
            				url:"order/busTaken.shtml",
            				data:{"orderId":orderId,"takenCode":takenCode.replace(/\s/g, "")},
            				async:false,
            				dataType:"json",
            				type:"post",
            				success:function(data){
            					if(data.status==0){
            						alert(data.errorMsg);
            						return false;
            					}else{
            						alert(null,null,"提取成功!",1000);
            						$(obj).prev().remove();
            						$(obj).removeClass("bg-red color-white ");
            						$(obj).addClass("bg-gray color-gray6 ");
            						$(obj).before("<span>"+takenCode+"</span>");
            						$(obj).html("已提取");
            						$(obj).attr("onclick","return false");
            						if($("#allConsume li").children("input").length<=0){
            							$("#oStatus").html(Config.message.orders.busStatus["hasRec"]);
            						}
            					}
            				},
            				error:function(data){
            					alert("亲，系统错误请您稍后再试！");
            				}
            			});
            		}
            	},true); 
            }
	    	
        },
        /*订单发货*/
        "order/busShipments": {
        	_title: "订单发货",
        	_footer: false,
        	_template:{url:"view/order/businessOrder/busShipments.ejs"},
	    	_links:{
	        	"js/inputValidate.js":"js",
	        },
	        curOrderId : null,
        	_datas: {
	    		data:GET("order/toShipping.shtml",{orderId:PARAM("orderId",null)},function(data,ctrl){
	    			if(data instanceof Error){
	    				ctrl._goShow=false;
	    				DO("error", data);
	    			}
	    			return data;
	    		}),
	    	},
        	_show: function(){
	    		if(this._param.expressId!=null){
	    			$("#curExpressId").val(this._param.expressId);
	    			$("#curExpressName").html(this._param.expressName);
	    		}
	    	},
        	_load: function () {
        		this.curOrderId = this._datas.data.orderId;
        	},
        	toSelExpress : function(orderId){
        		var curExpressId = $("#curExpressId").val();
        		GO("order/busLogistics",{orderId:orderId,curExpressId:curExpressId==""?null:curExpressId},".sub_container");
        	},
        	toProductDetails : function(goodsId,shopId){
            	GO("goods/details",{goodsId:goodsId,shopId:shopId},".sub_container");
            },
            confirmShipping : function(){
            	if($("#curExpressId").val()==""){
            		alert("亲，请您选择快递公司！");
            		return false;
            	}
            	if($("#trackingNo").val()==""){
            		alert("亲，运单号不可以为空哦！");
            		return false;
            	}
            	$("form").submit();
            },
            submitCall : function(response){
            	if(response.status==0){
					alert(response.errorMsg);
					return false;
				}
            	//var ctrl = this;
            	//alert(null,null,"操作成功!",1000);
            	//window.setTimeout(function(){GO("order/busDetails",{orderId:ctrl.curOrderId})},1000); 
            	GO("order/busDetails",{orderId:this.curOrderId,showMsg:"ship",rSta:"QQFFW"});
            }
        },
        /*物流公司*/
        "order/busLogistics": {
            _title: "快递公司",
            _footer: false,
            _template:{url:"view/order/businessOrder/busLogistics.ejs"},
            _datas: {
	    		data:GET("order/deliveryCorps.shtml",function(data,ctrl){
	    			if(data instanceof Error){
	    				ctrl._goShow=false;
	    				DO("error", data);
	    			}
	    			return data;
	    		}),
	    	},
	    	_show: function(){
	    		if(this._param.curExpressId!=null){
	    			$(".content>ul>li[curId='"+this._param.curExpressId+"']").addClass("cur").siblings().removeClass("cur");
	    		}
	    		$("body").scrollTop($(".content>.bg-white>.cur").outerHeight()*$(".content>.bg-white>.cur").attr("curIndex"))
	    	},
            _load: function(){
            	var ctrl = this;
                $(".content>ul>li").click(function(){
                    $(this).addClass("cur").siblings().removeClass("cur");
                    var expressId = $(this).attr("curId");
                    var expressName = $($(this).find("span")).html();
                    GO("order/busShipments",{orderId:ctrl._param.orderId,expressId:expressId,expressName:expressName});
                    $("body").scrollTop($("li").outerHeight()*3)
                })
            }
        },
    });

})();