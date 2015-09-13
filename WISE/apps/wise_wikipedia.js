function wikipediaFetch(){
	
	if (!WISE.apps.wikipedia) {alert("uh oh"); return false;};
	
	cur = WISE.apps.wikipedia;

	search_url = "http://en.wikipedia.org/w/api.php?action=query&list=search&srwhat=text&srsearch="+encodeURIComponent(cur.params[0].replace("wikipedia",""))+"&format=json&callback=wikipediaRender";

	WISE.call(search_url, cur.id);
}

function wikipediaRender(j){

	if(!j || !j.query || !j.query.search) return;
	var sr = j.query.search;
	if(sr.length == 0) return;
	var art = sr[0].title.replace(/ /g,"_");

	var r = WISE.resultAdd(WISE.Q,"http://en.wikipedia.org/wiki/"+encodeURIComponent(art).replace(/%2F/g,"\/") ,sr[0].title + " - Wikipedia, the free encyclopedia","",true);
	var sel = '<iframe width="100%" height="300" frameborder="0" marginheight="0" marginwidth="0" style="overflow-y:scroll;overflow-x:hidden" src="';
	sel += 'http://en.wikipedia.org/w/index.php?action=render&title='+encodeURIComponent(art).replace(/%2F/g,"\/");
	sel += '"></iframe>';
    
	WISE.annAdd(r, "text", {"sel":sel} );
    	WISE.annRender(r);
    	WISE.finalize(WISE.Q, thisApp.id, r); // apply any possible KT stuff

}
