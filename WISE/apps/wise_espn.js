function espnFetch(){
	
	var xmlUrl = "http://search.espn.go.com/rss/" + encodeURIComponent(thisApp.params[0].toLowerCase().replace(/ /g, "-")) + "/stories/5";

	var callUrl = WISE.server + "/index.php?action=ajax&rs=wfGetGenericXMLtoJSON&rsargs[]=" + encodeURIComponent(xmlUrl) + "&rsargs[]=espnRender";

	WISE.call(callUrl, thisApp.id);

}

function espnRender(j) {
	
	if(!j.rss || !j.rss.channel) {
		WISE.clear(thisApp.id);
		return;
	}
	
	var itemset = j.rss.channel;
	
	if(!itemset.item) {
		WISE.clear(thisApp.id);
		return;
	}
	
	var items;
	if(!itemset.item.length) {
		items = new Array();
		items.push(itemset.item);
	}
	else items = itemset.item;
	
	var itemLimit = 3;
	
	var limit = (items.length > itemLimit) ? itemLimit : items.length;
	
	var title = "Top Sports News Stories from ESPN on " + WISE.trim(thisApp.params[0]);
	var link = "http://search.espn.go.com/" + encodeURIComponent(thisApp.params[0].toLowerCase().replace(/ /g, "-")) + "/stories/5";
	var output = "";
	
	for (var i=0; i<limit; i++) {
		if (!items[i]) break;
		var cur = items[i];

		output += "<div " + ((i<items.length-1)? "class='wise_espn_item'" : "" ) + "><a href='" + cur.link + "'>"+cur.title+"</a><br/>" + cur.description.substring(0,100) + "</div>";

	}

	if (output != "") {
		output += "<img src='http://assets.espn.go.com/i/tvlistings/tv_espn_original.gif' />";
		WISE.create(title, link, output, thisApp.id);
	}
	else {
		WISE.clear(thisApp.id);
	}
	
	
}

thisApp.css = {
	"item":{
		"margin-bottom":"5px",
		"padding-bottom":"5px",
		"border-bottom":"1px dashed #DCDCDC"
	}
}
