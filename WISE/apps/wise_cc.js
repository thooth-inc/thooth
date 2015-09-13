function yelpFetch(){
	if (!WISE.apps.yelp) {alert("uh oh"); return false;};
	
	cur = WISE.apps.yelp;
	
	cur.params[0] = WISE.trim(cur.params[0]);
	var term = cur.params[0];
	for (var i=0; i<yelp_proximity_words.length; i++) {
		var term_lc = term.toLowerCase();
		if (term_lc.indexOf(" " + yelp_proximity_words[i].toLowerCase() + " ") > -1) {
			term = term.substring(term_lc.indexOf(" " + yelp_proximity_words[i].toLowerCase() + " ")+(yelp_proximity_words[i].length+2));
			break;
		}
	}
	
	var geoURL = "http://where.yahooapis.com/v1/places.q('"+ encodeURIComponent(term) +"')?appid=xn0wlSbV34FyhFUpNs.JhRy8VT0OCs4bcIXxEWTfEugKLUyvw71fA7nNbi0GOOUy9ogukb6E&format=json&callback=yelpCheckCodes";

	WISE.call(geoURL, cur.id);
	
}

function yelpCheckCodes( j ){

	if( !j.places || !j.places.place){
		WISE.finalizenoreview("yelp");
		return false;
	}
	
	cur = WISE.apps.yelp;
	
	if (j.places.place.length) var place = j.places.place[0];
	else var place = j.places.place;
	var center = place.centroid;
	if (center) {
		cur.params.push(place);
		var term = cur.params[0];
		
		for (var i=0; i<yelp_proximity_words.length; i++) {
			var term_lc = term.toLowerCase();
			if (term_lc.indexOf(" " + yelp_proximity_words[i].toLowerCase() + " ") > -1) {
				term = term.substring(0, term_lc.indexOf(" " + yelp_proximity_words[i].toLowerCase() + " "));
				break;
			}
		}
		/*
		if (term==cur.params[0] && (term.indexOf(" ")>-1)) term = term.substring(0, term.indexOf(" ")); 
		var addon = "";
		if (yelp_categories[term.toLowerCase()]) {
			addon="&category="+encodeURIComponent(yelp_categories[term.toLowerCase()]);
		}
		else {
			addon="&term=" + encodeURIComponent(term);
		}
		*/
		
		var found = false;
		//var lastpos = 0;
		var temp_term = "";
		var addon = "";
		var lastpos = term.indexOf(" ");
		while (lastpos > -1) {
			temp_term = term.substring(0, lastpos);
			temp_term = temp_term.replace(/ and /gi, " & ");   
			if (yelp_categories[temp_term.toLowerCase()]) {
				addon="&category="+encodeURIComponent(yelp_categories[temp_term.toLowerCase()]);
				break;
			}
			else {
				lastpos = term.indexOf(" ", (lastpos+1));
			}
		}
		if(addon=="") addon="&term=" + encodeURIComponent(term);
		
		//var callurl= "http://api.yelp.com/business_review_search?term=" + encodeURIComponent(term) + "&lat=" + center.latitude + "&long=" + center.longitude + "&num_biz_requested=3&type=javascript&callback=yelpRender&ywsid=ebkIEcI-T3TepTZSJSUkgQ" + addon;
		var callurl= "http://api.yelp.com/business_review_search?lat=" + center.latitude + "&long=" + center.longitude + "&num_biz_requested=10&type=javascript&callback=yelpRender&ywsid=ebkIEcI-T3TepTZSJSUkgQ" + addon;
		//alert(callurl);
		WISE.finalizenoreview("yelp");
		WISE.call(callurl, cur.id);
		//if (document.all) setTimeout(function(){WISE.call(callurl, cur.id);}, 100);
		//else WISE.call(callurl, cur.id);
	}
	else {
		WISE.finalizenoreview("yelp");
		return false;
	}
}

function yelpRender( j ){

	cur = WISE.apps.yelp;
	
	if( !j.businesses ){
		WISE.finalizenoreview("yelp");
		return false;
	}
	var title = "Yelp Results for " + cur.params[0];
	var url = "http://www.yelp.com";

	var output = "";
	var reviews_out = "";
	if (j.businesses.length) {
		output = "<div id='yelp_ratings_x_" + encodeURIComponent(WISE.Q.q) + "'><table width='100%'><tr>"
		var bizs = j.businesses.sort(yelp_sortbiz);

		var limit = (bizs.length>3 ? 3 : bizs.length);
		for(var i=0; i<limit; i++) {
			var biz = bizs[i];

			var address = (biz.address1 ? biz.address1 + " " : "") + (biz.address2 ? biz.address2 + " " : "");
			output +="<tr><td valign='top' style='padding-bottom: 5px;'>"
				+ "<img src='" + biz.photo_url + "' style='float:left; padding-right:5px;' width='50px' height='50px' /> "
				+ "<a href='" + biz.url + "'>" + biz.name + "</a> "
				+ (biz.phone ? (biz.phone.toString().length==10 ? "("+biz.phone.toString().substring(0,3)+") "+biz.phone.toString().substring(3,6)+"-"+biz.phone.toString().substring(6,10) : biz.phone) : "")
				+ "<span style='text-align: right; position: absolute; right:3px;'><img src='" + biz.rating_img_url_small + "' /> <a href='javascript:WISE.apps.yelp.yelpShowHide(" + i + ");'>" + biz.review_count + " Reviews</a></span><br/>"
				+ (address != "" ? address : biz.city + " " + biz.state + ", " + biz.zip + " ")
				+ "<span style='text-align: right; position: absolute; right:3px;'>(Avg Rating: " + biz.avg_rating + " out of 5)</span><br/>"
				+ (address!="" ? biz.city + " " + biz.state + ", " + biz.zip + " " : "")
				+ "</td></tr>";
				
				if(biz.reviews.length) {
					reviews_out += "<div id='yelp_ratings_" + i + "_" + encodeURIComponent(WISE.Q.q) + "' style='display: none;'>"
						+ "3 of " + biz.review_count + " reviews for " + biz.name + " | <a href='" + biz.url + "#reviews'>Read All Reviews</a><span style='text-align: right; position: absolute; right:0px;'><a href='javascript:WISE.apps.yelp.yelpShowHide(\"x\");'>Back</a></span><br/>";
					for (var r=0; r<biz.reviews.length; r++) {
						var review =biz.reviews[r]; 
						reviews_out += "<div style='height: 45px; padding: 3px 0px; " + ((r<(biz.reviews.length-1)) ? "border-bottom: 1px solid #DCDCDC;" : "") + "'><img src='"+review.user_photo_url_small+"' width='40px' style='float:left; padding: 2px 5px 0px 0px;'/> "+review.user_name+" - <a href='" +  review.url + "'>Read Full Review</a> | <a href='" +  review.user_url + "'>More by this reviewer</a><br/><img src='"+review.rating_img_url+"' width='50px' style='float:left; padding:3px 3px 0px 0px;'/> "+review.text_excerpt+"</div>";
					}
					reviews_out += "</div>";
				}
		}
		//output += "</table></div>" + reviews_out + "<div style='width: 100%; background:#C41200 url(http://www.yelp.com/i/new/developers/advertiser_header_bg.png) repeat-x scroll -21px -3px; height:5px;'></div>";
		output += "</table></div>" + reviews_out + "<div style='background: url(http://static.px.yelp.com/static/20080807/i/new/gfx/newHeader/ExternalHeaderLogo.gif) no-repeat scroll -21px -3px; height:42px;'></div>";
	}
	if (output != "") {
		r = WISE.resultAdd( WISE.Q ,url,title,"",true);
		//annAdd(r,"text",{"sel":j.rss.channel.item.description});
		WISE.annAdd(r,"text",{"sel":output});
		WISE.annRender(r);
		WISE.finalize(WISE.Q, thisApp.id, r); // apply any possible KT stuff
	}
	else WISE.finalizenoreview("yelp");
	
}
function yelp_sortbiz(a,b) {
	return ((a.distance*100000000) - (b.distance*100000000));
}

function yelpShowHide(which) {
	WISE.getQ();
	cur = WISE.apps.yelp;
	if(WISE.getElement("yelp_ratings_x_" + encodeURIComponent(WISE.Q.q)))WISE.getElement("yelp_ratings_x_" + encodeURIComponent(WISE.Q.q)).hide();
	for(i=0; i<3; i++) {
		if(WISE.getElement("yelp_ratings_" + i + "_" + encodeURIComponent(WISE.Q.q)))WISE.getElement("yelp_ratings_" + i + "_" + encodeURIComponent(WISE.Q.q)).hide();
	}
	if(WISE.getElement("yelp_ratings_" + which + "_" + encodeURIComponent(WISE.Q.q)))WISE.getElement("yelp_ratings_" + which + "_" + encodeURIComponent(WISE.Q.q)).show();
}

WISE.scope("yelpShowHide", yelpShowHide, "yelp");

var yelp_proximity_words = new Array("around", "near", "in", "at", "close to", "by");
var yelp_categories = {
"active life":"active",
"amateur sports teams":"amateursportsteams",
"amusement parks":"amusementparks",
"aquariums":"aquariums",
"beaches":"beaches",
"bike rentals":"bikerentals",
"boating":"boating",
"bowling":"bowling",
"fitness & instruction":"fitness",
"gyms":"gyms",
"martial arts":"martialarts",
"pilates":"pilates",
"trainers":"healthtrainers",
"yoga":"yoga",
"golf":"golf",
"hiking":"hiking",
"parks":"parks",
"playgrounds":"playgrounds",
"skating rinks":"skatingrinks",
"swimming pools":"swimmingpools",
"tennis":"tennis",
"zoos":"zoos",
"arts & entertainment":"arts",
"arcades":"arcades",
"art galleries":"galleries",
"botanical gardens":"gardens",
"casinos":"casinos",
"cinema":"movietheaters",
"jazz & blues":"jazzandblues",
"museums":"museums",
"music venues":"musicvenues",
"performing arts":"theater",
"professional sports teams":"sportsteams",
"stadiums & arenas":"stadiumsarenas",
"wineries":"wineries",
"automotive":"auto",
"auto detailing":"auto_detailing",
"auto repair":"autorepair",
"body shops":"bodyshops",
"car dealers":"car_dealers",
"car wash":"carwash",
"gas & service stations":"servicestations",
"motorcycle dealers":"motorcycledealers",
"motorcyle repair":"motorcyclerepair",
"parking":"parking",
"smog check stations":"smog_check_stations",
"tires":"tires",
"towing":"towing",
"beauty and spas":"beautysvc",
"barbers":"barbers",
"cosmetics & beauty supply":"cosmetics",
"day spas":"spas",
"hair removal":"hairremoval",
"laser hair removal":"laser_hair_removal",
"hair salons":"hair",
"makeup artists":"makeupartists",
"massage":"massage",
"nail salons":"othersalons",
"piercing":"piercing",
"skin care":"skincare",
"tanning":"tanning",
"tattoo":"tattoo",
"education":"education",
"adult education":"adultedu",
"colleges & universities":"collegeuniv",
"elementary schools":"elementaryschools",
"middle schools & high schools":"highschools",
"preschools":"preschools",
"specialty schools":"specialtyschools",
"art schools":"artschools",
"cooking schools":"cookingschools",
"dance schools":"dance_schools",
"driving schools":"driving_schools",
"tutoring":"tutoring",
"event planning & services":"eventservices",
"boat charters":"boatcharters",
"cards & stationery":"stationery",
"caterers":"catering",
"djs":"djs",
"hotels":"hotels",
"party & event planning":"eventplanning",
"party supplies":"partysupplies",
"personal chefs":"personalchefs",
"photographers":"photographers",
"venues & event spaces":"venues",
"wedding planning":"wedding_planning",
"financial services":"financialservices",
"banks & credit unions":"banks",
"insurance":"insurance",
"investing":"investing",
"food":"food",
"bagels":"bagels",
"bakeries":"bakeries",
"beer, wine & spirits":"beer_and_wine",
"breweries":"breweries",
"coffee & tea":"coffee",
"convenience stores":"convenience",
"desserts":"desserts",
"donuts":"donuts",
"farmers market":"farmersmarket",
"grocery":"grocery",
"ice cream & frozen yogurt":"icecream",
"juice bars":"juicebars",
"specialty food":"gourmet",
"candy stores":"candy",
"cheese shops":"cheese",
"chocolatiers and shops":"chocolate",
"ethnic food":"ethnicmarkets",
"fruits & veggies":"markets",
"health markets":"healthmarkets",
"meat shops":"meats",
"seafood markets":"seafoodmarkets",
"tea rooms":"tea",
"wineries":"wineries",
"health and medical":"health",
"acupuncture":"acupuncture",
"chiropractors":"chiropractors",
"counseling & mental health":"c_and_mh",
"dentists":"dentists",
"oral surgeons":"oralsurgeons",
"orthodontists":"orthodontists",
"doctors":"physicians",
"cardiologists":"cardiology",
"cosmetic surgeons":"cosmeticsurgeons",
"dermatologists":"dermatology",
"ear nose & throat":"earnosethroat",
"family practice":"familydr",
"internal medicine":"internalmed",
"obstetricians and gynecologists":"obgyn",
"ophthalmologists":"opthamalogists",
"pediatricians":"pediatricians",
"podiatrists":"podiatrists",
"psychiatrists":"psychiatrists",
"sports medicine":"sportsmed",
"hospitals":"hospitals",
"medical centers":"medcenters",
"midwives":"midwives",
"optometrists":"optometrists",
"physical therapy":"physicaltherapy",
"home services":"homeservices",
"building supplies":"buildingsupplies",
"carpeting":"carpeting",
"contractors":"contractors",
"electricians":"electricians",
"gardeners":"gardeners",
"home cleaning":"homecleaning",
"interior design":"interiordesign",
"keys & locksmiths":"locksmiths",
"landscaping":"landscaping",
"lighting fixtures & equipment":"lighting",
"movers":"movers",
"painters":"painters",
"plumbing":"plumbing",
"real estate":"realestate",
"apartments":"apartments",
"mortgage brokers":"mortgagebrokers",
"property management":"propertymgmt",
"real estate agents":"realestateagents",
"real estate services":"realestatesvcs",
"shades & blinds":"blinds",
"hotels & travel":"hotelstravel",
"airports":"airports",
"bed & breakfast":"bedbreakfast",
"campgrounds":"campgrounds",
"car rental":"carrental",
"hostels":"hostels",
"hotels":"hotels",
"ski resorts":"skiresorts",
"tours":"tours",
"transportation":"transport",
"airlines":"airlines",
"airport shuttles":"airport_shuttles",
"limos":"limos",
"public transportation":"publictransport",
"taxis":"taxis",
"travel services":"travelservices",
"local flavor":"localflavor",
"local services":"localservices",
"appliances & repair":"homeappliancerepair",
"carpet cleaning":"carpet_cleaning",
"child care & day care":"childcare",
"community service/non-profit":"nonprofit",
"couriers & delivery services":"couriers",
"dry cleaning & laundry":"drycleaninglaundry",
"funeral services & cemeteries":"funeralservices",
"it services & computer repair":"itservices",
"notaries":"notaries",
"pest control":"pest_control",
"printing services":"copyshops",
"recording & rehearsal studios":"recording_studios",
"self storage":"selfstorage",
"sewing & alterations":"sewingalterations",
"shoe repair":"shoerepair",
"watch repair":"watch_repair",
"mass media":"massmedia",
"print media":"printmedia",
"radio stations":"radiostations",
"television stations":"televisionstations",
"nightlife":"nightlife",
"adult entertainment":"adultentertainment",
"bars":"bars",
"dive bars":"divebars",
"gay bars":"gaybars",
"hookah bars":"hookah_bars",
"lounges":"lounges",
"pubs":"pubs",
"sports bars":"sportsbars",
"wine bars":"wine_bars",
"comedy clubs":"comedyclubs",
"dance clubs":"danceclubs",
"jazz & blues":"jazzandblues",
"karaoke":"karaoke",
"music venues":"musicvenues",
"pool halls":"poolhalls",
"pets":"pets",
"animal shelters":"animalshelters",
"pet services":"petservices",
"dog walkers":"dogwalkers",
"pet boarding/pet sitting":"pet_sitting",
"pet groomers":"groomer",
"pet training":"pet_training",
"pet stores":"petstore",
"veterinarians":"vet",
"professional services":"professional",
"accountants":"accountants",
"employment agencies":"employmentagencies",
"lawyers":"lawyers",
"web design":"web_design",
"public services & government":"publicservicesgovt",
"landmarks & historical buildings":"landmarks",
"libraries":"libraries",
"post offices":"postoffices",
"real estate":"realestate",
"apartments":"apartments",
"mortgage brokers":"mortgagebrokers",
"property management":"propertymgmt",
"real estate agents":"realestateagents",
"real estate services":"realestatesvcs",
"religious organizations":"religiousorgs",
"churches":"churches",
"mosques":"mosques",
"synagogues":"synagogues",
"restaurants":"restaurants",
"afghani":"afghani",
"african":"african",
"new american":"newamerican",
"traditional american":"tradamerican",
"argentine":"argentine",
"asian fusion":"asianfusion",
"barbeque":"bbq",
"brazilian":"brazilian",
"breakfast & brunch":"breakfast_brunch",
"british":"british",
"buffets":"buffets",
"burgers":"burgers",
"burmese":"burmese",
"cajun/creole":"cajun",
"cambodian":"cambodian",
"caribbean":"caribbean",
"chicken wings":"chicken_wings",
"chinese":"chinese",
"dim sum":"dimsum",
"creperies":"creperies",
"cuban":"cuban",
"delis":"delis",
"diners":"diners",
"ethiopian":"ethiopian",
"fast food":"hotdogs",
"filipino":"filipino",
"fondue":"fondue",
"food stands":"foodstands",
"french":"french",
"german":"german",
"gluten-free":"gluten_free",
"greek and mediterranean":"greek",
"halal":"halal",
"hawaiian":"hawaiian",
"himalayan/nepalese":"himalayan",
"hot dogs":"hotdog",
"indian/pakistani":"indpak",
"indonesian":"indonesian",
"irish":"irish",
"italian":"italian",
"japanese":"japanese",
"korean":"korean",
"kosher":"kosher",
"latin american":"latin",
"live/raw food":"raw_food",
"malaysian":"malaysian",
"mexican":"mexican",
"middle eastern":"mideastern",
"mongolian":"mongolian",
"moroccan":"moroccan",
"pizza":"pizza",
"russian":"russian",
"sandwiches":"sandwiches",
"scandinavian":"scandinavian",
"seafood":"seafood",
"singaporean":"singaporean",
"soul food":"soulfood",
"southern":"southern",
"spanish/basque":"spanish",
"steakhouses":"steak",
"sushi bars":"sushi",
"sushi":"sushi",
"taiwanese":"taiwanese",
"tapas bars":"tapas",
"tex-mex":"tex-mex",
"thai":"thai",
"turkish":"turkish",
"vegan":"vegan",
"vegetarian":"vegetarian",
"vietnamese":"vietnamese",
"shopping":"shopping",
"adult":"adult",
"antiques":"antiques",
"art galleries":"galleries",
"arts & crafts":"artsandcrafts",
"art supplies":"artsupplies",
"cards & stationery":"stationery",
"costumes":"costumes",
"fabric stores":"fabricstores",
"framing":"framing",
"books, mags, music and video":"media",
"bookstores":"bookstores",
"comic books":"comicbooks",
"music & dvd's":"musicvideo",
"newspapers & magazines":"mags",
"videos and video game rental":"videoandgames",
"bridal":"bridal",
"computers":"computers",
"cosmetics & beauty supply":"cosmetics",
"department stores":"deptstores",
"drugstores":"drugstores",
"electronics":"electronics",
"eyewear & opticians":"opticians",
"fashion":"fashion",
"accessories":"accessories",
"children's clothing":"childcloth",
"department stores":"deptstores",
"leather goods":"leather",
"lingerie":"lingerie",
"maternity wear":"maternity",
"men's clothing":"menscloth",
"shoe stores":"shoes",
"sports wear":"sportswear",
"used, vintage & consignment":"vintage",
"women's clothing":"womenscloth",
"flowers & gifts":"flowers",
"cards & stationery":"stationery",
"florists":"florists",
"hobby shops":"hobbyshops",
"home & garden":"homeandgarden",
"appliances":"appliances",
"furniture stores":"furniture",
"hardware stores":"hardware",
"home decor":"homedecor",
"kitchen & bath":"kitchenandbath",
"mattresses":"mattresses",
"nurseries & gardening":"gardening",
"jewelry":"jewelry",
"luggage":"luggage",
"mobile phones":"mobilephones",
"musical instruments & teachers":"musicalinstrumentsandteachers",
"office equipment":"officeequipment",
"photography stores & services":"photographystores",
"shopping centers":"shoppingcenters",
"sporting goods":"sportgoods",
"bikes":"bikes",
"outdoor gear":"outdoorgear",
"sports wear":"sportswear",
"tobacco shops":"tobaccoshops",
"toy stores":"toys",
"watches":"watches"};
