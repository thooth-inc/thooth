WISE.apps.video = {
	"id":"video",
	"regex":/.*(?:video )(.+)/i,
	"url":"WISE/apps/wise_video.js?r=" + Math.random(),
	"action":"videoFetch"
};

function videoFetch(){

	if (!WISE.apps.video) {alert("uh oh"); return false;};
	
	cur = WISE.apps.video;
	
	WISE.call(WISE.server+"/index.php?action=ajax&rs=wfGetVideosJSON&rsargs[]=" + encodeURIComponent(WISE.trim(cur.params[0].replace("video", "", "g"))) + "&rsargs[]=videoRender", cur.id);

}

function videoRender( j ){

    if( !j ){
	return false;
    }
        
    var resultText = "";
    
    r = WISE.resultAdd( WISE.Q ,WISE.server+"/index.php?action=ajax&rs=wfGetVideosJSON&rsargs[]=" + j.search,"Videos for " + j.search,"", true);
    
    resultText = "<table><tr>";
    
    for(var i=0; i < j.results.length; i++){
        resultText += j.results[i].expand;
    }
    
    resultText += "</tr></table>";
    
    WISE.annAdd(r,"text",{"sel":resultText});
    WISE.annRender(r);
    WISE.finalize(WISE.Q, thisApp.id, r); // apply any possible KT stuff
    
    return true;

}
