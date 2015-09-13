thisApp.css = {
	"tweet-container":{
		"margin-bottom":"10px"
	},
	"tweet-usernamelink":{
		"font-weight":"800"
	},
	"tweet-replylink":{
		"font-size":"10px"
	},
	"tweet-image":{
		"float":"left",
		"padding-right":"10px"
	},
	"tweet-message":{
		"padding-left":"10px",
		"width":"425px"
	},
	"tweet-date":{
		"font-size":"10px",
		"color":"#777777"
	}
}

function twitterFetch(){
	
	term = encodeURIComponent(thisApp.params[0]);

	WISE.call("http://search.twitter.com/search.json?callback=twitterRender&q="+term+'&page=1&rpp=3', thisApp.id);
}

function twitterRender( j ){

	if( !j ){
		WISE.clear(thisApp.id);
		return false;
	}
	
	search_server_to_use = "http://search.twitter.com/search?q="
	search_url = search_server_to_use + encodeURIComponent(thisApp.params[0])
	search_title = "Twitter - Tweets About " + thisApp.params[0]
	
	found_recent = false	
	result_text = "";
	for(i=0;i<=j.results.length-1;i++){
		
		time_diff = twitter_getSecondsAgo( j.results[i].created_at )
		if( time_diff > ( 60 * 60 * 24 * 3 ) ){ //only show tweets from 3 days max
			continue
		}
		
		found_recent = true;
		
		result_text += "<div class=\"wise_twitter_tweet-container\"><div class=\"wise_twitter_tweet-image\">";
		result_text += "<a href=\"http://www.twitter.com/" + j.results[i].from_user + "/statuses/" + j.results[i].id + "\">"
		result_text += "<img src=\"" + j.results[i].profile_image_url + "\" border=\"0\">";
		result_text += "</a>";
		result_text += "</div>";
		result_text += "<div class=\"wise_twitter_tweet-message\" >"
		result_text += "<a href=\"http://www.twitter.com/" + j.results[i].from_user + "/statuses/" + j.results[i].id + "\" class=\"wise_twitter_tweet-usernamelink\">"
		result_text += j.results[i].from_user
		result_text += "</a>";
		result_text += " " + j.results[i].text + "<br/>"
		result_text += "<span class=\"wise_twitter_tweet-date\">" + twitter_formatDate( time_diff ) + "</span> <a href=\"http://twitter.com/home?status=@" + j.results[i].from_user + "\" class=\"wise_twitter_tweet-replylink\">"
		result_text += "Reply to Tweet" + "</a>";
		result_text += "</div><div style=\"clear:both\"></div></div>"
		
	}
	
	if( found_recent ){
		result_text += "<p><div><a href=\"http://www.twitter.com\" target=\"_top\" title=\"twitter.com\"><img src=\"WISE/apps/images/twitter/powered-by-twitter-sig.gif?1216137693\" alt=\"twitter.com\" border=\"0\" /></a></div>"
		WISE.create(search_title, search_url, result_text, thisApp.id);
	}else{
		WISE.clear(thisApp.id);
		return false;
	}
	

}

function twitter_getSecondsAgo(created_at){
	var ko = new Date();

	t1 = ko.getTime() - WISE.getNowoffset();
	t2 =  Date.parse(created_at) ;
	var diff = t1 - t2;
	
	diff /= 1000;
	return diff
}
	
function plural(num,word){
	if(num == 1) return word;
	return word+"s";
}

function twitter_formatDate( diff ){	
	
	if(diff == 0) return WISE.gettext("Just Now");
	if(diff < 120) return WISE.gettext("Moments Ago");
	var days = Math.floor(diff / 86400);
	if(days > 0) return days + " "+WISE.gettext(plural(days,"day"))+" "+WISE.gettext("ago");
	var hours = Math.floor(diff / 3600);
	if(hours > 0) return hours + " "+WISE.gettext(plural(hours,"hour"))+" "+WISE.gettext("ago");
	var minutes = Math.floor(diff / 60);
	if(minutes > 0) return minutes + " "+WISE.gettext(plural(minutes, "minute"))+" "+WISE.gettext("ago");
}
