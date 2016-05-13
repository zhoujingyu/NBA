$(function(){
	getSchedule(getDateString());
})
//显示赛程管理界面
function showSchedule(span){
	$(span).siblings('span').removeClass('selected');
	$(span).addClass('selected');
	$('#container .myCtrl').hide();
	$('#container #scheduleCtrl').show();
	getSchedule(getDateString());
}
//显示直播员管理界面
function showLiver(span){
	$(span).siblings('span').removeClass('selected');
	$(span).addClass('selected');
	$('#container .myCtrl').hide();
	$('#container #liverCtrl').show();
	getLiver();
}
//显示球队管理界面
function showTeam(span){
	$(span).siblings('span').removeClass('selected');
	$(span).addClass('selected');
	$('#container .myCtrl').hide();
	$('#container #teamCtrl').show();
	getTeam('east');
}
//显示球员管理界面
function showPlayer(span){
	$(span).siblings('span').removeClass('selected');
	$(span).addClass('selected');
	$('#container .myCtrl').hide();
	$('#container #playerCtrl').show();
	setEwSelect();
}
//显示数据管理界面
function showData(span){
	$(span).siblings('span').removeClass('selected');
	$(span).addClass('selected');
	$('#container .myCtrl').hide();
	$('#container #dataCtrl').show();
}
//显示用户管理界面
function showUser(span){
	$(span).siblings('span').removeClass('selected');
	$(span).addClass('selected');
	$('#container .myCtrl').hide();
	$('#container #userCtrl').show();
}