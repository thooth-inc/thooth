<?php

$wgAjaxExportList = array();

/*
***************
Common
*****************
*/
$wgAjaxExportList[] = 'wfGetGenericXMLtoJSON';
function wfGetGenericXMLtoJSON( $url, $callback, $query="" ) {
	
	$url = str_replace(" ", "%20", $url );
	$url = ($url) . urlencode($query);
	$xml = Http::get( $url );
	
	$json = xml2json::transformXmlStringToJson($xml);
	
	return $callback."(" . $json . ");";
}

$wgAjaxExportList[] = 'wfGetHTMLtoJSON';
function wfGetHTMLtoJSON( $url, $results="", $callback, $query="" ) {
	
	$url = str_replace(" ", "%20", $url );
	$url = ($url) . urlencode($query);

	// get DOM from URL or file
	$html = file_get_html($url);

        foreach($html->find($results) as $product) {

            $item['title'] = $product->find('a', 0)->attr['title'];

//            if (strlen($item['title']) > 30)
//                $item['title'] = substr($item['title'], 0, 27) . '...';
            
            $item['link']  = $product->find('a', 0)->attr['href'];
            $item['image'] = $product->find('img', 0)->attr['src'];
        	
            $item['other_text'] = array();
	    foreach($product->find('a') as $link) {
//                if (strlen($link->plaintext) > 30)
//	            $item['other_text'][] = substr($link->plaintext, 0, 27) . '...';
//                else
                    $item['other_text'][] = $link->plaintext;
            }

            $item['other_links'] = array();
	     foreach($product->find('a') as $links) {
	        $item['other_links'][] = $links->attr['href'];
            }

            $item['other_images'] = array();
	     foreach($product->find('img') as $imgs) {
	        $item['other_images'][] = $imgs->attr['src'];
            }

            $item['form']['html'] = $product->find('form', 0)->outertext;
/*
            $item['form']['action'] = $product->find('form', 0)->attr['action'];
            $item['form']['name'] = $product->find('form', 0)->attr['name'];

            $item['form']['input'] = array();

            $ct = 0;
	     foreach($product->find('input,button') as $ipts) {
	         $item['form']['input'][$ct]['name'] = $ipts->attr['name'];
	         $item['form']['input'][$ct]['type'] = $ipts->attr['type'];
		  if($ipts->attr['value'])
	           $item['form']['input'][$ct]['value'] = $ipts->attr['value'];
		  else
	           $item['form']['input'][$ct]['value'] = "";
            
		  $ct++;
	     }
*/            
            $products[] = $item;
        }

	$json = json_encode($products);

        $json = '{"responseData": {"results": ' . $json . '}, "responseDetails": null, "responseStatus": 200}';
	return $callback."(" . $json . ");";
}

$wgAjaxExportList[] = 'wfGetVimeoJSON';
function wfGetVimeoJSON( $url, $callback, $query="" ) {
	
	$host = parse_url($url);

	$url = str_replace(" ", "%20", $url );
	$url = ($url) . urlencode($query);

	// get DOM from URL or file
	$html = file_get_html($url);

        foreach($html->find('ol.browse_videos li') as $product) {
            $item['title'] = $product->find('a', 0)->title;
            $item['link']  = $host['scheme'].'://'.$host['host'].$product->find('a', 0)->href;
            $item['image'] = $product->find('img.thumbnail', 0)->src;
            $products[] = $item;
        }

	$json = json_encode($products);
	
	return $callback."(" . $json . ");";
}

$wgAjaxExportList[] = 'wfGetJSONwithCallback';
function wfGetJSONwithCallback( $url , $app_id, $query, $callback = "void"  ) {

	$url = str_replace(" ", "%20", $url );
	$url = urldecode($url);
	$json = Http::get( $url );

	return $callback."(" . $json . ");";
}

$wgAjaxExportList[] = 'wfGetURIContents';
function wfGetURIContents($url = "", $callback = "") {

	$contents = Http::get( $url );
	
	if ($callback) return $callback."(".$contents.")";
	else return $contents;
}

$wgAjaxExportList[] = 'wfGetKeymailJSON';
function wfGetKeymailJSON( $url, $callback = ""  ) {

	$url = str_replace(" ", "%20", $url );
	$url = urldecode($url);
	$json = Http::get( $url );

	$json = str_replace("[]", "\"\"", $json);
	$json = str_replace("[", "", $json);
	$json = str_replace("]", "", $json);

//	$json = substr(substr($json, 0, -1), 1);
//	echo '<pre>';print_r($json);die;
	return $json;
}


/*
***************
Accuweather App
*****************
*/
$wgAjaxExportList[] = 'wfGetAccuweatherZipJSON';
function wfGetAccuweatherZipJSON($query = "10001", $callback = "") {

	$base_url = "http://wikia.accu-weather.com/widget/wikia/weather-data.asp?location=";
	
	$handle = fopen($base_url . urlencode($query), "r");
	$contents = stream_get_contents($handle);
	fclose($handle);
	
	$jsonContents = "";
	    // Convert it to JSON now.
	    // xml2json simply takes a String containing XML contents as input.
	    $jsonContents = xml2json::transformXmlStringToJson($contents);
	
	if ($callback) return "void(" . time() . ");".$callback."(".$jsonContents.")";
	else return $jsonContents;
	
}

/*
***************
TV Guide App
*****************
*/
$wgAjaxExportList [] = 'wfGetTVGuideShowJSON';
function wfGetTVGuideShowJSON( $callback, $query="" ) {

	$query = urldecode( $query );
	
	$xml = Http::get( "http://beta.tvguide.com/GoogleImages/Shows1.xml" );
	$xml_obj = new SimpleXMLElement($xml);
	$result = $xml_obj->xpath('//Results/ResultSpec/query[translate(.,"ABCDEFGHIJKLMNOPQRSTUVWXYZ","abcdefghijklmnopqrstuvwxyz")="' . strtolower($query) . '"]/parent::*');

	return $callback."(" . jsonify( $result ) . ");";
}

/*
***************
Amazon
*****************
*/
$wgAjaxExportList[] = 'wfGetAmazonJSON';
function wfGetAmazonJSON($query, $callback) {
	
	//$base_url = "http://ecs.amazonaws.com/onca/xml?Service=AWSECommerceService&AWSAccessKeyId=1TNHCF4RRYBH2AE8X682&Operation=ItemSearch&SearchIndex=All&Version=2008-06-28&ResponseGroup=MerchantItemAttributes,Offers,EditorialReview&Keywords=";
	$base_url = "http://ecs.amazonaws.com/onca/xml?Service=AWSECommerceService&AWSAccessKeyId=1TNHCF4RRYBH2AE8X682&Operation=ItemSearch&SearchIndex=All&Version=2008-06-28&ResponseGroup=Medium,Offers,Tags&Keywords=";
	
	$handle = fopen($base_url . urlencode($query), "r");
	$contents = stream_get_contents($handle);
	fclose($handle);
	
	$jsonContents = "";
	    // Convert it to JSON now.
	    // xml2json simply takes a String containing XML contents as input.
	    $jsonContents = xml2json::transformXmlStringToJson($contents);
	
	if ($callback) return $callback."(".$jsonContents.")";
	else return $jsonContents;
	
}

$wgAjaxExportList[] = 'wfGetAmazonAWS';
function wfGetAmazonAWS($query, $callback) {

	$AWS_API_KEY = '0G5V6FHQXQ1JREGFZVR2';
	$AWS_API_SECRET_KEY = '8oxghQ9SKjZCnGc8tvjMyVR0aAj7rRJfw7w99cRK';
	$AWS_ASSOCIATE_TAG = 'zerosixtycorp-20';

	require '../common/AmazonECS.class.php';

	$amazonEcs = new AmazonECS($AWS_API_KEY, $AWS_API_SECRET_KEY, 'com', $AWS_ASSOCIATE_TAG);

	$response = $amazonEcs->responseGroup('Small,Images')->search($query);
//    	var_dump($response);exit;

	if ($callback) return $callback."(".$response.")";
	else return $response;

}

/*
***************
Snooth Wine Search
*****************
*/
$wgAjaxExportList[] = 'wfGetSnoothJSON';
function wfGetSnoothJSON($query, $callback) {
	
	$base_url = "http://api.snooth.com/wines/?akey=kgntzahhybzpspglzv1snszckyewvpwefpq4qfok2bj3vm5s&n=3&q=";
	
	
	$handle = fopen($base_url . urlencode($query), "r");
	$contents = stream_get_contents($handle);
	fclose($handle);
	
	$jsonContents = $contents;
	
	if ($callback) return $callback."(".$jsonContents.")";
	else return $jsonContents;
	
}

/*
***************
Last.fm Band Information
*****************
*/
$wgAjaxExportList[] = 'wfGetLastFMJSON';
function wfGetLastFMJSON($query, $type, $callback) {

	$api_key = WISE_lastFM_api_key;
	switch($type) {
		case "song":
//			$base_url = "http://ws.audioscrobbler.com/2.0/?method=track.search&api_key={$api_key}&track=";
			$base_url = "http://ws.audioscrobbler.com/2.0/?method=track.search&api_key=3f0865b280b722753974f38e0563d0f8&track=";
			break;
		case "artist":
			$base_url = "http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&api_key=3f0865b280b722753974f38e0563d0f8&artist=";
			break;
		case "album":
			$base_url = "http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=3f0865b280b722753974f38e0563d0f8&album=";
			break;
		default:
			$base_url = "http://ws.audioscrobbler.com/2.0/?method=track.search&api_key=3f0865b280b722753974f38e0563d0f8&track=";
			break;
	}
			
	$handle = fopen($base_url . urlencode($query), "r");
	$contents = stream_get_contents($handle);
	fclose($handle);
	
	$contents = str_replace("opensearch:", "", $contents);
	
	$jsonContents = "";
	    // Convert it to JSON now.
	    // xml2json simply takes a String containing XML contents as input.
	    $jsonContents = xml2json::transformXmlStringToJson($contents);
	
	if ($callback) return $callback."(".$jsonContents.")";
	else return $jsonContents;
	
}

/*
***************
airport check
*****************
*/

$wgAjaxExportList[] = 'wfCheckAirportCodesJSON';
function wfCheckAirportCodesJSON($airport1, $airport2, $callback=false) {
	$airport_codes = array("ABR"=>"Aberdeen, SD","ABI"=>"Abilene, TX","ADK"=>"Adak Island, AK","KKI"=>"Akiachak, AK","AKI"=>"Akiak, AK","CAK"=>"Akron/Canton, OH","KQA"=>"Akuton, AK","AUK"=>"Alakanuk, AK","ALM"=>"Alamogordo, NM","ALS"=>"Alamosa, CO","ALB"=>"Albany, NY","CVO"=>"Albany, OR - Bus service","QWY"=>"Albany, OR - Bus service","ABQ"=>"Albuquerque, NM","WKK"=>"Aleknagik, AK","AEX"=>"Alexandria, LA","AET"=>"Allakaket, AK","ABE"=>"Allentown, PA","AIA"=>"Alliance, NE","APN"=>"Alpena, MI","AOO"=>"Altoona, PA","AMA"=>"Amarillo, TX","ABL"=>"Ambler, AK","AKP"=>"Anaktueuk, AK","ANC"=>"Anchorage, AK","AGN"=>"Angoon, AK","ANI"=>"Aniak, AK","ANV"=>"Anvik, AK","ATW"=>"Appleton, WI","ACV"=>"Arcata, CA","ARC"=>"Arctic Village, AK","AVL"=>"Asheville, NC","HTS"=>"Ashland, KY/Huntington, WV","ASE"=>"Aspen, CO","AHN"=>"Athens, GA","AKB"=>"Atka, AK","ATL"=>"Atlanta, GA","AIY"=>"Atlantic City, NJ","ATK"=>"Atqasuk, AK","AGS"=>"Augusta, GA","AUG"=>"Augusta, ME","AUS"=>"Austin, TX","BFL"=>"Bakersfield, CA","BWI"=>"Baltimore, MD","BGR"=>"Bangor, ME","BHB"=>"Bar Harbour, ME","BRW"=>"Barrow, AK","BTI"=>"Barter Island, AK","BTR"=>"Baton Rouge, LA","MBS"=>"Bay City, MI","BPT"=>"Beaumont/Port Arthur, TX","ZBV"=>"Beaver Creek, CO - Van service","WBQ"=>"Beaver, AK","BKW"=>"Beckley, WV","BED"=>"Bedford, MA","BLV"=>"Belleville, IL","BLI"=>"Bellingham, WA","BJI"=>"Bemidji, MN","BEH"=>"Benton Harbor, MI","BET"=>"Bethel, AK","ABE"=>"Bethlehem, PA","BTT"=>"Bettles, AK","BIL"=>"Billings, MT","GPT"=>"Biloxi/Gulfport, MS","BGM"=>"Binghamton, NY","KBC"=>"Birch Creek, AK","BHM"=>"Birmingham, AL","BIS"=>"Bismarck, ND","BID"=>"Block Island, RI","BMI"=>"Bloomington, IL","BLF"=>"Bluefield, WV","BOI"=>"Boise, ID","BOS"=>"Boston, MA","XHH"=>"Boulder, CO - Bus service","WHH"=>"Boulder, CO - Hiltons Har H","WBU"=>"Boulder, CO - Municipal Airport","BYA"=>"Boundary, AK","BWG"=>"Bowling Green, KY","BZN"=>"Bozeman, MT","BFD"=>"Bradford, PA","BRD"=>"Brainerd, MN","BWD"=>"Brawnwood, TX","QKB"=>"Breckonridge, CO - Van service","TRI"=>"Bristol, VA","BKX"=>"Brookings, SD","RBH"=>"Brooks Lodge, AK","BRO"=>"Brownsville, TX","BQK"=>"Brunswick, GA","BKC"=>"Buckland, AK","BUF"=>"Buffalo, NY","IFP"=>"Bullhead City/Laughlin, AZ","BUR"=>"Burbank, CA","BRL"=>"Burlington, IA","BTV"=>"Burlington, VT","BTM"=>"Butte, MT","CAK"=>"Canton/Akron, OH","CGI"=>"Cape Girardeau, MO","LUR"=>"Cape Lisburne, AK","EHM"=>"Cape Newenham, AK","MDH"=>"Carbondale, IL","CLD"=>"Carlsbad, CA","CNM"=>"Carlsbad, NM","MRY"=>"Carmel, CA","CPR"=>"Casper, WY","CDC"=>"Cedar City, UT","CID"=>"Cedar Rapids, IA","CEM"=>"Central, AK","CDR"=>"Chadron, NE","CIK"=>"Chalkyitsik, AK","CMI"=>"Champaign/Urbana, IL","CHS"=>"Charleston, SC","CRW"=>"Charleston, WV","CLT"=>"Charlotte, NC","CHO"=>"Charlottesville, VA","CHA"=>"Chattanooga, TN","CYF"=>"Chefornak, AK","VAK"=>"Chevak, AK","CYS"=>"Cheyenne, WY","CGX"=>"Chicago, IL - Meigs","CHI"=>"Chicago, IL - All airports","MDW"=>"Chicago, IL - Midway","ORD"=>"Chicago, IL - O'Hare","CKX"=>"Chicken, AK","CIC"=>"Chico, CA","KCG"=>"Chignik, AK - Fisheries","KCQ"=>"Chignik, AK -","KCL"=>"Chignik, AK - Lagoon","CZN"=>"Chisana, AK","HIB"=>"Chisholm/Hibbing, MN","CHU"=>"Chuathbaluk, AK","CVG"=>"Cincinnati, OH","CHP"=>"Circle Hot Springs, AK","IRC"=>"Circle, AK","CLP"=>"Clarks Point, AK","CKB"=>"Clarksburg, WV","PIE"=>"Clearwater/St Petersburg, FL","CLE"=>"Cleveland, OH","CVN"=>"Clovis, NM","COD"=>"Cody/Yellowstone, WY","CFA"=>"Coffee Point, AK","KCC"=>"Coffman Cove, AK","CDB"=>"Cold Bay, AK","CLL"=>"College Station, TX","COS"=>"Colorado Springs, CO","COU"=>"Columbia, MO","CAE"=>"Columbia, SC","CSG"=>"Columbus, GA","GTR"=>"Columbus, MS","CMH"=>"Columbus, OH","CCR"=>"Concord, CA","CNK"=>"Concordia, KS","QCE"=>"Copper Mountain, CO - Van service","CDV"=>"Cordova, AK","CRP"=>"Corpus Christi, TX","CEZ"=>"Cortez, CO","CGA"=>"Craig, AK","CEC"=>"Crescent City, CA","CKO"=>"Crooked Creek, AK","CUW"=>"Cube Cove, AK","CBE"=>"Cumberland, MD","DFW"=>"Dallas/Fort Worth, TX","DAY"=>"Dayton, OH","DAB"=>"Daytona Beach, FL","DEC"=>"Decatur, IL","DRG"=>"Deering, AK","DJN"=>"Delta Junction, AK","DEN"=>"Denver, CO - International","QWM"=>"Denver, CO - Longmont Bus service","DSM"=>"Des Moines, IA","DTT"=>"Detroit, MI - All airports","DTW"=>"Detroit, MI - Metro/Wayne County","DVL"=>"Devil's Lake, ND","DIK"=>"Dickinson, ND","DLG"=>"Dillingham, AK","DDC"=>"Dodge City, KS","DHN"=>"Dothan, AL","DUJ"=>"Dubois, PA","DBQ"=>"Dubuque, IA","DLH"=>"Duluth, MN","DRO"=>"Durango, CO","RDU"=>"Durham, NC","RDU"=>"Durham/Raleigh, NC","DUT"=>"Dutch Harbor, AK","ABE"=>"Easton, PA","EAU"=>"Eau Claire, WI","EDA"=>"Edna Bay, AK","EEK"=>"Eek, AK","KKU"=>"Ekuk, AK","KEK"=>"Ekwok, AK","IPL"=>"El Centro, CA","ELD"=>"El Dorado, AR","ELP"=>"El Paso, TX","ELV"=>"Elfin Cove, AK","ELI"=>"Elim, AK","EKO"=>"Elko, NV","ELM"=>"Elmira, NY","LYU"=>"Ely, MN","EMK"=>"Emmonak, AK","BGM"=>"Endicott, NY","WDG"=>"Enid, OK","ERI"=>"Erie, PA","ESC"=>"Escanaba, MI","EUG"=>"Eugene, OR","ACV"=>"Eureka/Arcata, CA","EUE"=>"Eureka, NV","EVV"=>"Evansville, IN","FAI"=>"Fairbanks, AK","FAR"=>"Fargo, ND","FYV"=>"Fayetteville, AR - Municipal/Drake","XNA"=>"Fayetteville, AR - Northwest Arkansas Regional","FAY"=>"Fayetteville, NC","FLG"=>"Flagstaff, AZ","FNT"=>"Flint, MI","FLO"=>"Florence, SC","MSL"=>"Florence/Muscle Shoals/Sheffield, AL","FNL"=>"Fort Collins/Loveland, CO - Municipal Airport","QWF"=>"Fort Collins/Loveland, CO - Bus service","FOD"=>"Fort Dodge, IA","FLL"=>"Fort Lauderdale, FL","TBN"=>"Fort Leonard Wood, MO","RSW"=>"Fort Myers, FL","FSM"=>"Fort Smith, AR","VPS"=>"Fort Walton Beach, FL","FWA"=>"Fort Wayne, IN","DFW"=>"Fort Worth/Dallas, TX","FKL"=>"Franklin, PA","FAT"=>"Fresno, CA","GNV"=>"Gainesville, FL","GUP"=>"Gallup, NM","GCK"=>"Garden City, KS","GYY"=>"Gary, IN","GCC"=>"Gillette, WY","GGG"=>"Gladewater/Kilgore, TX","GGW"=>"Glasgow, MT","GDV"=>"Glendive, MT","GLV"=>"Golovin, AK","GNU"=>"Goodnews Bay, AK","JGC"=>"Grand Canyon, AZ - Heliport","GCN"=>"Grand Canyon, AZ - National Park","GFK"=>"Grand Forks, ND","GRI"=>"Grand Island, NE","GJT"=>"Grand Junction, CO","GRR"=>"Grand Rapids, MI","GPZ"=>"Grand Rapids, MN","KGX"=>"Grayling, AK","GTF"=>"Great Falls, MT","GRB"=>"Green Bay, WI","GSO"=>"Greensboro, NC","GLH"=>"Greenville, MS","PGV"=>"Greenville, NC","GSP"=>"Greenville/Spartanburg, SC","GON"=>"Groton/New London, CT","GPT"=>"Gulfport, MS","GUC"=>"Gunnison, CO","GST"=>"Gustavus, AK","HGR"=>"Hagerstown, MD","SUN"=>"Hailey, ID","HNS"=>"Haines, AK","PHF"=>"Hampton, VA","HNM"=>"Hana, HI - Island of Maui","PAK"=>"Hanapepe, HI","CMX"=>"Hancock, MI","LEB"=>"Hanover, NH","HRL"=>"Harlingen, TX","MDT"=>"Harrisburg, PA","HRO"=>"Harrison, AR","BDL"=>"Hartford, CT","HAE"=>"Havasupai, AZ","HVR"=>"Havre, MT","HDN"=>"Hayden, CO","HYS"=>"Hays, KS","HKB"=>"Healy Lake, AK","HLN"=>"Helena, MT","AVL"=>"Hendersonville, NC","HIB"=>"Hibbing/Chisholm, MN","HKY"=>"Hickory, NC","GSO"=>"High Point, NC","ITO"=>"Hilo, HI - Island of Hawaii","HHH"=>"Hilton Head, SC","HBB"=>"Hobbs, NM","HYL"=>"Hollis, AK","HCR"=>"Holy Cross, AK","HOM"=>"Homer, AK","HNL"=>"Honolulu, HI - Island of Oahu","MKK"=>"Hoolehua, HI - Island of Molokai","HNH"=>"Hoonah, AK","HPB"=>"Hooper Bay, AK","HOT"=>"Hot Springs, AR","HOU"=>"Houston, TX - All airports","HOU"=>"Houston, TX - Hobby","IAH"=>"Houston, TX - Intercontinental","HUS"=>"Hughes, AK","HTS"=>"Huntington, WV/Ashland, KY","HSV"=>"Huntsville, AL","HON"=>"Huron, SD","HSL"=>"Huslia, AK","HYA"=>"Hyannis, MA","HYG"=>"Hydaburg, AK","IDA"=>"Idaho Falls, ID","IGG"=>"Igiugig, AK","ILI"=>"Iliamna, AK","IPL"=>"Imperial, CA","IND"=>"Indianapolis, IN","INL"=>"International Falls, MN","IYK"=>"Inyokern, CA","IMT"=>"Iron Mountain, MI","IWD"=>"Ironwood, MI","ISP"=>"Islip, NY","ITH"=>"Ithaca, NY","JAC"=>"Jackson Hole, WY","JAN"=>"Jackson, MS","MKL"=>"Jackson, TN","JAX"=>"Jacksonville, FL","OAJ"=>"Jacksonville, NC","JMS"=>"Jamestown, ND","JHW"=>"Jamestown, NY","JVL"=>"Janesville, WI","BGM"=>"Johnson City, NY","TRI"=>"Johnson City, TN","JST"=>"Johnstown, PA","JBR"=>"Jonesboro, AR","JLN"=>"Joplin, MO","JNU"=>"Juneau, AK","OGG"=>"Kahului, HI - Island of Maui,","KAE"=>"Kake, AK","KNK"=>"Kakhonak, AK","AZO"=>"Kalamazoo, MI","LUP"=>"Kalaupapa, HI - Island of Molokai,","KLG"=>"Kalskag, AK","KAL"=>"Kaltag, AK","MUE"=>"Kamuela, HI - Island of Hawaii,","MCI"=>"Kansas City, MO","JHM"=>"Kapalua, HI - Island of Maui,","KXA"=>"Kasaan, AK","KUK"=>"Kasigluk, AK","LIH"=>"Kauai Island/Lihue, HI","EAR"=>"Kearney, NE","EEN"=>"Keene, NH","ENA"=>"Kenai, AK","KTN"=>"Ketchikan, AK","EYW"=>"Key West, FL","QKS"=>"Keystone, CO - Van service","IAN"=>"Kiana, AK","GGG"=>"Kilgore/Gladewater, TX","ILE"=>"Killeen, TX","KVC"=>"King Cove, AK","AKN"=>"King Salmon, AK","IGM"=>"Kingman, AZ","TRI"=>"Kingsport, TN","KPN"=>"Kipnuk, AK","IRK"=>"Kirksville, MO","KVL"=>"Kivalina, AK","LMT"=>"Klamath Falls, OR","KLW"=>"Klawock, AK","TYS"=>"Knoxville, TN","OBU"=>"Kobuk, AK","ADQ"=>"Kodiak, AK","KOA"=>"Kona, HI - Island of Hawaii","KKH"=>"Kongiganak, AK","KOT"=>"Kotlik, AK","OTZ"=>"Kotzebue, AK","KYU"=>"Koyukuk, AK","KWT"=>"Kwethluk, AK","KWK"=>"Kwigillingok, AK","LSE"=>"La Crosse, WI","LAF"=>"Lafayette, IN","LFT"=>"Lafayette, LA","LCH"=>"Lake Charles, LA","HII"=>"Lake Havasu City, AZ","LMA"=>"Lake Minchumina, AK","LNY"=>"Lanai City, HI - Island of Lanai","LNS"=>"Lancaster, PA","LAN"=>"Lansing, MI","LAR"=>"Laramie, WY","LRD"=>"Laredo, TX","LAS"=>"Las Vegas, NV","LBE"=>"Latrobe, PA","PIB"=>"Laurel, MS","LAW"=>"Lawton, OK","LEB"=>"Lebanon, NH","KLL"=>"Levelock, AK","LWB"=>"Lewisburg, WV","LWS"=>"Lewiston, ID","LWT"=>"Lewistown, MT","LEX"=>"Lexington, KY","LBL"=>"Liberal, KS","LIH"=>"Lihue, HI - Island of Kaui","LNK"=>"Lincoln, NE","LIT"=>"Little Rock, AR","LGB"=>"Long Beach, CA","GGG"=>"Longview, TX","LPS"=>"Lopez Island, WA","LAX"=>"Los Angeles, CA","SDF"=>"Louisville, KY","FNL"=>"Loveland/Fort Collins, CO - Municipal Airport","QWF"=>"Loveland/Fort Collins, CO - Bus service","LBB"=>"Lubbock, TX","MCN"=>"Macon, GA","MSN"=>"Madison, WI","MDJ"=>"Madras, OR","MHT"=>"Manchester, NH","MHK"=>"Manhattan, KS","MBL"=>"Manistee, MI","MKT"=>"Mankato, MN","MLY"=>"Manley Hot Springs, AK","KMO"=>"Manokotak, AK","PKB"=>"Marietta, OH/Parkersburg, WV","MWA"=>"Marion, IL","MQT"=>"Marquette, MI","MLL"=>"Marshall, AK","MVY"=>"Martha's Vineyard, MA","AOO"=>"Martinsburg, PA","MCW"=>"Mason City, IA","MSS"=>"Massena, NY","OGG"=>"Maui, HI","MFE"=>"Mcallen, TX","MCK"=>"Mccook, NE","MCG"=>"Mcgrath, AK","MFR"=>"Medford, OR","MYU"=>"Mekoryuk, AK","MLB"=>"Melbourne, FL","MEM"=>"Memphis, TN","MCE"=>"Merced, CA","MEI"=>"Meridian, MS","MTM"=>"Metlakatla, AK","WMK"=>"Meyers Chuck, AK","MIA"=>"Miami, FL - International","MPB"=>"Miami, FL - Sea Plane Base","MBS"=>"Midland, MI","MAF"=>"Midland/Odessa, TX","MLS"=>"Miles City, MT","MKE"=>"Milwaukee, WI","MSP"=>"Minneapolis, MN","MOT"=>"Minot, ND","MNT"=>"Minto, AK","MFE"=>"Mission, TX","MSO"=>"Missoula, MT","CNY"=>"Moab, UT","MOB"=>"Mobile, AL","MOD"=>"Modesto, CA","MLI"=>"Moline, IL","MLU"=>"Monroe, LA","MRY"=>"Monterey, CA","MGM"=>"Montgomery, AL","MTJ"=>"Montrose, CO","MGW"=>"Morgantown, WV","MWH"=>"Moses Lake, WA","WMH"=>"Mountain Home, AR","MOU"=>"Mountain Village, AK","MSL"=>"Muscle Shoals, AL","MKG"=>"Muskegon, MI","MYR"=>"Myrtle Beach, SC","ACK"=>"Nantucket, MA","WNA"=>"Napakiak, AK","PKA"=>"Napaskiak, AK","APF"=>"Naples, FL","BNA"=>"Nashville, TN","NKI"=>"Naukiti, AK","NLG"=>"Nelson Lagoon, AK","NCN"=>"New Chenega, AK","HVN"=>"New Haven, CT","KGK"=>"New Koliganek, AK","GON"=>"New London/Groton","MSY"=>"New Orleans, LA","KNW"=>"New Stuyahok, AK","NYC"=>"New York, NY - All airports","JFK"=>"New York, NY - Kennedy","LGA"=>"New York, NY - La Guardia","EWR"=>"Newark, NJ","SWF"=>"Newburgh/Stewart Field, NY","PHF"=>"Newport News, VA","WWT"=>"Newtok, AK","NME"=>"Nightmute, AK","NIB"=>"Nikolai, AK","IKO"=>"Nikolski, AK","WTK"=>"Noatak, AK","OME"=>"Nome, AK","NNL"=>"Nondalton, AK","ORV"=>"Noorvik, AK","OFK"=>"Norfolk, NE","ORF"=>"Norfolk, VA","OTH"=>"North Bend, OR","LBF"=>"North Platte, NE","ORT"=>"Northway, AK","NUI"=>"Nuiqsut, AK","NUL"=>"Nulato, AK","NUP"=>"Nunapitchuk, AK","OAK"=>"Oakland, CA","MAF"=>"Odessa/Midland, TX","OGS"=>"Ogdensburg, NY","OKC"=>"Oklahoma City, OK","OMA"=>"Omaha, NE","ONT"=>"Ontario, CA","SNA"=>"Orange County, CA","ORL"=>"Orlando, FL - Herndon","MCO"=>"Orlando, FL - International","OSH"=>"Oshkosh, WI","OTM"=>"Ottumwa, IA","OWB"=>"Owensboro, KY","OXR"=>"Oxnard/Ventura, CA","PAH"=>"Paducah, KY","PGA"=>"Page, AZ","PSP"=>"Palm Springs, CA","PFN"=>"Panama City, FL","PKB"=>"Parkersburg, WV/Marietta, OH","PSC"=>"Pasco, WA","PDB"=>"Pedro Bay, AK","PEC"=>"Pelican, AK","PLN"=>"Pellston, MI","PDT"=>"Pendleton, OR","PNS"=>"Pensacola, FL","PIA"=>"Peoria, IL","KPV"=>"Perryville, AK","PSG"=>"Petersburg, AK","PHL"=>"Philadelphia, PA - International","TTN"=>"Philadelphia, PA - Trenton/Mercer NJ","PHX"=>"Phoenix, AZ","PIR"=>"Pierre, SD","UGB"=>"Pilot Point, AK - Ugashnik Bay","PIP"=>"Pilot Point, AK","PQS"=>"Pilot Station, AK","PIT"=>"Pittsburgh, PA","PTU"=>"Platinum, AK","PLB"=>"Plattsburgh, NY","PIH"=>"Pocatello, ID","KPB"=>"Point Baker, AK","PHO"=>"Point Hope, AK","PIZ"=>"Point Lay, AK","PNC"=>"Ponca City, OK","PSE"=>"Ponce, Puerto Rico","PTA"=>"Port Alsworth, AK","CLM"=>"Port Angeles, WA","BPT"=>"Port Arthur/Beaumont, TX","KPC"=>"Port Clarence, AK","PTH"=>"Port Heiden, AK","PML"=>"Port Moller, AK","PPV"=>"Port Protection, AK","PCA"=>"Portage Creek, AK","PWM"=>"Portland, ME","PDX"=>"Portland, OR","PSM"=>"Portsmouth, NH","POU"=>"Poughkeepsie, NY","PRC"=>"Prescott, AZ","PQI"=>"Presque Isle, ME","BLF"=>"Princeton, WV","PVD"=>"Providence, RI","PVC"=>"Provincetown, MA","SCC"=>"Prudhoe Bay/Deadhorse, AK","PUB"=>"Pueblo, CO","PUW"=>"Pullman, WA","UIN"=>"Quincy, IL","KWN"=>"Quinhagak, AK","RDU"=>"Raleigh/Durham, NC","RMP"=>"Rampart, AK","RAP"=>"Rapid City, SD","RDG"=>"Reading, PA","RDV"=>"Red Devil, AK","RDD"=>"Redding, CA","RDM"=>"Redmond, OR","RNO"=>"Reno, NV","RHI"=>"Rhinelander, WI,","RIC"=>"Richmond, VA","RIW"=>"Riverton, WY","ROA"=>"Roanoke, VA","RCE"=>"Roche Harbor, WA","RST"=>"Rochester, MN","ROC"=>"Rochester, NY","RKS"=>"Rock Springs, WY","ZRF"=>"Rockford, IL - Park&Ride Bus","ZRK"=>"Rockford, IL - Van Galder Bus","RKD"=>"Rockland, ME","RSJ"=>"Rosario, WA","ROW"=>"Roswell, NM","RBY"=>"Ruby, AK","RSH"=>"Russian Mission, AK","RUT"=>"Rutland, VT","SMF"=>"Sacramento, CA","MBS"=>"Saginaw, MI","STC"=>"Saint Cloud, MN","STG"=>"Saint George Island, AK","SGU"=>"Saint George, UT","STL"=>"Saint Louis, MO","KSM"=>"Saint Mary's, AK","SMK"=>"Saint Michael, AK","SNP"=>"Saint Paul Island, AK","SLE"=>"Salem, OR","SLN"=>"Salina, KS","SBY"=>"Salisbury-Ocean City, MD","SLC"=>"Salt Lake City, UT","SJT"=>"San Angelo, TX","SAT"=>"San Antonio, TX","SAN"=>"San Diego, CA","SFO"=>"San Francisco, CA","SJC"=>"San Jose, CA","SJU"=>"San Juan, Puerto Rico","SBP"=>"San Luis Obispo, CA","SDP"=>"Sand Point, AK","SNA"=>"Santa Ana, CA","SBA"=>"Santa Barbara, CA","SAF"=>"Santa Fe, NM","SMX"=>"Santa Maria, CA","STS"=>"Santa Rosa, CA","SLK"=>"Saranac Lake, NY","SRQ"=>"Sarasota, FL","CIU"=>"Sault Ste Marie, MI,","SAV"=>"Savannah, GA","SVA"=>"Savoonga, AK","SCM"=>"Scammon Bay, AK","BFF"=>"Scottsbluff, NE","AVP"=>"Scranton, PA","LKE"=>"Seattle, WA - Lake Union SPB","SEA"=>"Seattle, WA - Seattle/Tacoma International","WLK"=>"Selawik, AK","SWD"=>"Seward, AK","SHX"=>"Shageluk, AK","SKK"=>"Shaktoolik, AK","MSL"=>"Sheffield/Florence/Muscle Shoals, AL","SXP"=>"Sheldon Point, AK","SHR"=>"Sheridan, WY","SHH"=>"Shishmaref, AK","SHV"=>"Shreveport, LA","SHG"=>"Shungnak, AK","SVC"=>"Silver City, NM","SUX"=>"Sioux City, IA","FSD"=>"Sioux Falls, SD","SIT"=>"Sitka, AK","SGY"=>"Skagway, AK","SLQ"=>"Sleetmore, AK","SBN"=>"South Bend, IN","WSN"=>"South Naknek, AK","SOP"=>"Southern Pines, NC","GSP"=>"Spartanburg/Greenville, SC","GEG"=>"Spokane, WA","SPI"=>"Springfield, IL","SGF"=>"Springfield, MO","PIE"=>"St Petersburg/Clearwater, FL","SCE"=>"State College/University Park, PA","SHD"=>"Staunton, VA","SBS"=>"Steamboat Springs, CO","WBB"=>"Stebbins, AK","CWA"=>"Stevens Point/Wausau, WI","SVS"=>"Stevens Village, AK","SWF"=>"Stewart Field/Newburgh, NY","SCK"=>"Stockton, CA","SRV"=>"Stony River, AK","SUN"=>"Sun Valley, ID","SYR"=>"Syracuse, NY","TCT"=>"Takotna, AK","TKA"=>"Talkeetna, AK","TLH"=>"Tallahassee, FL","TPA"=>"Tampa, FL","TAL"=>"Tanana, AK","TSM"=>"Taos, NM","TEK"=>"Tatitlek, AK","KTS"=>"Teller Mission, AK","TEX"=>"Telluride, CO","TKE"=>"Tenakee Springs, AK","HUF"=>"Terre Haute, IN","TEH"=>"Tetlin, AK","TXK"=>"Texarkana, AR","TVF"=>"Thief River Falls, MN","KTB"=>"Thorne Bay, AK","TNC"=>"Tin City, AK","TOG"=>"Togiak Village, AK","TKJ"=>"Tok, AK","OOK"=>"Toksook Bay, AK","TOL"=>"Toledo, OH","FOE"=>"Topeka, KS","TVC"=>"Traverse City, MI","TTN"=>"Trenton/Mercer, NJ","TUS"=>"Tucson, AZ","TUL"=>"Tulsa, OK","TLT"=>"Tuluksak, AK","WTL"=>"Tuntutuliak, AK","TNK"=>"Tununak, AK","TUP"=>"Tupelo, MS","TCL"=>"Tuscaloosa, AL","TWF"=>"Twin Falls, ID","TWA"=>"Twin Hills, AK","TYR"=>"Tyler, TX","UNK"=>"Unalakleet, AK","CMI"=>"Urbana/Champaign, IL","UCA"=>"Utica, NY","UTO"=>"Utopia Creek, AK","EGE"=>"Vail, CO - Eagle County Airport","QBF"=>"Vail, CO - Van service","VDZ"=>"Valdez, AK","VLD"=>"Valdosta, GA","VPS"=>"Valparaiso, FL","VEE"=>"Venetie, AK","OXR"=>"Ventura/Oxnard, CA","VEL"=>"Vernal, UT","VCT"=>"Victoria, TX","VIS"=>"Visalia, CA","ACT"=>"Waco, TX","AIN"=>"Wainwright, AK","WAA"=>"Wales, AK","ALW"=>"Walla Walla, WA","WAS"=>"Washington DC - All airports","IAD"=>"Washington DC - Dulles","DCA"=>"Washington DC - National","KWF"=>"Waterfall, AK","ALO"=>"Waterloo, IA","ART"=>"Watertown, NY","ATY"=>"Watertown, SD","CWA"=>"Wausau/Stevens Point, WI","EAT"=>"Wenatchee, WA","PBI"=>"West Palm Beach, FL","WYS"=>"West Yellowstone, MT","HPN"=>"Westchester County, NY","WST"=>"Westerly, RI","WSX"=>"Westsound, WA","WWP"=>"Whale Pass, AK","WMO"=>"White Mountain, AK","LEB"=>"White River, VT","SPS"=>"Wichita Falls, TX","ICT"=>"Wichita, KS","AVP"=>"Wilkes Barre, PA","PHF"=>"Williamsburg, VA","IPT"=>"Williamsport, PA","ISN"=>"Williston, ND","ILM"=>"Wilmington, NC","BDL"=>"Windsor Locks, CT","ORH"=>"Worcester, MA","WRL"=>"Worland, WY","WRG"=>"Wrangell, AK","YKM"=>"Yakima, WA","YAK"=>"Yakutat, AK","COD"=>"Yellowstone/Cody, WY","YNG"=>"Youngstown, OH","YUM"=>"Yuma, AZ","YXX"=>"YT - Yukon Territory Abbotsford, BC","AKV"=>"Akulivik, QC","XLY"=>"Aldershot, ON - Rail service","XFS"=>"Alexandria,ON - Rail service","YTF"=>"Alma, QC","YAA"=>"Anahim Lake, BC","YAX"=>"Angling Lake, ON","YAB"=>"Arctic Bay, NU","YEK"=>"Arviat, NU","YAT"=>"Attawapiskat, ON","YPJ"=>"Aupaluk, QC","YBG"=>"Bagotville, QC","YBC"=>"Baie Comeau, QC","YBK"=>"Baker Lake, NU","ZBF"=>"Bathhurst, NB","XBE"=>"Bearskin Lake, ON","ZEL"=>"Bella Bella, BC","QBC"=>"Bella Coola, BC","XVV"=>"Belleville, ON - Rail service","YBV"=>"Berens River, MB","YTL"=>"Big Trout, ON","YBI"=>"Black Tickle, NL","YBX"=>"Blanc Sablon, QC","YVB"=>"Bonaventure, QC","XPN"=>"Brampton, ON - Rail service","YBR"=>"Brandon, MB","XFV"=>"Brantford, ON - Rail service","YBT"=>"Brochet, MB","XBR"=>"Brockville, ON","YPZ"=>"Burns Lake, BC","YYC"=>"Calgary, AB","YCB"=>"Cambridge Bay, NU","YBL"=>"Campbell River, BC","XAZ"=>"Campbellton, NB - Rail service","YTE"=>"Cape Dorset, NU","XAW"=>"Capreol, ON - Rail service","YRF"=>"Cartwright, NL","XZB"=>"Casselman, ON - Rail service","YCG"=>"Castlegar, BC","YAC"=>"Cat Lake, ON","XCI"=>"Chambord, QC - Rail service","XDL"=>"Chandler, QC - Rail service","YLD"=>"Chapleau, ON","YHG"=>"Charlottetown, NL","YYG"=>"Charlottetown, PE","XCM"=>"Chatham, ON","XHS"=>"Chemainus, BC - Rail service","YCS"=>"Chesterfield Inlet, NU","YHR"=>"Chevery, QC","YMT"=>"Chibougamau, QC","YKU"=>"Chisasibi, QC","ZUM"=>"Churchill Falls, NL","XAD"=>"Churchill, MB - Rail service","YYQ"=>"Churchill, MB","YCY"=>"Clyde River, NU","XGJ"=>"Cobourg, ON - Rail service","YCK"=>"Colville Lake, NT","YQQ"=>"Comox, BC","YZS"=>"Coral Harbour, NU","YCC"=>"Cornwall, ON","XGK"=>"Coteau, QC - Rail service","YCA"=>"Courtenay, BC","YXC"=>"Cranbrook, BC","YCR"=>"Cross Lake, MB","YDN"=>"Dauphin, MB","YDI"=>"Davis Inlet, NL","YDA"=>"Dawson City, YT","YDQ"=>"Dawson Creek, BC","YDF"=>"Deer Lake, NL","YVZ"=>"Deer Lake, ON","YWJ"=>"Deline, NT","XDM"=>"Drummondville, QC - Rail service","YHD"=>"Dryden, ON","DUQ"=>"Duncan/Quam, BC","ZEM"=>"East Main, QC","XZL"=>"Edmonton, AB - Rail service","YEG"=>"Edmonton, AB - International","YPF"=>"Esquimalt, BC","YFO"=>"Flin Flon, MB","ZFD"=>"Fond du Lac, SK","YFA"=>"Fort Albany, ON","YPY"=>"Fort Chipewyan, AB","YAG"=>"Fort Frances, ON","YGH"=>"Fort Good Hope, NT","YFH"=>"Fort Hope, ON","YMM"=>"Fort Mcmurray, AB","YYE"=>"Fort Nelson, BC","YER"=>"Fort Severn, ON","YFS"=>"Fort Simpson, NT","YSM"=>"Fort Smith, NT","YXJ"=>"Fort St John, BC","YFX"=>"Fox Harbour/St Lewis, NL","XFC"=>"Fredericton Junction, NB - Rail service","YFC"=>"Fredericton, NB","YQX"=>"Gander, NL","XDD"=>"Gaspe, QC - Rail service","YGP"=>"Gaspe, QC","XHM"=>"Georgetown, ON - Rail service","ZGS"=>"Gethsemani, QC","YGX"=>"Gillam, MB","YGB"=>"Gillies Bay, BC","YHK"=>"Gjoa Haven, NU","XZC"=>"Glencoe, ON - Rail service","YGO"=>"Gods Narrows, MB","ZGI"=>"Gods River, MB","YYR"=>"Goose Bay, NL","YQU"=>"Grande Prairie, AB","XGY"=>"Grimsby, ON","YGZ"=>"Grise Fiord, NU","XIA"=>"Guelph, ON - Rail service","XDG"=>"Halifax, NS - Rail service","YHZ"=>"Halifax, NS - International","YUX"=>"Hall Beach, NU","YHM"=>"Hamilton, ON","YGV"=>"Havre St Pierre, QC","YHY"=>"Hay River, NT","XDU"=>"Hervey, QC - Rail service","YOJ"=>"High Level, AB","YHI"=>"Holman, NT","YHO"=>"Hopedale, NL","ZHO"=>"Houston, BC - Bus station","YHB"=>"Hudson Bay, SK","YGT"=>"Igloolik, NU","YGR"=>"Iles De La Madeleine, QC","ILF"=>"Ilford, MB","XIB"=>"Ingersoll, ON - Rail service","YPH"=>"Inukjuak, QC","YEV"=>"Inuvik, NT","YFB"=>"Iqaluit, NU","YIV"=>"Island Lake/Garden Hill","YIK"=>"Ivujivik, QC","XDH"=>"Jasper, AB - Rail service","XJL"=>"Joliette, QC - Rail service","XJQ"=>"Jonquiere, QC - Rail service","YKA"=>"Kamloops, BC","XGR"=>"Kangiqsualujjuaq, QC","YWB"=>"Kangiqsujuaq, QC","YKG"=>"Kangirsuk, QC","YYU"=>"Kapuskasing, ON","XKS"=>"Kasabonika, ON","ZKE"=>"Kaschechewan, ON","KEW"=>"Keewaywin, ON","ZKG"=>"Kegaska, QC","YLW"=>"Kelowna, BC","YQK"=>"Kenora, ON","YLC"=>"Kimmirut/Lake Harbour NU","KIF"=>"Kingfisher Lake, ON","XEG"=>"Kingston, ON - Rail service","YGK"=>"Kingston, ON - Norman Rogers Airport","YKF"=>"Kitchener, ON","YKT"=>"Klemtu, BC","YBB"=>"Kugaaruk, NU","YCO"=>"Kugluktuk/Coppermine, NU","YVP"=>"Kuujjuaq, QC","YGW"=>"Kuujjuarapik, QC","YGL"=>"La Grande, QC","YVC"=>"La Ronge, SK","ZLT"=>"La Tabatiere, QC","YLQ"=>"La Tuque, QC","XLB"=>"Lac Brochet, MB","XEE"=>"Lac Edouard, QC - Rail service","XEH"=>"Ladysmith, BC - Rail service","XEJ"=>"Langford, BC - Rail service","YLH"=>"Lansdowne House, ON","YLR"=>"Leaf Rapids, MB","YQL"=>"Lethbridge, AB","YLL"=>"Lloydminister, AB","XDQ"=>"London, ON - Rail service","YXU"=>"London, ON - Municipal Airport","YSG"=>"Lutselke/Snowdrift, NT","YMH"=>"Mary's Harbour, NL","XID"=>"Maxville, ON - Rail service","YXH"=>"Medicine Hat, AB","XEK"=>"Melville, SK - Rail service","XEY"=>"Miramichi, NB - Rail service","XDP"=>"Moncton, NB - Rail service","YQM"=>"Moncton, NB - Airport","YYY"=>"Mont Joli, QC","XAX"=>"Montreal, QC - Dorval Rail service","YMY"=>"Montreal, QC - Downtown Rail service","XLM"=>"Montreal, QC - St Lambert Rail service","YMQ"=>"Montreal, QC - all airports","YUL"=>"Montreal, QC - Dorval","YMX"=>"Montreal, QC - Mirabel","YMO"=>"Moosonee, ON","MSA"=>"Muskrat Dam, ON","YDP"=>"Nain, NL","YQN"=>"Nakina, ON","ZNA"=>"Nanaimo, BC - Harbour Airport","YCD"=>"Nanaimo, BC - Cassidy Airport","YSR"=>"Nanisivik, NU","XIF"=>"Napanee, ON - Rail service","YNA"=>"Natashquan, QC","YNS"=>"Nemiscau, QC","XEL"=>"New Carlisle, QC - Rail service","XEM"=>"New Richmond, QC - Rail service","XLV"=>"Niagara Falls, ON - Rail service","YUY"=>"Noranda/Rouyn, QC","YVQ"=>"Norman Wells, NT","YYB"=>"North Bay, ON","YNO"=>"North Spirit Lake, ON","YNE"=>"Norway House, MB","YOG"=>"Ogoki, ON","YOC"=>"Old Crow, YT","YBS"=>"Opapamiska Lake, ON","YOO"=>"Oshawa, ON","XDS"=>"Ottawa, ON - Rail service","YOW"=>"Ottawa, ON - International","YOH"=>"Oxford House, MB","YIF"=>"Pakuashipi, QC","YXP"=>"Pangnirtung, NU","XFE"=>"Parent, QC - Rail service","XPB"=>"Parksville, BC - Rail service","YPC"=>"Paulatuk, NT","YPE"=>"Peace River, AB","YPO"=>"Peawanuck, ON","YTA"=>"Pembroke, ON","YYF"=>"Penticton, BC","XFG"=>"Perce, QC - Rail service","YPL"=>"Pickle Lake, ON","YPM"=>"Pikangikum, ON","XPX"=>"Pointe-aux-Trembles, QC - Rail service","YNL"=>"Points North Landing, SK","YIO"=>"Pond Inlet, NU","YHP"=>"Poplar Hill, ON","YPB"=>"Port Alberni, BC","YZT"=>"Port Hardy, BC","YHA"=>"Port Hope Simpson, NL","YPN"=>"Port Meiner, QC","YSO"=>"Postville, NL","YPX"=>"Povungnituk, QC","YPW"=>"Powell River, BC","XII"=>"Prescott, ON - Rail service","YPA"=>"Prince Albert, SK","XDV"=>"Prince George, BC - Rail service","YXS"=>"Prince George, BC","XDW"=>"Prince Rupert, BC - Rail service","YPR"=>"Prince Rupert, BC - Digby Island Airport","XPK"=>"Pukatawagan, MB -","YVM"=>"Qikiqtarjuaq, NU","XQU"=>"Qualicum, BC","YQC"=>"Quaqtaq, QC","YQB"=>"Quebec, QC - International Airport","YFZ"=>"Quebec, QC - Charny Rail service","XLK"=>"Quebec, QC - Levis Rail service","XLJ"=>"Quebec, QC - Quebec Station Rail service","XFY"=>"Quebec, QC - Sainte-Foy Rail service","YQZ"=>"Quesnel, BC","YRA"=>"Rae Lakes, NT","YOP"=>"Rainbow Lake, AB","YRT"=>"Rankin Inlet, NU","YRL"=>"Red Lake, ON","YRS"=>"Red Sucker Lake, MB","YQR"=>"Regina, SK","YUT"=>"Repulse Bay, NU","YRB"=>"Resolute, NU","YRG"=>"Rigolet, NL","YXK"=>"Rimouski, QC","XRP"=>"Riviere-a-Pierre, QC - Rail service","YRJ"=>"Roberval, QC","ZRJ"=>"Round Lake, ON","YUY"=>"Rouyn/Noranda, QC","ZPB"=>"Sachigo Lake, ON","YSY"=>"Sachs Harbour, NT","XKV"=>"Sackville, NB - Rail service","XIM"=>"Saint Hyacinthe, QC - Rail service","YSJ"=>"Saint John, NB","YYT"=>"Saint Johns, NL","YSL"=>"Saint Leonard, NB","YZG"=>"Salluit, QC","ZSJ"=>"Sandy Lake, ON","YSK"=>"Sanikiluaq, NU","XDX"=>"Sarnia, ON - Rail service","YZR"=>"Sarnia, ON","YXE"=>"Saskatoon, SK","YAM"=>"Sault Ste-Marie, ON","YKL"=>"Schefferville, QC","XFK"=>"Senneterre, QC - Rail service","YZV"=>"Sept-Iles, QC","ZTM"=>"Shamattawa, MB","XFL"=>"Shawinigan, QC - Rail service","XFM"=>"Shawnigan, BC - Rail service","YXL"=>"Sioux Lookout, ON","YSH"=>"Smith Falls, ON","YYD"=>"Smithers, BC","YFJ"=>"Snare Lake, NT","XSI"=>"South Indian Lake, MB","YAY"=>"St Anthony, NL","YCM"=>"St Catharines, ON","XIO"=>"St Marys, ON - Rail service","YST"=>"Ste Therese Point, MB","YJT"=>"Stephenville, NL","YSF"=>"Stony Rapids, SK","XTY"=>"Strathroy, ON - Rail service","XDY"=>"Sudbury, ON - Rail service","YSB"=>"Sudbury, ON","SUR"=>"Summer Beaver, ON","ZJN"=>"Swan River, MB","YQY"=>"Sydney, NS","XTL"=>"Tadoule Lake, MB","YYH"=>"Taloyoak, NU","YTQ"=>"Tasiujuaq, QC","YXT"=>"Terrace, BC","ZTB"=>"Tete-a-La Baleine, QC","XDZ"=>"The Pas, MB - Rail service","YQD"=>"The Pas, MB","YTD"=>"Thicket Portage, MB","YTH"=>"Thompson, MB","YQT"=>"Thunder Bay, ON","YTS"=>"Timmins, ON","YAZ"=>"Tofino, BC,","YBZ"=>"Toronto, ON - Downtown Rail service","XLQ"=>"Toronto, ON - Guildwood Rail service","YTZ"=>"Toronto, ON - Toronto Island Airport","YYZ"=>"Toronto, ON - International","XLZ"=>"Truro, NS - Rail service","YUB"=>"Tuktoyaktuk, NT","ZFN"=>"Tulita/Fort Norman, NT","YUD"=>"Umiujag, QC","YBE"=>"Uranium City, SK","YVO"=>"Val-d'Or, QC","CXH"=>"Vancouver, BC - Coal Harbour","XEA"=>"Vancouver, BC - Rail service","YVR"=>"Vancouver, BC - International","YWH"=>"Victoria, BC - Inner Harbor","YYJ"=>"Victoria, BC - International","YWK"=>"Wabush, NL","YKQ"=>"Waskaganish, QC","XWA"=>"Watford, ON - Rail service","YWP"=>"Webequie, ON","YNC"=>"Wemindji, QC","XFQ"=>"Weymont, QC - Rail service","YLE"=>"Wha Ti/Lac La Martre, NT","YXN"=>"Whale Cove, NU","YWR"=>"White River, ON","YXY"=>"Whitehorse, YT","YWM"=>"Williams Harbour, NL","YWL"=>"Williams Lake, BC","XEC"=>"Windsor, ON - Rail service","YQG"=>"Windsor, ON","XEF"=>"Winnipeg, MB - Rail service","YWG"=>"Winnipeg, MB - International","ZWL"=>"Wollaston Lake, SK","XIP"=>"Woodstock, ON - Rail service","WNN"=>"Wunnummin Lake, ON","XWY"=>"Wyoming, ON - Rail service","YQI"=>"Yarmouth, NS","YZF"=>"Yellowknife, NT","ZAC"=>"York Landing, MB","AAL"=>"Aalborg, Denmark","AES"=>"Aalesund, Norway","ZID"=>"Aarhus, Denmark - Bus service","AAR"=>"Aarhus, Denmark - Tirstrup","JEG"=>"Aasiaat, Greenland","ABD"=>"Abadan, Iran","ABA"=>"Abakan, Russia","ABZ"=>"Aberdeen, United Kingdom","AHB"=>"Abha, Saudi Arabia","ABJ"=>"Abidjan, Cote d'Ivoire","AUH"=>"Abu Dhabi, United Arab Emirates","ABS"=>"Abu Simbel, Egypt","ABV"=>"Abuja, Nigeria","ACA"=>"Acapulco, Mexico","AGV"=>"Acarigua, Venezuela","ACC"=>"Accra, Ghana","ADA"=>"Adana, Turkey","ADD"=>"Addis Ababa, Ethopia","ADL"=>"Adelaide, Australia","ADE"=>"Aden, Yemen","AER"=>"Adler/Sochi, Russia","AZR"=>"Adrar, Algeria","AFT"=>"Afutara, Soloman Islands","AGA"=>"Agadir, Morocco","IXA"=>"Agartala, India","AUP"=>"Agaun, Papua New Guinea","AGF"=>"Agen, France","AGR"=>"Agra, India","AJI"=>"Agri, Turkey","BQN"=>"Aguadilla, Puerto Rico","AGU"=>"Aguascalientes, Mexico","AGJ"=>"Aguni, Japan","AMD"=>"Ahmedabad, India","AWZ"=>"Ahwaz, Iran","AIM"=>"Ailuk Island, Marshall Islands","AEO"=>"Aioun El Atrouss, Mauritania","AIC"=>"Airok, Marshall Islands","AIT"=>"Aitutaki, Cook Islands","AJL"=>"Aizawl, India","AJA"=>"Ajaccio, France","AXT"=>"Akita, Japan","AKU"=>"Aksu, China","AKX"=>"Aktyubinsk, Kazakhstan","AEY"=>"Akureyri, Iceland","AAN"=>"Al Ain, United Arab Emirates","AAC"=>"Al Arish, Egypt","AAY"=>"Al Ghaydah, Yemen","AHU"=>"Al Hoceima, Morocco","ABT"=>"Al-Baha, Saudi Arabia","ABX"=>"Albury, Australia","ACI"=>"Alderney, United Kingdom","ALP"=>"Aleppo, Syrian Arab Republic","ALJ"=>"Alexander Bay, South Africa","ALY"=>"Alexandria, Egypt","AXD"=>"Alexandroupolis, Greece","FJR"=>"Al-Fujairah, United Arab Emirates","AHO"=>"Alghero, Italy","ALG"=>"Algiers, Algeria","ALC"=>"Alicante, Spain","ASP"=>"Alice Springs, Australia","AKX"=>"Almaty, Kazakhstan","LEI"=>"Almeria, Spain","ARD"=>"Alor Island, Indonesia","AOR"=>"Alorsetar, Malaysia","GUR"=>"Alotau, Papua New Guinea","ALF"=>"Alta, Norway","ATM"=>"Altamira, Brazil","AAT"=>"Altay, China","ACH"=>"Altenrhein, Switzerland","ARR"=>"Alto Rio Senguerr, Argentina","ASJ"=>"Amami O Shima, Japan","AZB"=>"Amazon Bay, Papua New Guinea","IVA"=>"Ambanja, Madagascar","AMY"=>"Ambatomainty, Madagascar","WAM"=>"Ambatondrazaka, Madagascar","AMQ"=>"Ambon, Indonesia","ASV"=>"Amboseli, Kenya","AMV"=>"Amderma, Russia","AMM"=>"Amman, Jordan - Queen Alia International","ADJ"=>"Amman, Jordan - Civil/Marka Airport","ATQ"=>"Amritsar, India","AMS"=>"Amsterdam, Netherlands","DYR"=>"Anadyr, Russia","HVA"=>"Analalava, Madagascar","AAQ"=>"Anapa, Russia","AOI"=>"Ancona, Italy","ANX"=>"Andenes, Norway","AZN"=>"Andizhan, Uzbekistan","ASD"=>"Andros, Bahamas","AUY"=>"Aneityum, Vanuatu","JHE"=>"Angelholm/Helsingborg, Sweden","ANE"=>"Angers, France - Marce","QXG"=>"Angers, France - Rail service","AGD"=>"Anggi, Indonesia","AQG"=>"Anging, China","ANG"=>"Angouleme, France","AXA"=>"Anguilla, Anguilla","AWD"=>"Aniwa, Vanuatu","AKA"=>"Ankang, China","ESB"=>"Ankara, Turkey - Esenboga","ANK"=>"Ankara, Turkey - Etimesqut","JVA"=>"Ankavandra, Madagascar","AAE"=>"Annaba, Algeria","NCY"=>"Annecy, France","ANM"=>"Antalaha, Madagascar","AYT"=>"Antalya, Turkey","TNR"=>"Antaninvarivo, Madgascar","ANU"=>"Antigua, Antigua and Barbuda","ANF"=>"Antofagasta, Chile","WAQ"=>"Antsalova, Madagascar","DIE"=>"Antsiranana, Madagascar","WAI"=>"Antsohihy, Madagascar","ANR"=>"Antwerp, Belgium - Deurne Airport","ZAY"=>"Antwerp, Belgium - Bus service","AOJ"=>"Aomori, Japan","AOT"=>"Aosta, Italy","APO"=>"Apartado, Colombia","APW"=>"Apia, Western Samoa","FGI"=>"Apia, Western Samoa","AQJ"=>"Aqaba, Jordan","AJU"=>"Araca, Brazil","ARU"=>"Aracatuba, Brazil","ARW"=>"Arad, Romania","ARP"=>"Aragip, Papua New Guinea","AUX"=>"Araguaina, Brazil","AAG"=>"Arapoti, Brazil","RAE"=>"Arar, Saudi Arabia","AUC"=>"Arauca, Colombia","AMH"=>"Arba Mintch, Ethiopia","ADU"=>"Ardabil, Iran","AQP"=>"Arequipa, Peru","AGH"=>"Argelholm/Helsingborg, Sweden","GYL"=>"Argyle, Australia","ARI"=>"Arica, Chile","ARH"=>"Arkangelsk, Russia","AXM"=>"Armenia, Colombia","ARM"=>"Armidale, Australia","ATC"=>"Arthur's Town, Bahamas","RUA"=>"Arua, Uganda","AUA"=>"Aruba, Aruba","ARK"=>"Arusha, Tanzania","AJR"=>"Arvidsjaur, Sweden","AKJ"=>"Asahikawa, Japan","ASB"=>"Ashgabat, Turkmenistan","ASM"=>"Asmara, Eritrea","ASO"=>"Asosa, Ethopia","ATZ"=>"Assiut, Egypt","TSE"=>"Astana, Kazakhstan","ASF"=>"Astrakhan, Russia","OVD"=>"Asturias, Spain and Canary Islands","ASU"=>"Asuncion, Paraguay","ASW"=>"Aswan, Egypt","AXK"=>"Ataq, Yemen","ATH"=>"Athens, Greece","AIU"=>"Atiu Island, Cook Islands","ATD"=>"Atoifi, Solomon Islands","AUQ"=>"Atuona, French Polynesia","GUW"=>"Atyrau, Kazakhstan","AKL"=>"Auckland, New Zealand","AGB"=>"Augsburg/Munich, Germany","AKS"=>"Auki, Solomon Islands","AUL"=>"Aur Island, Marshall Islands","IXU"=>"Aurangabad, India","AUR"=>"Aurillac, France","AUU"=>"Aurukun, Australia","AVN"=>"Avignon, France","AYW"=>"Ayawaki, Indonesia","AYQ"=>"Ayers Rock, Australia","BXB"=>"Babo, Indonesia","BCD"=>"Bacolod, Philippines","BJZ"=>"Badajcz, Spain","BXD"=>"Bade, Indonesia","BDD"=>"Badu Island, Australia","IXB"=>"Bagdogra, India","BJR"=>"Baharpar, Ethiopia","BHV"=>"Bahawalpur, Pakistan","BHI"=>"Bahia Blanca, Argentina","BFQ"=>"Bahia Pinas, Panama","BSC"=>"Bahia Solano, Colombia","BAH"=>"Bahrain, Bahrain","BAY"=>"Baia Mare, Romania","VMU"=>"Baimuru, Papua New Guinea","BAK"=>"Baku, Azerbaijan","BAS"=>"Balalae, Solomon Islands","BZI"=>"Balikesir, Turkey","BPN"=>"Balikpapan, Indonesia","OPU"=>"Balimo, Papua New Guinea","BNK"=>"Ballina, Australia","BBA"=>"Balmaceda, Chile","BXR"=>"Bam, Iran","ABM"=>"Bamaga, Australia","BKO"=>"Bamako, Mali","BTJ"=>"Banda Aceh, Indonesia","BND"=>"Bandar Abbas, Iran","TKG"=>"Bandar Lampung, Indonesia - Branti","BDH"=>"Bandar Lengeh, Iran","BWN"=>"Bandar Seri Begawan, Brunei","BDO"=>"Bandung, Indonesia","BLR"=>"Bangalore, India","BPX"=>"Bangda, China","BKK"=>"Bangkok, Thailand","BNX"=>"Banja Luka, Bosnia Herzegovina","BDJ"=>"Banjarmasin, Indonesia","BJL"=>"Banjul, Gambia","BMV"=>"Banmethuot, Viet Nam - Phung-Doc","BNP"=>"Bannu, Pakistan","BGF"=>"Banqui, Central African Republic","BSD"=>"Baoshan, China","BAV"=>"Baotou, China","BCA"=>"Baracoa, Cuba","BCI"=>"Barcaldine, Australia","BCN"=>"Barcelona, Spain","BLA"=>"Barcelona, Venezuela","BDU"=>"Bardufoss, Norway","BRI"=>"Bari, Italy","BNS"=>"Barinas, Venezuela","BBN"=>"Bario, Malaysia","BZL"=>"Barisal, Bangladesh","BAX"=>"Barnaul, Russia","BRM"=>"Barquisimeto, Venezuela","BCL"=>"Barra Colorado, Costa Rica","BRR"=>"Barra, United Kingdom","EJA"=>"Barran Cabermeja, Colombia","BAQ"=>"Barranquilla, Colombia","BRA"=>"Barreiras, Brazil","BSO"=>"Basco, Philippines","BSL"=>"Basel, Switzerland","ZDH"=>"Basel/Mulhouse Railway Station, Switzerland","BUZ"=>"Bashehr, Iran","BIA"=>"Bastia, France","BTH"=>"Batam, Indonesia","BRT"=>"Bathurst Island, Australia","BHS"=>"Bathurst, Australia","BAL"=>"Batman, Turkey","BLJ"=>"Batna, Algeria","BXM"=>"Batom, Indonesia","BJF"=>"Batsfijord, Norway","BBM"=>"Battambang, Cambodia","BUS"=>"Batumi, Georgia","BPF"=>"Batuna, Solomon Islands","BAU"=>"Bauru, Brazil","BYM"=>"Bayamo, Cuba","BYU"=>"Bayreuth, Germany","CBH"=>"Bechar, Algeria","BEU"=>"Bedourie, Australia","EIS"=>"Beef Island, British Virgin Islands","BEI"=>"Beica, Ethiopia","LAQ"=>"Beida, Libya - La Braq","BHY"=>"Beihai, China","PEK"=>"Beijing, China","BEW"=>"Beira, Mozambique","BEY"=>"Beirut, Lebanon","BJA"=>"Bejaia, Algeria","BLG"=>"Belaga, Mozambique","BEL"=>"Belem, Brazil","BMY"=>"Belep Island, New Caledonia","BFS"=>"Belfast, Northern Ireland, United Kingdom","BHD"=>"Belfast, United Kingdom","EGO"=>"Belgorod, Russia","BEG"=>"Belgrade, Serbia and Montenegro - Beograd","BZE"=>"Belize City, Belize - International","TZA"=>"Belize City, Belize - Municipal","BNY"=>"Bellona, Solomon Islands","BMD"=>"Belo, Madagascar","CNF"=>"Belo Horizonte, Brazil - Tancredo Neves Intl.","PLU"=>"Belo Horizonte, Brazil - Pampulha","BEB"=>"Benbecula, United Kingdom","BEN"=>"Benghazi, Libya","BKS"=>"Bengkulu, Indonesia","BEJ"=>"Berau, Indonesia","BBO"=>"Berbera, Somalia","BGO"=>"Bergen, Norway","EGC"=>"Bergerac, France","BVG"=>"Berlevag, Norway","BER"=>"Berlin, Germany - All airports","TXL"=>"Berlin, Germany - Tegel","THF"=>"Berlin, Germany - Tempelhof","SXF"=>"Berlin, Germany - Schoenefeld","BDA"=>"Bermuda, Bermuda","BRN"=>"Berne, Switzerland - Belp Airport","ZDJ"=>"Berne, Switzerland - Rail service","BPY"=>"Besalampy, Madagascar","BZR"=>"Beziers, France","BDP"=>"Bhadrapur, Nepal","BWA"=>"Bhairawa, Nepal","BMO"=>"Bhamo, Myanmar","BHR"=>"Bharatpur, Nepal","BHU"=>"Bhavnagar, India","BHO"=>"Bhopal, India","BBI"=>"Bhubaneswar, India","BHJ"=>"Bhuj, India","BIK"=>"Biak, Indonesia","BIQ"=>"Biarritz, France","BII"=>"Bikini Atoll, Marshall Islands","BIO"=>"Bilbao, Spain","BLL"=>"Billund, Denmark","BMU"=>"Bima, Indonesia","BIM"=>"Bimini, Bahamas","NSB"=>"Bimini, Bahamas","BTU"=>"Bintulu, Malaysia","NTI"=>"Bintuni, Indonesia","BIR"=>"Biratragar, Nepal","BVI"=>"Birdsville, Australia","BHX"=>"Birmingham, United Kingdom","BHH"=>"Bisha, Saudi Arabia","FRU"=>"Bishkek, Kyrgyzstan","BSK"=>"Biskra, Algeria","OXB"=>"Bissau, Guinea-Bissau","BKQ"=>"Blackall, Australia","BLK"=>"Blackpool, United Kingdom","BLT"=>"Blackwater, Australia","BQS"=>"Blagoveschensk, Russia","BLZ"=>"Blantyre, Malawi","BHE"=>"Blenheim, New Zealand","CNF"=>"Blo Horizonte, Brazil","BFN"=>"Bloemfontein, South Africa","BVC"=>"Boa Vista, Cape Verde","BOV"=>"Boang, Papua New Guinea","BVB"=>"Boavista, Brazil","BOC"=>"Bocas Del Toro, Panama","BOO"=>"Bodo, Norway","BJV"=>"Bodrum, Turkey","BOG"=>"Bogota, Colombia","GIC"=>"Boiju Island, Australia","BJB"=>"Bojnord, Iran","BUI"=>"Bokondini, Indonesia","BWK"=>"Bol, Croatia","BZO"=>"Bolzano, Italy","BOA"=>"Boma, Congo","BOM"=>"Bombay, India","BON"=>"Bonaire, Netherlands Antilles","BNJ"=>"Bonn, Germany","BOB"=>"Bora Bora, French Polynesia","BOD"=>"Bordeaux, France","HBE"=>"Borg El Arab, Egypt","BMK"=>"Borkum, Germany","BLE"=>"Borlange, Sweden","RNN"=>"Bornholm, Denmark","BOX"=>"Borroloola, Australia","BSA"=>"Bossaro, Somalia","BQL"=>"Boulia, Australia","BOJ"=>"Bourgas, Bulgaria","BRK"=>"Bourke, Australia","BOH"=>"Bournemouth, United Kingdom","BCQ"=>"Brack, Libya","BMP"=>"Brampton Island, Australia","BSB"=>"Brasilia, DF, Brazil","BTS"=>"Bratislava, Slovakia","BTK"=>"Bratsk, Russia","BWE"=>"Braunschweig, Denmark","BZV"=>"Brazzaville, Congo","BRE"=>"Bremen, Germany","BES"=>"Brest, France","BWQ"=>"Brewarrina, Australia","BGI"=>"Bridgetown, Barbados","BDS"=>"Brindisi, Italy","BNE"=>"Brisbane, Queensland, Australia","BRS"=>"Bristol, United Kingdom","BVE"=>"Brive-La-Gaillarde, France - Laroche","BRQ"=>"Brno, Czech Republic - Turany","ZDN"=>"Brno, Czech Republic - Bus service","BHQ"=>"Broken Hill, Australia","BNN"=>"Bronnoysund, Norway","BME"=>"Broome, Australia","BHG"=>"Brus Laguna, Honduras","BRU"=>"Brussels, Belgium - National","ZYR"=>"Brussels, Belgium - Rail service","CRL"=>"Brussels, Belguim - Charleroi","BGA"=>"Bucaramanga, Colombia","BBU"=>"Bucharest, Romania - Baneasa","OTP"=>"Bucharest, Romania - Otopeni International","BUD"=>"Budapest, Hungary","AEP"=>"Buenos Aires, Argentina - Jorge Newbery","EZE"=>"Buenos Aires, Argentina - Ministro Pistarini","UUA"=>"Bugulma, Russia","BJM"=>"Bujumbura, Burundi","BUA"=>"Buka, Papua New Guinea","BHK"=>"Bukhara, Uzbekistan","BKZ"=>"Bukoba, Malaysia","BUQ"=>"Bulawayo, Zimbabwe","UUA"=>"Bulgulma, Russia","BDB"=>"Bundaberg, Australia","BXZ"=>"Bunsil, Papua New Guinea","BUO"=>"Burao, Somalia","LEV"=>"Bureta, Fiji","BFV"=>"Buri Ram, Thailand","BUC"=>"Burketown, Australia","BWT"=>"Burnie, Australia","PUS"=>"Busan, South Korea - Gimhae","BXU"=>"Butuan, Philippines","BZG"=>"Bydgoszcz, Poland","SJD"=>"Cabo San Lucas, 'Los Cabos', Mexico","CFR"=>"Caen, France","CGY"=>"Cagayan De Oro, Philippines - Lumbia","CAG"=>"Cagliari, Italy","CNS"=>"Cairns, Australia","CAI"=>"Cairo, Egypt","CJA"=>"Cajamarca, Peru","CBQ"=>"Calabar, Nigeria","CJC"=>"Calama, Chile","CCU"=>"Calcutta, India","CLO"=>"Cali, Colombia","CLY"=>"Calvi, France","CMW"=>"Camaguey, Cuba","CBG"=>"Cambridge, United Kingdom","CRD"=>"Camodoro, Argentina","CAL"=>"Campbeltown, United Kingdom","CPE"=>"Campeche, Mexico","CPV"=>"Campina Grande, Brazil","CPQ"=>"Campinas, Brazil","CGR"=>"Campo Grande, Brazil","CAW"=>"Campos, Brazil","CAS"=>"Canaima, Venezuela","CBR"=>"Canberra, Australia","CUN"=>"Cancun, Mexico","CEQ"=>"Cannes, France - Mandelieu","JCA"=>"Cannes, France - Coisette Heliport","QYW"=>"Cannes, France - Vieux Port","CIW"=>"Canouan, Saint Vincent and the Grenadines","CAP"=>"Cap Haitien, Haiti","CPI"=>"Cape Orford, Papua New Guinea","CPT"=>"Cape Town, South Africa","CVL"=>"Cape Vogel, Papua New Guinea","CCS"=>"Caracas, Venezuela","CKS"=>"Carajas, Brazil","CCF"=>"Carcassonne, France","CWL"=>"Cardiff, United Kingdom","CVQ"=>"Carnarvon, Australia","RIK"=>"Carrillo, Costa Rica","CTG"=>"Cartagena, Colombia","CUP"=>"Carupani, Venezuela","CAS"=>"Casablanca, Morocco - Anfa","CMN"=>"Casablanca, Morocco - Mohamed V","CAC"=>"Cascavel, Brazil","CSI"=>"Casino, Australia","CST"=>"Castaway, Fiji","DCM"=>"Castres, France","CTC"=>"Catamarca, Argentina","CTA"=>"Catania, Italy","CAQ"=>"Caucasia, Colombia","CXJ"=>"Caxias Do Sul, Brazil","CAY"=>"Cayenne, French Guiana","CYB"=>"Cayman Brac Is, Cambodia","CYO"=>"Cayo Largo Del Sur, Cuba","CEB"=>"Cebu, Philippines - Matan International","CED"=>"Cedun, Australia","JCU"=>"Ceuta, Spain and Canary Islands","ZBR"=>"Chah-Bahar, Iran","CMF"=>"Chambery, France","IXC"=>"Chandigarh, India","CGQ"=>"Changchun, China","CGD"=>"Changde, China","CHX"=>"Changuinda, Panama","CZX"=>"Changzhou, China","CHQ"=>"Chania, Greece","CHG"=>"Chaoyang, China","XAP"=>"Chapeco, Brazil","CTL"=>"Charleville, Australia","CHT"=>"Chatham Island, New Zealand","CSY"=>"Cheboksary, Russia","CEK"=>"Chelybinsk, Russia","MAA"=>"Chennai, India","CJJ"=>"Cheongju, South Korea","CEE"=>"Cherepovets, Russia","CTU"=>"Chergdu, China","CEG"=>"Chester, United Kingdom","CTM"=>"Chetumal, Mexico","CEE"=>"Chevepovets, Russia","CMJ"=>"Chi Mei, Taiwan","CNX"=>"Chiang Mai, Thailand","CEI"=>"Chiang Rai, Thailand","CYI"=>"Chiayi, Taiwan","CIX"=>"Chicayo, Peru","CIF"=>"Chifeng, China","CUU"=>"Chihuahua, Mexico","YAI"=>"Chillan, Chile","CIP"=>"Chipata, Zambia","KIV"=>"Chisinau, Republic of Moldova","HTA"=>"Chita, Russia","CJL"=>"Chitral, Pakistan","CTD"=>"Chitre, Panama","CGP"=>"Chittagong, Bangladesh","CHY"=>"Choiseul Bay, Solomon Islands","CKG"=>"Chongqing, China","CHC"=>"Christchurch, New Zealand","XCH"=>"Christmas Island, Christmas Island","ICI"=>"Cicia, Fiji","AVI"=>"Ciego De Avila, Cuba","CBL"=>"Ciudad Bolivar, Venezuela","CME"=>"Ciudad Del Carmen, Mexico","AGT"=>"Ciudad del Este, Paraguay","CJS"=>"Ciudad Juarez, Mexico","CEN"=>"Ciudad Obregon, Mexico","CVM"=>"Ciudad Victoria, Mexico","CFE"=>"Clermont-ferrand, France","CVC"=>"Cleve, Australia","CNJ"=>"Cloncurry, Australia","CMK"=>"Club Makokola, Malawi","CLJ"=>"Cluj, Romania","CAZ"=>"Cobar, Australia","CIJ"=>"Cobija, Bolivia","CBB"=>"Cochabamba, Bolivia","COK"=>"Cochin, India","CNC"=>"Coconut Island, Australia","CCK"=>"Keeling) Islands","CUQ"=>"Coen, Australia","CFS"=>"Coffs Harbor, Australia","CJB"=>"Coimbatore, India","CLQ"=>"Colima, Mexico","QKL"=>"Cologne, Germany - Rail service","CGN"=>"Cologne, Germany - Cologne/Bonn","CMB"=>"Colombo, Sri Lanka","ONX"=>"Colon, Panama","CKY"=>"Conakry, Guinea","CCP"=>"Concepcion, Chile","COC"=>"Concordia, Argentina","COG"=>"Condoto, Colombia","CND"=>"Constanta, Romania","CZL"=>"Constantine, Algeria","OTD"=>"Contadora, Panama","CPD"=>"Coober Pedy, Australia","CTN"=>"Cooktown, Australia","OOM"=>"Cooma, NS, Australia","CNB"=>"Coonamble, Australia","CPH"=>"Copenhagen, Denmark","CPO"=>"Copiapo, Chile","COR"=>"Cordoba, Argentina","ORK"=>"Cork, Ireland","CZE"=>"Coro, Venezuela","CZH"=>"Corozal, Belize","CNQ"=>"Corrientes, Argentina","CMG"=>"Corumba, Brazil","CVU"=>"Corvo Island, Portugal","CBO"=>"Cotabato, Philippines","COC"=>"Cotarou, Benin","CXB"=>"Cox's Bazar, Bangladesh","CZM"=>"Cozumel, Mexico","CCV"=>"Craig Cove, Vanuatu","CCM"=>"Criciuma, Brazil","CKI"=>"Croker Island, Australia","CRI"=>"Crooked Island, Bahamas","CRV"=>"Crotone, Italy","CZS"=>"Cruzeiro Do Sul, Brazil","CUC"=>"Cucata, Colombia","CUE"=>"Cuenca, Ecuador","CVJ"=>"Cuernavaca, Mexico","CGB"=>"Cuiaba, Brazil","CUL"=>"Culiacan, Mexico","CUM"=>"Cumana, Venezuela","CMA"=>"Cunnamulla, Australia","CUR"=>"Curacao, Netherlands Antilles","CWB"=>"Curitiba, Brazil","CUZ"=>"Cuzco, Peru","DAD"=>"Da Nang, Viet Nam","DRH"=>"Dabra, Indonesia","TAE"=>"Daegu, South Korea","DKR"=>"Dakar, Senegal","VIL"=>"Dakhla, Morocco","DLM"=>"Dalaman, Turkey","DLU"=>"Dalat, Viet Nam - Lienkhang DLI) Dali City, China","DLC"=>"Dalian, China","DAM"=>"Damascus, Syrian Arab Republic","DMM"=>"Dammam, Saudi Arabia","DGA"=>"Dangriga, Belize","DAR"=>"Dar Es Salaam, Tanzania","NLF"=>"Darnley Island, QL, Australia","DAU"=>"Daru, Papua New Guinea","DRW"=>"Darwin, Northern Territory, Australia","DTD"=>"Datadawai, Indonesia","DVO"=>"Davao, Philipines - Mati","DAV"=>"David, Panama","TVY"=>"Dawe, Myanmar","DAX"=>"Daxian, China","DYG"=>"Dayang, China","DDI"=>"Daydream Is, Australia","DOL"=>"Deauville, France","DBM"=>"Debra Marcos, Ethiopia","DBT"=>"Debra Tabor, Ethiopia","DEZ"=>"Deirezzor, Syria - Al Jafrah","DEL"=>"Delhi, India","DEM"=>"Dembidollo, Ethiopia","DNM"=>"Denham, Australia","DNZ"=>"Denizli, Turkey","DPS"=>"Denpasar Bali, Indonesia","DEA"=>"Dera Ghazi, Pakistan","DSK"=>"Dera Ismail Khan, Pakistan","DRB"=>"Derby, Australia","DER"=>"Derim, Papua New Guinea","DSE"=>"Dessie, Ethiopia","DPO"=>"Devonport, Australia","DAC"=>"Dhaka, Bangledesh - Zia International","DIB"=>"Dibrugarn, India","DIN"=>"Dien Bien Phu, Viet Nam - Gialam","DIJ"=>"Dijon, France","DIL"=>"Dili, Indonesia","DLY"=>"Dillons Bay, Vanuata","DMU"=>"Dimapur, India","DNR"=>"Dinard, France","DPL"=>"Dipolog, Philippines","DIR"=>"Dire Dawa, Ethiopia","DIU"=>"Div, India","DIY"=>"Diyarbakir, Turkey","DJG"=>"Djanet, Algeria","DJE"=>"Djerba, Tunisia","JIB"=>"Djibouti, Djibouti","DNK"=>"Dnepropetrovsk, Ukraine","DOB"=>"Dobo, Indonesia","DOD"=>"Dodoma, Tanzania","DDM"=>"Dodoima, Papua New Guinea","DOH"=>"Doha, Qatar","DCF"=>"Dominica, Dominica - Cane Field","DOM"=>"Dominica, Dominica - Melville Hall","CFN"=>"Donegal, Ireland","DOK"=>"Donetsk, Ukraine","DOG"=>"Dongola, Sudan","DMD"=>"Doomadgee, Australia","DTM"=>"Dortmund, Germany","DOU"=>"Dourados, Brazil","DLA"=>"Dovala, Cameroon","DRS"=>"Dresden, Germany","DXB"=>"Dubai, United Arab Emirates","DBO"=>"Dubbo, Australia","DUB"=>"Dublin, Ireland","DBV"=>"Dubrovnik, Croatia","DGT"=>"Dumaguete, Philippines","DUM"=>"Dumai, Indonesia","DND"=>"Dundee, United Kingdom","DUD"=>"Dunedin, New Zealand","DNH"=>"Dunhuang, China","DKI"=>"Dunk Island, Australia","DGO"=>"Durango, Mexico","DUR"=>"Durban, South Africa","DYU"=>"Dushanbe, Tajikistan","DUS"=>"Dusseldorf, Germany - International","MGL"=>"Dusseldorf, Germany - Moenchen-Gl.","QDU"=>"Dusseldorf, Germany - Rail service","DZA"=>"Dzaoudzi, Mayotte","ELS"=>"East London, South Africa","EBO"=>"Ebon, Marshall Islands","EOI"=>"Eday, United Kingdom","EDI"=>"Edinburgh, United Kingdom","EDO"=>"Edremit, Turkey","EDR"=>"Edward River, Australia","EGS"=>"Egilsstadir, Iceland","EIN"=>"Eindhoven, Netherlands","EIB"=>"Eisenach, Germany","SVX"=>"Ekaterinburg, Russia","EHL"=>"El Bolsan, Argentina","ELF"=>"El Fasher, Sudan","EMX"=>"El Maiten, Argentina","EBD"=>"El Obeid, Sudan","ELU"=>"El Oved, Algeria","EPS"=>"El Portillo/Samana, Dominician Republic - El Portillo","ELE"=>"El Real, Panama","ESR"=>"El Salvador, Chile","VIG"=>"El Vigia, Venezuela","EYP"=>"El Yopal, Colombia","ETH"=>"Elat, Italy","EZS"=>"Elazig, Turkey","EBA"=>"Elba Island, Italy","ELC"=>"Elcho Island, Australia","EDL"=>"Eldoret, Kenya","ELH"=>"Eleuthera Island, Bahamas","ESL"=>"Elista, Russia","EAE"=>"Emae, Vanuata","EMS"=>"Embessa, Papua New Guinea","EMD"=>"Emerald, Australia","EMO"=>"Emo, Papua New Guinea","EWI"=>"Enarotali, Indonesia","ENE"=>"Ende, Indonesia","ENT"=>"Enewetak Island, Marshall Islands","ENF"=>"Enontekio, Finland","ENH"=>"Enshi, China","EBB"=>"Entebbe, Uganda","ENU"=>"Enugu, Nigeria","EPL"=>"Epinal, France","ECN"=>"Ercan, Cyprus","ERF"=>"Erfurt, Germany","ERC"=>"Erzincan, Turkey","ERZ"=>"Erzurum, Turkey","EBJ"=>"Esbjerg, Denmark - Esbjerg Airport","ZBB"=>"Esbjerg, Denmark - Rail service","ESM"=>"Esmeraldas, Ecuador","EPR"=>"Esperance, Australia","SON"=>"Espiritu Santo, Vanuatu","EQS"=>"Esquel, Argentina","EXT"=>"Eveter, United Kingdom","EWE"=>"Ewer, Indonesia","EXM"=>"Exmouth Gulf, Australia","VDB"=>"Fagernes, Norway","FIE"=>"Fair Isle, United Kingdom","LYP"=>"Faisalabad, Pakistan","FAJ"=>"Fajard, Puerto Rico","FKQ"=>"Fak Fak, Indonesia","FAV"=>"Fakarava, French Polynesia","RVA"=>"Farafangana, Madagascar","FAO"=>"Faro, Portugal","FAE"=>"Faroe Islands, Faroe Islands","FRE"=>"Fera Island, Solomon Islands","FEG"=>"Fergana, Uzbekistan","FEN"=>"Fernando De Noronha, Brazil","FEZ"=>"Fez, Morocco","WFI"=>"Fianarantsoa, Madagascar","FSC"=>"Figari, France","FZO"=>"Filton, United Kingdom","XFW"=>"Finkenwerder, Germany","FIZ"=>"Fitzroy Crossing, Australia","FLF"=>"Flensburg, Germany","PSA"=>"Florence, Italy - Gal Galilei","FLR"=>"Florence, Italy - Peretola","FLA"=>"Florencia, Colombia","FLW"=>"Flores Island, Portugal","FRS"=>"Flores, Guatemala","FLN"=>"Florianopolis, Brazil","FRO"=>"Floro, Norway","FOG"=>"Foggia, Italy","FDE"=>"Forde, Norway","FMA"=>"Formosa, Argentina","FTU"=>"Fort Dauphin, Madagascar","FDF"=>"Fort De France, Martinique","FOR"=>"Fortaleza, Brazil","FRC"=>"Franca, Brazil","MVB"=>"Franceville, Gabon","FRW"=>"Francistown, Botswana","HHN"=>"Frankfurt, Germany - Hahn","FRA"=>"Frankfurt, Germany - International","ZBJ"=>"Fredericia, Denmark","FPO"=>"Freeport, Bahamas","FNA"=>"Freetown, Sierra Leone - Lungi Intl","FDH"=>"Friedrichshafer, Germany","FUE"=>"Fuerteventura, Spain","FUK"=>"Fukuoka, Japan","FUJ"=>"Fukue, Japan","FKS"=>"Fukushima, Japan","FUN"=>"Funafuti Atol, Tuvalu","FNC"=>"Funchal, Portugal","FTA"=>"Futuna Island, Vanuatu","FUT"=>"Futuna Island, Wallis and Futuna Islands","FUG"=>"Fuyang, China","FOC"=>"Fuzhou, China","GBE"=>"Gaborone, Botswana","GAF"=>"Gafsa, Tunisia","GGN"=>"Gagnoa, Cote D'Ivoire","GPS"=>"Galapagos, Ecuador","GEV"=>"Gallivare, Sweden","GWY"=>"Galway, Ireland","GAX"=>"Gamba, Gabon","GMB"=>"Gambela, Ethiopia","GAN"=>"Gan Island, Maldives","KAG"=>"Gangneung, South Korea","GHE"=>"Garachine, Panama","GAR"=>"Garaina, Papua New Guinea","GRL"=>"Garasa, Papua New Guinea","GPN"=>"Garden Point, Australia","GOV"=>"Garoua, Cameroon","ELQ"=>"Gassim, Saudi Arabia","ZGU"=>"Gaua, Vanuatu","GAU"=>"Gawahati, India","GZA"=>"Gaza City, Occupied Palestinian Territory","GZT"=>"Gaziatep, Turkey","GDN"=>"Gdansk, Poland","GEB"=>"Gebe, Indonesia","GDZ"=>"Gelendzik, Russia","EGN"=>"Geneina, Sudan","GES"=>"General Santos, Philippines","GVA"=>"Geneva, Switzerland","GOA"=>"Genoa, Italy","GGT"=>"George Town, Bahamas","GRJ"=>"George, South Africa","GEO"=>"Georgetown, Guyana","GET"=>"Geraldton, Australia,","GRO"=>"Gerona, Spain","LTD"=>"Ghadames, Libya","GHA"=>"Ghardala, Algeria","GHT"=>"Ghat, Libya","GIB"=>"Gibraltar, Gibraltar","GIL"=>"Gilgit, Pakistan","GIS"=>"Gisborne, New Zealand","GIZ"=>"Gizan, Saudi Arabia","GZO"=>"Gizo, Solomon Islands","GLT"=>"Gladstone, Australia","GLA"=>"Glasgow, United Kingdom - Glasgow International","PIK"=>"Glasgow, United Kingdom - Prestwick","GLI"=>"Glen Innes, Australia","GOI"=>"Goa, India","GOB"=>"Goba, Ethiopia","GGS"=>"Gobernador Gregores, Argentina","GDE"=>"Gode/Iddidole, Ethopia","GYN"=>"Goiania, Brazil","OOL"=>"Gold Coast, QL, Australia","GLF"=>"Golfito, Costa Rica","GOQ"=>"Golmud, China","GOE"=>"Gonalia, Papua New Guinea","GDQ"=>"Gondari, Ethiopia","GOR"=>"Gore, Ethiopia","GKA"=>"Goroka, Papua New Guinea","GTO"=>"Gorontalo, Indonesia","GOT"=>"Gothenburg, Sweden - Landvetter","GSE"=>"Gothenburg, Sweden - Saeve","GBL"=>"Goulburn Island, Australia","GUD"=>"Goundam, Mali","GOV"=>"Gove, Australia","GHB"=>"Governors Harbour, Bahamas","GVR"=>"Governador Valadares, Brazil","OYA"=>"Goya, CR, Argentina","GZM"=>"Gozo, Malta","GRW"=>"Graciosa Island, Portugal","GFN"=>"Grafton, Australia","GRX"=>"Granada, Spain","GCM"=>"Grand Cayman, Cayman Islands","GDT"=>"Grand Turk Island, Turks and Caicos Islands","GRZ"=>"Graz, Austria","GND"=>"Grenada, Grenada,","GNB"=>"Grenoble, France","GFF"=>"Griffith, Australia","GRY"=>"Grimsey, Iceland","JGR"=>"Groennedal, Greenland","GRQ"=>"Groningen, Netherlands","GTE"=>"Groofe Eylandt, Australia","GDL"=>"Guadalajara, Mexico","GUM"=>"Guam","GJA"=>"Guanaja, Honduras","BJX"=>"Guanajuato, Mexico","CAN"=>"Guangzhou, China","GAO"=>"Guantanamo, Cuba","GUA"=>"Guatemala City, Guatemala","GYE"=>"Guayaquil, Ecuador","GYA"=>"Guayaramerin, Bolivia","GYM"=>"Guaymas, Mexico","GCI"=>"Guernsey, United Kingdom","GUB"=>"Guerrero Negro, Mexico","KWL"=>"Guilin, China","GUI"=>"Guiria, Venezuela","ULU"=>"Gulu, Uganda","KWE"=>"Gulyang, China","KUV"=>"Gunsan, South Korea","URY"=>"Gurayat, Saudi Arabia","GWD"=>"Gwadar, Pakistan","KWJ"=>"Gwangju, South Korea","GWL"=>"Gwalior, India","KVD"=>"Gyandzha, Azerbaijan","LWN"=>"Gyourmri, Armenia","HPA"=>"HaApa, Tonga","HAC"=>"Hachijo Jima, Japan","HFS"=>"Hagfors, Sweden","HFA"=>"Haifa, Israel","HAK"=>"Haikou, China","HAS"=>"Hail, Saudi Arabia","HLD"=>"Hailar, China","HPH"=>"Haiphong, Viet Nam - Catbi","HKD"=>"Hakodate, Japan","ZHQ"=>"Halberstadt, Germany","HCQ"=>"Halls Creek, Australia","HAD"=>"Halmstad, Sweden","HAM"=>"Hamburg, Germany - Fuhisbuettel","LBC"=>"Hamburg, Germany - Luebeck","HTI"=>"Hamilton Island, Australia","BDA"=>"Hamilton, Bermuda","HLZ"=>"Hamilton, New Zealand","HFT"=>"Hammerfest, Norway","HGH"=>"Hangzhou, China","HAQ"=>"Hanimaadhoo, Maldives","HAN"=>"Hanoi, Viet Nam - Noibai","HAJ"=>"Hanover, Germany","HZG"=>"Hanzhang, China","HRE"=>"Harare, Zimbabwe","HRB"=>"Harbin, China","HGA"=>"Hargeisa, Somolia","EVE"=>"Harstad-Narvik, Norway","HME"=>"Hassi Messaoud, Algeria","HAA"=>"Hasvik, Norway","HDY"=>"Hat Yai, Thailand","HTR"=>"Hateruma, Japan","HAU"=>"Haugesund, Norway","HAV"=>"Havana, Cuba","HIS"=>"Hayman Island, Australia","HFE"=>"Hefei, China","HDB"=>"Heidelberg, Germany","HGL"=>"Helgoland, Germany","HEL"=>"Helsinki, Finland","HEH"=>"Heno, Myanmar","HER"=>"Heraklian, Greece","HDF"=>"Heringsdorf, Germany","HMV"=>"Hermavan, Sweden","HMO"=>"Hermosillo, Mexico","XAK"=>"Herning, Denmark","HVB"=>"Hervey Bay, Australia","HIJ"=>"Hiroshima, Japan - International","HIW"=>"Hiroshima, Japan - Hiroshima West","HIT"=>"Hivaro, Papua New Guinea","SGN"=>"Ho Chi Minh City, Viet Nam","HBA"=>"Hobart, Australia","HOD"=>"Hodeidah, Yemen","HDS"=>"Hoedspruit, South Africa","HOQ"=>"Hof, Germany","HOF"=>"Hofuf, Saudi Arabia","HET"=>"Hohhot, China","HKK"=>"Hokitika, New Zealand","HOG"=>"Holguin, Cuba","HKG"=>"Hong Kong, Hong Kong","HIR"=>"Honiara, Solomon Islands","HVG"=>"Honningsvag, Norway","HOK"=>"Hooker, Australia","HID"=>"Horn Island Australia","HFN"=>"Hornafjordur, Iceland","HOR"=>"Horta, Portugal","HKN"=>"Hoskins, Papua New Guinea","HTN"=>"Hotan, China","HOE"=>"Houeisay, Laos","HUQ"=>"Houn, Libya","HUH"=>"Huahine, French Polynesia","HUN"=>"Hualien, Taiwan - Phi Bai","HHQ"=>"Hualtin, Thailand","HUU"=>"Huanuco, French Polynesia","HYN"=>"Huargyan, China","HUX"=>"Huatulco, Mexico","HUV"=>"Hudiksvall, Sweden","HUI"=>"Hue, Viet Nam","HGD"=>"Hughenden, Australia","HLF"=>"Hultsfred, Sweden","HUY"=>"Humberside, United Kingdom","HRG"=>"Hurghada, Egypt","HWN"=>"Hwange Nat Park, Zimbabwe","HYD"=>"Hyderabad, India","IAS"=>"Iasi, Romania","IBE"=>"Ibague, Colombia","IBZ"=>"Ibiza, Spain","IAA"=>"Igarka, Russia","IGU"=>"Iguassu Falls, PR, Brazil","IGR"=>"Iguazu, Argentina","IHU"=>"Ihu, Papua New Guinea","ILP"=>"Ile Des Pins, New Caledonia","IOS"=>"Ilheus, Brazil","ILA"=>"Illaga, Indonesia","ILO"=>"Iloilo, Philippines - Mandurriao","IUL"=>"Ilu, Indonesia","JAV"=>"Ilulissat, Greenland","IMP"=>"Imperatriz, Brazil","IMF"=>"Imphal, India","IAM"=>"In Amenas, Algeria","IGA"=>"Inagua, Bahamas","INX"=>"Inanwatan, Indonesia","IDN"=>"Indagen, Papua New Guinea","IDR"=>"Indore, India","INN"=>"Innsbruck, Austria","INA"=>"Inta, Russia","IVC"=>"Invercargill, New Zealand","IVR"=>"Inverell, Australia","INV"=>"Inverness, United Kingdom","IOA"=>"Ioannina, Greece","IOP"=>"Ioma, Papua New Guinea","IPN"=>"Ipatinga, Brazil","IPI"=>"Ipiales, Colombia","IPE"=>"Ipil, Philippines","IPH"=>"Ipoh, Malaysia","IPA"=>"Ipota, Vanuatu","IQQ"=>"Iquique, Chile","IQT"=>"Iquitos, Peru","IKT"=>"Irkutsk, Russia","IFJ"=>"Isafjordur, Iceland","IFN"=>"Isfahan, Iran","ISG"=>"Ishigakij, Japan","ISB"=>"Islamabad, Pakistan","YIV"=>"Island Lake/Garden Hill, Canada","ILY"=>"Islay, United Kingdom","IOM"=>"Isle of Man, United Kingdom","ISC"=>"Isles of Scilly, United Kingdom - St Marys","TSO"=>"Isles of Scilly, United Kingdom - Tresco","IST"=>"Istanbul, Turkey","ITB"=>"Itaituba, Brazil","ITK"=>"Itokama, Papua New Guinea","IVL"=>"Ivalo, Finland","IFO"=>"Ivano-Frankovsk, Ukraine","IWJ"=>"Iwami, Japan","ZIH"=>"Ixtapa, Mexico","IZT"=>"Ixtepec, Mexico","ADB"=>"Izmir, Turkey","IZO"=>"Izumo, Japan","JAT"=>"Jabor, Marshall Islands","JCR"=>"Jacareacanga, Brazil","JAG"=>"Jacobabad, Pakistan","JAQ"=>"Jacquinot Bay, Papua New Guinea","JAI"=>"Jaipur, India","CGK"=>"Jakarta, Indonesia","JAL"=>"Jalapa, Mexico","UIT"=>"Jaluit Island, Marshall Islands","DJB"=>"Jambi. Indonesia","JGA"=>"Jamnagar, India","JKR"=>"Janakpur, Nepal","JQE"=>"Jaque, Panama","DJJ"=>"Jayapura, Indonesia","JED"=>"Jeddah, Saudi Arabia","JEJ"=>"Jeh, Marshall Islands","CJU"=>"Jeju, South Korea - Jeju Airport, metro area","XRY"=>"Jerez De La Frontere, Spain","JER"=>"Jersey, United Kingdom","JSR"=>"Jessore, Bangladesh","JMU"=>"Jiamusi, China","JGN"=>"Jiayuguan, China","GJL"=>"Jijel, Algeria","JIJ"=>"Jijiga, Ethiopia","JIM"=>"Jimma, Ethiopia","TNA"=>"Jinan, China","JDZ"=>"Jingdezhen, China","JHG"=>"Jinghong, China","JIN"=>"Jinja, Uganda","JJN"=>"Jinjiang, China","HIN"=>"Jinju, South Korea - Sancheon","BCO"=>"Jinka, Ethiopia","JNZ"=>"Jinzhou, China","JPR"=>"Ji-Parana, Brazil","JIW"=>"Jiwani, Pakistan","JPA"=>"Joao Pessoa, Brazil","JDH"=>"Jodhpur, India","JOE"=>"Joensuu, Finland","JNB"=>"Johannesburg, South Africa","JON"=>"Johnston Island, US Minor Outlying Islands","JHB"=>"Johor, Malaysia","JOI"=>"Joinville, Brazil","IXJ"=>"Jommu, India","JMO"=>"Jomsom, Nepal","JKG"=>"Jonkoping, Sweden","JRH"=>"Jorhat, India","JSM"=>"Jose De San Martin, Argentina","AJF"=>"Jouf, Saudi Arabia","JDO"=>"Juazeiro Do Norte, Brazil","JUI"=>"Juist, Germany","JDF"=>"Juiz De Fora, Brazil","JUJ"=>"Jujuy, Argentina","JCK"=>"Julia Creek, Australia","JUL"=>"Juliaca, Peru","JUZ"=>"Juzha, China","JYV"=>"Jyvaskyla, Finland","KDM"=>"Kaadedhdhoo, Maldives","KBT"=>"Kaben, Marshall Islands","ABK"=>"Kabri Dar, Ethiopia","KBL"=>"Kabul, Afghanistan","KBM"=>"Kabwun, Papua New Guinea","KCF"=>"Kadanwari, Pakistan","KDO"=>"Kadhonoo, Maldives","KZF"=>"Kaintiba, Papua New Guinea","KAT"=>"Kaitaia, New Zealand","KAJ"=>"Kajaani, Finland","KAX"=>"Kalbarri, Australia","KGD"=>"Kaliningrad, Russia","KBX"=>"Kambuaya, Indonesia","KAC"=>"Kameshli, Syrian Arab Republic","KCD"=>"Kamur, Indonesia","KUY"=>"Kamusi, Papua New Guinea","KAN"=>"Kano, Nigeria","KHI"=>"Karachi, Pakistan - Quaid-E-Azam International","KDL"=>"Kardia, Estonia","KAB"=>"Kariba, Zimbabwe","FKB"=>"Karlsruhe/Badern Baden, Germany","AOK"=>"Karpathos, Greece","KBF"=>"Karubaga, Indonesia","ZKB"=>"Kasaba Bay, Zambia","KAA"=>"Kasama, Zambia","BBK"=>"Kasane, Botswana","KTR"=>"Katherine, NT, Australia","KTM"=>"Kathmandu, Nepal","KTW"=>"Katowice, Poland","KUN"=>"Kaunas, Lithuania","KVA"=>"Kavala, Greece","KVG"=>"Kavieng, Papua New Guinea","KAW"=>"Kawthaung, Myanmar","ASR"=>"Kayseri, Turkey","KZN"=>"Kazan,, Russia","EFL"=>"Kefallinia, Greece","KDI"=>"Kendari, Indonesia","CFU"=>"Kerkyra, Greece","HJR"=>"Khajuraho, India","UVL"=>"Kharga, Egypt","HRK"=>"Kharkov, Ukraine","LBD"=>"Khudzhand, Tajikistan","KDD"=>"Khuzdar, Pakistan","IEV"=>"Kiev, Ukraine - Zhulhany","KBP"=>"Kiev, Ukraine - Borispol","KGL"=>"Kigali, Rwanda","TKQ"=>"Kigoma, Tanzania","JRO"=>"Kilimanjaro, Tanzania","YLC"=>"Kimmirut/Lake Harbour, Canada","KIN"=>"Kingston, Jamaica - Norman Manley","KTP"=>"Kingston, Jamaica - Tinson","FIH"=>"Kinshasa, Congo","IRA"=>"Kirakira, Solomon Islands","KTD"=>"Kitadaito, Japan","KTT"=>"Kittila, Finland","UNG"=>"Kiunga, Papua New Guinea","KWY"=>"Kiwayu, Kenya","NOC"=>"Knock, Ireland","KCZ"=>"Kochi, Japan","USM"=>"Koh Samui, Thailand","CCU"=>"Kolkata, India","QJY"=>"Kolobrzeg, Poland","KXK"=>"Komsomolsk Na Amure, Russia","KYA"=>"Konya, Turkey","ROR"=>"Koror, Palau","OSZ"=>"Koszalin, Poland","KBR"=>"Kota Bharu, Malaysia","BKI"=>"Kota Kinabalu, Malaysia","KWM"=>"Kowanyama, QL, Australia","CCJ"=>"Kozhikode, India","KBV"=>"Krabi, Thailand","KRK"=>"Krakow, Poland","KWG"=>"Krivoy Rog, Ukraine","KUL"=>"Kuala Lumpur, Malaysia","TGG"=>"Kuala Terengganu, Malaysia","KUA"=>"Kuantan, Malaysia","KUG"=>"Kubin Island, QL, Australia","KCH"=>"Kuching, Malaysia","KCM"=>"Kahramanmaras, Turkey","KUD"=>"Kudat, Malaysia","AKF"=>"Kufrah, Libya","KUS"=>"Kulusuk, Greenland","UEO"=>"Kumejima, Japan","CMU"=>"Kundiawa, Papau New Guinea","KUO"=>"Kuopio, Finland","KUQ"=>"Kuri, Papua New Guinea","KUH"=>"Kushiro, Japan","KUT"=>"Kutaisi, Georgia","KAO"=>"Kuusamo, Finland","KWI"=>"Kuwait, Kuwait","KWA"=>"Kwajalein, Marshall Islands","KYZ"=>"Kyzyl, Russia","LCE"=>"La Ceiba, Honduras","LCG"=>"La Coruna, Spain","PLP"=>"La Palma, Panama","LPB"=>"La Paz, Bolivia","LAP"=>"La Paz, Mexico","IRJ"=>"La Rioja, Argentina","LRM"=>"La Romana, Dominican Republic","LSC"=>"La Serena, Chile","EUN"=>"Laayoune, Morocco","LBS"=>"Labasa, Fiji","LAB"=>"Lablab, Papua New Guinea","LBJ"=>"Labuan Bajo, Indonesia","LBU"=>"Labuan, Malaysia","LML"=>"Lae Island, Marshall Islands","LAE"=>"Lae, Papua New Guinea","LAJ"=>"Lages, SC, Brazil","LGQ"=>"Lago Agrio, Ecuador","ING"=>"Lago Argentina, Argentina","LOS"=>"Lagos, Nigeria","LDU"=>"Lahadbatu, Malaysia","LHE"=>"Lahore, Pakistan","LKB"=>"Lakeba, Fiji","LKL"=>"Lakselv, Norway","LLI"=>"Lalibela, Ethiopia","LPM"=>"Lamap, Vanuatu","LNB"=>"Lamen Bay, Vanuatu","SUF"=>"Lamezia-Terme, Italy","LPI"=>"Lampang, Thailand","LMP"=>"Lampedusa, Italy","LAU"=>"Lamu, Kenya","LEQ"=>"Lands End, United Kingdom","LUV"=>"Langguri, Indonesia","LGK"=>"Langkawi, Malaysia","LAI"=>"Lannion, France","ACE"=>"Lanzarote, Spain","LHW"=>"Lanzhau, Guinea","ZGC"=>"Lanzhou, China","LAO"=>"Laoag, Philippines","LPP"=>"Lappeenranta, Finland","LKA"=>"Larantuka, Indonesia","LCA"=>"Larnaca, Cyprus","LRH"=>"Larochelle, France","LPA"=>"Las Palmas, Spain","LSP"=>"Las Piedras, Venezuela","LTK"=>"Latakia, Syria","LUC"=>"Laucala Island, Fiji","LST"=>"Launceston, TS, Australia","LAD"=>"Luanda, Angola","LVO"=>"Laverton, WA, Australia","LWY"=>"Lawas, Malaysia","LEH"=>"Le Havre, France","ZLN"=>"Le Mans, France","LPY"=>"Le Puy, France","LTQ"=>"Le Touquet, France","LEA"=>"Learmonth, WA, Australia","LBA"=>"Leeds, United Kingdom","LGP"=>"Legaspi, Philippines","IXL"=>"Leh, India","LER"=>"Leinster, WA, Australia","LEJ"=>"Leipzig, Germany","LKN"=>"Leknes, Norway","LXS"=>"Lemnos, Greece","BJX"=>"Leon, Mexico","LNO"=>"Leonora, WA, Australia","LET"=>"Leticia, Colombia","LXA"=>"Lhasa, China","LYG"=>"Lianyungang, China","LIR"=>"Liberia, Costa Rica","LBV"=>"Libreville, Gabon","VXC"=>"Lichinga, Mozambique","LGG"=>"Liege, Belgium","LIF"=>"Lifa, New Caledonia","LHG"=>"Lightning Ridge, NS, Australia","LNV"=>"Lihir Island, Papua New Guinea","LJG"=>"Lijiang City, China","LIK"=>"Likiep Island, Marshall Islands","LIL"=>"Lille, France - Lesquin","XDB"=>"Lille, France - Rail service","LLW"=>"Lilongwe, Malawi","LIM"=>"Lima, Peru","LMN"=>"Limbang, Malaysia","LIG"=>"Limoges, France","LDC"=>"Lindeman Island, QL, Australia","LDI"=>"Lindi, Tanzania","LPI"=>"Linkoping, Sweden","LYI"=>"Linyi, China","LNZ"=>"Linz, Austria","LIS"=>"Lisbon, Portugal","LSY"=>"Lismore, NS, Australia","LZH"=>"Liuzhou, China","LPL"=>"Liverpool, United Kingdom","LVI"=>"Livingstone, Zambia","LZR"=>"Lizard Island, QL, Australia","LJU"=>"Ljubliana, Slovenia","IRG"=>"Lockhart River, Australia","LOF"=>"Loen, Marshall Islands","LOH"=>"Loja, Ecuador","LFW"=>"Lome, Togo","LON"=>"London, United Kingdom - All airports","BQH"=>"London, United Kingdom - Biggin Hill","LGW"=>"London, United Kingdom - Gatwick","LHR"=>"London, United Kingdom - Heathrow","LCY"=>"London, United Kingdom - London City","LTN"=>"London, United Kingdom - Luton","STN"=>"London, United Kingdom - Stansted","LDY"=>"Londonderry, United Kingdom","QQP"=>"London-Paddington, United Kingdom - Rail service","LDB"=>"Londrina, PR, Brazil","LPU"=>"Long Apung, Indonesia","LBP"=>"Long Banga, Malaysia","LBW"=>"Long Bawan, Indonesia","HAP"=>"Long Island, Australia","LGI"=>"Long Island/Deadmans Cay, Bahamas","LGL"=>"Long Lellang, Malaysia","ODN"=>"Long Seridan, Malaysia","LOD"=>"Longana, Vanuatu","LRE"=>"Longreach, QL, Australia","LYR"=>"Longyearbyen, Svalbard & Jan Mayen Island","LNE"=>"Lonorore, Vanuatu","LDH"=>"Lord Howe Island, NS, Australia","LTO"=>"Loreto, Mexico","LRT"=>"Lorient, France","SJD"=>"Los Cabos, Mexico","LMM"=>"Los Mochis, Mexico","LSA"=>"Losuia, Papua New Guinea","LDE"=>"Lourdes/Tarbes, France","LZC"=>"Lozaro Cardenas, Mexico","LAD"=>"Luanda, Angola","LXG"=>"Luang Namtha, Laos","LPQ"=>"Luang Prabang, Laos","LKO"=>"Lucknow, India","LUD"=>"Luderitz, Namibia","LUG"=>"Lugano, Switzerland","VSG"=>"Lugansk, Uganda","LUA"=>"Lukla, Nepal","LLA"=>"Lulea, Sweden","FBM"=>"Lumbashi, Congo","LYA"=>"Luoyang, China","LUN"=>"Lusaka, Zambia","LUW"=>"Luwuk, Indonesia","LUX"=>"Luxembourg, Luxembourg","LUM"=>"Luxi, China","LXR"=>"Luxor, Egypt","LZO"=>"Luzhou, China","LWO"=>"Lvov, Ukraine","LYC"=>"Lyoksele, Sweden","LYS"=>"Lyon, France - Satolas","XYD"=>"Lyon, France - Lyon Part-Dieu Rail service","MST"=>"Maastricht, Netherlands","UBB"=>"Mabuiag Island, QL, Australia","MCP"=>"Macapa, AP, Brazil","XMS"=>"Macas, Ecuador","MFM"=>"Macau, China","MCZ"=>"Maceio, AL, Brazil","MCH"=>"Machala, Ecuador","MKY"=>"Mackay, QL, Australia","MAG"=>"Madang, Papua New Guinea","MED"=>"Madinah, Saudi Arabia","MAD"=>"Madrid, Spain","IXM"=>"Madurai, India","HGN"=>"Mae Hong Son, Thailand","MAQ"=>"Mae Sot, Thailand","MWF"=>"Maewo, Vanuatu","MFA"=>"Mafia, Tanzania","GDX"=>"Magadan, Russia","MQF"=>"Magnitogorsk, Russia","VVB"=>"Mahanoro, Madagascar","SEZ"=>"Mahe Island, Seychelles","MXT"=>"Maintirano, Madagascar","MMO"=>"Maio, Cape Verde","MJE"=>"Majkin, Marshall Islands","MJN"=>"Majunga, Madagascar","MAJ"=>"Majuro, Marshall Islands","MQX"=>"Makale, Ethiopia","MCX"=>"Makhachkala, Russia","MKU"=>"Makokou, Gabon","MZG"=>"Makung, Taiwan","SSG"=>"Malabo, Equatorial Guinea","MKZ"=>"Malacca, Malaysia","AGP"=>"Malaga, Spain","MAK"=>"Malakai, Sudan","LGS"=>"Malargue, MD, Argentina","MLX"=>"Malatya, Turkey","MLE"=>"Male, Maldives","MYD"=>"Malindi, Kenya","MMX"=>"Malmo, Sweden","MAV"=>"Maloelap Island, Marshall Islands","PTF"=>"Malololailai, Fiji","MLA"=>"Malta, Malta","WMP"=>"Mampikony, Madagascar","MNF"=>"Mana Island, Fiji","MDC"=>"Manado, Indonesia","MGA"=>"Managua, Nicaragua","WVK"=>"Manakara, Madagascar","WMR"=>"Mananara, Madagascar","NGX"=>"Manang, Nepal","MNJ"=>"Mananjary, Madagascar","MAO"=>"Manaus, AM, Brazil","MAN"=>"Manchester, United Kingdom","MDL"=>"Mandalay, Myanmar","WMA"=>"Mandritsara, Madagascar","MGS"=>"Mangaia Island, Cook Islands","IXE"=>"Mangalore, India","MAY"=>"Mangrove Cay, Bahamas","MNR"=>"Mangu, Zambia","MFO"=>"Manguna, Papua New Guinea","XMH"=>"Manihi, French Polynesia","MHX"=>"Manihiki Island, Cook Islands","MNL"=>"Manila, Philippines","MNG"=>"Maningrioa, NT, Australia","MZL"=>"Manizales, Colombia","MJA"=>"Manja, Madagascar","MHG"=>"Mannheim, Germany","MKW"=>"Manokwari, Indonesia","MSE"=>"Manston, United Kingdom","MEC"=>"Manta, Ecuador","MAS"=>"Manus Island, Papua New Guinea","MZO"=>"Manzanillo, Cuba","ZLO"=>"Manzanillo, Mexico","MTS"=>"Manzini, Swaziland","AMO"=>"Mao, Chad","MXS"=>"Maota Savaii Is, Western Samoa","MPM"=>"Maputo, Mozambique","MDQ"=>"Mar Del Plata, BA, Argentina","MRE"=>"Mara Lodges, Kenya","MAB"=>"Maraba, PA, Brazil","MAR"=>"Maracaibo, Venezuela","MYC"=>"Maracay, Venezuela","MEE"=>"Mare, New Caledonia","MGH"=>"Margate, South Africa","MBX"=>"Maribor, Slovenia","MHQ"=>"Mariehamn, Finland","JSU"=>"Mariitsoq, Greenland","MII"=>"Marilia, SP, Brazil","MGF"=>"Maringa, PR, Brazil","MPW"=>"Mariupol, Ukraine","WMN"=>"Maroantsetra, Madagascar","MVR"=>"Marova, Cameroon","MRS"=>"Marseille, France","MHH"=>"Marsh Harbour, Bahamas","MUR"=>"Marudi, Malaysia","MBH"=>"Maryborough, QL, Australia","MBT"=>"Masbate, Philippines","MSU"=>"Maseru, Lesotho","MHD"=>"Mashad, Iran","MAM"=>"Matamoros, Mexico","AMI"=>"Mataram, Indonesia","MMJ"=>"Matsumoto, Japan","MYJ"=>"Matsuyama, Japan","MUN"=>"Maturin, Venezuela","MUK"=>"Mauke Island, Cook Islands","MNU"=>"Maulmyine, Myanmar","MOF"=>"Maumere, Indonesia","MUB"=>"Maun, Botswana","MAU"=>"Maupiti, French Polynesia","MRU"=>"Mauritius, Mauritius","MYG"=>"Mayaguana, Bahamas","MAZ"=>"Mayaguez, Puerto Rico","MZT"=>"Mazatlan, Mexico","MDK"=>"Mbandaka, Congo","MJM"=>"Mbuji Mayi, Congo","MCV"=>"Mcarthur River, NT, Australia","MES"=>"Medan, Indonesia","EOH"=>"Medellin, Colombia - Enrique Olaya Herrera","MDE"=>"Medellin, Colombia - Jose Marie Cordova","MKR"=>"Meekatharra, WA, Australia","MEH"=>"Mehamn, Norway","MXZ"=>"Meixian, China","MJB"=>"Mejit Island, Marshall Islands","MKS"=>"Mekane Selam, Ethiopia","MEL"=>"Melbourne, Victoria, Australia","MLN"=>"Melilla, Spain","MMB"=>"Memanbetsu, Japan","NDM"=>"Mendi, Ethiopia","MDU"=>"Mendi, Papua New Guinea","MDZ"=>"Mendoza, MD, Argentina","MAH"=>"Menorca, Spain","MYX"=>"Menyamya, Papua New Guinea","MKQ"=>"Merauke, Indonesia","MWE"=>"Merave, Sudan","RDE"=>"Merdey, Indonesia","MID"=>"Merida, Mexico","MRD"=>"Merida, Venezuela","MIM"=>"Merimbula, NS, Australia","MUH"=>"Mersa Matruh, Egypt","ETZ"=>"Metz/Nancy, France","MXL"=>"Mexicali, Mexico","MEX"=>"Mexico City, Mexico","MFU"=>"Mfume, Zambia","ZVA"=>"Miandrivazo, Madagascar","MDS"=>"Middle Caicos, Turks and Caicos","MDY"=>"Midway Island, US Minor Outlying Islands","MIK"=>"Mikkeli, Finland","JMK"=>"Mikonos, Greece","BGY"=>"Milan, Italy - Orio Al Serio","LIN"=>"Milan, Italy - Linate","MXP"=>"Milan, Italy - Malpensa","PMF"=>"Milan, Italy - Parma","MQL"=>"Mildura, VI, Australia","MIJ"=>"Mili Island, Marshall Islands","MGT"=>"Milingimbi, NT, Australia","MMD"=>"Minami Daito, Japan","MTT"=>"Minatitla, Mexico","MDP"=>"Mindiptana, Indonesia","MRV"=>"Mineralnye Vody, Russia","MHP"=>"Minsk, Belarus - Minsk International 1","MSQ"=>"Minsk, Belarus - Minsk International 2","MYY"=>"Miri, Malaysia","MJZ"=>"Mirnyj, Russia","MSJ"=>"Misawa, Japan","MIS"=>"Misima Island, Papua New Guinea","MRA"=>"Misurata, Libya","MOI"=>"Mitiaro Island, Cook Islands","MYE"=>"MiyakeJima, Japan","MMY"=>"Miyako Jima, Japan","MTF"=>"Mizan Teferi, Ethiopia","MQN"=>"Mo I Rana, Norway","MOA"=>"Moa, Cuba","MFJ"=>"Moala, Fiji","ONI"=>"Moanamani, Indonesia","MNB"=>"Moanda, Congo","MFF"=>"Moanda, Gabon","MGQ"=>"Mogadishu, Somalia","MJD"=>"Mohenjodaro, Denmark","MPK"=>"Mokpo, South Korea","OKU"=>"Mokuti Lodge, Namibia","MOL"=>"Molde, Norway","MBA"=>"Mombasa, Kenya","MIR"=>"Monastir, Tunisia","MBE"=>"Monbetsu, Japan","LOV"=>"Monclova, Mexico","MJK"=>"Monkey Mia, WA, Australia","MNY"=>"Mono, Solomon Islands","ROB"=>"Monrovia, Liberia","MCM"=>"Monte Carlo, Monaco","MEU"=>"Monte Dourado, PA, Brazil","MBJ"=>"Montego Bay, Jamaica","MTR"=>"Monteria, Colombia","MTY"=>"Monterrey, Mexico","MOC"=>"Montes Claros, MG, Brazil","MVD"=>"Montevideo, Uruguay","MPL"=>"Montpellier, France","MNI"=>"Montserrat, Montserrat","MOZ"=>"Moorea, French Polynesia","MZI"=>"Mopti, Mali","MXX"=>"Mora, Sweden","TVA"=>"Morafenobe, Madagascar","MXM"=>"Morambe, Madagascar","MOV"=>"Moranbah, QL, Australia","MRZ"=>"Moree, NS, Australia","MLM"=>"Morelia, Mexico","HNA"=>"Morioka, Japan","ONG"=>"Mornington, QL, Australia","MXH"=>"Moro, Papua New Guinea","MOQ"=>"Morondava, Madagascar","HAH"=>"Moroni, Comoros","MYA"=>"Moruya, NS, Australia","MOW"=>"Moscow, Russia - all locations","BKA"=>"Moscow, Russia - Bykovo","DME"=>"Moscow, Russia - Domodedovo","SVO"=>"Moscow, Russia - Sheremetyevo","VKO"=>"Moscow, Russia - Vnukovo","MJF"=>"Mosjoen, Norway","OMO"=>"Mostar, Bosnia and Herzegovina","MTV"=>"Mota Lava, Vanuatu","MJL"=>"Mouila, Gabon","MON"=>"Mount Cook, New Zealand","MGB"=>"Mount Gambier, SA, Australia","HGU"=>"Mount Hagen, Papua New Guinea","MHU"=>"Mount Hotham, VI, Australia","ISA"=>"Mount Isa, Australia","WME"=>"Mount Keith, WA, Australia","MMG"=>"Mount Magnet, WA, Australia","MPN"=>"Mount Pleasant, Falkland Islands","MPA"=>"Mpacha, Namibia","MYW"=>"Mtwara, Tanzania","MVS"=>"Mucuri, BA, Brazil","MDG"=>"Mudanjiang, China","DGE"=>"Mudgee, Australia","FMO"=>"Muenster, Germany","MKM"=>"Mukan, Malaysia","MLH"=>"Mulhouse, France","LII"=>"Mulia, Indonesia","MUX"=>"Multan, Pakistan","MZV"=>"Mulu, Malaysia","BOM"=>"Mumbai, India","MUA"=>"Munda, Solomon Islands","MUC"=>"Munich, Germany","MJV"=>"Murcia, Spain","MMK"=>"Murmansk, Russia","MYI"=>"Murray Island, QL, Australia","MSR"=>"Mus, Turkey","MCT"=>"Muscat, Oman","MUZ"=>"Musoma, Tanzania","MFG"=>"Muzaffarabad, Pakistan","MWZ"=>"Mwanza, Tanzania","MGZ"=>"Myeik, Myanmar","MYT"=>"Myitkyina, Myanmar","MJT"=>"Mytilene, Greece","ZZU"=>"Mzuzu, Malawi","NBX"=>"Nabire, Indonesia","MNC"=>"Nacala, Mozambique","NDR"=>"Nadar, Morocco","NAN"=>"Nadi, Fiji","NYM"=>"Nadym, Russia","WNP"=>"Naga, Philippines","NGS"=>"Nagasaki, Japan","NGO"=>"Nagoya, Japan","NAG"=>"Nagpur, India","NBO"=>"Nairobi, Kenya - Jomo Kenyatta Intl","WIL"=>"Nairobi, Kenya - Wilson","NAJ"=>"Nakhichevan, Azerbaijan","NAK"=>"Nakhon Ratchosima, Thailand","NST"=>"Nakhon Si Thammarat, Thailand","NAL"=>"Nalchik, Russia","NMA"=>"Namangan, Uzbekistan","ATN"=>"Namatana, Papua New Guinea","NDK"=>"Namorik Island, Marshall Islands","APL"=>"Nampula, Mozambique","OSY"=>"Namsos, Norway","NDI"=>"Namudi, Papua New Guinea","NNT"=>"Nan, Thailand","NAO"=>"Nanchong, China","NKG"=>"Nanking/Nanjing, China","NNG"=>"Nanning, China","JNN"=>"Nanortalik, Greenland","NTE"=>"Nantes, France - Nantes Atlantique","QJZ"=>"Nantes, France - Rail service","NTG"=>"Nantong, China","NNY"=>"Nanyang, China","NYK"=>"Nanyuki, Kenya","NPE"=>"Napier-Hastings, New Zealand","NAP"=>"Naples, Italy","NAW"=>"Narathiwat, Thailand","NAA"=>"Narrabri, NS, Australia","JNS"=>"Narsaq, Greenland","UAK"=>"Narsarsuaq, Greenland","NVK"=>"Narvik, Norway","NNM"=>"Naryan-Mar, Russia","NAS"=>"Nassau, Bahamas - International","PID"=>"Nassau, Bahamas - Paradise Island","MAT"=>"Natadi, Congo","NAT"=>"Natal, RN, Brazil","INU"=>"Nauru Island, Nauru","NVT"=>"Navegantes, SC, Brazil","WNS"=>"Nawabshah, Pakistan","NUX"=>"NayUrengoy, Russia","NLA"=>"Ndola, Zambia","CNP"=>"Neerlerit Inaat, Greenland","NFG"=>"Nefteyugansk, Russia","EGL"=>"Neghelli, Ethiopia","NEG"=>"Negril, Jamaica","NVA"=>"Neiva, Colombia","EAM"=>"Nejran, Saudi Arabia","NSN"=>"Nelso, New Zealand","NLP"=>"Nelspruit, South Africa","EMN"=>"Nema, Mauritania","NER"=>"Neryjungri, Russia","NQN"=>"Neuquen, NE, Argentina","NEV"=>"Nevis, St. Kitts and Nevis","GON"=>"New London/Groton","NPL"=>"New Plymouth, New Zealand","BEO"=>"Newcastle, New South Wales, Australia - Belmont","NTL"=>"Newcastle, New South Wales, Australia","NCL"=>"Newcastle, United Kingdom","ZNE"=>"Newman, WA, Australia","NQY"=>"Newquay, United Kingdom","NGE"=>"Ngaoundere, Cameroon","NGI"=>"Ngau Island, Fiji","RPM"=>"Ngukurr, NT, Australia","NHA"=>"Nha Trang, Viet Nam","NIM"=>"Niamey, Niger","NCE"=>"Nice, France","NIC"=>"Nicosia, Cyprus","FNI"=>"Nimes, France","NGB"=>"Ningbo, China","NIX"=>"Nioko, Congo","NFO"=>"Niuafo'ou, Tonga","NTT"=>"Niuatoputapu, Tonga","IUE"=>"Niue Island, Niue","NJC"=>"Nizhnevartovsk, Russia","GOJ"=>"Nizhniy Novgorod, Russia","NOJ"=>"Nojabrxsk, Russia","NDJ"=>"Ndjamena, Chad","NRD"=>"Norderney, Germany","NDZ"=>"Nordholz-Speika, Germany","NLK"=>"Norfolk Island, Norfolk Island","NSK"=>"Noril'sk, Russia","NTN"=>"Normanton, QL, Australia","NRK"=>"Norrkoping, Sweden","NUS"=>"Norsup, Vanuatu","NCA"=>"North Caicos, Turks and Caicos Islands","ELH"=>"North Eleuthera, Bahamas","NRL"=>"North Ronaldsay, United Kingdom","NWI"=>"Norwich, United Kingdom","NOB"=>"Nosara Beach, Costa Rica","NOS"=>"Nossi-be, Madagascar","EMA"=>"Nottingham, United Kingdom","NDB"=>"Nouadhiba, Mauritania","NKC"=>"Nouakchott, Mauritania","NOU"=>"Noumea, New Caledonia - Tontouta","GEA"=>"Noumea, New Caledonia - Magenta","NVR"=>"Novgorod, Russia","NOZ"=>"Novokuznetsk, Russia","OVB"=>"Novosibirsk, Russia - Tolmachevo","GER"=>"Nueva Gerona, Cuba","NLD"=>"Nuevo Laredo, Mexico","NHV"=>"Nuku Hiva, French Polynesia","TBU"=>"Nuku'Alofa, Tonga","NCU"=>"Nukus, Uzbekistan","NUB"=>"Numbulwar, NT, Australia","NNX"=>"Nunukan, Indonesia","ZAQ"=>"Nuremberg, Germany - Rail service","NUE"=>"Nuremberg, Germany","GOH"=>"Nuuk, Greenland","UYL"=>"Nyala, Sudan","NYU"=>"Nyaung, Myanmar","NYN"=>"Nyngan, NS, Australia","OAX"=>"Oaxaca, Mexico","OBD"=>"Obano, Indonesia","OBO"=>"Obihiro, Japan","OCJ"=>"Ocho Rios, Jamaica","ZBQ"=>"Odense, Denmark","ODS"=>"Odessa, Ukraine","OHD"=>"Ohrid, Macedonia","OIT"=>"Oita, Japan","OKQ"=>"Okaba, Indonedia","OKJ"=>"Okayama, Japan","OHO"=>"Okhotsk, Russia","OKA"=>"Okinawa, Japan","OIR"=>"Okoshiri, Japan","OKL"=>"Oksibil, Indonesia","OLB"=>"Olbia, Italy","OLJ"=>"Olpoi, Vanuatu","OLP"=>"Olympic Dam, SA, Australia","OMB"=>"Omboue, Gabon","OMS"=>"Omsk, Russia","OND"=>"Ondangwa, Namibia","OMR"=>"Oradea, Romania","ORN"=>"Oran, Algeria","OAG"=>"Orange, New South Wales, Australia","OMD"=>"Oranjemund, Namibia","ORB"=>"Orebro, Sweeden - Obrebro-Bofors","REN"=>"Orenburg, Russia","ORW"=>"Ormara, Pakistan","OER"=>"Ornskoldsvik, Sweden","OSW"=>"Orsk, Russia","HOV"=>"Orsta-Volda, Norway","OSA"=>"Osaka, Japan - all airports","ITM"=>"Osaka, Japan - Itami","KIX"=>"Osaka, Japan - Kansai Intl","OIM"=>"Oshima, Japan","OSI"=>"Osijek, Croatia","OSK"=>"Oskarshamn, Sweden","OSL"=>"Oslo, Norway","TRF"=>"Oslo, Norway - Sandefjord","OSD"=>"Ostersund, Sweden","OSR"=>"Ostrava, Czech Republic","OTU"=>"Otu, Colombia","OUA"=>"Ouagadougou, Burkina Faso","OGX"=>"Ouargla, Algeria","OZZ"=>"Ouarzazate, Morocco","ODY"=>"Oudomxay, Laos","OUD"=>"Oujda, Morocco","OUL"=>"Oulu, Finland","UVE"=>"Ouvea, New Caledonia","VDA"=>"Ovda, Israel","OYE"=>"Oyem, Gabon","PBJ"=>"Paama, Vanuatu","JFR"=>"Paamiut, Greenland","PDG"=>"Padang, Indonesia","PAD"=>"Paderborn, Germany","PPG"=>"Pago Pago, American Samoa","PKZ"=>"Pakse, Laos","PAF"=>"Pakuba, Uganda","PCH"=>"Palacios, Honduras","PKY"=>"Palang Karaya, Indonesia","PLQ"=>"Palanga, Lithuania","PLM"=>"Palembang, Indonesia","PQM"=>"Palenque, Mexico","PMO"=>"Palermo, Sicily, Italy","PMI"=>"Palma Mallorca, Spain and Canary Islands","PMZ"=>"Palmar, Costa Rica","PMW"=>"Palmas, TO, Brazil","PMR"=>"Palmerston North, New Zealand","PLW"=>"Palu, Indonesia","PNA"=>"Pamplona, Spain","PTY"=>"Panama City, Panama - Tocumen Intl","PAC"=>"Panama City, Panama - Paitilla","PKN"=>"Pangkalanboun, Indonesia","PGK"=>"Pangkalpinang, Indonesia","PJG"=>"Panjger, Pakistan","PNL"=>"Pantelleria, Italy","PPW"=>"Papa Westray, United Kingdom","PPT"=>"Papeete, French Polynesia","PFO"=>"Paphos, Cyprus","PAJ"=>"Para Chinar, Pakistan","PBO"=>"Paraburdoo, WA, Australia","PID"=>"Paradise Island, Bahamas","PBM"=>"Paramaribo, Suriname - Zanderij Intl","ORG"=>"Paramaribo, Suriname - Zorg En Hoop","PRA"=>"Parana, ER, Argentina","PRS"=>"Parasi, Solomon Islands","PAR"=>"Paris, France - All airports","CDG"=>"Paris, France - Charles Degaulle","ORY"=>"Paris, France - Orly","BVA"=>"Paris, France - Beauvais-Tille","PMF"=>"Parma/Milan, Italy","PHB"=>"Parnaiba, PI, Brazil","PBH"=>"Paro, Bhutan","PSI"=>"Pasni, Pakistan","AOL"=>"Paso de Los Libres, Argentina","PFB"=>"Passo Fundo, RS, Brazil","PSO"=>"Pasto, Colombia","PAT"=>"Patna, India","GPA"=>"Patras, Greece","PUF"=>"Pau, France","PWQ"=>"Pavlodar, Kazakhstan","PEX"=>"Pechora, Russia","PKU"=>"Pekanbaru, Indonesia","PET"=>"Pelotas, RS, Brazil","POL"=>"Pemba, Mozambique","PMA"=>"Pemba, Tanzania - Wawi","PEN"=>"Penang, Malaysia","PYE"=>"Penrhyn Island, Cook Islands","PZE"=>"Penzance, United Kingdom","PEI"=>"Pereira, Colombia","PGX"=>"Perigueux, France","PMQ"=>"Perito Moreno, SC, Argentina","PEE"=>"Perm, Russia","PGF"=>"Perpignan, France","PER"=>"Perth, Western Australia, Australia","PEG"=>"Perugia, Italy","PSR"=>"Pescara, Italy","PEW"=>"Peshawar, Pakistan","PNZ"=>"Petrolina, PE, Brazil","PKC"=>"Petropaulousk-Kamchats, Russia","PES"=>"Petrozavodsk, Russia","PHW"=>"Phalaborwa, South Africa","PHS"=>"Phitsanulok, Thailand","PNH"=>"Phnom Penh, Cambodia","PRH"=>"Phrae, Thailand","PQC"=>"Phu Quoc, Viet Nam - Duong Dang","HKT"=>"Phuket, Thailand","PIX"=>"Pico Island, Portugal","PDS"=>"Piedras Negras, Mexico","PZB"=>"Pietermaritzburg, South Africa","PTG"=>"Pietersburb, South Africa","PIF"=>"Pingtung, Taiwan","PSA"=>"Pisa, Italy - Gal Galilei","THU"=>"Pituffik, Greenland","PIU"=>"Piura, Peru","PLJ"=>"Placencia, Belize","PXU"=>"Pleiku, Viet Nam","PBZ"=>"Plettenburg Bay, South Africa","PLH"=>"Plymouth, United Kingdom","TGD"=>"Podgoriea, Serbia and Montenegro - Golubovci","PNI"=>"Pohnpei, Micronesia","PNR"=>"Pointe Noire, Congo","PTP"=>"Pointe-a-Pitre, Guadeloupe","PIS"=>"Poitiers, France - Biard","XOP"=>"Poitiers, France - Rail service","PKR"=>"Pokhara, Nepal","PLV"=>"Poltava, Ukraine","PYJ"=>"Polyarnyj, Russia","PSE"=>"Ponce, Puerto Rico","PDL"=>"Ponta Delgada, Portugal","PMG"=>"Ponta Pora, MS, Brazil","PNK"=>"Pontianak, Indonesia","PNP"=>"Popondetta, Papua New Guinea","TAT"=>"Popraol/Tatry, Slovakia","PBD"=>"Porbandar, India","POR"=>"Pori, Finland","PMV"=>"Porlamar, Venezuela","POT"=>"Port Antonio, Jamaica","PAP"=>"Port Au Prince, Haiti","PUG"=>"Port Augusta, SA, Australia","WPB"=>"Port Berge, Madagascar","IXZ"=>"Port Blair, India","PLZ"=>"Port Elizabeth, South Africa","POG"=>"Port Gentil, Gabon","PHC"=>"Port Harcourt, Nigeria","PHE"=>"Port Headland, WA, Australia","PLO"=>"Port Lincoln, SA, Australia","PQQ"=>"Port Macquarie, NS, Australia","POM"=>"Port Moresby, Papua New Guinea","POS"=>"Port of Spain, Trinidad","PSY"=>"Port Stanley, Falkland Islands","PZU"=>"Port Sudan, Sudan","VLI"=>"Port Vila, Vanuatu","PTJ"=>"Portland, VI, Australia","POA"=>"Porto Alegre, RS, Brazil","PXO"=>"Porto Santo, Portugal","BPS"=>"Porto Seguro, Brazil","PVH"=>"Porto Velho, RO, Brazil","OPO"=>"Porto, Portugal","PVO"=>"Portoviejo, Ecuador","PSS"=>"Posadas, MI, Argentina","PAZ"=>"Poza Rico, Mexico","POZ"=>"Poznan, Poland","PRG"=>"Prague, Czech Republic","RAI"=>"Praia, Cape Verde","PRQ"=>"Pres. Roque Saenz Pena, CH, Argentina","PPB"=>"Presidente Prudente, SP, Brazil","PVK"=>"Preveza/Lefkas, Greece","PRN"=>"Pristina, Serbia and Montenegro","PPP"=>"Proserpine, QL, Australia","PLS"=>"Providenciales, Turks and Caicos Islands","PCL"=>"Pucallpa, Peru","PBC"=>"Puebla, Mexico","PYH"=>"Puerto Ayacucha, Venezuela","PBE"=>"Puerto Berria, Colombia","FUE"=>"Puerto del Rosario, Spain","PUD"=>"Puerto Deseado, SC, Argentina","PXM"=>"Puerto Escondido, Mexico","PJM"=>"Puerto Jimenez, Costa Rica","PEU"=>"Puerto Lempira, Honduras","PMY"=>"Puerto Madryn, CB, Argentina","PEM"=>"Puerto Maldonado, Peru","PMC"=>"Puerto Montt, Chile","PZO"=>"Puerto Ordaz, Venezuela","POP"=>"Puerto Plata, Dominican Republic","PPS"=>"Puerto Princesa, Philippines","PSZ"=>"Puerto Suarez, Bolivia","PVR"=>"Puerto Vallarta, Mexico","PUY"=>"Pula, Croatia","PNQ"=>"Pune, India","PUQ"=>"Punta Arenas, Chile","PUJ"=>"Punta Cana, Dominican Republic","PDP"=>"Punta Del Este, Uruguay","PND"=>"Punta Gorda, Belize","PBP"=>"Punta Islita, Costa Rica","PUT"=>"Puttaparthi, India","PSU"=>"Putussibau, Indonesia","FNJ"=>"Pyongyang, North Korea","AQI"=>"Qaisumah, Saudi Arabia","JJU"=>"Qaqortoq, Greenland","IQM"=>"Qiemo, China","TAO"=>"Qingdao, China","NDG"=>"Qiqihar, China","ZQN"=>"Queenstown, New Zealand","UEL"=>"Quelimane, Mozambique","XQP"=>"Quepos, Costa Rica","QRO"=>"Queretaro, Mexico","UET"=>"Quetta, Pakistan","UIH"=>"Qui Nhon, Viet Nam","UIB"=>"Quibdo, Colombia","UIP"=>"Quimper, France","ULP"=>"Quipi, QL, Australia","UIO"=>"Quito, Ecuador","RBP"=>"Rabaraba, Papua New Guinea","RBA"=>"Rabat, Morocco","RAB"=>"Rabaul, Papua New Guinea","VKG"=>"Rach Gia, Viet Nam","RAT"=>"Raduzhnyi, Russia","RAH"=>"Rafha, Saudi Arabia","RJN"=>"Rafsanjan, Iran","RFP"=>"Raiatea, French Polynesia","RAJ"=>"Rajkot, India","RJH"=>"Rajshahi, Bangladesh","RBV"=>"Ramato, Solomon Islands","RAM"=>"Ramingining, NT, Australia","IXR"=>"Ranchi, India","UNN"=>"Ranong, Thailand","RAR"=>"Rarotonga, Cook Islands","RKT"=>"Ras Al Khaimah, United Arab Emirates","RAS"=>"Rasht, Iran","RBE"=>"Ratanakiri, Cambodia","RAZ"=>"Rawala Kot, Pakistan","RBJ"=>"Rebun, Japan","REC"=>"Recife, PE, Brazil","RCQ"=>"Reconquista, SF, Argentina","REG"=>"Reggio Calabria, Italy","RNL"=>"Rennell, Solomon Islands","RNS"=>"Rennes, France","RES"=>"Resistencia, CW, Argentina","REU"=>"Reus, Spain and Canary Islands","KEF"=>"Reykjavik, Iceland","REX"=>"Reynossa, Mexico","RHO"=>"Rhodes, Gabon","RAO"=>"Ribeirao Preto, SP, Brazil","RIB"=>"Riberalta, Bolivia","RCB"=>"Richards Bay, South Africa","RCM"=>"Richmond, QL, Australia","RIX"=>"Riga, Latvia","RJK"=>"Rijeka, Croatia","RMI"=>"Rimini, Italy","RBR"=>"Rio Branco, AC, Brazil","RCU"=>"Rio Cuarto, CD, Argentina","GIG"=>"Rio De Janeiro, RJ, Brazil","RGL"=>"Rio Gallegos, Argentina - Internacional","RIG"=>"Rio Grande, RS, Brazil","RGA"=>"Rio Grande, TF, Argentina","ROY"=>"Rio Mayo, CB, Argentina","RVD"=>"Rio Verde, GO, Brazil","RCH"=>"Riohacha, Colombia","RIS"=>"Rishiri, Japan","RUH"=>"Riyadh, Saudi Arabia","RIY"=>"Riyan Mukalla, Yemen","RNE"=>"Roane, France","RTB"=>"Roatan, Honduras","VKG"=>"Roch Gia, Viet Nam","RSD"=>"Rock Sound, Bahamas","ROK"=>"Rockhampton, QL, Australia","RDZ"=>"Rodez, France","RRG"=>"Rodrigues Island, Mauritius","RVK"=>"Roervik, Norway","ZXM"=>"Rognan, Norway","RMA"=>"Roma, QL, Australia","ROM"=>"Rome, Italy - All airports","CIA"=>"Rome, Italy - Ciampino","FCO"=>"Rome, Italy - Leonardo Da Vinci/Fiumicino","RNP"=>"Rongelap Island, Marshall Islands","RNB"=>"Ronneby, Sweden","RRS"=>"Roros, Norway","RUR"=>"Rorutu, French Polynesia","ROS"=>"Rosario, SF, Argentina","RPN"=>"Rosh Pina, Iceland","RET"=>"Rost, Norway","RLG"=>"Rostock-Laage, Germany","ROV"=>"Rostov, Russia","ROP"=>"Rota, Northern Mariana Islands","ROT"=>"Rotorua, New Zealand","RTM"=>"Rotterdam, Netherlands","URO"=>"Rouen, France","RVN"=>"Rovaniemi, Finland","SZT"=>"S. Cristobal del Casas, Mexico","QFZ"=>"Saarbruecken, Germany","STX"=>"Saint Croix, U.S. Virgin Islands","SLU"=>"Saint Lucia, ST. LUCIA","SXM"=>"Saint Maarten, Netherlands Antilles","LED"=>"Saint Petersburg, Russia - Pulkovo","STT"=>"Saint Thomas, U.S. Virgin Islands","LTT"=>"Saint Tropez, France - La Mole","XPZ"=>"Saint Tropez, France","SPN"=>"Saipan, Northern Mariana Islands","SNO"=>"Sakon Nakhon, Thailand","SLY"=>"Salehard, Russia","SLX"=>"Salt Cay, Turks and Caicos Islands","SLW"=>"Saltillo, Mexico","SSA"=>"Salvadore, BA, Brazil","SZG"=>"Salzburg, Austria","KUF"=>"Samara, Russia","SVB"=>"Sambaua, Madagascar","UAS"=>"Samburu, Kenya","SMI"=>"Samos, Greece","ADZ"=>"San Andres Island, Colombia","OES"=>"San Antonio Oesta, RN, Argentina","SVZ"=>"San Antonio, Venezuela","BRC"=>"San Carlos, Argentina","SJO"=>"San Jose, Costa Rica - Juan Santa Maria","SYQ"=>"San Jose, Costa Rica - Tobias Bolanos Int'l","SJU"=>"San Juan, Puerto Rico","UAQ"=>"San Juan, SJ, Argentina","ULA"=>"San Julian, SC, Argentina","SLP"=>"San Luis Potosi, Mexico","LUQ"=>"San Luis, SL, Argentina","SAI"=>"San Marino, San Marino","CPC"=>"San Martin De Los Andes, Argentina","NMG"=>"San Miguel, Panama","SAP"=>"San Pedro Sula, Honduras","AFA"=>"San Rafael, Argentina","ZSA"=>"San Salvador, Bahamas","SAL"=>"San Salvador, El Salvador","EAS"=>"San Sebastian, Spain","SAH"=>"Sana'a, Yemen","NDY"=>"Sanday, United Kingdom","NNB"=>"Santa Ana, Solomon Islands","STB"=>"Santa Barbara, Ed, Venezuela","SPC"=>"Santa Cruz De La Palma, Spain and Canary Islands - La Palma","VVI"=>"Santa Cruz, Bolivia","RIA"=>"Santa Maria, Brazil","SMA"=>"Santa Maria, Portugal","SMR"=>"Santa Marta, Colombia","RSA"=>"Santa Rosa, LP, Argentina","STM"=>"Santarem, PA, Brazil","SMS"=>"Sante Marie, Madagascar","SCL"=>"Santiago, Chile","STI"=>"Santiago, Dominican Republic","GEL"=>"Santo Angelo, Brazil","NTO"=>"Santo Antao, Cape Verde","HEX"=>"Santo Domingo, Dominican Republic - Herrera","SDQ"=>"Santo Domingo, Dominican Republic - Las Americas","STD"=>"Santo Domingo, Venezuela","SYX"=>"Sanya, China","SNE"=>"Sao Nicolau, Cape Verde","CGH"=>"Sao Paulo, Brazil - Congonhas","VCP"=>"Sao Paulo, Brazil - Viracopos","GRU"=>"Sao Paulo, Brazil - Guarulhos Intl","TMS"=>"Sao Tome Is., Sao Tome and Principe","VXE"=>"Sao Vicente, Cape Verde","CTS"=>"Sapporo, Japan - Chitose","OKD"=>"Sapporo, Japan - Okadama","SSR"=>"Sara, Vanuatu","RTW"=>"Saratov, Russia","ZRM"=>"Sarmi, Indonesia","SUJ"=>"Satu Mare, Romania","SWG"=>"Satwag, Papua New Guinea","SLZ"=>"Sau Luiz, MA, Brazil","SXK"=>"Saumlaki, Indonesia","ZVK"=>"Savannakhet, Laos","SVL"=>"Savonlinna, Finland","SVU"=>"Savusavu, Fiji","ZBY"=>"Sayaboury, Laos","EGM"=>"Sege, Solomon Islands","GXF"=>"Seiyun, Yemen","QFK"=>"Selje, Norway","SRG"=>"Semarang, Indonesia","ZEG"=>"Senggo, Indonesia","SEL"=>"Seoul, South Korea - All Airports","GMP"=>"Seoul, South Korea - Gimpo International","ICN"=>"Seoul, South Korea - Incheon International","ZRI"=>"Servi, Indonesia","SZM"=>"Sesriem, Namibia","SVQ"=>"Sevilla, Spain and Canary Islands","PVG"=>"Shanghai, China","SNN"=>"Shannon, Ireland","SWA"=>"Shantou, China","SSH"=>"Sharm El Sheikh, Egypt","SZD"=>"Sheffield, United Kingdom","SZX"=>"Shenzhen, China","LWK"=>"Shetland Islands, United Kingdom - Lerwick/Tingwall","LSI"=>"Shetland Islands, United Kingdom - Sumburgh","HIL"=>"Shillavo, Ethiopia","CIT"=>"Shimkent, Kazakhstan","SYZ"=>"Shiraz, Iran","SYO"=>"Shonai, Japan","JHQ"=>"Shute Harbor, Australia","REP"=>"Siem Reap, Cambodia","IXS"=>"Silchar, India","SYM"=>"Simao, China","NKD"=>"Sinak, Indonesia","SIN"=>"Singapore, Singapore - Changi","XSP"=>"Singapore, Singapore - Seletar","SQG"=>"Sintang, Indonesia","JHS"=>"Sisimiut, Greenland","AKY"=>"Sittwe, Myanmar","VAS"=>"Sivas, Turkey","JSI"=>"Skiathos, Greece","SKP"=>"FYROM)","KVB"=>"Skovde, Sweden","SZK"=>"Skukuza, South Africa","SXL"=>"Sligo, Ireland","DWB"=>"Soalala, Madagascar","SOO"=>"Soderham, Sweden","SOF"=>"Sofia, Bulgaria","SOG"=>"Sognolal, Norway","SOC"=>"Solo City, Indonesia","SQH"=>"Son-La, Viet Nam - Na-San","SOJ"=>"Sorkjosen, Norway","SOD"=>"Sorocaba, Brazil","TZN"=>"South Andros, Bahamas","XSC"=>"South Caicos, Turks and Caicos Islands","SOU"=>"South Hampton, United Kingdom","SOI"=>"South Molle Island, QL, Australia","SPU"=>"Split, Croatia","AXP"=>"Spring Point, Bahamas","SXR"=>"Srinagar, India","STX"=>"St. Croix Island, U.S. Virgin Islands","RUN"=>"St Denis de la Reunion, Reunion","SKB"=>"St Kitts, St Kitts and Nevis","FSP"=>"St Pierre, St Pierre and Miquelon","SVD"=>"St Vincent, Saint Vincent and the Grenadines","EBU"=>"St. Etienne, France","EUX"=>"St. Eustatius, Netherlands Antilles","UVF"=>"St. Lucia, St. Lucia - Hawnorra","UVF"=>"St. Lucia, St. Lucia","LED"=>"St. Petersburg, Russia","ZSE"=>"St. Pierre de la Reunion, Reunion","STT"=>"St. Thomas Island, U.S. Virgin Islands","STW"=>"Stavropol, Russia","SVG"=>"Stavanger, Norway","SML"=>"Stella Maris, Bahamas","STO"=>"Stockholm, Sweden - All airports","ARN"=>"Stockholm, Sweden - Arlanda","BMA"=>"Stockholm, Sweden - Bromma","SYY"=>"Stornoway, United Kingdom","SQO"=>"Storuman, Sweden","XER"=>"Strasbourg, France - Bus service","SXB"=>"Strasbourg, France - Entzheim","SOY"=>"Stronsay, United Kingdom","TNX"=>"Stung Treng, Cambodia","STR"=>"Stuttgart, Germany - Echterdingen","ZWS"=>"Stuttgart, Germany - Rail service","VAO"=>"Suavanao, Solomon Islands","SRE"=>"Sucre, Bolivia","SYU"=>"Sue Island, QL, Australia","SUL"=>"Sui, Pakistan","THS"=>"Sukhotthai, Thailand","NTY"=>"Sun City, South Africa","MCY"=>"Sunshine Coast, QL, Australia","SUB"=>"Surabaya, Indonesia","URT"=>"Surat Thani, Thailand","SUV"=>"Suva, Fiji","EVG"=>"Sveg, Sweden","SVJ"=>"Svolvaer, Norway","SYD"=>"Sydney, New South Wales, Australia","ZYL"=>"Sylhet, Bangladesh","SZZ"=>"Szczecin, Poland","TCP"=>"Taba, Egypt","TBJ"=>"Tabarka, Tunisia","TBT"=>"Tabatinga, AM, Brazil","TBO"=>"Tabora, Tanzania","TBZ"=>"Tabriz, Iran","TBG"=>"Tabubil, Papua New Guinea","TUU"=>"Tabuk, Saudi Arabia","TCG"=>"Tacheng, China","THL"=>"Tachilek, Myanmar","TAC"=>"Tacloban, Philippines","TCQ"=>"Tacna, Peru","TXG"=>"Taichung, Taiwan","TIF"=>"Taif, Saudi Arabia","TNN"=>"Tainan, Taiwan","TSA"=>"Taipei, Taiwan - Sung Shan","TPE"=>"Taipei, Taiwan - Chiang Kai Shek","TTT"=>"Taitung, Taiwan","TYN"=>"Taiyuan, China","TAI"=>"Taiz, Yemen","TLL"=>"Tallinn, Estonia","TMR"=>"Tamanrasset, Algeria","TNO"=>"Tamarindo, Costa Rica","TMM"=>"Tamatave, Madagascar","WTA"=>"Tambohorano, Madagascar","TMC"=>"Tambolaka, Indonesia","TMU"=>"Tambor, Costa Rica","TMP"=>"Tampere, Finland","TAM"=>"Tampico, Mexico","TMW"=>"Tamworth, NS, Australia","TMH"=>"Tanahmerah, Indonesia","TNG"=>"Tangier, Morocco","TJQ"=>"Tanjung Pandan, Indonesia","TJS"=>"Tanjung Selor, Indonesia","TAH"=>"Tanna, Vanuatu","TAP"=>"Tapachula, Mexico","TRK"=>"Tarakan, Indonesia","TRA"=>"Taramajma, Japan","TAR"=>"Taranto, Italy","TPP"=>"Tarapoto, Peru","TRW"=>"Tarawa, Kiribati","TRO"=>"Taree, NS, Australia","TIZ"=>"Tari, Papua New Guinea","TJA"=>"Tarija, Bolivia","TAS"=>"Tashkent, Uzbekistan","TUO"=>"Taupo, New Zealand","TRG"=>"Tauranga, New Zealand","TVU"=>"Taveuni, Fiji","TWU"=>"Tawau, Malaysia","TEE"=>"Tbessa, Algeria","TBS"=>"Tbilisi, Georgia","TCH"=>"Tchibanga, Gabon","TEU"=>"Te Anau, New Zealand","MME"=>"Teesside, United Kingdom","TFF"=>"Tefe, AM, Brazil","TGU"=>"Tegucigalpa, Honduras","THR"=>"Tehran, Iran - Mehrabad","TKB"=>"Tekadu, Papua New Guinea","TLV"=>"Tel Aviv, Israel","TIM"=>"Tembagapura, Indonesia","TXM"=>"Teminabuan, Indonesia","ZCO"=>"Temuco, Chile","TFN"=>"Tenerife, Spain and Canary Islands - Norte Los Rodeos","TFS"=>"Tenerife, Spain and the Canary Islands - Sur Reina Sofia","TCA"=>"Tennant Creek, NT, Australia","TPQ"=>"Tepic, Mexico","TER"=>"Terceira Island, Portugal","THE"=>"Teresina, PI, Brazil","TMJ"=>"Termez, Uzbekistan","TTE"=>"Ternate, Indonesia","TDB"=>"Tetabedi, Papua New Guinea","TET"=>"Tete, Mozambique","TTU"=>"Tetuan, Morocco","TEZ"=>"Tezpur, India","SNW"=>"Thandwe, Myanmar","THG"=>"Thangool, QL, Australia","XTG"=>"Thargomindah, QL, Australia","TBI"=>"The Bight, Bahamas","SKG"=>"Thessaloniki, Greece","JTR"=>"Thira, Greece","TRV"=>"Thiruvananthapuram, India","THO"=>"Thorshofn, Iceland","TIS"=>"Thursday Island, QL, Australia","TSN"=>"Tianjn, China","TID"=>"Tiaret, Algeria","TGJ"=>"Tiga, New Caledonia","TIJ"=>"Tijuana, Mexico","TIH"=>"Tikehau Atoll, French Polynesia","IKS"=>"Tiksi, Russia","TIU"=>"Timaru, New Zealand","TMX"=>"Timimoun, Algeria","TSR"=>"Timosoara, Romania","TIN"=>"Tindouf, Algeria","TIQ"=>"Tinian, Northern Mariana Islands","TIY"=>"Tioljikja, Mauritania","TOD"=>"Tioman, Malaysia","TIE"=>"Tippi, Ethiopia","TIA"=>"Tirana, Albania","TRE"=>"Tiree, United Kingdom","TGM"=>"Tirgu Mures, Romania","TRZ"=>"Tiruchirapally, India","TIR"=>"Tirupati, India","TIV"=>"Tivat, Serbia and Montenegro","TLM"=>"Tlemcen, Algeria","TAB"=>"Tobago, Trinidad and Tobago","TOB"=>"Tobruk, Libya","TKN"=>"Tokunoshima, Japan","TKS"=>"Tokushima, Japan","TYO"=>"Tokyo, Japan - All airports","HND"=>"Tokyo, Japan - Haneda","NRT"=>"Tokyo, Japan - Narita","TOW"=>"Toledo, PR, Brazil","TLC"=>"Toluco, Mexico","TPR"=>"Tom Price, WA, Australia","TMG"=>"Tomanggong, Malaysia","TOM"=>"Tombouctou, Mali","TOF"=>"Tomsk, Russia","TGO"=>"Tongliao, China","TGH"=>"Tongoa, Vanuatu","TWB"=>"Toowoomba, QL, Australia","TRC"=>"Torreon, Mexico","TOH"=>"Torres, Vanuatu","TYF"=>"Torsby, Sweden","TOV"=>"Tortola, British Virgin Islands","TTB"=>"Tortoli, Italy","TTQ"=>"Tortuquero, Costa Rica","TTJ"=>"Tottori, Japan","TOU"=>"Touho, New Caledonia","TLN"=>"Toulon, France","TLS"=>"Toulouse, France","TUF"=>"Tours, France","XSH"=>"Tours, France - Rail service","TSV"=>"Townsville, QL, Australia","TOY"=>"Toyama, Japan","TOE"=>"Tozeur, Tunisia","TZX"=>"Trabzon, Turkey","TST"=>"Trang, Thailand","TPS"=>"Trapani, Italy","TGN"=>"Traralgon, VI, Australia","TCB"=>"Treasure Cay, Bahamas","REL"=>"Trelew, CB, Argentina","TRS"=>"Trieste, Italy","TDD"=>"Trinidad, Bolivia","POS"=>"Trinidad, Trinidad and Tobago","TIP"=>"Tripoli, Latvia","THN"=>"Trollhattan, Sweden","TMT"=>"Trombetas, PA, Brazil","TOS"=>"Tromso, Norway","TRD"=>"Trondheim, Norway","TJI"=>"Trujillo, Honduras","TRU"=>"Trujillo, Peru","TKK"=>"Truk, Micronesia","TTS"=>"Tsaratanana, Madagascar","WTS"=>"Tsiroanomandidy, Madagascar","TSB"=>"Tsumeb, Namibia","TSJ"=>"Tsushima, Japan","TUB"=>"Tubuai, French Polynesia","TUC"=>"Tucuman, TU, Argentina","TUV"=>"Tucupita, Venezuela","TUR"=>"Tucurui, PA, Brazil","TFI"=>"Tufi, Papua New Guinea","TUG"=>"Tuguegarao, Philippines","TUA"=>"Tulcan, Ecuador","TLE"=>"Tulear, Madagascar","TUJ"=>"Tum, Ethiopia","TCO"=>"Tumaco, Colombia","TBP"=>"Tumbes, Peru","TUN"=>"Tunis, Tunisia","TXN"=>"Tunxi, China","TUI"=>"Turaif, Saudi Arabia","TUK"=>"Turbat, Pakistan","TRN"=>"Turin, Italy","TKU"=>"Turku, Finland","TGZ"=>"Tuxtla Gutierrez, Mexico","TJM"=>"Tyumen, Russia","UBJ"=>"Ube, Japan","UBA"=>"Uberaba, MG, Brazil","UDI"=>"Uberlandia, MG, Brazil","UBP"=>"Ubon Ratchathani, Thailand","UDR"=>"Udaipur, Indonesia","UTH"=>"Udon Thani, Thailand","UFA"=>"Ufa, Russia","UJE"=>"Ujae Island, Marshall Islands","UPG"=>"Ujung Pandang, Indonesia","UCT"=>"Ukhta, Russia","ULN"=>"Ulaanbaatar, Mongolia","HLH"=>"Ulanhot, China","UUD"=>"Ulan-Ude, Russia","ULB"=>"Ulei, Vanuatu","ULY"=>"Uliastai, Mongolia","ULI"=>"Ulithi, Micronesia","USN"=>"Ulsan, South Korea","ULD"=>"Ulundi, South Africa","UME"=>"Umea, Sweden","UTT"=>"Umtata, South Africa","JUV"=>"Upernavik, Greenland","UTN"=>"Upington, South Africa","URJ"=>"Uraj, Russia","URA"=>"Uralsk, Kazakhstan","UGC"=>"Urgench, Uzbekistan","OMH"=>"Urmieh, Iran","URU"=>"Uroubi, Papua New Guinea","UPN"=>"Uruapan, Mexico","URG"=>"Uruguaiana, RS, Brazil","URC"=>"Urumqi, China","USL"=>"Useless Loop, WA, Australia","USH"=>"Ushuaia, TF, Argentina","USK"=>"Usinsk, Russia","UKK"=>"Ust-Kamenogorsk, Kazakhstan","UIK"=>"Ust-Ilimsk, Russia","UTP"=>"Utapao, Thailand","UII"=>"Utila, Honduras","UTK"=>"Utirik Island, Marshall Islands","UMD"=>"Uummannaq, Greeland","UDJ"=>"Uzhgorod, Ukraine","VAA"=>"Vaasa, Finland","BDQ"=>"Vadodara, India","VDS"=>"Vadso, Norway","ZAL"=>"Valdivia, Chile","VLC"=>"Valencia, Spain","VLN"=>"Valencia, Venezuela","XVS"=>"Valenciennes, France","VLV"=>"Valera, Venezuela","VLS"=>"Valesdir, Vanuatu","VLL"=>"Valladolid, Spain and Canary Islands","VUP"=>"Valledupar, Colombia","VDE"=>"Valverde, Spain and Canary Islands - Hierro","VAN"=>"Van, Turkey","YVR"=>"Vancouver, BC","VAI"=>"Vanimo, Papua New Guinea","VBV"=>"Vanuabalavu, Fiji","VNS"=>"Varanasi, India","VAW"=>"Vardoe, Norway","VAG"=>"Varginha, MG, Brazil","VRK"=>"Varkaus, Finland","VAR"=>"Varna, Bulgaria","VST"=>"Vasteras, Sweden","VAT"=>"Vatomatry, Madagascar","VAV"=>"Vava'u, Tonga","VXO"=>"Vaxjo, Sweden","ANU"=>"V.C. Bird International, Antigua & Barbuda","VCE"=>"Venice, Italy - Marco Polo","TSF"=>"Venice, Italy - Treviso","VER"=>"Veracruz, Mexico","VRA"=>"Varadero, Cuba","VRN"=>"Verona, Italy","VEY"=>"Vestmannaeyjar, Iceland","VFA"=>"Victoria Falls, Zimbabwe","VCD"=>"Victoria River Downs, NT, Australia","VDM"=>"Viedma, RN, Argentina","VIE"=>"Vienna, Austria","VTE"=>"Vientiane, Laos - Wattay","VQS"=>"Vieques, Puerto Rico","VGO"=>"Vigo, Spain","VNX"=>"Vilanculos, Mozambique","VHM"=>"Vilhelmina, Sweden","BVH"=>"Vilhena, Brazil","VLG"=>"Villa Gesell, BA, Argentina","VME"=>"Villa Mercedes, SL, Argentina","VSA"=>"Villahermosa, Mexico","VNO"=>"Vilnius, Lithuania","VII"=>"Vinh City, Viet Nam","VIJ"=>"Virgin Gorda, British Virgin Islands","VBY"=>"Visby, Sweden","VTZ"=>"Vishakhapatnam, India","VTB"=>"Vitebsk, Belarus","VDC"=>"Vitoria da Conquista, BA, Brazil","VIT"=>"Vitoria, Spain and Canary Islands","VIV"=>"Vivigani, Papua New Guinea","OGZ"=>"Vladikavkaz, Russia","VVO"=>"Vladivostok, Russia","VOH"=>"Vohemar, Madagascar","VLK"=>"Volgodonsk, Russia","VOG"=>"Volgograd, Russia","VPN"=>"Vopnafjordur, Iceland","VKT"=>"Vorkuta, Russia","VOZ"=>"Voronezh, Russia","WAE"=>"Wadi Ad Dawasir, Saudi Arabia","WHF"=>"Wadi Halfa, Sudan","WET"=>"Wagethe, Indonesia","WGA"=>"Wagga Wagga, NS, Australia","WBA"=>"Wahai, Indonesia","WGP"=>"Waingapo, Indonesia","WKJ"=>"Wakkanai, Japan","WLH"=>"Walaha, Vanuatu","WGE"=>"Walgett, NS, Australia","WLS"=>"Wallis Island, Wallis and Futuna Islands","WVB"=>"Walvis Bay, Namibia","WMX"=>"Wamena, Indonesia","WKA"=>"Wanaka, New Zealand","WAG"=>"Wanganui, New Zealand","AGE"=>"Wangerooge, Germany","AGL"=>"Wanigela, Papua New Guinea","WXN"=>"Wanxian, China","WAW"=>"Warsaw, Poland","WSR"=>"Wasior, Indonesia","WSU"=>"Wasu, Papua New Guinea","WAT"=>"Waterford, Ireland","WUG"=>"Wau, Papua New Guinea","WUU"=>"Wau, Sudan","WED"=>"Wedau, Papua New Guinea","EJH"=>"Wedjh, Saudi Arabia","WEH"=>"Weihai, China","WEI"=>"Weipa, QL, Australia","WLG"=>"Wellington, New Zealand","WNZ"=>"Wenzhou, China","GWT"=>"Westerland, Germany","WSZ"=>"Westport, New Zealand","WRY"=>"Westray, United Kingdom","WWK"=>"Wewak, Papua New Guinea","WHK"=>"Whakatane, New Zealand","WRE"=>"Whangarei, New Zealand","WYA"=>"Whyalla, SA, Australia","WIC"=>"Wick, United Kingdom","WVN"=>"Wilhelmshaven, Germany","WUN"=>"Wiluna, WA, Australia","WNR"=>"Windarra, QL, Australia","WIN"=>"Winton, QL, Australia","WJA"=>"Woja, Marshall Islands","WOT"=>"Wonan, Taiwan","WJU"=>"WonJu, South Korea","WTO"=>"Wotho Island, Marshall Islands","WTE"=>"Wotje Island, Marshall Islands","WRO"=>"Wroclaw, Poland","WUD"=>"Wudinna, SA, Australia","WUH"=>"Wuhan, China","WUS"=>"Wuyishan, China","WYN"=>"Wyndham, WA, Australia","XMN"=>"Xiamen, China","XIY"=>"Xi An, China - Xianyang","XFN"=>"Xiangfan, China","XIC"=>"Xichang, China","XKH"=>"Xieng Khouang, Laos","XIL"=>"Xilinhot, China","XNN"=>"Xining, China","XUZ"=>"Xuzhou, China","YKS"=>"Yakutsk, Russia","KYX"=>"Yalumet, Papua New Guinea","XMY"=>"Yam Island, QL, Australia","GAJ"=>"Yamagata, Japan","ENY"=>"Yan'an, China","YNB"=>"Yanbu, Saudi Arabia","YNZ"=>"Yancheng, China","XYA"=>"Yandina, Solomon Islands","RGN"=>"Yangon, Myanmar","YNJ"=>"Yanji, China","YNT"=>"Yantai, China","YAO"=>"Yaounde, Cameroon","YAP"=>"Yap, Micronesia","IAR"=>"Yaroslavl, Russia","AZD"=>"Yazd, Iran","EYL"=>"Yelimane, Mali","RSU"=>"Yeosu, South Korea","EVN"=>"Yerevan, Armenia","YBP"=>"Yibin, China","YIH"=>"Yichang, China","INC"=>"Yinchuan, China","YIN"=>"Yining, China","YIW"=>"Yiwu, China","JOG"=>"Yogyakarta, Indonesia","YGJ"=>"Yonago, Japan","OGN"=>"Yonaguni Jima, Japan","OKR"=>"Yorke Island, QL, Australia","RNJ"=>"Yoronjima, Japan","UYN"=>"Yulin, China","UUS"=>"Yuzhno-Sakhalinsk, Russia","ZAD"=>"Zadar, Croatia","ZAG"=>"Zagreb, Croatia","ZAH"=>"Zahedan, Iran","ZTH"=>"Zakinthos Island, Greece","ZAM"=>"Zamboanga, Philippines","ZNZ"=>"Zanzibar, Tanzania - Kisauni","OZH"=>"Zaporozhye, Ukraine","ZAZ"=>"Zaragoza, Spain and Canary Islands","ZHA"=>"Zhanjiang, China","ZAT"=>"Zhaotong, China","CGO"=>"Zhengzha, China","PZH"=>"Zhob, Pakistan","HSN"=>"Zhoushan, China","ZUH"=>"Zhuhai, China","IEG"=>"Zielana, Poland","ZIH"=>"Zihuatanejo/Ixtapa, Mexico","OUZ"=>"Zouerate, Mauritania","UGU"=>"Zugapa, Indonesia","ZRH"=>"Zurich, Switzerland",);
	
	$ret_array = array();
	$airport1 = strtoupper($airport1);
	$airport2 = strtoupper($airport2);
	if (isset($airport_codes[$airport1]) && isset($airport_codes[$airport2])) {
		$ret_array = array("status"=>1, "airport1"=>$airport_codes[$airport1], "airport2"=>$airport_codes[$airport2]);
		
	}
	else $ret_array = array("status"=>0);
	
	return ($callback ? $callback."(" : "") . jsonify($ret_array) . ($callback ? ");" : "");
}

/*
***************
Whitepages Reverse Phone Lookup
*****************
*/
$wgAjaxExportList[] = 'wfWhitePagesPhoneNumberSearchJSON';
function wfWhitePagesPhoneNumberSearchJSON( $phone_number, $callback=false ) {
	
	$api_key = "19a51df21129f061ce99255df0bf8240";
	$url = "http://api.whitepages.com/reverse_phone/1.0/?phone=" . $phone_number . ";outputtype=JSON;api_key=" . $api_key;
	$json = Http::get( $url );
	return ($callback ? $callback."(" : "") . $json . ($callback ? ");" : "");
}

/*
***************
Compete Website Comparison
*****************
*/
$wgAjaxExportList[] = 'wfGetCompeteDataJSON';
function wfGetCompeteDataJSON( $domains = array(), $callback = "" ) {
	
	$api_key = "X1-ZWz1cqcqb3daff_8qndf";
	
	foreach( $domains as $domain ){
		$url = "http://api.compete.com/fast-cgi/MI?d={$domain}&ver=3&apikey={$api_key}&size=large";
		$xml = Http::get( $url );
		
		$json = xml2json::transformXmlStringToJson($xml);
	}
	
	return ($callback ? $callback."(" : "") . $json . ($callback ? ");" : "");
}

/*
***************
Acronym Search
*****************

$wgAjaxExportList[] = 'wfTryAcronymFinder';
function wfTryAcronymFinder( $query = false , $callback = "") {
	
	$query = urldecode( $query );
	$query = strtolower( $query );
	
	$list = file_get_contents( "http://www.acronymfinder.com/~/app/api/wikia.ashx?list");
	$list_array = explode( "\n", $list );
	//trim array :(
	foreach( $list_array as &$list_item )$list_item = trim( strtolower($list_item));
	
	if( in_array( $query, $list_array ) ){
		$def = file_get_contents( "http://www.acronymfinder.com/~/app/api/wikia.ashx?acronym={$query}");
		$json = xml2json::transformXmlStringToJson( $def );
		return ($callback ? $callback."(" : "") . $json . ($callback ? ");" : "");
	}
	return "void(0);";
}
*/
/*
***************
NReuters News
*****************
*/
$wgAjaxExportList[] = 'wfGetReutersData';
function wfGetReutersData( $query = false , $callback = "reutersRender", $count=3) {
	
	$query = urldecode( $query );
	
	$client = new SoapClient("http://ws.us.reuters.com/external/NewsDataSecure.asmx?wsdl", array('trace'=>1, 'exceptions'=>0, 'location' => "http://ws.us.reuters.com/external/NewsDataSecure.asmx"));
	
	$username = WISE_reuters_username;
	$password = WISE_reuters_password;
	
	$output = "";
	if(!$session_id) {
		
		$response = $client->GetSessionId(array("userId"=>$username, "password"=>$password));
		
		$variables = get_object_vars($response);
		$session_id = $variables["GetSessionIdResult"];
		
	}
	
	$output = "";
	$reuters_obj = array();
	if (!$search_results) {

		$strHeaderComponent_Session = '<SoapAuthenticationHeader xmlns="http://www.reuters.com/"><SessionId>'.$session_id.'</SessionId></SoapAuthenticationHeader>';

		$auth_var = new SoapVar($strHeaderComponent_Session, XSD_ANYXML, null, null, null);
		$header = new SoapHeader("http://www.reuters.com/", "SoapAuthenticationHeader", $auth_var);
		$client->__setSoapHeaders(array($header));

		$search_results = $client->GetNewsSearch(array("keywords"=>$query,"pgNum"=>0));
		
		if (is_soap_fault($search_results)) { 
			//echo $client->__getLastRequest();
			//return "blah";
			$output = $callback . "({});";
			return $output;
		}
		
		$gotfrom = "service";
	}
	else {
		$gotfrom = "memcached";
	}
	
	$variables = get_object_vars($search_results);
	$results = get_object_vars($variables["GetNewsSearchResult"]);
	$news_story = $results["NewsStory"];
	
	$reuters_obj["results"] = array();
	$limit = (sizeof($news_story)>$count ? $count : sizeof($news_story));
	for ($i=0; $i<$limit; $i++) {
		$reuters_obj["results"][$i] = array();
		$story=get_object_vars($news_story[$i]);
		$stocks = get_object_vars($story["StockSymbols"]);
		
		$reuters_obj["results"][$i]["ArticleUrl"] = $story["ArticleUrl"];
		$reuters_obj["results"][$i]["Headline"] = $story["Headline"];
		$reuters_obj["results"][$i]["Summary"] = substr($story["StoryBody"], 0, 300);
		$reuters_obj["results"][$i]["TimeStamp"] = $story["TimeStamp"];
		$reuters_obj["results"][$i]["StockSymbols"] = array();
		if(sizeof($stocks["anyType"]) == 1) {
			$reuters_obj["results"][$i]["StockSymbols"][0] = $stocks["anyType"];
		}
		else {
			for($j=0; $j<sizeof($stocks["anyType"]); $j++) {
				$reuters_obj["results"][$i]["StockSymbols"][$j] = $stocks["anyType"][$j];
			}
		}
		
	}
	$reuters_object = array("reutersResults"=>$reuters_obj, "got_from"=>$gotfrom, "results_count"=>sizeof($reuters_obj["results"]));
	$reuters_json = jsonify($reuters_object);
	
	$output = $callback . "(" . $reuters_json . ");";
	
	return $output;
	
}

/*
***************
Washington Post News
*****************
*/

$wgAjaxExportList[] = 'wfGetWashingtonPost';
function wfGetWashingtonPost( $query , $callback = false, $startdate=false, $enddate=false) {
	$query = urldecode( $query );
	$query = urlencode( $query );
	
	if (!$startdate && !$enddate) {
		$enddate = date("Ymd");
		$startdate = date("Ymd", time()-(3*24*60*60));
	}
	
	$url = "http://www.washingtonpost.com/ac2/wp-dyn/NewsSearch?st=%22{$query}%22&fn=&sfn=&sa=&cp=&hl=false&sb=-1&sd={$startdate}&ed={$enddate}&blt=&fa_1_sourcenavigator=%22The+Washington+Post%22&fmt=xml&showdocs=y";
	$wa_po_xml = Http::get( $url );
	if(strpos(trim($wa_po_xml), "<html>")===0) $wa_po_json = "{}";
	else $wa_po_json = xml2json::transformXmlStringToJson( $wa_po_xml );
	return ($callback ? $callback."(" : "") . $wa_po_json . ($callback ? ");" : "");
}

/*
***************
IMDB Movies
*****************
*/
$wgAjaxExportList[] = 'wfGetIMDBData';
function wfGetIMDBData( $query = false , $callback = false, $count=3) {
	global $wgMemc;
	require_once("../common/HMAC.php");
	$query = urldecode( $query );
	
	$secret_key = WISE_imdb_secretkey;
	$access_key = WISE_imdb_accesskey;
	
	$method = "Search";
	$timestamp = date("c");
	$timestamp = substr(strrev($timestamp), strpos($timestamp, "-") + 2);
	$timestamp = strrev($timestamp) . "Z";

	$string = $method.$timestamp;
	$hmac = new Crypt_HMAC($secret_key,"sha1");
	$hmac_digest = $hmac->hash(trim($string));
	$binary_hmac = pack("H40",$hmac_digest);
	$base64_hmac = base64_encode($binary_hmac); 
	
	$hash = $base64_hmac;
	
	$client = new SoapClient(null, array('location' => "http://webservice.imdb.com/doc/2006-12-15/", 'uri' => "http://webservice.imdb.com/doc/2006-12-15/", 'trace'=>1, 'exceptions'=>0));
	
	$output = "";
	
	if($query){	
		$strBodyComponent_Session = '<AWSAccessKeyId>'.$access_key.'</AWSAccessKeyId><Timestamp>'.$timestamp.'</Timestamp><Signature>'.$hash.'</Signature><Both>'.$query.'</Both><Action>'.$method.'</Action>';
		$params_var = new SoapVar($strBodyComponent_Session, XSD_ANYXML, null, null, null);
		$response = $client->Search($params_var);
		
		$variables = get_object_vars($response);
		
		if(isset($variables["faultstring"])) {
			$output .= "faultstring: " . $variables["faultstring"] . "<br/>";
			$output .= "faultcode: " . $variables["faultcode"] . "<br/>";
			
			$details = get_object_vars($variables["detail"]);
			foreach ( $details as $key=>$value) {
				$output .= $key . " : " . $value . "<br/>";
			}
			return $output;
		}
		else {
			$result_obj = array();
			
			if(isset($response["SearchResults"])) {
				$result_set = $response["SearchResults"];
				$result_array = get_object_vars($result_set);
				if(sizeof($result_array)) { 
					$result_temp = $result_array["Result"];
					if(sizeof($result_temp)) {
						$result = get_object_vars($result_temp[0]);
						$type=$result["Type"];
						$category=$result["Category"];
						
						$result_obj["type"] = $type;
						$result_obj["category"] = $category;
						$result_obj["info"] = array();
						$val_array=$result[$type."Result"];
						if (get_class($val_array)=="stdClass") $val_array = get_object_vars($val_array);
						if(sizeof($val_array)) {
							$result_item = $val_array;
							if(isset($result_item[0])) $result_item = $result_item[0];
							foreach($result_item as $key=>$value) {
								
								if(get_class($value)=="stdClass") {
									$resobj_value_array = get_object_vars($value);
									foreach($resobj_value_array as $result_key=>$result_value) {
										$output .= "&nbsp;&nbsp;&nbsp;" . $result_key . " : " . (get_class($result_value)=="stdClass" ? get_class($result_value) : $result_value) . "<br/>";
										$result_obj["info"][$result_key] = $result_value;
									}
								}
								else {
									$output .= $key . " : " . $value . "<br/>";
									$result_obj["info"][$key] = $value;
								}
							}
						}
					}
				}
			}
			
			if($type == "Title") {
				$method = "LookupTitle";
				//$resp_groups = "Tagline,PlotSummary";
				$resp_groups = "";
				$string = $method.$timestamp;
				$hmac = new Crypt_HMAC($secret_key,"sha1");
				$hmac_digest = $hmac->hash(trim($string));
				$binary_hmac = pack("H40",$hmac_digest);
				$base64_hmac = base64_encode($binary_hmac);
				$hash = $base64_hmac;
				$strTitleLookup = '<AWSAccessKeyId>'.$access_key.'</AWSAccessKeyId><Timestamp>'.$timestamp.'</Timestamp><Signature>'.$hash.'</Signature><ResourceId>'.$result_obj["info"]["TitleId"].'</ResourceId><Type>'.$type.'</Type><Action>'.$method.'</Action><ResponseGroups>'. $resp_groups.'</ResponseGroups>';
				$params_var = new SoapVar($strTitleLookup, XSD_ANYXML, null, null, null);
				$title_response = $client->LookupTitle($params_var);
				
				if (is_soap_fault($title_response)) { 
					echo $client->__getLastRequest();
					//return "blah";
				}
				
				$variables = get_object_vars($title_response);
				if(isset($variables["faultstring"])) {
					$output .= "faultstring: " . $variables["faultstring"] . "<br/>";
					$output .= "faultcode: " . $variables["faultcode"] . "<br/>";
					
					$details = get_object_vars($variables["detail"]);
					foreach ( $details as $key=>$value) {
						$output .= $key . " : " . $value . "<br/>";
					}
					return $output;
				}
				else {
					foreach($variables as $key=>$value) {
						$output .= $key . "<br/>";
					}
				}
				
				
			}
			
						
			
			$output = ($callback ? $callback."(" : "") . jsonify($result_obj) . ($callback ? ");" : "");
			return $output;
			
		}
		
	}
		
	
}

/*
***************
Seeqpod App
*****************
*/
$wgAjaxExportList[] = 'wfGetSeeqpodFlash';
function wfGetSeeqpodFlash( $query = false , $callback = false, $count=3) {
	@session_start();
	$signin = "http://www.seeqpod.com/api/affiliate_signin/init?affiliate=wikia&sid=" . session_id() . "&name=davidpean";
	echo $signin;
	exit();
}


/*
***************
distance App
*****************
*/
$wgAjaxExportList[] = 'wfGetDistanceInfo';
function wfGetDistanceInfo( $lat1 = false , $lng1 = false , $lat2 = false , $lng2 = false ,$callback = false) {

	$url = "http://geocoder.us/service/distance?lat1={$lat1}&lat2={$lat2}&lng1={$lng1}&lng2={$lng2}";
	$distance = Http::get( $url );
	return ($callback ? $callback."(\"" : "\"") . trim(substr($distance, strpos($distance, "=")+1)) . ($callback ? "\");" : "\"");
}


/*
***************
NetFlix App
*****************
*/
$wgAjaxExportList[] = 'wfGetNetflixData';
function wfGetNetflixData( $query = false , $callback = false, $count=3) {

	global $wgMemc;
	$query = urldecode( $query );
	
	$netflix_api_key = WISE_netflix_api_key;
	$netflix_api_secret = WISE_netflix_api_secret;
	
	require_once('../common/OAuth.php');
	$test_consumer = new OAuthConsumer($netflix_api_key, $netflix_api_secret, NULL);
	$req_token = new OAuthConsumer("requestkey", "requestsecret", 1);
	
	$req_req = OAuthRequest::from_consumer_and_token($test_consumer, NULL, 'GET', 'http://api.netflix.com/catalog/titles', array("term"=>$query,"expand"=>"synopsis","max_results"=>$count));
	$req_req->sign_request(new OAuthSignatureMethod_HMAC_SHA1(), $test_consumer, NULL);
	
	$param_array = array();	
	$params = preg_split("&", $req_req);
	foreach($params as $key1) {
		$params2 = preg_split("=", $key1);
		$param_array[$params2[0]] = $params2[1];
	}
	
	$end_point_url = $req_req;
	
	$curl = curl_init();
	curl_setopt($curl, CURLOPT_URL, $end_point_url);
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($curl, CURLOPT_TIMEOUT, 60);
	curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
	$xml = curl_exec($curl);
	$netflix_json = xml2json::transformXmlStringToJson( $xml );
	
	return ($callback ? $callback."(" : "") . $netflix_json . ($callback ? ");" : "");
	
}

/*
***************
Yahoo App
*****************
*/
$wgAjaxExportList[] = 'wfGetYahooBossData';
function wfGetYahooBossData( $query = false, $service = "spelling", $callback = false, $count = 10) {

	$query = urldecode( $query );
	
	$yahoo_api_key = "dj0yJmk9eGZSblpGVXprMnJaJmQ9WVdrOVYzcFpibUZQTXpnbWNHbzlNekU0TkRjNU9EWXkmcz1jb25zdW1lcnNlY3JldCZ4PWRl";
	$yahoo_api_secret = "d9158a50640256ec9fea979802e529f7949d6a1e";
	
	require_once('../common/OAuth.php');
	$test_consumer = new OAuthConsumer($yahoo_api_key, $yahoo_api_secret, NULL);
	$req_token = new OAuthConsumer("requestkey", "requestsecret", 1);
	
	$req_req = OAuthRequest::from_consumer_and_token($test_consumer, NULL, 'GET', "http://yboss.yahooapis.com/ysearch/".$service, array("q" => $query, "format" => "json", "count" => $count));
	$req_req->sign_request(new OAuthSignatureMethod_HMAC_SHA1(), $test_consumer, NULL);
	
	$param_array = array();	
	$params = preg_split("&", $req_req);
	foreach($params as $key1) {
		$params2 = preg_split("=", $key1);
		$param_array[$params2[0]] = $params2[1];
	}
	
	$end_point_url = $req_req;
	
	$curl = curl_init();
	curl_setopt($curl, CURLOPT_URL, $end_point_url);
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($curl, CURLOPT_TIMEOUT, 60);
	curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
		
	$yahoo_json = curl_exec($curl);
	
	return ($callback ? $callback."(" : "") . $yahoo_json . ($callback ? ");" : "");
	
}

/*
***************
macbre: Developers App
***************
*/

$wgAjaxExportList[] = 'wfGetDevelopersJSON';

// return part of $text between $start and $end (without given boundaries)
function wfLimitText($start, $end, $text) {

	$startIdx = strpos($text, $start);
	$endIdx = strpos($text, $end, $startIdx);

	if ($startIdx && $endIdx) {
		$startIdx += strlen($start);
		return substr($text, $startIdx, $endIdx-$startIdx);
	}
	else {
		return false;
	}
}

function wfGetDevelopersJSON($language, $query, $callback) {

	$data = false;

	// differ by "language": rfc, php, js, css, ...
	switch($language) {

		// Request For Comments
		case 'rfc':
			$rfcId = intval($query);

			if (empty($rfcId)) {
				continue;
			}

			// fetch RFC file
			$url =  "http://www.faqs.org/rfcs/rfc{$rfcId}.html";

			$content = HTTP::get($url);  

			// remove HTML <head> section
			$content = substr($content, strpos($content, '<HR SIZE=2 NOSHADE>'));

			//echo '<pre>'.htmlspecialchars($content).'</pre>';

			// get title and short summary
			if (preg_match('/\- (.+)<\/h1>/m', $content, $matches)) {
				$title = $matches[1];

				$introIdx = intval(stripos($content, 'introduction') + 12 );
				$abstractIdx = intval(stripos($content, 'abstract') + 8);

				// use whatever is first
				$idx = min($introIdx, $abstractIdx) > 100 ? min($introIdx, $abstractIdx) : max($introIdx, $abstractIdx);

				$summary = trim( strip_tags(substr($content, $idx, 1024)) );
			}
			else {
				// RFC not found - return empty title
				$title = "";
			}

			$data = array(
				'type'    => 'rfc',
				'id'      => $rfcId,
				'title'   => $title,
				'summary' => !empty($summary) ? $summary : '',
				'href'    => "http://www.rfc-archive.org/getrfc.php?rfc={$rfcId}",
			);

			break;

		// PHP
		case 'php':
			$function = preg_replace('/[^A-Za-z0-9_]/', '', $query);

			$href = 'http://us.php.net/'.$function;

			$content = HTTP::get($href);

			//echo '<pre>'.htmlspecialchars($content).'</pre>';

			// grab info from manual page
			$syntax = wfLimitText('<div class="methodsynopsis dc-description">', '<p class="para rdfs-comment">', $content);
			if (!empty($syntax)) {
				$syntax = trim( strip_tags($syntax) );
				$syntax = preg_replace('/(\s+)/', ' ', $syntax);
			}

			$description = wfLimitText('rdfs-comment">', '<div', $content);
			if (!empty($description)) {
				$description = trim(strip_tags($description), "\n. ");
				$description = preg_replace('/(\s+)/', ' ', $description);
			}

			$params = wfLimitText('<p class="para">', '<div', $content);
			if (!empty($params)) {
				$params = trim(strip_tags($params, '<dl><dd><dt>'));
				$params = preg_replace('/(\s+)/', ' ', $params);
			}

			$returns = wfLimitText('<h3 class="title">Return Values</h3>', '<div', $content);
			if (!empty($returns)) {
				$returns = trim(strip_tags($returns, '<p>'));
				$returns = preg_replace('/(\s+)/', ' ', $returns);
			}

			$data = array(
				'type'    => 'php',
				'title'   => $function,
				'syntax'  => !empty($syntax) ? $syntax : '',
				'params'  => !empty($params) ? $params : '',
				'desc'    => !empty($description) ? $description : '',
				'returns' => !empty($returns) ? $returns : '',
				'href'    => 'http://{{LANG}}.php.net/'.$function,
			);

			break;

		// C
		case 'c':
			$function = preg_replace('/[^A-Za-z0-9_]/', '', $query);

			$href = "http://www.elook.org/programming/c/{$function}.html";

			$content = HTTP::get($href);

			// grab info from manual page
			$syntax = wfLimitText('<i>Syntax:</i>', '</pre>', $content);
			if (!empty($syntax)) {
				$syntax = trim( strip_tags($syntax) );
			}

			$description = wfLimitText('<i>Description:</i>', '<br /><br />', $content);
			if (!empty($description)) {
				$description = trim(strip_tags($description, '<br><pre>'), "\n. ");
				$description = preg_replace('/(\s+)/', ' ', $description);
			}

			$data = array(
				'type'    => 'c',
				'title'   => $function,
				'syntax'  => !empty($syntax) ? $syntax : '',
				'desc'    => !empty($description) ? $description : '',
				'href'    => $href,
			);		
			break;

		// man page
		case 'man':
			$cmd = preg_replace('/[^A-Za-z0-9_]/', '', $query);

			$href = 'http://unixhelp.ed.ac.uk/CGI/man-cgi?'.$cmd;

			$content = HTTP::get($href);

			//echo '<pre>'.htmlspecialchars($content).'</pre>';

			// grab info from manual page
			$description = wfLimitText('<PRE>', '</PRE>', $content);
			if (!empty($description)) {
				$description = wfLimitText("\n", "\n", $description);
				$description = trim( strip_tags($description,'<h2>') );
				$description = substr($description, 0, -40);

				// keep headers formatted
				$description = strtr($description, array(
					'<H2>'  => '<b>',
					'</H2>' => '</b>',
				));
			}
			
			$data = array(
				'type'    => 'man',
				'title'   => $cmd,
				'desc'    => !empty($description) ? $description : '',
				'href'    => $href,
			);		
			break;

		default:
			return '';
	}

	// json encode our response
	$jsonData = jsonify($data);

	$response = new AjaxResponse( !empty($callback) ? "$callback($jsonData);" : $jsonData );
       $response->setContentType('application/javascript; charset=utf-8');

	return $response;
}
