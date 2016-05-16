$(function(){
	getRank();
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
//取得排名
function getRank(){
	var sql="select r1.*,t1.team_short_name,t1.ew "+
			"from rank r1,team t1 "+
			"where r1.team_id=t1.team_id "+
			"order by t1.ew desc,r1.winrate desc;";
	console.log(sql);
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
				var trHTML=
				'<tr>'+
					'<td>'+
					'<span class="rpclass">rpranknum</span>'+
					'rpname'+
					'</td>'+
					'<td>rpwin</td>'+
					'<td>rplose</td>'+
					'<td>rprate</td>'+
					'<td>rpcjc</td>'+
				'</tr>';
				var trHTMLTmp='';
				var $wTable=$('#wTable');
				var $eTable=$('#eTable');
				var cjc=''
				var length=data.length;
				for(var i=0;i<length;i++){
					trHTMLTmp=trHTML.replace('rpname',data[i]['team_short_name'])
									.replace('rpwin',data[i]['win'])
									.replace('rplose',data[i]['lose'])
									.replace('rprate',parseFloat(data[i]['winrate']).toFixed(2));
					if(data[i]['ew'] == 'west'){
						cjc=(parseInt(data[0]['win'])-parseInt(data[0]['lose'])-parseInt(data[i]['win'])+parseInt(data[i]['lose']))/2;
						trHTMLTmp=trHTMLTmp.replace('rpcjc',cjc)
										   .replace('rpranknum',i+1);
						if(i<8){
							trHTMLTmp=trHTMLTmp.replace('rpclass','goodRank');
						}else{
							trHTMLTmp=trHTMLTmp.replace('rpclass','badRank');
						}
						$wTable.append(trHTMLTmp);
					}else{
						cjc=(parseInt(data[15]['win'])-parseInt(data[15]['lose'])-parseInt(data[i]['win'])+parseInt(data[i]['lose']))/2;
						trHTMLTmp=trHTMLTmp.replace('rpcjc',cjc)
										   .replace('rpranknum',i-14);
						if(i<23){
							trHTMLTmp=trHTMLTmp.replace('rpclass','goodRank');
						}else{
							trHTMLTmp=trHTMLTmp.replace('rpclass','badRank');
						}
						$eTable.append(trHTMLTmp);
					}
				}
				// $wTable.find('tr:gt(0):lt(8)').each(function(index){
				// 	$(this).find('td:first').prepend('<span class="rankNum">'+(index+1)+'<span>');
				// });
				// $eTable.find('tr:gt(0):lt(8)').each(function(index){
				// 	$(this).find('td:first').prepend('<span class="rankNum">'+(index+1)+'<span>');
				// });
			}
		},
		error:function(){
			console.log('连接后台错误');
		}
	});
}
//显示西部排名
function showWRank(){
	$('#wRankBox').show();
	$('#eRankBox').hide();
	$('#wSelect').addClass('selected');
	$('#eSelect').removeClass('selected');
}
//显示东部排名
function showERank(){
	$('#eRankBox').show();
	$('#wRankBox').hide();
	$('#eSelect').addClass('selected');
	$('#wSelect').removeClass('selected');
}
