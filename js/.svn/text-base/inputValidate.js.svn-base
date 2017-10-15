var inputValidate= {
	//只可以输入数字
	onlyFloat  : function (obj,min,max) {
	  //获取前两位是否都是0
		var one = obj.value.charAt(0); 
		var two = obj.value.charAt(1); 
      //先把非数字的都替换掉，除了数字和.   
      	obj.value = obj.value.replace(/[^\d\.]/g,'');     
      //必须保证第一个为数字而不是.     
        obj.value = obj.value.replace(/^\./g,'');     
      //保证只有出现一个.而没有多个.     
      	obj.value = obj.value.replace(/\.{2,}/g,'.');     
      //保证.只出现一次，而不能出现两次以上     
      	obj.value = obj.value.replace('.','$#$').replace(/\./g,'').replace('$#$','.');  
      //第一位可以为-号
   		if(one == 0 && two !="" && two == 0){  
    		obj.value = obj.value.substring(1);
   		}
   	  //只保留两位小数
   		if(obj.value.indexOf(".")!= -1 && obj.value.substring(obj.value.indexOf(".")+1).length>2){
   			obj.value = obj.value.substring(0,obj.value.indexOf(".")+3);
   		}
   		//是否小于最小值
		if(min != ""){
			if(parseFloat(obj.value)<parseFloat(min)){
				obj.value = parseFloat(min)+"";
			}  
		}
		//是否大于最大值
		if(max !=""){
			if(parseFloat(obj.value)>parseFloat(max)){
				obj.value = parseFloat(max)+"";
			}  
		}
	},
	//只可以输入整数
	onlyInteger  : function (obj,min,max) {  
		//先把非数字的都替换掉，除了数字和.   
		obj.value = obj.value.replace(/\D/g,'');     
		//是否小于最小值
		if(min && min != ""){
			if(parseInt(obj.value)<parseInt(min)){
				obj.value = parseInt(min)+"";
			}  
		}
		//是否大于最大值
		if(max && max !=""){
			if(parseInt(obj.value)>parseInt(max)){
				obj.value = parseInt(max)+"";
			}  
		}
	},
	//只可以输入字母和数字
	onlyNumOrLetter  : function (obj,min,max) {  
		obj.value = obj.value.replace(/[\W]/g,'');     
	},
	//只能输入汉字
	onlyChinese : function(obj){
		obj.value = obj.value.replace(/[^\u4E00-\u9FA5]/g,'')
	},
	//文本框格式化添加空格（只可以输入数字）
	//参数：num:代表几位空一格
	formatAddBlank : function(obj,num){
		var number = "";
		if(typeof(num)!="undefined"){
			if(typeof(num)!="undefined"){
				if(isNaN(num)){
					return ;
				}
				for (i=0;i<parseFloat(num);i++){ 
					number=number+".";
				}
			}
			/*if(parseFloat(num)==1){
				number=".";
			}else if(parseFloat(num)==2){
				number="..";
			}else if(parseFloat(num)==3){
				number="...";
			}else if(parseFloat(num)==4){
				number="....";
			}else if(parseFloat(num)==5){
				number=".....";
			}else if(parseFloat(num)==6){
				number="......";
			}*/
		}else{
			return ;
		}
		obj.value = obj.value.replace(/\D/g, '').replace(eval("/"+number+"(?!$)/g"), '$& ');
	}
}