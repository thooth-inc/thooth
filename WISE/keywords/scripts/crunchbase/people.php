<?php

/*
APP SCRIPT CONFIG
*/

$APP_ID = "tech people";
$APP_OWNER = "DNL";
$APP_LANG = "en";

/*****************/
$letters=array("a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","v","a","q","r","s","t","u","v","w","x","y","z");

foreach( $letters as $letter ){
	$url = "http://www.crunchbase.com/people?c=$letter";
	$html = file_get_contents( $url );
	preg_match_all("/<li><a href=\"(.*?)<\/a><\/li>/si", $html, $matches );
	foreach( $matches[0] as $company ){
		$list_array[] = trim(strip_tags($company ));
	}
}

$list_array = array_unique( $list_array );

sort( $list_array );

$file = "../../lists/" . str_replace(" ","_", $APP_ID) . ".keywords";
$fh = fopen($file, 'w') or die("can't open file");

$text_contents = "";
foreach( $list_array as $keyword ){
	if( $keyword == "" ) continue;
	$text_contents .= strtolower($keyword) . "\n";
}
fwrite($fh, $text_contents);
fclose($fh);
echo "keywords written\n";

$file = "../../lists/" . str_replace(" ","_", $APP_ID) . ".template";
$fh = fopen($file, 'w') or die("can't open file");

$text_contents = "{category:\"$APP_ID\", user:\"$APP_OWNER\", l:\"$APP_LANG\"}";
fwrite($fh, $text_contents);
fclose($fh);
echo "template written";
?>
	
	
