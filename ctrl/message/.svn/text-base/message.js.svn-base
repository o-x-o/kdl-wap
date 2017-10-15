(function() {
	/* 公用变量和方法 */

	FORMAT({
		/* 消息中心 */
		"message/messageCenter" : {
			_title : "消息中心",
			_footer : false,
			_load : function() {
			}
		},

		/** 我的消息 */
		"message/messageLists" : {
			_title : "我的消息",
			_pass : function(){
	        	RongIMClient.getInstance().logout();
	        },
			_datas: {
	        	data:GET("message/messageLists.shtml",{
	        		userType:PARAM("userType",null),
	        		actTime:function(){return _user?localStorage.getItem("actRedpoint_"+_user.id):null;},
	        		infoTime:function(){return _user?localStorage.getItem("infoRedpoint_"+_user.id):null;}
	        	},function(datas){
	        		return datas;
	        	})
	        },
			_footer : false,
			_links : {
//				"plugin/RongIMLib-2.1.1.min.js" : "js"
				"http://cdn.ronghub.com/RongIMLib-2.2.1.min.js":"js",
			},
			_load : function() {
				if(_datas.data.allIsRead){
					localStorage.setItem("allRedpoint_"+_user.id, true);
				}else{
					localStorage.setItem("allRedpoint_"+_user.id, false);
				}
				try{
					// 初始化
					// dataAccessProvider:自定义本地存储方案的实例，不传默认为内存存储，自定义需要实现WebSQLDataProvider所有的方法，此参数必须是传入实例后的对象。
					//RongIMClient.init(_datas.data.rongYunKey);
//					RongIMLib.RongIMClient.init(_datas.data.rongYunKey,new RongIMLib.WebSQLDataProvider());
					RongIMLib.RongIMClient.init(_datas.data.rongYunKey);
	
					//用户在融云唯一标识
					var token = _datas.data.currentRyToken;
					
					//连接融云服务器
					RongIMClient.connect(token,{
						onSuccess : function(userId) {
//							console.log("Login successfully."+ userId);
						},
						onTokenIncorrect : function() { //token无效，重置token
//							console.log('token无效');
							$.ajax({
				            	url:Config.basePath + "/message/resetRyToken.shtml",
				            	async:false,
				            	tpye : "GET",
				            	dataType : "json",
				            	data : {
				            		userId : _datas.data.userId
				            	},
				            	success : function(datas){
				            		if(datas.status == "1"){
				            			location.reload();
				            		}
				            	}
				            });
						},
						onError : function(errorCode) {
							var info = '';
							switch (errorCode) {
							case RongIMLib.ErrorCode.TIMEOUT:
								info = '超时';
								break;
							case RongIMLib.ErrorCode.UNKNOWN_ERROR:
								info = '未知错误';
								break;
							case RongIMLib.ErrorCode.UNACCEPTABLE_PaROTOCOL_VERSION:
								info = '不可接受的协议版本';
								break;
							case RongIMLib.ErrorCode.IDENTIFIER_REJECTED:
								info = 'appkey不正确';
								break;
							case RongIMLib.ErrorCode.SERVER_UNAVAILABLE:
								info = '服务器不可用';
								break;
							}
//							console.log(errorCode);
//							console.log(info);
						}
					});
					
					// 设置连接监听状态 （ status 标识当前连接状态）
					// 连接状态监听器
					RongIMClient.setConnectionStatusListener({
						onChanged : function(status) {
							switch (status) {
							// 链接成功
							case RongIMLib.ConnectionStatus.CONNECTED:
//								console.log('链接成功');
								//查看当前未读消息数
								RongIMClient.getInstance().hasRemoteUnreadMessages(token,{
								    onSuccess:function(hasMessage){
								        if(hasMessage){
//								        	console.log("有未读消息");
								        }else{
//								        	console.log("没有未读消息");
								        }
								    },onError:function(err){
								        // 错误处理...
								    }
								});
								
								//获取当前用户的消息列表
								RongIMClient.getInstance().getConversationList({
									onSuccess: function(list) {
//										console.log(list);
										if(list != null && list.length > 0){
											for(var i = 0;i < list.length; i++){
												var message = list[i];
												$.ajax({
									            	url:Config.basePath + "/message/getInfoByTargetId.shtml",
									            	async:false,
									            	tpye : "GET",
									            	dataType : "json",
									            	data : {
									            		targetId:message.targetId
									            	},
									            	success : function(datas){
//									            		console.log(message);
									            		var tempContent = message.latestMessage.content.content;
									            		if(message.latestMessage.content.messageName == "ImageMessage"){
									            			tempContent = '[图片]';
									            		}else if(message.latestMessage.content.user && message.latestMessage.content.user.goodsInfo != null){
									            			tempContent = message.latestMessage.content.user.goodsInfo;
									            		}
														var temp = "";
														temp += '<li senderId="'+message.targetId+'" onclick="this.ctrl.toChitchat(\''+_datas.data.userType+'\','+message.targetId+','+datas.data.targetShopId+')">'+
														            '<a href="javascript:;">'+
														            	'<cite class="missCount" '+(message.unreadMessageCount>0?"":"style=\"display:none\"")+'>'+message.unreadMessageCount+'</cite>'+
														                '<span>'+
														                    '<img src="'+ Config.imgPre + datas.data.targetIcon +'"/>'+
														                '</span>'+
														                '<h5 class="ellips1">'+ 
														                	//当前进入消息列表的用户身份是商家,看到的聊天对象名称都为对象的用户名，否则当前进入消息列表的用户身份是会员，看到的聊天对象的名称都为对象的店铺名称，若不存在店铺则显示对象用户名
														                	(_datas.data.userType == "business"?datas.data.targetName:datas.data.targetShopName) +
														                	'<span sendTime>'+
														                		$.Date(message.sentTime).format("yyyy-MM-dd")+
														                	'</span>'+
														                '</h5>'+
														                '<p class="ellips1" sendContent>'+tempContent+'</p>'+
														            '</a>'+
														        '</li>';
														$("#messageList").append(temp);
														$("#senderId").val($("#senderId").val() + "," + message.targetId);
									            	}
									            });
											}
										}
								    },
								    onError: function(error) {
								    	// do something...
								    }
							    },null);
								
								break;
							// 正在链接
							case RongIMLib.ConnectionStatus.CONNECTING:
//								console.log('正在链接');
								break;
							// 重新链接
							case RongIMLib.ConnectionStatus.DISCONNECTED:
//								console.log('断开连接');
								break;
							// 其他设备登陆
							case RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:
								alert("当前账号已在其它设备登录,是否重新登录",true,function(flag){
									if(flag){
										location.reload();
									}
								});
								break;
							// 网络不可用
							case RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
//								console.log('网络不可用');
								location.reload();
								break;
							}
						}
					});
	
					// 消息监听器
					RongIMClient.setOnReceiveMessageListener({
						// 接收到的消息
						onReceived : function(message) {
//							console.log(message);
							var senderUserId = message.senderUserId;
							
							//查看当前未读消息数
							RongIMClient.getInstance().hasRemoteUnreadMessages(token,{
							    onSuccess:function(hasMessage){
//							       console.log(hasMessage );
							    },onError:function(err){
							        // 错误处理...
							    }
							});
								
							var tempContent = "";
							// 判断消息类型
							switch (message.messageType) {
							case RongIMClient.MessageType.TextMessage:
								// 接收的文字消息内容
								tempContent = message.content.content;
								if(message.content.user && message.content.user.goodsInfo != null){
			            			tempContent = message.content.user.goodsInfo;
			            		}
								break;
							case RongIMClient.MessageType.VoiceMessage:
								// 对声音进行预加载
								// message.content.content 格式为 AMR 格式的
								// base64 码
								RongIMLib.RongIMVoice.preLoaded(message.content.content);
								break;
							case RongIMClient.MessageType.ImageMessage:
								// 图片消息
								tempContent = "[图片]";
								break;
							case RongIMClient.MessageType.DiscussionNotificationMessage:
								// do something...
								break;
							case RongIMClient.MessageType.LocationMessage:
								// do something...
								break;
							case RongIMClient.MessageType.RichContentMessage:
								// do something...
								break;
							case RongIMClient.MessageType.DiscussionNotificationMessage:
								// do something...
								break;
							case RongIMClient.MessageType.InformationNotificationMessage:
								// do something...
								break;
							case RongIMClient.MessageType.ContactNotificationMessage:
								// do something...
								break;
							case RongIMClient.MessageType.ProfileNotificationMessage:
								// do something...
								break;
							case RongIMClient.MessageType.CommandNotificationMessage:
								// do something...
								break;
							case RongIMClient.MessageType.CommandMessage:
								// do something...
								break;
							case RongIMClient.MessageType.UnknownMessage:
								// do something...
								break;
							default:
								// 自定义消息
								// do something...
							}
							//将监听到的消息显示到聊天框中
							var senderId = $("#senderId").val();
							if(senderId != null && senderId != "" && senderId.split(",").indexOf(senderUserId) > -1){
								//当前消息列表中存在当前发送消息用户的入口
								$("li[senderId='"+senderUserId+"']").find("span[sendTime]").html($.Date(message.sentTime).format("yyyy-MM-dd hh:mm:ss")); //改变最后一条未读消息时间
								$("li[senderId='"+senderUserId+"']").find("p[sendContent]").html(tempContent); //改变最后一条未读消息
								$("li[senderId='"+senderUserId+"']").find(".missCount").html(+$("li[senderId='"+senderUserId+"']").find(".missCount").html()+1); //改变未读消息数量
								$("li[senderId='"+senderUserId+"']").find(".missCount").show();//显示未读消息数
							}else{
								//当前消息列表中没有当前发送消息用户的入口
								$.ajax({
					            	url:Config.basePath + "/message/getInfoByTargetId.shtml",
					            	async:false,
					            	tpye : "GET",
					            	dataType : "json",
					            	data : {
					            		targetId:message.targetId
					            	},
					            	success : function(datas){
										var temp = "";
										temp += '<li senderId="'+message.targetId+'" onclick="this.ctrl.toChitchat(\''+_datas.data.userType+'\','+message.targetId+','+ datas.data.targetShopId+')">'+
										            '<a href="javascript:;">'+
										            	'<cite class="missCount">1</cite>'+
										                '<span>'+
										                    '<img src="'+ Config.imgPre + datas.data.targetIcon +'"/>'+
										                '</span>'+
										                '<h5 class="ellips1">'+ 
										                	//当前进入消息列表的用户身份是商家,看到的聊天对象名称都为对象的用户名，否则当前进入消息列表的用户身份是会员，看到的聊天对象的名称都为对象的店铺名称，若不存在店铺则显示对象用户名
										                	(_datas.data.userType == "business"?datas.data.targetName:datas.data.targetShopName) +
										                	'<span sendTime>'+
										                		$.Date(message.sentTime).format("yyyy-MM-dd")+
										                	'</span>'+
										                '</h5>'+
										                '<p class="ellips1" sendContent>'+tempContent+'</p>'+
										            '</a>'+
										        '</li>';
										$("#messageList").prepend(temp);
										$("#senderId").val($("#senderId").val() + "," + senderUserId);
				            		}
				            	});
							}
						}
					});
					
				}catch(e){
//					console.error(e);
				}
			},
			//进入聊天页面 userType当前用户身份
			toChitchat : function(userType,targetId,shopId){
				/*RongIMClient.getInstance().removeConversation(RongIMLib.ConversationType.PRIVATE,targetId+"",{
				    onSuccess:function(bool){
				       // 删除会话成功。
				    },
				    onError:function(error){
				       // error => 删除会话的错误码
				    }
				});*/
				//清空未读消息数
				RongIMClient.getInstance().clearUnreadCount(RongIMLib.ConversationType.PRIVATE,targetId,{
				    onSuccess:function(){
				        // 清除未读消息成功。
				    },
				    onError:function(error){
				    }
				});
				if(userType == "member" && shopId != null){
					GO("message/chitchat",{shopId:shopId,targetId:targetId});
				}else{
					GO("message/chitchat",{targetId:targetId});
				}
			}
		},

		
		/** 用户对话 */
		"message/chitchat" : {
			_title : "用户对话",
			_links : {
//				"plugin/RongIMLib-2.1.1.min.js" : "js"
				"http://cdn.ronghub.com/RongIMLib-2.2.1.min.js":"js",
				"js/extra.js" : "js"
			},
			lastMessageTime : null,
			_footer : false,
			_datas: {
	        	data:GET("message/toChitchat.shtml",{
	        		targetId:PARAM("targetId",null), //聊天对象的userId
	        		goodsId:PARAM("goodsId",null), //商品Id（从商品详情页进入）
	        		shopId:PARAM("shopId",null), //聊天对象的shopId
	        		specialtyContentId : PARAM("specialtyContentId",null) //展位内容Id（从展位商品详情进入）
	        	},function(datas){
	        		return datas;
	        	})
	        },
	        _pass : function(){
	        	RongIMClient.getInstance().logout();
	        },
			_load : function() {
				var ctrl = this;
				try{
					// 初始化
					// dataAccessProvider:自定义本地存储方案的实例，不传默认为内存存储，自定义需要实现WebSQLDataProvider所有的方法，此参数必须是传入实例后的对象。
					//RongIMClient.init(_datas.data.rongYunKey);
//					RongIMLib.RongIMClient.init(_datas.data.rongYunKey,new RongIMLib.WebSQLDataProvider());
					RongIMLib.RongIMClient.init(_datas.data.rongYunKey);
	
					//用户在融云唯一标识
					var token = _datas.data.currentRyToken;//当前用户token
					var paramTargetUserId = _datas.data.targetId+""; //聊天对象userId
					
					//连接融云服务器
					RongIMClient.connect(token,{
						onSuccess : function(userId) {
//							console.log("Login successfully."+ userId);
						},
						onTokenIncorrect : function() { //token无效，重置token
//							console.log('token无效');
							$.ajax({
				            	url:Config.basePath + "/message/resetRyToken.shtml",
				            	async:false,
				            	tpye : "GET",
				            	dataType : "json",
				            	data : {
				            		userId : ctrl._datas.data.userId
				            	},
				            	success : function(datas){
				            		if(datas.status == "1"){
				            			location.reload();
				            		}
				            	}
				            });
						},
						onError : function(errorCode) {
							var info = '';
							switch (errorCode) {
							case RongIMLib.ErrorCode.TIMEOUT:
								info = '超时';
								break;
							case RongIMLib.ErrorCode.UNKNOWN_ERROR:
								info = '未知错误';
								break;
							case RongIMLib.ErrorCode.UNACCEPTABLE_PaROTOCOL_VERSION:
								info = '不可接受的协议版本';
								break;
							case RongIMLib.ErrorCode.IDENTIFIER_REJECTED:
								info = 'appkey不正确';
								break;
							case RongIMLib.ErrorCode.SERVER_UNAVAILABLE:
								info = '服务器不可用';
								break;
							}
//							console.log(errorCode);
//							console.log(info);
						}
					});
					
					// 设置连接监听状态 （ status 标识当前连接状态）
					// 连接状态监听器
					RongIMClient.setConnectionStatusListener({
						onChanged : function(status) {
							switch (status) {
							// 链接成功
							case RongIMLib.ConnectionStatus.CONNECTED:
//								console.log('链接成功');
								//获取历史消息列表
								RongIMClient.getInstance().getRemoteHistoryMessages(RongIMLib.ConversationType.PRIVATE, paramTargetUserId, 0, 4, {
									onSuccess: function(list, hasMsg) {
										// hasMsg为boolean值，如果为true则表示还有剩余历史消息可拉取，为false的话表示没有剩余历史消息可供拉取。
										// list 为拉取到的历史消息列表
//										console.log(list);
										if($("#hasMore").attr("hasMore") == 1){
											for(var i=0;i<list.length;i++){
												var itemContent = list[i];
												var contentTemp = itemContent.content.content; //聊天内容
												if(contentTemp.indexOf("www.") > -1 && contentTemp.indexOf(".com") > -1){ //如果是连接加a标签
													var tempStart = contentTemp.substring(0,contentTemp.indexOf("www."));
													var tempEnd = contentTemp.substring(contentTemp.indexOf(".com")+4);
													var tempUrl = contentTemp.substring(contentTemp.indexOf("www."),contentTemp.indexOf(".com")+4);
													contentTemp = tempStart + "<a class='color-blue' target='_blank' href='http://"+tempUrl+"'>" + tempUrl + "</a>" + tempEnd;
												}
												if(itemContent.content.messageName == "ImageMessage"){
													contentTemp = '<img src="'+Config.imgPre + itemContent.content.imageUri +'" style="width:4.4rem;"/>';
												}
												var sentTime = $.Date(itemContent.sentTime).format("yyyy-MM-dd hh:mm:ss");
												if(ctrl.lastMessageTime != null && ($.Date(itemContent.sentTime) - ctrl.lastMessageTime) < 180000){ //小于最后一条消息3分钟则不显示时间
													sentTime = "";
												}
												ctrl.lastMessageTime = $.Date(itemContent.sentTime);//保存最后一条消息的时间
												var temp = "";
												if(itemContent.senderUserId == _datas.data.userId){
													//是自己发送的消息
													temp += '<p>'+ sentTime +'</p>'+
															'<div class="hd yous">'+
																'<div class="pic r">'+
																	'<img src="'+ Config.imgPre + _datas.data.userIcon +'"/>'+
																'</div>'+
																'<div class="txt">'+
																	'<em class="arrow-right"></em>'+
																	'<p>'+ contentTemp +'</p>'+
																'</div>'+
															'</div>';
												}else{
													//是聊天对象发送的消息
													temp += '<p>'+ sentTime +'</p>'+
															'<div class="hd">'+
																'<div class="pic l">'+
																	'<img src="'+ Config.imgPre + _datas.data.targetIcon +'"/>'+
																'</div>'+
																'<div class="txt">'+
																	'<em class="arrow-left"></em>'+
																	'<p>'+ contentTemp +'</p>'+
																'</div>'+
															'</div>';
												}
												$("#chatContent").append(temp);
											}
											if(_datas.data.goodsId != null){
												var goodsInfo = '<div class="commodity">\
																	<div class="pic">\
																		<img src="'+Config.imgPre + _datas.data.goodsImage+'"/>\
																	</div>\
																	<p class="ellips">'+_datas.data.goodsName+'</p>\
																	<span onclick="this.ctrl.sendGoodsInfo('+_datas.data.goodsId+','+_datas.data.shopId+','+_datas.data.specialtyContentId+',\''+_datas.data.goodsName+'\',\''+_datas.data.goodsImage+'\')">发送</span>\
																</div>';
												$("#chatContent").append(goodsInfo);
											}
										}
										//没有历史记录
										if(!hasMsg){
											$("#hasMore").html("-- 没有更多 --").attr("hasMore","0");
										}
										$("#chatContent img").loadCall(function(){
											$("body").scrollTop($("body").outerHeight(true)+$("footer").outerHeight(true));
										});
									},
									onError: function(error) {
										// APP未开启消息漫游或处理异常
										// throw new ERROR ......
//										console.log("网络异常！");
										location.reload();
									}
						        });
								
								break;
							// 正在链接
							case RongIMLib.ConnectionStatus.CONNECTING:
//								console.log('正在链接');
								break;
							// 重新链接
							case RongIMLib.ConnectionStatus.DISCONNECTED:
//								console.log('网络不可用');
								break;
							// 其他设备登陆
							case RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:
								alert("当前账号已在其它设备登录,是否重新登录",true,function(flag){
									if(flag){
										location.reload();
									}
								});
								break;
							// 网络不可用
							case RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
//								console.log('网络不可用');
								location.reload();
								break;
							}
						}
					});
	
					// 消息监听器
					RongIMClient.setOnReceiveMessageListener({
						// 接收到的消息
						onReceived : function(message) {
//							console.log("接收消息信息：");
//							console.log(message);
							//是否存在未读消息
							RongIMClient.getInstance().hasRemoteUnreadMessages(token,{
							    onSuccess:function(hasMessage){
							        if(hasMessage){
							        	//查看当前未读消息数
							        	RongIMClient.getInstance().getTotalUnreadCount({
							        		  onSuccess:function(count){
							        		      // count => 所有会话总未读数。
//							        			  console.log("hasMessage,true所有会话总未读数====" + count);
							        		  },
							        		  onError:function(error){
							        		      // error => 获取总未读数错误码。
							        		  }
							        		});
							        }else{
							        	//没有未读的消息
							        	RongIMClient.getInstance().getTotalUnreadCount({
							        		  onSuccess:function(count){
//							        			  console.log("hasMessage,false所有会话总未读数====" + count);
							        		  },
							        		  onError:function(error){
							        		      // error => 获取总未读数错误码。
							        		  }
							        		});
							        }
							    },onError:function(err){
							        // 错误处理...
							    }
							});
							
							//接收发送消息的用户是当前聊天用户，显示在当前聊天窗口
							if(message.senderUserId == paramTargetUserId){
								var contentTemp = ""; //消息内容
								// 判断消息类型
								switch (message.messageType) {
								case RongIMClient.MessageType.TextMessage:
									// 接收的文字消息内容
									contentTemp = message.content.content;
									if(contentTemp.indexOf("www.") > -1 && contentTemp.indexOf(".com") > -1){ //如果是连接加a标签
										var tempStart = contentTemp.substring(0,contentTemp.indexOf("www."));
										var tempEnd = contentTemp.substring(contentTemp.indexOf(".com")+4);
										var tempUrl = contentTemp.substring(contentTemp.indexOf("www."),contentTemp.indexOf(".com")+4);
										contentTemp = tempStart + "<a class='color-blue' target='_blank' href='http://"+tempUrl+"'>" + tempUrl + "</a>" + tempEnd;
									}
									break;
								case RongIMClient.MessageType.VoiceMessage:
									// 对声音进行预加载
									// message.content.content 格式为 AMR 格式的
									// base64 码
									RongIMLib.RongIMVoice
											.preLoaded(message.content.content);
									break;
								case RongIMClient.MessageType.ImageMessage:
									// 接收的是图片消息
									contentTemp = '<img src="'+Config.imgPre + message.content.imageUri +'" style="width:4.4rem;"/>';
									break;
								case RongIMClient.MessageType.DiscussionNotificationMessage:
									// do something...
									break;
								case RongIMClient.MessageType.LocationMessage:
									// do something...
									break;
								case RongIMClient.MessageType.RichContentMessage:
									// do something...
									break;
								case RongIMClient.MessageType.DiscussionNotificationMessage:
									// do something...
									break;
								case RongIMClient.MessageType.InformationNotificationMessage:
									// do something...
									break;
								case RongIMClient.MessageType.ContactNotificationMessage:
									// do something...
									break;
								case RongIMClient.MessageType.ProfileNotificationMessage:
									// do something...
									break;
								case RongIMClient.MessageType.CommandNotificationMessage:
									// do something...
									break;
								case RongIMClient.MessageType.CommandMessage:
									// do something...
									break;
								case RongIMClient.MessageType.UnknownMessage:
									// do something...
									break;
								default:
									// 自定义消息
									// do something...
								}
								var sentTime = $.Date(message.sentTime).format("yyyy-MM-dd hh:mm:ss");
								if(ctrl.lastMessageTime != null && ($.Date(message.sentTime) - ctrl.lastMessageTime) < 180000){ //小于最后一条消息3分钟则不显示时间
									sentTime = "";
								}
								ctrl.lastMessageTime = $.Date(message.sentTime);//保存最后一条消息的时间
								//把接收到的消息添加到消息框中
								var temp = '<p>'+ sentTime +'</p>'+
								        	'<div class="hd">'+
									            '<div class="pic l">'+
									                '<img src="'+Config.imgPre + _datas.data.targetIcon+'"/>'+
									            '</div>'+
									            '<div class="txt">'+
									                '<em class="arrow-left"></em>'+
									                '<p>'+contentTemp+'</p>'+
									            '</div>'+
									        '</div>';
								$("#chatContent").append(temp).find("img").loadCall(function(){
									$("body").scrollTop($("body").outerHeight(true)+$("footer").outerHeight(true));
								});
							}
						}
					});
					
					//触顶加载更多聊天记录
					setREG("document_scroll", ctrl._name, function(){
		            	if($("body").scrollTop() == 0 && $("#hasMore").attr("hasMore") == 1){
		            		//有更多聊天记录
							//获取历史消息列表
							RongIMClient.getInstance().getRemoteHistoryMessages(RongIMLib.ConversationType.PRIVATE, paramTargetUserId, null, 10, {
								onSuccess: function(list, hasMsg) {
									// hasMsg为boolean值，如果为true则表示还有剩余历史消息可拉取，为false的话表示没有剩余历史消息可供拉取。
									// list 为拉取到的历史消息列表
//									console.log("与"+paramTargetUserId+"的历史消息：");
//									console.log(list);
									if($("#hasMore").attr("hasMore") == 1){
										var temp = "";
										for(var i=0;i<list.length;i++){
											var itemContent = list[i];
											var contentTemp = itemContent.content.content; //聊天内容
											if(contentTemp.indexOf("www.") > -1 && contentTemp.indexOf(".com") > -1){ //如果是连接加a标签
												var tempStart = contentTemp.substring(0,contentTemp.indexOf("www."));
												var tempEnd = contentTemp.substring(contentTemp.indexOf(".com")+4);
												var tempUrl = contentTemp.substring(contentTemp.indexOf("www."),contentTemp.indexOf(".com")+4);
												contentTemp = tempStart + "<a class='color-blue' target='_blank' href='http://"+tempUrl+"'>" + tempUrl + "</a>" + tempEnd;
											}
											if(itemContent.content.messageName == "ImageMessage"){ //是图片消息
												contentTemp = '<img src="'+Config.imgPre + itemContent.content.imageUri +'" style="width:4.4rem;"/>';
											}
											var sentTime = $.Date(itemContent.sentTime).format("yyyy-MM-dd hh:mm:ss");
											if(ctrl.lastMessageTime != null && ($.Date(itemContent.sentTime) - ctrl.lastMessageTime) < 180000){ //小于最后一条消息3分钟则不显示时间
												sentTime = "";
											}
											ctrl.lastMessageTime = $.Date(itemContent.sentTime);//保存最后一条消息的时间
											if(itemContent.senderUserId == _datas.data.userId){
												//是自己发送的消息
												temp += '<p>'+ sentTime +'</p>'+
														'<div class="hd yous">'+
															'<div class="pic r">'+
																'<img src="'+ Config.imgPre + _datas.data.userIcon +'"/>'+
															'</div>'+
															'<div class="txt">'+
																'<em class="arrow-right"></em>'+
																'<p>'+ contentTemp +'</p>'+
															'</div>'+
														'</div>';
											}else{
												//是聊天对象发送的消息
												temp += '<p>'+ sentTime +'</p>'+
														'<div class="hd">'+
															'<div class="pic l">'+
																'<img src="'+ Config.imgPre + _datas.data.targetIcon +'"/>'+
															'</div>'+
															'<div class="txt">'+
																'<em class="arrow-left"></em>'+
																'<p>'+ contentTemp +'</p>'+
															'</div>'+
														'</div>';
											}
										}
										$("#chatContent").prepend(temp);
									}
									//没有历史记录
									if(!hasMsg){
										$("#hasMore").html("-- 没有更多 --").attr("hasMore","0");
									}
								},
								onError: function(error) {
									// APP未开启消息漫游或处理异常
									// throw new ERROR ......
//									console.log("网络异常！");
									location.reload();
								}
					        });
		            	}
		            });
				}catch(e){
//					console.error(e);
				}
			},
			//点击加载更多聊天记录
			loadMore : function(){
				var ctrl = this;
				if($("#hasMore").attr("hasMore") == 1){
            		//有更多聊天记录
					//获取历史消息列表
					RongIMClient.getInstance().getRemoteHistoryMessages(RongIMLib.ConversationType.PRIVATE, _datas.data.targetId+"", null, 10, {
						onSuccess: function(list, hasMsg) {
							// hasMsg为boolean值，如果为true则表示还有剩余历史消息可拉取，为false的话表示没有剩余历史消息可供拉取。
							// list 为拉取到的历史消息列表
//							console.log(list);
							var temp = "";
							if(list != null && list.length > 0){
								for(var i=0;i<list.length;i++){
									var itemContent = list[i];
									var contentTemp = itemContent.content.content; //聊天内容
									if(contentTemp.indexOf("www.") > -1 && contentTemp.indexOf(".com") > -1){ //如果是连接加a标签
										var tempStart = contentTemp.substring(0,contentTemp.indexOf("www."));
										var tempEnd = contentTemp.substring(contentTemp.indexOf(".com")+4);
										var tempUrl = contentTemp.substring(contentTemp.indexOf("www."),contentTemp.indexOf(".com")+4);
										contentTemp = tempStart + "<a class='color-blue' target='_blank' href='http://"+tempUrl+"'>" + tempUrl + "</a>" + tempEnd;
									}
									if(itemContent.content.messageName == "ImageMessage"){ //是图片消息
										contentTemp = '<img src="'+Config.imgPre + itemContent.content.imageUri +'" style="width:4.4rem;"/>';
									}
									var sentTime = $.Date(itemContent.sentTime).format("yyyy-MM-dd hh:mm:ss");
									if(ctrl.lastMessageTime != null && ($.Date(itemContent.sentTime) - ctrl.lastMessageTime) < 180000){ //小于最后一条消息3分钟则不显示时间
										sentTime = "";
									}
									ctrl.lastMessageTime = $.Date(itemContent.sentTime);//保存最后一条消息的时间
									if(itemContent.senderUserId == _datas.data.userId){
										//是自己发送的消息
										temp += '<p>'+ sentTime +'</p>'+
												'<div class="hd yous">'+
													'<div class="pic r">'+
														'<img src="'+ Config.imgPre + _datas.data.userIcon +'"/>'+
													'</div>'+
													'<div class="txt">'+
														'<em class="arrow-right"></em>'+
														'<p>'+ contentTemp +'</p>'+
													'</div>'+
												'</div>';
									}else{
										//是聊天对象发送的消息
										temp += '<p>'+ sentTime +'</p>'+
												'<div class="hd">'+
													'<div class="pic l">'+
														'<img src="'+ Config.imgPre + _datas.data.targetIcon +'"/>'+
													'</div>'+
													'<div class="txt">'+
														'<em class="arrow-left"></em>'+
														'<p>'+ contentTemp +'</p>'+
													'</div>'+
												'</div>';
									}
								}
								$("#chatContent").prepend(temp);
							}
							//没有历史记录
							if(!hasMsg){
								$("#hasMore").html("-- 没有更多 --").attr("hasMore","0");
							}
						},
						onError: function(error) {
							// APP未开启消息漫游或处理异常
							// throw new ERROR ......
//							console.log("网络异常！");
							location.reload();
						}
			        });
            	}
			},
			_events : {
				"#messageContent" : {
					"keydown":function(event) {
						if(event.keyCode == 13){
							$("#btn-send").click();
			        	}
					},
				}
			},
			// 发送文本消息
			sendText : function() {
				// 定义消息类型,文字消息使用 RongIMLib.TextMessage
				var msg = new RongIMLib.TextMessage({
					content : $("#messageContent").val(),
					user : {
						sendName:_datas.data.username,
						sendPortraitUri:_datas.data.userIcon,
						targetShopName:_datas.data.targetShopName
					}
				});
				this.sendMessage($("#messageContent").val(), msg);
			},
			
			// 发送图片消息 
			sendPicture : function(){
				var ctrl = this;
				$.simpleUpload({
					load:function(urls){
						/*urls 传多张图片的数组*/
						if(urls != null && urls.length > 0){
							var i = 0;
							var key = setInterval(function(){
								if(i >= urls.length){
									clearInterval(key);
									return;
								}
								var msg = new RongIMLib.ImageMessage({content:"",imageUri:urls[i]});
								ctrl.sendMessage('<img src="'+Config.imgPre + urls[i] +'" style="width:4.4rem;"/>', msg);
								i++;
							},2000);
						}
					}
				});
			},
			
			/**
			 * 发送消息 公共
			 * messageContent 发送内容
			 * msg 发送消息封装对象
			 */
			sendMessage : function(messageContent,msg){
				var ctrl = this;
				$("#messageContent").focus();//消息框获取焦点
				if(messageContent == null || messageContent.trim().length < 1){
					return;
				}
				if(messageContent.indexOf("www.") > -1 && messageContent.indexOf(".com") > -1){ //如果是连接加a标签
					var tempStart = messageContent.substring(0,messageContent.indexOf("www."));
					var tempEnd = messageContent.substring(messageContent.indexOf(".com")+4);
					var tempUrl = messageContent.substring(messageContent.indexOf("www."),messageContent.indexOf(".com")+4);
					messageContent = tempStart + "<a class='color-blue' target='_blank' href='http://"+tempUrl+"'>" + tempUrl + "</a>" + tempEnd;
				}
				var targetId = _datas.data.targetId+""; // 目标 Id
				// 发送消息
				RongIMClient.getInstance().sendMessage(RongIMLib.ConversationType.PRIVATE,targetId, msg, {
					onSuccess : function(message) {
						var sentTime = $.Date(message.sentTime).format("yyyy-MM-dd hh:mm:ss");
						if(ctrl.lastMessageTime != null && ($.Date(message.sentTime) - ctrl.lastMessageTime) < 180000){ //小于最后一条消息3分钟则不显示时间
							sentTime = "";
						}
						ctrl.lastMessageTime = $.Date(message.sentTime);//保存最后一条消息的时间
						// message 为发送的消息对象并且包含服务器返回的消息唯一Id和发送消息时间戳
						var temp = "";
						temp += '<p>'+sentTime+'</p>'+
					        	'<div class="hd yous">'+
						            '<div class="pic r">'+
						                '<img src="'+Config.imgPre + _datas.data.userIcon+'"/>'+
						            '</div>'+
						            '<div class="txt">'+
						                '<em class="arrow-left"></em>'+
						                '<p>'+messageContent+'</p>'+
						            '</div>'+
						        '</div>';
						$("#chatContent").append(temp);
						$("body").scrollTop($("body").outerHeight(true)+$("footer").outerHeight(true));
						$("#messageContent").val(""); //清空消息编辑框
						$("#chatContent img").loadCall(function(){
							$("body").scrollTop($("body").outerHeight(true)+$("footer").outerHeight(true));
						});
					},
					onError : function(errorCode, message) {
						var info = '';
						switch (errorCode) {
						case RongIMLib.ErrorCode.TIMEOUT:
							info = '超时';
							break;
						case RongIMLib.ErrorCode.UNKNOWN_ERROR:
							info = '未知错误';
							break;
						case RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
							info = '在黑名单中，无法向对方发送消息';
							break;
						case RongIMLib.ErrorCode.NOT_IN_DISCUSSION:
							info = '不在讨论组中';
							break;
						case RongIMLib.ErrorCode.NOT_IN_GROUP:
							info = '不在群组中';
							break;
						case RongIMLib.ErrorCode.NOT_IN_CHATROOM:
							info = '不在聊天室中';
							break;
						default:
							info = x;
							break;
						}
//						console.log('发送失败:' + info);
					}
				});
			},
			//返回上一页
			backHistory : function(){
				var targetId = this._datas.data.targetId;
				//清空未读消息数
				RongIMClient.getInstance().clearUnreadCount(RongIMLib.ConversationType.PRIVATE,targetId+"",{
				    onSuccess:function(){
				        // 清除未读消息成功。
				    },
				    onError:function(error){
				    }
				});
				history.go(-1);
			},
			//发送商品信息
			sendGoodsInfo : function(goodsId,shopId,specialtyContentId,goodsName,goodsImage){
				$(".commodity").hide(); // 隐藏商品信息
				var shopIdTemp = shopId?',shopId:'+shopId:'';
				var contentId = specialtyContentId?',specialtyContentId:'+specialtyContentId:'';
				var goodsSrc = '<div onclick="GO(\'goods/details\',{goodsId:'+goodsId + shopIdTemp + contentId+'})" style="padding-left: 1rem; position: relative; min-height: .75rem;">\
									<img src="'+Config.imgPre + goodsImage+'" style="width: .8rem; position: absolute; left: 0;"/>\
									'+goodsName+'\
								</div>';
				var msg = new RongIMLib.TextMessage({
					content : goodsSrc,
					user : {
						sendName:_datas.data.username,
						sendPortraitUri:_datas.data.userIcon,
						targetShopName:_datas.data.targetShopName,
						goodsInfo:"商品链接："+goodsName
					}
				});
				this.sendMessage(goodsSrc, msg);
			}
		},

		"message/otherDemo" : {
			_title : "用户对话",
			_footer : false,
			_load : function() {

				
			}
		},
		/*系统消息*/
		"message/systemMessages" : {
			_title : "系统消息",
			_footer : false,
			pageNum:1,
			pageSize:6,
			hasMore:true,
			_load : function() {
				//记录最后进入商家动态时间
				localStorage.setItem("infoRedpoint_"+_user.id,new Date().getTime());
				var ctrl = this;
				this.loadData();
				
				//触底加载
	            setREG("document_scroll", this._name, function(){
	                if(ctrl.hasMore && $.getScrollBottom()<3){
	                	ctrl.pageNum++;
	                	ctrl.loadData();
	            	}
	            });
			},
			loadData:function(){
				var ctrl = this;
				var userType = this._param.userType;
				$.ajax({
					url:Config.basePath + "localInfo/infoList.shtml",
					async:true,
					data:{userType:userType,pageNum:this.pageNum,pageSize:this.pageSize},
					type:"get",
					dataType:"json",
					success:function(data){
						if(data.status == 1){
							data = data.data.localInfoList;
							var html = "";
							for(var i = 0;i<data.length;i++){
								var url = "";
								var parameters=null;
								if(data[i].parameter){
									parameters = eval("("+data[i].parameter+")");
								}
								switch(data[i].pushType){
									case "activitySale":
										url = "#activity/promotionDetails?activityId="+parameters.activityId;
										break;
									case "activityShop":
										url="#activity/activityDetails?activityId="+parameters.activityId;
										break;
									case "activityForw":
										url="#forwardingGifts/forwardingDetails?forwardingGiftsId="+parameters.forwardingGiftsId+"&shopId="+parameters.shopId;
										break;
									case "cityNewsSale":
										url="#cityNews/promotionDetails?activityId="+parameters.activityId;
										break;
									case "cityNewsShop":
										url="#cityNews/activityDetails?activityId="+parameters.activityId;
										break;
									case "cityNewsForw":
										url="#forwardingGifts/forwardingDetails?forwardingGiftsId="+parameters.forwardingGiftsId+"&shopId="+parameters.shopId;
										break;
									case "randomCard":
										if(userType == 'business'){
											url="/#business/businessCash";
										}else{
											url="#ucenter/whooshTicketList";
										}
										break;
									case "indexActivity":
										url="#goods/activityArea?specialtyDisplayId="+parameters.specialtyDisplayId;
										break;
									case "busNewOrder":
										url ="#order/busOrders";
										break;
								}
								
								html += '<div class="con">'+
											'<p class="color-gray9 text-center">'+data[i].createDate+'</p>'+
											'<div class="con-b bg-white" onclick="this.ctrl.jumpPage('+data[i].id+',\''+url+'\','+data[i].isRead+')">'+
												'<h5 class="ellips1">'+data[i].title+'</h5>'+
												'<div class="con-bi">'+
													'<div class="pic">'+
														'<img src="'+Config.imgPre+data[i].image+'"/>'+
													'</div>'+
													'<div class="txt">'+
														'<h6 class="color-gray6" style="white-space: pre-wrap;">'+data[i].content.replace("\n","<br/>")+'</h6>'+
													'</div>'+
												'</div>'+
											'</div>'+
										'</div>';
							}
							$("#content").append(html);
							if(data.length < 6){
								ctrl.hasMore = false;
								if(data.length == 0 && ctrl.pageNum == 1){
									$(".reminder").css("display","block");
								}
							}
						}
					},
					error:function(data){
						alert(data.errorMsg);
					}
				})
			},
			jumpPage:function(id,url,isRead){
				if(!isRead){
					$.get(Config.basePath+"/localInfo/readLocalInfo.shtml",{infoId:id},function(datas){
						
					});
				}
				window.location.href=Config.basePath+url;
			}
		}

	});

})();