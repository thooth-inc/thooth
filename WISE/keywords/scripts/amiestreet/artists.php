<?php

/*
APP SCRIPT CONFIG
*/

$APP_ID = "indie artist";
$APP_OWNER = "DNL";
$APP_LANG = "en";

/*****************/

$list = file_get_contents( "artists_and_urls.txt");
$list_array = explode( "\n", $list );
//trim array :(
foreach( $list_array as &$list_item ){
	$list_item_array = explode( ",",$list_item );
	$keyword = strtolower($list_item_array[0]);
	if( substr ( $keyword, 0, 3 ) == "the" ){
		$keyword = str_replace("the","", $keyword );
	}
	$list_item = trim( $keyword  );
}
	
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
	
	
