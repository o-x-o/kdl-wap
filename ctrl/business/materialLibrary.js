(function(){
	/*公用变量和方法*/
	FORMAT({
		/*素材库*/
	    "business/materialLibrary": {
	    	_template:{url:"view/business/materialLibrary/materialLibrary.ejs"},
	        _title:"素材库",
	        _links:{
	        	"js/extra.js":"js"
	        },
	        /*
	        _datas: {
	        	data:POST("business/materialList.shtml",{pageNum:1,pageSize:10},function(data){
	        		return data;
	        	}),
	        },*/
	        pageNum : 1,
	        pageSize : 10,
	        continueLoad : true,
	        _footer : false,
	        _load: function(){
	            this.loadData(this.pageNum,this.pageSize);
	            $(".bg-white").find("img").on("click",function(){
	            	GO("business/materialDetails",{materialId:$(this).next().next().val()});
	            });
	            $("#deleteBtn").click(function(){
	            	if($(".bg-white input[name='materialId']").length<1){
	            		alert("亲，请选择要删除的图片！");
	            		return false;
	            	}
	            	alert("确认要删除？", function(flag){
		        		if(flag){
		        			$("form").submit();
 		        		}
	            	},true);
	            });
	            $(".nav-wrap-right").click(function(){
	            	$.simpleUpload({
	            		multiple:false,
	            		url:"business/materialUpload.shtml",
	            		fileUrl:"image",
	            		start:function(files){	/* 开始上传执行的方法 */
	            			$.getMaxWrap().loadingWrap();
	        			},
	        			callback:function(response){	/* 向后台post图片信息之后的回调 */
	        				$("html,body").loadingWrapCancel();
	        				if(response.status==0){
	        	        		alert(response.errorMsg);
	        	        		return false;
	        	        	}
	        	        	RELOAD();
	        			},
	            	});
	            });
	            var ctrl =this;
	            setREG("document_scroll", ctrl._name, function(){
	            	 if($.getScrollBottom()<3){
	            		 ctrl.pageNum = ctrl.pageNum+1;
	            		 if(_ctrl.continueLoad){
	            			 $.getMaxWrap().loadingWrap();
	            			 ctrl.loadData(ctrl.pageNum,ctrl.pageSize);
	            			 $(".bg-white").find("img").unbind("click"); 
	 					     $(".bg-white").find("img").on("click",function(){
 					    	    console.log($(this));
	 			            	GO("business/materialDetails",{materialId:$(this).next().next().val()});
	 			             });
	            		 }
	            	 }
	            });
	        },
	        selOne : function(){
	        	 if ($(this).next().hasClass("color-red")){
	        		 $(this).next().removeClass("color-red");
	        		 $(this).next().hide();
	        		 $(this).next().next().removeAttr("name");
	        	 }else {
	        		 $(this).next().addClass("color-red");
	        		 $(this).next().show();
	        		 $(this).next().next().attr("name","materialId");
                 }
		    },
	        selAll : function(obj){
	        	if ($(obj).hasClass("color-gray9")){
	        		$(obj).removeClass("color-gray9");
	        		$(obj).addClass("color-red");
	        		$(obj).find("i").html("&#xe63d;");
	        		$(".bg-white").find("i").show();
	        		$(".bg-white").find("i").addClass("color-red");
	        		$(".bg-white").find("input").attr("name","materialId");
	        	}else {
	        		$(obj).addClass("color-gray9");
	        		$(obj).removeClass("color-red");
	        		$(obj).find("i").html("&#xe64f;");
	        		$(".bg-white").find("i").hide();
	        		$(".bg-white").find("i").removeClass("color-red");
	        		$(".bg-white").find("input").removeAttr("name");
	        	}
	        },
	        editImage : function(obj){
	        	if($(obj).hasClass("color-red")){
	        		$(".bg-white").find("img").unbind("click").on("click",
	    	            	this.selOne
	    	        );
	        		$(obj).removeClass("color-red");
	        		$(obj).html("取消");
	        		$("#operator").show();
	        	}else{
	        		$(".bg-white").find("img").unbind("click").on("click",function(){
	 	            	GO("business/materialDetails",{materialId:$(this).next().next().val()});
	 	            });
	        		$(obj).addClass("color-red");
	        		$(obj).html("选择");
	        		$("#operator").hide();
	        		$("#selAll").addClass("color-gray9");
	        		$("#selAll").removeClass("color-red");
	        		$("#selAll").find("i").html("&#xe64f;");
	        		$(".bg-white").find("i").hide();
	        		$(".bg-white").find("i").removeClass("color-red");
	        		$(".bg-white").find("input").removeAttr("name");
	        	}
	        },
	        submitCall : function(response){
	        	if(response.status==0){
	        		alert(response.errorMsg);
	        		return false;
	        	}
	        	RELOAD();
	        },
	        loadData : function(pageNum,pageSize){
	        	var ctrl =this;
	        	$.ajax({
    				url:"business/materialList.shtml",
    				data:{"pageNum":pageNum,"pageSize":pageSize},
    				async:false,
    				dataType:"json",
    				type:"post",
    				success:function(data){
    					if(data.status==0){
    						alert(data.errorMsg);
    						return false;
    					}
    					var html ="";
    					if(data.data.page.list.length==0){
    						ctrl.continueLoad = false;
    						$("html,body").loadingWrapCancel();
    						return false;
    					}
    					if(data.data.page.list.length<ctrl.pageSize){
    						ctrl.continueLoad = false;
    					}
					    $.each(data.data.page.list, function (n, obj) {
					    	html+= "<li>"
					    		+"<img src='"+Config.imgPre+obj.image+"'/>"
					    		+"<i class='iconfont' style='cursor:default;display:none;'>&#xe63d;</i>"
					    		+"<input type='hidden' value='"+obj.id+"'/>"
					    		+"</li>";
			            });
					    $("#appendImage").append(html);
					    $("html,body").loadingWrapCancel();
    				},
    				error:function(data){
    					alert("亲，系统错误请您稍后再试！");
    				}
    			});
	        },
	        _pass:function(){
	        	$(document).unbind("scroll");
	        }
	    } ,
	    /*素材库图片详情*/
	    "business/materialDetails": {
	    	_template:{url:"view/business/materialLibrary/materialDetails.ejs"},
	        _title:"素材图片详情",
	        _datas: {
	        	data:POST("business/materialDetails.shtml",{materialId:PARAM("materialId",0)},function(data){
	        		return data;
	        	})
	        },
	        _footer:false,
	        _load: function(){
	        },
	        deleteImage : function(materialId){
	        	alert("确认要删除？", function(flag){
	        		if(flag){
	        			$.ajax({
	        				url:"business/materialDelete.shtml",
	        				data:{"materialId":materialId},
	        				async:false,
	        				dataType:"json",
	        				type:"post",
	        				success:function(data){
	        					if(data.status==0){
	        						alert(data.errorMsg);
	        						return false;
	        					}
	        					GO("business/materialLibrary");
	        				},
	        				error:function(data){
	        					alert("亲，系统错误请您稍后再试！");
	        				}
	        			});
	        		}
	        	},true); 
	        }
	    }
	   
	})
})()