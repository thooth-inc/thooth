<?php

/*
APP SCRIPT CONFIG
*/

$APP_ID = "healthterms";
$APP_OWNER = "max";
$APP_LANG = "en";

/*****************/



//$letters[]=array("a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","v","a","q","r","s","t","u","v","w","x","y","z")
for($letters="a"; $letters<="b"; $letters++)
{
	$list = $list.file_get_contents("http://health.nytimes.com/health/guides/index.html?letter=" . $letters);
}

$list_array = explode( "\n", $list );
//trim array :(
foreach( $list_array as &$list_item )$list_item = trim( $list_item);

//sort( $list_array );
$working_dir = getcwd();
$working_dir = $working_dir."/health.txt";
$file = $working_dir;	
echo $working_dir;
echo "<br>";
$fh = fopen($file, 'w') or die("can't open file");	

$text_contents = "app:$APP_ID; user:$APP_OWNER; l:$APP_LANG\n*****************\n";
foreach( $list_array as $keyword ){
	if( $keyword == "###" ) continue;
	$text_contents .= strtolower($keyword) . "\n";
}
fwrite($fh, $text_contents);
fclose($fh);

echo "file written";
?>
	
	
