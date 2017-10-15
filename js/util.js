/* 在controller的参数里配置的ajax请求 */
function DATA(url,type,params,callback){
	if(arguments[0] instanceof jQuery){
		return arguments[0].get(0).ctrl._datas;
	}
	if(arguments[0] instanceof HTMLElement){
		return arguments[0].ctrl._datas;
	}
	if(this.constructor==arguments.callee){
		var obj=this;
		$.keys(arguments, function(v){
			var arg=this[v];
			if(arg=="get"||arg=="post"||arg=="put"||arg=="delete"||arg=="GET"||arg=="POST"||arg=="PUT"||arg=="DELETE"){
				obj._type=arg;
			}else if(typeof arg=="string"){
				obj._url=arg;
			}else if(typeof arg=="object"){
				obj._params=arg;
			}else if(typeof arg=="function"){
				obj._callback=arg;
			}
		});
	}else{
		return new arguments.callee(url,type,params,callback);
	}
}

function GET(url,params,callback){return DATA(url,"GET",params,callback);}
function POST(url,params,callback){return DATA(url,"POST",params,callback);}
function PUT(url,params,callback){return DATA(url,"PUT",params,callback);}
function DELETE(url,params,callback){return DATA(url,"DELETE",params,callback);}

/* 在DATA的参数项params里配置的动态参数（即GO方法里添加的参数的属性名prop）defult为动态参数中没有该属性时使用的缺省值 */
function PARAM(prop,defult){
	if(this.constructor==arguments.callee){
		this._prop=prop;
		this._defult=defult;
	}else{
		return new arguments.callee(prop,defult);
	}
}

function showBox(/*className, string, dom, call, type, time, style*/){
	var arg=arguments,
		className=arg[0],
		$box=$("."+className+"").unbind("click").removeAttr("style"),
		$p=$("."+className+">.txt>p").css("text-align","center");
		$btn=$("."+className+">button").hide().unbind("click"),
		$ul=$("."+className+">ul").hide(),
		$yes=$("."+className+">ul>li>a:eq(1)").text("确定").unbind("click"),
		$no=$("."+className+">ul>li>a:eq(0)").text("取消").unbind("click"),
		$close=$("."+className+">.closeBtn").hide().unbind("click"),
		call=function(){},
		type=null,
		time=null,
		style=null,
		dom=null,
		string="";
	function str(x,o){return x!=null?x.toString():(o?x:"null");}
	for(var i=1;arg && i<arg.length;i++){
		if(arg[i] instanceof HTMLElement || arg[i] instanceof jQuery){
			dom=arg[i];
		}else if(typeof arg[i]=="function" && i>1){
			call=arg[i];
		}else if(typeof arg[i]=="boolean" && i>1){
			type=arg[i];
		}else if(typeof arg[i]=="number" && i>1){
			time=arg[i];
		}else if(typeof arg[i]=="object" && i>1){
			style=arg[i];
		}else{
			string=str(arg[i]);
		}
	}
	if(type===true){
		$ul.show();
		$yes.attr("href","javascript:;").click(function(){
			boxClose(true);
		});
		$no.attr("href","javascript:;").click(function(){
			boxClose(false);
		});
	}else if(type===false){
		$close.show().click(boxClose);
		$box.css({"overflow":"visible"});
	}else{
		$btn.show().click(function(){
			boxClose(true);
		});
	}
	if(string && type!=false){
		string=string.toString().replace(/\s/gm,"");
		if(string.toString().getLength()>=30){
			$p.css("text-align","left");
		}
	}
	$p.empty().append(dom).append(string);
	$.keys(style,function(i){
		$box.css(i,style[i]);
	});
	($box[0].rejust=function(){
		$box.css({"margin-top": -$box.outerHeight()/2,"margin-left": -$box.outerWidth()/2}).show();
	})();
	$.getMaxWrap().loadingWrap("#000",{opacity:0.3,top:0,"z-index":8},false,"none");
	function boxhide(){
		$box.hide();
		$("html,body").loadingWrapCancel();
	}
	function boxClose(flag){
		boxhide();
		call(flag);
	}
	if(time!=null){
		setTimeout(function(){
			if($box.is(":visible")){
				boxClose();
			}
		},time);
	}
	return $box[0];
}
/*
alert("内容", function(flag){
		flag?alert("yes"):alert("no");
}, type, 1000, {"background-color":"#000", color:"#666"}); 

type 有三种 默认不传 显示一个“好”按钮 true-显示两个按钮 false-不显示按钮
第四个参数 类型数字 是弹窗显示时间 默认不点按钮 一直显示
*/
function _alert(id,args){
	var arg=[id];
	for(var i=0;i<args.length;i++){
		arg.push(args[i]);
	}
	return showBox.apply(window, arg);
}
if(Object && Object.defineProperties){
	Object.defineProperties(window, {
		alert:{
			writable: false,
			value: function(/*content, call, type, time, style*/){
				return _alert("alertBox",arguments);
			}
		}
	});
}else{
	window.alert=function(){
		return _alert("alertBox",arguments);
	};
}
function alerts(){
	return _alert("alertsBox",arguments);
}

/* 弹窗 
 * 类型："success","info","warning","error"
 * 传true无确定按钮 一秒关闭
 * 
 * Pop("主","副","warning",true,function(){
 * 	Pop("yes");
 * },{
 * 	imageUrl:"http://www.dglives.com/demo/sweetalert-master/example/images/logo_big.png",
 * 	imageSize:"200x40"
 * });
 * 
 * */
function Pop(){
	var arg=$.extend([],arguments),
		simple=false,
		arr=[],
		json=null,
		call=function(){};
	for(var i=0;i<arg.length;i++){
		if(typeof arg[i]=="object" && i>0){
			json=arg[i];
		}else if(typeof arg[i]=="function" && i>0){
			call=arg[i];
		}else if(typeof arg[i]=="boolean" && arg[i] && i>0){
			simple=true;
		}else{
			arr.push(arg[i]);
		}
	}
	function pop(){
		function str(x,o){return x!=null?x.toString():(o?x:"null");}
		sweetAlert($.extend({
			title:str(arr[0]),
			text:str(arr[1],true),
			type:str(arr[2],true),
		},json),call);
		if(simple){
			$(".sweet-alert .confirm").hide();
			setTimeout(function(){$(".sweet-alert .confirm").click();},1000);
		}
	}
	if($(".sweet-overlay,.sweet-alert").filter(":visible").length>0){
		setTimeout(pop,150);
	}else{
		pop();
	}
}
/* 弹框选择 
 * 类型："success","info","warning","error"
 *
 * Choose("主","副","warning",function(flag){
 * 	flag?Pop("yes"):Pop("no");
 * },{
 * 	imageUrl:"http://www.dglives.com/demo/sweetalert-master/example/images/logo_big.png",
 * 	imageSize:"200x40"
 * });
 * 
 * */
function Choose(){
	var arg=$.extend([],arguments),
		arr=[],
		call=function(){};
	for(var i=0;i<arg.length;i++){
		if(typeof arg[i]=="function" && i>0){
			call=arg[i];
		}else{
			arr.push(arg[i]);
		}
	}
	function pop(){
		function str(x,o){return x!=null?x.toString():(o?x:"null");}
		sweetAlert({
			title:str(arr[0]),
			text:str(arr[1],true),
			type:str(arr[2],true),
			showCancelButton: true,
		},call);
	}
	if($(".sweet-overlay,.sweet-alert").filter(":visible").length>0){
		setTimeout(pop,150);
	}else{
		pop();
	}
}

function tipBox(text){
	var box=$(".util-wrap .black-box");
	function close(){
		box.hide();
	}
	box.click(close).show().find(".text").html(text);
	setTimeout(close,2000);
}

/*** 基础方法 end ***/

$.extend($,{
	/*增加不可枚举的属性*/
	addUneProp:function(obj, props){
		$.keys(props, function(v,i,a){
			props[v]={
				value:props[v],
				writable:true,
				enumerable: false,
				configurable: true
			};
		});
		Object.defineProperties(obj, props);
	},
	
	/*遍历属性 非父级可枚举的属性 function里的this, arguments都要注意已改变
	 * $.each也可遍历对象，类似for in 
	 * $.map遍历对象 返回值组成新对象*/
	keys:function(obj, call, _this){
		if(typeof obj=="object" && obj!=null){
			if(typeof call=="function"){
				Object.keys(obj).forEach(call, _this===undefined?obj:_this);
			}
			return Object.keys(obj);
		}
	},

	/* 遍历对象树，获取值，若参数为空或undefined，则返回对象自身 深遍历$._(obj,["a","b","c"])第二个参数为各级键名的数组 第三个参数为设值 */
	_:function(obj,atr,val){
		if(atr==null||atr==""){
			return obj;
		}
		if(Object.prototype.toString.call(atr)==="[object Array]" && atr.length>0){
			if(arguments.length>2){
				var tar=obj;
				for(var i=0;i<atr.length;i++){
					if(i==atr.length-1){
						tar[atr[i]]=val;
					}else{
						var cur=tar[atr[i]];
						tar[atr[i]]=cur==null?{}:typeof cur=="object"?cur:new cur.constructor(cur);
					}
					tar=tar[atr[i]];
				}
				return tar;
			}else{
				var str='["'+atr.join('"]["')+'"]';
				try{
					return eval("(obj"+str+")");
				}catch(e){
					return undefined;
				}
			}
		}
		return arguments.length>2?obj[atr]=val:obj[atr];
	},
	/* 对象相减 */
	except : function(obj, exc, equal){
		$.keys(exc, function(v){
			if(equal && obj[v]==exc[v]){
				delete obj[v];
			}else{
				delete obj[v];
			}
		});
		return obj;
	},
	
	/* 遍历对象 若符合条件fun 返回{k:属性层级的数组,v:值} 属性的层级数组可以用$._获取对应的值 最终的返回值atrs为所用符合条件的层级数组。*/
	treeMap:function(obj, fun){
		var atrs=[];
		function f(atr,obj){
			if(fun(atr,obj)){
				atrs.push({k:atr,v:obj});
			}
			if(typeof obj=="object"){
				$.keys(obj, function(v){
					var a=$.extend([],atr);
					a.push(v);
					f(a,obj[v]);
				});
			}
		}
		f([],obj);
		return atrs;
	},
	
	/* 添加Cookie $.addCookie("xxx","123",{expires:5});保存5秒*/
	addCookie : function(name, value, options) {
		if (arguments.length > 1 && name != null) {
			if (options == null) {
				options = {};
			}
			if (value == null) {
				options.expires = -1;
			}
			if (typeof options.expires == "number") {
				var time = options.expires;
				var expires = options.expires = new Date();
				expires.setTime(expires.getTime() + time * 1000);
			}
			if (options.path == null) {
				options.path = "/";
			}
			if (options.domain == null) {
				options.domain = "";
			}
			document.cookie = encodeURIComponent(String(name)) + "=" + encodeURIComponent(String(value)) + (options.expires != null ? "; expires=" + options.expires.toUTCString() : "") + (options.path != "" ? "; path=" + options.path : "") + (options.domain != "" ? "; domain=" + options.domain : "") + (options.secure != null ? "; secure" : "");
		}
	},
	/* 获取Cookie */
	getCookie : function(name) {
		if (name != null) {
			var value = new RegExp("(?:^|; )" + encodeURIComponent(String(name)) + "=([^;]*)").exec(document.cookie);
			return value ? decodeURIComponent(value[1]) : null;
		}
	},
	/* 移除Cookie */
	removeCookie : function(name, options) {
		this.addCookie(name, null, options);
	},

	"delete" : function(/*url,param,callback*/){
		var url,param,callback;
		$.keys(arguments, function(v){
			var arg=this[v];
			if(typeof arg=="string"){
				url=arg+"?";
			}else if(typeof arg=="object"){
				param=arg;
			}else if(typeof arg=="function"){
				callback=arg;
			}
		});
		url+="&"+(param!=null?$.param(param, true):"");
		return $.ajax({
			url:url,
			type:"delete",
			data:param||{}
		}).always(callback||function(){});
	},

	put : function(/*url,param,callback*/){
		var url,param,callback;
		$.keys(arguments, function(v){
			var arg=this[v];
			if(typeof arg=="string"){
				url=arg+"?";
			}else if(typeof arg=="object"){
				param=arg;
			}else if(typeof arg=="function"){
				callback=arg;
			}
		});
		url+="&"+(param!=null?$.param(param, true):"");
		return $.ajax({
			url:url,
			type:"put",
			data:param||{}
		}).always(callback||function(){});
	},
	
	isPC : function(){
		/*限定的几个常用平台。PC端浏览器修改UA(除Linux)依然判定为PC*/
		var PL=["Win","Mac","X11","Linux"];
		for(var i=0;i<PL.length;i++){
			if(navigator.platform.indexOf(PL[i])==0 && !this.isAndroid()){
				return true;
			}
		}
		return false;
	},
	isMobile : function(){
		/*只包括IOS Android 必须为真实平台*/
		if(this.isIOS() || this.isAndroid()){
			return true;
		}
		return false;
	},
	isIOS :function(){
		var PL=["iPhone","iPad","iPod"];
		for(var i=0;i<PL.length;i++){
			if(navigator.platform.indexOf(PL[i])==0){
				return true;
			}
		}
		return false;
	},
	isAndroid : function(){
		/*可能不完全*/
		if(navigator.platform.indexOf("Linux")==0 && (navigator.platform.indexOf("arm")>5 || navigator.userAgent.indexOf("Android")>0 || navigator.userAgent.indexOf("Mobile")>0 || navigator.userAgent.indexOf("UCWEB")>0)){
			return true;
		}
		return false;
	},
	isWinPhone : function(){
		/*粗略 未判断平台*/
		if(navigator.userAgent.indexOf("Windows Phone OS")>0){
			return true;
		}
		return false;
	},

/* 判断对象 排除DOM和array */
	isObject : function(o){
		return Object.prototype.toString.call(o)==="[object Object]";
	},
	
/* 判断DOM */
	isDOM : function(o){
		return o instanceof HTMLElement;
	},
	
/* 判断数组 */
	isArr : function (o){
	    return Object.prototype.toString.call(o)==="[object Array]";
	},

/* 判断数组是否包含某些元素中的任意一个 */
	anyHas : function(o,a){
		for(var n=0;n<a.length;n++){
			for(var i=0;i<o.length&&o[i]!=a[n];i++);
			return !(i==o.length);
		}
	},

/* 判断数组是否包含这些全部元素 */
	allHas : function(o,a){
		for(var n=0;n<a.length;n++){
			for(var i=0;i<o.length&&o[i]!=a[n];i++);
			if(i==o.length)return false;
		}return true;
	},

/* 阻止默认事件 */
	preventDefault : function (e){
		if(document.all)window.event.returnValue=false;
		e.preventDefault();
		return false;
	},

/* 阻止冒泡 */
	stopPropagation : function (e,o){
		e=e||window.event;
		e.stopPropagation?e.stopPropagation():e.cancelBubble=true;
		if(o)$(o).parents().each(function(){var p=this;if(p.href)p.onclick=$.preventDefault;});
	},
/* Date兼容 多个参数不支持 */
	Date : function (time){
		return time==null?new Date():new Date(typeof time=='string'?time.replace(/-/mg,'/'):time);
	},
/* 调整rem */	
	adjustWin : function (){
		var ratio=$("body").width()/640;
		$("html").css("font-size",ratio*100+"px");
		$.keys(getREG("resize"),function(v){
			if(typeof this[v]=="function")this[v]();
		});
		if($(window).height()<800*ratio){
			$("footer").css("margin-bottom","-1.2rem");
		}else{
			$("footer").css("margin-bottom","auto");
		}
		return ratio;
	},

	getMaxWrap : function(){
		return $("body").height()>$("html").height()?$("body"):$("html");
	},
	
	getScrollBottom:function(){
		return $("body").outerHeight(true)-$("body").scrollTop()-$(window).outerHeight(true);
	},

	/* 将变量赋值到全局 */
	setGlobal: function (vars){
		$.keys(vars, function(v){
			window[v]=vars[v];
		});
	},
	/* 将变量从全局移除 */
	delGlobal: function (vars){
		$.keys(vars, function(v){
			window[v]=undefined;
		});
	},
	/* px，rem转换数字 */
	parsePix: function (x){
		if(typeof x=="string" && x.match(/^[\.\d]*rem$/)){
			x=parseFloat(x)*parseFloat($("html").css("font-size"));
		}else{
			x=parseFloat(x);
		}
		return x;
	},
	/* 文件大小单位转换*/
	bytesToSize: function(bytes) {
		if (bytes === 0) return '0 B';
		var k = 1024,
			unit = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
			i = Math.floor(Math.log(bytes) / Math.log(k));
		return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + unit[i];
	},
	sizeToBytes: function(size) {
		var k = 1024,
			unit = ['K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'];
		for(var i=0; i<unit.length; i++){
			if(size.toUpperCase().indexOf(unit[i])>0){
				return parseFloat(size)*Math.pow(k, i+1);
			}
		}
		return parseFloat(size);
	},
	prePage:function($dom,fixPage,ctrl){
		/*UC浏览器 动画执行之后的 .footer幻影bug*/
		var footer=$dom && $dom.find(".footer")[0];
		if(footer){
			footer._style_=$(footer).attr("style")||"";
			$(footer).hide();
		}
		$dom && $dom.find(".page-fixed").hide();
		$.animatime=($dom.find(".contentHeader").length>0 && (ctrl._param.app=="iOS" || ctrl._param.app=="android"))?0:600;
		if(ctrl._animate!=false)$dom.goEffect("go-slideInRight",$.animatime/1000+"s",1,true,fixPage);
		else fixPage();
	},
	fixPage:function($dom){
		var footer=$dom && $dom.find(".footer")[0];
		if(footer){
			$(footer).attr("style",footer._style_);
		}
		$("header,.RegisterNow,.footer,.footers,.page-fixed").goEffect("go-refresh","0.001s",1);
		$("#circle").add($dom && $dom.find(".page-fixed")).show();
	},
	/*获取经纬度 complete(lng, lat, city) fail(error, status, result)*/
	getPosition:function(complete, fail, timeout){
		function pc(error){
			$.get("area/getIPLocate.shtml",function(res){
				if(res && res.code==1 && res.lng!=null){
					/*x对应lng-经度标 y对应lat-纬度*/
					complete(res.lng,res.lat);
					return;
				}
				error("error", res);
			});
		}
		function mobile(status, result){
			var key=setTimeout(function(){
				gofail(null, status, result);
			},500);
			if(window.navigator && navigator.geolocation){
				navigator.geolocation.getCurrentPosition(function(position){
					clearTimeout(key);
					Lng = position.coords.longitude;
					Lat = position.coords.latitude;
					complete(Lng, Lat);
					$.fixPage();
				},function(error){
					clearTimeout(key);
					/*
					if(status!=null){
						gofail(error, status, result);
					}else{
						//alert("手机定位失败，请打开手机定位功能。");
						pc(function(status, result){
							gofail(error, status, result);
						});
					}
					*/
					gofail(error, status, result);
					$.fixPage();
				},{
					timeout:timeout!=undefined?timeout:400
				});
			}else{
				gofail(null, status, result);
			}
		}
		var admit=true;
		function gofail(error, status, result){
			if(admit){
				admit=false;
				error=error?error.code:2;
				switch (error) {
				case 1:
					error.msg="位置服务被拒绝";
					break;
				case 2:
					error.msg="暂时获取不到位置信息";
					break;
				case 3:
					error.msg="获取信息超时";
					break;
				case 4:
					error.msg="未知错误";
					break;
				default:
					error.msg="暂时获取不到位置信息";
				}
				complete(0, 0);
				fail && fail(error, status, result);
			}
		}
		if(localStorage.get("LOCATE")!=null){
			var locate=localStorage.get("LOCATE").split(",");
			complete(locate[0],locate[1]);
		}else{
			pc(function(status, result){
				mobile(status, result);
			});
		}
		
	},
	
	share: function(summary, pic, type){
		function _(x){return typeof x=="string"?x:"";}
		summary=_(summary)||document.title;
		pic=_(pic);
		type=_(type);
		if(type.indexOf("qq")>-1){
			open("http://connect.qq.com/widget/shareqq/index.html?title=&showcount="+summary+"&pics="+pic+"&url="+location.href);
		}else if(type!=null && type.indexOf("zone")>-1){
			open("http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?title=&summary="+summary+"&pics="+pic+"&url="+location.href);
		}else{
			open("http://service.weibo.com/share/share.php?title="+summary+"&pic="+pic+"&url="+location.href);
		}
	},
	
	/* 微信分享 
	 * 参数及缺省值:
		{
			title:	"",														// 分享标题
			desc: 	"",														// 分享描述
			link: location.href,											// 分享链接
			imgUrl: 页面第一张图或'/resources/shop/wap/images/weixin.jpg',		// 分享图标
			success: function (type,res) { 
				// 用户确认分享后执行的回调函数
				// type为分享类型 —— {'moments':朋友圈, 'friend':发送给朋友, 'QQ':QQ, 'TXWeibo':腾讯微博, 'QZone':Q空间}
			},
			cancel: function (type,res) {
				// 用户取消分享后执行的回调函数
			}
		}
	 * */
	wxShare: function(option){
		var ua = window.navigator.userAgent.toLowerCase(); 
 		if(ua.match(/MicroMessenger/i) == 'micromessenger'){//是微信浏览器 
 			 
 		}else{//不是微信浏览器
 			return false; 
 		}
 		
		option=option||{};
		$LAB.js("http://res.wx.qq.com/open/js/jweixin-1.0.0.js").wait(function(){
			var imageUrl="";
			if(option.imgUrl!=null){
				imageUrl=option.imgUrl;
			}else{
				var image=$("img");
				if(image != "" && image.length > 0){
					imageUrl = $($("#slider").find("img")[0]).attr("src");
				}else{
					image = $("image");
					if(image != null && image.length > 0){
						imageUrl = $(image[0]).attr("src");
					}else{
						imageUrl='/img/weixin.png';
					}
				}
			}
			function Option(type){
				var area="【开店啦"+((Config.area.name != null && Config.area.name != '')?("·"+Config.area.name.replace("市","")):"")+"】",
					title=area+($(".share_title").attr("title")||""),
					/*TODO 怎么确定分享title是超值购*/
					unit=location.hash.indexOf("#goods/")>-1?"个":"些",
					name=location.hash.indexOf("#forwardingGifts/")>-1?"活动"
						:location.hash.indexOf("#goods/")>-1?"商品"
						:location.hash.indexOf("#cityNews/")>-1?"活动"
						:location.hash.indexOf("#shop/shops")>-1?"店铺"
						:location.hash.indexOf("#shopKeeper/shopKeeperShops")>-1?"店铺"
						:"宝贝",
					desc="我在"+area+"发现了一" + unit + "不错的" + name + "，快来看看吧~";
					if(location.hash.indexOf("#etc/swishInfo") > -1){
						title="快来“嗖一下”！我在这家店嗖到了惊喜！"+($(".shareShopName").text()?"【"+$(".shareShopName").text()+"】":"");
						desc="我正在使用嗖一下，发现"+area+"有个不错的店铺，快来看看吧！";
					}
					$.extend(this,$.extend({
						title:title,
						desc:desc,
						link:location.href,
						imgUrl:imageUrl,
						success:function(res){
							option.call && option.call(type, res);
						},
						cancel:function(res){
							option.back && option.back(type, res);
						}
					},option));
			}
			//获取签名
			$.ajax({
				url:"./common/getTicket.shtml",
				data:{url:window.location.href.split('#')[0]},
				type:"post",
				dataType:"json",
				async:true,
				success:function(data){
					wx.config({
						debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
						appId: 'wx05113a272dd175e8', // 必填，公众号的唯一标识----自行修改
						timestamp: data.timestamp, //必填，生成签名的时间戳
						nonceStr: data.nonceStr, //必填，生成签名的随机串
						signature: data.signature,//必填，签名，见附录1
						jsApiList: [
							'onMenuShareAppMessage',
							'onMenuShareTimeline',
							'onMenuShareQQ',
							'onMenuShareWeibo',
							'onMenuShareQZone'
						] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
					});
					wx.ready(function(){
						//分享到朋友圈
						wx.onMenuShareTimeline(new Option('moments'));
						// 2.1 监听“分享给朋友”，按钮点击、自定义分享内容及分享结果接口
						wx.onMenuShareAppMessage(new Option('friend'));
						//分享给QQ好友
						wx.onMenuShareQQ(new Option('QQ'));
						//腾讯微博
						wx.onMenuShareWeibo(new Option('TXWeibo'));
						//分享到QQ空间
						wx.onMenuShareQZone(new Option('QZone'));
					});
					wx.error(function(res){
					});
				},
				error:function(data){
				}
			});
		});
	},
	
	/*给方法method制造环境 局域变量vars(必须是单层键值对的对象，或执行环境的方法(参数为被执行的方法method)), 指定this, 以及参数args(必须是数组)
	 * 
	 * $.makeContext(method,function(method){
	 * 		var x=1,y=2;
	 * 		method();
	 * 	},window,[123]);
	 * 
	 * $.makeContext(method,{x:1,y:2},window,[123]);
	 * 
	 * 可让method拥有已经声明的变量x,y，this指向window，参数为123。
	 * */
	makeContext: function (/*method, vars, _this, args*/){
		if(typeof arguments[1]=="function"){
			return eval("("+arguments[1]+")(("+arguments[0]+").bind(arguments[2]||window, arguments[3]||[]));");
		}else if(typeof arguments[1]=="object"){
			return eval("var "+$.map(arguments[1], function(v,k){
				if(Object.prototype.toString.call(arg)==="[object Array]"){
					return k+"=["+v+"],";
				}else{
					return k+"="+v+",";
				}
			}).join("").replace(/,$/,";")+"("+arguments[0]+").call(arguments[2]||window, arguments[3]||[]);");
		}
	},

	/*值与值的绑定，必是某的对象的属性与某个对象的属性，不能是纯变量。改变其中一个，其他一起变。
	 * $.linkSet(
	 *  {val:[dom1,dom2],innerHTML:dom1,src:dom2},
	 *  {innerHTML:dom2,id:post.param},
	 *  setter,
	 *  getter
	 * );
	 * value只能用val的getter，setter来代替。
	 * src暂不支持。
	 * 设值时用dom.val来设，
	 * 对此，该方法也相应的修改了$().val方法和该对象的onchange事件。
	 * 可添加getter,setter时候的附属方法。
	 * */
	linkSet: function(){
		var set=function(){},
			get=function(){},
			args=arguments;
		function map(f){
			for(var i=0;i<args.length;i++){
				var o=args[i];
				if(typeof o=="function"){
					o.length?set=o:get=o;
				}else{
					$.keys(o, function(v){
						if(Object.prototype.toString.call(o[v])==="[object Array]"){
							for(var n=0;n<o[v].length;n++){
								f(o[v][n],v);
							}
						}else{
							f(o[v],v);
						}
					});
				}
			}
		}
		map(function(o,v){
			o[v+"`"]=o[v];
			if(o instanceof HTMLElement && (v=="value"||v=="_value"||v=="val")){
				v=="val";
				$(o).change(function(){this._value=this.val=this.value;});
			}
			o.__defineSetter__(v,function(x){
				set.call(this,[x]);
				map(function(o,v){
					o[v+"`"]=x;
					if(o instanceof HTMLElement){
						if(v=="innerHTML"){
							$(o).empty().append(x);
						}
						else if(v="val"){
							o.value=x;
						}
						else{
							$(o).attr(v,x);
						}
					}
				});
			});
			o.__defineGetter__(v,function(){
				get.call(this);
				return this[v+"`"];
			});
		});
	},
/*  非jQuery ajax请求 */
	request:function(/*url,params,callback,type*/){
		var url,params,callback,type;
		$.keys(arguments, function(v){
			var arg=this[v];
			if(arg=="get"||arg=="post"||arg=="put"||arg=="delete"||arg=="GET"||arg=="POST"||arg=="PUT"||arg=="DELETE"){
				type=arg;
			}else if(typeof arg=="string"){
				url=arg;
			}else if(typeof arg=="object"){
				params=arg;
			}else if(typeof arg=="function"){
				callback=arg;
			}
		});
		callback=callback||function(){};
		type=(type||"POST").toUpperCase();
		var params=(params!=null?$.param(params, true):null);
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function(){
			if(xhr.readyState == 4){
				callback(this.responseText, this);
			}
		};
		xhr.open(type, url+(((type=="GET"||type=="DELETE") && params!=null && params!="")?("?"+params):""), true);
		xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
		xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");  
		xhr.send(params);
		return xhr;
	},
/* ajax同步请求并返回值 */
	ajaxSync:function(/*url,params,callback,type*/){
		var url,params,callback,type,response;
		$.keys(arguments, function(v){
			var arg=this[v];
			if(arg=="get"||arg=="post"||arg=="put"||arg=="delete"||arg=="GET"||arg=="POST"||arg=="PUT"||arg=="DELETE"){
				type=arg;
			}else if(typeof arg=="string"){
				url=arg;
			}else if(typeof arg=="object"){
				params=arg;
			}else if(typeof arg=="function"){
				callback=arg;
			}
		});
		window._loadStack=window._loadStack||{};
		if(url.match(/.*\.js$/) && _loadStack[url]){
			return _loadStack[url];
		}
		$.ajax({
			url:url,
			data:params,
			async:false,
			type:type||"post"
		}).always(function(r,s,q){
			r=(typeof r=="string" && (/^{[\s\S]*}$/.test(r)||/^\[[\s\S]*\]$/.test(r)))?eval("("+r+")"):r;
			response=(s=="success" && callback)?callback(r):r;
		});
		return _loadStack[url]=response;
	},
/* 无值赋值处理 处理 object.object.object... = value 这样的赋值语句 其中遇到undefined自动init 把undefined设为空对象 */
	autoObjSet:function(str,obj){
		var reg=/([A-Za-z_][A-Za-z0-9_]*(\s*\.\s*[A-Za-z_][A-Za-z0-9_]*)*\s*=)/mg,
			lines=str.match(reg);
			str=str.replace(reg,"(obj||window).$1");
		for(var i=0;i<lines.length;i++){
			var line=lines[i].replace("=",""),
				chains=line.split("."),
				chain=obj||window;
			for(var j=0;j<chains.length;j++){
				chain[chains[j]]=chain[chains[j]]||{};
				chain=chain[chains[j]];
			}
		}
		eval("(function(){"+str+"})()");
	},

/* jQuery ajax回调公用处理*/
	ajaxCall:function(r,q,call,ctrl){
		/*jquery请求注意 r和q对调 r是请求 q和r.statusText是错误信息 r.status是HTTP状态 r.responseText是返回信息*/
		if(q.status!=200){
			if(ctrl._goError!=false){
				var errorMsg=q.status+":"+q.statusText+":"+(q.responseText?q.responseText.replace(/[\s\S]*<body>([\s\S]*?)<\/body>[\s\S]*/gm,"$1"):"");
				/* 服务端未处理错误 */
				DO("error",{ctrl:ctrl, errorMsg:errorMsg});
				ctrl._goShow=false;
			}
			(call||function(){})(r);
		}else{
			try{
				r=(typeof r=="string" && (/^{[\s\S]*}$/.test(r)||/^\[[\s\S]*\]$/.test(r)))?eval("("+r+")"):r;
				if(r&&r.errorCode==1000){/*登录失效*/
					var ua = window.navigator.userAgent.toLowerCase();
		            var reg = /MicroMessenger\/[5-9]/i;
		            if(reg.test(ua)){//如果是在微信浏览器
		            	ctrl._goShow=false;
		            	var lastUrl = window._ctrl?_ctrl._hash:null;
		            	var backUrl = location.hash;
		            	if(backUrl != null){
		            		backUrl = backUrl.replace("#","%23");
		            	}
		            	if(lastUrl != null){
		            		lastUrl = lastUrl.replace("#","%23");
		            	}
		            	if(backUrl == null && lastUrl == null){
		            		var url = document.location.toString();
		                	var arrUrl = url.split("//");
		        	
		                	var start = arrUrl[1].indexOf("/");
		                	var relUrl = arrUrl[1].substring(start);//stop省略，截取从start开始到结尾的所有字符
		                	if(relUrl.indexOf("kdl_wap") > 0){
		                		relUrl = arrUrl[1].substring(start+8);
		                	}
		            		backUrl =relUrl;
		            		backUrl = backUrl.replace("#","%23");
		            	}
		            	var domain = "http://www.kaidianlaa.com/";
//		            	var domain = "http://wyz52155.imwork.net/kdl_wap/";
		            	var url = domain+"/common/toLogin.shtml?backUrl="+backUrl+"&lastUrl="+lastUrl;
		            	window.location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx05113a272dd175e8&redirect_uri="+url+"&response_type=code&scope=snsapi_base#wechat_redirect";
//		            	window.location.href = Config.basePath+"common/toLogin.shtml?backUrl="+backUrl+"&lastUrl="+lastUrl;
		            	return false;
		            }else{
		            	DO("passport/login",{backUrl:location.hash, lastUrl:window._ctrl?_ctrl._hash:null});
		            }
					ctrl._goShow=false;
				}
				(call||function(){})(r);
			}catch(e){
				/* 客户端解析错误 */
				if(ctrl._goError!=false){
					DO("error",$.extend(e, {ctrl:ctrl, errorMsg:e.name+": "+e.message}));
					ctrl._goShow=false;
				}
				(call||function(){})(r);
				throw e;
			}
		}
	},
	
/* 处理ctrl中的params 将params复制并将其中的DATA转换成相应的值 在回调函数的参数中得到复制并转换后的新params ***{{{精华}}}*** */
	dataHandle:function(_datas, params, callback, ctrl){
		var dfd={},
			str="",
			datas=$.extend(true,{},_datas);
		function f(v,data){
			dfd[v||0]=$.Deferred();
			str+=",dfd['"+(v||0)+"']";
			var dps=$.extend(true,{},data._params);
			if(data._params && data._params.constructor==PARAM){
				var p=dps._prop?(params[dps._prop]!=null?params[dps._prop]:dps._default):$.extend({},params);
				dps=$.extend(p, $.except(dps,{_prop:"",_default:""}));
			}
			$.keys(dps, function(i){
				var p=dps[i];
				if(p.constructor==PARAM){
					dps[i]=params[p._prop]!=null?params[p._prop]:p._defult;
				}else if(typeof p=="function"){
					dps[i]=p();
				}
			});
			$.request(data._url, data._type||"GET", dps, function(r,q){
				$.ajaxCall(r,q,function(r){
					(function(dat){
						var e=new Error(r.errorMsg);
						e.code=r.errorCode;
						if(r.errorCode!=1000){
							var data=r.status!=0?r.data:e;
							dat=(q.status==200 && dat._callback)?dat._callback(data, ctrl):data;
							if(r.status==0){
								ctrl._goShow=false;
								/*服务端已处理错误*/
								if(ctrl._goError!=false)DO("error",e);
							}
						}
						(q.v==null)?
							datas=dat:
							$._(datas,q.v,dat);
					})($._(datas,q.v));
					dfd[q.v||0].resolve();
				},ctrl);
			}).v=v;
		}
		if(_datas && _datas.constructor==DATA){
			f(null,datas);
		}else{
			$.treeMap(datas,function(k,o){
				if(o&&o.constructor==DATA)
					f(k,o);
			});
		}
		eval("$.when("+str.replace(",", "")+")").then(function(){
			callback && callback(datas);
		});
	},
	showUnRead : function(){
		if(_user && localStorage.getItem("allRedpoint_"+_user.id) == "true"){
			$(".nav-wrap-right a[href^='#message/messageLists'] .icon-info").append('<em></em>');
		}else{
			$(".nav-wrap-right .icon-info>em").remove();
		}
	}
});


jQuery.fn.extend({
	
	/* 图片加载回调 */
	loadCall : function(fn){
		var dfs=[];
		this.each(function(){
			var dfd=$.Deferred();
			$(this).bind('load',function(){
				dfd.resolve();  
			}).bind('error',function(){
				dfd.resolve();
			});
			if(this.complete)setTimeout(function(){
				dfd.resolve();
			},100);  
			dfs.push(dfd);
		}); 
		$.when.apply($,dfs).done(function(){
			(fn)();
		});
	},
	
	/* DOM-JSON化数据 
	 * forms组成形式 {"this.name":["this.value","this.src"],"this.id":"this.innerHTML","地址":"this.href"}
	 * forms若为空 视为{"this.name":"this.value"}
	 * */
	formJson : function(forms){
		var json={};
		function f(data,k,v){
			if(Object.prototype.toString.call(data[k])==="[object Array]"){
				data[k].push(v);
			}else if(data[k]!=null){
				data[k]=[data[k],v];
			}else{
				data[k]=v;
			}
		}
		forms=forms||{"this.name":"this.value"};
		this.each(function(i,o){
			$.keys(forms, function(key){
				var k=(key.indexOf("this.")>-1)?eval(key):key;
				if(k!=""){
					var v=forms[key];
					if(v=="this.value"){
						v=$(o).attr("val")?eval("(function(){return "+$(o).attr("val")+";}).call(o)"):eval(v);
						if(o.type=="radio" || o.type=="checkbox"){
							if(o.checked)
								f(json,k,v);
						}else if(o.type && o.type.indexOf("datetime")>-1){
							f(json,k,v.replace("T"," "));
						}else{
							f(json,k,v);
						}
					}else{
						v=(v.indexOf("this.")>-1)?eval(v):v;
						f(json,k,v);
					}
				}
			}, this);
		});
		return json;
	},
	
	/* 绑定一次 */
	once : function(evnt,fun){
		var el=this;
		if(!el.data("_event_"+evnt) || (fun && el.data("_event_"+evnt).toString()!=fun.toString())){
			el.data("_event_"+evnt,fun).bind(evnt,fun);
		}
		return el;
	},
	
	/* 只append一次 */
	appendOne : function(el,cont){
		return this.find(el).length<1 ? this.append(cont||$(el)) : this;
	},
	/* 只prepend一次 */
	prependOne : function(el,cont){
		return this.find(el).length<1 ? this.prepend(cont||$(el)) : this;
	},
	
	/* 检查DOM中是否有href或src等于该url的标签 */
	checkLinkHas : function(url,attr){
		var has=false;
		this.each(function(){
			if(attr ? $(this).attr(attr)==url : ($(this).attr("href")==url || $(this).attr("src")==url)){
				return has=true;
			}
		});
		return has;
	},
	
	/* 切换DOM状态 根据第一属性(sta1的第一个属性)判定 保证多属性状态一致 若空串""的className放在sta1的第一个属性 则根据sta2的相同属性来判断 */
	toggleState : function(sta1,sta2){
		return this.each(function(){
			var dom=this;
			if(typeof sta1=="object" && typeof sta2=="object"){
				var flag=undefined;
				$.keys(sta1, function(v){
					var val1=sta1[v],val2=sta2[v];
					if(v=="html")v="innerHTML";
					if(v=="class"||v=="className"){
						if(flag!=undefined ? flag : (val1!="" ? $(dom).hasClass(val1) : !$(dom).hasClass(val2)) ){
							flag=true;
							$(dom).removeClass(val1).addClass(val2);
						}else{
							flag=false;
							$(dom).removeClass(val2).addClass(val1);
						}
					}else{
						if(flag!=undefined ? flag : $(dom).attr(v)==val1){
							flag=true;
							$(dom).prop(v,val2);
							$(dom).attr(v,val2);
						}else{
							flag=false;
							$(dom).prop(v,val1);
							$(dom).attr(v,val1);
						}
					}
				});
			}else{
				if($(dom).html()==sta1){
					$(dom).html(sta2);
				}else{
					$(dom).html(sta1);
				}
			}
		});
	},
	
	/* 浮动高度居中 */	
	fixCenter : function(zindex){
		var dom=this[0];
		if($.isDOM(dom)){
			function call(){
				$(dom).css({
					"top":($(window).height()-$(dom).outerHeight(true))/2,
					"left":($(window).width()-$(dom).outerWidth(true))/2,
					"position":"fixed",
					"z-index":zindex||0
				});
			}
			if(dom.tagName.toLowerCase()=="img"){
				$(dom).loadCall(call);
			}else{
				call();
			}
		}
		return this;
	},
	
	/* loading状态遮罩 参数顺序随意("#ccc",{opacity:0.6,top:0},false,"none")*/
	loadingWrap : function(){
		var $this=this;
		if($this.length<1){return;}
		var css={},color="#ccc",close=false,img="img/loading.gif",call=function(){};
		function bg_img(){return (img=="none"||img==false)?"none":"url("+img+")";}
		$.keys(arguments, function(v){
			var arg=this[v];
			if(typeof arg=="string" && (arg.match(/./)=="#" || arg.match(/^rgb\(.*\)$/) || arg=="transparent")){
				color=arg;
			}else if(typeof arg=="object"){
				css=arg;
			}else if(typeof arg=="boolean"){
				close=arg;
			}else if(typeof arg=="function"){
				call=arg;
			}else{
				img=arg;
			}
		});
		var params=$.extend({
			height: "100%",
			position: "absolute",
			top: "0",
			width: "100%",
			opacity: 0.6,
			display: "block",
			"z-index": 10,
			"background-color": color,
			"background-repeat": "no-repeat",
			"background-position": "center center",
			"background-image" : bg_img()
		},css);
		close=close?function(){$this.loadingWrapCancel();call();}:function(){};
		return $this.data("loadingWrap")?
			$this.find(".loadingWrap").show():
			$this.data("loadingWrap",true)
			.data("position",$this[0].style.position)
			.data("overflow",$this[0].style.overflow)
			.css({"position":"relative"})
			.append($('<div class="loadingWrap"></div>').css(params).click(close));
	},
	/* 取消loading状态遮罩 */
	loadingWrapCancel : function(all){
		this.data("loadingWrap",false).css({"position":this.data("position"), "overflow":this.data("overflow")});
		all ? this.find(".loadingWrap").remove() : this.children(".loadingWrap").remove() ;
		return this;
	},
	
	/* jquery+css动画 
	 * $("body").goEffect("fadeOutDown","1s",1,true,function(){this.hide();});
	 * */
	goEffect : function() {
		var el=this;
		if(!el.data("effectTimeKey")){
			var arg=arguments;
			var options={					/*缺省值*/
				"time":"0.5s",				/*动画周期时间*/
				"effect":"fadeInDown",		/*效果名称，参见effectEnd中的数组*/
				"recover":true,				/*动画效果完成之后是否恢复原始状态*/
				"count":1,					/*动画次数，数字类型或字符串"infinite"无限*/
				"callback":function(){}		/*动画效果完成之后的回调方法*/
			};
			$.keys(arg, function(v){
				if(Object.prototype.toString.call(arg[v])==="[object Object]")
					$.extend(options,arg[v]);
				else if(typeof arg[v] == "function")
					$.extend(options,{"callback":arg[v]});
				else if(typeof arg[v] =="string" && arg[v].match(/^0?.?\d+s$/))
					$.extend(options,{"time":arg[v]});
				else if(arg[v] == "infinite" || typeof arg[v] =="number")
					$.extend(options,{"count":arg[v]});
				else if(typeof arg[v] =="string")
					$.extend(options,{"effect":arg[v]});
				else if(typeof arg[v] =="boolean")
					$.extend(options,{"recover":arg[v]});
			});
			options.count=="infinite" && (options.recover=false);
			var css={
				"-webkit-animation-iteration-count":options.count+"",
				"animation-iteration-count":options.count+"",
				"-webkit-animation-duration":options.time,
				"animation-duration":options.time
			};
			var origin={};
			$.keys(css, function(v){
				origin[v]=el.css(v);
			});
			function end(){
				if(el.data("effectTimeKey")!=null){
					options.recover && el.css(origin).removeClass(options.effect).removeClass("animated");
					options.callback.call(el);
					el.data("effectTimeKey",null);
				}
			}
			el.css(css)
				.addClass(options.effect).addClass("animated")
				.data("effectTimeKey",setTimeout(end,parseFloat(options.time,10)*1000))
				.on('animationend', end).on('webkitAnimationEnd', end);
		}
		return el;
	},
	/*
	 * 强制取消动画效果
	 * */
	goEffectEnd : function(){
		var effects="through throughBack bounce flash pulse rubberBand shake swing tada wobble bounceIn bounceInDown bounceInLeft bounceInRight bounceInUp bounceOut bounceOutDown bounceOutLeft bounceOutRight bounceOutUp fadeIn fadeInDown fadeInDownBig fadeInLeft fadeInLeftBig fadeInRight fadeInRightBig fadeInUp fadeInUpBig fadeOut fadeOutDown fadeOutDownBig fadeOutLeft fadeOutLeftBig fadeOutRight fadeOutRightBig fadeOutUp fadeOutUpBig flip flipInX flipInY flipOutX flipOutY lightSpeedIn lightSpeedOut rotateIn rotateInDownLeft rotateInDownRight rotateInUpLeft rotateInUpRight rotateOut rotateOutDownLeft rotateOutDownRight rotateOutUpLeft rotateOutUpRight slideInDown slideInLeft slideInRight slideOutLeft slideOutRight slideOutUp hinge rollIn rollOut".split(" ");
		var el=this;
		$.keys(effects, function(v){
			el.removeClass(effects[v]);
		});
		el.removeClass("animated").css({
			"-webkit-animation-iteration-count":"0",
			"animation-iteration-count":"0",
			"-webkit-animation-duration":"0s",
			"animation-duration":"0s"
		}).data("effectTimeKey",null);
		return el;
	},
	
	/* 提示 */
	tipsOn : function(/*content, className, hideTime, param*/){
		var content,className,hideTime,param,el=this;
		$.each(arguments,function(i,arg){
			if(typeof arg=="number"){
				hideTime=arg;
			}else if(typeof arg=="string" && arg.indexOf("tip-")>-1){
				className=arg;
			}else if(typeof arg=="object" && !(arg instanceof HTMLElement) && !(arg instanceof jQuery) ){
				param=arg;
			}else{
				content=arg;
			}
		});
		if(el[0].poshytip){
			el.poshytip("destroy");
			clearTimeout(el[0].key);
		}
		el.poshytip($.extend({
			content: content||"", /*'[title]', 'string', element, function(updateCallback){...}, jQuery*/
			keepInViewport: true,
			className: className||"tip-darkgray", /*'tip-darkgray', 'tip-yellow', 'tip-twitter'*/
			showOn: "none", /*'hover', 'focus', 'none'*/
			alignTo: "target", /* 'target','cursor' */
			alignX: "inner-left", /*'right', 'center', 'left', 'inner-left', 'inner-right'*/
			alignY: "top", /*'bottom', 'center', 'top', 'inner-bottom', 'inner-top'*/
			offsetX: 0,
			offsetY: 5,
			fade:true,
			slide:true
		},param)).poshytip("show");
		el[0].poshytip=true;
		if(hideTime){
			el[0].key=setTimeout(function(){el.poshytip("hide");},hideTime);
		}
		return el;
	},
	/*警告*/
	tipsWarn : function(){
		var args=$.map(arguments,function(arg,i){return arg;});
		args.push("tip-yellow");
		$.fn.tipsOn.apply(this,args);
		return this;
	},
	/*提示大段信息*/
	tipsInfo : function(){
		var args=$.map(arguments,function(arg,i){return arg;});
		args.push("tip-twitter");
		$.fn.tipsOn.apply(this,args);
		return this;
	},
	tipsOff : function(){
		return this.poshytip("hide");
	},
	
	val:function(x){
		var o=this[0];
		if(o&&x!=undefined)o.val=o._value=o.value=x;
		return o?(o.value||o.val||o._value):null;
	}
});


/*prototype fix*/

$.addUneProp(String.prototype,{
	/**
	 * function setLength()
	 * @method 按实际长度截取字符串(中文为英文两倍)
	 * @param Number 最大长度
	 * @return Number 截取后的字符串
	 */
	setLength:function setLength(max){
		var n=0,s="";
		for(var i=0;i<this.length;i++){
			if(this.charCodeAt(i)>128){n+=2;}else{n++;}
			s+=this.charAt(i);
			if(n>=max){return s;}
		}
		return s;
	},
	/**
	 * function getLength()
	 * @method 返回实际长度(中文为英文两倍)
	 * @param null
	 * @return Number 长度
	 */
	getLength:function getLength(){
		var n=0;
		for(var i=0;i<this.length;i++){
			if(this.charCodeAt(i)>128){n+=2;}else{n++;}
		}
		return n;
	},
	/* 将字符进行HTLM逃逸 */
	escapeHTML:function escapeHTML() {
		return this.replace(/&/gm,'&amp;').replace(/>/gm,'&gt;').replace(/</gm,'&lt;').replace(/"/gm,'&quot;');
	},
	/* 将逃逸的HTML字符转回为HTML */
	returnHTML:function returnHTML() {
		return this.replace(/&amp;/gm,'&').replace(/&gt;/gm,'>').replace(/&lt;/gm,'<').replace(/&quot;/gm,'"');
	}
	
});
$.addUneProp(Function.prototype,{
	/* 数组与单个都处理 */
	allHandle:function allHandle(o){
		if(!o instanceof Array && !(jQuery&&o instanceof jQuery)){
			o=[o];
		}
		if(o && o.length){
			for(var i=0;i<o.length;i++){
				this(o[i]);
			}
		}
	}
});
$.addUneProp(Date.prototype,{
	/* 时间格式化 */
	format:function format(format){
		var o = {
		"M+" : this.getMonth()+1, //month 
		"d+" : this.getDate(), //day 
		"D+" : this.getDate(), //day 
		"h+" : this.getHours(), //hour 
		"H+" : this.getHours(), //hour
		"m+" : this.getMinutes(), //minute 
		"s+" : this.getSeconds(), //second 
		"q+" : Math.floor((this.getMonth()+3)/3), //quarter 
		"S" : this.getMilliseconds() //millisecond 
		};
	
		if(/(y+)/.test(format)) {
			format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
		} 
		$.keys(o, function(k){
			if(new RegExp("("+ k +")").test(format)) {
				format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length)); 
			} 
		});
		return format; 
	}
});
$.addUneProp(Storage.prototype,{
/* time参数 保存时间:"1s","1min","1hour","1day" 结束时间:"2020/1/1" */
	set:function set(key, value, time){
		localStorage.setItem(key, value);
		if(time){
			if(typeof time=="number" || time.match(/^\d+$/)){
				return setTime();
			}else if(time.match(/^[1-9|\.]+day$/)){
				time=parseFloat(time)*24*60*60*1000;
				return setTime();
			}else if(time.match(/^[1-9|\.]+hour$/)){
				time=parseFloat(time)*60*60*1000;
				return setTime();
			}else if(time.match(/^[1-9|\.]+min$/)){
				time=parseFloat(time)*60*1000;
				return setTime();
			}else if(time.match(/^[1-9|\.]+s$/)){
				time=parseFloat(time)*1000;
				return setTime();
			}else{
				localStorage.setItem(key+"|<{TIMEEND}>", new Date(typeof time=='string'?time.replace(/-/mg,'/'):time).getTime());
				return localStorage;
			}
		}
		function setTime(){
			localStorage.setItem(key+"|<{TIMEEND}>", new Date().getTime()+time);
			return localStorage;
		}
	},
	del:function del(key){
		localStorage.removeItem(key);
		localStorage.removeItem(key+"|<{TIMEEND}>");
		return localStorage;
	},
	get:function get(key){
		var endTime=localStorage.getItem(key+"|<{TIMEEND}>");
		if(endTime && endTime<new Date().getTime()){
			localStorage.del(key);
		}
		return localStorage.getItem(key);
	}
});
/* HTMLElement对表单元素不起作用 表单元素要有其所属的原型 另外单独给元素对象上设也可以
 * 可惜的是定义的setter会覆盖原本的setter 让原本应有的动作不再发生
 * 纯对象的定义的setter会将这个属性删除 意思是 这个属性变成了setter或是setter的名称！
 * 这个属性的赋值取值都只代表执行setter/getter的过程，getter/setter只要设了一个，它就不是属性了，另外一个即使不设，也不能用它属性的功能，不能设值，不能取值。
 * setter返回值无效，只返回setter的参数（即赋的值），getter没有参数，会返回函数的返回值。
 * */
HTMLElement.prototype.__defineGetter__("val",function(){
	return this.value;
});
HTMLElement.prototype.__defineGetter__("_value",function(){
	return this.value;
});
HTMLElement.prototype.__defineGetter__("value",function(){
	return this.getAttribute("value");
});
HTMLElement.prototype.__defineGetter__("name",function(){
	return this.getAttribute("name");
});
HTMLElement.prototype.__defineSetter__('val',function(x){
	this.value=x;
});
HTMLElement.prototype.__defineSetter__('_value',function(x){
	this.value=x;
});
HTMLElement.prototype.__defineSetter__('value',function(x){
	this.select && this.select(x);
	this.setAttribute("value",x);
});
HTMLElement.prototype.__defineSetter__('name',function(x){
	this.setAttribute("name",x);
});
HTMLElement.prototype.__defineGetter__("ctrl",function(){
	return ($(this).closest("[ctrl]").get(0)||{})._ctrl;
});

HTMLFormElement.prototype.attrMethod=function(attr, args, _this){
	var method=this[attr]||$(this).attr(attr)||function(){};
	if(typeof method=="string"){
		method=eval(method);
	}
	if(typeof method=="function"){
		if(_this){
			return (method).apply(_this,args);
		}else{
			return (method)(args);
		}
	}else{
		return method;
	}
};
/*这样不能用jQuery的submit绑定*/
HTMLFormElement.prototype.submit=function(){
	var trigger=this.attrMethod("onsubmit")==false;
	if($(this).attr("novalidate") || trigger)return;
	else this.request(true);
};
HTMLFormElement.prototype.request=function(trigger){
	if(!trigger && (this.attrMethod("onsubmit")==false))return;
	var form=this,
		params=$(form).find("[name]").formJson();
	form.params=params;
	if(form.action){
		if(form.block!=true){
			$(form).find(":submit").loadingWrap();
			form.block=true;
			$.request(form.action, $(form).attr("mehod")||"post", params, function(r,q){
				$(form).find(":submit").loadingWrapCancel();
				form.block=false;
				$.ajaxCall(r,q,function(res){
					form.attrMethod("call", [form.response=res, params], form.ctrl);
				},form.ctrl);
			});
		}
	}else{
		form.attrMethod("call", [null, params], form.ctrl);
	}
};