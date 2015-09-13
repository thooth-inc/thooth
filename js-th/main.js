// all the core logic, timers, network calls, json, etc

// NDX nutch server
var NDX = "https://index.search.isc.org/";

// KT server
//var KT = "http://192.168.1.14:8080/kt/";
var KT = "https://phpstack-7093-15665-41540.cloudwaysapps.com/kt/";

var un = getCookie("searchUserName");
if(!un) un = "you";
var tok = getCookie("thoothSearchTokenNew");
var kt_required = ""
var shiftchar = 0; // global flag if shift key is depressed :(
Event.observe(window, 'mousedown', function (ev){shiftychar=ev.shiftKey;});

function callOut(func,url){

	var i = document.createElement('iframe');
	i.style.display="none";
	document.getElementsByTagName('head')[0].appendChild(i);
	
	var doc = null;  
	    if(i.contentDocument)  
	       // Firefox, Opera  
	       doc = i.contentDocument;  
	    else if(i.contentWindow)  
	       // Internet Explorer  
	       doc = i.contentWindow.document;  
	    else if(i.document)  
	       // Others?  
	       doc = i.document;  
	   
	    if(doc == null)  
	       throw "Document not initialized";  
	    
	doc.open();
	doc.write("<script type=\"text/javascript\">function "+func+"{parent."+func+";}</script>");
	doc.write("<script type=\"text/javascript\" src=\"" + url + "\" defer=\"defer\"></script>");
	doc.close();

}

var coargs = new Array();
function callOutArg(func,url,arg){
	var i = document.createElement('iframe');
	i.style.display="none";
	document.getElementsByTagName('head')[0].appendChild(i);
	
	var doc = null;  
	    if(i.contentDocument)  
	       // Firefox, Opera  
	       doc = i.contentDocument;  
	    else if(i.contentWindow)  
	       // Internet Explorer  
	       doc = i.contentWindow.document;  
	    else if(i.document)  
	       // Others?  
	       doc = i.document;  
	   
	    if(doc == null)  
	       throw "Document not initialized";  
	coargs[coargs.length] = arg;
	doc.open();

	doc.write("<script type=\"text/javascript\">function "+func+"(j){parent."+func+"(parent.coargs["+(coargs.length-1)+"],j);}</script>");
	doc.write("<script type=\"text/javascript\" src=\"" + url + "\" defer=\"defer\"></script>");
	doc.close();
	
}

function indexFetch(q, start) {

	var i = document.createElement('iframe');
	i.style.display="none";
	i.setAttribute("id", "indexFetch")
	document.getElementsByTagName('head')[0].appendChild(i);
	
	var doc = null;  
	    if(i.contentDocument)  
	       // Firefox, Opera  
	       doc = i.contentDocument;  
	    else if(i.contentWindow)  
	       // Internet Explorer  
	       doc = i.contentWindow.document;  
	    else if(i.document)  
	       // Others?  
	       doc = i.document;  
	   
	    if(doc == null)  
	       throw "Document not initialized";  
	    
	doc.open();
	coargs[coargs.length] = q;
	doc.write("<script type=\"text/javascript\">function processY(j){parent.processY(parent.coargs["+(coargs.length-1)+"],j);}</script>");
	doc.write("<script type=\"text/javascript\" defer=\"true\" src=\"https://phpstack-7093-15665-41540.cloudwaysapps.com/WISE/ajax/index.php?action=ajax&rs=wfGetYahooBossData&rsargs[]="+encodeURIComponent(q.q)+"&rsargs[]=limitedweb&rsargs[]=processY&rsargs[]=9\"></script>");
	doc.close();
}


// get all of our KT data for this query
function ktFetch(q)
{
	if( !q.q ) return false;
	
	// force skip cached for now!
	var url = KT+"kt.js?t=del&t=add&t=sug&t=spot&t=stars&t=edit&t=bg&t=com&t=selection&t=also&k="+ (encodeUTF8(q.q.toLowerCase())) + "&r=" + Math.random() + "&f=processKT(";
	callOutArg("processKT", url, q);
	
	var url = KT+"kt.js?t=wise&k="+ (encodeUTF8(q.q.toLowerCase())) + "&r=" + Math.random() + "&f=processWISEKT(";
	callOutArg("processWISEKT", url, q);

}

//keep variables globally for callback saving
var save_array = new Array();

//new wrapper for kt save -- make sure we can get the token
function ktSave(q, tuple, json){

	if( !getCookie("thoothSearchTokenNew") ){
		change = new Object();
		change.q = q
		change.tuple = tuple
		change.json = json
		save_array.push( change )
	}else{
		doktSave( q, tuple, json )
	}
	
}

function doktSave(q, tuple, json, user_logged_in)
{
	//if we had to go fetch another token, we have store the change contents in an array
	if( save_array.length > 0 ){
		this_change = save_array.shift();
		q = this_change.q
		tuple = this_change.tuple
		json = this_change.json
	}
		
	tok = getCookie("thoothSearchTokenNew");
	
	if( !isAdmin ){
		rights_error = "";
		if( kt_required == "admin" )rights_error = "Keyword is protected";
		if( kt_required == "user" && getCookie("thoothUserId") ) rights_error = "You must login to edit this";
		if( rights_error ){
			showRightsError( rights_error );
			return;
		}
	}
	
	try {
		if (can_save == false) {
			alert(gettext("Unable to save.  User is blocked."));
			return;
		}
	}
	catch(ex){}
	
	var src = KT+"new.js?t="+tuple+"&k="+ ( encodeUTF8(q.q.toLowerCase()));
		// if logged in user, use creds
	if(un){
		json.user = un;
	}
	src += "&v=" + getCookie("thoothSearchTime") + ":" + (tok);
	
	json.l = lang;
	
	if( json.summary ) json.summary = json.summary.replace(/\"/g,"&quot;");
	if( json.title ) json.title = json.title.replace(/\"/g,"&quot;");
	
	src += "&j=" +  encodeUTF8( Object.toJSON(json) );
	src += "&r=" + Math.random(); // never use cached!
	var s = document.createElement('script');
	s.defer = true;
	s.type = 'text/javascript';
	
	s.src = src;
	document.getElementsByTagName('head')[0].appendChild(s);

	// add history items!
	if(!json.user) json.user = un;
	var at = false;
	if(tuple == "del"){
		var hact = (json.del) ? "deleted" : "undeleted";
		histAdd(q,json.user,getspan(hact),at,json.url);
	}else if(tuple == "add"){
		histAdd(q,json.user,getspan("added"),at,json.url);
	}else if(tuple == "sug"){
		if( json.hide ){
			histAdd(q,json.user,getspan("hid a related result"),at,json.url);
		}else{
			histAdd(q,json.user,getspan("suggested a related result"),at,json.url);
		}
	}else if(tuple == "spot"){
		histAdd(q,json.user,getspan("spotlighted"),at,json.url);
	}else if(tuple == "stars"){
		histAdd(q,json.user,getspan("rated ")+json.rating,at,json.url);
	}else if(tuple == "edit"){
		histAdd(q,json.user,getspan("edited"),at,json.url,json.title,json.summary);
	}else if(tuple == "bg"){
		histAdd(q,json.user,getspan("added a background image"),at,json.url);
	}else if(tuple == "com"){
		histAdd(q,json.user,getspan("commented on"),at,json.url,null,null,json.com);
	}else if(tuple == "selection"){
		histAdd(q,json.user,getspan("annotated"),at,json.url);
	}else if(tuple == "wise"){
		if(json.app) {
			if (WISE && WISE.apps[json.app]) {
                // FIXME: This is just for the purpose of an example.
                // The format string should include more textual variables, such as user and time.
                histAdd(q,
                        json.user,
                        getspanf("added the %s application", WISE.apps[json.app].name ? WISE.apps[json.app].name : json.app),
                        at,
                        (WISE && WISE.apps[json.app].name ? WISE.apps[json.app].name : json.app) );
            }
		}
		else {
			if (WISE && WISE.apps[json.del]) {
                // FIXME: This is just for the purpose of an example.
                // The format string should include more textual variables, such as user and time.
                histAdd(q, json.user,
                        getspanf("deleted the %s application", WISE.apps[json.del].name ? WISE.apps[json.del].name : json.del),
                        at,
                        (WISE.apps[json.del].name ? WISE.apps[json.del].name : json.del) );
            }
		}
	}
	histRender();
}

// a few globals
var Q = false; // active query object
var queries = new Object(); // all Q objects indexed by query
var rid=-1; // master result counter
var results = new Array(); // all results indexed by counter id

// what most things call, forces a fully "new" search
function search(query){

	// we can link to other lang searches...temporarily change the users lang for this page load
	var qParams = location.href.toQueryParams();
	if(qParams["lang"]){
		lang=qParams["lang"];
	}
	showAdminTools();
	cloudRender(query); // force new cloud

	canSave(); // make sure we have a fresh save token for KT

	jQuery("#q").val(query); // form field sanity enforced

	searchDo(query); // actually do this query :)

}

// the under the hood guts of showing a result
function searchDo(query)
{
	showAds(query); // only show ads on user-generated queries

	callOut("spellSuggest(j)", "https://phpstack-7093-15665-41540.cloudwaysapps.com/WISE/ajax/index.php?action=ajax&rs=wfGetYahooBossData&rsargs[]="+query+"&rsargs[]=spelling&rsargs[]=spellSuggest");
	
	// hide any old query results
	if(Q) {
		// set inactive class on all related elements
		for(var i=0;i<Q.elems.length;i++){ $(Q.elems[i]).addClassName("inactive"); }
		Q = false;
		jQuery("#count").css("display", "inline"); // show the count by default
		jQuery("#top-bar").css("style", "background" ); // reset background
	}

        // make sure urlbar is always accurate

	if(/^\w/.test(query)){ // pretty-display spaces as _ when not inside quotes or something
		document.location.hash = "#"+query.replace(/\s/g,"_");
	}else{
		
		document.location.hash = "#"+query;
	}
	lasthash = document.location.hash;

	document.title = "thooth (tm) .: Search results for '" + query + "'";

	if(query == ""){ document.body.backgroundColor = "black"; return; } // the black hole
	
	if(queries[query])
	{ // already did this query, just show it again
		Q = queries[query];
		// set inactive class on all related elements
		for(var i=0;i<Q.elems.length;i++){ $(Q.elems[i]).removeClassName("inactive"); }
		if(Q.bg) { // if background, set it up again
			jQuery("#count").hide();
			jQuery("#top-bar").css( 'background', Q.bg );
		}
		WISE.getLoaded();
	} else { // new Q!
		var oldq = Q;
		Q = document.createElement('div');
		queries[query] = Q;
		Q.q = query; // reverse index :)
		Q.elems = new Array();
		Q.elems.push(Q); // first post!
		Q.appendChild(document.createElement('span')); // dummy so .firstChild != null for .insertBefore :)
		jQuery("#search-results").append(Q);

		indexFetch(Q, 0); // get that result going :)
		ktFetch(Q); // hmmz

		if(/\w+\:/.test(Q.q) == false){
			
		    callOut("fbRender(j)","https://www.googleapis.com/freebase/v1/search?limit=3&callback=fbRender&prefix="+encodeURIComponent(Q.q)+"&key=AIzaSyBHBAJc1ZnlWklWfoV1blt5LFSvNMHWQh8");

//                  callOut("wpRender(j)","https://"+lang+".wikipedia.org/w/api.php?action=query&list=search&srwhat=text&srsearch="+encodeURIComponent(Q.q)+"&format=json&callback=wpRender");
		
		    WISE.scan(Q.q);
		}
	}
	alsoRender(); // temp
}

// monitor the #hash in case it changes
var lasthash = "";
function hasher()
{
  if(!$("verybottom")) return;
  if(document.location.hash == lasthash)
  {
    return;
  }
  lasthash = document.location.hash;
  if(/^\#\w/.test(lasthash)){ // convert _ to spaces
	  lasthash = lasthash.replace(/\_/g," ");
  }
  var newq = decodeURIComponent(lasthash.substr(1));
  search(newq);
}
window.setInterval("hasher()",100);

// this is a nice trick so that "legacy" things can make a search url like search.html?keyword and it'll work
if(document.location.hash == "" && document.location.search.length > 1)
{
        var s = document.location.search.substr(1);
        if(s.substring(0,2) == "q=") { s = s.substr(2); }
        document.location.replace(document.location.href+"#"+s);
}

// try to load more results as someone scrolls
function scrolly()
{
	if(!Q) return;
	
	if(Q.cursorLast == Q.cursor) return; // nothing to do
	var bot = Position.positionedOffset($("verybottom"));
	if((bot[1] - getScrollHeight()) > 600) return;
	//alert("page:" + getPageHeight() + " and scroll:"+ getScrollHeight() + "and inner:" + window.innerHeight + " and verybottom "+bot[1]);
	Q.cursorLast = Q.cursor;
	// TODO: maybe watch for onscroll event and wait till no scrolling, so it's smoother?
	if( Q.cursor )indexFetch(Q,Q.cursor);
}

window.setInterval("scrolly()",100);

function processJSON(q,j)
{
	if(!j || !j.search) return;
	for (var i=0;i < j.search.documents.length; i++)
	{
    	var doc = j.search.documents[i];
    	var url = new String(doc.fields.url);
    	url = url.unescapeHTML(); // not sure this is right?
		var ha = url.match(/:\/\/([^\/]+)/); // just match hostname
		var host = (ha.length > 1) ? ha[1] : "localhost";
		if(!q.urls[host]) host = host.replace("www.","");
		if(!q.urls[host]) continue;
		var ndx = jQuery('<a></a>');
		ndx.attr( 'href', "https://search.isc.org/search.jsp?query="+q.q );
		ndx.html("ISC");
		ndx.addClass("ndx");
		resultNdx(q.urls[host], ndx);		
	}
}

function processG(q,j)
{
	if(!j || !j.responseData || !j.responseData.results) return;

	for (var i=0;i < j.responseData.results.length; i++) {
        	
		var doc = j.responseData.results[i];
		var ha = doc.url.match(/:\/\/([^\/]+)/); // just match hostname
		var host = (ha.length > 1) ? ha[1] : "localhost";
		if(!q.urls[host]) host = host.replace("www.","");
		if(!q.urls[host]) continue;
		var ndx = jQuery('<a>');
		ndx.attr('href', "https://google.com/search?q="+q.q );
		ndx.html( "Google" );
		ndx.addClass("ndx");
		resultNdx(q.urls[host],ndx);		

    }
}

function processY(q, j){

	jQuery("#loading").hide();

	if(!j || !j.bossresponse || !j.bossresponse.limitedweb|| !j.bossresponse.limitedweb.results) return;
	if(!q.urls) q.urls = new Array(); // housekeeping
	if(!q.metaGo){ // fire off pings to other indexes

		q.metaGo = true;
//		callOutArg("processJSON","https://index.search.isc.org/nutchsearch?query="+ encodeURIComponent(q.q+" lang:"+lang) +"&hitsPerSite=1&lang=en&hitsPerPage=10&type=json",q);

		var url = "https://www.google.com/uds/GwebSearch?callback=processG&lstkp=0&rsz=large&hl="+lang+"&sig=9f362c5f2d2bc9f3c3f4585dc7dae979&q="+encodeURIComponent(q.q)+"&key=notsupplied&v=1.0&nocache="+Math.random();
		callOutArg("processG",url,q);
	}

	// process our results inline here
	for (var i=0;i < j.bossresponse.limitedweb.count; i++)
	{
    	       var doc = j.bossresponse.limitedweb.results[i];
		doc.title = doc.title.replace(/<b>/g,"");
		doc.title = doc.title.replace(/<\/b>/g,"");
		doc.abstract = doc.abstract.replace(/<b>/g,"");
		doc.abstract = doc.abstract.replace(/<\/b>/g,"");

		var r = resultAdd(q, doc.url, doc.title, doc.abstract, false);

		// tag it as ours
		var ndx = jQuery("<a></a>");
		ndx.attr( "href", "https://search.yahoo.com/search?p="+q.q);
		ndx.html("Yahoo!");
		ndx.addClass("ndx");
		if(r.ndx) resultNdx(r, ndx);
		else { // store for later
			ndx.single = true;
			r.ndx = ndx;
		}

	}
	
        reviewKT(q, "Yahoo!") // apply any possible KT stuff

	// if there were 10 results, set cursor forward
	if(j.bossresponse.limitedweb.count == 10){
		q.cursor = parseInt(j.bossresponse.limitedweb.start)+10;
	}
	
}

// handle: processKT(1,{"about":[{"id":"136854775807","the":"sentient","user":"127.0.0.1"}]});
function processKT(q,json){

	if(!q || !json) return;
	
	kw = Q.q

	json = json[ (kw.toLowerCase()) ]; //utf8 chars in keyword is stored as \u00xx

	if( !json) return
		
	q.kt = json;
	var changes = 0;
	if(json.del) changes += json.del.length;
	if(json.add) changes += json.add.length;
	if(json.spot) changes += json.spot.length;
	if(json.stars) changes += json.stars.length;
	if(json.edit) changes += json.edit.length;
	// strip out non-matching languages
	for(var a in json){
		if(!json[a].length || json[a].length <= 0) continue;
		var na = new Array();
		for(var i=0; i < json[a].length; i++){
			if(!json[a][i].l || json[a][i].l == lang){ na.push(json[a][i]); }
		}
		json[a] = na;
	}
	reviewKT(q);
}

// this looks at all KT data and tries do something with it, if it can't it leaves it until called again
function reviewKT(q, from)
{
	if(!q.kt || !q.urls) return;
	var j = q.kt; // the json
	var u = q.urls; // shorter, it's convenience not obfuscation I tell you!

	//set rights
	if( j._meta.rights )kt_required = j._meta.rights.edit
		
	// add suggestions!
	if(j.sug)
	{
		// first check for hidden ones to skip
		for(var i=0; i < j.sug.length; i++){
			if(j.sug[i].hide) {
				cloudShh(q.q,j.sug[i].sug);
				histAdd(q, j.sug[i].user,
                        getspanf("hid a related result (%s)", "<i>"+j.sug[i].sug+"</i>"),
                        j.sug[i].id,
                        j.sug[i].url);
			}
		}
		// now add to queue or show
		if(!q.sugQueue) q.sugQueue = new Array();
		for(var i=0; i < j.sug.length; i++){
			if(j.sug[i].hide) continue; // skip hidden
			cloudAdd(q.q,j.sug[i].sug);
		}
		delete j.sug;
	}

	// process added urls first
	if(j.add) {
		for(var i=0; i < j.add.length; i++){
			var a = j.add[i];
			a.url = a.url.replace(/%3A/g,":").replace(/%2F/g,"/") // non-english urls got borked on adds before fix
			if(u[a.url]) continue;
			histAdd(q,a.user,getspan("added"),a.id,a.url);
			var r = resultAdd(q,a.url,q.q,"",true);
			// tag it as ours
			var ndx = $(document.createElement('a'));
			ndx.href = "javascript:alert('Added by "+a.user+"')";
			ndx.innerHTML = "User";
			ndx.addClassName("ndx");
			resultNdx(r,ndx);
		}
		delete j.add;
	}

	// check the del tuple
	if(j.del && j.del.length) {
		var dnew = new Array();
		for(var i=0; i < j.del.length; i++){
			var d = j.del[i];
			if(!u[d.url]){
				dnew.push(d); // no match, save it 
				continue;
			}
			var hact = (d.del) ? "deleted" : "undeleted";
			histAdd(q,d.user,getspan(hact),d.id,d.url);
			// only apply newest ones!
			var ts = parseInt(d.id);
			if(u[d.url].tsDel && u[d.url].tsDel > ts) continue;
			u[d.url].tsDel = ts;
			if(d.del) u[d.url].addClassName("deleted");
			else u[d.url].removeClassName("deleted");
		}
		
		j.del = dnew; // skipped ones saved for later
	}

	// apply any edits
	if(j.edit && j.edit.length) {
		var enew = new Array();
		for(var i=0; i < j.edit.length; i++){
			var e = j.edit[i];
			if(!u[e.url]){
				enew.push(e); // no match, save it 
				continue;
			}
			histAdd(q,e.user,getspan("edited"),e.id,e.url,e.title,e.summary);
			// only apply newest ones!
			var ts = parseInt(e.id);
			if(u[e.url].tsEd && u[e.url].tsEd > ts) continue;
			u[e.url].tsEd = ts;
			var r = u[e.url];
			r.tytle = e.title;
			r.summary = e.summary;
			resultRender(r);
		}
		j.edit = enew; // skipped ones saved for later
	}
	
	// process spotlights
	if(j.spot && j.spot.length) {
		
		// we don't handle below the fold spotlights yet :(  )
		var best = new Array();
		best.ts = 0;
		best.url = "";
		for(var i=0; i < j.spot.length; i++){
			var s = j.spot[i];
			if(!u[s.url]) continue;
			histAdd(q,s.user,getspan("spotlighted"),s.id,s.url);
			// only apply newest ones!
			var ts = parseInt(s.id);
			if(ts < best.ts) continue;
			best.ts = ts;
			best.url = s.url;
		}
		
		if(best.url != ""){
			u[best.url].addClassName("spotlight");
			q.spot = u[best.url];
		}
	}
	
	if(j.stars && j.stars.length > 0)
	{
		var snew = new Array(); // leftovers
		var update = new Object();
		// loop looking for matching urls in the results
		for(var i=0; i < j.stars.length; i++){
			var s = j.stars[i];
			if(!u[s.url]){
				snew.push(s); // no match, save it 
				continue;
			}
			histAdd(q,s.user,getspan("rated")+" "+s.rating+" "+getspan("stars"),s.id,s.url);
			if(!update[s.url]) update[s.url] = u[s.url];
			starsAlive(u[s.url],parseInt(s.rating));
		}
		// render new  calc average of all star ratings per url and apply
		for(var url in update){
			var n = u[url].id;
			jQuery("#stars_"+n).css( 'display', "block" );
			voted_new[n] = u[url].stars;
			for (var x=1;x<=voted_new[n];x++) {
				jQuery("#rating_" + n + "_" + x).attr( 'src', "kt_files/star_on.gif" );
			}
			for (var x=voted_new[n]+1;x<=5;x++) {
				jQuery("#rating_" + n + "_" + x).attr( 'src', "kt_files/star_off.gif" );
			}
		}
		starsShine(q); // apply ordering
		j.stars = snew; // ones that didn't match
	}
	collapseDeleted();
	// comments
	if(j.com)
	{
		var cnew = new Array(); // leftovers
		var sorted = j.com.sort(function (a,b){return parseInt(b.id) - parseInt(a.id);})
		// loop looking for matching urls in the results
		for(var i=0; i < sorted.length; i++){
			var c = sorted[i];
			if(!u[c.url]){
				cnew.push(c); // no match, save it 
				continue;
			}
			histAdd(q,c.user,getspan("commented on"),c.id,c.url,null,null,sorted[i].com);
			var com = getCom(u[c.url]);
			// is this the first one, or not?
			if(!com.first.author){
				com.first.author = c.user;
				com.first.comment = c.com;
			}else{
				var div = document.createElement('div');
				div = $(div);
				div.addClassName("comment");
				div.author = c.user;
				div.comment = c.com;
				comRender(com,div);
				com.rest.appendChild(div);
				com.count++;
			}
			comRender(com,com.first); // re-render the first one always for #
		}
		j.com = cnew; // ones that didn't match
	}
	
	if(j.selection){
		var snew = new Array(); // leftovers
		// loop looking for matching urls in the results
		var rend = new Object(); // touched results
		for(var i=0; i < j.selection.length; i++){
			var s = j.selection[i];
			if(!u[s.url]){
				snew.push(s); // no match, save it 
				continue;
			}
			var type = "";
			if(s.img) type="image";
			if(s.a) type="link";
			if(s.form) type="form";
			if(s.sel) type="text";
			if(type == "") continue;
			histAdd(q,s.user,getspan("annotated with a "+type),s.id,s.url);
			annAdd(u[s.url],type,s);
			rend[s.url] = true;
		}
		j.selection = snew; // ones that didn't match
		for(var url in rend){
			annRender(u[url]);
		}
	}


	// custom header background
	if(j.bg && j.bg.length > 0)
	{
		var tsbest = 0;
		var bgbest = "";
		for(var i=0; i < j.bg.length; i++){
			histAdd(q,j.bg[i].user,getspan("added a background"),j.bg[i].id);
			var ts = parseInt(j.bg[i].id);
			if(ts < tsbest) continue;
			tsbest = ts;
			bgbest = j.bg[i].bg;
		}
		q.bg = bgbest;
		if(Q == q) {
			jQuery("#top-bar").css( 'background', bgbest );
			jQuery("#count").hide();
			jQuery("#logo").css( 'display', "block" );
		}
		delete j.bg;
	}

	// customized list of also-try
	if(j.also && j.also.length > 0)
	{
		var tsbest = 0;
		var abest = new Array();
		for(var i=0; i < j.also.length; i++){
			histAdd(q,j.also[i].user,getspan("added another place to see results"),j.also[i].id);
			var ts = parseInt(j.also[i].id);
			if(ts < tsbest) continue;
			tsbest = ts;
			abest = j.also[i].also;
		}
		q.also = Alsos;
		for(var i=0;i<abest.length;i++) q.also[abest[i]]++;
		if(Q == q) {
			alsoRender();
		}
		delete j.also;
	}
	histRender();
}

function processKTN(e){

	if ( is_IP( un ) && e == "Validation Error" ){
		getAnonValidationError()
	}
	if (  e != "Good"){
		getValidationError( e )
		return false;
	}
}

function processWISEKT(q,json){

	// customized list of WISE apps
	var has_categories = false;
	var deleted = {};
	var run_apps = {}; 
	for (var wiseq in json) {
		j = json[wiseq];
		if(j.wise && j.wise.length > 0)
		{
			for(var i=0; i < j.wise.length; i++){
				if(j.wise[i].del && (wiseq==Q.q) && (WISE && WISE.apps[j.wise[i].del])) {
                    // FIXME: This is just for the purpose of an example.
                    // The format string should include more textual variables, such as user and time.
					histAdd(q,
                            j.wise[i].user,
                            getspanf("deleted the %s application",
                                     WISE.apps[j.wise[i].del].name ? WISE.apps[j.wise[i].del].name : j.wise[i].del),
                            j.wise[i].id,
                            (WISE.apps[j.wise[i].del].name ? WISE.apps[j.wise[i].del].name : j.wise[i].del) );
					if(!run_apps[j.wise[i].del]) deleted[j.wise[i].del] = true;
				}
				if(j.wise[i].app && (WISE && WISE.apps[j.wise[i].app])) {
                    // FIXME: This is just for the purpose of an example.
                    // The format string should include more textual variables, such as user and time.
					histAdd(q,
                            j.wise[i].user,
                            getspanf("added the %s application",
                                     WISE.apps[j.wise[i].app].name ? WISE.apps[j.wise[i].app].name : j.wise[i].app),
                            j.wise[i].id,
                            (WISE.apps[j.wise[i].app].name ? WISE.apps[j.wise[i].app].name : j.wise[i].app) );
					if(wiseq==Q.q && !deleted[j.wise[i].app]) {
						WISE.run(q.q, j.wise[i].app);
						run_apps[j.wise[i].app] = true;
					}
				}
			}
		}
	}

	WISE.deleted[Q.q.toLowerCase()] = deleted;
	
	var wise_qstring = "";
	wise_qstring += "&k="+(encodeUTF8(q.q.toLowerCase()));
	var q_array = q.q.toLowerCase().split(" ");

	for(var i=1; i<q_array.length; i++) {
		wise_qstring += "&k=";
		var temp_str = "";
		for (var j=i; j<q_array.length; j++) {
			temp_str += q_array[j] + (j<q_array.length-1 ? " " : "");
		}
		wise_qstring += (encodeUTF8(temp_str));
	}

	for(var i=q_array.length-2; i>=0; i--) {
		wise_qstring += "&k=";
		var temp_str = "";
		for (var j=i; j>=0; j--) {
			temp_str = (j>0 ? " " : "") + q_array[j] + temp_str;
		}
		wise_qstring += (encodeUTF8(temp_str));
	}

	var url = KT+"kt.js?t=trigger"+ wise_qstring + "&r=" + Math.random() + "&f=processTriggerKT(";

	callOutArg("processTriggerKT",url,q);

	histRender();
	
}

function processTriggerKT(q, json){
	// customized list of WISE apps
	var has_categories = false;	
	for (var wiseq in json) {
		j = json[wiseq];
		if(j.trigger && j.trigger.length > 0)
		{
			for(var i=0; i < j.trigger.length; i++){
				if(j.trigger[i].category) {
					if (!WISE.q_categories[q.q.toLowerCase()]) WISE.q_categories[q.q.toLowerCase()] = {};
					WISE.q_categories[q.q.toLowerCase()][j.trigger[i].category] = j.trigger[i].keyword;
					has_categories = true;
				}
			}
		}
	}
	if(has_categories) WISE.cat_scan();
}

function getValidationError( error ){

	html = "";
	html += "<h2>"+getspan("An error has occured")+"</h2>";	
	html += "<div class=\"dialog-message\"><b>" + getspan("An error has occurred.  Please try again or re-login.") + "</b></div>"
	html += "<p><div class=\"dialog-message\">" + getspan("Error details:") + " " + error + "</div>"
	html += "<p><div class=\"dialog-message\"><b>" + getspan("REQUEST") + "</b><br>query: " + Q.q + "<br>user: " + un + "<br>time: " + getCookie("thoothSearchTime") + "<br>token: " + getCookie("thoothSearchTokenNew") + "</div>"
	html += "<p><div><a href=\"https://bugs.launchpad.net/wikia-search\" target=_new><b>" + getspan("File a bug Report") + "</b></a></div><p>"
	html += "<div id=\"related-button\">";
	html += "<input id=\"ls_cancel_btn\"  type=\"button\" value=\""+getspan("OK", {id:'ls_cancel_btn',param:'value'})+"\" onclick=\"closeValidationError();\" />";
	html += "</div>";
	deleteCookie("thoothSearchTime", '/');
	deleteCookie("thoothSearchTokenNew", '/');
	show_dialog( html );
}

function getAnonValidationError(){
	//try to clear their cookie first...maybe they have a floating IP
	
	deleteCookie("thoothUserName", '/');
	html = "";
	html += "<h2>"+getspan("Validation Error")+"</h2>";	
	html += "<div class=\"dialog-message\">" + getspan("An error has occurred.  We could not verify your annonymous status. Please try again. . If the problem persists, please create an account to save your changes.") + "</div>"
	html += "<div id=\"related-button\">";
	html += "<input id=\"ls_cancel_btn\"  type=\"button\" value=\""+getspan("OK", {id:'ls_cancel_btn',param:'value'})+"\" onclick=\"closeValidationError();\" />";
	html += "</div>";
	show_dialog( html );
}

function closeValidationError() {
	if (document.getElementById("dialog-window")) document.getElementById("dialog-window").style.display = "none";
	if (document.getElementById("dialog-lightbox")) document.getElementById("dialog-lightbox").style.display = "none";
	document.body.style.overflow="auto";
	return false
}

function selinkt(e)
{
        if(window.event) { e = window.event; }

        var sel = "";
        if(document.getSelection) {
                sel = document.getSelection();
        } else if(document.selection) { 
                sel = document.selection.createRange().text;
        } else if(window.getSelection) {
                sel = window.getSelection();
        }
        var target = e.target || e.srcElement;
		if(sel == "" || target.tagName.toLowerCase() != 'div') return;
		var re = new RegExp("(.*?)(\\S*"+sel+"\\S*)(.*)");
		var a = target.innerHTML.match(re);
		if(!a) return;
		if(a.length != 4) return;
		target.innerHTML = a[1] + '<a class="sel-autolink" href="#'+a[2]+'">'+a[2]+'</a>'+a[3];
		return true;
}

// we have to ask the server for the current time
var nowoffset = 0;
function itsNow(j){
	if(!un || un == "you") un = j.ip;
	var ko = new Date();
	nowoffset = ko.getTime() - parseInt(j.now);
	histRender(); // update history
}

callOut("itsNow(j)",KT+"now.js?f=itsNow(&r="+Math.random());

//when we send unicode through ajax to KT, we need to send in the format \uXXXX
function encodeUTF8( string ){
	var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else {
                utftext += "\\u" + c.toPaddedString(4, 16);
            }

        }
	return encodeURIComponent(utftext);
}

