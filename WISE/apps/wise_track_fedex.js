function trackFEDEX(){
	
	if (!WISE.apps.trackfedex) {alert("uh oh"); return false;};
	
	cur = WISE.apps.trackfedex;
	
	var link = "http://www.fedex.com/cgi-bin/tracking?action=track&language=english&cntry_code=us&initial=x&tracknumbers=" + String(cur.params[0]).replace(/ /g, "");
	var title = "Track "+cur.params[0]+" via FedEx";
	
	r = WISE.resultAdd( WISE.Q,link,title,"",true);
	WISE.finalize(WISE.Q, thisApp.id, r); // apply any possible KT stuff
	
}
