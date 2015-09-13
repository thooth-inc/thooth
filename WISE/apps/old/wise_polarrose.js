WISE.apps.polarrose = {
	"name":"Polar Rose",
	"author": "",
	"description":"Searches PolarRose.com for images.",
	"categories":[ "Images" ],
	"id":"polarrose",
	"regex":/.*(?:polarrose )(.+)/i,
	"othermatch":{"type":"suggest","keywords":"actor;actress;filmography;celebrity;movies;movie;movie list"},
	"url":"WISE/apps/wise_polarrose.js?r=" + Math.random(),
	"action":"polarroseFetch"
};


function polarroseFetch(){
	
	WISE.call("http://www.polarrose.com/found/" + encodeURIComponent('"'+WISE.trim(thisApp.params[0])+'"') + "?format=jsonp&callback=polarroseRender", thisApp.id);

}

function polarroseRender(j) {
	
	if(!j.results || !j.results.length){
		WISE.clear(thisApp.id);
		return;
	}
	
	var title = "Images from from polarrose.com on " + WISE.trim(thisApp.params[0]);
	var link = "http://www.polarrose.com/found/" + encodeURIComponent(WISE.trim(thisApp.params[0]));
	var output = "";
	
	var maxlength = 3;
	
	maxlength = (maxlength > j.results.length) ? j.results.length : maxlength;
	
	for (var i=0; i<maxlength; i++) {
		if (!j.results[i]) break;
		var cur = j.results[i];

		output += "<div class='wise_polarrose_item'><div class='wise_polarrose_number'>" + cur.size + "</div><a href='http://www.polarrose.com/found/" + cur.name + ((cur.size && parseInt(cur.size)>1) ? "/" + cur.stackUuid : "") + "' class='wise_polarrose_image'><img src='" + cur.faceUrl + "' border='0' height='100px' width='100px'/></a><a href='http://www.polarrose.com/found/" + cur.name + ((cur.size && parseInt(cur.size)>1) ? "/" + cur.stackUuid : "") + "' class='wise_polarrose_link'>"+cur.name+"</a></div>";
	}
	

	if (output != "") {
		output += "<div style='clear:both'><img src='http://cdn.polarrose.com/images/general/logo_polarrose_medium.gif' style='width:130px;'/></div>";
		WISE.create(title, link, output, thisApp.id);
	}
	else {
		WISE.clear(thisApp.id);
	}
	
	
}

thisApp.css = {
	"item":{
		"float":"left",
		"width":"135px",
		"margin":"0 5px 0 0",
		"padding-top":"10px"
	},
	"number":{
		"background":"transparent url(http://www.polarrose.com/images/general/counter_bg_3.png) repeat scroll 0 0",
		"margin":"-5px 0 0 85px",
		"width":"60px",
		"height":"40px",
		"position":"absolute",
		"line-height":"2.1em",
		"font-size":"18px",
		"font-weight":"bold",
		"color":"#FEFEFE",
		"text-align":"center",
		"font-style":"normal"
	},
	"image":{
		"background":"transparent url(http://www.polarrose.com/images/general/stack_bg_many.gif) no-repeat scroll 0 0",
		"padding":"15px 17px 13px 15px",
		"margin":"2px auto 2px",
		"display":"block"
	},
	"link":{
		"text-decoration":"none",
		"display":"block",
		"width":"125px",
		"text-align":"center"
	}
};
