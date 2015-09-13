function nbaplayerFetch(){
	
	if (!WISE.apps.nbaplayers) {alert("uh oh"); return false;};
	
	player = thisApp.params[0]
	r = WISE.resultAdd( WISE.Q, "http://www.nba.com",player + " - NBA.com Widget","",true);
	
	player_widget_format = player.replace(/\s/i,"_").toLowerCase();
	widget = '<object id="W45881d714d8ff0fd48dfb3910aaa0369" width="404" height="318" quality="best"  data="http://widgets.nba.com/o/45881d714d8ff0fd/48dfb3910aaa0369/45881d714d8ff0fd/5d2748cf/-DNW/1/player_code/' + player_widget_format + '/-PUR/http%3A%2F%2Fwww.nba.com%2Fplayerfile%2F' + player_widget_format + '%2Findex.html%23widget" pluginspage="http://www.macromedia.com/go/getflashplayer" type="application/x-shockwave-flash"><param name="scalemode" value="showAll"/><param name="menu" value="false"/><param name="wmode" value="transparent"/><param name="allowNetworking" value="all" /><param name="allowScriptAccess" value="always"/> </object>';
	WISE.annAdd(r,"text",{"sel":widget});
	WISE.annRender(r);
	WISE.finalize(WISE.Q, thisApp.id, r); // apply any possible KT stuff
	
}
