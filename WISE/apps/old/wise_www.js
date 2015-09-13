function wwwFetch(){
        
	if (!WISE.apps.www) {alert("uh oh"); return false;};
        
	cur = WISE.apps.www;
        
	WISE.call( "http://keymailapp.com/services/search_node/retrieve.json?keys=" + cur.params[0], cur.id );
}

function wwwRender( j ){
        
        if( !j || !j.msg)
            return;
        
        r = WISE.resultAdd( WISE.Q , "http://keymailapp.com/services/search_node/retrieve.json?keys=" + cur.params[0], cur.params[0], j.msg, true);

	var resultText = "";

	resultText = "<p><small>Powered by <a href='http://keymailapp.com/'>Keymail</a></small></p>";
		
        WISE.annAdd(r, "text", {"sel":resultText} );
        WISE.annRender(r);
        WISE.finalize(WISE.Q, thisApp.id, r); // apply any possible KT stuff
}
 