var gameCount=0;//每次取得赛程的天数
var lastDate='';//最后加载的日期

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
function getSchedule(date){
	if(date == undefined){
		date=getDateString();
	}
	// var nextDate=getNextDate(date,4);
	var sql="select schedule.*,t1.logo as guest_logo,t2.logo as home_logo "+
 			"from schedule,team as t1,team as t2 "+
 			"where schedule_date='"+date+"' "+
 			"and t1.team_id=schedule.guest_id "+
 			"and t2.team_id=schedule.home_id "+
 			"order by schedule.schedule_date,schedule.schedule_time;";
 	$.ajax({
		type:'GET',
		url:"../../../php/hasReturnQuery.php",
		data:{
			sql:sql
		},
		dataType:'json',
		success:function(data){
			var $scheduleBox=$('#scheduleBox');
			// if(gameCount == 0)$scheduleBox.html('');
			if($scheduleBox.find('.loading').length != 0){
				$scheduleBox.find('.loading').remove();
			}
			var scheduleListHTML=
			'<div class="scheduleList">'+
				'<p class="scheduleDate">'+getDateWeekString(date)+'</p>'+
			'</div>';
			$scheduleBox.append(scheduleListHTML);
			if (data != '') {
				var scheduleDetailHTML=
				'<div class="scheduleDetail">'+
					'<p class="guestImgP">'+
						'<img src="../../rpguestLogo" class="guestImg">'+
					'</p><!--'+
					'--><p class="guestWordP">'+
						'<span class="guestScore">rpguestScore</span>'+
						'<span class="guestName">rpguestName</span>'+
					'</p><!--'+
					'--><p class="statusP">rpstatus</p><!--'+
					'--><p class="homeWordP">'+
						'<span class="homeScore">rphomeScore</span>'+
						'<span class="homeName">rphomeName</span>'+
					'</p><!--'+
					'--><p class="homeImgP">'+
						'<img src="../../rphomeLogo" class="homeImg">'+
					'</p>'+
				'</div>';

				var scheduleDetailHTMLTmp='';
				var length=data.length;
				for(var i=0;i<length;i++){
					scheduleDetailHTMLTmp=
				  scheduleDetailHTML.replace('rpstatus',data[i]['schedule_time'].substring(0,5))
									.replace('rpguestLogo',data[i]['guest_logo'])
									.replace('rpguestName',data[i]['guest_name'])
									.replace('rpguestScore',0)
									.replace('rphomeLogo',data[i]['home_logo'])
									.replace('rphomeName',data[i]['home_name'])
									.replace('rphomeScore',0);
					$scheduleBox.find('.scheduleList:last').append(scheduleDetailHTMLTmp);
					checkScoreTime(data[i],$scheduleBox.find('.scheduleList:last .scheduleDetail:last'));
				}
			}else{
				var p='<p class="empty">今天无比赛</p>';
				$scheduleBox.find('.scheduleList:last').append(p);
			}
			gameCount++;
			lastDate=date;
			if(gameCount<5){
				getSchedule(getNextDate(date,1));
			}
		},
		error:function(){
			console.log('连接后台出错');
		}
	});
}
//检查赛事比分，时间
function checkScoreTime(mydata,$scheduleDetail){
 	var table='livingroom'+
		 	  mydata['schedule_date'].split('-').join('')+
		 	  mydata['guest_id']+
		 	  mydata['home_id']+
		 	  mydata['schedule_id'];
	var sql="select * from "+table+";";
	$.ajax({
		type:'GET',
		url:"../../php/hasReturnQuery.php",
		data:{
			sql:sql
		},
		dataType:'json',
		success:function(data){
			if (data != '') {
				$scheduleDetail.find('.guestScore').text(data[0]['count_guest_score']);
				$scheduleDetail.find('.homeScore').text(data[0]['count_home_score']);
				switch(data[0]['end_flag']){
					case '0':{

					}break;
					case '1':{
						$scheduleDetail.find('.status').text('直播中');
					}break;
					case '2':{
						$scheduleDetail.find('.status').text('已结束');
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
//屏幕滚动动态加载赛程
function loadScheduleOnScroll(e){
	stopEventBubble(e);
	var sh=document.body.scrollHeight;
	var st=document.documentElement.scrollTop || document.body.scrollTop;
	var ch=document.documentElement.clientHeight|| document.body.clientHeight;
	console.log('网页正文全文高'+sh);
	console.log('网页被卷去的高'+st);
	console.log('网页可见区域高'+ch);
	console.log('--------------------------------');
	if(sh == (st + ch)){
		//到达页底，加载后5天赛程
		var p="<p style='padding:.5rem 0;' class='loading'>加载中...</p>";
		$('#scheduleBox').append(p);
		gameCount=0;
		getSchedule(getNextDate(lastDate,1));
	}
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
//取得从给定日期起的第day天日期
function getNextDate(date,offset){
	var dateArr=date.split('-');
	var year=parseInt(dateArr[0]);
	var month=parseInt(dateArr[1])-1;
	var day=parseInt(dateArr[2]);
	var mydate=new Date(year,month,day);
	var time=mydate.getTime();
	return getDateString(time+24*60*60*1000*offset);
}
//取得'2016-04-04 星期三'格式日期
function getDateWeekString(date){
	var dateArr=date.split('-');
	var year=parseInt(dateArr[0]);
	var month=parseInt(dateArr[1])-1;
	var day=parseInt(dateArr[2]);
	var mydate=new Date(year,month,day);
	var week=mydate.getDay();
	var word='';
	switch(week){
		case 0:{
			word='日';
		}break;
		case 1:{
			word='一';
		}break;
		case 2:{
			word='二';
		}break;
		case 3:{
			word='三';
		}break;
		case 4:{
			word='四';
		}break;
		case 5:{
			word='五';
		}break;
		case 6:{
			word='六';
		}break;
		default:break;
	}
	return date+' 星期'+word;
}
//阻止事件冒泡
function stopEventBubble(event){
	var e=event || window.event;
	if (e && e.stopPropagation){
		e.stopPropagation();    
	}else{
 		e.cancelBubble=true;
	}
}
//https://github.com/amsul/pickadate.js.git