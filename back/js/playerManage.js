//设置分区
function setEwSelect(){
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

				$('#eastSelect').html(optionEHTMLTmp);
				$('#westSelect').html(optionWHTMLTmp);
			}
		},
		error:function(){
			console.log('连接后台错误');
		}
	});
}