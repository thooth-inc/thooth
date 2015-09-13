function reutersFetch(){

	var callUrl = WISE.server + "/index.php?action=ajax&rs=wfGetReutersData&rsargs[]=" + encodeURIComponent(WISE.trim(thisApp.params[0])) + "&rsargs[]=reutersRender"

	WISE.call(callUrl, thisApp.id);

}

function reutersRender(j) {
	
	if(!j.reutersResults || !j.reutersResults.results|| !j.reutersResults.results.length){
		WISE.clear(thisApp.id);
		return;
	}

	var title = "Financial News from Reuters on " + WISE.trim(thisApp.params[0]);
	var link = "http://search.us.reuters.com/query/?q=" + WISE.trim(thisApp.params[0])
	var output = "";
	var stories = j.reutersResults.results;
	for (var i=0; i<stories.length; i++) {
		if (!stories[i]) break;
		var cur = stories[i];
		output += "<div " + ((i<stories.length-1)? "class='wise_reuters_item'" : "class='wise_reuters_item wise_reuters_bottomfix'" ) + "><a href='" + cur.ArticleUrl + "'>"+cur.Headline+"</a><span class='wise_reuters_info'>" + cur.TimeStamp + "</span><br/>" + cur.Summary.replace(/\&lt;(.*)\&gt;/g, "").substring(0, 200) + "<br/>"
		if(stories[i].StockSymbols && stories[i].StockSymbols.length) {
			output += "<span class='wise_reuters_symbols'>Companies Mentioned: ";
			for (var j=0; j<stories[i].StockSymbols.length; j++) {
				output += "<a href='http://www.reuters.com/stocks/quote?symbol=" + stories[i].StockSymbols[j] + "'>" + stories[i].StockSymbols[j] + "</a>" + (j<stories[i].StockSymbols.length-1 ? ", " : "");
			}
		}
		output += "</span></div>";
		
	}
	
	if (output != "") {
		output += "<img src='http://www.reuters.com/resources/images/logo_reuters_media_us.gif' />";
		WISE.create(title, link, output, thisApp.id);
	}else {
		WISE.clear(thisApp.id);
	}
	
	
}

thisApp.css = {
	"item":{
		"padding":"0 0 10px 0"
	},
	"bottomfix":{
		"border-bottom":"0px"
	},
	"info":{
		"font-size":"11px",
		"color":"#767676",
		"position":"absolute",
		"right":"0px"
	},
	"symbols":{
		"font-size":"10px"
	}
};
