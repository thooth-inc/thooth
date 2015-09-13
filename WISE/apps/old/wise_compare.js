WISE.apps.compare = {
	"name":"Search Result Comparison",
	"author": "",
	"description":"Compare yahoo, google, and wikia results",
	"id":"compare",
	"regex":/(?:compare )(.+)/i,
	"url":"WISE/apps/wise_compare.js?r=" + Math.random(),
	"action":"compareFetch"
};

function compareFetch(){
	
	if (!thisApp) {alert("uh oh"); return false;};
	
	var callURL = "http://boss.yahooapis.com/ysearch/web/v1/" + encodeURIComponent(thisApp.params[0]) + "?appid=GD2UGdfIkY1gi6EBoIck4Exv2xLUsVrm&lang="+WISE.getLang()+"&callback=yahooDone&count=8&r="+Math.random()
	WISE.call(callURL, thisApp.id);

}

function yahooDone(j) {
	
	var callURL = "http://ajax.googleapis.com/ajax/services/search/web?v=1.0&q=" + encodeURIComponent(thisApp.params[0]) + "&rsz=large&callback=googleDone&r="+Math.random()
	
	if (j.ysearchresponse && j.ysearchresponse.resultset_web) {
		
		var yahoo = {};
		
		yahoo.items = new Array();
		yahoo.id="y";
		yahoo.name = "Yahoo!";
		
		for (var i=0; i<j.ysearchresponse.resultset_web.length; i++) {
			var result = j.ysearchresponse.resultset_web[i];
			yahoo.items.push({"url":result.url,"title":result.title,"summary":result.abstract});
			if (urls[result.url]) urls[result.url] += yahoo.id;
			else urls[result.url] = yahoo.id;
		}
		arr.yahoo = yahoo;
	}
	
	WISE.finalizenoreview("compare");
	WISE.call(callURL, thisApp.id);
}

function googleDone(j) {
	if (j.responseData && j.responseData.results) {
	
		var google = {};
		
		google.items = new Array();
		google.id = "g";
		google.name = "Google";
		
		for (var i=0; i<j.responseData.results.length; i++) {
			var result = j.responseData.results[i];
			google.items.push({"url":result.url,"title":result.titleNoFormatting,"summary":result.content});
			if (urls[result.url]) urls[result.url] += google.id;
			else urls[result.url] = google.id;
			
		}
		arr.google = google;
	}
	wikiaDone();
}

function wikiaDone() {
	var results = WISE.getQ();
	
	var wikia = {};
	
	wikia.items = new Array();
	wikia.id = "w";
	wikia.name = "Wikia";
	
	var result = results.firstChild;
	for (var i=0; i<10; i++) {
		if(!result) break
		try {
			var items = result.firstChild.getElementsByTagName("div");
		
			var url = items[1].firstChild.href;
			var title = items[1].firstChild.innerHTML;
			var summary = items[4].innerHTML;
			
			wikia.items.push({"url":url,"title":title,"summary":summary});
			
			if (urls[url]) urls[url] += wikia.id;
			else urls[url] = wikia.id;
			
			if(wikia.items.length == 8) break;
			
		}catch(ex) {
			result = result.nextSibling;
			continue;
		}
		result = result.nextSibling;
	}
	arr.wikia = wikia;
	
	compareRender();
}

function compareRender() {
	if(!arr.yahoo || !arr.google) return;
	
	var title = "Comparing da shiznit";
	var url = "http://www.comparingdashiznit.gov";

	/*
	var inAll = "";
	for (site in arr) {
		inAll += arr[site].id;
	}
	*/
	
	
	var output = "<table><tr>"

	for (site in arr) {
		output += "<td valign='top'>" + arr[site].name + "<br/>";
		for (var i=0; i<arr[site].items.length; i++) {
			var item = arr[site].items[i];
			//output += "<div" + ((urls[item.url] && urls[item.url]==inAll) ? " style='background-color:#DCDCDC;'" : "")  + "><a href='" + item.url + "'>"+item.title.substring(0,25)+"</a><br/>"
			output += "<div style='background-color:" + getColor(item.url) + "'><a href='" + item.url + "'>"+item.title.substring(0,25)+"</a><br/>"
				+ item.summary.replace(/\<b\>/gi, "").replace(/\<\/b\>/gi, "").substring(0,25) + "<br/>"
				+ item.url.substring(0,25)
				+ "</div>";
		}
		output += "</td>";
	}
	
	output += "</tr></table>";
	
	r = WISE.resultAdd( WISE.Q,url,title,"",true);
	//annAdd(r,"text",{"sel":j.rss.channel.item.description});
	WISE.annAdd(r,"text",{"sel":output});
	WISE.annRender(r);
	WISE.finalize(WISE.Q, thisApp.id, r); // apply any possible KT stuff

	//WISE.apps.amazon.showHide('x');
}

function getColor(url) {
	if (!urls[url]) return "#FFFFFF";
	
	if(urls[url] == "yg") return "#FF0000";
	else if(urls[url] == "yw") return "#FFFF00";
	else if(urls[url] == "gw") return "#00FF00";
	else if(urls[url] == "ygw") return "#DCDCDC";
	else return "#FFFFFF";
}


var arr={};
var urls={};
