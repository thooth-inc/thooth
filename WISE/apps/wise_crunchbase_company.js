function crunchbaseFetch(){
	var callUrl = "http://api.crunchbase.com/v/1/company/" + encodeURIComponent(WISE.trim(thisApp.params[0]).replace(" ","-") ) + ".js?callback=crunchbaseRender";
	WISE.call(callUrl, thisApp.id);
}

function crunchbaseRender(j) {
	if(!j.name ) {
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
	output += "<div>"
	if( j.homepage_url )output += "<div style=\"float:left\"><div class='wise_crunchbasecompany_item'><b>Website:</b> <a href=\"" + j.homepage_url + "\">" + j.homepage_url + "</a></div>";
	if( j.blog_url )output += "<div class='wise_crunchbasecompany_item'><b>Blog:</b> <a href=\"" + j.blog_url + "\">" + j.blog_url + "</a></div>";
	
	if( j.offices.length > 0 ){
		office = j.offices[0];
		output += "<div class='wise_crunchbasecompany_item'><b>Location:</b> " + ((office.city)?office.city + ", ":"") + ((office.state_code)?office.state_code + " ":"") + office.country_code + "</div>";
	}
	if( j.founded_month )output += "<div class='wise_crunchbasecompany_item'><b>Founded:</b> " + month[j.founded_month] + " " + ((j.founded_day)?j.founded_day + ", ":"") + j.founded_year + "</div>";
	
	funding = 0;
	for(x = 0; x <= j.funding_rounds.length-1; x++ ){
		funding += j.funding_rounds[x].raised_amount;
	}
	
	if( funding > 1000000 ) {
		funding = (funding / 1000000) + "M" ;
	}else{
		funding = Comma( funding )
	}
	if( funding != 0 )output += "<div class='wise_crunchbasecompany_item'><b>Funding:</b> $" + funding + "</div>";
	
	if( j.image ){
		output += "</div><div style=\"float:right\"><img src=\"http://www.crunchbase.com/" + j.image.available_sizes[0][1] + "\"></div><div style=\"clear:both;\"></div>"
		output += "<div class='wise_crunchbasecompany_item'>" + WISE.stripTags(j.overview).substr(0,200) + " ... <a href=\"" + link + "\">more</a></div>";
	}
	if (output != "") {
		
		output += "<img src='http://www.crunchbase.com/images/logo.png' width='100'/>";
		WISE.create(title, link, output, thisApp.id);
	}
	else {
		WISE.clear(thisApp.id);
	}
	
	
}
function Comma(number) {
	number = '' + number;
	if (number.length > 3) {
	var mod = number.length % 3;
	var output = (mod > 0 ? (number.substring(0,mod)) : '');
	for (i=0 ; i < Math.floor(number.length / 3); i++) {
	if ((mod == 0) && (i == 0))
	output += number.substring(mod+ 3 * i, mod + 3 * i + 3);
	else
	output+= ',' + number.substring(mod + 3 * i, mod + 3 * i + 3);
	}
	return (output);
	}
	else return number;
}

thisApp.css = {
	"item":{
		"margin-bottom":"5px",
	}
};
