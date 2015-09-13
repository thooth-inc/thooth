function show_advancedadd(e) {
	
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
	
	if (document.getElementById("dialog-window")) {
		
		$("dialog-window").innerHTML = show_advanced_add_contents();
		$("dialog-window").style.display="block";
	}
	else {		
		var window_width = 0;
		var dialog_margin = 0;
		var advancedAdd = document.createElement("div");
		
		advancedAdd.setAttribute("id", "dialog-window");
		advancedAdd.innerHTML = show_advanced_add_contents();
		
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
		advancedAdd.style.left = dialog_margin + "px";
		
		advancedAdd.style.position = "absolute";
		advancedAdd.style.top = "50px";
		advancedAdd.style.width = "500px";
		advancedAdd.style.textAlign = "left";
		advancedAdd.style.zIndex = 100;
		document.body.appendChild(advancedAdd);
		
	}
	
	
	try {
		document.body.style.overflow="hidden";
		document.body.scroll = "no";
	}
	catch (ex){}
	scroll(0,0);
	API.load('kt', '');
	
}


function hide_advancedadd(save, advanced) {
	
	document.body.style.height = "auto";
	
	if (document.getElementById("dialog-window")) document.getElementById("dialog-window").style.display = "none";
	if (document.getElementById("dialog-lightbox")) document.getElementById("dialog-lightbox").style.display = "none";
	try {
		document.body.style.overflow="auto";
		document.body.scroll = "yes";
	}
	catch (ex){}
	
	
}

function show_advanced_add_contents() {
	var return_str = "";
	
	return_str += '<div class="dialog-actions">'
				+ '<a href="javascript:hide_advancedadd();">Close</a>'
			+'</div>'
			+'<h2>Advanced Add URL</h2>'
			+'<div id="select-screen">'
				+'<div class="dialog-message">Add a URL from one of your previously added URLs or from the the following services.</div>'
				+'<h3>Create Result</h3>'
				+'<div id="advanced-api-list">'
					+'<table border="0" cellpadding="0" cellspacing="0" width="50%">'
						+'<tr>'
							+'<td><button onclick="API.load(\'google\', Q.q);"><img src="http://www.google.com/favicon.ico" width="16"/> Google</button> </td>'
							+'<td><button onclick="API.load(\'yahoo\', Q.q);"><img src="http://www.yahoo.com/favicon.ico" width="16"/> Yahoo</button> </td>'
							+'<td><button onclick="API.load(\'yahoo_news\', Q.q);"><img src="http://www.yahoo.com/favicon.ico" width="16"/> Y! News</button> </td>'
							+'<td><button onclick="API.load(\'yahoo_answers\', Q.q);"><img src="http://l.yimg.com/us.yimg.com/i/us/sch/gr/answers_favicon.ico" width="16"/>Y! Answers</button> </td>'
						+'</tr>'
					+'</table>'
				+'</div>'
				+'<h3 id="adv_add_prevh3" style="display:none;">Previously Added URLs</h3>'
				+'<div id="previous-add-container"></div>'
			+'</div>'
			+'<div id="api-screen" style="display:none;">'
				+'<div id="api-preview"></div>'
				+'<div id="api-controls">'
					+'<input type="button" value="Save"/>' 
					+'<input type="button" value="Cancel"/>'
				+'</div>'
			+'</div>'
			+'<div id="api-disambig" style="display:none;"></div>';
			
			return return_str;
}


var API = {
	"list":{
		"google":{
			"request":{
				"url":"http://ajax.googleapis.com/ajax/services/search/web",
				"params":{
					"v":"1.0",
					"callback":"API.list.google.request.process"
				},
				"search":"q",
				"process":function (obj) { API.processApiResult(obj,"google") },
				"next":"start",
				"size":4
			},
			"response":{
				"display_name":"Google",
				"rootelement":"responseData",
				"containerElement":"results",
				"titleField":"titleNoFormatting",
				"contentFields":[ 
					{"prefix":"", "field":"content", "suffix":"<br/>", "for_desc":true},
					{"prefix":"<div class='other'><a class='url'>", "field":"unescapedUrl", "suffix":"</a></div>"}
				],
				"url":{"field":"unescapedUrl"}
			}
		},
		"yahoo":{
			"request":{
				"url":"http://search.yahooapis.com/WebSearchService/V1/webSearch",
				"params":{
					"appid":"xn0wlSbV34FyhFUpNs.JhRy8VT0OCs4bcIXxEWTfEugKLUyvw71fA7nNbi0GOOUy9ogukb6E",
					"output":"json",
					"results":"4",
					"callback":"API.list.yahoo.request.process"
				},
				"search":"query",
				"process":function (obj) { API.processApiResult(obj, "yahoo") },
				"next":"start",
				"size":4,
				"offset":1
			},
			"response":{
				"display_name":"Yahoo!",
				"rootelement":"ResultSet",
				"containerElement":"Result",
				"titleField":"Title",
				"contentFields":[ 
					{"prefix":"", "field":"Summary", "suffix":"<br/>", "for_desc":true},
					{"prefix":"<div class='other'><a class='url'>", "field":"Url", "suffix":"</a></div>"},
				],
				"url":{"field":"ClickUrl"}
			}
		},
		"yahoo_news":{
			"request":{
				"url":"http://search.yahooapis.com/NewsSearchService/V1/newsSearch",
				"params":{
					"appid":"xn0wlSbV34FyhFUpNs.JhRy8VT0OCs4bcIXxEWTfEugKLUyvw71fA7nNbi0GOOUy9ogukb6E",
					"output":"json",
					//"type":"phrase",
					"results":"3",
					"callback":"API.list.yahoo_news.request.process"
				},
				"search":"query",
				"process":function (obj) { API.processApiResult(obj, "yahoo_news") },
				"next":"start",
				"size":3,
				"offset":1
			},
			"response":{
				"display_name":"Yahoo! News",
				"rootelement":"ResultSet",
				"containerElement":"Result",
				"titleField":"Title",
				"contentFields":[ 
					{"prefix":"", "field":"Summary", "suffix":"<br/>", "for_desc":true, "limit":150},
					{"prefix":"<div class='other'><a class='url'>", "field":"Url", "suffix":"</a></div>"},
					{"prefix":"<div style='font-size:10px'>Published: ", "field":"PublishDate", "suffix":"</div>", "type":"unixdate"},
					{"prefix":"<div style='font-size:10px'>Source: ", "field":"NewsSource", "suffix":"</div>"},
					//{"prefix":"<div style='font-size:10px'>Modified: ", "field":"ModificationDate", "suffix":"</div>", "type":"unixdate"}
				],
				"url":{"field":"ClickUrl"}
			}
		},
		"yahoo_answers":{
			"request":{
				"url":"http://answers.yahooapis.com/AnswersService/V1/questionSearch",
				"params":{
					"appid":"xn0wlSbV34FyhFUpNs.JhRy8VT0OCs4bcIXxEWTfEugKLUyvw71fA7nNbi0GOOUy9ogukb6E",
					"output":"json",
					"results":"4",
					"callback":"API.list.yahoo_answers.request.process"
				},
				"search":"query",
				"process":function (obj) { API.processApiResult(obj, "yahoo_answers") },
				"next":"start",
				"size":4
			},
			"response":{
				"display_name":"Yahoo! Answers",
				"rootelement":"all",
				"containerElement":"questions",
				//"image":{"field":"UserPhotoURL"},
				"titleField":"Subject",
				"contentFields":[ 
					{"prefix":"<strong>Question:</strong> ", "field":"Content", "suffix":"<br/>", "limit":100, "for_desc":true},
					{"prefix":"<strong>Chosen Answer:</strong> ", "field":"ChosenAnswer", "suffix":"", "limit":100, "for_desc":true}
				],
				"url":{"field":"Link"}
			}
		},
		//http://search.isc.swlabs.org/kttest/user.js?max=3&t=add&u=Jeffrey%20Tierney&r=3232&f=processKT(
		"kt":{
			"request":{
				"url":"http://thooth.com/kt/2/user.js",
				"params":{
					"max":"3",
					"t":"add",
					"u":getCookie("thoothUserName"),
					"r":Math.random(),
					"f":"API.list.kt.request.process("
				},
				"process":function (obj) { API.processApiResult(obj, "kt") },
				"size":3
			},
			"response":{
				//"display_name":"Your Added Results",
				"containerElement":"add",
				"titleField":"title",
				"backupTitle":"keyword",
				"contentFields":[ 
					{"prefix":"<div class='blurb'>", "field":"summary", "suffix":"</div>", "for_desc":true},
					{"prefix":"<div class='other'><a class='url'>", "field":"url", "suffix":"</a></div>"},
				],
				"url":{"field":"url"},
				"isDefault":true,
				"showStars":true
			}
		}
		
	},
	"buildItemUrl":function(base, params, obj) {
			var url = base;
			
			for (var i=0; i<params.length; i++) {
				var repl = "$"+(i+1) + "";
				if (obj[params[i]]) url = url.replace(repl, obj[params[i]]);
			}
			
			return url;
			
		},
	"processApiResult":function (obj, which) {
			var resp_hand = API.list[which];
			t_resp_hand = resp_hand;
			var resp_str = "";
			resp_hand = resp_hand.response;
			var r_obj;
			if (resp_hand.rootelement && obj[resp_hand.rootelement]) r_obj=obj[resp_hand.rootelement];
			else r_obj = obj;
			
			var hasResults = false;
			
			//API.last_resultset=r_obj;
			//API.last_resphand=t_resp_hand;
			
			API.list[which].last_resultset=r_obj;
			
			if (r_obj) {
				
				if(!r_obj[resp_hand.containerElement] || r_obj[resp_hand.containerElement].length == 0) {
					
					if (resp_hand.isDefault) {
						if($("adv_add_prevh3"))$("adv_add_prevh3").hide();
					}
				}
				else {
					hasResults=true;
					if(resp_hand.isDefault && $("adv_add_prevh3"))$("adv_add_prevh3").show();
					if (resp_hand.display_name) resp_str = '<div class="dialog-message">Select one of the links to add from ' + resp_hand.display_name + '.';
					if (resp_hand.display_message) resp_str += "<br/>"+resp_hand.display_message;
					resp_str += '</div>';
				}
				if (!API.list[which].params.follow) {
					resp_str += '<form onsubmit="API.reload(\'' + which + '\');return false;">';
					if (API.list[which].request.search || API.list[which].request.custom) resp_str += '<div id="api-keyword">';
					if (API.list[which].request.search) resp_str += 'Keyword <input type="text" id="api_adv_query" value="' + API.query + '"/>';
					if (API.list[which].request.custom) {
						for (var i=0; i<API.list[which].request.custom.length; i++) {
							resp_str += API.list[which].request.custom[i].label;
							if(API.list[which].request.custom[i].type == 'text') resp_str += '<input type="text" id="adv_api_' + API.list[which].request.custom[i].param + '" value="' + API.list[which].request.params[API.list[which].request.custom[i].param] + '"/>';
							else if(API.list[which].request.custom[i].type == 'dropdown') {
								resp_str += '<select id="adv_api_' + API.list[which].request.custom[i].param + '">';
								//value="' + API.list[which].request.params[API.list[which].request.custom[i].param] + '"/>';
								/*for (var j=0; j<API.list[which].request.custom[i].values.length; j++) {
									resp_str += '<option value="' + API.list[which].request.custom[i].values[j] + '"' + (API.list[which].request.custom[i].values[j]==API.list[which].request.params[API.list[which].request.custom[i].param] ? ' selected' : '') + '>' + (API.list[which].request.custom[i].display ? eval("('"+API.list[which].request.custom[i].values[j]+"')"+API.list[which].request.custom[i].display) : API.list[which].request.custom[i].values[j]) + '</option>';
								}*/
								for (var val in API.list[which].request.custom[i].values) {
									resp_str += '<option value="' + val + '"' + (val==API.list[which].request.params[API.list[which].request.custom[i].param] ? ' selected' : '') + '>' + (API.list[which].request.custom[i].values[val] ? API.list[which].request.custom[i].values[val] : val) + '</option>';
								}
								resp_str += "</select>";
							}
						}
					}
					if (API.list[which].request.search || API.list[which].request.custom) resp_str += ' <input type="submit" value="Go"/> <input type="button" value="Back" onclick="javascript:API.backToTop();"/></div>';
				}
				var startedAt=0;
					if (API.list[which].request.next) {
						resp_str += '<div id=\'api-nav\'>';
						//var temp_start = API.list[which].params.start;
						var temp_start = (API.list[which].params.start?API.list[which].params.start:0);
						startedAt = temp_start;
						//alert(API.list[which].params.start + " : " + API.list[which].request.size);
						API.list[which].params.start = (parseInt((API.list[which].params.start?API.list[which].params.start:0))-parseInt(API.list[which].request.size))
						//API.list[which].params.start = ((API.list[which].params.start >= 0) ? API.list[which].params.start : 0); 
						
						if (API.list[which].params.start >= 0) resp_str += "<a href='javascript:API.load(\"" + which + "\", API.query, " + Object.toJSON(API.list[which].params) + ");'>Prev</a> ";
						
						if (API.list[which].params.start >= 0 && (r_obj[resp_hand.containerElement] && r_obj[resp_hand.containerElement].length != 0)) resp_str += "| ";
						
						API.list[which].params.start = (parseInt(temp_start)+parseInt(API.list[which].request.size));
						if (r_obj[resp_hand.containerElement] && r_obj[resp_hand.containerElement].length != 0)resp_str += "<a href='javascript:API.load(\"" + which + "\", API.query, " +  Object.toJSON(API.list[which].params) + ");'>Next</a>";
						/*
						if (API.list[which].params.start) resp_str += "<a href='javascript:API.load(\"" + which + "\", API.query, {\"start\":" + (parseInt(API.list[which].params.start)-parseInt(API.list[which].request.size)) + ",});'>prev</a> | ";
						resp_str += "<a href='javascript:API.load(\"" + which + "\", API.query, {\"start\":" + (parseInt(API.list[which].params.start)+parseInt(API.list[which].request.size)) + "});'>next</a>";
						*/
						resp_str += '</div>';
					}
					resp_str += '</form>';
				
					if(!hasResults && !resp_hand.isDefault) resp_str += "<h3>No " + (startedAt ? "More " : "") + "Results Found!</h3>";
				//for (var i=0; i<r_obj[resp_hand.containerElement].length; i++) {
					try{var maxlength = ((API.list[which].request.size && !API.list[which].request.bypage && r_obj[resp_hand.containerElement] && API.list[which].request.size < r_obj[resp_hand.containerElement].length) ? API.list[which].request.size : r_obj[resp_hand.containerElement].length);}
					catch(ex){var maxlength= (r_obj[resp_hand.containerElement] ? r_obj[resp_hand.containerElement].length : 0)}
				for (var i=0; i<maxlength; i++) {
					//var cur_str = "<div class='apiResult'>";
					var cur_str = '<div class="description" onmouseover="$(this).addClassName(\'advanced-hover\')" onmouseout="$(this).removeClassName(\'advanced-hover\')" ' + (API.list[which].params.follow ? "" : 'onclick="API.select(' + i + ', \'' + which + '\');"') + '>';
					//cur_str += "<span id='api_tog_"+which+"_"+i+"' onclick='API.toggleResultDisplay(\""+which+"\", " + i + ");'> + </span>";
					var cur = r_obj[resp_hand.containerElement][i];
					
					var url = (resp_hand.url.field ? cur[resp_hand.url.field] : API.buildItemUrl(resp_hand.url.base, resp_hand.url.params, cur)); 
					
					cur_str += "<div class='link-container clearfix'><div class='link'>";
					if (API.list[which].params.follow) cur_str += "<span id='api_tog_"+which+"_"+i+"' onclick='API.toggleResultDisplay(\""+which+"\", " + i + ");'> + </span>";
					cur_str += "<a href='" + (API.list[which].params.follow ? url : 'javascript:void(0);') + "'>" +((cur[resp_hand.titleField] && cur[resp_hand.titleField]!="undefined") ? cur[resp_hand.titleField] : cur[resp_hand.backupTitle]) + "</a></div>";
					cur_str += "</div>";
					
					cur_str += "<div id='api_res_" + which + "_" + i + "' class='blurb' style='display: " + (API.list[which].params.follow ? "none" : "block") + ";'>";
					
					if (resp_hand.image) {
						if (resp_hand.image.field && cur[resp_hand.image.field]) cur_str += "<img src='" +  cur[resp_hand.image.field] + "' />";
						else cur_str += "<img src='" +  API.buildItemUrl(resp_hand.image.base, resp_hand.image.params, cur) + "' />";
					}
					for (var j=0; j<resp_hand.contentFields.length; j++) {
						//curField = resp_hand.contentFields[j];
						//try{if (cur[curField.field] && cur[curField.field] != '') cur_str += curField.prefix + ((curField.limit && cur[curField.field].length > curField.limit) ? cur[curField.field].substr(0, curField.limit)+"..." : cur[curField.field]) + curField.suffix;} catch(ex){}
						cur_str += API.processContentField(resp_hand.contentFields[j], cur, resp_hand, false);
					}
					cur_str += "</div>";
					resp_str += cur_str + "</div>";
				}
				
			}
			else resp_str = "error";
			
			if (!resp_hand.isDefault) {
				$(API.list[which].params.dis).innerHTML = resp_str;
				if($(API.list[which].params.screen)) $(API.list[which].params.screen).hide();
				if($(API.list[which].params.sel))$(API.list[which].params.sel).hide();
				$(API.list[which].params.dis).show();
			}
			else {
				document.getElementById("previous-add-container").innerHTML = resp_str;
				$("api-screen").hide();	
				$("api-disambig").hide();
				$("select-screen").show();
				API.default_resultset=API.list[which].last_resultset;
				API.default_resphand=API.list[which];
			}
			
		},
	"processContentField":function(curField, cur, resp_hand, from_sel) {
			var return_str = "";
			
			var fieldText = false;
			try{if (cur[curField.field] && cur[curField.field] != '') fieldText = cur[curField.field];}catch(ex){return return_str;}
			if (!fieldText) return return_str;
			if (from_sel && !curField.for_desc) return return_str;
			
			var process_type=false;
			if (curField.type) process_type=curField.type;
			
			switch(process_type) {
				case "unixdate":
					var myDate = new Date();
					myDate.setTime(parseInt(fieldText)*1000);
					fieldText = myDate.toLocaleString();
				break;
			}
			
			try{
				return_str += (curField.prefix ? curField.prefix : "") 
					+ ((curField.limit && fieldText.length > curField.limit) ? fieldText.substr(0, curField.limit)+"..." : fieldText) 
					+ (curField.suffix ? curField.suffix : "");
			} 
			catch(ex){}
			
			if (from_sel && curField.for_desc) return_str = return_str.replace(/\<([^\>]+)\>/g, "");
			
			return return_str;
		},
	"load":function(which, q, params) {
			API.api=which;
			API.query=q;
			if (API.list[which]) {
				if (!params) params = {}; 
				API.list[which].params = params;
				var start;
				if (!params.start) start = (API.list[which].request.start ? API.list[which].request.start : 0);
				else start = params.start;
				API.start=start;
				API.list[which].params.start = start;
				
				if (!API.list[which].params.dis) API.list[which].params.dis = "api-disambig";
				if (!API.list[which].params.sel) API.list[which].params.sel = "select-screen";
				if (!API.list[which].params.screen) API.list[which].params.screen = "api-screen";
				
				//document.getElementById("api-disambig").innerHTML = "Loading...";
				//$(API.list[which].params.dis).innerHTML = "Loading...";
				var id=which;
				
				//check if need to redeclare callback
				if(API.list[which].redeclare) { eval(API.list[which].redeclare);}
				
				//build url
				var r = API.list[which].request;
				var url = r.url;
				
				var custom_modify = new Array();
				if(r.urlmodify && r.custom) {
					for (var i=0; i<r.custom.length; i++) {
						url = url.replace("$"+r.custom[i].param, r.params[r.custom[i].param]);
						custom_modify[r.custom[i].param]=1;
					}
				}
				
				if (r.params) {
					url += "?";
					for (param in r.params) {
						if (!custom_modify[param]) url += param + "=" + r.params[param] + "&";
					}
					url = url.substr(0, url.length-1);
				}
				if (r.search) {
					url += ((url.indexOf("?") > -1) ? "&" : "?") + r.search + "=" + encodeURIComponent(q);
				}
				if (r.next && start) 
                                    url += ((url.indexOf("?") > -1) ? "&" : "?")+r.next + "=" + (r.offset ? start+r.offset : start);
				
				oScript = document.getElementById(id); 
				var head = document.getElementsByTagName("head")[0];
				if (oScript) {  head.removeChild(oScript); }
				
				// Create object 
				oScript = document.createElement("script");
				
				oScript.setAttribute("src",url); 
				oScript.setAttribute("id",id); 
				head.appendChild(oScript);
				
				
				//document.getElementById("container").innerHTML = url + "<br/><br/>";
			}
			else {
				// need to handle for new case
				document.getElementById("api-disambig").innerHTML = which + " not found";
			}
		},
	"select":function(i, which) {
		if (!API.list[which].last_resultset || !API.list[which]) return false;
		
		var resp_str = "";
		var r_obj = API.list[which].last_resultset;
		var resp_hand = API.list[which].response;
		
		if (r_obj) {
			
			var cur_str = "<div class='api-data'>";
			cur_str+="<a href='javascript:API.processApiResult(API.list[\"" + which + "\"].last_resultset, \"" + which + "\");'>&lt; Back To Results</a>";
			var cur = r_obj[resp_hand.containerElement][i];
			
			var url = (resp_hand.url.field ? cur[resp_hand.url.field] : API.buildItemUrl(resp_hand.url.base, resp_hand.url.params, cur)); 
			cur_str += '<div id="api-url"><h4>Url</h4><input type="text" id="adv_add_url" value="' + url + '" onkeyup="$(\'advapi_prev_url\').innerHTML=this.value;"/></div>';
			cur_str += '<div id="api-title"><h4>Title</h4><input type="text" id="adv_add_title" value="' + ((cur[resp_hand.titleField] && cur[resp_hand.titleField]!="undefined") ? cur[resp_hand.titleField] : cur[resp_hand.backupTitle]) + '" onkeyup="$(\'advapi_prev_title\').innerHTML=this.value;"/></div>';
			cur_str += '<div id="api-summary"><h4>Summary</h4><textarea id="adv_add_blurb"   onkeyup="$(\'advapi_prev_blurb\').innerHTML=this.value;">';
			
			
			var desc_str = "";
			for (var j=0; j<resp_hand.contentFields.length; j++) {
				//curField = resp_hand.contentFields[j];
				//if (cur[curField.field] && cur[curField.field] != '' && curField.for_desc) desc_str += curField.prefix.replace(/\<([^\>]+)\>/g, "") + cur[curField.field].replace(/\<([^\>]+)\>/g, "") + curField.suffix.replace(/\<([^\>]+)\>/g, "");
				desc_str += API.processContentField(resp_hand.contentFields[j], cur, resp_hand, true);
			}
			
			cur_str += desc_str + '</textarea></div>';
			
			cur_str += '<div id="api-controls">'
					/*
					+'<input type="button" value="Save" onclick="API.addSiteAdvanced();API.processApiResult(API.list[\'' + which + '\'].last_resultset, API.list[\'' + which + '\']);"/>'
					+'<input type="button" value="Back" onclick="API.processApiResult(API.list[\'' + which + '\'].last_resultset, API.list[\'' + which + '\']);"/>'
					*/
					+'<input type="button" value="Save" onclick="API.addSiteAdvanced();API.processApiResult(API.list[\'' + which + '\'].last_resultset, \'' + which + '\');"/> '
					+'<input type="button" value="Back" onclick="API.processApiResult(API.list[\'' + which + '\'].last_resultset, \'' + which + '\');"/>'
				+'</div>';
				
			var prev_str = "<h4>Preview</h4>";
			prev_str += '<div class="description">'
				+'<div class="link-container clearfix">'
					+'<div class="link">'
						+'<a href="#" id="advapi_prev_title">'+((cur[resp_hand.titleField] && cur[resp_hand.titleField]!="undefined") ? cur[resp_hand.titleField] : cur[resp_hand.backupTitle])+'</a>'
					+'</div>'
					+'<div class="rating">'
						//+'<div style="display: block;" id="stars_10">'
						//	+'<img src="kt_files/star_on.gif" id="rating_10_1"/><img src="kt_files/star_on.gif" id="rating_10_2"/><img src="kt_files/star_on.gif" id="rating_10_3"/><img src="kt_files/star_on.gif" id="rating_10_4"/><img src="kt_files/star_on.gif" id="rating_10_5"/>'
						//+'</div>'
					+'</div>'
				+'</div>'
				+'<div class="blurb"><span id="advapi_prev_blurb">' + desc_str + '</span> '
				+ (desc_str!="" ? '<u>(<span id="i18n_246">more</span>)</u></span></div>' : '')
				+'<div class="other"><a class="url" id="advapi_prev_url">' + url + '</a></div>'
			+'</div>'
			+'<div class="annotation">'
				/*+'<div>'
					+'<div class="annotated-images">'
						+'<img src="http://farm1.static.flickr.com/223/454600180_0708287ba8_m.jpg" style="width:15%;">'
						+'<img src="http://farm4.static.flickr.com/3093/2578220544_94a9c90843_m.jpg" style="width:15%;">'
					+'</div>'
				+'</div>'*/
			+'</div>';
			
			resp_str += cur_str + prev_str + "</div>";
			
		}
		else resp_str = "error";
		
		
		document.getElementById("api-screen").innerHTML = resp_str;
		$("select-screen").hide();
		$("api-disambig").hide();
		$("api-screen").show();
		
		
	},
	"reload": function (which){
		if (API.list[which].request.custom) {
			for (var i=0; i<API.list[which].request.custom.length; i++) {
				if($("adv_api_" + API.list[which].request.custom[i].param)) API.list[which].request.params[API.list[which].request.custom[i].param] = $("adv_api_" + API.list[which].request.custom[i].param).value;
			}
		}
		if (API.list[which].request.search) API.query = $("api_adv_query").value;
		
		API.load(API.api, API.query)
	},
	"backToTop":function () {
		API.last_resultset=API.default_resultset;
		API.last_resphand=API.default_resphand;
		$('api-disambig').hide();
		$('api-screen').hide();
		$('select-screen').show();
	},
	"addSiteAdvanced": function() {
		// need to do some more form validation
		var url = $("adv_add_url").value;
		if(url == "") return;
		if(url.substr(0,10).indexOf("://") < 0) url = "http://" + url;
		
		if(url.length <= 10 || Q.urls[url]) {
			var added = $(""+Q.urls[url].id+"");
			if (added) alert("This result is already in the result set");
			return false;
		}
		
		url = url.replace(/\s/g,""); // no spaces, need better sanity than this 
		
		// added by jeff to test blocking adding urls that exist - 0623
		
		var h_p = getHostAndPath(url);
		
		if (Q.pages && Q.pages[h_p[0]] && Q.pages[h_p[0]][h_p[1]]) {
			var added = $(""+Q.pages[h_p[0]][h_p[1]].id+"");
			if (added) alert("This result is already in the result set");
			return false;
		}
		
		if (h_p[2] && Q.domains && Q.domains[h_p[2]] && Q.domains[h_p[2]][h_p[1]]) {
			var c_add = confirm("You are trying to add:\n" + url + "\n"+ "The following url exists in the results:\n" + results[Q.domains[h_p[2]][h_p[1]].id].url + "\n" + "Click OK to continue adding your result,\n" + "or Cancel if this is what you were trying to add");
			//alert("maybe you meant " + results[Q.domains[h_p[2]][h_p[1]].id].url + "?");
			if (!c_add) {
				var added = $(""+Q.domains[h_p[2]][h_p[1]].id+"");
				if (added) alert("This result is already in the result set");
				return false;
			}
		}
		
		var summary = $("adv_add_blurb").value;
		var title = $("adv_add_title").value;
	
		ktSave(Q,"add",{"url":url,"title":title,"summary":summary});
		var r = resultAdd(Q,url,title,summary,true);
		ktSave(Q,"edit",{"url":url,"title":title,"summary":summary});
		if(raddhints[r.url]){
			r.tytle = raddhints[r.url].tytle;
			r.summary = raddhints[r.url].summary;
			resultRender(r);
			ktSave(Q,"edit",{"url":r.url,"title":r.tytle,"summary":r.summary});
		}
		return false

	},
	"toggleResultDisplay":function(which, i) {
		$("api_res_" + which + "_" + i).toggle();
		if ($("api_tog_"+which+"_"+i).innerHTML==' + ') $("api_tog_"+which+"_"+i).innerHTML = ' - ';
		else $("api_tog_"+which+"_"+i).innerHTML = ' + ';
	},
	"start":0,
	"api":false,
	"query":false,
	"last_resultset":false,
	"last_resphand":false,
	"default_resultset":false,
	"default_resphand":false
}



function getCookie(name){
	var C = document.cookie.split("; ");
	for (i=0; i < C.length; i++)
	{
		kv = C[i].split("=");
		if(kv[0] == name){ return unescape(kv[1].replace(/\+/g, "%20")); }
	}
	return false;
}

