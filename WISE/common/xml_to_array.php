<?php
function xml_to_array($xml) {
	$fils = 0;
	$tab = false;
	$array = array();

	foreach($xml->children() as $key => $value) {
		$child = xml_to_array($value);

		//To deal with the attributes
		//foreach ($node->attributes() as $ak => $av) {
		//	$child[$ak] = (string)$av;
		//}
		//Let see if the new child is not in the array
		if ($tab == false && in_array($key, array_keys($array))) {
			//If this element is already in the array we will create an indexed array
			$tmp = $array[$key];
			$array[$key] = NULL;
			$array[$key][] = $tmp;
			$array[$key][] = $child;
			$tab = true;
		} elseif($tab == true) {
			//Add an element in an existing array
			$array[$key][] = $child;
		} else {
			//Add a simple element
			$array[$key] = $child;
		}
		$fils++;
	}

	if($fils==0) {
		return (string)$xml;
	}
	return $array;
}
