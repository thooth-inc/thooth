// -------------------------------------------------------------------
/*

Copyright (c) 2008, Rainer Blome

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are
met:

- Redistributions of source code must retain the above copyright
  notice, this list of conditions and the following disclaimer.

- Redistributions in binary form must reproduce the above copyright
  notice, this list of conditions and the following disclaimer in the
  documentation and/or other materials provided with the distribution.

- Neither the name(s) of the copyright holder(s), nor the names of any
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
"AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

// -------------------------------------------------------------------
function assert(cond) {
    if (true !== cond && false !== cond) {
        alert("Bad argument to assert: '"+cond.toString()+"'");
        return;
    }
    if (!cond) {
        alert("Assertion failed.");
    }
}

// -------------------------------------------------------------------
function browser_language()
{
    return undefined != navigator.userLanguage ? navigator.userLanguage
    : undefined != navigator.language ? navigator.language
    : undefined != navigator.browserLanguage ? navigator.browserLanguage
    : undefined != navigator.systemLanguage ? navigator.systemLanguage
    : (alert("Could not determine language to use"), undefined);
}

// -------------------------------------------------------------------
i18n.debugtext= function()
{
    var text= "";

    text= text+
    ' lang='    +navigator.language
    //for netscape flavored browsers
    //+' appName=' +navigator.appName
    //for IE
    +' usrLang=' +navigator.userLanguage
    +' brwsLang='+navigator.browserLanguage
    +' sysLang=' +navigator.systemLanguage
    ;
    text= "[For debugging: Langs: Effective="+i18n.language_name
    +" &nbsp; "+text+"]";
    text= text+" Browser=: "+browser_language();

    return text;
}

// -------------------------------------------------------------------
/** Sets the global translation table (i18n.language) to the translation
    table with the given name (looked up in the i18n object). If no
    matching translation table was found, the global translation table
    is not changed.  */

i18n.setlanguage= function(newlangname) {
    var newlang= i18n[newlangname];
    // If not found, try matching just the first two chars
    if (undefined == newlang) {
        newlangname= newlangname.substring(0,2).toLowerCase();
        newlang= i18n[newlangname];
    }
    if (undefined != newlang) {
        i18n.language_name= newlangname;
        i18n.language= newlang;
    }
    else i18n.language = undefined;
}

// -------------------------------------------------------------------
// param added by jeff to only display spans, etc on pages that allow changing lang
// dont need all the extra stuff if not changeable
i18n.canChange=false;
// -------------------------------------------------------------------


// -------------------------------------------------------------------
// FIXME: This should be set based on the user's preferences,
// initially indicated by the browser.

// FIXME: Allow interactive switching of language.

i18n.init= function()
{
    if (undefined == i18n.language)
    {
        var lang;
        try { lang= getCookie("ws_lang"); } catch(e) {}
        if (undefined == lang || false == lang) {
            lang= browser_language();
        }
        i18n.setlanguage(lang);
    }
    // i dont like the way i did this, but right now it works for testing
    try{if(location.href.indexOf("search.html") > -1 || location.href.indexOf("profile.html") >-1 || location.href.indexOf("index.html") >-1 || location.href.indexOf("translate.html") >-1) {i18n.canChange = true;}else {i18n.canChange = false;}}catch(sl_ex){}
}
i18n.init();


// -------------------------------------------------------------------
/**  Jeff adding vars/function to translate on the fly when language is changed
    20080624
*/

var i18n_arr = new Array();
var i18n_timer=false;

function xlateOnFly(lang)
{
    
    var table = eval("i18n." + lang);

    // To support switching to the default language, we loop even
    // if "table" is not defined.
    for (var ii=0; ii<i18n_arr.length; ii++) {
        var e= i18n_arr[ii];
        if ('function' === typeof(e)) {
            //alert("updating via closure:"+e);
            e(); continue;
        }
        if (!e.i_args) {
            if (document.getElementById("i18n_"+ii)) {
                document.getElementById("i18n_"+ii).innerHTML = gettextt(e.i_id, table);
            }
        }
        else {
            var args= e.i_args;
            if (args.id && args.param) {
                if (document.getElementById(args.id)) {
                    eval("document.getElementById('" + args.id + "')." +
                         args.param + "='"+(args.pre ? args.pre : "")+"'"+
                         "+gettextt(e.i_id, table)+"+
                         "'"+(args.post ? args.post : "")+"'");
                }
            }
        }
    }
}

// -------------------------------------------------------------------
/** In the given translation table, looks up the message with the
    given id.  "gettextt" stands for "get text from table".

    @return the message text, if a matching message is found.
    Otherwise returns the id.

    @param id - a key identifying the message, usually the message
    text in the default language, for example English.
*/
function gettextt(id, table)
{
    var text= id;
    if (table) {
        var lookedup= table[id];
        if (undefined !== lookedup &&
            lookedup != "" &&
            lookedup != id )
        {
            text= lookedup;
        }
    }

    return text;
}

// -------------------------------------------------------------------
/** Like "gettextt", but looks up the message in the current global
    translation table (value of i18n.language).
*/
function gettext(id) {
    return gettextt(id, i18n.language);
}

// -------------------------------------------------------------------
function gettexta(id, args) {
    assert('function' !== typeof(id));
    var text= gettext(id);
    i18n_arr.push({ i_id: id, i_args: args });
    return text;
}

// -------------------------------------------------------------------
/** CAUTION: This function produces a new span every time it is
    called, even if the call has been already made for the call
    location. Call this only for persistent DOM elements.  Prefer not
    to call this for transient elements such as list elements that are
    recreated every time that they become visible.  Alternatively,
    store the mementos in a table instead of in an array and use id
    and arguments as the key instead of simply the array index.  */
function getspan(msg) {
    assert('string' === typeof(msg));
    var span_id= "i18n_"+i18n_arr.length.toString();
    var text= "<span id='"+span_id+"'>"+gettext(msg)+"</span>";
    i18n_arr.push({ i_id: msg, i_args: false });
    return text;
}

// -------------------------------------------------------------------
/** When the translation table is changed on the fly, we need to
    format newly translated messages using the original sprintf call.
    We achieve this by moving the sprintf call into a closure
    and pass that closure to getspanc.
    */
function getspanc(closure) {
    assert("function" === typeof(closure));
    var span_id= "i18n_"+i18n_arr.length.toString();
    var text= "<span id='"+span_id+"'>"+closure()+"</span>";
    var updater= function() {
        var e= document.getElementById(span_id);
        if (e) { e.innerHTML= closure(); }
    };
    i18n_arr.push(updater);
    //alert("pushed closure:"+closure);
    return text;
}

// -------------------------------------------------------------------
/** getspanf("Hello %s", name);  is equivalent to
    getspanc(function () { return sprintf(gettext("Hello %s", name)); });
*/
function getspanf(msgf) {
    var args= $A(arguments).slice(1); // $A converts to a real array
    return getspanc(function () {
            args.unshift(gettext(msgf));
            //return sprintf.apply(null, args);
            var result= sprintf.apply(null, args);
            args.shift();
            return result;
        });
}

// -------------------------------------------------------------------
/** In the current translation table, looks up the message with the
    given id.  If one is found, replaces the content of the element
    with the given id with the translated message.

    FIXME: This is currently not implemented, args are ignored:
    Formats the message using the given arguments.
*/

function xlate(id, args) {
    var text= getspan(id, args);

    // If the replacement is the same as the id, this means that
    // either there was no translation found, in which case we
    // leave the element content as it is, or that the translation is the
    // same as the id, in which case there is no need to replace
    // the content either.
    //if (id != text) { document.getElementById(id).innerHTML = text; }

    // For now, we unconditionally set the innerHTML.  This allows
    // us to leave the tag's contents empty in the HTML file.
    var elt= document.getElementById(id);
    if (undefined == elt) { alert("Could not find element with id '"+id+"'."); }
    else { elt.innerHTML = text; }
}

// -------------------------------------------------------------------
/*
Other ways of changing document text to check out:
var form_elements = document.getElementById(which_div).getElementsByTagName("textarea");
document.getElementById("json-script-output").innerHTML =
 "<div id=\"json-error-message\">" + json_profile.message + "</div>";
*/

// -------------------------------------------------------------------
// EOF
