<?php

class NowController
{
	/**
	 * @url GET /
	 */
	public function index()
	{
		if($_GET['f'] == 'itsNow(') {
			$time = time();
			if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
				$ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
			} else {
				$ip = $_SERVER['REMOTE_ADDR'];
			}
			echo "itsNow({'now':'$time','ip':'$ip'})";
		}		
	}
	
}