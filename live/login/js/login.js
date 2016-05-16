$(function(){
	
})
//检查用户名
function checkUserName(liver_name){
	if(liver_name == ''){
		$('#checkUserName').text('用户名不能为空')
						   .removeClass('green')
						   .addClass('red');
		return;
	}
	var sql="select liver_id from liver where liver_name='"+liver_name+"';";
	$.ajax({
		type:'GET',
		url:"../../php/hasReturnQuery.php",
		data:{
			sql:sql
		},
		dataType:'json',
		success:function(data){
			if (data != '') {
				$('#checkUserName').text('用户名正确')
						   		   .removeClass('red')
						   		   .addClass('green');
			}else{
				$('#checkUserName').text('用户名不存在')
						   		   .removeClass('green')
						   		   .addClass('red');
			}
		},
		error:function(){
			console.log('连接后台错误');
		}
	});
}
//检查密码
function checkPassword(liver_password){
	var liver_name=$('#loginUserName').val();
	if(liver_name == ''){
		$('#checkUserName').text('用户名不能为空')
						   .removeClass('green')
						   .addClass('red');
		return;
	}
	var sql="select liver_id from liver where liver_name='"+liver_name+"' and liver_password='"+liver_password+"';";
	$.ajax({
		type:'GET',
		url:"../../php/hasReturnQuery.php",
		data:{
			sql:sql
		},
		dataType:'json',
		success:function(data){
			if (data != '') {
				$('#checkPassword').text('密码正确')
						   		   .removeClass('red')
						   		   .addClass('green');
			}else{
				$('#checkPassword').text('密码错误')
						   		   .removeClass('green')
						   		   .addClass('red');
			}
		},
		error:function(){
			console.log('连接后台错误');
		}
	});
}
//登录
function login(){
	var liver_name=$('#loginUserName').val();
	var liver_password=$('#loginPassword').val();
	var sql="select liver_id from liver where liver_name='"+liver_name+"' and liver_password='"+liver_password+"';";
	$.ajax({
		type:'GET',
		url:"../../php/hasReturnQuery.php",
		data:{
			sql:sql
		},
		dataType:'json',
		success:function(data){
			if (data != '') {
				sessionStorage.setItem('liver_id',data[0]['liver_id']);
				sessionStorage.setItem('liver_name',liver_name);
				location.href='../';
			}
		},
		error:function(){
			console.log('连接后台错误');
		}
	});
}
//显示登录界面
function showLoginBox(){
	$('#registerSpan').removeClass('borderBottom');
	$('#loginSpan').addClass('borderBottom');
	$('#loginBox').show();
	$('#registerBox').hide();
}
//显示注册界面
function showRegisterBox(){
	$('#loginSpan').removeClass('borderBottom');
	$('#registerSpan').addClass('borderBottom');
	$('#registerBox').show();
	$('#loginBox').hide();
}
function checkRegisterUserName(liver_name){
	if(liver_name == ''){
		$('#checkRegisterUserName').text('用户名不能为空')
						   .removeClass('green')
						   .addClass('red');
		$('#registerUserName').attr('flag',0);
		return;
	}
	var sql="select liver_id from liver where liver_name='"+liver_name+"';";
	$.ajax({
		type:'GET',
		url:"../../php/hasReturnQuery.php",
		data:{
			sql:sql
		},
		dataType:'json',
		success:function(data){
			if (data != '') {
				$('#checkRegisterUserName').text('用户名已存在')
						   		   		   .removeClass('green')
						   		   		   .addClass('red');
				$('#registerUserName').attr('flag',0);
			}else{
				$('#checkRegisterUserName').text('用户名可用')
						   		   .removeClass('red')
						   		   .addClass('green');
				$('#registerUserName').attr('flag',1);
			}
		},
		error:function(){
			console.log('连接后台错误');
		}
	});
}
function checkRegisterPassword(password){
	var re=/^[\@A-Za-z0-9\!\#\$\%\^\&\*\.\~]{6,22}$/;
	if(password == ''){
		$('#checkRegisterPassword').text('6位以上字母')
						   		   .removeClass('green')
						   		   .addClass('red');
		$('#registerPassword').attr('flag',0);
		return;
	}
	if(re.test(password)){
		$('#checkRegisterPassword').text('密码正确')
						   		   .removeClass('red')
						   		   .addClass('green');
		$('#registerPassword').attr('flag',1);
	}else{
		$('#checkRegisterPassword').text('密码错误')
						   		   .removeClass('green')
						   		   .addClass('red');
		$('#registerPassword').attr('flag',0);
	}
}
function comfireRegisterPassword(comfirePassword){
	var password=$('#registerPassword').val();
	if (password == '') {
		$('#checkComfireRegisterPassword').text('请先输入密码')
						   		   .removeClass('green')
						   		   .addClass('red');
		$('#registerComfirePassword').attr('flag',0);
		return;
	}
	if (comfirePassword == password) {
		$('#checkComfireRegisterPassword').text('密码正确')
						   		   .removeClass('red')
						   		   .addClass('green');
		$('#registerComfirePassword').attr('flag',1);
	}else{
		$('#checkComfireRegisterPassword').text('密码错误')
						   		   .removeClass('green')
						   		   .addClass('red');
		$('#registerComfirePassword').attr('flag',0);
	}
	
}
function checkEmail(email){
	var re= /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	if(email == ''){
		$('#checkEmail').text('不能为空')
						   		   .removeClass('green')
						   		   .addClass('red');
		$('#registerEmail').attr('flag',0);
		return;
	}
	if(re.test(email)){
		$('#checkEmail').text('格式正确')
						   		   .removeClass('red')
						   		   .addClass('green');
		$('#registerEmail').attr('flag',1);
	}else{
		$('#checkEmail').text('格式错误')
						   		   .removeClass('green')
						   		   .addClass('red');
		$('#registerEmail').attr('flag',0);
	}
}
function register(){
	var registerUserNameFlag=$('#registerUserName').attr('flag');
	var registerPasswordFlag=$('#registerPassword').attr('flag');
	var registerComfirePasswordFlag=$('#registerComfirePassword').attr('flag');
	var registerEmailFlag=$('#registerEmail').attr('flag');
	if(registerUserNameFlag == 1 &&
	   registerPasswordFlag == 1 &&
	   registerComfirePasswordFlag == 1 &&
	   registerEmailFlag == 1){
		var liver_name=$('#registerUserName').val();
		var liver_password=$('#registerPassword').val();
		var email=$('#registerEmail').val();

		var sql="insert into liver "+
				"(liver_name,liver_password,email) "+
				"values "+
				"('"+liver_name+"','"+liver_password+"','"+email+"');";
		$.ajax({
			type:'GET',
			url:"../../../php/noReturnQuery.php",
			data:{
				sql:sql
			},
			success:function(data){
				if (data == 1) {
					alert('注册成功，请登录');
					showLoginBox();
				}
			},
			error:function(){
				console.log('连接后台错误');
			}
		});
	}
}