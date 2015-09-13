function ebayFetch(){

	query = thisApp.params[0];

	url = "http://open.api.ebay.com/shopping?appid=wifilezL-981e-4f1e-b648-b3d691cc4f7b&trackingid=5335878804&trackingpartnercode=9&version=517&siteid=0&callname=FindItems&QueryKeywords=" + query + "&responseencoding=JSON&callback=true"
	
	WISE.call(url, thisApp.id);

}

function _cb_FindItems( root ){
	
	var items = root.Item || [];
	result_text = ""
	time_left_pattern = /P([0-9]{0,3}d)?T([0-9]?[0-9]H)?([0-9]?[0-9]M)?([0-9]?[0-9]S)/i;
	
	for (var i = 0; i < items.length; ++i){
		var item = items[i];
		var title = item.Title;
		var viewitem = item.ViewItemURLForNaturalSearch;
		
		if (null != title && null != viewitem){
			
			time_parts = time_left_pattern.exec( item.TimeLeft.toLowerCase() );
		
			time_left = (( time_parts[1] )?time_parts[1] + " ":"");
			time_left += (( time_parts[2] )?time_parts[2] + " ":"");
			time_left += (( time_parts[3] )?time_parts[3] + " ":"");
			time_left += (( time_parts[4] )?time_parts[4] + " ":"");
			
			result_text += "<div><div style=\"float:left;padding-right:10px;\"><a href=\"" + viewitem + "\"><img src=\"" + item.GalleryURL + "\" border=\"0\" width=\"45\"></a></div>";
			result_text += "<div style=\"float:left;width:200px;padding-right:5px;\"><a href=\"" + viewitem + "\">" + title + "</a></div>"
			result_text += "<div style=\"float:left;padding-right:5px;width:100px\">" + item.BidCount + " bids</div>"
			result_text += "<div style=\"float:left;padding-right:5px;width:100px\"><b>$" + item.ConvertedCurrentPrice.Value + "</b></div>"
			result_text += "<div style=\"float:left;color:red;font-weight:800;\">" + time_left + "</div></div><div style=\"clear:left\"></div>"
		}
	}

	ebay_search_url = "http://search.ebay.com/" + encodeURIComponent(WISE.apps.ebay.params[0]);
	ebay_search_title = "eBay Search Results for " + WISE.apps.ebay.params[0]
	result_text += "<div><a href=\"http://rover.ebay.com/rover/1/711-53200-19255-0/1?type=1&campid=5335878804&toolid=10001&customid=wikiasearch\" target=\"_top\" title=\"eBay.com\"><img src=\"http://developer.ebay.com/images/logo-ebay.gif\" alt=\" eBay.com\" border=\"0\" /></a></div>";

	WISE.create(ebay_search_title, ebay_search_url, result_text, thisApp.id);

}


