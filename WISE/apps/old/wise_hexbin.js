function hexbinFetch(){
	
	if (!WISE.apps.hexbin) {alert("uh oh"); return false;};
	
	cur = WISE.apps.hexbin;
	var q = cur.params[0];
        var parts = q.split(" ");
        var result = "";
        
         if( isNaN(parseInt(parts[0])) || parts[0] != parseInt(parts[0]) )
                return;
        
        if(parts[2].toLowerCase() == "hex"){
            result = "0x" + parseInt(parts[0]).toString(16).toUpperCase();
        }
        
        if(parts[2].toLowerCase() == "decimal"){
            result = parseInt(parts[0]).toString();
        }
        
        if(parts[2].toLowerCase() == "binary"){
            result = parseInt(parts[0]).toString(2).toUpperCase();
        }
        
        if(parts[2].toLowerCase() == "octal"){
            result = parseInt(parts[0]).toString(8).toUpperCase();
        }
        
        var title = q + " is " + result;
	r = WISE.resultAdd( WISE.Q , "http://http://help.wikia.com/wiki/Help:Videos", title, result, true );
	    
	resultText = '<small>Powered by Maths</small>';
	
	WISE.annAdd(r, "text", {"sel":resultText} );
	WISE.annRender(r);  
	WISE.finalize(WISE.Q, thisApp.id, r); // apply any possible KT stuff
	
}
