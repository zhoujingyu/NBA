$(function(){
	getSchedule();
})
//显示数据分类
function showDataSort(){
 	$('#dataSort').css('display')
 	if($('#dataSort').css('display') == 'none'){
		$('#dataSort').show();
 	}else{
		$('#dataSort').hide();
 	}
}
//取得赛程
function getSchedule(){
 	var date=getDateString();
 	var sql="select schedule.*,t1.logo as guest_logo,t2.logo as home_logo "+
 			"from schedule,team as t1,team as t2 "+
 			"where schedule_date='"+date+"' "+
 			"and t1.team_id=schedule.guest_id "+
 			"and t2.team_id=schedule.home_id "+
 			"order by schedule.schedule_time;";
 	$.ajax({
		type:'GET',
		url:"../php/hasReturnQuery.php",
		data:{
			sql:sql
		},
		dataType:'json',
		success:function(data){
			console.log(data);
			if (data != '') {
				var $scheduleUl=$('#scheduleUl');
				$scheduleUl.html('');
				var liHTML=
				'<li>'+
					'<a>'+
						'<span class="status">rpstatus</span>'+
						'<img src="rpguestLogo" class="guestLogo">'+
						'<span class="guestName">rpguestName</span>'+
						'<span class="guestScore">rpguestScore</span>'+
						'<hr>'+
						'<img src="rphomeLogo" class="homeLogo">'+
						'<span class="homeName">rphomeName</span>'+
						'<span class="homeScore">rphomeScore</span>'+
					'</a>'+
				'</li>';
				var liHTMLTmp='';
				var length=data.length;
				for(var i=0;i<length;i++){
					liHTMLTmp=liHTML.replace('rpstatus',data[i]['schedule_time'].substring(0,5))
									.replace('rpguestLogo',data[i]['guest_logo'])
									.replace('rpguestName',data[i]['guest_name'])
									.replace('rpguestScore',0)
									.replace('rphomeLogo',data[i]['home_logo'])
									.replace('rphomeName',data[i]['home_name'])
									.replace('rphomeScore',0);
					$scheduleUl.append(liHTMLTmp);
					checkScoreTime(data[i],$scheduleUl.find('li:last'));
				}
			}
		},
		error:function(){
			console.log('连接后台出错');
		}
	});
	setTimeout(function(){
		getSchedule();
	},10000);
}
//检查赛事比分，时间
function checkScoreTime(mydata,$li){
 	var table='livingroom'+
		 	  mydata['schedule_date'].split('-').join('')+
		 	  mydata['guest_id']+
		 	  mydata['home_id']+
		 	  mydata['schedule_id'];
	var sql="select * from "+table+";";
	$.ajax({
		type:'GET',
		url:"../php/hasReturnQuery.php",
		data:{
			sql:sql
		},
		dataType:'json',
		success:function(data){
			console.log(data);
			if (data != '') {
				$li.find('.guestScore').text(data[0]['count_guest_score']);
				$li.find('.homeScore').text(data[0]['count_home_score']);
				switch(data[0]['end_flag']){
					case '0':{

					}break;
					case '1':{
						$li.find('.status').text('直播中');
					}break;
					case '2':{
						$li.find('.status').text('已结束');
					}break;
					default:break;
				}
			}else{
				console.log('无此表：'+table);
			}
		},
		error:function(){
			console.log('无此表：'+table);
		}
	});
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