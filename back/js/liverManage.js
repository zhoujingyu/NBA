//取得直播员
function getLiver(){
	var $liverTable=$('#liverTable');
	$liverTable.find('tr:not(.tableHeader)').remove();

	var sql="select * from liver;";
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
							'<td class="liver_id hidden">rpliver_id</td>'+
							'<td class="liver_name">rpliver_name</td>'+
							'<td class="liver_password">rpliver_password</td>'+
							'<td class="email">rpemail</td>'+
							'<td class="operation1">'+
								'<button type="button" class="myButton" onclick="alterLiver(this)">修改</button>'+
							'</td>'+
							'<td class="operation2">'+
								'<button type="button" class="myButton" onclick="deleteLiver(this)">删除</button>'+
							'</td>'+
						   '</tr>';
				var trHTMLTmp='';

				var length=data.length;
				for(var i=0;i<length;i++){
					trHTMLTmp=trHTML.replace('rpliver_id',data[i]['liver_id'])
									.replace('rpliver_name',data[i]['liver_name'])
									.replace('rpliver_password',data[i]['liver_password'])
									.replace('rpemail',data[i]['email']);
					$liverTable.append(trHTMLTmp);
				}
			}
		},
		error:function(){
			console.log('连接后台错误');
		}
	});
}
//修改赛程
function alterLiver(button){
	var $tr=$(button).parent().parent();
	var $liver_name=$tr.find('.liver_name');
	var $liver_password=$tr.find('.liver_password');
	var $email=$tr.find('.email');
	var $operation1=$tr.find('.operation1');
	var $operation2=$tr.find('.operation2');


	var liver_name=$liver_name.text();
	var liver_password=$liver_password.text();
	var email=$email.text();

	var liver_nameHTML="<input type='text' value='"+liver_name+"' />";
	var liver_passwordHTML="<input type='text' value='"+liver_password+"' />";
	var emailHTML="<input type='text' value='"+email+"' />";
	var operation1HTML='<button type="button" class="myButton" onclick="confirmAlterLiver(this)">确认</button>';
	var operation2HTML='<button type="button" class="myButton" onclick="cancelAlterLiver()">取消</button>';

	$liver_name.html(liver_nameHTML);
	$liver_password.html(liver_passwordHTML);
	$email.html(emailHTML);
	$operation1.html(operation1HTML);
	$operation2.html(operation2HTML);
}
//删除直播员
function deleteLiver(button){
	var $tr=$(button).parent().parent();
	var liver_id=$tr.find('.liver_id').text();

	var sql="delete from liver where liver_id="+liver_id+";";
	$.ajax({
		type:'GET',
		url:"../../php/noReturnQuery.php",
		data:{
			sql:sql
		},
		success:function(data){
			if (data == 1) {
				getLiver();
			}
		},
		error:function(){
			console.log('连接后台错误');
		}
	});
}
//确认修改直播员
function confirmAlterLiver(button){
	var $tr=$(button).parent().parent();
	var $liver_id=$tr.find('.liver_id');
	var $liver_name=$tr.find('.liver_name');
	var $liver_password=$tr.find('.liver_password');
	var $email=$tr.find('.email');

	var liver_id=$liver_id.text();
	var liver_name=$liver_name.find('input').val();
	var liver_password=$liver_password.find('input').val();
	var email=$email.find('input').val();

	var sql="update liver "+
			"set liver_name='"+liver_name+"',"+
			"liver_password='"+liver_password+"',"+
			"email='"+email+"' "+
			"where liver_id="+liver_id+";";
	console.log(sql);
	$.ajax({
		type:'GET',
		url:"../../php/noReturnQuery.php",
		data:{
			sql:sql
		},
		success:function(data){
			if (data == 1) {
				getLiver();
			}
		},
		error:function(){
			console.log('连接后台错误');
		}
	});
}
//取消修改直播员
function cancelAlterLiver(){
	getLiver();
}
//添加直播员
function addLiver(){
	var trHTML='<tr>'+
				'<td class="liver_name"><input type="text" /></td>'+
				'<td class="liver_password"><input type="text" /></td>'+
				'<td class="email"><input type="text" /></td>'+
				'<td class="operation1"><button type="button" class="myButton" onclick="confirmAddLiver(this)">添加</button></td>'+
				'<td class="operation2"><button type="button" class="myButton" onclick="cancelAddLiver(this)">取消</button></td>'+
			   '</tr>';
	$('#liverTable .tableHeader').after(trHTML);
}
//确认添加赛程
function confirmAddLiver(button){
	var $tr=$(button).parent().parent();
	var $liver_name=$tr.find('.liver_name');
	var $liver_password=$tr.find('.liver_password');
	var $email=$tr.find('.email');

	var liver_name=$liver_name.find('input').val();
	var liver_password=$liver_password.find('input').val();
	var email=$email.find('input').val();

	var sql="insert into liver "+
			"(liver_name,liver_password,email) "+
			"values "+
			"('"+liver_name+"','"+liver_password+"','"+email+"');";
	console.log(sql);
	$.ajax({
		type:'GET',
		url:"../../php/noReturnQuery.php",
		data:{
			sql:sql
		},
		success:function(data){
			if (data == 1) {
				getLiver();
			}
		},
		error:function(){
			console.log('连接后台错误');
		}
	});
}
//取消添加直播员
function cancelAddLiver(button){
	$(button).parent().parent().remove();
}