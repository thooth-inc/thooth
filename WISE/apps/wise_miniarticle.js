function miniarticleFetch(){
	
	search_term = WISE.trim(thisApp.params[0]);
	
	WISE.call(/*WISE.server*/"http://search.wikia.com/index.php?action=ajax&rs=wfGetArticleJSON&rsargs%5B%5D=Mini:"+encodeURIComponent(search_term)+"&rsargs%5B%5D=miniarticleRender&rsargs%5B%5D=1&rsargs%5B%5D=100", thisApp.id);
	
}

function miniarticleRender( j ){
	
	if( !j.title ){
		WISE.clear(thisApp.id);
		return false;
	}
	
	search_url = j.url;
	search_title = "Mini Article for " + j.title;
	
	WISE.create(search_title, search_url, "", thisApp.id, j.html);

}
