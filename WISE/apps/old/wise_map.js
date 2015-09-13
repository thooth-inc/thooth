WISE.apps.map = {
	"id":"map",
	"name":"Map",
	"regex":/.*(?:map )(.+)/i,
	"url":"WISE/apps/wise_map.js?r=" + Math.random(),
	"action":"mapFetch"
};

function mapFetch(){
	
	if (!WISE.apps.map) {alert("uh oh"); return false;};
	
	cur = WISE.apps.map;
	q = cur.params[0];
	r = WISE.resultAdd( WISE.Q , "http://maps.google.com/maps?f=q&hl=en&geocode=&q=" + q, "Mapping " + q, "", true);
	    
	resultText = '<iframe width="300" height="215" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="http://fp029.sjc.wikia-inc.com/search/exp/gmap.html?q=' + q + '"></iframe>';
	    
	WISE.annAdd(r, "text", {"sel":resultText} );
	WISE.annRender(r);  
	WISE.finalize(WISE.Q, thisApp.id, r); // apply any possible KT stuff
	
}
