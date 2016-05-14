//设置分区
function setDataEwSelect(){
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

				$('#dataEastSelect').html(optionEHTMLTmp);
				$('#dataWestSelect').html(optionWHTMLTmp);
			}
		},
		error:function(){
			console.log('连接后台错误');
		}
	});
}
//取得球员数据
function getData(team_id){
	if(team_id == undefined){
		team_id=1;
	}

	var $dataTable=$('#dataTable');
	$dataTable.find('tr:not(.tableHeader)').remove();

	var sql="select statistics.*,player.player_name,team.team_short_name "+
			"from statistics,player,team "+
			"where statistics.team_id="+team_id+" "+
			"and statistics.player_id=player.player_id "+
			"and statistics.team_id=player.team_id "+
			"and statistics.team_id=team.team_id;";
	$.ajax({
		type:'GET',
		url:"../../php/hasReturnQuery.php",
		data:{
			sql:sql
		},
		dataType:'json',
		success:function(data){
			if (data != '') {
				var minuDataButton='<button type="button" class="dataButton" onclick="minuData(this);">-</button>';
				var addDataButton='<button type="button" class="dataButton" onclick="addData(this);">+</button>';
				var onkeypressHTML='onkeypress="return isNum(event)"';
				var oninputHTML='oninput="updateData(this,this.value)"';
				var trHTML='<tr>'+
							'<td class="player_id hidden">rpplayer_id</td>'+
							'<td class="player_name">rpplayer_name</td>'+
							'<td class="score">'+
								minuDataButton+
								'<input type="text" class="dataIpunt scoreInput" '+oninputHTML+' '+onkeypressHTML+' value="rpscore" key="score" />'+
								addDataButton+
							'</td>'+
							'<td class="backboard">'+
								minuDataButton+
								'<input type="text" class="dataIpunt backboardInput" '+oninputHTML+' '+onkeypressHTML+' value="rpbackboard" key="backboard" />'+
								addDataButton+
							'</td>'+
							'<td class="assists">'+
								minuDataButton+
								'<input type="text" class="dataIpunt assistsInput" '+oninputHTML+' '+onkeypressHTML+' value="rpassists" key="assists" />'+
								addDataButton+
							'</td>'+
							'<td class="steal">'+
								minuDataButton+
								'<input type="text" class="dataIpunt stealInput" '+oninputHTML+' '+onkeypressHTML+' value="rpsteal" key="steal" />'+
								addDataButton+
							'</td>'+
							'<td class="block">'+
								minuDataButton+
								'<input type="text" class="dataIpunt blockInput" '+oninputHTML+' '+onkeypressHTML+' value="rpblock" key="block" />'+
								addDataButton+
							'</td>'+
							'<td class="error">'+
								minuDataButton+
								'<input type="text" class="dataIpunt errorInput" '+oninputHTML+' '+onkeypressHTML+' value="rperror" key="error" />'+
								addDataButton+
							'</td>'+
							'<td class="3point">'+
								minuDataButton+
								'<input type="text" class="dataIpunt 3pointInput" '+oninputHTML+' '+onkeypressHTML+' value="rp3point" key="3point" />'+
								addDataButton+
							'</td>'+
							'<td class="foul">'+
								minuDataButton+
								'<input type="text" class="dataIpunt foulInput" '+oninputHTML+' '+onkeypressHTML+' value="rpfoul" key="foul" />'+
								addDataButton+
							'</td>'+
							'<td class="free_throw">'+
								minuDataButton+
								'<input type="text" class="dataIpunt free_throwInput" '+oninputHTML+' '+onkeypressHTML+' value="rpfree_throw" key="free_throw" />'+
								addDataButton+
							'</td>'+
							'<td class="played_game">'+
								minuDataButton+
								'<input type="text" class="dataIpunt played_gameInput" '+oninputHTML+' '+onkeypressHTML+' value="rpplayed_game" key="played_game" />'+
								addDataButton+
							'</td>'+
							'<td class="team_id hidden">rpteam_id</td>'+
							'<td class="team_short_name">rpteam_short_name</td>'+
						   '</tr>';
				var trHTMLTmp='';

				var length=data.length;
				for(var i=0;i<length;i++){
					trHTMLTmp=trHTML.replace('rpplayer_id',data[i]['player_id'])
									.replace('rpplayer_name',data[i]['player_name'])
									.replace('rpscore',data[i]['score'])
									.replace('rpbackboard',data[i]['backboard'])
									.replace('rpassists',data[i]['assists'])
									.replace('rpsteal',data[i]['steal'])
									.replace('rpblock',data[i]['block'])
									.replace('rperror',data[i]['error'])
									.replace('rp3point',data[i]['3point'])
									.replace('rpfoul',data[i]['foul'])
									.replace('rpfree_throw',data[i]['free_throw'])
									.replace('rpplayed_game',data[i]['played_game'])
									.replace('rpteam_id',data[i]['team_id'])
									.replace('rpteam_short_name',data[i]['team_short_name']);
					$dataTable.append(trHTMLTmp);
				}
			}
		},
		error:function(){
			console.log('连接后台错误');
		}
	});
}
//输入数字，更新数据库数据
function updateData(input,value){
	var $tr=$(input).parent().parent();
	var key=$(input).attr('key');
	var player_id=$tr.find('.player_id').text();
	var sql="update statistics "+
			"set "+key+"="+value+" "+
			"where player_id="+player_id+";";
	console.log(sql);
	$.ajax({
		type:'GET',
		url:"../../php/noReturnQuery.php",
		data:{
			sql:sql
		},
		success:function(data){
			console.log(data);
		},
		error:function(){
			console.log('连接后台错误');
		}
	});
}
//数据减1
function minuData(button){
	var $tr=$(button).parent().parent();
	var value=$(button).siblings('input').val();
	var key=$(button).siblings('input').attr('key');
	var player_id=$tr.find('.player_id').text();
	value=parseInt(value);
	if(isNaN(value))return false;
	if(value <= 0)return false;
	value--;

	var sql="update statistics "+
			"set "+key+"="+value+" "+
			"where player_id="+player_id+";";
	console.log(sql);
	$.ajax({
		type:'GET',
		url:"../../php/noReturnQuery.php",
		data:{
			sql:sql
		},
		success:function(data){
			if(data == 1){
				$(button).siblings('input').val(value);
			}
		},
		error:function(){
			console.log('连接后台错误');
		}
	});
}
//数据加1
function addData(button){
	var $tr=$(button).parent().parent();
	var value=$(button).siblings('input').val();
	var key=$(button).siblings('input').attr('key');
	var player_id=$tr.find('.player_id').text();
	value=parseInt(value);
	if(isNaN(value))return false;
	value++;

	var sql="update statistics "+
			"set "+key+"="+value+" "+
			"where player_id="+player_id+";";
	$.ajax({
		type:'GET',
		url:"../../php/noReturnQuery.php",
		data:{
			sql:sql
		},
		success:function(data){
			if(data == 1){
				$(button).siblings('input').val(value);
			}
		},
		error:function(){
			console.log('连接后台错误');
		}
	});
}
//检查输入的是否为数字
function isNum(e) {
	var k = window.event ? e.keyCode : e.which;
	if (((k >= 48) && (k <= 57)) || k == 8 || k == 0) {

	} else {
		if (window.event) {
			window.event.returnValue = false;
		}
		else {
			e.preventDefault(); //for firefox 
		}
	}
} 