// all history management/display stuffs

// current filters
var histf = new Object();
histf.user = false;
histf.act = false;
histf.link = false;

// simple injector
histatmax = 0;
// FIXME: Does it help when histAdd knows whether this is a deletion (the json.del value)?
function histAdd(q/*,fmt*/,user,act,at,link,tytle,summary,com){
	q.histy=true;
	var h = new Object();
	h.user = user;
	h.act = act;
	
	if( at ){
		h.at = (at)?at:++histatmax-nowoffset; // for sorting, no at == new == highest
	}else{
		var ko = new Date();
		h.at = ko.getTime() + nowoffset;
	}
	
	if(link) h.link = link;
	if(tytle) h.tytle = tytle;
	if(summary) h.summary = summary;
	if(com) h.com = com;
	
	if(!q.hist) q.hist = new Array();
	q.hist.push(h); 
}

// update filter select, schnazzy
function histOpt(sel,txt,label){

	//jeff changed
	label= gettexta(label, {id:sel.name, param:'options[0].text'});
	
	if(sel.options.length == 0){ 
		sel.options[0] = new Option(label,"0");
		sel.total = 0;
		// jeff added
		sel.setAttribute("id", sel.name);
	}
	var found=false;

	//jeff added
	try {var txt = txt.replace(/\<[^\>]+\>/g, "");}catch(ex){}
	
	var stxt = txt;
	if(txt.substr(0,7) == "http://") stxt = txt.substr(7);
	stxt = stxt.substr(0,12);
	if(txt.length > stxt.length) stxt += "...";
	for(var i=0; i < sel.options.length; i++){
		var o = sel.options[i];
		if(o.value != txt) continue;
		found=true;
		o.count++;
		sel.total++;
		o.text = o.count + " " + stxt;
		
		//jeff added
		gettexta(txt, {id:sel.name, param:'options[' + i + '].text', pre:o.count+" "});
	}
	if(!found){
		var o = sel.options[sel.options.length] = new Option(stxt,txt);
		o.count=1;
		sel.total++;
		o.text = o.count + " " + stxt;
	}
	sel.options[0].text = label+" ("+(sel.total)+")";
}

// render whatever history is known, with filters if any
function histRender(){
	if(!Q.hist || Q.hist.length == 0){
		if($('page-history')) $('page-history').style.display="none";
		if($('histories')) $('histories').style.display="none";
		if($('history-filter')) $('history-filter').style.display="none";
		return;
	}
	if(!Q.histy) return;
	Q.histy = false;
	histReRender(false);
}

function histReRender(force){
	$('page-history').style.display="block";
	$('histories').style.display="block";
	var hdiv = $('histories');
	var hfilt = $('history-filter');
	var hrss = $('history-rss');
	
	hrss.innerHTML = "<a href=\"http://search.wikia.com/rss/keyword/"+ encodeURIComponent( Q.q.toLowerCase() ) + "\"><img src=\"images/feed.png\" width=\"12\" border=\"0\"/></a>";

	if(!histf.user) hfilt.byuser.options.length = 0;
	if(!histf.act) hfilt.byact.options.length = 0;
	if(!histf.link) hfilt.bylink.options.length = 0;
	
// apply filters to our copy
	var hord = new Array();
	for(var i=0; i < Q.hist.length; i++){
		var h = Q.hist[i];
		if(histf.user && h.user != histf.user) continue;
		if(histf.act && h.act != histf.act) continue;
		if(histf.link && h.link != histf.link) continue;
		if(!histf.user) histOpt(hfilt.byuser,(h.user ? h.user : gettext("You")),"User");
		if(!histf.act) histOpt(hfilt.byact,h.act,"Type");
		if(!histf.link && h.link) histOpt(hfilt.bylink,h.link,"Site");
		hord.push(h);
	}
	//alert( davetest )
	try{hord = hord.sort(function (a,b){return b.at - a.at;});} catch(ex){}
	
	var histHTML= "";
	for(var i = 0; i < hord.length; i++){

		if(i == 3){
			if(force){
				var htm = '<div id="history-more">';
				htm += '<a href="javascript:" onclick="javascript:histReRender(false);$(\'history-filter\').style.display=\'none\';">'+getspan('Less')+'</a>';
				htm += '</div>';
				histHTML += htm;
			}else{
				var htm = '<div id="history-more">';
				htm += '<a href="keyword_history.html?k=' + encodeURIComponent( Q.q.toLowerCase() ) + '">'+getspan('More')+' ('+(hord.length-i)+')</a>';
				htm += '</div>';
				histHTML += htm;
				break; // awwwh yeah
			}
		}
		histHTML+= histItem2html(hord[i]);
	}
	hdiv.innerHTML= histHTML;
	//alert( davetest2 )
}

// just render an item
function histItem2html(h)
{
	//get directory and image name based on Username
	hash = hex_md5( h.user )
	dir = hash.substr(0,3);
	photo_url = profile_pictures_path + "/static/" + dir + "/" + (h.user ? h.user : gettext("You")).replace(" ","") + "-s.jpg";
	
	//fallback if can't find username.jpg or if username = IP address
	default_url = profile_pictures_path + "/default_s.png";
	if( is_IP( h.user ) ){
		photo_url = default_url;
	}
	
	var ko = new Date();
	var htm = "";
	htm += '<div class="history-item clearfix">';
		htm += "<div class=\"history-image\">";
			htm += "<img src=\"" + photo_url + "\" onerror=this.src='" + default_url + "' onload=this.style.visibility='visible' style=\"visibility:hidden;\" salt=\""+h.user+"\" border=\"0\"/> ";
		htm += "</div>";
		htm += "<div class=\"history-text\">";
			if(h.user) htm += (( !is_IP(h.user) )?"<a href=\"profile.html?user=" + h.user + "\">":"<a href=\"activity.html?user=" + h.user + "\">") +h.user + "</a> ";
			else htm += gettext("You") + " "; 
			
			htm += '<span class="history-action">'+h.act+'</span>';
			if(h.link) htm += '	<span class="history-link">'+h.link.substring(7,37).escapeHTML()+'</span>';
			var ago = whenAgo((ko.getTime() - nowoffset),h.at);
			htm += '	<span class="history-time">'+ago+'</span>';
			htm += '<div class="history-details">';
				if(h.tytle) {
					htm += '<div class="history-title">';
						htm += '<b> Title </b>' + h.tytle;
					htm += "</div>";
				}
				if(h.summary) {
					htm += '<div class="history-summary">';
						htm += '<b> Summary </b>' + h.summary;
					htm += "</div>";
				}
				if(h.com) {
					htm += '<div class="history-com">';
						htm += '<b> Comment </b>' + h.com;
					htm += "</div>";
				}
			htm += "</div>";
		htm += "</div>";
	htm += '</div>';
	htm+= "</br>";
	return htm;
}

function histBy(type,sel){
	var val = sel.options[sel.selectedIndex].value;
	if(val == "0"){ // cancel all filters
		histf.user = histf.act = histf.link = false;
	}else{
		histf[type] = val;		
	}
	histReRender();
}
