function distanceFetch() {

	var geoURL = "http://where.yahooapis.com/v1/places.q('"+ encodeURIComponent(thisApp.params[0]) +"')?appid=xn0wlSbV34FyhFUpNs.JhRy8VT0OCs4bcIXxEWTfEugKLUyvw71fA7nNbi0GOOUy9ogukb6E&format=json&callback=getLatLong";

	WISE.call(geoURL, thisApp.id);
	
}

var lat_long = false;

function getLatLong( j ) {

	lat_long = new Array();

	if( !j.places || !j.places.place){
		WISE.clear(thisApp.id);
		return false;
	}
	
	if (j.places.place.length) var place = j.places.place[0];
	else var place = j.places.place;
	var center = place.centroid;
	if (center) {
		lat_long.push(center.latitude);
		lat_long.push(center.longitude);
			var geoURL = "http://where.yahooapis.com/v1/places.q('"+ encodeURIComponent(thisApp.params[1]) +"')?appid=xn0wlSbV34FyhFUpNs.JhRy8VT0OCs4bcIXxEWTfEugKLUyvw71fA7nNbi0GOOUy9ogukb6E&format=json&callback=getSecondLatLong";
		WISE.clear(thisApp.id);
		WISE.call(geoURL, thisApp.id);
	}
	else {
		WISE.clear(thisApp.id);
		return false;
	}
}

function getSecondLatLong( j ){

	if( !j.places || !j.places.place){
		WISE.clear(thisApp.id);
		return false;
	}
	
	if (j.places.place.length) var place = j.places.place[0];
	else var place = j.places.place;
	var center = place.centroid;
	if (center) {
		lat_long.push(center.latitude);
		lat_long.push(center.longitude);
		var renderUrl = "http://thooth.com/WISE/ajax/index.php?action=ajax&rs=wfGetDistanceInfo&rsargs[]=" + lat_long[0] + "&rsargs[]=" + lat_long[1] + "&rsargs[]=" + lat_long[2] + "&rsargs[]=" + lat_long[3] + "&rsargs[]=distanceRender";
		WISE.clear(thisApp.id);
		WISE.call(renderUrl, thisApp.id);
	}
	else {
		WISE.clear(thisApp.id);
		return false;
	}
}

function distanceRender( j ){
	if (!j) {
		WISE.clear(thisApp.id);
		return;
	}
	var title = "Distance between " + thisApp.params[0] + " and " + thisApp.params[1];
	var url = "http://geocoder.us/service/distance?lat1=" + lat_long[0] + "&lat2=" + lat_long[2] + "&lng1=" + lat_long[1] + "&lng2=" + lat_long[3];
	var output = "The distance Between " + thisApp.params[0] + " and " + thisApp.params[1] + " is " + j;
	if (output != "") {
		WISE.create(title, url, output, thisApp.id);
	}
	else WISE.clear(thisApp.id);
	
}
