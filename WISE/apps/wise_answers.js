function answersFetch(){
	
	if (!WISE.apps.answers) {alert("uh oh"); return false;};

	var apikey = "xn0wlSbV34FyhFUpNs.JhRy8VT0OCs4bcIXxEWTfEugKLUyvw71fA7nNbi0GOOUy9ogukb6E"

	WISE.call("http://answers.yahooapis.com/AnswersService/V1/questionSearch?appid="+apikey+"&search_in=best_answer&type=resolved&results=5&output=json&callback=answersRender&query="+encodeURIComponent(thisApp.params[0]), thisApp.id);

}

function answersRender(j)
{
	if(!j || !j.all || !j.all.questions) return;

	var sr = j.all.questions;
	if(sr.length == 0) return;
	
	var sel = '';
	for(var i=0; i<sr.length; i++)
	{
		sel += '<div style="white-space:nowrap;overflow:hidden;padding:3px;"><a href="'+sr[i].Link+'">'+sr[i].Subject+' - </a><br>'+sr[i].Content+'</div>';
		
	}

	WISE.create(WISE.Q.q.replace(":answer","") + " - Yahoo! Answers Results", "http://answers.yahoo.com/search/search_result?p= "+encodeURIComponent(thisApp.params[0]), sel, thisApp.id)
	
}
