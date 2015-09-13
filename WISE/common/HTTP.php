<?php

/**
 * Various HTTP related functions
 */
class Http {
	static function get( $url, $timeout = 'default' ) {
		return Http::request( "GET", $url, $timeout );
	}

	static function post( $url, $timeout = 'default' ) {
		return Http::request( "POST", $url, $timeout );
	}

	/**
	 * Get the contents of a file by HTTP
	 *
	 * if $timeout is 'default', $wgHTTPTimeout is used
	 */
	static function request( $method, $url, $timeout = 'default' ) {
		global $wgHTTPTimeout;

		# Use curl if available
		if ( function_exists( 'curl_init' ) ) {
			$c = curl_init( $url );
		

			if ( $timeout == 'default' ) {
				$timeout = $wgHTTPTimeout;
			}
			curl_setopt( $c, CURLOPT_TIMEOUT, $timeout );
			curl_setopt( $c, CURLOPT_USERAGENT, "MediaWiki/$wgVersion" );
			if ( $method == 'POST' )
				curl_setopt( $c, CURLOPT_POST, true );
			else
				curl_setopt( $c, CURLOPT_CUSTOMREQUEST, $method );

	

			ob_start();
			curl_exec( $c );
			$text = ob_get_contents();
			ob_end_clean();

			# Don't return the text of error messages, return false on error
			if ( curl_getinfo( $c, CURLINFO_HTTP_CODE ) != 200 ) {
				$text = false;
			}
			# Don't return truncated output
			if ( curl_errno( $c ) != CURLE_OK ) {
				$text = false;
			}
			curl_close( $c );
		} else {
			# Otherwise use file_get_contents...
			# This may take 3 minutes to time out, and doesn't have local fetch capabilities

			global $wgVersion;
			$headers = array( "User-Agent: search.wikia.com" );
			if( strcasecmp( $method, 'post' ) == 0 ) {
				// Required for HTTP 1.0 POSTs
				$headers[] = "Content-Length: 0";
			}
			$opts = array(
				'http' => array(
					'method' => $method,
					'header' => implode( "\r\n", $headers ) ) );
			$ctx = stream_context_create($opts);

			$url_fopen = ini_set( 'allow_url_fopen', 1 );
			$text = file_get_contents( $url, false, $ctx );
			ini_set( 'allow_url_fopen', $url_fopen );
		}
		return $text;
	}


}
