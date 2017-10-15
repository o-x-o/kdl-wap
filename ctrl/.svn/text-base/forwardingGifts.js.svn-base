(function(){
    /*公用变量和方法*/
    FORMAT({
        /*转发有礼*/
        "forwardingGifts/receivingGifts": {
            _title: "转发有礼",
            _footer: false,
            pageNum:1,
            flag:true,
            index:0,
            _datas:{
            	countItems:GET("forwardingGifts/count.shtml",{areaId:function(){return Config.area.id;}},function(data){
            		return data;
                })
            },
            _load: function () {
            	var ctrl = this;
                $(".content .hd li").click(function(){
                	ctrl.pageNum = 1;
                	ctrl.index = $(this).index();
                	ctrl.loadData();
                    $(this).addClass("cur").siblings().removeClass("cur");
                });
                $(".content .hd li").get(0).click();
                
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
            	var status = "";
            	if(ctrl.index == "0"){
            		status = "start";
            	}else if(ctrl.index == "1"){
            		status = "nostart";
            	}else if(ctrl.index == "2"){
            		status = "end";
            	}
            	$.get("forwardingGifts/list.shtml",{areaId:function (){return Config.area.id;},status:status,pageNum:ctrl.pageNum,pageSize:6},function(data){
            		if(ctrl.pageNum == 1){
            			$(".receivingGifts-none").empty();
            			$(".con-list>ul").empty();
            		}
            		var forwardingGiftsItems = data.data.list;
            		if(forwardingGiftsItems && forwardingGiftsItems.length>0){
            			$.each(forwardingGiftsItems,function(i,o){
            				$('\
            						<li><a href="#forwardingGifts/forwardingDetails?forwardingGiftsId='+o.id+'&shopId='+o.shop.id+'">\
            							<img src="'+Config.imgPre+o.imageSrcs[0].src+'"/>\
                	                    	<div class="txt">\
                	                        	<h5>'+o.shop.shopName+'</h5>\
                	                        	<p class="ellips">'+o.title+'</p>\
                	                        </div>\
                	                 </a></li>\
            				').appendTo($(".con-list>ul"));
            			});
            		}
            		if(ctrl.pageNum == 1 && (!forwardingGiftsItems || forwardingGiftsItems.length==0)){
            			$(".receivingGifts-none").show();
            			if(status=="start"){
            				$('\
            					<i class="iconfont color-gray9">&#xe668;</i>\
            					<h2 class="m-top40 color-gray6"> 目前还没有进行中的活动哦</h2>\
            					').appendTo($(".receivingGifts-none"));
            			}else if(status=="nostart"){
            				$('\
            						<i class="iconfont color-gray9">&#xe665;</i>\
                        		 	<h2 class="m-top40 color-gray6"> 目前还没有未开始活动哦</h2>\
                					').appendTo($(".receivingGifts-none"));
            			}else if(status=="end"){
            				$('\
            						<i class="iconfont color-gray9">&#xe664;</i>\
                        		 	<h2 class="m-top40 color-gray6"> 目前还没有已结束的活动哦</h2>\
                					').appendTo($(".receivingGifts-none"));
            			}
            		}
                });
            }
        },
        /*转发有礼商品详情*/
        "forwardingGifts/forwardingDetails": {
            _title: "转发有礼详情",
            _footer: false,
            _links:{
                "./plugin/swipe.js":"js"
            },
            forwardingGiftsId:null,
            nowTime:null,
            lastTime:null,
            allowTime : null,
            key:null,
            secret:null,
            status:null,
            lastTimeInterval:null,
            _datas:{
            	//查询转发有礼详细信息和店铺信息
            	_data:GET("forwardingGifts/detail.shtml",{shopId:PARAM("shopId"),forwardingGiftsId:PARAM("forwardingGiftsId")},function(data){
            		return data;
            	}),
            	//获取参与转发有礼的活动人列表
            	activityPersons:GET("forwardingGifts/getActivityPerson.shtml",{forwardingGiftsId:PARAM("forwardingGiftsId")},function(data){
            		return data;
            	})
            },
            _load: function () {
            	document.title =  this._datas._data.forwardingGifts.title;
                /*轮播图播放*/
                $(".wrap img").show();
                var length=$("#slider .swipe-wrap").children().length;
                $("#circle").empty();
                for(var n=0;n<length;n++){
                	$("#circle").append("<li></li>");
                }
                var diandian = document.getElementById('circle').getElementsByTagName('li');
                $(diandian).click(function(){slider.next();slider.slide($(this).index());}).eq(0).addClass("current");
				setTimeout(function(){$("#circle").css("margin-left",-$("#circle").width()/2);},1000);
                var slider =
                    Swipe(document.getElementById('slider'), {
                        auto: 3000,// 每3秒切换图片
                        continuous: true,
                        callback: function(pos) { //pos  返回的是索引值
                            for(var i=0;i<=diandian.length;i++){
                                $(diandian[i]).removeClass("current");
                                $(diandian[pos]).addClass("current");
                            }
                            $("#circle").css("margin-left",-$("#circle").width()/2);
                        }
                    });
                $("#circle").css("margin-left",-$("#circle").width()/2);
                setREG("resize",this._name,function(){
                    $("#circle").css("margin-left",-$("#circle").width()/2);
                });

                /*获奖名单*/
                var scrollW=$(".autoScroll");
                scroll1=$(".autoScroll .autoScrollone"),
                scroll2=$(".autoScroll .autoScrolltwo"),
                cont=scroll1.html();
                for(var i=0;i<3;i++){
                    scroll1.html(scroll1.html()+cont);
                }
                scroll2.html(scroll1.html());
                setInterval(function(){
                    var top=scrollW.scrollTop();
                    max=scroll1.height();
                    scrollW.scrollTop(top<max?top+1:0);
                },50);

                /*任务帮助*/
                $(".task").click(function(){
                    $("#helpDiv").show(300);
                    $("#taskHelp").show(200);
                });
                $("#helpDiv .cose").click(function(){
                    $("#helpDiv").hide(200);
                    $("#taskHelp").hide(300);
                });
                /* 参与任务 */
                $(".activityTask").click(function(){
                	$.get("common/isLogged.shtml",{},function(data){
                		if(data.data.isLogged != null && data.data.isLogged){
                        	$("#activityTaskDiv").show(300);
                        	$("#activityTask").show(200);
                		}else{
                			alert('参与本次活动，请登录！',true);
                			$(".alertBox>ul>li:first-child>a").text("登录").attr("href","#passport/login");
                		}
                	});
                	
                });
                $("#activityTaskDiv .cose").click(function(){
                    $("#activityTaskDiv").hide(200);
                    $("#activityTask").hide(300);
                });
                
                var flag=false;
                var ua = window.navigator.userAgent.toLowerCase(); 
        		if(ua.match(/MicroMessenger/i) == 'micromessenger'){ 
        			flag = true; 
        		}else{ 
        			flag = false; 
        		}
        		if(flag){
        			$("#activityTaskContent").html("参与本次活动，请登录！");
        			this.getShareSign();
        		}
        		this.forwardingGiftsId = this._datas._data.forwardingGifts.id;
        		this.lastTime =this._datas._data.lastTime; 
            	this.nowTime = this._datas._data.nowTime;
            	this.key = this._datas._data.key;
            	this.secret = this._datas._data.secret;
            	this.status = this._datas._data.forwardingGifts.status;
            	if(this.lastTime != null){
            		this.allowTime = this.lastTime + 6*60*60*1000;
            		var ctrl=this;
            		this.lastTimeInterval = setInterval(function(){
            			ctrl.nowTime =ctrl.nowTime + 1000;
            		},1000);
            	}
            },
            _events:{
            	".popup .iconfont":{
            		click:function(){
            			$(".theme-popover-mask").hide(300);
            			$(".popup").hide(300);
            		}
            	}
            },
            //参与活动
            activity:function(path){
            	if(this.status != 'online'){
            		alert("非常抱歉，该活动未开始或已结束！");
            		return false;
            	}
            	if(this.allowTime != null){
            		if(this.nowTime < this.allowTime){
            			alert("因为分享周期时6小时，因此您的此次分享将不计入分享次数中，距离下次分享剩余："+this.formatSeconds((this.allowTime-this.nowTime)/1000));
            			return false;
            		}
            	};
            	$.ajax({
            		url:"forwardingGifts/activity.shtml",
            		data:{forwardingGiftsId:this.forwardingGiftsId,path:path,key:this.key,secret:this.secret},
            		async:false,
            		type:"post",
            		dataType:"json",
            		success:function(data){
            			if(data.data.success){
            				$(".count").html(data.data.count);
            			}
            			if(data.data.complate){
            				alert("恭喜你，完成任务了！");
            			}else if(data.data.isLogged != null && !data.data.isLogged){
            				alert('参与本次活动，请登录！',true);
                        	$(".alertBox>ul>li:first-child>a").text("登录").attr("href","#passport/login");
            			}else{
            				alert(data.data.content);
            			}
            		},
            		error:function(data){
            			
            		}
            	});
            },
            //秒转换成时分秒
            formatSeconds:function (value) {
        	   var theTime = parseInt(value);// 秒
        	   var theTime1 = 0;// 分
        	   var theTime2 = 0;// 小时
        	   if(theTime > 60) { 
        		   theTime1 = parseInt(theTime/60); 
        		   theTime = parseInt(theTime%60); 
        		   if(theTime1 > 60) { 
        			   theTime2 = parseInt(theTime1/60); 
        			   theTime1 = parseInt(theTime1%60); 
        		   }
        	   }
        	   theTime2 = (theTime2>9?theTime2:("0"+theTime2));
        	   theTime1 = (theTime1>9?theTime1:("0"+theTime1));
        	   theTime = (theTime>9?theTime:("0"+theTime));
        	   return theTime2+"小时"+theTime1+"分钟";
            },
            //获取微信签名等信息
            getShareSign:function(){
            	var ctrl = this;
            	$.wxShare({
            		call:function(type,res){
            			if(type=="friend"){
            				alert("分享给微信好友、QQ好友，暂时不计入分享次数哦！");
            			}else{
            				ctrl.activity(type);
            			}
            		}
            	});
            },
            _pass:function(){
            	clearInterval(this.lastTimeInterval);
            }
        }
    });

})();