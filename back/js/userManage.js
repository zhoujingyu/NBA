var currentPage=1;
var countPage=0;
var prePageCount=20;

//取得用户
function getUser(page){
	if(page == undefined){
		page=1;
	}
	currentPage=page;

	var $userTable=$('#userTable');
	$userTable.find('tr:not(.tableHeader)').remove();

	var sql="select * "+
			"from user "+
			"limit "+(currentPage-1)*prePageCount+","+prePageCount+";";
	$.ajax({
		type:'GET',
		url:"../../php/hasReturnQuery.php",
		data:{
			sql:sql
		},
		dataType:'json',
		success:function(data){
			if (data != '') {
				var trHTML='<tr>'+
							'<td class="user_id hidden">rpuser_id</td>'+
							'<td class="user_name">rpuser_name</td>'+
							'<td class="user_password">rpuser_password</td>'+
							'<td class="email">rpemail</td>'+
							'<td class="level">rplevel</td>'+
							'<td class="last_in">rplast_in</td>'+
							'<td class="last_out">rplast_out</td>'+
							'<td class="ms">rpms</td>'+
							'<td class="operation1">'+
								'<button type="button" class="myButton" onclick="alterUser(this)">修改</button>'+
							'</td>'+
							'<td class="operation2">'+
								'<button type="button" class="myButton" onclick="deleteUser(this)">删除</button>'+
							'</td>'+
						   '</tr>';
				var trHTMLTmp='';

				var length=data.length;
				for(var i=0;i<length;i++){
					trHTMLTmp=trHTML.replace('rpuser_id',data[i]['user_id'])
									.replace('rpuser_name',data[i]['user_name'])
									.replace('rpuser_password',data[i]['user_password'])
									.replace('rpemail',data[i]['email'])
									.replace('rplevel',data[i]['level'])
									.replace('rplast_in',data[i]['last_in'])
									.replace('rplast_out',data[i]['last_out'])
									.replace('rpms',data[i]['ms']);
					$userTable.append(trHTMLTmp);
				}
				$('#currentPage').text(currentPage);
			}
		},
		error:function(){
			console.log('连接后台错误');
		}
	});
}
//修改用户
function alterUser(button){
	var $tr=$(button).parent().parent();
	var $user_id=$tr.find('.user_id');
	var $user_name=$tr.find('.user_name');
	var $user_password=$tr.find('.user_password');
	var $email=$tr.find('.email');
	var $level=$tr.find('.level');
	var $operation1=$tr.find('.operation1');
	var $operation2=$tr.find('.operation2');

	var user_id=$user_id.text();
	var user_name=$user_name.text();
	var user_password=$user_password.text();
	var email=$email.text();
	var level=$level.text();

	var user_nameHTML="<input type='text' class='userInput' value='"+user_name+"' />";
	var user_passwordHTML="<input type='text' class='userInput' value='"+user_password+"' />";
	var emailHTML="<input type='text' class='userInput' value='"+email+"' />";
	var levelHTML="<input type='text' class='userInput' value='"+level+"' />";
	var operation1HTML='<button type="button" class="myButton" onclick="confirmAlterUser(this)">确认</button>';
	var operation2HTML='<button type="button" class="myButton" onclick="cancelAlterUser('+user_id+')">取消</button>';

	$user_name.html(user_nameHTML);
	$user_password.html(user_passwordHTML);
	$email.html(emailHTML);
	$level.html(levelHTML);
	$operation1.html(operation1HTML);
	$operation2.html(operation2HTML);
}
//删除用户
function deleteUser(button){
	var $tr=$(button).parent().parent();
	var user_id=$tr.find('.user_id').text();

	var sql="delete from user where user_id="+user_id+";";
	$.ajax({
		type:'GET',
		url:"../../php/noReturnQuery.php",
		data:{
			sql:sql
		},
		success:function(data){
			if (data == 1) {
				getUser(currentPage);
			}
		},
		error:function(){
			console.log('连接后台错误');
		}
	});
}
//确认修改用户
function confirmAlterUser(button){
	var $tr=$(button).parent().parent();
	var $user_id=$tr.find('.user_id');
	var $user_name=$tr.find('.user_name');
	var $user_password=$tr.find('.user_password');
	var $email=$tr.find('.email');
	var $level=$tr.find('.level');

	var user_id=$user_id.text();
	var user_name=$user_name.find('input').val();
	var user_password=$user_password.find('input').val();
	var email=$email.find('input').val();
	var level=$level.find('input').val();

	var sql="update user "+
			"set user_name='"+user_name+"',"+
			"user_password='"+user_password+"',"+
			"email='"+email+"',"+
			"level='"+level+"' "+
			"where user_id="+user_id+";";
	console.log(sql);
	$.ajax({
		type:'GET',
		url:"../../php/noReturnQuery.php",
		data:{
			sql:sql
		},
		success:function(data){
			if (data == 1) {
				getUser(currentPage);
			}
		},
		error:function(){
			console.log('连接后台错误');
		}
	});
}
//取消修改用户
function cancelAlterUser(team_id){
	getUser(currentPage);
}
//添加用户
function addUser(){
	var trHTML='<tr>'+
				'<td class="user_name"><input type="text" class="userInput" /></td>'+
				'<td class="user_password"><input type="text" class="userInput" /></td>'+
				'<td class="email"><input type="text" class="userInput" /></td>'+
				'<td class="level"><input type="text" class="userInput" /></td>'+
				'<td>不用输入</td>'+
				'<td>不用输入</td>'+
				'<td>不用输入</td>'+
				'<td class="operation1"><button type="button" class="myButton" onclick="confirmAddUser(this)">添加</button></td>'+
				'<td class="operation2"><button type="button" class="myButton" onclick="cancelAddUser(this)">取消</button></td>'+
			   '</tr>';
	$('#userTable .tableHeader').after(trHTML);
}
//确认添加用户
function confirmAddUser(button){
	var $tr=$(button).parent().parent();
	var $user_name=$tr.find('.user_name');
	var $team_short_name=$tr.find('.team_short_name');
	var $position=$tr.find('.position');

	var user_name=$user_name.find('input').val();
	var team_id=$team_short_name.find('select option:selected').val();
	var position=$position.find('input').val();

	var sql="insert into user "+
			"(user_name,team_id,position) "+
			"values "+
			"('"+user_name+"',"+team_id+",'"+position+"');";
	console.log(sql);
	$.ajax({
		type:'GET',
		url:"../../php/noReturnQuery.php",
		data:{
			sql:sql
		},
		success:function(data){
			if (data == 1) {
				getuser(team_id);
			}
		},
		error:function(){
			console.log('连接后台错误');
		}
	});
}
//取消添加用户
function cancelAddUser(button){
	$(button).parent().parent().remove();
}
//取得总页数
function getCountPage(){
	var sql="select count(*) from user;"
	$.ajax({
		type:'GET',
		url:"../../php/hasReturnQuery.php",
		data:{
			sql:sql
		},
		dataType:'json',
		success:function(data){
			console.log(data);
			if(data != ''){
				countPage=Math.ceil(data[0][0]/prePageCount);
				$('#countPage').text(countPage);
			}
		},
		error:function(){
			console.log('连接后台错误');
		}
	});
}
//下一页
function nextPage(){
	if(currentPage == countPage){
		alert('已到最后一页');
		return false;
	}
	getUser(++currentPage);
}
//上一页
function lastPage(){
	if(currentPage == 1){
		alert('已到首页');
		return false;
	}
	getUser(--currentPage);
}
