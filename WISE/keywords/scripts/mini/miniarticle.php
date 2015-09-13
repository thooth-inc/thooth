<?php

/*
APP SCRIPT CONFIG
*/

$APP_ID = "miniarticle";
$APP_OWNER = "DNL";
$APP_LANG = "en";

/*****************/

$all_pages = array();

//use Mediawiki API to grab all Mini: namespace articles
function get_mini_array( $last_title = "" ){
	global $all_pages;

	if( $last_title ) $last_title_str = "&apfrom=" . $last_title;
	
	$url = "http://search.wikia.com/api.php?format=php&action=query&list=allpages&apnamespace=112&aplimit=500" . $last_title_str;

	$pages = file_get_contents( $url );
	$pages = unserialize( $pages );

	$x = 0;
	foreach ( $pages["query"]["allpages"] as $page){
		$title = str_replace( "Mini:" , "" , trim( $page["title"] ) );
		$all_pages[] = $title;
		$x++;
		
		//since the limit is 500, we need to make a recursive call starting from the title where we left off
		if( $last_title != $title && count( $pages["query"]["allpages"] ) == $x ){
			
			
			get_mini_array( $title );
		}
		
	}
	
	return false;
}

get_mini_array();
		
sort( $all_pages );

$file = "../../lists/$APP_ID.keywords";
$fh = fopen($file, 'w') or die("can't open file");

$text_contents = "";
foreach( $all_pages as $page ){
	$text_contents .= strtolower($page) . "\n";
}
fwrite($fh, $text_contents);
fclose($fh);

echo "file written";

$file = "../../lists/$APP_ID.template";
$fh = fopen($file, 'w') or die("can't open file");

$text_contents = "{category:\"$APP_ID\", user:\"$APP_OWNER\", l:\"$APP_LANG\"}";
fwrite($fh, $text_contents);
fclose($fh);
echo "template written";
?>
	
	
