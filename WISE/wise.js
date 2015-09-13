var WISE = {

	//---------------------------------------
	//properties

	// list of apps will be added here as they get loaded in
	"apps":{},

	// Store a copy of the current query object here to keep in app scope
	"Q":false,

	// Some wise-apps will need this for getting to the php server
	"server":((typeof wise_server_to_use == "undefined") ? "" : wise_server_to_use),

	// current language of app
	"lang":false,

	// private objects to keep track of apps that are loaded, and whether the results for all apps in a query are hidden
	"loaded":{},
	"hidden":{},
	"cssloaded":{},
	"checkOnCloud":{"count":0,"cloudcount":0,"apps":{}},
	"q_categories":{},
	"message":getspan(""),

	//---------------------------------------
	// utility functions (kt functionality, getting/setting properties, etc

	// Some wise-apps will need this for getting relative time
	"getNowoffset":function(){return nowoffset},
	
	// wrapper for parent i18n function to handle translation of text in javascript
	"gettext":function(string){return gettext(string)},
	
	// a utility function to trim leading/trailing whitespace from a string
	// not sure why there is no native js function for this
	"trim":function(str) {
		return  str.replace(/^\s*/, "").replace(/\s*$/, "");
	},	
	"stripTags":function(str) {
		return  str.stripTags();
	},
	// utility function to decode utf8 text
	"utfdecode":function(text) {
		try{text = decodeURIComponent( escape( text ) );} catch (ex){}
		return text;
	},
	// utility function to encode utf8 text
	"utfencode":function(text) {
		try{text = encodeURIComponent( unescape( text ) );} catch (ex){}
		return text;
	},
	// function used in apps when suggested term matching is used, and matched term is passed as a parameter...
	// this function will check if a passed value is one of the items in the list. (see lastfm)
	"isOneOf":function(text, list) {
		var list_parts = list.split(";");
		for (var i=0; i<list_parts.length; i++) {
			if(text == list_parts[i]) return true;
		}
		return false
	},
	// need to call this before accessing the Q object in the apps... it will both set the WISE.Q value, and return the current Q
	"getQ":function() {
		this.Q = Q;
		return Q;
	},
	// get the current setting for the language to be used in the app
	"getLang":function() {
		this.lang = lang;
		return lang;
	},
	
	// these functions just expose KT functionality to the WISE objects
	"resultAdd":function(q,url,title,summary,top,master) {
		return resultAdd(q,url.escapeHTML(),title.escapeHTML(),summary,top,master);
	},
	"annAdd":function(r,type,obj) {
		
		if(type=="text") obj.sel = "<span id='wise_ann_" + r.id + "'>" + obj.sel + "</span>";
		
		annAdd(r,type,obj);
	},
	"annRender":function(r) {
		annRender(r);
	},
	"finalize":function(Q, id, r) {
		Q = this.getQ();
		reviewKT(Q);
		// if the id is passed, call the function to clear out the wise holder tag
		// this allows for subsequent calls to the app to reload the new data
		// found it necessary in opera/safari 
		if(id) this.clear(id);
		if(r) {
			this.addToList(id, r.id);
			//alert(r.id);
			this.getLoaded();
			
			//add about link
			about_html = "<div style='font-size:10px'><a href=\"javascript:void(0)\" onclick=\"$('about-" + id + "').toggle()\">"+getspan("About this Site")+"</a><div id=\"about-" + id + "\" style=\"padding-top:5px;display:none;\">" + this.getAboutApp(id) + "</div></div>";
			this.annAdd(r,"text",{"sel":about_html });
			this.annRender(r);
				var app_links = $(r.id).getElementsByTagName("a");
				for (var i=0; i<app_links.length; i++) {
					//if(app_links[i].getAttribute("onclick") && app_links[i].getAttribute("onclick").indexOf("rDel") >-1) {
					if($(app_links[i]).readAttribute("onclick") && $(app_links[i]).readAttribute("onclick").indexOf("rDel") >-1) {
						if (app_links[i].attachEvent) app_links[i].attachEvent("onclick", function (e){ WISE.delete_app(id, r.id); });
						else app_links[i].addEventListener("click", function (e){ WISE.delete_app(id, r.id); }, false);
					}
				}
		}
	},
	"deleted":{},
	"isDeleted":function(id) {
		this.getQ();
		if(this.deleted[this.Q.q.toLowerCase()] && this.deleted[this.Q.q.toLowerCase()][id]) return true;
		else return false;
	},
	"delete_app":function(id, result_id) {
		this.getQ();
		ktSave(WISE.Q,"wise",{"del":id});
		this.removeFromDisplay(id);
	},
	"removeFromDisplay":function(id) {
		if(this.loaded[this.Q.q.toLowerCase()] && this.loaded[this.Q.q.toLowerCase()][id] && this.loaded[this.Q.q.toLowerCase()][id].result) this.loaded[this.Q.q.toLowerCase()][id].result = (-1);
		this.getLoaded();
	},
	//---------------------------------------
	// wrapper to call the clear function without calling finalize (which will process KT... thats only at the end)
	"finalizenoreview":function(id) {
		this.clear(id);
	},
	"create":function(title, url, output, id, summary) {
		if( this.Q.q != Q.q ) return;
		if(!summary) summary = "";
		if(!this.apps[id].isPlayGround) {
			this.getQ();
			var r = WISE.resultAdd( WISE.Q,url,title,summary,true);
			WISE.annAdd(r,"text",{"sel":output});
			WISE.annRender(r);
			WISE.finalize(WISE.Q, id, r); // apply any possible KT stuff
			return r;
		}
		else {
			this.showPlaygroundResult(title, url, output, id, summary);
		}
	},
	"showPlaygroundResult":function(title, url, output, id, summary) {
		$("appoutput").innerHTML = "<div class='search-result'><div class='description'><div class='link-container clearfix'><div class='link'><a href='" 
		+ url + "'>" + title + "</a></div></div><div class='blurb'>" + summary + "</div><div class='other'><a class='url'>" + url + "</a></div></div></div>" 
		+ "<div class='annotation'><div><div class='annotated-text'>" + output + "</div></div></div></div>";
		this.clear(id);
		this.pgShow("output")
	},
	"pgShow":function(which) {
		if(which=="def") {
			$("appdef").rows = 15;
			$("appcode").rows = 1;
		}
		else if(which=="code") {
			$("appdef").rows = 1;
			$("appcode").rows = 15;
		}
	},
	// after we are done with the data that loads from the api, we need to clear out the script tag
	// opera/safari wont reload subsequent calls if we dont do this, and we aim to please all browsers
	"clear":function(id) {
		var i = document.getElementById("WISE_"+id);
		if (i) {
			var doc = null;
			if(i.contentDocument)  
				// Firefox, Opera  
				doc = i.contentDocument;  
			else if(i.contentWindow)  
				// Internet Explorer  
				doc = i.contentWindow.document;  
			else if(i.document)  
				// Others?  
				doc = i.document;
			if(doc == null)  
				throw "Document not initialized";

			try {
				/* here's where it gets a little tricky
				/ IE barfs if you try to add elements via the dom into these iframes once created (but not delete... weird)
				/ (not a problem here, but will be later if we try to re-add the script tag
				/ so............ we check if we can add an element (within a try block).  
				/ if not, must be IE, or some other browser that has the same problem, so we just forget it and handle differently in the call function (replace src)
				/ if yes, remove the dummy element that we just added (dont want to keep adding unnecessary stuff :) )
				/ then remove the script tag, confident that we will be able to re add it later
				*/
				var body = doc.getElementsByTagName("body");

				// macbre: extra check
				if (body && body.length > 0) {
					var t=document.createTextNode("t");
					body[0].appendChild(t);
					body[0].removeChild(t);
					body[0].removeChild(doc.getElementById("WISE_holder"));
				}
			}
			catch (ex) {}
		}
	},
	// we took away access to the parent outside of through the WISE object, but if we want functions/variables for post load event handling
	// we need to make them accessible via the WISE object.  so this function adds them to the object for the app being processed
	// can be accessed in event handlers via "WISE.apps.appname.funcname" or "WISE.apps.appname.varname"
	"scope":function(varname, val, id) {
		
		var app = this.apps[id];
		if (!app) return false; 
		app[varname] = val;
		return app[varname];
	},
	// same thing for accessing dom elements after the page loads... need aninterface through the WISE object
	// just a wrapper for the prototype $ function to get access to parent level elements later.
	"getElement":function(el) {
		return $(el);
	},
	"getBrowser":function() {
		try {return BrowserDetect;}
		catch (ex) {return false;}
	},
	//---------------------------------------
	// public functions
	//function to get called on search to check all regexes
	"scan":function(query, applist) {
		if(!applist) this.removeLoaded();

		// get query in WISE scope for later
		this.Q = Q;
		if(!applist && ((typeof wise_cloudcount == "undefined" || wise_cloudcount < 2))) this.checkOnCloud={"count":0,"cloudcount":0,"apps":{}};
		//check each app in array
		
		var app_list = (applist ? applist : this.apps);
		
		for(app in app_list) {
			var temp_query = false;
			var cur = WISE.apps[app];
			// check the query against each the regex for each object
			var matches = false;
			if (cur.regex) {
				matches = cur.regex.exec(query);
				if (matches) {
					// we cant pass params to the functions in the file being included,
					// but they can access an array stored here in the WISE object for the app
					cur.params = new Array();
					var param = (cur.param ? cur.param : 1);
					var q = false;
					// start at the first sub-match and go through all to see which is not undefined
					if (!cur.multimatch) {
						for (var i=param; i<matches.length; i++) {
							if (typeof matches[i]=="undefined") continue;
							q = matches[i];
							break;
						}
						// if its still false (no other matches), set it to matches[0] whole query because something matched
						if(!q) q=matches[0];
					}
					else {
						q = new Array();
						for (var m=0; m<cur.multimatch.length; m++) {
							q.push(matches[cur.multimatch[m]]);
						}
					}
					
					// run the specified action
					if(!this.isDeleted(cur.id)) this.autoRun(q, cur.id);
				}
			}
			// there's more than 1 way to trigger an app...
			// if not regex, then possibly number of words in the query, or base it off of the suggestions loaded up
			// from outside sites
			if(cur.othermatch && !matches) {
				// nothing matches yet... easier to start this way, and just flip to true on a match (it only takes 1)
				var doesMatch = false;
				var q = false;
				if (cur.othermatch && cur.othermatch.type) {
					switch (cur.othermatch.type.toLowerCase()) {
						// some apps like digg are triggered on something as simple as having less than 3 words
						// check that here
						case "numwords":
							var numparams = query.split(" ");
							if (cur.othermatch.moreless && cur.othermatch.moreless != ">") {
								doesMatch = numparams.length <  cur.othermatch.value;
							}
							else {
								doesMatch = numparams.length >  cur.othermatch.value;
							}
							q = query;
							break;
						// some apps get triggered if the suggestions that come back from the outside sites produce
						// certain terms that identify the type of query in some way
						case "suggest":
							// since the suggestions are getting loaded asynchronously from a 3rd party, we have to make sure
							// that they have loaded before we do this...
							// if they havent loaded by the time this scan function runs on the query (which is probably the case)
							// it gets called again as a callback when all of the sources load
							if(applist || (typeof wise_cloudcount != "undefined" && wise_cloudcount > 1)) {
								// get all of the links loaded into the suggestion cloud and load them into an object
								var cloud_suggestions = $("cloud").getElementsByTagName('a');
								var suggest_names = {};
								var sug_matches = cur.othermatch.keywords.split(";");
								for (var sug_i = 0; sug_i<cloud_suggestions.length; sug_i++) {
									suggest_names[cloud_suggestions[sug_i].innerHTML.replace("(", "").replace(")", "").toLowerCase()] = 1;
								}
								// check each item in the list of suggested terms for the app to see if that term
								// loaded as one of the suggestions
								for (var sug_j = 0; sug_j<sug_matches.length; sug_j++) {
									if(doesMatch) continue;
									// this section is for exact matching (default)
									if(!cur.othermatch.contains) {
										if(suggest_names[sug_matches[sug_j].toLowerCase()]) {
											doesMatch = true;
											// if the app specified that it wants to know which keyword it matched on, store that
											if(cur.othermatch.includeKeyword) {
												q = new Array();
												q.push(query);
												q.push(sug_matches[sug_j].toLowerCase());
												cur.multimatch=true;
											}
											else {
												q = query;
											}
											break;
										}
									}
									// this section is for inexact LIKE %foo% type matching (if specified)
									else {
										for(var thename in suggest_names) {
											if (doesMatch) continue;
											if(thename.indexOf(sug_matches[sug_j]) > -1) {
												doesMatch = true;
												// if the app specified that it wants to know which keyword it matched on, store that
												if(cur.othermatch.includeKeyword) {
													q = new Array();
													q.push(query);
													q.push(sug_matches[sug_j].toLowerCase());
													cur.multimatch=true;
												}
												else {
													q = query;
												}
												break;
											}
										}
									}
								}
							}
							else {
								this.checkOnCloud.apps[cur.id] = 1;
								this.checkOnCloud.count++;
							}
							break;
					}
				}
				//if we have a match run the app
				if (doesMatch && q && !this.isDeleted(cur.id)) {
					this.autoRun(q, cur.id);
				}
			}
		}
		// if no app list was passed in, then this was the first time the scan was run on, which means its a new query
		// therefore, set up the app box
		if(!applist) this.setAppBox();
		if(typeof wise_cloudcount != "undefined" && wise_cloudcount > 1) wise_cloudcount = 0;
	},
	// some wise tuples will categorize parts of the query...
	// we want to be able to run certain apps based on matching one or more categories in a query
	// for example, yelp is triggered if there is a "food" and a "place" in the query
	"cat_scan":function() {
		this.getQ();
		var cat_obj = this.q_categories[this.Q.q.toLowerCase()];
		var query = false;
		for (var id in this.apps) {
			var cur = this.apps[id];
			query = false;
			if (cur.categoryTriggers) {
				var cat_trig = cur.categoryTriggers.triggers.split(";");
				var triggerApp = true;
				for (var i=0; i<cat_trig.length; i++) {
					if(cat_trig[i].indexOf("|") > -1) {
						var cat_trig_parts = cat_trig[i].split("|");
						var temp_trigger = false;
						for (var j=0; j<cat_trig_parts.length; j++) {
							//alert(cat_obj[cat_trig_parts[j]]);
							if(cat_obj[cat_trig_parts[j]] && typeof cat_obj[cat_trig_parts[j]] != "undefined") {
								if(this.apps[id].categoryTriggers.exactMatch && cat_obj[cat_trig_parts[j]] == this.Q.q.toLowerCase()) {
									temp_trigger = true;
									query = this.Q.q;
								}
								else if(!this.apps[id].categoryTriggers.exactMatch) {
									temp_trigger = true;
									query = cat_obj[cat_trig_parts[j]];
								}
							}
						}
						if (!temp_trigger) triggerApp = false;
					}
					else {
						if(!cat_obj[cat_trig[i]] || typeof cat_obj[cat_trig[i]] == "undefined") triggerApp = false;
						else {
							if(this.apps[id].categoryTriggers.exactMatch && cat_obj[cat_trig[i]] == this.Q.q.toLowerCase()) {
								query = this.Q.q;
							}
							else if(!this.apps[id].categoryTriggers.exactMatch) {
								query = cat_obj[cat_trig[i]];
							}
						}
					}
					
				}
				//query = ((this.apps[id].categoryTriggers.fuzzyMatch && typeof this.apps[id].categoryTriggers.fuzzyMatch != "undefined")  ? this.Q.q : query);
				//alert(query);
				if(triggerApp && !this.isDeleted(id) && query) {
					//alert("running: " + id + " " + query + " " + this.apps[id].categoryTriggers.exactMatch);
					WISE.run(query, id);
				}
			}
		}
	},
	"autoRun":function(q,which) {
		if(WISE.apps[which].app_blacklist) {
			for (var i=0; i<WISE.apps[which].app_blacklist.length; i++) {
				if(WISE.apps[WISE.apps[which].app_blacklist[i]].regex) {
					var matches = WISE.apps[WISE.apps[which].app_blacklist[i]].regex.exec(this.Q.q);
					if(matches){
						return false;
					}
				}
			}
		}
		this.run(q, which);
	},
	//the generic function to be called on both regular and generic apps, to determine what to call to run it
	"run":function(q, which) {
		if (WISE.apps[which]) {
			
			if (!WISE.check_lang(which)) return false;
			
			if (WISE.apps[which].gen_obj) WISE.generic.load(q, which);
			else if(WISE.apps[which].urlreplace) this.run_urlreplace(q, which);
			else this.run_reg(q, which);
		}
	},
	// if you clicked on this application in the menu of apps, we need to handle it slightly differently
	// as the app will load in a lighbox preview first... this is just a wrapper to add that functionality
	"menuRun":function(q, which) {
		if (WISE.apps[which]) {
			
			if (!WISE.check_lang(which)) return false;
			WISE.loadedFromMenu[which] = true;

			this.run(q, which);
			this.loadToLightBox(which, true);
		}
	},
	
	// not currently used :(
	// function that will change the display of all wise apps to either show or hide the annotations... called on click of (-)/(+)
	"toggleAll":function() {
		if (this.loaded[this.Q.q.toLowerCase()]) {
			for(var id in this.loaded[this.Q.q.toLowerCase()]) {
				if (this.loaded[this.Q.q.toLowerCase()][id] && this.loaded[this.Q.q.toLowerCase()][id].result && parseInt(this.loaded[this.Q.q.toLowerCase()][id].result) > -1) {
					if(this.hidden[this.Q.q.toLowerCase()]) {
						if($("wise_ann_" + parseInt(this.loaded[this.Q.q.toLowerCase()][id].result))) {
							$("wise_ann_" + parseInt(this.loaded[this.Q.q.toLowerCase()][id].result)).show();
							//$("wise_ann_show_" + parseInt(this.loaded[this.Q.q.toLowerCase()][id].result)).hide();
						}
					}
					else {
						if($("wise_ann_" + parseInt(this.loaded[this.Q.q.toLowerCase()][id].result))) {
							$("wise_ann_" + parseInt(this.loaded[this.Q.q.toLowerCase()][id].result)).hide();
							//$("wise_ann_show_" + parseInt(this.loaded[this.Q.q.toLowerCase()][id].result)).show();
						}
					}
				}
			}
			if(this.hidden[this.Q.q.toLowerCase()]) $("wise_toggle_link").innerHTML = "(-)";
			else $("wise_toggle_link").innerHTML = "(+)";
			
			this.hidden[this.Q.q.toLowerCase()] = !this.hidden[this.Q.q.toLowerCase()];
			
		}
	},
	// added line to main.js to handle this on switching queries. 
	// (will remove all loaded from the display, not from the object) and refill it with loaded apps from current query
	"getLoaded":function() {
		this.removeLoaded();
		this.getQ();
		var numResults = 0;
		if (this.loaded[this.Q.q.toLowerCase()]) {
			for(var id in this.loaded[this.Q.q.toLowerCase()]) {
				if(!WISE.apps[id].hideDisplay && this.loaded[this.Q.q.toLowerCase()][id].result > -1) {
					this.doAddDisplay(id);
					numResults++;
				}
			}
		}
		if(!numResults) {
			this.doAddDisplay();
		}

	},
	// some functions will need to include a file in their code to access external functions
	// this needs to be tested to make sure that the scope is ok
	"require":function(url, opt) {
		// document.write('<script type="text/javascript" src="'+url+'"><\/script>');
		var i = document.createElement('script');
		i.setAttribute("src", url);
		document.getElementsByTagName('head')[0].appendChild(i);
		
		if(opt){
			if(opt.onload){
				Event.observe(i, 'load', opt.onload);
			}
		}
		
	},
	// we need to have a way to load the js file with the app functions dynamically
	// it should be in its own iframe where the results can load and be within the same scope as the code 
	"include":function(url, id) {
		// create the iframe container for this app
		cur = this.apps[id];
		if($("WISE_"+id)) {
			var i = $("WISE_"+id);
		}
		else {
			var i = document.createElement('iframe');
			i.style.display="none";
			if (id) {
				i.setAttribute("id", "WISE_"+id);
				i.setAttribute("name", "WISE_"+id);
			}
			document.getElementsByTagName('head')[0].appendChild(i);
		}
		var doc = null;  
		    if(i.contentDocument)  
		       // Firefox, Opera  
		       doc = i.contentDocument;  
		    else if(i.contentWindow)  
		       // Internet Explorer  
		       doc = i.contentWindow.document;  
		    else if(i.document)  
		       // Others?  
		       doc = i.document;  
		   
		    if(doc == null)  
		       throw "Document not initialized";  
		
		// write out the document for the iframe container... 
		doc.open();
		doc.write("<head>");
		//set some initial vars, block access to parent/top
		//doc.write("<script type=\"text/javascript\">var WISE = parent.WISE;var thisApp=WISE.apps."+id+";try{parent=null;top=null;}catch(parent_ex){}WISE.clear(thisApp.id);</script>");
		doc.write("<script type=\"text/javascript\">var WISE = parent.WISE;var thisApp=WISE.apps."+id+";WISE.clear(thisApp.id);</script>");
		// include the appropriate wise file here (the file with the code for this app)
		if (!this.apps[id].inlineCode) doc.write("<script type=\"text/javascript\" src=\"" + url + "\" defer=\"defer\"></script>");
		else doc.write("<script type=\"text/javascript\">" + this.apps[id].inlineCode + "</script>");
		
		this.apps[id].inlineCode = false;
		
		doc.write("</head>");
		// set up the body with the onload function to call the specified action function and create the holder for calloutscripts
		doc.write("<body onload='WISE.load_css(\"" + id + "\");" + ((cur.action)? cur.action + "();'":"'") + "><script type='text/javascript' id='WISE_holder'></script></body>");
		doc.close();
		
	},
	// we will need to get the data from the external site, and here's how
	"call":function(url,id) {
		// at this point, we already have the iframe container created... lets use it
		var i = document.getElementById("WISE_"+id);
			// get access to the iframe document
			var doc = null;
			    if(i.contentDocument)  
			       // Firefox, Opera  
			       doc = i.contentDocument;  
			    else if(i.contentWindow)  
			       // Internet Explorer  
			       doc = i.contentWindow.document;  
			    else if(i.document)  
			       // Others?  
			       doc = i.document;
			
			   
			    if(doc == null)  
			       throw "Document not initialized";  
			    // if the script holder exists and there is already a value for the src
			    // (this will only ever happen on a second call in IE.. we just replace the src rather than delete and re-add the node)
			    // IE--  anyway, its not just enough to handle it differently, we need to put in a 100 millisecond delay to make it work :(
			    if(doc.getElementById("WISE_holder") && doc.getElementById("WISE_holder").src) {
					if (doc.getElementById("WISE_holder").addEventListener) doc.getElementById("WISE_holder").addEventListener("load", function(){setTimeout(function(){if(WISE.loadedFromMenu[id]) {WISE.loadToLightBox(id);}}, (WISE.apps[id].loadCheckDelay ? WISE.apps[id].loadCheckDelay : 500))}, false);
					else if(doc.getElementById("WISE_holder").readyState) WISE.loadCheckers[id]=setInterval(function(){if (doc.getElementById("WISE_holder").readyState == "loaded"){clearInterval(WISE.loadCheckers[id]); if(WISE.loadedFromMenu[id]) {WISE.loadToLightBox(id);}}}, (WISE.apps[id].loadCheckDelay ? WISE.apps[id].loadCheckDelay : 500));
					setTimeout(function() {doc.getElementById("WISE_holder").src=url;}, 100);
			    }
			    // in every other case :)
			    else {
				// if the WISE holder doesnt exist (this is in subsequent calls to this function in every browser but IE
				if(!doc.getElementById("WISE_holder")) {
					// re-create the element and add it to the body of the doc in the iframe
					var s = document.createElement("script");
					s.setAttribute("id", "WISE_holder");
					s.setAttribute("defer", true);
					s.setAttribute("type", "text/javascript");
					doc.getElementsByTagName("body")[0].appendChild(s);
					
				}
				if (doc.getElementById("WISE_holder").addEventListener) doc.getElementById("WISE_holder").addEventListener("load", function(){setTimeout(function(){if(WISE.loadedFromMenu[id]) {WISE.loadToLightBox(id);}}, (WISE.apps[id].loadCheckDelay ? WISE.apps[id].loadCheckDelay : 500))}, false);
				else 
					if(doc.getElementById("WISE_holder").readyState) 
						WISE.loadCheckers[id]=setInterval(function(){
							if (doc.getElementById("WISE_holder").readyState == "loaded"){clearInterval(WISE.loadCheckers[id]); if(WISE.loadedFromMenu[id]) {WISE.loadToLightBox(id);}}}, (WISE.apps[id].loadCheckDelay ? WISE.apps[id].loadCheckDelay : 1500));

				// otherwise, its the first time, we created the script tag earlier and its there, so give it a src
				doc.getElementById("WISE_holder").src=url;
			    }
	},
	// object to hold on to the interval variable used in the IE version of checking to see if the app has loaded when loaded from the menu
	// need to know when we have something to display in the lightbox.
	"loadCheckers":{},
	// object to temporarily keep trackof apps that were loaded from the menu, so that when they load up, we know whether to use the lightbox or not
	"loadedFromMenu":{},"loadedFromMenuPersistent":{},
	// function to load to lightbox
	"loadToLightBox":function(id, loading) {
		// temp var... start false, set to true if true
		var wasLoadedFromMenu = false;
		// if it was loaded from menu, set temp var to true, set attr of object back to false
		if(WISE.loadedFromMenu[id]) {
			wasLoadedFromMenu = true;
			if(!loading) WISE.loadedFromMenu[id] = false;
		}
		
		WISE.getQ();
		if( !WISE.loadedFromMenuPersistent[WISE.Q.q]) WISE.loadedFromMenuPersistent[WISE.Q.q] =  {};
		
		if( wasLoadedFromMenu && !WISE.loadedFromMenuPersistent[Q.q][id] ){
			WISE.loadedFromMenuPersistent[WISE.Q.q][id] = true
		}
		
		// keep global list of loadedfrommenu
		
		// check if it loaded results or not
		var result_id = WISE.thisHasResults(id);
		var clone;
		var hasResults = false;
		var wasDeleted = false;
		var wasDeletedLink = 0;
		// if it has a result div id (numerical, possibly equal to 0) and that div exists... (then we have results to display)
		if((result_id || result_id==0) && $(result_id)) {
			hasResults = true;
			wasDeleted = $(result_id).hasClassName("deleted");
			if(wasDeleted) {
				//alert("true");
				var app_links = $(result_id).getElementsByTagName("a");
				//alert(app_links.length);
					for (var i=0; i<app_links.length; i++) {
						//if(app_links[i].getAttribute("onclick") && app_links[i].getAttribute("onclick").indexOf("rUnDel") >-1) {
						if($(app_links[i]).readAttribute("onclick") && $(app_links[i]).readAttribute("onclick").indexOf("rUnDel") >-1) {
							wasDeletedLink = app_links[i];
						}
					}
				wasDeleted = ""+result_id+"";
				if(!wasDeletedLink) wasDeletedLink = app_links[0];
				$(result_id).removeClassName("deleted");
				
				
			}
			// if it was hidden before (from previous load to lightbox, show it (we dont want to clone a hidden node
			//$(result_id).show();
			// clone the result and all of its children... that sounds more evil than it is
			clone = $(result_id).cloneNode(true);
			// change the id and some of the formatting params of the new cloned node
			if(clone.id && clone.id == result_id) clone.setAttribute("id", result_id + "_lightbox");
			var prev_divs = clone.getElementsByTagName("div"); 
			for (var i=0; i<prev_divs.length; i++) {
				if (prev_divs[i].getAttribute("class") == "actions") {
					$(prev_divs[i]).hide();
				}
				else if (prev_divs[i].getAttribute("class") == "url" || prev_divs[i].getAttribute("class") == "annotation" || prev_divs[i].getAttribute("class") == "description") {
					$(prev_divs[i]).style.width="90%";
				}
			}
			// and if this was just loaded from the menu for the first time, dont show in the results unless told to
			//if(wasLoadedFromMenu) $(result_id).hide();
		}
		// if no results, we still need to show a div saying that nothing loaded... create that node instead
		else {
			if(loading) {
				clone = document.createElement("div");
				clone.innerHTML = getspan("Loading...");
			}
			else {
				clone = document.createElement("div");
				clone.innerHTML = getspan("This site does not display any results for this search term.  Please try another site.");
			}
		}
			// set up lightbox
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
			// clear out lightbox in case there was anything in it from before
			if (document.getElementById("dialog-window")) {
				if ($("dialog-window").hasChildNodes()) {
					while($("dialog-window").childNodes.length >= 1) {
						$("dialog-window").removeChild($("dialog-window").firstChild);
					}
				}
				var preview_app = $("dialog-window");
			}
			else {		
				var preview_app = document.createElement("div");
				preview_app.setAttribute("id", "dialog-window");
				document.body.appendChild(preview_app);
				
			}
			
			preview_app.style.position = "absolute";
			var boxWidth = 700;
			preview_app.style.left = Math.floor((document.viewport.getWidth() - boxWidth)/2) + "px";
			preview_app.style.width = boxWidth + "px";
			preview_app.style.textAlign = "left";
			preview_app.style.margin = "auto";
			preview_app.style.zIndex = 100;

			//title and message
			var titlediv = document.createElement("h2");
			titlediv.style.margin = "0 0 10px 0";
			titlediv.style.padding = "0";
			titlediv.innerHTML = (WISE.apps[id].name ? WISE.apps[id].name : id);

			// add parts to box
			// first link to close box (need one of those)
			var closediv = document.createElement("div");
			closediv.style.fontSize = "10px";
			//closediv.style.cssFloat = "right";
			closediv.style.cssFloat = "right";
			closediv.style.styleFloat = "right";
			
			
			var scroll = document.createElement("a");
			$(scroll).addClassName("wise_link");
			if (scroll.attachEvent) {
				scroll.attachEvent("onclick", function (e){ WISE.hideLightBox();$( WISE.thisHasResults( id ) ).scrollTo() });
			}
			else {
				scroll.addEventListener("click", function (e){ WISE.hideLightBox();$( WISE.thisHasResults( id ) ).scrollTo() }, false);
			}
			scroll.innerHTML = "Go to Result";
			closediv.appendChild(scroll);
			
			var del = document.createElement("span");
			del.innerHTML = " | ";
			closediv.appendChild(del);
			
			var close = document.createElement("a");
			$(close).addClassName("wise_link");
			if (close.attachEvent) {
				close.attachEvent("onclick", function (e){ WISE.hideLightBox(); });
			}
			else {
				close.addEventListener("click", function (e){ WISE.hideLightBox(); }, false);
			}
			close.innerHTML = getspan("Close");
			closediv.appendChild(close);
			
			// add the div withthe link to close and the div with the content (result or not) to the box
			$("dialog-window").appendChild(closediv);
			$("dialog-window").appendChild(titlediv);
			
			// if we detected results before, we have to add some other featurs/options
			if(hasResults) {
				
				// add text/link to save the result to KT 
				adddiv = document.createElement("div");
				addspan = document.createElement("span");
				
				//style adddiv
				adddiv.style.margin = "0 0 10px 0";
				adddiv.style.color = "#888";
				
				if(  WISE.loadedFromMenuPersistent[WISE.Q.q][id] ){
				addspan.innerHTML = "<img src=\"images/plus.png\" style='vertical-align:text-bottom'> ";

					var addlink = document.createElement("a");
					//addlink.className = "wise_link";
					$(addlink).addClassName("wise_link");
					addlink.innerHTML = "<u>"+getspan("Add this site")+"</u>"
					if (addlink.attachEvent) {
						addlink.attachEvent("onclick", function (e){ WISE.save(id, wasDeleted, wasDeletedLink); WISE.hideLightBox(); });
					}
					else {
						addlink.addEventListener("click", function (e){ WISE.save(id, wasDeleted, wasDeletedLink); WISE.hideLightBox(); }, false);
					}
				}else{
					addspan.innerHTML = "<img src=\"images/tick.png\" style='vertical-align:text-bottom'> ";
					var addlink = document.createElement("span");
					addlink.innerHTML = getspan("This site always loads for this search result");
				}

				adddiv.appendChild(addspan);
				adddiv.appendChild(addlink);
				$("dialog-window").appendChild(adddiv);
			}
			
			$("dialog-window").appendChild(clone);
			$("dialog-window").style.display="block";
		
		// do lightboxy stuff
		document.body.style.overflow="hidden";
		window.scroll(0,0);
	
	},
	// clear out stuff from the box, and hide it
	"hideLightBox":function() {
		if ($("dialog-window").hasChildNodes()) {
			while($("dialog-window").childNodes.length >= 1) {
				$("dialog-window").removeChild($("dialog-window").firstChild);
			}
		}
		if (document.getElementById("dialog-window")) document.getElementById("dialog-window").style.display = "none";
		if (document.getElementById("dialog-lightbox")) document.getElementById("dialog-lightbox").style.display = "none";
		document.body.style.overflow="auto";
	},
	// load up the info from the app def for everyone to see
	"getAboutApp":function( id ){
		about = "";
		if( WISE.apps[id].description ) {
		    about += "<div><b>"+getspan("Description")+"</b>: " + getspan(WISE.apps[id].description) + "</div>";
		}
		if( WISE.apps[id].author ) {
		    about += "<div><b>"+getspan("Author")+"</b>: " + WISE.apps[id].author + "</div>";
		}
		return about;
	},
	//---------------------------------------
	// private functions (not that they are actually private right now, but they are only called from other WISE code
	
	// function to load css classes for each app;
	"save":function (id, wasDeleted, wasDeletedLink){
		WISE.getQ();
		WISE.loadedFromMenuPersistent[WISE.Q.q][id] = false;
		ktSave(WISE.Q,"wise",{"app":id});
		$( WISE.thisHasResults( id ) ).scrollTo()
		if (wasDeleted && wasDeletedLink) rUnDel(wasDeleted, wasDeletedLink);
	},
	// css for WISE in general, and for each app is defined in the js
	// crate the necessary classes as each loads, and remember that it was already loaded, so as to not load again
	"load_css":function(id){
		try{
			// if there is not already a stylesheet to be used for wise (first time this gets created)
			if(!$("wise_stylesheet")) {
				var wise_style = document.createElement("style");
				wise_style.setAttribute("id", "wise_stylesheet");
				wise_style.setAttribute("type", "text/css");
				document.body.appendChild(wise_style);
				wise_style = document.styleSheets[document.styleSheets.length-1];
			}
			else {
				var wise_style = document.styleSheets[document.styleSheets.length-1];
			}
		}
		catch(ex){
			//alert(ex.message);
		}
		
		// if there is no id, this is the main WISE stylesheet... set the id to WISE
		var has_id = true;
		if(!id) { 
			id="WISE";
			has_id = false;
		}
		if(this.cssloaded[id]) {
			return;
		}
		// get the app specific css, or the main WISE css 
		var the_css = (has_id ? WISE.apps[id].css : WISE.css)
		if(the_css) {
			try{
				var app_css = the_css;
				//cycle through all of the classes
				for(var selector in app_css) {
					var property = "";
					// cycle through each property for the class
					for (var each_prop in app_css[selector]) {
						property += each_prop + ": " + app_css[selector][each_prop] + "; ";
					}
					// create the selector for the class... put wise at the beginning, and then the appname if its an app
					// we dont want any regular css to get overwritten here, so we prepend the appname
					selector = ".wise_" + (has_id ? id + "_" : "") + selector;
					// add it in, and of course be nice to all browsers that handle it differently
					if (wise_style.insertRule) {
						wise_style.insertRule(selector + '{' + property + '}', wise_style.cssRules.length);
					}
					if (wise_style.addRule){
						wise_style.addRule(selector, '{' + property + '}');
					}
				}
			}
			catch(ex) {
				//alert(ex.message);
			}
		}
		this.cssloaded[id] = true;
	},
	// private function for checking if an app is used for that language
	"check_lang": function (which, language) {
		var cur = WISE.apps[which]
		
		if(!language && typeof lang == "undefined") return false;
		
		if(!language && typeof lang != "undefined") language = lang;
		
		if(cur.lang && cur.lang.indexOf(language) == -1) return false;
		else return true;
	},
	"run_urlreplace":function(query, which) {
		if (!WISE.check_lang(which)) return false;
		var cur = WISE.apps[which];

		var temp_q = query;
		if(cur.urlreplace.lowercase) temp_q = temp_q.toLowerCase();
		if(cur.urlreplace.uppercase) temp_q = temp_q.toUpperCase();
		if(cur.urlreplace.spacechar) temp_q = temp_q.replace(" ", cur.urlreplace.spacechar);
		
		var url = cur.appurl.replace("$1", temp_q);
		var title = cur.apptitle.replace("$1", query);
		var summary = cur.appsummary.replace("$1", query);
		var output = "";
		
		if(this.isLoaded(which)) return false;
		else this.addToList(which);
		
		this.create(title, url, output, cur.id, summary);
		

	},
	// a private function called by the run function if the app is a regular app with its own file
	// called from generic wrapper function run (or menu_run)
	"run_reg":function(query, which) {

		if (!WISE.check_lang(which)) return false;

		var cur = WISE.apps[which];
		
		if(this.isLoaded(which)) return false;
		else this.addToList(which);
		
		// we created a params array before.  push the query in as a param.  (its the only one we have for now :( )
		
		cur.params = new Array();
		
		if (cur.multimatch) cur.params = query;
		else cur.params.push(query);
		// use some dynamic iframe magic to load up the file that contains the code
		this.include(cur.url, cur.id);
	},
	// private function to check if an app has been loaded or not, in order to not re-load the same app
	"isLoaded":function(id) {
		if(this.apps[id].isPlayGround) return false;
		
		this.getQ();
		if(this.loaded[this.Q.q.toLowerCase()] && this.loaded[this.Q.q.toLowerCase()][id]) return true;
		else return false;
	},
	// private function to check if an app has been loaded or not, in order to not re-load the same app
	"previewById":function(id) {
		this.getQ();
		if(this.loaded[this.Q.q.toLowerCase()] && this.loaded[this.Q.q.toLowerCase()][id] && this.loaded[this.Q.q.toLowerCase()][id].result!=-1)  this.loadToLightBox(this.loaded[this.Q.q.toLowerCase()][id].result);
		else return false;
	},
	// private function to check if an app has been loaded or not, in order to not re-load the same app
	"thisHasResults":function(id) {
		this.getQ();
		if(this.loaded[this.Q.q.toLowerCase()] && this.loaded[this.Q.q.toLowerCase()][id] && this.loaded[this.Q.q.toLowerCase()][id].result!=-1)  return this.loaded[this.Q.q.toLowerCase()][id].result;
		else return false;
	},
	// private function that on calling/rendering of an app adds/modifies it in the list of loaded apps
	"addToList":function(id, result) {
		this.getQ();
		if(!this.loaded[this.Q.q.toLowerCase()]) this.loaded[this.Q.q.toLowerCase()] = {};
		this.loaded[this.Q.q.toLowerCase()][id] = {"result": (typeof result != "undefined" ? result : -1)};
		
		if(result && !WISE.apps[id].hideDisplay) this.doAddDisplay(id);
		
	},
	// private function that will add the name of the app to the displayed list of added apps shown in the appbar at top
	"doAddDisplay":function(id) {
		if($("wise_appbar") && $("wise_appload")) {
			if(id) {
				// if the app loaded, and there are results, attach onclick and show the link with the app name
				if (this.loaded[this.Q.q.toLowerCase()][id] && this.loaded[this.Q.q.toLowerCase()][id].result && parseInt(this.loaded[this.Q.q.toLowerCase()][id].result) > -1) {
					this.getQ();
					var addApp = document.createElement("a");
					addApp = $(addApp);
					addApp.setAttribute("id", "appbar_"+id);
					if (addApp.attachEvent) {
						addApp.attachEvent("onclick", function (e){ $(WISE.thisHasResults(id)).scrollTo(); });
					}
					else {
						addApp.addEventListener("click", function (e){ $(WISE.thisHasResults(id)).scrollTo(); }, false);
					}
					//addApp.style.color = "#0000FF";
					addApp.style.cursor = "pointer";
					
					addApp.innerHTML = ((WISE.apps[id].logo)?"<img src='"+WISE.apps[id].logo+"' width=\"16\" height=\"16\"/> ": "") + (WISE.apps[id].name ? WISE.apps[id].name : id)
					addApp.style.margin = "0 5px";
					
					// update the number of apps that have loaded in the display
					var count = this.hasResults();
					//$("wise_appcount").innerHTML = "| " + count + " " +  " Loaded"
					//$("wise_appcount").innerHTML = "| " + count + " App" + (count>1 ? "s":"") + " Loaded"
					$("wise_appload").appendChild(addApp);
				}
			}
			else {
				var addApp = document.createElement("span");
				addApp = $(addApp);
				addApp.setAttribute("id", "wise_noresults");
				
				addApp.innerHTML = getspan("No sites loaded");
				addApp.style.margin = "0 5px";
				
				$("wise_appload").appendChild(addApp);
			}
			
		}
	},
	// private function that will return if a given query has any apps that have returned results and are displayed
	"hasResults":function(q) {
		if (!q) q = this.getQ().q;
		var count = 0;
		if (this.loaded[q.toLowerCase()]) {
			for(var id in this.loaded[q.toLowerCase()]) {
				if(this.loaded[q.toLowerCase()][id].result > -1) count++;
			}
		}
		return count;
	},
	
	// private function that steps through the appload display object and removes all children (and toggle link if present)
	"removeLoaded":function() {
		if ($("wise_appload")) {
			if ( $("wise_appload").hasChildNodes() ) {
				while ( $("wise_appload").childNodes.length >= 1 )
				{
					$("wise_appload").removeChild( $("wise_appload").firstChild );       
				} 
			}
		}
		if ($("wise_appcount")) {
		    $("wise_appcount").innerHTML = "| 0 "+getspan("Loaded");
		}
	},
	// cool function that someone else wrote but we modified to handle mouse scrollwheel actions
	"getWheel":function(e) {
		var delta = 0;
		if (!e) /* For IE. */
			e = window.event;
		if (e.wheelDelta) { /* IE/Opera. */
			delta = e.wheelDelta/120;
			/** In Opera 9, delta differs in sign as compared to IE.
			 */
			//if (window.opera) delta = -delta;
		} else if (e.detail) { /** Mozilla case. */
			/** In Mozilla, sign of delta is different than in IE.
			 * Also, delta is multiple of 3.
			 */
			delta = -e.detail/3;
		}
		/** If delta is nonzero, handle it.
		 * Basically, delta is now positive if wheel was scrolled up,
		 * and negative, if wheel was scrolled down.
		 */
		 if (delta) {
			var tb = e.target || e.srcElement;
			if(tb.parentNode.id.indexOf("wise-") == -1) tb = tb.parentNode;
			if(WISE.activecat && tb.parentNode.id=="wise-apps") this.scrollapps(delta, tb.parentNode, WISE.activecat);
			else this.scrollapps(delta, tb.parentNode);
		 }
		/** Prevent default actions caused by mouse wheel.
		 * That might be ugly, but we handle scrolls somehow
		 * anyway, so don't bother here..
		 */
		if (e.preventDefault)
			e.preventDefault();
		e.returnValue = false;
		
	},
	// all the app links for themenu (created in the setAppBox funcion)
	"applinks":new Array(),
	// all the category links for themenu (created in the setAppBox funcion)
	"appcatlinks":new Array(),
	// will hold the list of applinks for each category in here
	"appcategories":{},
	// keeps track of what the first item displayed in the menu is (each category has its own also
	"applinkstart":0,
	// how many app links to display in each column of the menu
	"applinksshow":5,
	// which category is being displayed currently... will get set to "All" on load 
	"activecat":false,
	// timer for settimeout of mouseover of scroll item
	"scrolltimer":false,
	// function to load all of the apps in tothe menu (on load and on change of category
	"loadscrollapps":function(appbox, category) {
		// get apps or categories
		if(!appbox) appbox = $("wise-categories");
		else appbox = $(appbox);
		// get scroll buttons div for apps or categories
		var appbox_scroll = $(appbox.id + "-scroll"); 
		
		// if its not a specific category, then get the category list
		if(!category) var app_array = this.appcatlinks;
		else var app_array = this.appcategories[category].apps;
		
		// clear old stuff out
		if (appbox.hasChildNodes()) {
			while(appbox.childNodes.length >= 1) {
				appbox.removeChild(appbox.firstChild);
			}
		}
		// clear old stuff out of the scroll divs also
		if (appbox_scroll.hasChildNodes()) {
			while(appbox_scroll.childNodes.length >= 1) {
				appbox_scroll.removeChild(appbox_scroll.firstChild);
			}
		}
		// create the header, either for the category list or for the app list
		var applink = document.createElement("div");
		applink = $(applink);
		applink.setAttribute("class", "wise_listheader");
		if(!category) {
			applink.innerHTML = getspan("Categories");
		}
		else {
			// FIXME: Use sprintf() and ngettext() here:
			if(category == "All") applink.innerHTML = "All " + app_array.length + " " + " Site" + (app_array.length > 1 ? "s" : "");
			else applink.innerHTML = app_array.length + " " + category + " Site" + (app_array.length > 1 ? "s" : "");
		}
		appbox.appendChild(applink);
		
		
		// add each of the links and set them all to be shown to start
		for (var i=0; i<app_array.length; i++) {
			appbox.appendChild(app_array[i]);
			$(app_array[i].id).show()
		}
		// since we are loading here, we will start from 0 and display the numerb set in the spplinkshow param
		// so therefore, start at that number, and hide everything from there on
		for (var i=this.applinksshow; i<app_array.length; i++) {
			$(app_array[i].id).hide();
		}	
		
		// if there are more apps to show than we are allowing to display, we will need scroll buttons
		// for those people who dont have a mouse with a scroll wheel :(
		// it will scroll on mouseover as well as on click
		if(app_array.length > this.applinksshow) {
			
			var applink = document.createElement("a");
			//applink.className = "wise_applink wise_scrollbutton";
			$(applink).addClassName("wise_applink wise_scrollbutton");
			applink.innerHTML = "&#9650;";
			if (applink.attachEvent) {
				applink.attachEvent("onclick", function (e){ WISE.scrollapps(1, appbox, category); });
				//applink.attachEvent("onmouseover", function (e){ WISE.scrolltimer = setInterval(function(){WISE.scrollapps(1, appbox, category);}, 200); });
				//applink.attachEvent("onmouseout", function (e){ clearInterval(WISE.scrolltimer); });
			}
			else {
				applink.addEventListener("click", function (e){ WISE.scrollapps(1, appbox, category);}, false);
				//applink.addEventListener("mouseover", function (e){ WISE.scrolltimer = setInterval(function(){WISE.scrollapps(1, appbox, category);}, 200); }, false);
				//applink.addEventListener("mouseout", function (e){ clearInterval(WISE.scrolltimer); }, false);

			}
			appbox_scroll.appendChild(applink);
			
			
			var applink = document.createElement("a");
			//applink.className = "wise_applink wise_scrollbutton";
			$(applink).addClassName("wise_applink wise_scrollbutton");
			applink.innerHTML = "&#9660;";
			if (applink.attachEvent) {
				applink.attachEvent("onclick", function (e){ WISE.scrollapps(-1, appbox, category); });
				//applink.attachEvent("onmouseover", function (e){ WISE.scrolltimer = setInterval(function(){WISE.scrollapps(-1, appbox, category);}, 200); });
				//applink.attachEvent("onmouseout", function (e){ clearInterval(WISE.scrolltimer); });
			}
			else {
				applink.addEventListener("click", function (e){ WISE.scrollapps(-1, appbox, category);}, false);
				//applink.addEventListener("mouseover", function (e){ WISE.scrolltimer = setInterval(function(){WISE.scrollapps(-1, appbox, category);}, 200); }, false);
				//applink.addEventListener("mouseout", function (e){ clearInterval(WISE.scrolltimer); }, false);

			}
			appbox_scroll.appendChild(applink);
		}
		
		// since we just loadad, and started the display from the start, set that param to 0
		if(category) this.appcategories[category].applinkstart = 0;
		else this.applinkstart = 0;
	},
	// function to handle hiding and showing of appropriate applinks on scrolling through the wise menu
	"scrollapps":function(delta, appbox, category) {
		// are we scrolling categories or apps?
		if(!appbox) appbox = $("wise-categories");
		else appbox = $(appbox);
		
		if(!category) var app_array = this.appcatlinks;
		else var app_array = this.appcategories[category].apps;
		// different browsers handle the delta differently
		// so we just normalize it all to a -1 or a 1 so we can handle them the same
		if(delta>0) delta = 1;
		else if (delta < 0) delta = -1;
		
		//we either scrolled up 1 or down 1, so we are starting 1 off
		var appstart = ((category ? this.appcategories[category].applinkstart : this.applinkstart) - delta);
		
		// if we were already at 0, and tried to go lower, we wont allow it
		if(appstart < 0) {
			return false;
		}
		// likewise, we cant go past the bottom end
		else if (delta != 0 && appstart > (app_array.length - this.applinksshow)) {
			return false;
		}
		
		// instead of handling this by setting the 1 param at a time
		// quick wheel scrolling may make this function call too many times for that to be reliable
		// so we loop through to make sure that the last time it is called the display results are reliable
		
		//hide from 0 to start
		for(var i=0; i<appstart; i++) {
			app_array[i].hide();
		}
		// show from start to start plus number to show
		for(var i=appstart; i<(appstart+this.applinksshow); i++) {
			app_array[i].show();
		}
		// hide the rest
		for(var i=(appstart+this.applinksshow); i<app_array.length; i++) {
			app_array[i].hide();
		}
		
		// set the start param for next time
		if(category) this.appcategories[category].applinkstart = appstart;
		else this.applinkstart = appstart;
	},
	// function called at the end of the scan function to create display of all apps that were loaded on the query 	
	"setAppBox":function() {
		// we only want to run this once, so if wise_appbar exists, bail
		// however we are putting it in search-results-top, so if for some reason this doesnt exist, bail
		if($("search-results-top") && !$("wise_appbar")) {
			// load css... no param, which means that this is loading the framework css, not an app specific one
			WISE.load_css();
			this.applinks = new Array();
			
			var appmsg = document.createElement("div");
			appmsg.setAttribute("id", "wise_appmsg");
			appmsg.innerHTML = WISE.message;
			
			var appbar = document.createElement("div");
			appbar.setAttribute("id", "wise_appbar");
			
			//if(document.all) appbox.style.marginTop = "20px";
			var apparray_alpha = new Array();
			for (var eachapp in WISE.apps) {
				if (!WISE.check_lang(eachapp)) continue;
				apparray_alpha.push({"id":eachapp,"name":WISE.apps[eachapp].name});
			}
			apparray_alpha = apparray_alpha.sort(function(a,b){return ((a.name?a.name:a.id).toLowerCase()>(b.name?b.name:b.id).toLowerCase() ? 1 : ((a.name?a.name:a.id).toLowerCase()<(b.name?b.name:b.id).toLowerCase() ? -1 : 0));});
			for (var k=0; k<apparray_alpha.length; k++) {
				eachapp = apparray_alpha[k].id;

				var applink = document.createElement("a");
				applink.setAttribute("id", eachapp);

				$(applink).addClassName("wise_applink");
				if (applink.attachEvent) {
					applink.attachEvent("onclick", function (e){ if(window.event) { e = window.event; } if (!e) return false; var tb = e.target || e.srcElement; /*/ WISE.run(Q.q, tb.id) */ WISE.menuRun(Q.q, tb.id)  ;$("wise-container").hide(); });
					applink.attachEvent("onmousewheel", function (e){ WISE.getWheel(e) });
				}
				else {
					applink.addEventListener("click", function (e){ if(window.event) { e = window.event; } if (!e) return false; var tb = e.target || e.srcElement; /* WISE.run(Q.q, tb.id) */ WISE.menuRun(Q.q, tb.id);$("wise-container").hide();}, false);
					applink.addEventListener("mousewheel", function (e){ WISE.getWheel(e) }, false);
					applink.addEventListener("DOMMouseScroll", function (e){ WISE.getWheel(e) }, false);
					
				}
				
				applink.setAttribute("title", (WISE.apps[eachapp].description ? gettext(WISE.apps[eachapp].description) : ""));
				applink.innerHTML = (WISE.apps[eachapp].name ? WISE.apps[eachapp].name : eachapp);
				if(!this.apps[eachapp].hideDisplay) {
					
					if(this.apps[eachapp].categories) this.apps[eachapp].categories.unshift("All");
					else this.apps[eachapp].categories = [ "All" ];
						
					if( this.apps[eachapp].categories ){
						for( var x = 0; x<= this.apps[eachapp].categories.length-1; x++ ){
							var category = this.apps[eachapp].categories[ x ];
							if(!this.appcategories[category]) {
								this.appcategories[category] = {"applinkstart":0,"apps":new Array()};
								
								var catlink = document.createElement("a");
								catlink.setAttribute("id", category);

								$(catlink).addClassName("wise_applink");
								if (catlink.attachEvent) {
									catlink.attachEvent("onclick", function (e){ if(window.event) { e = window.event; } if (!e) return false; var tb = e.target || e.srcElement; WISE.activecat = tb.id; WISE.loadscrollapps("wise-apps", tb.id); });
									catlink.attachEvent("onmousewheel", function (e){ WISE.getWheel(e) });
								}
								else {
									catlink.addEventListener("click", function (e){ if(window.event) { e = window.event; } if (!e) return false; var tb = e.target || e.srcElement; WISE.activecat = tb.id; WISE.loadscrollapps("wise-apps", tb.id); }, false);
									catlink.addEventListener("mousewheel", function (e){ WISE.getWheel(e) }, false);
									catlink.addEventListener("DOMMouseScroll", function (e){ WISE.getWheel(e) }, false);
									
								}
								
								catlink.innerHTML = category;
								this.appcatlinks.push(catlink);
								
							}
							this.appcategories[category]["apps"].push(applink);
						}
						
					}
				}
			}
			
			var applink = document.createElement("a");
			applink.setAttribute("id", "wise_applink");
			if (applink.attachEvent) {
				applink.attachEvent("onclick", function (e){ 
					$("wise-container").toggle(); 
				});
			}
			else {
				applink.addEventListener("click", function (e){ 
					$("wise-container").toggle(); 
				}, false);
			}

			applink.appendChild(document.createTextNode(gettext("Add Site")));

			$(applink).addClassName("wise_menu");
			applink.style.color = "blue";
			applink.style.cursor = "pointer";
			applink.style.margin = "0 5px 0 0";
			applink.style.fontSize = "10px";
			applink.style.whiteSpace = "nowrap";
			applink.style.display = "block";
			applink.style.cssFloat = "right";
			applink.style.styleFloat = "right";
			
			
			appbar.appendChild(applink);
			
			var appload = document.createElement("span");
			appload.setAttribute("id", "wise_appload");
			appbar.appendChild(appload);
			
			var app_preview = document.createElement("div");
			app_preview.setAttribute("id", "wise_apppreview");
			app_preview = $(app_preview);
			app_preview.hide();
			app_preview.style.position = "absolute";
			app_preview.style.left="75px";
			if(document.all)app_preview.style.marginTop = "20px";
			app_preview.style.backgroundColor = "#FFFFFF";
			app_preview.style.textAlign="left";
			app_preview.style.zIndex = 1000;
			appbar.appendChild(app_preview);
						
			appbar = $(appbar);
			appbar.style.width = "100%";
			appbar.style.textAlign = "left";
			appbar.style.marginTop = "2px";
			
			appmsg.style.width = "100%";
			appmsg.style.textAlign = "right";
			appmsg.style.fontSize = "10px";
			appmsg.style.marginTop = "6px";
			$("wise_placeholder").appendChild(appmsg);
			$("wise_placeholder").appendChild(appbar);
			
			var appcontainer = document.createElement("div");
			appcontainer.setAttribute("id", "wise-container");
			appcontainer.setAttribute("class", "wise_container");
			$(appcontainer).addClassName("wise_container");
			appcontainer.style.display = "none";
			
			var appclose = document.createElement("a");
			appclose.setAttribute("id", "wise-close");
			$(appclose).addClassName("wise_about");
			$(appclose).addClassName("wise_link");
			appclose.innerHTML = "| "+getspan("Close");
			if (appclose.attachEvent) {
				appclose.attachEvent("onclick", function (){ $("wise-container").hide(); });
			}
			else {
				appclose.addEventListener("click", function (){ $("wise-container").hide(); }, false);
				
			}
			appcontainer.appendChild(appclose);
			
			var appabout = document.createElement("a");
			appabout.setAttribute("id", "wise-about");

			$(appabout).addClassName("wise_about");
			$(appabout).addClassName("wise_link");
			appabout.style.textDecoration = "none";
			appabout.innerHTML = getspan("Develop a Site");
			appabout.setAttribute("href", "WISE/test.html")
			appcontainer.appendChild(appabout);
			
			var appcategories = document.createElement("div");
			appcategories.setAttribute("id", "wise-categories");

			$(appcategories).addClassName("wise_categories");
			appcontainer.appendChild(appcategories);
			
			var appcategoriesscroll = document.createElement("div");
			appcategoriesscroll.setAttribute("id", "wise-categories-scroll");

			$(appcategoriesscroll).addClassName("wise_menuscroll");
			appcontainer.appendChild(appcategoriesscroll);
			
			var applist = document.createElement("div");
			applist.setAttribute("id", "wise-apps");
			$(applist).addClassName("wise_apps");
			appcontainer.appendChild(applist);
			
			var applistscroll = document.createElement("div");
			applistscroll.setAttribute("id", "wise-apps-scroll");

			$(applistscroll).addClassName("wise_menuscroll");
			appcontainer.appendChild(applistscroll);
			
			var appclear = document.createElement("div");
			$(appclear).addClassName("wise_clear");
			appcontainer.appendChild(appclear);
			
			$("wise_placeholder").appendChild(appcontainer);
			this.loadscrollapps("wise-categories");
			this.activecat = "All";
			this.loadscrollapps("wise-apps", "All");
			this.getLoaded();
		}
		else {
			this.getLoaded();
			if($("wise_applink")) $("wise_applink").innerHTML = getspan("Add Site");
		}
	},
	//---------------------------------------
	// WISE subobject to handle processing of apps created by the app generator (no separate code file).
	"generic":{
		"cur_gen_id":"",
		"buildItemUrl":function(base, params, obj) {
			var url = base;
			
			if (params) {
				for (var i=0; i<params.length; i++) {
					var repl = "$"+(i+1) + "";
					//if (obj[params[i]]) url = url.replace(repl, obj[params[i]]);
					//if (eval("obj." + params[i])) url = url.replace(repl, eval("obj." + params[i]));
					var par_split = params[i].split(".");
					var obj_temp = obj;
					for (var j=0; j<par_split.length; j++) {
						if (obj_temp && obj_temp[par_split[j]]) obj_temp = obj_temp[par_split[j]];
						else return "notfound";
					}
					if (obj_temp) url = url.replace(repl, obj_temp);
				}
			}
			return url;
			
		},
		"processApiResult":function (obj) {
			if(typeof isGen != "undefined") {
				try {
					this.cur_gen_id = "test_obj";
					WISE.apps[this.cur_gen_id].params = new Array();
					WISE.apps[this.cur_gen_id].params.push($("wise_q").value);
					g_obj = obj;
					$("jsonoutput").innerHTML = Object.toJSON(obj);
				} catch(ex) {}
			}
			var id = this.cur_gen_id;
			var resp_hand = WISE.apps[id].gen_obj;
			t_resp_hand = resp_hand;
			var resp_str = "";
			resp_hand = resp_hand.response;
			var r_obj;
			// changed to allow rootelement to have a .
			//if (resp_hand.rootelement && obj[resp_hand.rootelement]) r_obj=obj[resp_hand.rootelement];
			
			if (resp_hand.rootelement) {
				var par_split = resp_hand.rootelement.split(".");
				var obj_temp = obj;
				for (var j=0; j<par_split.length; j++) {
					if (obj_temp && obj_temp[par_split[j]]) obj_temp = obj_temp[par_split[j]];
					else {
						obj_temp = obj;
						break;
					}
				}
				r_obj = obj_temp
			}
			else {
				r_obj = obj;
			}
			
			var hasResults = false;
			if (r_obj) {
				var app_title = WISE.apps[id].apptitle.replace("$1", WISE.apps[id].params[0]);
				var app_url = WISE.apps[id].appurl.replace("$1", encodeURIComponent(WISE.apps[id].params[0]));
					
				if (resp_hand.containerElement) {
					var par_split = resp_hand.containerElement.split(".");
					var obj_temp = r_obj;
					for (var j=0; j<par_split.length; j++) {
						if (obj_temp && obj_temp[par_split[j]]) obj_temp = obj_temp[par_split[j]];
						else {
							obj_temp = r_obj;
							break;
						}
					}
					obj_container = obj_temp
				}
				else {
					obj_container = r_obj;
				}
			
			
				if(!obj_container || obj_container.length == 0) {
					if (typeof isGen == "undefined") return false;
				}
				else {
					hasResults=true;
				}
				
				try{var maxlength = ((WISE.apps[id].gen_obj.response.size && obj_container && WISE.apps[id].gen_obj.response.size < obj_container.length && WISE.apps[id].gen_obj.response.size > 0) ? WISE.apps[id].gen_obj.response.size : obj_container.length);}
				catch(ex){var maxlength= (obj_container ? obj_container.length : 0)}
				
				for (var i=0; i<maxlength; i++) {
					var cur_str = '<div';
					if (i==maxlength-1) cur_str += (resp_hand.styles && resp_hand.styles.last_item_style ? ' style="' + resp_hand.styles.last_item_style + '"' : '');
					else cur_str += (resp_hand.styles && resp_hand.styles.item_style ? ' style="' + resp_hand.styles.item_style + '"' : '');
					cur_str += '>';
					var cur = obj_container[i];
					
					var url = (this.returnField(resp_hand.url.field, cur) ?  this.returnField(resp_hand.url.field, cur) : this.buildItemUrl(resp_hand.url.base, resp_hand.url.params, cur));
					
					cur_str += "<div><div>";
					
					if (resp_hand.titleField) {
						var link_text = this.returnField(resp_hand.titleField, cur);
						link_text = (link_text && link_text!="undefined" ? link_text : cur[resp_hand.backupTitle]);
						cur_str += "<a href='" + url + "'" + (resp_hand.styles && resp_hand.styles.url_style ? ' style="' + resp_hand.styles.url_style + '"' : '') + ">" + WISE.utfdecode(link_text) + "</a></div>";
					}
					cur_str += "</div>";
					
					cur_str += "<div>";
					
					if (resp_hand.image) {
						if (resp_hand.image.field && this.returnField(resp_hand.image.field, cur)) cur_str += "<img src='" +  this.returnField(resp_hand.image.field, cur) + "'" + (resp_hand.styles && resp_hand.styles.image_style ? ' style="' + resp_hand.styles.image_style + '"' : '') + "/>";
						else cur_str += "<img src='" +  this.buildItemUrl(resp_hand.image.base, resp_hand.image.params, cur) + "'" + (resp_hand.styles && resp_hand.styles.image_style ? ' style="' + resp_hand.styles.image_style + '"' : '') + " />";
					}
					for (var j=0; j<resp_hand.contentFields.length; j++) {
						cur_str += this.processContentField(resp_hand.contentFields[j], cur, resp_hand, false);
					}
					cur_str += "</div>";
					resp_str += cur_str + "</div>";
				}
				if(typeof isGen != "undefined") {
					$("output").innerHTML = "<div class='search-result'><div class='description'><div class='link-container clearfix'><div class='link'><a href='" 
						+ app_url + "'>" + app_title + "</a></div></div><div class='blurb'/><div class='other'><a class='url'>" + app_url + "</a></div></div></div>" 
						+ "<div class='annotation'><div><div class='annotated-text'>" + resp_str + "</div></div></div></div>";
				}
				else {
					if(resp_str != "") {
						WISE.create(app_title, app_url, resp_str, id);
					}
					else {
						WISE.clear(id);
					}
					if(WISE.loadedFromMenu[id]) WISE.loadToLightBox(id);
				}
			}
		},
		"returnField":function(field, cur_obj) {
			if (field) {
				var par_split = field.split(".");
				var obj_temp = cur_obj;
				for (var j=0; j<par_split.length; j++) {
					if (obj_temp && obj_temp[par_split[j]]) obj_temp = obj_temp[par_split[j]];
					else {
						return false;
					}
				}
				return obj_temp;
			}
			else {
				return false
			}
		},
		"processContentField":function(curField, cur_obj, resp_hand, from_sel) {
			var return_str = "";
			
			var fieldText = false;
			
			//var splitFields = curField.field.split(".");
			//var theField = eval("cur_obj."+curField.field);
			var theField = this.returnField(curField.field, cur_obj)
			//for (var i=0; i<splitFields.length; i++) 
			
			//try{if (cur[curField.field] && cur[curField.field] != '') fieldText = cur[curField.field];}catch(ex){return return_str;}
			try{if (theField && theField != '') fieldText = theField;}catch(ex){return return_str;}
			
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
		"load":function(q, id) {
			//this.query=q;
			
			if (!WISE.check_lang(id)) return false;

			
			this.cur_gen_id = id
			
			if(typeof isGen == "undefined") {
				if(WISE.isLoaded(id)) return false;
				else WISE.addToList(id);
			}
			
			if (WISE.apps[id] && WISE.apps[id].gen_obj) {
				var params = {}; 
				WISE.apps[id].gen_obj.params = params;
				WISE.apps[id].params = new Array();
				WISE.apps[id].params.push(q);
				var start;
				if (!params.start) start = (WISE.apps[id].gen_obj.request.start ? WISE.apps[id].gen_obj.request.start : 0);
				else start = params.start;
				WISE.apps[id].gen_obj.params.start = start;
				
				//check if need to redeclare callback
				if(WISE.apps[id].gen_obj.redeclare) { eval(WISE.apps[id].gen_obj.redeclare);}
				
				//build url
				var r = WISE.apps[id].gen_obj.request;
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
					//url += (r.params ? "&" : "?") + r.search + "=" + encodeURIComponent(q);
					if (r.search.indexOf("$") == 0 && url.indexOf(r.search) > -1) url = url.replace(""+r.search+"", encodeURIComponent(q) + (r.q_append ? encodeURIComponent(r.q_append) : "")); 
					else url += ((url.indexOf("?") > -1) ? "&" : "?") + r.search + "=" + encodeURIComponent(q)+ (r.q_append ? encodeURIComponent(r.q_append) : "");
				}
				if (r.next && start) url += ((url.indexOf("?") > -1) ? "&" : "?")+r.next + "=" + (r.offset ? start+r.offset : start);
				
				// use some dynamic iframe magic to load up the file that contains the code
				WISE.include(url, id);
			}
		}
	},
	"embedSWF":function( url, flashvars, params, attributes ){
		swfobject.embedSWF(url, "openplayer", "0", "0", "8.0.0", false, flashvars, params, attributes);
	
	},
	"sendEvent":function sendEvent(typ,prm) { 
		if( 1==1 /*isReady*/ ) {	this.thisMovie('openplayer').sendEvent(typ,prm); }
	},
	"thisMovie":function thisMovie(movieName) {
		return document.getElementById(movieName);
	
		if(navigator.appName.indexOf("Microsoft") != -1) { return window[movieName]; }
		else { return document[movieName]; }
	},
	"css":{
		"applink":{
			"cursor":"pointer",
			"font-size":"12px",
			"display":"block",
			"white-space":"nowrap",
			"overflow":"hidden",
			"line-height":"16px",
			"height":"16px"
		},
		"applink:hover":{
			"background-color":"#DDDDDD"
		},
		"scrollbutton":{
			"text-align":"center",
			"position":"relative",
			"top":((document.all && !window.opera) ? "62px" : "66px")
		},
		"listheader":{
			"font-size":"12px",
			"font-weight":"bold",
			"white-space":"nowrap",
			"margin-bottom":"3px",
			"line-height":((document.all) ? "16px" : "15px"),
			"height":((document.all) ? "16px" : "15px")
		},
		"container":{
			"background-color":"#fff",
			"border-right":"1px solid #dcdcdc",
			"border-left":"1px solid #dcdcdc",
			"border-bottom":"1px solid #dcdcdc",
			"width":"81%",
			"color":"#777",
			"padding":"5px",
			"z-index":"1000",
			"height":"100px"
		},
		"about":{
			"padding":"2px",
			"float":"right",
			"font-size":"10px"
		},
		"categories":{
			"padding":"2px 2px 2px 5px",
			"width":"25%",
			"overflow":"hidden",
			"float":"left",
			"font-size":"12px"
		},
		"menuscroll":{
			"padding":"2px 5px 2px 2px",
			"width":"20px",
			"float":"left",
			"font-size":"12px",
			"height":"100%"
		},
		"apps":{
			"padding":"2px 2px 2px 3px",
			"width":"25%",
			"overflow":"hidden",
			"float":"left",
			"font-size":"12px"
		},
		"appcount":{
			"padding":"0px 3px",
			"font-size":"11px",
			"color":"#666666"
		},
		"clear":{
			"clear":"both"
		},
		"link":{
			"color":"blue",
			"cursor":"pointer"
		}
		
	},
	"log": function(data) {
		if (typeof console != 'undefined') {
			console.log(data);
		}
	}
};
