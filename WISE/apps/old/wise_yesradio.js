WISE.apps.yesradio = {
	"name":"YES Radio",
	"logo":"http://www.yes.com/favicon.ico",
	"author": "Wikia Search",
	"description":"Displaying the now-playing information from YES.com",
	"categories":[ "Music" ],
	"id":"yesradio",
	"regex":/^(\w{4})$/i,
	"url":"WISE/apps/wise_yesradio.js?r=" + Math.random(),
	"action":"yesradioFetch"
};



function yesradioFetch(){
	
	WISE.call("http://www.yes.com/ajax/searchnow.php?cb=yesRender&q=" + thisApp.params[0], thisApp.id);
}

function yesradioRender( j ){
	if(!j || !j.r || j.r.length == 0) {
		WISE.clear(thisApp.id);
		return;
	}
	
	var s = j.r[0];
	if(!s.now) {
		WISE.clear(thisApp.id);
		return;
	}

	var sel = "<h3>Now Playing:</h3>";
	sel += "<a href='http://yes.com/itunesyb.php?mid="+s.now.id+"&artist="+s.now.artist+"&song="+s.now.song+"'>";
	sel += "<img src='http://yes.com/coverid.php?id="+s.now.id+"' border='0' width='60' style='text-decoration:none;float:left;margin:5px;'/>";
	sel += "<br /><big><big>"+s.now.artist+"<br />"+s.now.song+"</big></big></a><br clear='all' />";
	
	WISE.create("Now Playing on " + s.name + " " + s.desc, "http://www.yes.com/#" + s.name, sel, thisApp.id, "Station logs, charts, and chat powered by YES.com");
	
}
 