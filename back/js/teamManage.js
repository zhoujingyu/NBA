//取得球队
function getTeam(value){
	if(value == '')return;
	var sql="select * from team where ew='"+value+"' or division='"+value+"';";

	var $teamTable=$('#teamTable');
	$teamTable.find('tr:not(.tableHeader)').remove();

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
							'<td class="team_id hidden">rpteam_id</td>'+
							'<td class="team_name">rpteam_name</td>'+
							'<td class="team_short_name">rpteam_short_name</td>'+
							'<td class="ew">rpew</td>'+
							'<td class="division">rpdivision</td>'+
							'<td class="area">rparea</td>'+
							'<td class="gymnasium">rpgymnasium</td>'+
							'<td class="logo"><img src="../resrc" class="teamLogo"></td>'+
							'<td class="operation1">'+
								'<button type="button" class="myButton" onclick="alterTeam(this)">修改</button>'+
							'</td>'+
							'<td class="operation2">'+
								'<button type="button" class="myButton" onclick="deleteTeam(this)">删除</button>'+
							'</td>'+
						   '</tr>';
				var trHTMLTmp='';

				var length=data.length;
				for(var i=0;i<length;i++){
					trHTMLTmp=trHTML.replace('rpteam_id',data[i]['team_id'])
									.replace('rpteam_name',data[i]['team_name'])
									.replace('rpteam_short_name',data[i]['team_short_name'])
									.replace('rpew',data[i]['ew'])
									.replace('rpdivision',data[i]['division'])
									.replace('rparea',data[i]['area'])
									.replace('rpgymnasium',data[i]['gymnasium'])
									.replace('resrc',data[i]['logo']);
					$teamTable.append(trHTMLTmp);
				}
			}
		},
		error:function(){
			console.log('连接后台错误');
		}
	});
}
//修改球队
function alterTeam(button){
	var $tr=$(button).parent().parent();
	var $team_name=$tr.find('.team_name');
	var $team_short_name=$tr.find('.team_short_name');
	var $ew=$tr.find('.ew');
	var $division=$tr.find('.division');
	var $area=$tr.find('.area');
	var $gymnasium=$tr.find('.gymnasium');
	var $operation1=$tr.find('.operation1');
	var $operation2=$tr.find('.operation2');

	var team_name=$team_name.text();
	var team_short_name=$team_short_name.text();
	var ew=$ew.text();
	var division=$division.text();
	var area=$area.text();
	var gymnasium=$gymnasium.text();

	var team_nameHTML="<input type='text' value='"+team_name+"' />";
	var team_short_nameHTML="<input type='text' value='"+team_short_name+"' />";
	var ewHTML='<select>'+
					'<option value="east">东部</option>'+
					'<option value="west">西部</option>'+
				'</select>';
	var divisionHTML='<select>'+
						'<option value="西南区">西南区</option>'+
						'<option value="西北区">西北区</option>'+
						'<option value="太平洋区">太平洋区</option>'+
						'<option value="东南区">东南区</option>'+
						'<option value="中区">中区</option>'+
						'<option value="大西洋区">大西洋区</option>'+
					 '</select>';
	var areaHTML="<input type='text' value='"+area+"' />";
	var gymnasiumHTML="<input type='text' value='"+gymnasium+"' />";
	var operation1HTML='<button type="button" class="myButton" onclick="confirmAlterTeam(this)">确认</button>';
	var operation2HTML='<button type="button" class="myButton" onclick="cancelAlterTeam(\''+ew+'\')">取消</button>';

	$team_name.html(team_nameHTML);
	$team_short_name.html(team_short_nameHTML);
	$ew.html(ewHTML);
	$division.html(divisionHTML);
	$area.html(areaHTML);
	$gymnasium.html(gymnasiumHTML);
	$operation1.html(operation1HTML);
	$operation2.html(operation2HTML);

	$ew.find('select').val(ew);
	$division.find('select').val(division);
}
//删除球队
function deleteTeam(button){
	var $tr=$(button).parent().parent();
	var team_id=$tr.find('.team_id').text();

	var sql="delete from team where team_id="+team_id+";";
	$.ajax({
		type:'GET',
		url:"../../php/noReturnQuery.php",
		data:{
			sql:sql
		},
		success:function(data){
			if (data == 1) {
				getTeam('east');
			}
		},
		error:function(){
			console.log('连接后台错误');
		}
	});
}
//确认修改球队
function confirmAlterTeam(button){
	var $tr=$(button).parent().parent();
	var $team_id=$tr.find('.team_id');
	var $team_name=$tr.find('.team_name');
	var $team_short_name=$tr.find('.team_short_name');
	var $ew=$tr.find('.ew');
	var $division=$tr.find('.division');
	var $area=$tr.find('.area');
	var $gymnasium=$tr.find('.gymnasium');

	var team_id=$team_id.text();
	var team_name=$team_name.find('input').val();
	var team_short_name=$team_short_name.find('input').val();
	var ew=$ew.find('select option:selected').val();
	var division=$division.find('select option:selected').val();
	var area=$area.find('input').val();
	var gymnasium=$gymnasium.find('input').val();

	var sql="update team "+
			"set team_name='"+team_name+"',"+
			"team_short_name='"+team_short_name+"',"+
			"ew='"+ew+"',"+
			"division='"+division+"',"+
			"area='"+area+"',"+
			"gymnasium='"+gymnasium+"' "+
			"where team_id="+team_id+";";
	console.log(sql);
	$.ajax({
		type:'GET',
		url:"../../php/noReturnQuery.php",
		data:{
			sql:sql
		},
		success:function(data){
			if (data == 1) {
				getTeam(ew);
			}
		},
		error:function(){
			console.log('连接后台错误');
		}
	});
}
//取消修改球队
function cancelAlterTeam(value){
	getTeam(value);
}
//添加球队
function addTeam(){
	var trHTML='<tr>'+
				'<td class="team_name"><input type="text" /></td>'+
				'<td class="team_short_name"><input type="text" /></td>'+
				'<td class="ew">'+
					'<select>'+
						'<option value="east">东部</option>'+
						'<option value="west">西部</option>'+
					'</select>'+
				'</td>'+
				'<td class="division">'+
					'<select>'+
						'<option value="西南区">西南区</option>'+
						'<option value="西北区">西北区</option>'+
						'<option value="太平洋区">太平洋区</option>'+
						'<option value="东南区">东南区</option>'+
						'<option value="中区">中区</option>'+
						'<option value="大西洋区">大西洋区</option>'+
					 '</select>'+
				'</td>'+
				'<td class="area"><input type="text" /></td>'+
				'<td class="gymnasium"><input type="text" /></td>'+
				'<td class="logo">暂无图片</td>'+
				'<td class="operation1"><button type="button" class="myButton" onclick="confirmAddTeam(this)">添加</button></td>'+
				'<td class="operation2"><button type="button" class="myButton" onclick="cancelAddTeam(this)">取消</button></td>'+
			   '</tr>';

	$('#teamTable .tableHeader').after(trHTML);
}
//确认添加球队
function confirmAddTeam(button){
	var $tr=$(button).parent().parent();
	var $team_name=$tr.find('.team_name');
	var $team_short_name=$tr.find('.team_short_name');
	var $ew=$tr.find('.ew');
	var $division=$tr.find('.division');
	var $area=$tr.find('.area');
	var $gymnasium=$tr.find('.gymnasium');

	var team_name=$team_name.find('input').val();
	var team_short_name=$team_short_name.find('input').val();
	var ew=$ew.find('select option:selected').val();
	var division=$division.find('select option:selected').text();
	var area=$area.find('input').val();
	var gymnasium=$gymnasium.find('input').val();

	var sql="insert into team "+
			"(team_name,team_short_name,ew,division,area,gymnasium) "+
			"values "+
			"('"+team_name+"','"+team_short_name+"','"+ew+"','"+division+"','"+area+"','"+gymnasium+"');";
	console.log(sql);
	$.ajax({
		type:'GET',
		url:"../../php/noReturnQuery.php",
		data:{
			sql:sql
		},
		success:function(data){
			if (data == 1) {
				getTeam(ew);
			}
		},
		error:function(){
			console.log('连接后台错误');
		}
	});
}
//取消添加球队
function cancelAddTeam(button){
	$(button).parent().parent().remove();
}