var langselectincluded = true;
function show_langselect() {
	
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
		
		$("dialog-window").innerHTML = langselect_dialog_contents();
		$("dialog-window").style.display="block";
	}
	else {
		
		/*window width
		var window_width = 0;
		var dialog_margin = 0;
		var browser=navigator.appName;
		var b_version=navigator.appVersion;
			//var version=parseFloat(b_version);
		if ((browser=="Microsoft Internet Explorer")) {
			b_version_short = b_version.substring(b_version.indexOf("MSIE ")+4);
			b_version_short = b_version_short.substring(0,b_version_short.indexOf(";"));
			var version=parseFloat(b_version_short);
			if (version<7) {
				window_width = 800;
			} 
		} else {
			window_width = window.innerWidth;
		}
		
		dialog_margin = (window_width - 500) / 2; 
		alert (window_width);
		alert (dialog_margin);
		*/
		
		var window_width = 0;
		var dialog_margin = 0;
		var tryOther = document.createElement("div");
		tryOther.setAttribute("id", "dialog-window");
		tryOther.innerHTML = langselect_dialog_contents();
		
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


function langselect_dialog_contents() {
	
	var return_str = "";
	return_str += "<form onsubmit=\"return hide_langselect(1,1);\">";
	return_str += "<div class=\"language-select\">";
	return_str += "<div class=\"dialog-actions\">";
	return_str += "<a href=\"javascript:hide_langselect(0,0);\">"+getspan("Cancel")+"</a>";
	return_str += "</div>";
	return_str += "<h2>"+getspan("Default Language Selection")+"</h2>";	
	return_str += "<div class=\"dialog-message\">"
		+ getspan("You can select the default language for the search results.  To set a new language, just select a language from the below list and click save.")
		+ "</div>";
		//return_str += "<input type=\"text\" id=\"tb_related_box_add\"/> ";
		if (langs) {
            // FIXME: Use xlateOnFly2 here
			// took this out because of needing to dynamically load the i18n file :(
			//return_str += "<select id=\"lang_sel\" name=\"lang_sel\" onchange=\"xlateOnFly(this.value);\">";
			return_str += "<select id=\"lang_sel\" name=\"lang_sel\">";
			for (var eachlang in langs) {
					//if (eachlang.length == 2) {
					return_str += "<option value=\"" + eachlang + "\"" + (eachlang==lang ? " selected" : "") +">"
						+langdesc(eachlang)+"</option>";
					//}
			}
			return_str += "</select>";
		}
	return_str += "</div>";
	return_str += "<div id=\"related-button\">";
	return_str += "<input id=\"ls_save_btn\" type=\"button\" value=\""+gettexta("Save", {id:'ls_save_btn',param:'value'})+"\" onclick=\"hide_langselect(1,0);\" /> ";
	return_str += "<input id=\"ls_cancel_btn\"  type=\"button\" value=\""+gettexta("Cancel", {id:'ls_cancel_btn',param:'value'})+"\" onclick=\"hide_langselect(0,0);\" />";
	return_str += "</div>";
	return_str += "</form>";
	return return_str;
}

function hide_langselect(save,from_form) {
	
	if (save) {
		lang = $("lang_sel").value;
		setCookie("ws_lang", lang);
		langchange(lang);
		// moved to api function
		//i18n.setlanguage(lang);
		//alert("lang='"+lang+"', i18n.language_name='"+i18n.language_name+"', i18n.language='"+i18n.language._LANGUAGE+"'");
		//xlateOnFly(lang);
		var url = "index.php?action=ajax";
		var pars = 'rs=wfGetJsTranslation&rsargs[]='+lang+'&rsargs[]=1';
		var sUrl = server_to_use + "/" + url + "&" + pars;
		getDataFromServer("i18ntrans",sUrl);
	}
	else {
        // FIXME: Use xlateOnFly2 here
		//xlateOnFly(lang);
	}
	show_lang_header();
	if (document.getElementById("dialog-window")) document.getElementById("dialog-window").style.display = "none";
	if (document.getElementById("dialog-lightbox")) document.getElementById("dialog-lightbox").style.display = "none";
	document.body.style.overflow="auto";
	if (from_form) return false;
	
}
