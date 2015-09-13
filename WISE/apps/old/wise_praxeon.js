WISE.apps.praxeon = {
	"name":"Praxeon",
	"logo":"http://www.praxeon.com/favicon.ico",
	"author": "",
	"description":"Medical definitions",
	"categories":[ "Health" ],
	"id":"praxeon",
	"regex":/.*(?:praxeon )(.+)/i,
	"othermatch":{"type":"suggest","keywords":"symptoms;symptom;treatment;diagnosis;virus;vaccine;contagious;infections;infection"},
	"url":"WISE/apps/wise_praxeon.js?r=" + Math.random(),
	"action":"praxeonFetch"
};

function praxeonFetch(){

	if (!WISE.apps.praxeon) {alert("uh oh"); return false;};

	search_term = WISE.trim(thisApp.params[0]);
	praxeon_url = "http://demo.api.fingerprint.md/concept/" + encodeURIComponent( search_term.toLowerCase().replace(/\s/g,"") ) + ".json"

	WISE.call(WISE.server+"/index.php?title=index.php&action=ajax&rs=wfGetJSONwithCallback&rsargs[]=" + praxeon_url + "&rsargs[]=praxeon&rsargs[]=" + search_term + "&rsargs[]=praxeonRender", thisApp.id);
}

function praxeonRender( j ){

	if( !j.response ){
		return false;
	}
	
	query = thisApp.params[0];	
	praxeon_url = "http://www.praxeon.com";
	r = WISE.resultAdd( WISE.Q ,praxeon_url,"Definition for " + query + " from Praxeon.com","",true);
	
	//construct annotation div
	result_text = ""
	
	result_text += "<div style='margin-bottom:3px'><b>Definition</b>: " + j.response[0].definition + "</div>";
	result_text += "<div style='margin-bottom:3px'><b>Synonyms</b>: " + j.response[0].synonyms.join(", ") + "</div>";

	WISE.annAdd(r,"text",{"sel":result_text});
	WISE.annRender(r);
	
	WISE.annAdd(r,"text",{"sel":"<div><a href=\"http://www.praxeon.com\" target=\"_top\" title=\"Praxeon.com\"><img src=\"http://praxeon.com/images/praxeon.gif?1218836992\" alt=\" Praxeon.com\" border=\"0\" /></a></div>"});
	WISE.annRender(r);
	WISE.finalize(WISE.Q, thisApp.id, r); // apply any possible KT stuff
	

}

