<?php
////////////////////////////////////////////////////////////////////////////////
//
// Copyright (c) 2009 Jacob Wright
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
//
////////////////////////////////////////////////////////////////////////////////

/**
 * Constants used in RestServer Class.
 */
class RestFormat
{

	const PLAIN = 'text/plain';
	const HTML = 'text/html; charset=UTF-8';
	const AMF = 'applicaton/x-amf';
	const JSON = 'application/json';
	const XML = 'application/xml';
}

/**
 * Description of RestServer
 *
 * @author jacob
 */
class RestServer
{
	public $url;
	public $method;
	public $format;
	public $cacheDir = '.';
	
	protected $mode = 'debug';
	protected $map = array();
	protected $errorClasses = array();
	protected $cached;

	/**
	 * The constructor.
	 * 
	 * @param string $mode The mode, either debug or production
	 */
	public function  __construct($mode = 'debug')
	{
		$this->mode = $mode;
	}
	
	public function  __destruct()
	{
		if ($this->mode == 'production' && !$this->cached) {
			if (function_exists('apc_store')) {
				apc_store('urlMap', $this->map);
			} else {
				file_put_contents($this->cacheDir . '/urlMap.cache', serialize($this->map));
			}
		}
	}
	
	public function refreshCache()
	{
		$this->map = array();
		$this->cached = false;
	}
	
	
	public function handle()
	{
		$this->url = $this->getPath();
		$this->method = $this->getMethod();
		$this->format = $this->getFormat();
		
		if ($this->method == 'PUT' || $this->method == 'POST') {
			$this->data = $this->getData();
		}

		$call = $this->findUrl();

		if ($call) {
			$obj = $call[0];
			if (is_string($obj)) {
				if (class_exists($obj)) {
					$obj = new $obj();
				} else {
					throw new Exception("Class $obj does not exist");
				}
			}
			$obj->server = $this;
			
			if (method_exists($obj, 'init')) {
				$obj->init();
			}
			
			$method = $call[1];

			$params = $call[2];
			
			try {
				$result = call_user_func_array(array($obj, $method), $params);
			} catch (RestException $e) {
				$this->handleError($e->getCode(), $e->getMessage());
			}
			
			if ($result !== null) {
				$this->sendData($result);
			}
		} else {
			$this->handleError(404);
		}
	}

	public function addClass($class, $basePath = '')
	{
		$this->loadCache();
		
		if (!$this->cached) {
			if (is_string($class) && !class_exists($class)){
				throw new Exception('Invalid method or class');
			} elseif (!is_string($class) && !is_object($class)) {
				throw new Exception('Invalid method or class; must be a classname or object');
			}

			if ($basePath[0] == '/') {
				$basePath = substr($basePath, 1);
			}
			if ($basePath[strlen($basePath) - 1] != '/') {
				$basePath .= '/';
			}

			$this->generateMap($class, $basePath);
		}
	}
	
	public function addErrorClass($class)
	{
		$this->errorClasses[] = $class;
	}
	
	public function handleError($statusCode, $errorMessage = null)
	{
		$method = "handle$statusCode";
		foreach ($this->errorClasses as $class) {
			if (is_object($class)) {
				$reflection = new ReflectionObject($class);
			} elseif (class_exists($class)) {
				$reflection = new ReflectionClass($class);
			}
			
			if ($reflection->hasMethod($method))
			{
				$obj = is_string($class) ? new $class() : $class;
				$obj->$method();
				return;
			}
		}
		
		$message = $this->codes[$statusCode] . ($errorMessage && $this->mode == 'debug' ? ': ' . $errorMessage : '');
		
		$this->setStatus($statusCode);
		$this->sendData(array('error' => array('code' => $statusCode, 'message' => $message)));
	}
	
	protected function loadCache()
	{
		if ($this->cached !== null) {
			return;
		}
		
		$this->cached = false;
		
		if ($this->mode == 'production') {
			if (function_exists('apc_fetch')) {
				$map = apc_fetch('urlMap');
			} elseif (file_exists($this->cacheDir . '/urlMap.cache')) {
				$map = unserialize(file_get_contents($this->cacheDir . '/urlMap.cache'));
			}
			if ($map && is_array($map)) {
				$this->map = $map;
				$this->cached = true;
			}
		} else {
			if (function_exists('apc_store')) {
				apc_delete('urlMap');
			} else {
				@unlink($this->cacheDir . '/urlMap.cache');
			}
		}
	}
	
	protected function findUrl()
	{
		$urls = $this->map[$this->method];
		if (!$urls) return null;
		
		foreach ($urls as $url => $call) {
			$args = $call[2];
			
			if (!strstr($url, ':')) {
				if ($url == $this->url) {
					if (isset($args['data'])) {
						$params = array_fill(0, $args['data'] + 1, null);
						$params[$args['data']] = $this->data;
						$call[2] = $params;
					}
					return $call;
				}
			} else {
				$regex = preg_replace('/\\\:([^\/]+)/', '(?P<$1>[^/]+)', preg_quote($url));
				if (preg_match(":^$regex$:", $this->url, $matches)) {
					$params = array();
					if (isset($args['data'])) {
						$params[$args['data']] = $this->data;
					}
					foreach ($matches as $arg => $match) {
						if (isset($args[$arg])) {
							$params[$args[$arg]] = $match;
						}
					}
					ksort($params);
					$call[2] = $params;
					return $call;
				}
			}
		}
	}

	protected function generateMap($class, $basePath = '')
	{
		if (is_object($class)) {
			$reflection = new ReflectionObject($class);
		} elseif (class_exists($class)) {
			$reflection = new ReflectionClass($class);
		}
		
		$methods = $reflection->getMethods(ReflectionMethod::IS_PUBLIC);
		
		foreach ($methods as $method) {
			$doc = $method->getDocComment();
			if (preg_match_all('/@url\s+(GET|POST|PUT|DELETE|HEAD|OPTIONS)[ \t]*\/?(\S*)/s', $doc, $matches, PREG_SET_ORDER)) {

				$params = $method->getParameters();
				
				foreach ($matches as $match) {
					$httpMethod = $match[1];
					$url = $basePath . $match[2];
					if ($url[strlen($url) - 1] == '/') {
						$url = substr($url, 0, -1);
					}
					$call = array($class, $method->getName());
					$args = array();
					foreach ($params as $param) {
						$args[$param->getName()] = $param->getPosition();
					}
					$call[] = $args;

					$this->map[$httpMethod][$url] = $call;
				}
			}
		}
	}

	public function getPath()
	{
		$path = substr(preg_replace('/\?.*$/', '', $_SERVER['REQUEST_URI']), 1);
		if ($path[strlen($path) - 1] == '/') {
			$path = substr($path, 0, -1);
		}
		return $path;
	}
	
	public function getMethod()
	{
		$method = $_SERVER['REQUEST_METHOD'];
		if ($method == 'POST' && isset($_GET['method']) && $_GET['method'] == 'PUT') {
			$method = 'PUT';
		} elseif ($method == 'POST' && isset($_GET['method']) && $_GET['method'] == 'DELETE') {
			$method = 'DELETE';
		}
		return $method;
	}
	
	public function getFormat()
	{
		$format = RestFormat::PLAIN;
		$accept = explode(',', $_SERVER['HTTP_ACCEPT']);
		if (in_array(RestFormat::AMF, $accept) || (isset($_GET['format']) && $_GET['format'] == 'amf')) {
			$format = RestFormat::AMF;
		} elseif (in_array(RestFormat::XML, $accept) || (isset($_POST['xml']) && $_POST['xml'] == 'true') || (isset($_GET['xml']) && $_GET['xml'] == 'true')) {
			$format = RestFormat::XML;
		} elseif (in_array(RestFormat::JSON, $accept)) {
			$format = RestFormat::JSON;
		}
		return $format;
	}
	
	public function getData()
	{
		$data = file_get_contents('php://input');

		if ($this->format == RestFormat::AMF) {
			require_once 'Zend/Amf/Parse/InputStream.php';
			require_once 'Zend/Amf/Parse/Amf3/Deserializer.php';
			$stream = new Zend_Amf_Parse_InputStream(substr($data, 1));
			$deserializer = new Zend_Amf_Parse_Amf3_Deserializer($stream);
			$data = $deserializer->readTypeMarker();
		} else {
			$data = json_decode($data);
		}
		
		return $data;
	}

	public function sendData($data)
	{
		header('Content-Type: ' . $this->format);

		if ($this->format == RestFormat::AMF) {
			require_once 'Zend/Amf/Parse/OutputStream.php';
			require_once 'Zend/Amf/Parse/Amf3/Serializer.php';
			$stream = new Zend_Amf_Parse_OutputStream();
			$serializer = new Zend_Amf_Parse_Amf3_Serializer($stream);
			$serializer->writeTypeMarker($data);
			$data = $stream->getStream();
		} else if ($this->format == RestFormat::XML) {
			$data = ArrayToXML::toXml($data);
		} else {
			$data = json_encode($data);
			if ($data && $this->mode == 'debug') {
				$data 	= $this->json_format($data);
				$mathes	= array();
				$pattern	= '/"new Date\([0-9\,\s]*\)"/';
				$matches	= array();
				preg_match_all($pattern, $data, $matches);
				$matches=$matches[0];
				foreach($matches as $match){
					$tmpStrLen	= strlen($match);
					$tmpStr		= substr($match, 1, ($tmpStrLen-2));
					$data			= str_replace($match, $tmpStr, $data);
				}
			}
		}
		echo $data;
	}

	public function setStatus($code)
	{
		$message = $this->codes[strval($code)];
		header("{$_SERVER['SERVER_PROTOCOL']} $code $message");
	}
	
	// Pretty print some JSON
	private function json_format($json)
	{
		$tab = "  ";
		$new_json = "";
		$indent_level = 0;
		$in_string = false;
		
		$len = strlen($json);
		
		for($c = 0; $c < $len; $c++) {
			$char = $json[$c];
			switch($char) {
				case '{':
				case '[':
					if(!$in_string) {
						$new_json .= $char . "\n" . str_repeat($tab, $indent_level+1);
						$indent_level++;
					} else {
						$new_json .= $char;
					}
					break;
				case '}':
				case ']':
					if(!$in_string) {
						$indent_level--;
						$new_json .= "\n" . str_repeat($tab, $indent_level) . $char;
					} else {
						$new_json .= $char;
					}
					break;
				case ',':
					if(!$in_string) {
						$new_json .= ",\n" . str_repeat($tab, $indent_level);
					} else {
						$new_json .= $char;
					}
					break;
				case ':':
					if(!$in_string) {
						$new_json .= ": ";
					} else {
						$new_json .= $char;
					}
					break;
				case '"':
					if($c > 0 && $json[$c-1] != '\\') {
						$in_string = !$in_string;
					}
				default:
					$new_json .= $char;
					break;					
			}
		}
		
		return $new_json;
	}


	private $codes = array(
		'100' => 'Continue',
		'200' => 'OK',
		'201' => 'Created',
		'202' => 'Accepted',
		'203' => 'Non-Authoritative Information',
		'204' => 'No Content',
		'205' => 'Reset Content',
		'206' => 'Partial Content',
		'300' => 'Multiple Choices',
		'301' => 'Moved Permanently',
		'302' => 'Found',
		'303' => 'See Other',
		'304' => 'Not Modified',
		'305' => 'Use Proxy',
		'307' => 'Temporary Redirect',
		'400' => 'Bad Request',
		'401' => 'Unauthorized',
		'402' => 'Payment Required',
		'403' => 'Forbidden',
		'404' => 'Not Found',
		'405' => 'Method Not Allowed',
		'406' => 'Not Acceptable',
		'409' => 'Conflict',
		'410' => 'Gone',
		'411' => 'Length Required',
		'412' => 'Precondition Failed',
		'413' => 'Request Entity Too Large',
		'414' => 'Request-URI Too Long',
		'415' => 'Unsupported Media Type',
		'416' => 'Requested Range Not Satisfiable',
		'417' => 'Expectation Failed',
		'500' => 'Internal Server Error',
		'501' => 'Not Implemented',
		'503' => 'Service Unavailable'
	);
}

class RestException extends Exception
{
	
	public function __construct($code, $message = null)
	{
		parent::__construct($message, $code);
	}
	
}

class ArrayToXML
{
    /**
     * The main function for converting to an XML document.
     * Pass in a multi dimensional array and this recrusively loops through and builds up an XML document.
     *
     * @param array $data
     * @param string $rootNodeName - what you want the root node to be - defaultsto data.
     * @param SimpleXMLElement $xml - should only be used recursively
     * @return string XML
     */
    public static function toXml($data, $rootNodeName = 'data', &$xml=null)
    {
        // turn off compatibility mode as simple xml throws a wobbly if you don't.
        if (ini_get('zend.ze1_compatibility_mode') == 1)
        {
            ini_set ('zend.ze1_compatibility_mode', 0);
        }

        if (is_null($xml))
        {
            $xml = simplexml_load_string("<?xml version='1.0' encoding='utf-8'?><$rootNodeName />");
        }

        // loop through the data passed in.
        foreach($data as $key => $value)
        {
            // if numeric key, assume array of rootNodeName elements
            if (is_numeric($key))
            {
                $key = $rootNodeName;
            }

            // delete any char not allowed in XML element names
            $key = preg_replace('/[^a-z0-9\-\_\.\:]/i', '', $key);

            // if there is another array found recrusively call this function
            if (is_array($value))
            {
                // create a new node unless this is an array of elements
                $node = ArrayToXML::isAssoc($value) ? $xml->addChild($key) : $xml;

                // recrusive call - pass $key as the new rootNodeName
                ArrayToXML::toXml($value, $key, $node);
            }
            else
            {
                // add single node.
                $value = htmlentities($value);
                $xml->addChild($key,$value);
            }

        }
        // pass back as string. or simple xml object if you want!
        return $xml->asXML();
    }

    // determine if a variable is an associative array
    public static function isAssoc( $array ) {
        return (is_array($array) && 0 !== count(array_diff_key($array, array_keys(array_keys($array)))));
    }
}
