WISE.apps.crunchbasepeople = {
	"name":"CrunchBase People",
	"author": "Wikia Search",
	"logo":"http://www.crunchbase.com/images/cb_favicon.png",
	"description":"Returns information on tech people from Crunchbase",
	"categories":[ "Other","Tech" ],
	"id":"crunchbasepeople",
	"regex":/.*(?:techpeople )(.+)/i,
	"categoryTriggers":{"triggers":"tech people","exactMatch":true},
	"url":"WISE/apps/wise_crunchbase_people.js?r=" + Math.random(),
	"action":"crunchbaseFetch"
};



function crunchbaseFetch(){

	var callUrl = "http://api.crunchbase.com/v/1/person/" + encodeURIComponent(WISE.trim(thisApp.params[0]).replace(" ","-") ) + ".js?callback=crunchbaseRender";

	WISE.call(callUrl, thisApp.id);
}

function crunchbaseRender(j) {
	if(!j.last_name ) {
		WISE.clear(thisApp.id);
		return;
	}
	var title = "CrunchBase Entry for " + WISE.trim(thisApp.params[0]);
	var link = j.crunchbase_url;
	
	var month=new Array(12);
	month[0]="January";
	month[1]="February";
	month[2]="March";
	month[3]="April";
	month[4]="May";
	month[5]="June";
	month[6]="July";
	month[7]="August";
	month[8]="September";
	month[9]="October";
	month[10]="November";
	month[11]="December";

	output = "";
	output += "<div><div style=\"float:left;width:375px;\">"
	if( j.relationships.length > 0 ){
		companies = ""
		for( x = 0; x <= j.relationships.length-1 ; x ++){
			companies += ((companies)?", ":"") + "<a href=\"http://www.crunchbase.com/company/" + j.relationships[x].firm.permalink + "\">" + j.relationships[x].firm.name + "</a>";
		}
		if( companies )output += "<div class='wise_crunchbasepeople_item'><b>Companies:</b> " + companies + "</div>";
	}
	if( j.homepage_url )output += "<div class='wise_crunchbasepeople_item'><b>Website:</b> <a href=\"" + j.homepage_url + "\">" + j.homepage_url + "</a></div>";
	if( j.blog_url )output += "<div class='wise_crunchbasepeople_item'><b>Blog:</b> <a href=\"" + j.blog_url + "\">" + j.blog_url + "</a></div>";
	
	output += "<div class='wise_crunchbasecompany_item'>" + WISE.stripTags(j.overview).substr(0,200) + " ... <a href=\"" + link + "\">more</a></div>";
	if( j.image ){
		output += "</div><div style=\"float:right\"><img src=\"http://www.crunchbase.com/" + j.image.available_sizes[0][1] + "\"></div><div style=\"clear:both;\"></div>"
		
	}
	if (output != "") {
		
		output += "<img src='http://www.crunchbase.com/images/logo.png' width='100'/>";
		WISE.create(title, link, output, thisApp.id);
	}
	else {
		WISE.clear(thisApp.id);
	}
	
	
}

thisApp.css = {
	"item":{
		"margin-bottom":"5px",
	}
};
