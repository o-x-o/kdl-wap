(function(){
	/*公用变量和方法*/
	function submitCall(res, params, url){
		if(res.status == "1"){
			//跳转页面
			alert("申请成功");
			GO(url||"ucenter/mine");
		}else{
			alert(res.errorMsg);
		}
	}
	//验证银行卡
	function validateBankCard(){
		$("form").each(function(){
			$(this).validate({
	            rules: {
	            	code: {
	                    required: true,
	                    pattern: /^[0-9\s]+$/,
	                },
	                selectBank:"required",
	                bankCardPerson: "required",
	                personIdCard:{
	                	required: true
	                },
	                personTelephone:{
	                	required: true,
	                	pattern: /^1[3|4|5|7|8]\d{9}$/,
	                }
	            },
	            messages:{
	            	code:{
	           		 	required:"卡号必填",
	           		 	pattern:"卡号格式不正确"
	                },
	                selectBank:{
	                	required:"请选择银行"
	                },
	                bankCardPerson:{
	               	 	required:"持卡人姓名必填"
	                },
	                personIdCard:{
	           		 	required:"身份证号必填"
	                },
	                personTelephone:{
	           		 	required:"银行预留手机必填",
	           		 	pattern:"手机号格式不正确"
	                }
	            }
	        });
		});
	}
	//银行卡填写中校验项
	function checkBankCard(){
		var $code = $("#code"); 
        var $selectBank = $("#selectBank");
        var $bankCardPerson = $("#bankCardPerson");
  		var $personIdCard = $("#personIdCard");
  		var $personTelephone = $("#personTelephone");
  		
        $("#code").keyup(function(){
        	  if (this.value == "") return;
              var account = new String (this.value);
              account = account.substring(0,23); /*帐号的总数, 包括空格在内 */
              if (account.match (".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}") == null){
                  /* 对照格式 */
                  if (account.match (".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}|" + ".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}|" +
                  ".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}|" + ".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}") == null){
                      var accountNumeric = accountChar = "", i;
                      for (i=0;i<account.length;i++){
                          accountChar = account.substr (i,1);
                          if (!isNaN (accountChar) && (accountChar != " ")) accountNumeric = accountNumeric + accountChar;
                      }
                      account = "";
                      for (i=0;i<accountNumeric.length;i++){    /* 可将以下空格改为-,效果也不错 */
                          if (i == 4) account = account + " "; /* 帐号第四位数后加空格 */
                          if (i == 8) account = account + " "; /* 帐号第八位数后加空格 */
                          if (i == 12) account = account + " ";/* 帐号第十二位后数后加空格 */
                          if (i == 16) account = account + " ";/* 帐号第十六位后数后加空格 */
                          account = account + accountNumeric.substr (i,1);
                      }
                  }
              }
              else
              {
                  account = " " + account.substring (1,5) + " " + account.substring (6,10) + " " + account.substring (14,18) + "-" + account.substring(18,25);
              }
              if (account != this.value) this.value = account;
              
              if($personIdCard.val()!="" && $selectBank.val()!="请选择银行" && $code.val()!="" && $personTelephone.val()!="" && $personTelephone.val().length==11 && $code.val().length > 18){
  				document.getElementById("present").disabled = false;
  			  }else{
  				document.getElementById("present").disabled = true;
  			  }
              
              if(this.value.length == 23){
  				var account = this.value.replace(/\ +/g,"");
  				$.get("bankCard/getBankByCode.shtml",{code:account+""},function(data){
  					if(data.status == "1"){
  						$selectBank.val(data.data.bankId);
  					}
  				});
  			}
        });
        
		$bankCardPerson.keyup(function(){
			if($personIdCard.val()!="" && $selectBank.val()!="请选择银行" && $code.val()!="" && $personTelephone.val()!="" && $personTelephone.val().length==11 && $code.val().length > 18){
				document.getElementById("present").disabled = false;
			}else{
				document.getElementById("present").disabled = true;
			}
		});
		
		$selectBank.change(function(){
			if($personIdCard.val()!="" && $bankCardPerson.val()!="" && $code.val()!="" && $personTelephone.val()!="" && $personTelephone.val().length==11 && $code.val().length > 18){
				document.getElementById("present").disabled = false;
			}else{
				document.getElementById("present").disabled = true;
			}
		});
		
		$personTelephone.keyup(function(){
			if($personIdCard.val()!="" && $selectBank.val()!="请选择银行" && $code.val()!="" && $bankCardPerson.val()!="" && $personTelephone.val().length==11 && $code.val().length > 18){
				document.getElementById("present").disabled = false;
			}else{
				document.getElementById("present").disabled = true;
			}
		});
		$personIdCard.keyup(function(){
			if($personTelephone.val()!="" && $selectBank.val()!="请选择银行" && $code.val()!="" && $bankCardPerson.val()!="" && $personTelephone.val().length==11 && $code.val().length > 18){
				document.getElementById("present").disabled = false;
			}else{
				document.getElementById("present").disabled = true;
			}
		});
		$code.keyup(function(){
			if($personTelephone.val()!="" && $selectBank.val()!="请选择银行" && $personIdCard.val()!="" && $bankCardPerson.val()!="" && $personTelephone.val().length==11 && $code.val().length > 18){
				document.getElementById("present").disabled = false;
			}else{
				document.getElementById("present").disabled = true;
			}
		});
	}
	
FORMAT({
	
    /*会员中心*/
	"ucenter/mine":{
    	_title:"会员中心",
        _load:function(){
        	$.getUser(function(user){
        		if(user!=null){
        			//获取收藏的数据
        			$.get("ucenter/favoriteCount.shtml",function(data){
                		if(data.status == "1"){
                			$(".ft>ul>li").eq(0).find("span").eq(0).text(data.data.goodsAttentionCount).show();
                			$(".ft>ul>li").eq(1).find("span").eq(0).text(data.data.shopAttentionCount).show();
                		}
                	});
                	$.get("order/orderCount.shtml",function(data){
                		if(data.status == "1"){
                			if(data.data.pePay>0){
                				$("#pePay").append("<span>"+data.data.pePay+"</span>");
                			}
                			if(data.data.hasShi>0){
                				$("#hasShi").append("<span>"+data.data.hasShi+"</span>");
                			}
                			if(data.data.peEvaluate>0){
                				$("#peEvaluate").append("<span>"+data.data.peEvaluate+"</span>");
                			}
                			if(data.data.noCon>0){
                				$("#noCon").append("<span>"+data.data.noCon+"</span>");
                			}
                		}else{
                			if(data.status == "0" && data.errorCode == "1000"){//未登录
            					DO('passport/login',{backUrl:'#ucenter/mine'});
        						return false;
            				}else{
            					alert(data.errorMsg);
            				}
        				}
                	});
        		}
        	});
        	//根据当前时间判断是否更新红点状态
        	if(localStorage.getItem("accessToken")){ //当前已登录
        		if(localStorage.getItem("homeRedpoint_"+_user.id) == null || (new Date().getTime() - localStorage.getItem("homeRedpoint_"+_user.id) > 60000)){
        			//本地记录最后更新首页红点时间为null或者最后时间与当前时间大于10分钟
        			$.post("index/getRedPoint.shtml",{
        				accessToken:localStorage.getItem("accessToken"),
        				actTime:localStorage.getItem("actRedpoint_"+_user.id),
        				infoTime:localStorage.getItem("infoRedpoint_"+_user.id)
        			},function(datas){
        				localStorage.setItem("homeRedpoint_"+_user.id,new Date().getTime());//设置最后更新红点时间
        				if(datas.data.homeRedpoint){
        					localStorage.setItem("allRedpoint_"+_user.id, true);
        				}else{
        					localStorage.setItem("allRedpoint_"+_user.id, false);
        				}
        				$.showUnRead();
        			}); 
        		}
        	}
        },
        _style:"\
        .content .order{ }\
        .content .order>a{display: block; line-height:.96rem; height:.96rem; padding:0 .2rem;box-sizing:border-box; cursor:pointer;}\
        .content .order>ul{ padding:.2rem;box-sizing:border-box;border-top:1px solid #e5e5e5;}\
        .content .order>ul>li{width:20%; float:left;}\
        .content .order>ul>li>a{display:block; color:#666; text-align:center; position:relative;}\
        .content .order>ul>li>a>i{ font-size:.42rem;}\
        .content .order>ul>li>a>p{margin-top:.1rem;}\
        .content .order>ul>li>a>span{ position:absolute; right:.26rem; top:-8px; width:.3rem; height:.3rem; line-height: .3rem; display:block; border-radius:50%; border:1px solid #CB3232; color:#CB3232; font-size:.22rem; background-color:#fff;} \
        .content .wallet>ul>li{width:25%;}\
        .content .action>ul{margin-left:-1px; margin-top:-1px; }\
        .content .action>ul>li{float:left; width:25%; box-sizing:border-box; border-left:1px solid #e5e5e5; border-top:1px solid #e5e5e5; height:1.68rem;}\
        .content .action>ul>li>a{display:block; text-align:center;padding:.35rem 0;}\
        .content .action>ul>li>a>p{margin-top:.18rem;}\
        .content .action>ul>li>a>i{ font-size:.42rem;}\
        "
    },
    /*浏览足迹*/
    "ucenter/footprint":{
        _title:"浏览足迹",
        _datas: {
        	goodsMaps:GET("ucenter/footprint.shtml",function(data){
        		return data.goodsMaps;
        	})
        },
        _footer:false,
        _load:function(){
            $("#edit").click(function(){
                var text =$(this).text();
                if($(this).text()=="编辑"){
                    $(this).text("完成");
                    $(".content .list .hd>i").css("left",".2rem");
                    $(".content .list .hd>h5").css("padding-left",".6rem");
                    $(".content .list>ul>li>i").css("display","block");
                    $(".footer-print").show(500);
                }
                else{
                    $(this).text("编辑");
                    $(".content .list .hd>i").css("left","-5rem");
                    $(".content .list .hd>h5").css("padding-left",".2rem");
                    $(".content .list>ul>li>i").css("display","none");
                    $(".footer-print").hide(500);
                }
            })
           
             $(".content .list i").click(function(){
                 $(this).toggleClass("cur");
                 var checkeds = $(".content .list .cur");
                 if(checkeds){
                 	$(".footer-print s").text(checkeds.length);
                 }else{
                 	$(".footer-print s").text(0);
                 }
             });
             $(".footer-print button").click(function(){
            	var checkeds = $(".content .list .cur");
            	var ids=[];
     			for(var i=0;i<checkeds.length;i++){
     				ids.push($(checkeds[i]).attr("index"));
     			}
            	 $.delete("ucenter/footprint.shtml",{ids:ids},function(data){
            		 if(data.status == "1"){
            			 var total = $(".content .list>ul>li").length;
            			 checkeds.closest("li").remove();
            			 if(checkeds.length==total){
            				 $(".content .list").html(REND("include/empty",{icon:"&#xe62b;",tip:"sorry，您还没有足迹哦~",price:"2",display:"block"}));
            			 }
            			 $("#edit").text("编辑");
                         $(".content .list .hd>i").css("left","-5rem");
                         $(".content .list .hd>h5").css("padding-left",".2rem");
                         $(".content .list>ul>li>i").css("display","none");
                         $(".footer-print").hide(500);
                         $(".footer-print s").text(0);
            		 }else{
            			 alert(data.errorMsg);
            		 }
         		});
             })

        },
        _events: {
        }
    },
    /*商品收藏*/
    "ucenter/collect":{
        _title:"商品收藏",
        _datas: {
        	data:GET("ucenter/collect.shtml",function(data){
        		return data;
        	})
        },
        _footer:false,
        _load:function(){
            $("#edit").click(function(){
                var text =$(this).text();
                if($(this).text()=="编辑"){
                    $(this).text("完成");
                    $(".content .list .hd>i").css("left",".2rem");
                    $(".content .list .hd>h5").css("padding-left",".6rem");
                    $(".content .list>ul>li>i").css("display","block");
                    $(".footer-print").show(500);
                }
                else{
                    $(this).text("编辑");
                    $(".content .list .hd>i").css("left","-5rem");
                    $(".content .list .hd>h5").css("padding-left",".2rem");
                    $(".content .list>ul>li>i").css("display","none");
                    $(".footer-print").hide(500);
                }
            })
            $(".content .list i").click(function(){
                $(this).toggleClass("cur");
                var checkeds = $(".content .list .cur");
                if(checkeds){
                	$(".footer-print s").text(checkeds.length);
                }else{
                	$(".footer-print s").text(0);
                }
            })
            $(".footer-print button").click(function(){
            	var checkeds = $(".content .list .cur");
            	var ids=[];
     			for(var i=0;i<checkeds.length;i++){
     				ids.push($(checkeds[i]).attr("index"));
     			}
            	 $.delete("ucenter/collect.shtml",{ids:ids},function(data){
            		 if(data.status == "1"){
            			 var total = $(".content .list>ul>li").length;
            			 checkeds.closest("li").remove();
            			 if(checkeds.length==total){
            				 $(".content .list").html(REND("include/empty",{icon:"&#xe619;",tip:"sorry，您还没有收藏商品哦~",price:"2",display:"block"}));
            			 }
            			 $("#edit").text("编辑");
                         $(".content .list .hd>i").css("left","-5rem");
                         $(".content .list .hd>h5").css("padding-left",".2rem");
                         $(".content .list>ul>li>i").css("display","none");
                         $(".footer-print").hide(500);
                         $(".footer-print s").text(0);
            		 }else{
            			 alert(data.errorMsg);
            		 }
         		});
             }),
             $(".similar").click(function(){
            	var btn=this;
            	$(btn).closest("li").loadingWrap();
         		$.getPosition(function(x,y,cityname){
         			$(btn).closest("li").loadingWrapCancel();
         			var positon=x+","+y;
         			GO("ucenter/similarity",{position:positon,skuId:$(btn).attr("skuId"),goodsCategoryId:$(btn).attr("goodsCategoryId"),shopType:$(btn).attr("shopType"),shopId:$(btn).attr("shopId")});
         		});
             })
        }
    },
    /*相似宝贝*/
    "ucenter/similarity": {
        _title:"相似宝贝",
        _datas:{
        	similarityGoods:GET("goods/similarityGoods.shtml",{position:PARAM("position"),goodsCategoryId:PARAM("goodsCategoryId")},function(data){
        		return data.result;
        	}),
        	sku:GET("goods/skuInfo.shtml",{skuId:PARAM("skuId")},function(data){
        		return data.sku;
        	})
        },
        _load: function(){
        	
        }
    },
    /*店铺收藏*/
    "ucenter/shopCollection":{
        _title:"店铺收藏",
        _footer:false,
        _load:function(){
        	shopCollection("business");
            $(".content .hd>li").click(function(){
                $(this).addClass("cur").siblings().removeClass("cur");
                var hdsum=$(this).index();
                //$(".content>div").hide().eq(hdsum).show();
                if(hdsum == 1){//店主店铺
                	shopCollection("sKeeper");
                }else{//商家店铺
                	shopCollection("business");
                }
            });
            function shopCollection(shopType){
            	$.get("ucenter/shopCollection.shtml",{shopType:shopType},function(data){
            		if(data.data && data.data.items.length>0){
            			$(".warn").html("");
            			$(".shopContent").html(REND('ucenter/shopCollectionContent',{list:data.data.items}));
            		}else{
            			$(".shopContent").html("");
            			if(shopType == "sKeeper"){
            				$(".warn").html(REND("include/empty",{icon:"&#xe61c;",tip:"sorry，您还没有收藏店主店铺哦~",price:"2",display:"block"}));
            			}else{
            				$(".warn").html(REND("include/empty",{icon:"&#xe61c;",tip:"sorry，您还没有收藏商家店铺哦~",price:"2",display:"block"}));
            			}
            		}
            	});
            }
        }
    },
    /*申请店主*/
    "ucenter/applyShopKeeper":{
    	_title:"申请店主",
    	_template:{url:"./view/ucenter/applyBusiness.ejs"},
    	type:"小铺",
    	submitUrl:"ucenter/applyShopKeeper.shtml",
    	submitCall: function(res, params){
    		submitCall(res, params, "shopKeeper/shopKeeperInfo");
    	},
    	_datas:GET("common/shopDefaultIcon.shtml",function(data){return data}),
        _load: function(){
        	validate();
            function validate(){
        		$("form").each(function(){
        			$(this).validate({
        				rules: {
         	                shopName: {
         	                    required: true
         	                },
         	                shopSubTitle: {
        	                    required: true
        	                }
         	            },
         	            messages:{
         	            	shopName:{
         	            		required:"名称不能为空"
         	                },
         	                shopSubTitle:{
         	                	required:"副标题不能为空"
         	                }
         	            }
        	        });
        		});
        	}
        },
        _events:{
        	".pic":{
        		click:function(){
        			$.clipImage({
            			call:function(url){
            				$(".pic img").attr("src",Config.imgPre+url);
            				$("[name=avatar]").val(url);
            			}
            		});
        		}
        	}
        }
    },
    /*申请商家*/
    "ucenter/applyBusiness": {
    	_title:"申请商家",
    	_footer:false,
    	_template:{url:"./view/ucenter/applyBusiness.ejs"},
    	type:"店铺",
    	submitUrl:"ucenter/applyBusiness.shtml",
    	submitCall: function(res, params){
    		submitCall(res, params, "business/merchant");
    	},
    	_datas:GET("common/shopDefaultIcon.shtml",function(data){return data}),
        _load: function(){
        	$(".photo-wrap")[0].style.display="block";
        	$(".form-wrap").hide();
        	validate();
            function validate(){
        		$("form").each(function(){
        			$(this).validate({
        				rules: {
         	                shopName: {
         	                    required: true
         	                },
         	                shopSubTitle: {
        	                    required: true
        	                }
         	            },
         	            messages:{
         	            	shopName:{
         	            		required:"名称不能为空"
         	                },
         	                shopSubTitle:{
         	                	required:"副标题不能为空"
         	                }
         	            }
        	        });
        		});
        	}
        },
        _events:{
        	".photoSubmit":{
        		click:function(){
        			var license=$(".uploadImgUrl").attr("src") && $(".uploadImgUrl").attr("src").replace(Config.imgPre,"");
        			if(license!=null){
        				$(".photo-wrap").hide();
        				$(".form-wrap").show();
        				$("[name=license]").val(license);
        			}else{
        				alert("请点击相机图标上传营业执照。");
        			}
        			
        		}
        	},
        	".pic":{
        		click:function(){
        			$.clipImage({
            			call:function(url){
            				$(".pic img").attr("src",Config.imgPre+url);
            				$("[name=avatar]").val(url);
            			}
            		});
        		}
        	}
        }
    },
    /*银行卡*/
    "ucenter/bankCards": {
        _title:"银行卡",
        _datas: {/*动态数据 视图中也能使用全局变量 此处取名_datas区别于视图中所有变量的附属对象_data 在js中也可通过DATA(dom)获取该视图的数据 dom为该视图中的任意dom*/
        	bankCards:GET("bankCard/list.shtml",function(data){
        		return data.bankCards;
        	})
        }, 
        _load: function(){

        }
    },
    /*添加银行卡*/
    "ucenter/addBankCard": {
        _title:"添加银行卡",
        _datas: {
        	banks:GET("bankCard/allBanks.shtml",function(data){
    			return data.banks;
    		})
        },
        _load: function(){
        	//用户不是会员则查看是否有待审核的商家银行卡
        	if(_user != null && _user.type != "member"){
        		$.get(Config.basePath + "bankCard/hasBusCard.shtml",function(datas){
        			if(datas.data.hasBusCard){ //有待审核的商家银行卡，隐藏复选框
        				$("form>div.txt").hide();
        			}
        		});
        	}
        	
        	checkBankCard();
        	validateBankCard();
        	//提交 添加银行卡
        	$("#present").click(function(){
        		if(IdentityCodeValid($("#personIdCard").val())){
        			$("#form").submit();
        		}else{
        			alert("身份证号格式不正确");
        		}
        	})
        	
        	
        	function IdentityCodeValid(code) { 
    		    var city={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外 "};
    		    var tip = "";
    		    var pass= true;
    		    
    		    if(!code || /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X)$)/.test(code) === false){  
    		        tip = "身份证号格式错误";
    		        pass = false;
    		   	}else if(!city[code.substr(0,2)]){
    		        tip = "地址编码错误";
    		        pass = false;
    		    }else{
    		        //18位身份证需要验证最后一位校验位
    		        if(code.length == 18){
    		            code = code.split('');
    		            //∑(ai×Wi)(mod 11)
    		            //加权因子
    		            var factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
    		            //校验位
    		            var parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
    		            var sum = 0;
    		            var ai = 0;
    		            var wi = 0;
    		            for (var i = 0; i < 17; i++)
    		            {
    		                ai = code[i];
    		                wi = factor[i];
    		                sum += ai * wi;
    		            }
    		            var last = parity[sum % 11];
    		            if(parity[sum % 11] != code[17]){
    		                tip = "身份证号码非法，请重新输入";
    		                pass =false;
    		            }
    		        }
    		    }
    		    return pass;
    		};
    		//是否将用户银行卡同时用于商家复选框
    		$("form>div.txt i").click(function(){ 
        		if($(this).text()==""){ //选中
        			$(this).text("");
        			$("#syncBus").val(true);
                }else{ //未选中
                	$(this).text("");
                	$("#syncBus").val(false);
                }
        	});
        },
        _events: {

        },
        submitCall : function(response,params){
        	if(response.status=="1"){
        		if(this._param.toCash){
        			history.go(-1);
        		}else{
        			GO("ucenter/bankCards");
        			tipBox("添加成功");
        		}
        	}else{
        		if(response.status)
        		alert("提交失败");
        	}
		}
    },
    /*重新绑定*/
    "ucenter/againBind": {
        _title:"重新绑定",
        _datas: {
        	data:GET("bankCard/getUserInfoByCard.shtml",{flag:PARAM("flag")},function(data){
        		return data;
        	}),
    		banks:GET("bankCard/allBanks.shtml",function(data){
    			return data.banks;
    		})
        },
        _template:{url:"./view/ucenter/changeBankCard.ejs"},//跳转的页面
        _load: function(){
        	$(".nav-header.h1").html("重新绑定");
        	$(".photo-wrap").hide();
        	$(".next").click(function(){
    			$(".content-wrap").hide();
    			$(".photo-wrap").show();
    			$(".photoSubmit").click(function(){
    				if($(".uploadImgUrl")[0].src){
    					$("[name=personIdCardImage]").val($(".uploadImgUrl")[0].src);
    					$("form")[0].request();
    				}else{
    					alert("请上传图片");
    				}
    			});
        	})
        	
        	//是否将用户银行卡同时用于商家复选框
    		$("form>div.txt i").click(function(){ 
        		if($(this).text()==""){ //选中
        			$("#syncBus").val(true); //同步到商家
        			$(this).text("");
                }else{ //未选中
                	$(this).text("");
                	$("#syncBus").val(false); //不同步到商家
                }
        	});
        	
        	if($(".next").length==0){ //点击的不是“下一步”，而是“提交”
        		$("#present").click(function(){
        			if(IdentityCodeValid($("#personIdCard").val())){
        				$("#form").submit();
        			}else{
        				alert("身份证号格式不正确");
        			}
        		})
        	}
        	if(_param.flag){
        		document.getElementById("bankCardPerson").readOnly="readonly";
        		document.getElementById("personIdCard").readOnly="readonly";
        	}else{
        		$("#bankCardPerson").val("");
        		$("#personIdCard").val("");
        	}
        	checkBankCard();
        	validateBankCard();
        	
        	function IdentityCodeValid(code) { 
    		    var city={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外 "};
    		    var tip = "";
    		    var pass= true;
    		    
    		    if(!code || /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X)$)/.test(code) === false){  
    		        tip = "身份证号格式错误";
    		        pass = false;
    		   	}else if(!city[code.substr(0,2)]){
    		        tip = "地址编码错误";
    		        pass = false;
    		    }else{
    		        //18位身份证需要验证最后一位校验位
    		        if(code.length == 18){
    		            code = code.split('');
    		            //∑(ai×Wi)(mod 11)
    		            //加权因子
    		            var factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
    		            //校验位
    		            var parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
    		            var sum = 0;
    		            var ai = 0;
    		            var wi = 0;
    		            for (var i = 0; i < 17; i++)
    		            {
    		                ai = code[i];
    		                wi = factor[i];
    		                sum += ai * wi;
    		            }
    		            var last = parity[sum % 11];
    		            if(parity[sum % 11] != code[17]){
    		                tip = "身份证号码非法，请重新输入";
    		                pass =false;
    		            }
    		        }
    		    }
    		    return pass;
    		}
        },
        submitCall : function(response,params){
        	if(response.status=="1"){
        		GO("ucenter/bankCards");
        		tipBox("添加成功")
        	}else{
        		alert("提交失败");
        	}
		}
    },
    /*更换银行卡*/
    "ucenter/change": {
    	_title:"更换银行卡",
    	_datas: {
    		data:GET("bankCard/getUserInfoByCard.shtml",function(data){
    			return data;
    		}),
    		banks:GET("bankCard/allBanks.shtml",function(data){
    			return data.banks;
    		})
    	},
    	_template:{url:"./view/ucenter/changeBankCard.ejs"},//跳转的页面
    	_load: function(){
    		document.getElementById("bankCardPerson").readOnly="readonly";
        	document.getElementById("personIdCard").readOnly="readonly";
    		checkBankCard();
    		validateBankCard();
    		$("#present").click(function(){
        		return;
    			$("#form").submit();
    		})
    		//是否将用户银行卡同时用于商家复选框
    		$("form>div.txt i").click(function(){ 
        		if($(this).text()==""){ //选中
        			$(this).text("");
        			$("#syncBus").val(true);
                }else{ //未选中
                	$(this).text("");
                	$("#syncBus").val(false);
                }
        	});
    	},
    	submitCall : function(response,params){
    		if(response.status == "1"){
    			GO("ucenter/bankCards");
    			tipBox("添加成功")
    		}else{
    			alert("提交失败");
    		}
    	}
    },
    /*更换银行卡首页面*/
    "ucenter/toChangePage": {
        _title:"更换银行卡",
        _datas: {/*动态数据 视图中也能使用全局变量 此处取名_datas区别于视图中所有变量的附属对象_data 在js中也可通过DATA(dom)获取该视图的数据 dom为该视图中的任意dom*/
        	bankCard:GET("bankCard/getBcdInfoByPass.shtml",{
        		bankCardType : "member"
        	},function(data){
        		return data.bankCard;
        	})
        }, 
        _load: function(){
            $(".content>ul>li>a").click(function(){
                $(this).siblings("div").toggleState({style:"display:block"},{style:"display:none"});
            }),
            $("#firstBtn").click(function(){
            	GO("ucenter/firstChange");
            }),
            $("#secondBtn").click(function(){
            	GO("ucenter/againBind",{flag:"second"});//与重新绑定一样，需要重新填写一张新的银行卡,flag="second"表示是第二种换卡方式
            })
        }
    },
    "ucenter/viewBankCard": {
        _title:"银行卡详情",
        _datas: {/*动态数据 视图中也能使用全局变量 此处取名_datas区别于视图中所有变量的附属对象_data 在js中也可通过DATA(dom)获取该视图的数据 dom为该视图中的任意dom*/
        	bankCard:GET("bankCard/view.shtml",{id:PARAM("id")},function(data){
        		return data.bankCard;
        	})
        }, 
        _load: function(){
        }
    },
    
    /** 第一种换卡*/
    "ucenter/firstChange": {
    	_title:"第一种",
    	_datas: {
    		bankCard:GET("bankCard/getBcdInfoByPass.shtml",{
    			bankCardType : "member"
    		},function(data){
        		return data.bankCard;
        	}),
    		userPurse:GET("cash/getUserAmount.shtml",function(data){
				return data.ableCashAmount;
			})
    	},
    	_template:{url:"./view/ucenter/bankCardWithdraw.ejs"},//跳转的页面
    	_load:function(){
    		var userPurse = parseFloat($("#userPurse").text());
    		if(userPurse<=1){
    			document.getElementById("cashBtn").disabled = true;
    			document.getElementById("changeBtn").disabled = false;
    			$("#changeBtn").removeClass("btn-gr");
    		}else if(userPurse<100){
    			document.getElementById("cashBtn").disabled = false;
    			document.getElementById("changeBtn").disabled = false;
    			$("#cashBtn").removeClass("btn-gr");
    			$("#changeBtn").removeClass("btn-gr");
    		}else{
    			document.getElementById("cashBtn").disabled = false;
    			document.getElementById("changeBtn").disabled = true;
    			$("#cashBtn").removeClass("btn-gr");
    		}
    		
    		$("#changeBtn").click(function(){
    			GO("ucenter/change");
    		}),
    		
    		$("#cashBtn").click(function(){
    			GO("ucenter/withdraw");
    		})
    	}
    },
    
    
    
	 /*银行卡更换提现*/
    "ucenter/bankCardWithdraw": {
        _title:"银行卡提现",
        _load: function(){

        }
    },
    
    
    /*提现详情*/
    "ucenter/withdrawDetails": {
        _title:"提现详情",
        _footer:false,
        _datas:GET("cash/view.shtml",{id:PARAM("id")},function(data){
        	return data;
        }),
        _load: function(){
        }
    },
    
    
    /*提现*/
    "ucenter/withdraw": {
        _title:"提现",
        _footer:false,
        _datas:{
        	bankCard:GET("bankCard/getBcdInfoByPass.shtml",{
    			bankCardType : "member"
    		},function(data){
        		return data.bankCard;
        	})
        },
        _load: function(){
            $("#Confirm").click(function(){
                //$(".Prompt-one").show(500);
            	var re = /^[0-9]+([.]\d{1,2})?$/;
            	if(!re.test($("#cashSums").val())){
            		alert("输入金额格式不正确");
            		return false;
            	}
                if(!$("#cashSums").val() || $("#cashSums").val()==0){
    				alert("","",null,"","亲，请输入提现金额");
                }else if(0 < $("#cashSums").val() && $("#cashSums").val() < 100){
                	alert("",function(flag){
        				if(flag){
        					$("#form").submit();
        				}
        			},true,"","亲，您的提现金额小于100元，需要收取手续费1元");
    			}else{
    				$("#form").submit();
    			}
            }),
            $.get("cash/getUserAmount.shtml",function(data){
            	if(data.data && data.data.ableCashAmount){
            		$("#ableCashAmount").text(data.data.ableCashAmount.toFixed(2));
            	}
            	if(data.data && data.data.ableCashAmount){
            		$("#todayAbleCashAmount").text(data.data.todayAbleCashAmount.toFixed(2));
            	}
            }),
            $("#cashSums").keyup(function(){
            	var re = /^[0-9]+([.]\d+)?$/;
            	if(re.test($("#cashSums").val()) && $("#cashSums").val().indexOf(".") != -1 && $("#cashSums").val().substring($("#cashSums").val().indexOf(".")+1).length>2){
            		this.value = $("#cashSums").val().substring(0,$("#cashSums").val().indexOf(".")+3);
            	}
            })
        },
        submitCall : function(response,params){
        	if(response.status=="1"){
        		GO("ucenter/bakMoneyLog");
        		alert("","",false,"","提交成功，等待审核");
        	}else{
    			alert("","","","",response.errorMsg);
        	}
		}
    },
    /*提现历史*/
    "ucenter/withdrawHistory": {
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
        		cashType:"member"
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
    
    /*个人信息*/
    "ucenter/personalInformation": {
        _title:"个人信息",
        _links:{
        	"js/extra.js":"js"
        },
        _datas: GET("ucenter/toPersonalPage.shtml",function(data,ctrl){
    		if(data instanceof Error){
    			ctrl._goError = false;
    			DO('error',data);
    		}
    		return data;
        }),
        _footer:false,
        _load: function(){
            $("#pssword").click(function(){
                $(".paymentCode").show(500);
                $(".theme-popover-mask").show(200);
            })
        },
        _events:{
        	".uploadPic":{
        		click:function(){
        			var btn=this;
        			$.clipImage({
            			call:function(url){
            				$(btn).find(".pic img").attr("src",Config.imgPre + url);
            				$.post(
        		        		"ucenter/updateIcon.shtml",
        		        		{iconSrc : url},
        		        		function(data){
        		        			if(data.status == "1"){
        		        				
        		        			}else{
        		        				alert(data.errorMsg);
        		        			}
        		        		}
            		        );
            			}
            		});
        		}
        	}
        },
        //打开选择性别面板
        openSex : function(){
        	$(".gender-in").show(500);
            $(".theme-popover-mask").show(200);
        },
        //关闭选择性别面板
        closeSex : function(){
        	$(".gender-in").hide(500);
            $(".theme-popover-mask").hide(200);
        },
        //选择性别
        chooseSex : function(sexType,sexValue){
        	this.closeSex();
        	$.post(
        		"ucenter/updateSex.shtml",
        		{sex : sexType},
        		function(data){
        			if(data.status == "1"){
        				$("#sexValue").html(sexValue);
        			}else{
        				alert(data.errorMsg);
        			}
        		},
        		"json"
        	);
        },
        _pass:function(){
        	$.getUser();
        }
    },
    /*账户安全*/
    "ucenter/accountSecurity": {
        _title:"账户安全",
        _links:{
        	"js/extra.js":"js"
        },
        _datas: GET("ucenter/toPersonalPage.shtml",function(data,ctrl){
    		if(data instanceof Error){
    			ctrl._goError = false;
    			DO('error',data);
    		}
    		return data;
        }),
        _footer:false,
        _load: function(){
            $("#pssword").click(function(){
                $(".paymentCode").show(500);
                $(".theme-popover-mask").show(200);
            })
        },
        _pass:function(){
        	$.getUser();
        }
    },
    
    /*修改登录密码*/
    "ucenter/changePassword": {
        _title:"修改密码",
        _links : {
        	"plugin/jquery.md5.js" : "js"
        },
        _footer:false,
        _load: function(){
            
            //表单验证
            $(".form-horizontal").validate({
				rules: {
					dbPassword: { required : true},
					newPassword: {
						required : true,
						pattern: /^[0-9a-zA-Z_]{6,16}$/
					}
				}
            })
        },
        //查看密码开关
        passwordToggle : function(item){
        	var text =$(item).text();
            if($(item).text()==""){
                $(item).text("");
                $("[name=newPassword]").attr("type","text");
            }
            else{
                $(item).text("");
                $("input[name='newPassword']").attr("type","password");
            }
        },
        submitCall : function(data){
        	if(data.status == "1"){
				GO("ucenter/personalInformation");
			}else{
				alert(data.errorMsg);
			}
        }
    },
    
    
    /**核实身份、修改手机号（用户名）*/
    "ucenter/identityVerification": {
        _title:"身份核实",
        _links : {
        	"plugin/jquery.md5.js" : "js"
        },
        _footer:false,
        _pass : function(){
        	clearInterval(this.$interValObj); //停止计时器
        },
        _load: function(){
            //表单验证
            $(".form-horizontal").validate({
				rules: {
					verifyCode: {
						required : true,
						maxlength:6,
						minlength:6,
						digits:true
					}
				},
				submitHandler: function(form) {
					if($("#pagePhoneLi").is(":visible")){
						var pagePhone = $("input[name='pagePhone'").val();
						if(pagePhone == ""){
							alert("请输入手机号！");
							return;
						}
					}
					if($("#btnValue").html() == "发送短信码"){
		        		alert("请先发送验证码！");
		        		return;
		        	}
					form.request();
				}
            })
        },
        _events:{
        	//更换验证码
        	"#captchaImage":{
        		click : function(){
        			$(this).attr("src", "./passport/captcha.shtml");
        		}
        	}
        },
        $interValObj : null,//timer变量，控制时间  
    	$count : 60, //间隔函数，1秒执行  
    	$curCount : 0,//当前剩余秒数
        //发送验证码
        sendCode : function(item){
        	var ctrl = this;
        	if($("#captcha").val() == null || $("#captcha").val() == ""){
        		alert("请输入图文验证码！");
        		return;
        	}
        	var pagePhone = $("input[name='pagePhone']").val();
        	//设置新的手机号
        	if($("#pagePhoneLi").is(":visible")){
        		if((pagePhone == "" || pagePhone == null)){
        			alert("请输入手机号！");
        			return;
        		}
        		if(!(/^1[3|4|5|7|8]\d{9}$/.test(pagePhone))){
					alert("手机号格式错误！");
					return;
				}
        		if($("#oldPhone").val() == pagePhone){
        			alert("新手机号与原手机号相同！");
        			return;
        		}
        		$.get("ucenter/checkUserByUsername.shtml",{
        			username : pagePhone
        		},function(datas){
        			if(datas.status == 0){
        				alert("用户名已注册！");
        				return;
        			}else{
        				//点击发送验证码
        				ctrl.sendVerify(item,pagePhone);
        			}
        		});
        	}else{
        		//点击发送验证码
        		ctrl.sendVerify(item,pagePhone);
        	}
        },
        //发送验证码
        sendVerify : function(item,pagePhone){
        	var ctrl = this;
        	$.post(
        		"ucenter/sendVerify.shtml",
        		{
        			captcha : $("#captcha").val(),
        			smsType : "changeUsername",
        			pagePhone : pagePhone
        		},
        		function(data){
        			if(data.status == "1"){
        				ctrl.$curCount = ctrl.$count;
        	    		$(item).attr("disabled","true");
        	    		$("#btnCount").html(+ ctrl.$curCount);  
        	    		ctrl.$interValObj = window.setInterval(function(){
        	    	    	ctrl.setRemainTime($(item));
        	    	    }, 1000); //启动计时器，1秒执行一次  
        	    		$("#btnValue").html("秒后重发");
        	    		//清空验证码
        	    		$("#captcha").val("");
                		$("#captchaImage").click();
        	    		$("#captchaLi").hide(); //隐藏验证码
        			}else{
        				alert(data.errorMsg);
        			}
        		}
        	);
        },
        //timer处理函数  
    	setRemainTime : function(item){
    	    if (this.$curCount == 0) {                  
    	        window.clearInterval(this.$interValObj); //停止计时器
    	        $(item).removeAttr("disabled"); //发送按钮可用
    	        $("#btnValue").html("重新发送"); 
    	        $("#btnCount").html("");
    	        $("#captchaLi").show(); //显示验证码
    	    }else {  
    	    	this.$curCount--;  
    	        $("#btnCount").html(this.$curCount);  
    	    }  
    	},
    	submitCall : function(datas){
        	if(datas.status == "1"){
        		if($("#pagePhoneLi").is(":visible")){
        			//新手机号修改成功
        			GO("ucenter/personalInformation");
        			window.clearInterval(this.$interValObj); //停止计时器
        		}else{
        			//原手机号验证成功
        			window.clearInterval(this.$interValObj); //停止计时器
        			$("#btnCount").html("");
        			$("#btnValue").html("发送短信码"); 
        			$("#pagePhoneLi").show();
        	        $("#sendCodeBtn").removeAttr("disabled"); //发送按钮可用
        	        $("input[name='verifyCode']").val("");
        	        $("input[name='pagePhone']").attr("required","required");
        	        $("#oldPhone").val(datas.data.oldPhone);
        	        $(".form-horizontal").attr("action","ucenter/updateUsername.shtml")
        	        //清空图文验证码
            		$("#captcha").val("");
            		$("#captchaImage").click();
            		$("#captchaLi").show(); //显示验证码
        		}
			}else{
				alert(datas.errorMsg);
			}
        }
    },
    
    
    /*修改支付密码*/
    "ucenter/PayPassword": {
        _title:"修改支付密码",
        _links : {
        	"plugin/jquery.md5.js" : "js"
        },
        _footer:false,
        _pass : function(){
        	clearInterval(this.$interValObj); //停止计时器
        },
        _load: function(){
            //表单验证
            $(".form-horizontal").validate({
				rules: {
					payPassword : {
						required : true,
						pattern: /^[0-9a-zA-Z_]{6,16}$/
					},
					rePayPassword : {
						required : true,
						pattern: /^[0-9a-zA-Z_]{6,16}$/,
						equalTo:"#password"
					},
					verifyCode: {
						required : true,
						maxlength:6,
						minlength:6,
						digits:true
					}
				},
				submitHandler: function(form) {
					if($("#btnValue").html() == "发送验证码"){
		        		alert("请先发送验证码！");
		        		return;
		        	}
					form.request();
				}
            })
        },
        _events:{
        	//更换验证码
        	"#captchaImage":{
        		click : function(){
        			$(this).attr("src", "./passport/captcha.shtml");
        		}
        	}
        },
        $interValObj : null,//timer变量，控制时间  
    	$count : 60, //间隔函数，1秒执行  
    	$curCount : 0,//当前剩余秒数
        //发送验证码
        sendCode : function(item){
        	if($("#password").val() == null || $("#password").val() == ""){
        		alert("支付密码不能为空！");
        		return;
        	}
        	if($("#password").val() != $("#rePassword").val()){
        		alert("两次密码输入不一致！");
        		return;
        	}
        	if($("#captcha").val() == null || $("#captcha").val() == ""){
        		alert("请输入图文验证码！");
        		return;
        	}
        	var ctrl = this;
    		//点击发送验证码
        	$.post(
        		"ucenter/sendVerify.shtml",
        		{
        			captcha : $("#captcha").val(),
        			smsType : "changePayPassword"
        		},
        		function(data){
        			if(data.status == "1"){
        				ctrl.$curCount = ctrl.$count;
        	    		$(item).attr("disabled","true");
        	    		$("#btnCount").html(ctrl.$curCount);  
        	    		ctrl.$interValObj = window.setInterval(function(){
        	    	    	ctrl.setRemainTime($(item));
        	    	    }, 1000); //启动计时器，1秒执行一次  
        	    		$("#btnValue").html("秒后重发");
        	    		//清空验证码
        	    		$("#captcha").val("");
                		$("#captchaImage").click();
                		$("#captchaLi").hide(); //隐藏图文验证码
        			}else{
        				alert(data.errorMsg);
        			}
        		}
        	)
        },
        //timer处理函数  
    	setRemainTime : function(item){
    	    if (this.$curCount == 0) {                  
    	        window.clearInterval(this.$interValObj); //停止计时器
    	        $(item).removeAttr("disabled"); //发送按钮可用
    	        $("#btnValue").html("重新发送"); 
    	        $("#btnCount").html("");
    	        $("#captchaLi").show(); //显示图文验证码
    	    }else {  
    	    	this.$curCount--;  
    	        $("#btnCount").html(this.$curCount);  
    	    }  
    	},
    	submitCall : function(datas){
        	if(datas.status == "1"){
        		window.clearInterval(this.$interValObj); //停止计时器
        		if(typeof(this._param.toHistory) == "undefined"){
        			GO("ucenter/personalInformation");
        		}else{
        			history.go(-1);
        		}
			}else{
				alert(datas.errorMsg);
			}
        }
    },



    /*素材库*/
    "ucenter/materialLibrary": {
        _title:"素材库",
        _footer:false,
        _load: function(){
        }
    } ,
    
    
    /*照片名称*/
    "ucenter/PhotoName": {
        _title:"照片名称",
        _footer:false,
        _load: function(){
        }
    },
    
    
    /*昵称*/
    "ucenter/nickName": {
        _title:"昵称",
        _footer:false,
        _load: function(){
        },
        updateNickName : function(){
        	$.post(
        		"ucenter/updateNickName.shtml",
        		{nickName : $("#nickName").val()},
        		function(data){
        			if(data.status == "1"){
        				GO("ucenter/personalInformation");
        			}else{
        				alert(data.errorMsg);
        			}
        		},
        		"json"
        	)
        },
        clearText : function(){
        	$("#nickName").val("");
        }
    },
    
    /*选择城市*/
    "ucenter/positioning": {
        _title:"选择城市",
        _footer:false,
        _datas:GET("area/openCitys.shtml",function(data){return data}),
        _load: function(){
            $(".searchBox input").keyup(function(){
            	var Inp = this;
            	$.get("area/match.shtml",{content:Inp.value},function(data){
            		var areas = data.data.areas;
            		if(areas.length>0){
            			$("#warn").html("");
            			$(".matchAreas").html(REND('ucenter/matchAreas',{list:data.data.areas}));
            		}else{
            			$("#warn").html("抱歉，未找到相关位置，可尝试重新输入");
            			$(".matchAreas").html(REND('ucenter/matchAreas',{list:data.data.areas}));
            		}
            	})
            }),
            $(".openAreas ul li a").click(function(){
               var obj = this;
               alert("选择 "+$(obj).html().trim()+" 为当前城市",function(flag){
                     if(flag){
                     	$.post("area/setUserCity.shtml",{cityName:$(obj).html()},function(data){
                     		if(!data){
                     			GO("/");
                     		}
                     		if(data.status == "1"){//设置当前城市成功
                     			Config.area = data.data.area;
                     			GO("/");
                     		}else if(data.status == "0"){
                     			alert("系统正忙，稍后重试");
                     		}
                     	});
                     }
                },true);
          })	
        }
    },

    /*财富中心*/
    "ucenter/bakMoneyLog": {
        _title:"财富中心",
        _footer:false,
        _datas: {
        	data:GET("ucenter/myMoneyCenter.shtml",function(data){
        		return data;
        	})
        },
        _load: function(){
        	$("#toCashBtn").click(function(){
        		if(_datas.data.ableCashMoney<=0){
        			alert("您还没有收入可提现，加油哦~");
        			return false;
        		}
        		if(!_datas.data.isHasBankCard){
        			alert("您还没有银行卡,请先添加银行卡？", function(flag){
    	        		if(flag){
    	        			GO("ucenter/addBankCard",{toCash:true});
    	        		}
    	        	},true); 
        			return false;
        		}
        		if(!_datas.data.isHasAbleBankCard){
        			alert("银行卡需要审核通过，请耐心等待!");
        			return false;
        		}
        		GO("ucenter/withdraw");
        	})
        },
        retBtn : function(){
        	if(this._param.toReturn=="mine"){
        		GO("ucenter/mine");
        	}else if(this._param.toReturn=="purse"){
        		GO("ucenter/purse");
        	}else if(this._param.toReturn=="shopKeeper"){
        		GO("shopKeeper/shopKeeperInfo");
        	}else{
        		history.go(-1);
        	}
        }
    },
    /*我的钱包*/
    "ucenter/purse": {
        _title:"我的钱包",
        _footer:false,
        _datas:GET("ucenter/purse.shtml",function(data){return data}),
        _load: function(){
        }
    },

    /*用户设置*/
    "ucenter/userSet": {
        _title:"用户设置",
        _footer:false,
        _load: function(){
            //content最小高度
            var higao= ($(window).height())-($("footer").height()*2.81);
            $(".content").css("min-height",higao);
        }
    },
    /*宝贝库搜索*/
    "ucenter/search": {
        _title:"搜索",
        _footer:false,
        _load: function(){
            $(".icon-search").click(function(){
                if($(this).text()=="商品 ▾"){
                    $(this).text("店铺 ▾")
                    $(".box-search input").attr("placeholder","请输入店铺名称");
                }else{
                    $(this).text("商品 ▾")
                    $(".box-search input").attr("placeholder","请输入商品名称");
                }

            })
        }
    },
    /*卡券包*/
    "ucenter/cardBag": {
        _title:"卡券包",
        _footer:false,
        _load: function(){

        }
    },
    /*嗖券*/
    "ucenter/whooshTicketList": {
        _title:"嗖券",
        _footer:false,
        pageNum:1,
        flag:true,
        status:0,
        _pass:function(){
        	$(document).unbind("scroll");
        },
        _load: function(){
        	var ctrl = this;
            $(".content .hd>ul>li").click(function(){
                $(this).addClass("cur").siblings().removeClass("cur");
                var listnum=$(this).index();
                /*$(".con-list>div").eq(listnum).show();
                $(".con-list>div").eq(listnum).siblings().hide();*/
                ctrl.pageNum = 1;//重置为1
                ctrl.status = listnum;
                ctrl.loadData();
            });
            $(".content .hd>ul>li:nth-child(1)").click();
            //触底加载
            setREG("document_scroll", ctrl._name, function(){
            	if($.getScrollBottom()<3 && ctrl.flag){
            		ctrl.pageNum++;
            		ctrl.loadData();
            	}
            });
        },
        loadData :function(){
    		var ctrl = this;
    		var $ul = $(".content .bd>ul");
    		$.get("randomCard/list.shtml",{
    			status:ctrl.status,
    			pageNum:ctrl.pageNum,
    			pageSize:6
    		},function(data){
    			if(data.status==1){
    				if(data && data.data.list.length<6){
        				flag = false;
        			}
        			var randomCards;
        			if(data && data.data.list.length>0 ){
        				randomCards = data.data.list;
        			}
        			if(ctrl.pageNum == 1){
        				$ul.empty();
        				if(!randomCards){
        					$(".whoosh-none").show();
        					if(ctrl.status == 0){
        						$(".whoosh-none").html('\
       								 <i class="iconfont">&#xe670;</i>\
    							        <h4 class="m-top10 color-gray9">您还没有可以使用的嗖券哦~</h4>\
    							        <h4 class="color-gray9">赽快去玩嗖一下~</h4>\
    						   ');
        					}else if(ctrl.status == 1){
        						$(".whoosh-none").html('\
        								 <i class="iconfont">&#xe671;</i>\
       							        <h4 class="m-top10 color-gray9">您还没有过期的嗖券哦~</h4>\
       						   ');
        					}else if(ctrl.status == 2){
        						$(".whoosh-none").html('\
        								<i class="iconfont">&#xe672;</i>\
       							        <h4 class="m-top10 color-gray9">您还没有使用过嗖券哦~</h4>\
       						   ');
        					}
        				}else{
        					$(".whoosh-none").hide();
        				}
        			}
        			if(randomCards && randomCards.length>0){
        				if(ctrl.status == 0){//未使用
        					$.each(randomCards,function(i,o){
        						var temp = "";
        						if(o.shop != null){//单个店铺
        							temp = 'onclick="this.ctrl.goShop('+o.shop.id+')"';
        						}else{//全平台
        							temp = 'style="background-color:#af59d9;"';
        						}
            					$('\
            							<li '+temp+'>\
            		                    <span class="radiu-top"></span>\
            		                    <span class="radiu-bottom"></span>\
            		                    <div class="dl">\
            		                        <h1 class="color-white m-top20">￥'+o.money.toFixed(2)+'</h1>\
            		                        <p class="color-white m-top10">满'+o.minPrice.toFixed(2)+'元可用</p>\
            		                    </div>\
            		                    <div class="txt">\
            		                        <h3 class="color-white">嗖券</h3>\
            		                        <h6 class="color-white">'+(o.shop?o.shop.shopName:"全平台通用")+'</h6>\
            		                        <p class="color-white m-top5">'+o.createDate.replace(/(-)/g,".").substring(0,16)+'-'+o.expireTime.replace(/(-)/g,".").substring(0,16)+'</p>\
            		                    </div>\
            		                </li>\
            					').appendTo($ul);
            				});
        				}else if(ctrl.status == 1){
        					$.each(randomCards,function(i,o){
            					$('\
            							<li style="background-color:#aaa;">\
            		                    <span class="radiu-top"></span>\
            		                    <span class="radiu-bottom"></span>\
            		                    <div class="dl">\
            		                        <h1 class="color-white m-top20">￥'+o.money.toFixed(2)+'</h1>\
            		                        <p class="color-white m-top10">满'+o.minPrice.toFixed(2)+'元可用</p>\
            		                        <img src="./img/overdue.png"/>\
            		                    </div>\
            		                    <div class="txt">\
            		                        <h3 class="color-white">嗖券</h3>\
            		                        <h5 class="color-white">'+(o.shop?o.shop.shopName:"全平台通用")+'</h5>\
            		                        <p class="color-white m-top5">'+o.createDate+'-'+o.expireTime+'</p>\
            		                    </div>\
            		                </li>\
            					').appendTo($ul);
            				});
        				}else if(ctrl.status == 2){
        					$.each(randomCards,function(i,o){
            					$('\
            							<li style="background-color:#aaa;">\
            		                    <span class="radiu-top"></span>\
            		                    <span class="radiu-bottom"></span>\
            		                    <div class="dl">\
            		                        <h1 class="color-white m-top20">￥'+o.money.toFixed(2)+'</h1>\
            		                        <p class="color-white m-top10">满'+o.minPrice.toFixed(2)+'元可用</p>\
            		                        <img src="./img/employ.png"/>\
            		                    </div>\
            		                    <div class="txt">\
            		                        <h3 class="color-white">嗖券</h3>\
            		                        <h5 class="color-white">'+(o.shop?o.shop.shopName:"全平台通用")+'</h5>\
            		                        <p class="color-white m-top5">'+o.createDate+'-'+o.expireTime+'</p>\
            		                    </div>\
            		                </li>\
            					').appendTo($ul);
            				});
        				}
        			}
    			}
    		});
        },
        goShop :  function(shopId){
        	if(shopId){
        		GO('shop/shops',{shopId:shopId});
        	}else{
        		return false;
        	}
        }
    },
    /*联盟卡*/
    "ucenter/cardCoupons": {
        _title:"联盟卡",
        _footer:false,
        _load: function(){

        }
    },
    /*优惠券*/
    "ucenter/discount": {
        _title:"优惠券",
        _footer:false,
        _load: function(){

        }
    },
    /*会员卡*/
    "ucenter/membershipCard": {
        _title:"会员卡",
        _footer:false,
        _load: function(){

        }
    },
    /*名词解释*/
    "ucenter/withdrawalNounsExplain": {
        _title:"名词解释",
        _footer:false,
        _load: function(){
            $(".cexplain>p>a").click(function(){
                document.body.scrollTop="500";
            })
        }
    },
    /*推广赚钱*/
    "ucenter/generalizeMoney":{
        _title: "推广赚钱",
        _footer: false,
        pageNum : 1,
        flag : false,
        _load: function () {
			this.expandRank(this.pageNum);
			var ctrl = this;
			setREG("document_scroll", this._name, function(){
                if($.getScrollBottom() < 3 && !ctrl.flag){
                	ctrl.flag = true;
                	ctrl.pageNum++;
                	if(ctrl.pageNum > 4){
                		ctrl.flag = true;
                		return false;
                	}
            		ctrl.expandRank(ctrl.pageNum);
            	}
            });
        },
        expandRank:function(pageNum){
        	var ctrl = this;
        	$.get("specialtyContent/expandRank.shtml",{pageNum:pageNum},function(data){
				var list = '';
				if(data.data && data.data.list && data.data.list.length > 0){
					list = data.data.list;
					var temp = '';
					for(var i=0;i<list.length;i++){
						temp += '<li>'+
									((pageNum-1)*10+i+1)+'、'+list[i].username+'<span class="kdl-right">'+list[i].expandAcount.toFixed(2)+'元</span>'+
								'</li>';
					}
					$(".RankingList>ol").append(temp);
					$(".RankingList").show();
				}
				if(data.data.list && data.data.list.length < 10){
					ctrl.flag = true;
				}else{
					ctrl.flag = false;
				}
			})
        } 
    },
    /*引导下载*/
    "ucenter/guidanceDownload": {
        _title:"引导下载",
        _footer:false,
        _datas:GET("common/downUrl.shtml",function(data){return data}),
        _load: function(){
            var hi=$(document).height();
            $(".content").css("height",hi);
        },
        /*打开APP*/
    	downApp:function(url){
    		if(navigator.userAgent.match(/MicroMessenger/i)){ 
    			alert("请点击右上角在浏览器中打开该页面，下载开店啦App"); 
    		}else{ 
    			if($.isIOS()){
    				location.href="https://itunes.apple.com/cn/app/kai-dian-la/id1120500042?mt=8";
    			}else{
    				location.href=Config.imgPre+url;
    			}
    		}
    	},
    },
    /*我的推广*/
    "ucenter/myGeneralize":{
        _title: "我的推广",
        _footer: false,
        pageNum:1,
    	pageSize:6,
    	flag:true,
        _datas:GET("ucenter/myExpand.shtml",{},function(data){
        	return data;
        }),
        _load: function () {
        	var ctrl = this;
        	ctrl.loadData();
        	//触底加载
            setREG("document_scroll", ctrl._name, function(){
            	if($.getScrollBottom()<3 && ctrl.flag){
            		ctrl.pageNum++;
            		ctrl.loadData();
            	}
            });
        },
        loadData:function(){
        	var ctrl = this;
        	$.get("ucenter/myRecommend.shtml",{
        		pageNum:ctrl.pageNum,
        		pageSize:ctrl.pageSize
        	},function(data){
        		var recommendList = "";
        		if(data.data && data.data.recommendList){
        			recommendList = data.data.recommendList;
        		}else{
        			return false;
        		}
        		if(recommendList.length < ctrl.pageSize){
        			ctrl.flag = false;
        		}
        		var temp = "";
        		for(var i=0;i<recommendList.length;i++){
        			var param = "";
        			if(recommendList[i].type == "shopKeep"){
        				param = "已成为店主";
        			}else{
        				param = "尚未成为店主";
        			}
        			temp += '<li>'+
	                    '<a href="javascript:;">'+
	                        '<div class="pic">'+
	                            '<img src="'+Config.imgPre+recommendList[i].icon+'"/>'+
	                        '</div>'+
	                        '<div class="txt">'+
	                            '<h5>'+recommendList[i].username+'</h5>'+
	                            '<p class="color-gray9 m-top5">'+recommendList[i].createDate+'<span class="kdl-right">'+param+'</span></p>'+
	                       '</div>'+
	                    '</a>'+
	                '</li>';
        		}
        		$("#myRecommendUl").append(temp);
        	})
        }
    },
    /*邀请二维码*/
    "ucenter/twoDimension":{
        _title: "邀请二维码",
        _links:{
        	"plugin/qrcode.js":"js",
        	"plugin/jquery.qrcode.js":"js"
        },
        _footer: false,
        _load: function () {
        	$.getUser(function(user){
        		if(user){
        			if(user.icon){
        				$(".pic>img").attr("src",Config.imgPre+user.icon);
        			}
        			$("#nickName").text(user.nickName);
        			$.post("ucenter/aboutQrcode.shtml",{areaId:function(){return Config.area.id;},promotionType:4},function(data){
        				var rate=$("body").width()/640,
        				width=500*rate,
        				icoWidth=140*rate,
        				context=$('.erweima').qrcode({
        					width:width,
        					height:width,
        					text:location.origin+location.pathname+"/common/overflowPurchase.shtml?tjrxx="+data.data.tjrxx+"&specialtyDisplayId="+data.data.specialtyDisplayId+"&areaId="+Config.area.id
        				}).find("canvas")[0].getContext("2d");
        				
        				var img=new Image();
        				img.onload=function(){
        					var left=(width-icoWidth)/2;
        					var top=(width-icoWidth)/2;
        					context.drawImage(img,left,top,icoWidth,icoWidth);
        				};
        				img.src="img/promotion_money_logo@2x.png";
        			})
        		}else{
        			DO('passport/login');
        		}
        	})
			
        }
   },
    /*邀请二维码*/
    "ucenter/feedback":{
        _title: "意见反馈",
        _links:{
        	"js/extra.js":"js"
        },
        _datas:GET("suggest/getSuggestTypes.shtml",function(data){
        	return data;
        }),
        _footer: false,
        _load: function () {
        	$(".boolean>ul>li").click(function(){
        		 if($(this).find("i").text()==""){//未选中
        			 $(this).find("i").text("");
        			 $(this).find("i").css({color:'#df494a'});
        			 $(this).siblings("li").find("i").text("").css({color:'#999'});
        			 $("#suggestType").text($(this).find("span").text());
        			 $("#type").val($(this).find("i").attr("type"));
                 }
        	})
        	$(".con-hd").click(function(){
        		$(".boolean").show(500);
        		$(".theme-popover-mask").show(300);
        	})
        	$(".boolean>ul").click(function(){
        		$(".boolean").hide(300);
        		$(".theme-popover-mask").hide(500);
        	})
        	$(".boolean>ul>li:nth(0)").click();
        },
        picCheck:function(){
    		var count=$(".addPicture").parent().parent().find(".pic").size();
    		var images = "";
    		$("input[name='pictures']").each(function(){
    			images += ","+$(this).val();
    		})
    		if(images.length > 0){
    			images = images.substring(1);
    		}
    		$("#images").val(images);
    		
    		if(count >= 4){
    			$(".addPicture").parent().hide();
    		}else{
    			$(".addPicture").parent().show();
    		}
    	},
    	checkForm : function(){
    		var flag = false;
    		if($("#type").val().trim() != "" && $("#content").val().trim() != ""){
    			flag = true;
    		}
    		var len = $("#content").val().length;
    		if(len > 150){
    			$("#content").val($("#content").val().substring(0,150));
    			$(".con-txt span").text("150/150");
    		}else{
    			$(".con-txt span").text($("#content").val().length+"/150");
    		}
    		if(flag){
    			$("#submitBtn").removeClass("bg-grayc").addClass("bg-red");
    		}else{
    			$("#submitBtn").removeClass("bg-red").addClass("bg-grayc");
    		}
    	},
    	_events:{
    		".addPicture":function(){
    			var btn=$(this).parent();
    			var btnThis = this;
            	$.simpleUpload({
            		multiple:false,
            		size:"10M",
            		process:function(e,files){
            			$.getMaxWrap().loadingWrap();
            		},
            		load:function(data){
            			$("html,body").loadingWrapCancel();
            			if(data==""){
            				return false;
            			}else{
            				var src=data&&data[0];
            				var url=Config.imgPre+src;
            				$(btn).before('<li class="pic" style="background-image:url('+url+');">\
    								<i class="iconfont color-red close">&#xe652;</i>\
    								<input type="hidden" name="pictures" value="'+src+'"/>\
    							</li>');
    						btnThis.ctrl.picCheck();
    					}
            		}
            	});
    		},
    		".pic .close":function(){
    			var ctrl=this.ctrl;
    			$(this).parent().remove();
    			ctrl.picCheck();
    		}
    	},
    	submitForm:function(){
    		if($("#submitBtn").hasClass("bg-grayc")){
    			return false;
    		}
    		this.picCheck();
    		if($("#type").val().trim() == ""){
    			alert("请选择意见类型！");
    			return false;
    		}
    		if($("#content").val().trim() == ""){
    			alert("请输入您的意见！");
    			return false;
    		}
    		if($("#images").val().split(",").length > 4){
    			alert("最多允许选择4张图片！");
    			return false;
    		}
    		var reg = /(^1[3|4|5|7|8]\d{9}$)|(^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$)/;
    		if($("#contact").val() != "" && (!reg.test($("#contact").val())||$("#contact").val().length > 50)){
    			alert("请正确的手机号或邮箱！");
    			return false;
    		}
    		$("#form").submit();
    	},
    	submitCall:function(data){
    		if(data.status == 1){
    			tipBox("提交成功");
    			GO("ucenter/mine")
    		}else{
    			alert(data.errorMsg);
    		}
    	}
   
    }    
});

})();