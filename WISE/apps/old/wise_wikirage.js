WISE.apps.wikirage = {
	"name":"Wikirage",
	"author": "Wikia Search",
	"description":"Kicks off if query is found in top 100 pages in wikirage",
	"id":"wikirage",
	"regex":/(.*)/i,
	"url":"WISE/apps/wise_wikirage.js?r=" + Math.random(),
	"action":"inWikirage",
	"hideDisplay":true
};



function inWikirage(){

	if (!WISE.apps.wikirage) {alert("uh oh"); return false;};
	
	cur = WISE.apps.wikirage;
	WISE.call(WISE.server+"/index.php?action=ajax&rs=wfGetWikiRagePages&rsargs[]="+encodeURIComponent(WISE.trim(cur.params[0]))+"&rsargs[]=24&rsargs[]=wikirageRender&r="+Math.random(), cur.id);
}

function wikirageRender( search_term ){

	WISE.run(decodeURIComponent(search_term), "twitter");
	WISE.clear("wikirage");

}

