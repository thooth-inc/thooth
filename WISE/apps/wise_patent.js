function patentFetch(){
	
	if (!WISE.apps.patent) {alert("uh oh"); return false;};
	
	WISE.call("http://ajax.googleapis.com/ajax/services/search/patent?v=1.0&q="+encodeURIComponent(thisApp.params[0].replace("patent",""))+"&callback=patentRender", thisApp.id);
	

}
function patentRender(j) {
	if(!j || !j.responseData || !j.responseData.results) return;
	var sr = j.responseData.results;
	if(sr.length == 0) return;

	var sel = '';
	for(var i=0;i<sr.length;i++){
		sel += '<div style="white-space:nowrap;overflow:hidden;padding:3px;"><a href="'+sr[i].unescapedUrl+'">'+sr[i].title+' - </a><br>'+sr[i].content+'</div>';
			
	}

	WISE.create(WISE.Q.q.replace("patents","")+" - Google Patent Results", j.responseData.cursor.moreResultsUrl, sel, thisApp.id)
   
}
// WISE.create(title, URL, stringOfResults, thisApp.id)