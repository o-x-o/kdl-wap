(function(){
	/*公用变量和方法*/
	//离开页面的时候清除
	var returnsInfo = null;
	FORMAT({
		
		
	    /*售后服务*/
	    "returns/selectReturns": {
	        _title: "售后服务",
	        _footer: false,
	        _links:{
	        	"js/inputValidate.js":"js",
	        	"plugin/jquery.md5.js" : "js"
	        },
	        _template:{url:"view/returns/selectReturns.ejs"},
	        _datas: {
	        	data:GET("returns/selectReturns.shtml",{orderId:PARAM("orderId",0)},function(data,ctrl){
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
	        	$.each(this._datas.data.orderItems,function(index,orderItem){
	        		console.log(orderItem);
	        	})
	        },
	        minus : function(obj,min,max){
	        	var $addBtn = $(obj).next().next();
	        	var curVal = parseInt($(obj).next().val())-1;
	        	if(curVal<min){
	        		curVal=min;
	        	}
	        	if($addBtn.attr("disabled")=="disabled" && curVal<max){
	        		$addBtn.removeAttr("disabled");
	        	}
	        	$(obj).next().val(curVal)
	        	if(curVal<=1){
	        		$(obj).attr("disabled","disabled");
	        	}
	        	var $item =  $(obj).prev()
	        	$item.val($item.val().substring(0,$item.val().indexOf('_')+1)+curVal);
	        },
	        add : function(obj,min,max){
	        	var $addBtn = $(obj).prev().prev();
	        	var curVal = parseInt($(obj).prev().val())+1;
	        	if(curVal>max){
	        		curVal=max;
	        	}
	        	if($addBtn.attr("disabled")=="disabled" && curVal>min){
	        		$addBtn.removeAttr("disabled");
	        	}
	        	$(obj).prev().val(curVal)
	        	if(curVal>=max){
	        		$(obj).attr("disabled","disabled");
	        	}
	        	var $item =  $(obj).prev().prev().prev();
	        	$item.val($item.val().substring(0,$item.val().indexOf('_')+1)+curVal);
	        },
	      //只可以输入整数
	    	onlyInteger  : function (obj,min,max) {  
	    		//先把非数字的都替换掉，除了数字和.   
	    		obj.value = obj.value.replace(/\D/g,'');   
	    		//是否小于最小值
	    		if(min != ""){
	    			if(parseFloat(obj.value)<=parseFloat(min)){
	    				obj.value = parseFloat(min)+"";
	    				if(max>1){
	    					$(obj).prev().attr("disabled","disabled");
	    					$(obj).next().removeAttr("disabled","disabled");
	    				}
	    			}  
	    		}
	    		//是否大于最大值
	    		if(max !=""){
	    			if(parseFloat(obj.value)>=parseFloat(max)){
	    				obj.value = parseFloat(max)+"";
	    				if(max>1){
	    					$(obj).prev().removeAttr("disabled","disabled");
	    					$(obj).next().attr("disabled","disabled");
	    				}
	    			}
	    		}
	    		if(min != "" && max != ""){
	    			if(parseFloat(obj.value)<parseFloat(max) && parseFloat(obj.value)>parseFloat(min)){
	    				if($(obj).next().attr("disabled")=="disabled"){
	    					$(obj).next().removeAttr("disabled");
	    	        	}
	    				if($(obj).prev().attr("disabled")=="disabled"){
	    					$(obj).prev().removeAttr("disabled");
	    				}
	    			}
	    		}
	    		var $item =  $(obj).prev().prev();
	        	$item.val($item.val().substring(0,$item.val().indexOf('_')+1)+obj.value);
	    	},
	    	inputInt : function(obj){
	    		if($(obj).val()==""){
	    			$(obj).val(1);
	    		}
	    		var $item =  $(obj).prev().prev();
	        	$item.val($item.val().substring(0,$item.val().indexOf('_')+1)+$(obj).val());
	    	},
	    	selectItem : function(obj){
	    		if($(obj).hasClass("color-red")){
	    			$(obj).removeClass("color-red");
	    			$(obj).html("&#xe693;");
	    			$($(obj).parent().find("input[type='hidden']")).removeAttr("name");
	    			var selectQuantity = $("li input[name]").length;
	    			if(selectQuantity<=0){
	    				$("#toApply").removeClass("bg-red")
	    			}
	    		}else{
	    			$("#toApply").addClass("bg-red");
	    			$(obj).addClass("color-red");
	    			$(obj).html("&#xe694;");
	    			$($(obj).parent().find("input[type='hidden']")).attr("name","selStr");
	    		}
	    	},
	    	orderReturns : function(orderId){
	    		GO("returns/orderReturns",{orderId:orderId});
	    	},
	    	toProductDetails : function(goodsId,shopId,speConId){
            	if(speConId==null){
	        		GO("goods/details",{goodsId:goodsId,shopId:shopId},".sub_container");
	        	}else{
	        		GO("goods/details",{goodsId:goodsId,shopId:shopId,specialtyContentId:speConId},".sub_container");
	        	}
            },
            afterSaleHelp : function(){
            	GO("returns/afterSaleHelp",{},".sub_container");
            },
	    	toSubmitOrder: function(obj){
	        	if($(obj).hasClass("bg-red")){
	        		$("form").submit();
	        	}else{
	        		return false;
	        	}
	        },
	        submitCall : function(response, param){
	        	$.ajax({
					url:"returns/returnsInfo.shtml",
					data:param,
					async:false,
					dataType:"json",
					type:"post",
					success:function(data){
						if(data.status==0){
							alert(data.errorMsg);
							return false;
						}else{
							DO("returns/returnsApply",param);
						}
					},
					error:function(data){
						alert("亲，系统错误请您稍后再试！");
					}
				});
	        }
	    },
	    /*申请售后*/
	    "returns/returnsApply": {
	    	_title: "申请售后",
            _template:{url:"view/returns/returnsApply.ejs"},
            _links:{
	        	"js/extra.js":"js",
	        },
	        _datas: {
	    		data:POST("returns/returnsInfo.shtml",{orderId:PARAM("orderId",null),selStr:PARAM("selStr",null)},function(data, ctrl){
	    			if(data instanceof Error){
	    				history.go(-1);
	    				ctrl._goError=false;
		        		alerts(data.message);
		        	}else{
		        		return data;
		        	}
	    		}),
	    	},
            _footer: false,
            _load: function () {
            	$("#selShipping label").click(function(){
            		$("#shippingMethodId").val($(this).attr("name"));
            		$(this).attr("class","red").siblings('label').attr("class","gray");
            	})
            },
            _events:{
            	".reasons p":function(){
            		$(".reasons p").removeClass("cur");
            		$(".curReason").removeClass("color-graya").addClass("color-gray6").text($(this).addClass("cur").text());
            		$(".reasonValue").val($(this).attr("value"));
            		setTimeout(function(){
            			$("html,body").loadingWrapCancel();
                		$(".reasons").hide();
            		},200);
            	}
            },
            imgs:function(){
            	return $(this._dom).find("ul.imgs");
            },
            imgLi:function(){
            	return $(this._dom).find("ul.imgs").children("li");
            },
            toUpload : function(ul){
            	if(this.imgLi().length>=4){
            		alert("一个商品最多可上传4张图片!");
            		return false;
            	}
            	this.uploadImage();
	        },
	        deleteImage : function($li){
	        	alert("确认删除图片吗？",true,function(flag){
	        		if(flag){
		        		$li.remove();
		        		$("ul.imgs>li").initImgTouch();
	        		}
	        	});
	        },
	        uploadImage : function(){
	        	var ctrl=this;
	        	$.simpleUpload({
            		multiple:false,
            		size:"5M",
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
            				ctrl.imgs().append("<li style='background-image:url("+url+")'><span onclick='$.stopPropagation();this.ctrl.deleteImage($(this).parent())' class='close iconfont'>&#xe652;</span><input type='hidden' name='images' value='"+src+"'/></li>");
            			}
            			$("ul.imgs>li").initImgTouch();
            		}
            	});
	        },
	        selectReason : function(){
	        	$.getMaxWrap().loadingWrap("#333","none",true,function(){$(".reasons").hide();});
	        	$(".reasons").fixCenter(20).show();
	        },
	        toSubmitReturns: function(){
	        	var selReson = $(".reasons p[class='cur']");
	        	if(selReson.length<1){
	        		$.getMaxWrap().loadingWrap("#333","none");
		        	$(".reasons").fixCenter(20).show();
	        		return false;
	        	}
	        	var returnReson = $("#resonValue").val();
	        	$("#returnsReson").val("原因："+selReson.children("span").html()+",详情："+returnReson);
	        	/*var selImage = $("input[name='images']");
	        	if(selImage.length<1){
	        		alert("请添加至少一张退货图片!");
	        		return false;
	        	}*/
	        	$("form").submit();
	        },
	        
	        toProductDetails : function(goodsId,shopId,speConId){
            	if(speConId==null){
	        		GO("goods/details",{goodsId:goodsId,shopId:shopId},".sub_container");
	        	}else{
	        		GO("goods/details",{goodsId:goodsId,shopId:shopId,specialtyContentId:speConId},".sub_container");
	        	}
            },
	        submitCall : function(response, param){
	        	if(response.status==0){
	        		alert(response.errorMsg);
	        		return false;
	        	}
	        	alerts(null,null,"提交成功,请等待商家确认!",3000);
	        	GO("returns/returnsDetail",{returnsId:response.data.returnsId,});
	        }
	    },
	    
	    /*售后进度*/
	    "returns/orderReturns": {
	    	_title: "售后进度",
	    	_footer: false,
	    	_template:{url:"view/returns/orderReturns.ejs"},
	    	orderStatus : null,
	    	_datas: {
	    		data:GET("returns/orderReturns.shtml",{orderId:PARAM("orderId",null)},function(data){
	    			return data;
	    		}),
	    	},
	    	_show :function(){
	    	},
	    	_load: function () {
	    		console.log(this._datas);
	    	},
	    	toDetails : function(returnsId){
	    		GO("returns/returnsDetail",{returnsId:returnsId});
	    	}
	    },
	    /*售后帮助*/
	    "returns/afterSaleHelp": {
	    	_title: "售后进度",
	    	_footer: false,
	    	_template:{url:"view/returns/afterSaleHelp.ejs"},
	    	_show :function(){
	    	},
	    	_load: function () {
	    		console.log(this._datas);
	    	}
	    },
	    /*发起退货*/
	    "returns/returnsShipping": {
	    	_title: "售后进度",
	    	_links:{
	    		"js/loadArea.js":"js",
	        },
	    	_footer: false,
	    	_template:{url:"view/returns/returnsShipping.ejs"},
	    	_datas: {
	    		data:GET("returns/userShipping.shtml",{returnsId:PARAM("returnsId",null)},function(data){
	    			return data;
	    		}),
	    	},
	    	_show :function(){
	    		if(this._param.expressId!=null){
	    			$("#curExpressId").val(this._param.expressId);
	    			$("#curExpressName").html(this._param.expressName);
	    		}
	    	},
	    	_load: function () {
	    		if(this._param.returnsId!=null){
	    			$("#returnsId").val(this._param.returnsId);
	    		}
	    	},
	    	toSelExpress : function(){
        		var curExpressId = $("#curExpressId").val();
        		GO("returns/busLogistics",{returnsId:this._param.returnsId,curExpressId:curExpressId==""?null:curExpressId,type:1},".sub_container");
        	},
        	toSubmit : function(){
        		if($("#curExpressId").val()==""){
        			alert("请选择快递公司!");
        			return false;
        		}
        		if($("#trackingNo").val()==""){
        			alert("请填写真实有效的快递单号!");
        			return false;
        		}
        		if($("#returnsId").val()==""){
        			alert("退货单异常");
        			return false;
        		}
        		$("form").submit();
        	},
	    	submitCall : function(response){
	    		if(response.status==0){
	        		alert(response.errorMsg);
	        		return false;
	        	}
	        	GO('returns/returnsDetail',{returnsId:response.data.returnsId});
	    	}
	    },
	    /*物流公司*/
        "returns/busLogistics": {
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
                    if(ctrl._param.type==1){
                    	GO("returns/returnsShipping",{returnsId:ctrl._param.returnsId,expressId:expressId,expressName:expressName});
                    }else if(ctrl._param.type==2){
                    	GO("returns/shippingDetails",{returnsId:ctrl._param.returnsId,expressId:expressId,expressName:expressName});
                    }
                    $("body").scrollTop($("li").outerHeight()*3)
                })
            }
        },
        /*发货详情页面*/
	    "returns/shippingDetails": {
	    	_title: "售后进度",
	    	_links:{
	    		"js/loadArea.js":"js",
	        },
	    	_footer: false,
	    	_template:{url:"view/returns/shippingDetails.ejs"},
	    	_datas: {
	    		data:GET("returns/shipping.shtml",{returnsId:PARAM("returnsId",null)},function(data){
	    			return data;
	    		}),
	    	},
	    	_show :function(){
	    		if(this._param.expressId!=null){
	    			$("#curExpressId").val(this._param.expressId);
	    			$("#curExpressName").html(this._param.expressName);
	    		}
	    	},
	    	_load: function () {
	    		console.log(this._datas.data);
	    		if(this._param.returnsId!=null){
	    			$("#returnsId").val(this._param.returnsId);
	    		}
	    	},
	    	toSelExpress : function(){
        		var curExpressId = $("#curExpressId").val();
        		GO("returns/busLogistics",{returnsId:this._param.returnsId,curExpressId:curExpressId==""?null:curExpressId,type:2},".sub_container");
        	},
        	toSubmit : function(){
        		if($("#curExpressId").val()==""){
        			alert("请选择快递公司!");
        			return false;
        		}
        		if($("#trackingNo").val()==""){
        			alert("请填写真实有效的快递单号!");
        			return false;
        		}
        		if($("#returnsId").val()==""){
        			alert("退货单异常");
        			return false;
        		}
        		$("form").submit();
        	},
	    	submitCall : function(response){
	    		if(response.status==0){
	        		alert(response.errorMsg);
	        		return false;
	        	}
	    		GO('returns/returnsDetail',{returnsId:response.data.returnsId});
	    	}
	    },
	   
	});
})();
