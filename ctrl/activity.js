(function(){
	/*公用变量和方法*/


FORMAT({
	/*广告推送*/
    "activity/pushAd": {
        _title:"广告推送",
        _footer : false,
        pageNum:1,
        pageSize:6,
        flag:true,
        _datas: GET("activity/pushCountItem.shtml",function(data){
    		return data;
        }),
        _load: function(){
        	var ctrl = this;
        	 /*完成编辑切换*/
            $(".nav-wrap-right a:first-child").click(function(){
                $(this).toggleState({innerHTML:"完成"},{innerHTML:"编辑"})
                if($(this).text() == "完成"){
                	$(".footers").hide();
                	$(".con-list>ul>li>i").show();
                	ctrl.toUpdateDelBtn();
                }else{
                	$(".footers").show();
                	$(".con-list>ul>li>i").hide();
                }

            })
            $(".footers").click(function(){
            	$(".theme-popover-mask").show(300);
            	$(".popup").show(500);
            })
            $(".theme-popover-mask").click(function(){
            	$(".theme-popover-mask").hide(500);
            	$(".popup").hide(300);
            })
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
        	$.get("activity/list.shtml",{
        		pageNum:ctrl.pageNum,
        		pageSize:ctrl.pageSize
        	},function(data){
        		var activityList = "";
        		if(data.data && data.data.list){
        			activityList = data.data.list;
        		}else{
        			return false;
        		}
        		if(ctrl.pageNum == 1 && activityList.length == 0){
        			$(".warn").html(REND("include/empty",{icon:"&#xe644;",tip:"sorry,亲，您还没有可推送的活动哦~",price:"1",display:"block",paddingbottom:"1"}));
        			return false;
        		}else{
        			$(".warn").html("");
        		}
        		if(activityList.length < ctrl.pageSize){
        			ctrl.flag = false;
        		}
        		var temp = '';
        		for(var i=0;i<activityList.length;i++){
        			var toDetail = "";
        			if(activityList[i].isPush){
        				switch(activityList[i].activityType){
        				case "sales" : //带商品活动
        					toDetail = "onclick='GO(\"activity/promotionDetails\",{activityId:"+activityList[i].id+"})'";
        					break;
        				case "shop" : //店铺活动
        					toDetail = "onclick='GO(\"activity/activityDetails\",{activityId:"+activityList[i].id+"})'";
        					break;
        				case "forward" : //转发有礼
        					toDetail = "onclick='GO(\"forwardingGifts/forwardingDetails\",{shopId:"+activityList[i].shopId+",forwardingGiftsId:"+activityList[i].dataIds+"})'";
        					break;
        				}
        			}
        			temp += '<li '+toDetail+'>';
        						if(!activityList[i].isPush){
        							temp += '<i class="iconfont" id="'+activityList[i].id+'" onclick="this.ctrl.changeChoose(this)">&#xe63d</i>';
        						}
        						if(!activityList[i].isPush){
        	        				temp += '<div class="pic" onclick="this.ctrl.toEditActivity(\''+activityList[i].id+'\',\''+activityList[i].activityType+'\',this)">';
        	        			}else{
        	        				temp += '<div class="pic">';
        	        			}
        						temp +=
									'<img src="'+Config.imgPre+activityList[i].image+'"/>'+
								' </div>';
        						if(!activityList[i].isPush){
        	        				temp +='<div class="txt"  onclick="this.ctrl.toEditActivity(\''+activityList[i].id+'\',\''+activityList[i].activityType+'\',this)">';
        	        			}else{
        	        				temp +='<div class="txt">';
        	        			}
								temp +=
									'<h5 class="ellips'+(activityList[i].isPush?' color-gray9':'')+'">'+activityList[i].title+'</h5>'+
									'<p class="ellips1 m-top05 '+(activityList[i].isPush?'color-gray9':'color-gray6')+'">'+activityList[i].description+'</p>'+
									'<p class="color-gray9">'+$.Date(activityList[i].createDate).format("yyyy-MM-dd")+'</p>'+
								'</div>';
			        		    if(activityList[i].isPush){
			        		    	temp += '<span class="color-red">已推送</span>';
			        		    }else{
			        		    	temp += '<span class="blue" onclick="this.ctrl.startPush('+activityList[i].id+',this,\''+activityList[i].activityType+'\');">开始推送</span>';
			        		    }
							'</li>';
        		}
        		$(".con-list>ul").append(temp);
            });
        },
        startPush:function(activityId,obj,activityType){
        	if($("#editBtn").text()=="完成"){
        		this.changeChoose($(obj).closest("li").find("i"));
        		return false;
        	}
        	var curMonthPushCount = parseInt($("#curMonthPushCount").val());
			var leftFreePushCount = parseInt($("#leftFreePushCount").val());
			var leftBuyPushCount = parseInt($("#leftBuyPushCount").val());
			var curDayPushCount = parseInt($("#curDayPushCount").val());
			var curMonPushMaxCount = parseInt($("#curMonPushMaxCount").val());
			var curDayPushMaxCount = parseInt($("#curDayPushMaxCount").val());
			var freeCount = parseInt($("#freeCount").val());
			if(curMonthPushCount >= curMonPushMaxCount){
				alert("本月推送次数已用完");
			}
			else if(curDayPushCount >= curDayPushMaxCount){
				alert("今日推送次数已用完");
				$(".alertBox button").html("确定");
			}
			else if(leftFreePushCount==0 && leftBuyPushCount == 0 && curMonthPushCount == freeCount){
				alert("本月免费次数已全部用完，是否立即购买？",function(flag){
					if(flag){//点击立即购买
						window.location.href= "#activity/pushPurchase?type=businessPush";
					}
				},true);
				$(".alertBox ul>li>a:eq(1)").html("立即购买")
			}
			else if(leftFreePushCount==0 && leftBuyPushCount == 0 && curMonthPushCount > freeCount){
				alert("您购买的次数已用完，是否继续购买？",function(flag){
					if(flag){//点击确定
						window.location.href="#activity/pushPurchase?type=businessPush";
					}
				},true);
			}
			else{
				alert("确认推送这条消息吗？", function(flag){
					if(flag){
						$.post("activity/pushToUser.shtml",{activityId:activityId},function(data){
							if(data.status == '1'){
								alert("推送成功");
								$(obj).removeAttr("onclick");
								$(obj).removeAttr("class");
								$(obj).addClass("color-red");
								$(obj).closest("li").find(".txt h5").addClass("color-gray9");
								$(obj).closest("li").find(".txt p:eq(0)").removeClass("color-gray6").addClass("color-gray9");
								$(obj).html("已推送");
								$("#curDayPushCount").val(parseInt($("#curDayPushCount").val())+1);
								if(leftFreePushCount > 0){
									$("#leftFreePushCount").val(parseInt($("#leftFreePushCount").val())-1)
								}else{
									$("#leftBuyPushCount").val(parseInt($("#leftBuyPushCount").val())-1)
								}
								$("#curMonthPushCount").val(parseInt($("#curMonthPushCount").val())-1);
								$("#leftFreePushCountCite").html($("#leftFreePushCount").val());
								$("#ablePushCountCite").html(parseInt($("#ablePushCountCite").html())-1);
								$("#leftBuyPushCountCite").html($("#leftBuyPushCount").val());
							}else{
								if(data.errorCode == 1111){
									alert(data.errorMsg,function(flag){
				            			if(flag){//点击立即编辑
				            				window.location.href="#activity/editHelisActivity?id="+activityId;
				            			}
				            		},true);
				            		$(".alertBox ul>li>a:eq(1)").html("立即编辑")
								}else if(data.errorCode == 1112){
									alert(data.errorMsg,function(flag){
				            			if(flag){//点击立即编辑
				            				if(activityType == "sales"){
				            					window.location.href="#activity/editSaleActivity?id="+activityId;
				            				}else if(activityType == "forward"){
				            					window.location.href="#activity/editHelisActivity?id="+activityId;
				            				}else if(activityType == "shop"){
				            					window.location.href="#activity/editNewActivity?id="+activityId;
				            				}
				            			}
				            		},true);
								}else{
									alert(data.errorMsg);
								}
								$(".loadingWrap").css("z-index","888");
							}
						})
					}
				},true);
			}
			$(".loadingWrap").css("z-index","888");
        },
        changeChoose:function(obj){
        	if(!$(obj).hasClass("color-red")){//未选中状态
        		$("#choosedCount").text(parseInt($("#choosedCount").text())+1);
        		$(obj).addClass("color-red");
        	}else{//已选中
        		if(parseInt($("#choosedCount").text()) > 0){
        			$("#choosedCount").text(parseInt($("#choosedCount").text())-1);
        		}
        		$(obj).removeClass("color-red");
        	}
        	this.toUpdateDelBtn();
        },
        deleteActivity:function(){
        	var ctrl = this;
        	if($(".content i[class$=color-red]").length == 0){
        		return false;
        	}
    		Choose("确认要删除推送吗？",function(){
    			var arr = $(".con-list li i[class$='color-red']");
    			var ids = new Array();
    			if(arr && arr.length>0){
    				for(var i=0;i<arr.length;i++){
    					ids.push($(arr[i]).attr("id"));
    				}
    			}else{
    				return false;
    			}
    			$.post("activity/delete.shtml",{ids:ids},function(data){
    				if(data.status == "1"){
    					$(".con-list li i[class$='color-red']").closest("li").remove();
    					$("#choosedCount").text(0);
    					ctrl.toUpdateDelBtn();
    					alert("删除成功");
    				}else{
    					alert(data.errorMsg);
    					return false;
    				}
    			});
    		});
        },
        toEditActivity:function(id,activityType,obj){
        	if($("#editBtn").text()=="完成"){
        		this.changeChoose($(obj).closest("li").find("i"));
        		return false;
        	}
        	if(activityType == 'sales'){
        		window.location.href="#activity/editSaleActivity?id="+id;
        	}else if(activityType == 'shop'){
        		window.location.href="#activity/editNewActivity?id="+id;
        	}else if(activityType == 'forward'){
        		window.location.href="#activity/editHelisActivity?id="+id;
        	}
        },
        toUpdateDelBtn:function(){
        	if($(".content i[class$=color-red]").length == 0 && $(".footer span").hasClass("bg-red")){
        		$(".footer span").removeClass("bg-red").addClass("bg-grayc");
        	}
        	if($(".content i[class$=color-red]").length != 0 && $(".footer span").hasClass("bg-grayc")){
        		$(".footer span").removeClass("bg-grayc").addClass("bg-red");
        	}
        },
        addActivity:function(type){
        	if(type == 'sales'){
        		localStorage.removeItem("activity_title");
        		localStorage.removeItem("activity_description");
        		localStorage.removeItem("activity_beginDate");
        		localStorage.removeItem("activity_endDate");
        		localStorage.removeItem("activity_selectGoods");
        		localStorage.removeItem("minBeginDate");
        		window.location.href = "#activity/addSaleActivity";
        	}else if(type == "new"){
        		window.location.href = "#activity/addNewActivity";
        	}else if(type == "helis"){
        		window.location.href = "#activity/addHelisActivity";
        	}
        }
    },
    "activity/editSaleActivity":{
    	_title:"编辑促销活动",
    	_footer:false,
    	_links : {
    		"js/inputValidate.js":"js",
    		"./css/ios-switch.css":"css"
		},
    	minBeginDate:null,
    	_load:function(){
    		var activityId = this._param.id;
    		var editFlag = this._param.editFlag;
    		var ctrl = this;
    		if(editFlag == "edit"){
    			
    		}else{
    			this.getActivityInfo(activityId);
    		}
    		var beginDate = localStorage.getItem("activity_beginDate");
    		var endDate = localStorage.getItem("activity_endDate");
    		var title = localStorage.getItem("activity_title");
    		var description = localStorage.getItem("activity_description");
    		var orderValidity = localStorage.getItem("activity_orderValidity");
    		
    		var tempBeginDateInput = beginDate.substr(0,10);
			var tempBeginTime = beginDate.substr(11,5);
			var tempEndDateInput = endDate.substr(0,10);
			var tempEndTime = endDate.substr(11,5);
			if(orderValidity && orderValidity != ""){
				var tempOrderValidityInput = orderValidity.substr(0,10);
				var tempOrderValidityTime = orderValidity.substr(11,5);
				$("#orderValidityInput").val(tempOrderValidityInput);
				$("#orderValidityTime").val(tempOrderValidityTime);
				$("#orderValidityOpen").prop("checked","checked");
				$("#orderValidityOpen").addClass("open");
				$("#orderValiditySpan").show();
			}else{
				$("#orderValidityInput").val(tempEndDateInput);
				$("#orderValidityTime").val(tempEndTime);
				$("#orderValidityOpen").prop("checked","");
				$("#orderValidityOpen").removeClass("open");
				$("#orderValiditySpan").hide();
			}
			
			$("#title").val(title);
			$("#description").val(description);
			$("#beginDateInput").val(tempBeginDateInput);
			$("#beginTime").val(tempBeginTime);
			$("#endDateInput").val(tempEndDateInput);
			$("#endTime").val(tempEndTime);
    		$("#id").val(activityId);
    		var selectGoods = localStorage.getItem("activity_selectGoods");
        	if(selectGoods == null || selectGoods == ""){
        		selectGoods = [];
        	}else{
        		selectGoods = JSON.parse(selectGoods);
        	}
        	var html ="";
        	for(var i=0;i<selectGoods.length;i++){
        		html += '<p class="clearfix">'+
        					'<span class="pic">'+
        						'<img src="'+Config.imgPre + selectGoods[i].image+'"/>'+
        					'</span>'+
        					'<span class="kdl-left">'+
        						'<span class="ellips">'+selectGoods[i].name+'</span>';
				        		if(selectGoods[i].goodsTypeId == 5){
									html += '<span class="tel color-gray6">￥<span class="input">'+selectGoods[i].sku[0].price+'</span> 库存<span class="input">'+selectGoods[i].sku[0].stock+'</span></span>';
								}else if(selectGoods[i].cowrieStatus == 'pass'){
        							html += '<span class="tel color-gray6">￥<span class="input">'+selectGoods[i].sku[0].price+'</span> 返现<span class="input">￥'+selectGoods[i].consumeTips+'</span></span>';
        						}else if(selectGoods[i].cowrieStatus != 'pass' && selectGoods[i].skuCount == 1){
        							html += '<span class="tel color-gray6">'+
        										'￥<input class="input" type="number" id="skuPrice_'+selectGoods[i].sku[0].skuId+'" name="sku_price" goodsId="'+selectGoods[i].goodsId+'" skuId="'+selectGoods[i].sku[0].skuId+'" onkeyup="inputValidate.onlyFloat(this,0.01)" value="'+selectGoods[i].sku[0].price+'"/>'+ 
        										'库存<input class="input" type="tel"  id="skuStock_'+selectGoods[i].sku[0].skuId+'" name="sku_stock" goodsId="'+selectGoods[i].goodsId+'" skuId="'+selectGoods[i].sku[0].skuId+'"  onkeyup="inputValidate.onlyInteger(this,1)" value="'+selectGoods[i].sku[0].stock+'"/>'+
        										'</span>';
        						}else if(selectGoods[i].cowrieStatus != 'pass' && selectGoods[i].skuCount > 1){
        							html += '<span class="btn" onclick="this.ctrl.changeGoodsSku(\''+selectGoods[i].goodsId+'\')">变更促销价格/库存 ></span>';
        						}
        			html += '</span>'+
        					'<span class="close" onclick="this.ctrl.removeGoods(this,'+selectGoods[i].goodsId+')">×</span>'+
    					'</p>';
        	}
    		$("#selectGoodsList").html(html);
    		
    	},
    	getActivityInfo:function(activityId){
    		var ctrl = this;
    		$.ajax({
    			url:"activity/getActivityInfo.shtml",
    			async:false,
    			data:{id:activityId},
    			type:"post",
    			dataType:"json",
    			success:function(data){
    				if(data.status == 1){
    					var activity = data.data.activity;
    					var selectGoods = data.data.selectGoods;
    					ctrl.minBeginDate = data.data.minBeginDate;
    					var beginDate = activity.beginDate;
    					var endDate = activity.endDate;
    					var orderValidity = activity.orderValidity;
    					
    					localStorage.setItem("activity_title",activity.title);
    		    		localStorage.setItem("activity_description",activity.description);
    					localStorage.setItem("activity_beginDate",beginDate);
    					localStorage.setItem("activity_endDate",endDate);
    					localStorage.setItem("activity_selectGoods", selectGoods);
    					if(orderValidity && orderValidity != ""){
    						localStorage.setItem("activity_orderValidity",orderValidity);
    						$("#orderValidityOpen").prop("checked","checked");
    	    				$("#orderValidityOpen").addClass("open");
    	    				$("#orderValiditySpan").show();
    					}else{
    						$("#orderValidityOpen").prop("checked","");
    	    				$("#orderValidityOpen").removeClass("open");
    	    				$("#orderValiditySpan").hide();
    					}
    				}else{
    					alert(data.errorMsg);
    				}
    			},
    			error:function(data){
    				
    			}
    		})
    	},
    	changeGoodsSku:function(goodsId){
    		if($("#title").val() != null && $("#title").val() != ""){
    			localStorage.setItem("activity_title",$("#title").val());
    		}
    		if($("#description").val() != null && $("#description").val() != ""){
    			localStorage.setItem("activity_description",$("#description").val());
    		}
    		if($("#beginDateInput").val() != null && $("#beginDateInput").val() != ""){
    			var temp = $("#beginDateInput").val()+" "+$("#beginTime").val();
    			localStorage.setItem("activity_beginDate",temp);
    		}
    		if($("#endDateInput").val() != null && $("#endDateInput").val() != ""){
    			var temp = $("#endDateInput").val()+" "+$("#endTime").val();
    			localStorage.setItem("activity_endDate",temp);
    		}
    		this.syncGoodsToLocal();
    		if($("#orderValidityOpen").hasClass("open") && $("#orderValidityInput").val() != "" && $("#orderValidityTime").val() != ""){
    			var temp = $("#orderValidityInput").val()+" "+$("#orderValidityTime").val();
    			localStorage.setItem("activity_orderValidity",temp);
    		}
    		
    		window.location.href="#activity/alteration?goodsId="+goodsId+"&type=edit&activityId="+$("#id").val();
    	},
    	removeGoods:function(obj,goodsId){
    		$(obj).parent().remove();
    		
    		var selectGoods = localStorage.getItem("activity_selectGoods");
        	if(selectGoods == null || selectGoods == ""){
        		selectGoods = [];
        	}else{
        		selectGoods = JSON.parse(selectGoods);
        	}
    		for(var i = 0;i<selectGoods.length;i++){
    			if(selectGoods[i].goodsId == goodsId){
    				selectGoods.splice(i,1);
    				break;
    			}
    		}
    		localStorage.setItem("activity_selectGoods",JSON.stringify(selectGoods));
    	},
    	addGoods:function(){
    		if($("#title").val() != null && $("#title").val() != ""){
    			localStorage.setItem("activity_title",$("#title").val());
    		}
    		if($("#description").val() != null && $("#description").val() != ""){
    			localStorage.setItem("activity_description",$("#description").val());
    		}
    		if($("#beginDateInput").val() != null && $("#beginDateInput").val() != ""){
    			var temp = $("#beginDateInput").val()+" "+$("#beginTime").val();
    			localStorage.setItem("activity_beginDate",temp);
    		}
    		if($("#endDateInput").val() != null && $("#endDateInput").val() != ""){
    			var temp = $("#endDateInput").val()+" "+$("#endTime").val();
    			localStorage.setItem("activity_endDate",temp);
    		}
    		this.syncGoodsToLocal();
    		if($("#orderValidityOpen").hasClass("open") && $("#orderValidityInput").val() != "" && $("#orderValidityTime").val() != ""){
    			var temp = $("#orderValidityInput").val()+" "+$("#orderValidityTime").val();
    			localStorage.setItem("activity_orderValidity",temp);
    		}
    		
    		window.location.href='#activity/selectionGoods?type=edit&activityId='+$("#id").val();
    	},
    	submitForm:function(){
    		if($("#title").val() == null || $("#title").val().trim() == ""){
    			alert("请输入活动标题！");
    			return false;
    		}
    		
    		if($("#beginDateInput").val() == null || $("#beginDateInput").val() == ""){
    			alert("请输入正确的活动开始时间");
    			return ;
    		}else{
    			$("#beginDate").val($("#beginDateInput").val()+" "+$("#beginTime").val()+":00");
    		}
    		if($("#endDateInput").val() == null || $("#endDateInput").val() == ""){
    			alert("请输入正确的活动结束时间");
    			return ;
    		}else{
        		$("#endDate").val($("#endDateInput").val()+" "+$("#endTime").val()+":00");
    		}
    		var beginDate = $("#beginDateInput").val() + " "+$("#beginTime").val()+":00";
    		var endDate = $("#endDateInput").val()+" "+$("#endTime").val()+":00";
    		beginDate = $.Date(beginDate);
    		endDate = $.Date(endDate);
    		var tempMinBeginDate = $.Date(this.minBeginDate);
    		beginDate = beginDate.getTime();
    		endDate = endDate.getTime();
    		tempMinBeginDate = tempMinBeginDate.getTime();
    		
    		if(tempMinBeginDate > beginDate){
    			alert("请推迟您的活动开始时间!");
    			return false;
    		}
    		var timeDisparity = (endDate - beginDate)/1000;
    		if(timeDisparity < 60*60){
    			alert("结束时间要大于开始时间1小时！");
    			return false;
    		}
    		if(timeDisparity > (7*24*60*60)){
    			alert("结束时间不能大于开始时间7天！");
    			return false;
    		}
    		if($("#orderValidityOpen").hasClass("open")){
    			if($("#orderValidityInput").val() == null || $("#orderValidityTime") == ""){
        			alert("请选择活动订单有效期");
        			return ;
        		}else{
            		$("#orderValidity").val($("#orderValidityInput").val()+" "+$("#orderValidityTime").val()+":00");
        		}
    			var orderValidity = $.Date($("#orderValidity").val());
				orderValidity = orderValidity.getTime();
				if(orderValidity < endDate){
	    			alert("订单有效期需大于活动结束时间！");
	    			return false;
	    		}
    		}
    		
    		var selectGoods = localStorage.getItem("activity_selectGoods");
        	if(selectGoods == null || selectGoods == "" || selectGoods == "[]"){
        		alert("请选择商品！");
        		return false;
        	}
        	
        	selectGoods = JSON.parse(selectGoods);
        	
        	var nullFlag = false;
        	$("[name='sku_price']").each(function(){
        		var skuId = $(this).attr("skuId");
        		var goodsId = $(this).attr("goodsId");
        		var price = $(this).val();
        		var stock = $("#skuStock_"+skuId).val();
        		if(price == null || price == "" || stock == null || stock == '' || price < 0.01 || stock < 1){
        			nullFlag = true;
        			return false;
        		}
        		
        		for(var i= 0 ;i<selectGoods.length;i++){
        			if(goodsId = selectGoods[i].goodsId){
        				for(var j = 0;j<selectGoods[i].sku.length;j++){
            				if(selectGoods[i].sku[j].skuId == skuId){
            					selectGoods[i].sku[j].price = price;
            					selectGoods[i].sku[j].stock = stock;
            					break;
            				}
            			}
        			}
        		}
        	})
        	if(nullFlag){
        		alert("库存和价格不能为空,且必须大于0！");
        		return false;
        	}
        	localStorage.setItem("activity_selectGoods",JSON.stringify(selectGoods));
    		$("#goods").val(JSON.stringify(selectGoods));
        	
    		$("#form").submit();
    	},
    	syncGoodsToLocal:function(){
    		var selectGoods = localStorage.getItem("activity_selectGoods");
    		if(selectGoods == null || selectGoods == "" || selectGoods == "[]"){
        		return false;
        	}
    		selectGoods = JSON.parse(selectGoods);
        	$("[name='sku_price']").each(function(){
        		var skuId = $(this).attr("skuId");
        		var goodsId = $(this).attr("goodsId");
        		var price = $(this).val();
        		var stock = $("#skuStock_"+skuId).val();
        		if(price == null || price == "" || stock == null || stock == '' || price < 0.01 || stock < 1){
        			return false;
        		}
        		
        		for(var i= 0 ;i<selectGoods.length;i++){
        			if(goodsId = selectGoods[i].goodsId){
        				for(var j = 0;j<selectGoods[i].sku.length;j++){
            				if(selectGoods[i].sku[j].skuId == skuId){
            					selectGoods[i].sku[j].price = price;
            					selectGoods[i].sku[j].stock = stock;
            					break;
            				}
            			}
        			}
        		}
        	})
        	
        	localStorage.setItem("activity_selectGoods",JSON.stringify(selectGoods));
    	},
    	submitCall:function(data){
    		if(data.status == 1){
    			localStorage.removeItem("activity_title");
        		localStorage.removeItem("activity_description");
        		localStorage.removeItem("activity_beginDate");
        		localStorage.removeItem("activity_endDate");
        		localStorage.removeItem("activity_orderValidity");
        		localStorage.removeItem("activity_selectGoods");
        		localStorage.removeItem("minBeginDate");
        		
        		alert("保存成功",2000);
        		window.location.href="#activity/pushAd";
    		}else{
    			alert(data.errorMsg);
    		}
    	},
    	back:function(){
        	alert("是否放弃此次编辑？",function(flag){
    			if(flag){//点击确定
    				localStorage.removeItem("activity_title");
            		localStorage.removeItem("activity_description");
            		localStorage.removeItem("activity_beginDate");
            		localStorage.removeItem("activity_endDate");
            		localStorage.removeItem("activity_orderValidity");
            		localStorage.removeItem("activity_selectGoods");
            		localStorage.removeItem("minBeginDate");
            		
    	    		window.location.href="#activity/pushAd";
    			}
    		},true);
    	},
    	setOrderValidity:function(obj){
    		if($(obj).hasClass("open")){
    			$(obj).removeClass("open");
    			localStorage.removeItem("activity_orderValidity");
    			$("#orderValiditySpan").hide();
    		}else{
    			$(obj).addClass("open");
    			$("#orderValiditySpan").show();
    			
    			$("#endDate").val($("#endDateInput").val()+" "+$("#endTime").val()+":00");
    			var endDate = $.Date($("#endDate").val());
	    		$("#orderValidity").val($("#orderValidityInput").val()+" "+$("#orderValidityTime").val()+":00");
				var orderValidity = $.Date($("#orderValidity").val());
				orderValidity = orderValidity.getTime();
				if(orderValidity < endDate){
					$("#orderValidityInput").val($("#endDateInput").val());
					$("#orderValidityTime").val($("#endDateTime").val());
	    		}
    		}
    	}
    },
    "activity/addSaleActivity" : {
    	_title:"添加促销活动",
    	_footer:false,
    	_links : {
    		"js/inputValidate.js":"js",
    		"./css/ios-switch.css":"css"
		},
    	minBeginDate:null,
    	_load:function(){
    		var ctrl = this;
    		var title=localStorage.getItem("activity_title");
    		var description=localStorage.getItem("activity_description");
    		var beginDate = localStorage.getItem("activity_beginDate");
    		var endDate = localStorage.getItem("activity_endDate");
    		var orderValidity = localStorage.getItem("activity_orderValidity");
    		var tempMinBeginDate = localStorage.getItem("minBeginDate");
    		
    		if(title != null && title != ""){
    			$("#title").val(title);
    		}
    		if(description != null && description != ""){
    			$("#description").val(description);
    		}
    		if(beginDate != null && beginDate != "" && endDate != "" && endDate != null && tempMinBeginDate != null && tempMinBeginDate != ""){
    			ctrl.minBeginDate = tempMinBeginDate;
    			var tempBeginDateInput = beginDate.substr(0,10);
    			var tempBeginTime = beginDate.substr(11,5);
    			var tempEndDateInput = endDate.substr(0,10);
    			var tempEndTime = endDate.substr(11,5);
    			
    			$("#beginDateInput").val(tempBeginDateInput);
    			$("#beginTime").val(tempBeginTime);
    			$("#endDateInput").val(tempEndDateInput);
    			$("#endTime").val(tempEndTime);
    			
    			if(orderValidity && orderValidity != "" && orderValidity != null){
    				var tempOrderValidityInput = orderValidity.substr(0,10);
        			var tempOrderValidityTime = orderValidity.substr(11,5);
        			$("#orderValidityInput").val(tempOrderValidityInput);
        			$("#orderValidityTime").val(tempOrderValidityTime);
        			$("#orderValidityOpen").prop("checked","checked");
    				$("#orderValidityOpen").addClass("open");
    				$("#orderValiditySpan").show();
    			}else{
    				$("#orderValidityInput").val(tempEndDateInput);
        			$("#orderValidityTime").val(tempEndTime);
        			$("#orderValidityOpen").prop("checked","");
    				$("#orderValidityOpen").removeClass("open");
    				$("#orderValiditySpan").hide();
    			}
    		}else{
    			//获取开始时间和结束时间
    			$.get("activity/getActivityDate.shtml",{type:"businessPush"},function(data){
    				if(data.status == 1){
    					data = data.data;
    					var beginDateInput = data.beginDate.substr(0,10);
    					var beginTime = data.beginDate.substr(11,5);
    					var endDateInput = data.endDate.substr(0,10);
    					var endTime = data.endDate.substr(11,5);
    					$("#beginDateInput").val(beginDateInput);
    					$("#beginTime").val(beginTime);
    					$("#endDateInput").val(endDateInput);
    					$("#endTime").val(endTime);
    					$("#orderValidityInput").val(endDateInput);
    					$("#orderValidityTime").val(endTime);
    					
    					ctrl.minBeginDate = data.beginDate;
    					localStorage.setItem("minBeginDate",data.beginDate);
    				}
    			});
    			
    		}
    		
    		var selectGoods = localStorage.getItem("activity_selectGoods");
        	if(selectGoods == null || selectGoods == ""){
        		selectGoods = [];
        	}else{
        		selectGoods = JSON.parse(selectGoods);
        	}
        	var html ="";
        	for(var i=0;i<selectGoods.length;i++){
        		html += '<p class="clearfix">'+
        					'<span class="pic">'+
        						'<img src="'+Config.imgPre + selectGoods[i].image+'"/>'+
        					'</span>'+
        					'<span class="kdl-left">'+
        						'<span class="ellips">'+selectGoods[i].name+'</span>';
        						if(selectGoods[i].goodsTypeId == 5){
        							html += '<span class="tel color-gray6">￥<span class="input">'+selectGoods[i].sku[0].price+'</span> 库存<span class="input">'+selectGoods[i].sku[0].stock+'</span></span>';
        						}else if(selectGoods[i].cowrieStatus == 'pass'){
        							html += '<span class="tel color-gray6">￥<span class="input">'+selectGoods[i].sku[0].price+'</span> 返现<span class="input">￥'+selectGoods[i].consumeTips+'</span></span>';
        						}else if(selectGoods[i].cowrieStatus != 'pass' && selectGoods[i].skuCount == 1){
        							html += '<span class="tel color-gray6">'+
        										'￥<input name="sku_price" skuId="'+selectGoods[i].sku[0].skuId+'" goodsId="'+selectGoods[i].goodsId+'" class="input" type="number" onkeyup="inputValidate.onlyFloat(this,0.01)" value="'+selectGoods[i].sku[0].price+'"/>'+
        										'库存<input id="skuStock_'+selectGoods[i].sku[0].skuId+'" class="input" type="tel" onkeyup="inputValidate.onlyInteger(this,1)" value="'+selectGoods[i].sku[0].stock+'"/>'+
        									'</span>';
        						}else if(selectGoods[i].cowrieStatus != 'pass' && selectGoods[i].skuCount > 1){
        							html += '<span class="btn" onclick="this.ctrl.changeGoodsSku(\''+selectGoods[i].goodsId+'\')">变更促销价格/库存 ></span>';
        						}
        			html += '</span>'+  
        					'<span class="close" onclick="this.ctrl.removeGoods(this,'+selectGoods[i].goodsId+')">×</span>'+
    					'</p>';
        	}
    		$("#selectGoodsList").html(html);
    	},
    	changeGoodsSku:function(goodsId){
    		if($("#title").val() != null && $("#title").val() != ""){
    			localStorage.setItem("activity_title",$("#title").val());
    		}
    		if($("#description").val() != null && $("#description").val() != ""){
    			localStorage.setItem("activity_description",$("#description").val());
    		}
    		if($("#beginDateInput").val() != null && $("#beginDateInput").val() != ""){
    			var temp = $("#beginDateInput").val()+" "+$("#beginTime").val();
    			localStorage.setItem("activity_beginDate",temp);
    		}
    		if($("#endDateInput").val() != null && $("#endDateInput").val() != ""){
    			var temp = $("#endDateInput").val()+" "+$("#endTime").val();
    			localStorage.setItem("activity_endDate",temp);
    		}
    		this.syncGoodsToLocal();
    		if($("#orderValidityOpen").hasClass("open") && $("#orderValidityInput").val() != "" && $("#orderValidityTime").val() != ""){
    			var temp = $("#orderValidityInput").val()+" "+$("#orderValidityTime").val();
    			localStorage.setItem("activity_orderValidity",temp);
    		}
    		
    		window.location.href="#activity/alteration?goodsId="+goodsId;
    	},
    	removeGoods:function(obj,goodsId){
    		$(obj).parent().remove();
    		
    		var selectGoods = localStorage.getItem("activity_selectGoods");
        	if(selectGoods == null || selectGoods == ""){
        		selectGoods = [];
        	}else{
        		selectGoods = JSON.parse(selectGoods);
        	}
    		for(var i = 0;i<selectGoods.length;i++){
    			if(selectGoods[i].goodsId == goodsId){
    				selectGoods.splice(i,1);
    				break;
    			}
    		}
    		localStorage.setItem("activity_selectGoods",JSON.stringify(selectGoods));
    	},
    	addGoods:function(){
    		if($("#title").val() != null && $("#title").val() != ""){
    			localStorage.setItem("activity_title",$("#title").val());
    		}
    		if($("#description").val() != null && $("#description").val() != ""){
    			localStorage.setItem("activity_description",$("#description").val());
    		}
    		if($("#beginDateInput").val() != null && $("#beginDateInput").val() != ""){
    			var temp = $("#beginDateInput").val()+" "+$("#beginTime").val();
    			localStorage.setItem("activity_beginDate",temp);
    		}
    		if($("#endDateInput").val() != null && $("#endDateInput").val() != ""){
    			var temp = $("#endDateInput").val()+" "+$("#endTime").val();
    			localStorage.setItem("activity_endDate",temp);
    		}
    		this.syncGoodsToLocal();
    		if($("#orderValidityOpen").hasClass("open") && $("#orderValidityInput").val() != "" && $("#orderValidityTime").val() != ""){
    			var temp = $("#orderValidityInput").val()+" "+$("#orderValidityTime").val();
    			localStorage.setItem("activity_orderValidity",temp);
    		}
    		
    		window.location.href='#activity/selectionGoods';
    	},
    	submitForm:function(){
    		if($("#title").val() == null || $("#title").val().trim() == ""){
    			alert("请输入活动标题！");
    			return false;
    		}
    		
    		if($("#beginDateInput").val() == null || $("#beginDateInput") == ""){
    			alert("请选择活动开始时间");
    			return ;
    		}else{
    			$("#beginDate").val($("#beginDateInput").val()+" "+$("#beginTime").val()+":00");
    		}
    		if($("#endDateInput").val() == null || $("#endDateInput") == ""){
    			alert("请选择活动结束时间");
    			return ;
    		}else{
        		$("#endDate").val($("#endDateInput").val()+" "+$("#endTime").val()+":00");
    		}
    		var beginDate = $.Date($("#beginDate").val());
    		var endDate = $.Date($("#endDate").val());
    		var tempMinBeginDate = $.Date(this.minBeginDate);
    		beginDate = beginDate.getTime();
    		endDate = endDate.getTime();
    		tempMinBeginDate = tempMinBeginDate.getTime();
    		
    		if(tempMinBeginDate > beginDate){
    			alert("请推迟您的活动开始时间!");
    			return false;
    		}
    		var timeDisparity = (endDate - beginDate)/1000;
    		if(timeDisparity < 60*60){
    			alert("结束时间要大于开始时间1小时！");
    			return false;
    		}
    		if(timeDisparity > (7*24*60*60)){
    			alert("结束时间不能大于开始时间7天！");
    			return false;
    		}
    		if($("#orderValidityOpen").hasClass("open")){
    			if($("#orderValidityInput").val() == "" || $("#orderValidityTime") == ""){
        			alert("请选择活动订单有效期");
        			return ;
        		}else{
            		$("#orderValidity").val($("#orderValidityInput").val()+" "+$("#orderValidityTime").val()+":00");
        		}
    			var orderValidity = $.Date($("#orderValidity").val());
				orderValidity = orderValidity.getTime();
				if(orderValidity < endDate){
	    			alert("订单有效期需大于活动结束时间！");
	    			return false;
	    		}
    		}
    		
    		var selectGoods = localStorage.getItem("activity_selectGoods");
    		if(selectGoods == null || selectGoods == "" || selectGoods == "[]"){
        		alert("请选择商品！");
        		return false;
        	}
    		selectGoods = JSON.parse(selectGoods);
    		var submitFlag = true;
        	$("[name='sku_price']").each(function(){
        		var skuId = $(this).attr("skuId");
        		var goodsId = $(this).attr("goodsId");
        		var price = $(this).val();
        		var stock = $("#skuStock_"+skuId).val();
        		if(price == null || price == "" || stock == null || stock == '' || price < 0.01 || stock < 1){
        			submitFlag = false;
        			return false;
        		}
        		
        		for(var i= 0 ;i<selectGoods.length;i++){
        			if(goodsId = selectGoods[i].goodsId){
        				for(var j = 0;j<selectGoods[i].sku.length;j++){
            				if(selectGoods[i].sku[j].skuId == skuId){
            					selectGoods[i].sku[j].price = price;
            					selectGoods[i].sku[j].stock = stock;
            					break;
            				}
            			}
        			}
        		}
        	})
        	if(!submitFlag){
        		alert("库存和价格不能为空,且必须大于0！");
        		return false;
        	}
        	localStorage.setItem("activity_selectGoods",JSON.stringify(selectGoods));
    		$("#goods").val(JSON.stringify(selectGoods));
    		
    		$("#form").submit();
    	},
    	syncGoodsToLocal:function(){
    		var selectGoods = localStorage.getItem("activity_selectGoods");
    		if(selectGoods == null || selectGoods == "" || selectGoods == "[]"){
        		return false;
        	}
    		selectGoods = JSON.parse(selectGoods);
        	$("[name='sku_price']").each(function(){
        		var skuId = $(this).attr("skuId");
        		var goodsId = $(this).attr("goodsId");
        		var price = $(this).val();
        		var stock = $("#skuStock_"+skuId).val();
        		if(price == null || price == "" || stock == null || stock == '' || price < 0.01 || stock < 1){
        			return false;
        		}
        		
        		for(var i= 0 ;i<selectGoods.length;i++){
        			if(goodsId = selectGoods[i].goodsId){
        				for(var j = 0;j<selectGoods[i].sku.length;j++){
            				if(selectGoods[i].sku[j].skuId == skuId){
            					selectGoods[i].sku[j].price = price;
            					selectGoods[i].sku[j].stock = stock;
            					break;
            				}
            			}
        			}
        		}
        	})
        	
        	localStorage.setItem("activity_selectGoods",JSON.stringify(selectGoods));
    	},
    	submitCall:function(data){
    		if(data.status == 1){
    			localStorage.removeItem("activity_title");
        		localStorage.removeItem("activity_description");
        		localStorage.removeItem("activity_beginDate");
        		localStorage.removeItem("activity_endDate");
        		localStorage.removeItem("activity_orderValidity");
        		localStorage.removeItem("activity_selectGoods");
        		localStorage.removeItem("minBeginDate");
        		
        		alert("保存成功",2000);
        		window.location.href="#activity/pushAd";
    		}else{
    			alert(data.errorMsg);
    		}
    	},
    	back:function(){
        	alert("是否放弃此次编辑？",function(flag){
    			if(flag){//点击确定
    				localStorage.removeItem("activity_title");
    	    		localStorage.removeItem("activity_description");
    	    		localStorage.removeItem("activity_beginDate");
    	    		localStorage.removeItem("activity_endDate");
    	    		localStorage.removeItem("activity_orderValidity");
    	    		localStorage.removeItem("activity_selectGoods");
    	    		localStorage.removeItem("minBeginDate");
    	    		
    	    		window.location.href="#activity/pushAd";
    			}
    		},true);
    	},
    	setOrderValidity:function(obj){
    		if($(obj).hasClass("open")){
    			$(obj).removeClass("open");
    			localStorage.removeItem("activity_orderValidity");
    			$("#orderValiditySpan").hide();
    		}else{
    			$(obj).addClass("open");
    			$("#orderValiditySpan").show();
    			
    			$("#endDate").val($("#endDateInput").val()+" "+$("#endTime").val()+":00");
    			var endDate = $.Date($("#endDate").val());
	    		$("#orderValidity").val($("#orderValidityInput").val()+" "+$("#orderValidityTime").val()+":00");
				var orderValidity = $.Date($("#orderValidity").val());
				orderValidity = orderValidity.getTime();
				if(orderValidity < endDate){
					$("#orderValidityInput").val($("#endDateInput").val());
					$("#orderValidityTime").val($("#endDateTime").val());
	    		}
    		}
    	}
    },
    "activity/alteration":{
    	_title:"选择商品",
        _footer : false,
        _links : {
    		"js/inputValidate.js":"js"
		},
        _load:function(){
        	var goodsId = this._param.goodsId;
        	var activityId = this._param.activityId;
        	$("#activityId").val(activityId);
        	if(goodsId == null || goodsId == ""){
        		window.location.href="#activity/addSaleActivity";
        		return;
        	}
        	$("#goodsId").val(goodsId);
        	var selectGoods = localStorage.getItem("activity_selectGoods");
        	if(selectGoods == null || selectGoods == ""){
        		selectGoods = [];
        	}else{
        		selectGoods = JSON.parse(selectGoods); 
        	}
        	var skuList = [];
        	for(var i=0;i<selectGoods.length;i++){
        		if(selectGoods[i].goodsId == goodsId){
        			skuList = selectGoods[i].sku;
        			break;
        		}
        	}
        	if(skuList.length == 0){
        		window.location.href="#activity/addSaleActivity";
        		return false;
        	}
        	var html="";
        	for(var i=0;i<skuList.length;i++){
        		html += '<tr>'+
			    			'<td>'+
			    				skuList[i].skuValue+
							'</td>'+
							'<td><input id="skuPrice_'+skuList[i].skuId+'" type="tel" placeholder="促销价" onkeyup="inputValidate.onlyFloat(this,0.01)" value="'+skuList[i].price+'"/></td>'+
							'<td><input id="skuStock_'+skuList[i].skuId+'" type="tel" placeholder="促销库存" onkeyup="inputValidate.onlyInteger(this,1)" value="'+skuList[i].stock+'"/></td>'+
						'</tr>';
        	}
        	$("#skuBody").html(html);
        },
        sureChange:function(){
        	var goodsId = $("#goodsId").val();
        	
        	var selectGoods = localStorage.getItem("activity_selectGoods");
        	if(selectGoods == null || selectGoods == ""){
        		selectGoods = [];
        	}else{
        		selectGoods = JSON.parse(selectGoods); 
        	}
        	var skuList = [];
        	for(var i=0;i<selectGoods.length;i++){
        		if(selectGoods[i].goodsId == goodsId){
        			skuList = selectGoods[i].sku;
        			break;
        		}
        	}
        	
    		for(var i=0;i < skuList.length; i++){
    			var price = $("#skuPrice_"+skuList[i].skuId).val();
    			var stock = $("#skuStock_"+skuList[i].skuId).val();
    			
    			if(price == null || price == "" || stock == null || stock == '' || price < 0.01 || stock < 1){
        			alert("库存和价格不能为空,且必须大于0！");
        			return false;
        		}
    			
    			skuList[i].price = price;
    			skuList[i].stock = stock;
    		}
    		
    		for(var i=0;i<selectGoods.length;i++){
        		if(selectGoods[i].goodsId == goodsId){
        			selectGoods[i].sku = skuList;
        			break;
        		}
        	}
        	localStorage.setItem("activity_selectGoods",JSON.stringify(selectGoods));
        	
        	var type = this._param.type;
        	if(type == 'edit'){
        		window.location.href="#activity/editSaleActivity?id="+$("#activityId").val()+"&editFlag=edit";
        	}else{
        		window.location.href="#activity/addSaleActivity";
        	}
        },
        back:function(){
        	alert("是否放弃此次编辑？",function(flag){
    			if(flag){//点击确定
    				history.go(-1);
    			}
    		},true);
        }
    },
    /*选择商品*/
    "activity/selectionGoods": {
        _title:"选择商品",
        _footer : false,
        pageNum : 1,
        pageSize: 10,
        _links : {
    		"js/inputValidate.js":"js"
		},
        loadFlag:true,
        _load: function(){
        	var activityId = this._param.activityId;
        	if(activityId != '' && activityId != null){
        		$("#activityId").val(activityId);
        		if(this._param.type == 'edit'){
     	        	$("#sureSelectGoods").attr("onclick","this.ctrl.sureSelectGoods('edit')");
     	        }else{
     	        	$("#sureSelectGoods").attr("onclick","this.ctrl.sureSelectGoods('add')");
     	        }
        	}
        	
        	this.loadGoods();
        	
        	var ctrl = this;
        	 /*tab切换*/
	        $(".sifting>ul>li").click(function(){
	            $(this).addClass("cur").siblings().removeClass("cur");
	            var listval=$(this).index();
	            if(listval == 1){
	            	var text =$(this).find("i").text();
	            	if($(this).find("i").text()==""){
	            		$(this).find("i").text("");
	            	}else{
	            		$(this).find("i").text("");
	            	}
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
	                $(".screening").siblings().hide();
	                $(".screening").toggle();
	                if($(".screening").css('display')=='block'){
	                    $(".theme-popover-mask").show();
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
	        //触底加载
	        setREG("document_scroll", ctrl._name, function(){
            	if($.getScrollBottom()<3 && ctrl.loadFlag){
            		ctrl.pageNum++;
            		ctrl.loadGoods();
            	}
            });
	        
        },
        sureSelectGoods:function(type){
        	if(type == 'add'){
        		window.location.href="#activity/addSaleActivity";
        	}else if(type == 'edit'){
        		var activityId = $("#activityId").val();
        		window.location.href="#activity/editSaleActivity?id="+activityId+"&editFlag=edit";
        	}
        },
        loadGoodsOrder:function(obj,orders){
        	$("#goodsList").html("");
        	this.pageNum = 1;
        	
        	$(obj).parent().siblings().removeClass("cur");
        	$(obj).parent().addClass("cur");
        	$("#order").val(orders);
        	var orderTxt = $(obj).find("span").find("span").html();
        	$("#orderTxt").html(orderTxt);
        	this.loadGoods();
        	$('.clearfix ul li')[0].click();
        	$(obj).attr("priceFlag","");
        },
        loadGoodsOrderPrice:function(obj){
        	$("#zonghe").parent().siblings().removeClass("cur");
        	
        	$("#goodsList").html("");
        	this.pageNum = 1;
        	var priceFlag= $(obj).attr("priceFlag");
        	if(priceFlag == "" || priceFlag == "desc"){
        		$("#order").val("priceAsc");
        		this.loadGoods();
        		$(obj).attr("priceFlag","asc");
        	}else{
        		$("#order").val("priceDesc");
        		this.loadGoods();
        		$(obj).attr("priceFlag","desc");
        	}
        },
        toSearchByOther:function(){
        	$("#goodsList").html("");
        	this.pageNum = 1;
        	this.loadGoods();
        	$(".screening").hide();
	    	$(".theme-popover-mask").hide(); 
        },
        chooseCow:function(obj){
        	var isCowrie = $(obj).attr("pagecowriestatus");
        	if(isCowrie == '' || isCowrie == null){
        		$("#isCowrie").val("");
        	}else if(isCowrie == 'pass'){
        		$("#isCowrie").val("true");
        	}else if(isCowrie == 'unSubmit'){
        		$("#isCowrie").val("false");
        	}
        },
        loadGoods:function(){
        	var order = $("#order").val();
        	var minPrice = $("#minPrice").val();
        	var maxPrice = $("#maxPrice").val();
        	var isCowrie = $("#isCowrie").val();
        	var activityId = $("#activityId").val();
        	var tempPageNum = this.pageNum;
        	var tempPageSize = this.pageSize;
        	this.loadFlag = false;
        	var ctrl = this;
        	
        	var selectGoods = localStorage.getItem("activity_selectGoods");
        	if(selectGoods == null || selectGoods == ""){
        		selectGoods = [];
        	}else{
        		selectGoods = JSON.parse(selectGoods);
        	}
        	var appendFlag = true;
        	if($("#selectGoods li").length > 0){
        		appendFlag = false;
        	}
        	
        	$.ajax({
        		url:"activity/loadShopGoods.shtml",
        		data:{order:order,minPrice:minPrice,maxPrice:maxPrice,isCowrie:isCowrie,pageNum:tempPageNum,pageSize:tempPageSize,activityId:activityId},
        		async:true,
        		type:"post",
        		dataType:"json",
        		success:function(data){
        			var html = "";
        			if(data.status == 1 && data.data.goodsList != null && data.data.goodsList != ""){
        				data = data.data.goodsList;
        				for(var i = 0;i < data.length;i++){
        					html +='<li>';
        					var flag = false;
        					for(var j=0;j<selectGoods.length;j++){
        						if(data[i].id == selectGoods[j].goodsId){
        							flag = true;
        							break;
        						}
        					}
        					if(flag){
        						if(appendFlag){
        							var tempHtml = '<li id="selectGoodsDiv_'+data[i].id+'">'+
											    		'<div class="pic">'+
										                	'<img src="'+Config.imgPre + data[i].image+'"/>'+
										                '</div>'+
										                '<div class="ellips">'+
										                	data[i].name +
										            	'</div>'+
										            	'<i class="iconfont color-red" onclick="this.ctrl.removeSelectGoods(\''+data[i].id+'\')">&#xe652;</i>'+
										            '</li>';
							    		$("#selectGoods").append(tempHtml);
        						}
        						
								html +='<i class="iconfont cur" id="selectGoodsFlag_'+data[i].id+'" onclick="this.ctrl.selectGoods(this,\''+data[i].id+'\',\''+data[i].name+'\',\''+data[i].image+'\',\''+data[i].cowrieStatus+'\',\''+data[i].goodsTypeId+'\');">&#xe63d;</i>';	
							}else{
								html +='<i class="iconfont" id="selectGoodsFlag_'+data[i].id+'" onclick="this.ctrl.selectGoods(this,\''+data[i].id+'\',\''+data[i].name+'\',\''+data[i].image+'\',\''+data[i].cowrieStatus+'\',\''+data[i].goodsTypeId+'\');">&#xe63d;</i>';
							}
        					if(data[i].cowrieStatus == 'pass'){
								html +='<a href="#goods/details?goodsId='+data[i].id+'&shopId=1">';
							}else{
								html +='<a href="#goods/details?goodsId='+data[i].id+'">';
							}
        					html+='<div class="pic">'+
				                        '<img src="'+Config.imgPre+data[i].image+'"/>'+
				                    '</div>'+
				                    '<div class="txt">'+
				                        '<h6 class="color-gray6 ellips">'+data[i].name+'</h6>'+
				                        '<h5 class="color-red h3 m-top10">￥'+data[i].price.toFixed(2);
										if(data[i].cowrieStatus == 'pass'){
											html += '<button>返￥'+data[i].consumeTips+'</button>';
				                        }
				                        html += '</h5>'+
				                        '<div class="color-gray9 p m-top10">好评率：'+data[i].score*20+'%</div>'+
				                        '<p class="color-gray9 clearfix m-top10"><span class="kdl-left">销量：'+data[i].sales+'</span></p>'+
				                    '</div>'+
				                '</a>'+
				           '</li>'; 
        				}
        				$("#goodsList").append(html);
        				ctrl.adjustPop();
        	        	$("[name='selectGoodsCount']").html(selectGoods.length);
        				if(data.length < 10){
        					ctrl.loadFlag = false;
        				}else{
        					ctrl.loadFlag = true;
        				}
        			}
        			
        		},
        		error:function(data){
        			
        		}
        	});
        },
        removeSelectGoods:function(goodsId){
        	var selectGoods = localStorage.getItem("activity_selectGoods");
        	if(selectGoods == null || selectGoods == ""){
        		selectGoods = [];
        	}else{
        		selectGoods = JSON.parse(selectGoods);
        	}
        	for(var i=0;i<selectGoods.length;i++){
        		if(selectGoods[i].goodsId == goodsId){
        			selectGoods.splice(i,1);
        			localStorage.setItem("activity_selectGoods",JSON.stringify(selectGoods));
        			break;
        		}
        	}
        	
        	$("[name='selectGoodsCount']").html(selectGoods.length);
        	$("#selectGoodsDiv_"+goodsId).remove();
        	$("#selectGoodsFlag_"+goodsId).removeClass("cur");
        	this.adjustPop();
        	if(selectGoods.length < 1){
        		$(".popul").hide(500);
        		$(".popup").hide(300);
        	}
        },
        selectGoods:function(obj,goodsId,name,image,cowrieStatus,goodsTypeId){
        	var ctrl=this;
        	var activityId = $("#activityId").val();
        	var selectGoods = localStorage.getItem("activity_selectGoods");
        	if(selectGoods == null || selectGoods == ""){
        		selectGoods = [];
        	}else{
        		selectGoods = JSON.parse(selectGoods);
        	}
        	if($(obj).hasClass("cur")){//取消选中
        		$(obj).removeClass("cur");
        		if(selectGoods.length > 0){
        			for(var i=0;i < selectGoods.length;i++){
        				if(selectGoods[i].goodsId == goodsId){
        					selectGoods.splice(i,1);
        					break;
        				}
        			}
        		}
        		localStorage.setItem("activity_selectGoods",JSON.stringify(selectGoods));
        		
        		$("#selectGoodsDiv_"+goodsId).remove();
        	}else{//选中
        		if(selectGoods.length >= 6){
        			alert("最多可以选择六款商品！");
        			return false;
        		}
        		var temp= false;
        		for(var i=0;i < selectGoods.length;i++){
					if(selectGoods[i].goodsId == goodsId){
						temp = true;
						break;
					}
				}
        		if(temp){
        			return false;
        		}
        		$.ajax({
        			url:"activity/getGoodsSku.shtml",
        			data:{goodsId:goodsId,activityId:activityId},
        			async:false,
        			type:"post",
        			dataType:"json",
        			success:function(data){
        				if(data.status == 1 && data.data.skuList != null && data.data.skuList != ""){
        					data = data.data.skuList;
        					var skuArray= [];
        					var consumeTips = 0.0;
        					for(var i= 0 ;i<data.length;i++){
        						var skuItemValue="默认规格"; 
        						if(data[i].skuItemValuesStr != null && data[i].skuItemValuesStr != ""){
        							skuItemValue="";
        							var skuItemValuesStr = JSON.parse(data[i].skuItemValuesStr);
        							for(var j=0;j < skuItemValuesStr.length;j++){
        								skuItemValue += " "+skuItemValuesStr[j].value;
        							}
        							skuItemValue = skuItemValue.substr(1);
        						}
        						var skuJSON = {"skuId":data[i].id,"price":data[i].price.toFixed(2),"stock":data[i].stock,"skuValue":skuItemValue};
        						if(data[i].isDefault){
        							if(cowrieStatus == "pass"){
        								consumeTips = data[i].consumeTips;
        							}
        							skuArray.unshift(skuJSON);
        						}else{
        							skuArray.push(skuJSON);
        						}
        					}
        					var goodsJSON = {"goodsId":goodsId,"name":name,"image":image,"goodsTypeId":goodsTypeId,"skuCount":data.length,"cowrieStatus":cowrieStatus,"consumeTips":consumeTips,"sku":skuArray};
        					selectGoods.push(goodsJSON);
        					localStorage.setItem("activity_selectGoods",JSON.stringify(selectGoods));
        				}
        			},
        			error:function(data){
        				
        			}
        		});
        		
        		var html = '<li id="selectGoodsDiv_'+goodsId+'">'+
					    		'<div class="pic">'+
				                	'<img src="'+Config.imgPre + image+'"/>'+
				                '</div>'+
				                '<div class="ellips">'+
				            		name +
				            	'</div>'+
				            	'<i class="iconfont color-red" onclick="this.ctrl.removeSelectGoods(\''+goodsId+'\')">&#xe652;</i>'+
				            '</li>';
	    		$("#selectGoods").append(html);
	    		$(obj).addClass("cur");
        	}
        	$("[name='selectGoodsCount']").html(selectGoods.length);
        	ctrl.adjustPop();
        	
        	if(selectGoods.length < 1){
        		$(".popul").hide(500);
        		$(".popup").hide(300);
        	}
        },
        adjustPop:function(){
        	var sums=$(".popup").outerHeight(true);
        	$(".popul").css("height",sums);
        },
        _events:{
        	".btns-radius":function(){
        		if($(".popup").is(":visible")){
        			$(".popul").hide(500);
            		$(".popup").hide(300);
        		}else{
        			var selectGoodsCount = $("#selectGoodsCount").html();
        			selectGoodsCount = parseInt(selectGoodsCount);
        			if(selectGoodsCount < 1){
        				return false;
        			}
        			$(".popul").show(300);
            		$(".popup").show(500);
        		}
        	}
        }
        
    },
    /*编辑已有活动*/
    "activity/editHelisActivity" : {
    	_title:"编辑已有活动",
    	_footer:false,
    	flag:true,
    	backFlag:false,
    	_load: function(){
    		var id = this._param.id;
    		$("#id").val(id);
    		var ctrl = this;
    		$.ajax({
    			url:"activity/getForwardingList.shtml",
    			data:{activityId:id},
    			type:"post",
    			dataType:"json",
    			async:true,
    			success:function(data){
    				if(data.status == 1){
    					data = data.data.list;
    					var html = "";
    					for(var i = 0;i < data.length;i++){
    						html += '<li>'+
		    							'<i class="iconfont" id="forwarding_'+data[i].id+'" onclick="this.ctrl.selectForwarding(this,\''+data[i].id+'\')">&#xe63d;</i>'+
		    							'<a href="#forwardingGifts/forwardingDetails?forwardingGiftsId='+data[i].id+'&shopId='+data[i].shop.id+'">'+
		    								'<img src="'+Config.imgPre+data[i].imageSrcs[0].src+'">'+
		    								'<div class="txt">'+   	                        	
		    									'<h5>'+data[i].shop.shopName+'</h5>'+
		    									'<p class="ellips">'+data[i].title+'</p>'+                	                        
		    								'</div>'+
		    							'</a>'+
		    						'</li>';
    					}
    					$("#dataList").html(html);
    					if(data.length < 1){
    						//显示没有活动的图片
    						
    					}else{
    						ctrl.getActivityInfo();
    					}
    				}
    			},
    			error:function(data){
    				
    			}
    			
    		})
    	},
    	getActivityInfo:function(){
    		var id= $("#id").val();
    		var ctrl = this;
    		$.ajax({
    			url:"activity/getActivityInfo.shtml",
    			data:{id:id},
    			type:"post",
    			dataType:"json",
    			async:true,
    			success:function(data){
    				if(data.status == 1){
    					data = data.data.forwardingGifts;
    					if(data != null && data != ""){
    						$("#forwarding_"+data.id).click();
    						ctrl.backFlag = false;
    					}
    				}
    			},
    			error:function(data){
    				
    			}
    		})
    	},
    	selectForwarding:function(obj,forwardingGiftsId){
    		this.backFlag = true;
    		if($(obj).hasClass("cur")){//取消选中
    			$("#count").html("0");
    			$(obj).removeClass("cur");
    			$("#forwardingGiftsId").val("");
    		}else{
    			$("#dataList li i.cur").removeClass("cur");
    			$(obj).addClass("cur");
    			$("#count").html("1");
    			$("#forwardingGiftsId").val(forwardingGiftsId);
    		}
    	},
    	updateForwardingGifts:function(){
    		var forwardingGiftsId = $("#forwardingGiftsId").val();
    		if(forwardingGiftsId == ""){
    			alert("请选择转发有礼活动");
    			return false;
    		}
    		if(!this.flag){
    			return false;
    		}
    		$.ajax({
    			url:"activity/updateForwardingGiftsActivity.shtml",
    			data:{id:$("#id").val(),forwardingGiftsId:forwardingGiftsId},
    			type:"post",
    			dataType:"json",
    			async:true,
    			success:function(data){
    				if(data.status == 1){
    					alert("保存成功",2000);
    					window.location.href = "#activity/pushAd";
    				}else{
    					alert(data.errorMsg);
    				}
    			},
    			error:function(data){
    				
    			}
    		})
    	},
    	back:function(){
    		if(this.backFlag){
    			alert("是否放弃此次编辑？",function(flag){
        			if(flag){//点击确定
        	    		history.go(-1);
        			}
        		},true);
    		}else{
    			history.go(-1);
    		}
    	}
    },
	/*添加已有活动*/
    "activity/addHelisActivity" : {
    	_title:"添加已有活动",
    	_footer:false,
    	flag:true,
    	backFlag : false,
    	_load: function(){
    		$.ajax({
    			url:"activity/getForwardingList.shtml",
    			type:"post",
    			dataType:"json",
    			async:true,
    			success:function(data){
    				if(data.status == 1){
    					data = data.data.list;
    					var html = "";
    					for(var i = 0;i < data.length;i++){
    						html += '<li>'+
		    							'<i class="iconfont" onclick="this.ctrl.selectForwarding(this,\''+data[i].id+'\')">&#xe63d;</i>'+
		    							'<a href="#forwardingGifts/forwardingDetails?forwardingGiftsId='+data[i].id+'&shopId='+data[i].shop.id+'">'+
		    								'<img src="'+Config.imgPre+data[i].imageSrcs[0].src+'">'+
		    								'<div class="txt">'+   	                        	
		    									'<h5>'+data[i].shop.shopName+'</h5>'+
		    									'<p class="ellips">'+data[i].title+'</p>'+                	                        
		    								'</div>'+
		    							'</a>'+
		    						'</li>';
    					}
    					$("#dataList").html(html);
    					if(data.length < 1){
    						//显示没有活动的图片
    						
    					}
    				}
    			},
    			error:function(data){
    				
    			}
    			
    		})
    	},
    	selectForwarding:function(obj,forwardingGiftsId){
    		this.backFlag = true;
    		if($(obj).hasClass("cur")){//取消选中
    			$("#count").html("0");
    			$(obj).removeClass("cur");
    			$("#forwardingGiftsId").val("");
    		}else{
    			$("#dataList li i.cur").removeClass("cur");
    			$(obj).addClass("cur");
    			$("#count").html("1");
    			$("#forwardingGiftsId").val(forwardingGiftsId);
    		}
    	},
    	saveForwardingGifts:function(){
    		var forwardingGiftsId = $("#forwardingGiftsId").val();
    		if(forwardingGiftsId == ""){
    			alert("请选择转发有礼活动");
    			return false;
    		}
    		if(!this.flag){
    			return false;
    		}
    		$.ajax({
    			url:"activity/saveForwardingGiftsActivity.shtml",
    			data:{forwardingGiftsId:forwardingGiftsId},
    			type:"post",
    			dataType:"json",
    			async:true,
    			success:function(data){
    				if(data.status == 1){
    					alert("保存成功",2000);
    					window.location.href = "#activity/pushAd";
    				}else{
    					alert(data.errorMsg);
    				}
    			},
    			error:function(data){
    				
    			}
    		})
    	},
    	back:function(){
    		if(this.backFlag){
    			alert("是否放弃此次编辑？",function(flag){
        			if(flag){//点击确定
        	    		history.go(-1);
        			}
        		},true);
    		}else{
    			history.go(-1);
    		}
    	}
    },
    /*说明*/
    "activity/pushExplain" : {
    	_title:"说明",
    	_footer:false,
    	_template:{url:"view/activity/explain.ejs"},
    	_load: function(){
    		
    	}
    	
    },
    /*说明*/
    "activity/cityNewsExplain" : {
    	_title:"说明",
    	_footer:false,
    	_template:{url:"view/cityNews/explain.ejs"},
    	_load: function(){
    		
    	}
    
    },
    
    /*推送购买*/
    "activity/pushPurchase" : {
    	_title:"推送购买",
    	_footer:false,
    	_links : {
    		"js/inputValidate.js":"js"
		},
    	curTime:1,
    	timeout:null,
    	_datas: GET("toolOrder/toolPluginTobuy.shtml",{type:PARAM("type",null)},function(data){
    		return data;
        }),
    	_load: function(){
    		var type = this._param.type;
    		if(type == "cityNews"){
    			$("#txtTitle").html("同城资讯");
    		}
    		this.caluateAmount(this._datas.minBuyTime,this._datas.toolPluginId);
    		$(".agreement i").click(function(){
    			if($(this).text()==""){
    				$(this).text("");
    				$(this).removeClass("color-red");
    			}else{
    				$(this).text("");
    				$(this).addClass("color-red");
    			}
    		})
    		
    		$(".content .list>ul>li").click(function(){
    			$(this).find("span").show();
    			$(this).siblings().find("span").hide();
    		})
    	},
    	caluateAmount : function(time,toolPluginId){
    		$.ajax({
				url:"toolOrder/calAmount.shtml",
				data:{time:time,toolPluginId:toolPluginId},
				async:false,
				dataType:"json",
				type:"post",
				success:function(data){
					if(data.status==0){
						alert(data.errorMsg);
						return false;
					}else{
						$("#totalPrice").html(data.data.newPrice.toFixed(2));
						$("#discountPrice").html(data.data.discountPrice.toFixed(2));
					}
				},
				error:function(data){
					alert("亲，系统错误请您稍后再试！");
				}
			});
    	},
    	toCaluate : function(obj,min,max){
    		var ctrl = this;
    		inputValidate.onlyInteger(obj,null,max);
    		if($(obj).val()=="" || $(obj).val()==null){
    			return false;
    		}
    		this.timeout=setTimeout(function(){
    			inputValidate.onlyInteger(obj,min,max);
    			var selTime = parseFloat($(obj).val());
        		if(selTime==ctrl.curTime){
        			return false;
        		}
        		ctrl.curTime = selTime;
				ctrl.caluateAmount(selTime,this._datas.toolPluginId);
			}, 1500);
    	},
    	closeOpen : function(){
			clearTimeout(this.timeout);
    	},
    	tobuyAgreement : function(){
    		GO("activity/buyAgreement",{},".sub_container");
    	},
    	toexplain : function(type){
    		if(type=="businessPush"){
    			GO("activity/pushExplain",{},".sub_container");
    		}else if(type=="cityNews"){
    			GO("activity/cityNewsExplain",{},".sub_container");
    		}else{
    			GO("activity/pushExplain",{},".sub_container");
    		}
    	},
    	buyBtn : function(){
    		var toolTime = $("#timeInput").val();
    		if(toolTime==null || toolTime =="" || parseFloat(toolTime)<=0){
    			alert("亲,购买次数必须大于零!");
    			return false;
    		}
    		if(!$("#sureAgreement").hasClass("color-red")){
    			alert("请阅读并同意服务购买协议！");
    			return false;
    		}
    		var ctrl = this;
    		$.ajax({
				url:"toolOrder/toolPluginBuy.shtml",
				data:{number:parseFloat(toolTime),toolPluginId:ctrl._datas.toolPluginId},
				async:false,
				dataType:"json",
				type:"post",
				success:function(data){
					if(data.status==0){
						alert(data.errorMsg);
						return false;
					}else{
						GO("pay/transitionCashierDesk",{toolOrderId:data.data.toolOrderId});
					}
				},
				error:function(data){
					alert("亲，系统错误请您稍后再试！");
				}
			});
    	}
    },
    
    /*支付结果*/
    "activity/payment" : {
    	_title:"支付结果",
    	_footer:false,
    	_datas:GET("toolOrder/getToolOrderInfo.shtml",{toolOrderSn:PARAM("toolOrderSn")},function(data){
    		return data;
    	}),
    	_load: function(){
    		
    	},
    	toolOrderDetails : function(sn){
    		GO("business/toolOrderDetails",{sn:sn})
    	},
    	back:function(){
    		
    	},
    	toList:function(type){
    		if(type == 'businessPush'){
    			window.location.href = "#activity/pushAd";
    		}else if(type == "cityNews"){
    			window.location.href = "#cityNews/cityNews";
    		}
    	}
    },
    
    /**商家动态*/
    "activity/merchantsDynamic" : {
    	_title:"商家动态",
    	_footer:false,
    	pageNum : 1,
    	pageSize : 6,
    	hasMore : true,
    	contactShopId : 0,
    	deleteActivityId : 0,
    	_events:{
    		//下拉小三角显示隐藏
    		".shopPromotion .hd>span":function(){
    			var ctrl=this.ctrl;
    			ctrl.contactShopId = $(this).attr("shopId"); //设置店铺Id，点击联系客服的时候用
    			ctrl.deleteActivityId = $(this).attr("activityId"); //设置活动Id，点击删除的时候用
    			$(".theme-popover-mask").show(300);
    			$(".popup").show(300);
    		},
    		".theme-popover-mask" : function(){
    			$(".theme-popover-mask").hide(500);
    			$(".popup").hide(300);
    		}
    	},
    	_load: function(){
    		//记录最后进入商家动态时间
			localStorage.setItem("actRedpoint_"+_user.id,new Date().getTime());
    		var ctrl = this;
    		this.getSalesActivityPage(); //查看店铺促销列表
    		$(".content .hd>ul>li").click(function(){
    			$(this).addClass("cur").siblings().removeClass("cur");
    			var sn=$(this).index();
    			if(sn==0){ //店铺促销
    				$(".shopPromotion").show();
    				$(".activity").hide();
    				ctrl.pageNum = 1;
    				ctrl.hasMore = true;
    				$("#salesContent").empty(); //清空店铺促销
    				ctrl.getSalesActivityPage(); //查看店铺促销列表
    			}else{ //店铺活动
    				$(".shopPromotion").hide();
    				$(".activity").show();
    				ctrl.pageNum = 1;
    				ctrl.hasMore = true;
    				$("#shopContent").empty(); //清空店铺活动
    				ctrl.getShopActivityPage(); //查看转发有礼或店铺活动列表
    			}
    		});
    		
    		//触底加载
            setREG("document_scroll", this._name, function(){
                if(ctrl.hasMore && $.getScrollBottom()<3){
                	ctrl.pageNum++;
                	if($(".clearfix > li.cur > a").html() == "店铺促销"){
                		ctrl.getSalesActivityPage();
                	}else{
                		ctrl.getShopActivityPage();
                	}
            	}
            });
    	},
    	//加载店铺促销列表
    	getSalesActivityPage : function(){
    		var ctrl = this;
    		$.ajax({
    			url : Config.basePath + "activity/getSalesActivityPage.shtml",
    			type : "GET",
    			dataType : "json",
    			async : false,
    			data : {
    				pageNum : ctrl.pageNum,
    				pageSize : ctrl.pageSize
    			},
    			success : function(datas){
    				if(datas.data == null){
    					return;
    				}
    				var activityDatas = datas.data.activityDatas;
    				$(".reminder").css("display","none");
    				if($("#salesContent>li").length < 1 && (activityDatas == null || activityDatas.length < 1)){
    					$(".reminder").css("display","block");
    					return;
    				}
    				if(activityDatas.length < 6){
    					ctrl.hasMore = false;
    				}
    				var temp = "";
    				for(var i = 0;i<activityDatas.length;i++){
    					var tempActivity = activityDatas[i];
    					if(tempActivity.goodsList == null || tempActivity.goodsList.length < 1){
    						continue;
    					}
    					var hasPraise = "";
    					if(localStorage.getItem("activityPraise_"+tempActivity.activityId+"_"+_user.id) == "true"){ //已点赞
    						hasPraise = ' class="color-red"';
    					}
    					var goodsList = "";
    					for(var j = 0;j<tempActivity.goodsList.length;j++){
    						var tempGoods = tempActivity.goodsList[j];
    						goodsList += '<li onclick="this.ctrl.toGoodsDetail('+tempActivity.activityId+','+tempGoods.goodsId+',\''+tempGoods.goodsCowrieStatus+'\')">\
			    							<img src="'+ Config.imgPre + tempGoods.goodsImage+'"/>\
			    						  </li>';
    					}
    					var description = tempActivity.description?"<p class='color-gray6 text ellips'><span class='color-gray3'>【"+tempActivity.shopName+"】</span>"+tempActivity.description+"</p>":"";
    					temp  += '<li activityId="'+tempActivity.activityId+'">\
		    						<div>\
				    					<div class="hd">\
				    						<div class="pic" onclick="this.ctrl.toShopDetail('+tempActivity.shopId+')">\
				    							<img src="'+Config.imgPre + tempActivity.shopAvatar+'"/>\
				    						</div>\
				    						<div class="txt" onclick="this.ctrl.toActivityDetail('+tempActivity.activityId+',\'sales\','+tempActivity.activityDataId+','+tempActivity.shopId+')">\
				    							<h5>'+tempActivity.title+'</h5>\
				    							<p class="color-gray6">'+tempActivity.pushDate+'</p>\
				    						</div>\
				    						<span class="iconfont color-gray9" shopId="'+tempActivity.shopId+'" activityId="'+tempActivity.activityId+'">&#xe609;</span>\
				    					</div>\
				    					'+ description;
    									if(tempActivity.orderValidity){
    										temp += '<p class="color-gray6">订单有效期:'+tempActivity.orderValidity+'</p>';
    									}
				    			temp +='<ol class="clearfix m-top10">\
				    						'+ goodsList +'\
				    					</ol>\
				    					<div class="bd">\
				    						<span class="color-gray9"><i class="iconfont" style=" margin-right: .1rem;vertical-align: middle;">&#xe69c;</i>'+tempActivity.activityViewCount+'<span>\
				    						<div class="anniu">\
				    							<button '+hasPraise+' onclick="this.ctrl.clickPraise(this,'+tempActivity.activityId+')"><i class="iconfont">&#xe607;</i><span>'+tempActivity.activityPraiseCount+'</span></button>\
				    							<button onclick="GO(\'activity/comment\',{activityId:'+tempActivity.activityId+'})"><i class="iconfont">&#xe698;</i>'+tempActivity.activityEvluationCount+'</button>\
				    						</div>\
				    					</div>\
				    				</div>\
				    			</li>';
    				}
    				$("#salesContent").append(temp);
    			}
    		});
    	},
    	//进入商品详情页
    	toGoodsDetail : function(activityId,goodsId,goodsCowrieStatus){
    		if(goodsCowrieStatus == "pass"){ //宝贝库商品详情
    			GO("goods/details",{goodsId:goodsId,shopId:1});
    		}else{ //非宝贝库商品详情
    			GO("goods/details",{goodsId:goodsId});
    		}
    	},
    	//联系客服
    	toChitchat : function(){
    		GO("message/chitchat",{shopId:this.contactShopId});
    	},
    	//删除活动显示
    	deleteActivity : function(){
    		var ctrl = this;
    		$.post(Config.basePath+"activity/deleteActivity.shtml",{
    			activityId : ctrl.deleteActivityId
    		},function(datas){
    			if(datas.status == "1"){
    				//隐藏下拉小三角
    				$(".theme-popover-mask").hide(500);
	    			$(".popup").hide(300);
    				$("li[activityId='"+ctrl.deleteActivityId+"']").remove();
    			}
    		});
    	},
    	//点赞按钮
    	clickPraise : function(item,activityId){
    		if(_user == null){
    			DO("passport/login");
    			return;
    		}
    		var storageInfo = "activityPraise_"+activityId+"_"+_user.id;
    		var isParise = localStorage.getItem(storageInfo);
    		if(isParise == "true"){ //取消点赞
    			$.delete(Config.basePath+"common/cancelPraise.shtml",{
    				activityId : +activityId
    			},function(datas){
    				if(datas.status == "1"){
    					$(item).removeClass("color-red");
    					localStorage.removeItem(storageInfo);
    					//获取点赞数量
    		    		$.get(Config.basePath+"common/getPraise.shtml",{
    						activityId : +activityId
    					},function(datas){
    						if(datas.status == "1"){
    							$(item).find("span").html(datas.data.praiseCount);
    						}
    					});
    				}
    			});
    		}else{ //点赞
    			$.post(Config.basePath+"common/addPraise.shtml",{
    				activityId : +activityId
    			},function(datas){
    				if(datas.status == "1"){
    					$(item).addClass("color-red");
    	    			localStorage.setItem(storageInfo,"true");
    	    			//获取点赞数量
    	        		$.get(Config.basePath+"common/getPraise.shtml",{
    	    				activityId : +activityId
    	    			},function(datas){
    	    				if(datas.status == "1"){
    	    					$(item).find("span").html(datas.data.praiseCount);
    	    				}
    	    			});
    				}
    			});
    		}
    	},
    	//转发有礼或店铺活动
    	getShopActivityPage : function(){
    		var ctrl = this;
    		$.ajax({
    			url : Config.basePath + "activity/getShopActivityPage.shtml",
    			type : "GET",
    			dataType : "json",
    			async : false,
    			data : {
    				pageNum : ctrl.pageNum,
    				pageSize : ctrl.pageSize
    			},
    			success : function(datas){
    				var activityDatas = datas.data.activityDatas;
    				$(".reminder").css("display","none");
    				if($("#shopContent>li").length < 1 && (activityDatas == null || activityDatas.length < 1)){
    					$(".reminder").css("display","block");
    					return;
    				}
    				if(activityDatas.length < 6){
    					ctrl.hasMore = false;
    				}
    				var temp = "";
    				for(var i = 0;i<activityDatas.length;i++){
    					var tempActivity = activityDatas[i];
    					temp  += '<li>\
		    		                <div class="hd">\
				                        <a href="javascript:;">\
				                            <div class="pic" onclick="this.ctrl.toShopDetail('+tempActivity.shopId+')">\
				                                <img src="'+Config.imgPre + tempActivity.shopAvatar+'"/>\
				                            </div>\
				                            <h6 class="color-gray6 ellips m-top10">'+tempActivity.shopName+'</h6>\
				                        </a>\
				                    </div>\
				                    <a href="javascript:;" onclick="this.ctrl.toActivityDetail('+tempActivity.activityId+',\''+tempActivity.activityType+'\','+tempActivity.activityDataId+','+tempActivity.shopId+')">\
				                        <h6 class="ellips">'+tempActivity.title+'</h6>\
				                        <p class="color-gray9 m-top5">'+tempActivity.pushDate+'<span class="kdl-right"><i class="iconfont color-grayc middle">&#xe69c;</i>'+tempActivity.activityViewCount+'</span></p>\
				                        <p class="color-gray6 ellips">'+tempActivity.description+'</p>\
				                        <img class="m-top10" src="'+Config.imgPre + tempActivity.image+'"/>\
				                    </a>\
				                </li>';
    				}
    				$("#shopContent").append(temp);
    			}
    		});
    	},
    	//进入店铺页面
    	toShopDetail : function(shopId){
    		GO("shop/shops",{shopId:shopId});
    	},
    	//进入活动详情
    	toActivityDetail : function(activityId,activityType,dataId,shopId){
    		//标识活动已读
    		$.get(Config.basePath + "activity/flagRead.shtml",{
    			activityId : activityId
    		},function(datas){
    			
    		});
    		if(activityType == "sales"){ //促销活动
    			GO("activity/promotionDetails",{activityId:activityId});
    		}else if(activityType == "shop"){ //店铺活动
    			GO("activity/activityDetails",{activityId:activityId});
    		}else{ //转发有礼
    			//添加浏览量
        		$.post(Config.basePath + "common/addView.shtml",{
        			activityId : activityId
        		});
    			GO("forwardingGifts/forwardingDetails",{shopId:shopId,forwardingGiftsId:dataId});
    		}
    	}
    	
    },
    
    "activity/addNewActivity" : {
    	_links:{
    		"js/extra.js":"js"
    	},
    	_title:"添加新活动",
    	_footer:false,
    	_load:function(){
    		//获取开始时间和结束时间
			$.get("activity/getActivityDate.shtml",{type:"businessPush"},function(data){
				if(data.status == 1){
					data = data.data;
					var beginDateInput = data.beginDate.substr(0,10);
					var beginTime = data.beginDate.substr(11,5);
					var endDateInput = data.endDate.substr(0,10);
					var endTime = data.endDate.substr(11,5);
					$("#beginDateInput").val(beginDateInput);
					$("#beginTime").val(beginTime);
					$("#endDateInput").val(endDateInput);
					$("#endTime").val(endTime);
				}
			});
    	},
    	picCheck:function(){
    		var count=$(".addPicture").parent().find(".pic").size();
    		var images = "";
    		$("input[name='pictures']").each(function(){
    			images += ","+$(this).val();
    		})
    		if(images.length > 0){
    			images = images.substring(1);
    		}
    		$("#images").val(images);
    		
    		$(".picCount").text(count);
    		if(count >= 4){
    			$(".addPicture").hide();
    		}else{
    			$(".addPicture").show();
    		}
    	},
    	_events:{
    		".addPicture":function(){
    			var btn=this;
    			$.clipImage({
					width:"6.4rem",						//剪裁宽度
					height:"4.6rem",					//剪裁高度
					call:function(dataURL, filename){
						$(btn).before('<span class="pic" style="background-image:url('+Config.imgPre+dataURL+');">\
							<span class="close">×</span>\
							<input type="hidden" name="pictures" value="'+dataURL+'"/>\
						</span>');
						btn.ctrl.picCheck();
					}
    			});
    		},
    		".pic .close":function(){
    			var ctrl=this.ctrl;
    			$(this).parent().remove();
    			ctrl.picCheck();
    		}
    	},
    	submitForm:function(data){
    		this.picCheck();
//    		$("#beginDate").val($("#beginDateInput").val().replace("T",' ')+":00");
//    		$("#endDate").val($("#endDateInput").val().replace("T",' ')+ ":00");
    		if($("#title").val().trim() == ""){
    			alert("请输入活动标题！");
    			return false;
    		}
    		if($("#beginDateInput").val() == null || $("#beginDateInput") == ""){
    			alert("请选择活动开始时间");
    			return ;
    		}else{
    			$("#beginDate").val($("#beginDateInput").val()+" "+$("#beginTime").val()+":00");
    		}
    		if($("#endDateInput").val() == null || $("#endDateInput") == ""){
    			alert("请选择活动结束时间");
    			return ;
    		}else{
        		$("#endDate").val($("#endDateInput").val()+" "+$("#endTime").val()+":00");
    		}
    		if($("#address").val().trim() == ""){
    			alert("请输入活动地址！");
    			return false;
    		}
    		if($("#description").val().trim() == ""){
    			alert("请输入活动介绍！");
    			return false;
    		}
    		if($("#images").val().trim() == ""){
    			alert("请选择活动图片");
    			return false;
    		}
    		if($("#images").val().split(",").length > 4){
    			alert("最多允许选择4张图片！");
    			return false;
    		}
//    		var minBeginDate = $("#minBeginDate").val();
//    		$("#beginDate").val($("#beginDateInput").val().replace("T",' ')+":00");
//    		$("#endDate").val($("#endDateInput").val().replace("T",' ')+ ":00");
    		
    		if($("#beginDate").val() == ""){
    			alert("请选择活动开始时间！");
    			return false;
    		}
    		if($("#endDate").val() == ""){
    			alert("请选择活动结束时间！");
    			return false;
    		}
    		
    		var beginDate =$("#beginDate").val();
    		var endDate=$("#endDate").val();
    		beginDate = $.Date(beginDate).getTime();
    		endDate = $.Date(endDate).getTime();
    		minBeginDate = $.Date(minBeginDate).getTime();
    		if(beginDate < minBeginDate){
    			alert("开始时间必须大于当前时间！");
    			return false;
    		}
    		var timeDisparity = (endDate - beginDate)/1000;
    		if(timeDisparity < 60*60){
    			alert("结束时间要大于开始时间1小时！");
    			return false;
    		}
    		if(timeDisparity > (7*24*60*60)){
    			alert("结束时间不能大于开始时间7天！");
    			return false;
    		}
    		
    		$("#form").submit();
    	},
    	submitCall:function(data){
    		if(data.status == 1){
    			alert("保存成功",2);
    			window.location.href="#activity/pushAd";
    		}else{
    			alert(data.errorMsg);
    		}
    	},
    	back:function(){
    		alert("是否放弃此次编辑？",function(flag){
    			if(flag){//点击确定
    				window.location.href="#activity/pushAd";
    			}
    		},true);
    	}
    },
    "activity/editNewActivity" : {
    	_links:{
    		"js/extra.js":"js"
    	},
    	_title:"编辑新活动",
    	_footer:false,
    	_datas:POST("activity/getActivityInfo.shtml",{id:PARAM("id")},function(data){
    		var activity = data.activity;
    		return data;
        }),
        _load:function(){
        	var beginDateInput = this._datas.activity.beginDate.substr(0,10);
			var beginTime = this._datas.activity.beginDate.substr(11,5);
			var endDateInput = this._datas.activity.endDate.substr(0,10);
			var endTime = this._datas.activity.endDate.substr(11,5);
			$("#beginDateInput").val(beginDateInput);
			$("#beginTime").val(beginTime);
			$("#endDateInput").val(endDateInput);
			$("#endTime").val(endTime);
        	
        	this.picCheck();
        },
    	picCheck:function(){
    		var count=$(".addPicture").parent().find(".pic").size();
    		var images = "";
    		$("input[name='pictures']").each(function(){
    			images += ","+$(this).val();
    		})
    		if(images.length > 0){
    			images = images.substring(1);
    		}
    		$("#images").val(images);
    		
    		$(".picCount").text(count);
    		if(count >= 4){
    			$(".addPicture").hide();
    		}else{
    			$(".addPicture").show();
    		}
    	},
    	_events:{
    		".addPicture":function(){
    			var btn=this;
    			$.clipImage({
					width:"6.4rem",						//剪裁宽度
					height:"4.6rem",					//剪裁高度
					call:function(dataURL, filename){
						$(btn).before('<span class="pic" style="background-image:url('+Config.imgPre+dataURL+');">\
											<span class="close">×</span>\
											<input type="hidden" name="pictures" value="'+dataURL+'"/>\
										</span>');
						btn.ctrl.picCheck();
					}
    			});
    		},
    		".pic .close":function(){
    			var ctrl=this.ctrl;
    			$(this).parent().remove();
    			ctrl.picCheck();
    		}
    	},
    	submitForm:function(data){
    		this.picCheck();
    		if($("#title").val().trim() == ""){
    			alert("请输入活动标题！");
    			return false;
    		}
    		if($("#address").val().trim() == ""){
    			alert("请输入活动地址！");
    			return false;
    		}
    		if($("#beginDateInput").val() == null || $("#beginDateInput") == ""){
    			alert("请选择活动开始时间");
    			return ;
    		}else{
    			$("#beginDate").val($("#beginDateInput").val()+" "+$("#beginTime").val()+":00");
    		}
    		if($("#endDateInput").val() == null || $("#endDateInput") == ""){
    			alert("请选择活动结束时间");
    			return ;
    		}else{
        		$("#endDate").val($("#endDateInput").val()+" "+$("#endTime").val()+":00");
    		}
    		if($("#description").val().trim() == ""){
    			alert("请输入活动介绍！");
    			return false;
    		}
    		if($("#images").val().trim() == ""){
    			alert("请选择活动图片");
    			return false;
    		}
    		if($("#images").val().split(",").length > 4){
    			alert("最多允许选择4张图片！");
    			return false;
    		}
//    		var minBeginDate = $("#minBeginDate").val();
//    		$("#beginDate").val($("#beginDateInput").val().replace("T",' ')+":00");
//    		$("#endDate").val($("#endDateInput").val().replace("T",' ')+ ":00");
    		
    		
    		if($("#beginDate").val() == ""){
    			alert("请选择活动开始时间！");
    			return false;
    		}
    		if($("#endDate").val() == ""){
    			alert("请选择活动结束时间！");
    			return false;
    		}
    		
    		var beginDate =$("#beginDate").val();
    		var endDate=$("#endDate").val();
    		beginDate = $.Date(beginDate).getTime();
    		endDate = $.Date(endDate).getTime();
    		minBeginDate = $.Date(minBeginDate).getTime();
    		if(beginDate < minBeginDate){
    			alert("开始时间必须大于"+$("#minBeginDate").val().substr(0,10)+"&nbsp;"+$("#minBeginDate").val().substr(11));
    			return false;
    		}
    		var timeDisparity = (endDate - beginDate)/1000;
    		if(timeDisparity < 60*60){
    			alert("结束时间要大于开始时间1小时！");
    			return false;
    		}
    		if(timeDisparity > (7*24*60*60)){
    			alert("结束时间不能大于开始时间7天！");
    			return false;
    		}
    		
    		$("#form").submit();
    	},
    	submitCall:function(data){
    		if(data.status == 1){
    			alert("保存成功",2);
    			window.location.href="#activity/pushAd";
    		}else{
    			alert(data.errorMsg);
    		}
    	},
    	back:function(){
    		alert("是否放弃此次编辑？",function(flag){
    			if(flag){//点击确定
    				window.location.href="#activity/pushAd";
    			}
    		},true);
    	}
    },
    /*评论*/
    "activity/comment":{
    	_title:"评论",
    	_footer:false,
    	_datas : POST("activity/toEvaluationPage.shtml",{activityId:PARAM("activityId")}), 
    	_events:{
    		".footer .comment":{
    			focus:function(){
    				if($(this).hasClass("color-graya")){
    					$(this).text("").removeClass("color-graya");
    				}
    			}
    		}
    	},
    	//发布评论
    	send : function(item,userIcon,username){
    		var $comment=$(item).parent().find(".comment");
			$comment.html($comment.html().replace(/<div.*?>/gm,"\n").replace(/<.*?>/gm,""));
			if($comment.text().trim().getLength() < 1 || $comment.hasClass("color-graya")){
				return;
			}
			var over=$comment.text().getLength()-400;
			if(over>0){
				alert("最多200字，您的评论已超出"+over+"字");
				return false;
			}
			//发布评论
			$.post(Config.basePath+"activity/sendEvaluate.shtml",{
				activityId : _param.activityId,
				content : $comment.text()
			},function(datas){
				if(datas.status == 1){
					var temp = '<div class="unit">\
									<h5 class="clearfix">\
										<div class="kdl-left"><img src="'+Config.imgPre + userIcon +'"/></div>\
										<div><div class="name">'+username+'</div><p class="color-graya">'+$.Date().format("yyyy-MM-dd HH:mm:ss")+'</p></div>\
									</h5>\
									<p class="detail">'+$comment.text()+'</p>\
								</div>';
					$(".content").prepend(temp);
					$comment.text("");
					alert("发布成功！");
				}
			});
    	}
    },
    
    /*开店啦平台服务购买协议*/
    "activity/buyAgreement":{
    	_title:"开店啦平台服务购买协议",
    	_footer:false,
    },
    /*筛选*/
    "activity/filtrate":{
    	_title:"筛选",
    	_footer:false,
    },
    /*账单详情*/
    "activity/billDetail":{
    	_title:"账单详情",
    	_footer:false,
    },
    
    /**促销详情*/
    "activity/promotionDetails":{
    	_title:"促销详情",
    	_footer:false,
    	_datas: GET("activity/toActivityDetail.shtml",{activityId:PARAM("activityId")}),
    	_load:function(){
    		//当前用户已点赞
        	if(localStorage.getItem("activityPraise_"+_param.activityId) == "true"){
        		$("#praise").text("");
        		$("#praise").css("color","#f62b2d");
        	}
        	//点赞按钮
            $("#praise").click(function(){
            	var $item = $(this);
            	if(_user == null){
        			alert("登录超时!请重新登录！");
        			return;
        		}
            	var storageInfo = "activityPraise_"+_param.activityId;
        		var isParise = localStorage.getItem(storageInfo);
                if(isParise != "true"){ //点赞
                	$.post(Config.basePath+"common/addPraise.shtml",{
        				activityId : _param.activityId
        			},function(datas){
        				if(datas.status == "1"){
        					$item.text("");
        					$item.css("color","#f62b2d");
        					localStorage.setItem(storageInfo,"true");
        	    			//获取点赞数量
        	        		$.get(Config.basePath+"common/getPraise.shtml",{
        	    				activityId : _param.activityId
        	    			},function(datas){
        	    				if(datas.status == "1"){
        	    					$item.siblings("p").find("span").html(datas.data.praiseCount);
        	    				}
        	    			});
        				}
        			});
                }else{ //取消点赞
                	$.delete(Config.basePath+"common/cancelPraise.shtml",{
        				activityId : _param.activityId
        			},function(datas){
        				if(datas.status == "1"){
        					$item.text("");
        					$item.css("color","#666");
        					localStorage.removeItem(storageInfo);
        					//获取点赞数量
        		    		$.get(Config.basePath+"common/getPraise.shtml",{
        						activityId : _param.activityId
        					},function(datas){
        						if(datas.status == "1"){
        							$item.siblings("p").find("span").html(datas.data.praiseCount);
        						}
        					});
        				}
        			});
                }

            });
    	}
    },
    
    /** 活动详情页面 */
    "activity/activityDetails": {
        _title:"活动详情",
        _footer:false,
        _datas: GET("activity/toActivityDetail.shtml",{activityId:PARAM("activityId")}),
        _load: function(){
        	//当前用户已点赞
        	if(localStorage.getItem("activityPraise_"+_param.activityId+"_"+_user.id) == "true"){
        		$("#praise").text("");
        		$("#praise").css("color","#f62b2d");
        	}
        	
        	//点赞按钮
            $("#praise").click(function(){
            	var $item = $(this);
            	if(_user == null){
        			alert("登录超时!请重新登录！");
        			return;
        		}
            	var storageInfo = "activityPraise_"+_param.activityId+"_"+_user.id;
        		var isParise = localStorage.getItem(storageInfo);
                if(isParise != "true"){ //点赞
                	$.post(Config.basePath+"common/addPraise.shtml",{
        				activityId : _param.activityId
        			},function(datas){
        				if(datas.status == "1"){
        					$item.text("");
        					$item.css("color","#f62b2d");
        					localStorage.setItem(storageInfo,"true");
        	    			//获取点赞数量
        	        		$.get(Config.basePath+"common/getPraise.shtml",{
        	    				activityId : _param.activityId
        	    			},function(datas){
        	    				if(datas.status == "1"){
        	    					$item.siblings("p").find("span").html(datas.data.praiseCount);
        	    				}
        	    			});
        				}
        			});
                }else{ //取消点赞
                	$.delete(Config.basePath+"common/cancelPraise.shtml",{
        				activityId : _param.activityId
        			},function(datas){
        				if(datas.status == "1"){
        					$item.text("");
        					$item.css("color","#666");
        					localStorage.removeItem(storageInfo);
        					//获取点赞数量
        		    		$.get(Config.basePath+"common/getPraise.shtml",{
        						activityId : _param.activityId
        					},function(datas){
        						if(datas.status == "1"){
        							$item.siblings("p").find("span").html(datas.data.praiseCount);
        						}
        					});
        				}
        			});
                }

            });
        }
    }
    
});

})();