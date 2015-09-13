
function expand_ma() {
	
	if(!Q || !$("ma_expand")) return;
	
	if (jQuery("#dialog-lightbox")) {
		jQuery("#dialog-lightbox").css( 'display', 'block' );
	}
	else {		
		var lightbox = jQuery("<div>");
		lightbox.attr("id", "dialog-lightbox");
		lightbox.css("position", "absolute" );
		lightbox.css("top", "0px" );
		lightbox.css("left", "0px" );
		lightbox.css("width", "100%" );
		lightbox.css("height", "100%" );
		lightbox.css("zIndex", "50" );
		lightbox.css("backgroundColor", "#888888" );
		lightbox.css("opacity", "0.50" );
		lightbox.css("filter", "alpha(opacity=50)" );
		jQuery("body").append(lightbox);
		
	}
	
	//set height of lightbox for IE
	var browser=navigator.appName;
	var b_version=navigator.appVersion;
	
	if ((browser=="Microsoft Internet Explorer")) {
		b_version_short = b_version.substring(b_version.indexOf("MSIE ")+4);
		b_version_short = b_version_short.substring(0,b_version_short.indexOf(";"));
		var version=parseFloat(b_version_short);
		if (version<7) {
			var window_height = document.documentElement.clientHeight;
			$('dialog-lightbox').style.height=window_height;
		}
	}
	
	var query = (($("q") && $("q").value != "") ? $("q").value : "");
	
	if (document.getElementById("dialog-window")) {
		if (Q.ma_full) {
			maRenderFull(Q.ma_full);
		}
		else {
			$("dialog-window").innerHTML = "<i>loading...</i>";
			callOut("maRenderFull(j)",server_to_use+"/index.php?action=ajax&rs=wfGetArticleJSON&rsargs%5B%5D=Mini:"+encodeURIComponent(Q.q)+"&rsargs%5B%5D=maRenderFull&rsargs%5B%5D=0");
		}
		$("dialog-window").style.display="block";
	}
	else {		
		var window_width = 0;
		var dialog_margin = 0;
		var related_box = document.createElement("div");
		related_box.setAttribute("id", "dialog-window");
		related_box.innerHTML = "<i>loading...</i>";
		callOut("maRenderFull(j)",server_to_use+"/index.php?action=ajax&rs=wfGetArticleJSON&rsargs%5B%5D=Mini:"+encodeURIComponent(Q.q)+"&rsargs%5B%5D=maRenderFull&rsargs%5B%5D=0");
		
		// something to make it change
		
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
		dialog_margin = (window_width - 500) / 2;
		related_box.style.left = dialog_margin + "px";
		related_box.style.position = "absolute";
		related_box.style.top = "50px";
		related_box.style.width = "500px";
		related_box.style.textAlign = "left";
		related_box.style.zIndex = 100;
		document.body.appendChild(related_box);
		
	}
	
	document.body.style.overflow="hidden";
	scroll(0,0);
	
}

function maRenderFull(j) {
	Q.ma_full = j;
	var return_str = "";
	return_str += "<div class=\"mini-article-full\">";
	return_str += "<div class=\"dialog-actions\">";
			return_str += "<a href=\"javascript:hide_ma_box(0);\">"+getspan("Close")+"</a>";
		return_str += "</div>";
	return_str += "<h2>"+getspan("Mini Article")+": " + j.title + "</h2>";	
	return_str += "<div id=\"ma-full-container\">";
		return_str += j.html;
	return_str += "</div>";
	return_str += "<div id=\"edit-links\">";
	return_str += "<input id=\"ma_edit_btn\" type=\"button\" value=\""+getspan("Edit", {id:'ma_edit_btn', param:'value'} )+"\" onclick=\"window.location='" + j.editurl + "'\"/>  ";
		return_str += "<input id=\"ma_full_btn\" type=\"button\" value=\""+getspan("Full Article", {id:'ma_full_btn', param:'value'})+"\" onclick=\"window.location='" + j.url + "'\"/>";
		//return_str += "<a href=\"javascript:hide_ma_box(0);\">"+getspan("Close")+"</a>";
	return_str += "</div>";
	$("dialog-window").innerHTML =  return_str;
	
	if (!Q.ma_full.offset_height) {
		var offset_height = $('ma-full-container').offsetHeight;
	}
	else offset_height = Q.ma_full.offset_height;
	if (offset_height>=350) {
		offset_height = 350;
		$('ma-full-container').style.overflowY = "scroll";
		$('ma-full-container').style.overflowX = "hidden";
	}
	Q.ma_full.offset_height = offset_height
	
	$('ma-full-container').style.height = offset_height + "px";
}

function hide_ma_box(save) {
	
	if (save) {
	
	}
	
	if (document.getElementById("dialog-window")) document.getElementById("dialog-window").style.display = "none";
	if (document.getElementById("dialog-lightbox")) document.getElementById("dialog-lightbox").style.display = "none";
	document.body.style.overflow="auto";
	
	
}
