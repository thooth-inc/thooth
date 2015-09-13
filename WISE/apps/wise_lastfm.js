function lastFMFetch(){
	
	if (thisApp.params.length == 1 || WISE.isOneOf(WISE.trim(thisApp.params[1]).toLowerCase(), "song;lyrics"))
            WISE.call(WISE.server+"/index.php?action=ajax&rs=wfGetLastFMJSON&rsargs[]="+encodeURIComponent(WISE.trim(thisApp.params[0]))+"&rsargs[]=song&rsargs[]=lastFMRenderSong&r="+Math.random(), thisApp.id);
	else if(WISE.isOneOf(WISE.trim(thisApp.params[1]).toLowerCase(), "tour dates;singer;band;discography;album;albums;songs"))
            WISE.call(WISE.server+"/index.php?action=ajax&rs=wfGetLastFMJSON&rsargs[]="+encodeURIComponent(WISE.trim(thisApp.params[0]))+"&rsargs[]=artist&rsargs[]=lastFMRenderArtist&r="+Math.random(), thisApp.id);
}

function lastFMRenderSong( j ){

	if( !j.lfm || !j.lfm["@attributes"] || !j.lfm["@attributes"].status || j.lfm["@attributes"].status != "ok"){
		WISE.clear(thisApp.id);
		return false;
	}
	
	if (j.lfm.results.trackmatches && j.lfm.results.trackmatches.track) {
		var similar_tracks = new Array();
		if (j.lfm.results.trackmatches.track.length) {
			var track = j.lfm.results.trackmatches.track[0];
			var limit = ((j.lfm.results.trackmatches.track.length > 3) ? 3 : j.lfm.results.trackmatches.track.length);
			for (var t=1; t<limit; t++) {
				similar_tracks.push(j.lfm.results.trackmatches.track[t]);
			}
			
		}
		else {
			var track = j.lfm.results.trackmatches.track;
		}
		
		var title = "Last.fm - Results for " + j.lfm.results["@attributes"]["for"];

		var url = track.url;
		var output = '<table><tr><td width="30%" valign="top" class="wise_lastFM_trackinfo">'
			+ '<div id=\'WISElastfmtrack_info_'+ encodeURIComponent(WISE.apps.lastfm.params[0]) + '\'>'
			+ '<b>' + track.name + '</b><br/>' + track.artist + '<br/>' + (track.image ? '<img src="' + track.image[1] + '" />' : "");
		
			if(similar_tracks.length) {
				output += '<br/>Other track matches:<br/>';
				for (var t=0; t<similar_tracks.length; t++) {
					var sim = similar_tracks[t];
					output += '<div ' + (t<similar_tracks.length-1 ? 'class="wise_lastFM_similartracks' : '') + '><a href="'+sim.url+'">'+sim.name+'</a> - ' + sim.artist + '</div>';
				}
			}
			
		output += '</div>'
			+ '</td><td valign="top">'
			+ '<div id=\'WISElastfmartist_info_'+ encodeURIComponent(WISE.apps.lastfm.params[0]) + '\'></div>'
			+ '</td></tr>'
			+ '<tr><td><img src="http://cdn.last.fm/flatness/logo.6.png" width=50 /></td></tr></table>'
		WISE.create(title, url, output, thisApp.id);
		var callurl = WISE.server+"/index.php?action=ajax&rs=wfGetLastFMJSON&rsargs[]="+encodeURIComponent(WISE.trim(track.artist))+"&rsargs[]=artist&rsargs[]=lastFMRenderArtist&r="+Math.random();
		WISE.call(callurl, thisApp.id);
	}
	else {
		WISE.clear(thisApp.id);
	}
	
}

function lastFMRenderArtist( j ){

	
	if( !j.lfm || !j.lfm["@attributes"] || !j.lfm["@attributes"].status || j.lfm["@attributes"].status != "ok"){
		WISE.clear(thisApp.id);
		return false;
	}
	var art_out = "";
	if (j.lfm.artist) {
		var artist = j.lfm.artist;
		var name = artist.name;
		var url = artist.url;
		var img = artist.image[1];
		
		var summary = ((artist.bio && artist.bio.summary) ? artist.bio.summary : false);
		var published = ((artist.bio && artist.bio.published) ? artist.bio.published : false);
		
		var title = "Last.fm - " + name;
	
		//var similar_artists = new Array();
		var similar_artists ="";
		
		if (artist.similar && artist.similar.artist) {
			if (artist.similar.artist.length) {
				var limit = ((artist.similar.artist.length > 5) ? 5 : artist.similar.artist.length);
				similar_artists = "<b>Similar</b> ";
				for (var t=0; t<limit; t++) {
					//similar_artists.push(artist.similar.artist[t]);
					sim = artist.similar.artist[t];
					similar_artists += '<a href="'+sim.url + '">'+sim.name+'</a>' + ((t < limit-1) ? ' | ' : '');
				}
			}
			else {
			}
		}
		
		if (WISE.getElement("WISElastfmartist_info_"+encodeURIComponent(WISE.apps.lastfm.params[0]))) {
			art_out = '<div>'
			+ '<a href="'+url+'">'+title+'</a><br/><img class="wise_lastFM_artistimage" src="'+img+'" />'+(summary ? summary : '')
			+ '</div>';
			if (similar_artists != "") art_out += '<div style="margin:10px 0 0 0;">' + similar_artists + '</div>';
			
			WISE.getElement("WISElastfmartist_info_"+encodeURIComponent(WISE.apps.lastfm.params[0])).innerHTML = art_out;
			WISE.clear(thisApp.id);
		}
		else {
			art_out = '<table><tr><td valign="top">'
			+ '<img class="wise_lastFM_artistimage" src="'+img+'" /></td><td valign="top">'+(summary ? summary : '');

			if (similar_artists != "") art_out += '<div style="margin:10px 0 0 0;">' + similar_artists + '</div>';
			art_out += '</td></tr></table>';

			WISE.create(title, url, art_out, thisApp.id);
		}
	}
	
}

thisApp.css = {
	"trackinfo":{
		"padding-right":"10px"
	},
	"similartracks":{
		"border-bottom":"1px solid #DCDCDC"
	},
	"artistimage":{
		"float":"left",
		"padding":"5px"
	},
	"logo":{
		"margin":"10px 0"
	}
}
