var user_name = "";
var filtered_activity_id = "";
var activity_types = "";
var current_time = 0
var title = "";

var total_activity_count = 0;
var already_outputted = false;
var activity_object;

function cap( str ){
	return str.charAt(0).toUpperCase() + str.substring(1)
}

function getActivity( activity_id ){

	// add loading indicator
	if (!$('profile-loading')) {
		var loadingDiv = document.createElement('DIV');
		loadingDiv.id = 'profile-loading';
		loadingDiv.innerHTML = 'Loading...';
		$('container').appendChild(loadingDiv);
	}

	$('profile-loading').show();

	// check url for user_name of board (and see if it is a board to board)
	var qParams = location.href.toQueryParams();
	
	// whose board is it, is it board to board, and which page of messages is it (default 1)
	user_name = ((qParams["user"]) ? qParams["user"] : getCookie("searchUserName") );
	
	var sUrl = "http://127.0.0.1:8080/kt//now.js?f=setNow(&r=" + Math.random();
	getDataFromServer("time",sUrl)
	
	var sUrl = server_to_use + '/index.php?title=index.php&action=ajax&rs=wfGetUserBulletinsJSON&rsargs[]=' + cap(user_name) + '&rsargs[]=20' + ((activity_id)?'&rsargs[]=' + activity_id:"");
	getDataFromServer("getActivity",sUrl)
	
	//if we are filtering by social activity, don't trigger search data
	if( !activity_id ){
		createGlobalChanges()
	}
}

function filter_activity( id ){
	
	//clear status
	already_outputted = false;
	reset_search_activity()
	add_list = new Array();
	
	filtered_activity_id = id 
	search_activity = false;
	for(x = 0; x<=type_array.length-1; x++){
		if( type_array[x] == filtered_activity_id ){
			search_activity = true;
		}
	}
	
	//hack to check if activity is search or social
	if( search_activity ){ //dropdown is search activity
		//do search filtering
		
		document.getElementById("profile-activity-section").innerHTML = output_profile_activity({"activity":new Array()}, false, 0)
		//load_dropdowns()
	}else{
		getActivity( filtered_activity_id )
	}
	

}

var timestamp_now = 0;
var nowoffset = 0;
var ko = new Date();
function setNow(obj){
	timestamp_now = obj.now;
	nowoffset = ko.getTime() - parseInt(timestamp_now);
}

/**Global variables**/
// arrays for all of the changes, for all of the types of changes, and variable for keeping track of how many loaded
var global_changes_array = new Array();
var categories_array = new Array();
var categories_loaded = 0;

// arrays for each filter dropdown
var type_array = new Array();
var user_array = new Array();
var url_array = new Array();

// param for sorting ascending or descending... default == 0 == descending
var asc = 0;

function ktFetch() {
	
	var i = document.createElement('iframe');
	i.style.display="none";
	document.getElementsByTagName('body')[0].appendChild(i);
	
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
	    
	doc.open();
	doc.write("<script type=\"text/javascript\">function processKT(j){parent.processKT(j);}</script>");
	doc.write("<script id=\"script_activity\" type=\"text/javascript\" src=\"" + "http://127.0.0.1:8080/kt/user.js?max=10&t=del&t=add&t=sug&t=spot&t=stars&t=edit&t=bg&t=com&t=selection&t=also&u=" + cap(user_name) + "&r=" + Math.random() + "&f=processKT(\"></script>");
	doc.close();
}

var change_type_sug_hide= {
	t:"sug",
	l:getspan("hid the suggested search term"),
	m:getspan("for the result")
};

function processKT(j) {
	
	for( x=0; x<=categories_array.length-1;x++){
		var change_type= categories_array[x];
		activity = eval("j." + change_type.t);
		if (activity && activity.length) {
	
			for(var i=0; i < activity.length; i++)
			{
				// load each change item into a global array of changes
				if (change_type.t == "sug" && activity[i].hide) {
					change_type= change_type_sug_hide;
				}
				var item = change_object(activity[i].id, change_type.t, change_type.l, change_type.m, activity[i]);
				global_changes_array.push(item);
	
				
			}
			type_array[ type_array.length ] = change_type.t
		}
	}

	
	if ( already_outputted ) {
	
		activity_html = output_profile_activity(activity_object.myObject, activity_object.isOwner, activity_object.profile)
		if( total_activity_count > 0 ){
			$("profile-activity-section").show();
		}
		document.getElementById("activity-container").innerHTML = activity_html;
		
	}
	
}

// take all the necessary pieces for each change and stuff them into a change object
function change_object(date, type, label, modifier, jsonObj) {
	var item = {
		date: date,
		type: type,
		label: label,
		modifier: modifier,
		jsonObj: jsonObj,
		outputted: false
	};
	return item;
}
			
function createGlobalChanges() {
	
	var qParams = location.href.toQueryParams();
	user_name = ((qParams["user"]) ? qParams["user"] : getCookie("searchUserName") );
	
	//fill the changes array with the types of changes (so that as any get added there is a count being automatically updated 
	categories_array.push({t:"edit",l:"edited",m:"for the result"});
	categories_array.push({t:"add",l:"added the URL",m:"to the result"});
	categories_array.push({t:"spot",l:"spotlighted",m:"for the result"});
	categories_array.push({t:"del",l:"deleted",m:"from the result"});
	categories_array.push({t:"stars",l:"rated",m:"for the result"});
	categories_array.push({t:"sug",l:"added the suggested result <b>",m:"</b> to the result"});
	categories_array.push({t:"com",l:"commented on the URL",m:"for the result"});
	categories_array.push({t:"bg",l:"changed the background",m:"for the result"});
	categories_array.push({t:"selection",l:"annotated the URL",m:"for the result"});
	
	//for each type of change, get the changes
	//for (var i=0; i<categories_array.length; i++) {
		ktFetch();
	//}

}
	
// take each array of filter items and load the dropdown
function load_dropdowns() {
	var search_activity_names = new Array();
	search_activity_names["edit"] = "Edited URLs";
	search_activity_names["spot"] = "Spotlighted URLs";
	search_activity_names["del"] = "Deleted URLs";
	search_activity_names["stars"] = "Rated URLs";
	search_activity_names["add"] = "Added URLs";
	search_activity_names["sug"] = "Added Suggested Keywords";
	search_activity_names["com"] = "Comments";
	search_activity_names["bg"] = "Keyword Backgrounds";
	search_activity_names["selection"] = "Annotations";
	//call the custom sort function for each assoc array, and then add each item to the appropriate select

	
	for (var i=0; i<type_array.length; i++) {
		is_selected = false
		if( type_array[i] == filtered_activity_id )is_selected = true
		document.getElementById("type_select").options.add(new Option(search_activity_names[type_array[i]] ,type_array[i],is_selected ));
	}
	
	if( !is_IP( user_name ) ){
		//build dropdowns for social activity
		for( y = 0; y <= activity_types.length - 1; y++ ){
			is_selected = false
			if( activity_types[y].id == filtered_activity_id )is_selected = true
			
			document.getElementById("type_select").options.add(new Option( activity_types[y].type.capitalize(), activity_types[y].id, is_selected ));
			
		}
	}

}

			
function delete_activity( id ){
	if( confirm("Are you sure you want to hide this activity?") ) {
		var sUrl = server_to_use + "/index.php?action=ajax&rs=wfDeleteUserBulletin&rsargs[]=" + id;
		getDataFromServer("deleteBulletin",sUrl)
		$("profile-activity-" + id ).remove();
	}
}



// custom function to sort changes array ascending and descending
function sortActivity(a,b){return (parseInt(b.timestamp) - parseInt(a.timestamp));	}

// custom function for sorting the associative array, and returning an array with object with key, value
function sortAssoc(aInput) {
	var aTemp = [];
	for (var sKey in aInput)
	aTemp.push({key:sKey, value:aInput[sKey]});
	aTemp.sort(function (a,b) {return parseInt(b.value) - parseInt(a.value)});
	return aTemp;
}

function write_activity(myObject){
	activity_types = myObject.types
	current_time = myObject.activity.time
	title = myObject.activity.title

	output_string = output_profile_activity(myObject.activity, false, 0 );
	
	document.getElementById("profile-activity-section").innerHTML = output_string;
	if( !nav_outputted ) write_nav(myObject);

	$('profile-loading').hide();
}

var nav_outputted = false
function write_nav(myObject){
	
	var output_string = "";
	
	output_string += "<div class=\"sub-profile-title-container clearfix\">";
	output_string += "<img src=\""+myObject.activity.r_avatar+"\"/>";
	output_string += "<h1>";
	output_string += myObject.activity.user_name_display + "'s " + title;
	output_string += "</h1>";
	//for activity for registered users, link back to profile
	output_string += "<div class=\"activity-nav\">";
	
	
	if( user_name && !is_IP( user_name ) ) {
			output_string += "<a href=\"profile.html?user="+user_name+"\">< Back to "+myObject.activity.user_name_display+"'s Profile</a>";
	}
	
	activity_links = "";
	
	//board link
	activity_links += ((activity_links)?" | ":"") + "<a href=\"board.html?user=" + user_name + "\">" + getspan("Wall") + "</a>";
	
	//block link
	if( isAdmin ) {
			activity_links += ((activity_links)?" | ":"") + "<a href=\"" + getBlockLink(user_name) + "\">" + getspan("Block") + "</a>";
	}
	
	//block log link
	activity_links += ((activity_links)?" | ":"") + "<a href=\"" + server_to_use + "/index.php?title=Special:Log&type=block&page=User:" + user_name + "\">" + getspan("Block log") + "</a>";
	
	
	output_string += " (" + activity_links + ")"
	output_string += "</div>";
	output_string += "</div>";
	
	output_string += "<div class=\"activity-select\">Type: "; 
	output_string += "<select id=\"type_select\" onchange=\"filter_activity(this.value);\"><option value=-1>All</option>";
	output_string += "</select>";
	output_string += "</div>";
	document.getElementById("profile-activity-nav").innerHTML = output_string;
	setTimeout("load_dropdowns()",500)
	nav_outputted = true;
	
}

function reset_search_activity(){
	for (var i=0; i<global_changes_array.length; i++) {
		global_changes_array[i].outputted = false
	}
}

var add_list = new Array();
function output_profile_activity( myObject, isOwner, profile ) {
	
	if (!wgUserProfileDisplay['activity'] || typeof(myObject) != "object" ) {
		return "";
	}
	
	/*
	if (!already_outputted)	{
		activity_object = {
			myObject:myObject, 
			isOwner:isOwner, 
			profile:profile
		};
		already_outputted = true;
	}
	*/
	
	current_time = myObject.time
	//we only want this user changes
	
	
	for (var i=0; i<global_changes_array.length; i++) {
		
		if( !filtered_activity_id || filtered_activity_id == global_changes_array[i].type || filtered_activity_id == -1 ){
			if ( !global_changes_array[i].outputted) {
				
				var item = global_changes_array[i];
				
				new_id = myObject.activity.length;
				htm = "";
				if (isAdmin && !profile && item.type=="add") {
					//add_list[new_id] = "<input type=\"checkbox\" id=\"add_" + item.jsonObj.id + "\" url=\"" + item.jsonObj.url + "\" q=\""+item.jsonObj.keyword+"\" />";
					add_list[new_id] = {
						tag:"<input type=\"checkbox\" id=\"add_" + item.jsonObj.id + "\" url=\"" + item.jsonObj.url + "\" q=\""+item.jsonObj.keyword+"\" />",
						del_tag:"<a href=\"javascript:void(0);\" class=\"delete-url\" onclick=\"alert(delete_indiv('" + item.jsonObj.keyword + "', '" + item.jsonObj.url + "'));\">X</a>",
						q:item.jsonObj.keyword,
						url:item.jsonObj.url,
						id:item.jsonObj.id
					}
				}
				
					
				// if its a delete, say whether it was a delete or an undelete, otherwise what was it
				if (item.type=="del") htm += ((parseInt(item.jsonObj.del)==0)?"<b><i>un</i></b>deleted":"deleted") + " ";
				else htm += item.label+" ";
					
				// if it was a suggested result, put the sug results in a span to bold it, otherwise, make the url green
				if (item.type=="sug") htm += "<span class=\"gc-sug\"><b>"+item.jsonObj.sug.escapeHTML()+"</b></span>";
				else if( item.jsonObj.url) htm += "<span class=\"gc-url\"><a href=\""+ item.jsonObj.url + "\" target=\"_new\">" + item.jsonObj.url.substring(0,40).escapeHTML()+"</a></span>";
	
				if (item.type=="stars") {
					//generate stars 
					var stars = "";
					var num_stars = parseInt(item.jsonObj.rating);
					stars += "<span class=\"rating-count\">";
	
					for(var s=0; s<num_stars; s++) 	stars += "<img src=\"images/star_voted.gif\" width=\"10\" alt=\"\"/>";
					
					stars += " " + ((num_stars!=1)?"stars":"star") + " (" + num_stars + ")";
					stars += "</span>";
					htm += " " + stars;
				}
				
				// each change type has its own modifier passed to the function. output that, the keyword (linked) and the date
				htm += " " + item.modifier + " <a href='search.html#"+escape(item.jsonObj.keyword.escapeHTML())+"'>"+item.jsonObj.keyword.escapeHTML()+"</a> ";
				
				//htm += "<span class=\"gc-date\">("+item.jsonObj.id+")</span> ";
				//htm += "<div class=\"gc-actions\"><a href=\"#\">Undo</a></div>";
	
				// if it was an edit, there were other details like title/summary that need to be outputted
				/*
				if (item.type=="edit") {
					htm += "<div class=\"edit-details\">";
						htm += "<div class=\"edit-title\"><b>Title:</b> " + item.jsonObj.title + "</div><div class=\"edit-summary\"><b>Summary:</b> " + item.jsonObj.summary + "</div>";
					htm += "</div>";
				}*/
				
				microseconds =   timestamp_now  - item.jsonObj.id;
				date_diff =  parseInt(microseconds / (1000));
				
				days = parseInt(date_diff/(24*60*60));
				total_seconds = date_diff-(days*24*60*60);
				hours = parseInt(total_seconds/(60*60));
				minutes = parseInt((total_seconds-(hours*60*60))/60);
				seconds = total_seconds-(hours*60*60)-(minutes*60); 
				
				time_str = "";
				if( days > 0 )time_str += days + " days ";
				if( hours > 0 )time_str += hours + " hours ";
				if( minutes > 0 )time_str += minutes + " minutes ";
				if( !time_str)time_str += seconds + " seconds ";
		
				myObject.activity[ new_id ] = {		
					user_name: user_name,
					//new_id: 0,
					new_id: new_id,
					text: htm,
					ago: time_str,
					timestamp: current_time - date_diff
				}
				
				global_changes_array[i].outputted = true
			}
		}
		
	}
	
	if( myObject.activity.length > 0 )myObject.activity = myObject.activity.sort(sortActivity);
	
	var output_string = "";
	
	max = 50;
	if( profile == 1)max = 10;
	
	if (!already_outputted) {
		if (profile==1) {
		
			output_string += "<div id=\"profile-activity-section\" class=\"activity-container\" " + ((!isOwner)?"style=\"display:none\"":"") + ">";
				output_string += "<div class=\"profile-title-container clearfix\">";
					output_string += "<div class=\"profile-title\">" + myObject.title + "</div>";
				output_string += "<div class=\"profile-actions\">";
					output_string += "<a href=\"activity.html?user=" + user_name + "\">View All</a> <a href=\"http://feeds.search.wikia.com/rss/users/" + user_name + "\"><img width=\"12\" src=\"images/feed.png\" border=\"0\"/></a>";
				output_string += "</div>";
			output_string += "</div>";
		
		}  
		
		output_string += "<div id=\"activity-container\" class=\"activities\">";
		
		for( x = 0; x<= myObject.activity.length-1; x++){
			total_activity_count++;
			//output_string += "<div class=\"activity\" id=\"profile-activity-" + myObject.activity[x].id + "\">" + myObject.activity[x].user_name + " " + myObject.activity[x].text + " <span class=\"activity-date\">" +  myObject.activity[x].ago + " ago</span> " + ((isOwner)?"<div style=\"display:none;\" class=\"activity-delete\" onclick=\"delete_activity(" + myObject.activity[x].id + ");\">X</div>":"") + "</div>";
			if( x < max ){
				output_string += "<div class=\"activity\" id=\"profile-activity-" + myObject.activity[x].new_id + "\">"  + (typeof add_list[myObject.activity[x].new_id] == "object" ? add_list[myObject.activity[x].new_id].tag : "") + myObject.activity[x].user_name + " " + myObject.activity[x].text + " <span class=\"activity-date\">" +  myObject.activity[x].ago + " ago</span> " + ((isOwner)?"<div style=\"display:none;\" class=\"activity-delete\" onclick=\"delete_activity(" + myObject.activity[x].new_id + ");\">X</div>":"") + (typeof add_list[myObject.activity[x].new_id] == "object" ? add_list[myObject.activity[x].new_id].del_tag : "") + "</div>";
			}
		}
	
		output_string += "</div>";
		if (!profile && isAdmin) output_string += "<span id=\"add_buttons\" style=\"display:" + (add_list.length ? "inline" : "none") + ";\"> <input type=\"button\" value=\"Select All Added URLs\" onclick=\"select_all_adds(true);\" /> <input type=\"button\" value=\"Deselect All Added URLs\" onclick=\"select_all_adds(false);\" /> <input type=\"button\" value=\"Delete Selected\" onclick=\"delete_selected();\" /></span>";
		output_string += "</div>";
		
		activity_object = {
			myObject:myObject, 
			isOwner:isOwner, 
			profile:profile
		};
		already_outputted = true;
	}
	else {
		if( myObject.activity.length > 0 ){
			$("profile-activity-section").show();
		}
		for( x = 0; x<= myObject.activity.length-1; x++){
			total_activity_count++;
			//output_string += "<div class=\"activity\" id=\"profile-activity-" + myObject.activity[x].id + "\">" + myObject.activity[x].user_name + " " + myObject.activity[x].text + " <span class=\"activity-date\">" +  myObject.activity[x].ago + " ago</span> " + ((isOwner)?"<div style=\"display:none;\" class=\"activity-delete\" onclick=\"delete_activity(" + myObject.activity[x].id + ");\">X</div>":"") + "</div>";
			if( x < max ){
				output_string += "<div class=\"activity\" id=\"profile-activity-" + myObject.activity[x].new_id + "\">"  + (typeof add_list[myObject.activity[x].new_id] == "object" ? add_list[myObject.activity[x].new_id].tag : "")  + myObject.activity[x].user_name + " " + myObject.activity[x].text + " <span class=\"activity-date\">" +  myObject.activity[x].ago + " ago</span> " + ((isOwner)?"<div style=\"display:none;\" class=\"activity-delete\" onclick=\"delete_activity(" + myObject.activity[x].new_id + ");\">X</div>":"") + (typeof add_list[myObject.activity[x].new_id] == "object" ? add_list[myObject.activity[x].new_id].del_tag : "") + "</div>";
			}
		}
		if(add_list.length) {if (!profile && isAdmin) $("add_buttons").show();}
		else {if (!profile && isAdmin) $("add_buttons").hide();}
	}
	return output_string;
	
}

function select_all_adds(select) {
	var adds = document.getElementsByTagName("input");
	for (var i=0; i<adds.length; i++) {
		if (adds[i].type=="checkbox" && adds[i].id.indexOf("add_") == 0) {
			adds[i].checked = select;
		}
	}
}

function delete_selected() {
	
	var to_delete = "";
	var adds = document.getElementsByTagName("input");
	for (var i=0; i<adds.length; i++) {
		if (adds[i].type=="checkbox" && adds[i].id.indexOf("add_") == 0) {
			if(adds[i].checked) {
				//to_delete += adds[i].getAttribute("url") + " for " + adds[i].getAttribute("q") + "; ";
				to_delete += delete_indiv(adds[i].getAttribute("q"), adds[i].getAttribute("url")) + "\n";
				
			}
		}
	}
	alert(to_delete);
}

function delete_indiv(q, url) {
	var KT = "http://127.0.0.1:8080/kt/";
	
	var json = {url:url,del:1};
	
	var src = KT+"new.js?t=del&k="+ encodeURIComponent(q.toLowerCase());
	// if logged in user, use creds
	if(un && tok){
		json.user = un;
		src += "&v=" + encodeURIComponent(tok);
	}
	json.l = lang;
	src += "&j=" + encodeURIComponent(Object.toJSON(json));
	src += "&r=" + Math.random(); // never use cached!
	
	//to_delete += unescape(src) + "\n";
	
	
	var s = document.createElement('script');
	s.defer = true;
	s.type = 'text/javascript';
	s.src = src;
	document.getElementsByTagName('head')[0].appendChild(s);
	
	//ktSave(Q,"del",{"url":results[id].url,"del":1});
	
	return "deleting: " + url + " for " + q + ";";
}
