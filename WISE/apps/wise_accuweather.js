function accuweatherFetch(){

        WISE.call(WISE.server+"/index.php?action=ajax&rs=wfGetAccuweatherZipJSON&rsargs[]="+encodeURIComponent(WISE.trim(thisApp.params[0].replace("weather","")))+"&rsargs[]=accuweatherRender", thisApp.id);

}

function accuweatherRender( j ){

	if( !j.adc_database || j.adc_database.failure ){
		WISE.clear(thisApp.id);
		return false;
	}
	
	var jo = j.adc_database;

	var cur = jo.currentconditions;
	
	var forecast = new Array();
	
	forecast.push("<img src='WISE/apps/images/weather/small/" + cur.weathericon + ".jpg' width=\"41\"/><br/><b>Current Conditions</b><br/>" + cur.weathertext + ", " + cur.temperature + "&deg; " + jo.units.temp + "<br/>Humidity: " + cur.humidity + "<br/>Wind: " + cur.windspeed + jo.units.speed + " " + cur.winddirection);
	
	var myDate = new Date();
	var fore = jo.forecast.day;
	for (var i=0; i<fore.length; i++) {
		cur = fore[i];
		forecast.push("<img src='WISE/apps/images/weather/small/" + cur.daytime.weathericon + ".jpg' width=\"41\" /><br/><b>" + cur.daycode + " " + cur.obsdate + "</b><br/>" + cur.daytime.txtshort + "<br/>" + cur.daytime.hightemperature + "&deg; " + jo.units.temp + " | " + cur.nighttime.lowtemperature + "&deg; " + jo.units.temp);
		forecast.push("<img src='WISE/apps/images/weather/small/" + cur.nighttime.weathericon + ".jpg' width=\"41\"/><br/><b>" + cur.daycode.substring(0,3) + " Night " + cur.obsdate + "</b><br/>" + cur.nighttime.txtshort + "<br/>" + cur.nighttime.hightemperature + "&deg; " + jo.units.temp + " | " + cur.nighttime.lowtemperature + "&deg; " + jo.units.temp);
	}
	
	var weatherText = "";
	weatherText += "<div class='wise_weather_container'><span style='font-size:13px; font-weight:bold;margin:0 0 5px 0;'>Forecast for " + jo.local.city + ", " + jo.local.state + " (updated " + jo.currentconditions.observationtime + ")</span>";

	weatherText += "<div id='weather_3day_" + encodeURIComponent(WISE.Q.q) + "' class='wise_weather_forecast'>"
	weatherText += "<table class='wise_weather_tabletext'>";
	weatherText += "<tr>"
	for (var i=0; i<forecast.length; i++) {
		weatherText += "<td align='center' valign='top'>" + forecast[i] + "</td>"
	}
	weatherText+="</tr></table>";
	weatherText+="<div style='margin:10px 0'><img src='http://vortex.accuweather.com/adc2004/pub/images/dl-center/accuweather_logotype_color_72.jpg' width='170px' /></div>";
	weatherText+="</div>";
	
	WISE.create("Accuweather Forecast for " + jo.local.city + ", " + jo.local.state, jo.currentconditions.url, weatherText, thisApp.id);

}

function weatherShowHide(which) {

	WISE.getQ();
	WISE.getElement("weather_3day_" + encodeURIComponent(WISE.Q.q)).hide();
	WISE.getElement("weather_radar_" + encodeURIComponent(WISE.Q.q)).hide();
	WISE.getElement("weather_aq_" + encodeURIComponent(WISE.Q.q)).hide();
	if(WISE.getElement("weather_htrack_" + encodeURIComponent(WISE.Q.q))) WISE.getElement("weather_htrack_" + encodeURIComponent(WISE.Q.q)).hide();
	WISE.getElement("weather_" + which+ "_" + encodeURIComponent(WISE.Q.q)).show();

}

WISE.scope("weatherShowHide", weatherShowHide, "weather");

thisApp.css = {
	"container":{
		"width":"100%"
	},
	"forecast":{
		"display":"block",
		"width":"100%"
	},
	"tabletext":{
		"font-size":"10px"
	}
}
