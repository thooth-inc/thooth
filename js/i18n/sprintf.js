// ===================================================================
// @file sprintf.js - An incomplete sprintf implementation in ECMAScript

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

// This implementation has its roots in Jan Moesen's code found in
// http://jan.moesen.nu/code/javascript/sprintf-and-printf-in-javascript/
// Jan placed his version in the public domain, but this file is
// copyrighted, see above.

// Changes by Rainer Blome:
// o Added support for positional arguments ("%3$s").
// o Fixed: Avoided reparsing the entire string after each substitution.
// o Fixed: No substitution is attempted when no argument matches the position.
// o Detects invalid format specifier
// o Fixed: Padding character is now set correctly.
// o Style: Untabified, added missing braces, better debugging support
// o If regular expressions are not supported, returns the joined arguments.
// ToDo:
// o Implement padding
// o Implement justification
// o Implement field width
// o Log type errors
// o We only need %s and maybe %d and %f, so remove the rest.
// o Run it with JSlint

// FIXME: Get rid of dependency on $A
//alert("typeof($A)='"+typeof($A)+"'");
if ("undefined" == typeof($A)) {
    /** Copied from prototype.js */
    function $A(iterable) {
        if ( ! iterable) { return []; }
        if (iterable.toArray) { return iterable.toArray(); }
        var length = iterable.length || 0;
        var result = new Array(length);
        while (length--) { result[length] = iterable[length]; }
        return result;
    }
    if ("function" !== typeof($A)) {
        alert("Failed to define function $A (typeof($A)='"+typeof($A)+"')");
    }
}
{
    var $A_test= function(a0, a1, a2) {
        var ctx= "$A_test";
        //alert("typeof(arguments)='"+typeof(arguments)+"'");
        var a= $A(arguments);
        //alert("typeof(a)='"+typeof(a)+"'");
        a[0]===a0 || alert(ctx+": a[0]!==a0 (a[0]='"+a[0]+"', a0='"+a0+"')");
        a[1]===a1 || alert(ctx+": a[1]!==a1 (a[1]='"+a[1]+"', a1='"+a1+"')");
        a[2]===a2 || alert(ctx+": a[2]!==a2 (a[2]='"+a[2]+"', a2='"+a2+"')");
    };
    $A_test(3, "foo", 5);
}

function sprintf()
{
    if (!arguments || arguments.length < 1) { return; }
    var ctx= "sprintf";
    var str = arguments[0];
    if ( ! RegExp) { return $A(arguments).join(", "); }
    // Placeholder syntax, roughly:
    // %[POS$][PADDING][-][WIDTH][.PRECISION]TYPE
    var re = /([^%]*)%(?:(\d+)\$)?(\'.|0|\x20)?(-)?(\d+)?(\.\d+)?(%|b|c|d|u|f|o|s|x|X)(.*)/;
    var a = [];
    //var b = [];
    var numSubstitutions = 0;
    var numMatches = 0;
    var result= "";
    var mylog= false;

    while (a = re.exec(str))
    {
        //mylog && mylog(ctx+": result='"+result+"'");
        mylog && mylog(ctx+": rest='"+str+"'");
        var leftpart = a[1];
        var pPos = a[2];
        var pPad = a[3], pJustify = a[4], pMinLength = a[5];
        var pPrecision = a[6], pType = a[7], rightPart = a[8];
/*
        mylog && mylog(ctx+": a='"+a+"'\n"+'\n' +
        //a[0],
        "left='"+leftpart+"'"+"\n"+
        " pos="+pPos+"\n"+
        " pad="+pPad+"\n"+
        " justify="+pJustify+"\n"+
        " minLength="+pMinLength+"\n"+
        " precision="+pPrecision+"\n"+
        " type="+pType+"\n"+
        " rightpart='"+rightPart+"'");
*/
        numMatches++;
        if (pType == '%')
        {
            subst = '%';
        }
        else
        {
            if (undefined === pPos) {
                pPos= ++numSubstitutions;
                mylog && mylog(ctx+": pPos1="+pPos+" (implicit)");
            }
            else {
                pPos= parseInt(pPos);
                mylog && mylog(ctx+": pPos="+pPos+" (explicit)");
            }
            //mylog && mylog(ctx+": pPos="+pPos);
            if (pPos >= arguments.length) {
                mylog && mylog(ctx+": Error: Format string specified argument "+
                      pPos+", which has not been given (there are " +
                      (arguments.length - 1) +
                      " actual args, excluding the format string).");
                // Substitute the placeholder itself, effectively keeping it
                subst= str.substr(leftpart.length,
                                  str.length - leftpart.length - rightPart.length);
            }
            else {
                var param = arguments[pPos];

/*
                // FIXME: The pad value is never used
                var pad = '';
                if (pPad && pPad.substr(0,1) == "'") {
                    // What was this supposed to do?:
                    //pad = leftpart.substr(1,1);
                    // This must be what was meant:
                    pad = pPad.substr(1,1);
                }
                else {
                    if (pPad) { pad = pPad; }
                }

                var justifyRight = true;
                if (pJustify && pJustify === "-") {
                    justifyRight = false;
                }

               var minLength = -1;
                if (pMinLength) {
                    minLength = parseInt(pMinLength);
                }

*/
                var precision = -1;
                if (pPrecision && pType == 'f') {
                    precision = parseInt(pPrecision.substring(1));
                }

                var subst = param;
                if ('s' === pType) { }
/*
                else if (pType == 'b') {
                    // FIXME: Log type errors
                    subst = parseInt(param).toString(2);
                }
                else if (pType == 'c') {
                    // FIXME: Log type errors
                    subst = String.fromCharCode(parseInt(param));
                }
*/
                else if (pType == 'd') {
                    // FIXME: Log type errors
                    subst = parseInt(param) ? parseInt(param) : 0;
                }
/*
                else if (pType == 'u') {
                    subst = Math.abs(param);
                }
*/
                else if (pType == 'f') {
                    // FIXME: Log type errors
                    subst = (precision > -1) ?
                        Math.round(parseFloat(param) * Math.pow(10, precision))
                        / Math.pow(10, precision)
                        : parseFloat(param);
                }
/*
                else if (pType == 'o') {
                    // FIXME: Log type errors
                    subst = parseInt(param).toString(8);
                }
                else if (pType == 'x') {
                    // FIXME: Log type errors
                    subst = ('' + parseInt(param).toString(16)).toLowerCase();
                }
                else if (pType == 'X') {
                    // FIXME: Log type errors
                    subst = ('' + parseInt(param).toString(16)).toUpperCase();
                }
*/
                else {
                    mylog && mylog(ctx+": Error: Invalid format specifier '"+pType+"'");
                    subst= param;
                }
            }
        }
        result+= leftpart + subst;
        str= rightPart;
    }
    result+= str;
    //str= "";
    mylog && mylog(ctx+": result='"+result+"'");
    mylog && mylog(ctx+": rest='"+str+"'");
    //mylog && showlog();
    return result;
}

// ===================================================================
