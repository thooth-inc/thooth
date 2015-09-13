<?php

//ini_set("error_reporting", E_ALL ^ E_NOTICE);
ini_set("error_reporting", E_NONE);

$wgHTTPTimeout = 3;
require("../common/HTTP.php");
require("../common/AjaxDispatcher.php");
require("../common/AjaxResponse.php");
require("../common/xmltojson/xml2json.php");
require("../common/jsonify_Ajax.php");
require("../common/simple_html_dom.php");

/*
$wgMemc = new memcached( array(
				'persistant' => true,
				'compress_threshold' => 1500
			));
$wgMemc->set_servers( array( ) );
$wgMemc->set_debug( false );
*/

require("app_scripts.php");

$dispatcher = new AjaxDispatcher();
$dispatcher->performAction();
	
?>
