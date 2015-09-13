WISE.apps.zillow = {
	"name": "Zillow",
	"id":"zillow",
	"multimatch":new Array(1,2),
	"regex":/.*(?:population )(.+)\s?,\s?([a-z]{2})$/i,
	"url":"WISE/apps/wise_zillow.js?r=" + Math.random(),
	"action":"zillowFetch"
};

function zillowFetch(){

	if (!WISE.apps.zillow) {alert("uh oh"); return false;};
	
	cur = WISE.apps.zillow;
	
	city = encodeURIComponent(cur.params[0])
	state = encodeURIComponent(cur.params[1])

	WISE.call(WISE.server+"/index.php?action=ajax&rs=wfZillowGetDemographicsJSON&rsargs[]="+state+"&rsargs[]="+city+"&rsargs[]=zillowRender&r="+Math.random(), cur.id);
}

function zillowRender( j ){

	WISE.annAdd(r,"text",{"sel":result_text});
	WISE.annRender(r);
	
	WISE.annAdd(r,"text",{"sel":"<div><a href=\"http://www.zillow.com\" target=\"_top\" title=\"Zillow.com\"><img src=\"http://www.zillow.com/static/logos/Zillowlogo_150x40.gif\" alt=\" Zillow.com\" border=\"0\" /></a></div>"});
	WISE.annRender(r);
	WISE.finalize(WISE.Q, "zillow"); // apply any possible KT stuff

}

