function trackUPS(){
	
	if (!WISE.apps.trackups) {alert("uh oh"); return false;};
	
	cur = WISE.apps.trackups;
	
	var link = "http://wwwapps.ups.com/WebTracking/processInputRequest?sort_by=status&tracknums_displayed=1&TypeOfInquiryNumber=T&loc=en_US&InquiryNumber1=" + String(cur.params[0]).replace(/ /g, "") + "&track.x=0&track.y=0";
	var title = "Track "+cur.params[0]+" via UPS";
	
	r = WISE.resultAdd( WISE.Q,link,title,"",true);
	WISE.finalize(WISE.Q, thisApp.id, r); // apply any possible KT stuff
	
}
