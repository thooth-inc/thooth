function getWebTraffic(){

	var title = "Traffic Comparison Graph From Compete"
	var url = "http://grapher.compete.com/" + thisApp.params.join("+") + "?metric=uv"

	result_text = "";
	result_text += "<div><a href='http://grapher.compete.com/" + thisApp.params.join("+") + "?metric=uv'><img src='http://grapher.compete.com/" + thisApp.params.join("+") + "_uv_310.png' border=\"0\"/></a>";
	result_text += "<br/><br/><div><b>Other Traffic Comparison Tools</b></div>";
	
	//Alexa
	main_site = thisApp.params[0];
	url = "http://www.alexa.com/data/details/traffic_details/" + main_site + "?u[]=" + main_site + "site0=" + main_site + "&range=6m&size=Medium&y=r&z=3&h=300&w=470&c=1"
	
	for(x=1;x<=thisApp.params.length-1;x++){
		url += "&site" + x + "=" + thisApp.params[x] + "&u[]=" + thisApp.params[x]
	}
	result_text += "<div><a href=\"" + url + "\">Alexa</a></div>"
	
	//quantcast
	result_text += "<div><a href=\"http://www.quantcast.com/profile/traffic-compare?"
	for(x=0;x<=thisApp.params.length-1;x++){
		result_text += "domain" + x + "=" + thisApp.params[x] + "&";
	}
	result_text += "\">Quantcast.com</a></div>";

	//Google Trends
	main_site = thisApp.params[0];
	url = "http://trends.google.com/websites?q="
	
	for(x=0;x<=thisApp.params.length-1;x++){
		url += thisApp.params[x] + ((url)? "%2C+":"")
	}
	result_text += "<div><a href=\"" + url + "\">Google Website Trends</a></div>"
	
	
	WISE.create(title, url, result_text, thisApp.id);
 
}



