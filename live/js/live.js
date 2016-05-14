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
		 								'--><p class="enterLiving textRight" onclick="enterLiving(\'rpschedule_id\',\'rptable\',this)">开启直播</p><!--'+
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
					success:function(){
						enterLiving(schedule_id,table,p);
					},
					error:function(){
						console.log('初始化插入数据失败');
					}
				});

				//初始化球员的数据
				var guest_id=data[0]['guest_id'];
				var home_id=data[0]['home_id'];
				var sqlPlayer="select player_id "+
							  "from player "+
							  "where team_id="+guest_id+" "+
							  "or team_id="+home_id+";";
			}
		},
		error:function(){
			console.log('连接后台错误'+table);
		}
	});
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
			"from livingroomWord "+
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
			"from livingroomWord "+
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

	var sql="insert into livingroomWord "+
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
			"from livingroomWord "+
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