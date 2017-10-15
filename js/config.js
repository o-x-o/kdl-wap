(function(){

var reg=window[("_REG_")]={
},
	length=("_length_");
function initREG(group){
	if(reg[group]!=null)return;
	reg[group]={};
	Object.defineProperty(reg[group], length, {
			value:0,
			writable: true, enumerable: false, configurable: false
	});
};
window.getREG=function getREG(group, key){
	if(group===undefined){
		return reg;
	}
	initREG(group);
	return key==null?reg[group]:reg[group][key];
};
window.setREG=function setREG(group, key, value){/*(group, value)*/
	initREG(group);
	return value==null?setREG(group, reg[group][length]++, key):reg[group][key]=value;
};

window.Config={

	basePath : "./",

	debug : true,

	storage : false,
	
	user_avatar : "img/avatar0.gif",
	
	shopKeeper_avatar : "img/avatar0.gif",
	
	imgPre: "http://img.kaidianlaa.com/",
};

Config.message={
		/** 商家 */
		
		/** 店主 */
			
			
		/** 商品 */
			
		/** 订单 */
			
			
		/** 会员 */
		user : {
			sex : {
				man : "男",
				woman : "女"
			}
		},
		bankCard:{
			status:{
				audit:"待审核",
				pass:"通过",
				nopass:"未通过",
				invalid:"废弃"
			}
		},
		/** 内容 */
		
		/** 营销 */
			
			
		/** 统计 */
			
			
		/** 系统 */
		/** 配送方式*/
		shippingMethod:{
			method:{
				general:"普通快递",
				ownTake:"上门自提"
			}
		},
		
		orders:{
			type:{
				geOrd:"普通订单",
				exOrd:"兑换订单",
				seOrd:"服务性订单",
				leagueOrd:"联盟卡订单",
				bulkOrd:"采购订单"
			},
			status:{
				pePay:"等待买家付款",
				cancel:"已取消",
				sysAud:"买家已付款",
				failed:"失败",
				hasSpl:"已拆分",
				busAud:"等待商家确认",
				busCan:"商家取消,备货失败",
				peShip:"等待商家发货",
				hasShi:"卖家已发货",
				payCan:"已取消",
				hasRec:"交易成功",
				noCon:"尚未消费",
				hasCon:"消费成功",
				hasCom:"已完成"
			},
			busStatus:{
				pePay:"待付款",
				cancel:"已取消",
				sysAud:"买家已付款",
				failed:"失败",
				hasSpl:"已拆分",
				busAud:"等待商家确认",
				busCan:"商家取消,备货失败",
				peShip:"待发货",
				hasShi:"待收货",
				payCan:"已取消",
				hasRec:"交易成功",
				noCon:"尚未消费",
				hasCon:"消费成功",
				hasCom:"已完成"
			}
		},
		
		/** 配送方式*/
		returns:{
			status:{
				peAudi:"等待处理",
				audPass:"审核通过",
				buyCan:"买家取消",
				audFail:"审核失败",
				buyShip:"买家已发货",
				busRece:"退货完成",
				noRece:"卖家未收货",
				shiTiout:"买家发货超时",
				reTiout:"收货超时",
				reFail:"退货失败"
			}
		},
		/** 商家账单*/
		busbill:{
			type:{
				bill:"线下支付",
				businessPush:"广告推送",
				cityNews:"同城商讯"
			},
			status:{
				pePay:"待付款",
				complete:"已完成",
				close:"交易关闭",
				hasCom:"已完成",
				cancel:"已取消",
				paid:"已付款",
				failed:"交易失败"
			}
		},
		toolorder:{
			status:{
				pePay:"待付款",
				cancel:"已取消",
				paid:"已支付",
				failed:"失败",
				hasCom:"已完成"
			}
		},
		toolplugin:{
			type:{
				businessPush:"广告推送",
				companyBail:"商家保证金",
				cityNews:"同城商讯",
			}
		},
		suggest:{
			type:{
				functions:"功能意见",
				page:"页面意见",
				newNeed:"新的需求",
				operate:"操作意见",
				gbps:"流量问题",
				other:"其他原因"
			}
		}
};

})();