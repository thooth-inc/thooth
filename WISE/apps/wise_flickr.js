function getFlickr(){

	query = thisApp.params[0];

	url = "http://www.flickr.com/services/rest/?method=flickr.photos.search&format=json&api_key=2e561f0f93fa7aa64b05e4fcc45c6f87&sort=relevance&text=" + query + "&per_page=4&license=1,2,3,4,5,6"
	
	WISE.call(url, thisApp.id);
}

function jsonFlickrApi( obj ){

	if( !obj.photos.photo ) {
		WISE.clear(thisApp.id);
		return false;
	}
	
	result_text = ""
	for( x = 0 ; x<= obj.photos.photo.length-1; x++ ){
		photo = obj.photos.photo[x];
		
		result_text += "<a href=\"http://www.flickr.com/photos/" + photo.owner + "/" + photo.id +  "\">";
		result_text += "<div style=\"float:left;padding:5px;\"><img src=\"http://farm" + photo.farm + ".static.flickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + "_t.jpg\" border=\"0\"></div>";
		result_text += "</a>";
	}

	result_text += "<div style=\"clear:left\"></div>";
	
	flickr_search_url = "http://flickr.com/search/?q=" + encodeURIComponent(WISE.apps.flickr.params[0]) + "&l=cc&ct=0";
	flickr_search_title = "Images in Flickr for " + WISE.apps.flickr.params[0]

	result_text += "<div><a href=\"http://www.flickr.com/\" target=\"_top\" title=\"Flickr\"><img src=\"http://l.yimg.com/g/images/en-us/flickr-logo-2012.png\" alt=\"Flickr\" border=\"0\" /></a></div>";

	WISE.create(flickr_search_title, flickr_search_url, result_text, thisApp.id);

}
