WISE.apps.php = {
	"id":"php",
	"name":"PHP",
	"regex":/.*(?:php )(.+)/i,
	"url":"WISE/apps/wise_php.js?r=" + Math.random(),
	"action":"phpFetch"
};



function phpFetch(){
	
	if (!WISE.apps.php) {alert("uh oh"); return false;};
	
	cur = WISE.apps.php;
	
	WISE.call("http://code.setfive.com/phpdoc/query.php?q=" + cur.params[0] + "&c=phpRender", cur.id);
}

function phpRender( j ){
	
        r = WISE.resultAdd( WISE.Q , "http://code.setfive.com/phpdoc/query.php?q=" + j.query, "PHP Functiion " + j.query, "", true);

	var resultText = "";

	if(!j.error)
		resultText = "<p>" +
				"<strong>" + j.call + "</strong><br />" + j.desc +
				"<br/><small>Powered by <a href='http://www.setfive.com/'>Setfive</a></small>" + 
			 "</p>";
	else
		resultText = "<p>" + j.msg + "</p>";
		
        WISE.annAdd(r, "text", {"sel":resultText} );
        WISE.annRender(r);
        WISE.finalize(WISE.Q, thisApp.id, r); // apply any possible KT stuff
}
 