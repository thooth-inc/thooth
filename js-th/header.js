function showActions(menu, type) {
	
	if (type=="show") {
		jQuery("#action-menu-"+menu).css( 'display', "block" );
	} else if (type=="hide") {
		jQuery("#action-menu-"+menu).hide();
	} else if (type=="minishow") {
		jQuery("#mini-article-actions").css( 'display', "inline" );
	} else if (type=="minihide") {
		jQuery("#mini-article-actions").hide();
	}
	
}

function moreHistory(type) {
	new Effect.toggle('history-more', 'blind', {duration:.33, fps:32});
	
	if (type=="less") {
		jQuery("#history-more-link").html( '<a href="javascript:moreHistory(\'more\')">'+getspan("More")+'</a>' );
	} else {
		var ob='<option>';
		var oe='</option>';
		jQuery("#history-more-link").html(
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
		+'</select>' );
	}
	
}

function showComments(result) {
	new Effect.toggle('comment-more-'+result, 'blind', {duration:.33, fps:32});
}

function showRevision(revision, type) {
	new Effect.toggle('revision-text-'+revision, 'blind', {duration:.33, fps:32});
	
	if (type=='show') {
		jQuery("#revision-show-"+revision).html( '<a href="javascript:showRevision('+revision+', \'hide\')">('+getspan("hide")+')</a>' );
	} else {
		jQuery("#revision-show-"+revision).html( '<a href="javascript:showRevision('+revision+', \'show\')">('+getspan("show")+')</a>' );
	}
}

var show_dropdown_timer = 0;
var show_dropdown_last = false;
function showDropDown(el, type, parent) {
	
	if (type=="show") {
		if(show_dropdown_last) {
			show_dropdown_last.hide();
			show_dropdown_last = false;
		}
		
		show_dropdown_last = $(el);
		$(el).show();
	} else {
		$(el).hide();
		show_dropdown_last = false;
	}
	
	
}

function findPos(obj) {
	var curleft = curtop = 0;
	if (obj.offsetParent) {
		curleft = obj.offsetLeft
		curtop = obj.offsetTop
		while (obj = obj.offsetParent) {
			curleft += obj.offsetLeft
			curtop += obj.offsetTop
		}
	}
	return [curleft,curtop];
}

function hideProfileDropDown(el) {
	showDropDown(el, 'hide');
}

function check_new_notifications() {
	var url = "index.php?action=ajax";
	var pars = 'rs=wfCheckNewNotificationsJSON';
	var sUrl = server_to_use + "/" + url + "&" + pars;
	var i = document.getElementById("checkNotifs"); 
	var head = document.getElementsByTagName('head')[0];
	if (i) head.removeChild(i);
	i = document.createElement('script');
	i.setAttribute("id","checkNotifs");
	i.src = sUrl;
	head.appendChild(i);	
}

function check_notifications() {
	var url = "index.php?action=ajax";
	var pars = 'rs=wfgetNotificationsJSON&rsargs[]=display_notifications&rsargs[]=' + ((ip)?ip:getCookie("searchUserName")) + "&r=" + Math.random();
	var sUrl = server_to_use + "/" + url + "&" + pars;
	var i = document.getElementById("checkNotifs"); 
	var head = document.getElementsByTagName('head')[0];
	if (i) head.removeChild(i);
	i = document.createElement('script');
	i.setAttribute("id","checkNotifs");
	i.src = sUrl;
	head.appendChild(i);
}

var has_new_messages = false;
function display_notifications(notifications) {
	if (notifications && notifications.notification_count) {
		var x=1;
		var output_str = "<a href=\""+search_server_to_use+"notifications.html\">" + ((notifications.notification_count > 1) ? " " : "");
		var output_str_long = "";
		var title_str = "";
		for (var key in notifications.types) {
			if (eval("notifications."+key) && eval("notifications."+key+".length")) {
				
				var the_array = eval("notifications."+key);
				if(key == "pokes") {
					for (var i=0; i<the_array.length; i++) {
						var the_poke = the_array[i];
						if (!i) title_str += getspan("Poke", {update:false})+": ";
						else title_str += ", ";
						title_str += the_poke.from;
						output_str_long +=
							"<div class='indiv-notification'>"
							+"<a href=\""+search_server_to_use+"notifications.html\">"
							+"<img src=\""+the_poke.avatar_img_s+"\" border=\"0\"/>"
							+ the_poke.user_name_display + " "+getspan("nudged you")
							+"</a></div>";
					}
					title_str += " ";
				}
				else if(key=="relrequests") {
					for (var i=0; i<the_array.length; i++) {
						if (!i) title_str += getspan("Friend Requests", {update:false})+": ";
						else title_str += ", ";
						title_str += the_array[i].user_name_from;
						output_str_long += "<div class='indiv-notification'><a href=\""+search_server_to_use+"notifications.html\"><img src=\""+the_array[i].avatar_img_s+"\" border=\"0\"/>" + the_array[i].user_name_display + " "+getspan("wants to be friends with you")+"</a></div>";
					}
					title_str += " ";
				}
				else if(key=="messages") {
					has_new_messages = true;
					var posted_array = new Array();
					var real_name_array = new Array();
					var avatar_array = new Array();
					for (var i=0; i<the_array.length; i++) {
						if (posted_array[the_array[i].user_name]) posted_array[the_array[i].user_name]++;
						else {
							posted_array[the_array[i].user_name] = 1;
							real_name_array[the_array[i].user_name] = the_array[i].user_name_display;
							avatar_array[the_array[i].user_name] = the_array[i].avatar_img_s;
						}
					}
					var count = 0;
					
					for (var theName in posted_array) {
						if (typeof posted_array[theName] == 'number') {
							if (!count) title_str += getspan("Wall Posts", {update:false})+": ";
							else title_str += ", ";
							title_str += real_name_array[theName] + (posted_array[theName]>1 ? "(" + posted_array[theName] + ")" : "");
							output_str_long += "<div class='indiv-notification'><a href=\""+search_server_to_use+"notifications.html\"><img src=\""+avatar_array[theName]+"\" border=\"0\"/>"
							+ real_name_array[theName] + " "+getspan("sent you")+" " + (posted_array[theName]>1 ? posted_array[theName] + " "+getspan("messages") : getspan("a message"))  + "</a></div>";
						}
					}
					title_str += " ";
				}
				
				if (x>1) {
					output_str += ", ";
				}
				output_str += eval("notifications."+key+".length") + " " + getspan(eval("notifications.types."+key)) + ((eval("notifications."+key+".length")>1) ? "s" : "");
				
				x++;
			}
		}
		
		output_str += "</a>";
		
		output_str = "<div id='ws_notifications_small' title='" + title_str + "' style='display:none;' class=\"notifications-small\">" + output_str + "<a href='javascript:void(0)' class='notifications-close' onclick='swap_notif(0);return false;' onmouseover='window.status=\"\";'> + </a></div>";
		output_str_long = "<div id='ws_notifications_big' style=\"height: 100%;\"><div class=\"notifications-title\">"+getspan("Notifications") + ((notifications.notification_count > 1) ? "<a href='javascript:void(0)' class='notifications-close' onclick='swap_notif(1);'> &ndash; </a>" : "") + "</div>" + output_str_long + "</div>";
		document.getElementById("search-notifications").innerHTML = output_str_long + output_str;
		
		//set height of lightbox for IE
		try {
			
			var browser=navigator.appName;
			var b_version=navigator.appVersion;
			//var version=parseFloat(b_version);
			if ((browser=="Microsoft Internet Explorer")) {
				b_version_short = b_version.substring(b_version.indexOf("MSIE ")+4);
				b_version_short = b_version_short.substring(0,b_version_short.indexOf(";"));
				var version=parseFloat(b_version_short);
				if (version<7) {
					if ($("search-notifications").style.setExpression ) { // IE
						var temp_text = jQuery("#search-notifications").html();
						jQuery("#search-notifications").html( "<table id='notif-temp'><tr><td>" + temp_text + "</td></tr></table>" );
						var temp_width = $("notif-temp").offsetWidth;
						jQuery("#search-notifications").html( temp_text );
						jQuery("#search-notifications").css( 'width', temp_width + 'px' );
						jQuery("#search-notifications").css( 'position', 'absolute' );
						$("search-notifications").style.setExpression("top", "(document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + (document.documentElement.clientHeight ? document.documentElement.clientHeight : document.body.clientHeight) - this.offsetHeight  + 'px'");
						document.body.style.backgroundImage = "url('" + search_server_to_use + "js/s.gif')";
						document.body.style.backgroundAttachment = 'fixed';
						
					}
						
				}
			}
			
		}
		catch(ex) {}
		
		if(notifications.notification_count > 1) setTimeout('setAndSwap(1)', 5000);
		
	}
}

function setAndSwap(collapse) {
	if (jQuery("#ws_notifications_big")) jQuery("#ws_notifications_big").css( 'height', $('ws_notifications_big').offsetHeight + "px" );
	swap_notif(collapse);
}

function swap_notif(collapse) {
	if (collapse ) {
		if (jQuery("#ws_notifications_big").css( 'display' ) != 'none') {
			new Effect.BlindUp('ws_notifications_big', {duration:0.5});
			setTimeout("new Effect.BlindDown('ws_notifications_small', {duration:0.5, fps:32});", 400);
		}
	}
	else {
		new Effect.BlindUp('ws_notifications_small', {duration:0.5});
		setTimeout("new Effect.BlindDown('ws_notifications_big', {duration:0.5, fps:32});", 400);
	}
}

function search_from_bar( ){

    show_ads = true;

    if(window.location.hash == '' && document.forms[0].q.value == '') {
        window.location.hash = '#payless';
        document.forms[0].q.value = 'site:payless.com';
//        window.location=search_server_to_use+window.location.hash;
//        window.location=search_server_to_use+'#'+document.forms[0].q.value;
        return;
    }
    if (window.location.hash != '' && document.forms[0].q.value == '') {
        window.location=search_server_to_use+window.location.hash;
        return;
    }
    else {
        window.location=search_server_to_use+'#'+document.forms[0].q.value;
    }
}

/** @return the URL, with prepended prefix if the given URL is relative. */
function absolutize_url(prefix, url) {
	return /^[^:]+:\/\//.test(url) ? url : prefix + url;
}

/** @return HTML for one leaf menu entry.
    @param e - An array like this: [label, url]. */
function html_menu_entry(e) {
	if( !e )return;
	var label  = e[0];
	var url    = absolutize_url(search_server_to_use, e[1]);
	return '<a href="'+url+'">'+getspan(label)+'</a>';
}

/** @return HTML for one main menu entry, possibly including a "drop
    down menu" (which may actually rise up).

    @param e - An array like this: [label, url, id, submenu] id and
    submenu are optional.  submenu must be an array of menu entries,
    suitable as html_menu_entry() arguments.
*/
function html_menu(e, display)
{
	var label  = e[0];
	var url    = absolutize_url(search_server_to_use, e[1]);
	var id_base= e[2];
	var entries= e[3];
	var id= id_base+"-more";
	var mouseout= 'onmouseout="show_dropdown_timer = '+
		'setTimeout(function(){hideProfileDropDown(\''+id+'\')}, 500);"';
	var behavior= "";
	var menu= "";
	if (undefined !== entries) {
		behavior= ' onmouseover="clearTimeout(show_dropdown_timer);'+
			'  showDropDown(\''+id+'\', \'show\', this);"'+
			mouseout;
		menu= '<div id="'+id+'" class="profile-more" style="display:none;"'+
			' onmouseover="clearTimeout(show_dropdown_timer);" '+
			mouseout+'>';
		for (var i= 0; i<entries.length; ++i) {
			menu+= html_menu_entry(entries[i]);
		}
		menu+= '</div>';
	}
	var display2= undefined === display ? "inline" :
	    display ? "inline" : "none";
	var button= '<span id="'+id_base+'-button" style="display:'+display2+';">'+
	    '<a href="'+url+'"'+behavior+'>'+ getspan(label) +'</a>'+
	    '</span>';
	var result= '<div class="global-link">'+ button+ menu+ '</div>';
	return result;
}

/** Holds specs for menus. Keeping them in a map allows us to use only
    a subset, use a different order, or even use some items in multiple
    places. */
var menus=
{
	"applications":
	["Applications", "WISE/playground.html", 'applications',
	 [["Test App", "WISE/test.html"],
	  ["Playground",           "WISE/playground.html"]
	  ] ],

	"legal":
	["Legal",              "#/legal/legal", 'legal',
	 [["Terms of Use",     "#/legal/legal"],
	  ["Privacy Policy",   "#/legal/privacy"],
	  ["Copyright Policy", "#/legal/copyright"]
	  ] ],

	"help":
	["Help",                   'help/help.html', 'help',
	 [["Overview",             'help/overview.html'],
	  ["Report a Bug", "help/bugs.html"],
	  ["Search Result Tools",  "help/help.html"],
	  ["Contact Us",           "help/contact.html"]
	  ] ]
};

/** @return HTML for a menu bar. */
function html_menu_bar()
{
	var result= "";
	result += '<div id="global-links">';
	result += html_menu(menus["applications"]);
	result += html_menu(menus["legal"]);
	result += html_menu(menus["help"]);
	result += '<div id="site-language"></div>';
	result += '</div>';
	return result;
}

var header_string = "";

// macbre: add CSS class when not on main page
var container = jQuery('#container');

if (container.attr('class') != 'main-page') {
	container.addClass('search-page');
}
			
header_string += '<div id="top-bar">';
header_string += '<div id="logo">';
header_string += '<a href="'+search_server_to_use+'"><img src="'+image_server_to_use+'images/front-logo.png" alt="Search Thooth" border="0"></a>';
header_string += '</div>';
header_string += '<form id="search-bar" method="get" action="/" onsubmit="javascript:search_from_bar(); return false;">';
header_string += '<input name="q" class="search-input" id="q" value="" type="text"/> ';        
header_string += '<input name="s" value="0" type="hidden"/>';
header_string += '<input name="n" value="10" type="hidden"/>';
header_string += '<input id="search_btn" value="'+gettexta("Search", {id:'search_btn',param:'value'})+'" type="submit"/>'
header_string += '<span id="count" style="display:inline;"><span id="query-count"></span> <span id="query-count-contribs"></span></span>';
header_string += '</form>';
header_string += '</div>';  

header_string += html_menu_bar();

header_string += '<div id="search-notifications"></div>';

document.write(header_string);

try{if(typeof show_lang_header == "function") {show_lang_header()};}catch(sl_ex){}

var BrowserDetect = {
	init: function () {
		this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
		this.version = this.searchVersion(navigator.userAgent)
			|| this.searchVersion(navigator.appVersion)
			|| "an unknown version";
		this.OS = this.searchString(this.dataOS) || "an unknown OS";
	},
	searchString: function (data) {
		for (var i=0;i<data.length;i++)	{
			var dataString = data[i].string;
			var dataProp = data[i].prop;
			this.versionSearchString = data[i].versionSearch || data[i].identity;
			if (dataString) {
				if (dataString.indexOf(data[i].subString) != -1)
					return data[i].identity;
			}
			else if (dataProp)
				return data[i].identity;
		}
	},
	searchVersion: function (dataString) {
		var index = dataString.indexOf(this.versionSearchString);
		if (index == -1) return;
		return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
	},
	dataBrowser: [
		{
			string: navigator.userAgent,
			subString: "Chrome",
			identity: "Chrome"
		},
		{ 	string: navigator.userAgent,
			subString: "OmniWeb",
			versionSearch: "OmniWeb/",
			identity: "OmniWeb"
		},
		{
			string: navigator.vendor,
			subString: "Apple",
			identity: "Safari"
		},
		{
			prop: window.opera,
			identity: "Opera"
		},
		{
			string: navigator.vendor,
			subString: "iCab",
			identity: "iCab"
		},
		{
			string: navigator.vendor,
			subString: "KDE",
			identity: "Konqueror"
		},
		{
			string: navigator.userAgent,
			subString: "Firefox",
			identity: "Firefox"
		},
		{
			string: navigator.vendor,
			subString: "Camino",
			identity: "Camino"
		},
		{		// for newer Netscapes (6+)
			string: navigator.userAgent,
			subString: "Netscape",
			identity: "Netscape"
		},
		{
			string: navigator.userAgent,
			subString: "MSIE",
			identity: "Explorer",
			versionSearch: "MSIE"
		},
		{
			string: navigator.userAgent,
			subString: "Gecko",
			identity: "Mozilla",
			versionSearch: "rv"
		},
		{ 		// for older Netscapes (4-)
			string: navigator.userAgent,
			subString: "Mozilla",
			identity: "Netscape",
			versionSearch: "Mozilla"
		}
	],
	dataOS : [
		{
			string: navigator.platform,
			subString: "Win",
			identity: "Windows"
		},
		{
			string: navigator.platform,
			subString: "Mac",
			identity: "Mac"
		},
		{
			string: navigator.platform,
			subString: "Linux",
			identity: "Linux"
		}
	]

};
BrowserDetect.init();

function closeBrowserMessage() {
	
	//set cookie
	var myDate = new Date();
	myDate.setDate(myDate.getDate()+365);
	setCookie("thoothSearchMessage", true, myDate, '/');
	
	//hide message container 
	jQuery('#browser-search-message').hide();
	
}
 
function writeBrowserMessage() {
	
	var message = "";
	var tnl = "";
	var mc = "";
	
	if( getCookie("thoothSearchMessage") == false ) {
	
		//create message container 
		mc = document.createElement("a");
		mc.setAttribute ("id", "browser-search-message");

		//create text and link
		tnl = document.createElement("span");
		tnl.setAttribute ("id", "message-tnl");
		tnl.innerHTML =
		getspan("Change search! Click to add to your browser.")
		+" <a href=\"javascript:closeBrowserMessage();\" alt=\""+getspan("Dismiss")+"\">X</a>";

		//create image for each browser
		message = document.createElement("img");
		message.setAttribute("onclick","window.external.AddSearchProvider('http://thooth.com/thoothsearch.xml');");

		if (BrowserDetect.browser=="Firefox") {
			
			if (BrowserDetect.OS=="Mac") {
				message.setAttribute("src","images/browser_search_ff2_mac.png");
			} else if (BrowserDetect.OS=="Windows") {
				message.setAttribute("src","images/browser_search_ff2_win.png");
			}

		} else if (BrowserDetect.browser=="Explorer") {
			if (BrowserDetect.version==7) {
				message.setAttribute("src","images/browser_search_ie7.png");
			}
		}

		//append image to div
		mc.appendChild(message);
		mc.appendChild(tnl);

		//append message to container
		if ((BrowserDetect.browser=="Explorer" && BrowserDetect.version==7) || (BrowserDetect.browser=="Firefox" && (BrowserDetect.version==3 || BrowserDetect.version==2))) {
			$("container").appendChild(mc);
		}
		
	}
	
}

function closeAddOnMessage() {
	
	//set cookie
	var myDate = new Date();
	myDate.setDate(myDate.getDate()+365);
	setCookie("thoothAddOnMessage", true, myDate, '/');
	
	//hide message container 
	jQuery("#browser-addon-message").hide();	
}
 
function writeAddOnMessage() {
	
	var message = "";
	var tnl = "";
	var mc = "";
	
	if( getCookie("thoothAddOnMessage") == false ) {
	
		//create message container 
		mc = document.createElement("a");
		mc.setAttribute ("id", "browser-addon-message");

		//create text and link
		tnl = document.createElement("span");
		tnl.setAttribute ("id", "addon-tnl");

		if (BrowserDetect.browser=="Firefox") {

			if (BrowserDetect.version==3){
			message = document.createElement("img");
			  tnl.innerHTML = getspan("Change search! Download the toolbar.") +" <a href=\"javascript:closeAddOnMessage();\" alt=\""+getspan("Dismiss")+"\">X</a>";
			  message.setAttribute("onclick","window.location='https://addons.mozilla.org/en-US/firefox/addon/8267';");
			  
				if (BrowserDetect.OS=="Mac") {
					message.setAttribute("src","images/download_toolbar_ff.png");
					
				} else if (BrowserDetect.OS=="Windows") {
					message.setAttribute("src","images/download_toolbar_ff.png");
				}
			}
			//append image to div
			mc.appendChild(message);
			mc.appendChild(tnl);
			$("container").appendChild(mc);

		} 
		
	}
	
}

// the query counter code
var COUNTER_UPDATE_INTERVAL = 1;

function loadQueryCounter(){
	var sUrl = server_to_use + '/js/querycount.js';
	getDataFromServer("queryCounter", sUrl);
}

function updateGlobalQueryCount(data){

    var lastQueryCount = new Object();
    lastQueryCount = data;
    lastQueryCount.TYPE_QUERIES = 1;
    lastQueryCount.TYPE_CONTRIBUTIONS = 2;
        
    var html= '<span id="count-value">1234567890</span> ';
//    if( Math.ceil(Math.random() * 100) % 2 == 0 ){
		lastQueryCount.type = lastQueryCount.TYPE_QUERIES;
		html += getspan("queries");
//    } else {
//		lastQueryCount.type = lastQueryCount.TYPE_CONTRIBUTIONS;
//		html += getspan("contributions");
//    }
	jQuery('#count').html(html);

    updateCounter(lastQueryCount);
}

function updateCounter(lastQueryCount){
    lastQueryCount.queries       += lastQueryCount.queryRate        * COUNTER_UPDATE_INTERVAL;
    lastQueryCount.contributions += lastQueryCount.contributionRate * COUNTER_UPDATE_INTERVAL;
	jQuery('#count-value').html(
		addCommas(Math.round((lastQueryCount.type == lastQueryCount.TYPE_QUERIES) ?
							 lastQueryCount.queries : lastQueryCount.contributions) ) );
     window.setTimeout('updateCounter(' + Object.toJSON(lastQueryCount) + ')', COUNTER_UPDATE_INTERVAL * 1000);
}

search_from_bar();
//loadQueryCounter();


                            
                            
                            
                            
                            