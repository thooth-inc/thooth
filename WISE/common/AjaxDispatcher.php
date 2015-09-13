<?php
/**
 * @defgroup Ajax Ajax
 *
 * @file
 * @ingroup Ajax
 * Handle ajax requests and send them to the proper handler.
 */

/**
 * Object-Oriented Ajax functions.
 * @ingroup Ajax
 */
class AjaxDispatcher {
	/** The way the request was made, either a 'get' or a 'post' */
	private $expire;

	private $contentType;
	
	/** The way the request was made, either a 'get' or a 'post' */
	private $mode;

	/** Name of the requested handler */
	private $func_name;

	/** Arguments passed */
	private $args;

	/** Load up our object with user supplied data */
	function __construct() {
	
		if (! empty($_GET["expire"])) {
			$this->expire = $_GET["expire"];
		}
		if (! empty($_GET["content-type"])) {
			$this->contentType = $_GET["content-type"];
		}

		
		$this->mode = "";

		if (! empty($_GET["rs"])) {
			$this->mode = "get";
		}

		if (!empty($_POST["rs"])) {
			$this->mode = "post";
		}

		switch( $this->mode ) {

		case 'get':
			$this->func_name = isset( $_GET["rs"] ) ? $_GET["rs"] : '';
			if (! empty($_GET["rsargs"])) {
				$this->args = $_GET["rsargs"];
			} else {
				$this->args = array();
			}
		break;

		case 'post':
			$this->func_name = isset( $_POST["rs"] ) ? $_POST["rs"] : '';
			if (! empty($_POST["rsargs"])) {
				$this->args = $_POST["rsargs"];
			} else {
				$this->args = array();
			}
		break;


		}

	
	}

	/** Pass the request to our internal function.
	 * BEWARE! Data are passed as they have been supplied by the user,
	 * they should be carefully handled in the function processing the
	 * request.
	 */
	function performAction() {
		global $wgAjaxExportList;

		if ( empty( $this->mode ) ) {
			return;
		}
	
		if (! in_array( $this->func_name, $wgAjaxExportList ) ) {
			header( "HTTP/1.0 400 Bad Request" );
			header( "Status: 400 Bad Request" );
			header( 'Content-type: text/html; charset=utf-8' );
			print "<!DOCTYPE HTML PUBLIC \"-//IETF//DTD HTML 2.0//EN\">".
				"<html><head><title>" .
				htmlspecialchars( "Bad Request" ) .
				"</title></head><body><h1>" .
				htmlspecialchars( "Bad Request" ) .
				"</h1><p>" .
				nl2br( htmlspecialchars( "unknown function " . (string) $this->func_name ) ) .
				"</p></body></html>\n";
		}else{
			if ( strpos( $this->func_name, '::' ) !== false ) {
				$func = explode( '::', $this->func_name, 2 );
			} else {
				$func = $this->func_name;
			}
			try {
				$result = call_user_func_array($func, $this->args);
	
				if ( $result === false || $result === NULL ) {
				
				}
				else {
					
					if ( is_string( $result ) ) {
						$result= new AjaxResponse( $result );
					}
					if( $this->contentType ){
						$result->setContentType( $this->contentType );
					}
					$result->sendHeaders( $this->expire, $this->contentType );
					$result->printText();
	
				}
	
			} catch (Exception $e) {
				wfDebug( __METHOD__ . ' ERROR while dispatching ' 
						. $this->func_name . "(" . var_export( $this->args, true ) . "): " 
						. get_class($e) . ": " . $e->getMessage() . "\n" );
	
				if (!headers_sent()) {
					wfHttpError( 500, 'Internal Error',
						$e->getMessage() );
				} else {
					print $e->getMessage();
				}
			}
		}
		
	}
}
