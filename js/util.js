// general purpose utils

function getCookie(name)
{ // cookie grabber
        var C = document.cookie.split("; ");
        for (i=0; i < C.length; i++)
        {
                kv = C[i].split("=");
                if(kv[0] == name){ return unescape(kv[1].replace(/\+/g, "%20")); }
        }
        return false;
}

var tok = getCookie("thoothSearchToken");
var un = decodeURIComponent( getCookie("searchUserName") );
var isAdmin = getCookie("thoothSearchAdminToken");

function getBlockLink(user_name) {
	return "http://thooth.com/index.php?title=Special:Blockip&wpBlockAddress=" + encodeURIComponent(user_name);
}

function comma(number) {
  
  number = '' + number;
  
  if (number.length > 3) {  
    var mod = number.length % 3;
    var output = (mod > 0 ? (number.substring(0,mod)) : '');
      
    for (i=0 ; i < Math.floor(number.length / 3); i++) {
      if ((mod == 0) && (i == 0)) {
        output += number.substring(mod+ 3 * i, mod + 3 * i + 3);
      } else {
        output+= ',' + number.substring(mod + 3 * i, mod + 3 * i + 3);
      }
    }
  
  return (output);
  
  }
  
  else return number;
}

function jsload(url)
{
	var head = document.getElementsByTagName('head')[0];
	var s = document.createElement('script');
	s.src = url;
	head.appendChild(s);
}


function boost(amount)
{
    amount -= 0;
    amount = (Math.round(amount*100))/100;
    return (amount == Math.floor(amount)) ? amount + '.00' : (  (amount*10 == Math.floor(amount*10)) ? amount + '0' : amount);
}


// take a simple form object and create the actual html for it
function reForm(f,base)
{
	var submit=false;
	var htm = '';
	var rebase = /(.+\/)[^\/]+$/;
	var method = (f.method && f.method.length > 0) ? f.method : "get";
	var abase = base.match(rebase) ? base.match(rebase)[1] : base; 
	if(f.action.substr(0,4) == "http") abase="";
	if(abase.substr(-1,1) == "/" && f.action.substr(0,1) == "/") f.action = f.action.substr(1); 
	htm += '<form method="'+method+'" action="'+abase+f.action+'">';
	for(var i=0; i < f.elements.length; i++)
	{
		var e = f.elements[i];
		if(e.type == "text"){
			htm += '<input name="'+e.name+'" value="'+e.value+'">';
		}else if(e.type == "button"){
			htm += '<input type="button" name="'+e.name+'" value="'+e.value+'">';
		}else if(e.type == "hidden"){
			htm += '<input type="hidden" name="'+e.name+'" value="'+e.value+'">';
		}else if(e.type == "checkbox"){
			var chk = (e.checked) ? "checked" : "";
			htm += '<input type="checkbox" name="'+e.name+'" value="'+e.value+'" '+chk+'>';
		}else if(e.type == "password"){
			htm += '<input type="password" name="'+e.name+'">';
		}else if(e.type == "reset"){
			htm += '<input type="reset" name="'+e.name+'" value="'+e.value+'">';
		}else if(e.type == "select-one"){
			htm += '<select name="'+e.name+'">';
			for(var k=0; k < e.options.length; k++)
			{
				var sel = (e.options[k].selected) ? "selected" : "";
				htm += '<option value="'+e.options[k].value+'" '+sel+'>'+e.options[k].text+'</option>';
			}
			htm += '</select>';

		}else if(e.type == "submit"){
			submit=true;
			htm += '<input type="submit" name="'+e.name+'" value="'+e.value+'">';
		}else if(e.type == "textarea"){
			htm += '<textarea name="'+e.name+'">"'+e.value+'</textarea>';
		}
	}
	if(!submit) htm += '<input type="submit" value="go">';
	htm += '</form>';
	return htm;
}

function getWindowWidth(){
  if (self.innerWidth) {
    frameWidth = self.innerWidth;
  } else if (document.documentElement && document.documentElement.clientWidth) {
    frameWidth = document.documentElement.clientWidth; 
  } else if (document.body) {
    frameWidth = document.body.clientWidth;
  }
  return parseInt(frameWidth);
}

function getWindowHeight(){
  if (self.innerHeight) {
    frameHeight = self.innerHeight;
  } else if (document.documentElement && document.documentElement.clientHeight) {
    frameHeight = document.documentElement.clientHeight; 
  } else if (document.body) {
    frameHeight = document.body.clientHeight;
  }
  return parseInt(frameHeight);
}

function getScrollHeight(){
  var y;
  // all except Explorer
  if (self.pageYOffset) {
      y = self.pageYOffset;
  } else if (document.documentElement && document.documentElement.scrollTop) {
      y = document.documentElement.scrollTop;
  } else if (document.body)     {
      y = document.body.scrollTop;
  }
  return parseInt(y)+getWindowHeight();
}

function plural(num,word){
	if(num == 1) return word;
	return word+"s";
}

// return friendly time difference
function whenAgo(t1,t2){
	if(!t1 || !t2) return getspan("just now");
	var diff = t1 - t2;
	diff /= 1000;
	if(diff == 0) return getspan("just now");
	if(diff < 120) return getspan("moments ago");
	var months = Math.floor(diff / 2592000);
	if(months > 0) return months + " "+getspan(plural(months,"month"))+" "+getspan("ago");
	var days = Math.floor(diff / 86400);
	if(days > 0) return days + " "+getspan(plural(days,"day"))+" "+getspan("ago");
	var hours = Math.floor(diff / 3600);
	if(hours > 0) return hours + " "+getspan(plural(hours,"hour"))+" "+getspan("ago");
	var minutes = Math.floor(diff / 60);
	if(minutes > 0) return minutes + " "+getspan(plural(minutes, "minute"))+" "+getspan("ago");
}

// return years
function formDate(id, name, tabindex, month, day, year, selected) {

	var output = "";
	
	var selected_month = false;
	var selected_day = false;
	var selected_year = false;
	
	if(selected) {
		if (selected.month) selected_month = parseInt(selected.month);
		if (selected.day) selected_day = parseInt(selected.day);
		if (selected.year) selected_year = parseInt(selected.year);
	}
	
	if (month==1) {
		//Month
		var month = new Array ("Jan", "Feb", "March", "April", "May", "June", "July", "August", "Sept", "Oct","Nov", "Dec")

		output += "<select id=\""+id+"month\" name=\""+name+"month\" tabindex=\""+tabindex+"\">";
		output += "<option value=\"\">Month</option>";

		for (m=0; m<=11;m++) {
			output += "<option value=\""+(m+1)+"\"" + ((selected_month && selected_month == (m+1)) ? " selected" : "")  + ">" +month[m]+ "</option>";
		}
		output += "</select> ";
		tabindex++;
	}

	if (day==1) {
		//Day
		output += "<select id=\""+id+"date\" name=\""+name+"date\" tabindex=\""+tabindex+"\">";
		output += "<option value=\"\">Day</option>";

		for (d=1; d<=31;d++) {
			output += "<option value=\""+d+"\"" + ((selected_day && selected_day == (d)) ? " selected" : "")  + ">" +d+ "</option>";
		}
		output += "</select> ";	
		tabindex++;
	}
	
	if (year==1) {
	
		//Year
		var time = new Date();
	  	var year = time.getYear();

	  	if (year < 1900) {
	    	year = year + 1900;
	  	}
	  	var min_year = 1900;

	  	output += "<select id=\""+id+"year\" name=\""+name+"year\" tabindex=\""+tabindex+"\">";
		output += "<option value=\"\">Year</option>";

		while (year >= min_year) {
			output += "<option value=\""+year+"\"" + ((selected_year && selected_year == (year)) ? " selected" : "")  + ">" +year+ "</option>";
			year--;
		}
		output += "</select>";
		tabindex++;
	}

	return output;

}

function is_IP(ipaddr) {
	var re = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
	if (re.test(ipaddr)) {
	var parts = ipaddr.split(".");
	if (parseInt(parseFloat(parts[0])) == 0) { return false; }
	for (var i=0; i<parts.length; i++) {
		if (parseInt(parseFloat(parts[i])) > 255) { return false; }
	}
		return true;
	} else {
		return false;
	}
}

// For each human language there should be a mapping from its
// language code to its native laguage name. For example, for Greek,
// the language code "el" would be mapped to "Ελληνικά".

// In addition, for the currently selected language, there should be a
// mapping from the language code to the name of the language under
// consideration in the currently selected language.  If for example
// the current language is French, that mapping would map "el" to
// "grec", which is french for Greek.  Keeping these mappings
// conceptually separate avoids having to load all names of all
// languages in every other language.  This mapping can be implemented
// using the translation table.

// To ease debugging, and to save space in the common case, the
// english names are maintained in the same mapping as the native
// names.
//
// Auto-generated from /languages/Names.php (MW1.14alpha) 
//'LANGUAGE_CODE':['"name": NATIVE_NAME', "desc": en, "rtl": boolean],
var langs =
{
	"aa":{"name":"Afar","desc":"Afar","rtl":false},
	"ab":{"name":"\u0410\u04a7\u0441\u0443\u0430","desc":"Abkhaz","rtl":false},
	"ace":{"name":"Ach\u00e8h","desc":"Aceh","rtl":false},
	"af":{"name":"Afrikaans","desc":"Afrikaans","rtl":false},
	"ak":{"name":"Akan","desc":"Akan","rtl":false},
	"aln":{"name":"Geg\u00eb","desc":"Gheg Albanian","rtl":false},
	"als":{"name":"Alemannisch","desc":"Alemannic","rtl":false},
	"am":{"name":"\u12a0\u121b\u122d\u129b","desc":"Amharic","rtl":false},
	"an":{"name":"Aragon\u00e9s","desc":"Aragonese","rtl":false},
	"ang":{"name":"Anglo-Saxon","desc":"Old English","rtl":false},
	"ar":{"name":"\u0627\u0644\u0639\u0631\u0628\u064a\u0629","desc":"Arabic","rtl":false},
	"arc":{"name":"\u0710\u072a\u0721\u071d\u0710","desc":"Aramaic","rtl":true},
	"arn":{"name":"Mapudungun","desc":"Mapuche, Mapudungu, Araucanian (Araucano)","rtl":false},
	"arz":{"name":"\u0645\u0635\u0631\u0649","desc":"Egyptian Spoken Arabic","rtl":false},
	"as":{"name":"\u0985\u09b8\u09ae\u09c0\u09df\u09be","desc":"Assamese","rtl":false},
	"ast":{"name":"Asturianu","desc":"Asturian","rtl":false},
	"av":{"name":"\u0410\u0432\u0430\u0440","desc":"Avar","rtl":false},
	"avk":{"name":"Kotava","desc":"Kotava","rtl":false},
	"ay":{"name":"Aymar aru","desc":"Aymara","rtl":false},
	"az":{"name":"Az\u0259rbaycan","desc":"Azerbaijani","rtl":false},
	"ba":{"name":"\u0411\u0430\u0448\u04a1\u043e\u0440\u0442","desc":"Bashkir","rtl":false},
	"bar":{"name":"Boarisch","desc":"Bavarian (Austro-Bavarian and South Tyrolean)","rtl":false},
	"bat-smg":{"name":"\u017demait\u0117\u0161ka","desc":"Samogitian","rtl":false},
	"bcc":{"name":"\u0628\u0644\u0648\u0686\u06cc \u0645\u06a9\u0631\u0627\u0646\u06cc","desc":"Southern Balochi","rtl":false},
	"bcl":{"name":"Bikol Central","desc":"Bikol: Central Bicolano language","rtl":false},
	"be":{"name":"\u0411\u0435\u043b\u0430\u0440\u0443\u0441\u043a\u0430\u044f","desc":"Belarusian normative","rtl":false},
	"be-tarask":{"name":"\u0411\u0435\u043b\u0430\u0440\u0443\u0441\u043a\u0430\u044f (\u0442\u0430\u0440\u0430\u0448\u043a\u0435\u0432\u0456\u0446\u0430)","desc":"Belarusian in Taraskievica orthography","rtl":false},
	"bg":{"name":"\u0411\u044a\u043b\u0433\u0430\u0440\u0441\u043a\u0438","desc":"Bulgarian","rtl":false},
	"bh":{"name":"\u092d\u094b\u091c\u092a\u0941\u0930\u0940","desc":"Bhojpuri","rtl":false},
	"bi":{"name":"Bislama","desc":"Bislama","rtl":false},
	"bm":{"name":"Bamanankan","desc":"Bambara","rtl":false},
	"bn":{"name":"\u09ac\u09be\u0982\u09b2\u09be","desc":"Bengali","rtl":false},
	"bo":{"name":"\u0f56\u0f7c\u0f51\u0f0b\u0f61\u0f72\u0f42","desc":"Tibetan","rtl":false},
	"bpy":{"name":"\u0987\u09ae\u09be\u09b0 \u09a0\u09be\u09b0\/\u09ac\u09bf\u09b7\u09cd\u09a3\u09c1\u09aa\u09cd\u09b0\u09bf\u09af\u09bc\u09be \u09ae\u09a3\u09bf\u09aa\u09c1\u09b0\u09c0","desc":"Bishnupriya Manipuri","rtl":false},
	"bqi":{"name":"\u0628\u062e\u062a\u064a\u0627\u0631\u064a","desc":"Bakthiari","rtl":false},
	"br":{"name":"Brezhoneg","desc":"Breton","rtl":false},
	"bs":{"name":"Bosanski","desc":"Bosnian","rtl":false},
	"bto":{"name":"Iriga Bicolano","desc":"Iriga Bicolano\/Rinconada Bikol","rtl":false},
	"bug":{"name":"\u1a05\u1a14 \u1a15\u1a18\u1a01\u1a17","desc":"Bugis","rtl":false},
	"bxr":{"name":"\u0411\u0443\u0440\u044f\u0430\u0434","desc":"Buryat (Russia)","rtl":false},
	"ca":{"name":"Catal\u00e0","desc":"Catalan","rtl":false},
	"cbk-zam":{"name":"Chavacano de Zamboanga","desc":"Zamboanga Chavacano","rtl":false},
	"cdo":{"name":"M\u00ecng-d\u0115\u0324ng-ng\u1e73\u0304","desc":"Min Dong","rtl":false},
	"ce":{"name":"\u041d\u043e\u0445\u0447\u0438\u0439\u043d","desc":"Chechen","rtl":false},
	"ceb":{"name":"Cebuano","desc":"Cebuano","rtl":false},
	"ch":{"name":"Chamoru","desc":"Chamorro","rtl":false},
	"cho":{"name":"Choctaw","desc":"Choctaw","rtl":false},
	"chr":{"name":"\u13e3\u13b3\u13a9","desc":"Cherokee","rtl":false},
	"chy":{"name":"Tsets\u00eahest\u00e2hese","desc":"Cheyenne","rtl":false},
	"co":{"name":"Corsu","desc":"Corsican","rtl":false},
	"cr":{"name":"N\u0113hiyaw\u0113win \/ \u14c0\u1426\u1403\u152d\u140d\u140f\u1423","desc":"Cree","rtl":false},
	"crh":{"name":"Q\u0131r\u0131mtatarca","desc":"Crimean Tatar","rtl":false},
	"crh-latn":{"name":"\u202aQ\u0131r\u0131mtatarca (Latin)\u202c","desc":"Crimean Tatar (Latin)","rtl":false},
	"crh-cyrl":{"name":"\u202a\u041a\u044a\u044b\u0440\u044b\u043c\u0442\u0430\u0442\u0430\u0440\u0434\u0436\u0430 (\u041a\u0438\u0440\u0438\u043b\u043b)\u202c","desc":"Crimean Tatar (Cyrillic)","rtl":false},
	"cs":{"name":"\u010cesky","desc":"Czech","rtl":false},
	"csb":{"name":"Kasz\u00ebbsczi","desc":"Cassubian","rtl":false},
	"cu":{"name":"\u0421\u043b\u043e\u0432\u0463\u0301\u043d\u044c\u0441\u043a\u044a \/ \u2c14\u2c0e\u2c11\u2c02\u2c21\u2c10\u2c20\u2c14\u2c0d\u2c1f","desc":"Old Church Slavonic","rtl":false},
	"cv":{"name":"\u0427\u0103\u0432\u0430\u0448\u043b\u0430","desc":"Chuvash","rtl":false},
	"cy":{"name":"Cymraeg","desc":"Welsh","rtl":false},
	"da":{"name":"Dansk","desc":"Danish","rtl":false},
	"de":{"name":"Deutsch","desc":"German (\"Du\")","rtl":false},
	"de-formal":{"name":"Deutsch (Sie-Form)","desc":"German - formal address","rtl":false},
	"diq":{"name":"Zazaki","desc":"Zazaki","rtl":false},
	"dsb":{"name":"Dolnoserbski","desc":"Lower Sorbian","rtl":false},
	"dv":{"name":"\u078b\u07a8\u0788\u07ac\u0780\u07a8\u0784\u07a6\u0790\u07b0","desc":"Dhivehi","rtl":true},
	"dz":{"name":"\u0f47\u0f7c\u0f44\u0f0b\u0f41","desc":"Bhutani","rtl":false},
	"ee":{"name":"E\u028begbe","desc":"\u00c9w\u00e9","rtl":false},
	"el":{"name":"\u0395\u03bb\u03bb\u03b7\u03bd\u03b9\u03ba\u03ac","desc":"Greek","rtl":false},
	"eml":{"name":"Emili\u00e0n e rumagn\u00f2l","desc":"Emiliano-Romagnolo \/ Sammarinese","rtl":false},
	"en":{"name":"English","desc":"English","rtl":false},
	"en-gb":{"name":"British English","desc":"British English","rtl":false},
	"eo":{"name":"Esperanto","desc":"Esperanto","rtl":false},
	"es":{"name":"Espa\u00f1ol","desc":"Spanish","rtl":false},
	"et":{"name":"Eesti","desc":"Estonian","rtl":false},
	"eu":{"name":"Euskara","desc":"Basque","rtl":false},
	"ext":{"name":"Estreme\u00f1u","desc":"Extremaduran","rtl":false},
	"fa":{"name":"\u0641\u0627\u0631\u0633\u06cc","desc":"Persian","rtl":true},
	"ff":{"name":"Fulfulde","desc":"Fulfulde, Maasina","rtl":false},
	"fi":{"name":"Suomi","desc":"Finnish","rtl":false},
	"fiu-vro":{"name":"V\u00f5ro","desc":"V\u00f5ro","rtl":false},
	"fj":{"name":"Na Vosa Vakaviti","desc":"Fijian","rtl":false},
	"fo":{"name":"F\u00f8royskt","desc":"Faroese","rtl":false},
	"fr":{"name":"Fran\u00e7ais","desc":"French","rtl":false},
	"frc":{"name":"Fran\u00e7ais cadien","desc":"Cajun French","rtl":false},
	"frp":{"name":"Arpetan","desc":"Franco-Proven\u00e7al\/Arpitan","rtl":false},
	"fur":{"name":"Furlan","desc":"Friulian","rtl":false},
	"fy":{"name":"Frysk","desc":"Frisian","rtl":false},
	"ga":{"name":"Gaeilge","desc":"Irish","rtl":false},
	"gag":{"name":"Gagauz","desc":"Gagauz","rtl":false},
	"gan":{"name":"\u8d1b\u8a9e","desc":"Gan","rtl":false},
	"gd":{"name":"G\u00e0idhlig","desc":"Scots Gaelic","rtl":false},
	"gl":{"name":"Galego","desc":"Galician","rtl":false},
	"glk":{"name":"\u06af\u06cc\u0644\u06a9\u06cc","desc":"Gilaki","rtl":false},
	"gn":{"name":"Ava\u00f1e\\'\u1ebd","desc":"Guaran\u00ed, Paraguayan","rtl":false},
	"got":{"name":"\ud800\udf32\ud800\udf3f\ud800\udf44\ud800\udf39\ud800\udf43\ud800\udf3a","desc":"Gothic","rtl":false},
	"grc":{"name":"\u1f08\u03c1\u03c7\u03b1\u03af\u03b1 \u1f11\u03bb\u03bb\u03b7\u03bd\u03b9\u03ba\u1f74","desc":"Ancient Greece","rtl":false},
	"gsw":{"name":"Alemannisch","desc":"Alemannic","rtl":false},
	"gu":{"name":"\u0a97\u0ac1\u0a9c\u0ab0\u0abe\u0aa4\u0ac0","desc":"Gujarati","rtl":false},
	"gv":{"name":"Gaelg","desc":"Manx","rtl":false},
	"ha":{"name":"\u0647\u064e\u0648\u064f\u0633\u064e","desc":"Hausa","rtl":false},
	"hak":{"name":"Hak-k\u00e2-fa","desc":"Hakka","rtl":false},
	"haw":{"name":"Hawai`i","desc":"Hawaiian","rtl":false},
	"he":{"name":"\u05e2\u05d1\u05e8\u05d9\u05ea","desc":"Hebrew","rtl":true},
	"hi":{"name":"\u0939\u093f\u0928\u094d\u0926\u0940","desc":"Hindi","rtl":false},
	"hif":{"name":"Fiji Hindi","desc":"Fijian Hindi","rtl":false},
	"hif-deva":{"name":"\u092b\u093c\u0940\u091c\u0940 \u0939\u093f\u0928\u094d\u0926\u0940","desc":"Fiji Hindi (devangari)","rtl":false},
	"hif-latn":{"name":"Fiji Hindi","desc":"Fiji Hindi (latin)","rtl":false},
	"hil":{"name":"Ilonggo","desc":"Hiligaynon","rtl":false},
	"ho":{"name":"Hiri Motu","desc":"Hiri Motu","rtl":false},
	"hr":{"name":"Hrvatski","desc":"Croatian","rtl":false},
	"hsb":{"name":"Hornjoserbsce","desc":"Upper Sorbian","rtl":false},
	"ht":{"name":"Krey\u00f2l ayisyen","desc":"Haitian Creole French","rtl":false},
	"hu":{"name":"Magyar","desc":"Hungarian","rtl":false},
	"hy":{"name":"\u0540\u0561\u0575\u0565\u0580\u0565\u0576","desc":"Armenian","rtl":false},
	"hz":{"name":"Otsiherero","desc":"Herero","rtl":false},
	"ia":{"name":"Interlingua","desc":"Interlingua (IALA)","rtl":false},
	"id":{"name":"Bahasa Indonesia","desc":"Indonesian","rtl":false},
	"ie":{"name":"Interlingue","desc":"Interlingue (Occidental)","rtl":false},
	"ig":{"name":"Igbo","desc":"Igbo","rtl":false},
	"ii":{"name":"\ua187\ua259","desc":"Sichuan Yi","rtl":false},
	"ik":{"name":"I\u00f1upiak","desc":"Inupiak (Inupiatun, Northwest Alaska \/ Inupiatun, North Alaskan)","rtl":false},
	"ike-cans":{"name":"\u1403\u14c4\u1483\u144e\u1450\u1466","desc":"Inuktitut, Eastern Canadian\/Eastern Canadian \"Eskimo\"\/\"Eastern Arctic Eskimo\"\/Inuit (Unified Canadian Aboriginal Syllabics)","rtl":false},
	"ike-latn":{"name":"inuktitut","desc":"Inuktitut, Eastern Canadian (Latin script)","rtl":false},
	"ilo":{"name":"Ilokano","desc":"Ilokano","rtl":false},
	"inh":{"name":"\u0413\u0406\u0430\u043b\u0433\u0406\u0430\u0439 \u011eal\u011faj","desc":"Ingush","rtl":false},
	"io":{"name":"Ido","desc":"Ido","rtl":false},
	"is":{"name":"\u00cdslenska","desc":"Icelandic","rtl":false},
	"it":{"name":"Italiano","desc":"Italian","rtl":false},
	"iu":{"name":"\u1403\u14c4\u1483\u144e\u1450\u1466\/inuktitut","desc":"Inuktitut","rtl":false},
	"ja":{"name":"\u65e5\u672c\u8a9e","desc":"Japanese","rtl":false},
	"jbo":{"name":"Lojban","desc":"Lojban","rtl":false},
	"jut":{"name":"Jysk","desc":"Jutish \/ Jutlandic","rtl":false},
	"jv":{"name":"Basa Jawa","desc":"Javanese","rtl":false},
	"ka":{"name":"\u10e5\u10d0\u10e0\u10d7\u10e3\u10da\u10d8","desc":"Georgian","rtl":false},
	"kaa":{"name":"Qaraqalpaqsha","desc":"Karakalpak","rtl":false},
	"kab":{"name":"Taqbaylit","desc":"Kabyle","rtl":false},
	"ki":{"name":"G\u0129k\u0169y\u0169","desc":"Gikuyu","rtl":false},
	"kj":{"name":"Kwanyama","desc":"Kwanyama","rtl":false},
	"kk":{"name":"\u049a\u0430\u0437\u0430\u049b\u0448\u0430","desc":"Kazakh","rtl":false},
	"kk-arab":{"name":"\u202b\u0642\u0627\u0632\u0627\u0642\u0634\u0627 (\u062a\u0674\u0648\u062a\u06d5)\u202c","desc":"Kazakh Arabic","rtl":false},
	"kk-cyrl":{"name":"\u202a\u049a\u0430\u0437\u0430\u049b\u0448\u0430 (\u043a\u0438\u0440\u0438\u043b)\u202c","desc":"Kazakh Cyrillic","rtl":false},
	"kk-latn":{"name":"\u202aQazaq\u015fa (lat\u0131n)\u202c","desc":"Kazakh Latin","rtl":false},
	"kk-cn":{"name":"\u202b\u0642\u0627\u0632\u0627\u0642\u0634\u0627 (\u062c\u06c7\u0646\u06af\u0648)\u202c","desc":"Kazakh (China)","rtl":false},
	"kk-kz":{"name":"\u202a\u049a\u0430\u0437\u0430\u049b\u0448\u0430 (\u049a\u0430\u0437\u0430\u049b\u0441\u0442\u0430\u043d)\u202c","desc":"Kazakh (Kazakhstan)","rtl":false},
	"kk-tr":{"name":"\u202aQazaq\u015fa (T\u00fcrk\u00efya)\u202c","desc":"Kazakh (Turkey)","rtl":false},
	"kl":{"name":"Kalaallisut","desc":"Inuktitut, Greenlandic\/Greenlandic\/Kalaallisut (kal)","rtl":false},
	"km":{"name":"\u1797\u17b6\u179f\u17b6\u1781\u17d2\u1798\u17c2\u179a","desc":"Khmer, Central","rtl":false},
	"kn":{"name":"\u0c95\u0ca8\u0ccd\u0ca8\u0ca1","desc":"Kannada","rtl":false},
	"ko":{"name":"\ud55c\uad6d\uc5b4","desc":"Korean","rtl":false},
	"kr":{"name":"Kanuri","desc":"Kanuri, Central","rtl":false},
	"kri":{"name":"Krio","desc":"Krio","rtl":false},
	"krj":{"name":"Kinaray-a","desc":"Kinaray-a","rtl":false},
	"ks":{"name":"\u0915\u0936\u094d\u092e\u0940\u0930\u0940 - (\u0643\u0634\u0645\u064a\u0631\u064a)","desc":"Kashmiri","rtl":true},
	"ksh":{"name":"Ripoarisch","desc":"Ripuarian","rtl":false},
	"ku":{"name":"Kurd\u00ee \/ \u0643\u0648\u0631\u062f\u06cc","desc":"Kurdish","rtl":false},
	"ku-latn":{"name":"\u202aKurd\u00ee (lat\u00een\u00ee)\u202c","desc":"Northern Kurdish Latin script","rtl":false},
	"ku-arab":{"name":"\u202b\u0643\u0648\u0631\u062f\u064a (\u0639\u06d5\u0631\u06d5\u0628\u06cc)\u202c","desc":"Northern Kurdish Arabic script","rtl":false},
	"kv":{"name":"\u041a\u043e\u043c\u0438","desc":"Komi-Zyrian","rtl":false},
	"kw":{"name":"Kernewek","desc":"Cornish","rtl":false},
	"ky":{"name":"\u041a\u044b\u0440\u0433\u044b\u0437\u0447\u0430","desc":"Kirghiz","rtl":false},
	"la":{"name":"Latina","desc":"Latin","rtl":false},
	"lad":{"name":"Ladino","desc":"Ladino","rtl":false},
	"lb":{"name":"L\u00ebtzebuergesch","desc":"Luxemburguish","rtl":false},
	"lbe":{"name":"\u041b\u0430\u043a\u043a\u0443","desc":"Lak","rtl":false},
	"lez":{"name":"\u041b\u0435\u0437\u0433\u0438","desc":"Lezgi","rtl":false},
	"lfn":{"name":"Lingua Franca Nova","desc":"Lingua Franca Nova","rtl":false},
	"lg":{"name":"Luganda","desc":"Ganda","rtl":false},
	"li":{"name":"Limburgs","desc":"Limburgian","rtl":false},
	"lij":{"name":"L\u00edguru","desc":"Ligurian","rtl":false},
	"lld":{"name":"Ladin","desc":"Ladin","rtl":false},
	"lmo":{"name":"Lumbaart","desc":"Lombard","rtl":false},
	"ln":{"name":"Ling\u00e1la","desc":"Lingala","rtl":false},
	"lo":{"name":"\u0ea5\u0eb2\u0ea7","desc":"Laotian","rtl":false},
	"loz":{"name":"Silozi","desc":"Lozi","rtl":false},
	"lt":{"name":"Lietuvi\u0173","desc":"Lithuanian","rtl":false},
	"lv":{"name":"Latvie\u0161u","desc":"Latvian","rtl":false},
	"lzz":{"name":"Lazuri Nena","desc":"Laz","rtl":false},
	"mai":{"name":"\u092e\u0948\u0925\u093f\u0932\u0940","desc":"Maithili","rtl":false},
	"map-bms":{"name":"Basa Banyumasan","desc":"Banyumasan","rtl":false},
	"mdf":{"name":"\u041c\u043e\u043a\u0448\u0435\u043d\u044c","desc":"Moksha","rtl":false},
	"mg":{"name":"Malagasy","desc":"Malagasy","rtl":false},
	"mh":{"name":"Ebon","desc":"Marshallese","rtl":false},
	"mhr":{"name":"\u041e\u043b\u044b\u043a \u041c\u0430\u0440\u0438\u0439","desc":"Eastern Mari","rtl":false},
	"mi":{"name":"M\u0101ori","desc":"Maori","rtl":false},
	"mk":{"name":"\u041c\u0430\u043a\u0435\u0434\u043e\u043d\u0441\u043a\u0438","desc":"Macedonian","rtl":false},
	"ml":{"name":"\u0d2e\u0d32\u0d2f\u0d3e\u0d33\u0d02","desc":"Malayalam","rtl":false},
	"mn":{"name":"\u041c\u043e\u043d\u0433\u043e\u043b","desc":"Halh Mongolian (Cyrillic)","rtl":false},
	"mo":{"name":"\u041c\u043e\u043b\u0434\u043e\u0432\u0435\u043d\u044f\u0441\u043a\u044d","desc":"Moldovan","rtl":false},
	"mr":{"name":"\u092e\u0930\u093e\u0920\u0940","desc":"Marathi","rtl":false},
	"ms":{"name":"Bahasa Melayu","desc":"Malay","rtl":false},
	"mt":{"name":"Malti","desc":"Maltese","rtl":false},
	"mus":{"name":"Mvskoke","desc":"Muskogee\/Creek","rtl":false},
	"mwl":{"name":"Mirand\u00e9s","desc":"Mirandese","rtl":false},
	"my":{"name":"Myanmasa","desc":"Burmese","rtl":false},
	"myv":{"name":"\u042d\u0440\u0437\u044f\u043d\u044c","desc":"Erzya","rtl":false},
	"mzn":{"name":"\u0645\u064e\u0632\u0650\u0631\u0648\u0646\u064a","desc":"Mazanderani","rtl":true},
	"na":{"name":"Dorerin Naoero","desc":"Nauruan","rtl":false},
	"nah":{"name":"N\u0101huatl","desc":"Nahuatl","rtl":false},
	"nan":{"name":"B\u00e2n-l\u00e2m-g\u00fa","desc":"Min-nan","rtl":false},
	"nap":{"name":"Nnapulitano","desc":"Neapolitan","rtl":false},
	"nb":{"name":"\u202aNorsk (bokm\u00e5l)\u202c","desc":"Norwegian (Bokmal)","rtl":false},
	"nds":{"name":"Plattd\u00fc\u00fctsch","desc":"Low German ''or'' Low Saxon","rtl":false},
	"nds-nl":{"name":"Nedersaksisch","desc":"Dutch Low Saxon","rtl":false},
	"ne":{"name":"\u0928\u0947\u092a\u093e\u0932\u0940","desc":"Nepali","rtl":false},
	"new":{"name":"\u0928\u0947\u092a\u093e\u0932 \u092d\u093e\u0937\u093e","desc":"Newar \/ Nepal Bhasa","rtl":false},
	"ng":{"name":"Oshiwambo","desc":"Ndonga","rtl":false},
	"niu":{"name":"Niu\u0113","desc":"Niuean","rtl":false},
	"nl":{"name":"Nederlands","desc":"Dutch","rtl":false},
	"nn":{"name":"\u202aNorsk (nynorsk)\u202c","desc":"Norwegian (Nynorsk)","rtl":false},
	"no":{"name":"\u202aNorsk (bokm\u00e5l)\u202c","desc":"Norwegian","rtl":false},
	"nov":{"name":"Novial","desc":"Novial","rtl":false},
	"nrm":{"name":"Nouormand","desc":"Norman","rtl":false},
	"nso":{"name":"Sesotho sa Leboa","desc":"Northern Sotho","rtl":false},
	"nv":{"name":"Din\u00e9 bizaad","desc":"Navajo","rtl":false},
	"ny":{"name":"Chi-Chewa","desc":"Chichewa","rtl":false},
	"oc":{"name":"Occitan","desc":"Occitan","rtl":false},
	"om":{"name":"Oromoo","desc":"Oromo","rtl":false},
	"or":{"name":"\u0b13\u0b5c\u0b3f\u0b06","desc":"Oriya","rtl":false},
	"os":{"name":"\u0418\u0440\u043e\u043d\u0430\u0443","desc":"Ossetic","rtl":false},
	"pa":{"name":"\u0a2a\u0a70\u0a1c\u0a3e\u0a2c\u0a40","desc":"Eastern Punjabi (pan)","rtl":false},
	"pag":{"name":"Pangasinan","desc":"Pangasinan","rtl":false},
	"pam":{"name":"Kapampangan","desc":"Pampanga","rtl":false},
	"pap":{"name":"Papiamentu","desc":"Papiamentu","rtl":false},
	"pdc":{"name":"Deitsch","desc":"Pennsylvania German","rtl":false},
	"pdt":{"name":"Plautdietsch","desc":"Plautdietsch\/Mennonite Low German","rtl":false},
	"pfl":{"name":"Pf\u00e4lzisch","desc":"Palatinate German","rtl":false},
	"pi":{"name":"\u092a\u093e\u093f\u0934","desc":"Pali","rtl":false},
	"pih":{"name":"Norfuk \/ Pitkern","desc":"Norfuk\/Pitcairn\/Norfolk","rtl":false},
	"pl":{"name":"Polski","desc":"Polish","rtl":false},
	"plm":{"name":"Palembang","desc":"Palembang","rtl":false},
	"pms":{"name":"Piemont\u00e8is","desc":"Piedmontese","rtl":false},
	"pnb":{"name":"\u067e\u0646\u062c\u0627\u0628\u06cc","desc":"Western Punjabi","rtl":false},
	"pnt":{"name":"\u03a0\u03bf\u03bd\u03c4\u03b9\u03b1\u03ba\u03ac","desc":"Pontic\/Pontic Greek","rtl":false},
	"ps":{"name":"\u067e\u069a\u062a\u0648","desc":"Pashto, Northern\/Paktu\/Pakhtu\/Pakhtoo\/Afghan\/Pakhto\/Pashtu\/Pushto\/Yusufzai Pashto","rtl":true},
	"pt":{"name":"Portugu\u00eas","desc":"Portuguese","rtl":false},
	"pt-br":{"name":"Portugu\u00eas do Brasil","desc":"Brazilian Portuguese","rtl":false},
	"qu":{"name":"Runa Simi","desc":"Quechua","rtl":false},
	"rif":{"name":"Tarifit","desc":"Tarifit","rtl":false},
	"rm":{"name":"Rumantsch","desc":"Raeto-Romance","rtl":false},
	"rmy":{"name":"Romani","desc":"Vlax Romany","rtl":false},
	"rn":{"name":"Kirundi","desc":"Rundi\/Kirundi\/Urundi","rtl":false},
	"ro":{"name":"Rom\u00e2n\u0103","desc":"Romanian","rtl":false},
	"roa-rup":{"name":"Arm\u00e3neashce","desc":"Aromanian","rtl":false},
	"roa-tara":{"name":"Tarand\u00edne","desc":"Tarantino","rtl":false},
	"ru":{"name":"\u0420\u0443\u0441\u0441\u043a\u0438\u0439","desc":"Russian","rtl":false},
	"ruq":{"name":"Vl\u0103he\u015fte","desc":"Megleno-Romanian (falls back to ruq-latn)","rtl":false},
	"ruq-cyrl":{"name":"\u0412\u043b\u0430\u0445\u0435\u0441\u0442\u0435","desc":"Megleno-Romanian (Cyrillic script)","rtl":false},
	"ruq-grek":{"name":"\u0392\u03bb\u03b1\u03b5\u03c3\u03c4\u03b5","desc":"Megleno-Romanian (Greek script)","rtl":false},
	"ruq-latn":{"name":"Vl\u0103he\u015fte","desc":"Megleno-Romanian (Latin script)","rtl":false},
	"rw":{"name":"Kinyarwanda","desc":"Kinyarwanda","rtl":false},
	"sa":{"name":"\u0938\u0902\u0938\u094d\u0915\u0943\u0924","desc":"Sanskrit","rtl":false},
	"sah":{"name":"\u0421\u0430\u0445\u0430 \u0442\u044b\u043b\u0430","desc":"Sakha","rtl":false},
	"sc":{"name":"Sardu","desc":"Sardinian","rtl":false},
	"scn":{"name":"Sicilianu","desc":"Sicilian","rtl":false},
	"sco":{"name":"Scots","desc":"Scots","rtl":false},
	"sd":{"name":"\u0633\u0646\u068c\u064a","desc":"Sindhi","rtl":true},
	"sdc":{"name":"Sassaresu","desc":"Sassarese","rtl":false},
	"se":{"name":"S\u00e1megiella","desc":"Northern Sami","rtl":false},
	"sei":{"name":"Cmique Itom","desc":"Seri","rtl":false},
	"sg":{"name":"S\u00e4ng\u00f6","desc":"Sango\/Sangho","rtl":false},
	"sh":{"name":"Srpskohrvatski \/ \u0421\u0440\u043f\u0441\u043a\u043e\u0445\u0440\u0432\u0430\u0442\u0441\u043a\u0438","desc":"Serbocroatian","rtl":false},
	"shi":{"name":"Ta\u0161l\u1e25iyt","desc":"Tachelhit","rtl":false},
	"si":{"name":"\u0dc3\u0dd2\u0d82\u0dc4\u0dbd","desc":"Sinhalese","rtl":false},
	"simple":{"name":"Simple English","desc":"Simple English","rtl":false},
	"sk":{"name":"Sloven\u010dina","desc":"Slovak","rtl":false},
	"sl":{"name":"Sloven\u0161\u010dina","desc":"Slovenian","rtl":false},
	"sm":{"name":"Gagana Samoa","desc":"Samoan","rtl":false},
	"sma":{"name":"\u00c5arjelsaemien","desc":"Southern Sami","rtl":false},
	"sn":{"name":"chiShona","desc":"Shona","rtl":false},
	"so":{"name":"Soomaaliga","desc":"Somali","rtl":false},
	"sq":{"name":"Shqip","desc":"Albanian","rtl":false},
	"sr":{"name":"\u0421\u0440\u043f\u0441\u043a\u0438 \/ Srpski","desc":"Serbian","rtl":false},
	"sr-ec":{"name":"\u045b\u0438\u0440\u0438\u043b\u0438\u0446\u0430","desc":"Serbian cyrillic ekavian","rtl":false},
	"sr-el":{"name":"latinica","desc":"Serbian latin ekavian","rtl":false},
	"srn":{"name":"Sranantongo","desc":"Sranan Tongo","rtl":false},
	"ss":{"name":"SiSwati","desc":"Swati","rtl":false},
	"st":{"name":"Sesotho","desc":"Southern Sotho","rtl":false},
	"stq":{"name":"Seeltersk","desc":"Saterland Frisian","rtl":false},
	"su":{"name":"Basa Sunda","desc":"Sundanese","rtl":false},
	"sv":{"name":"Svenska","desc":"Swedish","rtl":false},
	"sw":{"name":"Kiswahili","desc":"Swahili","rtl":false},
	"szl":{"name":"\u015al\u016fnski","desc":"Silesian","rtl":false},
	"ta":{"name":"\u0ba4\u0bae\u0bbf\u0bb4\u0bcd","desc":"Tamil","rtl":false},
	"tcy":{"name":"\u0ca4\u0cc1\u0cb3\u0cc1","desc":"Tulu","rtl":false},
	"te":{"name":"\u0c24\u0c46\u0c32\u0c41\u0c17\u0c41","desc":"Telugu","rtl":false},
	"tet":{"name":"Tetun","desc":"Tetun","rtl":false},
	"tg":{"name":"\u0422\u043e\u04b7\u0438\u043a\u04e3","desc":"Tajiki","rtl":false},
	"tg-cyrl":{"name":"\u0422\u043e\u04b7\u0438\u043a\u04e3","desc":"Tajiki (Cyrllic script)","rtl":false},
	"tg-latn":{"name":"tojik\u012b","desc":"Tajiki (Latin script)","rtl":false},
	"th":{"name":"\u0e44\u0e17\u0e22","desc":"Thai","rtl":false},
	"ti":{"name":"\u1275\u130d\u122d\u129b","desc":"Tigrinya","rtl":false},
	"tk":{"name":"T\u00fcrkmen","desc":"Turkmen","rtl":false},
	"tl":{"name":"Tagalog","desc":"Tagalog","rtl":false},
	"tn":{"name":"Setswana","desc":"Setswana","rtl":false},
	"to":{"name":"faka-Tonga","desc":"Tonga (Tonga Islands)","rtl":false},
	"tokipona":{"name":"Toki Pona","desc":"Toki Pona","rtl":false},
	"tp":{"name":"Toki Pona (deprecated:tokipona)","desc":"Toki Pona","rtl":false},
	"tpi":{"name":"Tok Pisin","desc":"Tok Pisin","rtl":false},
	"tr":{"name":"T\u00fcrk\u00e7e","desc":"Turkish","rtl":false},
	"ts":{"name":"Xitsonga","desc":"Tsonga","rtl":false},
	"tt":{"name":"Tatar\u00e7a\/\u0422\u0430\u0442\u0430\u0440\u0447\u0430","desc":"Tatar","rtl":false},
	"tt-cyrl":{"name":"\u0422\u0430\u0442\u0430\u0440\u0447\u0430","desc":"Tatar (Cyrillic script)","rtl":false},
	"tt-latn":{"name":"Tatar\u00e7a","desc":"Tatar (Latin script)","rtl":false},
	"tum":{"name":"chiTumbuka","desc":"Tumbuka","rtl":false},
	"tw":{"name":"Twi","desc":"Twi","rtl":false},
	"ty":{"name":"Reo M\u0101`ohi","desc":"Tahitian","rtl":false},
	"tyv":{"name":"\u0422\u044b\u0432\u0430 \u0434\u044b\u043b","desc":"Tyvan","rtl":false},
	"tzm":{"name":"\u2d5c\u2d30\u2d4e\u2d30\u2d63\u2d49\u2d56\u2d5c","desc":"(Central Morocco) Tamazight","rtl":false},
	"udm":{"name":"\u0423\u0434\u043c\u0443\u0440\u0442","desc":"Udmurt","rtl":false},
	"ug":{"name":"Uyghurche\u200e \/ \u0626\u06c7\u064a\u063a\u06c7\u0631\u0686\u06d5","desc":"Uyghur","rtl":true},
	"uk":{"name":"\u0423\u043a\u0440\u0430\u0457\u043d\u0441\u044c\u043a\u0430","desc":"Ukrainian","rtl":false},
	"ur":{"name":"\u0627\u0631\u062f\u0648","desc":"Urdu","rtl":true},
	"uz":{"name":"O\\'zbek","desc":"Uzbek","rtl":false},
	"ve":{"name":"Tshivenda","desc":"Venda","rtl":false},
	"vec":{"name":"V\u00e8neto","desc":"Venetian","rtl":false},
	"vi":{"name":"Ti\u1ebfng Vi\u1ec7t","desc":"Vietnamese","rtl":false},
	"vls":{"name":"West-Vlams","desc":"West Flemish","rtl":false},
	"vo":{"name":"Volap\u00fck","desc":"Volap\u00fck","rtl":false},
	"wa":{"name":"Walon","desc":"Walloon","rtl":false},
	"war":{"name":"Winaray","desc":"Waray-Waray","rtl":false},
	"wo":{"name":"Wolof","desc":"Wolof","rtl":false},
	"wuu":{"name":"\u5434\u8bed","desc":"Wu Chinese","rtl":false},
	"xal":{"name":"\u0425\u0430\u043b\u044c\u043c\u0433","desc":"Kalmyk-Oirat (Kalmuk, Kalmuck, Kalmack, Qalmaq, Kalmytskii Jazyk, Khal:mag, Oirat, Volga Oirat, European Oirat, Western Mongolian)","rtl":false},
	"xh":{"name":"isiXhosa","desc":"Xhosan","rtl":false},
	"xmf":{"name":"\u10db\u10d0\u10e0\u10d2\u10d0\u10da\u10e3\u10e0\u10d8","desc":"Mingrelian","rtl":false},
	"ydd":{"name":"\u05de\u05d9\u05d6\u05e8\u05d7\u05be\u05d9\u05d9\u05b4\u05d3\u05d9\u05e9","desc":"Eastern Yiddish","rtl":true},
	"yi":{"name":"\u05d9\u05d9\u05b4\u05d3\u05d9\u05e9","desc":"Yiddish","rtl":true},
	"yo":{"name":"Yor\u00f9b\u00e1","desc":"Yoruba","rtl":false},
	"yue":{"name":"\u7cb5\u8a9e","desc":"Cantonese","rtl":false},
	"za":{"name":"(Cuengh)","desc":"Zhuang","rtl":false},
	"zea":{"name":"Ze\u00eauws","desc":"Zeeuws\/Zeaws","rtl":false},
	"zh":{"name":"\u4e2d\u6587","desc":"(Zh\u014dng W\u00e9n) - Chinese","rtl":false},
	"zh-classical":{"name":"\u6587\u8a00","desc":"Classical Chinese\/Literary Chinese","rtl":false},
	"zh-cn":{"name":"\u202a\u4e2d\u6587(\u4e2d\u56fd\u5927\u9646)\u202c","desc":"Chinese (PRC)","rtl":false},
	"zh-hans":{"name":"\u202a\u4e2d\u6587(\u7b80\u4f53)\u202c","desc":"Chinese written using the Simplified Chinese script","rtl":false},
	"zh-hant":{"name":"\u202a\u4e2d\u6587(\u7e41\u9ad4)\u202c","desc":"Chinese written using the Traditional Chinese script","rtl":false},
	"zh-hk":{"name":"\u202a\u4e2d\u6587(\u9999\u6e2f)\u202c","desc":"Chinese (Hong Kong)","rtl":false},
	"zh-min-nan":{"name":"B\u00e2n-l\u00e2m-g\u00fa","desc":"Min-nan","rtl":false},
	"zh-mo":{"name":"\u202a\u4e2d\u6587(\u6fb3\u9580)\u202c","desc":"Chinese (Macau)","rtl":false},
	"zh-my":{"name":"\u202a\u4e2d\u6587(\u9a6c\u6765\u897f\u4e9a)\u202c","desc":"Chinese (Malaysia)","rtl":false},
	"zh-sg":{"name":"\u202a\u4e2d\u6587(\u65b0\u52a0\u5761)\u202c","desc":"Chinese (Singapore)","rtl":false},
	"zh-tw":{"name":"\u202a\u4e2d\u6587(\u53f0\u7063)\u202c","desc":"Chinese (Taiwan)","rtl":false},
	"zh-yue":{"name":"\u7cb5\u8a9e","desc":"Cantonese","rtl":false},
	"zu":{"name":"isiZulu","desc":"Zulu","rtl":false}
};
// reverse it

var lang = getCookie("ws_lang");
if(!lang || lang.length < 2) lang = window.navigator.language ? window.navigator.language : window.navigator.userLanguage;
lang = (!lang || lang.length < 2) ? "en" : lang.substr(0,2).toLowerCase();

// macbre: add class to body
Event.observe(window, 'load', function() {
	langchange(lang);
});

function langchange(lang_code) {

    // FIXME: lang -> lang_code?:
	var newClass = langs[lang].rtl ? 'rtl' : 'ltr';
    // FIXME: ltr <-> rtl?:
	var oldClass = langs[lang].rtl ? 'ltr' : 'rtl';

    // FIXME: only swap the class when they differ?:
	jQuery('body').removeClass(oldClass);
	jQuery('body').addClass(newClass);
}

function langdesc(lang_code) {
	if ( typeof langs[lang_code] != 'undefined' ) {
		var translated_name= gettext(lang_code);
		if (translated_name == lang_code) {
            // No translation found for the current language,
            // use the English description instead
			translated_name= langs[lang_code].desc;
        }
        // We need to limit the length of translated language
        // descriptions.  Some of the English language descriptions
        // are so long (up to 130 chars) that they are rendered much
        // wider than the language selection dialog. Also, for these
        // descriptions the language indicator displayed in the menu
        // corner extended too far into the menu.
        var limit= 50;
        if (translated_name.length > limit) {
            translated_name= translated_name.substr(0, limit) + "...";
        }
		return langs[lang_code].name +" ("+translated_name+")";
	}
	else {
		return lang_code;
	}
}
		    
function show_lang_header() {
	if (jQuery("#site-language") && langselectincluded) {
		jQuery("#site-language").html( "<a onclick=\"show_langselect();\">"
			+getspan("Language")+": "+langdesc(lang)+"</a>" );
	}
}

function addCommas(nStr) {
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}
