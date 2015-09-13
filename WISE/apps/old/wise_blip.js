WISE.apps.blip = {
    "name":"Blip",
    "logo":"http://blip.pl/favicon.ico",
    "author": "Maciej 'macbre' Brencz",
    "description":"Ostatnie wpisy na blipie",
    "categories":[ "Blogs", "Other" ],
    "id":"blip",
    "regex":/(?:blip )(.+)|(.+)(?: blip)/i,
    "url":"WISE/apps/wise_blip.js?r=" + Math.random(),
    "action":"blipFetch"
};


//function parses mysql datetime string and returns javascript Date object
//input has to be in this format: 2007-06-05 15:26:02
function mysqlTimeStampToDate(timestamp) {
	var regex=/^([0-9]{2,4})-([0-1][0-9])-([0-3][0-9]) (?:([0-2][0-9]):([0-5][0-9]):([0-5][0-9]))?$/;
	var parts=timestamp.replace(regex,"$1 $2 $3 $4 $5 $6").split(' ');
	return new Date(parts[0],parts[1]-1,parts[2],parts[3],parts[4],parts[5]);
}

function blipFetch() {
	var user = WISE.trim(thisApp.params[0]);
	WISE.log('blip: fetching latest messages from "' + user + '"...');
	WISE.call('http://api.blip.pl/users/' + encodeURIComponent(user) + '/statuses.json?limit=5&callback=blipRender', thisApp.id);
}

function blipRender(data) {
	WISE.log(data);

	var user = WISE.trim(thisApp.params[0]);

	// prepare output
	var title = user + '.blip';
	var url = 'http://' + user + '.blip.pl'
	var output = '';

	var now = new Date();

	for (i=0; i < data.length; i++) {
		var time = mysqlTimeStampToDate(data[i].created_at);
		var diff = window.parent.whenAgo(now, time);

		// replace raw URL with HTML link
		var msg = data[i].body;
		msg = msg.replace(/(http:\/\/[\w\/\.\?\,\:\;\&\%]+)/g, '<a href="$1" style="text-decoration:none">link</a>');

		output += '<div class="wise_blip_msg"><p class="wise_blip_note">'+
			'<a class="wise_blip_permalink" href="http://blip.pl/statuses/' + data[i].id  + '">&nbsp;</a>' + msg  +
			'<span class="wise_blip_time">' + diff + '</span></p></div>';
	}

	// render
	WISE.create(title, url, output, thisApp.id);
}

thisApp.css = {
	'msg': {
		'border':	'4px solid #F6F6FA',
		'margin':	'8px 0px',
		'padding':	'6px'
	},
	'note': {
		'margin':	'0px'
	},
	'permalink': {
		'background':	'#fff url("http://static1.blip.pl/favicon.gif") no-repeat 50% 50%',
		'height':	'16px',
		'width':	'16px',
		'display':	'block',
		'float':	'left',
		'margin-right':	'5px',
		'text-decoration': 'none'
	},
	'time': {
		'margin-left':	'10px',
		'color':	'#666666',
		'font-size':	'smaller',
		'white-space':	'pre'
	}
};
