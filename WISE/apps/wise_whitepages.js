function whitepagesFetch(){

	WISE.call(WISE.server+"/index.php?action=ajax&rs=wfWhitePagesPhoneNumberSearchJSON&rsargs[]="+encodeURIComponent(WISE.trim(thisApp.params[0].replace("-","").replace(".","").replace("(","").replace(")","")))+"&rsargs[]=whitepagesRender&r="+Math.random(), thisApp.id);

}

function whitepagesRender( j ){

	if( j.result.type == "error" || j.listings.length == 0 ){
		WISE.clear(thisApp.id);
		return false;
	}
	
	number = j.listings[0].phonenumbers[0];
	
	if( !number ) {
		WISE.clear(thisApp.id);
		return false;
	}
	
	//add Result to WhitePages listing for this number
//	url = "http://www.whitepages.com/search/ReversePhone?full_phone=" + number.areacode + number.exchange + number.linenumber + "&localtime=survey"
	url = "http://api.whitepages.com/reverse_phone/1.0/?phone=" + number.areacode + number.exchange + number.linenumber + ";api_key=8c0df375bc0854c9a7c94f10370a7e6a"
	title = "Reverse Phone Number Search for  " + number.areacode + "-" + number.exchange + "-" + number.linenumber;
	
	//construct annotation div
	result_text = ""
	if( number.carrier ) result_text += "<div><b>Carrier:</b> " + number.carrier + "</div>";
	result_text += "<div><b>Type:</b> " + number.type + "</div>";
	result_text += "<div><b>Address:</b> " + j.listings[0].address.city + ", " + j.listings[0].address.state + "</div>"
	
	more_info = j.listings[0].listingmeta.moreinfolinks;
	if( more_info.viewmap ){
		result_text += "<div><a href=\"" + more_info.viewmap.url + "\" target=\"_new\">" + more_info.viewmap.linktext + "</a></div>";
	}
	if( more_info.mapareacode ){
		result_text += "<div><a href=\"" + more_info.mapareacode.url + "\" target=\"_new\">" + more_info.mapareacode.linktext + "</a></div>";
	}
	if( more_info.drivingdirections ){
		result_text += "<div><a href=\"" + more_info.drivingdirections.url + "\" target=\"_new\">" + more_info.drivingdirections.linktext + "</a></div>";
	}
	if( more_info.findneighbors ){
		result_text += "<div><a href=\"" + more_info.findneighbors.url + "\" target=\"_new\">" + more_info.findneighbors.linktext + "</a></div>";
	}
	
	result_text += "<p><div><a href=\"http://www.whitepages.com\" target=\"_top\" title=\"WhitePages.com Search\"><img src=\"http://www.whitepages.com/static/whitepages/images/wpapi/wp_logo_dark_150x34.gif\" alt=\" WhitePages.com Search\" border=\"0\" /></a></div>";
	
	WISE.create(title, url, result_text, thisApp.id);
}

