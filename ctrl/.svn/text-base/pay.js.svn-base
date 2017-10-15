(function(){
	/*公用变量和方法*/
	 var billType = "bills";

FORMAT({
	/** 收银台 过渡页 */
	"pay/cashierDesk":{
		/**_title:"收银台",*/
        _footer:false,
        _template:null,
        _load:function(){
//        	var accessToken = $.getCookie('accessToken');
        	
        	///<summary>检查是否支持微信支付</summary>
            var ua = window.navigator.userAgent.toLowerCase();
            var reg = /MicroMessenger\/[5-9]/i;
            if(reg.test(ua)){//如果是在微信浏览器
            	var url = "http%3A%2F%2Fwww.kaidianlaa.com%2Fcommon%2FpayOrder.shtml%3ForderSn%3D"+this._param.sn;
//            	if(accessToken != null && accessToken != ''){
//            		url += "%26accessToken%3D"+accessToken;
//            	}
            	window.location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx05113a272dd175e8&redirect_uri="+url+"&response_type=code&scope=snsapi_base#wechat_redirect";
            }else{
            	window.location.href="common/payOrder.shtml?orderSn="+this._param.sn;
//            	if(accessToken != null && accessToken != ''){
//            		window.location.href="common/payOrder.shtml?orderSn="+this._param.sn+"%26accessToken%3D"+accessToken;;
//            	}else{
//            		window.location.href="common/payOrder.shtml?orderSn="+this._param.sn;
//            	}
//            	GO("pay/billPay",{orderSn:this._param.orderSn});
            }
        }
	},
    /*收银台  过渡页*/
    "pay/billPay":{
        _title:"收银台",
        _template:{url:"view/pay/cashierDesk.ejs"},
        _footer:false,
        flag:true,
        openId:null,
        _datas:{
        	
        },
        _load:function(){
        	var ctrl= this;
        	ctrl.openId = $.getCookie('openId');
        	$.get("bill/getOrderPay.shtml",{orderSn:this._param.orderSn},function(datas){
        		if(datas.status == 0){//请求有误
        			DO("error", datas);
        			return ;
        		}
        		datas = datas.data;
        		//判断是否有数据
        		$("#payAmount").val(parseFloat(datas.payAmount).toFixed(2));
        		$("#payAmountTxt").html(parseFloat(datas.payAmount).toFixed(2));
        		$("#sn").val(datas.sn);
        		billType=datas.type;
        	}),
        	$.get("paymentPlugin/list.shtml",{},function(datas){
        		//判断是否有数据
        		if(datas.status == 0){//请求有误
        			DO("error", datas);
        			return ;
        		}
        		datas = datas.data;
        		if(datas.list.length > 0){
        			var html = "";
        			for(var i=0;i<datas.list.length;i++){
        				html += '<li>'+
						            '<a href="javascript:;" onclick="this.ctrl.toPay(\''+datas.list[i].sn+'\')" class="more">'+
						            	'<span class="pic">'+
						                	'<img style="height:.8rem;width:.8rem;" src="'+Config.imgPre+datas.list[i].logo+'" />'+
						                '</span>'+
						                '<h5>'+datas.list[i].name+'</h5>'+
						                '<p class="m-top5">'+datas.list[i].title+'</p>'+
						            '</a>'+
						        '</li>';
        			}
        			$("#paymentPluginList").html(html);
        		}
        	})
        },
        toPay:function(paymentPlugin){
        	if(!this.flag){
        		return false;
        	}
        	this.flag = false;
        	var ctrl = this;
        	var sn = $("#sn").val();
        	
        	//快钱支付
        	if(paymentPlugin == 'pay99billPaymentPlugin' && $("#payAmount").val() < 1.0){
        		alert("您的实付金额小于1.00元，无法使用快钱支付,请选择其他支付方式吧！");
        		return ;
        	}
        	
        	$.ajax({
        		url:"bill/toPay.shtml",
        		async:false,
        		data:{paymentPlugin:paymentPlugin,sn:sn,isWeiXin:this.isWeiXin5()?"w":"j",openId:ctrl.openId},
        		type:"post",
        		dataType:"json",
        		success:function(data){
        			if(data.status == 1){
        				data = data.data;
        				if(data.dataStatus != null && !data.dataStatus){
        					ctrl.flag = true;
        					alert(data.content);
        					return false;
        				}
        				if(data.jump != null && data.jump){//跳转页面
        					if(data.isSuccess != null && !data.isSuccess){
        						alert(data.errorContent);
        						return ;
        					}
        					window.location.href="bill/getPayInfo.shtml?paymentPlugin="+paymentPlugin+"&sn="+sn;
        				}else{
        					if(ctrl.isWeiXin5()){//是在微信浏览器中
        						var result = data.resultData;
        						
        						var para = {
    	                            "appId": result.appId, //公众号名称，由商户传入
    	                            "timeStamp": result.timeStamp, //时间戳
    	                            "nonceStr": result.nonceStr, //随机串
    	                            "package": result.package, //扩展包   
    	                            "signType": result.signType, //微信签名算法：MD5
    	                            "paySign": result.paySign //微信签名
        	                    };
    							WeixinJSBridge.invoke("getBrandWCPayRequest", para, function (res) {
    							    //alert(res.err_msg);
    							    if (res.err_msg == "get_brand_wcpay_request:ok") {
	    								alert("支付成功！");
	    								GO("pay/paySuccess",{sn:$("#sn").val()});
    							    } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
	    								alert("您已经取消支付！");
	    								GO("pay/billPay",{sn:$("#sn").val()});
    							    } else {
	    								alert("支付失败，请重试！");
	    								GO("pay/billPay",{sn:$("#sn").val()});
    							    }
    							});
        					}else{//不在微信浏览器中
        						window.location.href=data.resultData;
        					}
        				}
        			}else{
        				alert(data.errorMsg);
        			}
        			ctrl.flag = true;
        		},
        		error:function(data){
        			console.log(data);
        		}
        	})
    	},
    	isWeiXin5:function(){
    		///<summary>检查是否支持微信支付</summary>
            var ua = window.navigator.userAgent.toLowerCase();
            var reg = /MicroMessenger\/[5-9]/i;
            return reg.test(ua);
    	},
    	returnBtn : function(){
    		if(billType=="order"){
    			GO("order/userOrders");
    		}else{
    			GO("pay/bill");
    		}
    	}
    },
    /** 支付 */
    "pay/toPay":{
    	_title:"支付",
    	_footer:false,
    	_datas:{
    		data:GET("bill/getPayInfo.shtml",{paymentPlugin:PARAM("paymentPlugin"),sn:PARAM("sn")},function(datas,ctrl){
    			//判断是否有数据
        		if(datas instanceof Error){
        			DO("error", datas);
        		}
        		return datas;
    		})
    	},
    	_load:function(){
    		//document.forms[0].submit();
    	}
    },
    "pay/translate":{
    	_title:"开店啦",
    	_animate:false,
    	_footer:false,
    	_load:function(){
    		var code = this._param.code;
    		code = this.urlConvertKeyword(code);
    		var ua = window.navigator.userAgent.toLowerCase();
            var reg = /MicroMessenger\/[5-9]/i;
            if(reg.test(ua)){//如果是在微信浏览器
            	var domain = "http%3A%2F%2Fwww.kaidianlaa.com%2F";
//            	var domain = "http%3A%2F%2Fwyz52155.imwork.net%2Fkdl_wap";
            	var url = domain+"%2Fcommon%2FtranslatePay.shtml%3FshopCode%3D"+code;
            	window.location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx05113a272dd175e8&redirect_uri="+url+"&response_type=code&scope=snsapi_base#wechat_redirect";
            }else{
            	window.location.href=Config.basePath+"#passport/login?backUrl=common%2FpayPage.shtml%3Fcode%3D"+code;
            }
    	},
    	urlConvertKeyword:function(url){
    		if(url == null || url.length < 1){
    			return '';
    		}
    		var a1 = url.split("");
    		var temp = "";
    		for(var i=0;i<a1.length;i++){
    			if("%" == a1[i]){
    				a1[i]="%25";
    			}
    			if("+" == a1[i]){
    				a1[i]="%2B";
    			}
    			if(" " ==a1[i]){
    				a1[i]="%20";
    			}
    			if("?" == a1[i]){
    				a1[i]="%3F";
    			}
    			if("#" == a1[i]){
    				a1[i]="%23";
    			}
    			if("&" == a1[i]){
    				a1[i]="%26";
    			}
    			if("=" == a1[i]){
    				a1[i]="%3D";
    			}
    			if("/" == a1[i]){
    				a1[i]="%2F";
    			}
    			temp += a1[i];
    		}
    		return temp;
    	}
    },
    /*转账*/
    "pay/transferAccounts":{
        _title:"转账",
        _animate:false,
        _links:{
        	"js/inputValidate.js":"js"
        },
        purse:0,
        _datas: {/*动态数据 视图中也能使用全局变量 此处取名_datas区别于视图中所有变量的附属对象_data 在js中也可通过DATA(dom)获取该视图的数据 dom为该视图中的任意dom*/
        	data:GET("bill/transferAccounts.shtml",{code:PARAM("code")},function(datas,ctrl){
        		//判断是否有数据
        		if(datas instanceof Error){
        			DO("error", datas);
        			ctrl._goShow=false;
        		}
        		ctrl.purse= datas.purse;
        		return datas;
        	})
        },
        _footer:false,
        _load:function(){
        	var ctrl = this;
            /* 使用余额 */
            $(".footer .money").click(function(){
                if($(".footer .money>i").text()==""){
                	if(ctrl.purse <= 0){
                		return false;
                	}
                	var price = $("#price").val().trim();
                	var discountPrice = $("#discountPrice").val();
                	price = price - discountPrice;
                	if(ctrl.purse >=  price){
                		$("#purse").val(price);
                	}else{
                		$("#purse").val(ctrl.purse);
                	}
                	$("#isPurse").val(true);
                    $(".footer .money>i").html("");
                    $(".footer .money>i").addClass("color-red");
                }else{
                	$("#isPurse").val(false);
                    $(".footer .money>i").html("");
                    $(".footer .money>i").removeClass("color-red");
                    $("#purse").val(0);
                }
                ctrl.countPrice();
            })
            /*优惠券*/
            $(".favorable").click(function(){
            	if($("#price").val().trim() == ""){
            		return false;
            	}
                $(".theme-popover-mask").show(200);
                $(".ticket").show(300);
            })
            
        },
        checkTicket :function(){
        	$(".theme-popover-mask").hide(200);
            $(".ticket").hide(300);
        },
        getSureRandomCardUser:function(obj){
        	inputValidate.onlyFloat(obj,0.0,10000);
        	var ctrl = this;
        	var minPrice=$(obj).val().trim();
        	if(minPrice == null || minPrice == '' || minPrice.length == 0){
        		ctrl.countPrice();
        		return false;
        	}
        	$("#totalPrice").val(minPrice);
        	var shopId = $("#shopId").val();
        	
        	$("#randomCardUserId").val("");
			$("#randomCardList").html("");
			$("#isRandomCard").html("未使用");
			$("#discountPrice").val(0);
        	
        	$.ajax({
        		url:"randomCard/getSureRandomCardUser.shtml",
        		data:{minPrice:minPrice,shopId:shopId},
        		async:false,
        		type:"get",
        		dataType:"json",
        		success:function(data){
        			if(data.status == 1){
        				var dataContent=data.data;
        				$("#randomCardUserSize").html(dataContent.randomCardUserList.length);
        				if(dataContent.randomCardUserList.length == 0){
        					ctrl.countPrice();
        					return ;
        				}
        				var html="";
    					for(var i=0;i<dataContent.randomCardUserList.length;i++){
        					html += '<li class="cur" onclick="this.ctrl.checkRandomCard('+dataContent.randomCardUserList[i].id+","+dataContent.randomCardUserList[i].money+',this)">'+
	        		            		'<a href="javascript:;">'+
	        		            			'嗖券：满'+dataContent.randomCardUserList[i].minPrice.toFixed(2)+'元&nbsp;立减'+dataContent.randomCardUserList[i].money+'元';
	        		            			if(i == 0){
	        		            				$(".ticket>ul>li>a>i").hide();
	        		            				html += '<i class="iconfont color-red kdl-right" style="display:block;"></i>';
	        		            				$("#randomCardUserId").val(dataContent.randomCardUserList[i].id);
	        		            				$("#discountPrice").val(dataContent.randomCardUserList[i].money);
	        		            				$("#isRandomCard").html("已使用");
	        		            			}else{
	        		            				html += '<i class="iconfont color-red kdl-right" style="display:none;"></i>';
	        		            			}
	        		            		html += '</a>'+
	        		            	'</li>';
        				}
    					ctrl.countPrice();
        				$("#randomCardList").html(html);
        			}else{
        				alert(data.content);
        				ctrl.countPrice();
        			}
        		},
        		error:function(data){
        			alert("系统正忙，请稍后重试！");
        		}
        	});
        },
        checkRandomCard : function(id,money,obj){
        	if(id == ''){
        		$("#isRandomCard").html("未使用");
        	}else{ 
        		$("#isRandomCard").html("已使用");
        	}
        	$(".ticket>ul>li>a>i").hide();
        	$("#randomCardList>li>a>i").hide();
        	$(obj).find("i").show();
        	$("#randomCardUserId").val(id);
        	$("#discountPrice").val(money);
        	var isPurse = $("#isPurse").val();
        	
        	if(isPurse != null){
        		var price=$("#price").val().trim();
            	var discountPrice = $("#discountPrice").val();
            	
            	var temp = price - discountPrice;
        		if(isPurse && isPurse == 'true'){
        			if(this.purse >=  temp){
                		$("#purse").val(temp);
                	}else{
                		$("#purse").val(this.purse);
                	}
        		}else{
        			$("#purse").val(0.0);
        		}
        	}
        	this.countPrice();
        },
        countPrice: function(){
        	var price=$("#price").val().trim();
        	var discountPrice = $("#discountPrice").val();
        	var isPurse = $("#isPurse").val();
        	if(price == "" || price < 0.01){
        		$("#randomCardUserId").val("");
        		$("#purse").val(0);
        		$("#discountPrice").val(0);
        		$("#totalPrice").val(0);
        		$("#randomCardUserSize").html("0");
        		$("#isRandomCard").html("未使用");
        		$("#payAmountTxt").html("0.00");
        		$("#payAmount").val(0);
        		return false;
        	}
        	price = price - discountPrice;
        	if(isPurse == "true" && this.purse >=  price){
        		$("#purse").val(price);
        	}else if(isPurse == "true"){
        		$("#purse").val(this.purse);
        	}
        	var purse = $("#purse").val();
        	var payAmount = price - purse;
        	payAmount = payAmount.toFixed(2);
        	$("#payAmountTxt").html(payAmount);
        	$("#payAmount").val(payAmount);
        },
        submitCall:function(data){
        	if(data.status == 1){
        		if(data.data.payPrice == 0.0){
        			GO("pay/paySuccess",{sn:data.data.sn});
        		}else{
        			GO("pay/cashierDesk",{sn:data.data.sn});
        		}
        	}else{
        		alert(data.errorMsg);
        	}
        },
        submitForm:function(){
        	var price=$("#totalPrice").val().trim();
        	if(price == null || price == ''){
        		alert("请输入金额！");
        		return false;
        	}
        	if(price < 0.01){
        		alert("请输入大于0.01元的金额！");
        		return false;
        	}
        	$("#transferForm").submit();
        }
    },
    /*支付结果*/
    "pay/payment":{
        _title:"支付结果",
        _footer:false,
        _datas:{
        	data:GET("bill/getBillInfo.shtml",{sn:PARAM("sn")},function(datas,ctrl){
        		//判断是否有数据
        		if(datas instanceof Error){
        			DO("error", datas);
        		}
        		return datas;
        	})
   	 	},
        _load:function(){
        	
        }
    },
    /*余额支付成功*/
    "pay/paySuccess":{
    	_title:"支付结果",
    	_footer:false,
    	 _template:{url:"view/pay/paySuccess.ejs"},
    	_load:function(){
    		//根据sn获取支付的详情
    		$.ajax({
        		url:"bill/getBillInfo.shtml",
        		async:true,
        		data:{sn:this._param.sn},
        		type:"get",
        		dataType:"json",
        		success:function(data){
        			if(data.status == 1){//请求成功
        				data = data.data;
        				$("#totalAmount").html(data.bill.totalAmount.toFixed(2)+"元");
        				$("#payAmount").html(data.bill.payAmount.toFixed(2)+"元");
        				if(data.bill.status == 'complete'){
        					$("#paySuccess").show();
        					$("#showTxt").html("您已支付成功,欢迎下次光临！");
        					if(data.bill.type == 'line'){//线下支付
        						$("#showBtn").html('查看账单');
        						$("#showBtn").attr("href","#pay/billDestil?sn="+data.bill.sn);
        					}else if(data.bill.type == 'order'){//线上订单支付
        						$("#showBtn").html('查看订单');
        						if(data.orderStatus == 'hasSpl'){
        							$("#showBtn").attr("href","#order/userOrders");
        						}else{
        							if(data.orderType=='geOrd'){
            							$("#showBtn").attr("href","#order/retailDetails?orderId="+data.bill.orderId);
            						}else{
            							$("#showBtn").attr("href","#order/serviceDetails?orderId="+data.bill.orderId);
            						}
        						}
        					}
        				}else if(data.bill.status == 'pePay'){
        					$("#payFail").show();
        					$("#showTxt").html("待支付");//<br/>由于网络存在一定误差，可能存在您已经在第三方平台支付成功，而本系统显示待支付，建议您尝试刷新页面查看是否支付成功！
        					if(data.bill.type == 'line'){//线下支付
        						$("#showBtn").html('查看账单');
        						$("#showBtn").attr("href","#pay/billDestil?sn="+data.bill.sn);
        					}else if(data.bill.type == 'order'){//线上订单支付
        						$("#showBtn").html('查看订单');
        						if(data.orderType=='geOrd'){
        							$("#showBtn").attr("href","#order/retailDetails?orderId="+data.bill.orderId);
        						}else{
        							$("#showBtn").attr("href","#order/serviceDetails?orderId="+data.bill.orderId);
        						}
        					}
        				}else if(data.bill.status == 'close'){
        					$("#payFail").show();
        					$("#showTxt").html("交易已关闭");
        					if(data.bill.type == 'line'){//线下支付
        						$("#showBtn").html('查看账单');
        						$("#showBtn").attr("href","#pay/billDestil?sn="+data.bill.sn);
        					}else if(data.bill.type == 'order'){//线上订单支付
        						$("#showBtn").html('查看订单');
        						if(data.orderType=='geOrd'){
        							$("#showBtn").attr("href","#order/retailDetails?orderId="+data.bill.orderId);
        						}else{
        							$("#showBtn").attr("href","#order/serviceDetails?orderId="+data.bill.orderId);
        						}
        					}
        				}
        			}else{
        				alert(data.errorMsg);
        			}
        		},
        		error:function(data){
        			
        		}
    		});
    	},
    	toShopping : function(){
    		GO("index");
    	}
    },
    /*账单*/
    "pay/bill":{
        _title:"账单",
        _footer:false,
        load:true,
        pageNum:1,
        pageSize:10,
        _load:function(){
        	var ctrl = this;
        	this.loadData(ctrl.pageNum,ctrl.pageSize);
        	
        	setREG("document_scroll", ctrl._name, function(){
                if($.getScrollBottom() < 3 && ctrl.load){
                	ctrl.pageNum++;
                	ctrl.loadData(ctrl.pageNum,ctrl.pageSize);
            	}
            });
        },
        loadData:function(pageNum,pageSize){
        	var ctrl= this;
        	$.ajax({
        		url:"bill/list.shtml",
        		async:true,
        		data:{pageNum:pageNum,pageSize:pageSize},
        		type:"get",
        		dataType:"json",
        		success:function(data){
        			if(data.status == 1){
        				var list = data.data.page.list;
        				var html = "";
        				if(list.length > 0){
        					$("#noData").hide();
        					for(var i=0;i< list.length;i++){
        						var typeTxt="";
        						var imgSrc = "";
        						if(list[i].type == 'consume'){
        							typeTxt="消费返现";
        							imgSrc = "./img/bill_fx@2x.png";
        						}else if(list[i].type == 'sell'){
        							typeTxt="销售佣金";
        							imgSrc = "./img/bill_sale@2x.png";
        						}else if(list[i].type == 'expand'){
        							typeTxt="推广佣金";
        							imgSrc = "./img/bill_extension@2x.png";
        						}else if(list[i].type == 'line'){
        							typeTxt="线下支付";
        							imgSrc = "./img/bill_line_pay@2x.png";
        						}else if(list[i].type == 'order'){
        							typeTxt="订单支付";
        							imgSrc = "./img/bill_order_pay@2x.png";
        						}else if(list[i].type == 'cash'){
        							typeTxt="提现";
        							imgSrc = "./img/bill_withdrawals@2x.png";
        						}else if(list[i].type == 'cashFai'){
        							typeTxt="提现退回";
        							imgSrc = "./img/bill_withdraw-back@2x.png";
        						}else if(list[i].type == 'cashFee'){
        							typeTxt="提现手续费";
        							imgSrc = "./img/bill_withdrawals@2x.png";
        						}else if(list[i].type == 'recommend'){
        							typeTxt = '推广赚钱';
        							imgSrc = "./img/bill_register@2x.png";
        						}
        						html += '<li>'+
					        				'<a href="javascript:GO(\'pay/billDestil\',{sn:\''+list[i].sn+'\'});">'+
					        					'<div class="pic"><img src="'+imgSrc+'"/></div>'+
					        					'<h5 class="color-gray6">'+typeTxt+'</h5>'+
						    		            '<p class="color-gray9 m-top10">'+list[i].createDate+'</p>'+
				        						'<span>';
						    		            if(list[i].type != 'line' && list[i].type != 'order' && list[i].type != 'cashFee' && list[i].type != 'cash'){
						    		            	html +='<p class="color-red h5">+'+list[i].totalAmount+'</p>';
						    		            }else{
						    		            	html +='<p class="color-red h5">'+-list[i].totalAmount+"</p>";
						    		            }
						    		            if(list[i].status == 'pePay'){
						    		            	html += '<p>待支付</p>';
						    		            }else if(list[i].status == 'complete'){
						    		            	html += '<p>已完成</p>';
						    		            }else if(list[i].status == 'close'){
						    		            	html += '<p>交易关闭</p>';
						    		            }
						    		            html += '</span>'+
					    		            '</a>'+
					    		        '</li>';
        					}
        				}else if(list.length == 0 && pageNum == 1){
        					$("#noData").show();
        				}
        				$("#dataList").append(html);
        				
        				if(list.length < 6){
        					ctrl.load = false;
        				}
        			}else{
        				alert(data.errorMsg);
        			}
        		}
        	});
        }
    },
    /*账单详情*/
    "pay/billDestil": {
        _title: "账单详情",
        _footer: false,
        _datas:{
        	data:GET("bill/detail.shtml",{sn:PARAM("sn")},function(datas,ctrl){
        		//判断是否有数据
        		if(datas instanceof Error){
        			DO("error", datas);
        		}
        		return datas;
        	})
        },
        _load: function () {
        	
        },
        cancleBill : function(sn){
        	if(sn == null || sn == ''){
        		return false;
        	}
        	$.ajax({
        		url:"bill/cancleBill.shtml",
        		data:{sn:sn},
        		type:"get",
        		dataType:"json",
        		async:false,
        		success:function(data){
        			if(data.status == 1){
        				if(data.data.flag){
        					alert(data.data.content);
        				}
        				location.reload();
        			}else if(data.status == 0){
        				alert(data.errorMsg);
        			}
        		},
        		error:function(data){
        			
        		}
        	});
        }
    },
    
    /****************** 网站工具插件购买 start ****************************************************/
    /** 收银台过渡页 */
    "pay/transitionCashierDesk":{
    	/**_title:"收银台",*/
        _footer:false,
        _load:function(){
        	///<summary>检查是否支持微信支付</summary>
            var ua = window.navigator.userAgent.toLowerCase();
            var reg = /MicroMessenger\/[5-9]/i;
            if(reg.test(ua)){//如果是在微信浏览器
//            	var url = "http%3A%2F%2Fwyz52155.imwork.net%2Fkdl_wap%2Fcommon%2FpayToolOrder.shtml%3FtoolOrderId%3D"+this._param.toolOrderId;
            	var url = "http%3A%2F%2Fwww.kaidianlaa.com%2Fcommon%2FpayToolOrder.shtml%3FtoolOrderId%3D"+this._param.toolOrderId;
            	window.location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx05113a272dd175e8&redirect_uri="+url+"&response_type=code&scope=snsapi_base#wechat_redirect";
            }else{
            	window.location.href="common/payToolOrder.shtml?toolOrderId="+this._param.toolOrderId;
            }
        }
    },
    /*收银台*/
    "pay/toolOrderCashierDesk" : {
    	_title:"收银台",
    	_footer:false,
    	_datas: GET("toolOrder/toolOrderToPay.shtml",{toolOrderId:PARAM("toolOrderId",null)},function(data){
    		return data;
        }),
        openId:null,
    	_load: function(){
    		var ctrl= this;
        	ctrl.openId = $.getCookie('openId');
    	},
    	toPay : function(sn){
    		if(sn == null || sn == ""){
    			alert("无效的支付方式!");
    			return false;
    		}
    		var ctrl = this;
    		var ua = window.navigator.userAgent.toLowerCase();
    		var reg = /MicroMessenger\/[5-9]/i;
    		if(sn == "weixinPaymentPlugin"){
	            if(!reg.test(ua)){//不是微信浏览器
	            	alert("浏览器端暂不支持微信支付，请前往开店啦app客户端或微信客户端进行支付！");
	            	return false;
	            }else{
	            	ctrl.paying(sn,reg,ua); //支付
	            }
    		}else if(sn == "businessBailPaymentPlugin"){
    			if(!this._datas.purseEnough){
    				alert("您的结算账户余额不足,请尝试其它支付方式");
    				return false;
    			}
    			alert("确认使用结算账户进行支付？",function(flag){
    				if(flag){
    					ctrl.paying(sn,reg,ua); //支付
    				}
    			},true);
    		}else if(sn == "alipayPaymentPlugin"){
    			alert("浏览器端暂不支持支付宝支付，请前往开店啦app客户端进行支付！");
            	return false;
    		}
		},
		back:function(){
			alert("下单后6小时内未支付成功，订单将被取消！",function(flag){
				if(flag){
					//window.location.href= "#activity/pushPurchase?type="+$("#type").val();
					window.location.href = "#business/offLineBill";
				}
			},true);
			$(".alertBox ul li:first a").html("继续支付");
			$(".alertBox ul li:last a").html("确认离开");
		},
		//进行支付
		paying : function(sn,reg,ua){
			var ctrl = this;
			$.ajax({
				url:"toolOrder/orderPay.shtml",
				data:{
					toolOrderId:ctrl._param.toolOrderId,
					paymentPluginSn:sn,
					openId:ctrl.openId
				},
				async:false,
				dataType:"json",
				type:"post",
				success:function(data){
					if(data.status == 1){
						data = data.data;
						var totalPrice = data.totalPrice;
						var times= data.times;
						var toolOrderSn = data.toolOrderSn;
						if(reg.test(ua) && "weixinPaymentPlugin" == sn){//是在微信浏览器中
							var result = data.resultData;
							
							var para = {
									"appId": result.appId, //公众号名称，由商户传入
									"timeStamp": result.timeStamp, //时间戳
									"nonceStr": result.nonceStr, //随机串
									"package": result.package, //扩展包   
									"signType": result.signType, //微信签名算法：MD5
									"paySign": result.paySign //微信签名
							};
							WeixinJSBridge.invoke("getBrandWCPayRequest", para, function (res) {
								//alert(res.err_msg);
								if (res.err_msg == "get_brand_wcpay_request:ok") {
									alert("支付成功！");
									GO("activity/payment",{toolOrderSn:toolOrderSn,totalPrice:totalPrice,times:times});
								} else if (res.err_msg == "get_brand_wcpay_request:cancel") {
									alert("您已经取消支付！");
									GO("pay/toolOrderCashierDesk",{toolOrderId:ctrl._param.toolOrderId});
								} else {
									alert("支付失败，请重试！");
									GO("pay/toolOrderCashierDesk",{toolOrderId:ctrl._param.toolOrderId});
								}
							});
						}else if("businessBailPaymentPlugin" == sn){
							GO("activity/payment",{toolOrderSn:toolOrderSn,totalPrice:totalPrice,times:times});
						}
					}else{
						alert(data.errorMsg);
						return false;
					}
				},
				error:function(data){
					alert("亲，系统错误请您稍后再试！");
				}
			});
		}
		
    }
    /****************** 网站工具插件购买 end ****************************************************/
});
})();