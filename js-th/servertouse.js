// server that has the server side JSON functions
var server_to_use = "https://phpstack-7093-15665-41540.cloudwaysapps.com";

/** @return a guess for the base URL that allows us to load additional files.

    This file here may be loaded from different path depths, for
    example from cool/index.html or from cool/help/overview.html (or,
    not now, but who knows if later, from
    cool/toolbar/jsdoc/html/index.html).  We need to figure out what
    the base path is so that we may find further files to be loaded.

    guess_base_url makes the following assumption:
   
    When the document location includes "cool/", that is the desired
    base directory.  If it doesn't, we assume that the base is just
    "/".

    If these assumptions are wrong, the URL must be configured
    manually.  For example when your base is
    "http://x.y.z/searchbase/", you will need to manually set
    search_server_to_use to that value, below.
*/
function guess_base_url(url) {
    // Drop any parameter list (which might contain another URL):
    url= url.replace(/\?.*$/, "");

    // Drop any file name:
    url= url.replace(/\/[^\/]*$/, "/");

    if (url.indexOf("cool/") != -1) {
	// Looks like a filesystem deployment
	// Drop anything after "cool/"
        url= url.replace(/cool\/.*$/, "cool/");
        //alert("url='"+url+"'");
    }
    else {
	// Looks like a server deployment
	// Drop anything after the hostname
	url= url.replace(/([^:]+:\/\/[^\/]+\/).*/, "$1");
    }
    return url;
}

// Base URL used to load further files
var search_server_to_use = guess_base_url(window.location.toString());

// If it does not work, fall back to this setting:
// search_server_to_use = "http://re.search.wikia.com/";
//    search_server_to_use = "http://answers.wikia.com/";

//alert("search_server_to_use='"+search_server_to_use+"'");

// Base URL to load images from
var image_server_to_use = search_server_to_use;

//profile picture directory
var profile_pictures_path = "https://phpstack-7093-15665-41540.cloudwaysapps.com/images/photos";

var i18n= {};
document.write( "<script src=\"" + search_server_to_use + "js/i18n/sprintf.js\" type=\"text/javascript\"></script>" );
document.write( "<script src=\"" + search_server_to_use + "js/i18n/i18n.js?517\" type=\"text/javascript\"></script>" );

var wise_server_to_use = "https://phpstack-7093-15665-41540.cloudwaysapps.com/WISE/ajax";
