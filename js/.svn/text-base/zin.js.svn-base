(function(){
/*TODO 
 * 一般情况在初始container中刷新 要保留页面 新打开container  NEW() 出现一个page_container
 * 强制目标container刷新(即使目标页面存在)GO()  SHOW()是如果目标页面存在就不刷新 这样也不用考虑什么时候删除
 * */
	var ZIN = {

		_reg:{}, /*ctrl注册表*/
        _ctrls: {},	/*ctrl控制器*/
        _default: null, /*默认ctrl名*/
        _container: "", /*默认容器*/
        _ctrlStack: [], /*ctrl栈*/
        _pool: {}, /*ctrl池*/
        _ctrl: null, /*当前ctrl*/
        _lastCtrl: null, /*上一个ctrl*/
        _beforeCtrl: null, /*上上一个ctrl*/
        _title: "", /*主title*/
        _load: function(){}, /*共用load方法*/
        _process: [], /*执行栈*/
        
        find: function (key, value) {
            var ctrls = [];
            $.keys(this._ctrls, function(v){
            	/*this指向this._ctrls*/
            	if(this[v][key] === value) {
                    ctrls.push(this[v]);
            	}
            });
            return ctrls;
        },
        /*(ctrl注册表, 默认ctrl名, 默认容器, 首先加载的ctrl文件, 主title, 共用load方法)*/
        init: function (ctrls, defaulter, container, baseCtrl, title, load) {
            var zin = this;
            zin._default=defaulter;
            zin._container=container;
            zin._title=title;
            zin._load=load;
            zin.register(ctrls);
            window._errorStack=window._errorStack||[];
            window._ctrlStack=window._ctrlStack||[];
            
            $(window).on('hashchange', function (e) {
            	var force = location.hash.indexOf("(-!-)")>0;
            	if(force){
            		history.replaceState({},"",location.hash.replace("(-!-)",""));
            	}
                go(force);
            });

            function go(force){
                var url = location.hash.indexOf('#') === 0 ? location.hash.split(/\?|&|\(\+~|\(-!-\)/)[0] : '#',
                	name = zin.decode(zin.uniUrl(url.replace("#","")) || zin._default),
                	container = zin.decode(location.hash.split("(+~")[1] && location.hash.split("(+~")[1].split("~+)")[0]),
                	param = zin.getParam();
                	zin["do"](name, param, container, force);
            }

            go();

            return zin;
        },
        register: function (ctrls){
        	this._reg.ctrls=ctrls;
        },
        uniUrl: function(s){
        	return s.toString().replace(/\.\//gm,"").replace(/^\//gm,"").replace(/\.ejs$/gm,"");
        },
        decode: function(s){
    		return s==null?s:decodeURIComponent(s);
    	},
        getParam: function(){
        	var param = ((location.search&&location.search.split("?")[1]) + 
        			"&" + (location.hash.split("?")[1]||"").split(/\(\+~|\(-!-\)/)[0] +
        			"&" + (location.hash.split("?")[2]||"").split(/\(\+~|\(-!-\)/)[0]).split(/[?&#]/),
        		json={},
        		zin=this;
	    	function formJson(data,k,v){
				if(Object.prototype.toString.call(data[k])==="[object Array]"){
					data[k].push(v);
				}else if(data[k]!=null){
					data[k]=[data[k],v];
				}else{
					data[k]=v;
				}
			}
	        for(var i=0;i<param.length;i++){
	        	if(param[i]){
	        		var j=param[i].split("=");
	                if(j){
	                	formJson(json, zin.decode(j[0]), zin.decode(j[1]));
	                }
	        	}
	        }
	        return json;
        },
        format: function (ctrl) {
        	var zin=this;
        	function format (v, ctrl, zin) {
        		v=zin.uniUrl(v);
            	return $.extend(function Ctrl(){
            		$.extend($.extend(this,ctrl),{
	            		_name : v,
	            		_selector : v.replace(/\//gm,"_-"),
	            		_url : ctrl._url||"#"+v,
	            		_template : ctrl._template||{url:"./view/"+v+".ejs"},/*考虑写起来简便，放弃完整路径的写法，所以所有视图必须是ejs，必须在view下*/
	            		_datas : ctrl._datas||{},
	            		_container : ctrl._container||zin._container,
	            		_relateCtrl : ctrl._relateCtrl||[],
	            		_remove : function(all){
	            			if(all!=false){
	            				this._pass && this._pass();
	            				this._dom.remove();
	            				$.delGlobal(this._vars);
	            			}
							if($("[ctrl="+this._selector+"]:visible").length<1){
								$(".ctrl_style[name="+this._selector+"]").remove();
							}
	            		}
	            	});
            	}, {_name:v});
            }
            if(typeof ctrl == "string"){
            	zin._ctrls[ctrl]=format(ctrl,{},zin);
            }else{
            	$.keys(ctrl, function(v){
            		zin._ctrls[v]=format(v,ctrl[v],zin);
            	});
            }
            return zin;
        },

        "do": function (name, param, container, force) {
        	this._process.push([name, param!=null?param:{}, container, force]);
        	if(this._process.length<2){
        		this.process();
        	}
        	return this;
        },
        next: function(){
        	this._process.shift();
        	this.process();
        	return this;
        },
        process: function () {
            var zin=this,
            	ctrl,
            	args=zin._process[0];
            if(args!=null){
            	name=args[0],
            	param=args[1],
            	container=args[2],
            	force=args[3];
            
	            name=zin.uniUrl(name);
	            function start(name){
	            	var ctrl = new zin._ctrls[name]();
	            	window._param=ctrl._param=param;
	            	ctrl._hash=zin.joinUrl(ctrl._url, param, container, force);
	            	if(typeof ctrl._preLoad=="function"){
	            		ctrl._preLoad();
	            	}
	            	return ctrl;
	            }
	            /*请求ctrl的js，$LAB.js(url)，还有所有links并不会重复加载*/
	        	var url = zin._reg.ctrls[name];
	        	/*TODO lab的引用是不是有问题啊 怎么就会有并发问题 明明没有引用就进去了 都乱了
	        	 * 难道是ctrl变量的问题？由于方法执行较慢，方法执行中被再次进入方法时改变了变量，所以执行的过程就混乱了。show里传的可能是上一个的param和这一个的ctrl
	        	 * 两次迅速执行这里的方法就会导致url没有被引用 直接进wait里的方法*/
	        	$LAB.js(url).wait(function(failItem){
	        		try{
		        		if(zin._ctrls[name]==null){
		        			zin.format(name);
		        		}
		        		ctrl=start(name);
		                var links = ctrl._links;
		                $.keys(links, function(link){
		                    var v=links[link];
		                    if(link!=null && link!=""){
		                        if(v=="img"){
		                            new Image().src=link; /*不会重复加载*/
		                        }else if(v=="js"||v=="script"){
		                        	ctrl._scripts=ctrl._scripts||[];
		                        	ctrl._scripts.push(link);
		                        }else{
		                        	ctrl._styles=ctrl._styles||[];
		                        	ctrl._styles.push('<link href="'+link+'?_ver='+_Version+'" '+(v=="css"?'rel="stylesheet"':'')+'/>');
		                        }
		                    }
		                });
	        		}finally{
	        			if(ctrl!=null && ctrl._goShow!=false){
		                	zin.show(ctrl, param, container, force);
		                }else{
		                	zin.next();
		                }
	        		}
	        	});
            }
            
        	return zin;
        },
        show: function(ctrl, param, container, force){
        		ctrl._status="onshow";
        		ctrl._container=container=container||ctrl._container;
        	
	        	var zin=this,
	        		pageSwitch=$(container).hasClass("page_switch"),
	        		hasCtrl=$(container).children("[ctrl="+ctrl._selector+"]"),
	        		onlyShow=force==true ? false : (pageSwitch && hasCtrl.length>0);
	        	
	        	/*start*/
	        	$("title").html(zin._title+(ctrl._title?("-"+ctrl._title):""));
	        	
	        	if(pageSwitch){
	        		$(".page_switch").loadingWrap("transparent",{opacity:0.6},false);
	        	}else{
	        		$(container).loadingWrap("transparent",{opacity:0.6},false);
	        	}
	
	            /*load*/
	        	if(onlyShow){
	        		show();
	        	}else{
	        		$.setGlobal(ctrl._vars);
	                $.dataHandle(ctrl._datas, param, show, ctrl);
	        	}
	        	/* TODO 缺陷 onlyshow不能读取数据 读取数据必然重新渲染 it's a bug 要做到dom跟数据分离 必须脱离模版 */
	        	function show(datas){
	        		if(ctrl._goShow==false){
	        			zin.next();
	        			return;
	        		}
	        		var $dom;
	            	if(!onlyShow){
	            		window._datas=ctrl._datas=datas;
	            		/*warn 加载text不存在异步的问题吗？*/
	    	            try{
	    	            	var template=new EJS(zin.verTmpl(ctrl._template)).text,
	    	            		text=new EJS({text:template}).render(ctrl);
	    	            		styles=text.match(/<style[\s\S]*?\/style>/gm);
	    	            	if(styles && styles.length>0){
	    	            		ctrl._styles=(ctrl._styles||[]).concat(styles);
	    	            	}
	    	            	$dom = $('<div>'+text+'</div>').attr("ctrl", ctrl._selector).find("style").remove().end();
	    	            }catch(e){
	    	            	var ee=$.extend(e, {ctrl:ctrl, errorMsg:e.message});
	    					var str_404="There is no template at ";
	    					if(e.type=="EJS" && e.message.indexOf(str_404)>-1){
	    						if(ctrl._goError!=false)zin["do"](404, ee);
	    					}else{
	    						if(ctrl._goError!=false)zin["do"]("error", ee);
	    					}
	    					zin.next();
	    					throw e;
	    	            }
	    	            
	    	            ctrl._dom=$dom;
	    	            $dom[0]._ctrl=ctrl;
	            	}else{
	            		hasCtrl[0].ctrl._param=ctrl._param;
	            		ctrl=hasCtrl[0].ctrl;
	            		$dom=ctrl._dom;
	            		window._datas=ctrl._datas;
	            	}

		            if(pageSwitch){
		            	/*unload preStack*/
		        		$(".page_switch").hide().children("[ctrl]").each(function(i,dom){
		        			if($(container).is($(dom.ctrl._container))){/*该DOM在目标container*/
		        				if(!onlyShow){/*onlyshow表示目标container存在目标ctrl 并非强制刷新*/
		        					dom.ctrl._remove();
		        				}
		        			}else if(dom.ctrl._relateCtrl!=ctrl._name && dom.ctrl._relateCtrl.indexOf(ctrl._name)<0){
		        				/*若该DOM所占ctrl的关联ctrl是当前ctrl 则保持该DOM不被清除 否则清除*/
		        				if($(dom.ctrl._container).is(zin._container)){/*主container保留 不是主container的会删掉 防止附属container保留时间长页面被修改*/
		        					dom.ctrl._remove(false);
		        				}else{
		        					dom.ctrl._remove();
		        				}
		        			}
		                });
		        		$(".ctrl_style").each(function(){
	        				if($("[ctrl="+$(this).attr("name")+"]:visible").length<1){
								$(".ctrl_style[name="+$(this).attr("name")+"]").remove();
							}
		        		});
		        		/*show*/
		            	$(container).show();
		            	var orginStyle=$dom.attr("style");
		            	if(ctrl._slideStyle){
		            		$dom.attr("style",ctrl._slideStyle);
		            	}
		            	function fixPage(){
		            		$dom.attr("style",orginStyle);
		            		$.fixPage($dom);
		            	}
		            	$.prePage($dom.addClass("page"),fixPage,ctrl);
		            	$(".page_switch").loadingWrapCancel();
		            }else{
		        		$(container).loadingWrapCancel();
		        	}

		            /*stack add 先入stack 后load*/
		            window._beforeCtrl=zin._beforeCtrl=zin._lastCtrl;
		            window._lastCtrl=zin._lastCtrl=zin._ctrl;
		            window._ctrlStack.unshift(window._ctrl=ctrl);
		            zin._ctrlStack.unshift(zin._ctrl=ctrl);
		            zin._pool[ctrl._name]=ctrl.constructor;
		            
		            /*insert*/
		            /*按照样式覆盖规则 必须append 不能prepend
		             * ctrl._style为Ctrl里字符串拼的样式
		             * ctrl._styles里有引用样式，有模版里拿出来的段落样式
		             * */
		            if($(".ctrl_style[name="+ctrl._selector+"]").length<1){
		            	if(ctrl._style)$("head").append('<style class="ctrl_style" name="'+ctrl._selector+'">'+ctrl._style+'</style>');
			            if(ctrl._styles)$.each(ctrl._styles,function(i,style){
		            		$("head").append($(style).addClass("ctrl_style").attr("name",ctrl._selector));
		            	});
		            }
		            
		            function load(){
		            	try{
			            	if(!onlyShow){
			            		$(container).append($dom);
			            		$(window).scrollTop(0);
			            		zin.bind(ctrl, container);
			            	}
			            	ctrl._status="onload";
			            	zin._load.apply(ctrl,[pageSwitch, onlyShow]);
			            	if(!onlyShow){
			            		ctrl._load && ctrl._load();
			            	}
			            	ctrl._show && ctrl._show();
			            	setTimeout(function(){
			            		ctrl._status="loaded";
			            	},$.animatime);
		            	}finally{
		            		zin.next();
		            	}
		            }
		            
		            if(ctrl._scripts && ctrl._scripts.length>0){
		                $LAB.setOptions({AlwaysPreserveOrder:true}).js(ctrl._scripts).wait(function(){
		                    load();
		                });
		            }else{
		            	load();
		            }
		
	        	}

            return zin;
        },
        go: function (name, param, container, force) {
        	var url = this.joinUrl("#"+name, param, container, force);
            if(location.hash==url){
            	location.reload();
            }else{
            	location.hash = url;
            }
            return this;
        },
        joinUrl: function(url, param, container, force){
        	var str = "?";
            if(typeof param == "object"){
            	str+=(param!=null?$.param(param, true):"");
            }
            return encodeURI(url) + (str.length>1 ? str : "") + (container ? ("(+~"+encodeURIComponent(container)+"~+)") : "") + (force==true?"(-!-)":"");
        },
        verTmpl: function(template){
        	if(Object.keys(template).indexOf("url")>-1){
        		template["url"]=template["url"]+"?_ver="+window._Version;
        	}
        	return template;
        },
        reshow: function(){
        	var ctrl = this._ctrl;
        	this.show(new ctrl.constructor(), ctrl._param, ctrl._container);
        	return this;
        },
        reload: function(force){
        	var _ctrl = this._ctrl,
        		ctrl = new _ctrl.constructor();
        	ctrl._scripts = _ctrl._scripts;
        	ctrl._styles = _ctrl._styles;
        	ctrl._hash = _ctrl._hash;
        	ctrl._param = _ctrl._param;
        	if(force){
        		location.reload();
        	}else{
                this.show(ctrl, _ctrl._param, _ctrl._container, true);
        	}
        	return this;
        },
        /* 视图的DOM事件绑定 */
        bind: function (ctrl, container) {
            var events = ctrl._events;
            container = (container ? $(container) : $(ctrl._container)).children("[ctrl="+ctrl._selector+"]");/*一定要用可销毁的子对象做父级 否则所有的事件会累加*/
            for (var selector in events) {
                if(typeof events[selector]=="function"){
                	var eventType="click";
                    container.on(eventType, selector, events[selector]);
                }else{
                	for (var eventType in events[selector]) {
                        container.on(eventType, selector, events[selector][eventType]);
                        /*
                    	container.on(eventType, selector, function(){
                    		eval("("+events[selector][eventType]+").call(this,arguments)");
                    	});
                    	这样此event可以获取该function内的局域变量 如ctrl container events selector eventType，
                    	但debug的时候看不到function所在的js。
                        */
                	}
                }
            }
            return this;
        },
        rend: function(name ,data){
        	var zin=this;
	    	name=zin.uniUrl(name);
	    	function resolve(){
	    		var ctrl = new zin._ctrls[name];
	    		return new EJS(zin.verTmpl(ctrl._template)).render(data);
	    	}
	    	if(zin._ctrls[name] && zin._pool[zin._ctrls[name]._name]){ /*加载过*/
	    		return resolve();
	    	}else{
	    		var url = zin._reg.ctrls[name];
	    		url && $.ajaxSync(url,"get");
    			if(zin._ctrls[name]==null){
    				zin.format(name);
    			}
	    		return resolve();
	    	}
        },
        uniTpl: function(template){
        	if(typeof template=="string"){
        		return template.match(/\.ejs$/)?{url:template}:{text:template};
        	}else{
        		return template;
        	}
        },
        render: function(template, data){
        	var zin=this;
        	function rend(render,data){
        		if(data instanceof DATA){
        			if(render.data instanceof DATA){
        				data=$.extend($.extend({},render.data),data);
        			}
        			data=$.ajaxSync(data._url,data._type,data._params,data._callback);
        		}
        		var html=new EJS(zin.verTmpl(zin.uniTpl(render.template))).render(data);
        		var count=0;
        		$(render.doms).each(function(i,o){
        			var dom=$("#render"+o);
        			if(dom.length<1)
        				render.doms.splice(i-count++,1);
        			else
        				dom.html(html);
        		});
        		var id=(new Date().getTime()+Math.random()).toString().replace(/\./gm,"_");
        		render.doms.push(id);
        		return '<div id="render'+id+'">'+html+'</div>';
        	}
        	return $.extend(function(data){
        		return rend(arguments.callee, data||arguments.callee.data);
        	}, {
        		template:template,
        		data:data,
        		ajax:function(){return rend(this, DATA.apply(window, arguments));},
        		post:function(){return rend(this, POST.apply(window, arguments));},
        		get:function(){return rend(this, GET.apply(window, arguments));},
        		"delete":function(){return rend(this, DELETE.apply(window, arguments));},
        		put:function(){return rend(this, PUT.apply(window, arguments));},
        		doms:[]
        	});
        }
    };
	
    window.GO=function(name, param, container){return ZIN.go(name, param, container);};
    window.DO=function(name, param, container){return ZIN["do"](name, param, container);};
    window.RESHOW=function(){return ZIN.reshow();};
    window.RELOAD=function(force){return ZIN.reload(force);};
    window.REND=function(name, data){return ZIN.rend(name, data);};
    window.RENDER=function(template, data){return ZIN.render(template, data);};
    window.FORMAT=function(ctrl){return ZIN.format(ctrl);};
    window.ZINIT=function(ctrls, defaulter, container, baseCtrl, title, load){return ZIN.init(ctrls, defaulter, container, baseCtrl, title, load);};
    /*附到$上的方法，要注意方法内部的this，别被替换*/
    $.joinUrl=ZIN.joinUrl;
    $.getParam=function(){return ZIN.getParam();};
})();