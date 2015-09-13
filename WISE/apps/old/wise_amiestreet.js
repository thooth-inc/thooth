function amiestreetFetch(){

	search_term = WISE.trim(thisApp.params[0]);
	
	api_version = "0.1"
	method = "ArtistApi"
	service = "info"
	WISE.call(WISE.server+"/index.php?title=index.php&action=ajax&rs=wfGetAimeStreetJSON&rsargs[]=" + search_term + "&rsargs[]=" + api_version + "&rsargs[]=" + method + "&rsargs[]=" + service + "&rsargs[]=amiestreetRender", thisApp.id);
}

function amiestreetRender( j ){

	
	if( !j ){
		WISE.clear(thisApp.id);
		return false;
	}

	if( j.error_response ){
		WISE.clear(thisApp.id);
		return false;
	}
	
	query = thisApp.params[0];	
	
	as_response = j.info_response
	
	search_url = as_response.artist.url.replace("beta.amiestreet.com","amiestreet.com").replace("/music/","/artist/") + "?partner_code=wikia";
	search_title = "Amie Street - " + as_response.artist.name;
	
	//construct annotation div
	result_text = ""
	result_text += "<div style=\"float:left;padding-right:10px;\">"
	result_text += "<img src=\"" + as_response.artist.image.small + "\" border=\"0\">"
	result_text += "</div>"
	
	result_text += "<div><b>" + as_response.artist.name + "</b></div>";
	result_text += "<div id=\"" + thisApp.id + "-bio\"></div>";
	//result_text += "<div>Bio stuff will go here. Bio stuff will go here. Bio stuff will go here. Bio stuff will go here. </div>";
	result_text += "<div><b>Albums:</b> "
	
	albums_array = new Array();
	if( as_response.albumList.albumList_elt ){
		if( !as_response.albumList.albumList_elt.length){
			
			albums_array.push(as_response.albumList.albumList_elt);
		}else{
			albums_array = as_response.albumList.albumList_elt
		}
	}
	
	for(x = 0; x<= albums_array.length-1; x++ ){
		result_text +=  ((x>0)?",":"") + " <a href=\"" + albums_array[x].url.replace("beta.amiestreet.com","amiestreet.com") + "?partner_code=wikia\">" +  albums_array[x].title + "</a>"
	}
	
	result_text += "</div>"
	result_text += "<div style=\"clear:both\"></div><p>"
	
	result_text += "<div><a href=\"http://www.amiestreet.com?partner_code=wikia\" target=\"_top\" title=\"amiestreet.com\"><img src=\"http://amiestreet.com/static/images/logo.gif\" width=\"100\" alt=\"amiestreet.com\" border=\"0\" /></a></div>";

	WISE.create(search_title, search_url, result_text, thisApp.id);
	
	//have to make seperate call to get the bio
	api_version = "0.1"
	method = "ArtistApi"
	service = "bio"
	
	WISE.call(WISE.server+"/index.php?title=index.php&action=ajax&rs=wfGetAimeStreetJSON&rsargs[]=" + query + "&rsargs[]=" + api_version + "&rsargs[]=" + method + "&rsargs[]=" + service + "&rsargs[]=amiestreetRenderBio", thisApp.id);

}

function amiestreetRenderBio( j ){
	if( !j ) {
		WISE.clear(thisApp.id);
		return;
	}
	WISE.getElement(thisApp.id + "-bio").innerHTML = j
	WISE.clear(thisApp.id);
	//$(thisApp.id + "-bio").innerHTML = j
}
