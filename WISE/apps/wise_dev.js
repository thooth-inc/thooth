function devFetch() {
	query = WISE.getQ().q;

	// parse query
	chunks = query.split(' ');

	// lang and function name
	lang = chunks.shift();
	param = chunks.join(' ').replace(/ /g, '_');

	url = WISE.server + "/index.php?action=ajax&rs=wfGetDevelopersJSON&rsargs[]=" + encodeURIComponent(lang)  + "&rsargs[]=" +  encodeURIComponent(param)  + "&rsargs[]=devRender&r=" + Math.random();

	WISE.log(query);
	WISE.log([lang, param]);
	WISE.log(url);

	WISE.call(url, thisApp.id);
}

function devRender(data) {
	WISE.log(data);

	var title;
	var url;
	var output;
	var summary = '';

	switch(data.type) {
		case 'rfc':
			if (data.title.length == 0) {
				return;
			}

			data.summary= data.summary.replace(/\n/g, '<br />');

			title = 'RFC ' + data.id + ' - ' + data.title;
			url = data.href;
			output = '<p style="font-family:monospace; white-space:pre">' + data.summary  + '(<a href="' + data.href  + '">...</a>)</p>';
			break;

		case 'php':
			if (data.desc.length == 0) {
				return;
			}

			title = 'PHP: ' + data.title + '()';

			// local version of php manual
			url = data.href.replace(/{{LANG}}/, WISE.getLang());

			// add CSS classes
			data.params = data.params.replace(/\<dt\>/g, '<dt class="wise_dev_param">');

			output = '<div class="wise_dev_wrapper"><p class="wise_dev_code">' + data.syntax + '</p>' + 
				'<p>' + data.desc  + '</p>' +
				'<h3 class="wise_dev_header">Parameters</h3>' +
				data.params + 
				'<h3 class="wise_dev_header">Returns</h3>' + data.returns +
				'</div>';
			break;

		case 'c':
			if (data.desc.length == 0) {
				return;
			}

			title = 'C: ' + data.title + '()';

			url = data.href;

			// add <br /> after #include <foo>
			data.syntax = data.syntax.replace(/\n/g, '<br />');

			output = '<div class="wise_dev_wrapper"><p class="wise_dev_code">' + data.syntax + '</p>' + 
				'<p>' + data.desc  + '</p>' +
				'</div>';

			break;

		case 'man':
			if (data.desc.length == 0) {
				return;
			}

			title = 'man ' + data.title;

			url = data.href;

			// add <br /> and CSS class to headers
			data.desc = data.desc.replace(/\n/g, '<br />');
			data.desc = data.desc.replace(/<b>/g, '<b class="wise_dev_header">');

			output = '<div class="wise_dev_wrapper"><p class="wise_dev_code">' + data.desc + '</p></div>';

			break;

		default:
			WISE.clear(thisApp.id);
			return;
	}

	// render
	WISE.create(title, url, output, thisApp.id, summary);
}

thisApp.css = {
	'wrapper': {
		'max-height': '300px',
		'overflow':   'auto',
		'padding':    '5px'
	},
	'code' : {
		'background-color': '#fafafa',
		'color':            '#333',
		'font-family':      'monospace',
		'padding':          '5px'
	},
	'header': {
		'color':       '#0080C0',
		'margin':      '20px 0 5px',
		'font-weight': 'normal'
	},
	'param': {
		'color':       '#0080C0',
		'margin':      '20px 0 5px',
		'font-weight': 'bold'
	}
}
