function acronymFinder(){

	WISE.call(WISE.server+"/index.php?action=ajax&rs=wfTryAcronymFinder&rsargs[]="+encodeURIComponent(WISE.trim(thisApp.params[0]))+"&rsargs[]=acronymRender&r="+Math.random(), thisApp.id);

}

function acronymRender( j ){

	if( !j.results.item ){
		WISE.clear(thisApp.id);
		return false;
	}
	
	query = WISE.apps.acronymfinder.params[0];
	items = j.results.item;
		if( typeof( items ) == "string"){
		 items_array = new Array();
		 items_array.push(items);
	}else{
		items_array = items
	}
	
	//add Result to WhitePages listing for this nubmer
	//r = WISE.resultAdd( WISE.Q ,j.results.moreURL,"What does " + query + " stand for?","",true);
	
	//construct annotation div
	result_text = ""
	result_text += "<div><b>Results from AcronymFinder.com</b></div><p>";
	
	for( x = 0; x <= items_array.length - 1; x++){
		if( typeof( items_array[x] ) == "object" ){
			item_meaning = items_array[x].a;
		}else{
			item_meaning = items_array[x];
		}
		result_text += "<div style='margin-bottom:3px'>" + item_meaning + "</div>";
	}

	
	//WISE.annAdd(r,"text",{"sel":result_text});
	//WISE.annRender(r);
	result_text += "<div><a href=\"http://www.acronymfinder.com\" target=\"_top\" title=\"AcronymFinder.com Search\"><img src=\"http://www.acronymfinder.com/images/aflogo.gif\" alt=\" AcronymFinder.com Search\" border=\"0\" /></a></div>";
	//WISE.annAdd(r,"text",{"sel":"<div><a href=\"http://www.acronymfinder.com\" target=\"_top\" title=\"AcronymFinder.com Search\"><img src=\"http://www.acronymfinder.com/images/aflogo.gif\" alt=\" AcronymFinder.com Search\" border=\"0\" /></a></div>"});
	//WISE.annRender(r);
	//WISE.finalize(WISE.Q, thisApp.id, r); // apply any possible KT stuff
	
	WISE.create("What does " + query + " stand for?", j.results.moreURL, result_text, thisApp.id);

}

