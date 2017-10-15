(function(){
    /*公用变量和方法*/
    FORMAT({
    	 /*店主订单列表*/
	    "order/sKeeperOrders": {
	    	_title: "店主订单列表",
	    	_footer: false,
	    	_links:{
	        	"js/inputValidate.js":"js",
	        	"plugin/jquery.md5.js" : "js"
	        },
	    	_template:{url:"view/order/sKeeperOrder/sKeeperOrders.ejs"},
	    	pageNum : 1,
	        pageSize : 5,
	        defaultPageNum : 1,
	        defaultpageSize : 5,
	        continueLoad : true,
	        curStatus : null,
	        curOrderId : null,
	        scrollTop : null,
	        _show : function(){
	        	if(this.scrollTop != null){
	        		console.log("滚动到："+this.scrollTop);
	        		document.body.scrollTop=this.scrollTop;
	        		this.scrollTop=null;
	        	}
	        },
	    	_load : function () {
	    		var ctrl = this;
	    		this.loadData(ctrl.pageNum,ctrl.pageSize,null);
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
    				url:"order/sKeeperOrders.shtml",
    				data:{"pageNum":pageNum,"pageSize":pageSize,"strStatus":strStatus},
    				async:false,
    				dataType:"json",
    				type:"GET",
    				success:function(data){
    					if(data.status==0){
    						alert(data.errorMsg);
    						if(data.errorCode==1000){
    							DO("passport/login");
    						}
    						return false;
    					}
    					console.log(data);
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
					    	html+="<div class='con-list' >"
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
						    			+"       	<h6 class='color-gray6 ellips'>"+orders.orderItems[0].name+"</h6>"
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
					    	if(orders.type == "geOrd" && orders.shippingMethod=="general" && (orders.status == "hasShi" || orders.status == "hasCom")){
					    		oHandleBtn ="<button type='button'  onclick=\"this.ctrl.shipingInfoBtn(\'"+orders.trackingNo+"\',\'"+orders.expressCom+"\')\">查看物流</button>";
					    	}
			
							html+="    </ul>"
								+"     <div class='bd'>"
								+"         <div>"
								+"          共"+orders.quantity+"件商品 合计：<cite class='h5'>￥"+orders.goodsPrice.toFixed(2)+"</cite>"+oFreight
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
	        toOrderDetails : function(orderId){
	        	this.scrollTop = document.body.scrollTop;
        		GO("order/sKeeperDetails",{orderId:orderId},".sub_container");
	        },
	        shipingInfoBtn : function(trackingNo,expressCom){
	        	open("http://www.kuaidi100.com/chaxun?com="+expressCom+"&nu="+trackingNo);
	        },
	        toShop : function(shopId){
	        	this.scrollTop = document.body.scrollTop;
	        	GO("shop/shops",{shopId:shopId},".sub_container");
	        }
	    },
        /*店主订单详情*/
        "order/sKeeperDetails": {
        	_title: "店主订单详情",
	    	_footer: false,
	    	_template:{url:"view/order/sKeeperOrder/sKeeperDetails.ejs"},
	    	_datas: {
	    		data:GET("order/sKeeperDetails.shtml",{orderId:PARAM("orderId",null)},function(data,ctrl){
	    			if(data instanceof Error){
	    				ctrl._goShow=false;
	    				DO("error", data);
	    			}
	    			return data;
	    		}),
	    	},
	    	_load: function () {
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
            toConsume : function(orderId){
            	alert("明天要去消费了！");
            },
            toCallUser : function(){
	        	GO("message/messageLists",{userType:member});
	        },
        },
    });
})();