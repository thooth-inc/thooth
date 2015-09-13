<?php

/*
APP SCRIPT CONFIG
*/

$APP_ID = "acronym";
$APP_OWNER = "DNL";
$APP_LANG = "en";

/*****************/

$list = file_get_contents( "http://www.acronymfinder.com/~/app/api/wikia.ashx?list");
$list_array = explode( "\n", $list );
//trim array :(
foreach( $list_array as &$list_item )$list_item = trim( $list_item);
	
sort( $list_array );

$file = "../../lists/$APP_ID.keywords";
$fh = fopen($file, 'w') or die("can't open file");

$text_contents = "";
foreach( $list_array as $keyword ){
	if( $keyword == "" || $keyword == "###" ) continue;
	$text_contents .= strtolower($keyword) . "\n";
}
fwrite($fh, $text_contents);
fclose($fh);
echo "keywords written\n";

$file = "../../lists/$APP_ID.template";
$fh = fopen($file, 'w') or die("can't open file");

$text_contents = "{category:\"$APP_ID\", user:\"$APP_OWNER\", l:\"$APP_LANG\"}";
fwrite($fh, $text_contents);
fclose($fh);
echo "template written";
?>
	
	
