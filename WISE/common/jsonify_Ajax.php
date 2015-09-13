<?php

function jsonify($the_object) {
	$json = new Services_JSON();
	
	return $json->encode($the_object);
}

function unjsonify($theString){
	$json = new Services_JSON();
	
	return $json->decode($theString);
}
