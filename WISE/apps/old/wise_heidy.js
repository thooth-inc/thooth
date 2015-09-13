WISE.apps.heidy = {
	"id":"heidy",
	"regex":/.*(heidy).* /i,
	"url":"WISE/apps/wise_heidy.js?r=" + Math.random(),
	"action":"heidyFetch"
};



function heidyFetch(){
	
	if (!WISE.apps.heidy) {alert("uh oh"); return false;};
	
	cur = WISE.apps.heidy;
	
	var output = "<img src='http://users.skynet.be/sky77548/squirrel3.gif' height='150' width='150' />";
	var link = 'http://users.skynet.be/sky77548/squirrel3.gif';
	var title = "HEIDY!!!!!!!!!!!";
	
	
	r = WISE.resultAdd( WISE.Q,link,title,"",true);
	//annAdd(r,"text",{"sel":j.rss.channel.item.description});
	WISE.annAdd(r,"text",{"sel":output});
	WISE.annRender(r);
	WISE.finalize(WISE.Q, thisApp.id, r); // apply any possible KT stuff
	
}
