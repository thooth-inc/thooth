function washPostFetch(){	
	
	thisApp.params[0] = (" " + thisApp.params[0] + " ").replace(" news ", "");
	var callUrl = WISE.server + "/index.php?action=ajax&rs=wfGetWashingtonPost&rsargs[]=" + encodeURIComponent(WISE.trim(thisApp.params[0])) + "&rsargs[]=washPostRender"
	WISE.call(callUrl, thisApp.id);

}

function washPostRender(j) {
	
	if(!j || !j.results || !j.results.documents || !j.results.documents.document){
		WISE.clear(thisApp.id);
		return;
	}
	
	var title = "Washington Post - Recent Stories on " + WISE.trim(thisApp.params[0]);
	var link = "http://www.washingtonpost.com/ac2/wp-dyn/NewsSearch?sb=-1&st=" + WISE.trim(thisApp.params[0])
	var output = "";
	var stories = j.results.documents.document;
	var limit = (stories.length > 3 ? 3 : stories.length);
	for (var i=0; i<limit; i++) {
		if (!stories[i]) break;
		var cur = stories[i];
		var date_re = /\/([0-9]{4})\/([0-9]{2})\/([0-9]{2})\//;
		var date_matches = date_re.exec(cur.contenturl);
		var article_date = false;
		if(date_matches) article_date = date_matches[2] + "/" + date_matches[3] + "/" + date_matches[1];
		output += "<div " + ((i<limit-1)? "class='wise_washingtonpost_item'" : "class='wise_washingtonpost_item wise_washingtonpost_bottomfix'" ) + "><a href='" + cur.contenturl + "'>"+cur.headline+"</a>" + (article_date ? "<span class='wise_washingtonpost_info'>" + article_date + "</span>" : "") + "<br/>" + cur.blurb.substring(0, 200) + "<br/></div>";
	}
	

	if (output != "") {
		output += "<img src='http://media.washingtonpost.com/wp-srv/hp/gr/hp-logo-washpostcom.gif' width=150/>";
		WISE.create(title, link, output, thisApp.id);
	}
	else {
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
