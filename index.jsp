<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=0">
	<meta name="description" content="开店啦是区域实体商家移动互联网服务平台，免费开店，汇聚同城内300多个行业、成千上万家实体商家，实现同城商家和用户的精准连接，是同城实体商家不可多得的移动互联网服务平台。商家可免费网上开店，吸引老客，留住新客，便捷收款，效率对账，精准引流，一键触达，会员管理，员工管理">
	<meta name="keywords" content="实体店铺、商家平台-生活圈、实体店铺免费开店、免费开店、互联网开店、实体店网上开店、我要开店、创业开店、全民开店，商家可免费网上开店，吸引老客，留住新客，便捷收款，效率对账，精准引流，一键触达，会员管理，员工管理">
	<meta name="renderer" content="webkit"/>
	<link rel="icon" href="img/favicon.ico" type="image/x-icon">
	<link rel="Bookmark"  href="img/favicon.ico" /><!--收藏夹中的图标-->
	<link rel="apple-touch-icon-precomposed" sizes="196x196" href="./img/apple-touch-icon-196x196-precomposed.png"/>
	<title>开店啦_实体商家网上免费开店 _精准引流_吸引用户_用户便捷付款_互联网创业开店_实体店网上开店</title>
	<script src="./js/LAB.src.js?_ver="></script>
	<script type="text/javascript">
		/*发布版本*/
		var _Version="1.0.5"||Math.random();

		/* load main css*/
		$LAB
		.css("./css/base.css")
		.css("./css/animate.css")
		.css("./plugin/sweetalert/sweetalert.css")
		.css("./plugin/poshytip/tip-all/tip-all.css");
		
		/*百度统计*/
		var _hmt = _hmt || [];
		(function() {
			var hm = document.createElement("script");
			hm.src = "//hm.baidu.com/hm.js?d139faf5db96526d7bfab377f86739dc";
			var s = document.getElementsByTagName("script")[0]; 
			s.parentNode.insertBefore(hm, s);
		})();
	</script>
</head>
<body style="opacity:0;" ontouchstart>
	<section class="container page_container page_switch"></section>
	<section class="container sub_container page_switch"></section>
	<section class="container third_container page_switch"></section>
	<footer>
		<ul>
			<li>
				<a href="#index" class="cur">
					<i class="iconfont">&#xe602;</i>
					<p>首页</p>
				</a>
			</li>
			<li>
				<a href="#shopKeeper/shopKeeperInfo">
					<i class="iconfont">&#xe6a3;</i>
					<p>店主</p>
				</a>
			</li>
			<li>
				<a href="#etc/discover">
					<span class="iconfont">&#xe684;</span>
				</a>
			</li>
			<li>
				<a href="#cart/shoppingCart">
					<i class="iconfont">&#xe604;</i>
					<p>购物车</p>
				</a>
			</li>
			<li>
				<a href="#ucenter/mine">
					<i class="iconfont">&#xe606;</i>
					<p>我的</p>
				</a>
			</li>
		</ul>
	</footer>
	<section class="util-wrap">
		<div class="black-box">
			<center class="iconfont">&#xe63d;</center>
			<center class="text"></center>
		</div>
		<div class="Prompt alertBox">
			<div class="txt">
				<p></p>
			</div>
			<button class="color-red">好</button>
			<ul>
				<li>
					<a href="javascript:;">取消</a>
				</li>
				<li>
					<a href="javascript:;">确定</a>
				</li>
			</ul>
			<span class="closeBtn"></span>
		</div>
		<div class="Prompt alertsBox">
			<div class="txt">
				<p></p>
			</div>
			<button class="color-red">好</button>
			<ul>
				<li>
					<a href="javascript:;">取消</a>
				</li>
				<li>
					<a href="javascript:;">确定</a>
				</li>
			</ul>
			<span class="closeBtn"></span>
		</div>
	</section>
</body>
	<script type="text/javascript">
		$LAB
		.setOptions({AlwaysPreserveOrder:true})
		.js("./js/config.js")
		.js("./js/jquery-2.1.4.min.js")
		.js("./js/ejs-front.js")
		.js("./js/ctrls.js")
		.js("./js/util.js")
		.js("./js/zin.js")
		.js("./plugin/jquery.validate.js")
		.js("./plugin/sweetalert/sweetalert.min.js")
		.js("./plugin/poshytip/jquery.poshytip.min.js")
		.js("./js/ready.js").wait(function(){
			$(function(){

			});
		});
	</script>
</html>