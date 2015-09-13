WISE.apps.seeqpod = {
	"name":"Seeqpod",
	"logo":"http://www.seeqpod.com/favicon.ico",
	"author": "Wikia Search",
	"description":"Playable Search",
	"categories":[ "Music" ],
	"id":"seeqpod",
	"regex":/.*(?:seeqpod )(.+)/i,
	"othermatch":{"type":"suggest","keywords":"songs;song;lyrics"},
	"url":"WISE/apps/wise_seeqpod.js?r=" + Math.random(),
	"action":"seeqpodFetch"
};


var playlist_url = "";
function seeqpodFetch(){

	search_term = WISE.trim(thisApp.params[0]);
	playlist_url = "http://www.seeqpod.com/api/v0.2/3e1dc62d2e11b3adbb40657b03d2210386d3e2e2/music/search/" + ( search_term ) + "/0/3"
	
	WISE.call(WISE.server+"/index.php?title=index.php&action=ajax&rs=wfGetGenericXMLtoJSON&rsargs[]=" + playlist_url + "&rsargs[]=seeqpodRender&rnd=" + Math.random(), thisApp.id);
}

function seeqpodEmbedCode( id ){
	//seeqpod embed format
	//<embed src="http://www.seeqpod.com/cache/seeqpodSlimlineEmbed.swf" wmode="transparent" width="300" height="80" type="application/x-shockwave-flash" flashvars="domain=http://www.seeqpod.com&playlistXMLPath=http://www.seeqpod.com/api/music/getPlaylist?playlist_id=e38a412205"></embed>
	return '<embed src="http://www.seeqpod.com/cache/seeqpodSlimlineEmbed.swf" wmode="transparent" width="425" height="80" type="application/x-shockwave-flash" flashvars="domain=http://www.seeqpod.com&playlistXMLPath=http://www.seeqpod.com/api/music/getPlaylist?playlist_id="' + id + '"></embed>'
	
}

function seeqpodRender( j ){

	if( !j.playlist.trackList ){
		WISE.clear( thisApp.id )
		return false;
	}
	var flashvars = {
		type: "xml",
		shuffle: "false",
		repeat: "list",
		file:"http://fp029.sjc.wikia-inc.com/search/test.xml"
		//file: WISE.server + "/index.php?rs=wfGetURLIContents&rsargs[]=" + playlist_url		
	}
	var params = {
		allowscriptaccess: "always"
	}
	var attributes = {
	  id: "openplayer",
	  name: "openplayer",
	  styleclass: "flash_player"
	}
	
	//swfobject.embedSWF('http://fp029.sjc.wikia-inc.com/search/wise/apps/common/mediaplayer.swf', "openplayer", "200", "200", "8.0.0", false, flashvars, params, attributes);

	//WISE.embedSWF('http://fp029.sjc.wikia-inc.com/search/wise/apps/common/mediaplayer.swf', flashvars, params, attributes);
	query = thisApp.params[0];	
	search_url = "http://www.seeqpod.com";

	
	//construct annotation div
	result_text = ""
	seeqpod_count = ((j.playlist.trackList.track.length-1 > 2)?2: j.playlist.trackList.track.length-1 );
	
	for( x = 0; x <= seeqpod_count; x++){
		result_text += "<div style='margin-bottom:5px'>" 
		//result_text += seeqpodEmbedCode( "5a8c416fdfaeb4665bf94dd67708b8bb6c8044a4" )
		result_text +=  ((j.playlist.trackList.track[x].creator)? j.playlist.trackList.track[x].creator + " - ":"") +  "<b>" + j.playlist.trackList.track[x].title + "</b>"
		//result_text += " - <a href=\"javascript:void(0);\" onclick=WISE.sendEvent('PLAY'," + x + ");>" + /*j.playlist.trackList.track[x].location*/ "Play" + "</a>"
		result_text += " - <a href=\"" + j.playlist.trackList.track[x].location + "\">MP3</a>";
		result_text += "</div>";
	}

	result_text += "<div><a href=\"http://www.seeqpod.com\" target=\"_top\" title=\"seeqpod.com\"><img src=\"http://www.seeqpod.com/images/seeqpod_logo_00.png\" width=\"100\" alt=\" seeqpod.com\" border=\"0\" /></a></div>";
	
	WISE.create("Results for " + query + " from SeeqPod.com", search_url, result_text, thisApp.id);
	
	

}
document.write('<div id="openplayer" class="flash_player"></div>')

