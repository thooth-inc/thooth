function show_related_box() {
	
	if(!Q) return;
	
	if (document.getElementById("dialog-lightbox")) {
		document.getElementById("dialog-lightbox").style.display="block";
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
	
	var query = (($("q") && $("q").value != "") ? $("q").value : "");
	
	if (document.getElementById("dialog-window")) {
		
		$("dialog-window").innerHTML = related_box_dialog_contents(query);
		$("dialog-window").style.display="block";
	}
	else {		

		var window_width = 0;
		var dialog_margin = 0;
		var related_box = document.createElement("div");
		related_box.setAttribute("id", "dialog-window");
		related_box.innerHTML = related_box_dialog_contents(query);
		
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
		//related_box.style.margin = "0 auto";
		related_box.style.zIndex = 100;
		document.body.appendChild(related_box);
		
	}
	
	document.body.style.overflow="hidden";
	scroll(0,0);
	
}

function related_box_dialog_contents(query) {
	
	var return_str = "";
	return_str += "<form onsubmit=\"return hide_related_box(1,1);\">";
	return_str += "<div class=\"related-term-add\">";
	return_str += "<div class=\"dialog-actions\">";
			return_str += "<a href=\"javascript:hide_related_box(0,0);\">Cancel</a>";
		return_str += "</div>";
	return_str += "<h2>Related Search Terms</h2>";	
	return_str += "<div class=\"dialog-message\">Type in another search term that would be a good search related to " + query + "</div>";
		return_str += "<input type=\"text\" id=\"tb_related_box_add\"/> ";
	return_str += "</div>";
	return_str += "<div id=\"related-button\">";
		return_str += "<input type=\"button\" value=\"Add\" onclick=\"hide_related_box(1,0);\" /> ";
		return_str += "<input type=\"button\" value=\"Cancel\" onclick=\"hide_related_box(0,0);\" />";
	return_str += "</div>";
	return_str += "</form>";
	return return_str;
}

function hide_related_box(save,from_form) {
	
	if (save) {
		var query = (($("q") && $("q").value != "") ? $("q").value : "");
		if (query != "") {
			if ($("tb_related_box_add") && $("tb_related_box_add").value != "") {
				var s = $("tb_related_box_add").value;
				suggestedAdd(s);
				ktSave(Q,"sug",{"sug":s});
				search(s);
			}
			
		}
	}
	
	if (document.getElementById("dialog-window")) document.getElementById("dialog-window").style.display = "none";
	if (document.getElementById("dialog-lightbox")) document.getElementById("dialog-lightbox").style.display = "none";
	document.body.style.overflow="auto";
	if (from_form) return false;
	
}
