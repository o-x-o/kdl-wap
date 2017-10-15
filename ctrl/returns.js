(function(){
	/*公用变量和方法*/


FORMAT({
	/*退款/售后*/
	"returns/returnsList":{
		_title:"退款/售后",
		_footer:false,
		pageNum:1,
        pageSize:10,
        flag:true,
        _load: function(){
        	var ctrl = this;
        	$(".hdList>ul>li").click(function(){
        		$(this).addClass("cur").siblings().removeClass("cur");
        		var index = $(this).index();
        		ctrl.pageNum = 1;
    			ctrl.pageSize = 10;
    			ctrl.flag = true;
    			$(".goodsList").empty();
        		if(index == 0){
                 	ctrl.loadReturnsData();
                 	setREG("document_scroll", ctrl._name, function(){
                        if($.getScrollBottom()<3 && ctrl.flag){
                         	ctrl.pageNum++;
                    		ctrl.loadReturnsData();
                    	}
                    });
        		}else{
                 	ctrl.loadRefundsData();
                 	setREG("document_scroll", ctrl._name, function(){
                        if($.getScrollBottom()<3 && ctrl.flag){
                         	ctrl.pageNum++;
                    		ctrl.loadRefundsData();
                    	}
                    });
        		}
        	});
        	$(".hdList>ul>li:eq(0)").click();
        },
        loadReturnsData:function(){
        	var ctrl = this;
        	$.get("returns/getList.shtml",{
        		pageNum:ctrl.pageNum,
        		pageSize:ctrl.pageSize
        	},function(data){
        		var returnsList = "";
        		if(data.data && data.data.returnsList){
        			returnsList = data.data.returnsList;
        		}else{
        			return false;
        		}
        		if(ctrl.pageNum == 1 && returnsList.length == 0){
        			$(".warn").html(REND("include/empty",{icon:"&#xe695;",tip:"您还没有退货的商品哦！",price:"1.5",display:"block",paddingbottom:"1"}));
        			return false;
        		}else{
        			$(".warn").html("");
        		}
        		if(returnsList.length < ctrl.pageSize){
        			ctrl.flag = false;
        		}
        		var temp = '';
        		for(var i=0;i<returnsList.length;i++){
        			var returnsItemStr = '';
        			for(var j = 0;j<returnsList[i].returnsItems.length;j++){
        				returnsItemStr +=  ' <li>'+
								                '<a href="#returns/returnsDetail?returnsId='+returnsList[i].id+'">'+
							                    '<div class="pic">'+
							                        '<img src="'+Config.imgPre+returnsList[i].returnsItems[j].image+'"/>'+
							                    '</div>'+
							                    '<div class="txt">'+
							                        '<h6 class="color-gray6 ellips">'+returnsList[i].returnsItems[j].name+'</h6>'+
							                    '</div>'+
							                    '<div class="jiage">'+
							                        '<span class="color-gray3">￥'+returnsList[i].returnsItems[j].price.toFixed(2)+'</span>'+
							                    '</div>'+
							                    '<p class="color-gray9 m-top30">数量：'+returnsList[i].returnsItems[j].quantity+'</p>'+
							                '</a>'+
							            '</li>'
        			 }
        			temp += '<div class="con-list" >'+
        		        '<div class="hd bg-white" onclick="GO(\'shop/shops?shopId='+returnsList[i].shopId+'\')" >'+
        		            '<a href="javascript:;">'+
        		                '<span>'+
        		                    '<img src="'+Config.imgPre+returnsList[i].shop.avatar+'"/>'+
        		                '</span>'+
        		              	  returnsList[i].shop.shopName+'>'+
        		            '</a>'+
        		            '<span class="kdl-right color-red">'+Config.message.returns.status[returnsList[i].status]+'</span>'+
        		        '</div>'+
        		        '<ul>'+returnsItemStr+
        		        '</ul>'+
        		        '<div class="bd">'+
        		            '<div>'+
        		               	 '退款总额：<cite class="h5 color-red">￥'+returnsList[i].returnAmount.toFixed(2)+'</cite>'+
        		            '</div>'+
        		        '</div>'+
        		    '</div>';
        		}
        		$(".goodsList").append(temp);
        	})
        },
        loadRefundsData:function(){
        	var ctrl = this;
        	$.get("refunds/getList.shtml",{
        		pageNum:ctrl.pageNum,
        		pageSize:ctrl.pageSize
        	},function(data){
        		var refundsList = "";
        		if(data.data && data.data.refundsList){
        			refundsList = data.data.refundsList;
        		}else{
        			return false;
        		}
        		if(ctrl.pageNum == 1 && refundsList.length == 0){
        			$(".warn").html(REND("include/empty",{icon:"&#xe663;",tip:"您还没有退款的商品哦！",price:"1.5",display:"block",paddingbottom:"1"}));
        			return false;
        		}else{
        			$(".warn").html("");
        		}
        		if(refundsList.length < ctrl.pageSize){
        			ctrl.flag = false;
        		}
        		var temp = '';
        		temp += '<div class="reimburseList bg-white"><ul>';
        		for(var i=0;i<refundsList.length;i++){
        			var statusName = "";
        			if(refundsList[i].status == "pehand" || refundsList[i].status == "audiPass"){
        				statusName = "处理中";
        			}else if(refundsList[i].status == "success"){
        				statusName = "交易成功";
        			}else if(refundsList[i].status == "audiFail" || refundsList[i].status == "failure"){
        				statusName = "交易失败";
        			}
        			temp += '<li onclick="GO(\'returns/reimburseDetail?refundsId='+refundsList[i].id+'\')">'+
				    			'<div class="hd color-gray6">'+
									'<cite>'+
										'<img src="'+Config.imgPre+refundsList[i].shop.avatar+'"/>'+
									'</cite>'+
									refundsList[i].shop.shopName+
									'<span class="color-red kdl-right">'+statusName+'</span>'+
								'</div>'+
								'<p class="m-top10">'+refundsList[i].createDate+'<span class="kdl-right h5 color-gray3">￥'+refundsList[i].refundsAmount.toFixed(2)+'</span></p>'+
							'</li>';
        		}
        		temp += "</ul></div>";
        		$(".goodsList").append(temp);
        	})
        }
    },
    /*售后服务*/
	"returns/austinServer":{
		_title:"售后服务",
		_footer:false,
        _load: function(){
        	$(".con-list>ul>li>i.iconfont").click(function(){
        		if($(this).text()==""){
        			$(this).html("");
        			$(this).addClass("color-red");
        		}else{
        			$(this).html("");
        			$(this).removeClass("color-red");
        		}
        	})
        }
    },
    /*售后进度*/
	"returns/returnsSchedule":{
		_title:"售后进度",
		_footer:false,
        _load: function(){

        }
    },
    /*退款详情*/
	"returns/reimburseDetail":{
		_title:"退款详情",
		_footer:false,
		_datas:GET("refunds/detail.shtml",{refundsId:PARAM("refundsId",null)},function(data){
			return data;
		}),
        _load: function(){
        	
        }
    },
    /*退货详情*/
	"returns/returnsDetail":{
		_title:"退货详情",
		_footer:false,
		_datas:GET("returns/detail.shtml",{returnsId:PARAM("returnsId",null)},function(data){
			return data;
		}),
        _load: function(){
        	$("#cancelBtn").click(function(){
            	alert("确认要取消申请吗？", function(flag){
            		if(flag){
            			$.post("returns/cancelReturns.shtml",{returnsId:$("#returnsId").val()},function(data){
            				if(data.status == 1){
            					alert("取消成功");
            					window.location.reload();
            				}else{
            					alert("取消失败");
            				}
            			})
            		}
            	},true);
            });
        }
    },
    /*发起退货*/
	"returns/sponsorReturns":{
		_title:"发起退货",
		_footer:false,
        _load: function(){
        	$(".conList").hide();
			$(".address").hide();
        	$(".con-hd>ul>li").click(function(){
        		$(this).addClass("cur").siblings().removeClass("cur");
        		var sm=$(this).index();
        		if(sm==0){
        			$(".conList").hide();
        			$(".address").hide();
        		}else{
        			$(".conList").show();
        			$(".address").show();
        		}
        	})
        }
    }
    
});

})();