<?php

class LocController
{
	/**
	 * @url GET /
	 */
	public function index()
	{
		if($_GET['f'] == 'alsoBoot(') {
			echo 'alsoBoot();';
		}
		
	}
	
}