(function(){
	/*公用变量和方法*/
FORMAT({
	/*广告推送*/
    "cityNews/cityNews": {
        _title:"同城商讯",
        pageNum:1,
        pageSize:6,
        _footer : false,
        flag:true,
        _datas: GET("cityNews/pushCountItem.shtml",function(data){
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
        	$.get("cityNews/list.shtml",{
        		pageNum:ctrl.pageNum,
        		pageSize:ctrl.pageSize,
        	},function(data){
        		var activityList = "";
        		if(data.data && data.data.list){
        			activityList = data.data.list;
        		}else{
        			return false;
        		}
        		if(ctrl.pageNum == 1 && activityList.length == 0){
        			$(".warn").html(REND("include/empty",{icon:"&#xe644;",tip:"sorry,亲，您还没有可发布的活动哦~",price:"1",display:"block",paddingbottom:"1"}));
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
        					toDetail = "onclick='GO(\"cityNews/promotionDetails\",{activityId:"+activityList[i].id+"})'";
        					break;
        				case "shop" : //店铺活动
        					toDetail = "onclick='GO(\"cityNews/activityDetails\",{activityId:"+activityList[i].id+"})'";
        					break;
        				case "forward" : //转发有礼
        					toDetail = "onclick='GO(\"forwardingGifts/forwardingDetails\",{shopId:"+activityList[i].shopId+",forwardingGiftsId:"+activityList[i].dataIds+"})'";
        					break;
        				}
        			}
        			var toPic = "";
        			var toTxt = "";
        			if(activityList[i].status == "create" || activityList[i].status == "noPass"){
        				toPic = '<div class="pic" onclick="this.ctrl.toEditActivity(\''+activityList[i].id+'\',\''+activityList[i].activityType+'\',this)">';
        				toTxt = '<div class="txt" onclick="this.ctrl.toEditActivity(\''+activityList[i].id+'\',\''+activityList[i].activityType+'\',this)">';
        				//temp += '<li onclick="this.ctrl.toEditActivity(\''+activityList[i].id+'\',\''+activityList[i].activityType+'\')">';
        			}else{
        				toPic = '<div class="pic">';
        				toTxt = '<div class="txt">';
        			}
        			temp += '<li '+toDetail+'>';
        			if(!activityList[i].isPush){
        				temp +='<i class="iconfont" id="'+activityList[i].id+'" onclick="this.ctrl.changeChoose(this)">&#xe63d</i>';
        			}
        		    temp += toPic+
									'<img src="'+Config.imgPre+activityList[i].image+'"/>'+
								'</div>'+
								toTxt +
									'<h5 class="ellips'+((activityList[i].status!="create"&&activityList[i].status!="noPass")?' color-gray9':'')+'">'+activityList[i].title+'</h5>'+
									'<p class="ellips1 m-top05 '+((activityList[i].status!="create"&&activityList[i].status!="noPass")?'color-gray9':'color-gray6')+'">'+activityList[i].description+'</p>'+
									'<p class="color-gray9">'+$.Date(activityList[i].createDate).format("yyyy-MM-dd")+'</p>'+
								'</div>';
			        		    if(activityList[i].status == "create"){
			        		    	temp += '<span class="blue" onclick="this.ctrl.startPush('+activityList[i].id+',this,\''+activityList[i].activityType+'\');">申请发布</span>';
			        		    }else if(activityList[i].status == "audit"){
			        		    	temp += '<span class="color-red">等待审核</span>';
			        		    }else if(activityList[i].status == "pass"){
			        		    	temp += '<span class="color-red">审核通过</span>';
			        		    }else if(activityList[i].status == "noPass"){
			        		    	temp += '<span style="color:#4DBCE2;">审核未通过</span>';
			        		    }else if(activityList[i].status == "over"){
			        		    	temp += '<span class="color-red">已结束</span>';
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
        		alert("本月发布次数已用完");
        	}
        	else if(curDayPushCount >= curDayPushMaxCount){
        		alert("今日发布次数已用完");
        		$(".alertBox button").html("确定");
        	}
        	else if(leftFreePushCount == 0 && leftBuyPushCount == 0 && curMonthPushCount == freeCount){
        		alert("本月免费次数已全部用完，是否立即购买？",function(flag){
        			if(flag){//点击立即购买
        				window.location.href= "#activity/pushPurchase?type=cityNews";
        			}
        		},true);
        		$(".alertBox ul>li>a:eq(1)").html("立即购买")
        	}
        	else if(leftFreePushCount == 0 && leftBuyPushCount == 0 && curMonthPushCount > freeCount){
        		alert("您购买的次数已用完，是否继续购买？",function(flag){
        			if(flag){//点击确定
        				window.location.href= "#activity/pushPurchase?type=cityNews";
        			}
        		},true);
        	}
        	else{
        		alert("确认发布这条消息吗？", function(flag){
	        		if(flag){
	        			$.post("cityNews/push.shtml",{activityId:activityId},function(data){
	            			if(data.status == '1'){
	            				alert("推送成功");
	            				$(obj).removeAttr("onclick");
	            				$(obj).removeAttr("class");
	            				$(obj).addClass("color-red");
	            				$(obj).closest("li").find(".txt h5").addClass("color-gray9");
	            				$(obj).closest("li").find(".txt p:eq(0)").removeClass("color-gray6").addClass("color-gray9");
	            				$(obj).html("等待审核");
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
				            				if(activityType == "sales"){
				            					window.location.href="#cityNews/editSaleActivity?id="+activityId;
				            				}else if(activityType == "forward"){
				            					window.location.href="#cityNews/editHelisActivity?id="+activityId;
				            				}else if(activityType == "shop"){
				            					window.location.href="#cityNews/editNewActivity?id="+activityId;
				            				}
				            			}
				            		},true);
				            		$(".alertBox ul>li>a:eq(1)").html("立即编辑");
				            		$(".loadingWrap").css("z-index","888");
								}else if(data.errorCode == 1112){
									alert(data.errorMsg,function(flag){
			            				if(flag){//点击立即编辑
				            				if(activityType == "sales"){
				            					window.location.href="#cityNews/editSaleActivity?id="+activityId;
				            				}else if(activityType == "forward"){
				            					window.location.href="#cityNews/editHelisActivity?id="+activityId;
				            				}else if(activityType == "shop"){
				            					window.location.href="#cityNews/editNewActivity?id="+activityId;
				            				}
				            			}
				            		},true);
									$(".loadingWrap").css("z-index","888");
								}else{
									alert(data.errorMsg);
								}
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
        		window.location.href="#cityNews/editSaleActivity?id="+id;
        	}else if(activityType == 'shop'){
        		window.location.href="#cityNews/editNewActivity?id="+id;
        	}else if(activityType == 'forward'){
        		window.location.href="#cityNews/editHelisActivity?id="+id;
        	}
        },
        addSaleActivity:function(){
        	localStorage.removeItem("activity_title");
    		localStorage.removeItem("activity_description");
    		localStorage.removeItem("activity_beginDate");
    		localStorage.removeItem("activity_endDate");
    		localStorage.removeItem("activity_selectGoods");
    		localStorage.removeItem("minBeginDate");
    		
        	window.location.href="#cityNews/addSaleActivity";
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
        		window.location.href = "#cityNews/addSaleActivity";
        	}else if(type == "new"){
        		window.location.href = "#cityNews/addNewActivity";
        	}else if(type == "helis"){
        		window.location.href = "#cityNews/addHelisActivity";
        	}
        }
    },
    "cityNews/editSaleActivity":{
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
        										'库存<input class="input" type="tel"   id="skuStock_'+selectGoods[i].sku[0].skuId+'" name="sku_stock" goodsId="'+selectGoods[i].goodsId+'" skuId="'+selectGoods[i].sku[0].skuId+'" onkeyup="inputValidate.onlyInteger(this,1)" value="'+selectGoods[i].sku[0].stock+'"/>'+
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
    		if($("#orderValiditySpan").hasClass("open") && $("#orderValidityInput").val() != "" && $("#orderValidityTime").val() != ""){
    			var temp = $("#orderValidityInput").val()+" "+$("#orderValidityTime").val();
    			localStorage.setItem("activity_orderValidity",temp);
    		}
    		
    		window.location.href="#cityNews/alteration?goodsId="+goodsId+"&type=edit&activityId="+$("#id").val();
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
    		if($("#orderValiditySpan").hasClass("open") && $("#orderValidityInput").val() != "" && $("#orderValidityTime").val() != ""){
    			var temp = $("#orderValidityInput").val()+" "+$("#orderValidityTime").val();
    			localStorage.setItem("activity_orderValidity",temp);
    		}
    		
    		window.location.href='#cityNews/selectionGoods?type=edit&activityId='+$("#id").val();
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
        		window.location.href="#cityNews/cityNews";
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
            		
            		window.location.href="#cityNews/cityNews";
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
    "cityNews/addSaleActivity" : {
    	_title:"添加商讯",
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
        			$("#orderValiditySpan").show();
        			$("#orderValidityOpen").addClass("open");
        			$("#orderValidityOpen").prop("checked","checked");
    			}else{
    				$("#orderValidityInput").val(tempEndDateInput);
        			$("#orderValidityTime").val(tempEndTime);
        			$("#orderValiditySpan").hide();
        			$("#orderValidityOpen").removeClass("open");
        			$("#orderValidityOpen").prop("checked","");
    			}
    		}else{
    			//获取开始时间和结束时间
    			$.get("activity/getActivityDate.shtml",{type:"cityNews"},function(data){
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
        										'￥<input class="input" type="number" id="skuPrice_'+selectGoods[i].sku[0].skuId+'" name="sku_price" goodsId="'+selectGoods[i].goodsId+'" skuId="'+selectGoods[i].sku[0].skuId+'" onkeyup="inputValidate.onlyFloat(this,0.01)" value="'+selectGoods[i].sku[0].price+'"/>'+
        										'库存<input class="input" type="tel" id="skuStock_'+selectGoods[i].sku[0].skuId+'" name="sku_stock" goodsId="'+selectGoods[i].goodsId+'" skuId="'+selectGoods[i].sku[0].skuId+'" onkeyup="inputValidate.onlyInteger(this,1)" value="'+selectGoods[i].sku[0].stock+'"/>'+
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
    		
    		window.location.href="#cityNews/alteration?goodsId="+goodsId;
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
    		
    		window.location.href='#cityNews/selectionGoods';
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
        			return false;
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
        		window.location.href="#cityNews/cityNews";
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
    	    		
    	    		window.location.href="#cityNews/cityNews";
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
    /*选择商品*/
    "cityNews/selectionGoods": {
    	_title:"选择商品",
        _footer : false,
        _links : {
    		"js/inputValidate.js":"js"
		},
        pageNum : 1,
        pageSize: 10,
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
	        $(document).not(".screen-box").click(function(){
	            if($(".option").css('display')=='block'){
	                $(".option").hide();
	            }
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
        		window.location.href="#cityNews/addSaleActivity";
        	}else if(type == 'edit'){
        		var activityId = $("#activityId").val();
        		window.location.href="#cityNews/editSaleActivity?id="+activityId+"&editFlag=edit";
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
        	$("[name='selectGoodsCount']").html(selectGoods.length);
        	
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
        					var goodsJSON = {"goodsId":goodsId,"name":name,"image":image,"goodsTypeId":goodsTypeId,"skuCount":data.length,"consumeTips":consumeTips,"cowrieStatus":cowrieStatus,"sku":skuArray};
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
    "cityNews/addNewActivity" : {
    	_links:{
    		"js/extra.js":"js"
    	},
    	_title:"添加店铺活动",
    	_footer:false,
    	_load:function(){
    		//获取开始时间和结束时间
			$.get("activity/getActivityDate.shtml",{type:"cityNews"},function(data){
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
    		
    		var minBeginDate = $("#minBeginDate").val();
    		if($("#beginDate").val() == ""){
    			alert("请选择活动开始时间！");
    			return false;
    		}
    		if($("#endDate").val() == ""){
    			alert("请选择活动结束时间！");
    			return false;
    		}
    		var minBeginDate = $("#minBeginDate").val();
    		var beginDate =$("#beginDate").val();
    		var endDate=$("#endDate").val();
    		beginDate = $.Date(beginDate).getTime();
    		endDate = $.Date(endDate).getTime();
    		minBeginDate = $.Date(minBeginDate).getTime();
    		if(beginDate < minBeginDate){
    			alert("开始时间必须大于当前时间30分钟！");
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
    			window.location.href="#cityNews/cityNews";
    		}else{
    			alert(data.errorMsg);
    		}
    	}
    },
    "cityNews/editNewActivity" : {
    	_links:{
    		"js/extra.js":"js"
    	},
    	_title:"编辑新活动",
    	_footer:false,
    	_datas:POST("activity/getActivityInfo.shtml",{id:PARAM("id")},function(data){
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
    		var minBeginDate = $("#minBeginDate").val();
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
    			alert("开始时间必须大于当前时间30分钟");
    			return false;
    		}
    		var timeDisparity = (endDate - beginDate)/1000;
    		if(timeDisparity < 60*60){
    			alert("结束时间要大于开始时间1小时！");
    			return false;
    		}
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
    			window.location.href="#cityNews/cityNews";
    		}else{
    			alert(data.errorMsg);
    		}
    	}
    },
    /*编辑已有活动*/
    "cityNews/editHelisActivity" : {
    	_title:"编辑已有活动",
    	_footer:false,
    	flag:true,
    	backFlag:false,
    	_load: function(){
    		var id = this._param.id;
    		$("#id").val(id);
    		var ctrl = this;
    		$.ajax({
    			url:"cityNews/getForwardingList.shtml",
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
    			
    		});
    	},
    	getActivityInfo:function(){
    		var id= $("#id").val();
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
    					}
    				}
    			},
    			error:function(data){
    				
    			}
    		});
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
    			url:"cityNews/updateForwardingGiftsActivity.shtml",
    			data:{id:$("#id").val(),forwardingGiftsId:forwardingGiftsId},
    			type:"post",
    			dataType:"json",
    			async:true,
    			success:function(data){
    				if(data.status == 1){
    					alert("保存成功",2000);
    					window.location.href = "#cityNews/cityNews";
    				}else{
    					alert(data.errorMsg);
    				}
    			},
    			error:function(data){
    				
    			}
    		});
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
    "cityNews/addHelisActivity" : {
    	_title:"添加已有活动",
    	_footer:false,
    	flag:true,
    	backFlag:false,
    	_load: function(){
    		$.ajax({
    			url:"cityNews/getForwardingList.shtml",
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
    			
    		});
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
    			url:"cityNews/saveForwardingGiftsActivity.shtml",
    			data:{forwardingGiftsId:forwardingGiftsId},
    			type:"post",
    			dataType:"json",
    			async:true,
    			success:function(data){
    				if(data.status == 1){
    					alert("保存成功",2000);
    					window.location.href = "#cityNews/cityNews";
    				}else{
    					alert(data.errorMsg);
    				}
    			},
    			error:function(data){
    				
    			}
    		});
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
    /**同城商讯*/
    "cityNews/cityInfo":{
    	_title:"同城商讯",
    	_footer:false,
    	_links:{
            "http://webapi.amap.com/maps?v=1.3&key=e53e463d097f2a084e06b07441bc7048&plugin=AMap.CloudDataSearch":"js"
        },
    	pageNum : 1,
    	pageSize : 6,
    	hasMore : true,
    	longitude:0,
    	latitude:0,
    	_style:"\
    		html{height:auto;}\
    	",
    	_load:function(){
    		var ctrl = this;
    		var hi=$(document).height();
    		var sum=$(window).height();
            var nav=$('header').outerHeight();
            var num=sum-(nav*2);
            var hdhi=$('.con-hd>a').outerHeight();
            $('#areaLi').css("max-height",num-hdhi);
           
    		/*全城*/
    		$(".con-hd>a").click(function(){
    			if($(".con-hd>ol").is(":visible")){
    				$(".theme-popover-mask").hide(500);
        			$(".con-hd>ol").hide(300);
        			$("body").css({"height":"auto","overflow":"auto"});
        			$(".con-hd").css("height","auto");
    			}else{
    				$(".theme-popover-mask").show(300);
        			$(".con-hd>ol").show(500);
        			$("body").css({"height":hi,"overflow":"hidden"});
        			$(".con-hd").css("height",num);
    			}
    		})
    	
    		$(".theme-popover-mask").add(".con-hd>ol").click(function(){
    			$(".theme-popover-mask").hide(500);
    			$(".con-hd>ol").hide(300);
    			$(".con-hd").css("height","auto");
    			$("body").css({"height":"auto","overflow":"auto"});
    		})
    		
    		this.loadAreaData();//加载地区相关资料
    		this.getCityNewsList(); //获取同城商讯列表
    		
    		//触底加载
            setREG("document_scroll", this._name, function(){
                if(ctrl.hasMore && $.getScrollBottom()<3){
                	ctrl.pageNum++;
                	ctrl.getCityNewsList();
            	}
            });
    	},
    	//获取同城商讯数据
    	getCityNewsList : function(){
    		var ctrl = this;
    		$.getPosition(function(x,y,cityname){
    			ctrl.longitude = x;
    			ctrl.latitude = y;
    			ctrl.loadData(true);
    		});
    	},
    	loadData:function(localSearch){
    		var ctrl = this;
    		var url = "";
    		var parentAreaId = null;
    		var areaId = $("#areaId").val();
    		var areaSearch = false;
    		if(areaId < 0){
    			url = "index/cityNewsList.shtml";
    		}else{
    			url = "index/cityNewsListByArea.shtml";
    			if(areaId < 1){
    				areaId = null;
    				parentAreaId = Config.area.id;
    			}
    			areaSearch = true;
    		}
    		$.get(Config.basePath+url,{
				pageNum : ctrl.pageNum,
				pageSize : ctrl.pageSize,
				position : ctrl.longitude+","+ctrl.latitude,
				areaId : areaId,
				parentAreaId: parentAreaId
			},function(datas){
				$(".reminder").css("display","none");
				
				if(!areaSearch && localSearch && (datas.data.activityList == null || datas.data.activityList.length < 1)){
					$("#searchArea").click();
					return ;
				}
				if(datas.data == null || datas.data.activityList == null || datas.data.activityList.length < 1){
					ctrl.hasMore = false;
					if($(".content div[class='unit clearfix']").length < 1){
						$(".reminder").css("display","block");
					}
					return;
				}
				var activityList = datas.data.activityList;
				if(activityList.length < 6){
					ctrl.hasMore = false;
				}
				var gaodeIds=[];
				var tempTab='<i class=\"iconfont color-orange\">&#xe616;</i>';
				for(var i = 0;i < activityList.length;i++){
					var temp = "";
					var distance = "";
					var distanceId ="";
					if(!areaSearch){
						if(activityList[i].distance < 10000){
							distance = tempTab+((activityList[i].distance/1000).toFixed(0))+"km";
						}else{
							distance = tempTab+ activityList[i].distance+"m";
						}
					}else if(areaSearch && activityList[i].gaodeId && ctrl.longitude > 0 && ctrl.latitude > 0){
						gaodeIds.push(activityList[i].gaodeId);
						distanceId = 'id="distance_'+activityList[i].gaodeId+'"';
					}else{
						distance = activityList[i].shopArea;
					}
					if(activityList[i].activityType == "sales"){ //带商品的
						var goodsList = activityList[i].goodsList;
						var goodsTemp = "";
						for(var j = 0;j < goodsList.length;j++){
							goodsTemp += '<div class="pic m-top10" onclick="this.ctrl.toGoodsDetail('+activityList[i].activityId+','+goodsList[j].goodsId+',\''+goodsList[j].goodsCowrieStatus+'\')" style="background-image:url('+Config.imgPre + goodsList[j].goodsImage+')"></div>';
						}
						temp += '<div class="unit clearfix">\
	    							<div class="icon kdl-left" onclick="this.ctrl.toShopDetail('+activityList[i].shopId+')">\
			    						<img src="'+Config.imgPre + activityList[i].shopAvatar+'"/>\
			    						<p>'+activityList[i].shopName+'</p>\
			    					</div>\
			    					<div class="detail kdl-left">\
			    						<h5 class="clearfix" onclick="this.ctrl.toActivityDetail('+activityList[i].activityId+',\''+activityList[i].activityType+'\',\''+activityList[i].activityDataId+'\','+activityList[i].shopId+')">\
			    							<div>\
			    								<div class="title">'+activityList[i].title+'</div>\
			    								<p class="color-graya">'+activityList[i].createDate+'<span class="kdl-right" '+distanceId+'>'+distance+'</span><span class="kdl-right" style="margin-right:.2rem;"><i class="iconfont color-grayc middle">&#xe69c;</i>'+activityList[i].activityViewCount+'</span></p>\
			    							</div>\
			    						</h5>\
			    						<p class="text ellips">'+(activityList[i].description?activityList[i].description:"")+'</p>';
			    						if(activityList[i].orderValidity){
			    							temp += '<p class="color-graya">订单有效期'+activityList[i].orderValidity+'</p>'; 
			    						}
			    				temp +=
			    						goodsTemp+'\
			    					</div>\
			    				</div>';
					}else{ //不带商品的
						temp += '<div class="unit clearfix">\
	    							<div class="icon kdl-left" onclick="this.ctrl.toShopDetail('+activityList[i].shopId+')">\
			    						<img src="'+Config.imgPre + activityList[i].shopAvatar+'"/>\
			    						<p>'+activityList[i].shopName+'</p>\
			    					</div>\
			    					<div class="detail kdl-left" onclick="this.ctrl.toActivityDetail('+activityList[i].activityId+',\''+activityList[i].activityType+'\',\''+activityList[i].activityDataId+'\','+activityList[i].shopId+')">\
			    						<h5 class="clearfix">\
			    							<div>\
			    								<div class="title">'+activityList[i].title+'</div>\
			    								<p class="color-graya">'+activityList[i].createDate+'<span class="kdl-right" '+distanceId+'>'+distance+'</span><span class="kdl-right" style="margin-right:.2rem;"><i class="iconfont color-grayc middle">&#xe69c;</i>'+activityList[i].activityViewCount+'</span></p>\
			    							</div>\
			    						</h5>\
			    						<p class="text ellips">'+(activityList[i].description?activityList[i].description:"")+'</p>\
			    						<div class="banner">\
			    							<img src="'+Config.imgPre + activityList[i].image+'"/>\
			    						</div>\
			    					</div>\
			    				</div>';
					}
					$("#contentDiv").append(temp);
				}
				if(areaSearch && gaodeIds.length > 0 && ctrl.longitude > 0 && ctrl.latitude > 0){
					var search;
					var searchOptions = {
						keywords: '',
						orderBy: '_id:ASC'
					};
					
					for(var j=0;j<gaodeIds.length;j++){
						var gaodeId = gaodeIds[j];
	        		    //加载CloudDataSearch服务插件
	        		    AMap.service(["AMap.CloudDataSearch"], function() {
	        		    	search = new AMap.CloudDataSearch('577f95bc7bbf1936b142344a', searchOptions); //构造云数据检索类
	        		        search.searchById(gaodeId,function(status,result){
	        		        	if(status === 'complete' && result.info === 'OK'){
	        		        		var current = new AMap.LngLat(ctrl.longitude,ctrl.latitude);
	        		            	var lnglat = new AMap.LngLat(result.datas[0]._location.lng,result.datas[0]._location.lat);
	        		            	var range = current.distance(lnglat);
	        		            	if(range > 10000){
	        		            		$("#distance_"+result.datas[0]._id).html(tempTab+(range/1000).toFixed(0)+"km");
	        		            	}else{
	        		            		$("#distance_"+result.datas[0]._id).html(tempTab+range+"m");
	        		            	}
	        		        	}
	        		        });
	        		    });
					}
				}
			});
    	},
    	selectArea:function(obj){
    		$(obj).addClass("color-red").parent().siblings().find("a").removeClass("color-red");
			$(obj).find("i").addClass("color-red");
			$(obj).parent().siblings().find("i").removeClass("color-red");
			$(".theme-popover-mask").hide(500);
			$(".con-hd>ol").hide(300);
			var cityNames=$(obj).find('span').text();
			$(".con-hd>a>span").html(cityNames);
			this.pageNum = 1;
			this.hasMore = true;
			var areaId = $(obj).attr("areaId");
			$("#areaId").val(areaId);
			this.loadData(false);
			$("#contentDiv").html("");
    	},
    	loadAreaData:function(){
    		var parentId = Config.area.id;
    		$.get(Config.basePath+"area/findAreas.shtml",{parentId:parentId},function(datas){
    			if(datas.status == 1 && datas.data.areaList != null && datas.data.areaList.length > 0){
    				var html = "";
    				var list = datas.data.areaList;
					for(var i=0;i<list.length;i++){
    					html+='<li>'+
    								'<a href="javascript:;" onclick="this.ctrl.selectArea(this);" areaId="'+list[i].id+'"><span>'+list[i].name+'</span><i class="iconfont kdl-right">&#xe653;</i>  </a>'+
    						  '</li>';
    				}
    				
    				$("#areaLi").append(html);
    			}
    		});
    	},
    	//进入店铺页面
    	toShopDetail : function(shopId){
    		GO("shop/shops",{shopId:shopId});
    	},
    	//进入活动详情
    	toActivityDetail : function(activityId,activityType,dataId,shopId){
    		if(activityType == "sales"){ //促销活动
    			GO("cityNews/promotionDetails",{activityId:activityId});
    		}else if(activityType == "shop"){ //店铺活动
    			GO("cityNews/activityDetails",{activityId:activityId});
    		}else{ //转发有礼
    			//添加浏览量
        		$.post(Config.basePath + "common/addView.shtml",{
        			activityId : activityId
        		});
    			GO("forwardingGifts/forwardingDetails",{shopId:shopId,forwardingGiftsId:dataId});
    		}
    	},
    	//进入商品详情页
    	toGoodsDetail : function(activityId,goodsId,goodsCowrieStatus){
    		if(goodsCowrieStatus == "pass"){ //宝贝库商品详情
    			GO("goods/details",{goodsId:goodsId,shopId:1});
    		}else{ //非宝贝库商品详情
    			GO("goods/details",{goodsId:goodsId});
    		}
    	},
    },
    /*变更促销价*/
    "cityNews/alteration":{
    	_title:"变更促销价格/库存",
        _footer : false,
        _links : {
    		"js/inputValidate.js":"js"
		},
        _load:function(){
        	var goodsId = this._param.goodsId;
        	var activityId = this._param.activityId;
        	$("#activityId").val(activityId);
        	if(goodsId == null || goodsId == ""){
        		window.location.href="#cityNews/addSaleActivity";
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
        		window.location.href="#cityNews/addSaleActivity";
        		return false;
        	}
        	var html="";
        	for(var i=0;i<skuList.length;i++){
        		html += '<tr>'+
			    			'<td>'+
			    				skuList[i].skuValue+
							'</td>'+
							'<td><input id="skuPrice_'+skuList[i].skuId+'" type="tel" placeholder="促销价" onkeyup="inputValidate.onlyFloat(this,0.01)" value="'+skuList[i].price+'"/></td>'+
							'<td><input id="skuStock_'+skuList[i].skuId+'" type="tel" placeholder="促销库存" onkeydown="inputValidate.onlyInteger(this,1)" value="'+skuList[i].stock+'"/></td>'+
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
        		window.location.href="#cityNews/editSaleActivity?id="+$("#activityId").val()+"&editFlag=edit";
        	}else{
        		window.location.href="#cityNews/addSaleActivity";
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
    /*说明*/
    "cityNews/explain":{
    	_title:"说明",
    	_footer:false,
    	_load:function(){
    		
    	}
    },
    
    /**促销详情*/
    "cityNews/promotionDetails":{
    	_title:"促销详情",
    	_footer:false,
    	_datas: GET("index/toActivityDetail.shtml",{activityId:PARAM("activityId")}),
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
            		DO("passport/login");
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
            $.wxShare();
    	}
    },
    /** 活动详情页面 */
    "cityNews/activityDetails": {
        _title:"活动详情",
        _footer:false,
        _datas: GET("index/toActivityDetail.shtml",{activityId:PARAM("activityId")}),
        _load: function(){
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
            $.wxShare();
        }
    }
    
    
});

})();