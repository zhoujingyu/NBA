var liver_id='';//当前直播员id
var liver_name='';//当前直播员名字
var current_schedule_id=0;//当前赛程id
var current_section=0;//当前赛程第几节
var current_schedule_table='';//当前赛程表
var current_guest_id='';//当前客队id
var current_guest_name='';//当前客队名称
var current_home_id='';//当前主队id
var current_home_name='';//当前主队名称
var isLiving=false;//当前是否正在直播
var current_page=0;//当前页数
var count_page=0;//总页数
var per_page=20;//每页条数

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
	var sql="select * "+
			"from schedule "+
			"where schedule_date>='"+date+"' "+
			"and liver_id="+liver_id+" "+
			"order by schedule_date";
	$.ajax({
		type:'GET',
		url:"../../php/hasReturnQuery.php",
		data:{
			sql:sql
		},
		dataType:'json',
		success:function(data){
			var $rightBox=$('#rightBox');
			$rightBox.find('.scheduleList').remove();
			if (data != '') {
				var scheduleListHTML='<div class="scheduleList borderBottom">'+
		 								'<p class="name textLeft">rpname</p><!--'+
		 								'--><p class="enterLiving textRight" onclick="enterLiving(\'rpschedule_id\',\'rptable\',this)">开启直播</p><!--'+
		 								'--><p class="datetime textLeft">rptime</p><!--'+
		 								'--><p class="status textRight">rpstatus</p><!--'+
		 								'--><p class="endGame textRight" style="width:100%;display:none">'+
		 								'<button type="button" class="endButton" onclick="endThisGame(rpschedule_id2,\'rptable2\',this)">结束本场比赛</button>'+
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
		 									.replace('rpschedule_id',data[i]['schedule_id'])
		 									.replace('rptable2',table)
		 									.replace('rpschedule_id2',data[i]['schedule_id']);
		 			$rightBox.append(HTMLTmp);	 			
		 			ms=getMs(data[i]['schedule_date'],data[i]['schedule_time']);
		 			checkGameStartOrNot($rightBox.find('.scheduleList:last .status'),table,ms);
		 		}
			}else{
				$rightBox.append('<p class="scheduleList borderBottom" style="color:white">暂无直播,赶快叫管理人员添加吧!</p>');
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
	if (todayMs < ms) {
		var remainTime=getRemainTime(todayMs,ms);
		$p.text(remainTime);
		setTimeout(function(){
			checkGameStartOrNot($p,table,ms);
		},1000)
		return;
	}

	var sql="select schedule_id,end_flag from "+table+";";
	$.ajax({
		type:'GET',
		url:"../../php/hasReturnQuery.php",
		data:{
			sql:sql
		},
		dataType:'json',
		success:function(data){
			console.log('检查比赛是否开始数据↓');
			console.log(data);
			if (data != '') {
				switch(data[0]['end_flag']){
					case '0':{
						changeToPlaying($p,table,data[0]['schedule_id']);
					}break;
					case '1':{
						$p.text('比赛中');
					}break;
					case '2':{
						$p.text('已结束');
						$p.siblings('.endGame').remove();
					}break;
					default:break;
				}
			}else{

			}
		},
		error:function(){
			console.log('连接后台错误'+table);
		}
	});
}
//时间到，进入直播状态
function changeToPlaying($p,table,schedule_id){
	console.log('时间到，进入直播状态');
	var sql="update "+table+" "+
			"set end_flag=1 "+
			"where schedule_id="+schedule_id+";";
	$.ajax({
		type:'GET',
		url:"../../php/noReturnQuery.php",
		data:{
			sql:sql
		},
		success:function(data){
			if (data == 1) {
				$p.text('比赛中');
			}else{
				$p.text('已开始,未开启');
			}
		},
		error:function(){
			console.log('已开始,未开启')
		}
	});
}
//开启直播
function enterLiving(schedule_id,table,p){
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
				isLiving=true;
				current_schedule_table=table;
				current_schedule_id=schedule_id;
				current_guest_id=data[0]['guest_id'];
				current_guest_name=data[0]['guest_name'];
				current_home_id=data[0]['home_id'];
				current_home_name=data[0]['home_name'];
				$('#rightBox .scheduleList .enterLiving .livingImg').remove();
				$(p).append('<img src="../resource/images/living.png" class="livingImg">');
				initScoreBox(data);
				initWordBox();
				initDataBox();
			}else{
				initLivingroom(schedule_id,table,p);
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
						initLivingroom(schedule_id,table,p);
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
function initLivingroom(schedule_id,table,p){
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
				console.log('取得赛程数据成功，即将初始化直播间表数据');
				initLivingroomData(schedule_id,table,p,data);
			}
		},
		error:function(){
			console.log('连接后台错误'+table);
		}
	});
}
//初始化直播间表数据
function initLivingroomData(schedule_id,table,p,data){
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
				  "'12:00',0,0"+
				  ");";
	$.ajax({
		type:'GET',
		url:"../../php/noReturnQuery.php",
		data:{
			sql:sqlInsert
		},
		success:function(){
			console.log('初始化直播间表数据成功，即将取得球员数据');
			initPlayerData(schedule_id,table,p,data);
		},
		error:function(){
			console.log('初始化直播间表数据失败');
		}
	});
}
//初始化该比赛球员数据
function initPlayerData(schedule_id,table,p,data){
	var guest_id=data[0]['guest_id'];
	var home_id=data[0]['home_id'];
	var sqlPlayer="select player_id,team_id "+
				  "from player "+
				  "where team_id="+guest_id+" "+
				  "or team_id="+home_id+";";
	$.ajax({
		type:'GET',
		url:"../../php/hasReturnQuery.php",
		data:{
			sql:sqlPlayer
		},
		dataType:'json',
		success:function(playerData){
			if(playerData != ''){
				console.log('取得球员数据成功，即将初始化插入球员数据');
				initInsertPlayerData(schedule_id,table,p,playerData);
			}else{
				console.log('取得球员数据失败');
			}
		},
		error:function(){
			console.log('取得球员数据失败');
		}
	});
}
//初始化插入球员数据
function initInsertPlayerData(schedule_id,table,p,playerData){
	var sql="insert into livingroomplayerdata "+
			"values "+
			"("+schedule_id+",rpplayer_id,0,0,0,0,0,0,0,0,0,rpteam_id);";
	var sqlTmp='';
	var length=playerData.length;
	for (var i = 0; i < length; i++) {
		sqlTmp=sql.replace('rpplayer_id',playerData[i]['player_id'])
				  .replace('rpteam_id',playerData[i]['team_id']);
		$.ajax({
			type:'GET',
			url:"../../php/noReturnQuery.php",
			data:{
				sql:sqlTmp
			},
			async:false,
			success:function(data){
				if(data == 1){
					console.log(i+'数据初始化成功，即将重新进入直播间');
					if(i==(length-1)){
						enterLiving(schedule_id,table,p);
					}
				}else{
					console.log('初始化插入球员数据失败');
				}
			},
			error:function(){
				console.log('初始化插入球员数据连接后台失败');
			}
		});
	}
}
//初始化比分Box
function initScoreBox(data){
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
							'<button type="button" class="scoreBotton" onclick="minuScore(this);">-</button>'+
							'<input type="text" id="rpid" class="scoreInput" value="rpvalue" oninput="updateScore(this.id,this.value);" onkeypress="return isNum(event)" />'+
							'<button type="button" class="scoreBotton" onclick="addScore(this);">+</button>'+
						  '</td>';
		var tableHeaderTdHTMLTmp='';
		var guestTrTdHTMLTmp='';
		var homeTrTdHTMLTmp='';
		var scorelength=data[0]['section'].replace('OT','');
		scorelength=parseInt(scorelength);
		for(var i=1;i<=scorelength;i++){
			tableHeaderTdHTMLTmp=tableHeaderTdHTML.replace('第4节','加时'+i);
			guestTrTdHTMLTmp=TrTdHTML.replace('rpid','OT'+i+'_guest_score')
										  .replace('rpvalue',data[0]['OT'+i+'_guest_score']);
			homeTrTdHTMLTmp=TrTdHTML.replace('rpid','OT'+i+'_home_score')
										  .replace('rpvalue',data[0]['OT'+i+'_home_score']);
			$tableHeader.find('td:last').before(tableHeaderTdHTMLTmp);
			$guestTr.find('td:last').before(guestTrTdHTMLTmp);
			$homeTr.find('td:last').before(homeTrTdHTMLTmp);
		}
	}
	$guestTr.find('#guest_name').text(data[0]['guest_name']);
	$guestTr.find('#section1_guest_score').val(data[0]['section1_guest_score']);
	$guestTr.find('#section2_guest_score').val(data[0]['section2_guest_score']);
	$guestTr.find('#section3_guest_score').val(data[0]['section3_guest_score']);
	$guestTr.find('#section4_guest_score').val(data[0]['section4_guest_score']);
	$guestTr.find('#count_guest_score').text(data[0]['count_guest_score']);
	$homeTr.find('#home_name').text(data[0]['home_name']);
	$homeTr.find('#section1_home_score').val(data[0]['section1_home_score']);
	$homeTr.find('#section2_home_score').val(data[0]['section2_home_score']);
	$homeTr.find('#section3_home_score').val(data[0]['section3_home_score']);
	$homeTr.find('#section4_home_score').val(data[0]['section4_home_score']);
	$homeTr.find('#count_home_score').text(data[0]['count_home_score']);
}
//选择节
function sectionEvent(event){
	stopEventBubble(event);
	if(!isLiving)return false;
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
			updateSection($span,$span.attr('section'));
		}
	}
}
//更新数据库中对应赛程的节数据
function updateSection($span,section){
	var sql="update "+current_schedule_table+" "+
			"set section='"+section+"' "+
			"where schedule_id="+current_schedule_id+";";
	$.ajax({
		type:'GET',
		url:"../../php/noReturnQuery.php",
		data:{
			sql:sql
		},
		success:function(data){
			if (data == 1) {
				current_section=$span.attr('section');
				$span.siblings('.section').removeClass('selected');
				$span.addClass('selected');
				insertScoreWhereupdateSection();
			}else{
				console.log('更新数据库中对应赛程的节数据失败');
			}
		},
		error:function(){
			console.log('更新数据库中对应赛程的节数据失败');
		}
	});
}
//更新节数据时插入比分数据
function insertScoreWhereupdateSection(){
	var actualLength=$('#tableHeader td:gt(0):not(:last)').length-4;
	if(current_section.indexOf('OT') != -1){
		var sureLength=parseInt(current_section.replace('OT',''));
		if(actualLength<sureLength){

			var $tableHeader=$('#tableHeader');
			var $guestTr=$('#guestTr');
			var $homeTr=$('#homeTr');
			var startOT=actualLength+1;
			var tableHeaderTdHTML='<td>第4节</td>';
			var TrTdHTML='<td>'+
							'<button type="button" class="scoreBotton" onclick="minuScore(this);">-</button>'+
							'<input type="text" id="rpid" class="scoreInput" value="rpvalue" oninput="updateScore(this.id,this.value);" onkeypress="return isNum(event)" />'+
							'<button type="button" class="scoreBotton" onclick="addScore(this);">+</button>'+
						 '</td>';
			var tableHeaderTdHTMLTmp='';
			var guestTrTdHTMLTmp='';
			var homeTrTdHTMLTmp='';
			for(var i=startOT;i<=sureLength;i++){
				tableHeaderTdHTMLTmp=tableHeaderTdHTML.replace('第4节','加时'+i);
				guestTrTdHTMLTmp=TrTdHTML.replace('rpid','OT'+i+'_guest_score')
										 .replace('rpvalue',0);
				homeTrTdHTMLTmp=TrTdHTML.replace('rpid','OT'+i+'_home_score')
										.replace('rpvalue',0);
				$tableHeader.find('td:last').before(tableHeaderTdHTMLTmp);
				$guestTr.find('td:last').before(guestTrTdHTMLTmp);
				$homeTr.find('td:last').before(homeTrTdHTMLTmp);
				alterSchedule('OT'+i+'_guest_score',0);
				alterSchedule('OT'+i+'_home_score',0);
			}
		}
	}
}
//插入当前表中更新的节比分
function alterSchedule(key,value){
 	var sql="alter table "+current_schedule_table+" "+
 			"add "+key+" int;";
 	console.log(sql);
 	$.ajax({
		type:'GET',
		url:"../../php/noReturnQuery.php",
		data:{
			sql:sql
		},
		success:function(data){
			console.log(data);
			if (data == 1) {
				console.log('插入当前表中更新的节比分成功');
				var sql="update "+current_schedule_table+" "+
						"set "+key+"=0 "+
						"where schedule_id="+current_schedule_id+";";
				$.ajax({
					type:'GET',
					url:"../../php/noReturnQuery.php",
					data:{
						sql:sql
					},
					success:function(data){
					},
					error:function(){
					}
				});
			}else{
				console.log('插入当前表中更新的节比分失败');
			}
		},
		error:function(){
			console.log('插入当前表中更新的节比分失败');
		}
	});
 }
//更新数据库中对应赛程的剩余时间
function updateRemainTime(){
	if(!isLiving)return false;
	var remainMinute=$('#remainMinute').val();
	var remainSecond=$('#remainSecond').val();
	remainMinute=parseInt(remainMinute);
	remainSecond=parseInt(remainSecond);
	if(remainMinute>12||remainMinute<0)return false;
	if(remainSecond>60||remainSecond<0)return false;
	var sql="update "+current_schedule_table+" "+
			"set remain_time='"+(remainMinute+':'+remainSecond)+"' "+
			"where schedule_id="+current_schedule_id+";";
	$.ajax({
		type:'GET',
		url:"../../php/noReturnQuery.php",
		data:{
			sql:sql
		},
		success:function(data){
			if (data == 1) {
				console.log('更新数据库中对应赛程的节数据成功');
			}else{
				console.log('更新数据库中对应赛程的节数据失败');
			}
		},
		error:function(){
			console.log('更新数据库中对应赛程的节数据失败');
		}
	});
}
//比分减1
function minuScore(button){
	var value=$(button).siblings('input').val();
	value=parseInt(value);
	if(value<=0)return false;
	value--;
	var keySection=$(button).siblings('input').attr('id');
	updateScore(keySection,value);
}
//比分加1
function addScore(button){
	var value=$(button).siblings('input').val();
	value=parseInt(value);
	value++;
	var keySection=$(button).siblings('input').attr('id');
	updateScore(keySection,value);
}
//更新节比分数据
function updateScore(key,value){
	var sql="update "+current_schedule_table+" "+
			"set "+key+"="+value+" "+
			"where schedule_id="+current_schedule_id+";";
	$.ajax({
		type:'GET',
		url:"../../php/noReturnQuery.php",
		data:{
			sql:sql
		},
		success:function(data){
			if (data == 1) {
				$('#'+key).val(value);
				updateCountScore(key);
			}
		},
		error:function(){
		}
	});
}
//更新总比分数据
function updateCountScore(key){
	var keyCount='';
	var countScore=0;
	if(key.indexOf('guest') != -1){
		keyCount='count_guest_score';
		$('#guestTr').find('td:gt(0):not(:last)').each(function(){
			countScore+=parseInt($(this).find('input').val());
		});
	}else{
		keyCount='count_home_score';
		$('#homeTr').find('td:gt(0):not(:last)').each(function(){
			countScore+=parseInt($(this).find('input').val());
		});
	}
	var sql="update "+current_schedule_table+" "+
			"set "+keyCount+"="+countScore+" "+
			"where schedule_id="+current_schedule_id+";";
	$.ajax({
		type:'GET',
		url:"../../php/noReturnQuery.php",
		data:{
			sql:sql
		},
		success:function(data){
			if (data == 1) {
				$('#'+keyCount).text(countScore);
			}
		},
		error:function(){
		}
	});
}
//初始化文字直播box
function initWordBox(page){
	if (page == undefined) {
		page=1;
	}
	current_page=page;
	var sql="select count(*) "+
			"from livingroomword "+
			"where schedule_id="+current_schedule_id+";";
	$.ajax({
		type:'GET',
		url:"../../php/hasReturnQuery.php",
		data:{
			sql:sql
		},
		dataType:'json',
		success:function(data){
			if (data[0][0] != 0) {
				count_page=Math.ceil(data[0][0]/per_page);
				paging();
			}else{
				$('#wordBox .wordP').remove();
				var pHTML='<p class="wordP borderBottom">快来跟观众打个招呼吧！！！</p>';
				$('#wordBox').append(pHTML);
				$('#pageBox').html('');
			}
		},
		error:function(){
		}
	});
}
//分页
function paging(page){
	if(page == undefined){
		page=current_page;
	}
	var sql="select * "+
			"from livingroomword "+
			"where schedule_id="+current_schedule_id+" "+
			"order by ms desc "+
			"limit "+(page-1)*per_page+","+per_page+";";
	$.ajax({
		type:'GET',
		url:"../../php/hasReturnQuery.php",
		data:{
			sql:sql
		},
		dataType:'json',
		success:function(data){
			if (data != '') {
				var $wordBox=$('#wordBox');
				$wordBox.html('');
				var pHTML='<p class="wordP borderBottom">'+
							'rpword'+
							'<br/>'+
							'<button type="button" class="deleteButton hidden" onclick="deleteThisWord(\'rpms\')">删除</button>'+
						  '</p>';
				var pHTMLTmp='';
				var word='';
				var length=data.length;
				for(var i=0;i<length;i++){
					word=data[i]['word']+" ["+data[i]['guest_score']+":"+data[i]['home_score']+"]";
					pHTMLTmp=pHTML.replace('rpword',word)
								  .replace('rpms',data[i]["ms"]);
					$wordBox.append(pHTMLTmp);
				}
				setPageNum();
			}
		},
		error:function(){
			console.log('连接后台错误');
		}
	});
}
//设置页码
function setPageNum(){
	var pageBox=$('#pageBox');
	pageBox.html('');

	var spanHTML='<span class="rpclass">rpNum</span>';
	var tmp='';

	if(count_page==1){
		tmp=spanHTML.replace('rpclass','disabled')
					.replace('rpNum','1');
		pageBox.append(tmp);
		return;
	}

	var startPage=0;
	if(count_page<=8){
		startPage=1;
	}else if((count_page-current_page)>7){
		startPage=current_page;
	}else if((count_page-current_page)<=7){
		startPage=count_page-7;
	}
	for(var i=startPage;i<=count_page;i++){
		if(i>(startPage+5)&&i<(count_page-1)){
			if(i == (startPage+6)){
				pageBox.append('...');
			}else{
				continue;
			}
		}else{
			if(i == current_page){
				tmp=spanHTML.replace('rpclass','currentPage');
			}else{
				tmp=spanHTML.replace('rpclass','enabled');
			}
			tmp=tmp.replace('rpNum',i);
			pageBox.append(tmp);
		}
	}

	if(current_page != 1){
		tmp=spanHTML.replace('rpclass','enabled')
					.replace('rpNum','上一页');
		pageBox.prepend(tmp);
		tmp=spanHTML.replace('rpclass','enabled')
					.replace('rpNum','首页');
		pageBox.prepend(tmp);
	}
	if(current_page != count_page){
		tmp=spanHTML.replace('rpclass','enabled')
					.replace('rpNum','下一页');
		pageBox.append(tmp);
		tmp=spanHTML.replace('rpclass','enabled')
					.replace('rpNum','尾页');
		pageBox.append(tmp);
	}
}
//去到指定页面
function goThisPage(event){
	stopEventBubble(event);
	if(!isLiving)return false;
	if(event.target.tagName.toLowerCase() == 'span'){
		var $span=$(event.target);
		if($span.hasClass('currentPage'))return;
		if($span.hasClass('disabled'))return;
		var value=$span.text();
		if(value == '首页')value=1;
		if(value == '尾页')value=count_page;
		if(value == '上一页')value=current_page-1;
		if(value == '下一页')value=current_page+1;
		value=parseInt(value);
		current_page=value;
		paging(current_page);
	}
}
//发表直播文字
function publishWord(){
	if(!isLiving)return false;
	var word=$('#wordInput').val();
	if(word == '')return false;
	var ms=getTodayMs();
	var guest_score=$('#count_guest_score').text();
	var home_score=$('#count_home_score').text();
	guest_score=parseInt(guest_score);
	home_score=parseInt(home_score);

	var sql="insert into livingroomword "+
			"values "+
			"("+current_schedule_id+",'"+word+"',"+guest_score+","+home_score+",'"+ms+"');";
	$.ajax({
		type:'GET',
		url:"../../php/noReturnQuery.php",
		data:{
			sql:sql
		},
		success:function(data){
			if (data == 1) {
				$('#wordInput').val('').focus();
				initWordBox(1);
			}
		},
		error:function(){
		}
	});
}
//删除直播文字
function deleteThisWord(ms){
	var sql="delete "+
			"from livingroomword "+
			"where schedule_id="+current_schedule_id+" "+
			"and ms='"+ms+"';";
		$.ajax({
		type:'GET',
		url:"../../php/noReturnQuery.php",
		data:{
			sql:sql
		},
		success:function(data){
			if (data == 1) {
				if($('#wordBox .wordP').length == 1 && current_page != 1){
					current_page--;
				}
				initWordBox(current_page);
			}
		},
		error:function(){
			console.log('连接后台错误');
		}
	});
}
//初始化球员数据Box
function initDataBox(){
	$('#guestLabel').text(current_guest_name);
	$('#homeLabel').text(current_home_name);

	var sql="select livingroomplayerdata.*,player.player_name "+
			"from livingroomplayerdata,player "+
			"where schedule_id="+current_schedule_id+" "+
			"and livingroomplayerdata.player_id=player.player_id;";
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
							'</td>'
						   '</tr>';
				var trHTMLTmp='';
				var $guestDataTable=$('#guestDataTable');
				var $homeDataTable=$('#homeDataTable');
				$guestDataTable.find('tr:not(.tableHeader)').html('');
				$homeDataTable.find('tr:not(.tableHeader)').html('');

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
									.replace('rpfree_throw',data[i]['free_throw']);
					if(data[i]['team_id'] == current_guest_id){
						$guestDataTable.append(trHTMLTmp);
					}else if(data[i]['team_id'] == current_home_id){
						$homeDataTable.append(trHTMLTmp);
					}
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
	var sql="update livingroomplayerdata "+
			"set "+key+"="+value+" "+
			"where schedule_id="+current_schedule_id+" "+
			"and player_id="+player_id+";";
	$.ajax({
		type:'GET',
		url:"../../php/noReturnQuery.php",
		data:{
			sql:sql
		},
		success:function(data){
			if(data == 1){
				console.log('成功将'+key+'设置为'+value);
			}
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

	var sql="update livingroomplayerdata "+
			"set "+key+"="+value+" "+
			"where schedule_id="+current_schedule_id+" "+
			"and player_id="+player_id+";";
	$.ajax({
		type:'GET',
		url:"../../php/noReturnQuery.php",
		data:{
			sql:sql
		},
		success:function(data){
			if(data == 1){
				console.log('成功将'+key+'设置为'+value);
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

	var sql="update livingroomplayerdata "+
			"set "+key+"="+value+" "+
			"where schedule_id="+current_schedule_id+" "+
			"and player_id="+player_id+";";
	$.ajax({
		type:'GET',
		url:"../../php/noReturnQuery.php",
		data:{
			sql:sql
		},
		success:function(data){
			if(data == 1){
				console.log('成功将'+key+'设置为'+value);
				$(button).siblings('input').val(value);
			}
		},
		error:function(){
			console.log('连接后台错误');
		}
	});
}
//结束本场比赛
function endThisGame(schedule_id,table,button){
	var sql="update "+table+" "+
			"set end_flag=2 "+
			"where schedule_id="+schedule_id+";";
	$.ajax({
		type:'GET',
		url:"../../php/noReturnQuery.php",
		data:{
			sql:sql
		},
		success:function(data){
			if (data == 1) {
				var $p=$(button).parent();
				uploadPlayerData(schedule_id,table,$p);
			}else{
				console.log('结束本场比赛失败');
			}
		},
		error:function(){
			console.log('结束本场比赛失败');
		}
	});
}
//比赛结束，上传球员数据
function uploadPlayerData(schedule_id,table,$p){
	var sql="update statistics st,livingroomplayerdata pd,"+table+" li "+
			"set "+
			"st.score=st.score+pd.score,"+
			"st.backboard=st.backboard+pd.backboard,"+
			"st.assists=st.assists+pd.assists,"+
			"st.steal=st.steal+pd.steal,"+
			"st.block=st.block+pd.block,"+
			"st.error=st.error+pd.error,"+
			"st.3point=st.3point+pd.3point,"+
			"st.foul=st.foul+pd.foul,"+
			"st.free_throw=st.free_throw+pd.free_throw,"+
			"st.played_game=st.played_game+1,"+
			"li.insert_flag=1 "+
			"where pd.schedule_id="+schedule_id+" "+
			"and st.player_id=pd.player_id "+
			"and li.insert_flag!=1;";
	console.log(sql);
	$.ajax({
		type:'GET',
		url:"../../php/noReturnQuery.php",
		data:{
			sql:sql
		},
		success:function(data){
			if (data == 1) {
				console.log('比赛结束，上传球员数据成功');
				$p.siblings('.status').text('已结束');
				$p.remove();
			}else{
				console.log('比赛结束，上传球员数据'+data);
			}
		},
		error:function(){
			console.log('比赛结束，上传球员数据连接后台失败');
		}
	});
}
//退出直播间
function exit(){
	sessionStorage.clear();
	location.href='login/';
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
//阻止事件冒泡
function stopEventBubble(event){
	var e=event || window.event;
	if (e && e.stopPropagation){
		e.stopPropagation();    
	}else{
 		e.cancelBubble=true;
	}
}