var liver_id='';//当前直播员id
var liver_name='';//当前直播员名字
var current_schedule_id=0;//当前赛程id
var current_section=0;//当前赛程第几节

$(function(){
	if(!sessionStorage.getItem('liver_id')){
		location.href='login/';
	}else{
		liver_id=sessionStorage.getItem('liver_id');
		liver_name=sessionStorage.getItem('liver_name');
	}
	$('#liver_name').text('我是'+liver_name+',我的直播↓')
	getSchedule();


	//鼠标已到直播文字上，显示隐藏删除按钮
	$('#wordBox').on('mouseover','.wordP',function(){
		$(this).find('.deleteButton').slideDown(200);
	})
	$('#wordBox').on('mouseleave','.wordP',function(){
		$(this).find('.deleteButton').slideUp(100);
	})

	//鼠标已到赛程上，显示隐藏结束按钮
	$('#rightBox').on('mouseover','.scheduleList',function(){
		$(this).find('.endGame').slideDown(200);
	})
	$('#rightBox').on('mouseleave','.scheduleList',function(){
		$(this).find('.endGame').slideUp(100);
	})
})
//显示直播文字box
function showLivingBox(){
	$('#livingSelector').addClass('borderBottom2');
	$('#dataSelector').removeClass('borderBottom2');
	$('#livingBox').show();
	$('#dataBox').hide();
}
//显示球员数据box
function showDataBox(){
	$('#livingSelector').removeClass('borderBottom2');
	$('#dataSelector').addClass('borderBottom2');
	$('#dataBox').show();
	$('#livingBox').hide();
}
//取得赛程
function getSchedule(){
	var date=getDateString();
	var sql="select * from schedule where schedule_date>='"+date+"' order by schedule_date";
	$.ajax({
		type:'GET',
		url:"../../php/hasReturnQuery.php",
		data:{
			sql:sql
		},
		dataType:'json',
		success:function(data){
			$('.rightBox .scheduleList').remove();
			if (data != '') {
				var scheduleListHTML='<div class="scheduleList borderBottom">'+
		 								'<p class="name textLeft">rpname</p><!--'+
		 								'--><p class="enterLiving textRight" onclick="enterLiving(\'rpschedule_id\',\'rptable\')">开启直播</p><!--'+
		 								'--><p class="datetime textLeft">rptime</p><!--'+
		 								'--><p class="status textRight">rpstatus</p><!--'+
		 								'--><p class="endGame textRight" style="width:100%;display:none">'+
		 								'<button type="button" class="endButton">结束本场比赛</button>'+
		 								'</p><!--'+
		 							 '</div>';
		 		var HTMLTmp='';
		 		var table='';
		 		var ms=0;
		 		var length=data.length;
		 		for(var i=0;i<length;i++){
		 			table='livingroom'+
		 				  data[i]['schedule_date'].split('-').join('')+
		 				  data[i]['guest_id']+
		 				  data[i]['home_id']+
		 				  data[i]['schedule_id'];
		 			HTMLTmp=scheduleListHTML.replace('rpname',data[i]['guest_name']+'VS'+data[i]['home_name'])
		 									.replace('rptime',data[i]['schedule_date']+','+data[i]['schedule_time'].substring(0,5))
		 									.replace('rpstatus',data[i]['schedule_time'].substring(0,5))
		 									.replace('rptable',table)
		 									.replace('rpschedule_id',data[i]['schedule_id']);
		 			$('.rightBox').append(HTMLTmp);	 			
		 			ms=getMs(data[i]['schedule_date'],data[i]['schedule_time']);
		 			checkGameStartOrNot($('.rightBox .scheduleList:last .status'),table,ms);
		 		}
			}
		},
		error:function(){
			console.log('连接后台错误');
		}
	});

}
//检查比赛是否开始
function checkGameStartOrNot($p,table,ms){
	var todayMs=getTodayMs();
	// console.log(todayMs+','+ms);
	if (todayMs < ms) {
		var remainTime=getRemainTime(todayMs,ms);
		$p.text(remainTime);
		setTimeout(function(){
			checkGameStartOrNot($p,table,ms);
		},1000)
		return;
	}

	var sql="select * from "+table+";";
	$.ajax({
		type:'GET',
		url:"../../php/hasReturnQuery.php",
		data:{
			sql:sql
		},
		dataType:'json',
		success:function(data){
			console.log(data);
			if (data != '') {
				
			}else{

			}
		},
		error:function(){
			console.log('连接后台错误'+table);
		}
	});
}
//开启直播
function enterLiving(schedule_id,table){
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
				initScoreBox(data);
			}else{
				initLivingroom(schedule_id,table);
			}
		},
		error:function(){
			console.log('进入直播间失败，即将建立直播间');
			//建立直播表
			$.ajax({
				type:'GET',
				url:"../../php/createLivingroom.php",
				data:{
					table:table
				},
				success:function(data){
					if(data == 1){
						console.log('建立直播间成功');
						initLivingroom(schedule_id,table);
					}
				},
				error:function(){
					console.log('建立直播表'+table+'失败');
				}
			});
		}
	});
}
//初始化直播间
function initLivingroom(schedule_id,table){
	var sql="select * from schedule where schedule_id="+schedule_id+";";
	$.ajax({
		type:'GET',
		url:"../../php/hasReturnQuery.php",
		data:{
			sql:sql
		},
		dataType:'json',
		success:function(data){
			if (data != '') {
				var sqlInsert="insert into "+table+" "+
							  "values "+
							  "("+
							  data[0]['schedule_id']+","+
							  data[0]['guest_id']+","+
							  "'"+data[0]['guest_name']+"',"+
							  data[0]['home_id']+","+
							  "'"+data[0]['home_name']+"',"+
							  data[0]['liver_id']+","+
							  "'"+data[0]['liver_name']+"',"+
							  "1,0,0,0,0,0,0,0,0,0,0,"+
							  "'12:00',0,0"
							  +");";
				$.ajax({
					type:'GET',
					url:"../../php/noReturnQuery.php",
					data:{
						sql:sqlInsert
					},
					success:function(data){
						enterLiving(schedule_id,table);
					},
					error:function(){
						console.log('初始化插入数据失败');
					}
				});
			}
		},
		error:function(){
			console.log('连接后台错误'+table);
		}
	});
}
//初始化比分Box
function initScoreBox(data){
	// console.log('数据是:'+data[0]['schedule_id']);
	current_schedule_id=data[0]['schedule_id'];
	current_section=data[0]['section'];
	//-------------初始化节-------------
	$('#sectionP .section').removeClass('selected');
	$('#sectionP .section:gt(3)').remove();
	if(data[0]['section'].indexOf('OT') != -1){
		//有加时
		var OTst=data[0]['section'].replace('OT','');
		OTst=parseInt(OTst);
		var OTSpan='<span id="rpid" class="section" section="rpsection">rptext</span>';
		var OTHTMLTmp='';
		var $addSection=$('#addSection');
		for(var i=1;i<=OTst;i++){
			OTHTMLTmp=OTSpan.replace('rpid','OT'+i)
							.replace('rpsection','OT'+i)
							.replace('rptext','OT'+i);
			if (i == OTst) {
				OTHTMLTmp=OTHTMLTmp.replace('section','section selected');
			}
			$addSection.before(OTHTMLTmp);
		}
	}else{
		$('#section'+data[0]['section']).addClass('selected');
	}
	//-------------初始化剩余时间-------------
	var remainArr=data[0]['remain_time'].split(':');
	$('#remainMinute').val(remainArr[0]);
	$('#remainSecond').val(remainArr[1]);
	//-------------初始化球队Logo-------------
	var sqlLogo="select t1.logo as guestLogo,t2.logo as homeLogo "+
				"from team as t1,team as t2 "+
				"where t1.team_id="+data[0]['guest_id']+" "+
				"and t2.team_id="+data[0]['home_id']+";";
	$.ajax({
		type:'GET',
		url:"../../php/hasReturnQuery.php",
		data:{
			sql:sqlLogo
		},
		dataType:'json',
		success:function(dataLogo){
			console.log(dataLogo);
			if (dataLogo != '') {
				$('#guestImg').attr('src','../'+dataLogo[0]['guestLogo']);
				$('#homeImg').attr('src','../'+dataLogo[0]['homeLogo']);
			}
		},
		error:function(){
			console.log('初始化球队Logo失败');
		}
	});
	//-------------初始化比分-------------
	var $tableHeader=$('#tableHeader');
	var $guestTr=$('#guestTr');
	var $homeTr=$('#homeTr');
	$tableHeader.find('td:gt(4):not(:last)').remove();
	$guestTr.find('td:gt(4):not(:last)').remove();
	$homeTr.find('td:gt(4):not(:last)').remove();
	if(data[0]['section'].indexOf('OT') != -1){
		var tableHeaderTdHTML='<td>第4节</td>';
		var TrTdHTML='<td>'+
							'<button type="button" class="scoreBotton">-</button>'+
							'<input type="text" id="rpid" class="scoreInput" value="rpvalue" onkeypress="return isNum(event)" />'+
							'<button type="button" class="scoreBotton">+</button>'+
						  '</td>';
		var tableHeaderTdHTMLTmp='';
		var guestTrTdHTMLTmp='';
		var homeTrTdHTMLTmp='';
		var scorelength=data[0]['section'].replace('OT','');
		scorelength=parseInt(scorelength);
		for(var i=1;i<=scorelength;i++){
			tableHeaderTdHTMLTmp=tableHeaderTdHTML.replace('第4节','加时'+i);
			guestTrTdHTMLTmp=TrTdHTML.replace('rpid','OT'+i+'GuestScorce')
										  .replace('rpvalue',data[0]['OT'+i+'_guest_score']);
			homeTrTdHTMLTmp=TrTdHTML.replace('rpid','OT'+i+'HomeScorce')
										  .replace('rpvalue',data[0]['OT'+i+'_home_score']);
			$tableHeader.find('td:last').before(tableHeaderTdHTMLTmp);
			$guestTr.find('td:last').before(guestTrTdHTMLTmp);
			$homeTr.find('td:last').before(guestTrTdHTMLTmp);
		}
	}
	$guestTr.find('#guest_name').text(data[0]['guest_name']);
	$guestTr.find('#section1GuestScorce').val(data[0]['section1_guest_score']);
	$guestTr.find('#section2GuestScorce').val(data[0]['section2_guest_score']);
	$guestTr.find('#section3GuestScorce').val(data[0]['section3_guest_score']);
	$guestTr.find('#section4GuestScorce').val(data[0]['section4_guest_score']);
	$guestTr.find('#countGuestScorce').text(data[0]['count_guest_score']);
	$homeTr.find('#home_name').text(data[0]['home_name']);
	$homeTr.find('#section1HomeScorce').val(data[0]['section1_home_score']);
	$homeTr.find('#section2HomeScorce').val(data[0]['section2_home_score']);
	$homeTr.find('#section3HomeScorce').val(data[0]['section3_home_score']);
	$homeTr.find('#section4HomeScorce').val(data[0]['section4_home_score']);
	$homeTr.find('#countHomeScorce').text(data[0]['count_home_score']);
}
//选择节
function sectionEvent(event){
	event.stopPropagation();
	if(event.target.tagName.toLowerCase() == 'span'){
		var $span=$(event.target);
		if($span.hasClass('addSection')){
			//点击添加OT节
			var section=$span.prev().attr('section');
			var spanHTML='';
			if(section.indexOf('OT') != -1){
				var num=section.replace('OT','');
				num=parseInt(num);
				var OTTmp='OT'+(num+1);
				spanHTML='<span id="'+OTTmp+'" class="section" section="'+OTTmp+'">'+OTTmp+'</span>';
			}else{
				spanHTML='<span id="OT1" class="section" section="OT1">OT1</span>';
			}
			$span.before(spanHTML);
		}else{
			//改变比赛的节
			current_section=$span.attr('section');
			$span.siblings('.section').removeClass('selected');
			$span.addClass('selected');
			console.log(current_section);
		}
	}
}



//返回剩余时间
function getRemainTime(todayMs,ms){
	var remainMs=ms-todayMs;
	var remainDay=Math.floor(remainMs/(24*60*60*1000));
	remainMs-=(24*60*60*1000)*remainDay;
	var remainHour=Math.floor(remainMs/(60*60*1000));
	remainMs-=(60*60*1000)*remainHour;
	var remainMinute=Math.floor(remainMs/(60*1000));
	remainMs-=(60*1000)*remainMinute;
	var remainSecond=Math.floor(remainMs/(1000));
	return remainDay+'天'+remainHour+'时'+remainMinute+'分'+remainSecond+'秒';
}
//返回今天的ms
function getTodayMs(){
	var date=new Date();
	return date.getTime();
}
//传入date和time，返回ms
function getMs(date,time){
	// console.log(date+','+time)
	var dateArr=date.split('-');
	var timeArr=time.split(':');
	var year=parseInt(dateArr[0]);
	var month=parseInt(dateArr[1])-1;
	var day=parseInt(dateArr[2]);
	var hour=parseInt(timeArr[0]);
	var minute=parseInt(timeArr[1]);
	var second=parseInt(timeArr[2]);
	var mydate=new Date(year,month,day,hour,minute,second);
	return mydate.getTime();
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