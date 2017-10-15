var loadArea= {
	getProvince  : function (id) {
		$.ajax( {
			url:Config.basePath+"/area/loadArea.shtml",
			data:{grade:0},
			async:false,
			type:"post",
			dataType:"json",
			success : function(result) {
				$.each(result, function(entryIndex, entry) {
					var sel = "";
					if(id!="" && id!=null && id==entry.id){
						sel = "selected='selected'";
					}
					var html = "<option "+sel+" value='" + entry.id + "'>"
							+ entry.name + "</option>";
					$("#selprovince").append(html);
				});
			}
		});
		if(id!="" && id!=null){
			this.getCity();
		}
	},
	getCity  : function (id) {
		$("#zipCode").val("");
		if (document.getElementById("citydiv").style.display == "block"	|| document.getElementById("areadiv").style.display == "block") {
			document.getElementById("citydiv").style.display = "none";
			document.getElementById("areadiv").style.display = "none";
		}
		if (document.getElementById("citydiv").style.display == "none" && document.getElementById("selprovince").value != 0) {
			document.getElementById("citydiv").style.display = "block";
		}
		$("#selcity option").not("[value=0]").not("[value='']").remove();
		$("#selarea option").not("[value=0]").not("[value='']").remove();
		var object = $("#selprovince");
		
		if(id==null || id==""){
			$("#areaId").val(object.val()==0 ? "" : object.val());
		}
		if (object.val() != 0) {
			$.ajax( {
				url:Config.basePath+"/area/loadArea.shtml",
				data : {parentId :object.val()},
				async:false,
				type:"post",
				dataType:"json",
				success : function(result) {
					$.each(result, function(entryIndex, entry) {
						var sel = "";
						if(id!="" && id!=null && id==entry["id"]){
							sel = "selected='selected'";
						}
						var html = "<option "+sel+" value='" + entry["id"] + "'>" + entry["name"] + "</option>";
						$("#selcity").append(html);
					});
				}
			});
			if(id!="" && id!=null){
				this.getArea();
			}
		}
	},
	getArea : function (id) {
		$("#zipCode").val("");
		if (document.getElementById("areadiv").style.display == "block") {
			document.getElementById("areadiv").style.display = "none";
		}
		if (document.getElementById("areadiv").style.display == "none" && document.getElementById("selcity").value != 0) {
			document.getElementById("areadiv").style.display = "block";
		}
		$("#selarea option").not("[value=0]").not("[value='']").remove();
		var object = $("#selcity");
		if(id==null || id==""){
			$("#areaId").val(object.val()==0 ? $("#selprovince").val() : object.val());
		}
		if (object.val() != 0) {
			$.ajax( {
				url:Config.basePath+"/area/loadArea.shtml",
				data : {parentId :object.val()},
				async:false,
				type:"post",
				dataType:"json",
				success : function(result) {
					$.each(result, function(entryIndex, entry) {
						var sel = "";
						if(id!="" && id!=null && id==entry["id"]){
							sel = "selected='selected'";
						}
						var zipCode = "zipcode='"+entry["zipCode"]+"'";
						var html = "<option "+zipCode+sel+" value='" + entry["id"] + "'>" + entry["name"] + "</option>";
						$("#selarea").append(html);
					});
				}
			});
		}
	},
	showArea : function (area) {
		if(area==null || area==""){
			this.getProvince();
		}else{
			var areaId= area.id;
			var strs=area.treePath.split(",");
			for(var i = 0 ;i<strs.length;i++){
	            if(strs[i] == "" || typeof(strs[i]) == "undefined"){
	            	strs.splice(i,1);
	            	i= i-1;
	            }
			}
			if(strs.length==0){
				this.getProvince(areaId);
			}else if(strs.length==1){
				this.getProvince(strs[0]);
				this.getCity(areaId);
			}else if(strs.length==2){
				this.getProvince(strs[0]);
				this.getCity(strs[1]);
				this.getArea(areaId);
				$("#areaId").val(areaId);
				$("#zipCode").val(area.zipCode);
			}
		}
	},
	selectArea : function (area) {
		var object = $("#selarea");
		$("#zipCode").val(object.val()==0 ? "" : $("#selarea option:selected").attr("zipcode"));
		$("#areaId").val(object.val()==0 ? $("#selcity").val() : object.val());
	}
	
}