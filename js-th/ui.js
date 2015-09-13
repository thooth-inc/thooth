function showAdminTools(){

	if( isAdmin ) {
		tools = "<h2>" + getspan("Admin Tools") + "</h2>";
		tools += "<div>";
		tools += "<img src=\"images/emblem-readonly.png\" align=\"absmiddle\"> <a href='javascript:showKTAdmin()'>" + getspan("Keyword Rights Settings") + "</a></div>";
		jQuery("#admin-tools").html(tools);
		jQuery("#admin-tools").show();
	}
}

function showKTAdmin(){

    	levels = [{"name":"user","description":gettext("Registered Users")},{"name": "admin", "description":gettext("Admins Only")},{"name": "anon", "description":gettext("Everyone")}];
	admin_html = "";
	admin_html += "<h2>"+getspan("Who Can Edit This Keyword?")+"</h2>";	
	admin_html += "<div class=\"dialog-message\">" + getspan("Please choose the user group who should have access to edit the keyword <b>" + Q.q + "</b>") + "</div>"
	admin_html += "<br/><div><select id=\"protect_level\">"
	for( x = 0; x<= levels.length-1; x++ ){
		admin_html += "<option value=\"" + levels[x].name + "\" " + ((kt_required==levels[x].name)?"selected":"") + ">" + levels[x].description  + "</option>";
	}
	admin_html += "</select></div><br/>";
	admin_html += "<div id=\"related-button\">";
	admin_html += "<input id=\"ls_save_btn\" type=\"button\" value=\""+getspan("Save", {id:'ls_save_btn',param:'value'})+"\" onclick=\"ktProtect();\" /> ";
	admin_html += "<input id=\"ls_cancel_btn\"  type=\"button\" value=\""+getspan("Cancel", {id:'ls_cancel_btn',param:'value'})+"\" onclick=\"HideAdminTools();\" />";
	admin_html += "</div>";
	show_dialog( admin_html );

}

function HideAdminTools() {
	
       if (jQuery("#dialog-window")) 
	    jQuery("#dialog-window").hide();
	
   	if (jQuery("#dialog-lightbox")) 
	    jQuery("#dialog-lightbox").hide();
	
        jQuery("body").css({"overflow":"auto"});

	return false
	
}

function showRightsError( error ){
	admin_html = "";
	admin_html += "<h2>"+getspan("Permission Denied!")+"</h2>";	
	admin_html += "<div class=\"dialog-message\">" + getspan("An error has occured. " + error + ".") + "</div>"
	admin_html += "<br/>";
	admin_html += "<div id=\"related-button\">";
	admin_html += "<input id=\"ls_cancel_btn\"  type=\"button\" value=\""+getspan("OK", {id:'ls_cancel_btn',param:'value'})+"\" onclick=\"close_dialog();\" />";
	admin_html += "</div>";
	show_dialog( admin_html );
}

function showActions(menu, type) {
	
	if (type=="show") {
		jQuery("#action-menu-"+menu).css( 'display', 'block' );
	} else if (type=="hide") {
		jQuery("#action-menu-"+menu).hide();
	} else if (type=="minishow") {
		jQuery("#mini-article-actions").css( 'display', 'inline' );
	} else if (type=="minihide") {
		jQuery("#mini-article-actions").hide();
	}
	
}

function moreHistory(type) {

	new Effect.toggle('history-more', 'blind', {duration:.33, fps:32});
	
	if (type=="less") {
		jQuery('#history-more-link').html( '<a href="javascript:moreHistory(\'more\')">'+getspan("More")+'</a>' );
	} else {
		var ob='<option>';
		var oe='</option>';
		jQuery('#history-more-link').html(
		    '<a href="javascript:moreHistory(\'less\')">' +getspan('Less') +'</a> '
		    +getspan('Type')
		    +' <select>'
		    +ob+getspan('Edit')+oe
		    +ob+getspan('Annotation')+oe
		    +ob+getspan('Highlight')+oe
		    +ob+getspan('Rate')+oe
		    +ob+getspan('Comment')+oe
		    +ob+getspan('Delete')+oe
		    +'</select> '
		    +getspan('User')
		    +' <select>'
		    +ob+'Aaron Wright'+oe
		    +ob+'Dan Lewis'+oe
	 	    +ob+'Jeff Tierney'+oe
		    +ob+'David Pean'+oe
		    +'</select>'
		);
	}
	
}

function showComments(result) {

//	new Effect.toggle('comment-more-'+result, 'blind', {duration:.33, fps:32});
	jQuery("#comment-more-'+result").slideToggle( {duration:.33, fps:32} );

}

function showRevision(revision, type) {

	jQuery("#revision-text-"+revision).slideToggle( {duration:.33, fps:32} );
	
	if (type=='show') {
		jQuery("#revision-show-"+revision).html( '<a href="javascript:showRevision('+revision+', \'hide\')">('+getspan("hide")+')</a>' );
	} else {
		jQuery("#revision-show-"+revision).html( '<a href="javascript:showRevision('+revision+', \'show\')">('+getspan("show")+')</a>' );
	}
}

function showDropDown(el, type) {
	
	if (type=="show") {
		jQuery(el).css( 'display', 'block' );
		jQuery("#profile-button").html( '<a href="javascript:showDropDown(\'profile-more\', \'hide\');">Profile <img src="images/down_arrow.gif" alt="" border="0"/></a>' );
	} else {
		jQuery(el).hide();
		jQuery("#profile-button").html( '<a href="javascript:showDropDown(\'profile-more\', \'show\');">Profile <img src="images/down_arrow.gif" alt="" border="0"/></a>' );
	}
	
}

//protection
function ktProtect( ){
	kt_required = jQuery("#protect_level").val();
	ktSave(Q,"admin", {"required": { "edit": jQuery("#protect_level").val() } } );
	HideAdminTools();
}

// star rating stuffs
function iStar(id,n)
{
	var star = (results[id].starring >= n) ? "on" : "off";
	return '<img onclick="clickVoteStars('+id+','+n+');" onmouseover="updateRating('+id+','+n+',5);" onmouseout="startClearRating('+id+',5,0);" id="rating_'+id+'_'+n+'" src="images/star_'+star+'.gif" />';
}

var MaxRating = 5;
var clearRatingTimer = "";
var voted_new = new Array();
	
var id=0;
var last_id = 0;

function startClearRating(id,rating,voted)
{
	clearRatingTimer = setTimeout("clearRating('" + id + "',0," + rating + "," + voted + ")", 200);
}

function clearRating(id,num,prev_rating,voted)
{
	if(voted_new[id])voted=voted_new[id];
		
	for (var x=1;x<=MaxRating;x++) {
		if(voted){
			star_on = "voted";
			old_rating = voted;
		}else{	
			star_on = "off";
			old_rating = prev_rating;
		}
		if(!num && old_rating >= x){
			jQuery("#rating_" + id + "_" + x).attr( 'src', "images/star_" + star_on + ".gif" );
		}else{
			jQuery("#rating_" + id + "_" + x).attr( 'src', "images/star_off.gif" );
		}
	}
}
	
function updateRating(id,num,prev_rating)
{
	if(clearRatingTimer && last_id==id)clearTimeout(clearRatingTimer);
	clearRating(id,num,prev_rating);
	for (var x=1;x<=num;x++) {
		jQuery("#rating_" + id + "_" + x).attr( 'src', "images/star_voted.gif" );
	}
	last_id = id;
}

// merge rating with any others and make sure being tracked
function starsAlive(r,rating){
	if(!rating) return;
	if(!r.q.stars) r.q.stars = new Array();
	if(!r.starTot){ // first timer
		r.starSum=0;
		r.starTot=0;
		r.q.stars.push(r);
	}
	r.starSum += rating;
	r.starTot++;
	r.stars = r.starring = Math.round(r.starSum / r.starTot);
	if(r.hasClassName("deleted")) r.starring = 0.9; // change sort order
}

// apply ordering
function starsShine(q){
	if(!q.stars) return;
	q.stars = q.stars.sort(function(a,b){ return b.starring - a.starring; });
	if(q.stars.length == 0) return;
	if(q.firstChild != q.stars[0]){
		r=q.stars[0];
		r.remove();
		q.insertBefore(r,q.firstChild);
	}
	var last = q.firstChild;
	for(var i=1;i<q.stars.length;i++){
		var r = q.stars[i];
		if(last.next() != r){
			r.remove();
			if(last.next()) // we might be the bottom :/
				q.insertBefore(r,last.next());
			else
				q.appendChild(r);
		}
		last = r;
	}
	
}

function clickVoteStars(id,rating)
{
	voted_new[id] = rating;
	if(!results[id].stars){ // first time star ratings, cache title/summary to preserve relevance
		ktSave(Q,"stars",{"url":results[id].url,"rating":rating,"title":results[id].tytle,"summary":results[id].summary});		
	}else{
		ktSave(Q,"stars",{"url":results[id].url,"rating":rating});
	}
	starsAlive(results[id],rating);
	results[id].starMove = true;
}

function voteShow(id)
{
	jQuery("#stars_"+id).css( 'display', 'inline' );
	jQuery("#highlight_"+id).css( 'display', 'inline' );
}

function voteHide(id)
{
	jQuery('#highlight_'+id).hide();
	if(voted_new[id]) return;
	jQuery('#stars_'+id).hide();
}

function rCancel(id){
	resultRender(results[id]);
}

var raddhints = new Array();
function rSave(f,id){
	var r = results[id];
	if(f.tytle.value == "") return false;
	// if no changes, just restore
	if(r.tytle == f.tytle.value && r.summary == f.summary.value){
		resultRender(r);
		return false;
	}
	raddhints[r.url] = r; // for new urls to carry changes!
	r.tytle = f.tytle.value;
	r.summary = f.summary.value;
	resultRender(r);
	ktSave(Q,"edit",{"url":r.url,"title":r.tytle,"summary":r.summary});
	return false;
}

function rEdit(id)
{
	var r = results[id];
	var host = r.url.match(/:\/\/([^\/]+)/i);	
	var htm = "";
	htm += '<form action="javascript:" method="post" onsubmit="return rSave(this,\''+id+'\')" class="description">';
	htm += '<div class="link">';
    htm += '<input value="'+r.tytle.replace(/</g,"&lt;").replace(/\"/g,"&quot;")+'" name="tytle" style="width:100%"/>';
	htm += '</div>';
	htm += '<textarea name="summary" class="blurb" style="width:100%">'+r.summary.replace(/</g,"&lt;")+'</textarea>';
	htm += '<div class="other">'
    htm += '<input type="submit" value="save edits for '+host[1].escapeHTML()+'" /><input type="button" value="cancel" onclick="rCancel('+id+')" />';
    htm += '</div>';
    htm += '</form>';
	jQuery(r).html(htm);
}

var roverlast=false;
function rOver(){
	if(this==roverlast) return;
	if(roverlast) rOut(roverlast);
	roverlast=this;
	if(!this.childElements()[1]) return;

	jQuery(this.childElements()[1]).css( 'display', "block" );

	jQuery("#stars_"+this.id).css( 'display', "block" );

	this.onmouseup = selinkt;
}

function rOut(r){
	if(!r.childElements()[1]) return;

	jQuery( r.childElements()[1] ).hide();

	if(r.unPeek){
		r.unPeek = false;
		r.removeClassName("undelpeek");
		r.addClassName("deleted");
	}
	if(!r.starring) jQuery("#stars_"+r.id).hide();
	if(r.starMove){ // only move after they leave
		r.starMove=false;
		r.targ = r.q.firstChild;
		// find where we're at in the pecking order
		r.q.stars = r.q.stars.sort(function(a,b){ return b.starring - a.starring; });
		for(var i=0;i<r.q.stars.length;i++){
			if(r == r.q.stars[i]) continue;
			r.targ = r.q.stars[i];
			if(r.starring >= r.q.stars[i].starring) break;
		}
		if(r.targ.starring && r.targ.starring > r.starring) r.targ = r.targ.next();
		if(r.targ == r) return; // HA!
		movs.push(r);
		r.style.top="-20px";
		window.setTimeout("rMoves()",100);
	}
}

function rSpot(id){
	var r = results[id];
	if(Q.spot) jQuery(Q.spot).removeClass("spotlight");

	jQuery(r).addClass("spotlight");
	Q.spot = r; // only one
	ktSave(Q,"spot",{"url":r.url});
}

function rDelMacro(id,why){
	return "&nbsp;&nbsp;<span onclick='rDelDo("+id+",\""+why+"\")'>"+why+"</span>";
}

function rDel(id,e){
	if(e.did) return "";
	e.did = true;
	e.style.whiteSpace="nowrap";
	e.innerHTML += ":"+rDelMacro(id,"Irrelevant")+rDelMacro(id,"Duplicate")+rDelMacro(id,"SPAM");
}

function rDelDo(id,why){

	jQuery(results[id]).addClass("deleted");
	ktSave(Q,"del",{"url":results[id].url,"del":1,"why":why});
	if(results[id].starring){ // manually demote rating
		results[id].starring = 0.9;
		results[id].starMove = true;
	}

}

function rUnDelPeek(id,a){

	jQuery(results[id]).removeClass('deleted');
	jQuery(results[id]).addClass('undelpeek');
	results[id].unPeek = true;
}

function rUnDel(id,a){
	$(a).up().removeClassName("deleted"); // fix actions menu
	results[id].removeClassName("deleted");
	ktSave(Q,"del",{"url":results[id].url,"del":0});
	if(results[id].starring){ // restore sorting order
		results[id].starring = results[id].stars;
		window.setTimeout("results["+id+"].starMove = true",1000);
	}
}

// take text and break into chunks, parsing link-only wikitext, boldifying
function wikiChunk(txt,rekw){
	var a = new Array();
	var alen = new Array();
	while(1){
		var start = txt.indexOf("[");
		var pre = (start >= 0) ? txt.substring(0,start) : txt;
		if(pre.length > 0){ // raw text, we chunk it too
			var pa = pre.split(" ... ");
			for(var i=0;i<pa.length;i++){
				alen.push(pa[i].length);
				a.push(pa[i].replace(rekw,"<b>$1</b>"));
				if(i+1<pa.length){ alen.push(5); a.push(" ... "); }
			}
		}
		break;

		// handle [[internal]] and [http://foo external]
		if(txt.substr(start+1,1) == "["){
			var stop = txt.indexOf("]]",start);
			if(stop < 0) break;
			var link = txt.substring(start+2,stop);
			txt = txt.substring(stop+2);
			if(link.length <= 0) continue;
			alen.push(link.length);
			a.push('<a href="#'+link+'">'+link.replace(rekw,"<b>$1</b>")+'</a>');
		}else{
			// should we support just [http://foo.com/] ?
			var space = txt.indexOf(" ",start);
			var stop = txt.indexOf("]",space);
			if(space < 0 || stop < 0) break;
			var link = txt.substring(start+1,space);
			var title = txt.substring(space+1,stop);
			txt = txt.substring(stop+1);
			if(link.length <= 0 || title.length <= 0) continue;
			alen.push(title.length);
			a.push('<a href="'+link+'">'+title.replace(rekw,"<b>$1</b>")+'</a>');
		}
	}
	return [a,alen];
}


function resultRender(r)
{
	// regexify!
	var rehost = /:\/\/([^\/]+)/i;
	var replain = /:\/\/(.+?)\/?$/i;
	var safeq = r.q.q.replace(/\W+/g,".?");
	var rekw = new RegExp("(\\w*"+safeq+"\\w*)","ig");
	var url = r.url.escapeHTML();
	var host = url.match(rehost);
	var urlplain = url.match(replain);
	// defaults!
	var title = (r.tytle != "" && r.tytle != null) ? r.tytle : r.q.q;
	title = title.replace(/</g,"&lt;");
	var summary = r.summary.replace(/</g,"&lt;");
	// strip out exact title from summary, seems to be a lot of this
	//if(title+" " == summary.substr(0,title.length+1)) summary = summary.substr(title.length+1);
	// force empty if nothing meaningful
	if(summary.replace(/\W+/g,"") == "") summary = "";	

	// feels like the biggest hack ever, break summary into chunks, parse for some wikitext, boldify
	var schunks = wikiChunk(summary, rekw);
	var a=schunks[0];
	var alen=schunks[1];
	// reassemble w/ more/less
	var sumhtm = "";
	var slen=0;
	var smore=false;
	for(var i=0;i<a.length;i++){
		sumhtm += a[i];
		slen += alen[i];
		if(!smore && slen > 150 && i+1 < a.length){
			smore = true;
			sumhtm += ' <span onclick="$(this).next().style.display=\'inline\';$(this).style.display=\'none\';"><u>('+getspan('more')+')</u></span><span style="display:none;">';
		}
	}
	if(smore) sumhtm += ' <u onclick="$(this).up().previous().style.display=\'inline\';$(this).up().style.display=\'none\';">('+getspan('less')+')</u></span>';
	// boldify
	var title = title.replace(rekw,"<b>$1</b>");
	var urlp = urlplain[1].replace(rekw,"<b>$1</b>");

	// build
	var htm = "";
	htm += '<div class="description">';

	htm += '<div class="link-container clearfix">';

	htm += '<div class="link"><a href="'+r.url+'" target="_blank">'+title+'</a></div>';
	var sdisp = r.starring ? "block":"none";
    	htm += '<div class="rating"><div id="stars_'+r.id+'" style="display:'+sdisp+';">'+iStar(r.id,1)+iStar(r.id,2)+iStar(r.id,3)+iStar(r.id,4)+iStar(r.id,5)+'</div></div>';

	htm += '</div>';
	htm += '<div class="blurb">';
	htm += sumhtm+'</div>';
	htm += '<div id="url_'+r.id+'" class="clearfix">';

    htm += '<a class="url">'+urlp+'</a>';
    htm += '</div>';
    htm += '</div>';
	htm += '<div class="actions" style="display:none;">';
	htm += '	<a href="javascript:void(0);" onclick="rUnDel('+r.id+',this)"  onmouseover="rUnDelPeek('+r.id+',this)" class="undelete">'+getspan('Undelete')+'</a>';
	htm += '	'
	+'<a href="javascript:void(0);" onclick="rEdit(\''+r.id+'\')">'  +getspan('Edit')+'</a>'
	+'<a href="javascript:void(0);" onclick="rSpot(\''+r.id+'\')">'  +getspan('Spotlight')+'</a>'
	+'<a href="javascript:void(0);" onclick="rCom(\''+r.id+'\')">'   +getspan('Comment')+'</a>'
	+'<a href="javascript:void(0);" onclick="rDel(\''+r.id+'\',this)">'   +getspan('Delete')+'</a>';
	htm += '</div>';
	if(r.ann) var temp_r_ann = r.ann.innerHTML;
	r.innerHTML = htm;
	if(r.ndxs) for(var i=0;i<r.ndxs.length;i++){ $("url_"+r.id).appendChild(r.ndxs[i]); } // freaking ugly, plz refxtr!
	if(r.ndx && r.ndx.applied) $("url_"+r.id).appendChild(r.ndx); // more misery
	// why doth dom suck so?
	if(!r.ann){
		r.ann = document.createElement('div');
		r.ann.innerHTML = "<div/>"; // firstChild is where all our ann stuff really lives
		//r.ann.addClassName("annotation");
		$(r.ann).addClassName("annotation");
	}
	else {
		if(r.ann.innerHTML.length == 0 && temp_r_ann && temp_r_ann.length>0) r.ann.innerHTML = temp_r_ann;
	}
	r.appendChild(r.ann);
}

var movs = new Array();
function rMoves(){
	if(movs.length == 0) return;
	var movsn = new Array();
	for(var i=0;i<movs.length;i++){
		var r = movs[i];
		var a = r.targ.positionedOffset();
		var b = r.positionedOffset();
		if(b[1] < a[1] || b[1] - a[1] < 50){
			r.remove();
			r.style.top = "0px";
			r.q.insertBefore(r,r.targ);
			continue;
		}
		r.style.top = (parseInt(r.style.top)-(b[1]-a[1])/2)+"px";
		movsn.push(r);
	}
	movs=movsn;
	if(movs.length > 0) window.setTimeout("rMoves()",100);
}

function resultAdd(q,url,title,summary,top,master){

	if(!q.urls) q.urls = new Array(); // housekeeping
	if(q.urls[url]) return q.urls[url]; // dedup, this might be dangerous, meh
	rid++; // unique result id and div
	q.seq = (q.seq) ? q.seq+1 : 1;
	var r = results[rid] = document.createElement('div');
	r.q = q; // reference to the parent
	r.id = rid;
	r.seq = q.seq;
	r.onmouseover = rOver;

	$(r).addClassName("search-result");
	r.url = url;
	r.tytle = title
	r.summary = summary;
    	q.urls[r.url] = r; // inverse index by url, man this is ugly
	
	var ha = url.match(/:\/\/([^\/]+)/); // also do just hostname
	r.host = (ha.length > 1) ? ha[1] : "localhost";
	if(!q.urls[r.host]) q.urls[r.host] = r;
	
	// jeff test added to try url checking - 0623
	var h_p = getHostAndPath(url);
	if (!q.pages) q.pages = new Array();
	if (!q.pages[h_p[0]]) q.pages[h_p[0]] = new Array();
	q.pages[h_p[0]][h_p[1]] = {id:rid};
	
	if (h_p[2]) {
		if (!q.domains) q.domains = new Array();
		if (!q.domains[h_p[2]]) q.domains[h_p[2]] = new Array();
		q.domains[h_p[2]][h_p[1]] = {id:rid};
		//alert(h_p[2]);
	}
	// ------------------------------------------
	
	resultRender(r); // if you added it, you want to render it right?
	if(top){
		if(q.stars && q.stars.length > 0) // place above whatever result follows the lowest rated
			q.insertBefore(r,q.stars[q.stars.length-1].next());
		else
			q.insertBefore(r,q.firstChild);
	}else{
		q.appendChild(r);
	}
	return r;
}

function getHostAndPath(url) {
	url = url.replace(/\s/g,"");
	var ha = url.match(/:\/\/([^\/]+)/); // also do just hostname
	r_host = (ha.length > 1) ? ha[1] : "localhost";
	
	var rpath = url.match(/:\/\/[^\/]+\/([^\n]+)/); // also get page path
	var s_path = (rpath && rpath.length>1) ? processPath(rpath[1]) : "/";
	
	var r_site = false;
	if ((r_host) != "localhost") {
		var host_array = r_host.split(".");
		if (host_array && host_array.length > 1) {
			r_site = host_array[host_array.length-2];
			r_site = r_site.toLowerCase();
		}
	}
	
	var s_host = processHost(r_host);
	s_path = processPath(s_path);
	
	return new Array(s_host, s_path, r_site);
	
}

function processPath(which) {
	var returnpath = which.toLowerCase();
	try{returnpath = decodeURIComponent(encodeURIComponent(decodeURIComponent(which.toLowerCase())));}
	catch(ex) {
		//alert(which + " " + ex.message)
	}
	return returnpath
}
function processHost(which) {
	var s_host;
	if (which.indexOf("www.") == 0) var s_host = which.substr(4);
	else var s_host = which;
	s_host = s_host.toLowerCase();
	
	return s_host;
}

// display alternate index hits
function resultNdx(r, ndx){

	var urlz = jQuery('#url_'+r.id);
	if(!urlz) return;
	if(!r.ndxs) r.ndxs = new Array();
	for(var i=0; i < r.ndxs.length; i++) 
	    if(r.ndxs[i].html() == ndx.html()) 
		return; // really ugly dedup
	r.ndxs.push(ndx);  // for dedup and store for rerender
	if(r.ndx && !r.ndx.applied){
		r.ndx.applied = true;
		urlz.append(r.ndx);
	}
	urlz.append(ndx);

}

function processResult(q,search)
{
	if(!q.urls) q.urls = new Array(); // housekeeping

	// some regex stuffs
	var safeq = q.q.replace(/\W+/g,".?");
	var rekwp = new RegExp("("+safeq+")","ig");

	// if the search contained a host/link, do some magic
	var rehost1 = /([\w|\.]+\.[a-z]{2,5}\/\S*)/i; // match with trailing slash
	var rehost2 = /([\w|\.]+\.[a-z]{2,5})\s/i; // match with trailing space, someone please combine these :)
	var la = q.q.match(rehost1);
	var sqsp = q.q + " "; // it's a hack, please fix my stupid regex!
	var zlink = la || sqsp.match(rehost2);
	if(q.zskip) zlink = false;
	if(zlink) q.zskip = true; // need to refactor all this z shit out of processResult()!!
	var zlinked = false;

  for (var i=0;i < search.documents.length; i++)
  {
    var doc = search.documents[i];
	// do some stuff to the url
    var url = new String(doc.fields.url);
	if(!zlinked && zlink) zlinked = url.split(zlink[1]); // check this url if it was in the query as a flag
    url = url.unescapeHTML(); // not sure this is right
	// get other parts we need
	var summary = new String(doc.summary);
	var title = new String(doc.fields.title);
	if(doc.fields.anchors) {
		// sometimes we have anchor text to help out
       for (var a in doc.fields.anchors)
       {
               if(a.match(rekwp)) // if the anchor contains the search
               {
                       var extra = a.replace(rekwp,""); // and is more than just the search
                       if(extra && extra.length > 2)
                       {
                               if(title == "") title = a; // blank title, replace it
                               else summary += " ... "+a; // append to summary these first
                       }
               }
       }
       for (var a in doc.fields.anchors)
       {
               if(!a.match(rekwp)) summary += " ... "+a; // append others to summary too
       }
	}
	var r = resultAdd(q,url,title,summary,false);
	r.doc = doc; // for later bemusement
  }

	// query had a link but no results had it!
	if(!zlinked && zlink)
	{
		var url = zlink[1];
		if(url.substr(0,7).toLowerCase() != "http://") url = "http://" + url;
		resultAdd(q,url,zlink[1],"",true);
	}
}

var prev_id;
function preview(id)
{
	prev_id=id;
	var r = results[id];
	var srt = $('search-results-top');
	var srs = $('search-results-side');
	var sn = $('search-notifications');
    	var ipc = $('preview-container');
	var ipv = $('preview');
    	var ipvh = $('preview-header');
	var sr = $('search-results');

	sr.addClassName('annotation-window');
    	ipvh.style.width = ipv.style.width=(getWindowWidth() - 285) + "px";
	ipv.src = 'about:blank';
	var cache = (r.doc) ? '&idx='+r.doc.indexNo+'&id='+r.doc.indexDocumentNo+'&ndx='+encodeURIComponent(NDX) : '';

	// added
	var s_domain=window.location.href.split('/'); 
	s_domain.length=3;
	s_d_string = s_domain.join('/');
	var proxypage = ((window.location.href && window.location.href.indexOf("wikia-inc.com")>-1) ? '/search' : '') + '/getAnn.html';

	//changed to add domain
//    	ipv.src = 'http://preview-origin.index.swlabs.org/do/preview?query='+encodeURIComponent(r.q.q)+'&url='+encodeURIComponent(r.url)+cache+'&domain='+encodeURIComponent(s_d_string+proxypage)+"&xwsresultid="+id;
	ipc.style.display = ipvh.style.display = ipv.style.display = "block";
	srt.style.display = srs.style.display = sn.style.display = "none";
	$(""+id+"").scrollTo();
}

function previewX(){
	$('search-results').removeClassName('annotation-window');
	//$('search-results').style.width = $('search-results').origWidth;
	$('preview').src = "about:blank";
	$('preview-container').style.display = $('preview').style.display = $('preview-header').style.display = "none";
	$('search-results-side').style.display = $('search-notifications').style.display = $('search-results-top').style.display="block";
	$(""+prev_id+"").scrollTo();
	prev_id=0;
}

var tmp_add = "";
function addSite(){
	// need to do some more form validation
	var url = $("addinput").value;
	if(url == "") return;
	if(url.substr(0,10).indexOf("://") < 0) url = "http://" + url;
	
	if(url.length <= 10 || Q.urls[url]) {
		var added = $(""+Q.urls[url].id+"");
		if (added) added.scrollTo();
		return false;
	}
	
	url = url.replace(/\s/g,""); // no spaces, need better sanity than this 
	
	// added by jeff to test blocking adding urls that exist - 0623
	
	var h_p = getHostAndPath(url);
	
	if (Q.pages && Q.pages[h_p[0]] && Q.pages[h_p[0]][h_p[1]]) {
		var added = $(""+Q.pages[h_p[0]][h_p[1]].id+"");
		if (added) added.scrollTo();
		return false;
	}
	
	if (h_p[2] && Q.domains && Q.domains[h_p[2]] && Q.domains[h_p[2]][h_p[1]]) {
		var c_add = confirm("You are trying to add:\n" + url + "\n"+ "The following url exists in the results:\n" + results[Q.domains[h_p[2]][h_p[1]].id].url + "\n" + "Click OK to continue adding your result,\n" + "or Cancel if this is what you were trying to add");
		//alert("maybe you meant " + results[Q.domains[h_p[2]][h_p[1]].id].url + "?");
		if (!c_add) {
			var added = $(""+Q.domains[h_p[2]][h_p[1]].id+"");
			if (added) added.scrollTo();
			return false;
		}
	}
	
	tmp_add = resultAdd(Q,url,Q.q,"",true);
	//right now, we are only going to support scraping title and summaries for english queries
	if( !lang || lang == "en" ){
		url = url.replace(/\+/g,"%2B")
		ktSave(Q,"add",{"url":url,"title":Q.q,"summary":""});
		contents = server_to_use + "/index.php?title=index.php&action=ajax&rs=wfGetURLContents&rsargs[]=" + encodeURIComponent(url) + "&rsargs[]=addSiteFinish"
		getDataFromServer("addsite", contents, "") 
	}else{
		r = tmp_add
		r.tytle = Q.q
		r.summary = "";
		resultRender(r);
		url = url.replace(/\+/g,"%2B")
		ktSave(Q,"add",{"url":url,"title":r.tytle,"summary":""});
		return false;
	}

	return false;
}

function addSiteFinish(page){
	if( !page.title ) return;
	
	summary = (( page.description )? page.description:"");
	
	page.title = decodeURIComponent( page.title  )
	summary = decodeURIComponent( summary )

	ktSave(Q,"edit",{"url":page.url,"title":page.title,"summary":summary});
	
	r = tmp_add
	r.tytle = page.title
	r.summary = summary;
	resultRender(r);
	
	if(raddhints[r.url]){
		r.tytle = raddhints[r.url].tytle;
		r.summary = raddhints[r.url].summary;
		resultRender(r);
		ktSave(Q,"edit",{"url":r.url,"title":r.tytle,"summary":r.summary});
	}
	return false	
}

// restore comment area after form cancel
function comCancel(id){
	var com = getCom(results[id]);	
	com.commenting=false;
	delete com.first.author; // invalidate it
	if(com.rest.firstChild.author){ // if there was a comment, restore state	
		com.rest.style.display="none";
		com.first.remove();
		com.first = com.rest.firstChild.remove();
		com.count--;
		com.insertBefore(com.first,com.rest);
	}
	comRender(com,com.first);
	return false;
}

// save new comment
function comSave(f,id){
	var com = getCom(results[id]);	
	com.commenting=false;
	if(f.comment.value == "") return comCancel(id);
	com.first.comment = f.comment.value;
	comRender(com,com.first);
	ktSave(Q,"com",{"com":f.comment.value,"url":com.r.url});
	return false;
}

// show add new comment form
function rCom(id){
	var com = getCom(results[id]);
//	comShow(Q,com);
	if(com.commenting) return;
	com.commenting=true;
	// why is dom stuff so freaking ugly to program?
	if(com.first.author){ // if there was a comment, push to and show listing
		com.rest.style.display="block";  // show the rest
		com.rest.insertBefore(com.first,com.rest.firstChild); // move to top of comments
		com.first = document.createElement('div');
		//com.first.addClassName("comment");
		$(com.first).addClassName("comment");
		com.count++;
		comRender(com,com.rest.firstChild); // make sure old one is virgin rendering
		com.insertBefore(com.first,com.rest); // new first above rest!
	}
	com.first.author = un;
	com.first.comment = " ";
	comRender(com,com.first,true);
	var form = '<form action="javascript:" onsubmit="return comSave(this,\''+id+'\')" style="display:inline">';
	form += '<input id="comment" name="comment" style="width:50%"/>'+
	    '<input type="submit" id="submit_comment_btn" value="Submit" />'+
	    '<input type="button" id="cancel_comment_btn" value="Cancel" onclick="comCancel('+id+')" />';
	form += '</form>';
	com.first.innerHTML += form;
	window.setTimeout("$('comment').focus()",100); // stupid browsers
}

// simple wrapper to return the html for a comment
function comRender(com,div,skip){
	if(!div.author || !div.comment){
		div.innerHTML = "";
		return;
	}
	var htm = "";
	htm += '<span class="comment-author">'+div.author+'</span>: ';
	htm += '<span class="comment-text">'+div.comment.escapeHTML()+'</span>';
	div.innerHTML = htm;
	if(skip || div != com.first) return;
	// do some extra rendering for the first one
	htm = "";
	var count = (com.count > 0) ? com.count+" " : "";
	htm += ' (<a href="javascript:" onclick="rCom('+com.r.id+')">'+count+'Comments</a>)';
	div.innerHTML += htm;
}

// return the comment div for a result, or create it
function getCom(r){
	if(r.com) return r.com;
	var com = document.createElement('div');
	com.r = r;
	com.count=0;
	com.commenting=false;
	//com.addClassName("annotated-comments");
	$(com).addClassName("annotated-comments");
	com.first = document.createElement('div');
	//com.first.addClassName("comment");
	$(com.first).addClassName("comment");
	com.appendChild(com.first);
	com.rest = document.createElement('div');
	//com.rest.addClassName("comment-more");
	$(com.rest).addClassName("comment-more");
	com.rest.style.display="none";
	com.rest.innerHTML = "<span />"; // dummy
	com.appendChild(com.rest);
	comRender(com,com.first);
	r.ann.appendChild(com);
	r.com = com;
	return com;
}

// display list of also-try links
var Alsos = {"https://google.com/search?q= ":2,"https://search.yahoo.com/search?p= ":1};
Alsos.booted=false;
function alsoRender(){
	if(!Q.also) Q.also = Alsos;
	if(!Alsos.booted){
		callOut("alsoBoot(j)",KT+"tuple.js?t=also&f=alsoBoot(");
		callOut("alsoBoot(j)",KT+"user.js?t=also&f=alsoBoot(&u="+un);
		Alsos.booted=true;
	}
	var tl = $("try-list");
	tl.innerHTML = "";
	for(var a in Q.also){
		var name = a.match(/([\w|\-|\.]+)\.[a-z]{2,5}\//i);
		if(!name || name.length < 2) continue;
		var host = a.match(/:\/\/([^\/]+\.[a-z]+\/)/i);
		var sp = a.split(" ");
		var link = document.createElement('a');
		link.href = sp[0]+Q.q+(sp[1]?sp[1]:"");
		link.style.marginRight="5px";
		
		link.innerHTML += name[1].replace("www.","").toLowerCase();
		tl.appendChild(link);
		tl.innerHTML += " ";
	}
}

// get a bunch of defaults on load
function alsoBoot(j){
	if(j && j.also) j = j.also; // user.js has different syntax
	if(!j || !j.length) return;
	for(var i=0; i<j.length; i++){
		if(!j[i].also || (j[i].l && j[i].l != lang)) continue;
		for(var k=0; k<j[i].also.length; k++) Alsos[j[i].also[k]]++;
	}
	for(var a in Alsos){ Q.also[a]++; }
	alsoRender();
}

// show screen to edit list of also-try links
function alsoEdit(){
	// temporary testing hacks until real dialog is done
	var s = prompt("(This prompt to be replaced soon) Enter a URL to any search engine result page, with a space character where the keyword goes: ");
	if(!s || s == "") return;
	Q.also[s]++;
	ktSave(Q,"also",{"also":Q.also});
	alsoRender();
}

// show wikipedia result if any
// {"query-continue":{"search":{"sroffset":10}},"query":{"search":[{"ns":0,"title":"Java (band)"},{"ns":0,"title":"Java (disambiguation)"},{"ns":0,"title":"Java Barn"},{"ns":0,"title":"List of Indonesian musicians"},{"ns":0,"title":"Kaffe"},{"ns":0,"title":"Interactive television standards"},{"ns":0,"title":"Sun Microsystems"},{"ns":0,"title":"List of Indonesia-related topics"},{"ns":0,"title":"Basuki Rahmat"},{"ns":0,"title":"Dovetail Joint (band)"}]}}

function wpRender(j){
	if(!j || !j.query || !j.query.search) return;
	var sr = j.query.search;
	if(sr.length == 0) return;
	var art = sr[0].title.replace(/ /g,"_");
	
	var r = resultAdd(Q,"https://"+lang+".wikipedia.org/wiki/"+encodeURIComponent(art).replace(/%2F/g,"\/") ,sr[0].title + " - Wikipedia, the free encyclopedia","",true);
	var ndx = jQuery('<a>');
	ndx.attr( 'href', "https://"+lang+".wikipedia.org/" );
	ndx.html("Wikipedia");
	ndx.addClass("ndx");
	resultNdx(r, ndx);
	for(var i = 1; i < sr.length && i < 6; i++){
		annAdd(r,"link",{"title":sr[i].title,"a":"https://"+lang+".wikipedia.org/wiki/"+encodeURIComponent(sr[i].title.replace(/ /g,"_")).replace(/%2F/g,"\/")});
	}
	annRender(r);

	var fbq = [{"/common/topic/article":[{"id":null}],"/common/topic/image":[{"id":null,"optional":true}],"a:key":encodeURIComponent(art).replace(/\%/,"$00").replace(/\'/g,"$0027")}];
	callOutArg("wpfb","https://www.googleapis.com/freebase/v1/mqlread?callback=wpfb&query="+encodeURIComponent(Object.toJSON(fbq))+"&key=AIzaSyBHBAJc1ZnlWklWfoV1blt5LFSvNMHWQh8", r);

	reviewKT(Q); // in case edits on this result
}

function wpfb(r,j){

	if(!j || !j.wp || !j.wp.result || !j.wp.result[0]) return;
	var res = j.wp.result[0];
	if(res["/common/topic/image"] && res["/common/topic/image"].length > 0){
		annAdd(r,"image",{img:"https://www.freebase.com/api/trans/image_thumb"+res["/common/topic/image"][0].id});
		annRender(r);
	}
	if( lang != "en") return;
	
	if(res["/common/topic/article"] && res["/common/topic/article"].length > 0){
		callOutArg("wpsum","https://www.freebase.com/api/trans/blurb"+res["/common/topic/article"][0].id+"?maxlength=600&callback=wpsum",r);
	}
}

function wpsum(r,j){
	if (!j.result) return;
	if(r.summary.length == 0) r.summary = j.result.body.replace(/\. /g," ... ");

	resultRender(r);
}

// show freebase results if any
var fbQ = new Array();
var fbQid = 0;
//[{"guid":"#9202a8c04000641f8000000000166606","name":null,"type":"/common/topic","webpage":[{"uri":null}]}]
function fbQdo(id,j){

	// fb blurbs are sentences hack to chunk em
	if (!j.result) return;
	var sum = j.result.body.replace(/\. /g," ... ");
	var url = "https://www.freebase.com/view"+fbQ[id].id;
	var r=resultAdd(Q,url,"Freebase: "+fbQ[id].title,sum,true);
	var ndx = $(document.createElement('a'));
	ndx.href = "https://www.freebase.com/";
	ndx.innerHTML = "Freebase";
	ndx.addClassName("ndx");
	resultNdx(r,ndx);
	for(var i=0;i<fbQ[id].links.length;i++){ annAdd(r,"link",fbQ[id].links[i]); }
	if(fbQ[id].img.length > 0) annAdd(r,"image",{img:"https://www.freebase.com/api/trans/raw"+fbQ[id].img});
	annRender(r);

}

function fbBack(j){
	if(!j) return;
	var did=0;
	for(var a in j){
		if(!j[a].result || j[a].result.length == 0 || !j[a].result[0].webpage) continue;
		var res = j[a].result[0];
		var ha = res.webpage[0].uri.match(/:\/\/([^\/]+)/);
		if(ha.length <= 1 || Q.urls[ha[1]]) continue; // don't add if host already exists!
		did++;
		var r=resultAdd(Q,res.webpage[0].uri,res.name,"",true);
		if(res["/common/topic/article"] && res["/common/topic/article"].length > 0) callOutArg("wpsum","https://www.freebase.com/api/trans/blurb"+res["/common/topic/article"][0].id+"?maxlength=600&callback=wpsum",r);		
	}
	if(did > 0) reviewKT(Q);
}

function fbRender(j){
	if(!j || !j.result || j.result.length == 0) return;
	var sr = j.result;
	var qs = new Object()
	for(var i=0; i < sr.length; i++){
		var f = sr[i];
		qs["a"+i] = {"query":[{"/common/topic/article":[{"id":null,"optional":true}],"guid":f.guid,"name":null,"type":"/common/topic","webpage":[{"uri":null}]}]};
	}
	callOut("fbBack(j)","https://www.googleapis.com/freebase/v1/mqlread?callback=fbBack&queries="+encodeURIComponent(Object.toJSON(qs)));
}

function maRender(j){
	Q.ma = j;
	var sr = (j.title ? j.title: "");
	if(sr.length == 0) {
		jQuery("#mini-article-container").html("");
		jQuery("#mini-article-container").hide();
		return;
	}
	var html = (j.html ? j.html: "");;
	jQuery("#mini-article-container").show();
	jQuery("#mini-article-container").html( "<b>"+getspan("Mini Article")+":</b> " + html + " <span class=\"mini-expand\"><a id=\"ma_expand\" href=\"javascript:expand_ma();\">("+getspan("expand")+")</a></span>" );
}

function spellSuggest(j) {

    try{

	if (j && j.bossresponse && j.bossresponse.spelling && j.bossresponse.spelling.results && j.bossresponse.spelling.results[0].suggestion) {
		var sp_sug = j.bossresponse.spelling.results[0].suggestion;
		var sug_text = getspan("Did you mean")+
		    ": <a class='related_result' href='#" + escape(sp_sug) + "'>"+sp_sug+"</a>?";
		if (jQuery("#suggest-container")) {
			jQuery("#suggest-container").html(sug_text)
			jQuery("#suggest-container").show();
		}
		if(WISE) {
			for (var id in WISE.apps) {
				var temp_apps = {};
				var temp_count = 0;
				if(WISE.apps[id].useSpellSuggest) {
					temp_apps[id] = WISE.apps[id];
					temp_count++;
				}
				if(temp_count) WISE.scan(sp_sug, temp_apps);
			}
		}
		
	}
	else {
		jQuery("#suggest-container").html("");
		jQuery("#suggest-container").hide();
	}
    
    } catch(ex){ alert(ex.message) }
	
}

var chunked_ann = new Array();

function saveAnn(id) {
	var sorted_output = chunked_ann.sort(sortParts);
	//var sorted_output = output;

	var f_link = false;
	
	var new_ann="";
	for (var i=0; i<sorted_output.length; i++) {
		new_ann += sorted_output[i].content;
		
		if (sorted_output[i].url && typeof sorted_output[i].url != "undefined" ) {
			f_link = sorted_output[i].url;
		}
		
	}
	eval("var json_ann =" + new_ann);
	ktSave(Q,"selection",json_ann);
	var type = "";
	if(json_ann.img) type="image";
	if(json_ann.a) type="link";
	if(json_ann.form) type="form";
	if(json_ann.sel) type="text";
	annAdd(results[id],type,json_ann);
	annRender(results[id]);
	chunked_ann = new Array();
	
	
	if(f_link) {
		var s_domain=window.location.href.split('/'); 
		s_domain.length=3;
		s_d_string = s_domain.join('/');
		var proxypage = ((window.location.href && window.location.href.indexOf("wikia-inc.com")>-1) ? '/search' : '') + '/getAnn.html';
		$("preview").src = 'https://preview-origin.index.swlabs.org/do/preview?query='+encodeURIComponent(Q.q)+'&url='+encodeURIComponent(f_link)+'&domain='+encodeURIComponent(s_d_string+proxypage)+"&xwsresultid="+id+"&ourl=" + encodeURIComponent(results[id].url);
	}
	
}

function sortParts(a,b){return (parseInt(a.num) - parseInt(b.num));}

function close_dialog() {
	if (jQuery("#dialog-window")) jQuery("#dialog-window").hide();
	if (jQuery("#dialog-lightbox")) jQuery("#dialog-lightbox").hide();
	document.body.style.overflow = "auto";
	return false
	
}

function show_dialog( contents ) {
	
	if (jQuery("#dialog-lightbox")) {
		jQuery("#dialog-lightbox").css( 'display', "block" );
	}
	else {
				
		var lightbox = document.createElement("div");
		lightbox.setAttribute("id", "dialog-lightbox");
		lightbox.style.position = "absolute";
		lightbox.style.top = "0px";
		lightbox.style.left = "0px";
		lightbox.style.width = "100%";
		lightbox.style.height = "100%";
		lightbox.style.zIndex = 50;
		lightbox.style.zIndex = 50;
		lightbox.style.backgroundColor = "#888888";
		lightbox.style.opacity="0.50";
		lightbox.style.filter="alpha(opacity=50)";
		document.body.appendChild(lightbox);
		
		
	}
	
	//set height of lightbox for IE
	var browser=navigator.appName;
	var b_version=navigator.appVersion;
	var version=parseFloat(b_version);
	
	if ((browser=="Microsoft Internet Explorer") && (version<7)) {
		var window_height = document.documentElement.clientHeight;
		$('dialog-lightbox').style.height=window_height;
	}
	
	if (document.getElementById("dialog-window")) {
		
		$("dialog-window").innerHTML = contents
		$("dialog-window").style.display="block";
	}
	else {
				
		var window_width = 0;
		var dialog_margin = 0;
		var tryOther = document.createElement("div");
		tryOther.setAttribute("id", "dialog-window");
		tryOther.innerHTML = contents;
		
		if ( typeof( window.innerWidth ) == 'number' ) {
		    //Non-IE
		    window_width = window.innerWidth;
		} else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
		    //IE 6+ in 'standards compliant mode'
		    window_width = document.documentElement.clientWidth;
		} else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
		    //IE 4 compatible
		    window_width = document.body.clientWidth;
		}
		dialog_margin = (window_width - 600) / 2;
		tryOther.style.left = dialog_margin + "px";
		tryOther.style.position = "absolute";
		tryOther.style.top = "50px";
		tryOther.style.width = "600px";
		tryOther.style.textAlign = "left";
		tryOther.style.zIndex = 100;
		document.body.appendChild(tryOther);
		
	}
	
	document.body.style.overflow="hidden";
	scroll(0,0);
	
}

var show_ads = true;
//var show_ads = false;

function showAds(query){
	if( show_ads ){
		$("ads_show").show();
		$("wide_ad_unit").show();
		try{ //adblock on FF will die on this if enabled
			$("ads").src = "ads.html?q=" + encodeURIComponent(query) + "&lang=" + lang
		}catch(e){}
		
	}else{
		$("ads_show").hide();
		$("wide_ad_unit").hide();
	}
	
}

// make a new suggested search
function cloudNew(){
	var qtop = $("cloud-title").active.q; // always associte with the "top" active one
    var s = prompt("Type in another search term that would be a good suggestion related to '"+qtop+"'",qtop);
    if(!s || s == "") return;
	var c = cloudAdd(qtop,s);
	if(!c) return; // might be dup or something
	c.onclick();
    ktSave(queries[qtop],"sug",{"sug":s});
}

// clear out the cloud and fire off calls to build a new one
function cloudRender(query){
	var c = $("cloud-title");
	c.innerHTML = "<a href='javascript:cloudNew()' style='font-size:10px;float:right'>"+
	    getspan("Add Suggestion")+"</a>";
	c.ndx = new Object();
	c.active = false;
	c.master = query;
	$("cloud").innerHTML = "";
	cloudAdd(query,query);
	cloudQuery(query);
}

// show cloud for this query
var cqcache = new Object();
var cqshh = new Object();
function cloudQuery(query){
	if(!cqcache[query]) cqcache[query] = new Array();
	for(var i=0;i<cqcache[query].length;i++) cloudAppend(query,cqcache[query][i]); // always flush any existing
	if(!cqcache[query].did){
		cqcache[query].did = true;

		callOutArg("cloudDo","https://www.google.com/complete/search?hl="+lang+"&output=toolbar&json=t&jsonp=cloudDo&nolabels=t&q="+encodeURIComponent(query), query);

		callOutArg("cloudDo","https://"+lang+".wikipedia.org/w/api.php?action=opensearch&search="+encodeURIComponent(query)+"&format=json&callback=cloudDo",query);

	}
}

// got an array from some suggestion service, parse it
function cloudDo(query,j){
	
        if(!j || !j.length > 1 || !j[1].length) {
		// if returning with no results, still need to tell wise to run it or else it wont
		wise_cloudhandler(query);
		return;
	}
	
        cloudAdd(query, query); // sanity check
	
        for(var i=0;i<j[1].length;i++) cloudAdd(query,j[1][i]);	

  	// if there are results, however, wait until they are loaded in
	wise_cloudhandler(query);
}

function wise_cloudhandler(query) {

	if(WISE && WISE.checkOnCloud && WISE.checkOnCloud.count) {
		WISE.checkOnCloud.cloudcount++;
		if(WISE.checkOnCloud.cloudcount>1) WISE.scan(query, WISE.checkOnCloud.apps);
	}
}

// see if they want to hide this
function cloudHide(e){
	if(!confirm("Are you sure you want to HIDE the search term: "+e.q)) return false;
	cloudShh(e.query,e.q);
	var qtop = $("cloud-title").active.q; // always associte with the "top" active one
	ktSave(queries[qtop],"sug",{"sug":e.q,"hide":1});
	return true;
}

function cloudClick(e){
	var c = $("cloud-title");
	if(!c.ndx[e.q]) return false; // sanity
	if(shiftychar && cloudHide(e)) return false; // magic hider
	if(c.active.active) c.active.active.removeClassName("active");

	c.active.sub.hide();
	c.active.removeClassName("active");
	c.active = c.ndx[e.q];
	c.active.sub.show();
	c.active.addClassName("active");

	show_ads = false; //so we don't violate adsense TOS
	searchDo(e.q);
	cloudQuery(e.q);
	return false;
}

function cloudClickSub(e){
	if(shiftychar && cloudHide(e)) return false; // magic hider
	if(e.ac.active) e.ac.active.removeClassName("active");
	e.ac.active = e;
	e.addClassName("active");
	show_ads = false; //so we don't violate adsense TOS
	searchDo(e.q);
	return false;
}

// silence a suggestion
function cloudShh(query,k){
	var key =query+"\t"+k;
	if(cqshh[key] && cqshh[key].shh) return; // already silenced
	if(cqshh[key]){ // already exists, silence it
		cqshh[key].shh = true;
		cqshh[key].hide();
	}
	cqshh[key] = new Object();
	cqshh[key].shh = true;
	cloudShh(k,k); // silence just the suggestion too because this spidercode is retarted!!
}

// add an individual keyword for this query
function cloudAdd(query,k){
	if(!cqcache[query]) cqcache[query] = new Array();
	cqcache[query].push(k); // keep our own cache
	cloudAppend(query,k);
}

// actually draw it
function cloudAppend(query,k){
	var key = query+"\t"+k; // for overall hide tracking
	if(cqshh[key]) return false; // hidden!
	var kq = query.strip().toLowerCase();
	var ks = k.toLowerCase();
	var c = $("cloud-title");
	var ac = c.ndx[query];
	if(!ac){ // make sure we always have a title for this query
		if(c.active && query == c.master) return; // sometimes happens
		var s = $(document.createElement("span"));
		//s.style.whiteSpace="nowrap";
		s.innerHTML = "<a onclick='return cloudClick(this)'></a> "; // #@#$!%%#%%^!!@!
		c.appendChild(s);
		ac = c.ndx[query] = s.down();
		cqshh[key] = ac; // in case it needs to be hidden later
		ac.q = ac.query = query;
		ac.innerHTML = query;
		ac.href="#"+query;
		ac.style.whiteSpace="nowrap";
		if(query == c.master){ // if this is da main one
			$(ac).addClassName("active");
			c.active = ac;
		}
		ac.subs = new Object();
		ac.sub = document.createElement("div");
		$("cloud").appendChild(ac.sub);
		if(query != c.master) $(ac.sub).hide();
	}
	var sub = true;
	if(ks.match(kq)){ // contains query
		ks = ks.replace(kq,""); // remove it
		// if it contains a suffix and another word (usually 's), snip the suffix, else restore
		if(ks.match(/^\S* /,"")){
			ks = ks.replace(/^\S+ /,"").strip();
		}else{
			ks = kq+ks;
			sub = false;
		}
	}else{
		sub = false;
	}
	ks = ks.strip();
	if(!ks || ks == "" || ks == kq) return ac;
	if(!sub){
		return cloudAdd(ks,ks); // little sleight of hand
	}
	if(ac.subs[ks]){
		return ac.subs[ks];
	}
	var s = $(document.createElement("span"));
	s.innerHTML = "<a onclick='return cloudClickSub(this)'></a> "; // #@#$!%%#%%^!!@!
	ac.sub.appendChild(s);
	var a = ac.subs[ks] = s.down();
	a.query = query;
	cqshh[key] = a; // in case it needs to be hidden later
	a.ac = ac; // handy reverse link
	a.q = k;
	a.href="#"+k;
	a.innerHTML = ks;
	a.style.whiteSpace="nowrap";
	return a;
}

var deleted_collapse_left_off = 0;
function collapseDeleted(){
	var max_in_row = 3;

	var current_group_count = 0
	var current_group_start = 0
	
	//first lets remove any toggle links from any previous searchs
	toggle_links = $$('div.toggleDeleted');
	for( x = 0 ; x<= toggle_links.length-1; x++ ) toggle_links[x].remove();

	//go through each item and see if we can collapse any divs

	url_divs = $$('div.search-result');
	for( x = 0 ; x<= url_divs.length-1; x++ ){
		
		if(url_divs[x].parentNode.style.display == "none" )continue;
		
		if( url_divs[x].hasClassName("deleted") ){
			if( current_group_start == 0 ) current_group_start = x
			current_group_count++
		}else{
			//we have hit one that isn't deleted, lets check to see if we should hide any
			if( current_group_count >= max_in_row ){
	
				for( y = current_group_start; y <= (current_group_start + current_group_count ) - 1; y++ ){
					url_divs[y].hide();
				}
				
				toggle_id = "toggle_hide_" + current_group_start + "_" + current_group_count;
				if( !$( toggle_id ) ){
					el = document.createElement("div");
					el.setAttribute('id', toggle_id); 
					$(el).addClassName("toggleDeleted");
					el.innerHTML = "<a href=\"javascript:toggleDeletedGroup(" + current_group_start + "," + (current_group_start + current_group_count) + ")\"><span id=\"toggleDeletedLabel_" + current_group_start + "_" + (current_group_start + current_group_count) + "\">" + gettext("Show") + "</span> " + current_group_count + " " + gettext("Deleted URLs") + " <!--(found nondeleted at " + x + ")--></a>";
					
					new Insertion.Before( url_divs[current_group_start], el );
				}
				
			}
			current_group_start = 0;
			current_group_count = 0;
		}
		if( x == url_divs.length-1 ) deleted_collapse_left_off = x;
		 
	}
}

function toggleDeletedGroup( start, end ){
	url_divs = $$('div.search-result');
	for( x = start ; x<= end - 1 ; x++ ){
		url_divs[x].toggle();
	}
	
	if( $("toggleDeletedLabel_" + start + "_" + end).innerHTML.indexOf( gettext("Show" ).stripTags() ) > -1 ){
		$("toggleDeletedLabel_" + start + "_" + end).innerHTML = gettext("Hide")
	}else{
		$("toggleDeletedLabel_" + start + "_" + end).innerHTML = gettext("Show")
	}
}
