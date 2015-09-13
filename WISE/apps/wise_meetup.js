function meetupFetch(){
	
	thisApp.params[1] = WISE.trim(thisApp.params[1]).replace(/^(around|near|in|at|close to|by)/, "");
	var callUrl = "http://api.meetup.com/groups.xml/?zip=" + encodeURIComponent(WISE.trim(thisApp.params[1])) + ((WISE.trim(thisApp.params[0]) != "") ? "&topic=" + encodeURIComponent(WISE.trim(thisApp.params[0])) : "") + "&order=members&key=27a1c345c2834446a3d47461426166e&format=json&callback=meetupRender";
	WISE.call(callUrl, thisApp.id);

}

function meetupRender(j) {
	
	if(!j.results) return;
	
	if (!j.results.length) {
		if(WISE.trim(thisApp.params[0]) != "") {
			WISE.clear(thisApp.id);
			return fetchMeetupGroups(WISE.trim(thisApp.params[0]));
		}
		else {
			WISE.clear(thisApp.id);
			return;
		}
	}
	
	if(WISE.trim(thisApp.params[0]) != "") var title = "Largest " + WISE.trim(thisApp.params[0])  + " meetup groups in " + WISE.trim(thisApp.params[1]) + " from meetup.com";
	else var title = "Largest Meetup Groups in " + WISE.trim(thisApp.params[1]) + " from meetup.com";
	
	var link = "http://www.meetup.com/search/?keywords=" + encodeURIComponent(WISE.trim(thisApp.params[0])) + "&zip=" + WISE.trim(thisApp.params[1])
	var output = "";
	var max_length = (j.results.length > 3 ? 3 : j.results.length)
	for (var i=0; i<max_length; i++) {
		if (!j.results[i]) break;
		var cur = j.results[i];
		output += "<div " + ((i<max_length-1)? "class='wise_meetup_item'" : "" ) + "><a href='" + cur.link + "'>"+cur.name+"</a>" + ((cur.description && cur.description != "") ? "<br/><span class='wise_meetup_description'>" + cur.description.substring(0,100) + "</span>" : "") + "<br/><span class='wise_meetup_info'>" + cur.city + " | " + cur.members + " members | created on " + cur.created + "</span></div>";
	}

	if (output != "") {
		output = "<div>" + max_length + " of " + j.meta.total_count + " groups found.</div>" + output;
		output += "<div class='wise_meetup_logo'><img src='http://img1.meetupstatic.com/img/38851217336220/logo_82.png' /></div>";
		WISE.create(title, link, output, thisApp.id);
	}
	else {
		WISE.clear(thisApp.id);
	}
	
	
}

function fetchMeetupGroups(topic){
	WISE.clear(thisApp.id);
	var callUrl = "http://api.meetup.com/topics/?search=" + encodeURIComponent(topic)+ "&order=members&key=27a1c345c2834446a3d47461426166e&format=json&callback=meetupGroupsRender";
	//alert(callUrl);
	WISE.call(callUrl, thisApp.id);
	return false;
}

function meetupGroupsRender(j) {
	if(!j.results || !j.results.length) {
		WISE.clear(thisApp.id);
		return;
	}
	var title = "Meetup.com topic search for " + WISE.trim(thisApp.params[0]);
	
	var link = "http://www.meetup.com/topics/"
	var output = "";
	var max_length = (j.results.length > 3 ? 3 : j.results.length)
	for (var i=0; i<max_length; i++) {
		if (!j.results[i]) break;
		var cur = j.results[i];
		output += "<div " + ((i<max_length-1)? "class='wise_meetup_item'" : "" ) + "><a href='" + cur.link + "'>"+cur.name+"</a>" + ((cur.description && cur.description != "") ? "<br/><span class='wise_meetup_description'>" + cur.description.substring(0,100) + "</span>" : "") + "<br/><span class='wise_meetup_info'>" + cur.members + " members | updated on " + cur.updated + "</span></div>";
	}
	if (output != "") {
		output = "<div>Sorry, we didnt find any exact matches on the topic you searched for... here are some related topics that you might find interesting. " + max_length + " of " + j.meta.total_count + " related topics found.</div>" + output;
		output += "<div class='wise_meetup_logo'><img src='http://img1.meetupstatic.com/img/38851217336220/logo_82.png' /></div>";
		WISE.create(title, link, output, thisApp.id);
	}
	else {
		WISE.clear(thisApp.id);
	}

}

thisApp.css = {
	"item":{
		"margin-bottom":"5px",
		"padding-bottom":"5px",
		"border-bottom":"1px dashed #DCDCDC"
	},
	"info":{
		"font-size":"10px"
	},
	"wise_meetup_description":{
		"width":"350px",
		"white-space":"nowrap",
		"overflow":"hidden"
	},
	"logo":{
		"padding-top":"3px"
	},
	
}
