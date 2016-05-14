//取得给定日期的赛程
function getSchedule(date){
	$('#scheduleDate').val(date);
	$('#today').text(date);

	var $scheduleTable=$('#scheduleTable');
	$scheduleTable.find('tr:not(.tableHeader)').remove();

	var sql="select * from schedule where schedule_date='"+date+"' order by schedule_time;";
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
							'<td class="schedule_id hidden">rpschedule_id</td>'+
							'<td class="guest_id hidden">rpguest_id</td>'+
							'<td class="guest_name">rpguest_name</td>'+
							'<td class="home_id hidden">rphome_id</td>'+
							'<td class="home_name">rphome_name</td>'+
							'<td class="schedule_date">rpschedule_date</td>'+
							'<td class="schedule_time">rpschedule_time</td>'+
							'<td class="liver_id hidden">rpliver_id2</td>'+
							'<td class="liver_name">rpliver_name</td>'+
							'<td class="operation1">'+
								'<button type="button" class="myButton" onclick="alterSchedule(this)">修改</button>'+
							'</td>'+
							'<td class="operation2">'+
								'<button type="button" class="myButton" onclick="deleteSchedule(this)">删除</button>'+
							'</td>'+
						   '</tr>';
				var trHTMLTmp='';

				var length=data.length;
				for(var i=0;i<length;i++){
					trHTMLTmp=trHTML.replace('rpschedule_id',data[i]['schedule_id'])
									.replace('rpguest_id',data[i]['guest_id'])
									.replace('rpguest_name',data[i]['guest_name'])
									.replace('rphome_id',data[i]['home_id'])
									.replace('rphome_name',data[i]['home_name'])
									.replace('rpschedule_date',data[i]['schedule_date'])
									.replace('rpschedule_time',data[i]['schedule_time'])
									.replace('rpliver_id2',data[i]['liver_id'])
									.replace('rpliver_name',data[i]['liver_name']);
					$scheduleTable.append(trHTMLTmp);
				}
			}
		},
		error:function(){
			console.log('连接后台错误');
		}
	});
}
//修改赛程
function alterSchedule(button){
	var $tr=$(button).parent().parent();
	var $guest_name=$tr.find('.guest_name');
	var $home_name=$tr.find('.home_name');
	var $schedule_date=$tr.find('.schedule_date');
	var $schedule_time=$tr.find('.schedule_time');
	var $liver_name=$tr.find('.liver_name');
	var $operation1=$tr.find('.operation1');
	var $operation2=$tr.find('.operation2');


	var guest_id=$tr.find('.guest_id').text();
	var guest_name=$guest_name.text();
	var home_id=$tr.find('.home_id').text();
	var home_name=$home_name.text();
	var schedule_date=$schedule_date.text();
	var schedule_time=$schedule_time.text();
	var liver_id=$tr.find('.liver_id').text();
	var liver_name=$liver_name.text();

	var teamNameHTML="";
	var schedule_dateHTML="<input type='date' value='"+schedule_date+"' />";
	var schedule_timeHTML="<input type='time' value='"+schedule_time+"' />";
	var liver_nameHTML="";
	var operation1HTML='<button type="button" class="myButton" onclick="confirmAlterSchedule(this)">确认</button>';
	var operation2HTML='<button type="button" class="myButton" onclick="cancelAlterSchedule()">取消</button>';

	$schedule_date.html(schedule_dateHTML);
	$schedule_time.html(schedule_timeHTML);
	$operation1.html(operation1HTML);
	$operation2.html(operation2HTML);

	var sqlTeam="select team_id,team_short_name from team;";
	var sqlLiver="select liver_id,liver_name from liver;";

	$.ajax({
		type:'GET',
		url:"../../php/hasReturnQuery.php",
		data:{
			sql:sqlTeam
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
				teamNameHTML="<select>"+optionHTMLTmp+"</select>";
				$guest_name.html(teamNameHTML);
				$home_name.html(teamNameHTML);
				$guest_name.find('select').val(guest_id);
				$home_name.find('select').val(home_id);
			}
		},
		error:function(){
			console.log('连接后台错误');
		}
	});

	$.ajax({
		type:'GET',
		url:"../../php/hasReturnQuery.php",
		data:{
			sql:sqlLiver
		},
		dataType:'json',
		success:function(data){
			if (data != '') {
				var optionHTML="<option value='rpvalue'>rpname</option>";
				var optionHTMLTmp='';
				var length=data.length;
				for(var i=0;i<length;i++){
					optionHTMLTmp+=optionHTML.replace('rpvalue',data[i]['liver_id'])
											 .replace('rpname',data[i]['liver_name']);
				}
				liver_nameHTML="<select>"+optionHTMLTmp+"</select>";
				$liver_name.html(liver_nameHTML);
				$liver_name.find('select').val(liver_id);
			}
		},
		error:function(){
			console.log('连接后台错误');
		}
	});
}
//确认修改赛程
function confirmAlterSchedule(button){
	var $tr=$(button).parent().parent();
	var $schedule_id=$tr.find('.schedule_id');
	var $guest_name=$tr.find('.guest_name');
	var $home_name=$tr.find('.home_name');
	var $schedule_date=$tr.find('.schedule_date');
	var $schedule_time=$tr.find('.schedule_time');
	var $liver_name=$tr.find('.liver_name');
	var $operation1=$tr.find('.operation1');
	var $operation2=$tr.find('.operation2');

	var schedule_id=$schedule_id.text();
	var guest_id=$guest_name.find('select option:selected').val();
	var guest_name=$guest_name.find('select option:selected').text();
	var home_id=$home_name.find('select option:selected').val();
	var home_name=$home_name.find('select option:selected').text();
	var schedule_date=$schedule_date.find('input').val();
	var schedule_time=$schedule_time.find('input').val();
	var liver_id=$liver_name.find('select option:selected').val();
	var liver_name=$liver_name.find('select option:selected').text();

	var sql="update schedule "+
			"set guest_id="+guest_id+","+
			"guest_name='"+guest_name+"',"+
			"home_id="+home_id+","+
			"home_name='"+home_name+"',"+
			"liver_id="+liver_id+","+
			"liver_name='"+liver_name+"',"+
			"schedule_date='"+schedule_date+"',"+
			"schedule_time='"+schedule_time+"' "+
			"where schedule_id="+schedule_id+";";
	$.ajax({
		type:'GET',
		url:"../../php/noReturnQuery.php",
		data:{
			sql:sql
		},
		success:function(data){
			if (data == 1) {
				getSchedule($('#today').text());
			}
		},
		error:function(){
			console.log('连接后台错误');
		}
	});
}
//取消修改赛程
function cancelAlterSchedule(){
	getSchedule($('#today').text());
}
//删除赛程
function deleteSchedule(button){
	var $tr=$(button).parent().parent();
	var schedule_id=$tr.find('.schedule_id').text();

	var sql="delete from schedule where schedule_id="+schedule_id+";";
	$.ajax({
		type:'GET',
		url:"../../php/noReturnQuery.php",
		data:{
			sql:sql
		},
		success:function(data){
			if (data == 1) {
				getSchedule($('#today').text());
			}
		},
		error:function(){
			console.log('连接后台错误');
		}
	});
}
//查询输入日期的赛程
function scheduleDateQuery(){
	getSchedule($('#scheduleDate').val());
}
//上一天赛程
function lastDay(){
	var today=$('#today').text();
	var todayMs=getMs(today);
	var lastDayMs=todayMs-24*60*60*1000;
	getSchedule(getDateString(lastDayMs));

}
//下一天赛程
function nextDay(){
	var today=$('#today').text();
	var todayMs=getMs(today);
	var nextDayMs=todayMs+24*60*60*1000;
	getSchedule(getDateString(nextDayMs));
}
//返回今天赛程
function backToday(){
	getSchedule(getDateString());
}
//添加赛程
function addSchedule(){
	var trHTML='<tr>'+
				'<td class="guest_name"><select>rpTeamNameSelect1</select></td>'+
				'<td class="home_name"><select>rpTeamNameSelect2</select></td>'+
				'<td class="schedule_date"><input type="date" value="'+$('#today').text()+'" /></td>'+
				'<td class="schedule_time"><input type="time" value="08:00" /></td>'+
				'<td class="liver_name"><select>rpliverNameSelect</select></td>'+
				'<td class="operation1"><button type="button" class="myButton" onclick="confirmAddSchedule(this)">添加</button></td>'+
				'<td class="operation2"><button type="button" class="myButton" onclick="cancelAddSchedule(this)">取消</button></td>'+
			   '</tr>';
	var sqlTeam="select team_id,team_short_name from team;";
	var sqlLiver="select liver_id,liver_name from liver;";
	$.ajax({
		type:'GET',
		url:"../../php/hasReturnQuery.php",
		data:{
			sql:sqlTeam
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
				trHTML=trHTML.replace('rpTeamNameSelect1',optionHTMLTmp);
				trHTML=trHTML.replace('rpTeamNameSelect2',optionHTMLTmp);
			}

			$.ajax({
				type:'GET',
				url:"../../php/hasReturnQuery.php",
				data:{
					sql:sqlLiver
				},
				dataType:'json',
				success:function(data){
					if (data != '') {
						var optionHTML="<option value='rpvalue'>rpname</option>";
						var optionHTMLTmp='';
						var length=data.length;
						for(var i=0;i<length;i++){
							optionHTMLTmp+=optionHTML.replace('rpvalue',data[i]['liver_id'])
											 		 .replace('rpname',data[i]['liver_name']);
						}
						trHTML=trHTML.replace('rpliverNameSelect',optionHTMLTmp);

						$('#scheduleTable .tableHeader').after(trHTML);
					}
				},
				error:function(){
					console.log('连接后台错误');
				}
			});
		},
		error:function(){
			console.log('连接后台错误');
		}
	});
}
//确认添加赛程
function confirmAddSchedule(button){
	var $tr=$(button).parent().parent();
	var $guest_name=$tr.find('.guest_name');
	var $home_name=$tr.find('.home_name');
	var $schedule_date=$tr.find('.schedule_date');
	var $schedule_time=$tr.find('.schedule_time');
	var $liver_name=$tr.find('.liver_name');
	var $operation1=$tr.find('.operation1');
	var $operation2=$tr.find('.operation2');

	var guest_id=$guest_name.find('select option:selected').val();
	var guest_name=$guest_name.find('select option:selected').text();
	var home_id=$home_name.find('select option:selected').val();
	var home_name=$home_name.find('select option:selected').text();
	var schedule_date=$schedule_date.find('input').val();
	var schedule_time=$schedule_time.find('input').val();
	var liver_id=$liver_name.find('select option:selected').val();
	var liver_name=$liver_name.find('select option:selected').text();

	var sql="insert into schedule "+
			"(schedule_date,schedule_time,home_id,guest_id,liver_id,home_name,guest_name,liver_name) "+
			"values "+
			"('"+schedule_date+"','"+schedule_time+"',"+home_id+","+guest_id+","+liver_id+",'"+home_name+"','"+guest_name+"','"+liver_name+"');";
	console.log(sql);
	$.ajax({
		type:'GET',
		url:"../../php/noReturnQuery.php",
		data:{
			sql:sql
		},
		success:function(data){
			if (data == 1) {
				getSchedule($('#today').text());
			}
		},
		error:function(){
			console.log('连接后台错误');
		}
	});
}
//取消添加赛程
function cancelAddSchedule(button){
	$(button).parent().parent().remove();
}
//取得2016-04-04格式日期
function getDateString(ms){
	var date='';
	if(ms == undefined){
		date=new Date();
	}else{
		date=new Date(ms);
	}
	var year=date.getFullYear();
	var month=date.getMonth()+1;
	var day=date.getDate();
	if(month<10)month='0'+month;
	if(day<10)day='0'+day;
	return year+"-"+month+'-'+day;
}
//取得日期的毫秒数
function getMs(date){
	var dateArr=date.split('-');
	var year=dateArr[0];
	var month=dateArr[1];
	var day=dateArr[2];
	year=parseInt(year);
	month=parseInt(month)-1;
	day=parseInt(day);
	var todayDate=new Date(year,month,day);
	return todayDate.getTime();
}