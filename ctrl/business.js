(function(){
	/*公用变量和方法*/
	
FORMAT({

    /** 我是商家 */
    "business/merchant": {
        _title:"我是商家",
        _footer:false,
        _datas:GET("business/toBusinessInfo.shtml",function(datas,ctrl){
        	if(datas instanceof Error){
        		DO("error", datas);
        		ctrl._goShow=false;
        	}
        	if(datas.businessStatus == null){ //进入商家注册页面
        		//DO("ucenter/applyBusiness"); //旧商家申请页面
        		DO("business/busCreate");//新商家申请页面
        		ctrl._goShow=false;
        		return;
        	}
        	if(datas.businessStatus == "staff"){ //进入员工页面
        		DO("shopPersonnel/staffPlatform");
        		ctrl._goShow=false;
        		return;
        	}
        	return datas;
        }),
        _load: function(){
        }
    },
   
    /** 商家认证未通过详情 */
    "business/certificationDetails": {
        _title: "商家认证详情",
        _footer: false,
        _links:{
        	"js/extra.js":"js"
        },
        _datas:GET("business/certificationDetails.shtml",function(datas,ctrl){
        	return datas;
        }),
        _load: function () {
        },
        _events:{
        	".uploadPic":{
        		click:function(){
        			var btn=this;
        			$.clipImage({
            			call:function(url){
            				$(btn).find(".pic img").attr("src",Config.imgPre + url);
            				$.post("business/setLicenseImage.shtml",{
            					licenseImage : url
            				},function(data){
    		        			if(data.status == "0"){
    		        				alert(data.errorMsg);
    		        			}
        		        	});
            			}
            		});
        		}
        	}
        },
        submitCall : function(response,params){
        	if(response.status=="1"){
        		GO("business/merchant");
        	}else{
        		alert(response.errorMsg);
        	}
        	
		}
    },
   
    /** 相关信息认证 */
    "business/relevantInformation": {
        _title: "店铺信息认证",
        _links:{
        	"js/loadArea.js":"js"
        },
        _footer:false,
        _datas:GET("business/toRelevantInfo.shtml",function(datas,ctrl){
        	return datas;
        }),
        _show:function(){
        	//获取从行业分类页面选择的分类
            $("#industryCategoryId").val(window.selectIndustryCategoryId);
        	$("#industryCategoryName").val(window.selectIndustryCategoryName);
        },
        _load: function () {
            loadArea.showArea(_datas.area);
            //校验
            $("form").each(function(){
    			$(this).validate({
    	            rules: {
    	            	shopContacts:"required",
    	            	industryCategoryId:"required",
    	            	areaId:"required",
    	            	shopPhone:{
		                	required: true,
		                	pattern: /^1[3|4|5|7|8]\d{9}$/
		                },
		                shopAddress : {
							required : true,
							remote: {
								url: Config.basePath+"shop/checkShopAddress.shtml?shopId="+$("#shopId").val(),
								data:{
									shopAreaId : function(){
										return $("#selarea").val();
									},
									shopAddress:function(){
										return $("#shopAddress").val();
									}
								},
								cache: false
							}
						}
    	            },
    	            messages:{
    	            	businessName:"商家名称必填",
    	            	industryCategoryId:"商家行业必填",
    	            	areaId:"商家所属区域必填",
    	            	shopAddress:"详细地址必填",
    	            	shopPhone:{
    	           		 	required:"商家电话必填",
    	           		 	pattern:"商家电话格式不正确"
    	                },
    	                shopAddress: {
    						remote: "当前店铺地址已被注册，请核对店铺地址或再具体店铺地址"
    					}
    	            }
    	        });
    		});
        },
        //清除数据
        clear:function(){
        	window.selectIndustryCategoryId = null;
        	window.selectIndustryCategoryName = null;
        	return true;
        },
        submitCall : function(response,params){
        	alert(response.errorMsg);
        	if(response.status=="1"){
        		GO("business/merchant");
        	}
        	
		}
    },
    /*商家行业选择*/
    "business/industrySelection": {
        _title:"商家行业选择",
        _datas:GET("category/loadIndustryCategory.shtml",{grade:0},function(data){
        	return data;
        }),
        _footer:false,
        _load: function(){
            /*分类列表的*/
            $(document).ready(function(){
                var sum=$(window).height();
                var nav=$('.searchBox').height();
                var num=sum-(nav*3);
                $('.selection').css("height",num);
            });
            //一级分类点击事件
            $(".selection>ul>li").click(function(){
            	$(this).addClass("cur").siblings("li").removeClass("cur");
            	loadIndustryCategory(1,$(this).attr("index"));
            });
            //清空搜索内容
            $(".searchBox>span").click(function(){
            	$(this).closest("div").find("input").val("");
            	$(".searchBox>input").keyup();
            });
            //模糊搜索
            $(".searchBox>input").keyup(function(){
            	var content = this.value;
            	if(content.trim() != ""){
            		$.get("category/searchIndustryCategory.shtml",{key:content},function(data){
            			if(data.status == "1"){//成功
            				$(".selection").hide();
            				$("#searchResult").empty();
            				var result = data.data.industryCategorys;
            				if(result.length == 0){//结果为空
            					$("#searchResult").hide();
                				$("#warn").show();
            				}else{
            					$("#searchResult").show();
            					$("#warn").hide();
            					$.each(data.data.industryCategorys,function(i,o){
            						$("#searchResult").append('<li index="'+o.id+'" onclick="this.ctrl.setIndustryCategoryIdAndName(this)"><a href="javascript:;">'+o.name+'</a></li>')
            					});
            				}
            			}else{//失败
            				alert("系统正忙，稍后重试");
            			}
            		});
            	}else{
            		$(".selection").show();
            		$("#searchResult").hide();
            		$("#warn").hide();
            	}
            })
            
            //加载指定级别和父类的行业分类数据
            function loadIndustryCategory(grade,parentId){
            	$.get("category/loadIndustryCategory.shtml",{grade:grade,parentId:parentId},function(data){
            		if(data.status == "1"){//成功
            			$("#secondCategory").empty();
            			$.each(data.data.industryCategorys,function(i,o){
            				$("#secondCategory").append('<li index="'+o.id+'" onclick="this.ctrl.setIndustryCategoryIdAndName(this)"><a href="javascript:;">'+o.name+'</a></li>');
            			});
            		}else{//失败
            			alert("系统正忙，稍后重试");
            		}
            		
            	});
            }
        },
        //二级分类点击事件
        setIndustryCategoryIdAndName:function setIndustryCategoryIdAndName(obj){
        	$(obj).addClass("cur").siblings("li").removeClass("cur");
        	window.selectIndustryCategoryId = $(obj).attr("index");
        	window.selectIndustryCategoryName = $(obj).find("a").html();
        	//GO("business/relevantInformation");
        	history.go(-1);
        }
    },
    
    "business/offLineBill" : {
    	 _title:"商家账单",
         _footer:false,
         pageNum:1,
         pageSize:15,
         defaultPageNum:1,
         defaultPageSize:15,
         load:true,
         showBillSingle:false,
         showPushSingle:false,
         showNewsSingle:false,
         serviceDate : null,
         _load: function(){
	    	  var ctrl = this;
	    	  $.ajax({
				url:"common/getServiceDate.shtml",
				data:null,
				async:false,
				dataType:"json",
				type:"post",
				success:function(data){
					if(data.status==0){
						alert(data.errorMsg);
						return false;
					}else{
						ctrl.serviceDate = data.data.dateTime;
					}
				},
				error:function(data){
					alert("亲，系统错误请您稍后再试！");
				}
			 });
        	 $(".nav-wrap-right>a").click(function(){
        		 if($(".theme-popover-mask").css("display")=="block"){
        			 $(".theme-popover-mask").hide(500);
            		 $(".polpu").hide(300);
        		 }else{
        			 $(".theme-popover-mask").show(300);
        			 $(".polpu").show(500);
        		 }
        	 });
        	 $(".theme-popover-mask").click(function(){
        		 $(".theme-popover-mask").hide(500);
        		 $(".polpu").hide(300);
        	 });
        	 $(".polpu>ul>li").click(function(){
        		 $(this).addClass("cur").siblings().removeClass("cur");
//        		 console.log($(".polpu>ul>li.cur>a").html());
        	 });
        	 $("#selBtn").click(function(){
        		 var curType = $(".polpu>ul>li.cur").attr("name");
        		 var isLoad = false;
        		 if(curType=="line"){
        			 $("#curseltype").html("线下支付");
        			 if(!ctrl.showBillSingle){
        				 isLoad = true;
        				 ctrl.showBillSingle=true;
        				 ctrl.showPushSingle=false;
        				 ctrl.showNewsSingle=false;
        			 }
        		 }else if(curType=="cityNews"){
        			 $("#curseltype").html("同城商讯");
        			 if(!ctrl.showNewsSingle){
        				 isLoad = true;
        				 ctrl.showBillSingle=false;
        				 ctrl.showPushSingle=false;
        				 ctrl.showNewsSingle=true;
        			 }
        		 }else if(curType=="businessPush"){
        			 $("#curseltype").html("广告推送");
        			 if(!ctrl.showPushSingle){
        				 isLoad = true;
        				 ctrl.showBillSingle=false;
        				 ctrl.showPushSingle=true;
        				 ctrl.showNewsSingle=false;
        			 }
        		 }else{
        			 $("#curseltype").html("商家账单");
        			 if(ctrl.showBillSingle || ctrl.showPushSingle || ctrl.showNewsSingle){
        				 isLoad = true;
        				 ctrl.showBillSingle=false;
        				 ctrl.showPushSingle=false;
        				 ctrl.showNewsSingle=false;
        			 }
        		 }
        		 if(isLoad){
        			 $("#billContent").empty();
        			 ctrl.pageNum=ctrl.defaultPageNum,
        			 ctrl.pageSize=ctrl.defaultPageSize,
    				 ctrl.load = false;
    				 ctrl.loadData();
    				 
        		 }
        		 $(".theme-popover-mask").hide(500);
        		 $(".polpu").hide(300);
        	 })
        	 
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
          		url:"business/businessBills.shtml",
          		async:true,
          		data:{pageNum:ctrl.pageNum,pageSize:ctrl.pageSize,showBillSingle:ctrl.showBillSingle,showPushSingle:ctrl.showPushSingle,showNewsSingle:ctrl.showNewsSingle},
          		type:"get",
          		dataType:"json",
          		success:function(data){
          			var curYearMonth = $.Date(ctrl.serviceDate).format("yyyy-MM");
//          			console.log(data.data.businessBills);
          			if(data.status == 1){
          				if(ctrl.pageNum==1){
          					var todayAmount = data.data.todayAmount;
          					if(todayAmount==null){
          						todayAmount = 0.00;
          					}
          					$("#toBillAmount").html(todayAmount.toFixed(2));
          				}
          				var list = data.data.businessBills;
          				var html = "";
          				if(list.length > 0){
          					ctrl.load = true;
          					$("#noData").hide();
          					for(var i=0;i< list.length;i++){
          						var createDate = $.Date(list[i].createDate.time);
          						var billYearMonth = createDate.format("yyyy-MM");
          						var isCurMonth = billYearMonth==curYearMonth;
          						if($("#billContent>ul[name='"+billYearMonth+"']").length==0){
          							var yearMonth = createDate.format("yyyy年MM月");
          							if(isCurMonth){
          								yearMonth = "本月";
          							}
          							var tempHtml ="<h6>"+yearMonth+"</h6>"
												 +"<ul name='"+billYearMonth+"'>"
												 +"</ul>"
          							$("#billContent").append(tempHtml);
          						}
          						var imgSrc = "";
          						if(list[i].type=="bill"){
          							imgSrc = "./img/billlinepay@2x.png";
          						}else if(list[i].type=="businessPush"){
          							imgSrc = "./img/billpush@2x.png";
          						}else if(list[i].type=="cityNews"){
          							imgSrc = "./img/billcity@2x.png";
          						}
          						
          						var statusColor = "";
          						if(list[i].status=="pePay"){
          							statusColor = "style='color:red'";
          						}
          						var username = "";
          						if(list[i].type=="bill"){
          							username="<span class='color-gray9' style='float:right;margin-right: .15rem;'>"+list[i].username+"</span>";
          						}
          						var billInfo ="<li onclick=\"this.ctrl.toDetails('"+list[i].sn+"',\'"+list[i].type+"\')\">"
										     +"		<a href='javascript:'>"
          									 +"			<span class='first'>"
          									 +"					<p>"+createDate.format('MM-dd')+"</p>"
          									 +"				<p>"+createDate.format('hh:mm')+"</p>"
          									 +"			</span>"
          									 +"			<div class='pic'>"
          									 +" 				<img src='"+imgSrc+"'/>"
      										 +"			</div>"
      										 +"			<div>"
      										 +"				<p class='color-gray3'>"+list[i].price.toFixed(2)+"<span class='last'"+statusColor+">"+Config.message.busbill.status[list[i].status]+"</span></p>"
      										 +"				<p class='color-gray6'>"+Config.message.busbill.type[list[i].type]+username+"</p>"
      										 +"			</div>"
      										 +"			<div></div>"
      										 +"		</a>"
      										 +"	</li>"	
								$("#billContent>ul[name='"+billYearMonth+"']").append(billInfo);			 
          					}
          				}else if(list.length == 0 && ctrl.pageNum == 1){
          					if($("#noData").length>0){
          						$("#noData").show();
          					}else{
          						$(".warn").html(REND("include/empty",{icon:"&#xe66f;",tip:"sorry,还没有账单哦~",price:"2.5",display:"block",emptyId:"noData",paddingbottom:"1"}))
          					}
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
          toDetails : function(sn,type){
        	  if(sn=="" || sn == null || type=="" || type==null){
        		  alert("网络不给力!");
        		  return false;
        	  }
        	  if(type=="bill"){
        		  GO("business/billDestil",{sn:sn});
        	  }else{
        		  GO("business/toolOrderDetails",{sn:sn});
        	  }
          }
    },
    /*账单详情*/
    "business/billDestil": {
        _title: "账单详情",
        _footer: false,
        _datas:{
        	data:GET("business/billDetail.shtml",{sn:PARAM("sn")},function(datas,ctrl){
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
        			}else if(data.status == 0){
        				alert(data.errorMsg);
        			}
        		},
        		error:function(data){
        			
        		}
        	});
        }
    },
    /*工具订单详情*/
    "business/toolOrderDetails": {
    	_title: "账单详情",
    	_footer: false,
    	_datas:{
    		data:GET("business/toolOrderDetail.shtml",{sn:PARAM("sn")},function(datas,ctrl){
    			//判断是否有数据
    			if(datas instanceof Error){
    				DO("error", datas);
    			}
    			return datas;
    		})
    	},
    	_load: function () {
    	},
    	tocancel : function(toolOrderId){
    		alert("确定取消交易？",true,function(flag){
    			if(flag){
					$.ajax({
						url:"toolOrder/cancel.shtml",
						data:{toolOrderId:toolOrderId},
						async:false,
						dataType:"json",
						type:"post",
						success:function(data){
							if(data.status==0){
								alert(data.errorMsg);
								return false;
							}else{
								alert(null,null,"账单已取消!",2000);
								$(".btns").remove();
								$("#toolOrderStatus").html("已取消");
								$("#offTime").remove();
							}
						},
						error:function(data){
							alert("亲，系统错误请您稍后再试！");
						}
					});
    			}
    		});
    	},
    	topay : function(totalOrderId){
    		GO("pay/toolOrderCashierDesk",{toolOrderId:totalOrderId});
    	}
    },
    
    /**商家财富中心*/
    "business/businessCash": {
        _title: "商家财富中心",
        _footer: false,
        _datas:{
        	data:GET("business/toBusinessCash.shtml",function(datas){
        		//判断是否有数据
        		if(datas instanceof Error){
        			DO("error", datas);
        		}
        		return datas;
        	})
        },
        _load: function () {
        	//提现按钮
        	$("#toCashBtn").click(function(){
        		if(!_datas.data.hasBankCard){
        			alert("您还未绑定商家银行卡，请于管理后台绑定"); 
        			return false;
        		}
        		if(_datas.data.bankCardStatus != "pass"){
        			alert("银行卡正在审核，请耐心等待!");
        			return false;
        		}
        		if(_datas.data.businessPurse<=0){
        			alert("您还没有结算单可提现，加油哦~");
        			return false;
        		}
        		GO("business/withdraw");
        	});
        },
    },
    
    /** 商家提现 */
    "business/withdraw": {
        _title:"提现",
        _footer:false,
        _datas:{
        	bankCard:GET("bankCard/getBcdInfoByPass.shtml",{
        		bankCardType : "business"
        	},function(data){
        		return data.bankCard;
        	})
        },
        _load: function(){
        	this._dom.find("#form").validate({
				rules: {
					cashSums: { 
						number:true,
						min:0
					}
				}
        	});
            $("#Confirm").click(function(){
                //$(".Prompt-one").show(500);
                if(!$("#cashSums").val() || $("#cashSums").val()==0){ //提现金额不可以为空
    				alert("亲，请输入提现金额");
                }else if($("#cashSums").val().indexOf(".") != -1 && $("#cashSums").val().substring($("#cashSums").val().indexOf(".")+1).length > 2){
                	alert("亲,您输入正确的金额,金额只精确到分哦!");
                }else{
    				$("#form").submit();
    			}
            }),
            //获取商家可提现金额
            $.get("cash/getBusinessAmount.shtml",function(datas){
        		$("#businessPurse").text(datas.data.businessPurse.toFixed(2));
        		$("#ableCashAmount").text(datas.data.ableCashAmount.toFixed(2));
            })
        },
        submitCall : function(response,params){
        	if(response.status=="1"){
        		GO("business/businessCashNew");
        	}else{
    			alert(response.errorMsg);
        	}
		}
    },
    /**提现历史*/
    "business/withdrawHistory": {
        _title:"提现历史",
        _footer:false,
        pageNum:1,
        pageSize:10,
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
        	$.get("cash/getCashHistory.shtml",{
        		pageNum:ctrl.pageNum,
        		pageSize:ctrl.pageSize,
        		cashType:"business"
        	},function(data){
        		var cashList = "";
        		if(data.data && data.data.cashList){
        			cashList = data.data.cashList;
        		}else{
        			return false;
        		}
        		if(ctrl.pageNum == 1 && cashList.length == 0){
        			$(".warn").html(REND("include/empty",{icon:"&#xe690;",tip:"sorry,您还没有体现记录哦~",price:"1",display:"block",paddingbottom:"1"}));
        			return false;
        		}else{
        			$(".warn").html("");
        		}
        		if(cashList.length < ctrl.pageSize){
        			ctrl.flag = false;
        		}
        		var temp = '';
        		for(var i=0;i<cashList.length;i++){
        			var status = '';
        			if(cashList[i].cashStatus == "pending"){
        				status = "待审核";
        			}else if(cashList[i].cashStatus == "pass"){
        				status = "银行处理中";
        			}else if(cashList[i].cashStatus == "noPass" || cashList[i].cashStatus == "failure"){
        				status = "交易失败";
        			}else if(cashList[i].cashStatus == "complete"){
        				status = "交易完成";
        			}
        			temp += '<li onclick="GO(\'ucenter/withdrawDetails\',{id:'+cashList[i].id+'})">'+
		        	            '<h5 class="color-gray6">提现<span class="kdl-right color-red">-'+cashList[i].cashSums.toFixed(2)+'</span></h5>'+
		        	            '<p class="m-top10 color-gray9">'+cashList[i].createDate+'<span class="kdl-right color-gray6">'+status+' ></span></p>'+
		        	         '</li>';
        		}
        		$(".content>ul").append(temp);
        	})
        }
    },
    /** 商家财富中心 */
	"business/businessCashNew" : {
		_title : "商家财富中心",
		_footer : false,
		_datas:{
        	data:GET("business/toBusinessCash.shtml",function(datas){
        		//判断是否有数据
        		if(datas instanceof Error){
        			DO("error", datas);
        		}
        		return datas;
        	})
        },
		_load : function() {
			//展开详情
			$(".conList1>div").click(function(){
				if($(".conList1>ul").is(":hidden")){
				    $(".conList1>ul").slideDown(100);
				    $(".conList1>div>i").addClass("cur");
				}else{
				    $(".conList1>ul").slideUp(100);
				    $(".conList1>div>i").removeClass("cur");
				};
			})
			$(".conList2>div").click(function(){
				if($(".conList2>ul").is(":hidden")){
				    $(".conList2>ul").slideDown(100);
				    $(".conList2>div>i").addClass("cur");
				}else{
				    $(".conList2>ul").slideUp(100);
				    $(".conList2>div>i").removeClass("cur");
				};
			});
			
			//提现按钮
        	$("#toCashBtn").click(function(){
        		if(!_datas.data.hasBankCard){
        			alert("您还未绑定商家银行卡，请于管理后台绑定"); 
        			return false;
        		}
        		if(_datas.data.bankCardStatus != "pass"){
        			alert("银行卡正在审核，请耐心等待!");
        			return false;
        		}
        		if(_datas.data.businessPurse<=0){
        			alert("您还没有结算单可提现，加油哦~");
        			return false;
        		}
        		GO("business/withdraw");
        	});
		},
	},
	/** 数据统计 */
	"business/dataStatistics" : {
		_links : {
			"plugin/echarts.common.min.js" : "js"
		},
		_title : "数据统计",
		_footer : false,
		_datas:{
			sum:GET("business/busStatistics.shtml"),
        	orderData:GET("business/orderStatistics.shtml?days=90"),
        	billData:GET("business/billStatistics.shtml?days=90"),
        	vipData:GET("business/getNewVipCount.shtml?days=90")
		},
		_load : function() {
			var ctrl=this;
			ctrl.renderCharts();
			$(".content>section").css("min-height",$(window).height()-$("header").outerHeight(true)-$(".content .con-hd").outerHeight(true)-$(".content .time").outerHeight(true));
			$(".con-hd>ul>li").eq(0).click();
		},
		renderCharts:function(){
			var ctrl=this,$hidden=$(".content>section:hidden").show();
			$(".order.select,.bill.select").each(function(){
				$(this).find("ul>li").eq(0).click();
			});
			$(".sumAmount").html((ctrl.orderChart()+ctrl.billChart()).toFixed(2));
			$(".sumVip").html(ctrl.vipChart());
			$hidden.hide();
		},
		orderChart:function(){
			var ctrl=this,flag=$(".order.select>span").html().indexOf("额")>0;
			return ctrl.initChart($(".orderTrade")[0],ctrl._datas.orderData["order"+(flag?"Amount":"Count")],flag?"元":"笔");
		},
		billChart:function(){
			var ctrl=this,flag=$(".bill.select>span").html().indexOf("额")>0;
			return ctrl.initChart($(".offlineTrade")[0],ctrl._datas.billData["bill"+(flag?"Amount":"Count")],flag?"元":"笔");
		},
		vipChart:function(){
			var ctrl=this;
			return ctrl.initChart($(".peopleAccount")[0],ctrl._datas.vipData.newVipMap,"名");
		},
		initChart:function(dom,data,yName){
			var xCount=0,yCount=0,count=0,days=parseInt($(".time.select>.bar>span").html(),10),sum=0;
			$.map(data,function (v,k) {
            	count++;
            });
			echarts.init(dom,undefined,{width:"auto",height:"auto"}).setOption({
		        tooltip: {
		            trigger: 'axis'
		        },
		        legend: {
		        	left: '-200%'
		        },
		        xAxis: {
		            data: $.map(data,function (v,k) {
		            	if(++xCount>(count-days))return k.split("-")[1]+"月"+k.split("-")[2]+"日";
		            })
		        },
		        yAxis: {
		        	name:yName=="元"?"成交金额(元)":yName=="笔"?"成交笔数(笔)":yName=="名"?"会员人数(人)":"",
		        	nameLocation:"end",
		        	nameGap:8,
		            splitLine: {
		                show: true
		            }
		        },
		        series: {
		            type: 'line',
		            data: $.map(data,function (v,k) {
		            	if(++yCount>(count-days)){
		            		sum=sum+v;
		            		return (yName.indexOf("元")> -1)?v.toFixed(2):v;
		            	}
		            })
		        },
		        grid:{
		        	left:"5%",
		        	containLabel:true
		        },
		        tooltip:{
		        	trigger:"axis",
		        	formatter: ' <font style="font-size:.28rem;">{c}</font>'+(yName||'')+' <br><font style="font-size:.24rem;color:skyblue;">{b}</font> '
		        }
		    });
			return sum;
		},
		timeHide:function(){
			$(".content .time ul").hide();
			$(".content>section").loadingWrapCancel();
		},
		_events:{
			".content .time .bar,.content .time .bar *":function(){
				$(this).closest(".time").find("ul").toggle();
				if($(this).closest(".time").find("ul").is(":visible")){
					$(".content>section").loadingWrap("none","#666");
				}else{
					this.ctrl.timeHide();
				}
			},
			".select span,.select em":function(){
				$(this).closest(".select").find("ul").toggle();
			},
			".select ul>li":function(){
				var ctrl=this.ctrl;
				$(this).closest("ul").hide().closest(".select").find("span").text($(this).text());
				if($(this).closest(".select").hasClass("time")){
					ctrl.renderCharts();
					ctrl.timeHide();
				}else{
					var $select=$(this).closest(".select");
					if($select.hasClass("order")){
						ctrl.orderChart();
					}else if($select.hasClass("bill")){
						ctrl.billChart();
					}
				}
			},
			".content .loadingWrap":function(){
				this.ctrl.timeHide();
			},
			".con-hd>ul>li":function(){
				var last=$(".con-hd>ul>li.cur").index(),i;
				$(".content>section").hide().eq(i=$(this).siblings().removeClass("cur").end().addClass("cur").index()).show ();
				if(i==0){
					$(".content .time").hide();
				}else{
					$(".content .time").show();
				}
				this.ctrl.timeHide();
				if(i!=last){
					$("body").scrollTop(0);
				}
			}
		}
	},
	/** 创建店铺实拍 */
	"business/shopImgCreate" : {
		_title : "店铺实拍",
		_footer : false,
		_links : {
			"js/extra.js" : "js"
		},
		_show:function(){
			var ctrl=this;
			var param=ctrl._param;
    		var $dom=ctrl._dom;
    		if(param.photoFace)ctrl.setImage($dom.find(".photoFace .upload"),param.photoFace);
			$dom.find(".photoInner .upload").each(function(i){
				ctrl.setImage($(this),param.photoInner?param.photoInner[i]:"");
			});
			ctrl.imgCheck();
		},
		//检查店铺实拍是否上传,返回已上传的参数
		imgCheck:function(){
			var $submit=this._dom.find(".btn-block");
			var json={};
			var photoFace=$(".photoFace .uploadImgUrl").val();
			$(".photoFace em").text(1);
			json.photoFace=photoFace;
			json.photoInner=[];
			$(".photoInner .uploadImgUrl").each(function(){
				var value=$(this).val();
				if(value!="" && value!=null){
					json.photoInner.push(value);
					$(this).closest("li").show();
				}else{
					$(this).closest("ul").append($(this).closest("li").hide().remove());
				}
			});
			$(".photoInner ul>li:hidden").eq(0).show();
			$(".photoInner em").text(json.photoInner.length||0);
			if(photoFace=="" || photoFace==null){
				$(".photoFace em").text(0);
				$submit.addClass("disabled");
				return null;
			}
			if(json.photoInner.length>0){
				$submit.removeClass("disabled");
				return json;
			}else{
				$submit.addClass("disabled");
				return null;
			}
		},
		//设置实拍 $btn:当前上传按钮；url:图片地址
		setImage:function($btn,url){
			if(url!=null && url!=""){ //上传成功
				$btn.css("border","0").siblings(".uploadImgUrl").val(url);
				$btn.find(".photo-area").html("").css({"background-image":"url("+Config.imgPre+url+")"});
				$btn.siblings(".kdl_cose").show();
			}else{
				$btn.find(".photo-area").html("&#xe612;").css({"background-image":"none"});
			}
		},
        _events:{
        	//上传图片
        	".upload":function(){
        		var $this=$(this);
    			$.clipImage({
    				width:"6.4rem",
    				height:"4.6rem",
        			call:function(url){
        				$this[0].ctrl.setImage($this,url);
        				$this[0].ctrl.imgCheck();
        			}
        		});
        	},
        	//删除已上传图片
        	".kdl_cose":function(){
        		var $this=$(this).hide();
        		$this.siblings(".uploadImgUrl").val("");
				$this.siblings(".upload").find(".photo-area").html("&#xe612;").css({"background-image":"none"});
        		$this.siblings(".frontispiece .upload").css("border","1px solid #e5e5e5");
				$this[0].ctrl.imgCheck();
        	},
        	//确认上传
        	".btn-block":function(){
        		var $this=$(this);
        		if($this.hasClass("disabled"))return;
        		var json=$this[0].ctrl.imgCheck();
        		DO("shop/shopCreate",json);
        	}
        }
	},
	/*商家信息*/
	"business/busCreate" : {
		_title : "商家信息",
		_footer : false,
		_container : ".third_container",
		_relateCtrl : ["shop/shopCreate","business/shopImgCreate","business/industrySelection"],
		_load : function() {
			$(".photoSubmit").html("下一步");
			if(this._param.flag == "update"){ //重新认证商家信息
				$(".photoSubmit").html("提交");
				$("#simplePhotoUrl").attr("src",Config.imgPre+this._param.busLicenseImg); //回显原证件照
				$(".photo-area").css("background-image","url("+Config.imgPre+this._param.busLicenseImg+")"); //回显原证件照
			}
		},
		_events:{
			//提交商家营业执照
        	".photoSubmit":{
        		click:function(){
        			//是否上传成功
        			var license=$(".uploadImgUrl").attr("src") && $(".uploadImgUrl").attr("src").replace(Config.imgPre,"");
        			if(license!=null){
        				if(this.ctrl._param.flag == "update"){ //仅更新商家证件照
        					$.post(Config.basePath+"/business/setLicenseImage.shtml",{
        						licenseImage : license
        					},function(datas){
        						if(datas.status == 1){
        							GO("business/merchant");
        							return;
        						}
        						alert(datas.errorMsg);
        					});
	        			}else{ //创建商家
	        				GO("shop/shopCreate",{licenseImageUrl:license});
	        			}
        			}else{
        				alert("请点击相机图标上传营业执照。");
        			}
        		}
        	}
        }
	},
	/*商家认证审核进度*/
	"business/reviewProgress" : {
		_title : "审核进度",
		_footer : false,
		_load : function() {
			
		}
		
	}
	

	
});

})();