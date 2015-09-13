function hautehippieFetch(){
        
	if (!WISE.apps.www) {alert("uh oh"); return false;};
        
	cur = WISE.apps.hautehippie;
        
	WISE.call( "http://www.hautehippie.com/catalogsearch/result?q=" + cur.params[0] + "&c=hautehippieRender", cur.id );
}

function hautehippieRender( j ){
        
        if( !j || !j.msg)
            return;
        
        r = WISE.resultAdd( WISE.Q , "http://www.hautehippie.com/catalogsearch/result?q=" + cur.params[0], cur.params[0], j.msg, true);

	var resultText = "";

	resultText = "<p><small>Powered by <a href='http://www.hautehippie.com/'>Haute Hippie</a></small></p>";
		
        WISE.annAdd(r, "text", {"sel":resultText} );
        WISE.annRender(r);
        WISE.finalize(WISE.Q, thisApp.id, r); // apply any possible KT stuff

}
 