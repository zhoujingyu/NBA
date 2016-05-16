$(function(){
	$('.myTable').hide();
	$('#scoreTable').show();
	getData('score');
	getData('backboard');
	getData('assists');
	getData('steal');
	getData('block');
	getData('error');
	getData('3point');
	getData('foul');
	getData('free_throw');
	getData('played_game');


	$('#sort p').on('click',function(){
		$(this).siblings().removeClass('selected');
		$(this).addClass('selected');
		$('.myTable').hide();
		$('#'+$(this).attr('data')+'Table').show();
		console.log($(this).attr('data'));
	});
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
//取得得分、助攻、篮板等等各种排名
function getData(key){
	var sql='';
	if(key=='played_game'){
		sql="select pl.player_name,st.played_game,te.logo "+
			"from statistics st,team te,player pl "+
			"where st.team_id=te.team_id "+
			"and pl.player_id=st.player_id "+
			"order by st.played_game desc "+
			"limit 0,50";
	}else{
		sql="select pl.player_name,st."+key+",st."+key+"/st.played_game average_"+key+",te.logo "+
			"from statistics st,team te,player pl "+
			"where st.team_id=te.team_id "+
			"and pl.player_id=st.player_id "+
			"order by st."+key+"/st.played_game desc "+
			"limit 0,50";
	}
		
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
				var trHTML='';
				if(key=='played_game'){
					trHTML='<tr>'+
							'<td>'+
							'<span class="rprankclass">rpranknum</span>'+
							'<img src="../../rpsrc">'+
							'rpname'+
							'</td>'+
							'<td class="rpcounclass">rpcount</td>'+
						   '</tr>';
				}else{
					trHTML='<tr>'+
							'<td>'+
							'<span class="rprankclass">rpranknum</span>'+
							'<img src="../../rpsrc">'+
							'rpname'+
							'</td>'+
							'<td class="rpaverclass">rpaverage</td>'+
							'<td class="rpcounclass">rpcount</td>'+
						   '</tr>';
				}
				
				var trHTMLTmp='';
				var $keyTable=$('#'+key+'Table');
				var length=data.length;
				for(var i=0;i<length;i++){
					trHTMLTmp=trHTML.replace('rpranknum',i+1)
									.replace('rpsrc',data[i]['logo'])
									.replace('rpname',data[i]['player_name'])
									.replace('rpaverage',parseFloat(data[i]['average_'+key]).toFixed(2))
									.replace('rpcount',data[i][key]);
					switch(i){
						case 0:{
							trHTMLTmp=trHTMLTmp.replace('rprankclass','NO1')
											   .replace('rpaverclass','bold')
											   .replace('rpcounclass','bold');
						}break;
						case 1:{
							trHTMLTmp=trHTMLTmp.replace('rprankclass','NO2')
											   .replace('rpaverclass','bold')
											   .replace('rpcounclass','bold');
						}break;
						case 2:{
							trHTMLTmp=trHTMLTmp.replace('rprankclass','NO3')
											   .replace('rpaverclass','bold')
											   .replace('rpcounclass','bold');
						}break;
						default:{
							trHTMLTmp=trHTMLTmp.replace('rprankclass','soso')
											   .replace('rpaverclass','lighter')
											   .replace('rpcounclass','lighter');
						}break;
					}
					$keyTable.append(trHTMLTmp);
				}
			}
		},
		error:function(){
			console.log('连接后台错误');
		}
	});
}
