(function(){
    /*公用变量和方法*/


    FORMAT({
        /*员工列表*/
        "shopPersonnel/personnelList": {
            _title:"员工列表",
            _footer:false,
            _links:{
            	"plugin/qrcode.js":"js",
            	"plugin/jquery.qrcode.js":"js"
            },
            _load: function(){
            	var ctrl = this;
                $(".theme-popover-mask,.ThinkChangeBox>i").click(function(){
                	$(".ThinkChangeBox").hide(300);
                	$(".theme-popover-mask").hide(500);
                })
                
                $.get("shopPersonnel/getShopPersonnelList.shtml",function(data){
                	if(data.status == 1){
                		var html = "";
                		data = data.data.shopPersonnelList;
                		if(data.length < 1){
                			$(".reminder").show();
                			return false;
                		}
                		for(var i=0;i<data.length;i++){
                			html += '<li>'+
				                   		'<a href="'+Config.basePath+'#shopPersonnel/shopPersonnelDetail?shopPersonnelId='+data[i].id+'">'+
				           					'<div class="pic">'+
				           						'<img src="'+Config.imgPre+data[i].user.icon+'"/>'+
				           					'</div>'+
				           					'<div class="list-txt">';
                								if(data[i].memo == ""){
                									html += '<h6>'+"暂未备注"+'</h6>';
                								}else{
                									html += '<h6>'+data[i].memo+'</h6>';
                								}
                								html +=
				           						'<p class="color-gray6 m-top10"><span class="color-gray3">';
                								if(data[i].status == 'able'){
                									html += "已启用";
                								}else if(data[i].status == 'pause'){
                									html += "未启用";
                								}
				           						html += '</span>'+data[i].user.username+'</p>'+
				           					'</div>'+
				           					'<i class="iconfont">&#xe608;</i>'+
				           				'</a>'+
				           			'</li>';
                		}
                		$("#shopPersonnelList").html(html);
                	}
                });
            },
            addShopPersonnelCode:function(){
            	$.get("shopPersonnel/addShopPersonnelCode.shtml",function(data){
            		if(data.status == 1){
            			data = data.data;
            			var url = data.url;
            			var width=$('.ThinkChangeBox .pic').width();
            			$('.ThinkChangeBox .pic').empty().qrcode({
        					width:width,
        					height:width,
        					text:url
        				});
            			$(".ThinkChangeBox").show(500);
                    	$(".theme-popover-mask").show(300);
            		}else{
            			alert(data.errorMsg);
            		}
            	})
            }
        },
        /*员工资料*/
        "shopPersonnel/shopPersonnelDetail": {
            _title:"员工资料",
            _footer:false,
            _datas:{
            	data:GET("shopPersonnel/shopPersonnelDetail.shtml",{shopPersonnelId:PARAM("shopPersonnelId")},function(data){
                	return data;
                })
            },
            toUpdateShopPersonnel:function(id,memo){
            	GO("shopPersonnel/personnelName",{id:id,memo:memo});
            },
            updateShopPersonnelStatus:function(status){
            	var alertFlag = false;
            	var content = "确定要修改该员工的状态？";
            	if(status == 'pause'){
            		content = "确定要暂停该员工的权限?";
            	}else if(status == 'able'){
            		content = "确定要启用该员工的权限?";
            	}else if(status == 'invalid'){
            		content = "确定要删除该员工吗?";
            		alertFalg = true;
            	}
            	var shopPersonnelId = $("#shopPerosnnelId").val();
            	if(alertFlag){
            		alert(content,true,function(flag){
    					if(flag){
    		            	$.post("shopPersonnel/updateShopPersonnelStatus.shtml",{status:status,shopPerosnnelId:shopPersonnelId},function(data){
    		            		if(data.status == 1){
    		            			if(status == 'invalid'){
    		            				GO("shopPersonnel/personnelList");
    		            			}else{
    		            				location.reload();
    		            			}
    		            		}else{
    		            			alert(data.errorMsg);
    		            		}
    		            	});
    					}
    				});
            	}else{
	            	$.post("shopPersonnel/updateShopPersonnelStatus.shtml",{status:status,shopPerosnnelId:shopPersonnelId},function(data){
	            		if(data.status == 1){
	            			if(status == 'invalid'){
	            				GO("shopPersonnel/personnelList");
	            			}else{
	            				location.reload();
	            			}
	            		}else{
	            			alert(data.errorMsg);
	            		}
	            	});
            	}
            },
           toTakeGoodsLog: function(){
        	  var shopPersonnelId = $("#shopPerosnnelId").val();
        	  GO("shopPersonnel/orderRecord",{shopPersonnelId:shopPersonnelId});
           }
        },
        /*备注名称修改*/
        "shopPersonnel/personnelName": {
            _title:"备注名称",
            _footer:false,
            _load: function(){
                var shopPersonnelName = this._param.memo;
                $("#shopPersonnemlName").val(shopPersonnelName);
                $(".content .name>i").click(function(){
                	$(".content .name>input").val("");
                })
            },
            updateShopPersonnelName:function(){
            	var shopPerosnnelName = $("#shopPersonnemlName").val();
            	var id = this._param.id;
            	$.post("shopPersonnel/updateShopPersonnelMemo.shtml",{shopPersonnelId:id,memo:shopPerosnnelName},function(data){
            		if(data.status == 1){
            			alert("修改成功");
            			history.go(-1);
            		}else{
            			alert(data.errorMsg);
            		}
            	})
            }
        },
        /*对单记录*/
        "shopPersonnel/orderRecord": {
            _title:"兑单记录",
            _footer:false,
            pageNum:1,
            pageSize:10,
            defaultPageNum:1,
            defaultPageSize:10,
            load:true,
            _load: function(){
   	    	  var ctrl = this;
   	    	  ctrl.loadData();
   	    	  setREG("document_scroll", this._name, function(){
                if($.getScrollBottom() < 3 && ctrl.load){
               	ctrl.pageNum++;
               	ctrl.loadData();
              }
            });
            },
            loadData:function(){
             	var ctrl= this;
             	$.ajax({
             		url:"shopPersonnel/takeGoodsLogs.shtml",
             		async:true,
             		data:{pageNum:ctrl.pageNum,pageSize:ctrl.pageSize,shopPersonnelId:ctrl._param.shopPersonnelId},
             		type:"post",
             		dataType:"json",
             		success:function(data){
             			if(data.status == 1){
             				var list = data.data.takeGoodsLogs.list;
             				if(list == null){
             					list = [];
             				}
             				var html = "";
             				if(list.length > 0){
             					ctrl.load = true;
             					//$("#noData").hide();
             					$.each(list, function (oiIndex, logInfo) {
             						html += "<li>"
			             				 +"     <a href='javascript:' onclick='ctrl.toDetails("+logInfo.orderId+")'>"
     									 +"     	<h5 class='color-gray6 p'>"+logInfo.createDate+"</h5>"
     									 +"			<p class='color-gray3 m-top10 h5'>兑单金额（元）："+logInfo.amount.toFixed(2)+"</p>"
     									 +" 		<span><p class='color-gray6 h6'>查看详情 ></p><p class='m-top10'>"+logInfo.username+"</p></span>"
     									 +"  	</a>"
     									 +"</li>";
             					});
             				}else if(list.length == 0 && ctrl.pageNum == 1){
             					$(".reminder").show();
             				}
             				$("#dataList").append(html);
             				if(list.length < ctrl.defaultPageSize){
             					ctrl.load = false;
             				}
             			}else{
             				alert(data.errorMsg);
             			}
             		}
             	});
             },
             toDetails : function(orderId){
	           	  GO("order/busDetails",{orderId:orderId});
             }
        },
        /*绑定商家*/
        "shopPersonnel/addShopPersonnel": {
           _title:"绑定商家",
           _footer:false,
           _datas:{
           },
           _load:function(){
        	   $.get(Config.basePath+"shopPersonnel/addShopPersonnelDetail.shtml",{shopId:this._param.shopId,passCode:this._param.passCode},function(data){
        		   if(data.status == 1){
        			   data = data.data;
        			   if(data.flag && data.flag == true){
            			   $("#userIcon").attr("src",Config.imgPre+data.user_icon);
            			   $("#userNickName").html(data.user_nickName);
            			   $("#shopIcon").attr("src",Config.imgPre+data.shop_icon);
            			   $("#shopShopName").html(data.shop_shopName);
            		   }else{
            			   $(".dataContent").hide();
            			   $("#errorDiv").show();
            			   $("#errorMsg").html(data.content);
            		   }
        		   }else{
        			   DO("error",data);
        		   }
	          })
           },
           addShopPersonnel:function(){
        	   $.post(Config.basePath+"shopPersonnel/addShopPersonnel.shtml",{shopId:this._param.shopId,passCode:this._param.passCode},function(data){
        		   if(data.status == 1){
        			   data = data.data;
        			   alert(data.content,function(data){
                		   window.location.href="#shopPersonnel/staffPlatform";
                	   });
        		   }else{
        			   alert(data.errorMsg);
        		   }
        	   })
           }
        },
        /*员工平台*/
        "shopPersonnel/staffPlatform": {
            _title:"员工平台",
            _footer:false,
            _load: function(){
                
            }
        },
        /*订单交易*/
    	"shopPersonnel/orderSearch": {
	    	_title: "订单交易",
	    	_footer: false,
	    	_links:{
	        	"js/inputValidate.js":"js",
	        	"plugin/jquery.md5.js" : "js"
	        },
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
	            	if(ctrl.curSearValue==null){
	            		return false;
	            	}else{
	            		ctrl.scrollLoad();
	            	}
	            });
	            $("#searchBtn").click(function(){
	            	var input = $(this).prev();
	            	var searValue= $(this).prev().val();
	            	input.poshytip("destroy");
	            	var flag = true;
	            	if(searValue=="" || searValue.length<11){
	            		var content = "号码不可以为空";
	            		if(searValue!="" && searValue.length<11){
	            			content = "号码格式错误"
	            		}
            			input.poshytip({content: content, 
            				keepInViewport: true,
            				className: "tip-yellow", /*'tip-darkgray', 'tip-yellow', 'tip-twitter'*/
            				showOn: "none", /*'hover', 'focus', 'none'*/
            				alignTo: "target", /* 'target','cursor' */
            				alignX: "inner-left", /*'right', 'center', 'left', 'inner-left', 'inner-right'*/
            				alignY: "bottom", /*'bottom', 'center', 'top', 'inner-bottom', 'inner-top'*/
            				offsetX: 0,
            				offsetY: 10,
            				fade:true,
            				slide:true }).poshytip("show");
            			setTimeout(function(){input.poshytip("hide");},1000);
            			return false;
	            	}else{
	            		ctrl.curSearValue = searValue;
	            		ctrl.statusLoad(ctrl.curStatus);
	            	}
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
    				url:"shopPersonnel/personnelOrders.shtml",
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
    								+ "		<h5 class='m-top40 color-gray9'>未搜索到相关订单~~</h5>"
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
	     /*订单信息*/
        "shopPersonnel/orderInformation": {
            _title:"订单信息",
            _footer:false,
            _datas:{
            	data:GET("order/getExchangeOrderDetail.shtml",{orderId:PARAM("orderId"),orderItemId:PARAM("orderItemId"),passCode:PARAM("passCode"),passKey:PARAM("passKey")},function(data){
            		return data;
            	})
            },
            _show: function(){
                if($(".btnBox").is(":hidden")){
                	$(".footersDiv button").show();
                }else{
                	$(".footersDiv button").hide();
                }
            },
            exchangeOrder:function(){
            	var orderId = this._param.orderId;
            	var orderItemId = this._param.orderItemId;
            	var passCode = this._param.passCode;
            	var passKey = this._param.passKey;
            	$.post("order/exchangeOrder.shtml",{orderId:orderId,orderItemId:orderItemId,passCode:passCode,passKey:passKey},function(data){
            		if(data.status == 1){
            			data = data.data;
            			$(".btnBox").show();
                		$(".footersDiv,.Info,.commodityList").hide();
                		//alert(data.content);
                		$(".reminder>h5").html(data.content);
                		$(".reminder>i").html("");
                		$(".nav-header").html("交易结果");
                		var orderId = data.orderId;
                		$("#toOrderDetail").attr("url","#order/busDetails?orderId="+orderId+"(+~.sub_container~+)");
            		}else{
            			$(".btnBox").show();
            			$(".footersDiv,.Info,.commodityList").hide();
            			//alert(data.errorMsg)
            			$(".reminder>h5").html(data.errorMsg);
            			$(".reminder>i").html("");
            			$(".nav-header").html("交易结果");
            			$("#toOrderDetail").hide();
            		}
            	})
            },
            toOrderDetail:function(obj){
            	window.location.href = $(obj).attr("url");
            }
        },
        /*员工查看商家线下账单*/
        "shopPersonnel/offlinePay": {
        	_title:"线下支付",
            _footer:false,
            pageNum:1,
            pageSize:10,
            defaultPageNum:1,
            defaultPageSize:10,
            load:true,
            _load: function(){
   	    	  var ctrl = this;
   	    	  ctrl.loadData();
   	    	  setREG("document_scroll", this._name, function(){
                if($.getScrollBottom() < 3 && ctrl.load){
               	ctrl.pageNum++;
               	ctrl.loadData();
              }
            });
            },
            loadData:function(){
             	var ctrl= this;
             	$.ajax({
             		url:"shopPersonnel/personnelBills.shtml",
             		async:true,
             		data:{pageNum:ctrl.pageNum,pageSize:ctrl.pageSize,shopPersonnelId:ctrl._param.shopPersonnelId},
             		type:"post",
             		dataType:"json",
             		success:function(data){
             			if(data.status == 1){
             				var list = data.data.busLineBills.list;
             				if(list == null){
             					list = [];
             				}
             				var html = "";
             				if(list.length > 0){
             					ctrl.load = true;
             					var defaultIcon = "http://img.kaidianlaa.com/upload/image/201512/1ef8702d-8711-4c08-9f89-5b6972da61c5.jpg";
             					$.each(list, function (oiIndex, billInfo) {
             						var orderStatus = Config.message.busbill.status[billInfo.status];
             						var username = billInfo.username==null||billInfo.username==""?"":billInfo.username;
             						var icon = billInfo.icon==null||billInfo.icon=="" ?defaultIcon:Config.imgPre+billInfo.icon;
             						html+="<li onclick=\"this.ctrl.toDetails('"+billInfo.sn+"')\">"
             							+"	<div class='pic'>"
	             						+"		<img src='"+icon+"'/>"
	             						+"	</div>"
	             						+"	<h5 class='color-red h4'>"+billInfo.amount.toFixed(2)+"</h5>"
	             						+"	<p class='color-gray6 m-top10'>"+billInfo.createDate+"</p>"
	             						+"	<span><p class='color-gray6 h5'>"+orderStatus+"</p><p class='m-top10 color-gray6'>"+username+"</p></span>"
	             						+"</li>"
             					});
             				}else if(list.length == 0 && ctrl.pageNum == 1){
             					$(".reminder").show();
             				}
             				$("#dataList").append(html);
             				if(list.length < ctrl.defaultPageSize){
             					ctrl.load = false;
             				}
             			}else{
             				alert(data.errorMsg);
             			}
             		}
             	});
             },
             toDetails : function(sn){
            	 GO("business/billDestil",{sn:sn});
             }
        },
        
    });
    
})();