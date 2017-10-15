<header class="navbar navbar2">
    <title>支付</title>
    <meta http-equiv="content-type" content="text/html; charset=utf-8" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge" />
	<meta name="author" content="KAIDIANLAA Team" />
	<meta name="copyright" content="KAIDIANLAA" />
</header>
<!--内容-->
<body style="display:none;" onload="javascript:document.forms[0].submit();">
	<div class="content toPayContent">
		<form action="${requestUrl}" method="${requestMethod}" accept-charset="${requestCharset}">
			[#list parameterMap.entrySet() as entry]
				<input type="txt" name="${entry.key}" value="${entry.value}" />
			[/#list]
		</form>
	</div>
</body>