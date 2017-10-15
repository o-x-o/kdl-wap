(function(){
	/*公用变量和方法*/
	var scrollTops = null;
	FORMAT({
		
		/**商家店铺*/
	    "shop/shops":{
	    	_title:"商家店铺",
	   		pageNum:1,
	   		flag:true,
	   		orders:"",
	   		scrollTop : null,
	   		_datas: {/*动态数据 视图中也能使用全局变量 此处取名_datas区别于视图中所有变量的附属对象_data 在js中也可通过DATA(dom)获取该视图的数据 dom为该视图中的任意dom*/
	        	data:GET("shop/bInfo.shtml",{shopId:PARAM("shopId")},function(datas,ctrl){
	        		//判断是否有数据
	        		if(datas instanceof Error){
	        			DO("error", datas);
	        			ctrl._goShow=false;
	        		}
	        		return datas;
	        	}),
	        	isFavorite:GET("shop/favorite.shtml",{shopId:PARAM("shopId")},function(data){
	    			return data.isFavorite;
	    		})
	        },
	        _show: function(){
	        	if(scrollTops != null){
	        		this.shopInfos();
	        		document.body.scrollTop=scrollTops;
	        		scrollTops = null;
	        	}
	        },
	        _load:function(){
	        	$.wxShare();
	        	var ctrl = this;
	        	//加载全部商品
	        	ctrl.loadData();
	            /*导航栏切换*/
	            $(".navigation>ul>li").click(function(){
	                $(this).addClass("cur").siblings().removeClass("cur");
	            })
	            
	            /*收藏*/
	            $(".collect").click(function(){
	            	if($(this).hasClass("active")){//已收藏
	            		$.delete("shop/favorite.shtml",{shopId:$("#shopId").val()},function(data){
	            			if(data.status == "1"){
	            				$(".collect").removeClass("active");
	            				$("#attentionPeoples").text(+$("#attentionPeoples").text()-1);
	            			}else{
	            				if(data.status == "0" && data.errorCode == "1000"){//未登录
	            					GO('passport/login',{backUrl:'#shop/shops?shopId='+$("#shopId").val()}) 
	    							return false;
	            				}else{
	            					alert(data.errorMsg);
	            				}
	            			}
	            		});
	            	}else{//未收藏
	            		$.post("shop/favorite.shtml",{shopId:$("#shopId").val()},function(data){
	            			if(data.status == "1"){
	            				$(".collect").addClass("active");
	            				$("#attentionPeoples").text(+$("#attentionPeoples").text()+1);
	            			}else{
	            				if(data.status == "0" && data.errorCode == "1000"){//未登录
	            					GO('passport/login',{backUrl:'#shop/shops?shopId='+$("#shopId").val()})
	    							return false;
	            				}else{
	            					alert(data.errorMsg);
	            				}
	            			}
	            		});
	            	}
	            });
	            $.post("shop/shopBrowse.shtml",{shopId:$("#shopId").val()},function(data){})
	            /*切换风格*/
	            $("#conList").click(function(){
	                if($(this).text()==""){
	                    $(this).text("");
	                    $(".listid").addClass('Merchandise-list').removeClass('Merchandise');
	                }
	                else{
	                    $(this).text("");
	                    $(".listid").addClass('Merchandise').removeClass('Merchandise-list');
	                }
	            });
	            /*tab切换*/
	            $  ("#screen>li").click(function(){
	                $(this).addClass("cur").siblings().removeClass("cur");
	                var listval=$(this).index();
	                if(listval == 0){
	                	$("#screen").find("cite").removeClass("color-red");
	                	ctrl.orders = "orderSign";
	                }else if(listval == 1){
	                	$("#screen").find("cite").removeClass("color-red");
	                	ctrl.orders = "sales";
	                }else if(listval == 2){
	                	$(this).find("cite").addClass("color-red");
	                	 //价格排序
    	            	if($(this).find("cite").text()=="▾"){
    	            		$(this).find("cite").text("▴");
    	            		ctrl.orders = "priceAsc";
    	            	}
    	            	else{
    	            		$(this).find("cite").text("▾");
    	            		ctrl.orders = "priceDesc";
    	            	}
	                }
	                if(ctrl.orders){
	                	reLoadData();
	                }
	            })
	            /*评星*/
	            var starsum=(($(".starbg>span").attr("width")/10)/2)-1;
	            var starsumt=parseInt(($(".starbg>span").attr("width")/10)/2);
	            for(var i=0; i<=starsum; i++){
	                $(".bgtwo i").eq(i).addClass("color-orange");
	            }
	            if(starsum%1!=0){
	                $(".bgtwo i").eq(starsumt).html("");
	                $(".bgtwo i").eq(starsumt).addClass("color-orange");
	            }else{
	            	
	            }
	            
	            $(".navigation>ul>li").click(function(){
	                var listval=$(this).index();
	                $(".list-box>div").hide().eq(listval).show();
	                //加载商品集合
	                if(listval == 0){
	                	//加载全部商品
	                	reLoadData();
	                }else if(listval == 1){
	                	ctrl.flag = false;//禁止触底加载
	                	$.get("shop/shopRecommendGoods.shtml",{shopId:$("#shopId").val(),orders:""},function(data){
	                		if(!data.data.goodsList || data.data.goodsList.length==0){
	                			$("#recommend").show();
	                		}else{
	                			$(".recommendGoodsUl").html(REND('shop/recommendGoods',{list:data.data.goodsList}));
	                		}
	                	});
	                }else if(listval == 2){
	                	$(".activity>ul").empty();
	                	ctrl.loadActivitys();
	            	}else if(listval == 3){
	                	 $.getPosition(function(x,y,cityname){
	                		 $.get("shop/similarityShop.shtml",{
	                     		industryCategoryId:$("#industryCategoryId").val(),
	                     		position:x+","+y,
	                     		/*industryCategoryId:432,
	                     		position:"123.470024,41.788609",*///测试用
	                     		pageNum:1,
	                     		pageSize:6
	                     	},function(data){
	                     		var similarShops = data.datas;
	                     		if(similarShops && similarShops.length > 0){
	                     			$("#Similar").hide();
	                     			$(".Similar>ul").html(REND('shop/similarShops',{list:data.datas,ownShopId:$("#shopId").val()}));
	                     		}else{
	                     			$("#Similar").show();
	                     		}
	                     	});
	            		 });
	                }
	            })
	            /*轮播图播放*/
	            $(".list-box>div").hide().last().show();
	            $(".wrap img").show();
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
	            var diandian = document.getElementById('circle').getElementsByTagName('li');
	            $(diandian).click(function(){slider.next();slider.slide($(this).index());}).eq(0).addClass("current");
				setTimeout(function(){$("#circle").css("margin-left",-$("#circle").width()/2);},1000);
	            $(".list-box>div").hide().first().show();
	            $("#circle").css("margin-left",-$("#circle").width()/2);
	            setREG("resize",this._name,function(){
	            	$("#circle").css("margin-left",-$("#circle").width()/2);
	            });
	            
	            (function initMap(){
        			if(AMap.Map==null){
            			setTimeout(initMap,200);
            			return;
            		}
        			getDistance($("#shopId").val(),$("#gaodeId").val());
        		})();
	            //计算距离
	        	function getDistance(id,gaodeId){
	        		var Lng = "";
	        		var Lat = "";
	        		if(!gaodeId){
	        			$("#distance_"+id).html("暂时无法获取位置");
	        			return;
	        		}
	        		$.getPosition(function(x,y,cityname){
	        			if(x!=0 && y!=0){
	        				Lng = x;
	        				Lat = y;
	        				cloudSearch();
	        			}else{
	        				$("#distance_"+id).html("暂时无法获取位置");
	        			}
	         		});
	        		
	        		//周边检索函数
	        		function cloudSearch() {
	        		    var search;
	        		    var searchOptions = {
	        		        keywords: '',
	        		        orderBy: '_id:ASC'
	        		    };
	        		    //加载CloudDataSearch服务插件
	        		    AMap.service(["AMap.CloudDataSearch"], function() {
	        		        search = new AMap.CloudDataSearch('577f95bc7bbf1936b142344a', searchOptions); //构造云数据检索类
	        		        search.searchById(gaodeId,function(status,result){
	        		        	if(status === 'complete' && result.info === 'OK'){
	        		        		var current = new AMap.LngLat(Lng,Lat);
	        		            	var lnglat = new AMap.LngLat(result.datas[0]._location.lng,result.datas[0]._location.lat);
	        		            	$("#distance_"+id).html((current.distance(lnglat)/1000).toFixed(0)+"km");
	        		        	}else{
	        		        		$("#distance_"+id).html("暂时无法获取位置");
	        		        	}
	        		        	
	        		        });
	        		    });
	        		}
	        	}
	        	setREG("document_scroll", ctrl._name, function(){
                    if($.getScrollBottom()<3 && ctrl.flag){
	            		ctrl.pageNum++;
	            		ctrl.loadData();
	            	}
                });
		        
		        //重新加载数据
		        function reLoadData(){
		        	ctrl.pageNum=1;
		        	ctrl.flag = true;//初始化flag
                	//ctrl.orders = "";//初始化orders
                	$(".allGoodsUl").empty();
		        	ctrl.loadData();
		        }
		        
		        //进入地图
		        $("#entryMap").click(function(){
		        	var shopId = $(this).attr("shopId");
		        	GO("shop/atlas",{shopId:shopId});
		        })
		        
	        },
	        _links:{
	            "./plugin/swipe.js":"js",
	            "./css/shops.css":"css",
	            "http://webapi.amap.com/maps?v=1.3&key=e53e463d097f2a084e06b07441bc7048&plugin=AMap.CloudDataSearch":"js"
	        },
	        shopInfos : function(){
	        	$(".navigation>ul>li:nth-child(4)").click();
	        	 $.getPosition(function(x,y,cityname){
	        		 $.get("shop/similarityShop.shtml",{
	             		industryCategoryId:$("#industryCategoryId").val(),
	             		position:x+","+y,
	             		/*industryCategoryId:432,
	             		position:"123.470024,41.788609",*///测试用
	             		pageNum:1,
	             		pageSize:6
	             	},function(data){
	             		var similarShops = data.datas;
	             		if(similarShops && similarShops.length > 0){
	             			$("#Similar").hide();
	             			$(".Similar>ul").html(REND('shop/similarShops',{list:data.datas,ownShopId:$("#shopId").val()}));
	             		}else{
	             			$("#Similar").show();
	             		}
	             	});
	    		 });
	        },
	        toAllEvaluate : function(shopId){
	        	scrollTops = document.body.scrollTop;
	        	GO("shop/allEvaluate",{shopId:shopId});
	        },
	        loadData:function(){
	        	var ctrl = this;
	        	$.get("shop/shopAllGoods.shtml",{
	        		pageNum:ctrl.pageNum,
	        		pageSize:6,
	        		shopId:$("#shopId").val(),
	        		orders:ctrl.orders
	        	},function(data){
	        		var goodsList = data.data.goodsList;
	        		if(goodsList && goodsList.length < 6){
	        			ctrl.flag = false;
	        		}
	        		if(ctrl.pageNum == 1){
	        			if(goodsList.length==0){
	        				$("#noAllGoods").show();
	        			}else{
	        				$(".allGoodsUl").html(REND('shop/allGoods',{list:goodsList}));
	        			}
	        		}else{
	        			$(REND('shop/allGoods',{list:goodsList})).appendTo($(".allGoodsUl"));
	        		}
	        	})
	        },
	        loadActivitys:function(){
	        	$.get("shop/shopActivitys.shtml",{
	        		shopId:$("#shopId").val(),
	        		status:"start"
	        	},function(data){
	        		var activitys = data.data.list;
	        		if(!activitys || activitys.length==0){
	        			$(".activity .reminder").css({"display":"block","padding-bottom":"1rem"});
	        		}else{
	        			var html ="";
	        			for(var i= 0;i<activitys.length;i++){
	        				html += "<li>"+
	        							"<a href='javascript:void(0);'>"+
		        	                        "<div class='hd clearfix' onclick=\"this.ctrl.toPage('"+activitys[i].activityType+"','"+activitys[i].id+"','"+activitys[i].shopId+"')\">"+
		        	                            "<div><span class='color-gray6 ellips'>"+activitys[i].title+"</span></div>"+
		        	                            "<span class='color-gray9 p'>结束时间:"+activitys[i].endDate+"</span>"+
		        	                        "</div>";
	        				if(activitys[i].activityType == "sales" && activitys[i].goodsList != null && activitys[i].goodsList != ''  && activitys[i].goodsList.length > 0){
	        					html += "<div class='pic pto'>";
	        					for(var j=0;j<activitys[i].goodsList.length ;j++){
	        						html += "<img src='"+Config.imgPre+activitys[i].goodsList[j].image+"' onclick='this.ctrl.toGoodsPage(\""+activitys[i].goodsList[j].goodsId+"\")' />"
	        					}
	        					html += "</div>";
	        				}else{
	        					html += "<div class='pic' onclick=\"this.ctrl.toPage('"+activitys[i].activityType+"','"+activitys[i].id+"','"+activitys[i].shopId+"')\">"+
				                            "<img src='"+Config.imgPre+activitys[i].image+"' />"+
				                        "</div>";
	        				}
	        					
	        	                    html +="</a>"+
	        	                "</li>";
	        			}
	        			$(".activity>ul").append(html);
	        		}
	            });
	        },
	        toPage:function(activityType,id,shopId){
	        	if(activityType == 'forward'){
	        		window.location.href = Config.basePath + "/#forwardingGifts/forwardingDetails?forwardingGiftsId="+id+"&shopId="+shopId;
	        	}else if(activityType == 'shop'){
	        		window.location.href = Config.basePath + "/#cityNews/activityDetails?activityId="+id;
	        	}else if(activityType == 'sales'){
	        		window.location.href = Config.basePath + "/#cityNews/promotionDetails?activityId="+id;
	        	}
	        },
	        toGoodsPage:function(goodsId){
	        	window.location.href = Config.basePath + "/#goods/details?goodsId="+goodsId;
	        }
	    },
	
	    /**店铺设置*/
	    "shop/shopSet": {
	        _title: "店铺设置",
	        _links:{
	        	"js/extra.js":"js"
	        },
	        _datas: GET("shop/personalShop.shtml",{type:PARAM("type",null)},function(data,ctrl){
	    		if(data instanceof Error){
	    			ctrl._goError = false;
	    			DO('error',data);
	    		}
	    		return data;
	        }),
	        _footer:false,
	        _load: function () {
	        },
		    _events:{
	        	".uploadPic":{
	        		click:function(){
	        			var btn=this,
	        				clip=$(btn).attr("clip") ? $(btn).attr("clip").split(":") : [];
	        			$.clipImage({
	        				width:clip[0],
	        				height:clip[1],
	            			call:function(url){
	            				$.post($(btn).attr("url"),{
	            					shopType : _param.type,
	            					iconSrc : url,
	            					imageSrc : url,
	            				},function(data){
	    		        			if(data.status == "1"){
	    		        				$(btn).find("img").attr("src",Config.imgPre + url);
	    		        			}else{
	    		        				alert(data.errorMsg);
	    		        			}
	        		        	});
	            			}
	            		});
	        		}
	        	}
	        },
	    },
	    
	    
	    /*店铺名修改*/
	    "shop/shopName": {
	        _title: "店铺名修改",
	        _footer:false,
	        _load: function () {
	        },
	        //修改店铺名称
	        updateShopName : function(){
	        	if(!$("#pageShopName").val().trim()){
	        		alert("店铺名称不能为空");
	        		return false;
	        	}
	        	$.get("shop/checkShopName.shtml",{
	        		shopType : _param.type,
	        		shopName : $("#pageShopName").val()
	        	},function(datas){
	        		if(datas.data.isOnly){
	        			$.post(
        	    			"shop/setShopName.shtml",
        	    			{
        	    				shopName : $("#pageShopName").val(),
        	    				type : _param.type
        	    			},
        	    			function(datas){
        	    				if(datas.status == "1"){
        	    					GO("shop/shopSet?type="+_param.type);
        	    				}else{
        	    					alert(datas.errorMsg);
        	    				}
        	    			}
        				);
	        		}else{
	        			alert("当前店铺名称已存在，请更换！");
	        		}
	        	});
	    		
	    	},
	    	clearText : function(){
	    		$("#pageShopName").val("");
	    	}
	    },
	    
	    
	    /*店铺标题修改*/
	    "shop/shopSubtitle": {
	    	_title: "店铺副标题",
	    	_footer:false,
	    	_load: function () {
	    	},
	    	//修改店铺标题
	    	updateSubtitle : function(){
	    		$.post(
	    			"shop/setShopSubtitle.shtml",
	    			{
	    				shopSubtitle : $("#pageShopSubtitle").val(),
	    				type : _param.type
	    			},
	    			function(datas){
	    				if(datas.status == "1"){
	    					GO("shop/shopSet?type="+_param.type);
	    				}else{
	    					alert(datas.errorMsg);
	    				}
	    			}
				)
	    	},
	    	clearText : function(){
	    		$("#pageShopSubtitle").val("");
	    	}
	    },
	    
	    /*店内商品搜索*/
	    "shop/searchInShop":{
	    	_title: "店内商品搜索",
	    	_footer:false,
	    	_load: function () {
	    	},
	    	toSearch : function(item){
	        	var $input=this._dom.find("input");
	        	$.get("shop/searchInShop.shtml",{
	        		shopId:_param.shopId,
	        		keyword:$input.val()
	        	},function(data){
	        		if(data.status == 0){
	    				alert(data.errorMsg);
	    				return;
	    			}
	    			var goodsList = data.data.goodsList;
	    			var shopType = data.data.shopType;
    				$("#goodsListUl").empty();
	    			var temp = "";
	    			if(goodsList != null && goodsList.length > 0){
	    				var aHrefParam = '';
	    				if(shopType == "business"){
	    					aHrefParam = '&shopId='+_param.shopId;
	    				}else{
	    					aHrefParam = '';
	    				}
	    				for(var i = 0;i<goodsList.length;i++){
	    					var consumeTips = "";
	    					if(goodsList[i].consumeTips != null && goodsList[i].consumeTips != ""){
	    						consumeTips = '<button>返￥'+goodsList[i].consumeTips.toFixed(2)+'</button>';
	    					}
	    					temp += '<li>'+
			    		                '<a href="#goods/details?goodsId='+goodsList[i].id+aHrefParam+'">'+
						                    '<div class="pic">'+
						                        '<img src="'+Config.imgPre+goodsList[i].image+'"/>'+
						                        '<div class="bt">'+
						                            '<div></div>'+
						                        '</div>'+
						                    '</div>'+
						                    '<div class="txt">'+
						                        '<h6 class="color-gray6 ellips">'+goodsList[i].name+'</h6>'+
						                        '<h5 class="color-red h3 m-top10">'+
						                        	'￥'+goodsList[i].price.toFixed(2)+
						                        	consumeTips+
						                        '</h5>'+
						                        '<div class="color-gray9 p m-top10">好评率100%</div>'+
						                        '<p class="color-gray9 clearfix m-top10">'+
						                        	'<span class="kdl-left">销量：'+
						                        		goodsList[i].sales+
						                        	'</span>';
						                        	temp +=
						                        '</p>'+
						                    '</div>'+
						                '</a>'+
						            '</li>';
	    				}
	    			}else if(!(goodsList != null && goodsList.length > 0)){
	    				temp = '<div class="pic">'+
			    			        '<img src="./img/searchGoods_none.jpg"/>'+
			    			    '</div>';
	    			}
	    			$("#goodsListUl").append(temp);
	        	});
	        },
	    	monitor:function(){
	         	if(event.keyCode == 13){
	         		$("#searchBtn").click();
	         	}
	        }
	    },
	    //进入地图
	    "shop/atlas":{
	    	_title:"店铺地址",
	    	_footer:false,
	    	_template:{url:"./view/atlas.ejs"},
	    	_load: function () {
	    		/*$.getMaxWrap().loadingWrap();
	    		$("#dituContent").height($(window).outerHeight(true)-$("header").outerHeight(true));
	    		$(function() {
	    			$.get("shop/atlas.shtml",{shopId:_param.shopId},function(data){
	    				var shop = data.data.shop;
	    				$("#shopAddress").text(shop.shopAddress);
	    				var windowsArr = [];
	        		    var marker = [];
	        		    var map;
	            		(function initMap(){
	            			if(AMap.Map==null){
	                			setTimeout(initMap,200);
	                			return;
	                		}
	            			$.getMaxWrap().loadingWrapCancel();
	    	    		    //基本地图加载
	    	    		    map = new AMap.Map("dituContent");
	    	    		    map.plugin(["AMap.ToolBar"],function(){
	    	    			    //加载工具条
	    	    			    var tool = new AMap.ToolBar();
	    	    			    map.addControl(tool);   
	    	    			});
	    	    			//比例尺
	    	    		    map.plugin(['AMap.Scale'],function(){
	    	    		   		var scale = new AMap.Scale();
	    	    		   		map.addControl(scale);
	    	    		   	});
	    	    		    cloudSearch(shop.gaodeId);
	            		})();
	    	    		//根据数据id查询数据详情
	    	    		function cloudSearch(id) {
	    	    			map.clearMap();
	    	    			var search;
	    	    			AMap.service(["AMap.CloudDataSearch"], function() {
	    	    				search = new AMap.CloudDataSearch('577f95bc7bbf1936b142344a');  //构造云数据检索类
	    	    				//根据id查询
	    	    				search.searchById(id, function(status, result) {
	    	    					cloudSearch_CallBack(result);
	    	    				});
	    	    			});
	    	    		}
	    	    		function addmarker(i, d) {
	    	    			//console.log(d);
	    	    			var lngX = d._location.getLng();
	    	    			var latY = d._location.getLat();
	    	    			var markerOption = {
	    	    					map: map,
	    	    					icon: Config.basePath+"/img/marker.png",
	    	    					position: [lngX, latY]
	    	    			};
	    	    			var mar = new AMap.Marker(markerOption);
	    	    			marker.push([lngX, latY]);
	    	    			
    	    				var infoWindow = new AMap.InfoWindow({
    	    					content:'<div style="margin:0;line-height:20px;padding:12px;padding-top:24px;">' +
    	    					'<img src="'+Config.imgPre+shop.shopImage+'" alt="" style="float:right;zoom:1;overflow:hidden;width:100px;height:100px;margin-left:3px;"/>' +
    	    					''+shop.shopName+'('+shop.shopSubtitle+')<br/>地址：'+shop.shopAddress+'<br/>联系人：'+shop.shopContacts+'<a href="tel:'+shop.shopPhone+'">'+shop.shopPhone+'</a>' +
    	    					'</div>',
    	    					size: new AMap.Size(0, 0),
    	    					autoMove: true,
    	    					offset: new AMap.Pixel(0, -30),
    	    					placeSearch: true,
    	    					asOrigin: true,
    	    					asDestination: true,
    	    					enableSendToPhone: true
    	    				});
    	    				windowsArr.push(infoWindow);
    	    				var aa = function() {
    	    					infoWindow.open(map, mar.getPosition());
    	    				};
    	    				mar.on( "click", aa);
	    	    		}
	    	    		//回调函数
	    	    		function cloudSearch_CallBack(data) {
	    	    			var resultArr = data.datas;
	    	    			if(resultArr && resultArr.length>0){
	    	    				var resultNum = resultArr.length;
	    	    				for (var i = 0; i < resultNum; i++) {
	    	    					addmarker(i, resultArr[i]);
	    	    				}
	    	    				map.setFitView();
	    	    			}
	    	    		}
	    	    		//回调函数
	    	    		function errorInfo(data) {
	    	    			resultStr = data.info;
	    	    		}
	    	    		//根据id打开搜索结果点tip
	    	    		function openMarkerTipById1(pointid, thiss) {
	    	    			thiss.style.background = '#CAE1FF';
	    	    			windowsArr[pointid].open(map, marker[pointid]);
	    	    		}
	    	    		//鼠标移开后点样式恢复
	    	    		function onmouseout_MarkerStyle(pointid, thiss) {
	    	    			thiss.style.background = "";
	    	    		}    	
	    	    	})
	    	    });*/
	    	},
	    	/*_links:{
	            "http://webapi.amap.com/maps?v=1.3&key=e53e463d097f2a084e06b07441bc7048&plugin=AMap.CloudDataSearch":"js"
	        }*/
	    },
        /*附近实体店*/
        "shop/nearbyStore": {
            _title: "附近实体店",
            _footer: false,
            isHave : true,
    	    orders : null,
        	//pageAreaId : null,
    	    categoryId : null,
    	    industryCategoryId : null,
        	isLocal:null,
        	isHaveActivity:false,
        	pageNum : 0,
        	pageSize : 5,
        	longitude:0,
        	latitude:0,
        	cityName:0,
            _links:{
                "./css/ios-switch.css":"css"
            },
            _load: function () {
                /*tab切换*/
                var hi=$(document).height()-$('header').height();
                $("#screen>li").click(function(){
                    $(this).addClass("cur").siblings().removeClass("cur");
                    var listval=$(this).index();
                    if(listval == 0){
                        $("#classify").siblings().hide();
                        $("#classify").toggle();
                        if($("#classify").css('display')=='block'){
                            $(".theme-popover-mask").show();
                            $("body").css({"height":hi,"overflow":"hidden"});
                        }
                        else{
                            $("body").css({"height":"auto","overflow":"scroll"});
                            $(".theme-popover-mask").hide();
                        }

                    }else if(listval == 1){
                        $("#Sort").siblings().hide();
                        $("#Sort").toggle();
                        if($("#Sort").css('display')=='block'){
                            $(".theme-popover-mask").show();
                            $("body").css({"height":hi,"overflow":"hidden"});
                        }
                        else{
                            $(".theme-popover-mask").hide();
                            $("body").css({"height":"auto","overflow":"scroll"});
                        }
                    }else if(listval == 2){
                        $("#filtrate").siblings().hide();
                        $("#filtrate").toggle();
                        if($("#filtrate").css('display')=='block'){
                            $(".theme-popover-mask").show();
                            $("#filtrate").css({"overflow-y":"scroll"});
                            $("body").css({"height":hi,"overflow":"hidden"});
                        }
                        else{
                            $(".theme-popover-mask").hide();
                            $("body").css({"height":"auto","overflow":"scroll"});
                        }
                    }
                })
                $(".theme-popover-mask").click(function(){
                    $(this).hide();
                    $("body").css({"height":"auto","overflow":"scroll"});
                    $("#classify").siblings().hide();
                    $("#classify").hide();
                })

                $(document).not(".screen-box").click(function(){
                    if($(".option").css('display')=='block'){
                        $(".option").hide();
                    }
                });
                /*分类列表的*/
                $(document).ready(function(){
                    var sum=$(window).height();
                    var nav=$('header').height();
                    var num=sum-(nav*6);
                    $('#classify,#classify>ul').css("height",num);
                });
                
                //加载生活分类
    	    	$.get("category/getCategory.shtml",function(datas){
    	    		var tempCate = datas.data.category;
    	    		if(tempCate != null && tempCate.length > 0){
    	    			var temp = '<li class="cur">'+
    				                    '<a href="javascript:;" onclick="this.ctrl.chooseCate(this,\'all\',\'\')">'+
    					                   '全部' +
    					                '</a>'+
    					            '</li>';;
    	    			for(var i = 0;i < tempCate.length;i++){
    	    				temp += '<li>'+
    				                    '<a href="javascript:;" onclick="this.ctrl.loadIndust(this,'+tempCate[i].id+')">'+
    				                        tempCate[i].name +
    				                    '</a>'+
    				                '</li>';
    	    			}
    	    			$("#categoryContent").append(temp);
    	    		}
    	    	});
    	    	var ctrl = this;
            	ctrl.getPosition();
            	setREG("document_scroll", ctrl._name, function(){
                    if($.getScrollBottom()<1 && ctrl.isHave){
	            		ctrl.loadData();
	            	}
                });
            },
            getPosition:function(){
            	var ctrl = this;
            	$.getPosition(function(x,y,cityname){
					if(x==0 || y==0){
						$("#position").text("暂时无法获取位置信息");
						$(".load_more").hide();
					}else{
						ctrl.longitude=x;
						ctrl.latitude=y;
						$.get("common/getLocation.shtml",{
							longitude:x,
							latitude:y,
						 },function(data){
							 $("#position").html(data.data.pos.substring(0,data.data.pos.indexOf(","))||"&nbsp;");
							 $(".load_more").show();
					   		 $("#warn").hide();
					   		 ctrl.cityName = data.data.city;
					   		 ctrl.loadData();
						 });
					}
            	});
            },
            loadData:function(){
            	var ctrl = this;
            	if(ctrl.loading != true){
            		ctrl.pageNum++;
            		ctrl.loading=true;
		           	$.post("shop/nearbyStore.shtml",{
  	           			 position:ctrl.longitude+","+ctrl.latitude,
  	           			 cityName:ctrl.cityName,
  	           			 isLocal:ctrl.isLocal,
  	           			 categoryId:ctrl.categoryId,//生活分类
  	           			 industryCategoryId:ctrl.industryCategoryId,//行业分类
  	           			 cityId:Config.area.id,
  	           			 //areaId:$("#areaId").val(),
  	           			 orders:ctrl.orders,
  	           			 keyword:$("#keyword").val(),
  	           			 hasActivity:ctrl.isHaveActivity,
  	           			 pageNum:ctrl.pageNum,
  	           			 pageSize:ctrl.pageSize
  	           		 },function(data){
  	           			 setTimeout(function(){
  	           				 ctrl.loading=false;
  	           			 },1);
  	           			 var shopList = "";
  	           			 if(data.data && data.data.shopList){
  	           				 shopList = data.data.shopList;
  	           			 }
  	           			 ctrl.isLocal = data.data.local;
  	           			 if(ctrl.pageNum == 1 && (!shopList || shopList.length==0)){
  	           				 $(".warn").html(REND("include/empty",{icon:"&#xe605;",tip:"sorry,未找到附近的实体店哦~",price:"1",display:"block",emptyId:"",paddingbottom:"1"}));
  	           				 $(".load_more").hide();
  	           				 return false;
  	           			 }else{
  	           				 $(".warn").empty();
  	           			 }
  	           			 if(shopList.length < ctrl.pageSize){
  	           				 ctrl.isHave = false;
  	           				 $(".load_more").hide();
  	           				 $("#warn").show();
  	           			 }
  	           			 if(ctrl.pageNum > 1 && shopList.length < ctrl.pageSize){
  	           				 $("#warn").show();
  	           				 $(".load_more").hide();
  	           			 }
  	           			 $.each(shopList,function(i,o){
  	           				 var activityDiv = "";
  	           				 if(o.activitys){
  	           					 var temp = "";
  	           					 for(var i = 0;i<o.activitys.length;i++){
  	           						 temp += '<li  class="ellips1">';
  	           						 if(o.activitys[i].type == 0){
  	           							 temp += '<a href="#forwardingGifts/forwardingDetails?forwardingGiftsId='+o.activitys[i].id+'&shopId='+o.activitys[i].shopId+'">'+o.activitys[i].title+'</a>';
  	           						 }
  	           						 if(o.activitys[i].type == 1 && o.activitys[i].activityType == 'sales'){
  	           							 temp += '<a href="#cityNews/promotionDetails?activityId='+o.activitys[i].id+'">'+o.activitys[i].title+'</a>';
  	           						 }else if(o.activitys[i].type == 1 && o.activitys[i].activityType == 'shop'){
  	           							 temp += '<a href="#cityNews/activityDetails?activityId='+o.activitys[i].id+'">'+o.activitys[i].title+'</a>';
  	           						 }
  	           						 temp += '</li>';
  	           					 }
  	           					 if(temp != ""){
  	           						 activityDiv = '<div class="victy"><button>近期活动</button><ul>'+temp+'</ul></div>'; 
  	           					 }
  	           				 }
  	           				 var temp = "";
  	           				 if(ctrl.isLocal){
  	           					 temp = o._district;
  	           				 }else{
  	           					 temp = o._distance+"m";
  	           				 }
  	           				 $('\
  	           						 <li class="bg-white">\
	   	           						 <a href="#shop/shops?shopId='+o.shopId+'">\
	   	           						 	<div class="pic">\
	   	           						 		<img src="'+Config.imgPre+o.shopImage+'"/>\
	   	           						 	</div>\
	   	           						 	<div class="txt">\
	   	           						 		<h5 class="ellips1">'+o._name+'</h5>\
	   	           						 		<img style="height: .4rem;"src="'+Config.imgPre+o.shopRankIcon+'"/>\
	   	           						 		<p class="m-top20 clearfix">'+o.industryName+'<cite class="color-red kdl-right">'+temp+'</cite></p>\
	   	           						 	</div>\
	   	           						 </a>\
	   	           						 '+activityDiv+'\
  	           						 </li>\
  	           				 ').appendTo($(".list>ul"));
  	           				 
  	           			 });
  	           			 $("body").css({"height":"auto","overflow":"scroll"});
  	           		 })
            	}
            },
            //重新记载数据
            reloadData : function(){
            	this.pageNum = 0;
            	this.isHave = true;
            	$(".list>ul").empty();
            	this.loadData();
            },
            //加载生活分类对应的行业分类
    	    loadIndust : function(item,cateId){
    	    	$(item).closest("li").addClass("cur").siblings("li").removeClass("cur");
    	    	$.get("category/getIndustryCategory.shtml",{
    	    		categoryId : cateId
    	    	},function(datas){
    	    		$("#industContent").empty();
    	    		var tempIndust = datas.data.industryCategory;
    	    		if(tempIndust != null && tempIndust.length > 0){
    	    			var temp = '<li>'+
    	    							'<a href="javascript:;" onclick="this.ctrl.chooseCate(this,\'cate\','+cateId+')">'+
    					                    '全部'+
    					                '</a>'+
    					            '</li>';
    	    			for(var i = 0;i < tempIndust.length;i++){
    	    				temp += '<li>'+
    				                    '<a href="javascript:;" onclick="this.ctrl.chooseCate(this,\'indust\','+tempIndust[i].id+')">'+
    				                    	tempIndust[i].name +
    				                    '</a>'+
    				                '</li>';
    	    			}
    	    			$("#industContent").append(temp);
    	    		}
    	    	});
    	    },
    	    //选择分类搜索
    	    chooseCate : function(item,type,typeId){
    	    	if(type == "all"){
    	    		$("#industContent").empty();
    	    	}
        		$(item).closest("li").addClass("cur").siblings("li").removeClass("cur");
    	    	this.pageNum = 0;
    	    	if(type == "cate"){
    	    		this.categoryId = typeId;
    	    		this.industryCategoryId = null;
    	    	}else if(type == "indust"){
    	    		this.categoryId = null;
    	    		this.industryCategoryId = typeId;
    	    	}else{
    	    		this.categoryId = null;
    	    		this.industryCategoryId = null;
    	    	}
    	    	$(".cateBox").hide();
    	    	$(".theme-popover-mask").hide();
    	    	$("#cateName").text($(item).text());
    	    	this.reloadData();
    	    },
    	    //排序
    	    toSearchByOrder : function(item,orderType){
    	    	$(item).closest("li").addClass("cur").siblings("li").removeClass("cur");
        		$("#ordersName").html($(item).find("cite").html());
    	    	this.pageNum = 0;
    	    	this.orders = orderType;
    	    	this.reloadData();
    	    	$(".Sort").hide();
    	    	$(".theme-popover-mask").hide(); 
    	    },
    	    //选择近期的活动
    	    switchActiviy : function(item){
    	    	if(item.checked){
    	    		this.isHaveActivity = true;
    	    	}else{
    	    		this.isHaveActivity = false;
    	    	}
    	    	$("#filtrate").hide();
    	    	$(".theme-popover-mask").hide();
    	    	this.reloadData();
    	    },
    	    monitor:function(){
            	if(event.keyCode == 13){
            		this.reloadData();
            	}
            },
    	    goDitu : function(){
    	    	GO('shop/nearbyStorePosition',{isLocal:this.isLocal,categoryId:this.categoryId,industryCategoryId:this.industryCategoryId,orders:this.orders,hasActivity:this.isHaveActivity,keyword:$("#keyword").val()})
    	    }
        },
        /*附近实体店位置*/
        "shop/nearbyStorePosition": {
            _title: "附近实体店位置",
            _links:{
	            "http://cache.amap.com/lbs/static/main1119.css":"css",
	            "http://cache.amap.com/lbs/static/es5.min.js":"js",
	            "http://webapi.amap.com/maps?v=1.3&key=e53e463d097f2a084e06b07441bc7048":"js",
	            "./css/CloudDataSearchRender.css":"css",
	        },
            _footer: false,
            pageNum:1,
            pageSize:10,
            isHave:true,
            pageHeight:null,
            map:null,
            index:0,
            _load: function () {
            	var ctrl = this;
            	ctrl.loadData();
            	var viewHeight=$(window).height()-$(".gexian").outerHeight()-300;
            	$("#warn").css({"height":viewHeight/2,"margin-bottom":viewHeight/2});
            	setREG("document_scroll", ctrl._name, function(){
                    if($.getScrollBottom()<3 && ctrl.isHave){
                    	ctrl.pageNum++;
	            		ctrl.loadData();
	            	}
					if(ctrl.pageHeight!=null){
						var page=parseInt($(window).scrollTop()/ctrl.pageHeight);
						if(page!=ctrl.curList){
							ctrl.curList=page;
							ctrl.cloudSearch_CallBack(ctrl.shopLists[page]);
						}
					}
                });
            	$("#dituContent").height(300);
            },
            curList : 0,
            shopLists : [],
            addmarker : function (i, shop) {
            	var ctrl=this;
		    	var location = shop._location;
    			var arr = location.split(",");
    			var lngX = parseFloat(arr[0]);
    			var latY = parseFloat(arr[1]);
		        var markerOption = {
		            map: this.map,
		            content:'<div class="amap_lib_cloudDataSearch_poi">'+(ctrl.pageSize*ctrl.curList+i+1)+'</div>',
		            position: [lngX, latY]
		        };
		        var mar = new AMap.Marker(markerOption);
		    },
		    //回调函数
		    cloudSearch_CallBack : function (data) {
		    	var ctrl=this;
		    	this.map.clearMap();
		        for (var i = 0; i < data.length; i++) {
		            this.addmarker(i, data[i]);
		        }
		        this.map.setFitView();
		        function evnt(e){
		        	$(".amap_lib_cloudDataSearch_poi").removeClass("selected");
		        	var num=$(this).addClass("selected").text();
		        	$(window).scrollTop($(".dituList>ul>li").outerHeight(true)*(num-1));
		        }
		        this._dom.on("click",".amap_lib_cloudDataSearch_poi",evnt);
		        this._dom.on("touchend",".amap_lib_cloudDataSearch_poi",evnt);
		    },
            loadData:function(){
            	var ctrl = this;
        		var windowsArr = [];
    		    var marker = [];
    		    var map;
    		    $.getMaxWrap().loadingWrap();
        		(function initMap(){
        			if(AMap.Map==null){
            			setTimeout(initMap,200);
            			return;
            		}
        			$.getMaxWrap().loadingWrapCancel();
	    		    //基本地图加载
	    		    map = ctrl.map = new AMap.Map("dituContent");
	    		    map.plugin(["AMap.ToolBar"],function(){
	    			    //加载工具条
	    			    var tool = new AMap.ToolBar();
	    			    map.addControl(tool);   
	    			});
	    			//比例尺
	    		    map.plugin(['AMap.Scale'],function(){
	    		   		var scale = new AMap.Scale();
	    		   		map.addControl(scale);
	    		   	});
	    		    cloudSearch();
        		})();
    		    //根据数据id查询数据详情
    		    function cloudSearch() {
    		        map.clearMap();
    		        AMap.service(["AMap.CloudDataSearch"], function() {
	    		       	 $.getPosition(function(x,y,cityname){
	    		       	 	 $(".load_more").show();
	    		       	 	 $("#warn").hide();
	    		       		 $.post("shop/nearbyStore.shtml",{
	    		       			 position:x+","+y,
	    		       			 cityName:cityname,
	    		       			 cityId:Config.area.id,
	    		       			 isLocal:_param.isLocal,
	    		       			 categoryId:_param.categoryId,//生活分类
	    		       			 industryCategoryId:_param.industryCategoryId,//行业分类
	    		       			 //areaId:$("#areaId").val(),
	    		       			 orders:_param.orders,
	    		       			 hasActivity:_param.hasActivity,
	    		       			 keyword:_param.keyword,
	    		       			 pageNum:ctrl.pageNum,
	    		       			 pageSize:ctrl.pageSize
	    		       		 },function(data){
	    		       			 ctrl.isLocal = data.data.local;
	    		       			 var shopList = "";
	    		       			 if(data.data && data.data.shopList){
	    		       				 shopList = data.data.shopList;
	    		       			 }
	    		       			 if(ctrl.pageNum == 1 && (!shopList || shopList.length==0)){
	    		       				 $(".warn").html(REND("include/empty",{icon:"&#xe605;",tip:"sorry,未找到附近的实体店哦~",price:"1",display:"block",emptyId:"",paddingbottom:"1"}));
	    		       				 $(".load_more").hide();
	    		       				 return false;
	    		       			 }
	    		       			 if(shopList.length < ctrl.pageSize){
	    		       				 ctrl.isHave = false;
	    		       				$(".load_more").hide();
	    		       				$("#warn").show();
	    		       			 }
	    		       			if(ctrl.pageNum > 1 && shopList.length < ctrl.pageSize){
		                 			$("#warn").show();
		                 			$(".load_more").hide();
		                 		}
	    		       			 $.each(shopList,function(i,o){
	    		       				var location = o._location;
	    	    	    			var arr = location.split(",");
	    	    	    			var lngX = parseFloat(arr[0]);
	    	    	    			var latY = parseFloat(arr[1]);
	    		       				 $('\
	    		       					<li class="bg-white">\
	    		       						 <a href="javascript:;">\
		    		       						 <div class="pic" id="div_'+o.shopId+'">\
		    		       						 	<img src="'+Config.imgPre+o.shopImage+'"/>\
		    		       						 </div>\
		    		       						 <div class="txt">\
			    		       						 <h5 class="ellips1">'+(ctrl.index+1)+'.'+o._name+'</h5>\
			    		       						 <img style="height: .4rem;"src="'+Config.imgPre+o.shopRankIcon+'"/>\
			    		       						 <p class="m-top20 clearfix">'+o.industryName+'<cite class="color-red kdl-right">'+o._distance+'m</cite></p>\
		    		       						 </div>\
	    		       						 </a>\
	    		       						 <div class="victy">\
	    		       						 <ul class="clearfix">\
		    		       						 <li>\
			    		       						 <a href="http://m.amap.com/navigation/index/daddr='+lngX+'%2C'+latY+'%2C'+encodeURI(o._name)+'">\
			    		       						 去这里<i class="iconfont">&#xe68a;</i>\
			    		       						 </a>\
		    		       						 </li>\
		    		       						 <li>\
			    		       						 <!--把a标签里面的电话号码赋值一下-->\
			    		       						 <a href="tel:'+o.shopPhone+'" class="color-gray3">\
			    		       						 电话<i class="iconfont color-orange">&#xe61b;</i>\
			    		       						 </a>\
		    		       						 </li>\
		    		       						 <li>\
			    		       						 <a href="#shop/shops?shopId='+o.shopId+'" class="color-gray3">\
			    		       						 进店逛逛<i class="iconfont">&#xe608;</i>\
			    		       						 </a>\
		    		       						 </li>\
	    		       						 </ul>\
	    		       						 </div>\
	    		       					</li>\
	    		       				 ').appendTo($(".list>ul"));
	    		       				$("body").css({"height":"auto","overflow":"scroll"});
	    		       				ctrl.pageHeight=$(".dituList>ul>li").outerHeight()*10;
	    		       				ctrl.index ++;
	    		       			 });
	    		       			ctrl.shopLists.push(shopList);
	    		       			ctrl.cloudSearch_CallBack(shopList, map);
	    		       		 })
	    		       		if(x!=0 && y!=0){
	    		       			//将当前位置添加到地图中
	    		       			var markerOption = {
	    		       					map: map,
	    		       					icon: "http://webapi.amap.com/theme/v1.3/markers/n/loc.png",
	    		       					position: [x, y]
	    		       			};
	    		       			var mar = new AMap.Marker(markerOption);
	    		       			marker.push([x, y]);
	    		       		}
	    		       	 })
    		        });
    		    }
            }
        },
        /*店铺评价*/
	    "shop/allEvaluate": {
	    	_title: "",
	    	_footer: false,
	    	pageNum : 1,
	        pageSize : 5,
	        shopId : null,
	        continueLoad : true,
	    	_load: function () {
	    		var ctrl = this;
	    		this.shopId = this._param.shopId;
	    		this.loadData(this.pageNum,this.pageSize);
	    		setREG("document_scroll", ctrl._name, function(){
	    			ctrl.scrollLoad();
	            });
	    	},
	    	loadData : function(pageNum,pageSize){
	        	var ctrl =this;
	        	$.ajax({
    				url:"shop/shopEvaluate.shtml",
    				data:{"pageNum":pageNum,"pageSize":pageSize,"shopId":ctrl.shopId},
    				async:false,
    				dataType:"json",
    				type:"GET",
    				success:function(data){
    					//console.log("第"+pageNum+"页");
    					if(data.status==0){
    						alert(data.errorMsg);
    						if(data.errorCode==1000){
    							DO("passport/login");
    						}else{
    							DO("error", data);
    						}
    						return false;
    					}
    					var html="";
    					if(data.data.evaluateItems.length==0){
    						ctrl.continueLoad = false;
    						$("html,body").loadingWrapCancel();
    						if(pageNum == 1){
    							html+="<div class='reminder'>"
    								+ "		<i class='iconfont color-gray9'>&#xe663;</i>"
    								+ "		<h5 class='m-top40 color-gray9'>您还没有相关评价哦~~</h5>"
    								+ "</div>"
    						}
    						$("#evaluateList").append(html);
    						return false;
    					}
    					if(data.data.evaluateItems.length<ctrl.pageSize){
    						ctrl.continueLoad = false;
    					}
					    $.each(data.data.evaluateItems, function (oIndex,eItem){
					    	var score = eItem.evaluateScore;
					    	html+="<div class='list'>"
					            +    "<h5>"
					            +        "<em>"
					            +        "<img width='100%' src='"+Config.imgPre+eItem.evaluateIcon+"' />"
					            +        "</em>"
					            +        	eItem.evaluateUsername
					            +        "<div class='starbg kdl-right'>"
					            +        	 "<span width='70'></span>"
					            +            "<div class='bgone'>"
					            +                "<i class='iconfont'>&#xe642;</i>"
					            +                "<i class='iconfont'>&#xe642;</i>"
					            +                "<i class='iconfont'>&#xe642;</i>"
					            +                "<i class='iconfont'>&#xe642;</i>"
					            +                "<i class='iconfont'>&#xe642;</i>"
					            +            "</div>"
					            +            "<div class='bgtwo'>";
					            for (var i = 0; i < score; i++) {
					            	html+="<i class='iconfont color-orange'>&#xe642;</i>";
					            };
				            html+=            "</div>"
					            +        "</div>"
					            +    "</h5>"
					            +    "<p class='m-top20'>"+eItem.evaluateContent+"</p>"
					            +    "<div class='pic clearfix m-top20'>";
					    	if(eItem.evaluateImageSrcs!=null && eItem.evaluateImageSrcs.length>0){
					    		html+="<span>";
					    		$.each(eItem.evaluateImageSrcs, function (iIndex, image) {
					    			html+="<img src='"+Config.imgPre+image+"'/>";
					    		})
					    		html+="</span>";
					    	}else{
					    		html+="";
					    	}
						    	
					    	html+=   "</div>"
					            +    "<div class='list-info m-top30 color-gray9 clearfix'>"
					            +        "<span class='kdl-left'>"+eItem.evaluateDate+"</span>"
					            +        "<span class='kdl-right'>"+eItem.evaluateSkuValue+"</span>"
					            +    "</div>"
					            +"</div>"
			            });
					    $("#evaluateList").append(html);
					    $("html,body").loadingWrapCancel();
					    $(".evaluate-con .list>div.pic>span>img").initImgTouch();
    				},
    				error:function(data){
    					alert("亲，系统错误请您稍后再试！");
    				}
    			});
	        },
	        //滚动条
	        scrollLoad : function(){
	        	 if($.getScrollBottom()<3){
	           		 if(this.continueLoad){
	           			 this.pageNum = this.pageNum+1;
	           			 this.loadData(this.pageNum,this.pageSize);
	           		 }
	        	 }
	        }, 
	        _pass:function(){
	        	$(document).unbind("scroll");
	        }
	    },
	    
	    /** 创建店铺信息 */
	    "shop/shopCreate":{
	    	_title:"店铺信息",
	    	_footer:false,
	    	_relateCtrl : ["business/busCreate","business/shopImgCreate","business/industrySelection"],
	    	_links:{
	    		"js/extra.js":"js",
    			"js/loadArea.js":"js"
	    	},
	    	_load:function(){
	    		if(this._param.flag == "update"){ //重新认证店铺信息
	    			$.get(Config.basePath+"/shop/personalShop.shtml",{
	    				type : "business"
	    			},function(datas){
	    				var shop = datas.data.shop;
	    				var shopImgs = datas.data.shopImgs;
	    				if(shop == null)return;
	    				console.log(datas.data);
	    				$(".iconUpload").css("background-image","url("+Config.imgPre+shop.avatar+")"); //店铺头像
	    				$("input[name='avatar']").val(shop.avatar);
	    				$("input[name='shopName']").val(shop.shopName);
	    				$("input[name='shopSubtitle']").val(shop.shopSubtitle);
	    				$("input[name='shopImage']").val(shop.shopImage);//店铺门脸照
	    				//店铺实拍
	    				if(shopImgs != null && shopImgs.length > 0){
	    					for(var i = 0,j = 1;j < shopImgs.length && j < 4;i++,j++){
	    						$("input[name='photoInner["+i+"]']").val(shopImgs[j].src);
	    					}
	    				}
	    				$("input[name='shopContacts']").val(shop.shopContacts);
	    				$("input[name='shopPhone']").val(shop.shopPhone);
	    				$("input[name='industryCategoryId']").val(shop.industryCategoryId);
	    				$("input[name='industryCategoryName']").val(shop.industryCategory.name);
	    				$("input[name='startTime']").val(shop.officeTime.split("~")[0]);
	    				$("input[name='endTime']").val(shop.officeTime.split("~")[1]);
	    				loadArea.showArea(shop.area); //初始化地区
	    				$("textarea[name='shopAddress']").val(shop.shopAddress);
	    			});
	    		}else{
	    			loadArea.showArea();
	    			$("#licenseImageUrl").val(this._param.licenseImageUrl); //初始化商家证件照片
	    		}
	    	},
	    	_events:{
	    		".iconUpload":function(){
	    			var $this=$(this);
	    			$.clipImage({
	    				width:"1rem",
	    				height:"1rem",
            			call:function(url){
            				$this.empty().css("background-image","url("+Config.imgPre+url+")");
            				$this.siblings("input").val(url);
            			}
            		});
	    		}
	    	},
	    	//进入店铺实拍
	    	shopImgCreate:function(){
	    		var $dom=this._dom;
	    		console.log($dom.find(".photoFace").val());
	    		console.log($dom.find(".photoInner").map(function(){return this.value;}));
	    		DO("business/shopImgCreate",{
	    			photoFace:$dom.find(".photoFace").val(),
	    			photoInner:$dom.find(".photoInner").map(function(){return this.value;})
	    		},".sub_container");
	    	},
	    	_show:function(){
	    		var param=this._param;
	    		var $dom=this._dom;
	    		if(param.photoFace)$dom.find(".photoFace").val(param.photoFace);
	    		if(param.photoInner){
	    			//给店铺实拍赋值
	    			for(var i=0;i<4;i++){
    					$dom.find("[name='photoInner["+i+"]']").val(param.photoInner[i]||"");
	    			}
	    			//修改店铺实拍标识
	    			$("#updateImgSign").val("true");
	    		}
	    		if(window.selectIndustryCategoryId){
	    			$("#industryCategoryId").val(selectIndustryCategoryId);
	    		}
	    		if(window.selectIndustryCategoryName){
	    			$("#industryCategoryName").val(selectIndustryCategoryName);
	    		}
	    	},
	    	//提交
	    	submit:function(){
	    		var flag="";
	    		var $dom=this._dom;
	    		//验证必填信息
	    		$dom.find('[required="true"]').each(function(){
	    			if(this.value=="" || this.value==null){
	    				flag=$(this).attr("prompt");
	    				return false;
	    			}
	    		});
	    		if(flag){
	    			alert(flag);
	    			return;
	    		}
	    		if(!/^1[3|4|5|7|8]\d{9}$/.test($("input[name='shopPhone']").val()) && !/^0\d{2,3}-?\d{7,8}$/.test($("input[name='shopPhone']").val())){
	    			alert("店铺联系电话有误");
	    			return;
	    		}
    			$dom.find("form").submit();
	    	},
	    	//提交返回
	    	submitCall:function(datas){
	    		if(datas.status == 0){
	    			alert(datas.errorMsg);
	    		}else if(datas.status == 1){
	    			GO("business/merchant");
	    		}
	    	}
	    }
	});
})();