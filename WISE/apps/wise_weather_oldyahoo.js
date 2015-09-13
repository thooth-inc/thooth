function weatherFetch(){

	if (!WISE.apps.weather) {alert("uh oh"); return false;};
	
	cur = WISE.apps.weather;
	
	WISE.call(WISE.server+"/index.php?action=ajax&rs=wfGetWeatherZipJSON&rsargs[]="+encodeURIComponent(WISE.trim(cur.params[0].replace("weather","")))+"&rsargs[]=weatherRender", cur.id);
}

function weatherRender( j ){

	if( !j.rss.channel.item ){
		return false;
	}
	
	//var resultText = new String(j.rss.channel.item.description);
	var cur = j.rss.channel.item.condition["@attributes"];
	var forecast = new Array();
	
	forecast.push("<img src='http://l.yimg.com/us.yimg.com/i/us/we/52/" + cur.code + ".gif'/><br/><b>Current Conditions:</b><br/>" + cur.text + ", " + cur.temp + "&deg;");
	
	var fore = j.rss.channel.item.forecast;
	for (var i=0; i<fore.length; i++) {
		cur = fore[i]["@attributes"];
		forecast.push("<img src='http://l.yimg.com/us.yimg.com/i/us/we/52/" + cur.code + ".gif'/><br/><b>" + cur.day + " " + cur.date + ":</b><br/>" + cur.text + "<br/>" + cur.high + "&deg; | " + cur.low + "&deg;");
	}
	
	var weatherText = "<table style='font-size:10px;'><tr>";
	for (var i=0; i<forecast.length; i++) {
		weatherText += "<td align='center' valign='top' style='width:125px;'>" + forecast[i] + "</td>"
	}
	weatherText+="</tr></table>";
	
	r = WISE.resultAdd( WISE.Q ,j.rss.channel.item.link,j.rss.channel.item.title,"",true);

	WISE.annAdd(r,"text",{"sel":weatherText});
	WISE.annRender(r);
	WISE.finalize(WISE.Q); // apply any possible KT stuff

}
