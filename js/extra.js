$.extend($,{
/* 快捷上传 */
	simpleUpload:function(option){
		option=$.isObject(option)?option:{};
		option=$.extend({
			/* 以下为默认值 */
			accept:"image/jpg,image/jpeg,image/png,image/gif,image/tiff,image/bmp",		/* 上传文件类型 */
			multiple:"true",		/* 多文件上传 */
			url:null,				/* 保存文件路径的请求地址 若为空则不去后台post */
			fileUrl:"urls",			/* 保存文件路径的键名 也是load回调里的文件路径键名*/
			data:{},				/* 保存文件路径的附加参数 */
			type:"post",			/* 保存文件路径的请求方式 */
			size:null,				/* 限制大小 可使用单位 纯数字代表b */
			start:function(files){	/* 开始上传执行的方法 */
			},
			process:function(e,files){/* 执行上传过程中执行的方法(会被请求多次) */
			},
			load:function(data){	/* 传完图片之后的回调，参数为图片信息 */
			},
			callback:function(res){	/* 向后台post图片信息之后的回调 */
			},
			log:false				/* 打印日志 */
		},option);
		var input=document.createElement("INPUT");
		input.type="file";
		input.accept=option.accept;
		if(option.multiple!=false)input.multiple="true";
		var log=option.log?function(o){console.log(o);}:function(){};
		$(input).change(function(e) {
			function saveImg(data){
				option.load(data);
				if(option.url){
					$.ajax({
						url:option.url,
						data:$.extend(option.data,eval("({"+option.fileUrl+":data})")),
						async:false,
						type:option.type,
						success:function(res){
							log(res);
							log("SimpleUpload over.");
							option.callback(res);
						},
						error:function(res){
							alert(res);
							log("SimpleUpload over.");
							option.callback(res);
						}
					});
				}
			}
			var files = e.target.files || e.dataTransfer.files;
			option.start(files);
			var xhr = new XMLHttpRequest();
			var data = new FormData();
			var over = false;
			for(var i=0;i<files.length;i++){
				if(option.size==null || files[i].size<=$.sizeToBytes(option.size)){
					data.append("files",files[i]);
				}else{
					over = true;
				}
			}
			xhr.upload.addEventListener("progress",	 function(e){
				option.process(e,files);
				log(e.loaded/e.total*100+"%");
			}, false);
			xhr.addEventListener("load", function(e){
				//log(this.file.name);
				if(over)alert("超过"+option.size+"的文件未上传");
				var res=JSON.parse(this.responseText);
				log("SimpleUpload load:");
				log(res);
				saveImg(res);
			}, false);
			xhr.addEventListener("error", function(e){
				log("SimpleUpload error:");
				log(this.responseText);
			}, false);
			xhr.open("POST","file/upload.shtml", true);
			xhr.setRequestHeader("token", $.getCookie("token"));
			xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
			xhr.send(data);
		});
		input.click();
		return input;
	},

/* 剪裁图片 
 * 主要参数：
 * {
 *		width:"6.4rem",						//剪裁宽度
 *		height:"6.4rem",					//剪裁高度
 *		source:null,						//剪裁图片
 *		call:function(dataURL, filename){}	//剪裁完图片的回调方法
 *		strictSize: false					//固定尺寸
 * }
 * 详细参数见init方法中的注释
 * */
	clipImage : function(param){
		function clear(){
			$("#clipImg").attr("src","").attr("title","");
			$("#clipArea").html("");
			$("html,body").loadingWrapCancel();
		}
		function close(){
			clear();
			cancel();
			btnUnbind();
			$("#clipArea").show();
			$("#clipImg").hide();
			$("#clipWrap").hide();
		}
		function cancel(){
			$("#clipArea").show();
			$("#clipImg").hide();
			$("#clipPrev").show();
			$("#clipAfter").hide();
		}
		function cliped(){
			$("#clipArea").hide();
			var viewWidth=$.parsePix(param.width||"6.4rem");
			viewWidth=viewWidth>$(window).width()?$(window).width():viewWidth;
			$("#clipImg").show().width(viewWidth).fixCenter(0);
			setTimeout(function(){
				$("#clipImg").fixCenter(0);
			},50);
			$("#clipPrev").hide();
			$("#clipAfter").show();
		}
		function cliping(){
			var data=$("#clipImg")[0].src;
			var name=$("#clipImg")[0].title;
			var ext=name.match(/\.[a-zA-Z]+$/);
				ext=ext&&ext[0].replace(".","");
			close();/*close会清掉img的src title*/
			$.getMaxWrap().loadingWrap({"z-index":10001});
			$.ajax({
				url:"file/uploadData.shtml",
				type:"post",
				data:{data:data,ext:ext}
			}).always(function(res){
				$("html,body").loadingWrapCancel();
				param.call(res, name);
			});
		}
		function btnUnbind(){
			$("#clipBack").unbind("click");
			$("#clipCancel").unbind("click");
			$("#clipOK").unbind("click");
			$("#clipBtn").unbind("click");
		}
		function btnBind(){
			$("#clipBack").click(close);
			$("#clipCancel").click(cancel);
			$("#clipOK").click(cliping);
		}
		/*ready*/
		if($("#clipArea").length<1){
			$("section.util-wrap").append(REND("include/clipImage"));
		}
		btnUnbind();
		btnBind();
		function init(inputFile){
			$LAB.js("plugin/hammer.min.js")
				.js("plugin/iscroll-zoom.js")
				.js("plugin/jquery.photoClip.js")
				.wait(function(){
					clear();
					$.getMaxWrap().loadingWrap({"z-index":10001});
					$("#clipArea").photoClip($.extend({
						width: "6.4rem",				/*剪裁宽度 支持rem 纯数字为px 如果strictSize为true用rem会导致不同客户端剪裁的大小不一致 宽高单位应保持一致 px最大320px*/
						height: "6.4rem",				/*剪裁高度 同上*/
						source : null,					/*图片的url源*/
						file: inputFile||"#clipFile", 	/*图片的input源*/
						view: "#clipImg",				/*剪裁后的图片*/
						ok: "#clipBtn",					/*剪裁按钮*/
						compress: false,				/*压缩*/
						outputType: "png",				/*指定输出图片的类型，可选 "jpg" 和 "png" 两种种类型，默认为 "jpg"。*/
						strictSize: false,				/*固定尺寸。默认false：按照原图像素剪裁比例，true：按照宽高放大缩小输出*/
						loadStart: function (file) {	/*this指向 fileReader 对象，并将正在加载的 file 对象作为参数传入 return false可以打断图片加载*/
							if((file.size/1024/1024)>10){
								alert("请选择小于10M的图片");
								close();
								return false;
							}
							$.getMaxWrap().loadingWrap({"z-index":10001});
						},
						loadComplete: function (src) {	/*加载完成的回调函数。this指向未剪裁图片对象，并将图片地址作为参数传入。*/
							$("html,body").loadingWrapCancel();
							$("#clipWrap").show();
						},
						loadError: function(e){			/*加载失败的回调函数。this指向 fileReader 对象，并将错误事件的 event 对象作为参数传入。*/
							$("html,body").loadingWrapCancel();
							alert("加载失败");
						},
						clipStart: function (src) {		/*开始剪裁的回调函数。this指向图片对象，并将图片地址作为参数传入。*/
							$.getMaxWrap().loadingWrap({"z-index":10001});
						},
						clipFinish: function (dataURL) {/*裁剪完成的回调函数。this指向未剪裁图片对象，会将裁剪出的图像数据DataURL作为参数传入。*/
							setTimeout(function(){
								$("html,body").loadingWrapCancel();
								cliped();
							},0);
						}
					},param));
				});
		}
		($("#clipWrap")[0]||{}).close=close;
		return $('<input type="file" accept="image/jpg,image/jpeg,image/png,image/gif,image/tiff,image/bmp"/>').change(function(){init(this);}).click();
	}
	
});

jQuery.fn.extend({
	
	/* 初始化可放大图片 */	
	initImgTouch:function(){
		var $dom=this;
		$LAB
		.css("plugin/touchTouch/touchTouch.css")
		.script("plugin/touchTouch/touchTouch.jquery.js")
		.wait(function(){
			$dom.each(function(){
				if(this.tagName.toLowerCase()=="img"){
					$(this).attr("href", this.src);
				}else{
					var match=$(this).css("background-image").match(/url\("?(.*?)"?\)/);
					$(this).attr("href", (match&&match[1])||"javascript:;");
				}
			}).touchTouch && $dom.touchTouch();
		});
		return $dom;
	}

});