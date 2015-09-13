<?php

class NewController
{
	/**
	 * @url GET /
	 */
	public function index()
	{
		if($_GET['f'] == 'processKTN(') {
			echo 'processKTN();';
		}
		
	}
	
}