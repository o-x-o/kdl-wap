(function(){
	/*公用变量和方法*/

FORMAT({

    /*注册*/
	"passport/register": {
    	_title:"注册",
    	_links:{
    		"plugin/jquery.md5.js":"js"
    	},
    	submitCall: function(res, params){
    		submitCall(res, params, "#passport/guide");
    	},
    	_footer:false,
    	_pass: function(){
    		window["count"+this._name]=0;
    		clearInterval(window["verifyCountKey_"+this._name]);
    	},
        _load: function(){
        	verifyCount();
            $("form").validate({
                rules: {
                    username: {
                        required: true,
                        pattern: /^1[3|4|5|7|8]\d{9}$/
                    },
                    verifyCode: {
                        required: true,
                        pattern: /^\d{6}$/,
                        remote:{
                            type:"GET",
                            url:"passport/checkVerifyCode.shtml",
                            data:{
                            	telephone:function(){return $("[name=username]").val();},
                            	verifyCode:function(){return $.md5($("[name=verifyCode]").val());},
                            	smsType:"register"
                            }
                        } 
                    },
                    password: {
                        required: true,
                        pattern: /^[0-9a-zA-Z_]{6,16}$/
                    },
                    checkbox: {
                    	required: true
                    }
                },
                messages:{
                	verifyCode:{
                    	remote:"短信码错误"
                    },
                    checkbox:{
                    	required:"请确认"
                    }
                }
            });
            $("#KAIDIANLAATJR").val(localStorage.get("KAIDIANLAATJR"));
        },
        _events:{
        	".content form>div span.iconfont":{
        		click: passwordToggle
        	},
        	".content form>div.txt :checkbox":{
        		change: function(){
        			var icon=$(this).closest(".txt").find("i");
                    var text =icon.text();
                    if(icon.text()==""){
                        icon.text("");
                        icon.css({color:'#df494a'});
                    }
                    else{
                        icon.text("");
                        icon.css({color:'#666'});
                    }
        		}
        	},
        	".kdl-right": {
        		click: function(){
        			verifyCodeFunc.call(this,"register");
        		}
        	},
        	//更换验证码
        	"#captchaImage":{
        		click : function(){
        			$(this).attr("src", "./passport/captcha.shtml");
        		}
        	}
        },
        _style:"\
            .content form{ padding: .3rem .2rem;box-sizing: border-box;}\
			.content form>div.verify>span.yanzi{ border:0;padding:0;}\
        	.content form>div.verify>span.yanzi>img{width:100%; height:100%;vertical-align: baseline;}\
            .content form>div{ position: relative; box-sizing: border-box;}\
            .content form>div i{position: absolute;left: .2rem;top: .29rem;color: #666;font-size: .26rem;}\
            .content form>div>input{ width: 100%;border-radius: .05rem; height: .6rem; line-height: .4rem; padding: .1rem 0; background-color: #fff;border: 1px solid #e5e5e5;font-size: .24rem;text-indent: .6rem;color: #999;}\
            .content form>.verify>input{width: 4rem;}\
            .content form>div.verify>span{width:1.85rem; text-align:center; height: .8rem;border:1px solid #df494a;color: #df494a;font-size: .26rem;border-radius: .05rem;line-height: .8rem;padding: 0 .2rem;box-sizing: border-box;float: right;}\
            .content form>div span.iconfont{position: absolute;cursor:pointer;text-align: center; right:0;top:0.05rem;color: #666; font-size: .42rem; height:.8rem;line-height:.8rem;width:1rem;}\
            .content form>div.txt{font-size: .24rem;padding-left: .35rem;margin-bottom: .3rem;}\
            .content form>div.txt i{top: .02rem;position: relative;left: -.15rem;}\
            .content form>div.verify>span.current{border:1px solid #ddd; color:#999; background-color: #fff;}\
        "
    },
    /*登录*/
    "passport/login": {
    	_title:"登录",
    	//_template:{url:"view/passport/login.ejs"},
    	_links:{
    		"plugin/jquery.md5.js":"js"
    	},
    	_footer:false,
    	_pass: function(){
    		window["count"+this._name]=0;
    		clearInterval(window["verifyCountKey_"+this._name]);
    	},
        _load: function(){
        	//$("#phoneLogin").hide();
        	verifyCount();
        	formValidate();
            /* 登陆不做验证码单独校验 涉及撞库 */
        	this.showBindWX(1);
        },
        _events:{
            ".con-hd>ul>li": {
                click: function () {
                	$("[class^=tip-]").remove();
                    $(this).addClass("cur").siblings().removeClass("cur");
                    if ($(this).index() == 0) {
                        $("#login").show();
                        $("#phoneLogin").hide();
                        _ctrl.showBindWX(1);
                    } else {
                        $("#login").hide();
                        $("#phoneLogin").show();
                        _ctrl.showBindWX(2);
                    }
                }
            },
            ".password":{
                 click: passwordToggle
            },
            ".verifyCode": {
            	click: function(){
            		verifyCodeFunc.call(this,"login");
            	}
        	},
        	//更换验证码
        	"#captchaImage":{
        		click : function(){
        			$(this).attr("src", "./passport/captcha.shtml");
        		}
        	},
        	"input[name=bindWX]":{
        		change: function(){
        			var icon=$(this).closest(".txt").find("i");
                    var text =icon.text();
                    if(icon.text()==""){
                        icon.text("");
                        icon.css({color:'#df494a'});
                        $(this).attr("checked","checked");
                    }else{
                        icon.text("");
                        icon.css({color:'#666'});
                        $(this).removeAttr("checked");
                    }
        		}
        	},
        },
        showBindWX:function(type){
        	var ua = window.navigator.userAgent.toLowerCase();
            var reg = /MicroMessenger\/[5-9]/i;
            var openId = $.getCookie("kdl_openId");
     		if((reg.test(ua) && openId)){//是微信浏览器
     			$("input[name=bindWX]").attr("checked","checked");
     			$("#bindingWX"+type).attr("checked","checked");
     			$("#bindingWX"+type).find("i").each(function(){
     				$(this).html("").css({color:'#df494a'});
     			});
     			if(type == 1){
            		$("#bindingWX1").show();
            		$("#bindingWX2").hide();
            	}else if(type == 2){
            		$("#bindingWX1").hide();
            		$("#bindingWX2").show();
            	}
     		}
        },
        loginCall: function(res, params){
        	var backUrl=this._param.backUrl;
        	submitCall(res, params, backUrl?backUrl:(_lastCtrl && _lastCtrl._hash.indexOf("passport")<0)?_lastCtrl._hash:"#ucenter/mine");
        },
        phoneLoginCall: function(res, params){
        	var backUrl=this._param.backUrl;
        	submitCall(res, params, backUrl?backUrl:(_lastCtrl && _lastCtrl._hash.indexOf("passport")<0)?_lastCtrl._hash:"#ucenter/mine");
        },
        goBack:function(){
        	var ua = window.navigator.userAgent.toLowerCase();
            var reg = /MicroMessenger\/[5-9]/i;
            if(reg.test(ua)){//如果是在微信浏览器
            	var lastUrl = this._param.lastUrl;
            	if(lastUrl){
            		lastUrl = lastUrl.substr(1);
            		GO(lastUrl);
            	}else{
            		GO("ucenter/mine");
            	}
            }else{
            	history.go(-1);
            }
        },
        toLogin : function(loginType){
            var openId = $.getCookie("kdl_openId");
            var formName = null;
            if(loginType == "password"){
            	formName = "login";
            }else if(loginType == "verifyCode"){
            	formName = "phoneLogin";
            }
            if(openId != null && openId != ""){
            	var checkWeiXin = false;
            	var paraData = null;
            	var bindWeiXinName = null;
            	if(loginType == "password" && $("#logBindWeiXin1").attr("checked")=="checked"){
            		checkWeiXin = true;
            		bindWeiXinName = "logBindWeiXin1";
            		paraData={"username":$("#loginUsername").val(),"password":$("#loginPassword").val()}
            	}else if(loginType == "verifyCode" && $("#logBindWeiXin1").attr("checked")=="checked"){
            		checkWeiXin = true;
            		bindWeiXinName = "logBindWeiXin2";
            		paraData={"username":$("#loginUsername1").val(),"verifyCode":$("#verifyCode").val()}
            	}
            	if(checkWeiXin){
            		$.ajax({
            			url:"passport/checkWeiXin.shtml",
            			data:paraData,
            			async:false,
            			dataType:"json",
            			type:"post",
            			success:function(data){
            				console.log(data);
            				if(data.status==0){
            					alert(data.errorMsg);
            					return false;
            				}else{
            					if(data.data.isShow){
            						alert(data.data.content,true,function(flag){
            							if(flag){
            								$("#"+formName).submit();
            							}else{
            								$("#"+bindWeiXinName).removeAttr("checked");
            								$("#"+formName).submit();
            							}
            			        	},true);
            						return false;
            					}else{
            						$("#"+formName).submit();
            						return false;
            					}
            				}
            				return false;
            			},
            			error:function(data){
            				alert("亲，系统错误请您稍后再试！");
            			}
            		});
            		return false;
            	}else{
            		$("#"+formName).submit();
            	}
            }else{
            	$("#"+formName).submit();
            }
            return false;
        },
        _style:"\
        	.content form>div.verify>span.yanzi{ border:0;padding:0;position:absolute;}\
        	.content form>div.verify>span.yanzi>img{width:100%; height:100%;vertical-align: baseline;}\
            .content form{ padding: .3rem .2rem;box-sizing: border-box;}\
            .content .con-hd>ul>li{height:.8rem; line-height:.8rem; width:50%; float:left; text-align:center;}\
            .content .con-hd>ul>li>a{ font-size:.28rem;}\
            .content .con-hd>ul>li.cur{border-bottom:1px solid #df494a;}\
            .content form>div{ position: relative; box-sizing: border-box;}\
            .content form>div>i{position: absolute;left: .2rem;top: .29rem;color: #666;font-size: .26rem;}\
            .content form>div>input{ width: 100%;border-radius: .05rem; height: .6rem; line-height: .4rem; padding: .1rem 0; background-color: #fff;border: 1px solid #e5e5e5;font-size: .24rem;text-indent: .6rem;color: #999;}\
            .content form>div>span{position: absolute;right:0;top:0;color: #666;text-align: center; font-size: .42rem; height:.8rem;line-height:.8rem;width:1rem;}\
            .content form>a{ line-height:.73rem; font-size:.24rem;}\
            .content form>div.verify>span{ position:static;} \
            .content form>button.btn-border{ padding:.1rem .3rem; margin-top:.3rem;background-color: transparent;}\
            .content form{ text-align:center;}\
            .content form>div.verify{ margin-bottom:.3rem;}\
            .content form>div.verify>input{width: 4rem;}\
            .content form>div.verify>span{width: 1.85rem;height: .8rem;border:1px solid #df494a;color: #df494a;font-size: .26rem;border-radius: .05rem;line-height: .8rem;padding: 0 .2rem;box-sizing: border-box;float: right;}\
        "
    },
    
    /*忘记密码*/
    "passport/passwordFind":{
    	_title:"忘记密码",
    	_links:{
    		"plugin/jquery.md5.js":"js"
    	},
    	_footer:false,
    	_pass: function(){
    		window["count"+this._name]=0;
    		clearInterval(window["verifyCountKey_"+this._name]);
    	},
        _load: function(){
        	verifyCount();
        	formValidate();
        },
        submitCall: function(res, params){
        	submitCall(res, params, "#passport/login");
        },
        _events:{
        	".content form>div span.iconfont":{
        		click: passwordToggle
        	},
        	".verifyCode": {
        		click: function(){
        			verifyCodeFunc.call(this,"forgetPw");
        		}
        	},
        	//更换验证码
        	"#captchaImage":{
        		click : function(){
        			$(this).attr("src", "./passport/captcha.shtml");
        		}
        	}
        },
        _style:"\
        	.content form>div.verify>span.yanzi{ border:0;padding:0;position:absolute;right:0;}\
        	.content form>div.verify>span.yanzi>img{width:100%; height:100%;vertical-align: baseline;}\
            .content form{ padding: .3rem .2rem;box-sizing: border-box;}\
            .content form>div{ position: relative; box-sizing: border-box;}\
            .content form>div>i{position: absolute;left: .2rem;top: .29rem;color: #666;font-size: .26rem;}\
            .content form>div>input{ width: 100%;border-radius: .05rem; height: .6rem; line-height: .4rem; padding: .1rem 0; background-color: #fff;border: 1px solid #e5e5e5;font-size: .24rem;text-indent: .6rem;color: #999;}\
            .content form>.verify>input{width: 4rem;}\
            .content form>div.verify>span{width: 1.85rem;text-align: center;height: .8rem;border:1px solid #df494a;color: #df494a;font-size: .26rem;border-radius: .05rem;line-height: .8rem;padding: 0 .2rem;box-sizing: border-box;float: right;}\
            .content form>div span.iconfont{cursor: pointer; text-align: center;position: absolute;right: 0;top: 0.05rem;color: #666; width:1rem; font-size: .42rem; height:.8rem; line-height:.8rem; display:inline-block;}\
            .content form>div.txt{font-size: .24rem;padding-left: .6rem;margin-bottom: .3rem;}\
            .content form>div.txt>i{top: .02rem;}\
            .content form>div.verify>span.current{border:1px solid #ddd; color:#999; background-color: #fff;}\
        "
    },
    
    /*注册向导*/
    "passport/guide":{
    	_title:"注册向导",
    	_footer:false,
        _load:function(){
        	this._dom.css({"min-height":$(window).height(),"background-color":"#7d99ed"});
        },
        _events:{
        	".click1":{
        		click:function(){
        			alert("开店啦普通会员通过店主申请后的一种身份，即“店主”，店主拥有代销商品获得销售佣金等特权。");
        		}
        	},
        	".click2":{
        		click:function(){
        			alert("<br><h6>1，完成公司信息认证</h6><br>\
					<p>（1）成为开店啦用户后上传商家营业执照</p>\
					<p>（2）上传店铺名称等信息</p>\
					<p>（3）等待审核</p>\
					<br><h6>2，完成店铺具体相关信息认证</h6><br>\
					<p>（1）填写店铺联系人信息</p>\
					<p>（2）选择店铺所属行业</p>\
					<p>（3）填写店铺具体地址</p>\
					<p>（4）等待二次审核</p>\
					<br><h6>3，审核通过，开始开店</h6><br>");
				}
        	}
        },
        _style:"\
        .content>div.pic{position:relative;}\
        .content>div.pic>img{width:100%;}\
        .content>div.pic>.click1{left: 1rem;top: 1rem;}\
        .content>div.pic>.click2{top:4.7rem;}\
        .content>div.pic>button{ position:absolute; background:transparent; width:1.5rem; height:.5rem; border:0; cursor:pointer; left:3.17rem;}\
        .content>div.pic>button.btn1{top:3.14rem;}\
        .content>div.pic>button.btn2{top:7.44rem;}\
        .content>div.pic>button.btn3{ width:6rem; height:.8rem; left:.21rem; bottom:.84rem;}\
        "
    },
    /*注册协议*/
    "passport/registrationProtocol":{
        _title:"注册协议",
        _footer:false,
        _load:function(){

        }
    }
});


/*此js里公用的方法*/

function verifyCount(){
	var name=_ctrl._name,
		btn=$(".verifyCode")[0],
		key=window["verifyCountKey_"+name];
	window["count"+name]=window["count"+name]||0;
	if(key){
		clearInterval(key);
	}
	window["verifyCountKey_"+name]=setInterval(function(){
		var store=--window["count"+name];
		if(isNaN(store) || store==null || store<1){
			window["count"+name]=0;
			if(btn){
				btn.block=false;
				$(btn).html("获取短信码");
				$(btn).removeClass("current");
				$(".captcha").show();
			}
		}else{
			if(btn){
				btn.block=true;
				$(btn).html(window["count"+name]+"秒后重发");
				$(btn).addClass("current");
				$(".captcha").hide();//隐藏图文验证码
			}
		}
	},1000);
}

function formValidate(){
	 $("form").each(function(i,form){
     	$(form).validate({
             rules: {
                 username: {
                     required: true,
                     pattern: /^1[3|4|5|7|8]\d{9}$/
                 },
                 verifyCode: {
                     required: true,
                     pattern: /^\d{6}$/
                 },
                 password: {
                     required: true,
                     pattern: /^[0-9a-zA-Z_]{6,16}$/
                 }
            },
     		messages: {
     			username:{
     				required: "请输入手机号",
                    pattern: "请输入正确的手机号"
     			},
         		password:{
                    required: "请输入密码",
                    pattern: "密码格式为6到16位数字、字母或下划线"
                }
     		}
         });
     });
}

//获取短信验证码
function verifyCodeFunc(type){
	var btn=this;
	if(btn.block!=true){
		var input=$(btn).closest("form").find("[name=username]");
		var username=input.val();
		var captcha = $("#captcha").val();
		if(captcha == null || captcha == ""){
			alert("请输入图文验证码！");
			return;
		}
		if(username.match(/^0?1[3|4|5|7|8][0-9]\d{8}$/)){
			$.get("passport/verify.shtml?",{
				telephone:username,
				captcha:captcha,
				smsType:type
			},function(res){
				if(res.status==1){
					window["count"+_ctrl._name]=60;
					//清空验证码
    	    		$("#captcha").val("");
            		$("#captchaImage").click();
				}else{
					alert((res.errorMsg||"操作有误"), 3000);
					btn.block=false;
				}
			});
		}else{
			input.tipsWarn("请输入正确的手机号", 2000);
		}
	}
}

function submitCall(res, params, url, success){
	if(res.status){
		if(res.data){
			var user=res.data.user;
			var accessToken = res.data.accessToken;
			localStorage.setItem("accessToken",accessToken);
			if(user)user.password=null;
			window._user=user;
		}
		success && success();
		if(url){
			if(location.hash==url)
				location.reload();
			else
				location.href=url;
		}
	}else{
		alert(res.errorMsg);
	}
}

function passwordToggle(){
	var text =$(this).text();
    if($(this).text()==""){
        $(this).text("");
        $(this.ctrl._dom).find("[name=password]")[0].type="tel";
    }
    else{
        $(this).text("");
        $(this.ctrl._dom).find("[name=password]")[0].type="password";
    }
}

/*此js里公用的方法*/


})();