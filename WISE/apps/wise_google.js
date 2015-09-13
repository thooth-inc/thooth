function googleFetch(){
	
	WISE.call("http://ajax.googleapis.com/ajax/services/search/web?v=1.0&q="+encodeURIComponent(thisApp.params[0].replace("google",""))+"&callback=googleRender", thisApp.id);

}

function googleRender(j){

	if(!j || !j.responseData || !j.responseData.results) {
		WISE.clear(thisApp.id);
		return;
	}
	var sr = j.responseData.results;
	if(sr.length == 0) {
		WISE.clear(thisApp.id);
		return;
	}
	
	var output = ""

	var sel = '';
	for(var i=0;i<sr.length;i++){
		var sel = '<div style="white-space:nowrap;overflow:hidden;"><a href="'+sr[i].unescapedUrl+'">'+sr[i].title+' - '+sr[i].visibleUrl+'</a><br>'+sr[i].content+'</div>';
		output += sel;
	}
	WISE.create(WISE.Q.q.replace("google","")+" - Google Search Results", j.responseData.cursor.moreResultsUrl, output, thisApp.id);
}
