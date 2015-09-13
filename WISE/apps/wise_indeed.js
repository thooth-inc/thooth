function indeedFetch(){
	
	var callUrl = WISE.server + "/index.php?action=ajax&rs=wfGetGenericXMLtoJSON&rsargs[]=http%3A%2F%2Fapi.indeed.com%2Fads%2Fapisearch%3Fpublisher%3D9710591231404182%26q%3D&rsargs[]=indeedRender&rsargs[]="+encodeURIComponent(WISE.trim(thisApp.params[0]) + " " + WISE.trim(thisApp.params[1]));
	WISE.call(callUrl, thisApp.id);

}

function indeedRender(j) {
	
	if(!j.response || !j.response.results) {
		WISE.clear(thisApp.id);
		return;
	}
	//alert("hello");
	
	var itemset = j.response.results;
	
	if(!itemset.result) {
		WISE.clear(thisApp.id);
		return;
	}
	
	var items;
	if(!itemset.result.length) {
		items = new Array();
		items.push(itemset.result);
	}
	else items = itemset.result;
	
	var itemLimit = 3;
	
	var limit = (items.length > itemLimit) ? itemLimit : items.length;

	
	var title = "Indeed - " + WISE.trim(thisApp.params[0]) + " jobs in " + WISE.trim(thisApp.params[1]);
	var link = "http://www.indeed.com/jobs?q="+ encodeURIComponent(WISE.trim(thisApp.params[0]) + " " + WISE.trim(thisApp.params[1]));
	var output = "";
	
	for (var i=0; i<limit; i++) {
		if (!items[i]) break;
		var cur = items[i];

		//var pubDate = Date.parse(cur.submit_date);
		output += "<div " + ((i<items.length-1)? "class='wise_indeed_item'" : "" ) + "><a href='" + cur.url + "'>"+cur.jobtitle+"</a><br/>" + cur.snippet.substring(0,100) + "<br/>"
		+ "Company: " + cur.company + " - " + cur.city + ", " + cur.state + " " + cur.country + " " + cur.date + "</div>";
	}
	

	if (output != "") {
		output += "<img src='http://www.indeed.com/images/job_search_indeed.gif' width=125 />";
		WISE.create(title, link, output, thisApp.id);
	}
	else {
		WISE.clear(thisApp.id);
	}
	
}

thisApp.css = {
	"item":{
		"margin":"0 10px 0 0"
	}
}
