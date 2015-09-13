<?php

/*
APP SCRIPT CONFIG
*/

$APP_ID = "twitter";
$APP_OWNER = "Pean";
$APP_LANG = "en";

/*****************/
require_once("../JSON.php");
$json = new Services_JSON();

$trends_json = file_get_contents( "http://search.twitter.com/trends.json" );
$trends = $json->decode( $trends_json );

$regex = "";
foreach( $trends->trends as $trend ){
	$regex .= (( $regex )? "|":"") . strtolower( $trend->name );
}

$file = "../../lists/twitter.wise";
$fh = fopen($file, 'w') or die("can't open file");

$text_contents = "";
$text_contents = 'WISE.apps.twitter = {
	"author":"",
	"description":"Search Latest Twitter Trends API",
	"logo":"http://twitter.com/favicon.ico",
	"categories":[ "Blogging" ],
	"id":"twitter",
	"regex":/.*(?:twitter )(.+)|(' . $regex . ')$|(#.*)/i,
	"url":"WISE/apps/wise_twitter.js?r=" + Math.random(),
	"action":"twitterFetch"
};';

fwrite($fh, $text_contents);
fclose($fh);

echo "file written";
?>
	
	
