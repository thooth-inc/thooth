WISE.apps.graph = {
	"id":"graph",
	"name":"Graph",
	"regex":/(cos\(.*\))|(sin\(.*\))|(tan\(.*\))|(sec.*)|f\(x\)=(.*)/i,
	"url":"WISE/apps/wise_graph.js?r=" + Math.random(),
	"action":"graphFetch"
};


function graphFetch(){
	
	if (!WISE.apps.graph) {alert("uh oh"); return false;};
	
	cur = WISE.apps.graph;
	graphRender(cur.params[0]);
}

function graphRender( func ){

    if( !func ){
	return false;
    }
        
    var resultText = "";
    
    r = WISE.resultAdd( WISE.Q , "http://www.code.setfive.com/gnuplot/bin/plot.php?f=" + func,"Graphing " + func, "", true);
    
    func = func.replace("+", "%2B", "g");
    func = func.replace("^", "**", "g");
    
    // d=0:100
    if(func.indexOf("|") > -1){
	var arr = func.split("|");
	var domain = arr[1];
	func = arr[0];
    }
    
    var url = "http://code.setfive.com/gnuplot/bin/plot.php?f=" + func;
    
    if(domain)
	url += "&d=" + domain;
    
    resultText = "<img height='240' width='320' src='" + url + "'/><br/>Powered by <a href='http://www.setfive.com'>Setfive</a>";
    WISE.annAdd(r, "text", {"sel":resultText});
    
    WISE.annRender(r);
    
    WISE.finalize(WISE.Q, thisApp.id, r); // apply any possible KT stuff
    
    return true;
}
