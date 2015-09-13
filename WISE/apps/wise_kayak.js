function kayakFetch(){
	
	WISE.call(WISE.server+"/index.php?action=ajax&rs=wfCheckAirportCodesJSON&rsargs[]="+thisApp.params[0]+"&rsargs[]="+thisApp.params[1]+"&rsargs[]=kayakRender&r="+Math.random(), thisApp.id);

}

function kayakRender(j) {
	if(!j.status) {
		WISE.clear(thisApp.id);
		return;
	}
	
	for (site in wiseflightsites) {
		wiseflightsites[site].url = wiseflightsites[site].url.replace("$_1", thisApp.params[0].toUpperCase());
		wiseflightsites[site].url = wiseflightsites[site].url.replace("$_2", thisApp.params[1].toUpperCase());
	}
	
	var title="Flights from " + j.airport1 + " to " + j.airport2 + " on " + featured;
	var depart = new Date();
	var returndate = new Date();
	depart.setDate(depart.getDate()+14);
	
	returndate.setDate(returndate.getDate()+21);
	var featuredurl = "http://www.kayak.com/flights";
	
	var output="<div class='wise_flights_dates'>Departing <input type='text' class='wise_flights_input' id='wise_flight_depart' value='" + (depart.getMonth()+1) + "/" + depart.getDate() + "' onkeyup='WISE.apps.flights.flightDateChangeAll();' maxlength='5' size='6' /> Returning <input type='text' id='wise_flight_return' class='wise_flights_input' value='" + (returndate.getMonth()+1) + "/" + returndate.getDate() + "' onkeyup='WISE.apps.flights.flightDateChangeAll();' maxlength='5' size='6' /> <input type='button' onclick='location.href=$(\"wiseflights_" + featured + "\").href;' value='Search' id='wiseflights_go' /></div>";
	
	output+="<div class='wise_flights_links'><b>Other Services</b>: ";
	for (site in wiseflightsites) {
		output += "<a id='wiseflights_" + site + "' href='" + flightDateReplace(wiseflightsites[site], site, (depart.getMonth()+1) + "/" + depart.getDate(), (returndate.getMonth()+1) + "/" + returndate.getDate(),wiseflightsites[site].url) + "'>" + site + "</a> ";
	}
	output += "</div>";
	output += "<div class='wise_flights_logo'><img src='http://blog.kayak.com/images/press-kit/kayak-h106px-w250px.jpg' width='70'/></div>"
	
	var r= WISE.create(title, featuredurl, output, thisApp.id);
	
	wiseflightresultid = r.id;
	flightDateChangeAll();
	
}
var wiseflightresultid;
var featured = "Kayak";

var wiseflightsites={
	"Kayak": {"url":"http://www.kayak.com/s/search/air?ai=wikia&do=y&p=onebox&a=go&r1=y&r2=y&l1=$_1&l2=$_2&d1=$1/$2&d2=$3/$4"},
	"Expedia": {"url":"http://www.expedia.com/pub/agent.dll?qscr=fexp&flag=q&city1=$_1&citd1=$_2&time1=720&time2=720&cAdu=1&cSen=0&cChi=0&cInf=&infs=2&date1=$1/$2&date2=$3/$4"},
	"Orbitz": {"url":"http://www.orbitz.com/App/GoogleFlightsRedirect?city1=$_1&city2=$_2&ref=googleFlightsLink&gcid=C11287x189&WT.mc_id=e5074&WT.mc_ev=click&date1=$1/$2&date2=$3/$4"},
	"CheapTickets": {"url":"http://www.cheaptickets.com/App/GoogleFlightsRedirect?city1=$_1&city2=$_2&gcid=C16036x268&WT.mc_id=ec2127&WT.mc_ev=click&date1=$1/$2&date2=$3/$4"},
	"Hotwire": {"url":"http://www.hotwire.com/air/search-options.jsp?inputId=index&noOfTickets=1&origCity=$_1&destinationCity=$_2&startMonth=$1&startDay=$2&endMonth=$3&endDay=$4"},
	"Priceline": {"url":"http://www.priceline.com/qp.asp?ProductID=1&DepCity=$_1&ArrCity=$_2&NumTickets=1&DepartureDate=$1/$2&ReturnDate=$3/$4"},
	"Travelocity": {"url":"http://travel.travelocity.com/flights/InitialSearch.do?Service=TRAVELOCITY&city1=$_1&city2=$_2&ref=&date1=$1/$2&date2=$3/$4"}
};

function flightDateChangeAll() {
	WISE.getElement(wiseflightresultid).getElementsByTagName("a")[0].href = flightDateReplace(wiseflightsites[featured], featured, WISE.getElement('wise_flight_depart').value, WISE.getElement('wise_flight_return').value, WISE.getElement(wiseflightresultid).firstChild.firstChild.firstChild.firstChild.href);
	
	for (site in wiseflightsites) {
		//if (site != featured) 
		WISE.getElement("wiseflights_" + site).href= flightDateReplace(wiseflightsites[site], site, WISE.getElement('wise_flight_depart').value, WISE.getElement('wise_flight_return').value, WISE.getElement("wiseflights_" + site).href);
	}
}
WISE.scope("flightDateChangeAll", flightDateChangeAll, "flights");

function flightDateReplace(siteobj, id, departdate, returndate, orig) {
	
	var date_reg = /(?:([0-9]{1,2})[^0-9]{1}([0-9]{1,2}))/
	
	var departmonth = false;
	var departday = false;
	var returnmonth = false;
	var returnday = false;
	
	var departmatches = date_reg.exec(departdate);
	if (departmatches) {
		departmonth = departmatches[1];
		departday = departmatches[2];
		
		if (parseInt(departmonth)>12) departmonth = false;
		if (parseInt(departday)>31) departday = false;
	}
	var returnmatches = date_reg.exec(returndate);
	if (returnmatches) {
		returnmonth = returnmatches[1];
		returnday = returnmatches[2];
		
		if (parseInt(returnmonth)>12) returnmonth = false;
		if (parseInt(returnday)>31) returnday = false;
	}
	
	if (departmonth && departday && returnmonth && returnday) {
		var returnurl = siteobj.url.replace("$1", departmonth);
		returnurl = returnurl.replace("$2", departday);
		returnurl = returnurl.replace("$3", returnmonth);
		returnurl = returnurl.replace("$4", returnday);
		
		return returnurl;
	}
	else return orig;

}

thisApp.css = {
	"dates":{
		"padding-bottom":"5px"
	},
	"links":{
		"margin":"10px 0",
		"font-size":"11px"
	},
	"logo":{
		"margin":"10px 0"
	},
	"input":{
		"margin":"0 5px"
	}
}
