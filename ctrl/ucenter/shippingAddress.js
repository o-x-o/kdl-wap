(function(){
	/*公用变量和方法*/
	var _toOrder = false;
	var _skuId=null;
	var _speConId=null;
	var _shopId=null;
	var _quantity=null;
	var _useAddressId = null;
	FORMAT({
	
		/*收货地址列表*/
	    "ucenter/shippingAddress": {
	    	_template:{url:"view/ucenter/shippingAddress/shippingAddress.ejs"},
	        _title:"收货地址列表",
	        _links:{
	        	"js/extra.js":"js"
	        },
	        _datas: {
	        	data:POST("ucenter/shippingAddress.shtml",{},function(data){
	        		return data;
	        	}),
	        },
	        _footer:false,
	        _load: function(){
	        	var ctrl = this;
	        	if(Boolean(this._param.toOrder) == true){
	        		_toOrder = true;
	        		if(typeof(this._param.skuId) != "undefined" && typeof(this._param.speConId) == "undefined"){
	        			_skuId=this._param.skuId;
	        			_quantity=this._param.quantity;
	        			if(typeof(this._param.shopId) != "undefined" ){
	        				_shopId=this._param.shopId;
	        			}
	        		}else if(typeof(this._param.skuId) == "undefined" && typeof(this._param.speConId) != "undefined"){
	        			_speConId=this._param.speConId;
	        			_quantity=this._param.quantity;
	        			if(typeof(this._param.shopId) != "undefined" ){
	        				_shopId=this._param.shopId;
	        			}
	        		}
	        		if(typeof(this._param.addressId) != "undefined"){
	        			_useAddressId = this._param.addressId;
	        		}
	        	}
	        	//console.log("_toOrder::"+_toOrder+"_skuId::"+_skuId+"_speConId::"+_speConId+"_shopId::"+_shopId+"_quantity::"+_quantity);
	        	$("#addressList li").click(function(){
	        		if(_toOrder){
	        			var shippingAddress = ctrl._datas.data.addressList[$(this).children("input").val()];
	        			if(_skuId!=null){
	        				GO("order/retailOrder",{shopId:_shopId,skuId:_skuId,quantity:_quantity,shippingAddressId:shippingAddress.id,receiver:shippingAddress.receiver,phone:shippingAddress.phone,address:shippingAddress.address});
	        			}else if(_speConId!=null){
	        				GO("order/retailOrder",{shopId:_shopId,speConId:_speConId,quantity:_quantity,shippingAddressId:shippingAddress.id,receiver:shippingAddress.receiver,phone:shippingAddress.phone,address:shippingAddress.address});
	        			}else{
	        				GO("order/retailOrder",{shippingAddressId:shippingAddress.id,receiver:shippingAddress.receiver,phone:shippingAddress.phone,address:shippingAddress.address});
	        			}
	        		}else{
	        			return ;
	        		}
	        	})
	        },
	        submitCall : function(response){
	        	if(response.status==0){
	        		alert(response.errorMsg);
	        		return false;
	        	}
	        	RELOAD();
	        },
	        editBtn : function(addressId){
	        	var eve = window.event;
	        	eve.stopPropagation();
    			GO('ucenter/editAddress',{shippingAddressId:addressId});
	        },
	        addBtn : function(){
	        	var eve = window.event;
	        	eve.stopPropagation();
	        	GO("ucenter/addAddress");
	        },
	        deleteBtn : function(shippingAddressId,obj){
	        	var eve = window.event;
            	eve.stopPropagation();
            	if(shippingAddressId==0){
            		return false;
            	}
	        	alert("确认要删除？", function(flag){
	        		if(flag){
	        			$.ajax({
	        				url:"ucenter/deleteAddress.shtml",
	        				data:{"shippingAddressId":shippingAddressId},
	        				async:false,
	        				dataType:"json",
	        				type:"post",
	        				success:function(data){
	        					if(data.status==0){
	        						alert(data.errorMsg);
	        						return false;
	        					}
	        					alert(null,null,"删除成功!",1000);
	        					if(data.data.defaultAddressId!=null){
	        						$($("#address_"+data.data.defaultAddressId).find("i")).addClass("color-red");
	        						$($("#address_"+data.data.defaultAddressId).find("i")).html("&#xe63d;");
	        					}
	        					$(obj).parent().parent().parent().remove();
	        					/*
	        					if(_toOrder){
	        						GO("ucenter/shippingAddress",{toOrder:true});
	        					}else{
	        						GO("ucenter/shippingAddress");
	        					}*/
	        				},
	        				error:function(data){
	        					alert("亲，系统错误请您稍后再试！");
	        				}
	        			});
	        		}
	        	},true); 
	        },
	        setDefault : function(obj,shippingAddressId){
	        	var eve = window.event;
            	eve.stopPropagation();
	        	if($(obj).hasClass("color-red")){
            		return false;
            	}else{
            		$.ajax({
        				url:"ucenter/setDefaultAddress.shtml",
        				data:{"shippingAddressId":parseFloat(shippingAddressId)},
        				async:false,
        				dataType:"json",
        				type:"post",
        				success:function(data){
        					if(data.status==0){
        						alert(data.errorMsg);
        						return false;
        					}
        					$("#addressList i").removeClass("color-red");
        					$("#addressList i").html("&#xe64f;");
        					$(obj).addClass("color-red");
        					$(obj).html("&#xe63d;");
        					
        				},
        				error:function(data){
        					alert("亲，系统错误请您稍后再试！");
        				}
        			});
            	}
	        }
	    } ,
	    
	    /*添加收货地址*/
	    "ucenter/addAddress": {
	    	_template:{url:"view/ucenter/shippingAddress/addAddress.ejs"},
	        _title:"添加收货地址",
	        _links:{
	        	"js/loadArea.js":"js",
        		"js/inputValidate.js":"js"
	        },
	        _footer:false,
	        _load: function(){
	        	var ctrl = this;
	        	if(Boolean(this._param.toOrder) == true){
	        		_toOrder = true;
	        	}
	            loadArea.showArea();
	        },
	        saveBtn : function(){
	        	var receiver = $("#receiver").val();
	        	if (receiver == "") {
	        		alert("收货人姓名不可以为空！");
	        		return false;
	        	}
	        	var phone = $("#phone").val();
	        	if (!/^1[3|4|5|7|8]\d{9}$/.test(phone)) {
	        		if(phone == ""){
	        			alert("手机号码不可以为空！");
	        		}else{
	        			alert("手机号码格式错误！");
	        		}
					return false;
				}
	        	
	        	var selprovince = $("#selprovince").val();
	        	if(selprovince == "" || selprovince==0){
	        		alert("请选择地区！");
	        		return false;
	        	}
	        	
	        	var selarea = $("#selarea").val();
	        	if(selarea=="" || selarea==0){
	        		alert("请选择完整的地区！");
	        		return false;
	        	}
	        	
	        	var address = $("#address").val();
	        	if(address == ""){
	        		alert("详情地址不可以为空！");
	        		return false;
	        	}
	        	$("form").submit();
	        },
	        submitCall : function(response){
	        	if(response.status==0){
	        		alert(response.errorMsg);
	        		return false;
	        	}
	        	var shippingAddress = response.data.address;
	        	var areaName = response.data.areaName;
	        	if(this._param.toOrder){
	        		var skuId = null;
	        		var speConId = null;
	        		var quantity = null;
	        		var shopId = null;
	        		if(typeof(this._param.skuId) != "undefined" && typeof(this._param.speConId) == "undefined"){
	        			skuId=this._param.skuId;
	        			quantity=this._param.quantity;
	        			if(typeof(this._param.shopId) != "undefined" ){
	        				shopId=this._param.shopId;
	        			}
	        		}else if(typeof(this._param.skuId) == "undefined" && typeof(this._param.speConId) != "undefined"){
	        			speConId=this._param.speConId;
	        			quantity=this._param.quantity;
	        			if(typeof(this._param.shopId) != "undefined" ){
	        				shopId=this._param.shopId;
	        			}
	        		}
	        		if(typeof(this._param.addressId) != "undefined"){
	        			_useAddressId = this._param.addressId;
	        		}
					if(skuId!=null){
        				GO("order/retailOrder",{shopId:shopId,skuId:skuId,quantity:quantity,shippingAddressId:shippingAddress.id,receiver:shippingAddress.receiver,phone:shippingAddress.phone,address:areaName+shippingAddress.address});
        			}else if(speConId!=null){
        				GO("order/retailOrder",{shopId:shopId,speConId:speConId,quantity:quantity,shippingAddressId:shippingAddress.id,receiver:shippingAddress.receiver,phone:shippingAddress.phone,address:areaName+shippingAddress.address});
        			}else{
        				GO("order/retailOrder",{shippingAddressId:shippingAddress.id,receiver:shippingAddress.receiver,phone:shippingAddress.phone,address:shippingAddress.address});
        			}
				}else if(_toOrder){
					GO("ucenter/shippingAddress",{toOrder:true,addressId:_useAddressId});
				}else{
					GO("ucenter/shippingAddress");
				}
	        }
	    },
	    
	    /*编辑收货地址*/
	    "ucenter/editAddress": {
	    	_template:{url:"view/ucenter/shippingAddress/editAddress.ejs"},
	    	_title:"编辑收货地址",
	    	_links:{
	        	"js/loadArea.js":"js",
        		"js/inputValidate.js":"js"
	        },
	    	_datas: {
	    		data:POST("ucenter/showAddress.shtml",{shippingAddressId:PARAM("shippingAddressId",0)},function(data){
	    			return data;
	    		}),
	    	},
	    	_footer:false,
	    	_load: function(){
	    		loadArea.showArea(_datas.data.shippingAddress.area);
	    	},
	    	submitCall : function(response){
	        	if(response.status==0){
	        		alert(response.errorMsg);
	        		return false;
	        	}
	        	if(_toOrder){
					GO("ucenter/shippingAddress",{toOrder:true,addressId:_useAddressId});
				}else{
					GO("ucenter/shippingAddress");
				}
	        },
	        saveBtn : function(){
	        	var receiver = $("#receiver").val();
	        	if (receiver == "") {
	        		alert("收货人姓名不可以为空！");
	        		return false;
	        	}
	        	var phone = $("#phone").val();
	        	if (!/^1[3|4|5|7|8]\d{9}$/.test(phone)) {
	        		if(phone == ""){
	        			alert("手机号码不可以为空！");
	        		}else{
	        			alert("手机号码格式错误！");
	        		}
					return false;
				}
	        	
	        	var selprovince = $("#selprovince").val();
	        	if(selprovince == "" || selprovince==0){
	        		alert("请选择地区！");
	        		return false;
	        	}
	        	
	        	var selarea = $("#selarea").val();
	        	if(selarea=="" || selarea==0){
	        		alert("请选择完整的地区！");
	        		return false;
	        	}
	        	
	        	var address = $("#address").val();
	        	if(address == ""){
	        		alert("详情地址不可以为空！");
	        		return false;
	        	}
	        	$("form").submit();
	        }
	    }
	   
	})
})()