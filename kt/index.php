<?php

function __autoload($class_name) {
    include $class_name . '.php';
}
//spl_autoload_register(); // don't load our classes unless we use them

$mode = 'debug'; // 'debug' or 'production'
$server = new RestServer($mode);

//$server->refreshCache(); // uncomment momentarily to clear the cache if classes change in production mode

$server->addClass('NowController', '/kt/now.js');
$server->addClass('KtController', '/kt/kt.js');
$server->addClass('UserController', '/kt/user.js');
$server->addClass('TupleController', '/kt/tuple.js');
$server->addClass('LocController', '/kt/loc.js');
$server->addClass('BrowseController', '/kt/browse.js');
$server->addClass('NewController', '/kt/new.js');

$server->handle();