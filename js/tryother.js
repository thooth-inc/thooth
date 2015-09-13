function show_tryother() {
	
	if(!Q) return;
	
	var query = (($("q") && $("q").value != "") ? $("q").value : "");
	
	show_dialog( try_other_dialog_contents(query) )

}

var popular_add_ons = new Array();
popular_add_ons.push({name:"Google", url:"http://google.com/search?q= ", added:0});
popular_add_ons.push({name:"Wikipedia", url:"http://en.wikipedia.org/wiki/Special:Search?search=  ", added:0});
popular_add_ons.push({name:"Yahoo", url:"http://search.yahoo.com/search?p= ", added:0});
popular_add_ons.push({name:"Ask", url:"http://www.ask.com/web?q= ", added:0});
popular_add_ons.push({name:"MSN", url:"http://search.msn.com/results.aspx?q= &go=&form=QBHP ", added:0});
popular_add_ons.push({name:"Amazon", url:"http://www.amazon.com/s/ref=nb_ss_gw?url=search-alias%3Daps&field-keywords= &x=0&y=0", added:0});
popular_add_ons.push({name:"Answers", url:"http://www.answers.com/ ", added:0});
popular_add_ons.push({name:"Cnn", url:"http://search.cnn.com/search.jsp?query= &type=news&sortBy=date&intl=false", added:0});
popular_add_ons.push({name:"Dogpile", url:"www.dogpile.com/info.dogpl/search/web?q= ", added:0});
popular_add_ons.push({name:"Images", url:"http://images.google.com/images?q= ", added:0});
popular_add_ons.push({name:"YouTube", url:"http://youtube.com/results?search_query= ", added:0});
popular_add_ons.push({name:"IMDb", url:"http://www.imdb.com/find?s=all&q= ", added:0});
popular_add_ons.push({name:"OneLook", url:"http://onelook.com/?w= ", added:0});

var popular_to_add = new Array();
var other_added = new Array();

function try_other_dialog_contents(query) {
	
	if(!Q.also) Q.also = Alsos;
	var a = Q.also;

	var try_current = "<div class=\"currently-entered\">Try one of the sites currently entered:<br/>";
	for(var i=0; i < a.length; i++){
		var name = a[i].match(/([\w|\-]+)\.[a-z]{2,5}\//i);
		if(name.length < 2) continue;
		var sp = a[i].split(" ");
		
		try_current += "<a href=\"" + sp[0]+Q.q+(sp[1]?sp[1]:"") + "\">" + name[1].substr(0,1).toUpperCase()+name[1].substr(1).toLowerCase() + "</a>";
		
		if(i+1 < a.length) try_current += ", ";
		var was_added = false;
		for (var j=0; j<popular_add_ons.length; j++) {
			//alert(popular_add_ons[j].name);
			if (popular_add_ons[j].name.toLowerCase() == name[1].toLowerCase()) {
				popular_add_ons[j].added=1;
				was_added = true;
			}
			//else alert("-"+name+"- -"+popular_add_ons[j].name+"-")
			
		}
		if (!was_added) other_added.push({name:name[1].substr(0,1).toUpperCase()+name[1].substr(1).toLowerCase(),url:a[i],added:1});		
		
	}
	try_current += "</div>";
	
	var popular_str = "";
	if (popular_add_ons.length) {
		popular_str += "<div class=\"popular-to-add\">";
			popular_str += "<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\">";
			for (var k=0; k<popular_add_ons.length; k++) {
				if(k%2==0) popular_str += "<tr>";
				popular_str += "<td><input id=\"popular_to_add_" + k + "\" type=\"checkbox\" " + ((popular_add_ons[k].added) ? "checked" : "") + " value=\"" + popular_add_ons[k].url + "\"> " + popular_add_ons[k].name + "</td>";
				if(k%2==1) popular_str += "</tr>";
				popular_add_ons[k].added = 0;
			}
			popular_str += "</table>";
		popular_str += "</div>";
	}
	var other_added_str = "";
	if (other_added.length) {
		other_added_str += "<div class=\"other-added\">";
			other_added_str += "<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\">";
			for (var k=0; k<other_added.length; k++) {
				if(k%2==0) other_added_str += "<tr>";
				other_added_str += "<td><input id=\"other_added_" + k + "\" type=\"checkbox\" " + ((other_added[k].added) ? "checked" : "") + " value=\"" + other_added[k].url + "\"> " + other_added[k].name + "</td>"; 
				if(k%2==1) other_added_str += "</tr>";		
			}
			other_added_str += "</table>";
		other_added_str += "</div>";
	}
	
	if (other_added_str != "") {
		popular_str = "<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\"><tr><td width=\"40%\"><h3>Popular Sites</td><td width=\"60%\"><h3>Other Added Sites</h3></td></tr><tr><td valign=\"top\">" + popular_str + "</td><td valign=\"top\">" + other_added_str + "</td></tr></table>";
	} else {
		popular_str = "<h3>Popular Sites</h3>" + popular_str;
	}
	
	var return_str = "";
	return_str += "<form onsubmit=\"return hide_tryother(1,1);\">";
	return_str += "<div id=\"try-container\">";
		return_str += "<div class=\"dialog-actions\">";
			return_str += "<a href=\"javascript:hide_tryother(0,0);\">Cancel</a>";
		return_str += "</div>";
		return_str += "<h2>See Results From</h2>";
		return_str += "<div class=\"dialog-message\">";
			return_str += "We want people to find what they are looking for, if you think another site will provide better results add it below.";
		return_str += "</div>";
		return_str += "<div id=\"try-popular\">";
			return_str += popular_str;
		return_str += "</div>";
		return_str += "<div id=\"try-add\">";
			return_str += "<h3>Add Another Site</h3>";
			return_str += "<div class=\"try-message\">";
				return_str += "Or Enter a URL to any search engine result page, with a space character where the keyword goes";
			return_str += "</div>";
			return_str += "<input type=\"text\" id=\"tb_try_other_add\"/> ";
		return_str += "</div>";
	return_str += "</div>";
	return_str += "<div id=\"try-button\">";
		return_str += "<input type=\"button\" value=\"Save\" onclick=\"hide_tryother(1,0);\" /> ";
		return_str += "<input type=\"button\" value=\"Cancel\" onclick=\"hide_tryother(0,0);\" />";
	return_str += "</div>";
	return_str += "</form>";
	
	return return_str;
}

function hide_tryother(save,from_form) {
	
	if (save) {
		var query = (($("q") && $("q").value != "") ? $("q").value : "");
		if (query != "") {
			Q.also = new Array();
			if ($("tb_try_other_add") && $("tb_try_other_add").value != "") {
				Q.also.push($("tb_try_other_add").value);
			}
			for(var i=0; i<popular_add_ons.length; i++) {
				if ($("popular_to_add_" + i) && $("popular_to_add_" + i).checked && !$("popular_to_add_" + i).disabled) Q.also.push($("popular_to_add_" + i).value);
			}
			
			for(var i=0; i<other_added.length; i++) {
				if ($("other_added_" + i) && $("other_added_" + i).checked && !$("other_added_" + i).disabled) Q.also.push($("other_added_" + i).value);
			}
			ktSave(Q,"also",{"also":Q.also});
			alsoRender();
		}
	}
	
	other_added = new Array();
	
	if (jQuery("#dialog-window")) jQuery("#dialog-window").hide();
	if (jQuery("#dialog-lightbox")) jQuery("#dialog-lightbox").hide();
	document.body.style.overflow="auto";
	if (from_form) return false;
	
}
