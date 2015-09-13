function snoothFetch(){
	
	var callURL = WISE.server+"/index.php?action=ajax&rs=wfGetSnoothJSON&rsargs[]="+encodeURIComponent(WISE.trim(thisApp.params[0]))+"&rsargs[]=snoothRender"
	WISE.call(callURL, thisApp.id);

}

function snoothRender(j) {
	if(!j.wines){
		WISE.clear(thisApp.id);
		return false;
	}
	var wines = j.wines;
	
	var title = "Snooth - Wine Results for " + thisApp.params[0];
	var url = "http://www.snooth.com/wines/" + encodeURIComponent(WISE.trim(thisApp.params[0]));
	var output = "";
	for (var i=0; i<wines.length; i++) {
		var wine = wines[i];
		
		output += "<div class='wise_snooth_container'>"
			+ "<span class='wise_snooth_image'><img src='"+((wine.image && wine.image != "") ? wine.image : 'http://media4.snooth.com/images/default_wine_50.png') +"' height='50px' /></span>"
			+ "<span class='wise_snooth_price'>"
				+ ((wine.price && wine.price != "") ? "$" + wine.price : "")
				+ ((wine.snoothrank && wine.snoothrank != "") ? "<br/>Rank: " + wine.snoothrank + " of 5.0" : "")
				//+ "<br/>" + (wine.available ? "<a class='snoothlink' href='" + wine.link.replace("api.snooth.com", "www.snooth.com") + "'>Buy Online</a>" : "Not Available") 
			+ "</span>"
			+ "<a href='" + wine.link + "'>" + wine.name + ((wine.vintage && wine.vintage!="") ? " (" + wine.vintage + ")" : "") + "</a>"
			+ (((wine.varietal && wine.varietal!="") ||(wine.type && wine.type!="")) ?  "<br/>" : "")
			+ ((wine.varietal && wine.varietal!="") ? "Varietal: " + makeLink(wine.varietal): "")
			+ (((wine.varietal && wine.varietal!="") && (wine.type && wine.type!="")) ?  " - " : "")
			+ ((wine.type && wine.type!="") ? "Type: " + makeLink(wine.type) : "")
			+ ((wine.region && wine.region!="") ? "<br/>Region: " + makeLink(wine.region) : "")
			//+ ((wine.tags && wine.tags!="")? "<br/><div style=\"width:67%; white-space:nowrap; overflow:hidden;\">Tags: " + makeLink(wine.tags, ", ") + "</div>" : "")
			+ ((wine.tags && wine.tags!="")? "<br/>Tags: " + makeLink(wine.tags, ", ") : "")
			+ "</div>";
	}
	
	//output += "<img src=\"http://media1.snooth.com/images/snooth_logo.png\" width='130px' />"
	output += "<img src=\"wise/apps/images/snooth/snooth.gif\" />"
	
	//var r = WISE.resultAdd( WISE.Q,url,title,"",true);
	//WISE.annAdd(r,"text",{"sel":output});
	//WISE.annRender(r);
	//WISE.finalize(WISE.Q, thisApp.id, r); // apply any possible KT stuff
	WISE.create(title, url, output, thisApp.id);
}

function makeLink(text, splitchar) {
	if (!splitchar) splitchar = " > ";
	var maxlength = 75;
	var base = "http://www.snooth.com/wines/";
	var parts = text.split(splitchar);
	var build_parts = new Array();
	var build_length = 0;
	for (var p=0; p<parts.length; p++) {
		build_length += parts[p].length + splitchar.length;
		if(build_length < maxlength) build_parts.push("<a class='wise_snooth_snoothlink' href='" + base + encodeURIComponent(parts[p]) + "'>" + parts[p] + "</a>");
		else break;
	}
	
	return build_parts.join(splitchar) + ((parts.length-build_parts.length) ? " (" + (parts.length-build_parts.length) + " more)" : "");
}

thisApp.css = {
	"snoothlink":{
		"color":"#000099",
		"text-decoration":"none"
	},
	"container":{
		"height":"70px"
	},
	"image":{
		"float":"left",
		"width":"75px",
		"margin-left":"auto",
		"margin-right":"auto",
		"text-align":"center"
	},
	"price":{
		"position":"absolute",
		"right":"0px",
		"text-align":"right"
	}
}
