function diggFetch(){
	var min_date = new Date();
	var min_date_append = "";
	if(WISE.trim(WISE.Q.q).toLowerCase().indexOf("digg") == -1) min_date_append = "&status=popular&min_promote_date=" + Math.floor(((min_date.getTime()/1000)-(60*60*24*3)))
	else {
		thisApp.params[0] = WISE.trim(WISE.Q.q.replace(/digg/ig, ""));
	}
	var callUrl = "http://services.digg.com/stories?search=" + encodeURIComponent(WISE.trim(thisApp.params[0])) + "&count=3&appkey=http%3A%2F%2Fsearch.wikia.com&type=javascript&sort=digg_count-desc&callback=diggRender" + min_date_append
	WISE.call(callUrl, thisApp.id);

}

function diggRender(j) {
	if(!j.stories || !j.stories.length) {
		WISE.clear(thisApp.id);
		return;
	}
	var title = "Digg - Recent Front Page Stories on " + WISE.trim(thisApp.params[0]);
	var link = "http://digg.com/search?s=" + encodeURIComponent(WISE.trim(thisApp.params[0])) + "&submit=Search&section=all&type=both&area=promoted&sort=new"
	var output = "";
	var table_output = "<table class='wise_digg_table'>";
	for (var i=0; i<j.stories.length; i++) {
		if (!j.stories[i]) break;
		var cur = j.stories[i];

		var dispDate = new Date();
		dispDate.setTime((cur.promote_date ? cur.promote_date : cur.submit_date)*1000);
		output += "<tr><td valign='top'><iframe src='http://digg.com/tools/diggthis.php?u="+escape(cur.link).replace(/\+/g,"%2b")+"&s=compact' frameborder='0' scrolling='no' class='wise_digg_diggthis'></iframe>\n</td><td valign='top' " + ((i<j.stories.length-1)? "class='wise_digg_item'" : "" ) + "><a href='" + cur.href + "'>"+cur.title+"</a><br/>" + cur.description.substring(0,75) + "<br/><div class='wise_digg_stats'><a href='" + cur.href + "' class='wise_digg_comments'>"+ cur.comments + " comments</a> <span class='wise_digg_info'>" + dispDate.toDateString() + "</span></div></td></tr>";
	}
	

	if (output != "") {
		output = table_output + output + "</table>";
		output += "<img src='wise/apps/images/digg/digg.png' width='65'/>";
		WISE.create(title, link, output, thisApp.id);
	}
	else {
		WISE.clear(thisApp.id);
	}
	
	
}

thisApp.css = {
	"item":{
		"padding":"0 0 10px 0"
	},
	"diggthis":{
		"padding-top":"3px",
		"height":"18px",
		"width":"120px",
		"margin-left":"-10px"
	},
	"stats":{
		"padding":"0px 0px 2px 0px"
	},
	"info":{
		"font-size":"11px",
		"color":"#767676",
		"padding-left":"5px"
	},
	"comments":{
		"font-size":"11px",
		"text-decoration":"none"
	},
	"comments:hover":{
		"text-decoration":"underline"
	}
};
