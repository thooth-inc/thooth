function tvguideFetch(){

	search_term = WISE.trim(thisApp.params[0]);
	
	WISE.call(WISE.server+"/index.php?title=index.php&action=ajax&rs=wfGetTVGuideShowJSON&rsargs[]=tvguideShowRender&rsargs[]=" + search_term, thisApp.id);
}

function tvguideShowRender( j ){

	if( !j ){
		WISE.clear(thisApp.id);
		return false;
	}
	
	query = thisApp.params[0];	
	
	app_title = j[0].Response.Output[0];
	app_url = j[0].Response.Output[1];
	r = WISE.resultAdd( WISE.Q , app_url, app_title,"",true);
	
	//construct annotation div
	result_text = ""
	
	result_text += "<div style='margin-bottom:3px'><div style='float:left;padding-right:15px;'><img src=\"" + j[0].Response.Output[2] + "\"></div><div style='vertical-align:middle;padding-top:25px;'><b>About:</b> " + j[0].Response.Output[4] + " " + j[0].Response.Output[5] + " <a href=\"" + j[0].Response.Output[7] + "\">more</a></div><div style='clear:both'></div></div>";

	
	WISE.annAdd(r,"text",{"sel":result_text});
	WISE.annRender(r);
	
	WISE.annAdd(r,"link",{"title":("Videos"),"a": j[0].Response.Output[10]});
	WISE.annAdd(r,"link",{"title":("Photos"),"a": j[0].Response.Output[12]});
	WISE.annAdd(r,"link",{"title":("News"),"a": j[0].Response.Output[14]});
	WISE.annAdd(r,"link",{"title":("TV Listings"),"a": j[0].Response.Output[16]});
	WISE.annRender(r);
	
	WISE.annAdd(r,"text",{"sel":"<div><a href=\"http://www.tvguide.com\" target=\"_top\" title=\"tvguide.com\"><img src=\"http://www.harrison.lib.ms.us/images/magazines/tvguide-logo.gif\" alt=\" tvguide.com\" border=\"0\" /></a></div>"});
	WISE.annRender(r);
	WISE.finalize(WISE.Q, thisApp.id, r); // apply any possible KT stuff
	

}

function tvguideRender( j ){

	if( !j ){
		WISE.clear(thisApp.id);
		return false;
	}
	
	query = thisApp.params[0];	
	
	app_title = j[0].Response.Output[0];
	app_url = j[0].Response.Output[4];
	r = WISE.resultAdd( WISE.Q , app_url, app_title,"",true);
	
	//construct annotation div
	result_text = ""
	
	result_text += "<div style='margin-bottom:3px'><div style='float:left;padding-right:15px;'><img src=\"" + j[0].Response.Output[2] + "\"></div><div style='vertical-align:middle;padding-top:25px;'><b>Latest News:</b> " + j[0].Response.Output[5] + " " + j[0].Response.Output[6] + " <a href=\"" + j[0].Response.Output[8] + "\">more</a></div><div style='clear:both'></div></div>";

	
	WISE.annAdd(r,"text",{"sel":result_text});
	WISE.annRender(r);
	
	WISE.annAdd(r,"link",{"title":("Videos"),"a": j[0].Response.Output[11]});
	WISE.annAdd(r,"link",{"title":("Photos"),"a": j[0].Response.Output[13]});
	WISE.annAdd(r,"link",{"title":("News"),"a": j[0].Response.Output[15]});
	WISE.annAdd(r,"link",{"title":("TV Listings"),"a": j[0].Response.Output[17]});
	WISE.annRender(r);
	
	WISE.annAdd(r,"text",{"sel":"<div><a href=\"http://www.tvguide.com\" target=\"_top\" title=\"tvguide.com\"><img src=\"http://www.harrison.lib.ms.us/images/magazines/tvguide-logo.gif\" alt=\" tvguide.com\" border=\"0\" /></a></div>"});
	WISE.annRender(r);
	WISE.finalize(WISE.Q, thisApp.id, r); // apply any possible KT stuff
	

}

