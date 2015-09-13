function crunchbaseFetch(){
	var callUrl = "http://api.crunchbase.com/v/1/search.js?callback=crunchbaseRender&query=" + encodeURIComponent(WISE.trim(thisApp.params[0]));
	WISE.call(callUrl, thisApp.id);
}

function crunchbaseRender(j) {
	if(!j.results || !j.results.length) {
		WISE.clear(thisApp.id);
		return;
	}
	var title = "Crunchbase Search Results on " + WISE.trim(thisApp.params[0]);
	var link = j.crunchbase_url;
	var output = "";
	var table_output = "<table class='wise_crunchbase_table'>";
	
	var maxlength = 3;
	var limit = (j.results.length > maxlength ? maxlength : j.results.length);
	for (var i=0; i<limit; i++) {
		if (!j.results[i]) break;
		var cur = j.results[i];

		output += "<tr><td valign='top'>";
		output += "<img src='http://www.crunchbase.com/" + ((cur.image && cur.image.available_sizes && cur.image.available_sizes.length) ?  cur.image.available_sizes[0][1]  : "images/logo.png")+ "' width='65' class='wise_crunchbase_image' />";
		output += "<td" + ((i<limit-1)? " class='wise_crunchbase_item'" : "" ) + "><a href='" + cur.crunchbase_url + "'>"+(cur.name ? cur.name : cur.first_name + " " + cur.last_name) + " (" + cur.namespace + ")</a><br/>" + (cur.overview ? cur.overview.substring(0,150) : "") + "</td></tr>";
	}
	

	if (output != "") {
		output = table_output + output + "</table>";
		output += "<img src='http://www.crunchbase.com/images/logo.png' width='100'/>";
		WISE.create(title, link, output, thisApp.id);
	}
	else {
		WISE.clear(thisApp.id);
	}
	
	
}

thisApp.css = {
	"item":{
		"padding":"0 0 10px 0"
	}
};
