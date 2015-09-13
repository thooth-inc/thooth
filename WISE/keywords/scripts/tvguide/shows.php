<?php

/*
APP SCRIPT CONFIG
*/

$APP_ID = "tvguide";
$APP_OWNER = "DNL";
$APP_LANG = "en";

/*****************/

function get_show_array( $file ){
	
	$xml = file_get_contents( $file );
	$xml_obj = new SimpleXMLElement($xml);
	$result = $xml_obj->xpath('//Results/ResultSpec/query');
	
	$shows = array();
	foreach( $result as $show ){
		$shows[] = strtolower(trim($show));
	}	
	
	return $shows;
}

$all_shows = array_merge(
		get_show_array( "Shows1.xml" ),
		get_show_array( "Shows2.xml" ),
		get_show_array( "Shows3.xml" ),
		get_show_array( "Shows4.xml" )
		);
		
sort( $all_shows );

$shows_file = "../../lists/tvguide.txt";
$fh = fopen($shows_file, 'w') or die("can't open file");

$text_contents = "app:$APP_ID; user:$APP_OWNER; l:$APP_LANG\n*****************\n";
foreach( $all_shows as $show ){
	$text_contents .= $show . "\n";
}
fwrite($fh, $text_contents);
fclose($fh);

echo "file written";
?>
	
	
