function yahooSpellFetch(){
	
	var callUrl = WISE.server + "/index.php?action=ajax&rs=wfGetYahooBossData&rsargs[]=" + encodeURIComponent(WISE.trim(thisApp.params[0])) + "&rsargs[]=spelling" + "&rsargs[]=yahooSpellRender";
	WISE.call(callUrl, thisApp.id);

}

function yahooSpellRender(j) {
	
	if(!j.catalog_titles || !j.catalog_titles.catalog_title) {
		WISE.clear(thisApp.id);
		return;
	}
	
	var theItem = {};
	var found = false;
	if (j.catalog_titles.catalog_title.length) {
		for (var i=0; i<j.catalog_titles.catalog_title.length; i++) {
			if(!found) {
				if (j.catalog_titles.catalog_title[i].title["@attributes"].regular.toLowerCase().indexOf(WISE.trim(thisApp.params[0]).toLowerCase()) > -1) {
					theItem = j.catalog_titles.catalog_title[i];
					found = true;
				}
				else if (j.catalog_titles.catalog_title[i].link[0].synopsis.toLowerCase().indexOf(WISE.trim(thisApp.params[0]).toLowerCase()) > -1) {
					theItem = j.catalog_titles.catalog_title[i];
					found = true;
				}
			}
		}
		if(!found) {
			var split_array = WISE.trim(thisApp.params[0]).split(" ");
			var temp_found = true;
			for (var i=0; i<j.catalog_titles.catalog_title.length; i++) {
				if(!found) {
					temp_found = true;
					for (var k=0; k<split_array.length; k++) {
						if (!temp_found) continue;
						var temp_temp_found = false;
						if (j.catalog_titles.catalog_title[i].title["@attributes"].regular.toLowerCase().indexOf(split_array[k].toLowerCase()) > -1) {
							temp_temp_found = true;
						}
						else if (j.catalog_titles.catalog_title[i].link[0].synopsis.toLowerCase().indexOf(split_array[k].toLowerCase()) > -1) {
							temp_temp_found = true;
						}
						if(!temp_temp_found) temp_found = false;
					}
					if (temp_found) {
						theItem = j.catalog_titles.catalog_title[i];
						found = true;
					}
				}
			}
		}
		if(!found) {
			WISE.clear(thisApp.id);
			return;
		}
	}
	else theItem = j.catalog_titles.catalog_title;
	
	var title = "Results from Yahoo - " + theItem.title["@attributes"].regular;
	var url = "http://www.yahoo.com";
	var rating = false;
	var genres = "";
	for (var i=0; i<theItem.category.length; i++) {
		if (theItem.category[i]["@attributes"] && theItem.category[i]["@attributes"].scheme) {
			if(theItem.category[i]["@attributes"].scheme.indexOf("mpaa_rating") > 0)	rating = theItem.category[i]["@attributes"].term;
			else if (theItem.category[i]["@attributes"].scheme.indexOf("genre") > 0) genres += theItem.category[i]["@attributes"].term + "; ";
		}
	}
	var output = "<table><tr><td valign='top'><img src='" + theItem.box_art["@attributes"].medium + "' /></td><td valign='top'>";
		output += "<span class='wise_netflix_headline'>" + theItem.title["@attributes"].regular + " (" + theItem.release_year + ") " + (rating ? "[" + rating + "]": "") + "</span>"
		output += (theItem.average_rating ? "<span class='wise_netflix_rating'>Avg. User Rating: " + theItem.average_rating + "</span>" : "");
		output += "<div>" + theItem.link[0].synopsis + "</div>";
		output += (rating ? "<div><b>Genres:</b> " + genres.substring(0,65) + (genres.length > 65 ? "..." : "") + "</div>": "");
		output += "<a href='http://www.netflix.com'>Delivered by Netflix</a>";
	output +="</td></tr></table>"
	for(var i=0; i< theItem.link.length; i++) {
		if(theItem.link[i]["@attributes"].title == "web page") url = theItem.link[i]["@attributes"].href;
	}

	if (output != "") {
		//output += "<a href='http://www.netflix.com'><img src='wise/apps/images/netflix/netflix.png' width='100px' border='0' /></a>";		
		WISE.create(title, url, output, thisApp.id);
	}
	else {
		WISE.clear(thisApp.id);
	}
	
	
}

thisApp.css = {
	"headline":{
		"font-weight":"bold"
	},
	"rating":{
		"position":"absolute",
		"right":"0px",
		"display":"bloc"
	}
};
