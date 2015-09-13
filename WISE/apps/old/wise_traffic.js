WISE.apps.traffic = {
	"id":"traffic",
	"regex":/.*(?:traffic )(.+)/i,
	"url":"WISE/apps/wise_traffic.js?r=" + Math.random(),
	"action":"trafficFetch"
};



function trafficFetch(){
	if (!WISE.apps.traffic) {alert("uh oh"); return false;};
	
	cur = WISE.apps.traffic;
	WISE.call("http://local.yahooapis.com/MapsService/V1/trafficData?appid=xn0wlSbV34FyhFUpNs.JhRy8VT0OCs4bcIXxEWTfEugKLUyvw71fA7nNbi0GOOUy9ogukb6E&output=json&callback=trafficRender&location="+encodeURIComponent(WISE.trim(cur.params[0].replace("traffic","")))+"&r="+Math.random(), cur.id);
}

function trafficRender( j ){

	if( !j.ResultSet ){
		return false;
	}

	var updates = j.ResultSet.Result;
	var updateTime = new Date()
	updateTime.setTime(parseInt(j.ResultSet.LastUpdateDate)*1000);
	
	
	r = WISE.resultAdd( WISE.Q ,"http://local.yahooapis.com/MapsService/rss/trafficData.xml?location="+encodeURIComponent(WISE.trim(WISE.Q.q.replace("traffic",""))),"Traffic updates for " + WISE.trim(WISE.Q.q.replace("traffic","")),"Updated " + updateTime.toLocaleString(),true);
	var alerts = new Array();
	
	for (var i=0; i<updates.length; i++) {
		cur = updates[i];
		var reportTime = new Date();
		reportTime.setTime(parseInt(cur.ReportDate)*1000);
		var updatedTime = new Date();
		updatedTime.setTime(parseInt(cur.UpdateDate)*1000);
		var endTime = new Date();
		endTime.setTime(parseInt(cur.EndDate)*1000);
		alerts.push("<b>" + cur.Title + ":</b><br/>Type: " + cur.type + ", Severity: " + cur.Severity + ", Direction: " +cur.Direction + "<br/>Reported: " +reportTime.toLocaleString()+ "; Effective Until: " +endTime.toLocaleString()+"<br/>" + cur.Description);
	}
	
	
	
	for (var i=0; i<alerts.length; i++) {
		WISE.annAdd(r,"text",{"sel":alerts[i]});
		WISE.annRender(r);
	}
	
	WISE.finalize(WISE.Q, thisApp.id, r); // apply any possible KT stuff
	
}
