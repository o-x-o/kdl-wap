(function(){

	var param=$.getParam();
	if(param.accessToken!=null){
		$.removeCookie("accessToken");
		$.addCookie("accessToken",param.accessToken);
	}
	if(param.LOCATE!=null){
		localStorage.set("LOCATE", param.LOCATE);
	}
	
	$(function(){
		$.adjustWin();
		$("body").css("opacity","1");
	});
	$(window).resize($.adjustWin);

	/*ajax全局设置*/
	$.ajaxSetup({
		traditional: true /*防止param传数组键名加括号*/
	});
	$(document).ajaxSend(function(event, request, settings) {
		if (!settings.crossDomain) {
			var token = $.getCookie("token");
			if (token != null) {
				request.setRequestHeader("token", token);
			}
		}
	});
	$(document).ajaxComplete(function(event, request, settings) {
		var tokenStatus = request.getResponseHeader("tokenStatus");
		var loginStatus = request.getResponseHeader("loginStatus");
		if (tokenStatus == "accessDenied") {
			var token = $.getCookie("token");
			if (token != null) {
				$.extend(settings, {
					global: false,
					headers: {token: token}
				});
				$.ajax(settings);
			}
		} else if (loginStatus == "accessDenied") {
			setTimeout(function() {
				location.reload(true);
			}, 2000);
		} else if (loginStatus == "unauthorized") {
			alert("对不起，您无此操作权限！");
		}
		
		$.ajaxCall(request.responseText, request, function(res){},window._ctrl);
	});
	


	function getStorageArray(key, force){
		window[key]=(force||Config.storage)?JSON.parse(localStorage[key]||"[]"):[];
	}
	function setStorageArray(key, value, force){
		if((force||Config.storage)&&window[key]){
			if(value!==undefined)window[key].unshift(value);
			window[key].splice(10, window[key].length-10);
			localStorage[key]=JSON.stringify(window[key]);
		}
	}
	function getStorage(key, force){
		window[key]=(force||Config.storage)?JSON.parse(localStorage[key]||"[]"):null;
	}
	function setStorage(key, value, force){
		if(force||Config.storage){
			if(value!==undefined)window[key]=value;
			localStorage[key]=JSON.stringify(window[key]);
		}
	}
	getStorageArray("_openTime");
	setStorageArray("_openTime", new Date());
	
	getStorageArray("_userStack", true);
	getStorageArray("_areaStack", true);
	getStorageArray("_shopAreaStack", true);
	getStorageArray("_errorStack");
	getStorageArray("_ctrlStack");
	getStorageArray("_closeTime");
	
	window._user=window._userStack[0];
	($.getUser=function(call){
		$.request("common/getUser.shtml",function(res,request){
			$.ajaxCall(res, request, function(data){
				if(data.status == "1"){
					if(data.data!=null && data.data.user){
						var user=data.data.user;
						delete user.password;
						delete user.payPassword;
						call && call(user);
						window._user=user;
						return;
					}
				}
				call && call(null);
			}, window._ctrl);
		},"get");
	})();
	
	function init(){
		
		ZINIT(CTRLS, "index", ".page_container", "./ctrl/base.js", "开店啦", function(pageSwitch, onlyShow){

			var ctrl=this,
				$dom=ctrl._dom,
				ratio=$("body").width()/640*100;
			if(ctrl._footer==false){
				$("footer").hide();
				$("body").css("padding-bottom","0");
			}else{
				var foot_a=$("footer li a").removeClass("cur");
				if(ctrl._url.indexOf("ucenter/")>0){
					foot_a.eq(4).addClass("cur");
				}else if(ctrl._url.indexOf("cart/")>0){
					foot_a.eq(3).addClass("cur");
				}else if(ctrl._url.indexOf("shopKeeper/")>0){
					foot_a.eq(1).addClass("cur");
				}else if(ctrl._url=="#index"){
					foot_a.eq(0).addClass("cur");
				}
				$("footer").show();
				$("body").css("padding-bottom","1rem");
			}
			if(pageSwitch){
				$("[class^=tip-]").remove();
				$(".alertBox").hide();
				var clipClose=($("#clipWrap")[0]||{}).close;
				clipClose && clipClose();
				$("html,body").loadingWrapCancel();
			}
			$dom.find("img").loadCall($.adjustWin);
			if(!onlyShow){
				$dom.find("select,input,textarea,button").each(function(){
					if(this.type=="submit"){
						$(this).click(function(){
							$(this).closest("form").submit();
							return false;
						});
					}
					if(this.name && _param!=null){
						var v=_param[this.name];
						if(v!=undefined){
							this.value=v;
						}
					}
				});
				$dom.find(".nav-dropdown a.react").each(function(i,o){
					var href=this.href,
						text=this.text;
					if(href=="javascript:;" || href=="/" || href==location.origin+"/"){
						if(text.indexOf("首页")>0){
							this.href="#index";
						}else if(text.indexOf("搜索")>0){
							this.href="#search/search";
						}else if(text.indexOf("消息")>0){
							this.href="#message/messageLists?userType=member";
						}else if(text.indexOf("客服")>0){
							this.href="#message/chitchat?shopId="+$(this).attr("shopId");
						}
					}
				});
				$dom.find(".nav-wrap-right").click(function(e){
					$.stopPropagation(e);
					if($(".nav-dropdown").css("display")=="none"){
						$(".nav-dropdown").show();
					}else{
						$(".nav-dropdown").hide();
					}
				});
			}
			function RegisterNowHide(){
				if($dom.find(".RegisterNow").length>0){
					$dom.find(".RegisterNow").hide();
					$dom.find(".navbar").css("top","0");
					$dom.find(".content").removeClass("cur");
					$dom.find(".content").css("padding-top","0");
				}
			}
			function RegisterNowShow(){
				if($dom.find(".RegisterNow").length>0){
					$dom.find(".RegisterNow").show();
					$dom.find(".navbar").css("top",".8rem");
					$dom.find(".content").removeClass("cur");
					$dom.find(".content").css("padding-top",".8rem");
				}
			}
			if(localStorage.get(ctrl._name+"_RegisterNowClose")=="true"){
				RegisterNowHide();
			}else{
				RegisterNowShow();
			}
			/*头部提示*/
			$dom.find(".RegisterNow>i").click(function(){
				RegisterNowHide();
				localStorage.set(ctrl._name+"_RegisterNowClose","true","1day");
			});
			var param=$.getParam();
			if(param){
				if(param.app=="iOS" || param.app=="android" || $.getCookie("app")=="iOS" || $.getCookie("app")=="android"){
					var $header=$dom.find("header").hide(),
						$contentHeader=$dom.find(".contentHeader"),
						$marginTop=$dom.find(".marginTopHead");
					function round(value){
						return Math.round(parseFloat(value));
					}
					function adjust(){
						var height=round($header.outerHeight(true));
						$dom.find(".content").each(function(){
							var padtop=round($(this).css("padding-top"))-height;
							$(this).css("padding-top",padtop>0?padtop:0);
						});
						return height;
					}
					if($contentHeader.length>0 || $marginTop.length>0){
						setTimeout(function(){
							var height=adjust();
							$contentHeader.each(function(i){
								$(this).css("top",round($(this).css("top"))-height);
							});
							$marginTop.each(function(i){
								$(this).css("margin-top",round($(this).css("margin-top"))-height);
							});
						},$.animatime);
					}else{
						adjust();
					}
				}
				if(param.accessToken!=null){
					$.removeCookie("accessToken");
					$.addCookie("accessToken",param.accessToken);
				}
				if(param.TOOLBAR=="false" || param.TOOLBAR==false || localStorage.get("TOOLBAR")=="false"){
					localStorage.set("TOOLBAR", "false");
					$("footer").hide();
				}
				if(param.BACK=="false" || param.BACK==false){
					$("header .nav-wrap-left").hide();
				}
				if(param.LOCATE!=null){
					localStorage.set("LOCATE", param.LOCATE);
				}
			}
			$("em.information").attr("style","display:none!important;");
			$("body").css("overflow","hidden");
			window._hmt && window._hmt.push && window._hmt.push(['_trackPageview', location.hash]);
			$.showUnRead();
		});
		
		$(window).click(function(){
			$(".nav-dropdown").hide();
			$.keys(getREG("document_click"),function(v){
				if(typeof this[v]=="function" && v==_ctrl._name && _ctrl._status=="loaded")this[v]();
			});
		});
		
		$(window).scroll(function(){
			$.keys(getREG("document_scroll"),function(v){
				if(typeof this[v]=="function" && v==_ctrl._name && _ctrl._status=="loaded")this[v]();
			});
		});
	}

	Config.shopArea=window._shopAreaStack[0]||null;
	
	/*先定位areaStack里的值或北京，然后再定位判断，提示修改
	$.get("area/location.shtml",{cityName:"北京"},function(datas){
		Config.area=$.extend({},datas.data?datas.data.area:{});
		init();
	});
	*/
	if(window._areaStack[0]){
		setArea(_areaStack[0], init);
	}else{
		/*if($.isPC()){
			getAreaIP();
		}else{
			$.getPosition(getArea,getAreaIP,100);
		}*/
		$.getPosition(getArea,getAreaIP,100);
	}
	
	function getArea(longitude,latitude){
		if(longitude==0 && latitude==0){
			/*默认抚顺*/
			longitude="123.9635950000";
			latitude="41.8860780000";
		}
		$.ajax({
			url:"area/getUserCity.shtml",
			type:"get",
			data:{longitude:longitude, latitude:latitude},
			success:function(data){
				if(data && data.data && data.data.area){
					setArea(data.data.area, init);
				}else{
					//alert("经纬度定位城市信息失败");
					getAreaIP();
				}
			},
			error:function(error){
				//alert("经纬度定位城市信息失败");
				getAreaIP();
			}
		});
	}
	
	function getAreaIP(){
		$.ajax({
			url:"area/getUserCity.shtml",
			type:"get",
			success:function(data){
				if(data && data.data && data.data.area){
					setArea(data.data.area, init);
				}else{
					alert("定位城市信息失败");
				}
			},
			error:function(error){
				alert("定位城市信息失败");
			}
		});
	}
	
	function setArea(area, call){
		Config.area=area;
		if(Config.shopArea==null){
			Config.shopArea=Config.area;
		}
		call && call();
	}
	
	function updateArea(area, call){
		call=call||RELOAD;
		if(Config.area==null || Config.area.name==null){
			Config.area=area;
			call();
		}else if(Config.area.name!=area.name){
			Choose("改为系统定位地址吗？","系统发现您目前的定位地址为"+area.name,"info",function(flag){
				if(flag){
					Config.area=area;
					alert("","ok","success",true,call);
				}
			});
		}
	}
	
	window.onbeforeunload=window.onpagehide=function(){
		setStorageArray("_userStack", window._user, true);
		setStorageArray("_areaStack", Config.area, true);
		setStorageArray("_shopAreaStack", Config.shopArea, true);
		setStorageArray("_errorStack");
		setStorageArray("_ctrlStack");
		setStorageArray("_closeTime", new Date());
	};

})();