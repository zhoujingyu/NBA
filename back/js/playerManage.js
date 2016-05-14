//设置分区
function setEwSelect(){
	var sqlEw="select team_id,team_short_name,ew from team;";

	$.ajax({
		type:'GET',
		url:"../../php/hasReturnQuery.php",
		data:{
			sql:sqlEw
		},
		dataType:'json',
		success:function(data){
			if (data != '') {
				var optionHTML="<option value='rpvalue'>rpname</option>";
				var optionEHTMLTmp='<option></option>';
				var optionWHTMLTmp='<option></option>';
				var length=data.length;
				for(var i=0;i<length;i++){
					if(data[i]['ew'] == 'west'){
						optionWHTMLTmp+=optionHTML.replace('rpvalue',data[i]['team_id'])
											 	  .replace('rpname',data[i]['team_short_name']);
					}else if(data[i]['ew'] == 'east'){
						optionEHTMLTmp+=optionHTML.replace('rpvalue',data[i]['team_id'])
											 	  .replace('rpname',data[i]['team_short_name']);
					}
				}

				$('#playerEastSelect').html(optionEHTMLTmp);
				$('#playerWestSelect').html(optionWHTMLTmp);
			}
		},
		error:function(){
			console.log('连接后台错误');
		}
	});
}
//取得球员
function getPlayer(team_id){
	if(team_id == undefined){
		team_id=1;
	}

	var $playerTable=$('#playerTable');
	$playerTable.find('tr:not(.tableHeader)').remove();

	var sql="select player.*,team_short_name "+
			"from player,team "+
			"where player.team_id="+team_id+" and player.team_id=team.team_id;";
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
							'<td class="player_id hidden">rpplayer_id</td>'+
							'<td class="player_name">rpplayer_name</td>'+
							'<td class="team_id hidden">rpteam_id</td>'+
							'<td class="team_short_name">rpteam_short_name</td>'+
							'<td class="position">rpposition</td>'+
							'<td class="operation1">'+
								'<button type="button" class="myButton" onclick="alterPlayer(this)">修改</button>'+
							'</td>'+
							'<td class="operation2">'+
								'<button type="button" class="myButton" onclick="deletePlayer(this)">删除</button>'+
							'</td>'+
						   '</tr>';
				var trHTMLTmp='';

				var length=data.length;
				for(var i=0;i<length;i++){
					trHTMLTmp=trHTML.replace('rpplayer_id',data[i]['player_id'])
									.replace('rpplayer_name',data[i]['player_name'])
									.replace('rpteam_id',data[i]['team_id'])
									.replace('rpteam_short_name',data[i]['team_short_name'])
									.replace('rpposition',data[i]['position']);
					$playerTable.append(trHTMLTmp);
				}
			}
		},
		error:function(){
			console.log('连接后台错误');
		}
	});
}
//修改球员
function alterPlayer(button){
	var $tr=$(button).parent().parent();
	var $player_name=$tr.find('.player_name');
	var $team_id=$tr.find('.team_id');
	var $team_short_name=$tr.find('.team_short_name');
	var $position=$tr.find('.position');
	var $operation1=$tr.find('.operation1');
	var $operation2=$tr.find('.operation2');

	var player_name=$player_name.text();
	var team_id=$team_id.text();
	var team_short_name=$team_short_name.text();
	var position=$position.text();

	var player_nameHTML="<input type='text' value='"+player_name+"' />";
	var team_short_nameHTML="";
	var positionHTML="<input type='text' value='"+position+"' />";
	var operation1HTML='<button type="button" class="myButton" onclick="confirmAlterPlayer(this)">确认</button>';
	var operation2HTML='<button type="button" class="myButton" onclick="cancelAlterPlayer('+team_id+')">取消</button>';

	$player_name.html(player_nameHTML);
	$position.html(positionHTML);
	$operation1.html(operation1HTML);
	$operation2.html(operation2HTML);

	var sql="select team_id,team_short_name from team;";

	$.ajax({
		type:'GET',
		url:"../../php/hasReturnQuery.php",
		data:{
			sql:sql
		},
		dataType:'json',
		success:function(data){
			if (data != '') {
				var optionHTML="<option value='rpvalue'>rpname</option>";
				var optionHTMLTmp='';
				var length=data.length;
				for(var i=0;i<length;i++){
					optionHTMLTmp+=optionHTML.replace('rpvalue',data[i]['team_id'])
											 .replace('rpname',data[i]['team_short_name']);
				}
				team_short_nameHTML="<select>"+optionHTMLTmp+"</select>";
				$team_short_name.html(team_short_nameHTML);
				$team_short_name.find('select').val(team_id);
			}
		},
		error:function(){
			console.log('连接后台错误');
		}
	});

}
//删除球员
function deletePlayer(button){
	var $tr=$(button).parent().parent();
	var player_id=$tr.find('.player_id').text();
	var team_id=$tr.find('.team_id').text();

	var sql="delete from player where player_id="+player_id+";";
	$.ajax({
		type:'GET',
		url:"../../php/noReturnQuery.php",
		data:{
			sql:sql
		},
		success:function(data){
			if (data == 1) {
				getPlayer(team_id);
			}
		},
		error:function(){
			console.log('连接后台错误');
		}
	});
}
//确认修改球员
function confirmAlterPlayer(button){
	var $tr=$(button).parent().parent();
	var $player_id=$tr.find('.player_id');
	var $player_name=$tr.find('.player_name');
	var $team_short_name=$tr.find('.team_short_name');
	var $position=$tr.find('.position');
	var $operation1=$tr.find('.operation1');
	var $operation2=$tr.find('.operation2');

	var player_id=$player_id.text();
	var player_name=$player_name.find('input').val();
	var team_id=$team_short_name.find('select option:selected').val();
	var position=$position.find('input').val();

	var sql="update player "+
			"set player_name='"+player_name+"',"+
			"team_id="+team_id+","+
			"position='"+position+"' "+
			"where player_id="+player_id+";";
	console.log(sql);
	$.ajax({
		type:'GET',
		url:"../../php/noReturnQuery.php",
		data:{
			sql:sql
		},
		success:function(data){
			if (data == 1) {
				getPlayer(team_id);
			}
		},
		error:function(){
			console.log('连接后台错误');
		}
	});
}
//取消修改球员
function cancelAlterPlayer(team_id){
	getPlayer(team_id);
}
//添加球员
function addPlayer(){
	var trHTML='<tr>'+
				'<td class="player_name"><input type="text" /></td>'+
				'<td class="team_short_name"><select>rpteam_short_name</select></td>'+
				'<td class="position"><input type="text" /></td>'+
				'<td class="operation1"><button type="button" class="myButton" onclick="confirmAddPlarer(this)">添加</button></td>'+
				'<td class="operation2"><button type="button" class="myButton" onclick="cancelAddPlarer(this)">取消</button></td>'+
			   '</tr>';
	var sql="select team_id,team_short_name from team;";
	$.ajax({
		type:'GET',
		url:"../../php/hasReturnQuery.php",
		data:{
			sql:sql
		},
		dataType:'json',
		success:function(data){
			if (data != '') {
				var optionHTML="<option value='rpvalue'>rpname</option>";
				var optionHTMLTmp='';
				var length=data.length;
				for(var i=0;i<length;i++){
					optionHTMLTmp+=optionHTML.replace('rpvalue',data[i]['team_id'])
											 .replace('rpname',data[i]['team_short_name']);
				}
				trHTML=trHTML.replace('rpteam_short_name',optionHTMLTmp);

			}
			$('#playerTable .tableHeader').after(trHTML);
			var team_id=$('#playerTable tr:last .team_id').text();
			$('#playerTable tr:nth-child(2) .team_short_name select').val(team_id);

		},
		error:function(){
			console.log('连接后台错误');
		}
	});
}
//确认添加球员
function confirmAddPlarer(button){
	var $tr=$(button).parent().parent();
	var $player_name=$tr.find('.player_name');
	var $team_short_name=$tr.find('.team_short_name');
	var $position=$tr.find('.position');

	var player_name=$player_name.find('input').val();
	var team_id=$team_short_name.find('select option:selected').val();
	var position=$position.find('input').val();

	var sql="insert into player "+
			"(player_name,team_id,position) "+
			"values "+
			"('"+player_name+"',"+team_id+",'"+position+"');";
	console.log(sql);
	$.ajax({
		type:'GET',
		url:"../../php/noReturnQuery.php",
		data:{
			sql:sql
		},
		success:function(data){
			if (data == 1) {
				getPlayer(team_id);
			}
		},
		error:function(){
			console.log('连接后台错误');
		}
	});
}
//取消添加球员
function cancelAddPlarer(button){
	$(button).parent().parent().remove();
}