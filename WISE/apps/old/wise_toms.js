function tomsFetch(){
        
	if (!WISE.apps.www) {alert("uh oh"); return false;};
        
	cur = WISE.apps.toms;
        
	WISE.call( "http://www.toms.com/catalogsearch/result/?q=" + cur.params[0] + "&c=tomsRender", cur.id );
}

function tomsRender( j ){
        
        if( !j || !j.msg)
            return;
        
        r = WISE.resultAdd( WISE.Q , "http://www.toms.com/catalogsearch/result/?q=" + cur.params[0], cur.params[0], j.msg, true);

	var resultText = "";

	resultText = "<p><small>Powered by <a href='http://www.toms.com/'>Toms</a></small></p>";
		
        WISE.annAdd(r, "text", {"sel":resultText} );
        WISE.annRender(r);
        WISE.finalize(WISE.Q, thisApp.id, r); // apply any possible KT stuff

}
 