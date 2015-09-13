function trackUSPS(){
	
	if (!WISE.apps.trackusps) {alert("uh oh"); return false;};
	
	cur = WISE.apps.trackusps;
	
	var link = "http://trkcnfrm1.smi.usps.com/netdata-cgi/db2www/cbd_243.d2w/output?CAMEFROM=OK&strOrigTrackNum=" + String(cur.params[0]).replace(/ /g, "");
	var title = "Track "+cur.params[0]+" via USPS";
	
	r = WISE.resultAdd( WISE.Q,link,title,"",true);
	WISE.finalize(WISE.Q, thisApp.id, r); // apply any possible KT stuff
	
}
