function imdbFetch(){
	
	var callUrl = WISE.server + "/index.php?action=ajax&rs=wfGetIMDBData&rsargs[]=" + encodeURIComponent(WISE.trim(thisApp.params[0])) + "&rsargs[]=imdbRender";
	WISE.call(callUrl, thisApp.id);

}

function imdbRender(j) {
	
	if(!j.type || !j.info) {
		WISE.clear(thisApp.id);
		return;
	}
	var title = "IMDB - " + WISE.trim(thisApp.params[0]);
	var link = j.info.URL;
	var output = "<table><tr><td><img src='WISE/apps/images/imdb/imdb.gif' width=90 /></td><td valign='top'>";
	if (j.type == "Title") {
		output += "<div class='wise_imdb_headline'>" + j.info.Title + " (" + j.info.Year + ")</div>";
	}
	else {
		output += "<div class='wise_imdb_headline'>" + j.info.Name + "</div>"
			+ "<div>" + j.info.Job + ": " + j.info.Title + " (" + j.info.Year + ")</div>";
	}
	output +="</td></tr></table>"
	

	if (output != "") {
		WISE.create(title, link, output, thisApp.id);
	}
	else {
		WISE.clear(thisApp.id);
	}
	
	
}

thisApp.css = {
	"headline":{
		"font-weight":"bold"
	}
};
