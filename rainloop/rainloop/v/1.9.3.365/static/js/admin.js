/* RainLoop Webmail (c) RainLoop Team | Licensed under RainLoop Software License */
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "rainloop/v/0.0.0/static/js/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!**********************!*\
  !*** ./dev/admin.js ***!
  \**********************/
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(/*! bootstrap */ 78)(__webpack_require__(/*! App/Admin */ 18));

/***/ },
/* 1 */
/*!*****************************!*\
  !*** ./dev/Common/Utils.js ***!
  \*****************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			oEncryptObject = null,

			Utils = {},

			window = __webpack_require__(/*! window */ 10),
			_ = __webpack_require__(/*! _ */ 2),
			$ = __webpack_require__(/*! $ */ 11),
			ko = __webpack_require__(/*! ko */ 3),
			Autolinker = __webpack_require__(/*! Autolinker */ 80),
			JSEncrypt = __webpack_require__(/*! JSEncrypt */ 81),

			Mime = __webpack_require__(/*! Common/Mime */ 55),

			Enums = __webpack_require__(/*! Common/Enums */ 4),
			Globals = __webpack_require__(/*! Common/Globals */ 8)
		;

		Utils.trim = $.trim;
		Utils.inArray = $.inArray;
		Utils.isArray = _.isArray;
		Utils.isObject = _.isObject;
		Utils.isFunc = _.isFunction;
		Utils.isUnd = _.isUndefined;
		Utils.isNull = _.isNull;
		Utils.emptyFunction = function () {};

		/**
		 * @param {*} oValue
		 * @return {boolean}
		 */
		Utils.isNormal = function (oValue)
		{
			return !Utils.isUnd(oValue) && !Utils.isNull(oValue);
		};

		Utils.windowResize = _.debounce(function (iTimeout) {
			if (Utils.isUnd(iTimeout))
			{
				Globals.$win.resize();
			}
			else
			{
				window.setTimeout(function () {
					Globals.$win.resize();
				}, iTimeout);
			}
		}, 50);

		Utils.windowResizeCallback = function () {
			Utils.windowResize();
		};

		/**
		 * @param {(string|number)} mValue
		 * @param {boolean=} bIncludeZero
		 * @return {boolean}
		 */
		Utils.isPosNumeric = function (mValue, bIncludeZero)
		{
			return Utils.isNormal(mValue) ?
				((Utils.isUnd(bIncludeZero) ? true : !!bIncludeZero) ?
					(/^[0-9]*$/).test(mValue.toString()) :
					(/^[1-9]+[0-9]*$/).test(mValue.toString())) :
				false;
		};

		/**
		 * @param {*} iValue
		 * @param {number=} iDefault = 0
		 * @return {number}
		 */
		Utils.pInt = function (iValue, iDefault)
		{
			var iResult = Utils.isNormal(iValue) && '' !== iValue ? window.parseInt(iValue, 10) : (iDefault || 0);
			return window.isNaN(iResult) ? (iDefault || 0) : iResult;
		};

		/**
		 * @param {*} mValue
		 * @return {string}
		 */
		Utils.pString = function (mValue)
		{
			return Utils.isNormal(mValue) ? '' + mValue : '';
		};

		/**
		 * @param {*} mValue
		 * @return {boolean}
		 */
		Utils.pBool = function (mValue)
		{
			return !!mValue;
		};

		/**
		 * @param {string} sComponent
		 * @return {string}
		 */
		Utils.encodeURIComponent = function (sComponent)
		{
			return window.encodeURIComponent(sComponent);
		};

		/**
		 * @param {*} aValue
		 * @return {boolean}
		 */
		Utils.isNonEmptyArray = function (aValue)
		{
			return Utils.isArray(aValue) && 0 < aValue.length;
		};

		/**
		 * @param {string} sQueryString
		 * @return {Object}
		 */
		Utils.simpleQueryParser = function (sQueryString)
		{
			var
				oParams = {},
				aQueries = [],
				aTemp = [],
				iIndex = 0,
				iLen = 0
			;

			aQueries = sQueryString.split('&');
			for (iIndex = 0, iLen = aQueries.length; iIndex < iLen; iIndex++)
			{
				aTemp = aQueries[iIndex].split('=');
				oParams[window.decodeURIComponent(aTemp[0])] = window.decodeURIComponent(aTemp[1]);
			}

			return oParams;
		};

		/**
		 * @param {string} sMailToUrl
		 * @param {Function} PopupComposeVoreModel
		 * @return {boolean}
		 */
		Utils.mailToHelper = function (sMailToUrl, PopupComposeVoreModel)
		{
			if (sMailToUrl && 'mailto:' === sMailToUrl.toString().substr(0, 7).toLowerCase())
			{
				if (!PopupComposeVoreModel)
				{
					return true;
				}

				sMailToUrl = sMailToUrl.toString().substr(7);

				var
					aTo = [],
					aCc = null,
					aBcc = null,
					oParams = {},
					EmailModel = __webpack_require__(/*! Model/Email */ 28),
					sEmail = sMailToUrl.replace(/\?.+$/, ''),
					sQueryString = sMailToUrl.replace(/^[^\?]*\?/, ''),
					fParseEmailLine = function (sLine) {
						return sLine ? _.compact(_.map(window.decodeURIComponent(sLine).split(/[,]/), function (sItem) {
							var oEmailModel = new EmailModel();
							oEmailModel.mailsoParse(sItem);
							return '' !== oEmailModel.email ? oEmailModel : null;
						})) : null;
					}
				;

				aTo = fParseEmailLine(sEmail);

				oParams = Utils.simpleQueryParser(sQueryString);

				if (!Utils.isUnd(oParams.cc))
				{
					aCc = fParseEmailLine(window.decodeURIComponent(oParams.cc));
				}

				if (!Utils.isUnd(oParams.bcc))
				{
					aBcc = fParseEmailLine(window.decodeURIComponent(oParams.bcc));
				}

				__webpack_require__(/*! Knoin/Knoin */ 5).showScreenPopup(PopupComposeVoreModel, [Enums.ComposeType.Empty, null,
					aTo, aCc, aBcc,
					Utils.isUnd(oParams.subject) ? null :
						Utils.pString(window.decodeURIComponent(oParams.subject)),
					Utils.isUnd(oParams.body) ? null :
						Utils.plainToHtml(Utils.pString(window.decodeURIComponent(oParams.body)))
				]);

				return true;
			}

			return false;
		};

		/**
		 * @param {string} sPublicKey
		 * @return {JSEncrypt}
		 */
		Utils.rsaObject = function (sPublicKey)
		{
			if (JSEncrypt && sPublicKey && (null === oEncryptObject || (oEncryptObject && oEncryptObject.__sPublicKey !== sPublicKey)) &&
				window.crypto && window.crypto.getRandomValues)
			{
				oEncryptObject = new JSEncrypt();
				oEncryptObject.setPublicKey(sPublicKey);
				oEncryptObject.__sPublicKey = sPublicKey;
			}
			else
			{
				oEncryptObject = false;
			}

			return oEncryptObject;
		};

		/**
		 * @param {string} sValue
		 * @param {string} sPublicKey
		 * @return {string}
		 */
		Utils.rsaEncode = function (sValue, sPublicKey)
		{
			if (window.crypto && window.crypto.getRandomValues && sPublicKey)
			{
				var
					sResultValue = false,
					oEncrypt = Utils.rsaObject(sPublicKey)
				;

				if (oEncrypt)
				{
					sResultValue = oEncrypt.encrypt(Utils.fakeMd5() + ':' + sValue + ':' + Utils.fakeMd5());
					if (false !== sResultValue && Utils.isNormal(sResultValue))
					{
						return 'rsa:xxx:' + sResultValue;
					}
				}
			}

			return sValue;
		};

		Utils.rsaEncode.supported = !!(window.crypto && window.crypto.getRandomValues && false && JSEncrypt);

		/**
		 * @param {string} sText
		 * @return {string}
		 */
		Utils.encodeHtml = function (sText)
		{
			return Utils.isNormal(sText) ? _.escape(sText.toString()) : '';
		};

		/**
		 * @param {string} sText
		 * @param {number=} iLen
		 * @return {string}
		 */
		Utils.splitPlainText = function (sText, iLen)
		{
			var
				sPrefix = '',
				sSubText = '',
				sResult = sText,
				iSpacePos = 0,
				iNewLinePos = 0
			;

			iLen = Utils.isUnd(iLen) ? 100 : iLen;

			while (sResult.length > iLen)
			{
				sSubText = sResult.substring(0, iLen);
				iSpacePos = sSubText.lastIndexOf(' ');
				iNewLinePos = sSubText.lastIndexOf('\n');

				if (-1 !== iNewLinePos)
				{
					iSpacePos = iNewLinePos;
				}

				if (-1 === iSpacePos)
				{
					iSpacePos = iLen;
				}

				sPrefix += sSubText.substring(0, iSpacePos) + '\n';
				sResult = sResult.substring(iSpacePos + 1);
			}

			return sPrefix + sResult;
		};

		Utils.timeOutAction = (function () {

			var
				oTimeOuts = {}
			;

			return function (sAction, fFunction, iTimeOut)
			{
				if (Utils.isUnd(oTimeOuts[sAction]))
				{
					oTimeOuts[sAction] = 0;
				}

				window.clearTimeout(oTimeOuts[sAction]);
				oTimeOuts[sAction] = window.setTimeout(fFunction, iTimeOut);
			};
		}());

		Utils.timeOutActionSecond = (function () {

			var
				oTimeOuts = {}
			;

			return function (sAction, fFunction, iTimeOut)
			{
				if (!oTimeOuts[sAction])
				{
					oTimeOuts[sAction] = window.setTimeout(function () {
						fFunction();
						oTimeOuts[sAction] = 0;
					}, iTimeOut);
				}
			};
		}());

		/**
		 * @param {(Object|null|undefined)} oObject
		 * @param {string} sProp
		 * @return {boolean}
		 */
		Utils.hos = function (oObject, sProp)
		{
			return oObject && window.Object && window.Object.hasOwnProperty ? window.Object.hasOwnProperty.call(oObject, sProp) : false;
		};

		/**
		 * @return {boolean}
		 */
		Utils.inFocus = function ()
		{
			if (window.document.activeElement)
			{
				if (Utils.isUnd(window.document.activeElement.__inFocusCache))
				{
					window.document.activeElement.__inFocusCache = $(window.document.activeElement).is('input,textarea,iframe,.cke_editable');
				}

				return !!window.document.activeElement.__inFocusCache;
			}

			return false;
		};

		Utils.removeInFocus = function (force)
		{
			if (window.document && window.document.activeElement && window.document.activeElement.blur)
			{
				var oA = $(window.document.activeElement);
				if (oA.is('input,textarea'))
				{
					window.document.activeElement.blur();
				}
				else if (force)
				{
					try {
						window.document.activeElement.blur();
					} catch (e) {}
				}
			}
		};

		Utils.removeSelection = function ()
		{
			if (window && window.getSelection)
			{
				var oSel = window.getSelection();
				if (oSel && oSel.removeAllRanges)
				{
					oSel.removeAllRanges();
				}
			}
			else if (window.document && window.document.selection && window.document.selection.empty)
			{
				window.document.selection.empty();
			}
		};

		/**
		 * @param {string} sPrefix
		 * @param {string} sSubject
		 * @return {string}
		 */
		Utils.replySubjectAdd = function (sPrefix, sSubject)
		{
			sPrefix = Utils.trim(sPrefix.toUpperCase());
			sSubject = Utils.trim(sSubject.replace(/[\s]+/g, ' '));

			var
				bDrop = false,
				aSubject = [],
				bRe = 'RE' === sPrefix,
				bFwd = 'FWD' === sPrefix,
				bPrefixIsRe = !bFwd
			;

			if ('' !== sSubject)
			{
				_.each(sSubject.split(':'), function (sPart) {
					var sTrimmedPart = Utils.trim(sPart);
					if (!bDrop && (/^(RE|FWD)$/i.test(sTrimmedPart) || /^(RE|FWD)[\[\(][\d]+[\]\)]$/i.test(sTrimmedPart)))
					{
						if (!bRe)
						{
							bRe = !!(/^RE/i.test(sTrimmedPart));
						}

						if (!bFwd)
						{
							bFwd = !!(/^FWD/i.test(sTrimmedPart));
						}
					}
					else
					{
						aSubject.push(sPart);
						bDrop = true;
					}
				});
			}

			if (bPrefixIsRe)
			{
				bRe = false;
			}
			else
			{
				bFwd = false;
			}

			return Utils.trim(
				(bPrefixIsRe ? 'Re: ' : 'Fwd: ') +
				(bRe ? 'Re: ' : '') +
				(bFwd ? 'Fwd: ' : '') +
				Utils.trim(aSubject.join(':'))
			);
		};

		/**
		 * @param {number} iNum
		 * @param {number} iDec
		 * @return {number}
		 */
		Utils.roundNumber = function (iNum, iDec)
		{
			return window.Math.round(iNum * window.Math.pow(10, iDec)) / window.Math.pow(10, iDec);
		};

		/**
		 * @param {(number|string)} iSizeInBytes
		 * @return {string}
		 */
		Utils.friendlySize = function (iSizeInBytes)
		{
			iSizeInBytes = Utils.pInt(iSizeInBytes);

			if (iSizeInBytes >= 1073741824)
			{
				return Utils.roundNumber(iSizeInBytes / 1073741824, 1) + 'GB';
			}
			else if (iSizeInBytes >= 1048576)
			{
				return Utils.roundNumber(iSizeInBytes / 1048576, 1) + 'MB';
			}
			else if (iSizeInBytes >= 1024)
			{
				return Utils.roundNumber(iSizeInBytes / 1024, 0) + 'KB';
			}

			return iSizeInBytes + 'B';
		};

		/**
		 * @param {string} sDesc
		 */
		Utils.log = function (sDesc)
		{
			if (window.console && window.console.log)
			{
				window.console.log(sDesc);
			}
		};

		/**
		 * @param {?} oObject
		 * @param {string} sMethodName
		 * @param {Array=} aParameters
		 * @param {number=} nDelay
		 */
		Utils.delegateRun = function (oObject, sMethodName, aParameters, nDelay)
		{
			if (oObject && oObject[sMethodName])
			{
				nDelay = Utils.pInt(nDelay);
				if (0 >= nDelay)
				{
					oObject[sMethodName].apply(oObject, Utils.isArray(aParameters) ? aParameters : []);
				}
				else
				{
					_.delay(function () {
						oObject[sMethodName].apply(oObject, Utils.isArray(aParameters) ? aParameters : []);
					}, nDelay);
				}
			}
		};

		/**
		 * @param {?} oEvent
		 */
		Utils.kill_CtrlA_CtrlS = function (oEvent)
		{
			oEvent = oEvent || window.event;
			if (oEvent && oEvent.ctrlKey && !oEvent.shiftKey && !oEvent.altKey)
			{
				var
					oSender = oEvent.target || oEvent.srcElement,
					iKey = oEvent.keyCode || oEvent.which
				;

				if (iKey === Enums.EventKeyCode.S)
				{
					oEvent.preventDefault();
					return;
				}
				else if (iKey === Enums.EventKeyCode.A)
				{
					if (oSender && ('true' === '' + oSender.contentEditable ||
						(oSender.tagName && oSender.tagName.match(/INPUT|TEXTAREA/i))))
					{
						return;
					}

					if (window.getSelection)
					{
						window.getSelection().removeAllRanges();
					}
					else if (window.document.selection && window.document.selection.clear)
					{
						window.document.selection.clear();
					}

					oEvent.preventDefault();
				}
			}
		};

		/**
		 * @param {(Object|null|undefined)} oContext
		 * @param {Function} fExecute
		 * @param {(Function|boolean|null)=} fCanExecute
		 * @return {Function}
		 */
		Utils.createCommand = function (oContext, fExecute, fCanExecute)
		{
			var
				fNonEmpty = function () {
					if (fResult && fResult.canExecute && fResult.canExecute())
					{
						fExecute.apply(oContext, Array.prototype.slice.call(arguments));
					}
					return false;
				},
				fResult = fExecute ? fNonEmpty : Utils.emptyFunction
			;

			fResult.enabled = ko.observable(true);

			fCanExecute = Utils.isUnd(fCanExecute) ? true : fCanExecute;
			if (Utils.isFunc(fCanExecute))
			{
				fResult.canExecute = ko.computed(function () {
					return fResult.enabled() && fCanExecute.call(oContext);
				});
			}
			else
			{
				fResult.canExecute = ko.computed(function () {
					return fResult.enabled() && !!fCanExecute;
				});
			}

			return fResult;
		};

		/**
		 * @param {string} sTheme
		 * @return {string}
		 */
		Utils.convertThemeName = _.memoize(function (sTheme)
		{
			if ('@custom' === sTheme.substr(-7))
			{
				sTheme = Utils.trim(sTheme.substring(0, sTheme.length - 7));
			}

			return Utils.trim(sTheme.replace(/[^a-zA-Z0-9]+/g, ' ').replace(/([A-Z])/g, ' $1').replace(/[\s]+/g, ' '));
		});

		/**
		 * @param {string} sName
		 * @return {string}
		 */
		Utils.quoteName = function (sName)
		{
			return sName.replace(/["]/g, '\\"');
		};

		/**
		 * @return {number}
		 */
		Utils.microtime = function ()
		{
			return (new window.Date()).getTime();
		};

		/**
		 * @return {number}
		 */
		Utils.timestamp = function ()
		{
			return window.Math.round(Utils.microtime() / 1000);
		};

		/**
		 *
		 * @param {string} sLanguage
		 * @param {boolean=} bEng = false
		 * @return {string}
		 */
		Utils.convertLangName = function (sLanguage, bEng)
		{
			return __webpack_require__(/*! Common/Translator */ 6).i18n('LANGS_NAMES' + (true === bEng ? '_EN' : '') + '/LANG_' +
				sLanguage.toUpperCase().replace(/[^a-zA-Z0-9]+/g, '_'), null, sLanguage);
		};

		/**
		 * @param {number=} iLen
		 * @return {string}
		 */
		Utils.fakeMd5 = function(iLen)
		{
			var
				sResult = '',
				sLine = '0123456789abcdefghijklmnopqrstuvwxyz'
			;

			iLen = Utils.isUnd(iLen) ? 32 : Utils.pInt(iLen);

			while (sResult.length < iLen)
			{
				sResult += sLine.substr(window.Math.round(window.Math.random() * sLine.length), 1);
			}

			return sResult;
		};

		Utils.draggablePlace = function ()
		{
			return $('<div class="draggablePlace">' +
				'<span class="text"></span>&nbsp;' +
				'<i class="icon-copy icon-white visible-on-ctrl"></i><i class="icon-mail icon-white hidden-on-ctrl"></i></div>').appendTo('#rl-hidden');
		};

		Utils.defautOptionsAfterRender = function (oDomOption, oItem)
		{
			if (oItem && !Utils.isUnd(oItem.disabled) && oDomOption)
			{
				$(oDomOption)
					.toggleClass('disabled', oItem.disabled)
					.prop('disabled', oItem.disabled)
				;
			}
		};

		/**
		 * @param {Object} oViewModel
		 * @param {string} sTemplateID
		 * @param {string} sTitle
		 * @param {Function=} fCallback
		 */
		Utils.windowPopupKnockout = function (oViewModel, sTemplateID, sTitle, fCallback)
		{
			var
				oScript = null,
				oWin = window.open(''),
				sFunc = '__OpenerApplyBindingsUid' + Utils.fakeMd5() + '__',
				oTemplate = $('#' + sTemplateID)
			;

			window[sFunc] = function () {

				if (oWin && oWin.document.body && oTemplate && oTemplate[0])
				{
					var oBody = $(oWin.document.body);

					$('#rl-content', oBody).html(oTemplate.html());
					$('html', oWin.document).addClass('external ' + $('html').attr('class'));

					__webpack_require__(/*! Common/Translator */ 6).i18nToNodes(oBody);

					if (oViewModel && $('#rl-content', oBody)[0])
					{
						ko.applyBindings(oViewModel, $('#rl-content', oBody)[0]);
					}

					window[sFunc] = null;

					fCallback(oWin);
				}
			};

			oWin.document.open();
			oWin.document.write('<html><head>' +
	'<meta charset="utf-8" />' +
	'<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />' +
	'<meta name="viewport" content="user-scalable=no" />' +
	'<meta name="apple-mobile-web-app-capable" content="yes" />' +
	'<meta name="robots" content="noindex, nofollow, noodp" />' +
	'<title>' + Utils.encodeHtml(sTitle) + '</title>' +
	'</head><body><div id="rl-content"></div></body></html>');
			oWin.document.close();

			oScript = oWin.document.createElement('script');
			oScript.type = 'text/javascript';
			oScript.innerHTML = 'if(window&&window.opener&&window.opener[\'' + sFunc + '\']){window.opener[\'' + sFunc + '\']();window.opener[\'' + sFunc + '\']=null}';
			oWin.document.getElementsByTagName('head')[0].appendChild(oScript);
		};

		/**
		 * @param {Function} fCallback
		 * @param {?} koTrigger
		 * @param {?} oContext = null
		 * @param {number=} iTimer = 1000
		 * @return {Function}
		 */
		Utils.settingsSaveHelperFunction = function (fCallback, koTrigger, oContext, iTimer)
		{
			oContext = oContext || null;
			iTimer = Utils.isUnd(iTimer) ? 1000 : Utils.pInt(iTimer);

			return function (sType, mData, bCached, sRequestAction, oRequestParameters) {
				koTrigger.call(oContext, mData && mData['Result'] ? Enums.SaveSettingsStep.TrueResult : Enums.SaveSettingsStep.FalseResult);
				if (fCallback)
				{
					fCallback.call(oContext, sType, mData, bCached, sRequestAction, oRequestParameters);
				}
				_.delay(function () {
					koTrigger.call(oContext, Enums.SaveSettingsStep.Idle);
				}, iTimer);
			};
		};

		Utils.settingsSaveHelperSimpleFunction = function (koTrigger, oContext)
		{
			return Utils.settingsSaveHelperFunction(null, koTrigger, oContext, 1000);
		};

		Utils.settingsSaveHelperSubscribeFunction = function (oRemote, sSettingName, sType, fTriggerFunction)
		{
			return function (mValue) {

				if (oRemote)
				{
					switch (sType)
					{
						default:
							mValue = Utils.pString(mValue);
							break;
						case 'bool':
						case 'boolean':
							mValue = mValue ? '1' : '0';
							break;
						case 'int':
						case 'integer':
						case 'number':
							mValue = Utils.pInt(mValue);
							break;
						case 'trim':
							mValue = Utils.trim(mValue);
							break;
					}

					var oData = {};
					oData[sSettingName] = mValue;

					if (oRemote.saveAdminConfig)
					{
						oRemote.saveAdminConfig(fTriggerFunction || null, oData);
					}
					else if (oRemote.saveSettings)
					{
						oRemote.saveSettings(fTriggerFunction || null, oData);
					}
				}
			};
		};

		/**
		 * @param {string} sHtml
		 * @return {string}
		 */
		Utils.htmlToPlain = function (sHtml)
		{
			var
				iPos = 0,
				iP1 = 0,
				iP2 = 0,
				iP3 = 0,
				iLimit = 0,

				sText = '',

				convertBlockquote = function (sText) {
					sText = Utils.trim(sText);
					sText = '> ' + sText.replace(/\n/gm, '\n> ');
					return sText.replace(/(^|\n)([> ]+)/gm, function () {
						return (arguments && 2 < arguments.length) ? arguments[1] + $.trim(arguments[2].replace(/[\s]/g, '')) + ' ' : '';
					});
				},

				convertDivs = function () {
					if (arguments && 1 < arguments.length)
					{
						var sText = $.trim(arguments[1]);
						if (0 < sText.length)
						{
							sText = sText.replace(/<div[^>]*>([\s\S\r\n]*)<\/div>/gmi, convertDivs);
							sText = '\n' + $.trim(sText) + '\n';
						}

						return sText;
					}

					return '';
				},

				convertPre = function () {
					return (arguments && 1 < arguments.length) ?
						arguments[1].toString()
							.replace(/[\n]/gm, '<br />')
							.replace(/[\r]/gm, '')
						: '';
				},

				fixAttibuteValue = function () {
					return (arguments && 1 < arguments.length) ?
						'' + arguments[1] + _.escape(arguments[2]) : '';
				},

				convertLinks = function () {
					return (arguments && 1 < arguments.length) ? $.trim(arguments[1]) : '';
				}
			;

			sText = sHtml
				.replace(/\u0002([\s\S]*)\u0002/gm, '\u200C$1\u200C')
				.replace(/<p[^>]*><\/p>/gi, '')
				.replace(/<pre[^>]*>([\s\S\r\n\t]*)<\/pre>/gmi, convertPre)
				.replace(/[\s]+/gm, ' ')
				.replace(/((?:href|data)\s?=\s?)("[^"]+?"|'[^']+?')/gmi, fixAttibuteValue)
				.replace(/<br[^>]*>/gmi, '\n')
				.replace(/<\/h[\d]>/gi, '\n')
				.replace(/<\/p>/gi, '\n\n')
				.replace(/<ul[^>]*>/gmi, '\n')
				.replace(/<\/ul>/gi, '\n')
				.replace(/<li[^>]*>/gmi, ' * ')
				.replace(/<\/li>/gi, '\n')
				.replace(/<\/td>/gi, '\n')
				.replace(/<\/tr>/gi, '\n')
				.replace(/<hr[^>]*>/gmi, '\n_______________________________\n\n')
				.replace(/<div[^>]*>([\s\S\r\n]*)<\/div>/gmi, convertDivs)
				.replace(/<blockquote[^>]*>/gmi, '\n__bq__start__\n')
				.replace(/<\/blockquote>/gmi, '\n__bq__end__\n')
				.replace(/<a [^>]*>([\s\S\r\n]*?)<\/a>/gmi, convertLinks)
				.replace(/<\/div>/gi, '\n')
				.replace(/&nbsp;/gi, ' ')
				.replace(/&quot;/gi, '"')
				.replace(/<[^>]*>/gm, '')
			;

			sText = Globals.$div.html(sText).text();

			sText = sText
				.replace(/\n[ \t]+/gm, '\n')
				.replace(/[\n]{3,}/gm, '\n\n')
				.replace(/&gt;/gi, '>')
				.replace(/&lt;/gi, '<')
				.replace(/&amp;/gi, '&')
			;

			sText = Utils.splitPlainText(Utils.trim(sText));

			iPos = 0;
			iLimit = 800;

			while (0 < iLimit)
			{
				iLimit--;
				iP1 = sText.indexOf('__bq__start__', iPos);
				if (-1 < iP1)
				{
					iP2 = sText.indexOf('__bq__start__', iP1 + 5);
					iP3 = sText.indexOf('__bq__end__', iP1 + 5);

					if ((-1 === iP2 || iP3 < iP2) && iP1 < iP3)
					{
						sText = sText.substring(0, iP1) +
							convertBlockquote(sText.substring(iP1 + 13, iP3)) +
							sText.substring(iP3 + 11);

						iPos = 0;
					}
					else if (-1 < iP2 && iP2 < iP3)
					{
						iPos = iP2 - 1;
					}
					else
					{
						iPos = 0;
					}
				}
				else
				{
					break;
				}
			}

			sText = sText
				.replace(/__bq__start__/gm, '')
				.replace(/__bq__end__/gm, '')
			;

			return sText;
		};

		/**
		 * @param {string} sPlain
		 * @param {boolean} bFindEmailAndLinks = false
		 * @return {string}
		 */
		Utils.plainToHtml = function (sPlain, bFindEmailAndLinks)
		{
			sPlain = sPlain.toString().replace(/\r/g, '');

			bFindEmailAndLinks = Utils.isUnd(bFindEmailAndLinks) ? false : !!bFindEmailAndLinks;

			var
				bIn = false,
				bDo = true,
				bStart = true,
				aNextText = [],
				sLine = '',
				iIndex = 0,
				aText = sPlain.split("\n")
			;

			do
			{
				bDo = false;
				aNextText = [];
				for (iIndex = 0; iIndex < aText.length; iIndex++)
				{
					sLine = aText[iIndex];
					bStart = '>' === sLine.substr(0, 1);
					if (bStart && !bIn)
					{
						bDo = true;
						bIn = true;
						aNextText.push('~~~blockquote~~~');
						aNextText.push(sLine.substr(1));
					}
					else if (!bStart && bIn)
					{
						if ('' !== sLine)
						{
							bIn = false;
							aNextText.push('~~~/blockquote~~~');
							aNextText.push(sLine);
						}
						else
						{
							aNextText.push(sLine);
						}
					}
					else if (bStart && bIn)
					{
						aNextText.push(sLine.substr(1));
					}
					else
					{
						aNextText.push(sLine);
					}
				}

				if (bIn)
				{
					bIn = false;
					aNextText.push('~~~/blockquote~~~');
				}

				aText = aNextText;
			}
			while (bDo);

			sPlain = aText.join("\n");

			sPlain = sPlain
	//			.replace(/~~~\/blockquote~~~\n~~~blockquote~~~/g, '\n')
				.replace(/&/g, '&amp;')
				.replace(/>/g, '&gt;').replace(/</g, '&lt;')
				.replace(/~~~blockquote~~~[\s]*/g, '<blockquote>')
				.replace(/[\s]*~~~\/blockquote~~~/g, '</blockquote>')
				.replace(/\u200C([\s\S]*)\u200C/g, '\u0002$1\u0002')
				.replace(/\n/g, '<br />')
			;

			return bFindEmailAndLinks ? Utils.findEmailAndLinks(sPlain) : sPlain;
		};

		window.rainloop_Utils_htmlToPlain = Utils.htmlToPlain;
		window.rainloop_Utils_plainToHtml = Utils.plainToHtml;

		/**
		 * @param {string} sHtml
		 * @return {string}
		 */
		Utils.findEmailAndLinks = function (sHtml)
		{
	//		return sHtml;
			sHtml = Autolinker.link(sHtml, {
				'newWindow': true,
				'stripPrefix': false,
				'urls': true,
				'email': true,
				'twitter': false,
				'replaceFn': function (autolinker, match) {
					return !(autolinker && match && 'url' === match.getType() && match.matchedText && 0 !== match.matchedText.indexOf('http'));
				}
			});

			return sHtml;
		};

		/**
		 * @param {string} sUrl
		 * @param {number} iValue
		 * @param {Function} fCallback
		 */
		Utils.resizeAndCrop = function (sUrl, iValue, fCallback)
		{
			var oTempImg = new window.Image();
			oTempImg.onload = function() {

				var
					aDiff = [0, 0],
					oCanvas = window.document.createElement('canvas'),
					oCtx = oCanvas.getContext('2d')
				;

				oCanvas.width = iValue;
				oCanvas.height = iValue;

				if (this.width > this.height)
				{
					aDiff = [this.width - this.height, 0];
				}
				else
				{
					aDiff = [0, this.height - this.width];
				}

				oCtx.fillStyle = '#fff';
				oCtx.fillRect(0, 0, iValue, iValue);
				oCtx.drawImage(this, aDiff[0] / 2, aDiff[1] / 2, this.width - aDiff[0], this.height - aDiff[1], 0, 0, iValue, iValue);

				fCallback(oCanvas.toDataURL('image/jpeg'));
			};

			oTempImg.src = sUrl;
		};

		/**
		 * @param {Array} aSystem
		 * @param {Array} aList
		 * @param {Array=} aDisabled
		 * @param {Array=} aHeaderLines
		 * @param {?number=} iUnDeep
		 * @param {Function=} fDisableCallback
		 * @param {Function=} fVisibleCallback
		 * @param {Function=} fRenameCallback
		 * @param {boolean=} bSystem
		 * @param {boolean=} bBuildUnvisible
		 * @return {Array}
		 */
		Utils.folderListOptionsBuilder = function (aSystem, aList, aDisabled, aHeaderLines,
			iUnDeep, fDisableCallback, fVisibleCallback, fRenameCallback, bSystem, bBuildUnvisible)
		{
			var
				/**
				 * @type {?FolderModel}
				 */
				oItem = null,
				bSep = false,
				iIndex = 0,
				iLen = 0,
				sDeepPrefix = '\u00A0\u00A0\u00A0',
				aResult = []
			;

			bBuildUnvisible = Utils.isUnd(bBuildUnvisible) ? false : !!bBuildUnvisible;
			bSystem = !Utils.isNormal(bSystem) ? 0 < aSystem.length : bSystem;
			iUnDeep = !Utils.isNormal(iUnDeep) ? 0 : iUnDeep;
			fDisableCallback = Utils.isNormal(fDisableCallback) ? fDisableCallback : null;
			fVisibleCallback = Utils.isNormal(fVisibleCallback) ? fVisibleCallback : null;
			fRenameCallback = Utils.isNormal(fRenameCallback) ? fRenameCallback : null;

			if (!Utils.isArray(aDisabled))
			{
				aDisabled = [];
			}

			if (!Utils.isArray(aHeaderLines))
			{
				aHeaderLines = [];
			}

			for (iIndex = 0, iLen = aHeaderLines.length; iIndex < iLen; iIndex++)
			{
				aResult.push({
					'id': aHeaderLines[iIndex][0],
					'name': aHeaderLines[iIndex][1],
					'system': false,
					'seporator': false,
					'disabled': false
				});
			}

			bSep = true;
			for (iIndex = 0, iLen = aSystem.length; iIndex < iLen; iIndex++)
			{
				oItem = aSystem[iIndex];
				if (fVisibleCallback ? fVisibleCallback.call(null, oItem) : true)
				{
					if (bSep && 0 < aResult.length)
					{
						aResult.push({
							'id': '---',
							'name': '---',
							'system': false,
							'seporator': true,
							'disabled': true
						});
					}

					bSep = false;
					aResult.push({
						'id': oItem.fullNameRaw,
						'name': fRenameCallback ? fRenameCallback.call(null, oItem) : oItem.name(),
						'system': true,
						'seporator': false,
						'disabled': !oItem.selectable || -1 < Utils.inArray(oItem.fullNameRaw, aDisabled) ||
							(fDisableCallback ? fDisableCallback.call(null, oItem) : false)
					});
				}
			}

			bSep = true;
			for (iIndex = 0, iLen = aList.length; iIndex < iLen; iIndex++)
			{
				oItem = aList[iIndex];
	//			if (oItem.subScribed() || !oItem.existen || bBuildUnvisible)
				if ((oItem.subScribed() || !oItem.existen || bBuildUnvisible) && (oItem.selectable || oItem.hasSubScribedSubfolders()))
				{
					if (fVisibleCallback ? fVisibleCallback.call(null, oItem) : true)
					{
						if (Enums.FolderType.User === oItem.type() || !bSystem || oItem.hasSubScribedSubfolders())
						{
							if (bSep && 0 < aResult.length)
							{
								aResult.push({
									'id': '---',
									'name': '---',
									'system': false,
									'seporator': true,
									'disabled': true
								});
							}

							bSep = false;
							aResult.push({
								'id': oItem.fullNameRaw,
								'name': (new window.Array(oItem.deep + 1 - iUnDeep)).join(sDeepPrefix) +
									(fRenameCallback ? fRenameCallback.call(null, oItem) : oItem.name()),
								'system': false,
								'seporator': false,
								'disabled': !oItem.selectable || -1 < Utils.inArray(oItem.fullNameRaw, aDisabled) ||
									(fDisableCallback ? fDisableCallback.call(null, oItem) : false)
							});
						}
					}
				}

				if (oItem.subScribed() && 0 < oItem.subFolders().length)
				{
					aResult = aResult.concat(Utils.folderListOptionsBuilder([], oItem.subFolders(), aDisabled, [],
						iUnDeep, fDisableCallback, fVisibleCallback, fRenameCallback, bSystem, bBuildUnvisible));
				}
			}

			return aResult;
		};

		Utils.computedPagenatorHelper = function (koCurrentPage, koPageCount)
		{
			return function() {

				var
					iPrev = 0,
					iNext = 0,
					iLimit = 2,
					aResult = [],
					iCurrentPage = koCurrentPage(),
					iPageCount = koPageCount(),

					/**
					 * @param {number} iIndex
					 * @param {boolean=} bPush = true
					 * @param {string=} sCustomName = ''
					 */
					fAdd = function (iIndex, bPush, sCustomName) {

						var oData = {
							'current': iIndex === iCurrentPage,
							'name': Utils.isUnd(sCustomName) ? iIndex.toString() : sCustomName.toString(),
							'custom': Utils.isUnd(sCustomName) ? false : true,
							'title': Utils.isUnd(sCustomName) ? '' : iIndex.toString(),
							'value': iIndex.toString()
						};

						if (Utils.isUnd(bPush) ? true : !!bPush)
						{
							aResult.push(oData);
						}
						else
						{
							aResult.unshift(oData);
						}
					}
				;

				if (1 < iPageCount || (0 < iPageCount && iPageCount < iCurrentPage))
		//		if (0 < iPageCount && 0 < iCurrentPage)
				{
					if (iPageCount < iCurrentPage)
					{
						fAdd(iPageCount);
						iPrev = iPageCount;
						iNext = iPageCount;
					}
					else
					{
						if (3 >= iCurrentPage || iPageCount - 2 <= iCurrentPage)
						{
							iLimit += 2;
						}

						fAdd(iCurrentPage);
						iPrev = iCurrentPage;
						iNext = iCurrentPage;
					}

					while (0 < iLimit) {

						iPrev -= 1;
						iNext += 1;

						if (0 < iPrev)
						{
							fAdd(iPrev, false);
							iLimit--;
						}

						if (iPageCount >= iNext)
						{
							fAdd(iNext, true);
							iLimit--;
						}
						else if (0 >= iPrev)
						{
							break;
						}
					}

					if (3 === iPrev)
					{
						fAdd(2, false);
					}
					else if (3 < iPrev)
					{
						fAdd(window.Math.round((iPrev - 1) / 2), false, '...');
					}

					if (iPageCount - 2 === iNext)
					{
						fAdd(iPageCount - 1, true);
					}
					else if (iPageCount - 2 > iNext)
					{
						fAdd(window.Math.round((iPageCount + iNext) / 2), true, '...');
					}

					// first and last
					if (1 < iPrev)
					{
						fAdd(1, false);
					}

					if (iPageCount > iNext)
					{
						fAdd(iPageCount, true);
					}
				}

				return aResult;
			};
		};

		Utils.selectElement = function (element)
		{
			var sel, range;
			if (window.getSelection)
			{
				sel = window.getSelection();
				sel.removeAllRanges();
				range = window.document.createRange();
				range.selectNodeContents(element);
				sel.addRange(range);
			}
			else if (window.document.selection)
			{
				range = window.document.body.createTextRange();
				range.moveToElementText(element);
				range.select();
			}
		};

		Utils.detectDropdownVisibility = _.debounce(function () {
			Globals.dropdownVisibility(!!_.find(Globals.aBootstrapDropdowns, function (oItem) {
				return oItem.hasClass('open');
			}));
		}, 50);

		/**
		 * @param {boolean=} bDelay = false
		 */
		Utils.triggerAutocompleteInputChange = function (bDelay) {

			var fFunc = function () {
				$('.checkAutocomplete').trigger('change');
			};

			if (Utils.isUnd(bDelay) ? false : !!bDelay)
			{
				_.delay(fFunc, 100);
			}
			else
			{
				fFunc();
			}
		};

		/**
		 * @param {Object} oParams
		 */
		Utils.setHeadViewport = function (oParams)
		{
			var aContent = [];
			_.each(oParams, function (sKey, sValue) {
				aContent.push('' + sKey + '=' + sValue);
			});

			$('#rl-head-viewport').attr('content', aContent.join(', '));
		};

		/**
		 * @param {string} sFileName
		 * @return {string}
		 */
		Utils.getFileExtension = function (sFileName)
		{
			sFileName = Utils.trim(sFileName).toLowerCase();

			var sResult = sFileName.split('.').pop();
			return (sResult === sFileName) ? '' : sResult;
		};

		/**
		 * @param {string} sFileName
		 * @return {string}
		 */
		Utils.mimeContentType = function (sFileName)
		{
			var
				sExt = '',
				sResult = 'application/octet-stream'
			;

			sFileName = Utils.trim(sFileName).toLowerCase();

			if ('winmail.dat' === sFileName)
			{
				return 'application/ms-tnef';
			}

			sExt = Utils.getFileExtension(sFileName);
			if (sExt && 0 < sExt.length && !Utils.isUnd(Mime[sExt]))
			{
				sResult = Mime[sExt];
			}

			return sResult;
		};

		/**
		 * @param {mixed} mPropOrValue
		 * @param {mixed} mValue
		 */
		Utils.disposeOne = function (mPropOrValue, mValue)
		{
			var mDisposable = mValue || mPropOrValue;
	        if (mDisposable && typeof mDisposable.dispose === 'function')
			{
	            mDisposable.dispose();
	        }
		};

		/**
		 * @param {Object} oObject
		 */
		Utils.disposeObject = function (oObject)
		{
			if (oObject)
			{
				if (Utils.isArray(oObject.disposables))
				{
					_.each(oObject.disposables, Utils.disposeOne);
				}

				ko.utils.objectForEach(oObject, Utils.disposeOne);
			}
		};

		/**
		 * @param {Object|Array} mObjectOrObjects
		 */
		Utils.delegateRunOnDestroy = function (mObjectOrObjects)
		{
			if (mObjectOrObjects)
			{
				if (Utils.isArray(mObjectOrObjects))
				{
					_.each(mObjectOrObjects, function (oItem) {
						Utils.delegateRunOnDestroy(oItem);
					});
				}
				else if (mObjectOrObjects && mObjectOrObjects.onDestroy)
				{
					mObjectOrObjects.onDestroy();
				}
			}
		};

		Utils.__themeTimer = 0;
		Utils.__themeAjax = null;

		Utils.changeTheme = function (sValue, themeTrigger)
		{
			var
				oThemeLink = $('#rlThemeLink'),
				oThemeStyle = $('#rlThemeStyle'),
				sUrl = oThemeLink.attr('href')
			;

			if (!sUrl)
			{
				sUrl = oThemeStyle.attr('data-href');
			}

			if (sUrl)
			{
				sUrl = sUrl.toString().replace(/\/-\/[^\/]+\/\-\//, '/-/' + sValue + '/-/');
				sUrl = sUrl.toString().replace(/\/Css\/[^\/]+\/User\//, '/Css/0/User/');
				sUrl = sUrl.toString().replace(/\/Hash\/[^\/]+\//, '/Hash/-/');

				if ('Json/' !== sUrl.substring(sUrl.length - 5, sUrl.length))
				{
					sUrl += 'Json/';
				}

				window.clearTimeout(Utils.__themeTimer);
				themeTrigger(Enums.SaveSettingsStep.Animate);

				if (Utils.__themeAjax && Utils.__themeAjax.abort)
				{
					Utils.__themeAjax.abort();
				}

				Utils.__themeAjax = $.ajax({
					'url': sUrl,
					'dataType': 'json'
				}).done(function(aData) {

					if (aData && Utils.isArray(aData) && 2 === aData.length)
					{
						if (oThemeLink && oThemeLink[0] && (!oThemeStyle || !oThemeStyle[0]))
						{
							oThemeStyle = $('<style id="rlThemeStyle"></style>');
							oThemeLink.after(oThemeStyle);
							oThemeLink.remove();
						}

						if (oThemeStyle && oThemeStyle[0])
						{
							oThemeStyle.attr('data-href', sUrl).attr('data-theme', aData[0]);
							if (oThemeStyle[0].styleSheet && !Utils.isUnd(oThemeStyle[0].styleSheet.cssText))
							{
								oThemeStyle[0].styleSheet.cssText = aData[1];
							}
							else
							{
								oThemeStyle.text(aData[1]);
							}
						}

						themeTrigger(Enums.SaveSettingsStep.TrueResult);
					}

				}).always(function() {

					Utils.__themeTimer = window.setTimeout(function () {
						themeTrigger(Enums.SaveSettingsStep.Idle);
					}, 1000);

					Utils.__themeAjax = null;
				});
			}
		};

		Utils.substr = window.String.substr;
		if ('ab'.substr(-1) !== 'b')
		{
			Utils.substr = function(sStr, iStart, iLength)
			{
				if (iStart < 0)
				{
					iStart = sStr.length + iStart;
				}

				return sStr.substr(iStart, iLength);
			};
		}

		module.exports = Utils;

	}());

/***/ },
/* 2 */
/*!***************************!*\
  !*** external "window._" ***!
  \***************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = window._;

/***/ },
/* 3 */
/*!****************************!*\
  !*** ./dev/External/ko.js ***!
  \****************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function (ko) {

		'use strict';

		var
			window = __webpack_require__(/*! window */ 10),
			_ = __webpack_require__(/*! _ */ 2),
			$ = __webpack_require__(/*! $ */ 11),
			JSON = __webpack_require__(/*! JSON */ 39),
			Opentip = __webpack_require__(/*! Opentip */ 65),

			fDisposalTooltipHelper = function (oElement) {
				ko.utils.domNodeDisposal.addDisposeCallback(oElement, function () {

					if (oElement && oElement.__opentip)
					{
						oElement.__opentip.deactivate();
					}
				});
			}
		;

		ko.bindingHandlers.editor = {
			'init': function (oElement, fValueAccessor) {

				var
					oEditor  = null,
					fValue = fValueAccessor(),

					fUpdateEditorValue = function () {
						if (fValue && fValue.__editor)
						{
							fValue.__editor.setHtmlOrPlain(fValue());
						}
					},

					fUpdateKoValue = function () {
						if (fValue && fValue.__editor)
						{
							fValue(fValue.__editor.getDataWithHtmlMark());
						}
					},

					fOnReady = function () {
						fValue.__editor = oEditor;
						fUpdateEditorValue();
					},

					HtmlEditor = __webpack_require__(/*! Common/HtmlEditor */ 40)
				;

				if (ko.isObservable(fValue) && HtmlEditor)
				{
					oEditor = new HtmlEditor(oElement, fUpdateKoValue, fOnReady, fUpdateKoValue);

					fValue.__fetchEditorValue = fUpdateKoValue;

					fValue.subscribe(fUpdateEditorValue);

	//				ko.utils.domNodeDisposal.addDisposeCallback(oElement, function () {
	//				});
				}
			}
		};

		ko.bindingHandlers.json = {
			'init': function (oElement, fValueAccessor) {
				$(oElement).text(JSON.stringify(ko.unwrap(fValueAccessor())));
			},
			'update': function (oElement, fValueAccessor) {
				$(oElement).text(JSON.stringify(ko.unwrap(fValueAccessor())));
			}
		};

		ko.bindingHandlers.scrollerShadows = {
			'init': function (oElement) {

				var
					iLimit = 8,
					$oEl = $(oElement),
					$win = $(window),
					oCont = $oEl.find('[data-scroller-shadows-content]')[0] || null,
					fFunc = _.throttle(function () {
						$oEl
							.toggleClass('scroller-shadow-top', iLimit < oCont.scrollTop)
							.toggleClass('scroller-shadow-bottom', oCont.scrollTop + iLimit < oCont.scrollHeight - oCont.clientHeight)
						;
					}, 100)
				;

				if (oCont)
				{
					$(oCont).on('scroll resize', fFunc);
					$win.on('resize', fFunc);

					ko.utils.domNodeDisposal.addDisposeCallback(oCont, function () {
						$(oCont).off();
						$win.off('resize', fFunc);
					});
				}
			}
		};

		ko.bindingHandlers.tooltip = {
			'init': function (oElement, fValueAccessor) {

				var
					bi18n = true,
					sValue = '',
					Translator = null,
					$oEl = $(oElement),
					fValue = fValueAccessor(),
					bMobile = 'on' === ($oEl.data('tooltip-mobile') || 'off'),
					Globals = __webpack_require__(/*! Common/Globals */ 8)
				;

				if (!Globals.bMobileDevice || bMobile)
				{
					bi18n = 'on' === ($oEl.data('tooltip-i18n') || 'on');
					sValue = !ko.isObservable(fValue) && _.isFunction(fValue) ? fValue() : ko.unwrap(fValue);

					oElement.__opentip = new Opentip(oElement, {
						'style': 'rainloopTip',
						'element': oElement,
						'tipJoint': $oEl.data('tooltip-join') || 'bottom'
					});

					Globals.dropdownVisibility.subscribe(function (bV) {
						if (bV) {
							oElement.__opentip.hide();
						}
					});

					if ('' === sValue)
					{
						oElement.__opentip.hide();
						oElement.__opentip.deactivate();
						oElement.__opentip.setContent('');
					}
					else
					{
						oElement.__opentip.activate();
					}

					if (bi18n)
					{
						Translator = __webpack_require__(/*! Common/Translator */ 6);

						oElement.__opentip.setContent(Translator.i18n(sValue));

						Translator.trigger.subscribe(function () {
							oElement.__opentip.setContent(Translator.i18n(sValue));
						});

						Globals.dropdownVisibility.subscribe(function () {
							if (oElement && oElement.__opentip)
							{
								oElement.__opentip.setContent(__webpack_require__(/*! Common/Translator */ 6).i18n(sValue));
							}
						});
					}
					else
					{
						oElement.__opentip.setContent(sValue);
					}
				}
			},
			'update': function (oElement, fValueAccessor) {

				var
					bi18n = true,
					sValue = '',
					$oEl = $(oElement),
					fValue = fValueAccessor(),
					bMobile = 'on' === ($oEl.data('tooltip-mobile') || 'off'),
					Globals = __webpack_require__(/*! Common/Globals */ 8)
				;

				if ((!Globals.bMobileDevice || bMobile) && oElement.__opentip)
				{
					bi18n = 'on' === ($oEl.data('tooltip-i18n') || 'on');
					sValue = !ko.isObservable(fValue) && _.isFunction(fValue) ? fValue() : ko.unwrap(fValue);

					if (sValue)
					{
						oElement.__opentip.setContent(
							bi18n ? __webpack_require__(/*! Common/Translator */ 6).i18n(sValue) : sValue);
						oElement.__opentip.activate();
					}
					else
					{
						oElement.__opentip.hide();
						oElement.__opentip.deactivate();
						oElement.__opentip.setContent('');
					}
				}
			}
		};

		ko.bindingHandlers.tooltipErrorTip = {
			'init': function (oElement) {

				var $oEl = $(oElement);

				oElement.__opentip = new Opentip(oElement, {
					'style': 'rainloopErrorTip',
					'hideOn': 'mouseout click',
					'element': oElement,
					'tipJoint': $oEl.data('tooltip-join') || 'top'
				});

				oElement.__opentip.deactivate();

				$(window.document).on('click', function () {
					if (oElement && oElement.__opentip)
					{
						oElement.__opentip.hide();
					}
				});

				fDisposalTooltipHelper(oElement);
			},
			'update': function (oElement, fValueAccessor) {

				var
					$oEl = $(oElement),
					fValue = fValueAccessor(),
					sValue = !ko.isObservable(fValue) && _.isFunction(fValue) ? fValue() : ko.unwrap(fValue),
					oOpenTips = oElement.__opentip
				;

				if (oOpenTips)
				{
					if ('' === sValue)
					{
						oOpenTips.hide();
						oOpenTips.deactivate();
						oOpenTips.setContent('');
					}
					else
					{
						_.delay(function () {
							if ($oEl.is(':visible'))
							{
								oOpenTips.setContent(sValue);
								oOpenTips.activate();
								oOpenTips.show();
							}
							else
							{
								oOpenTips.hide();
								oOpenTips.deactivate();
								oOpenTips.setContent('');
							}
						}, 100);
					}
				}
			}
		};

		ko.bindingHandlers.registrateBootstrapDropdown = {
			'init': function (oElement) {
				var Globals = __webpack_require__(/*! Common/Globals */ 8);
				if (Globals && Globals.aBootstrapDropdowns)
				{
					Globals.aBootstrapDropdowns.push($(oElement));

					$(oElement).click(function () {
						__webpack_require__(/*! Common/Utils */ 1).detectDropdownVisibility();
					});

	//				ko.utils.domNodeDisposal.addDisposeCallback(oElement, function () {
	//				});
				}
			}
		};

		ko.bindingHandlers.openDropdownTrigger = {
			'update': function (oElement, fValueAccessor) {
				if (ko.unwrap(fValueAccessor()))
				{
					var $oEl = $(oElement);
					if (!$oEl.hasClass('open'))
					{
						$oEl.find('.dropdown-toggle').dropdown('toggle');
					}

					$oEl.find('.dropdown-toggle').focus();

					__webpack_require__(/*! Common/Utils */ 1).detectDropdownVisibility();
					fValueAccessor()(false);
				}
			}
		};

		ko.bindingHandlers.dropdownCloser = {
			'init': function (oElement) {
				$(oElement).closest('.dropdown').on('click', '.e-item', function () {
					$(oElement).dropdown('toggle');
				});
			}
		};

		ko.bindingHandlers.popover = {
			'init': function (oElement, fValueAccessor) {
				$(oElement).popover(ko.unwrap(fValueAccessor()));

				ko.utils.domNodeDisposal.addDisposeCallback(oElement, function () {
					$(oElement).popover('destroy');
				});
			}
		};

		ko.bindingHandlers.csstext = {
			'init': function (oElement, fValueAccessor) {
				if (oElement && oElement.styleSheet && undefined !== oElement.styleSheet.cssText)
				{
					oElement.styleSheet.cssText = ko.unwrap(fValueAccessor());
				}
				else
				{
					$(oElement).text(ko.unwrap(fValueAccessor()));
				}
			},
			'update': function (oElement, fValueAccessor) {
				if (oElement && oElement.styleSheet && undefined !== oElement.styleSheet.cssText)
				{
					oElement.styleSheet.cssText = ko.unwrap(fValueAccessor());
				}
				else
				{
					$(oElement).text(ko.unwrap(fValueAccessor()));
				}
			}
		};

		ko.bindingHandlers.resizecrop = {
			'init': function (oElement) {
				$(oElement).addClass('resizecrop').resizecrop({
					'width': '100',
					'height': '100',
					'wrapperCSS': {
						'border-radius': '10px'
					}
				});
			},
			'update': function (oElement, fValueAccessor) {
				fValueAccessor()();
				$(oElement).resizecrop({
					'width': '100',
					'height': '100'
				});
			}
		};

		ko.bindingHandlers.onEnter = {
			'init': function (oElement, fValueAccessor, fAllBindingsAccessor, oViewModel) {
				$(oElement).on('keypress.koOnEnter', function (oEvent) {
					if (oEvent && 13 === window.parseInt(oEvent.keyCode, 10))
					{
						$(oElement).trigger('change');
						fValueAccessor().call(oViewModel);
					}
				});

				ko.utils.domNodeDisposal.addDisposeCallback(oElement, function () {
					$(oElement).off('keypress.koOnEnter');
				});
			}
		};

		ko.bindingHandlers.onSpace = {
			'init': function (oElement, fValueAccessor, fAllBindingsAccessor, oViewModel) {
				$(oElement).on('keyup.koOnSpace', function (oEvent) {
					if (oEvent && 32 === window.parseInt(oEvent.keyCode, 10))
					{
						fValueAccessor().call(oViewModel, oEvent);
					}
				});

				ko.utils.domNodeDisposal.addDisposeCallback(oElement, function () {
					$(oElement).off('keyup.koOnSpace');
				});
			}
		};

		ko.bindingHandlers.onTab = {
			'init': function (oElement, fValueAccessor, fAllBindingsAccessor, oViewModel) {
				$(oElement).on('keydown.koOnTab', function (oEvent) {
					if (oEvent && 9 === window.parseInt(oEvent.keyCode, 10))
					{
						return fValueAccessor().call(oViewModel, !!oEvent.shiftKey);
					}
				});

				ko.utils.domNodeDisposal.addDisposeCallback(oElement, function () {
					$(oElement).off('keydown.koOnTab');
				});
			}
		};

		ko.bindingHandlers.onEsc = {
			'init': function (oElement, fValueAccessor, fAllBindingsAccessor, oViewModel) {
				$(oElement).on('keypress.koOnEsc', function (oEvent) {
					if (oEvent && 27 === window.parseInt(oEvent.keyCode, 10))
					{
						$(oElement).trigger('change');
						fValueAccessor().call(oViewModel);
					}
				});

				ko.utils.domNodeDisposal.addDisposeCallback(oElement, function () {
					$(oElement).off('keypress.koOnEsc');
				});
			}
		};

		ko.bindingHandlers.clickOnTrue = {
			'update': function (oElement, fValueAccessor) {
				if (ko.unwrap(fValueAccessor()))
				{
					$(oElement).click();
				}
			}
		};

		ko.bindingHandlers.modal = {
			'init': function (oElement, fValueAccessor) {

				var
					Globals = __webpack_require__(/*! Common/Globals */ 8),
					Utils = __webpack_require__(/*! Common/Utils */ 1)
				;

				$(oElement).toggleClass('fade', !Globals.bMobileDevice).modal({
					'keyboard': false,
					'show': ko.unwrap(fValueAccessor())
				})
				.on('shown.koModal', Utils.windowResizeCallback)
				.find('.close').on('click.koModal', function () {
					fValueAccessor()(false);
				});

				ko.utils.domNodeDisposal.addDisposeCallback(oElement, function () {
					$(oElement)
						.off('shown.koModal')
						.find('.close')
						.off('click.koModal')
					;
				});
			},
			'update': function (oElement, fValueAccessor) {

				var Globals = __webpack_require__(/*! Common/Globals */ 8);

				$(oElement).modal(!!ko.unwrap(fValueAccessor()) ? 'show' : 'hide');

				if (Globals.$html.hasClass('rl-anim'))
				{
					Globals.$html.addClass('rl-modal-animation');
					_.delay(function () {
						Globals.$html.removeClass('rl-modal-animation');
					}, 400);
				}

			}
		};

		ko.bindingHandlers.moment = {
			'init': function (oElement, fValueAccessor) {
				__webpack_require__(/*! Common/Momentor */ 24).momentToNode(
					$(oElement).addClass('moment').data('moment-time', ko.unwrap(fValueAccessor()))
				);
			},
			'update': function (oElement, fValueAccessor) {
				__webpack_require__(/*! Common/Momentor */ 24).momentToNode(
					$(oElement).data('moment-time', ko.unwrap(fValueAccessor()))
				);
			}
		};

		ko.bindingHandlers.i18nInit = {
			'init': function (oElement) {
				__webpack_require__(/*! Common/Translator */ 6).i18nToNodes(oElement);
			}
		};

		ko.bindingHandlers.translatorInit = {
			'init': function (oElement) {
				__webpack_require__(/*! Common/Translator */ 6).i18nToNodes(oElement);
			}
		};

		ko.bindingHandlers.i18nUpdate = {
			'update': function (oElement, fValueAccessor) {
				ko.unwrap(fValueAccessor());
				__webpack_require__(/*! Common/Translator */ 6).i18nToNodes(oElement);
			}
		};

		ko.bindingHandlers.link = {
			'update': function (oElement, fValueAccessor) {
				$(oElement).attr('href', ko.unwrap(fValueAccessor()));
			}
		};

		ko.bindingHandlers.title = {
			'update': function (oElement, fValueAccessor) {
				$(oElement).attr('title', ko.unwrap(fValueAccessor()));
			}
		};

		ko.bindingHandlers.textF = {
			'init': function (oElement, fValueAccessor) {
				$(oElement).text(ko.unwrap(fValueAccessor()));
			}
		};

		ko.bindingHandlers.initDom = {
			'init': function (oElement, fValueAccessor) {
				fValueAccessor()(oElement);
			}
		};

		ko.bindingHandlers.initFixedTrigger = {
			'init': function (oElement, fValueAccessor) {
				var
					aValues = ko.unwrap(fValueAccessor()),
					$oContainer = null,
					$oElement = $(oElement),
					oOffset = null,

					iTop = aValues[1] || 0
				;

				$oContainer = $(aValues[0] || null);
				$oContainer = $oContainer[0] ? $oContainer : null;

				if ($oContainer)
				{
					$(window).resize(function () {
						oOffset = $oContainer.offset();
						if (oOffset && oOffset.top)
						{
							$oElement.css('top', oOffset.top + iTop);
						}
					});
				}
			}
		};

		ko.bindingHandlers.initResizeTrigger = {
			'init': function (oElement, fValueAccessor) {
				var aValues = ko.unwrap(fValueAccessor());
				$(oElement).css({
					'height': aValues[1],
					'min-height': aValues[1]
				});
			},
			'update': function (oElement, fValueAccessor) {

				var
					Utils = __webpack_require__(/*! Common/Utils */ 1),
					Globals = __webpack_require__(/*! Common/Globals */ 8),
					aValues = ko.unwrap(fValueAccessor()),
					iValue = Utils.pInt(aValues[1]),
					iSize = 0,
					iOffset = $(oElement).offset().top
				;

				if (0 < iOffset)
				{
					iOffset += Utils.pInt(aValues[2]);
					iSize = Globals.$win.height() - iOffset;

					if (iValue < iSize)
					{
						iValue = iSize;
					}

					$(oElement).css({
						'height': iValue,
						'min-height': iValue
					});
				}
			}
		};

		ko.bindingHandlers.appendDom = {
			'update': function (oElement, fValueAccessor) {
				$(oElement).hide().empty().append(ko.unwrap(fValueAccessor())).show();
			}
		};

		ko.bindingHandlers.draggable = {
			'init': function (oElement, fValueAccessor, fAllBindingsAccessor) {

				var
					Globals = __webpack_require__(/*! Common/Globals */ 8),
					Utils = __webpack_require__(/*! Common/Utils */ 1)
				;

				if (!Globals.bMobileDevice)
				{
					var
						iTriggerZone = 100,
						iScrollSpeed = 3,
						fAllValueFunc = fAllBindingsAccessor(),
						sDroppableSelector = fAllValueFunc && fAllValueFunc['droppableSelector'] ? fAllValueFunc['droppableSelector'] : '',
						oConf = {
							'distance': 20,
							'handle': '.dragHandle',
							'cursorAt': {'top': 22, 'left': 3},
							'refreshPositions': true,
							'scroll': true
						}
					;

					if (sDroppableSelector)
					{
						oConf['drag'] = function (oEvent) {

							$(sDroppableSelector).each(function () {
								var
									moveUp = null,
									moveDown = null,
									$this = $(this),
									oOffset = $this.offset(),
									bottomPos = oOffset.top + $this.height()
								;

								window.clearInterval($this.data('timerScroll'));
								$this.data('timerScroll', false);

								if (oEvent.pageX >= oOffset.left && oEvent.pageX <= oOffset.left + $this.width())
								{
									if (oEvent.pageY >= bottomPos - iTriggerZone && oEvent.pageY <= bottomPos)
									{
										moveUp = function() {
											$this.scrollTop($this.scrollTop() + iScrollSpeed);
											Utils.windowResize();
										};

										$this.data('timerScroll', window.setInterval(moveUp, 10));
										moveUp();
									}

									if (oEvent.pageY >= oOffset.top && oEvent.pageY <= oOffset.top + iTriggerZone)
									{
										moveDown = function() {
											$this.scrollTop($this.scrollTop() - iScrollSpeed);
											Utils.windowResize();
										};

										$this.data('timerScroll', window.setInterval(moveDown, 10));
										moveDown();
									}
								}
							});
						};

						oConf['stop'] =	function() {
							$(sDroppableSelector).each(function () {
								window.clearInterval($(this).data('timerScroll'));
								$(this).data('timerScroll', false);
							});
						};
					}

					oConf['helper'] = function (oEvent) {
						return fValueAccessor()(oEvent && oEvent.target ? ko.dataFor(oEvent.target) : null);
					};

					$(oElement).draggable(oConf).on('mousedown.koDraggable', function () {
						Utils.removeInFocus();
					});

					ko.utils.domNodeDisposal.addDisposeCallback(oElement, function () {
						$(oElement)
							.off('mousedown.koDraggable')
							.draggable('destroy')
						;
					});
				}
			}
		};

		ko.bindingHandlers.droppable = {
			'init': function (oElement, fValueAccessor, fAllBindingsAccessor) {
				var Globals = __webpack_require__(/*! Common/Globals */ 8);
				if (!Globals.bMobileDevice)
				{
					var
						fValueFunc = fValueAccessor(),
						fAllValueFunc = fAllBindingsAccessor(),
						fOverCallback = fAllValueFunc && fAllValueFunc['droppableOver'] ? fAllValueFunc['droppableOver'] : null,
						fOutCallback = fAllValueFunc && fAllValueFunc['droppableOut'] ? fAllValueFunc['droppableOut'] : null,
						oConf = {
							'tolerance': 'pointer',
							'hoverClass': 'droppableHover'
						}
					;

					if (fValueFunc)
					{
						oConf['drop'] = function (oEvent, oUi) {
							fValueFunc(oEvent, oUi);
						};

						if (fOverCallback)
						{
							oConf['over'] = function (oEvent, oUi) {
								fOverCallback(oEvent, oUi);
							};
						}

						if (fOutCallback)
						{
							oConf['out'] = function (oEvent, oUi) {
								fOutCallback(oEvent, oUi);
							};
						}

						$(oElement).droppable(oConf);

						ko.utils.domNodeDisposal.addDisposeCallback(oElement, function () {
							$(oElement).droppable('destroy');
						});
					}
				}
			}
		};

		ko.bindingHandlers.nano = {
			'init': function (oElement) {
				var Globals = __webpack_require__(/*! Common/Globals */ 8);
				if (!Globals.bDisableNanoScroll)
				{
					$(oElement)
						.addClass('nano')
						.nanoScroller({
							'iOSNativeScrolling': false,
							'preventPageScrolling': true
						})
					;
				}
			}
		};

		ko.bindingHandlers.saveTrigger = {
			'init': function (oElement) {

				var $oEl = $(oElement);

				$oEl.data('save-trigger-type', $oEl.is('input[type=text],input[type=email],input[type=password],select,textarea') ? 'input' : 'custom');

				if ('custom' === $oEl.data('save-trigger-type'))
				{
					$oEl.append(
						'&nbsp;&nbsp;<i class="icon-spinner animated"></i><i class="icon-remove error"></i><i class="icon-ok success"></i>'
					).addClass('settings-saved-trigger');
				}
				else
				{
					$oEl.addClass('settings-saved-trigger-input');
				}
			},
			'update': function (oElement, fValueAccessor) {
				var
					mValue = ko.unwrap(fValueAccessor()),
					$oEl = $(oElement)
				;

				if ('custom' === $oEl.data('save-trigger-type'))
				{
					switch (mValue.toString())
					{
						case '1':
							$oEl
								.find('.animated,.error').hide().removeClass('visible')
								.end()
								.find('.success').show().addClass('visible')
							;
							break;
						case '0':
							$oEl
								.find('.animated,.success').hide().removeClass('visible')
								.end()
								.find('.error').show().addClass('visible')
							;
							break;
						case '-2':
							$oEl
								.find('.error,.success').hide().removeClass('visible')
								.end()
								.find('.animated').show().addClass('visible')
							;
							break;
						default:
							$oEl
								.find('.animated').hide()
								.end()
								.find('.error,.success').removeClass('visible')
							;
							break;
					}
				}
				else
				{
					switch (mValue.toString())
					{
						case '1':
							$oEl.addClass('success').removeClass('error');
							break;
						case '0':
							$oEl.addClass('error').removeClass('success');
							break;
						case '-2':
		//					$oEl;
							break;
						default:
							$oEl.removeClass('error success');
							break;
					}
				}
			}
		};

		ko.bindingHandlers.emailsTags = {
			'init': function(oElement, fValueAccessor, fAllBindingsAccessor) {

				var
					Utils = __webpack_require__(/*! Common/Utils */ 1),
					EmailModel = __webpack_require__(/*! Model/Email */ 28),

					$oEl = $(oElement),
					fValue = fValueAccessor(),
					fAllBindings = fAllBindingsAccessor(),
					fAutoCompleteSource = fAllBindings['autoCompleteSource'] || null,
					fFocusCallback = function (bValue) {
						if (fValue && fValue.focused)
						{
							fValue.focused(!!bValue);
						}
					}
				;

				$oEl.inputosaurus({
					'parseOnBlur': true,
					'allowDragAndDrop': true,
					'focusCallback': fFocusCallback,
					'inputDelimiters': [',', ';', "\n"],
					'autoCompleteSource': fAutoCompleteSource,
	//				'elementHook': function (oEl, oItem) {
	//					if (oEl && oItem)
	//					{
	//						oEl.addClass('pgp');
	//						window.console.log(arguments);
	//					}
	//				},
					'parseHook': function (aInput) {

						return _.map(aInput, function (sInputValue) {

							var
								sValue = Utils.trim(sInputValue),
								oEmail = null
							;

							if ('' !== sValue)
							{
								oEmail = new EmailModel();
								oEmail.mailsoParse(sValue);
								return [oEmail.toLine(false), oEmail];
							}

							return [sValue, null];

						});

	//					var aResult = [];
	//
	//					_.each(aInput, function (sInputValue) {
	//
	//						var
	//							aM = null,
	//							aValues = [],
	//							sValue = Utils.trim(sInputValue),
	//							oEmail = null
	//						;
	//
	//						if ('' !== sValue)
	//						{
	//							aM = sValue.match(/[@]/g);
	//							if (aM && 0 < aM.length)
	//							{
	//								sValue = sValue.replace(/[\r\n]+/g, '; ').replace(/[\s]+/g, ' ');
	//								aValues = EmailModel.splitHelper(sValue, ';');
	//
	//								_.each(aValues, function (sV) {
	//
	//									oEmail = new EmailModel();
	//									oEmail.mailsoParse(sV);
	//
	//									if (oEmail.email)
	//									{
	//										aResult.push([oEmail.toLine(false), oEmail]);
	//									}
	//									else
	//									{
	//										aResult.push(['', null]);
	//									}
	//								});
	//							}
	//							else
	//							{
	//								aResult.push([sInputValue, null]);
	//							}
	//						}
	//						else
	//						{
	//							aResult.push([sInputValue, null]);
	//						}
	//					});
	//
	//					return aResult;
					},
					'change': _.bind(function (oEvent) {
						$oEl.data('EmailsTagsValue', oEvent.target.value);
						fValue(oEvent.target.value);
					}, this)
				});

				if (fValue && fValue.focused && fValue.focused.subscribe)
				{
					fValue.focused.subscribe(function (bValue) {
						$oEl.inputosaurus(!!bValue ? 'focus' : 'blur');
					});
				}
			},
			'update': function (oElement, fValueAccessor) {

				var
					$oEl = $(oElement),
					fValue = fValueAccessor(),
					sValue = ko.unwrap(fValue)
				;

				if ($oEl.data('EmailsTagsValue') !== sValue)
				{
					$oEl.val(sValue);
					$oEl.data('EmailsTagsValue', sValue);
					$oEl.inputosaurus('refresh');
				}
			}
		};

		ko.bindingHandlers.command = {
			'init': function (oElement, fValueAccessor, fAllBindingsAccessor, oViewModel) {
				var
					jqElement = $(oElement),
					oCommand = fValueAccessor()
				;

				if (!oCommand || !oCommand.enabled || !oCommand.canExecute)
				{
					throw new Error('You are not using command function');
				}

				jqElement.addClass('command');
				ko.bindingHandlers[jqElement.is('form') ? 'submit' : 'click'].init.apply(oViewModel, arguments);
			},

			'update': function (oElement, fValueAccessor) {

				var
					bResult = true,
					jqElement = $(oElement),
					oCommand = fValueAccessor()
				;

				bResult = oCommand.enabled();
				jqElement.toggleClass('command-not-enabled', !bResult);

				if (bResult)
				{
					bResult = oCommand.canExecute();
					jqElement.toggleClass('command-can-not-be-execute', !bResult);
				}

				jqElement.toggleClass('command-disabled disable disabled', !bResult).toggleClass('no-disabled', !!bResult);

				if (jqElement.is('input') || jqElement.is('button'))
				{
					jqElement.prop('disabled', !bResult);
				}
			}
		};

		// extenders

		ko.extenders.trimmer = function (oTarget)
		{
			var
				Utils = __webpack_require__(/*! Common/Utils */ 1),
				oResult = ko.computed({
					'read': oTarget,
					'write': function (sNewValue) {
						oTarget(Utils.trim(sNewValue.toString()));
					},
					'owner': this
				})
			;

			oResult(oTarget());
			return oResult;
		};

		ko.extenders.posInterer = function (oTarget, iDefault)
		{
			var
				Utils = __webpack_require__(/*! Common/Utils */ 1),
				oResult = ko.computed({
					'read': oTarget,
					'write': function (sNewValue) {
						var iNew = Utils.pInt(sNewValue.toString(), iDefault);
						if (0 >= iNew)
						{
							iNew = iDefault;
						}

						if (iNew === oTarget() && '' + iNew !== '' + sNewValue)
						{
							oTarget(iNew + 1);
						}

						oTarget(iNew);
					}
				})
			;

			oResult(oTarget());
			return oResult;
		};

		ko.extenders.limitedList = function (oTarget, mList)
		{
			var
				Utils = __webpack_require__(/*! Common/Utils */ 1),
				oResult = ko.computed({
					'read': oTarget,
					'write': function (sNewValue) {

						var
							sCurrentValue = ko.unwrap(oTarget),
							aList = ko.unwrap(mList)
						;

						if (Utils.isNonEmptyArray(aList))
						{
							if (-1 < Utils.inArray(sNewValue, aList))
							{
								oTarget(sNewValue);
							}
							else if (-1 < Utils.inArray(sCurrentValue, aList))
							{
								oTarget(sCurrentValue + ' ');
								oTarget(sCurrentValue);
							}
							else
							{
								oTarget(aList[0] + ' ');
								oTarget(aList[0]);
							}
						}
						else
						{
							oTarget('');
						}
					}
				}).extend({'notify': 'always'})
			;

			oResult(oTarget());

			if (!oResult.valueHasMutated)
			{
				oResult.valueHasMutated = function () {
					oTarget.valueHasMutated();
				};
			}

			return oResult;
		};

		ko.extenders.reversible = function (oTarget)
		{
			var mValue = oTarget();

			oTarget.commit = function ()
			{
				mValue = oTarget();
			};

			oTarget.reverse = function ()
			{
				oTarget(mValue);
			};

			oTarget.commitedValue = function ()
			{
				return mValue;
			};

			return oTarget;
		};

		ko.extenders.toggleSubscribe = function (oTarget, oOptions)
		{
			oTarget.subscribe(oOptions[1], oOptions[0], 'beforeChange');
			oTarget.subscribe(oOptions[2], oOptions[0]);

			return oTarget;
		};

		ko.extenders.toggleSubscribeProperty = function (oTarget, oOptions)
		{
			var sProp = oOptions[1];

			if (sProp)
			{
				oTarget.subscribe(function (oPrev) {
					if (oPrev && oPrev[sProp])
					{
						oPrev[sProp](false);
					}
				}, oOptions[0], 'beforeChange');

				oTarget.subscribe(function (oNext) {
					if (oNext && oNext[sProp])
					{
						oNext[sProp](true);
					}
				}, oOptions[0]);
			}

			return oTarget;
		};

		ko.extenders.falseTimeout = function (oTarget, iOption)
		{
			oTarget.iFalseTimeoutTimeout = 0;
			oTarget.subscribe(function (bValue) {
				if (bValue)
				{
					window.clearTimeout(oTarget.iFalseTimeoutTimeout);
					oTarget.iFalseTimeoutTimeout = window.setTimeout(function () {
						oTarget(false);
						oTarget.iFalseTimeoutTimeout = 0;
					}, __webpack_require__(/*! Common/Utils */ 1).pInt(iOption));
				}
			});

			return oTarget;
		};

		ko.extenders.specialThrottle = function (oTarget, iOption)
		{
			oTarget.iSpecialThrottleTimeoutValue = __webpack_require__(/*! Common/Utils */ 1).pInt(iOption);
			if (0 < oTarget.iSpecialThrottleTimeoutValue)
			{
				oTarget.iSpecialThrottleTimeout = 0;
				oTarget.valueForRead = ko.observable(!!oTarget()).extend({'throttle': 10});

				return ko.computed({
					'read': oTarget.valueForRead,
					'write': function (bValue) {

						if (bValue)
						{
							oTarget.valueForRead(bValue);
						}
						else
						{
							if (oTarget.valueForRead())
							{
								window.clearTimeout(oTarget.iSpecialThrottleTimeout);
								oTarget.iSpecialThrottleTimeout = window.setTimeout(function () {
									oTarget.valueForRead(false);
									oTarget.iSpecialThrottleTimeout = 0;
								}, oTarget.iSpecialThrottleTimeoutValue);
							}
							else
							{
								oTarget.valueForRead(bValue);
							}
						}
					}
				});
			}

			return oTarget;
		};

		// functions

		ko.observable.fn.validateNone = function ()
		{
			this.hasError = ko.observable(false);
			return this;
		};

		ko.observable.fn.validateEmail = function ()
		{
			var Utils = __webpack_require__(/*! Common/Utils */ 1);

			this.hasError = ko.observable(false);

			this.subscribe(function (sValue) {
				sValue = Utils.trim(sValue);
				this.hasError('' !== sValue && !(/^[^@\s]+@[^@\s]+$/.test(sValue)));
			}, this);

			this.valueHasMutated();
			return this;
		};

		ko.observable.fn.validateSimpleEmail = function ()
		{
			var Utils = __webpack_require__(/*! Common/Utils */ 1);

			this.hasError = ko.observable(false);

			this.subscribe(function (sValue) {
				sValue = Utils.trim(sValue);
				this.hasError('' !== sValue && !(/^.+@.+$/.test(sValue)));
			}, this);

			this.valueHasMutated();
			return this;
		};

		ko.observable.fn.deleteAccessHelper = function ()
		{
			this.extend({'falseTimeout': 3000}).extend({'toggleSubscribe': [null,
				function (oPrev) {
					if (oPrev && oPrev.deleteAccess)
					{
						oPrev.deleteAccess(false);
					}
				}, function (oNext) {
					if (oNext && oNext.deleteAccess)
					{
						oNext.deleteAccess(true);
					}
				}
			]});

			return this;
		};

		ko.observable.fn.validateFunc = function (fFunc)
		{
			var Utils = __webpack_require__(/*! Common/Utils */ 1);

			this.hasFuncError = ko.observable(false);

			if (Utils.isFunc(fFunc))
			{
				this.subscribe(function (sValue) {
					this.hasFuncError(!fFunc(sValue));
				}, this);

				this.valueHasMutated();
			}

			return this;
		};

		module.exports = ko;

	}(ko));


/***/ },
/* 4 */
/*!*****************************!*\
  !*** ./dev/Common/Enums.js ***!
  \*****************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var Enums = {};

		/**
		 * @enum {string}
		 */
		Enums.FileType = {
			'Unknown': 'unknown',
			'Text': 'text',
			'Html': 'html',
			'Code': 'code',
			'Eml': 'eml',
			'WordText': 'word-text',
			'Pdf': 'pdf',
			'Image': 'image',
			'Audio': 'audio',
			'Video': 'video',
			'Sheet': 'sheet',
			'Presentation': 'presentation',
			'Certificate': 'certificate',
			'CertificateBin': 'certificate-bin',
			'Archive': 'archive'
		};

		/**
		 * @enum {string}
		 */
		Enums.StorageResultType = {
			'Success': 'success',
			'Abort': 'abort',
			'Error': 'error',
			'Unload': 'unload'
		};

		/**
		 * @enum {string}
		 */
		Enums.Focused = {
			'None': 'none',
			'MessageList': 'message-list',
			'MessageView': 'message-view',
			'FolderList': 'folder-list'
		};

		/**
		 * @enum {number}
		 */
		Enums.State = {
			'Empty': 10,
			'Login': 20,
			'Auth': 30
		};

		/**
		 * @enum {number}
		 */
		Enums.StateType = {
			'Webmail': 0,
			'Admin': 1
		};

		/**
		 * @enum {string}
		 */
		Enums.Capa = {
			'TwoFactor': 'TWO_FACTOR',
			'TwoFactorForce': 'TWO_FACTOR_FORCE',
			'OpenPGP': 'OPEN_PGP',
			'Prefetch': 'PREFETCH',
			'Gravatar': 'GRAVATAR',
			'Folders': 'FOLDERS',
			'Composer': 'COMPOSER',
			'Contacts': 'CONTACTS',
			'Reload': 'RELOAD',
			'Search': 'SEARCH',
			'SearchAdv': 'SEARCH_ADV',
			'MessageActions': 'MESSAGE_ACTIONS',
			'MessageListActions': 'MESSAGELIST_ACTIONS',
			'AttachmentsActions': 'ATTACHMENTS_ACTIONS',
			'DangerousActions': 'DANGEROUS_ACTIONS',
			'Settings': 'SETTINGS',
			'Help': 'HELP',
			'Themes': 'THEMES',
			'UserBackground': 'USER_BACKGROUND',
			'Sieve': 'SIEVE',
			'Filters': 'FILTERS',
			'AttachmentThumbnails': 'ATTACHMENT_THUMBNAILS',
			'Templates': 'TEMPLATES',
			'AutoLogout': 'AUTOLOGOUT',
			'AdditionalAccounts': 'ADDITIONAL_ACCOUNTS',
			'Identities': 'IDENTITIES'
		};

		/**
		 * @enum {string}
		 */
		Enums.KeyState = {
			'All': 'all',
			'None': 'none',
			'ContactList': 'contact-list',
			'MessageList': 'message-list',
			'FolderList': 'folder-list',
			'MessageView': 'message-view',
			'Compose': 'compose',
			'Settings': 'settings',
			'Menu': 'menu',
			'PopupComposeOpenPGP': 'compose-open-pgp',
			'PopupMessageOpenPGP': 'message-open-pgp',
			'PopupViewOpenPGP': 'view-open-pgp',
			'PopupKeyboardShortcutsHelp': 'popup-keyboard-shortcuts-help',
			'PopupAsk': 'popup-ask'
		};

		/**
		 * @enum {number}
		 */
		Enums.FolderType = {
			'Inbox': 10,
			'SentItems': 11,
			'Draft': 12,
			'Trash': 13,
			'Spam': 14,
			'Archive': 15,
			'NotSpam': 80,
			'User': 99
		};

		/**
		 * @enum {number}
		 */
		Enums.ServerFolderType = {
			'USER': 0,
			'INBOX': 1,
			'SENT': 2,
			'DRAFTS': 3,
			'JUNK': 4,
			'TRASH': 5,
			'IMPORTANT': 10,
			'FLAGGED': 11,
			'ALL': 12
		};

		/**
		 * @enum {string}
		 */
		Enums.LoginSignMeTypeAsString = {
			'DefaultOff': 'defaultoff',
			'DefaultOn': 'defaulton',
			'Unused': 'unused'
		};

		/**
		 * @enum {number}
		 */
		Enums.LoginSignMeType = {
			'DefaultOff': 0,
			'DefaultOn': 1,
			'Unused': 2
		};

		/**
		 * @enum {string}
		 */
		Enums.ComposeType = {
			'Empty': 'empty',
			'Reply': 'reply',
			'ReplyAll': 'replyall',
			'Forward': 'forward',
			'ForwardAsAttachment': 'forward-as-attachment',
			'Draft': 'draft',
			'EditAsNew': 'editasnew'
		};

		/**
		 * @enum {number}
		 */
		Enums.UploadErrorCode = {
			'Normal': 0,
			'FileIsTooBig': 1,
			'FilePartiallyUploaded': 2,
			'FileNoUploaded': 3,
			'MissingTempFolder': 4,
			'FileOnSaveingError': 5,
			'FileType': 98,
			'Unknown': 99
		};

		/**
		 * @enum {number}
		 */
		Enums.SetSystemFoldersNotification = {
			'None': 0,
			'Sent': 1,
			'Draft': 2,
			'Spam': 3,
			'Trash': 4,
			'Archive': 5
		};

		/**
		 * @enum {number}
		 */
		Enums.ClientSideKeyName = {
			'FoldersLashHash': 0,
			'MessagesInboxLastHash': 1,
			'MailBoxListSize': 2,
			'ExpandedFolders': 3,
			'FolderListSize': 4,
			'MessageListSize': 5,
			'LastReplyAction': 6,
			'LastSignMe': 7,
			'ComposeLastIdentityID': 8
		};

		/**
		 * @enum {number}
		 */
		Enums.EventKeyCode = {
			'Backspace': 8,
			'Tab': 9,
			'Enter': 13,
			'Esc': 27,
			'PageUp': 33,
			'PageDown': 34,
			'Left': 37,
			'Right': 39,
			'Up': 38,
			'Down': 40,
			'End': 35,
			'Home': 36,
			'Space': 32,
			'Insert': 45,
			'Delete': 46,
			'A': 65,
			'S': 83
		};

		/**
		 * @enum {number}
		 */
		Enums.MessageSetAction = {
			'SetSeen': 0,
			'UnsetSeen': 1,
			'SetFlag': 2,
			'UnsetFlag': 3
		};

		/**
		 * @enum {number}
		 */
		Enums.MessageSelectAction = {
			'All': 0,
			'None': 1,
			'Invert': 2,
			'Unseen': 3,
			'Seen': 4,
			'Flagged': 5,
			'Unflagged': 6
		};

		/**
		 * @enum {number}
		 */
		Enums.DesktopNotification = {
			'Allowed': 0,
			'NotAllowed': 1,
			'Denied': 2,
			'NotSupported': 9
		};

		/**
		 * @enum {number}
		 */
		Enums.MessagePriority = {
			'Low': 5,
			'Normal': 3,
			'High': 1
		};

		/**
		 * @enum {string}
		 */
		Enums.EditorDefaultType = {
			'Html': 'Html',
			'Plain': 'Plain',
			'HtmlForced': 'HtmlForced',
			'PlainForced': 'PlainForced'
		};

		/**
		 * @enum {number}
		 */
		Enums.ServerSecure = {
			'None': 0,
			'SSL': 1,
			'TLS': 2
		};

		/**
		 * @enum {number}
		 */
		Enums.SearchDateType = {
			'All': -1,
			'Days3': 3,
			'Days7': 7,
			'Month': 30
		};

		/**
		 * @enum {number}
		 */
		Enums.SaveSettingsStep = {
			'Animate': -2,
			'Idle': -1,
			'TrueResult': 1,
			'FalseResult': 0
		};

		/**
		 * @enum {number}
		 */
		Enums.Layout = {
			'NoPreview': 0,
			'SidePreview': 1,
			'BottomPreview': 2,
			'Mobile': 3
		};

		/**
		 * @enum {string}
		 */
		Enums.FilterConditionField = {
			'From': 'From',
			'Recipient': 'Recipient',
			'Subject': 'Subject',
			'Header': 'Header',
			'Size': 'Size'
		};

		/**
		 * @enum {string}
		 */
		Enums.FilterConditionType = {
			'Contains': 'Contains',
			'NotContains': 'NotContains',
			'EqualTo': 'EqualTo',
			'NotEqualTo': 'NotEqualTo',
			'Over': 'Over',
			'Under': 'Under'
		};

		/**
		 * @enum {string}
		 */
		Enums.FiltersAction = {
			'None': 'None',
			'MoveTo': 'MoveTo',
			'Discard': 'Discard',
			'Vacation': 'Vacation',
			'Reject': 'Reject',
			'Forward': 'Forward'
		};

		/**
		 * @enum {string}
		 */
		Enums.FilterRulesType = {
			'All': 'All',
			'Any': 'Any'
		};

		/**
		 * @enum {number}
		 */
		Enums.SignedVerifyStatus = {
			'UnknownPublicKeys': -4,
			'UnknownPrivateKey': -3,
			'Unverified': -2,
			'Error': -1,
			'None': 0,
			'Success': 1
		};

		/**
		 * @enum {number}
		 */
		Enums.ContactPropertyType = {

			'Unknown': 0,

			'FullName': 10,

			'FirstName': 15,
			'LastName': 16,
			'MiddleName': 16,
			'Nick': 18,

			'NamePrefix': 20,
			'NameSuffix': 21,

			'Email': 30,
			'Phone': 31,
			'Web': 32,

			'Birthday': 40,

			'Facebook': 90,
			'Skype': 91,
			'GitHub': 92,

			'Note': 110,

			'Custom': 250
		};

		/**
		 * @enum {number}
		 */
		Enums.Notification = {
			'InvalidToken': 101,
			'AuthError': 102,
			'AccessError': 103,
			'ConnectionError': 104,
			'CaptchaError': 105,
			'SocialFacebookLoginAccessDisable': 106,
			'SocialTwitterLoginAccessDisable': 107,
			'SocialGoogleLoginAccessDisable': 108,
			'DomainNotAllowed': 109,
			'AccountNotAllowed': 110,

			'AccountTwoFactorAuthRequired': 120,
			'AccountTwoFactorAuthError': 121,

			'CouldNotSaveNewPassword': 130,
			'CurrentPasswordIncorrect': 131,
			'NewPasswordShort': 132,
			'NewPasswordWeak': 133,
			'NewPasswordForbidden': 134,

			'ContactsSyncError': 140,

			'CantGetMessageList': 201,
			'CantGetMessage': 202,
			'CantDeleteMessage': 203,
			'CantMoveMessage': 204,
			'CantCopyMessage': 205,

			'CantSaveMessage': 301,
			'CantSendMessage': 302,
			'InvalidRecipients': 303,

			'CantSaveFilters': 351,
			'CantGetFilters': 352,
			'FiltersAreNotCorrect': 355,

			'CantCreateFolder': 400,
			'CantRenameFolder': 401,
			'CantDeleteFolder': 402,
			'CantSubscribeFolder': 403,
			'CantUnsubscribeFolder': 404,
			'CantDeleteNonEmptyFolder': 405,

			'CantSaveSettings': 501,
			'CantSavePluginSettings': 502,

			'DomainAlreadyExists': 601,

			'CantInstallPackage': 701,
			'CantDeletePackage': 702,
			'InvalidPluginPackage': 703,
			'UnsupportedPluginPackage': 704,

			'LicensingServerIsUnavailable': 710,
			'LicensingExpired': 711,
			'LicensingBanned': 712,

			'DemoSendMessageError': 750,
			'DemoAccountError': 751,

			'AccountAlreadyExists': 801,
			'AccountDoesNotExist': 802,

			'MailServerError': 901,
			'ClientViewError': 902,
			'InvalidInputArgument': 903,

			'AjaxFalse': 950,
			'AjaxAbort': 951,
			'AjaxParse': 952,
			'AjaxTimeout': 953,

			'UnknownNotification': 999,
			'UnknownError': 999
		};

		module.exports = Enums;

	}());

/***/ },
/* 5 */
/*!****************************!*\
  !*** ./dev/Knoin/Knoin.js ***!
  \****************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),
			$ = __webpack_require__(/*! $ */ 11),
			ko = __webpack_require__(/*! ko */ 3),
			hasher = __webpack_require__(/*! hasher */ 83),
			crossroads = __webpack_require__(/*! crossroads */ 47),

			Globals = __webpack_require__(/*! Common/Globals */ 8),
			Plugins = __webpack_require__(/*! Common/Plugins */ 20),
			Utils = __webpack_require__(/*! Common/Utils */ 1)
		;

		/**
		 * @constructor
		 */
		function Knoin()
		{
			this.oScreens = {};
			this.sDefaultScreenName = '';
			this.oCurrentScreen = null;
		}

		Knoin.prototype.oScreens = {};
		Knoin.prototype.sDefaultScreenName = '';
		Knoin.prototype.oCurrentScreen = null;

		Knoin.prototype.hideLoading = function ()
		{
			$('#rl-content').show();
			$('#rl-loading').hide().remove();
		};

		/**
		 * @param {Object} thisObject
		 */
		Knoin.prototype.constructorEnd = function (thisObject)
		{
			if (Utils.isFunc(thisObject['__constructor_end']))
			{
				thisObject['__constructor_end'].call(thisObject);
			}
		};

		/**
		 * @param {string|Array} mName
		 * @param {Function} ViewModelClass
		 */
		Knoin.prototype.extendAsViewModel = function (mName, ViewModelClass)
		{
			if (ViewModelClass)
			{
				if (Utils.isArray(mName))
				{
					ViewModelClass.__names = mName;
				}
				else
				{
					ViewModelClass.__names = [mName];
				}

				ViewModelClass.__name = ViewModelClass.__names[0];
			}
		};

		/**
		 * @param {Function} SettingsViewModelClass
		 * @param {string} sLabelName
		 * @param {string} sTemplate
		 * @param {string} sRoute
		 * @param {boolean=} bDefault
		 */
		Knoin.prototype.addSettingsViewModel = function (SettingsViewModelClass, sTemplate, sLabelName, sRoute, bDefault)
		{
			SettingsViewModelClass.__rlSettingsData = {
				'Label':  sLabelName,
				'Template':  sTemplate,
				'Route':  sRoute,
				'IsDefault':  !!bDefault
			};

			Globals.aViewModels['settings'].push(SettingsViewModelClass);
		};

		/**
		 * @param {Function} SettingsViewModelClass
		 */
		Knoin.prototype.removeSettingsViewModel = function (SettingsViewModelClass)
		{
			Globals.aViewModels['settings-removed'].push(SettingsViewModelClass);
		};

		/**
		 * @param {Function} SettingsViewModelClass
		 */
		Knoin.prototype.disableSettingsViewModel = function (SettingsViewModelClass)
		{
			Globals.aViewModels['settings-disabled'].push(SettingsViewModelClass);
		};

		Knoin.prototype.routeOff = function ()
		{
			hasher.changed.active = false;
		};

		Knoin.prototype.routeOn = function ()
		{
			hasher.changed.active = true;
		};

		/**
		 * @param {string} sScreenName
		 * @return {?Object}
		 */
		Knoin.prototype.screen = function (sScreenName)
		{
			return ('' !== sScreenName && !Utils.isUnd(this.oScreens[sScreenName])) ? this.oScreens[sScreenName] : null;
		};

		/**
		 * @param {Function} ViewModelClass
		 * @param {Object=} oScreen
		 */
		Knoin.prototype.buildViewModel = function (ViewModelClass, oScreen)
		{
			if (ViewModelClass && !ViewModelClass.__builded)
			{
				var
					kn = this,
					oViewModel = new ViewModelClass(oScreen),
					sPosition = oViewModel.viewModelPosition(),
					oViewModelPlace = $('#rl-content #rl-' + sPosition.toLowerCase()),
					oViewModelDom = null
				;

				ViewModelClass.__builded = true;
				ViewModelClass.__vm = oViewModel;

				oViewModel.onShowTrigger = ko.observable(false);
				oViewModel.onHideTrigger = ko.observable(false);

				oViewModel.viewModelName = ViewModelClass.__name;
				oViewModel.viewModelNames = ViewModelClass.__names;

				if (oViewModelPlace && 1 === oViewModelPlace.length)
				{
					oViewModelDom = $('<div></div>').addClass('rl-view-model').addClass('RL-' + oViewModel.viewModelTemplate()).hide();
					oViewModelDom.appendTo(oViewModelPlace);

					oViewModel.viewModelDom = oViewModelDom;
					ViewModelClass.__dom = oViewModelDom;

					if ('Popups' === sPosition)
					{
						oViewModel.cancelCommand = oViewModel.closeCommand = Utils.createCommand(oViewModel, function () {
							kn.hideScreenPopup(ViewModelClass);
						});

						oViewModel.modalVisibility.subscribe(function (bValue) {

							var self = this;
							if (bValue)
							{
								this.viewModelDom.show();
								this.storeAndSetKeyScope();

								Globals.popupVisibilityNames.push(this.viewModelName);
								oViewModel.viewModelDom.css('z-index', 3000 + Globals.popupVisibilityNames().length + 10);

								if (this.onShowTrigger)
								{
									this.onShowTrigger(!this.onShowTrigger());
								}

								Utils.delegateRun(this, 'onShowWithDelay', [], 500);
							}
							else
							{
								Utils.delegateRun(this, 'onHide');
								Utils.delegateRun(this, 'onHideWithDelay', [], 500);

								if (this.onHideTrigger)
								{
									this.onHideTrigger(!this.onHideTrigger());
								}

								this.restoreKeyScope();

								_.each(this.viewModelNames, function (sName) {
									Plugins.runHook('view-model-on-hide', [sName, self]);
								});

								Globals.popupVisibilityNames.remove(this.viewModelName);
								oViewModel.viewModelDom.css('z-index', 2000);

								_.delay(function () {
									self.viewModelDom.hide();
								}, 300);
							}

						}, oViewModel);
					}

					_.each(ViewModelClass.__names, function (sName) {
						Plugins.runHook('view-model-pre-build', [sName, oViewModel, oViewModelDom]);
					});

					ko.applyBindingAccessorsToNode(oViewModelDom[0], {
						'translatorInit': true,
						'template': function () { return {'name': oViewModel.viewModelTemplate()};}
					}, oViewModel);

					Utils.delegateRun(oViewModel, 'onBuild', [oViewModelDom]);
					if (oViewModel && 'Popups' === sPosition)
					{
						oViewModel.registerPopupKeyDown();
					}

					_.each(ViewModelClass.__names, function (sName) {
						Plugins.runHook('view-model-post-build', [sName, oViewModel, oViewModelDom]);
					});
				}
				else
				{
					Utils.log('Cannot find view model position: ' + sPosition);
				}
			}

			return ViewModelClass ? ViewModelClass.__vm : null;
		};

		/**
		 * @param {Function} ViewModelClassToHide
		 */
		Knoin.prototype.hideScreenPopup = function (ViewModelClassToHide)
		{
			if (ViewModelClassToHide && ViewModelClassToHide.__vm && ViewModelClassToHide.__dom)
			{
				ViewModelClassToHide.__vm.modalVisibility(false);
			}
		};

		/**
		 * @param {Function} ViewModelClassToShow
		 * @param {Array=} aParameters
		 */
		Knoin.prototype.showScreenPopup = function (ViewModelClassToShow, aParameters)
		{
			if (ViewModelClassToShow)
			{
				this.buildViewModel(ViewModelClassToShow);

				if (ViewModelClassToShow.__vm && ViewModelClassToShow.__dom)
				{
					Utils.delegateRun(ViewModelClassToShow.__vm, 'onBeforeShow', aParameters || []);

					ViewModelClassToShow.__vm.modalVisibility(true);

					Utils.delegateRun(ViewModelClassToShow.__vm, 'onShow', aParameters || []);

					_.each(ViewModelClassToShow.__names, function (sName) {
						Plugins.runHook('view-model-on-show', [sName, ViewModelClassToShow.__vm, aParameters || []]);
					});
				}
			}
		};

		/**
		 * @param {Function} ViewModelClassToShow
		 * @return {boolean}
		 */
		Knoin.prototype.isPopupVisible = function (ViewModelClassToShow)
		{
			return ViewModelClassToShow && ViewModelClassToShow.__vm ? ViewModelClassToShow.__vm.modalVisibility() : false;
		};

		/**
		 * @param {string} sScreenName
		 * @param {string} sSubPart
		 */
		Knoin.prototype.screenOnRoute = function (sScreenName, sSubPart)
		{
			var
				self = this,
				oScreen = null,
				bSameScreen= false,
				oCross = null
			;

			if ('' === Utils.pString(sScreenName))
			{
				sScreenName = this.sDefaultScreenName;
			}

			if ('' !== sScreenName)
			{
				oScreen = this.screen(sScreenName);
				if (!oScreen)
				{
					oScreen = this.screen(this.sDefaultScreenName);
					if (oScreen)
					{
						sSubPart = sScreenName + '/' + sSubPart;
						sScreenName = this.sDefaultScreenName;
					}
				}

				if (oScreen && oScreen.__started)
				{
					bSameScreen = this.oCurrentScreen && oScreen === this.oCurrentScreen;

					if (!oScreen.__builded)
					{
						oScreen.__builded = true;

						if (Utils.isNonEmptyArray(oScreen.viewModels()))
						{
							_.each(oScreen.viewModels(), function (ViewModelClass) {
								this.buildViewModel(ViewModelClass, oScreen);
							}, this);
						}

						Utils.delegateRun(oScreen, 'onBuild');
					}

					_.defer(function () {

						// hide screen
						if (self.oCurrentScreen && !bSameScreen)
						{
							Utils.delegateRun(self.oCurrentScreen, 'onHide');
							Utils.delegateRun(self.oCurrentScreen, 'onHideWithDelay', [], 500);

							if (self.oCurrentScreen.onHideTrigger)
							{
								self.oCurrentScreen.onHideTrigger(!self.oCurrentScreen.onHideTrigger());
							}

							if (Utils.isNonEmptyArray(self.oCurrentScreen.viewModels()))
							{
								_.each(self.oCurrentScreen.viewModels(), function (ViewModelClass) {

									if (ViewModelClass.__vm && ViewModelClass.__dom &&
										'Popups' !== ViewModelClass.__vm.viewModelPosition())
									{
										ViewModelClass.__dom.hide();
										ViewModelClass.__vm.viewModelVisibility(false);

										Utils.delegateRun(ViewModelClass.__vm, 'onHide');
										Utils.delegateRun(ViewModelClass.__vm, 'onHideWithDelay', [], 500);

										if (ViewModelClass.__vm.onHideTrigger)
										{
											ViewModelClass.__vm.onHideTrigger(!ViewModelClass.__vm.onHideTrigger());
										}
									}

								});
							}
						}
						// --

						self.oCurrentScreen = oScreen;

						// show screen
						if (self.oCurrentScreen && !bSameScreen)
						{
							Utils.delegateRun(self.oCurrentScreen, 'onShow');
							if (self.oCurrentScreen.onShowTrigger)
							{
								self.oCurrentScreen.onShowTrigger(!self.oCurrentScreen.onShowTrigger());
							}

							Plugins.runHook('screen-on-show', [self.oCurrentScreen.screenName(), self.oCurrentScreen]);

							if (Utils.isNonEmptyArray(self.oCurrentScreen.viewModels()))
							{
								_.each(self.oCurrentScreen.viewModels(), function (ViewModelClass) {

									if (ViewModelClass.__vm && ViewModelClass.__dom &&
										'Popups' !== ViewModelClass.__vm.viewModelPosition())
									{
										Utils.delegateRun(ViewModelClass.__vm, 'onBeforeShow');

										ViewModelClass.__dom.show();
										ViewModelClass.__vm.viewModelVisibility(true);

										Utils.delegateRun(ViewModelClass.__vm, 'onShow');
										if (ViewModelClass.__vm.onShowTrigger)
										{
											ViewModelClass.__vm.onShowTrigger(!ViewModelClass.__vm.onShowTrigger());
										}

										Utils.delegateRun(ViewModelClass.__vm, 'onShowWithDelay', [], 200);

										_.each(ViewModelClass.__names, function (sName) {
											Plugins.runHook('view-model-on-show', [sName, ViewModelClass.__vm]);
										});
									}

								}, self);
							}
						}
						// --

						oCross = oScreen.__cross ? oScreen.__cross() : null;
						if (oCross)
						{
							oCross.parse(sSubPart);
						}
					});
				}
			}
		};

		/**
		 * @param {Array} aScreensClasses
		 */
		Knoin.prototype.startScreens = function (aScreensClasses)
		{
			$('#rl-content').css({
				'visibility': 'hidden'
			});

			_.each(aScreensClasses, function (CScreen) {

					if (CScreen)
					{
						var
							oScreen = new CScreen(),
							sScreenName = oScreen ? oScreen.screenName() : ''
						;

						if (oScreen && '' !== sScreenName)
						{
							if ('' === this.sDefaultScreenName)
							{
								this.sDefaultScreenName = sScreenName;
							}

							this.oScreens[sScreenName] = oScreen;
						}
					}

				}, this);


			_.each(this.oScreens, function (oScreen) {
				if (oScreen && !oScreen.__started && oScreen.__start)
				{
					oScreen.__started = true;
					oScreen.__start();

					Plugins.runHook('screen-pre-start', [oScreen.screenName(), oScreen]);
					Utils.delegateRun(oScreen, 'onStart');
					Plugins.runHook('screen-post-start', [oScreen.screenName(), oScreen]);
				}
			}, this);

			var oCross = crossroads.create();
			oCross.addRoute(/^([a-zA-Z0-9\-]*)\/?(.*)$/, _.bind(this.screenOnRoute, this));

			hasher.initialized.add(oCross.parse, oCross);
			hasher.changed.add(oCross.parse, oCross);
			hasher.init();

			$('#rl-content').css({
				'visibility': 'visible'
			});

			_.delay(function () {
				Globals.$html.removeClass('rl-started-trigger').addClass('rl-started');
			}, 100);

			_.delay(function () {
				Globals.$html.addClass('rl-started-delay');
			}, 200);
		};

		/**
		 * @param {string} sHash
		 * @param {boolean=} bSilence = false
		 * @param {boolean=} bReplace = false
		 */
		Knoin.prototype.setHash = function (sHash, bSilence, bReplace)
		{
			sHash = '#' === sHash.substr(0, 1) ? sHash.substr(1) : sHash;
			sHash = '/' === sHash.substr(0, 1) ? sHash.substr(1) : sHash;

			bReplace = Utils.isUnd(bReplace) ? false : !!bReplace;

			if (Utils.isUnd(bSilence) ? false : !!bSilence)
			{
				hasher.changed.active = false;
				hasher[bReplace ? 'replaceHash' : 'setHash'](sHash);
				hasher.changed.active = true;
			}
			else
			{
				hasher.changed.active = true;
				hasher[bReplace ? 'replaceHash' : 'setHash'](sHash);
				hasher.setHash(sHash);
			}
		};

		module.exports = new Knoin();

	}());

/***/ },
/* 6 */
/*!**********************************!*\
  !*** ./dev/Common/Translator.js ***!
  \**********************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			window = __webpack_require__(/*! window */ 10),
			$ = __webpack_require__(/*! $ */ 11),
			_ = __webpack_require__(/*! _ */ 2),
			ko = __webpack_require__(/*! ko */ 3),

			Enums = __webpack_require__(/*! Common/Enums */ 4),
			Utils = __webpack_require__(/*! Common/Utils */ 1),
			Globals = __webpack_require__(/*! Common/Globals */ 8)
		;

		/**
		 * @constructor
		 */
		function Translator()
		{
			this.data = window['rainloopI18N'] || {};
			this.notificationI18N = {};

			this.trigger = ko.observable(false);

			this.i18n = _.bind(this.i18n, this);

			this.init();
		}

		Translator.prototype.data = {};
		Translator.prototype.notificationI18N = {};

		/**
		 * @param {string} sKey
		 * @param {Object=} oValueList
		 * @param {string=} sDefaulValue
		 * @return {string}
		 */
		Translator.prototype.i18n = function (sKey, oValueList, sDefaulValue)
		{
			var
				sValueName = '',
				sResult = _.isUndefined(this.data[sKey]) ? (_.isUndefined(sDefaulValue) ? sKey : sDefaulValue) : this.data[sKey]
			;

			if (!_.isUndefined(oValueList) && !_.isNull(oValueList))
			{
				for (sValueName in oValueList)
				{
					if (_.has(oValueList, sValueName))
					{
						sResult = sResult.replace('%' + sValueName + '%', oValueList[sValueName]);
					}
				}
			}

			return sResult;
		};

		/**
		 * @param {Object} oElement
		 */
		Translator.prototype.i18nToNode = function (oElement)
		{
			var
				sKey = '',
				$oEl = $(oElement)
			;

			sKey = $oEl.data('i18n');
			if (sKey)
			{
				if ('[' === sKey.substr(0, 1))
				{
					switch (sKey.substr(0, 6))
					{
						case '[html]':
							$oEl.html(this.i18n(sKey.substr(6)));
							break;
						case '[place':
							$oEl.attr('placeholder', this.i18n(sKey.substr(13)));
							break;
						case '[title':
							$oEl.attr('title', this.i18n(sKey.substr(7)));
							break;
					}
				}
				else
				{
					$oEl.text(this.i18n(sKey));
				}
			}
		};

		/**
		 * @param {Object} oElements
		 * @param {boolean=} bAnimate = false
		 */
		Translator.prototype.i18nToNodes = function (oElements, bAnimate)
		{
			var self = this;
			_.defer(function () {

				$('[data-i18n]', oElements).each(function () {
					self.i18nToNode(this);
				});

				if (bAnimate && Globals.bAnimationSupported)
				{
					$('.i18n-animation[data-i18n]', oElements).letterfx({
						'fx': 'fall fade', 'backwards': false, 'timing': 50, 'fx_duration': '50ms', 'letter_end': 'restore', 'element_end': 'restore'
					});
				}
			});
		};

		Translator.prototype.reloadData = function ()
		{
			if (window['rainloopI18N'])
			{
				this.data = window['rainloopI18N'] || {};

				this.i18nToNodes(window.document, true);

				__webpack_require__(/*! Common/Momentor */ 24).reload();
				this.trigger(!this.trigger());
			}

			window['rainloopI18N'] = null;
		};

		Translator.prototype.initNotificationLanguage = function ()
		{
			var oN = this.notificationI18N || {};

			oN[Enums.Notification.InvalidToken] = this.i18n('NOTIFICATIONS/INVALID_TOKEN');
			oN[Enums.Notification.AuthError] = this.i18n('NOTIFICATIONS/AUTH_ERROR');
			oN[Enums.Notification.AccessError] = this.i18n('NOTIFICATIONS/ACCESS_ERROR');
			oN[Enums.Notification.ConnectionError] = this.i18n('NOTIFICATIONS/CONNECTION_ERROR');
			oN[Enums.Notification.CaptchaError] = this.i18n('NOTIFICATIONS/CAPTCHA_ERROR');
			oN[Enums.Notification.SocialFacebookLoginAccessDisable] = this.i18n('NOTIFICATIONS/SOCIAL_FACEBOOK_LOGIN_ACCESS_DISABLE');
			oN[Enums.Notification.SocialTwitterLoginAccessDisable] = this.i18n('NOTIFICATIONS/SOCIAL_TWITTER_LOGIN_ACCESS_DISABLE');
			oN[Enums.Notification.SocialGoogleLoginAccessDisable] = this.i18n('NOTIFICATIONS/SOCIAL_GOOGLE_LOGIN_ACCESS_DISABLE');
			oN[Enums.Notification.DomainNotAllowed] = this.i18n('NOTIFICATIONS/DOMAIN_NOT_ALLOWED');
			oN[Enums.Notification.AccountNotAllowed] = this.i18n('NOTIFICATIONS/ACCOUNT_NOT_ALLOWED');

			oN[Enums.Notification.AccountTwoFactorAuthRequired] = this.i18n('NOTIFICATIONS/ACCOUNT_TWO_FACTOR_AUTH_REQUIRED');
			oN[Enums.Notification.AccountTwoFactorAuthError] = this.i18n('NOTIFICATIONS/ACCOUNT_TWO_FACTOR_AUTH_ERROR');

			oN[Enums.Notification.CouldNotSaveNewPassword] = this.i18n('NOTIFICATIONS/COULD_NOT_SAVE_NEW_PASSWORD');
			oN[Enums.Notification.CurrentPasswordIncorrect] = this.i18n('NOTIFICATIONS/CURRENT_PASSWORD_INCORRECT');
			oN[Enums.Notification.NewPasswordShort] = this.i18n('NOTIFICATIONS/NEW_PASSWORD_SHORT');
			oN[Enums.Notification.NewPasswordWeak] = this.i18n('NOTIFICATIONS/NEW_PASSWORD_WEAK');
			oN[Enums.Notification.NewPasswordForbidden] = this.i18n('NOTIFICATIONS/NEW_PASSWORD_FORBIDDENT');

			oN[Enums.Notification.ContactsSyncError] = this.i18n('NOTIFICATIONS/CONTACTS_SYNC_ERROR');

			oN[Enums.Notification.CantGetMessageList] = this.i18n('NOTIFICATIONS/CANT_GET_MESSAGE_LIST');
			oN[Enums.Notification.CantGetMessage] = this.i18n('NOTIFICATIONS/CANT_GET_MESSAGE');
			oN[Enums.Notification.CantDeleteMessage] = this.i18n('NOTIFICATIONS/CANT_DELETE_MESSAGE');
			oN[Enums.Notification.CantMoveMessage] = this.i18n('NOTIFICATIONS/CANT_MOVE_MESSAGE');
			oN[Enums.Notification.CantCopyMessage] = this.i18n('NOTIFICATIONS/CANT_MOVE_MESSAGE');

			oN[Enums.Notification.CantSaveMessage] = this.i18n('NOTIFICATIONS/CANT_SAVE_MESSAGE');
			oN[Enums.Notification.CantSendMessage] = this.i18n('NOTIFICATIONS/CANT_SEND_MESSAGE');
			oN[Enums.Notification.InvalidRecipients] = this.i18n('NOTIFICATIONS/INVALID_RECIPIENTS');

			oN[Enums.Notification.CantSaveFilters] = this.i18n('NOTIFICATIONS/CANT_SAVE_FILTERS');
			oN[Enums.Notification.CantGetFilters] = this.i18n('NOTIFICATIONS/CANT_GET_FILTERS');
			oN[Enums.Notification.FiltersAreNotCorrect] = this.i18n('NOTIFICATIONS/FILTERS_ARE_NOT_CORRECT');

			oN[Enums.Notification.CantCreateFolder] = this.i18n('NOTIFICATIONS/CANT_CREATE_FOLDER');
			oN[Enums.Notification.CantRenameFolder] = this.i18n('NOTIFICATIONS/CANT_RENAME_FOLDER');
			oN[Enums.Notification.CantDeleteFolder] = this.i18n('NOTIFICATIONS/CANT_DELETE_FOLDER');
			oN[Enums.Notification.CantDeleteNonEmptyFolder] = this.i18n('NOTIFICATIONS/CANT_DELETE_NON_EMPTY_FOLDER');
			oN[Enums.Notification.CantSubscribeFolder] = this.i18n('NOTIFICATIONS/CANT_SUBSCRIBE_FOLDER');
			oN[Enums.Notification.CantUnsubscribeFolder] = this.i18n('NOTIFICATIONS/CANT_UNSUBSCRIBE_FOLDER');

			oN[Enums.Notification.CantSaveSettings] = this.i18n('NOTIFICATIONS/CANT_SAVE_SETTINGS');
			oN[Enums.Notification.CantSavePluginSettings] = this.i18n('NOTIFICATIONS/CANT_SAVE_PLUGIN_SETTINGS');

			oN[Enums.Notification.DomainAlreadyExists] = this.i18n('NOTIFICATIONS/DOMAIN_ALREADY_EXISTS');

			oN[Enums.Notification.CantInstallPackage] = this.i18n('NOTIFICATIONS/CANT_INSTALL_PACKAGE');
			oN[Enums.Notification.CantDeletePackage] = this.i18n('NOTIFICATIONS/CANT_DELETE_PACKAGE');
			oN[Enums.Notification.InvalidPluginPackage] = this.i18n('NOTIFICATIONS/INVALID_PLUGIN_PACKAGE');
			oN[Enums.Notification.UnsupportedPluginPackage] = this.i18n('NOTIFICATIONS/UNSUPPORTED_PLUGIN_PACKAGE');

			oN[Enums.Notification.LicensingServerIsUnavailable] = this.i18n('NOTIFICATIONS/LICENSING_SERVER_IS_UNAVAILABLE');
			oN[Enums.Notification.LicensingExpired] = this.i18n('NOTIFICATIONS/LICENSING_EXPIRED');
			oN[Enums.Notification.LicensingBanned] = this.i18n('NOTIFICATIONS/LICENSING_BANNED');

			oN[Enums.Notification.DemoSendMessageError] = this.i18n('NOTIFICATIONS/DEMO_SEND_MESSAGE_ERROR');
			oN[Enums.Notification.DemoAccountError] = this.i18n('NOTIFICATIONS/DEMO_ACCOUNT_ERROR');

			oN[Enums.Notification.AccountAlreadyExists] = this.i18n('NOTIFICATIONS/ACCOUNT_ALREADY_EXISTS');
			oN[Enums.Notification.AccountDoesNotExist] = this.i18n('NOTIFICATIONS/ACCOUNT_DOES_NOT_EXIST');

			oN[Enums.Notification.MailServerError] = this.i18n('NOTIFICATIONS/MAIL_SERVER_ERROR');
			oN[Enums.Notification.InvalidInputArgument] = this.i18n('NOTIFICATIONS/INVALID_INPUT_ARGUMENT');
			oN[Enums.Notification.UnknownNotification] = this.i18n('NOTIFICATIONS/UNKNOWN_ERROR');
			oN[Enums.Notification.UnknownError] = this.i18n('NOTIFICATIONS/UNKNOWN_ERROR');
		};

		/**
		 * @param {Function} fCallback
		 * @param {Object} oScope
		 * @param {Function=} fLangCallback
		 */
		Translator.prototype.initOnStartOrLangChange = function (fCallback, oScope, fLangCallback)
		{
			if (fCallback)
			{
				fCallback.call(oScope);
			}

			if (fLangCallback)
			{
				this.trigger.subscribe(function () {
					if (fCallback)
					{
						fCallback.call(oScope);
					}

					fLangCallback.call(oScope);
				});
			}
			else if (fCallback)
			{
				this.trigger.subscribe(fCallback, oScope);
			}
		};

		/**
		 * @param {number} iCode
		 * @param {*=} mMessage = ''
		 * @param {*=} mDefCode = null
		 * @return {string}
		 */
		Translator.prototype.getNotification = function (iCode, mMessage, mDefCode)
		{
			iCode = window.parseInt(iCode, 10) || 0;
			if (Enums.Notification.ClientViewError === iCode && mMessage)
			{
				return mMessage;
			}

			return _.isUndefined(this.notificationI18N[iCode]) ? (
				mDefCode && _.isUndefined(this.notificationI18N[mDefCode]) ? this.notificationI18N[mDefCode] : ''
			) : this.notificationI18N[iCode];
		};

		/**
		 * @param {*} mCode
		 * @return {string}
		 */
		Translator.prototype.getUploadErrorDescByCode = function (mCode)
		{
			var sResult = '';
			switch (window.parseInt(mCode, 10) || 0) {
			case Enums.UploadErrorCode.FileIsTooBig:
				sResult = this.i18n('UPLOAD/ERROR_FILE_IS_TOO_BIG');
				break;
			case Enums.UploadErrorCode.FilePartiallyUploaded:
				sResult = this.i18n('UPLOAD/ERROR_FILE_PARTIALLY_UPLOADED');
				break;
			case Enums.UploadErrorCode.FileNoUploaded:
				sResult = this.i18n('UPLOAD/ERROR_NO_FILE_UPLOADED');
				break;
			case Enums.UploadErrorCode.MissingTempFolder:
				sResult = this.i18n('UPLOAD/ERROR_MISSING_TEMP_FOLDER');
				break;
			case Enums.UploadErrorCode.FileOnSaveingError:
				sResult = this.i18n('UPLOAD/ERROR_ON_SAVING_FILE');
				break;
			case Enums.UploadErrorCode.FileType:
				sResult = this.i18n('UPLOAD/ERROR_FILE_TYPE');
				break;
			default:
				sResult = this.i18n('UPLOAD/ERROR_UNKNOWN');
				break;
			}

			return sResult;
		};

		/**
		 * @param {boolean} bAdmin
		 * @param {string} sLanguage
		 * @param {Function=} fDone
		 * @param {Function=} fFail
		 */
		Translator.prototype.reload = function (bAdmin, sLanguage, fDone, fFail)
		{
			var
				self = this,
				iStart = (new Date()).getTime()
			;

			Globals.$html.addClass('rl-changing-language');

			$.ajax({
					'url': __webpack_require__(/*! Common/Links */ 13).langLink(sLanguage, bAdmin),
					'dataType': 'script',
					'cache': true
				})
				.fail(fFail || Utils.emptyFunction)
				.done(function () {
					_.delay(function () {

						self.reloadData();

						(fDone || Utils.emptyFunction)();

						Globals.$html
							.removeClass('rl-changing-language')
							.removeClass('rl-rtl rl-ltr')
							.addClass(-1 < Utils.inArray(sLanguage, ['ar', 'he', 'ur']) ? 'rl-rtl' : 'rl-ltr')
	//						.attr('dir', -1 < Utils.inArray(sLanguage, ['ar', 'he', 'ur']) ? 'rtl' : 'ltr')
						;

					}, 500 < (new Date()).getTime() - iStart ? 1 : 500);
				})
			;
		};

		Translator.prototype.init = function ()
		{
			Globals.$html.addClass('rl-' + (Globals.$html.attr('dir') || 'ltr'));
		};

		module.exports = new Translator();

	}());


/***/ },
/* 7 */,
/* 8 */
/*!*******************************!*\
  !*** ./dev/Common/Globals.js ***!
  \*******************************/
/***/ function(module, exports, __webpack_require__) {

	
	/* global RL_COMMUNITY */

	(function () {

		'use strict';

		var
			Globals = {},

			window = __webpack_require__(/*! window */ 10),
			_ = __webpack_require__(/*! _ */ 2),
			$ = __webpack_require__(/*! $ */ 11),
			ko = __webpack_require__(/*! ko */ 3),
			key = __webpack_require__(/*! key */ 16),

			Enums = __webpack_require__(/*! Common/Enums */ 4)
		;

		Globals.$win = $(window);
		Globals.$doc = $(window.document);
		Globals.$html = $('html');
		Globals.$body = $('body');
		Globals.$div = $('<div></div>');

		Globals.$win.__sizes = [0, 0];

		/**
		 * @type {?}
		 */
		Globals.startMicrotime = (new window.Date()).getTime();

		/**
		 * @type {boolean}
		 */
		Globals.community = (false);

		/**
		 * @type {?}
		 */
		Globals.dropdownVisibility = ko.observable(false).extend({'rateLimit': 0});

		/**
		 * @type {boolean}
		 */
		Globals.useKeyboardShortcuts = ko.observable(true);

		/**
		 * @type {number}
		 */
		Globals.iAjaxErrorCount = 0;

		/**
		 * @type {number}
		 */
		Globals.iTokenErrorCount = 0;

		/**
		 * @type {number}
		 */
		Globals.iMessageBodyCacheCount = 0;

		/**
		 * @type {boolean}
		 */
		Globals.bUnload = false;

		/**
		 * @type {string}
		 */
		Globals.sUserAgent = 'navigator' in window && 'userAgent' in window.navigator &&
			window.navigator.userAgent.toLowerCase() || '';

		/**
		 * @type {boolean}
		 */
		Globals.bIE = Globals.sUserAgent.indexOf('msie') > -1;

		/**
		 * @type {boolean}
		 */
		Globals.bChrome = Globals.sUserAgent.indexOf('chrome') > -1;

		/**
		 * @type {boolean}
		 */
		Globals.bSafari = !Globals.bChrome && Globals.sUserAgent.indexOf('safari') > -1;

		/**
		 * @type {boolean}
		 */
		Globals.bMobileDevice =
			/android/i.test(Globals.sUserAgent) ||
			/iphone/i.test(Globals.sUserAgent) ||
			/ipod/i.test(Globals.sUserAgent) ||
			/ipad/i.test(Globals.sUserAgent) ||
			/blackberry/i.test(Globals.sUserAgent)
		;

		/**
		 * @type {boolean}
		 */
		Globals.bDisableNanoScroll = Globals.bMobileDevice;

		/**
		 * @type {boolean}
		 */
		Globals.bAllowPdfPreview = !Globals.bMobileDevice;

		/**
		 * @type {boolean}
		 */
		Globals.bAnimationSupported = !Globals.bMobileDevice && Globals.$html.hasClass('csstransitions') &&
			 Globals.$html.hasClass('cssanimations');

		/**
		 * @type {boolean}
		 */
		Globals.bXMLHttpRequestSupported = !!window.XMLHttpRequest;

		/**
		 * @type {*}
		 */
		Globals.__APP__ = null;

		/**
		 * @type {Object}
		 */
		Globals.oHtmlEditorDefaultConfig = {
			'title': false,
			'stylesSet': false,
			'customConfig': '',
			'contentsCss': '',
			'toolbarGroups': [
				{name: 'spec'},
				{name: 'styles'},
				{name: 'basicstyles', groups: ['basicstyles', 'cleanup', 'bidi']},
				{name: 'colors'},
				{name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align']},
				{name: 'links'},
				{name: 'insert'},
				{name: 'document', groups: ['mode', 'document', 'doctools']},
				{name: 'others'}
			],

			'removePlugins': 'liststyle',
			'removeButtons': 'Format,Undo,Redo,Cut,Copy,Paste,Anchor,Strike,Subscript,Superscript,Image,SelectAll,Source',
			'removeDialogTabs': 'link:advanced;link:target;image:advanced;images:advanced',

			'extraPlugins': 'plain,signature',

			'allowedContent': true,
			'extraAllowedContent': true,

			'fillEmptyBlocks': false,
			'ignoreEmptyParagraph': true,

			'font_defaultLabel': 'Arial',
			'fontSize_defaultLabel': '13',
			'fontSize_sizes': '10/10px;12/12px;13/13px;14/14px;16/16px;18/18px;20/20px;24/24px;28/28px;36/36px;48/48px'
		};

		/**
		 * @type {Object}
		 */
		Globals.oHtmlEditorLangsMap = {
			'bg': 'bg',
			'de': 'de',
			'es': 'es',
			'fr': 'fr',
			'hu': 'hu',
			'is': 'is',
			'it': 'it',
			'ja': 'ja',
			'ja-jp': 'ja',
			'ko': 'ko',
			'ko-kr': 'ko',
			'lt': 'lt',
			'lv': 'lv',
			'nl': 'nl',
			'no': 'no',
			'pl': 'pl',
			'pt': 'pt',
			'pt-pt': 'pt',
			'pt-br': 'pt-br',
			'ro': 'ro',
			'ru': 'ru',
			'sk': 'sk',
			'sv': 'sv',
			'tr': 'tr',
			'ua': 'ru',
			'zh': 'zh',
			'zh-tw': 'zh',
			'zh-cn': 'zh-cn'
		};

		if (Globals.bAllowPdfPreview && window.navigator && window.navigator.mimeTypes)
		{
			Globals.bAllowPdfPreview = !!_.find(window.navigator.mimeTypes, function (oType) {
				return oType && 'application/pdf' === oType.type;
			});
		}

		Globals.aBootstrapDropdowns = [];

		Globals.aViewModels = {
			'settings': [],
			'settings-removed': [],
			'settings-disabled': []
		};

		Globals.leftPanelDisabled = ko.observable(false);
		Globals.leftPanelType = ko.observable('');

		// popups
		Globals.popupVisibilityNames = ko.observableArray([]);

		Globals.popupVisibility = ko.computed(function () {
			return 0 < Globals.popupVisibilityNames().length;
		}, this);

		Globals.popupVisibility.subscribe(function (bValue) {
			Globals.$html.toggleClass('rl-modal', bValue);
		});

		// keys
		Globals.keyScopeReal = ko.observable(Enums.KeyState.All);
		Globals.keyScopeFake = ko.observable(Enums.KeyState.All);

		Globals.keyScope = ko.computed({
			'owner': this,
			'read': function () {
				return Globals.keyScopeFake();
			},
			'write': function (sValue) {

				if (Enums.KeyState.Menu !== sValue)
				{
					if (Enums.KeyState.Compose === sValue)
					{
						// disableKeyFilter
						key.filter = function () {
							return Globals.useKeyboardShortcuts();
						};
					}
					else
					{
						// restoreKeyFilter
						key.filter = function (event) {

							if (Globals.useKeyboardShortcuts())
							{
								var
									oElement = event.target || event.srcElement,
									sTagName = oElement ? oElement.tagName : ''
								;

								sTagName = sTagName.toUpperCase();
								return !(sTagName === 'INPUT' || sTagName === 'SELECT' || sTagName === 'TEXTAREA' ||
									(oElement && sTagName === 'DIV' && ('editorHtmlArea' === oElement.className || 'true' === '' + oElement.contentEditable))
								);
							}

							return false;
						};
					}

					Globals.keyScopeFake(sValue);
					if (Globals.dropdownVisibility())
					{
						sValue = Enums.KeyState.Menu;
					}
				}

				Globals.keyScopeReal(sValue);
			}
		});

		Globals.keyScopeReal.subscribe(function (sValue) {
	//		window.console.log('keyScope=' + sValue); // DEBUG
			key.setScope(sValue);
		});

		Globals.dropdownVisibility.subscribe(function (bValue) {
			if (bValue)
			{
				Globals.keyScope(Enums.KeyState.Menu);
			}
			else if (Enums.KeyState.Menu === key.getScope())
			{
				Globals.keyScope(Globals.keyScopeFake());
			}
		});

		module.exports = Globals;

	}());

/***/ },
/* 9 */
/*!*********************************!*\
  !*** ./dev/Storage/Settings.js ***!
  \*********************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			window = __webpack_require__(/*! window */ 10),

			Utils = __webpack_require__(/*! Common/Utils */ 1)
		;

		/**
		 * @constructor
		 */
		function SettingsStorage()
		{
			this.oSettings = window['rainloopAppData'] || {};
			this.oSettings = Utils.isNormal(this.oSettings) ? this.oSettings : {};
		}

		SettingsStorage.prototype.oSettings = null;

		/**
		 * @param {string} sName
		 * @return {?}
		 */
		SettingsStorage.prototype.settingsGet = function (sName)
		{
			return Utils.isUnd(this.oSettings[sName]) ? null : this.oSettings[sName];
		};

		/**
		 * @param {string} sName
		 * @param {?} mValue
		 */
		SettingsStorage.prototype.settingsSet = function (sName, mValue)
		{
			this.oSettings[sName] = mValue;
		};

		/**
		 * @param {string} sName
		 * @return {boolean}
		 */
		SettingsStorage.prototype.capa = function (sName)
		{
			var mCapa = this.settingsGet('Capa');
			return Utils.isArray(mCapa) && Utils.isNormal(sName) && -1 < Utils.inArray(sName, mCapa);
		};


		module.exports = new SettingsStorage();

	}());

/***/ },
/* 10 */
/*!*************************!*\
  !*** external "window" ***!
  \*************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = window;

/***/ },
/* 11 */
/*!********************************!*\
  !*** external "window.jQuery" ***!
  \********************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = window.jQuery;

/***/ },
/* 12 */
/*!***********************************!*\
  !*** ./dev/Knoin/AbstractView.js ***!
  \***********************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			ko = __webpack_require__(/*! ko */ 3),

			Enums = __webpack_require__(/*! Common/Enums */ 4),
			Utils = __webpack_require__(/*! Common/Utils */ 1),
			Globals = __webpack_require__(/*! Common/Globals */ 8)
		;

		/**
		 * @constructor
		 * @param {string=} sPosition = ''
		 * @param {string=} sTemplate = ''
		 */
		function AbstractView(sPosition, sTemplate)
		{
			this.bDisabeCloseOnEsc = false;
			this.sPosition = Utils.pString(sPosition);
			this.sTemplate = Utils.pString(sTemplate);

			this.sDefaultKeyScope = Enums.KeyState.None;
			this.sCurrentKeyScope = this.sDefaultKeyScope;

			this.viewModelVisibility = ko.observable(false);
			this.modalVisibility = ko.observable(false).extend({'rateLimit': 0});

			this.viewModelName = '';
			this.viewModelNames = [];
			this.viewModelDom = null;
		}

		/**
		 * @type {boolean}
		 */
		AbstractView.prototype.bDisabeCloseOnEsc = false;

		/**
		 * @type {string}
		 */
		AbstractView.prototype.sPosition = '';

		/**
		 * @type {string}
		 */
		AbstractView.prototype.sTemplate = '';

		/**
		 * @type {string}
		 */
		AbstractView.prototype.sDefaultKeyScope = Enums.KeyState.None;

		/**
		 * @type {string}
		 */
		AbstractView.prototype.sCurrentKeyScope = Enums.KeyState.None;

		/**
		 * @type {string}
		 */
		AbstractView.prototype.viewModelName = '';

		/**
		 * @type {Array}
		 */
		AbstractView.prototype.viewModelNames = [];

		/**
		 * @type {?}
		 */
		AbstractView.prototype.viewModelDom = null;

		/**
		 * @return {string}
		 */
		AbstractView.prototype.viewModelTemplate = function ()
		{
			return this.sTemplate;
		};

		/**
		 * @return {string}
		 */
		AbstractView.prototype.viewModelPosition = function ()
		{
			return this.sPosition;
		};

		AbstractView.prototype.cancelCommand = function () {};
		AbstractView.prototype.closeCommand = function () {};

		AbstractView.prototype.storeAndSetKeyScope = function ()
		{
			this.sCurrentKeyScope = Globals.keyScope();
			Globals.keyScope(this.sDefaultKeyScope);
		};

		AbstractView.prototype.restoreKeyScope = function ()
		{
			Globals.keyScope(this.sCurrentKeyScope);
		};

		AbstractView.prototype.registerPopupKeyDown = function ()
		{
			var self = this;

			Globals.$win.on('keydown', function (oEvent) {
				if (oEvent && self.modalVisibility && self.modalVisibility())
				{
					if (!this.bDisabeCloseOnEsc && Enums.EventKeyCode.Esc === oEvent.keyCode)
					{
						Utils.delegateRun(self, 'cancelCommand');
						return false;
					}
					else if (Enums.EventKeyCode.Backspace === oEvent.keyCode && !Utils.inFocus())
					{
						return false;
					}
				}

				return true;
			});
		};

		module.exports = AbstractView;

	}());

/***/ },
/* 13 */
/*!*****************************!*\
  !*** ./dev/Common/Links.js ***!
  \*****************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			window = __webpack_require__(/*! window */ 10),
			Utils = __webpack_require__(/*! Common/Utils */ 1)
		;

		/**
		 * @constructor
		 */
		function Links()
		{
			var Settings = __webpack_require__(/*! Storage/Settings */ 9);

			this.sBase = '#/';
			this.sServer = './?';

			this.sVersion = Settings.settingsGet('Version');
			this.sAuthSuffix = Settings.settingsGet('AuthAccountHash') || '0';
			this.sWebPrefix = Settings.settingsGet('WebPath') || '';
			this.sVersionPrefix = Settings.settingsGet('WebVersionPath') || 'rainloop/v/' + this.sVersion + '/';
			this.sStaticPrefix = this.sVersionPrefix + 'static/';
		}

		Links.prototype.populateAuthSuffix = function ()
		{
			this.sAuthSuffix = __webpack_require__(/*! Storage/Settings */ 9).settingsGet('AuthAccountHash') || '0';
		};

		/**
		 * @return {string}
		 */
		Links.prototype.subQueryPrefix = function ()
		{
			return '&q[]=';
		};

		/**
		 * @param {string=} sStartupUrl
		 * @return {string}
		 */
		Links.prototype.root = function (sStartupUrl)
		{
			return this.sBase + Utils.pString(sStartupUrl);
		};

		/**
		 * @return {string}
		 */
		Links.prototype.rootAdmin = function ()
		{
			return this.sServer + '/Admin/';
		};

		/**
		 * @return {string}
		 */
		Links.prototype.rootUser = function ()
		{
			return './';
		};

		/**
		 * @param {string} sDownload
		 * @param {string=} sCustomSpecSuffix
		 * @return {string}
		 */
		Links.prototype.attachmentDownload = function (sDownload, sCustomSpecSuffix)
		{
			sCustomSpecSuffix = Utils.isUnd(sCustomSpecSuffix) ? this.sAuthSuffix : sCustomSpecSuffix;
			return this.sServer + '/Raw/' + this.subQueryPrefix() + '/' + sCustomSpecSuffix + '/Download/' +
				this.subQueryPrefix() + '/' + sDownload;
		};

		/**
		 * @param {string} sDownload
		 * @param {string=} sCustomSpecSuffix
		 * @return {string}
		 */
		Links.prototype.attachmentPreview = function (sDownload, sCustomSpecSuffix)
		{
			sCustomSpecSuffix = Utils.isUnd(sCustomSpecSuffix) ? this.sAuthSuffix : sCustomSpecSuffix;
			return this.sServer + '/Raw/' + this.subQueryPrefix() + '/' + sCustomSpecSuffix + '/View/' +
				this.subQueryPrefix() + '/' + sDownload;
		};

		/**
		 * @param {string} sDownload
		 * @param {string=} sCustomSpecSuffix
		 * @return {string}
		 */
		Links.prototype.attachmentThumbnailPreview = function (sDownload, sCustomSpecSuffix)
		{
			sCustomSpecSuffix = Utils.isUnd(sCustomSpecSuffix) ? this.sAuthSuffix : sCustomSpecSuffix;
			return this.sServer + '/Raw/' + this.subQueryPrefix() + '/' + sCustomSpecSuffix + '/ViewThumbnail/' +
				this.subQueryPrefix() + '/' + sDownload;
		};

		/**
		 * @param {string} sDownload
		 * @param {string=} sCustomSpecSuffix
		 * @return {string}
		 */
		Links.prototype.attachmentPreviewAsPlain = function (sDownload, sCustomSpecSuffix)
		{
			sCustomSpecSuffix = Utils.isUnd(sCustomSpecSuffix) ? this.sAuthSuffix : sCustomSpecSuffix;
			return this.sServer + '/Raw/' + this.subQueryPrefix() + '/' + sCustomSpecSuffix + '/ViewAsPlain/' +
				this.subQueryPrefix() + '/' + sDownload;
		};

		/**
		 * @param {string} sDownload
		 * @param {string=} sCustomSpecSuffix
		 * @return {string}
		 */
		Links.prototype.attachmentFramed = function (sDownload, sCustomSpecSuffix)
		{
			sCustomSpecSuffix = Utils.isUnd(sCustomSpecSuffix) ? this.sAuthSuffix : sCustomSpecSuffix;
			return this.sServer + '/Raw/' + this.subQueryPrefix() + '/' + sCustomSpecSuffix + '/FramedView/' +
				this.subQueryPrefix() + '/' + sDownload;
		};

		/**
		 * @return {string}
		 */
		Links.prototype.upload = function ()
		{
			return this.sServer + '/Upload/' + this.subQueryPrefix() + '/' + this.sAuthSuffix + '/';
		};

		/**
		 * @return {string}
		 */
		Links.prototype.uploadContacts = function ()
		{
			return this.sServer + '/UploadContacts/' + this.subQueryPrefix() + '/' + this.sAuthSuffix + '/';
		};

		/**
		 * @return {string}
		 */
		Links.prototype.uploadBackground = function ()
		{
			return this.sServer + '/UploadBackground/' + this.subQueryPrefix() + '/' + this.sAuthSuffix + '/';
		};

		/**
		 * @return {string}
		 */
		Links.prototype.append = function ()
		{
			return this.sServer + '/Append/' + this.subQueryPrefix() + '/' + this.sAuthSuffix + '/';
		};

		/**
		 * @param {string} sEmail
		 * @return {string}
		 */
		Links.prototype.change = function (sEmail)
		{
			return this.sServer + '/Change/' + this.subQueryPrefix() + '/' + this.sAuthSuffix + '/' + Utils.encodeURIComponent(sEmail) + '/';
		};

		/**
		 * @param {string=} sAdd
		 * @return {string}
		 */
		Links.prototype.ajax = function (sAdd)
		{
			return this.sServer + '/Ajax/' + this.subQueryPrefix() + '/' + this.sAuthSuffix + '/' + sAdd;
		};

		/**
		 * @param {string} sRequestHash
		 * @return {string}
		 */
		Links.prototype.messageViewLink = function (sRequestHash)
		{
			return this.sServer + '/Raw/' + this.subQueryPrefix() + '/' + this.sAuthSuffix + '/ViewAsPlain/' + this.subQueryPrefix() + '/' + sRequestHash;
		};

		/**
		 * @param {string} sRequestHash
		 * @return {string}
		 */
		Links.prototype.messageDownloadLink = function (sRequestHash)
		{
			return this.sServer + '/Raw/' + this.subQueryPrefix() + '/' + this.sAuthSuffix + '/Download/' + this.subQueryPrefix() + '/' + sRequestHash;
		};

		/**
		 * @param {string} sEmail
		 * @return {string}
		 */
		Links.prototype.avatarLink = function (sEmail)
		{
			return this.sServer + '/Raw/0/Avatar/' + Utils.encodeURIComponent(sEmail) + '/';
		};

		/**
		 * @param {string} sHash
		 * @return {string}
		 */
		Links.prototype.publicLink = function (sHash)
		{
			return this.sServer + '/Raw/0/Public/' + sHash + '/';
		};

		/**
		 * @param {string} sHash
		 * @return {string}
		 */
		Links.prototype.userBackground = function (sHash)
		{
			return this.sServer + '/Raw/' + this.subQueryPrefix() + '/' + this.sAuthSuffix +
				'/UserBackground/' + this.subQueryPrefix() + '/' + sHash;
		};

		/**
		 * @param {string} sInboxFolderName = 'INBOX'
		 * @return {string}
		 */
		Links.prototype.inbox = function (sInboxFolderName)
		{
			sInboxFolderName = Utils.isUnd(sInboxFolderName) ? 'INBOX' : sInboxFolderName;
			return this.sBase + 'mailbox/' + sInboxFolderName;
		};

		/**
		 * @param {string=} sScreenName
		 * @return {string}
		 */
		Links.prototype.settings = function (sScreenName)
		{
			var sResult = this.sBase + 'settings';
			if (!Utils.isUnd(sScreenName) && '' !== sScreenName)
			{
				sResult += '/' + sScreenName;
			}

			return sResult;
		};

		/**
		 * @return {string}
		 */
		Links.prototype.about = function ()
		{
			return this.sBase + 'about';
		};

		/**
		 * @param {string} sScreenName
		 * @return {string}
		 */
		Links.prototype.admin = function (sScreenName)
		{
			var sResult = this.sBase;
			switch (sScreenName) {
			case 'AdminDomains':
				sResult += 'domains';
				break;
			case 'AdminSecurity':
				sResult += 'security';
				break;
			case 'AdminLicensing':
				sResult += 'licensing';
				break;
			}

			return sResult;
		};

		/**
		 * @param {string} sFolder
		 * @param {number=} iPage = 1
		 * @param {string=} sSearch = ''
		 * @param {string=} sThreadUid = ''
		 * @return {string}
		 */
		Links.prototype.mailBox = function (sFolder, iPage, sSearch, sThreadUid)
		{
			iPage = Utils.isNormal(iPage) ? Utils.pInt(iPage) : 1;
			sSearch = Utils.pString(sSearch);

			var
				sResult = this.sBase + 'mailbox/',
				iThreadUid = Utils.pInt(sThreadUid)
			;

			if ('' !== sFolder)
			{
				sResult += encodeURI(sFolder) + (0 < iThreadUid ? '~' + iThreadUid : '');
			}

			if (1 < iPage)
			{
				sResult = sResult.replace(/[\/]+$/, '');
				sResult += '/p' + iPage;
			}

			if ('' !== sSearch)
			{
				sResult = sResult.replace(/[\/]+$/, '');
				sResult += '/' + encodeURI(sSearch);
			}

			return sResult;
		};

		/**
		 * @return {string}
		 */
		Links.prototype.phpInfo = function ()
		{
			return this.sServer + 'Info';
		};

		/**
		 * @param {string} sLang
		 * @return {string}
		 */
		Links.prototype.langLink = function (sLang, bAdmin)
		{
			return this.sServer + '/Lang/0/' + (bAdmin ? 'Admin' : 'App') + '/' + encodeURI(sLang) + '/' + this.sVersion + '/';
		};

		/**
		 * @return {string}
		 */
		Links.prototype.exportContactsVcf = function ()
		{
			return this.sServer + '/Raw/' + this.subQueryPrefix() + '/' + this.sAuthSuffix + '/ContactsVcf/';
		};

		/**
		 * @return {string}
		 */
		Links.prototype.exportContactsCsv = function ()
		{
			return this.sServer + '/Raw/' + this.subQueryPrefix() + '/' + this.sAuthSuffix + '/ContactsCsv/';
		};

		/**
		 * @return {string}
		 */
		Links.prototype.emptyContactPic = function ()
		{
			return this.sStaticPrefix + 'css/images/empty-contact.png';
		};

		/**
		 * @param {string} sFileName
		 * @return {string}
		 */
		Links.prototype.sound = function (sFileName)
		{
			return  this.sStaticPrefix + 'sounds/' + sFileName;
		};

		/**
		 * @param {string} sTheme
		 * @return {string}
		 */
		Links.prototype.themePreviewLink = function (sTheme)
		{
			var sPrefix = this.sVersionPrefix;
			if ('@custom' === sTheme.substr(-7))
			{
				sTheme = Utils.trim(sTheme.substring(0, sTheme.length - 7));
				sPrefix = this.sWebPrefix;
			}

			return sPrefix + 'themes/' + window.encodeURI(sTheme) + '/images/preview.png';
		};

		/**
		 * @return {string}
		 */
		Links.prototype.notificationMailIcon = function ()
		{
			return  this.sStaticPrefix + 'css/images/icom-message-notification.png';
		};

		/**
		 * @return {string}
		 */
		Links.prototype.openPgpJs = function ()
		{
			return this.sStaticPrefix + 'js/min/openpgp.min.js';
		};

		/**
		 * @return {string}
		 */
		Links.prototype.openPgpWorkerJs = function ()
		{
			return this.sStaticPrefix + 'js/min/openpgp.worker.min.js';
		};

		/**
		 * @return {string}
		 */
		Links.prototype.openPgpWorkerPath = function ()
		{
			return this.sStaticPrefix + 'js/min/';
		};

		/**
		 * @param {boolean} bXAuth = false
		 * @return {string}
		 */
		Links.prototype.socialGoogle = function (bXAuth)
		{
			return this.sServer + 'SocialGoogle' + ('' !== this.sAuthSuffix ? '/' + this.subQueryPrefix() + '/' + this.sAuthSuffix + '/' : '') +
				(bXAuth ? '&xauth=1' : '');
		};

		/**
		 * @return {string}
		 */
		Links.prototype.socialTwitter = function ()
		{
			return this.sServer + 'SocialTwitter' + ('' !== this.sAuthSuffix ? '/' + this.subQueryPrefix() + '/' + this.sAuthSuffix + '/' : '');
		};

		/**
		 * @return {string}
		 */
		Links.prototype.socialFacebook = function ()
		{
			return this.sServer + 'SocialFacebook' + ('' !== this.sAuthSuffix ? '/' + this.subQueryPrefix() + '/' + this.sAuthSuffix + '/' : '');
		};

		module.exports = new Links();

	}());

/***/ },
/* 14 */,
/* 15 */
/*!******************************!*\
  !*** ./dev/Common/Consts.js ***!
  \******************************/
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {
	(function () {

		'use strict';

		var Consts = {};

		Consts.Values = {};
		Consts.DataImages = {};
		Consts.Defaults = {};

		/**
		 * @const
		 * @type {number}
		 */
		Consts.Defaults.MessagesPerPage = 20;

		/**
		 * @const
		 * @type {number}
		 */
		Consts.Defaults.ContactsPerPage = 50;

		/**
		 * @const
		 * @type {Array}
		 */
		Consts.Defaults.MessagesPerPageArray = [10, 20, 30, 50, 100/*, 150, 200, 300*/];

		/**
		 * @const
		 * @type {number}
		 */
		Consts.Defaults.DefaultAjaxTimeout = 30000;

		/**
		 * @const
		 * @type {number}
		 */
		Consts.Defaults.SearchAjaxTimeout = 300000;

		/**
		 * @const
		 * @type {number}
		 */
		Consts.Defaults.SendMessageAjaxTimeout = 300000;

		/**
		 * @const
		 * @type {number}
		 */
		Consts.Defaults.SaveMessageAjaxTimeout = 200000;

		/**
		 * @const
		 * @type {number}
		 */
		Consts.Defaults.ContactsSyncAjaxTimeout = 200000;

		/**
		 * @const
		 * @type {string}
		 */
		Consts.Values.UnuseOptionValue = '__UNUSE__';

		/**
		 * @const
		 * @type {string}
		 */
		Consts.Values.ClientSideStorageIndexName = 'rlcsc';

		/**
		 * @const
		 * @type {number}
		 */
		Consts.Values.ImapDefaulPort = 143;

		/**
		 * @const
		 * @type {number}
		 */
		Consts.Values.ImapDefaulSecurePort = 993;

		/**
		 * @const
		 * @type {number}
		 */
		Consts.Values.SieveDefaulPort = 4190;

		/**
		 * @const
		 * @type {number}
		 */
		Consts.Values.SmtpDefaulPort = 25;

		/**
		 * @const
		 * @type {number}
		 */
		Consts.Values.SmtpDefaulSecurePort = 465;

		/**
		 * @const
		 * @type {number}
		 */
		Consts.Values.MessageBodyCacheLimit = 15;

		/**
		 * @const
		 * @type {number}
		 */
		Consts.Values.AjaxErrorLimit = 7;

		/**
		 * @const
		 * @type {number}
		 */
		Consts.Values.TokenErrorLimit = 10;

		/**
		 * @const
		 * @type {string}
		 */
		Consts.Values.RainLoopTrialKey = 'RAINLOOP-TRIAL-KEY';

		/**
		 * @const
		 * @type {string}
		 */
	//	Consts.DataImages.UserDotPic = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQIW2P8DwQACgAD/il4QJ8AAAAASUVORK5CYII=';
		Consts.DataImages.UserDotPic = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAuCAYAAABXuSs3AAAHHklEQVRoQ7VZW08bVxCeXRuwIbTGXIwNtBBaqjwgVUiR8lDlbza9qe1DpVZ9aNQ/0KpPeaJK07SpcuEeCEmUAObm21bfrL9lONjexSYrWfbunj37zXdmvpkz9oIgCKTD0Wg0xPd94TDP83Q0zvWa50vzklSrdanVanqf4/D84GBGr+F+Op3S8fqoJxLOdnZgTvsO/nYhenHA+UC7CWF1uXwkb9++ldPTUwVerVbVqFQqpR8YPjQ0JCMjI5LNDijoRgP3PQVu5+5Eor2XGLg7IV4GkIdHJ/LmzRs5ODiIwNbrdR0O0GCcq4Xz4eFhmZyclP7+tDQaIik/BG5XKQn4SwG3zJTLZXn9+rUclI8UHD5YVoDDN8bSzXhONwL48fFxGR4eilzFZT1uFRIB5yT8BqCdnR3Z3d0VP9Un6XRawYJpggVrZBv38ME4XKtUKnLt2jUplUoy1PR/l3U7T6sVSAQcgMAkj8PDQ9ne3pajoyMRL7zeKsYZWHgWYDGmv78/mmdwcFA+mJlSgziHDWrERrsjEXDXegTi1tZW+DLxI2bxIrqFNYTXyDyCFweMAHCwb8e4RnTNuOsqe3t7sra21pTD0Kct666E8XlcZyzw9/RUUXK5nK5oUinUQI6TQ3cynO/v78vq6qrKXCNwlTiJJpyNGc3nZHp6uqV2dwrQWOCtZBDAV1ZWwsQk7f0wiQn5kffbAu/0/KWBYzIC1+XukfGx0RGZmppKlC2tIV0Bh4aDcZW7HhkfH8urLLZL7T2pihvlkMNnz56FiadHxicL41IsFpN41bkxsYxbRdFo9jwB8KdPn14J8KnSpBQKhQs63nPmbCVRcBUAR2Lq1VVmpksyMTFxAXjcEsQybiegESionjx5osCZOeNe1O4+EhCAX7bQSgQcxRHTMgAgcz5+/Dis/hL4uHU3/B4YGNASGHIKxuEql0k+l05AeIAF1vPnz5VxFFmdDlaJrMtZITJeSsXCOTlMunKxjLtMYOKNjQ158eJFuAuKkUOb5sEwgff19SkJUBVkThZUbnXZrtCKBQ6gbnWIkjZpyne3ejAWoGnA7Icz6irvBLgbOMicCM6TkxPx/LAkbXfgWcsazuE2kFRsKD5Z+CiqDumKncpZvieWcS6dDVD8xiYCNflpJdwcdwJOf9airLmVQ7DPzMxIYWLsXGXoVqLt5k0M3K3JUVPDZdbWNzsCp48TPFdvdnZWUz32nDha7bJ63kgAJPzSdRks9/Kf9xMJAQ1gq2NpaUmy2Yz4zar4nQC3xb99AQwCcGzLAAwuhG8YiWvcOKts+r4GOe5nMhm5efOm9lUA3E3vSZJRrKvE0fnPv//Jy5cvo5cTHIPQbSjhOoqq69evS19f6lxDKK4+sVhigZPtKJqbrQeqxd5+WR4+fKgqgT0k2XX3nhiPgETWXFhYkFzuPZ2yVq1GTSOXpE47/VjgNnD4m4GG7/LhsTx69EiwD4Vr2MwIIxgbAH18fKx1yfz8vEogNvGtWnCuhLZa9UTAreVWFsHy/b/+Vrbdl7E5REMQD2jDoUbByty+/ZnU64GkU2HzyJLhktU1cLv8nARgkYS2d3ajAgwG8qU2oLmDZ92CMaOjo7K4uCiZgbDWaRWgnZhPxLhrMUCvr69riwKZk1LHF7XqrWAO9hJxH6ozNzcnCx/PqztZg9mf6SQMscCtm2C5ke4BGMlHWTUp36036AJajDVrFMzBrhhWslQsSrFYiOqVpMriNYIgqFRq2j3FAb/zffT6zuxFXxsNzs3NTXn16lW4gYiW96w1FyedF+83xG/2FNGCRpU4NjamMsn+OZ9xE5RXqdaDdPpib6RWCzuwKF9RxqI2AVNQBwQYJoK0wdBejnqtEikP3pfP51XjUTESl12FqJEKxsEorARYDD44ONTeID7YpsEnrRvQfWAI2e8WfDaTUSIwJ0iBCmFOtOUAHvVMPp/TPwvYFVYFIuP8l+DBgwdaa2Miqwa0GgYwfeMltovbDfh6c1vIgMYcliSsKv4IWFr6VDHxvldvBAH+1sA+cnl5WYOPmmr9ir+1l9I0Cgz0yjhXjfJJ0JROnmezWbl165ayr/5fqwcBNr7IfhjMqKcvESSM4eRcCasQ3bDNObmKPLdGUGpZsN24cUNLBm9zazu4d++e6qpNBFaTuUS26U5dpuR1CxyA7J9ddrMRqlz4pwLLYawymPd++/2PADt2ugcGwq9gCCdhQ96C6xWwa6j1ceuq+I0EhW0i8MAIVJfeL3d/DVD8EKi12P6/2S2jV/EccVB54O/ejz/9HGCpoBBMta5rXMXLu53D1XAwjhXwvvv+h4BAXVe4bOu3O3ChxF08LiZFG3fel199G9CH3fLyqv24NcB44MRhpdK788U3CpyKwsCw590xmfSpzsBt0Fqc3ud3vtZigxWcVZCklVpSiN0w3q5E/h9TGMIUuA3+EQAAAABJRU5ErkJggg==';

		/**
		 * @const
		 * @type {string}
		 */
		Consts.DataImages.TranspPic = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQIW2NkAAIAAAoAAggA9GkAAAAASUVORK5CYII=';

		module.exports = Consts;

	}(module));
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! (webpack)/buildin/module.js */ 79)(module)))

/***/ },
/* 16 */
/*!*****************************!*\
  !*** external "window.key" ***!
  \*****************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = window.key;

/***/ },
/* 17 */
/*!**********************************!*\
  !*** ./dev/Remote/Admin/Ajax.js ***!
  \**********************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),

			AbstractAjaxRemote = __webpack_require__(/*! Remote/AbstractAjax */ 67)
		;

		/**
		 * @constructor
		 * @extends AbstractAjaxRemote
		 */
		function RemoteAdminStorage()
		{
			AbstractAjaxRemote.call(this);

			this.oRequests = {};
		}

		_.extend(RemoteAdminStorage.prototype, AbstractAjaxRemote.prototype);

		/**
		 * @param {?Function} fCallback
		 * @param {string} sLogin
		 * @param {string} sPassword
		 */
		RemoteAdminStorage.prototype.adminLogin = function (fCallback, sLogin, sPassword)
		{
			this.defaultRequest(fCallback, 'AdminLogin', {
				'Login': sLogin,
				'Password': sPassword
			});
		};

		/**
		 * @param {?Function} fCallback
		 */
		RemoteAdminStorage.prototype.adminLogout = function (fCallback)
		{
			this.defaultRequest(fCallback, 'AdminLogout');
		};

		/**
		 * @param {?Function} fCallback
		 * @param {?} oData
		 */
		RemoteAdminStorage.prototype.saveAdminConfig = function (fCallback, oData)
		{
			this.defaultRequest(fCallback, 'AdminSettingsUpdate', oData);
		};

		/**
		 * @param {?Function} fCallback
		 */
		RemoteAdminStorage.prototype.domainList = function (fCallback)
		{
			this.defaultRequest(fCallback, 'AdminDomainList');
		};

		/**
		 * @param {?Function} fCallback
		 */
		RemoteAdminStorage.prototype.pluginList = function (fCallback)
		{
			this.defaultRequest(fCallback, 'AdminPluginList');
		};

		/**
		 * @param {?Function} fCallback
		 */
		RemoteAdminStorage.prototype.packagesList = function (fCallback)
		{
			this.defaultRequest(fCallback, 'AdminPackagesList');
		};

		/**
		 * @param {?Function} fCallback
		 */
		RemoteAdminStorage.prototype.coreData = function (fCallback)
		{
			this.defaultRequest(fCallback, 'AdminCoreData');
		};

		/**
		 * @param {?Function} fCallback
		 */
		RemoteAdminStorage.prototype.updateCoreData = function (fCallback)
		{
			this.defaultRequest(fCallback, 'AdminUpdateCoreData', {}, 90000);
		};

		/**
		 * @param {?Function} fCallback
		 * @param {Object} oPackage
		 */
		RemoteAdminStorage.prototype.packageInstall = function (fCallback, oPackage)
		{
			this.defaultRequest(fCallback, 'AdminPackageInstall', {
				'Id': oPackage.id,
				'Type': oPackage.type,
				'File': oPackage.file
			}, 60000);
		};

		/**
		 * @param {?Function} fCallback
		 * @param {Object} oPackage
		 */
		RemoteAdminStorage.prototype.packageDelete = function (fCallback, oPackage)
		{
			this.defaultRequest(fCallback, 'AdminPackageDelete', {
				'Id': oPackage.id
			});
		};

		/**
		 * @param {?Function} fCallback
		 * @param {string} sName
		 */
		RemoteAdminStorage.prototype.domain = function (fCallback, sName)
		{
			this.defaultRequest(fCallback, 'AdminDomainLoad', {
				'Name': sName
			});
		};

		/**
		 * @param {?Function} fCallback
		 * @param {string} sName
		 */
		RemoteAdminStorage.prototype.plugin = function (fCallback, sName)
		{
			this.defaultRequest(fCallback, 'AdminPluginLoad', {
				'Name': sName
			});
		};

		/**
		 * @param {?Function} fCallback
		 * @param {string} sName
		 */
		RemoteAdminStorage.prototype.domainDelete = function (fCallback, sName)
		{
			this.defaultRequest(fCallback, 'AdminDomainDelete', {
				'Name': sName
			});
		};

		/**
		 * @param {?Function} fCallback
		 * @param {string} sName
		 * @param {boolean} bDisabled
		 */
		RemoteAdminStorage.prototype.domainDisable = function (fCallback, sName, bDisabled)
		{
			return this.defaultRequest(fCallback, 'AdminDomainDisable', {
				'Name': sName,
				'Disabled': !!bDisabled ? '1' : '0'
			});
		};

		/**
		 * @param {?Function} fCallback
		 * @param {Object} oConfig
		 */
		RemoteAdminStorage.prototype.pluginSettingsUpdate = function (fCallback, oConfig)
		{
			return this.defaultRequest(fCallback, 'AdminPluginSettingsUpdate', oConfig);
		};

		/**
		 * @param {?Function} fCallback
		 * @param {boolean} bForce
		 */
		RemoteAdminStorage.prototype.licensing = function (fCallback, bForce)
		{
			return this.defaultRequest(fCallback, 'AdminLicensing', {
				'Force' : bForce ? '1' : '0'
			});
		};

		/**
		 * @param {?Function} fCallback
		 * @param {string} sDomain
		 * @param {string} sKey
		 */
		RemoteAdminStorage.prototype.licensingActivate = function (fCallback, sDomain, sKey)
		{
			return this.defaultRequest(fCallback, 'AdminLicensingActivate', {
				'Domain' : sDomain,
				'Key' : sKey
			});
		};

		/**
		 * @param {?Function} fCallback
		 * @param {string} sName
		 * @param {boolean} bDisabled
		 */
		RemoteAdminStorage.prototype.pluginDisable = function (fCallback, sName, bDisabled)
		{
			return this.defaultRequest(fCallback, 'AdminPluginDisable', {
				'Name': sName,
				'Disabled': !!bDisabled ? '1' : '0'
			});
		};

		RemoteAdminStorage.prototype.createOrUpdateDomain = function (fCallback,
			bCreate, sName,
			sIncHost, iIncPort, sIncSecure, bIncShortLogin,
			bUseSieve, sSieveAllowRaw, sSieveHost, iSievePort, sSieveSecure,
			sOutHost, iOutPort, sOutSecure, bOutShortLogin, bOutAuth, bOutPhpMail,
			sWhiteList)
		{
			this.defaultRequest(fCallback, 'AdminDomainSave', {
				'Create': bCreate ? '1' : '0',
				'Name': sName,

				'IncHost': sIncHost,
				'IncPort': iIncPort,
				'IncSecure': sIncSecure,
				'IncShortLogin': bIncShortLogin ? '1' : '0',

				'UseSieve': bUseSieve ? '1' : '0',
				'SieveAllowRaw': sSieveAllowRaw ? '1' : '0',
				'SieveHost': sSieveHost,
				'SievePort': iSievePort,
				'SieveSecure': sSieveSecure,

				'OutHost': sOutHost,
				'OutPort': iOutPort,
				'OutSecure': sOutSecure,
				'OutShortLogin': bOutShortLogin ? '1' : '0',
				'OutAuth': bOutAuth ? '1' : '0',
				'OutUsePhpMail': bOutPhpMail ? '1' : '0',

				'WhiteList': sWhiteList
			});
		};

		RemoteAdminStorage.prototype.testConnectionForDomain = function (fCallback, sName,
			sIncHost, iIncPort, sIncSecure,
			bUseSieve, sSieveHost, iSievePort, sSieveSecure,
			sOutHost, iOutPort, sOutSecure, bOutAuth, bOutPhpMail)
		{
			this.defaultRequest(fCallback, 'AdminDomainTest', {
				'Name': sName,
				'IncHost': sIncHost,
				'IncPort': iIncPort,
				'IncSecure': sIncSecure,
				'UseSieve': bUseSieve ? '1' : '0',
				'SieveHost': sSieveHost,
				'SievePort': iSievePort,
				'SieveSecure': sSieveSecure,
				'OutHost': sOutHost,
				'OutPort': iOutPort,
				'OutSecure': sOutSecure,
				'OutAuth': bOutAuth ? '1' : '0',
				'OutUsePhpMail': bOutPhpMail ? '1' : '0'
			});
		};

		/**
		 * @param {?Function} fCallback
		 * @param {?} oData
		 */
		RemoteAdminStorage.prototype.testContacts = function (fCallback, oData)
		{
			this.defaultRequest(fCallback, 'AdminContactsTest', oData);
		};

		/**
		 * @param {?Function} fCallback
		 * @param {?} oData
		 */
		RemoteAdminStorage.prototype.saveNewAdminPassword = function (fCallback, oData)
		{
			this.defaultRequest(fCallback, 'AdminPasswordUpdate', oData);
		};

		/**
		 * @param {?Function} fCallback
		 */
		RemoteAdminStorage.prototype.adminPing = function (fCallback)
		{
			this.defaultRequest(fCallback, 'AdminPing');
		};

		module.exports = new RemoteAdminStorage();

	}());

/***/ },
/* 18 */
/*!**************************!*\
  !*** ./dev/App/Admin.js ***!
  \**************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			window = __webpack_require__(/*! window */ 10),
			_ = __webpack_require__(/*! _ */ 2),
			ko = __webpack_require__(/*! ko */ 3),
			progressJs = __webpack_require__(/*! progressJs */ 84),

			Enums = __webpack_require__(/*! Common/Enums */ 4),
			Utils = __webpack_require__(/*! Common/Utils */ 1),
			Links = __webpack_require__(/*! Common/Links */ 13),
			Translator = __webpack_require__(/*! Common/Translator */ 6),

			Settings = __webpack_require__(/*! Storage/Settings */ 9),
			AppStore = __webpack_require__(/*! Stores/Admin/App */ 33),
			DomainStore = __webpack_require__(/*! Stores/Admin/Domain */ 69),
			PluginStore = __webpack_require__(/*! Stores/Admin/Plugin */ 72),
			LicenseStore = __webpack_require__(/*! Stores/Admin/License */ 70),
			PackageStore = __webpack_require__(/*! Stores/Admin/Package */ 71),
			CoreStore = __webpack_require__(/*! Stores/Admin/Core */ 91),
			Remote = __webpack_require__(/*! Remote/Admin/Ajax */ 17),

			kn = __webpack_require__(/*! Knoin/Knoin */ 5),
			AbstractApp = __webpack_require__(/*! App/Abstract */ 53)
		;

		/**
		 * @constructor
		 * @extends AbstractApp
		 */
		function AdminApp()
		{
			AbstractApp.call(this, Remote);
		}

		_.extend(AdminApp.prototype, AbstractApp.prototype);

		AdminApp.prototype.remote = function ()
		{
			return Remote;
		};

		AdminApp.prototype.reloadDomainList = function ()
		{
			DomainStore.domains.loading(true);

			Remote.domainList(function (sResult, oData) {
				DomainStore.domains.loading(false);
				if (Enums.StorageResultType.Success === sResult && oData && oData.Result)
				{
					var aList = _.map(oData.Result, function (bEnabled, sName) {
						return {
							'name': sName,
							'disabled': ko.observable(!bEnabled),
							'deleteAccess': ko.observable(false)
						};
					}, this);

					DomainStore.domains(aList);
				}
			});
		};

		AdminApp.prototype.reloadPluginList = function ()
		{
			PluginStore.plugins.loading(true);

			Remote.pluginList(function (sResult, oData) {

				PluginStore.plugins.loading(false);

				if (Enums.StorageResultType.Success === sResult && oData && oData.Result)
				{
					var aList = _.map(oData.Result, function (oItem) {
						return {
							'name': oItem['Name'],
							'disabled': ko.observable(!oItem['Enabled']),
							'configured': ko.observable(!!oItem['Configured'])
						};
					}, this);

					PluginStore.plugins(aList);
				}
			});
		};

		AdminApp.prototype.reloadPackagesList = function ()
		{
			PackageStore.packages.loading(true);
			PackageStore.packagesReal(true);

			Remote.packagesList(function (sResult, oData) {

				PackageStore.packages.loading(false);

				if (Enums.StorageResultType.Success === sResult && oData && oData.Result)
				{
					PackageStore.packagesReal(!!oData.Result.Real);
					PackageStore.packagesMainUpdatable(!!oData.Result.MainUpdatable);

					var
						aList = [],
						aLoading = {}
					;

					_.each(PackageStore.packages(), function (oItem) {
						if (oItem && oItem['loading']())
						{
							aLoading[oItem['file']] = oItem;
						}
					});

					if (Utils.isArray(oData.Result.List))
					{
						aList = _.compact(_.map(oData.Result.List, function (oItem) {
							if (oItem)
							{
								oItem['loading'] = ko.observable(!Utils.isUnd(aLoading[oItem['file']]));
								return 'core' === oItem['type'] && !oItem['canBeInstalled'] ? null : oItem;
							}
							return null;
						}));
					}

					PackageStore.packages(aList);
				}
				else
				{
					PackageStore.packagesReal(false);
				}
			});
		};

		AdminApp.prototype.updateCoreData = function ()
		{
			CoreStore.coreUpdating(true);
			Remote.updateCoreData(function (sResult, oData) {

				CoreStore.coreUpdating(false);
				CoreStore.coreVersion('');
				CoreStore.coreRemoteVersion('');
				CoreStore.coreRemoteRelease('');
				CoreStore.coreVersionCompare(-2);

				if (Enums.StorageResultType.Success === sResult && oData && oData.Result)
				{
					CoreStore.coreReal(true);
					window.location.reload();
				}
				else
				{
					CoreStore.coreReal(false);
				}
			});

		};

		AdminApp.prototype.reloadCoreData = function ()
		{
			CoreStore.coreChecking(true);
			CoreStore.coreReal(true);

			Remote.coreData(function (sResult, oData) {

				CoreStore.coreChecking(false);

				if (Enums.StorageResultType.Success === sResult && oData && oData.Result)
				{
					CoreStore.coreReal(!!oData.Result.Real);
					CoreStore.coreChannel(oData.Result.Channel || 'stable');
					CoreStore.coreType(oData.Result.Type || 'stable');
					CoreStore.coreUpdatable(!!oData.Result.Updatable);
					CoreStore.coreAccess(!!oData.Result.Access);
					CoreStore.coreWarning(!!oData.Result.Warning);
					CoreStore.coreVersion(oData.Result.Version || '');
					CoreStore.coreRemoteVersion(oData.Result.RemoteVersion || '');
					CoreStore.coreRemoteRelease(oData.Result.RemoteRelease || '');
					CoreStore.coreVersionCompare(Utils.pInt(oData.Result.VersionCompare));
				}
				else
				{
					CoreStore.coreReal(false);
					CoreStore.coreChannel('stable');
					CoreStore.coreType('stable');
					CoreStore.coreWarning(false);
					CoreStore.coreVersion('');
					CoreStore.coreRemoteVersion('');
					CoreStore.coreRemoteRelease('');
					CoreStore.coreVersionCompare(-2);
				}
			});
		};

		/**
		 *
		 * @param {boolean=} bForce = false
		 */
		AdminApp.prototype.reloadLicensing = function (bForce)
		{
			bForce = Utils.isUnd(bForce) ? false : !!bForce;

			LicenseStore.licensingProcess(true);
			LicenseStore.licenseError('');

			Remote.licensing(function (sResult, oData) {

				LicenseStore.licensingProcess(false);

				if (Enums.StorageResultType.Success === sResult && oData && oData.Result && Utils.isNormal(oData.Result['Expired']))
				{
					LicenseStore.licenseValid(true);
					LicenseStore.licenseExpired(Utils.pInt(oData.Result['Expired']));
					LicenseStore.licenseError('');

					LicenseStore.licensing(true);

					AppStore.prem(true);
				}
				else
				{
					if (oData && oData.ErrorCode && -1 < Utils.inArray(Utils.pInt(oData.ErrorCode), [
						Enums.Notification.LicensingServerIsUnavailable,
						Enums.Notification.LicensingExpired
					]))
					{
						LicenseStore.licenseError(Translator.getNotification(Utils.pInt(oData.ErrorCode)));
						LicenseStore.licensing(true);
					}
					else
					{
						if (Enums.StorageResultType.Abort === sResult)
						{
							LicenseStore.licenseError(Translator.getNotification(Enums.Notification.LicensingServerIsUnavailable));
							LicenseStore.licensing(true);
						}
						else
						{
							LicenseStore.licensing(false);
						}
					}
				}
			}, bForce);
		};

		AdminApp.prototype.bootend = function (callback)
		{
			if (progressJs)
			{
				progressJs.end();
			}

			if (callback)
			{
				callback();
			}
		};

		AdminApp.prototype.bootstart = function ()
		{
			AbstractApp.prototype.bootstart.call(this);

			__webpack_require__(/*! Stores/Admin/App */ 33).populate();
			__webpack_require__(/*! Stores/Admin/Capa */ 48).populate();

			kn.hideLoading();

			if (!Settings.settingsGet('AllowAdminPanel'))
			{
				kn.routeOff();
				kn.setHash(Links.root(), true);
				kn.routeOff();

				_.defer(function () {
					window.location.href = '/';
				});
			}
			else
			{
				if (!!Settings.settingsGet('Auth'))
				{
					kn.startScreens([
						__webpack_require__(/*! Screen/Admin/Settings */ 120)
					]);
				}
				else
				{
					kn.startScreens([
						__webpack_require__(/*! Screen/Admin/Login */ 119)
					]);
				}
			}

			this.bootend();
		};

		module.exports = new AdminApp();

	}());

/***/ },
/* 19 */,
/* 20 */
/*!*******************************!*\
  !*** ./dev/Common/Plugins.js ***!
  \*******************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),

			Globals = __webpack_require__(/*! Common/Globals */ 8),
			Utils = __webpack_require__(/*! Common/Utils */ 1)
		;

		/**
		 * @constructor
		 */
		function Plugins()
		{
			this.oSettings = __webpack_require__(/*! Storage/Settings */ 9);
			this.oSimpleHooks = {};

			this.aUserViewModelsHooks = [];
			this.aAdminViewModelsHooks = [];
		}

		/**
		 * @type {Object}
		 */
		Plugins.prototype.oSettings = {};

		/**
		 * @type {Array}
		 */
		Plugins.prototype.aUserViewModelsHooks = [];

		/**
		 * @type {Array}
		 */
		Plugins.prototype.aAdminViewModelsHooks = [];

		/**
		 * @type {Object}
		 */
		Plugins.prototype.oSimpleHooks = {};

		/**
		 * @param {string} sName
		 * @param {Function} fCallback
		 */
		Plugins.prototype.addHook = function (sName, fCallback)
		{
			if (Utils.isFunc(fCallback))
			{
				if (!Utils.isArray(this.oSimpleHooks[sName]))
				{
					this.oSimpleHooks[sName] = [];
				}

				this.oSimpleHooks[sName].push(fCallback);
			}
		};

		/**
		 * @param {string} sName
		 * @param {Array=} aArguments
		 */
		Plugins.prototype.runHook = function (sName, aArguments)
		{
			if (Utils.isArray(this.oSimpleHooks[sName]))
			{
				aArguments = aArguments || [];

				_.each(this.oSimpleHooks[sName], function (fCallback) {
					fCallback.apply(null, aArguments);
				});
			}
		};

		/**
		 * @param {string} sName
		 * @return {?}
		 */
		Plugins.prototype.mainSettingsGet = function (sName)
		{
			return this.oSettings.settingsGet(sName);
		};

		/**
		 * @param {Function} fCallback
		 * @param {string} sAction
		 * @param {Object=} oParameters
		 * @param {?number=} iTimeout
		 */
		Plugins.prototype.remoteRequest = function (fCallback, sAction, oParameters, iTimeout)
		{
			if (Globals.__APP__)
			{
				Globals.__APP__.remote().defaultRequest(fCallback, 'Plugin' + sAction, oParameters, iTimeout);
			}
		};

		/**
		 * @param {Function} SettingsViewModelClass
		 * @param {string} sLabelName
		 * @param {string} sTemplate
		 * @param {string} sRoute
		 */
		Plugins.prototype.addSettingsViewModel = function (SettingsViewModelClass, sTemplate, sLabelName, sRoute)
		{
			this.aUserViewModelsHooks.push([SettingsViewModelClass, sTemplate, sLabelName, sRoute]);
		};

		/**
		 * @param {Function} SettingsViewModelClass
		 * @param {string} sLabelName
		 * @param {string} sTemplate
		 * @param {string} sRoute
		 */
		Plugins.prototype.addSettingsViewModelForAdmin = function (SettingsViewModelClass, sTemplate, sLabelName, sRoute)
		{
			this.aAdminViewModelsHooks.push([SettingsViewModelClass, sTemplate, sLabelName, sRoute]);
		};

		Plugins.prototype.runSettingsViewModelHooks = function (bAdmin)
		{
			_.each(bAdmin ? this.aAdminViewModelsHooks : this.aUserViewModelsHooks, function (aView) {
				__webpack_require__(/*! Knoin/Knoin */ 5).addSettingsViewModel(aView[0], aView[1], aView[2], aView[3]);
			});
		};

		/**
		 * @param {string} sPluginSection
		 * @param {string} sName
		 * @return {?}
		 */
		Plugins.prototype.settingsGet = function (sPluginSection, sName)
		{
			var oPlugin = this.oSettings.settingsGet('Plugins');
			oPlugin = oPlugin && !Utils.isUnd(oPlugin[sPluginSection]) ? oPlugin[sPluginSection] : null;
			return oPlugin ? (Utils.isUnd(oPlugin[sName]) ? null : oPlugin[sName]) : null;
		};

		module.exports = new Plugins();

	}());

/***/ },
/* 21 */,
/* 22 */,
/* 23 */
/*!******************************!*\
  !*** ./dev/Common/Events.js ***!
  \******************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),

			Utils = __webpack_require__(/*! Common/Utils */ 1),
			Plugins = __webpack_require__(/*! Common/Plugins */ 20)
		;

		/**
		 * @constructor
		 */
		function Events()
		{
			this.oSubs = {};
		}

		Events.prototype.oSubs = {};

		/**
		 * @param {string} sName
		 * @param {Function} fFunc
		 * @param {Object=} oContext
		 * @return {Events}
		 */
		Events.prototype.sub = function (sName, fFunc, oContext)
		{
			if (Utils.isObject(sName))
			{
				oContext = fFunc || null;
				fFunc = null;

				_.each(sName, function (fSubFunc, sSubName) {
					this.sub(sSubName, fSubFunc, oContext);
				}, this);
			}
			else
			{
				if (Utils.isUnd(this.oSubs[sName]))
				{
					this.oSubs[sName] = [];
				}

				this.oSubs[sName].push([fFunc, oContext]);
			}

			return this;
		};

		/**
		 * @param {string} sName
		 * @param {Array=} aArgs
		 * @return {Events}
		 */
		Events.prototype.pub = function (sName, aArgs)
		{
			Plugins.runHook('rl-pub', [sName, aArgs]);

			if (!Utils.isUnd(this.oSubs[sName]))
			{
				_.each(this.oSubs[sName], function (aItem) {
					if (aItem[0])
					{
						aItem[0].apply(aItem[1] || null, aArgs || []);
					}
				});
			}

			return this;
		};

		module.exports = new Events();

	}());

/***/ },
/* 24 */
/*!********************************!*\
  !*** ./dev/Common/Momentor.js ***!
  \********************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			window = __webpack_require__(/*! window */ 10),
			$ = __webpack_require__(/*! $ */ 11),
			_ = __webpack_require__(/*! _ */ 2),
			moment = __webpack_require__(/*! moment */ 52),

			Translator = __webpack_require__(/*! Common/Translator */ 6)
		;

		/**
		 * @constructor
		 */
		function Momentor()
		{
			this.format = _.bind(this.format, this);

			this.updateMomentNow = _.debounce(_.bind(function () {
				this._moment = moment();
			}, this), 500, true);

			this.updateMomentNowUnix = _.debounce(_.bind(function () {
				this._momentNow = moment().unix();
			}, this), 500, true);
		}

		Momentor.prototype._moment = null;
		Momentor.prototype._momentNow = 0;

		Momentor.prototype.momentNow = function ()
		{
			this.updateMomentNow();
			return this._moment || moment();
		};

		Momentor.prototype.momentNowUnix = function ()
		{
			this.updateMomentNowUnix();
			return this._momentNow || 0;
		};

		Momentor.prototype.searchSubtractFormatDateHelper = function (iDate)
		{
			var oM = this.momentNow();
			return oM.clone().subtract('days', iDate).format('YYYY.MM.DD');
		};

		/**
		 * @param {Object} oMoment
		 * @return {string}
		 */
		Momentor.prototype.formatCustomShortDate = function (oMoment)
		{
			var
				sResult = '',
				oMomentNow = this.momentNow()
			;

			if (oMoment && oMomentNow)
			{
				if (4 >= oMomentNow.diff(oMoment, 'hours'))
				{
					sResult = oMoment.fromNow();
				}
				else if (oMomentNow.format('L') === oMoment.format('L'))
				{
					sResult = Translator.i18n('MESSAGE_LIST/TODAY_AT', {
						'TIME': oMoment.format('LT')
					});
				}
				else if (oMomentNow.clone().subtract('days', 1).format('L') === oMoment.format('L'))
				{
					sResult = Translator.i18n('MESSAGE_LIST/YESTERDAY_AT', {
						'TIME': oMoment.format('LT')
					});
				}
				else if (oMomentNow.year() === oMoment.year())
				{
					sResult = oMoment.format('D MMM.');
				}
				else
				{
					sResult = oMoment.format('LL');
				}
			}

			return sResult;
		};

		/**
		 * @param {number} iTimeStampInUTC
		 * @param {string} sFormat
		 * @return {string}
		 */
		Momentor.prototype.format = function (iTimeStampInUTC, sFormat)
		{
			var
				oM = null,
				sResult = '',
				iNow = this.momentNowUnix()
			;

			iTimeStampInUTC = 0 < iTimeStampInUTC ? iTimeStampInUTC : (0 === iTimeStampInUTC ? iNow : 0);
			iTimeStampInUTC = iNow < iTimeStampInUTC ? iNow : iTimeStampInUTC;

			oM = 0 < iTimeStampInUTC ? moment.unix(iTimeStampInUTC) : null;

			if (oM && 1970 === oM.year())
			{
				oM = null;
			}

			if (oM)
			{
				switch (sFormat)
				{
					case 'FROMNOW':
						sResult = oM.fromNow();
						break;
					case 'SHORT':
						sResult = this.formatCustomShortDate(oM);
						break;
					case 'FULL':
						sResult = oM.format('LLL');
						break;
					default:
						sResult = oM.format(sFormat);
						break;
				}
			}

			return sResult;
		};

		/**
		 * @param {Object} oElement
		 */
		Momentor.prototype.momentToNode = function (oElement)
		{
			var
				sKey = '',
				iTime = 0,
				$oEl = $(oElement)
			;

			iTime = $oEl.data('moment-time');
			if (iTime)
			{
				sKey = $oEl.data('moment-format');

				if (sKey)
				{
					$oEl.text(this.format(iTime, sKey));
				}

				sKey = $oEl.data('moment-format-title');
				if (sKey)
				{
					$oEl.attr('title', this.format(iTime, sKey));
				}
			}
		};

		/**
		 * @param {Object} oElements
		 */
		Momentor.prototype.momentToNodes = function (oElements)
		{
			var self = this;
			_.defer(function () {
				$('.moment', oElements).each(function () {
					self.momentToNode(this);
				});
			});
		};

		Momentor.prototype.reload = function ()
		{
			this.momentToNodes(window.document);
		};

		module.exports = new Momentor();

	}());


/***/ },
/* 25 */,
/* 26 */,
/* 27 */
/*!***********************************!*\
  !*** ./dev/Component/Abstract.js ***!
  \***********************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),
			ko = __webpack_require__(/*! ko */ 3),

			Utils = __webpack_require__(/*! Common/Utils */ 1)
		;

		/**
		 * @constructor
		 */
		function AbstractComponent()
		{
			this.disposable = [];
		}

		/**
		 * @type {Array}
		 */
		AbstractComponent.prototype.disposable = [];

		AbstractComponent.prototype.dispose = function ()
		{
			_.each(this.disposable, function (fFuncToDispose) {
				if (fFuncToDispose && fFuncToDispose.dispose)
				{
					fFuncToDispose.dispose();
				}
			});
		};

		/**
		 * @param {*} ClassObject
		 * @param {string} sTemplateID
		 * @return {Object}
		 */
		AbstractComponent.componentExportHelper = function (ClassObject, sTemplateID) {
			var oComponent = {
				viewModel: {
					createViewModel: function(oParams, oComponentInfo) {

						oParams = oParams || {};
						oParams.element = null;

						if (oComponentInfo.element)
						{
							oParams.component = oComponentInfo;
							oParams.element = $(oComponentInfo.element);

							__webpack_require__(/*! Common/Translator */ 6).i18nToNodes(oParams.element);

							if (!Utils.isUnd(oParams.inline) && ko.unwrap(oParams.inline))
							{
								oParams.element.css('display', 'inline-block');
							}
						}

						return new ClassObject(oParams);
					}
				}
			};

			oComponent['template'] = sTemplateID ? {
				element: sTemplateID
			} : '<b></b>';

			return oComponent;
		};

		module.exports = AbstractComponent;

	}());


/***/ },
/* 28 */
/*!****************************!*\
  !*** ./dev/Model/Email.js ***!
  \****************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			Utils = __webpack_require__(/*! Common/Utils */ 1)
		;

		/**
		 * @param {string=} sEmail
		 * @param {string=} sName
		 * @param {string=} sDkimStatus
		 * @param {string=} sDkimValue
		 *
		 * @constructor
		 */
		function EmailModel(sEmail, sName, sDkimStatus, sDkimValue)
		{
			this.email = sEmail || '';
			this.name = sName || '';
			this.dkimStatus = sDkimStatus || 'none';
			this.dkimValue = sDkimValue || '';

			this.clearDuplicateName();
		}

		/**
		 * @static
		 * @param {AjaxJsonEmail} oJsonEmail
		 * @return {?EmailModel}
		 */
		EmailModel.newInstanceFromJson = function (oJsonEmail)
		{
			var oEmailModel = new EmailModel();
			return oEmailModel.initByJson(oJsonEmail) ? oEmailModel : null;
		};

		/**
		 * @static
		 * @param {string} sLine
		 * @param {string=} sDelimiter = ';'
		 * @return {Array}
		 */
		EmailModel.splitHelper = function (sLine, sDelimiter)
		{
			sDelimiter = sDelimiter || ';';

			sLine = sLine.replace(/[\r\n]+/g, '; ').replace(/[\s]+/g, ' ');

			var
				iIndex = 0,
				iLen = sLine.length,
				bAt = false,
				sChar = '',
				sResult = ''
			;

			for (; iIndex < iLen; iIndex++)
			{
				sChar = sLine.charAt(iIndex);
				switch (sChar)
				{
					case '@':
						bAt = true;
						break;
					case ' ':
						if (bAt)
						{
							bAt = false;
							sResult += sDelimiter;
						}
						break;
				}

				sResult += sChar;
			}

			return sResult.split(sDelimiter);
		};

		/**
		 * @type {string}
		 */
		EmailModel.prototype.name = '';

		/**
		 * @type {string}
		 */
		EmailModel.prototype.email = '';

		/**
		 * @type {string}
		 */
		EmailModel.prototype.dkimStatus = 'none';

		/**
		 * @type {string}
		 */
		EmailModel.prototype.dkimValue = '';

		EmailModel.prototype.clear = function ()
		{
			this.email = '';
			this.name = '';

			this.dkimStatus = 'none';
			this.dkimValue = '';
		};

		/**
		 * @return {boolean}
		 */
		EmailModel.prototype.validate = function ()
		{
			return '' !== this.name || '' !== this.email;
		};

		/**
		 * @param {boolean} bWithoutName = false
		 * @return {string}
		 */
		EmailModel.prototype.hash = function (bWithoutName)
		{
			return '#' + (bWithoutName ? '' : this.name) + '#' + this.email + '#';
		};

		EmailModel.prototype.clearDuplicateName = function ()
		{
			if (this.name === this.email)
			{
				this.name = '';
			}
		};

		/**
		 * @param {string} sQuery
		 * @return {boolean}
		 */
		EmailModel.prototype.search = function (sQuery)
		{
			return -1 < (this.name + ' ' + this.email).toLowerCase().indexOf(sQuery.toLowerCase());
		};

		/**
		 * @param {string} sString
		 */
		EmailModel.prototype.parse = function (sString)
		{
			this.clear();

			sString = Utils.trim(sString);

			var
				mRegex = /(?:"([^"]+)")? ?[<]?(.*?@[^>,]+)>?,? ?/g,
				mMatch = mRegex.exec(sString)
			;

			if (mMatch)
			{
				this.name = mMatch[1] || '';
				this.email = mMatch[2] || '';

				this.clearDuplicateName();
			}
			else if ((/^[^@]+@[^@]+$/).test(sString))
			{
				this.name = '';
				this.email = sString;
			}
		};

		/**
		 * @param {AjaxJsonEmail} oJsonEmail
		 * @return {boolean}
		 */
		EmailModel.prototype.initByJson = function (oJsonEmail)
		{
			var bResult = false;
			if (oJsonEmail && 'Object/Email' === oJsonEmail['@Object'])
			{
				this.name = Utils.trim(oJsonEmail.Name);
				this.email = Utils.trim(oJsonEmail.Email);
				this.dkimStatus = Utils.trim(oJsonEmail.DkimStatus || '');
				this.dkimValue = Utils.trim(oJsonEmail.DkimValue || '');

				bResult = '' !== this.email;
				this.clearDuplicateName();
			}

			return bResult;
		};

		/**
		 * @param {boolean} bFriendlyView
		 * @param {boolean=} bWrapWithLink = false
		 * @param {boolean=} bEncodeHtml = false
		 * @return {string}
		 */
		EmailModel.prototype.toLine = function (bFriendlyView, bWrapWithLink, bEncodeHtml)
		{
			var sResult = '';
			if ('' !== this.email)
			{
				bWrapWithLink = Utils.isUnd(bWrapWithLink) ? false : !!bWrapWithLink;
				bEncodeHtml = Utils.isUnd(bEncodeHtml) ? false : !!bEncodeHtml;

				if (bFriendlyView && '' !== this.name)
				{
					sResult = bWrapWithLink ? '<a href="mailto:' + Utils.encodeHtml('"' + this.name + '" <' + this.email + '>') +
						'" target="_blank" tabindex="-1">' + Utils.encodeHtml(this.name) + '</a>' :
							(bEncodeHtml ? Utils.encodeHtml(this.name) : this.name);
				}
				else
				{
					sResult = this.email;
					if ('' !== this.name)
					{
						if (bWrapWithLink)
						{
							sResult = Utils.encodeHtml('"' + this.name + '" <') +
								'<a href="mailto:' + Utils.encodeHtml('"' + this.name + '" <' + this.email + '>') + '" target="_blank" tabindex="-1">' + Utils.encodeHtml(sResult) + '</a>' + Utils.encodeHtml('>');
						}
						else
						{
							sResult = '"' + this.name + '" <' + sResult + '>';
							if (bEncodeHtml)
							{
								sResult = Utils.encodeHtml(sResult);
							}
						}
					}
					else if (bWrapWithLink)
					{
						sResult = '<a href="mailto:' + Utils.encodeHtml(this.email) + '" target="_blank" tabindex="-1">' + Utils.encodeHtml(this.email) + '</a>';
					}
				}
			}

			return sResult;
		};

		/**
		 * @param {string} $sEmailAddress
		 * @return {boolean}
		 */
		EmailModel.prototype.mailsoParse = function ($sEmailAddress)
		{
			$sEmailAddress = Utils.trim($sEmailAddress);
			if ('' === $sEmailAddress)
			{
				return false;
			}

			var
				substr = function (str, start, len) {
					str += '';
					var	end = str.length;

					if (start < 0) {
						start += end;
					}

					end = typeof len === 'undefined' ? end : (len < 0 ? len + end : len + start);

					return start >= str.length || start < 0 || start > end ? false : str.slice(start, end);
				},

				substr_replace = function (str, replace, start, length) {
					if (start < 0) {
						start = start + str.length;
					}
					length = length !== undefined ? length : str.length;
					if (length < 0) {
						length = length + str.length - start;
					}
					return str.slice(0, start) + replace.substr(0, length) + replace.slice(length) + str.slice(start + length);
				},

				$sName = '',
				$sEmail = '',
				$sComment = '',

				$bInName = false,
				$bInAddress = false,
				$bInComment = false,

				$aRegs = null,

				$iStartIndex = 0,
				$iEndIndex = 0,
				$iCurrentIndex = 0
			;

			while ($iCurrentIndex < $sEmailAddress.length)
			{
				switch ($sEmailAddress.substr($iCurrentIndex, 1))
				{
					case '"':
						if ((!$bInName) && (!$bInAddress) && (!$bInComment))
						{
							$bInName = true;
							$iStartIndex = $iCurrentIndex;
						}
						else if ((!$bInAddress) && (!$bInComment))
						{
							$iEndIndex = $iCurrentIndex;
							$sName = substr($sEmailAddress, $iStartIndex + 1, $iEndIndex - $iStartIndex - 1);
							$sEmailAddress = substr_replace($sEmailAddress, '', $iStartIndex, $iEndIndex - $iStartIndex + 1);
							$iEndIndex = 0;
							$iCurrentIndex = 0;
							$iStartIndex = 0;
							$bInName = false;
						}
						break;
					case '<':
						if ((!$bInName) && (!$bInAddress) && (!$bInComment))
						{
							if ($iCurrentIndex > 0 && $sName.length === 0)
							{
								$sName = substr($sEmailAddress, 0, $iCurrentIndex);
							}

							$bInAddress = true;
							$iStartIndex = $iCurrentIndex;
						}
						break;
					case '>':
						if ($bInAddress)
						{
							$iEndIndex = $iCurrentIndex;
							$sEmail = substr($sEmailAddress, $iStartIndex + 1, $iEndIndex - $iStartIndex - 1);
							$sEmailAddress = substr_replace($sEmailAddress, '', $iStartIndex, $iEndIndex - $iStartIndex + 1);
							$iEndIndex = 0;
							$iCurrentIndex = 0;
							$iStartIndex = 0;
							$bInAddress = false;
						}
						break;
					case '(':
						if ((!$bInName) && (!$bInAddress) && (!$bInComment))
						{
							$bInComment = true;
							$iStartIndex = $iCurrentIndex;
						}
						break;
					case ')':
						if ($bInComment)
						{
							$iEndIndex = $iCurrentIndex;
							$sComment = substr($sEmailAddress, $iStartIndex + 1, $iEndIndex - $iStartIndex - 1);
							$sEmailAddress = substr_replace($sEmailAddress, '', $iStartIndex, $iEndIndex - $iStartIndex + 1);
							$iEndIndex = 0;
							$iCurrentIndex = 0;
							$iStartIndex = 0;
							$bInComment = false;
						}
						break;
					case '\\':
						$iCurrentIndex++;
						break;
				}

				$iCurrentIndex++;
			}

			if ($sEmail.length === 0)
			{
				$aRegs = $sEmailAddress.match(/[^@\s]+@\S+/i);
				if ($aRegs && $aRegs[0])
				{
					$sEmail = $aRegs[0];
				}
				else
				{
					$sName = $sEmailAddress;
				}
			}

			if ($sEmail.length > 0 && $sName.length === 0 && $sComment.length === 0)
			{
				$sName = $sEmailAddress.replace($sEmail, '');
			}

			$sEmail = Utils.trim($sEmail).replace(/^[<]+/, '').replace(/[>]+$/, '');
			$sName = Utils.trim($sName).replace(/^["']+/, '').replace(/["']+$/, '');
			$sComment = Utils.trim($sComment).replace(/^[(]+/, '').replace(/[)]+$/, '');

			// Remove backslash
			$sName = $sName.replace(/\\\\(.)/g, '$1');
			$sComment = $sComment.replace(/\\\\(.)/g, '$1');

			this.name = $sName;
			this.email = $sEmail;

			this.clearDuplicateName();
			return true;
		};

		module.exports = EmailModel;

	}());

/***/ },
/* 29 */,
/* 30 */,
/* 31 */,
/* 32 */,
/* 33 */
/*!*********************************!*\
  !*** ./dev/Stores/Admin/App.js ***!
  \*********************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			ko = __webpack_require__(/*! ko */ 3),

			Settings = __webpack_require__(/*! Storage/Settings */ 9),

			AppStore = __webpack_require__(/*! Stores/App */ 73)
		;

		/**
		 * @constructor
		 */
		function AppAdminStore()
		{
			AppStore.call(this);

			this.determineUserLanguage = ko.observable(false);
			this.determineUserDomain = ko.observable(false);

			this.weakPassword = ko.observable(false);
			this.useLocalProxyForExternalImages = ko.observable(false);
		}

		AppAdminStore.prototype.populate = function()
		{
			AppStore.prototype.populate.call(this);

			this.determineUserLanguage(!!Settings.settingsGet('DetermineUserLanguage'));
			this.determineUserDomain(!!Settings.settingsGet('DetermineUserDomain'));

			this.weakPassword(!!Settings.settingsGet('WeakPassword'));
			this.useLocalProxyForExternalImages(!!Settings.settingsGet('UseLocalProxyForExternalImages'));
		};

		module.exports = new AppAdminStore();

	}());


/***/ },
/* 34 */
/*!******************************!*\
  !*** ./dev/Stores/Social.js ***!
  \******************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			ko = __webpack_require__(/*! ko */ 3)
		;

		/**
		 * @constructor
		 */
		function SocialStore()
		{
			this.google = {};
			this.twitter = {};
			this.facebook = {};
			this.dropbox = {};

			// Google
			this.google.enabled = ko.observable(false);

			this.google.clientID = ko.observable('');
			this.google.clientSecret = ko.observable('');
			this.google.apiKey = ko.observable('');

			this.google.loading = ko.observable(false);
			this.google.userName = ko.observable('');

			this.google.loggined = ko.computed(function () {
				return '' !== this.google.userName();
			}, this);

			this.google.capa = {};
			this.google.capa.auth = ko.observable(false);
			this.google.capa.authFast = ko.observable(false);
			this.google.capa.drive = ko.observable(false);
			this.google.capa.preview = ko.observable(false);

			this.google.require = {};
			this.google.require.clientSettings = ko.computed(function () {
				return this.google.enabled() && (this.google.capa.auth() || this.google.capa.drive());
			}, this);

			this.google.require.apiKeySettings = ko.computed(function () {
				return this.google.enabled() && this.google.capa.drive();
			}, this);

			// Facebook
			this.facebook.enabled = ko.observable(false);
			this.facebook.appID = ko.observable('');
			this.facebook.appSecret = ko.observable('');
			this.facebook.loading = ko.observable(false);
			this.facebook.userName = ko.observable('');
			this.facebook.supported = ko.observable(false);

			this.facebook.loggined = ko.computed(function () {
				return '' !== this.facebook.userName();
			}, this);

			// Twitter
			this.twitter.enabled = ko.observable(false);
			this.twitter.consumerKey = ko.observable('');
			this.twitter.consumerSecret = ko.observable('');
			this.twitter.loading = ko.observable(false);
			this.twitter.userName = ko.observable('');

			this.twitter.loggined = ko.computed(function () {
				return '' !== this.twitter.userName();
			}, this);

			// Dropbox
			this.dropbox.enabled = ko.observable(false);
			this.dropbox.apiKey = ko.observable('');
		}

		SocialStore.prototype.google = {};
		SocialStore.prototype.twitter = {};
		SocialStore.prototype.facebook = {};
		SocialStore.prototype.dropbox = {};

		SocialStore.prototype.populate = function ()
		{
			var Settings = __webpack_require__(/*! Storage/Settings */ 9);

			this.google.enabled(!!Settings.settingsGet('AllowGoogleSocial'));
			this.google.clientID(Settings.settingsGet('GoogleClientID'));
			this.google.clientSecret(Settings.settingsGet('GoogleClientSecret'));
			this.google.apiKey(Settings.settingsGet('GoogleApiKey'));

			this.google.capa.auth(!!Settings.settingsGet('AllowGoogleSocialAuth'));
			this.google.capa.authFast(!!Settings.settingsGet('AllowGoogleSocialAuthFast'));
			this.google.capa.drive(!!Settings.settingsGet('AllowGoogleSocialDrive'));
			this.google.capa.preview(!!Settings.settingsGet('AllowGoogleSocialPreview'));

			this.facebook.enabled(!!Settings.settingsGet('AllowFacebookSocial'));
			this.facebook.appID(Settings.settingsGet('FacebookAppID'));
			this.facebook.appSecret(Settings.settingsGet('FacebookAppSecret'));
			this.facebook.supported(!!Settings.settingsGet('SupportedFacebookSocial'));

			this.twitter.enabled = ko.observable(!!Settings.settingsGet('AllowTwitterSocial'));
			this.twitter.consumerKey = ko.observable(Settings.settingsGet('TwitterConsumerKey'));
			this.twitter.consumerSecret = ko.observable(Settings.settingsGet('TwitterConsumerSecret'));

			this.dropbox.enabled(!!Settings.settingsGet('AllowDropboxSocial'));
			this.dropbox.apiKey(Settings.settingsGet('DropboxApiKey'));
		};

		module.exports = new SocialStore();

	}());


/***/ },
/* 35 */
/*!****************************************!*\
  !*** ./dev/Component/AbstractInput.js ***!
  \****************************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),
			ko = __webpack_require__(/*! ko */ 3),

			Enums = __webpack_require__(/*! Common/Enums */ 4),
			Utils = __webpack_require__(/*! Common/Utils */ 1),

			AbstractComponent = __webpack_require__(/*! Component/Abstract */ 27)
		;

		/**
		 * @constructor
		 *
		 * @param {Object} oParams
		 *
		 * @extends AbstractComponent
		 */
		function AbstractInput(oParams)
		{
			AbstractComponent.call(this);

			this.value = oParams.value || '';
			this.size = oParams.size || 0;
			this.label = oParams.label || '';
			this.preLabel = oParams.preLabel || '';
			this.enable = Utils.isUnd(oParams.enable) ? true : oParams.enable;
			this.trigger = oParams.trigger && oParams.trigger.subscribe ? oParams.trigger : null;
			this.placeholder = oParams.placeholder || '';

			this.labeled = !Utils.isUnd(oParams.label);
			this.preLabeled = !Utils.isUnd(oParams.preLabel);
			this.triggered = !Utils.isUnd(oParams.trigger) && !!this.trigger;

			this.classForTrigger = ko.observable('');

			this.className = ko.computed(function () {

				var
					iSize = ko.unwrap(this.size),
					sSuffixValue = this.trigger ?
						' ' + Utils.trim('settings-saved-trigger-input ' + this.classForTrigger()) : ''
				;

				return (0 < iSize ? 'span' + iSize : '') + sSuffixValue;

			}, this);

			if (!Utils.isUnd(oParams.width) && oParams.element)
			{
				oParams.element.find('input,select,textarea').css('width', oParams.width);
			}

			this.disposable.push(this.className);

			if (this.trigger)
			{
				this.setTriggerState(this.trigger());

				this.disposable.push(
					this.trigger.subscribe(this.setTriggerState, this)
				);
			}
		}

		AbstractInput.prototype.setTriggerState = function (nValue)
		{
			switch (Utils.pInt(nValue))
			{
				case Enums.SaveSettingsStep.TrueResult:
					this.classForTrigger('success');
					break;
				case Enums.SaveSettingsStep.FalseResult:
					this.classForTrigger('error');
					break;
				default:
					this.classForTrigger('');
					break;
			}
		};

		_.extend(AbstractInput.prototype, AbstractComponent.prototype);

		AbstractInput.componentExportHelper = AbstractComponent.componentExportHelper;

		module.exports = AbstractInput;

	}());


/***/ },
/* 36 */
/*!***********************************!*\
  !*** ./dev/Component/Checkbox.js ***!
  \***********************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),

			AbstracCheckbox = __webpack_require__(/*! Component/AbstracCheckbox */ 41)
		;

		/**
		 * @constructor
		 *
		 * @param {Object} oParams
		 *
		 * @extends AbstracCheckbox
		 */
		function CheckboxComponent(oParams)
		{
			AbstracCheckbox.call(this, oParams);
		}

		_.extend(CheckboxComponent.prototype, AbstracCheckbox.prototype);

		module.exports = AbstracCheckbox.componentExportHelper(
			CheckboxComponent, 'CheckboxComponent');

	}());


/***/ },
/* 37 */
/*!*************************************!*\
  !*** ./dev/Knoin/AbstractScreen.js ***!
  \*************************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),
			crossroads = __webpack_require__(/*! crossroads */ 47),

			Utils = __webpack_require__(/*! Common/Utils */ 1)
		;

		/**
		 * @param {string} sScreenName
		 * @param {?=} aViewModels = []
		 * @constructor
		 */
		function AbstractScreen(sScreenName, aViewModels)
		{
			this.sScreenName = sScreenName;
			this.aViewModels = Utils.isArray(aViewModels) ? aViewModels : [];
		}

		/**
		 * @type {Array}
		 */
		AbstractScreen.prototype.oCross = null;

		/**
		 * @type {string}
		 */
		AbstractScreen.prototype.sScreenName = '';

		/**
		 * @type {Array}
		 */
		AbstractScreen.prototype.aViewModels = [];

		/**
		 * @return {Array}
		 */
		AbstractScreen.prototype.viewModels = function ()
		{
			return this.aViewModels;
		};

		/**
		 * @return {string}
		 */
		AbstractScreen.prototype.screenName = function ()
		{
			return this.sScreenName;
		};

		AbstractScreen.prototype.routes = function ()
		{
			return null;
		};

		/**
		 * @return {?Object}
		 */
		AbstractScreen.prototype.__cross = function ()
		{
			return this.oCross;
		};

		AbstractScreen.prototype.__start = function ()
		{
			var
				aRoutes = this.routes(),
				oRoute = null,
				fMatcher = null
			;

			if (Utils.isNonEmptyArray(aRoutes))
			{
				fMatcher = _.bind(this.onRoute || Utils.emptyFunction, this);
				oRoute = crossroads.create();

				_.each(aRoutes, function (aItem) {
					oRoute.addRoute(aItem[0], fMatcher).rules = aItem[1];
				});

				this.oCross = oRoute;
			}
		};

		module.exports = AbstractScreen;

	}());

/***/ },
/* 38 */
/*!********************************!*\
  !*** ./dev/Stores/Language.js ***!
  \********************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			ko = __webpack_require__(/*! ko */ 3),

			Utils = __webpack_require__(/*! Common/Utils */ 1),

			Settings = __webpack_require__(/*! Storage/Settings */ 9)
		;

		/**
		 * @constructor
		 */
		function LanguageStore()
		{
			this.languages = ko.observableArray([]);
			this.languagesAdmin = ko.observableArray([]);

			this.language = ko.observable('')
				.extend({'limitedList': this.languages});

			this.languageAdmin = ko.observable('')
				.extend({'limitedList': this.languagesAdmin});

			this.userLanguage = ko.observable('');
			this.userLanguageAdmin = ko.observable('');
		}

		LanguageStore.prototype.populate = function ()
		{
			var
				aLanguages = Settings.settingsGet('Languages'),
				aLanguagesAdmin = Settings.settingsGet('LanguagesAdmin')
			;

			this.languages(Utils.isArray(aLanguages) ? aLanguages : []);
			this.languagesAdmin(Utils.isArray(aLanguagesAdmin) ? aLanguagesAdmin : []);

			this.language(Settings.settingsGet('Language'));
			this.languageAdmin(Settings.settingsGet('LanguageAdmin'));

			this.userLanguage(Settings.settingsGet('UserLanguage'));
			this.userLanguageAdmin(Settings.settingsGet('UserLanguageAdmin'));
		};

		module.exports = new LanguageStore();

	}());


/***/ },
/* 39 */
/*!******************************!*\
  !*** external "window.JSON" ***!
  \******************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = window.JSON;

/***/ },
/* 40 */
/*!**********************************!*\
  !*** ./dev/Common/HtmlEditor.js ***!
  \**********************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			window = __webpack_require__(/*! window */ 10),
			_ = __webpack_require__(/*! _ */ 2),

			Globals = __webpack_require__(/*! Common/Globals */ 8),

			Settings = __webpack_require__(/*! Storage/Settings */ 9)
		;

		/**
		 * @constructor
		 * @param {Object} oElement
		 * @param {Function=} fOnBlur
		 * @param {Function=} fOnReady
		 * @param {Function=} fOnModeChange
		 */
		function HtmlEditor(oElement, fOnBlur, fOnReady, fOnModeChange)
		{
			this.editor = null;
			this.iBlurTimer = 0;
			this.fOnBlur = fOnBlur || null;
			this.fOnReady = fOnReady || null;
			this.fOnModeChange = fOnModeChange || null;

			this.$element = $(oElement);

			this.resize = _.throttle(_.bind(this.resize, this), 100);

			this.__inited = false;

			this.init();
		}

		HtmlEditor.prototype.blurTrigger = function ()
		{
			if (this.fOnBlur)
			{
				var self = this;
				window.clearTimeout(this.iBlurTimer);
				this.iBlurTimer = window.setTimeout(function () {
					self.fOnBlur();
				}, 200);
			}
		};

		HtmlEditor.prototype.focusTrigger = function ()
		{
			if (this.fOnBlur)
			{
				window.clearTimeout(this.iBlurTimer);
			}
		};

		/**
		 * @return {boolean}
		 */
		HtmlEditor.prototype.isHtml = function ()
		{
			return this.editor ? 'wysiwyg' === this.editor.mode : false;
		};

		/**
		 * @param {string} sSignature
		 * @param {bool} bHtml
		 * @param {bool} bInsertBefore
		 */
		HtmlEditor.prototype.setSignature = function (sSignature, bHtml, bInsertBefore)
		{
			if (this.editor)
			{
				this.editor.execCommand('insertSignature', {
					'isHtml': bHtml,
					'insertBefore': bInsertBefore,
					'signature': sSignature
				});
			}
		};

		/**
		 * @return {boolean}
		 */
		HtmlEditor.prototype.checkDirty = function ()
		{
			return this.editor ? this.editor.checkDirty() : false;
		};

		HtmlEditor.prototype.resetDirty = function ()
		{
			if (this.editor)
			{
				this.editor.resetDirty();
			}
		};

		/**
		 * @param {string} sText
		 * @return {string}
		 */
		HtmlEditor.prototype.clearSignatureSigns = function (sText)
		{
			return sText.replace(/(\u200C|\u0002)/g, '');
		};

		/**
		 * @param {boolean=} bWrapIsHtml = false
		 * @param {boolean=} bClearSignatureSigns = false
		 * @return {string}
		 */
		HtmlEditor.prototype.getData = function (bWrapIsHtml, bClearSignatureSigns)
		{
			var sResult = '';
			if (this.editor)
			{
				try
				{
					if ('plain' === this.editor.mode && this.editor.plugins.plain && this.editor.__plain)
					{
						sResult = this.editor.__plain.getRawData();
					}
					else
					{
						sResult =  bWrapIsHtml ?
							'<div data-html-editor-font-wrapper="true" style="font-family: arial, sans-serif; font-size: 13px;">' +
								this.editor.getData() + '</div>' : this.editor.getData();
					}
				}
				catch (e) {}

				if (bClearSignatureSigns)
				{
					sResult = this.clearSignatureSigns(sResult);
				}
			}

			return sResult;
		};

		/**
		 * @param {boolean=} bWrapIsHtml = false
		 * @param {boolean=} bClearSignatureSigns = false
		 * @return {string}
		 */
		HtmlEditor.prototype.getDataWithHtmlMark = function (bWrapIsHtml, bClearSignatureSigns)
		{
			return (this.isHtml() ? ':HTML:' : '') + this.getData(bWrapIsHtml, bClearSignatureSigns);
		};

		HtmlEditor.prototype.modeToggle = function (bPlain, bResize)
		{
			if (this.editor)
			{
				try {
					if (bPlain)
					{
						if ('plain' === this.editor.mode)
						{
							this.editor.setMode('wysiwyg');
						}
					}
					else
					{
						if ('wysiwyg' === this.editor.mode)
						{
							this.editor.setMode('plain');
						}
					}
				} catch(e) {}

				if (bResize)
				{
					this.resize();
				}
			}
		};

		HtmlEditor.prototype.setHtmlOrPlain = function (sText, bFocus)
		{
			if (':HTML:' === sText.substr(0, 6))
			{
				this.setHtml(sText.substr(6), bFocus);
			}
			else
			{
				this.setPlain(sText, bFocus);
			}
		};

		HtmlEditor.prototype.setHtml = function (sHtml, bFocus)
		{
			if (this.editor && this.__inited)
			{
				this.modeToggle(true);

				sHtml = sHtml.replace(/<p[^>]*><\/p>/ig, '');

				try {
					this.editor.setData(sHtml);
				} catch (e) {}

				if (bFocus)
				{
					this.focus();
				}
			}
		};

		HtmlEditor.prototype.replaceHtml = function (mFind, sReplaceHtml)
		{
			if (this.editor && this.__inited && 'wysiwyg' === this.editor.mode)
			{
				try {
					this.editor.setData(
						this.editor.getData().replace(mFind, sReplaceHtml));
				} catch (e) {}
			}
		};

		HtmlEditor.prototype.setPlain = function (sPlain, bFocus)
		{
			if (this.editor && this.__inited)
			{
				this.modeToggle(false);
				if ('plain' === this.editor.mode && this.editor.plugins.plain && this.editor.__plain)
				{
					return this.editor.__plain.setRawData(sPlain);
				}
				else
				{
					try {
						this.editor.setData(sPlain);
					} catch (e) {}
				}

				if (bFocus)
				{
					this.focus();
				}
			}
		};

		HtmlEditor.prototype.init = function ()
		{
			if (this.$element && this.$element[0] && !this.editor)
			{
				var
					self = this,
					fInit = function () {

						var
							oConfig = Globals.oHtmlEditorDefaultConfig,
							sLanguage = Settings.settingsGet('Language'),
							bSource = !!Settings.settingsGet('AllowHtmlEditorSourceButton'),
							bBiti = !!Settings.settingsGet('AllowHtmlEditorBitiButtons')
						;

						if ((bSource || !bBiti) && !oConfig.toolbarGroups.__cfgInited)
						{
							oConfig.toolbarGroups.__cfgInited = true;

							if (bSource)
							{
								oConfig.removeButtons = oConfig.removeButtons.replace(',Source', '');
							}

							if (!bBiti)
							{
								oConfig.removePlugins += (oConfig.removePlugins ? ',' : '')  + 'bidi';
							}
						}

						oConfig.enterMode = window.CKEDITOR.ENTER_BR;
						oConfig.shiftEnterMode = window.CKEDITOR.ENTER_P;

						oConfig.language = Globals.oHtmlEditorLangsMap[sLanguage] || 'en';
						if (window.CKEDITOR.env)
						{
							window.CKEDITOR.env.isCompatible = true;
						}

						self.editor = window.CKEDITOR.appendTo(self.$element[0], oConfig);

						self.editor.on('key', function(oEvent) {
							if (oEvent && oEvent.data && 9 /* Tab */ === oEvent.data.keyCode)
							{
								return false;
							}
						});

						self.editor.on('blur', function() {
							self.blurTrigger();
						});

						self.editor.on('mode', function() {

							self.blurTrigger();

							if (self.fOnModeChange)
							{
								self.fOnModeChange('plain' !== self.editor.mode);
							}
						});

						self.editor.on('focus', function() {
							self.focusTrigger();
						});

						if (window.FileReader)
						{
							self.editor.on('drop', function(evt) {
								if (0 < evt.data.dataTransfer.getFilesCount())
								{
									var file = evt.data.dataTransfer.getFile(0);
									if (file && window.FileReader && evt.data.dataTransfer.id &&
										file.type && file.type.match(/^image/i))
									{
										var
											id = evt.data.dataTransfer.id,
											imageId = '[img=' + id +']',
											reader  = new window.FileReader()
										;

										reader.onloadend = function () {
											if (reader.result)
											{
												self.replaceHtml(imageId, '<img src="' + reader.result + '" />');
											}
										};

										reader.readAsDataURL(file);

										evt.data.dataTransfer.setData('text/html', imageId);
									}
								}
							});
						}

						self.editor.on('instanceReady', function () {

							if (self.editor.removeMenuItem)
							{
								self.editor.removeMenuItem('cut');
								self.editor.removeMenuItem('copy');
								self.editor.removeMenuItem('paste');
							}

							self.__resizable = true;
							self.__inited = true;

							self.resize();

							if (self.fOnReady)
							{
								self.fOnReady();
							}

						});
					}
				;

				if (window.CKEDITOR)
				{
					fInit();
				}
				else
				{
					window.__initEditor = fInit;
				}
			}
		};

		HtmlEditor.prototype.focus = function ()
		{
			if (this.editor)
			{
				try {
					this.editor.focus();
				} catch (e) {}
			}
		};

		HtmlEditor.prototype.hasFocus = function ()
		{
			if (this.editor)
			{
				try {
					return !!this.editor.focusManager.hasFocus;
				} catch (e) {}
			}

			return false;
		};

		HtmlEditor.prototype.blur = function ()
		{
			if (this.editor)
			{
				try {
					this.editor.focusManager.blur(true);
				} catch (e) {}
			}
		};

		HtmlEditor.prototype.resize = function ()
		{
			if (this.editor && this.__resizable)
			{
				try {
					this.editor.resize(this.$element.width(), this.$element.innerHeight());
				} catch (e) {}
			}
		};

		HtmlEditor.prototype.setReadOnly = function (bValue)
		{
			if (this.editor)
			{
				try {
					this.editor.setReadOnly(!!bValue);
				} catch (e) {}
			}
		};

		HtmlEditor.prototype.clear = function (bFocus)
		{
			this.setHtml('', bFocus);
		};

		module.exports = HtmlEditor;

	}());

/***/ },
/* 41 */
/*!******************************************!*\
  !*** ./dev/Component/AbstracCheckbox.js ***!
  \******************************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),
			ko = __webpack_require__(/*! ko */ 3),

			Utils = __webpack_require__(/*! Common/Utils */ 1),

			AbstractComponent = __webpack_require__(/*! Component/Abstract */ 27)
		;

		/**
		 * @constructor
		 *
		 * @param {Object} oParams
		 *
		 * @extends AbstractComponent
		 */
		function AbstracCheckbox(oParams)
		{
			AbstractComponent.call(this);

			this.value = oParams.value;
			if (Utils.isUnd(this.value) || !this.value.subscribe)
			{
				this.value = ko.observable(Utils.isUnd(this.value) ? false : !!this.value);
			}

			this.enable = oParams.enable;
			if (Utils.isUnd(this.enable) || !this.enable.subscribe)
			{
				this.enable = ko.observable(Utils.isUnd(this.enable) ? true : !!this.enable);
			}

			this.disable = oParams.disable;
			if (Utils.isUnd(this.disable) || !this.disable.subscribe)
			{
				this.disable = ko.observable(Utils.isUnd(this.disable) ? false : !!this.disable);
			}

			this.label = oParams.label || '';
			this.inline = Utils.isUnd(oParams.inline) ? false : oParams.inline;

			this.readOnly = Utils.isUnd(oParams.readOnly) ? false : !!oParams.readOnly;
			this.inverted = Utils.isUnd(oParams.inverted) ? false : !!oParams.inverted;

			this.labeled = !Utils.isUnd(oParams.label);
			this.labelAnimated = !!oParams.labelAnimated;
		}

		_.extend(AbstracCheckbox.prototype, AbstractComponent.prototype);

		AbstracCheckbox.prototype.click = function()
		{
			if (!this.readOnly && this.enable() && !this.disable())
			{
				this.value(!this.value());
			}
		};

		AbstracCheckbox.componentExportHelper = AbstractComponent.componentExportHelper;

		module.exports = AbstracCheckbox;

	}());


/***/ },
/* 42 */,
/* 43 */,
/* 44 */
/*!*****************************!*\
  !*** ./dev/Stores/Theme.js ***!
  \*****************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			ko = __webpack_require__(/*! ko */ 3),

			Utils = __webpack_require__(/*! Common/Utils */ 1),

			Settings = __webpack_require__(/*! Storage/Settings */ 9)
		;

		/**
		 * @constructor
		 */
		function ThemeStore()
		{
			this.themes = ko.observableArray([]);
			this.themeBackgroundName = ko.observable('');
			this.themeBackgroundHash = ko.observable('');

			this.theme = ko.observable('')
				.extend({'limitedList': this.themes});
		}

		ThemeStore.prototype.populate = function ()
		{
			var aThemes = Settings.settingsGet('Themes');

			this.themes(Utils.isArray(aThemes) ? aThemes : []);
			this.theme(Settings.settingsGet('Theme'));
			this.themeBackgroundName(Settings.settingsGet('UserBackgroundName'));
			this.themeBackgroundHash(Settings.settingsGet('UserBackgroundHash'));
		};

		module.exports = new ThemeStore();

	}());


/***/ },
/* 45 */
/*!*******************************!*\
  !*** ./dev/View/Popup/Ask.js ***!
  \*******************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),
			ko = __webpack_require__(/*! ko */ 3),
			key = __webpack_require__(/*! key */ 16),

			Enums = __webpack_require__(/*! Common/Enums */ 4),
			Utils = __webpack_require__(/*! Common/Utils */ 1),
			Translator = __webpack_require__(/*! Common/Translator */ 6),

			kn = __webpack_require__(/*! Knoin/Knoin */ 5),
			AbstractView = __webpack_require__(/*! Knoin/AbstractView */ 12)
		;

		/**
		 * @constructor
		 * @extends AbstractView
		 */
		function AskPopupView()
		{
			AbstractView.call(this, 'Popups', 'PopupsAsk');

			this.askDesc = ko.observable('');
			this.yesButton = ko.observable('');
			this.noButton = ko.observable('');

			this.yesFocus = ko.observable(false);
			this.noFocus = ko.observable(false);

			this.fYesAction = null;
			this.fNoAction = null;

			this.bFocusYesOnShow = true;
			this.bDisabeCloseOnEsc = true;
			this.sDefaultKeyScope = Enums.KeyState.PopupAsk;

			kn.constructorEnd(this);
		}

		kn.extendAsViewModel(['View/Popup/Ask', 'PopupsAskViewModel'], AskPopupView);
		_.extend(AskPopupView.prototype, AbstractView.prototype);

		AskPopupView.prototype.clearPopup = function ()
		{
			this.askDesc('');
			this.yesButton(Translator.i18n('POPUPS_ASK/BUTTON_YES'));
			this.noButton(Translator.i18n('POPUPS_ASK/BUTTON_NO'));

			this.yesFocus(false);
			this.noFocus(false);

			this.fYesAction = null;
			this.fNoAction = null;
		};

		AskPopupView.prototype.yesClick = function ()
		{
			this.cancelCommand();

			if (Utils.isFunc(this.fYesAction))
			{
				this.fYesAction.call(null);
			}
		};

		AskPopupView.prototype.noClick = function ()
		{
			this.cancelCommand();

			if (Utils.isFunc(this.fNoAction))
			{
				this.fNoAction.call(null);
			}
		};

		/**
		 * @param {string} sAskDesc
		 * @param {Function=} fYesFunc
		 * @param {Function=} fNoFunc
		 * @param {string=} sYesButton
		 * @param {string=} sNoButton
		 * @param {boolean=} bFocusYesOnShow
		 */
		AskPopupView.prototype.onShow = function (sAskDesc, fYesFunc, fNoFunc, sYesButton, sNoButton, bFocusYesOnShow)
		{
			this.clearPopup();

			this.fYesAction = fYesFunc || null;
			this.fNoAction = fNoFunc || null;

			this.askDesc(sAskDesc || '');
			if (sYesButton)
			{
				this.yesButton(sYesButton);
			}

			if (sYesButton)
			{
				this.yesButton(sNoButton);
			}

			this.bFocusYesOnShow = Utils.isUnd(bFocusYesOnShow) ? true : !!bFocusYesOnShow;
		};

		AskPopupView.prototype.onShowWithDelay = function ()
		{
			if (this.bFocusYesOnShow)
			{
				this.yesFocus(true);
			}
		};

		AskPopupView.prototype.onBuild = function ()
		{
			key('tab, shift+tab, right, left', Enums.KeyState.PopupAsk, _.bind(function () {
				if (this.yesFocus())
				{
					this.noFocus(true);
				}
				else
				{
					this.yesFocus(true);
				}
				return false;
			}, this));

			key('esc', Enums.KeyState.PopupAsk, _.bind(function () {
				this.noClick();
				return false;
			}, this));
		};

		module.exports = AskPopupView;

	}());

/***/ },
/* 46 */
/*!*************************************!*\
  !*** ./dev/View/Popup/Languages.js ***!
  \*************************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),
			ko = __webpack_require__(/*! ko */ 3),

			Utils = __webpack_require__(/*! Common/Utils */ 1),

			kn = __webpack_require__(/*! Knoin/Knoin */ 5),
			AbstractView = __webpack_require__(/*! Knoin/AbstractView */ 12)
		;

		/**
		 * @constructor
		 * @extends AbstractView
		 */
		function LanguagesPopupView()
		{
			AbstractView.call(this, 'Popups', 'PopupsLanguages');

			var self = this;

			this.fLang = null;
			this.userLanguage = ko.observable('');

			this.langs = ko.observableArray([]);

			this.languages = ko.computed(function () {
				var sUserLanguage = self.userLanguage();
				return _.map(self.langs(), function (sLanguage) {
					return {
						'key': sLanguage,
						'user': sLanguage === sUserLanguage,
						'selected': ko.observable(false),
						'fullName': Utils.convertLangName(sLanguage)
					};
				});
			});

			this.langs.subscribe(function () {
				this.setLanguageSelection();
			}, this);

			kn.constructorEnd(this);
		}

		kn.extendAsViewModel(['View/Popup/Languages', 'PopupsLanguagesViewModel'], LanguagesPopupView);
		_.extend(LanguagesPopupView.prototype, AbstractView.prototype);

		LanguagesPopupView.prototype.languageTooltipName = function (sLanguage)
		{
			var sResult = Utils.convertLangName(sLanguage, true);
			return Utils.convertLangName(sLanguage, false) === sResult ? '' : sResult;
		};

		LanguagesPopupView.prototype.setLanguageSelection = function ()
		{
			var sCurrent = this.fLang ? ko.unwrap(this.fLang) : '';
			_.each(this.languages(), function (oItem) {
				oItem['selected'](oItem['key'] === sCurrent);
			});
		};

		LanguagesPopupView.prototype.onBeforeShow = function ()
		{
			this.fLang = null;
			this.userLanguage('');

			this.langs([]);
		};

		LanguagesPopupView.prototype.onShow = function (fLanguage, aLangs, sUserLanguage)
		{
			this.fLang = fLanguage;
			this.userLanguage(sUserLanguage || '');

			this.langs(aLangs);
		};

		LanguagesPopupView.prototype.changeLanguage = function (sLang)
		{
			if (this.fLang)
			{
				this.fLang(sLang);
			}

			this.cancelCommand();
		};

		module.exports = LanguagesPopupView;

	}());

/***/ },
/* 47 */
/*!************************************!*\
  !*** external "window.crossroads" ***!
  \************************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = window.crossroads;

/***/ },
/* 48 */
/*!**********************************!*\
  !*** ./dev/Stores/Admin/Capa.js ***!
  \**********************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			ko = __webpack_require__(/*! ko */ 3),

			Enums = __webpack_require__(/*! Common/Enums */ 4),

			Settings = __webpack_require__(/*! Storage/Settings */ 9)
		;

		/**
		 * @constructor
		 */
		function CapaAdminStore()
		{
			this.additionalAccounts = ko.observable(false);
			this.identities = ko.observable(false);
			this.gravatar = ko.observable(false);
			this.attachmentThumbnails = ko.observable(false);
			this.sieve = ko.observable(false);
			this.filters = ko.observable(false);
			this.themes = ko.observable(true);
			this.userBackground = ko.observable(false);
			this.openPGP = ko.observable(false);
			this.twoFactorAuth = ko.observable(false);
			this.twoFactorAuthForce = ko.observable(false);
			this.templates = ko.observable(false);
		}

		CapaAdminStore.prototype.populate = function()
		{
			this.additionalAccounts(Settings.capa(Enums.Capa.AdditionalAccounts));
			this.identities(Settings.capa(Enums.Capa.Identities));
			this.gravatar(Settings.capa(Enums.Capa.Gravatar));
			this.attachmentThumbnails(Settings.capa(Enums.Capa.AttachmentThumbnails));
			this.sieve(Settings.capa(Enums.Capa.Sieve));
			this.filters(Settings.capa(Enums.Capa.Filters));
			this.themes(Settings.capa(Enums.Capa.Themes));
			this.userBackground(Settings.capa(Enums.Capa.UserBackground));
			this.openPGP(Settings.capa(Enums.Capa.OpenPGP));
			this.twoFactorAuth(Settings.capa(Enums.Capa.TwoFactor));
			this.twoFactorAuthForce(Settings.capa(Enums.Capa.TwoFactorForce));
			this.templates(Settings.capa(Enums.Capa.Templates));
		};

		module.exports = new CapaAdminStore();

	}());


/***/ },
/* 49 */,
/* 50 */,
/* 51 */,
/* 52 */
/*!********************************!*\
  !*** external "window.moment" ***!
  \********************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = window.moment;

/***/ },
/* 53 */
/*!*****************************!*\
  !*** ./dev/App/Abstract.js ***!
  \*****************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			window = __webpack_require__(/*! window */ 10),
			_ = __webpack_require__(/*! _ */ 2),
			$ = __webpack_require__(/*! $ */ 11),
			key = __webpack_require__(/*! key */ 16),

			Globals = __webpack_require__(/*! Common/Globals */ 8),
			Enums = __webpack_require__(/*! Common/Enums */ 4),
			Utils = __webpack_require__(/*! Common/Utils */ 1),
			Links = __webpack_require__(/*! Common/Links */ 13),
			Events = __webpack_require__(/*! Common/Events */ 23),
			Translator = __webpack_require__(/*! Common/Translator */ 6),

			Settings = __webpack_require__(/*! Storage/Settings */ 9),

			AbstractBoot = __webpack_require__(/*! Knoin/AbstractBoot */ 66)
		;

		/**
		 * @constructor
		 * @param {RemoteStorage|AdminRemoteStorage} Remote
		 * @extends AbstractBoot
		 */
		function AbstractApp(Remote)
		{
			AbstractBoot.call(this);

			this.isLocalAutocomplete = true;

			this.iframe = $('<iframe style="display:none" src="javascript:;" />').appendTo('body');

			Globals.$win.on('error', function (oEvent) {
				if (oEvent && oEvent.originalEvent && oEvent.originalEvent.message &&
					-1 === Utils.inArray(oEvent.originalEvent.message, [
						'Script error.', 'Uncaught Error: Error calling method on NPObject.'
					]))
				{
					Remote.jsError(
						Utils.emptyFunction,
						oEvent.originalEvent.message,
						oEvent.originalEvent.filename,
						oEvent.originalEvent.lineno,
						window.location && window.location.toString ? window.location.toString() : '',
						Globals.$html.attr('class'),
						Utils.microtime() - Globals.startMicrotime
					);
				}
			});

			Globals.$win.on('resize', function () {
				Events.pub('window.resize');
			});

			Events.sub('window.resize', _.throttle(function () {

				var
					iH = Globals.$win.height(),
					iW = Globals.$win.height()
				;

				if (Globals.$win.__sizes[0] !== iH || Globals.$win.__sizes[1] !== iW)
				{
					Globals.$win.__sizes[0] = iH;
					Globals.$win.__sizes[1] = iW;

					Events.pub('window.resize.real');
				}

			}, 50));

			 // DEBUG
	//		Events.sub({
	//			'window.resize': function () {
	//				window.console.log('window.resize');
	//			},
	//			'window.resize.real': function () {
	//				window.console.log('window.resize.real');
	//			}
	//		});

			Globals.$doc.on('keydown', function (oEvent) {
				if (oEvent && oEvent.ctrlKey)
				{
					Globals.$html.addClass('rl-ctrl-key-pressed');
				}
			}).on('keyup', function (oEvent) {
				if (oEvent && !oEvent.ctrlKey)
				{
					Globals.$html.removeClass('rl-ctrl-key-pressed');
				}
			});

			Globals.$doc.on('mousemove keypress click', _.debounce(function () {
				Events.pub('rl.auto-logout-refresh');
			}, 5000));

			key('esc, enter', Enums.KeyState.All, _.bind(function () {
				Utils.detectDropdownVisibility();
			}, this));
		}

		_.extend(AbstractApp.prototype, AbstractBoot.prototype);

		AbstractApp.prototype.remote = function ()
		{
			return null;
		};

		AbstractApp.prototype.data = function ()
		{
			return null;
		};

		/**
		 * @param {string} sLink
		 * @return {boolean}
		 */
		AbstractApp.prototype.download = function (sLink)
		{
			var
				oE = null,
				oLink = null
			;

			if (Globals.sUserAgent && (Globals.sUserAgent.indexOf('chrome') > -1 || Globals.sUserAgent.indexOf('chrome') > -1))
			{
				oLink = window.document.createElement('a');
				oLink['href'] = sLink;

				if (window.document['createEvent'])
				{
					oE = window.document['createEvent']('MouseEvents');
					if (oE && oE['initEvent'] && oLink['dispatchEvent'])
					{
						oE['initEvent']('click', true, true);
						oLink['dispatchEvent'](oE);
						return true;
					}
				}
			}

			if (Globals.bMobileDevice)
			{
				window.open(sLink, '_self');
				window.focus();
			}
			else
			{
				this.iframe.attr('src', sLink);
		//		window.document.location.href = sLink;
			}

			return true;
		};

		AbstractApp.prototype.googlePreviewSupportedCache = null;

		/**
		 * @return {boolean}
		 */
		AbstractApp.prototype.googlePreviewSupported = function ()
		{
			if (null === this.googlePreviewSupportedCache)
			{
				this.googlePreviewSupportedCache = !!Settings.settingsGet('AllowGoogleSocial') &&
					!!Settings.settingsGet('AllowGoogleSocialPreview');
			}

			return this.googlePreviewSupportedCache;
		};

		/**
		 * @param {string} sTitle
		 */
		AbstractApp.prototype.setWindowTitle = function (sTitle)
		{
			sTitle = ((Utils.isNormal(sTitle) && 0 < sTitle.length) ? '' + sTitle : '');
			if (Settings.settingsGet('Title'))
			{
				sTitle += (sTitle ? ' - ' : '') + Settings.settingsGet('Title');
			}

			window.document.title = sTitle + ' ...';
			window.document.title = sTitle;
		};

		AbstractApp.prototype.redirectToAdminPanel = function ()
		{
			_.delay(function () {
				window.location.href = Links.rootAdmin();
			}, 100);
		};

		AbstractApp.prototype.clearClientSideToken = function ()
		{
			if (window.__rlah_clear)
			{
				window.__rlah_clear();
			}
		};

		/**
		 * @param {string} sKey
		 */
		AbstractApp.prototype.setClientSideToken = function (sKey)
		{
			if (window.__rlah_set)
			{
				window.__rlah_set(sKey);

				__webpack_require__(/*! Storage/Settings */ 9).settingsSet('AuthAccountHash', sKey);
				__webpack_require__(/*! Common/Links */ 13).populateAuthSuffix();
			}
		};

		/**
		 * @param {boolean=} bAdmin = false
		 * @param {boolean=} bLogout = false
		 * @param {boolean=} bClose = false
		 */
		AbstractApp.prototype.loginAndLogoutReload = function (bAdmin, bLogout, bClose)
		{
			var
				kn = __webpack_require__(/*! Knoin/Knoin */ 5),
				sCustomLogoutLink = Utils.pString(Settings.settingsGet('CustomLogoutLink')),
				bInIframe = !!Settings.settingsGet('InIframe')
			;

			bLogout = Utils.isUnd(bLogout) ? false : !!bLogout;
			bClose = Utils.isUnd(bClose) ? false : !!bClose;

			if (bLogout)
			{
				this.clearClientSideToken();
			}

			if (bLogout && bClose && window.close)
			{
				window.close();
			}

			sCustomLogoutLink = sCustomLogoutLink || (bAdmin ? Links.rootAdmin() : Links.rootUser());

			if (bLogout && window.location.href !== sCustomLogoutLink)
			{
				_.delay(function () {
					if (bInIframe && window.parent)
					{
						window.parent.location.href = sCustomLogoutLink;
					}
					else
					{
						window.location.href = sCustomLogoutLink;
					}
				}, 100);
			}
			else
			{
				kn.routeOff();
				kn.setHash(Links.root(), true);
				kn.routeOff();

				_.delay(function () {
					if (bInIframe && window.parent)
					{
						window.parent.location.reload();
					}
					else
					{
						window.location.reload();
					}
				}, 100);
			}
		};

		AbstractApp.prototype.historyBack = function ()
		{
			window.history.back();
		};

		AbstractApp.prototype.bootstart = function ()
		{
			Utils.log('Ps' + 'ss, hac' + 'kers! The' + 're\'s not' + 'hing inte' + 'resting :' + ')');

			Events.pub('rl.bootstart');

			var
				ssm = __webpack_require__(/*! ssm */ 85),
				ko = __webpack_require__(/*! ko */ 3)
			;

			ko.components.register('SaveTrigger', __webpack_require__(/*! Component/SaveTrigger */ 60));
			ko.components.register('Input', __webpack_require__(/*! Component/Input */ 57));
			ko.components.register('Select', __webpack_require__(/*! Component/Select */ 62));
			ko.components.register('Radio', __webpack_require__(/*! Component/Radio */ 59));
			ko.components.register('TextArea', __webpack_require__(/*! Component/TextArea */ 64));

			ko.components.register('x-script', __webpack_require__(/*! Component/Script */ 61));
			ko.components.register('svg-icon', __webpack_require__(/*! Component/SvgIcon */ 63));

			if (/**false && /**/Settings.settingsGet('MaterialDesign') && Globals.bAnimationSupported)
			{
				ko.components.register('Checkbox', __webpack_require__(/*! Component/MaterialDesign/Checkbox */ 58));
				ko.components.register('CheckboxSimple', __webpack_require__(/*! Component/Checkbox */ 36));
			}
			else
			{
	//			ko.components.register('Checkbox', require('Component/Classic/Checkbox'));
	//			ko.components.register('CheckboxSimple', require('Component/Classic/Checkbox'));
				ko.components.register('Checkbox', __webpack_require__(/*! Component/Checkbox */ 36));
				ko.components.register('CheckboxSimple', __webpack_require__(/*! Component/Checkbox */ 36));
			}

			Translator.initOnStartOrLangChange(Translator.initNotificationLanguage, Translator);

			_.delay(Utils.windowResizeCallback, 1000);

			ssm.addState({
				'id': 'mobile',
				'maxWidth': 767,
				'onEnter': function() {
					Globals.$html.addClass('ssm-state-mobile');
					Events.pub('ssm.mobile-enter');
				},
				'onLeave': function() {
					Globals.$html.removeClass('ssm-state-mobile');
					Events.pub('ssm.mobile-leave');
				}
			});

			ssm.addState({
				'id': 'tablet',
				'minWidth': 768,
				'maxWidth': 999,
				'onEnter': function() {
					Globals.$html.addClass('ssm-state-tablet');
				},
				'onLeave': function() {
					Globals.$html.removeClass('ssm-state-tablet');
				}
			});

			ssm.addState({
				'id': 'desktop',
				'minWidth': 1000,
				'maxWidth': 1400,
				'onEnter': function() {
					Globals.$html.addClass('ssm-state-desktop');
				},
				'onLeave': function() {
					Globals.$html.removeClass('ssm-state-desktop');
				}
			});

			ssm.addState({
				'id': 'desktop-large',
				'minWidth': 1400,
				'onEnter': function() {
					Globals.$html.addClass('ssm-state-desktop-large');
				},
				'onLeave': function() {
					Globals.$html.removeClass('ssm-state-desktop-large');
				}
			});

			Events.sub('ssm.mobile-enter', function () {
				Globals.leftPanelDisabled(true);
			});

			Events.sub('ssm.mobile-leave', function () {
				Globals.leftPanelDisabled(false);
			});

			Globals.leftPanelDisabled.subscribe(function (bValue) {
				Globals.$html.toggleClass('rl-left-panel-disabled', bValue);
			});

			Globals.leftPanelType.subscribe(function (sValue) {
				Globals.$html.toggleClass('rl-left-panel-none', 'none' === sValue);
				Globals.$html.toggleClass('rl-left-panel-short', 'short' === sValue);
			});

			ssm.ready();

			__webpack_require__(/*! Stores/Language */ 38).populate();
			__webpack_require__(/*! Stores/Theme */ 44).populate();
			__webpack_require__(/*! Stores/Social */ 34).populate();
		};

		module.exports = AbstractApp;

	}());

/***/ },
/* 54 */,
/* 55 */
/*!****************************!*\
  !*** ./dev/Common/Mime.js ***!
  \****************************/
/***/ function(module, exports, __webpack_require__) {

	(function () {

		'use strict';

		module.exports = {

			'eml'	: 'message/rfc822',
			'mime'	: 'message/rfc822',
			'txt'	: 'text/plain',
			'text'	: 'text/plain',
			'def'	: 'text/plain',
			'list'	: 'text/plain',
			'in'	: 'text/plain',
			'ini'	: 'text/plain',
			'log'	: 'text/plain',
			'sql'	: 'text/plain',
			'cfg'	: 'text/plain',
			'conf'	: 'text/plain',
			'asc'	: 'text/plain',
			'rtx'	: 'text/richtext',
			'vcard'	: 'text/vcard',
			'vcf'	: 'text/vcard',
			'htm'	: 'text/html',
			'html'	: 'text/html',
			'csv'	: 'text/csv',
			'ics'	: 'text/calendar',
			'ifb'	: 'text/calendar',
			'xml'	: 'text/xml',
			'json'	: 'application/json',
			'swf'	: 'application/x-shockwave-flash',
			'hlp'	: 'application/winhlp',
			'wgt'	: 'application/widget',
			'chm'	: 'application/vnd.ms-htmlhelp',
			'p10'	: 'application/pkcs10',
			'p7c'	: 'application/pkcs7-mime',
			'p7m'	: 'application/pkcs7-mime',
			'p7s'	: 'application/pkcs7-signature',
			'torrent'	: 'application/x-bittorrent',

			// scripts
			'js'	: 'application/javascript',
			'pl'	: 'text/perl',
			'css'	: 'text/css',
			'asp'	: 'text/asp',
			'php'	: 'application/x-httpd-php',
			'php3'	: 'application/x-httpd-php',
			'php4'	: 'application/x-httpd-php',
			'php5'	: 'application/x-httpd-php',
			'phtml'	: 'application/x-httpd-php',

			// images
			'png'	: 'image/png',
			'jpg'	: 'image/jpeg',
			'jpeg'	: 'image/jpeg',
			'jpe'	: 'image/jpeg',
			'jfif'	: 'image/jpeg',
			'gif'	: 'image/gif',
			'bmp'	: 'image/bmp',
			'cgm'	: 'image/cgm',
			'ief'	: 'image/ief',
			'ico'	: 'image/x-icon',
			'tif'	: 'image/tiff',
			'tiff'	: 'image/tiff',
			'svg'	: 'image/svg+xml',
			'svgz'	: 'image/svg+xml',
			'djv'	: 'image/vnd.djvu',
			'djvu'	: 'image/vnd.djvu',
			'webp'	: 'image/webp',

			// archives
			'zip'	: 'application/zip',
			'7z'	: 'application/x-7z-compressed',
			'rar'	: 'application/x-rar-compressed',
			'exe'	: 'application/x-msdownload',
			'dll'	: 'application/x-msdownload',
			'scr'	: 'application/x-msdownload',
			'com'	: 'application/x-msdownload',
			'bat'	: 'application/x-msdownload',
			'msi'	: 'application/x-msdownload',
			'cab'	: 'application/vnd.ms-cab-compressed',
			'gz'	: 'application/x-gzip',
			'tgz'	: 'application/x-gzip',
			'bz'	: 'application/x-bzip',
			'bz2'	: 'application/x-bzip2',
			'deb'	: 'application/x-debian-package',

			// fonts
			'psf'	: 'application/x-font-linux-psf',
			'otf'	: 'application/x-font-otf',
			'pcf'	: 'application/x-font-pcf',
			'snf'	: 'application/x-font-snf',
			'ttf'	: 'application/x-font-ttf',
			'ttc'	: 'application/x-font-ttf',

			// audio
			'mp3'	: 'audio/mpeg',
			'amr'	: 'audio/amr',
			'aac'	: 'audio/x-aac',
			'aif'	: 'audio/x-aiff',
			'aifc'	: 'audio/x-aiff',
			'aiff'	: 'audio/x-aiff',
			'wav'	: 'audio/x-wav',
			'wma'	: 'audio/x-ms-wma',
			'wax'	: 'audio/x-ms-wax',
			'midi'	: 'audio/midi',
			'mp4a'	: 'audio/mp4',
			'ogg'	: 'audio/ogg',
			'weba'	: 'audio/webm',
			'ra'	: 'audio/x-pn-realaudio',
			'ram'	: 'audio/x-pn-realaudio',
			'rmp'	: 'audio/x-pn-realaudio-plugin',
			'm3u'	: 'audio/x-mpegurl',

			// video
			'flv'	: 'video/x-flv',
			'qt'	: 'video/quicktime',
			'mov'	: 'video/quicktime',
			'wmv'	: 'video/windows-media',
			'avi'	: 'video/x-msvideo',
			'mpg'	: 'video/mpeg',
			'mpeg'	: 'video/mpeg',
			'mpe'	: 'video/mpeg',
			'm1v'	: 'video/mpeg',
			'm2v'	: 'video/mpeg',
			'3gp'	: 'video/3gpp',
			'3g2'	: 'video/3gpp2',
			'h261'	: 'video/h261',
			'h263'	: 'video/h263',
			'h264'	: 'video/h264',
			'jpgv'	: 'video/jpgv',
			'mp4'	: 'video/mp4',
			'mp4v'	: 'video/mp4',
			'mpg4'	: 'video/mp4',
			'ogv'	: 'video/ogg',
			'webm'	: 'video/webm',
			'm4v'	: 'video/x-m4v',
			'asf'	: 'video/x-ms-asf',
			'asx'	: 'video/x-ms-asf',
			'wm'	: 'video/x-ms-wm',
			'wmx'	: 'video/x-ms-wmx',
			'wvx'	: 'video/x-ms-wvx',
			'movie'	: 'video/x-sgi-movie',

			// adobe
			'pdf'	: 'application/pdf',
			'psd'	: 'image/vnd.adobe.photoshop',
			'ai'	: 'application/postscript',
			'eps'	: 'application/postscript',
			'ps'	: 'application/postscript',

			// ms office
			'doc'	: 'application/msword',
			'dot'	: 'application/msword',
			'rtf'	: 'application/rtf',
			'xls'	: 'application/vnd.ms-excel',
			'ppt'	: 'application/vnd.ms-powerpoint',
			'docx'	: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
			'xlsx'	: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			'dotx'	: 'application/vnd.openxmlformats-officedocument.wordprocessingml.template',
			'pptx'	: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',

			// open office
			'odt'	: 'application/vnd.oasis.opendocument.text',
			'ods'	: 'application/vnd.oasis.opendocument.spreadsheet'

		};

	}());


/***/ },
/* 56 */
/*!***************************************!*\
  !*** ./dev/Component/AbstracRadio.js ***!
  \***************************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),
			ko = __webpack_require__(/*! ko */ 3),

			Utils = __webpack_require__(/*! Common/Utils */ 1),

			AbstractComponent = __webpack_require__(/*! Component/Abstract */ 27)
		;

		/**
		 * @constructor
		 *
		 * @param {Object} oParams
		 *
		 * @extends AbstractComponent
		 */
		function AbstracRadio(oParams)
		{
			AbstractComponent.call(this);

			this.values = ko.observableArray([]);

			this.value = oParams.value;
			if (Utils.isUnd(this.value) || !this.value.subscribe)
			{
				this.value = ko.observable('');
			}

			this.inline = Utils.isUnd(oParams.inline) ? false : oParams.inline;
			this.readOnly = Utils.isUnd(oParams.readOnly) ? false : !!oParams.readOnly;

			if (oParams.values)
			{
				var aValues = _.map(oParams.values, function (sLabel, sValue) {
					return {
						'label': sLabel,
						'value': sValue
					};
				});

				this.values(aValues);
			}

			this.click = _.bind(this.click, this);
		}

		AbstracRadio.prototype.click = function(oValue) {
			if (!this.readOnly && oValue)
			{
				this.value(oValue.value);
			}
		};

		_.extend(AbstracRadio.prototype, AbstractComponent.prototype);

		AbstracRadio.componentExportHelper = AbstractComponent.componentExportHelper;

		module.exports = AbstracRadio;

	}());


/***/ },
/* 57 */
/*!********************************!*\
  !*** ./dev/Component/Input.js ***!
  \********************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),

			AbstractInput = __webpack_require__(/*! Component/AbstractInput */ 35)
		;

		/**
		 * @constructor
		 *
		 * @param {Object} oParams
		 *
		 * @extends AbstractInput
		 */
		function InputComponent(oParams)
		{
			AbstractInput.call(this, oParams);
		}

		_.extend(InputComponent.prototype, AbstractInput.prototype);

		module.exports = AbstractInput.componentExportHelper(
			InputComponent, 'InputComponent');

	}());


/***/ },
/* 58 */
/*!**************************************************!*\
  !*** ./dev/Component/MaterialDesign/Checkbox.js ***!
  \**************************************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),
			ko = __webpack_require__(/*! ko */ 3),

			AbstracCheckbox = __webpack_require__(/*! Component/AbstracCheckbox */ 41)
		;

		/**
		 * @constructor
		 *
		 * @param {Object} oParams
		 *
		 * @extends AbstracCheckbox
		 */
		function CheckboxMaterialDesignComponent(oParams)
		{
			AbstracCheckbox.call(this, oParams);

			this.animationBox = ko.observable(false).extend({'falseTimeout': 200});
			this.animationCheckmark = ko.observable(false).extend({'falseTimeout': 200});

			this.animationBoxSetTrue = _.bind(this.animationBoxSetTrue, this);
			this.animationCheckmarkSetTrue = _.bind(this.animationCheckmarkSetTrue, this);

			this.disposable.push(
				this.value.subscribe(function (bValue) {
					this.triggerAnimation(bValue);
				}, this)
			);
		}

		_.extend(CheckboxMaterialDesignComponent.prototype, AbstracCheckbox.prototype);

		CheckboxMaterialDesignComponent.prototype.animationBoxSetTrue = function()
		{
			this.animationBox(true);
		};

		CheckboxMaterialDesignComponent.prototype.animationCheckmarkSetTrue = function()
		{
			this.animationCheckmark(true);
		};

		CheckboxMaterialDesignComponent.prototype.triggerAnimation = function(bBox)
		{
			if (bBox)
			{
				this.animationBoxSetTrue();
				_.delay(this.animationCheckmarkSetTrue, 200);
			}
			else
			{
				this.animationCheckmarkSetTrue();
				_.delay(this.animationBoxSetTrue, 200);
			}
		};

		module.exports = AbstracCheckbox.componentExportHelper(
			CheckboxMaterialDesignComponent, 'CheckboxMaterialDesignComponent');

	}());


/***/ },
/* 59 */
/*!********************************!*\
  !*** ./dev/Component/Radio.js ***!
  \********************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),

			AbstracRadio = __webpack_require__(/*! Component/AbstracRadio */ 56)
		;

		/**
		 * @constructor
		 *
		 * @param {Object} oParams
		 *
		 * @extends AbstracRadio
		 */
		function RadioComponent(oParams)
		{
			AbstracRadio.call(this, oParams);
		}

		_.extend(RadioComponent.prototype, AbstracRadio.prototype);

		module.exports = AbstracRadio.componentExportHelper(
			RadioComponent, 'RadioComponent');

	}());


/***/ },
/* 60 */
/*!**************************************!*\
  !*** ./dev/Component/SaveTrigger.js ***!
  \**************************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),

			Enums = __webpack_require__(/*! Common/Enums */ 4),
			Utils = __webpack_require__(/*! Common/Utils */ 1),

			AbstractComponent = __webpack_require__(/*! Component/Abstract */ 27)
		;

		/**
		 * @constructor
		 *
		 * @param {Object} oParams
		 *
		 * @extends AbstractComponent
		 */
		function SaveTriggerComponent(oParams)
		{
			AbstractComponent.call(this);

			this.element = oParams.element || null;
			this.value = oParams.value && oParams.value.subscribe ? oParams.value : null;

			if (this.element)
			{
				if (this.value)
				{
					this.element.css('display', 'inline-block');

					if (oParams.verticalAlign)
					{
						this.element.css('vertical-align', oParams.verticalAlign);
					}

					this.setState(this.value());

					this.disposable.push(
						this.value.subscribe(this.setState, this)
					);
				}
				else
				{
					this.element.hide();
				}
			}
		}

		SaveTriggerComponent.prototype.setState = function (nValue)
		{
			switch (Utils.pInt(nValue))
			{
				case Enums.SaveSettingsStep.TrueResult:
					this.element
						.find('.animated,.error').hide().removeClass('visible')
						.end()
						.find('.success').show().addClass('visible')
					;
					break;
				case Enums.SaveSettingsStep.FalseResult:
					this.element
						.find('.animated,.success').hide().removeClass('visible')
						.end()
						.find('.error').show().addClass('visible')
					;
					break;
				case Enums.SaveSettingsStep.Animate:
					this.element
						.find('.error,.success').hide().removeClass('visible')
						.end()
						.find('.animated').show().addClass('visible')
					;
					break;
				default:
				case Enums.SaveSettingsStep.Idle:
					this.element
						.find('.animated').hide()
						.end()
						.find('.error,.success').removeClass('visible')
					;
					break;
			}
		};

		_.extend(SaveTriggerComponent.prototype, AbstractComponent.prototype);

		module.exports = AbstractComponent.componentExportHelper(
			SaveTriggerComponent, 'SaveTriggerComponent');

	}());


/***/ },
/* 61 */
/*!*********************************!*\
  !*** ./dev/Component/Script.js ***!
  \*********************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),
			$ = __webpack_require__(/*! $ */ 11),

			AbstractComponent = __webpack_require__(/*! Component/Abstract */ 27)
		;

		/**
		 * @constructor
		 *
		 * @param {Object} oParams
		 *
		 * @extends AbstractComponent
		 */
		function ScriptComponent(oParams)
		{
			AbstractComponent.call(this);

			if (oParams.component && oParams.component.templateNodes && oParams.element &&
				oParams.element[0] && oParams.element[0].outerHTML)
			{
				var sScript = oParams.element[0].outerHTML;
				sScript = sScript
					.replace(/<x-script/i, '<script')
					.replace(/<b><\/b><\/x-script>/i, '</script>')
				;

				if (sScript)
				{
					oParams.element.text('');
					oParams.element.replaceWith(
						$(sScript).text(oParams.component.templateNodes[0] &&
							oParams.component.templateNodes[0].nodeValue ?
								oParams.component.templateNodes[0].nodeValue : ''));
				}
				else
				{
					oParams.element.remove();
				}
			}
		}

		_.extend(ScriptComponent.prototype, AbstractComponent.prototype);

		module.exports = AbstractComponent.componentExportHelper(ScriptComponent);

	}());


/***/ },
/* 62 */
/*!*********************************!*\
  !*** ./dev/Component/Select.js ***!
  \*********************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),

			Utils = __webpack_require__(/*! Common/Utils */ 1),
			Translator = __webpack_require__(/*! Common/Translator */ 6),

			AbstractInput = __webpack_require__(/*! Component/AbstractInput */ 35)
		;

		/**
		 * @constructor
		 *
		 * @param {Object} oParams
		 *
		 * @extends AbstractInput
		 */
		function SelectComponent(oParams)
		{
			AbstractInput.call(this, oParams);

			this.options = oParams.options || '';

			this.optionsText = oParams.optionsText || null;
			this.optionsValue = oParams.optionsValue || null;
			this.optionsCaption = oParams.optionsCaption || null;

			if (this.optionsCaption)
			{
				this.optionsCaption = Translator.i18n(this.optionsCaption);
			}

			this.defautOptionsAfterRender = Utils.defautOptionsAfterRender;
		}

		_.extend(SelectComponent.prototype, AbstractInput.prototype);

		module.exports = AbstractInput.componentExportHelper(
			SelectComponent, 'SelectComponent');

	}());


/***/ },
/* 63 */
/*!**********************************!*\
  !*** ./dev/Component/SvgIcon.js ***!
  \**********************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			$ = __webpack_require__(/*! $ */ 11),
			sUrl = null,
			getUtl = function () {
				if (!sUrl)
				{
					sUrl = 'rainloop/v/' + ($('#rlAppVersion').attr('content') || '0.0.0')	+ '/static/css/svg/icons.svg';
				}

				return sUrl;
			}
		;

		module.exports = {
			viewModel: {
				createViewModel: function(oParams, oComponentInfo) {
					var icon = oParams.icon || 'null';
					if (oComponentInfo.element && oComponentInfo.element)
					{
						$(oComponentInfo.element).replaceWith(
	'<svg class="svg-icon svg-icon-' + icon + '"><use xlink:href="' + getUtl() + '#svg-icon-' + icon + '"></use></svg>');
					}
				}
			},
			'template': '<b></b>'
		};

	}());




/***/ },
/* 64 */
/*!***********************************!*\
  !*** ./dev/Component/TextArea.js ***!
  \***********************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),

			Utils = __webpack_require__(/*! Common/Utils */ 1),

			AbstractInput = __webpack_require__(/*! Component/AbstractInput */ 35)
		;

		/**
		 * @constructor
		 *
		 * @param {Object} oParams
		 *
		 * @extends AbstractInput
		 */
		function TextAreaComponent(oParams)
		{
			AbstractInput.call(this, oParams);

			this.rows = oParams.rows || 5;
			this.spellcheck = Utils.isUnd(oParams.spellcheck) ? false : !!oParams.spellcheck;
		}

		_.extend(TextAreaComponent.prototype, AbstractInput.prototype);

		module.exports = AbstractInput.componentExportHelper(
			TextAreaComponent, 'TextAreaComponent');

	}());


/***/ },
/* 65 */
/*!*********************************!*\
  !*** ./dev/External/Opentip.js ***!
  \*********************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			window = __webpack_require__(/*! window */ 10),
			Opentip = window.Opentip
		;

		Opentip.styles.rainloop = {

			'extends': 'standard',

			'fixed': true,
			'target': true,

			'delay': 0.2,
			'hideDelay': 0,

			'hideEffect': 'fade',
			'hideEffectDuration': 0.2,

			'showEffect': 'fade',
			'showEffectDuration': 0.2,

			'showOn': 'mouseover click',
			'removeElementsOnHide': true,

			'background': '#fff',
			'shadow': false,

			'borderColor': '#999',
			'borderRadius': 2,
			'borderWidth': 1
		};

		Opentip.styles.rainloopTip = {
			'extends': 'rainloop',
			'delay': 0.4,
			'group': 'rainloopTips'
		};

		Opentip.styles.rainloopErrorTip = {
			'extends': 'rainloop',
			'className': 'rainloopErrorTip'
		};

		module.exports = Opentip;

	}());


/***/ },
/* 66 */
/*!***********************************!*\
  !*** ./dev/Knoin/AbstractBoot.js ***!
  \***********************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		/**
		 * @constructor
		 */
		function AbstractBoot()
		{

		}

		AbstractBoot.prototype.bootstart = function ()
		{

		};

		module.exports = AbstractBoot;

	}());

/***/ },
/* 67 */
/*!************************************!*\
  !*** ./dev/Remote/AbstractAjax.js ***!
  \************************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			window = __webpack_require__(/*! window */ 10),
			_ = __webpack_require__(/*! _ */ 2),
			$ = __webpack_require__(/*! $ */ 11),

			Consts = __webpack_require__(/*! Common/Consts */ 15),
			Enums = __webpack_require__(/*! Common/Enums */ 4),
			Globals = __webpack_require__(/*! Common/Globals */ 8),
			Utils = __webpack_require__(/*! Common/Utils */ 1),
			Plugins = __webpack_require__(/*! Common/Plugins */ 20),
			Links = __webpack_require__(/*! Common/Links */ 13),

			Settings = __webpack_require__(/*! Storage/Settings */ 9)
		;

		/**
		* @constructor
		*/
		function AbstractAjaxRemote()
		{
			this.oRequests = {};
		}

		AbstractAjaxRemote.prototype.oRequests = {};

		/**
		 * @param {?Function} fCallback
		 * @param {string} sRequestAction
		 * @param {string} sType
		 * @param {?AjaxJsonDefaultResponse} oData
		 * @param {boolean} bCached
		 * @param {*=} oRequestParameters
		 */
		AbstractAjaxRemote.prototype.defaultResponse = function (fCallback, sRequestAction, sType, oData, bCached, oRequestParameters)
		{
			var
				fCall = function () {
					if (Enums.StorageResultType.Success !== sType && Globals.bUnload)
					{
						sType = Enums.StorageResultType.Unload;
					}

					if (Enums.StorageResultType.Success === sType && oData && !oData.Result)
					{
						if (oData && -1 < Utils.inArray(oData.ErrorCode, [
							Enums.Notification.AuthError, Enums.Notification.AccessError,
							Enums.Notification.ConnectionError, Enums.Notification.DomainNotAllowed, Enums.Notification.AccountNotAllowed,
							Enums.Notification.MailServerError,	Enums.Notification.UnknownNotification, Enums.Notification.UnknownError
						]))
						{
							Globals.iAjaxErrorCount++;
						}

						if (oData && Enums.Notification.InvalidToken === oData.ErrorCode)
						{
							Globals.iTokenErrorCount++;
						}

						if (Consts.Values.TokenErrorLimit < Globals.iTokenErrorCount)
						{
							if (Globals.__APP__ && Globals.__APP__.loginAndLogoutReload)
							{
								 Globals.__APP__.loginAndLogoutReload(false, true);
							}
						}

						if (oData.ClearAuth || oData.Logout || Consts.Values.AjaxErrorLimit < Globals.iAjaxErrorCount)
						{
							if (Globals.__APP__ && Globals.__APP__.clearClientSideToken)
							{
								Globals.__APP__.clearClientSideToken();

								if (!oData.ClearAuth &&  Globals.__APP__.loginAndLogoutReload)
								{
									 Globals.__APP__.loginAndLogoutReload(false, true);
								}
							}
						}
					}
					else if (Enums.StorageResultType.Success === sType && oData && oData.Result)
					{
						Globals.iAjaxErrorCount = 0;
						Globals.iTokenErrorCount = 0;
					}

					if (fCallback)
					{
						Plugins.runHook('ajax-default-response', [sRequestAction, Enums.StorageResultType.Success === sType ? oData : null, sType, bCached, oRequestParameters]);

						fCallback(
							sType,
							Enums.StorageResultType.Success === sType ? oData : null,
							bCached,
							sRequestAction,
							oRequestParameters
						);
					}
				}
			;

			switch (sType)
			{
				case 'success':
					sType = Enums.StorageResultType.Success;
					break;
				case 'abort':
					sType = Enums.StorageResultType.Abort;
					break;
				default:
					sType = Enums.StorageResultType.Error;
					break;
			}

			if (Enums.StorageResultType.Error === sType)
			{
				_.delay(fCall, 300);
			}
			else
			{
				fCall();
			}
		};

		/**
		 * @param {?Function} fResultCallback
		 * @param {Object} oParameters
		 * @param {?number=} iTimeOut = 20000
		 * @param {string=} sGetAdd = ''
		 * @param {Array=} aAbortActions = []
		 * @return {jQuery.jqXHR}
		 */
		AbstractAjaxRemote.prototype.ajaxRequest = function (fResultCallback, oParameters, iTimeOut, sGetAdd, aAbortActions)
		{
			var
				self = this,
				bPost = '' === sGetAdd,
				oHeaders = {},
				iStart = (new window.Date()).getTime(),
				oDefAjax = null,
				sAction = ''
			;

			oParameters = oParameters || {};
			iTimeOut = Utils.isNormal(iTimeOut) ? iTimeOut : 20000;
			sGetAdd = Utils.isUnd(sGetAdd) ? '' : Utils.pString(sGetAdd);
			aAbortActions = Utils.isArray(aAbortActions) ? aAbortActions : [];

			sAction = oParameters.Action || '';

			if (sAction && 0 < aAbortActions.length)
			{
				_.each(aAbortActions, function (sActionToAbort) {
					if (self.oRequests[sActionToAbort])
					{
						self.oRequests[sActionToAbort].__aborted = true;
						if (self.oRequests[sActionToAbort].abort)
						{
							self.oRequests[sActionToAbort].abort();
						}
						self.oRequests[sActionToAbort] = null;
					}
				});
			}

			if (bPost)
			{
				oParameters['XToken'] = Settings.settingsGet('Token');
			}

			oDefAjax = $.ajax({
				'type': bPost ? 'POST' : 'GET',
				'url': Links.ajax(sGetAdd),
				'async': true,
				'dataType': 'json',
				'data': bPost ? oParameters : {},
				'headers': oHeaders,
				'timeout': iTimeOut,
				'global': true
			});

			oDefAjax.always(function (oData, sType) {

				var bCached = false;
				if (oData && oData['Time'])
				{
					bCached = Utils.pInt(oData['Time']) > (new window.Date()).getTime() - iStart;
				}

				if (sAction && self.oRequests[sAction])
				{
					if (self.oRequests[sAction].__aborted)
					{
						sType = 'abort';
					}

					self.oRequests[sAction] = null;
				}

				self.defaultResponse(fResultCallback, sAction, sType, oData, bCached, oParameters);
			});

			if (sAction && 0 < aAbortActions.length && -1 < Utils.inArray(sAction, aAbortActions))
			{
				if (this.oRequests[sAction])
				{
					this.oRequests[sAction].__aborted = true;
					if (this.oRequests[sAction].abort)
					{
						this.oRequests[sAction].abort();
					}
					this.oRequests[sAction] = null;
				}

				this.oRequests[sAction] = oDefAjax;
			}

			return oDefAjax;
		};

		/**
		 * @param {?Function} fCallback
		 * @param {string} sAction
		 * @param {Object=} oParameters
		 * @param {?number=} iTimeout
		 * @param {string=} sGetAdd = ''
		 * @param {Array=} aAbortActions = []
		 */
		AbstractAjaxRemote.prototype.defaultRequest = function (fCallback, sAction, oParameters, iTimeout, sGetAdd, aAbortActions)
		{
			oParameters = oParameters || {};
			oParameters.Action = sAction;

			sGetAdd = Utils.pString(sGetAdd);

			Plugins.runHook('ajax-default-request', [sAction, oParameters, sGetAdd]);

			return this.ajaxRequest(fCallback, oParameters,
				Utils.isUnd(iTimeout) ? Consts.Defaults.DefaultAjaxTimeout : Utils.pInt(iTimeout), sGetAdd, aAbortActions);
		};

		/**
		 * @param {?Function} fCallback
		 */
		AbstractAjaxRemote.prototype.noop = function (fCallback)
		{
			this.defaultRequest(fCallback, 'Noop');
		};

		/**
		 * @param {?Function} fCallback
		 * @param {string} sMessage
		 * @param {string} sFileName
		 * @param {number} iLineNo
		 * @param {string} sLocation
		 * @param {string} sHtmlCapa
		 * @param {number} iTime
		 */
		AbstractAjaxRemote.prototype.jsError = function (fCallback, sMessage, sFileName, iLineNo, sLocation, sHtmlCapa, iTime)
		{
			this.defaultRequest(fCallback, 'JsError', {
				'Message': sMessage,
				'FileName': sFileName,
				'LineNo': iLineNo,
				'Location': sLocation,
				'HtmlCapa': sHtmlCapa,
				'TimeOnPage': iTime
			});
		};

		/**
		 * @param {?Function} fCallback
		 * @param {string} sType
		 * @param {Array=} mData = null
		 * @param {boolean=} bIsError = false
		 */
		AbstractAjaxRemote.prototype.jsInfo = function (fCallback, sType, mData, bIsError)
		{
			this.defaultRequest(fCallback, 'JsInfo', {
				'Type': sType,
				'Data': mData,
				'IsError': (Utils.isUnd(bIsError) ? false : !!bIsError) ? '1' : '0'
			});
		};

		/**
		 * @param {?Function} fCallback
		 */
		AbstractAjaxRemote.prototype.getPublicKey = function (fCallback)
		{
			this.defaultRequest(fCallback, 'GetPublicKey');
		};

		/**
		 * @param {?Function} fCallback
		 * @param {string} sVersion
		 */
		AbstractAjaxRemote.prototype.jsVersion = function (fCallback, sVersion)
		{
			this.defaultRequest(fCallback, 'Version', {
				'Version': sVersion
			});
		};

		module.exports = AbstractAjaxRemote;

	}());

/***/ },
/* 68 */
/*!****************************************!*\
  !*** ./dev/Screen/AbstractSettings.js ***!
  \****************************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),
			$ = __webpack_require__(/*! $ */ 11),
			ko = __webpack_require__(/*! ko */ 3),

			Globals = __webpack_require__(/*! Common/Globals */ 8),
			Utils = __webpack_require__(/*! Common/Utils */ 1),
			Links = __webpack_require__(/*! Common/Links */ 13),

			kn = __webpack_require__(/*! Knoin/Knoin */ 5),
			AbstractScreen = __webpack_require__(/*! Knoin/AbstractScreen */ 37)
		;

		/**
		 * @constructor
		 * @param {Array} aViewModels
		 * @extends AbstractScreen
		 */
		function AbstractSettingsScreen(aViewModels)
		{
			AbstractScreen.call(this, 'settings', aViewModels);

			this.menu = ko.observableArray([]);

			this.oCurrentSubScreen = null;
			this.oViewModelPlace = null;

			this.setupSettings();
		}

		_.extend(AbstractSettingsScreen.prototype, AbstractScreen.prototype);

		/**
		 * @param {Function=} fCallback
		 */
		AbstractSettingsScreen.prototype.setupSettings = function (fCallback)
		{
			if (fCallback)
			{
				fCallback();
			}
		};

		AbstractSettingsScreen.prototype.onRoute = function (sSubName)
		{
			var
				self = this,
				oSettingsScreen = null,
				RoutedSettingsViewModel = null,
				oViewModelPlace = null,
				oViewModelDom = null
			;

			RoutedSettingsViewModel = _.find(Globals.aViewModels['settings'], function (SettingsViewModel) {
				return SettingsViewModel && SettingsViewModel.__rlSettingsData &&
					sSubName === SettingsViewModel.__rlSettingsData.Route;
			});

			if (RoutedSettingsViewModel)
			{
				if (_.find(Globals.aViewModels['settings-removed'], function (DisabledSettingsViewModel) {
					return DisabledSettingsViewModel && DisabledSettingsViewModel === RoutedSettingsViewModel;
				}))
				{
					RoutedSettingsViewModel = null;
				}

				if (RoutedSettingsViewModel && _.find(Globals.aViewModels['settings-disabled'], function (DisabledSettingsViewModel) {
					return DisabledSettingsViewModel && DisabledSettingsViewModel === RoutedSettingsViewModel;
				}))
				{
					RoutedSettingsViewModel = null;
				}
			}

			if (RoutedSettingsViewModel)
			{
				if (RoutedSettingsViewModel.__builded && RoutedSettingsViewModel.__vm)
				{
					oSettingsScreen = RoutedSettingsViewModel.__vm;
				}
				else
				{
					oViewModelPlace = this.oViewModelPlace;
					if (oViewModelPlace && 1 === oViewModelPlace.length)
					{
						oSettingsScreen = new RoutedSettingsViewModel();

						oViewModelDom = $('<div></div>').addClass('rl-settings-view-model').hide();
						oViewModelDom.appendTo(oViewModelPlace);

						oSettingsScreen.viewModelDom = oViewModelDom;

						oSettingsScreen.__rlSettingsData = RoutedSettingsViewModel.__rlSettingsData;

						RoutedSettingsViewModel.__dom = oViewModelDom;
						RoutedSettingsViewModel.__builded = true;
						RoutedSettingsViewModel.__vm = oSettingsScreen;

						ko.applyBindingAccessorsToNode(oViewModelDom[0], {
							'translatorInit': true,
							'template': function () { return {'name': RoutedSettingsViewModel.__rlSettingsData.Template}; }
						}, oSettingsScreen);

						Utils.delegateRun(oSettingsScreen, 'onBuild', [oViewModelDom]);
					}
					else
					{
						Utils.log('Cannot find sub settings view model position: SettingsSubScreen');
					}
				}

				if (oSettingsScreen)
				{
					_.defer(function () {
						// hide
						if (self.oCurrentSubScreen)
						{
							Utils.delegateRun(self.oCurrentSubScreen, 'onHide');
							self.oCurrentSubScreen.viewModelDom.hide();
						}
						// --

						self.oCurrentSubScreen = oSettingsScreen;

						// show
						if (self.oCurrentSubScreen)
						{
							Utils.delegateRun(self.oCurrentSubScreen, 'onBeforeShow');
							self.oCurrentSubScreen.viewModelDom.show();
							Utils.delegateRun(self.oCurrentSubScreen, 'onShow');
							Utils.delegateRun(self.oCurrentSubScreen, 'onShowWithDelay', [], 200);

							_.each(self.menu(), function (oItem) {
								oItem.selected(oSettingsScreen && oSettingsScreen.__rlSettingsData && oItem.route === oSettingsScreen.__rlSettingsData.Route);
							});

							$('#rl-content .b-settings .b-content .content').scrollTop(0);
						}
						// --

						Utils.windowResize();
					});
				}
			}
			else
			{
				kn.setHash(Links.settings(), false, true);
			}
		};

		AbstractSettingsScreen.prototype.onHide = function ()
		{
			if (this.oCurrentSubScreen && this.oCurrentSubScreen.viewModelDom)
			{
				Utils.delegateRun(this.oCurrentSubScreen, 'onHide');
				this.oCurrentSubScreen.viewModelDom.hide();
			}
		};

		AbstractSettingsScreen.prototype.onBuild = function ()
		{
			_.each(Globals.aViewModels['settings'], function (SettingsViewModel) {
				if (SettingsViewModel && SettingsViewModel.__rlSettingsData &&
					!_.find(Globals.aViewModels['settings-removed'], function (RemoveSettingsViewModel) {
						return RemoveSettingsViewModel && RemoveSettingsViewModel === SettingsViewModel;
					}))
				{
					this.menu.push({
						'route': SettingsViewModel.__rlSettingsData.Route,
						'label': SettingsViewModel.__rlSettingsData.Label,
						'selected': ko.observable(false),
						'disabled': !!_.find(Globals.aViewModels['settings-disabled'], function (DisabledSettingsViewModel) {
							return DisabledSettingsViewModel && DisabledSettingsViewModel === SettingsViewModel;
						})
					});
				}
			}, this);

			this.oViewModelPlace = $('#rl-content #rl-settings-subscreen');
		};

		AbstractSettingsScreen.prototype.routes = function ()
		{
			var
				DefaultViewModel = _.find(Globals.aViewModels['settings'], function (SettingsViewModel) {
					return SettingsViewModel && SettingsViewModel.__rlSettingsData && SettingsViewModel.__rlSettingsData['IsDefault'];
				}),
				sDefaultRoute = DefaultViewModel ? DefaultViewModel.__rlSettingsData['Route'] : 'general',
				oRules = {
					'subname': /^(.*)$/,
					'normalize_': function (oRequest, oVals) {
						oVals.subname = Utils.isUnd(oVals.subname) ? sDefaultRoute : Utils.pString(oVals.subname);
						return [oVals.subname];
					}
				}
			;

			return [
				['{subname}/', oRules],
				['{subname}', oRules],
				['', oRules]
			];
		};

		module.exports = AbstractSettingsScreen;

	}());

/***/ },
/* 69 */
/*!************************************!*\
  !*** ./dev/Stores/Admin/Domain.js ***!
  \************************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			ko = __webpack_require__(/*! ko */ 3)
		;

		/**
		 * @constructor
		 */
		function DomainAdminStore()
		{
			this.domains = ko.observableArray([]);
			this.domains.loading = ko.observable(false).extend({'throttle': 100});
		}

		module.exports = new DomainAdminStore();

	}());


/***/ },
/* 70 */
/*!*************************************!*\
  !*** ./dev/Stores/Admin/License.js ***!
  \*************************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			ko = __webpack_require__(/*! ko */ 3)
		;

		/**
		 * @constructor
		 */
		function LicenseAdminStore()
		{
			this.licensing = ko.observable(false);
			this.licensingProcess = ko.observable(false);
			this.licenseValid = ko.observable(false);
			this.licenseExpired = ko.observable(0);
			this.licenseError = ko.observable('');

			this.licenseTrigger = ko.observable(false);
		}

		module.exports = new LicenseAdminStore();

	}());


/***/ },
/* 71 */
/*!*************************************!*\
  !*** ./dev/Stores/Admin/Package.js ***!
  \*************************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			ko = __webpack_require__(/*! ko */ 3)
		;

		/**
		 * @constructor
		 */
		function PackageAdminStore()
		{
			this.packages = ko.observableArray([]);
			this.packages.loading = ko.observable(false).extend({'throttle': 100});

			this.packagesReal = ko.observable(true);
			this.packagesMainUpdatable = ko.observable(true);
		}

		module.exports = new PackageAdminStore();

	}());


/***/ },
/* 72 */
/*!************************************!*\
  !*** ./dev/Stores/Admin/Plugin.js ***!
  \************************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			ko = __webpack_require__(/*! ko */ 3)
		;

		/**
		 * @constructor
		 */
		function PluginAdminStore()
		{
			this.plugins = ko.observableArray([]);
			this.plugins.loading = ko.observable(false).extend({'throttle': 100});
			this.plugins.error = ko.observable('');
		}

		module.exports = new PluginAdminStore();

	}());


/***/ },
/* 73 */
/*!***************************!*\
  !*** ./dev/Stores/App.js ***!
  \***************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			ko = __webpack_require__(/*! ko */ 3),

			Globals = __webpack_require__(/*! Common/Globals */ 8),

			Settings = __webpack_require__(/*! Storage/Settings */ 9)
		;

		/**
		 * @constructor
		 */
		function AppStore()
		{
			this.allowLanguagesOnSettings = ko.observable(true);
			this.allowLanguagesOnLogin = ko.observable(true);

			this.interfaceAnimation = ko.observable(true);

			this.interfaceAnimation.subscribe(function (bValue) {
				var bAnim = Globals.bMobileDevice || !bValue;
				Globals.$html.toggleClass('rl-anim', !bAnim).toggleClass('no-rl-anim', bAnim);
			});

			this.interfaceAnimation.valueHasMutated();

			this.prem = ko.observable(false);
			this.community = ko.observable(true);
		}

		AppStore.prototype.populate = function()
		{
			this.allowLanguagesOnLogin(!!Settings.settingsGet('AllowLanguagesOnLogin'));
			this.allowLanguagesOnSettings(!!Settings.settingsGet('AllowLanguagesOnSettings'));

			this.interfaceAnimation(!!Settings.settingsGet('InterfaceAnimation'));

			this.prem(!!Settings.settingsGet('PremType'));
			this.community(!!Settings.settingsGet('Community'));
		};

		module.exports = AppStore;

	}());


/***/ },
/* 74 */,
/* 75 */,
/* 76 */,
/* 77 */,
/* 78 */
/*!**************************!*\
  !*** ./dev/bootstrap.js ***!
  \**************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		module.exports = function (App) {

			var
				window = __webpack_require__(/*! window */ 10),
				_ = __webpack_require__(/*! _ */ 2),
				$ = __webpack_require__(/*! $ */ 11),

				Globals = __webpack_require__(/*! Common/Globals */ 8),
				Plugins = __webpack_require__(/*! Common/Plugins */ 20),
				Utils = __webpack_require__(/*! Common/Utils */ 1),
				Enums = __webpack_require__(/*! Common/Enums */ 4),
				Translator = __webpack_require__(/*! Common/Translator */ 6),

				EmailModel = __webpack_require__(/*! Model/Email */ 28)
			;

			Globals.__APP__ = App;

			Globals.$win
				.keydown(Utils.kill_CtrlA_CtrlS)
				.unload(function () {
					Globals.bUnload = true;
				})
			;

			Globals.$html
				.addClass(Globals.bMobileDevice ? 'mobile' : 'no-mobile')
				.on('click.dropdown.data-api', function () {
					Utils.detectDropdownVisibility();
				})
			;

			// export
			window['rl'] = window['rl'] || {};
			window['rl']['i18n'] = _.bind(Translator.i18n, Translator);

			window['rl']['addHook'] = _.bind(Plugins.addHook, Plugins);
			window['rl']['settingsGet'] = _.bind(Plugins.mainSettingsGet, Plugins);
			window['rl']['createCommand'] = Utils.createCommand;

			window['rl']['addSettingsViewModel'] = _.bind(Plugins.addSettingsViewModel, Plugins);

			window['rl']['pluginRemoteRequest'] = _.bind(Plugins.remoteRequest, Plugins);
			window['rl']['pluginSettingsGet'] = _.bind(Plugins.settingsGet, Plugins);

			window['rl']['EmailModel'] = EmailModel;
			window['rl']['Enums'] = Enums;

			window['__APP_BOOT'] = function (fCall) {

				$(_.delay(function () {

					if (!$('#rl-check').is(':visible'))
					{
						Globals.$html.addClass('no-css');
					}

					$('#rl-check').remove();

					if (window['rainloopTEMPLATES'] && window['rainloopTEMPLATES'][0])
					{
						$('#rl-templates').html(window['rainloopTEMPLATES'][0]);

						_.delay(function () {

							App.bootstart();

							Globals.$html
								.removeClass('no-js rl-booted-trigger')
								.addClass('rl-booted')
							;

						}, 10);
					}
					else
					{
						fCall(false);
					}

					window['__APP_BOOT'] = null;

				}, 10));
			};

		};

	}());

/***/ },
/* 79 */
/*!***********************************!*\
  !*** (webpack)/buildin/module.js ***!
  \***********************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 80 */
/*!************************************!*\
  !*** external "window.Autolinker" ***!
  \************************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = window.Autolinker;

/***/ },
/* 81 */
/*!***********************************!*\
  !*** external "window.JSEncrypt" ***!
  \***********************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = window.JSEncrypt;

/***/ },
/* 82 */,
/* 83 */
/*!********************************!*\
  !*** external "window.hasher" ***!
  \********************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = window.hasher;

/***/ },
/* 84 */
/*!********************************************!*\
  !*** external "window.rainloopProgressJs" ***!
  \********************************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = window.rainloopProgressJs;

/***/ },
/* 85 */
/*!*****************************!*\
  !*** external "window.ssm" ***!
  \*****************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = window.ssm;

/***/ },
/* 86 */,
/* 87 */,
/* 88 */,
/* 89 */,
/* 90 */,
/* 91 */
/*!**********************************!*\
  !*** ./dev/Stores/Admin/Core.js ***!
  \**********************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			ko = __webpack_require__(/*! ko */ 3)
		;

		/**
		 * @constructor
		 */
		function CoreAdminStore()
		{
			this.coreReal = ko.observable(true);
			this.coreChannel = ko.observable('stable');
			this.coreType = ko.observable('stable');
			this.coreUpdatable = ko.observable(true);
			this.coreAccess = ko.observable(true);
			this.coreWarning = ko.observable(false);
			this.coreChecking = ko.observable(false).extend({'throttle': 100});
			this.coreUpdating = ko.observable(false).extend({'throttle': 100});
			this.coreVersion = ko.observable('');
			this.coreRemoteVersion = ko.observable('');
			this.coreRemoteRelease = ko.observable('');
			this.coreVersionCompare = ko.observable(-2);
		}

		module.exports = new CoreAdminStore();

	}());


/***/ },
/* 92 */,
/* 93 */,
/* 94 */,
/* 95 */
/*!************************************!*\
  !*** ./dev/View/Popup/Activate.js ***!
  \************************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),
			ko = __webpack_require__(/*! ko */ 3),

			Enums = __webpack_require__(/*! Common/Enums */ 4),
			Utils = __webpack_require__(/*! Common/Utils */ 1),
			Consts = __webpack_require__(/*! Common/Consts */ 15),
			Translator = __webpack_require__(/*! Common/Translator */ 6),

			Settings = __webpack_require__(/*! Storage/Settings */ 9),
			Remote = __webpack_require__(/*! Remote/Admin/Ajax */ 17),

			LicenseStore = __webpack_require__(/*! Stores/Admin/License */ 70),

			kn = __webpack_require__(/*! Knoin/Knoin */ 5),
			AbstractView = __webpack_require__(/*! Knoin/AbstractView */ 12)
		;

		/**
		 * @constructor
		 * @extends AbstractView
		 */
		function ActivatePopupView()
		{
			AbstractView.call(this, 'Popups', 'PopupsActivate');

			var self = this;

			this.domain = ko.observable('');
			this.key = ko.observable('');
			this.key.focus = ko.observable(false);
			this.activationSuccessed = ko.observable(false);

			this.licenseTrigger = LicenseStore.licenseTrigger;

			this.activateProcess = ko.observable(false);
			this.activateText = ko.observable('');
			this.activateText.isError = ko.observable(false);

			this.htmlDescription = ko.computed(function () {
				return Translator.i18n('POPUPS_ACTIVATE/HTML_DESC', {'DOMAIN': this.domain()});
			}, this);

			this.key.subscribe(function () {
				this.activateText('');
				this.activateText.isError(false);
			}, this);

			this.activationSuccessed.subscribe(function (bValue) {
				if (bValue)
				{
					this.licenseTrigger(!this.licenseTrigger());
				}
			}, this);

			this.activateCommand = Utils.createCommand(this, function () {

				this.activateProcess(true);
				if (this.validateSubscriptionKey())
				{
					Remote.licensingActivate(function (sResult, oData) {

						self.activateProcess(false);
						if (Enums.StorageResultType.Success === sResult && oData.Result)
						{
							if (true === oData.Result)
							{
								self.activationSuccessed(true);
								self.activateText(Translator.i18n('POPUPS_ACTIVATE/SUBS_KEY_ACTIVATED'));
								self.activateText.isError(false);
							}
							else
							{
								self.activateText(oData.Result);
								self.activateText.isError(true);
								self.key.focus(true);
							}
						}
						else if (oData.ErrorCode)
						{
							self.activateText(Translator.getNotification(oData.ErrorCode));
							self.activateText.isError(true);
							self.key.focus(true);
						}
						else
						{
							self.activateText(Translator.getNotification(Enums.Notification.UnknownError));
							self.activateText.isError(true);
							self.key.focus(true);
						}

					}, this.domain(), this.key());
				}
				else
				{
					this.activateProcess(false);
					this.activateText(Translator.i18n('POPUPS_ACTIVATE/ERROR_INVALID_SUBS_KEY'));
					this.activateText.isError(true);
					this.key.focus(true);
				}

			}, function () {
				return !this.activateProcess() && '' !== this.domain() && '' !== this.key() && !this.activationSuccessed();
			});

			kn.constructorEnd(this);
		}

		kn.extendAsViewModel(['View/Popup/Activate', 'PopupsActivateViewModel'], ActivatePopupView);
		_.extend(ActivatePopupView.prototype, AbstractView.prototype);

		ActivatePopupView.prototype.onShow = function (bTrial)
		{
			this.domain(Settings.settingsGet('AdminDomain'));
			if (!this.activateProcess())
			{
				bTrial = Utils.isUnd(bTrial) ? false : !!bTrial;

				this.key(bTrial ? Consts.Values.RainLoopTrialKey : '');
				this.activateText('');
				this.activateText.isError(false);
				this.activationSuccessed(false);
			}
		};

		ActivatePopupView.prototype.onShowWithDelay = function ()
		{
			if (!this.activateProcess())
			{
				this.key.focus(true);
			}
		};

		/**
		 * @return {boolean}
		 */
		ActivatePopupView.prototype.validateSubscriptionKey = function ()
		{
			var sValue = this.key();
			return '' === sValue || Consts.Values.RainLoopTrialKey === sValue ||
				!!/^RL[\d]+-[A-Z0-9\-]+Z$/.test(Utils.trim(sValue));
		};

		module.exports = ActivatePopupView;

	}());

/***/ },
/* 96 */
/*!**********************************!*\
  !*** ./dev/View/Popup/Domain.js ***!
  \**********************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),
			ko = __webpack_require__(/*! ko */ 3),

			Enums = __webpack_require__(/*! Common/Enums */ 4),
			Consts = __webpack_require__(/*! Common/Consts */ 15),
			Globals = __webpack_require__(/*! Common/Globals */ 8),
			Utils = __webpack_require__(/*! Common/Utils */ 1),

			Translator = __webpack_require__(/*! Common/Translator */ 6),

			CapaAdminStore = __webpack_require__(/*! Stores/Admin/Capa */ 48),

			Remote = __webpack_require__(/*! Remote/Admin/Ajax */ 17),

			kn = __webpack_require__(/*! Knoin/Knoin */ 5),
			AbstractView = __webpack_require__(/*! Knoin/AbstractView */ 12)
		;

		/**
		 * @constructor
		 * @extends AbstractView
		 */
		function DomainPopupView()
		{
			AbstractView.call(this, 'Popups', 'PopupsDomain');

			this.edit = ko.observable(false);
			this.saving = ko.observable(false);
			this.savingError = ko.observable('');
			this.page = ko.observable('main');
			this.sieveSettings = ko.observable(false);

			this.testing = ko.observable(false);
			this.testingDone = ko.observable(false);
			this.testingImapError = ko.observable(false);
			this.testingSieveError = ko.observable(false);
			this.testingSmtpError = ko.observable(false);
			this.testingImapErrorDesc = ko.observable('');
			this.testingSieveErrorDesc = ko.observable('');
			this.testingSmtpErrorDesc = ko.observable('');

			this.testingImapError.subscribe(function (bValue) {
				if (!bValue)
				{
					this.testingImapErrorDesc('');
				}
			}, this);

			this.testingSieveError.subscribe(function (bValue) {
				if (!bValue)
				{
					this.testingSieveErrorDesc('');
				}
			}, this);

			this.testingSmtpError.subscribe(function (bValue) {
				if (!bValue)
				{
					this.testingSmtpErrorDesc('');
				}
			}, this);

			this.imapServerFocus = ko.observable(false);
			this.sieveServerFocus = ko.observable(false);
			this.smtpServerFocus = ko.observable(false);

			this.name = ko.observable('');
			this.name.focused = ko.observable(false);

			this.imapServer = ko.observable('');
			this.imapPort = ko.observable('' + Consts.Values.ImapDefaulPort);
			this.imapSecure = ko.observable(Enums.ServerSecure.None);
			this.imapShortLogin = ko.observable(false);
			this.useSieve = ko.observable(false);
			this.sieveAllowRaw = ko.observable(false);
			this.sieveServer = ko.observable('');
			this.sievePort = ko.observable('' + Consts.Values.SieveDefaulPort);
			this.sieveSecure = ko.observable(Enums.ServerSecure.None);
			this.smtpServer = ko.observable('');
			this.smtpPort = ko.observable('' + Consts.Values.SmtpDefaulPort);
			this.smtpSecure = ko.observable(Enums.ServerSecure.None);
			this.smtpShortLogin = ko.observable(false);
			this.smtpAuth = ko.observable(true);
			this.smtpPhpMail = ko.observable(false);
			this.whiteList = ko.observable('');

			this.enableSmartPorts = ko.observable(false);

			this.allowSieve = ko.computed(function () {
				return CapaAdminStore.filters() && CapaAdminStore.sieve();
			}, this);

			this.headerText = ko.computed(function () {
				var sName = this.name();
				return this.edit() ? Translator.i18n('POPUPS_DOMAIN/TITLE_EDIT_DOMAIN', {'NAME': sName}) :
					('' === sName ? Translator.i18n('POPUPS_DOMAIN/TITLE_ADD_DOMAIN') :
						Translator.i18n('POPUPS_DOMAIN/TITLE_ADD_DOMAIN_WITH_NAME', {'NAME': sName}));
			}, this);

			this.domainIsComputed = ko.computed(function () {

				var
					bPhpMail = this.smtpPhpMail(),
					bAllowSieve = this.allowSieve(),
					bUseSieve = this.useSieve()
				;

				return '' !== this.name() &&
					'' !== this.imapServer() &&
					'' !== this.imapPort() &&
					(bAllowSieve && bUseSieve ? ('' !== this.sieveServer() && '' !== this.sievePort()) : true) &&
					(('' !== this.smtpServer() && '' !== this.smtpPort()) || bPhpMail);

			}, this);

			this.canBeTested = ko.computed(function () {
				return !this.testing() && this.domainIsComputed();
			}, this);

			this.canBeSaved = ko.computed(function () {
				return !this.saving() && this.domainIsComputed();
			}, this);

			this.createOrAddCommand = Utils.createCommand(this, function () {
				this.saving(true);
				Remote.createOrUpdateDomain(
					_.bind(this.onDomainCreateOrSaveResponse, this),
					!this.edit(),
					this.name(),

					this.imapServer(),
					Utils.pInt(this.imapPort()),
					this.imapSecure(),
					this.imapShortLogin(),

					this.useSieve(),
					this.sieveAllowRaw(),
					this.sieveServer(),
					Utils.pInt(this.sievePort()),
					this.sieveSecure(),

					this.smtpServer(),
					Utils.pInt(this.smtpPort()),
					this.smtpSecure(),
					this.smtpShortLogin(),
					this.smtpAuth(),
					this.smtpPhpMail(),

					this.whiteList()
				);
			}, this.canBeSaved);

			this.testConnectionCommand = Utils.createCommand(this, function () {

				this.page('main');

				this.testingDone(false);
				this.testingImapError(false);
				this.testingSieveError(false);
				this.testingSmtpError(false);
				this.testing(true);

				Remote.testConnectionForDomain(
					_.bind(this.onTestConnectionResponse, this),
					this.name(),

					this.imapServer(),
					Utils.pInt(this.imapPort()),
					this.imapSecure(),

					this.useSieve(),
					this.sieveServer(),
					Utils.pInt(this.sievePort()),
					this.sieveSecure(),

					this.smtpServer(),
					Utils.pInt(this.smtpPort()),
					this.smtpSecure(),
					this.smtpAuth(),
					this.smtpPhpMail()
				);
			}, this.canBeTested);

			this.whiteListCommand = Utils.createCommand(this, function () {
				this.page('white-list');
			});

			this.backCommand = Utils.createCommand(this, function () {
				this.page('main');
			});

			this.sieveCommand = Utils.createCommand(this, function () {
				this.sieveSettings(!this.sieveSettings());
				this.clearTesting();
			});

			this.page.subscribe(function () {
				this.sieveSettings(false);
			}, this);

			// smart form improvements
			this.imapServerFocus.subscribe(function (bValue) {
				if (bValue && '' !== this.name() && '' === this.imapServer())
				{
					this.imapServer(this.name().replace(/[.]?[*][.]?/g, ''));
				}
			}, this);

			this.sieveServerFocus.subscribe(function (bValue) {
				if (bValue && '' !== this.imapServer() && '' === this.sieveServer())
				{
					this.sieveServer(this.imapServer());
				}
			}, this);

			this.smtpServerFocus.subscribe(function (bValue) {
				if (bValue && '' !== this.imapServer() && '' === this.smtpServer())
				{
					this.smtpServer(this.imapServer().replace(/imap/ig, 'smtp'));
				}
			}, this);

			this.imapSecure.subscribe(function (sValue) {
				if (this.enableSmartPorts())
				{
					var iPort = Utils.pInt(this.imapPort());
					sValue = Utils.pString(sValue);
					switch (sValue)
					{
						case '0':
							if (993 === iPort)
							{
								this.imapPort('143');
							}
							break;
						case '1':
							if (143 === iPort)
							{
								this.imapPort('993');
							}
							break;
					}
				}
			}, this);

			this.smtpSecure.subscribe(function (sValue) {
				if (this.enableSmartPorts())
				{
					var iPort = Utils.pInt(this.smtpPort());
					sValue = Utils.pString(sValue);
					switch (sValue)
					{
						case '0':
							if (465 === iPort || 587 === iPort)
							{
								this.smtpPort('25');
							}
							break;
						case '1':
							if (25 === iPort || 587 === iPort)
							{
								this.smtpPort('465');
							}
							break;
						case '2':
							if (25 === iPort || 465 === iPort)
							{
								this.smtpPort('587');
							}
							break;
					}
				}
			}, this);

			kn.constructorEnd(this);
		}

		kn.extendAsViewModel(['View/Popup/Domain', 'PopupsDomainViewModel'], DomainPopupView);
		_.extend(DomainPopupView.prototype, AbstractView.prototype);

		DomainPopupView.prototype.onTestConnectionResponse = function (sResult, oData)
		{
			this.testing(false);
			if (Enums.StorageResultType.Success === sResult && oData.Result)
			{
				var
					bImap = false,
					bSieve = false
				;

				this.testingDone(true);
				this.testingImapError(true !== oData.Result.Imap);
				this.testingSieveError(true !== oData.Result.Sieve);
				this.testingSmtpError(true !== oData.Result.Smtp);

				if (this.testingImapError() && oData.Result.Imap)
				{
					bImap = true;
					this.testingImapErrorDesc('');
					this.testingImapErrorDesc(oData.Result.Imap);
				}

				if (this.testingSieveError() && oData.Result.Sieve)
				{
					bSieve = true;
					this.testingSieveErrorDesc('');
					this.testingSieveErrorDesc(oData.Result.Sieve);
				}

				if (this.testingSmtpError() && oData.Result.Smtp)
				{
					this.testingSmtpErrorDesc('');
					this.testingSmtpErrorDesc(oData.Result.Smtp);
				}

				if (this.sieveSettings())
				{
					if (!bSieve && bImap)
					{
						this.sieveSettings(false);
					}
				}
				else
				{
					if (bSieve && !bImap)
					{
						this.sieveSettings(true);
					}
				}
			}
			else
			{
				this.testingImapError(true);
				this.testingSieveError(true);
				this.testingSmtpError(true);
				this.sieveSettings(false);
			}
		};

		DomainPopupView.prototype.onDomainCreateOrSaveResponse = function (sResult, oData)
		{
			this.saving(false);
			if (Enums.StorageResultType.Success === sResult && oData)
			{
				if (oData.Result)
				{
					__webpack_require__(/*! App/Admin */ 18).reloadDomainList();
					this.closeCommand();
				}
				else if (Enums.Notification.DomainAlreadyExists === oData.ErrorCode)
				{
					this.savingError(Translator.i18n('ERRORS/DOMAIN_ALREADY_EXISTS'));
				}
			}
			else
			{
				this.savingError(Translator.i18n('ERRORS/UNKNOWN_ERROR'));
			}
		};

		DomainPopupView.prototype.clearTesting = function ()
		{
			this.testing(false);
			this.testingDone(false);
			this.testingImapError(false);
			this.testingSieveError(false);
			this.testingSmtpError(false);
		};

		DomainPopupView.prototype.onHide = function ()
		{
			this.page('main');
			this.sieveSettings(false);
		};


		DomainPopupView.prototype.onShow = function (oDomain)
		{
			this.saving(false);

			this.page('main');
			this.sieveSettings(false);

			this.clearTesting();

			this.clearForm();
			if (oDomain)
			{
				this.enableSmartPorts(false);

				this.edit(true);

				this.name(Utils.trim(oDomain.Name));
				this.imapServer(Utils.trim(oDomain.IncHost));
				this.imapPort('' + Utils.pInt(oDomain.IncPort));
				this.imapSecure(Utils.trim(oDomain.IncSecure));
				this.imapShortLogin(!!oDomain.IncShortLogin);
				this.useSieve(!!oDomain.UseSieve);
				this.sieveAllowRaw(!!oDomain.SieveAllowRaw);
				this.sieveServer(Utils.trim(oDomain.SieveHost));
				this.sievePort('' + Utils.pInt(oDomain.SievePort));
				this.sieveSecure(Utils.trim(oDomain.SieveSecure));
				this.smtpServer(Utils.trim(oDomain.OutHost));
				this.smtpPort('' + Utils.pInt(oDomain.OutPort));
				this.smtpSecure(Utils.trim(oDomain.OutSecure));
				this.smtpShortLogin(!!oDomain.OutShortLogin);
				this.smtpAuth(!!oDomain.OutAuth);
				this.smtpPhpMail(!!oDomain.OutUsePhpMail);
				this.whiteList(Utils.trim(oDomain.WhiteList));

				this.enableSmartPorts(true);
			}
		};

		DomainPopupView.prototype.onShowWithDelay = function ()
		{
			if ('' === this.name() && !Globals.bMobile)
			{
				this.name.focused(true);
			}
		};

		DomainPopupView.prototype.clearForm = function ()
		{
			this.edit(false);

			this.page('main');
			this.sieveSettings(false);

			this.enableSmartPorts(false);

			this.savingError('');

			this.name('');
			this.name.focused(false);

			this.imapServer('');
			this.imapPort('' + Consts.Values.ImapDefaulPort);
			this.imapSecure(Enums.ServerSecure.None);
			this.imapShortLogin(false);

			this.useSieve(false);
			this.sieveAllowRaw(false);
			this.sieveServer('');
			this.sievePort('' + Consts.Values.SieveDefaulPort);
			this.sieveSecure(Enums.ServerSecure.None);

			this.smtpServer('');
			this.smtpPort('' + Consts.Values.SmtpDefaulPort);
			this.smtpSecure(Enums.ServerSecure.None);
			this.smtpShortLogin(false);
			this.smtpAuth(true);
			this.smtpPhpMail(false);

			this.whiteList('');
			this.enableSmartPorts(true);
		};

		module.exports = DomainPopupView;

	}());

/***/ },
/* 97 */,
/* 98 */,
/* 99 */,
/* 100 */,
/* 101 */,
/* 102 */,
/* 103 */,
/* 104 */,
/* 105 */,
/* 106 */,
/* 107 */,
/* 108 */,
/* 109 */,
/* 110 */,
/* 111 */,
/* 112 */,
/* 113 */,
/* 114 */,
/* 115 */,
/* 116 */,
/* 117 */,
/* 118 */,
/* 119 */
/*!***********************************!*\
  !*** ./dev/Screen/Admin/Login.js ***!
  \***********************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),

			AbstractScreen = __webpack_require__(/*! Knoin/AbstractScreen */ 37)
		;

		/**
		 * @constructor
		 * @extends AbstractScreen
		 */
		function LoginAdminScreen()
		{
			AbstractScreen.call(this, 'login', [
				__webpack_require__(/*! View/Admin/Login */ 147)
			]);
		}

		_.extend(LoginAdminScreen.prototype, AbstractScreen.prototype);

		LoginAdminScreen.prototype.onShow = function ()
		{
			__webpack_require__(/*! App/Admin */ 18).setWindowTitle('');
		};

		module.exports = LoginAdminScreen;

	}());

/***/ },
/* 120 */
/*!**************************************!*\
  !*** ./dev/Screen/Admin/Settings.js ***!
  \**************************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),

			kn = __webpack_require__(/*! Knoin/Knoin */ 5),

			Plugins = __webpack_require__(/*! Common/Plugins */ 20),

			AbstractSettings = __webpack_require__(/*! Screen/AbstractSettings */ 68)
		;

		/**
		 * @constructor
		 * @extends AbstractSettings
		 */
		function SettingsAdminScreen()
		{
			AbstractSettings.call(this, [
				__webpack_require__(/*! View/Admin/Settings/Menu */ 148),
				__webpack_require__(/*! View/Admin/Settings/Pane */ 149)
			]);
		}

		_.extend(SettingsAdminScreen.prototype, AbstractSettings.prototype);

		/**
		 * @param {Function=} fCallback
		 */
		SettingsAdminScreen.prototype.setupSettings = function (fCallback)
		{
			kn.addSettingsViewModel(__webpack_require__(/*! Settings/Admin/General */ 128),
				'AdminSettingsGeneral', 'TABS_LABELS/LABEL_GENERAL_NAME', 'general', true);

			kn.addSettingsViewModel(__webpack_require__(/*! Settings/Admin/Login */ 129),
				'AdminSettingsLogin', 'TABS_LABELS/LABEL_LOGIN_NAME', 'login');

			if (false)
			{
				kn.addSettingsViewModel(require('Settings/Admin/Branding'),
					'AdminSettingsBranding', 'TABS_LABELS/LABEL_BRANDING_NAME', 'branding');
			}
			else
			{
				kn.addSettingsViewModel(__webpack_require__(/*! Settings/Admin/Prem/Branding */ 132),
					'AdminSettingsBranding', 'TABS_LABELS/LABEL_BRANDING_NAME', 'branding');
			}

			kn.addSettingsViewModel(__webpack_require__(/*! Settings/Admin/Contacts */ 126),
				'AdminSettingsContacts', 'TABS_LABELS/LABEL_CONTACTS_NAME', 'contacts');

			kn.addSettingsViewModel(__webpack_require__(/*! Settings/Admin/Domains */ 127),
				'AdminSettingsDomains', 'TABS_LABELS/LABEL_DOMAINS_NAME', 'domains');

			kn.addSettingsViewModel(__webpack_require__(/*! Settings/Admin/Security */ 134),
				'AdminSettingsSecurity', 'TABS_LABELS/LABEL_SECURITY_NAME', 'security');

			kn.addSettingsViewModel(__webpack_require__(/*! Settings/Admin/Social */ 135),
				'AdminSettingsSocial', 'TABS_LABELS/LABEL_INTEGRATION_NAME', 'integrations');

			kn.addSettingsViewModel(__webpack_require__(/*! Settings/Admin/Plugins */ 131),
				'AdminSettingsPlugins', 'TABS_LABELS/LABEL_PLUGINS_NAME', 'plugins');

			kn.addSettingsViewModel(__webpack_require__(/*! Settings/Admin/Packages */ 130),
				'AdminSettingsPackages', 'TABS_LABELS/LABEL_PACKAGES_NAME', 'packages');

			if (true)
			{
				kn.addSettingsViewModel(__webpack_require__(/*! Settings/Admin/Prem/Licensing */ 133),
					'AdminSettingsLicensing', 'TABS_LABELS/LABEL_LICENSING_NAME', 'licensing');
			}

			kn.addSettingsViewModel(__webpack_require__(/*! Settings/Admin/About */ 124),
				'AdminSettingsAbout', 'TABS_LABELS/LABEL_ABOUT_NAME', 'about');

			Plugins.runSettingsViewModelHooks(true);

			if (fCallback)
			{
				fCallback();
			}
		};

		SettingsAdminScreen.prototype.onShow = function ()
		{
			__webpack_require__(/*! App/Admin */ 18).setWindowTitle('');
		};

		module.exports = SettingsAdminScreen;

	}());

/***/ },
/* 121 */,
/* 122 */,
/* 123 */,
/* 124 */
/*!*************************************!*\
  !*** ./dev/Settings/Admin/About.js ***!
  \*************************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			ko = __webpack_require__(/*! ko */ 3),

			Translator = __webpack_require__(/*! Common/Translator */ 6),

			Settings = __webpack_require__(/*! Storage/Settings */ 9),
			CoreStore = __webpack_require__(/*! Stores/Admin/Core */ 91),
			AppStore = __webpack_require__(/*! Stores/Admin/App */ 33)
		;

		/**
		 * @constructor
		 */
		function AboutAdminSettings()
		{
			this.version = ko.observable(Settings.settingsGet('Version'));
			this.access = ko.observable(!!Settings.settingsGet('CoreAccess'));
			this.errorDesc = ko.observable('');

			this.coreReal = CoreStore.coreReal;
			this.coreChannel = CoreStore.coreChannel;
			this.coreType = CoreStore.coreType;
			this.coreUpdatable = CoreStore.coreUpdatable;
			this.coreAccess = CoreStore.coreAccess;
			this.coreChecking = CoreStore.coreChecking;
			this.coreUpdating = CoreStore.coreUpdating;
			this.coreWarning = CoreStore.coreWarning;
			this.coreVersion = CoreStore.coreVersion;
			this.coreRemoteVersion = CoreStore.coreRemoteVersion;
			this.coreRemoteRelease = CoreStore.coreRemoteRelease;
			this.coreVersionCompare = CoreStore.coreVersionCompare;

			this.community = (false) || AppStore.community();

			this.coreRemoteVersionHtmlDesc = ko.computed(function () {
				Translator.trigger();
				return Translator.i18n('TAB_ABOUT/HTML_NEW_VERSION', {'VERSION': this.coreRemoteVersion()});
			}, this);

			this.statusType = ko.computed(function () {

				var
					sType = '',
					iVersionCompare = this.coreVersionCompare(),
					bChecking = this.coreChecking(),
					bUpdating = this.coreUpdating(),
					bReal = this.coreReal()
				;

				if (bChecking)
				{
					sType = 'checking';
				}
				else if (bUpdating)
				{
					sType = 'updating';
				}
				else if (bReal && 0 === iVersionCompare)
				{
					sType = 'up-to-date';
				}
				else if (bReal && -1 === iVersionCompare)
				{
					sType = 'available';
				}
				else if (!bReal)
				{
					sType = 'error';
					this.errorDesc('Cannot access the repository at the moment.');
				}

				return sType;

			}, this);
		}

		AboutAdminSettings.prototype.onBuild = function ()
		{
			if (this.access() && !this.community)
			{
				__webpack_require__(/*! App/Admin */ 18).reloadCoreData();
			}
		};

		AboutAdminSettings.prototype.updateCoreData = function ()
		{
			if (!this.coreUpdating() && !this.community)
			{
				__webpack_require__(/*! App/Admin */ 18).updateCoreData();
			}
		};

		module.exports = AboutAdminSettings;

	}());

/***/ },
/* 125 */
/*!****************************************!*\
  !*** ./dev/Settings/Admin/Branding.js ***!
  \****************************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),
			ko = __webpack_require__(/*! ko */ 3),

			Utils = __webpack_require__(/*! Common/Utils */ 1),
			Translator = __webpack_require__(/*! Common/Translator */ 6)
		;

		/**
		 * @constructor
		 */
		function BrandingAdminSettings()
		{
			var
				Enums = __webpack_require__(/*! Common/Enums */ 4),
				Settings = __webpack_require__(/*! Storage/Settings */ 9),
				AppStore = __webpack_require__(/*! Stores/Admin/App */ 33)
			;

			this.capa = AppStore.prem;

			this.title = ko.observable(Settings.settingsGet('Title'));
			this.title.trigger = ko.observable(Enums.SaveSettingsStep.Idle);

			this.loadingDesc = ko.observable(Settings.settingsGet('LoadingDescription'));
			this.loadingDesc.trigger = ko.observable(Enums.SaveSettingsStep.Idle);

			this.faviconUrl = ko.observable(Settings.settingsGet('FaviconUrl'));
			this.faviconUrl.trigger = ko.observable(Enums.SaveSettingsStep.Idle);

			this.loginLogo = ko.observable(Settings.settingsGet('LoginLogo') || '');
			this.loginLogo.trigger = ko.observable(Enums.SaveSettingsStep.Idle);

			this.loginBackground = ko.observable(Settings.settingsGet('LoginBackground') || '');
			this.loginBackground.trigger = ko.observable(Enums.SaveSettingsStep.Idle);

			this.userLogo = ko.observable(Settings.settingsGet('UserLogo') || '');
			this.userLogo.trigger = ko.observable(Enums.SaveSettingsStep.Idle);

			this.userLogoMessage = ko.observable(Settings.settingsGet('UserLogoMessage') || '');
			this.userLogoMessage.trigger = ko.observable(Enums.SaveSettingsStep.Idle);

			this.userIframeMessage = ko.observable(Settings.settingsGet('UserIframeMessage') || '');
			this.userIframeMessage.trigger = ko.observable(Enums.SaveSettingsStep.Idle);

			this.userLogoTitle = ko.observable(Settings.settingsGet('UserLogoTitle') || '');
			this.userLogoTitle.trigger = ko.observable(Enums.SaveSettingsStep.Idle);

			this.loginDescription = ko.observable(Settings.settingsGet('LoginDescription'));
			this.loginDescription.trigger = ko.observable(Enums.SaveSettingsStep.Idle);

			this.loginCss = ko.observable(Settings.settingsGet('LoginCss'));
			this.loginCss.trigger = ko.observable(Enums.SaveSettingsStep.Idle);

			this.userCss = ko.observable(Settings.settingsGet('UserCss'));
			this.userCss.trigger = ko.observable(Enums.SaveSettingsStep.Idle);

			this.welcomePageUrl = ko.observable(Settings.settingsGet('WelcomePageUrl'));
			this.welcomePageUrl.trigger = ko.observable(Enums.SaveSettingsStep.Idle);

			this.welcomePageDisplay = ko.observable(Settings.settingsGet('WelcomePageDisplay'));
			this.welcomePageDisplay.trigger = ko.observable(Enums.SaveSettingsStep.Idle);

			this.welcomePageDisplay.options = ko.computed(function () {
				Translator.trigger();
				return [
					{'optValue': 'none', 'optText': Translator.i18n('TAB_BRANDING/OPTION_WELCOME_PAGE_DISPLAY_NONE')},
					{'optValue': 'once', 'optText': Translator.i18n('TAB_BRANDING/OPTION_WELCOME_PAGE_DISPLAY_ONCE')},
					{'optValue': 'always', 'optText': Translator.i18n('TAB_BRANDING/OPTION_WELCOME_PAGE_DISPLAY_ALWAYS')}
				];
			});

			this.loginPowered = ko.observable(!!Settings.settingsGet('LoginPowered'));

			this.community = (false) || AppStore.community();
		}

		BrandingAdminSettings.prototype.onBuild = function ()
		{
			var
				self = this,
				Remote = __webpack_require__(/*! Remote/Admin/Ajax */ 17)
			;

			_.delay(function () {

				var
					f1 = Utils.settingsSaveHelperSimpleFunction(self.title.trigger, self),
					f2 = Utils.settingsSaveHelperSimpleFunction(self.loadingDesc.trigger, self),
					f3 = Utils.settingsSaveHelperSimpleFunction(self.faviconUrl.trigger, self)
				;

				self.title.subscribe(function (sValue) {
					Remote.saveAdminConfig(f1, {
						'Title': Utils.trim(sValue)
					});
				});

				self.loadingDesc.subscribe(function (sValue) {
					Remote.saveAdminConfig(f2, {
						'LoadingDescription': Utils.trim(sValue)
					});
				});

				self.faviconUrl.subscribe(function (sValue) {
					Remote.saveAdminConfig(f3, {
						'FaviconUrl': Utils.trim(sValue)
					});
				});

			}, 50);
		};

		module.exports = BrandingAdminSettings;

	}());

/***/ },
/* 126 */
/*!****************************************!*\
  !*** ./dev/Settings/Admin/Contacts.js ***!
  \****************************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),
			ko = __webpack_require__(/*! ko */ 3),

			Enums = __webpack_require__(/*! Common/Enums */ 4),
			Utils = __webpack_require__(/*! Common/Utils */ 1),

			Translator = __webpack_require__(/*! Common/Translator */ 6),

			Settings = __webpack_require__(/*! Storage/Settings */ 9)
		;

		/**
		 * @constructor
		 */
		function ContactsAdminSettings()
		{
			var
				Remote = __webpack_require__(/*! Remote/Admin/Ajax */ 17)
			;

			this.defautOptionsAfterRender = Utils.defautOptionsAfterRender;
			this.enableContacts = ko.observable(!!Settings.settingsGet('ContactsEnable'));
			this.contactsSharing = ko.observable(!!Settings.settingsGet('ContactsSharing'));
			this.contactsSync = ko.observable(!!Settings.settingsGet('ContactsSync'));

			var
				aTypes = ['sqlite', 'mysql', 'pgsql'],
				aSupportedTypes = [],
				getTypeName = function(sName) {
					switch (sName)
					{
						case 'sqlite':
							sName = 'SQLite';
							break;
						case 'mysql':
							sName = 'MySQL';
							break;
						case 'pgsql':
							sName = 'PostgreSQL';
							break;
					}

					return sName;
				}
			;

			if (!!Settings.settingsGet('SQLiteIsSupported'))
			{
				aSupportedTypes.push('sqlite');
			}
			if (!!Settings.settingsGet('MySqlIsSupported'))
			{
				aSupportedTypes.push('mysql');
			}
			if (!!Settings.settingsGet('PostgreSqlIsSupported'))
			{
				aSupportedTypes.push('pgsql');
			}

			this.contactsSupported = 0 < aSupportedTypes.length;

			this.contactsTypes = ko.observableArray([]);
			this.contactsTypesOptions = this.contactsTypes.map(function (sValue) {
				var bDisabled = -1 === Utils.inArray(sValue, aSupportedTypes);
				return {
					'id': sValue,
					'name': getTypeName(sValue) + (bDisabled ? ' (' + Translator.i18n('HINTS/NOT_SUPPORTED') + ')' : ''),
					'disabled': bDisabled
				};
			});

			this.contactsTypes(aTypes);
			this.contactsType = ko.observable('');

			this.mainContactsType = ko.computed({
				'owner': this,
				'read': this.contactsType,
				'write': function (sValue) {
					if (sValue !== this.contactsType())
					{
						if (-1 < Utils.inArray(sValue, aSupportedTypes))
						{
							this.contactsType(sValue);
						}
						else if (0 < aSupportedTypes.length)
						{
							this.contactsType('');
						}
					}
					else
					{
						this.contactsType.valueHasMutated();
					}
				}
			}).extend({'notify': 'always'});

			this.contactsType.subscribe(function () {
				this.testContactsSuccess(false);
				this.testContactsError(false);
				this.testContactsErrorMessage('');
			}, this);

			this.pdoDsn = ko.observable(Settings.settingsGet('ContactsPdoDsn'));
			this.pdoUser = ko.observable(Settings.settingsGet('ContactsPdoUser'));
			this.pdoPassword = ko.observable(Settings.settingsGet('ContactsPdoPassword'));

			this.pdoDsnTrigger = ko.observable(Enums.SaveSettingsStep.Idle);
			this.pdoUserTrigger = ko.observable(Enums.SaveSettingsStep.Idle);
			this.pdoPasswordTrigger = ko.observable(Enums.SaveSettingsStep.Idle);
			this.contactsTypeTrigger = ko.observable(Enums.SaveSettingsStep.Idle);

			this.testing = ko.observable(false);
			this.testContactsSuccess = ko.observable(false);
			this.testContactsError = ko.observable(false);
			this.testContactsErrorMessage = ko.observable('');

			this.testContactsCommand = Utils.createCommand(this, function () {

				this.testContactsSuccess(false);
				this.testContactsError(false);
				this.testContactsErrorMessage('');
				this.testing(true);

				Remote.testContacts(this.onTestContactsResponse, {
					'ContactsPdoType': this.contactsType(),
					'ContactsPdoDsn': this.pdoDsn(),
					'ContactsPdoUser': this.pdoUser(),
					'ContactsPdoPassword': this.pdoPassword()
				});

			}, function () {
				return '' !== this.pdoDsn() && '' !== this.pdoUser();
			});

			this.contactsType(Settings.settingsGet('ContactsPdoType'));

			this.onTestContactsResponse = _.bind(this.onTestContactsResponse, this);
		}

		ContactsAdminSettings.prototype.onTestContactsResponse = function (sResult, oData)
		{
			this.testContactsSuccess(false);
			this.testContactsError(false);
			this.testContactsErrorMessage('');

			if (Enums.StorageResultType.Success === sResult && oData && oData.Result && oData.Result.Result)
			{
				this.testContactsSuccess(true);
			}
			else
			{
				this.testContactsError(true);
				if (oData && oData.Result)
				{
					this.testContactsErrorMessage(oData.Result.Message || '');
				}
				else
				{
					this.testContactsErrorMessage('');
				}
			}

			this.testing(false);
		};

		ContactsAdminSettings.prototype.onShow = function ()
		{
			this.testContactsSuccess(false);
			this.testContactsError(false);
			this.testContactsErrorMessage('');
		};

		ContactsAdminSettings.prototype.onBuild = function ()
		{
			var
				self = this,
				Remote = __webpack_require__(/*! Remote/Admin/Ajax */ 17)
			;

			_.delay(function () {

				var
					f1 = Utils.settingsSaveHelperSimpleFunction(self.pdoDsnTrigger, self),
					f3 = Utils.settingsSaveHelperSimpleFunction(self.pdoUserTrigger, self),
					f4 = Utils.settingsSaveHelperSimpleFunction(self.pdoPasswordTrigger, self),
					f5 = Utils.settingsSaveHelperSimpleFunction(self.contactsTypeTrigger, self)
				;

				self.enableContacts.subscribe(function (bValue) {
					Remote.saveAdminConfig(null, {
						'ContactsEnable': bValue ? '1' : '0'
					});
				});

				self.contactsSharing.subscribe(function (bValue) {
					Remote.saveAdminConfig(null, {
						'ContactsSharing': bValue ? '1' : '0'
					});
				});

				self.contactsSync.subscribe(function (bValue) {
					Remote.saveAdminConfig(null, {
						'ContactsSync': bValue ? '1' : '0'
					});
				});

				self.contactsType.subscribe(function (sValue) {
					Remote.saveAdminConfig(f5, {
						'ContactsPdoType': sValue
					});
				});

				self.pdoDsn.subscribe(function (sValue) {
					Remote.saveAdminConfig(f1, {
						'ContactsPdoDsn': Utils.trim(sValue)
					});
				});

				self.pdoUser.subscribe(function (sValue) {
					Remote.saveAdminConfig(f3, {
						'ContactsPdoUser': Utils.trim(sValue)
					});
				});

				self.pdoPassword.subscribe(function (sValue) {
					Remote.saveAdminConfig(f4, {
						'ContactsPdoPassword': Utils.trim(sValue)
					});
				});

				self.contactsType(Settings.settingsGet('ContactsPdoType'));

			}, 50);
		};

		module.exports = ContactsAdminSettings;

	}());

/***/ },
/* 127 */
/*!***************************************!*\
  !*** ./dev/Settings/Admin/Domains.js ***!
  \***************************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),
			ko = __webpack_require__(/*! ko */ 3),

			Enums = __webpack_require__(/*! Common/Enums */ 4),

			DomainStore = __webpack_require__(/*! Stores/Admin/Domain */ 69),
			Remote = __webpack_require__(/*! Remote/Admin/Ajax */ 17)
		;

		/**
		 * @constructor
		 */
		function DomainsAdminSettings()
		{
			this.domains = DomainStore.domains;

			this.visibility = ko.computed(function () {
				return this.domains.loading() ? 'visible' : 'hidden';
			}, this);

			this.domainForDeletion = ko.observable(null).deleteAccessHelper();
		}

		DomainsAdminSettings.prototype.createDomain = function ()
		{
			__webpack_require__(/*! Knoin/Knoin */ 5).showScreenPopup(__webpack_require__(/*! View/Popup/Domain */ 96));
		};

		DomainsAdminSettings.prototype.deleteDomain = function (oDomain)
		{
			this.domains.remove(oDomain);
			Remote.domainDelete(_.bind(this.onDomainListChangeRequest, this), oDomain.name);
		};

		DomainsAdminSettings.prototype.disableDomain = function (oDomain)
		{
			oDomain.disabled(!oDomain.disabled());
			Remote.domainDisable(_.bind(this.onDomainListChangeRequest, this), oDomain.name, oDomain.disabled());
		};

		DomainsAdminSettings.prototype.onBuild = function (oDom)
		{
			var self = this;
			oDom
				.on('click', '.b-admin-domains-list-table .e-item .e-action', function () {
					var oDomainItem = ko.dataFor(this);
					if (oDomainItem)
					{
						Remote.domain(_.bind(self.onDomainLoadRequest, self), oDomainItem.name);
					}
				})
			;

			__webpack_require__(/*! App/Admin */ 18).reloadDomainList();
		};

		DomainsAdminSettings.prototype.onDomainLoadRequest = function (sResult, oData)
		{
			if (Enums.StorageResultType.Success === sResult && oData && oData.Result)
			{
				__webpack_require__(/*! Knoin/Knoin */ 5).showScreenPopup(__webpack_require__(/*! View/Popup/Domain */ 96), [oData.Result]);
			}
		};

		DomainsAdminSettings.prototype.onDomainListChangeRequest = function ()
		{
			__webpack_require__(/*! App/Admin */ 18).reloadDomainList();
		};

		module.exports = DomainsAdminSettings;

	}());

/***/ },
/* 128 */
/*!***************************************!*\
  !*** ./dev/Settings/Admin/General.js ***!
  \***************************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),
			ko = __webpack_require__(/*! ko */ 3),

			Enums = __webpack_require__(/*! Common/Enums */ 4),
			Utils = __webpack_require__(/*! Common/Utils */ 1),
			Links = __webpack_require__(/*! Common/Links */ 13),
			Translator = __webpack_require__(/*! Common/Translator */ 6),

			ThemeStore = __webpack_require__(/*! Stores/Theme */ 44),
			LanguageStore = __webpack_require__(/*! Stores/Language */ 38),
			AppAdminStore = __webpack_require__(/*! Stores/Admin/App */ 33),
			CapaAdminStore = __webpack_require__(/*! Stores/Admin/Capa */ 48),

			Settings = __webpack_require__(/*! Storage/Settings */ 9)
		;

		/**
		 * @constructor
		 */
		function GeneralAdminSettings()
		{
			this.language = LanguageStore.language;
			this.languages = LanguageStore.languages;
			this.languageAdmin = LanguageStore.languageAdmin;
			this.languagesAdmin = LanguageStore.languagesAdmin;

			this.theme = ThemeStore.theme;
			this.themes = ThemeStore.themes;

			this.capaThemes = CapaAdminStore.themes;
			this.capaUserBackground = CapaAdminStore.userBackground;
			this.capaGravatar = CapaAdminStore.gravatar;
			this.capaAdditionalAccounts = CapaAdminStore.additionalAccounts;
			this.capaIdentities = CapaAdminStore.identities;
			this.capaAttachmentThumbnails = CapaAdminStore.attachmentThumbnails;
			this.capaTemplates = CapaAdminStore.templates;

			this.allowLanguagesOnSettings = AppAdminStore.allowLanguagesOnSettings;
			this.weakPassword = AppAdminStore.weakPassword;

			this.mainAttachmentLimit = ko.observable(Utils.pInt(Settings.settingsGet('AttachmentLimit')) / (1024 * 1024)).extend({'posInterer': 25});
			this.uploadData = Settings.settingsGet('PhpUploadSizes');
			this.uploadDataDesc = this.uploadData && (this.uploadData['upload_max_filesize'] || this.uploadData['post_max_size']) ? [
				this.uploadData['upload_max_filesize'] ? 'upload_max_filesize = ' + this.uploadData['upload_max_filesize'] + '; ' : '',
				this.uploadData['post_max_size'] ? 'post_max_size = ' + this.uploadData['post_max_size'] : ''
			].join('') : '';

			this.themesOptions = ko.computed(function () {
				return _.map(this.themes(), function (sTheme) {
					return {
						'optValue': sTheme,
						'optText': Utils.convertThemeName(sTheme)
					};
				});
			}, this);

			this.languageFullName = ko.computed(function () {
				return Utils.convertLangName(this.language());
			}, this);

			this.languageAdminFullName = ko.computed(function () {
				return Utils.convertLangName(this.languageAdmin());
			}, this);

			this.attachmentLimitTrigger = ko.observable(Enums.SaveSettingsStep.Idle);
			this.languageTrigger = ko.observable(Enums.SaveSettingsStep.Idle);
			this.languageAdminTrigger = ko.observable(Enums.SaveSettingsStep.Idle).extend({'throttle': 100});
			this.themeTrigger = ko.observable(Enums.SaveSettingsStep.Idle);
		}

		GeneralAdminSettings.prototype.onBuild = function ()
		{
			var
				self = this,
				Remote = __webpack_require__(/*! Remote/Admin/Ajax */ 17)
			;

			_.delay(function () {

				var
					f1 = Utils.settingsSaveHelperSimpleFunction(self.attachmentLimitTrigger, self),
					f2 = Utils.settingsSaveHelperSimpleFunction(self.languageTrigger, self),
					f3 = Utils.settingsSaveHelperSimpleFunction(self.themeTrigger, self),
					fReloadLanguageHelper = function (iSaveSettingsStep) {
						return function() {
							self.languageAdminTrigger(iSaveSettingsStep);
							_.delay(function () {
								self.languageAdminTrigger(Enums.SaveSettingsStep.Idle);
							}, 1000);
						};
					}
				;

				self.mainAttachmentLimit.subscribe(function (sValue) {
					Remote.saveAdminConfig(f1, {
						'AttachmentLimit': Utils.pInt(sValue)
					});
				});

				self.language.subscribe(function (sValue) {
					Remote.saveAdminConfig(f2, {
						'Language': Utils.trim(sValue)
					});
				});

				self.languageAdmin.subscribe(function (sValue) {

					self.languageAdminTrigger(Enums.SaveSettingsStep.Animate);

					Translator.reload(true, sValue,
						fReloadLanguageHelper(Enums.SaveSettingsStep.TrueResult),
						fReloadLanguageHelper(Enums.SaveSettingsStep.FalseResult));

					Remote.saveAdminConfig(null, {
						'LanguageAdmin': Utils.trim(sValue)
					});
				});

				self.theme.subscribe(function (sValue) {

					Utils.changeTheme(sValue, self.themeTrigger);

					Remote.saveAdminConfig(f3, {
						'Theme': Utils.trim(sValue)
					});
				});

				self.capaAdditionalAccounts.subscribe(function (bValue) {
					Remote.saveAdminConfig(null, {
						'CapaAdditionalAccounts': bValue ? '1' : '0'
					});
				});

				self.capaIdentities.subscribe(function (bValue) {
					Remote.saveAdminConfig(null, {
						'CapaIdentities': bValue ? '1' : '0'
					});
				});

				self.capaTemplates.subscribe(function (bValue) {
					Remote.saveAdminConfig(null, {
						'CapaTemplates': bValue ? '1' : '0'
					});
				});

				self.capaGravatar.subscribe(function (bValue) {
					Remote.saveAdminConfig(null, {
						'CapaGravatar': bValue ? '1' : '0'
					});
				});

				self.capaAttachmentThumbnails.subscribe(function (bValue) {
					Remote.saveAdminConfig(null, {
						'CapaAttachmentThumbnails': bValue ? '1' : '0'
					});
				});

				self.capaThemes.subscribe(function (bValue) {
					Remote.saveAdminConfig(null, {
						'CapaThemes': bValue ? '1' : '0'
					});
				});

				self.capaUserBackground.subscribe(function (bValue) {
					Remote.saveAdminConfig(null, {
						'CapaUserBackground': bValue ? '1' : '0'
					});
				});

				self.allowLanguagesOnSettings.subscribe(function (bValue) {
					Remote.saveAdminConfig(null, {
						'AllowLanguagesOnSettings': bValue ? '1' : '0'
					});
				});

			}, 50);
		};

		GeneralAdminSettings.prototype.selectLanguage = function ()
		{
			__webpack_require__(/*! Knoin/Knoin */ 5).showScreenPopup(__webpack_require__(/*! View/Popup/Languages */ 46), [
				this.language, this.languages(), LanguageStore.userLanguage()
			]);
		};

		GeneralAdminSettings.prototype.selectLanguageAdmin = function ()
		{
			__webpack_require__(/*! Knoin/Knoin */ 5).showScreenPopup(__webpack_require__(/*! View/Popup/Languages */ 46), [
				this.languageAdmin, this.languagesAdmin(), LanguageStore.userLanguageAdmin()
			]);
		};

		/**
		 * @return {string}
		 */
		GeneralAdminSettings.prototype.phpInfoLink = function ()
		{
			return Links.phpInfo();
		};

		module.exports = GeneralAdminSettings;

	}());

/***/ },
/* 129 */
/*!*************************************!*\
  !*** ./dev/Settings/Admin/Login.js ***!
  \*************************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),
			ko = __webpack_require__(/*! ko */ 3),

			Enums = __webpack_require__(/*! Common/Enums */ 4),
			Utils = __webpack_require__(/*! Common/Utils */ 1),

			AppAdminStore = __webpack_require__(/*! Stores/Admin/App */ 33),

			Settings = __webpack_require__(/*! Storage/Settings */ 9)
		;

		/**
		 * @constructor
		 */
		function LoginAdminSettings()
		{
			this.determineUserLanguage = AppAdminStore.determineUserLanguage;
			this.determineUserDomain = AppAdminStore.determineUserDomain;

			this.defaultDomain = ko.observable(Settings.settingsGet('LoginDefaultDomain'));

			this.allowLanguagesOnLogin = AppAdminStore.allowLanguagesOnLogin;
			this.defaultDomainTrigger = ko.observable(Enums.SaveSettingsStep.Idle);

			this.dummy = ko.observable(false);
		}

		LoginAdminSettings.prototype.onBuild = function ()
		{
			var
				self = this,
				Remote = __webpack_require__(/*! Remote/Admin/Ajax */ 17)
			;

			_.delay(function () {

				var f1 = Utils.settingsSaveHelperSimpleFunction(self.defaultDomainTrigger, self);

				self.determineUserLanguage.subscribe(function (bValue) {
					Remote.saveAdminConfig(null, {
						'DetermineUserLanguage': bValue ? '1' : '0'
					});
				});

				self.determineUserDomain.subscribe(function (bValue) {
					Remote.saveAdminConfig(null, {
						'DetermineUserDomain': bValue ? '1' : '0'
					});
				});

				self.allowLanguagesOnLogin.subscribe(function (bValue) {
					Remote.saveAdminConfig(null, {
						'AllowLanguagesOnLogin': bValue ? '1' : '0'
					});
				});

				self.defaultDomain.subscribe(function (sValue) {
					Remote.saveAdminConfig(f1, {
						'LoginDefaultDomain': Utils.trim(sValue)
					});
				});

			}, 50);
		};

		module.exports = LoginAdminSettings;

	}());

/***/ },
/* 130 */
/*!****************************************!*\
  !*** ./dev/Settings/Admin/Packages.js ***!
  \****************************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			window = __webpack_require__(/*! window */ 10),
			_ = __webpack_require__(/*! _ */ 2),
			ko = __webpack_require__(/*! ko */ 3),

			Enums = __webpack_require__(/*! Common/Enums */ 4),
			Translator = __webpack_require__(/*! Common/Translator */ 6),

			PackageStore = __webpack_require__(/*! Stores/Admin/Package */ 71),
			Remote = __webpack_require__(/*! Remote/Admin/Ajax */ 17)
		;

		/**
		 * @constructor
		 */
		function PackagesAdminSettings()
		{
			this.packagesError = ko.observable('');

			this.packages = PackageStore.packages;
			this.packagesReal = PackageStore.packagesReal;
			this.packagesMainUpdatable = PackageStore.packagesMainUpdatable;

			this.packagesCurrent = this.packages.filter(function (oItem) {
				return oItem && '' !== oItem['installed'] && !oItem['compare'];
			});

			this.packagesAvailableForUpdate = this.packages.filter(function (oItem) {
				return oItem && '' !== oItem['installed'] && !!oItem['compare'];
			});

			this.packagesAvailableForInstallation = this.packages.filter(function (oItem) {
				return oItem && '' === oItem['installed'];
			});

			this.visibility = ko.computed(function () {
				return PackageStore.packages.loading() ? 'visible' : 'hidden';
			}, this);
		}

		PackagesAdminSettings.prototype.onShow = function ()
		{
			this.packagesError('');
		};

		PackagesAdminSettings.prototype.onBuild = function ()
		{
			__webpack_require__(/*! App/Admin */ 18).reloadPackagesList();
		};

		PackagesAdminSettings.prototype.requestHelper = function (oPackage, bInstall)
		{
			var self = this;
			return function (sResult, oData) {

				if (Enums.StorageResultType.Success !== sResult || !oData || !oData.Result)
				{
					if (oData && oData.ErrorCode)
					{
						self.packagesError(Translator.getNotification(oData.ErrorCode));
					}
					else
					{
						self.packagesError(Translator.getNotification(
							bInstall ? Enums.Notification.CantInstallPackage : Enums.Notification.CantDeletePackage));
					}
				}

				_.each(self.packages(), function (oItem) {
					if (oItem && oPackage && oItem['loading']() && oPackage['file'] === oItem['file'])
					{
						oPackage['loading'](false);
						oItem['loading'](false);
					}
				});

				if (Enums.StorageResultType.Success === sResult && oData && oData.Result && oData.Result['Reload'])
				{
					window.location.reload();
				}
				else
				{
					__webpack_require__(/*! App/Admin */ 18).reloadPackagesList();
				}
			};
		};

		PackagesAdminSettings.prototype.deletePackage = function (oPackage)
		{
			if (oPackage)
			{
				oPackage['loading'](true);
				Remote.packageDelete(this.requestHelper(oPackage, false), oPackage);
			}
		};

		PackagesAdminSettings.prototype.installPackage = function (oPackage)
		{
			if (oPackage)
			{
				oPackage['loading'](true);
				Remote.packageInstall(this.requestHelper(oPackage, true), oPackage);
			}
		};

		module.exports = PackagesAdminSettings;

	}());

/***/ },
/* 131 */
/*!***************************************!*\
  !*** ./dev/Settings/Admin/Plugins.js ***!
  \***************************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),
			ko = __webpack_require__(/*! ko */ 3),

			Enums = __webpack_require__(/*! Common/Enums */ 4),
			Utils = __webpack_require__(/*! Common/Utils */ 1),
			Translator = __webpack_require__(/*! Common/Translator */ 6),

			Settings = __webpack_require__(/*! Storage/Settings */ 9),

			AppStore = __webpack_require__(/*! Stores/Admin/App */ 33),
			PluginStore = __webpack_require__(/*! Stores/Admin/Plugin */ 72),
			
			Remote = __webpack_require__(/*! Remote/Admin/Ajax */ 17)
		;

		/**
		 * @constructor
		 */
		function PluginsAdminSettings()
		{
			this.enabledPlugins = ko.observable(!!Settings.settingsGet('EnabledPlugins'));

			this.plugins = PluginStore.plugins;
			this.pluginsError = PluginStore.plugins.error;

			this.community = (false) || AppStore.community();

			this.visibility = ko.computed(function () {
				return PluginStore.plugins.loading() ? 'visible' : 'hidden';
			}, this);

			this.onPluginLoadRequest = _.bind(this.onPluginLoadRequest, this);
			this.onPluginDisableRequest = _.bind(this.onPluginDisableRequest, this);
		}

		PluginsAdminSettings.prototype.disablePlugin = function (oPlugin)
		{
			oPlugin.disabled(!oPlugin.disabled());
			Remote.pluginDisable(this.onPluginDisableRequest, oPlugin.name, oPlugin.disabled());
		};

		PluginsAdminSettings.prototype.configurePlugin = function (oPlugin)
		{
			Remote.plugin(this.onPluginLoadRequest, oPlugin.name);
		};

		PluginsAdminSettings.prototype.onBuild = function (oDom)
		{
			var self = this;

			oDom
				.on('click', '.e-item .configure-plugin-action', function () {
					var oPlugin = ko.dataFor(this);
					if (oPlugin)
					{
						self.configurePlugin(oPlugin);
					}
				})
				.on('click', '.e-item .disabled-plugin', function () {
					var oPlugin = ko.dataFor(this);
					if (oPlugin)
					{
						self.disablePlugin(oPlugin);
					}
				})
			;

			this.enabledPlugins.subscribe(function (bValue) {
				Remote.saveAdminConfig(Utils.emptyFunction, {
					'EnabledPlugins': bValue ? '1' : '0'
				});
			});
		};

		PluginsAdminSettings.prototype.onShow = function ()
		{
			PluginStore.plugins.error('');
			__webpack_require__(/*! App/Admin */ 18).reloadPluginList();
		};

		PluginsAdminSettings.prototype.onPluginLoadRequest = function (sResult, oData)
		{
			if (Enums.StorageResultType.Success === sResult && oData && oData.Result)
			{
				__webpack_require__(/*! Knoin/Knoin */ 5).showScreenPopup(__webpack_require__(/*! View/Popup/Plugin */ 156), [oData.Result]);
			}
		};

		PluginsAdminSettings.prototype.onPluginDisableRequest = function (sResult, oData)
		{
			if (Enums.StorageResultType.Success === sResult && oData)
			{
				if (!oData.Result && oData.ErrorCode)
				{
					if (Enums.Notification.UnsupportedPluginPackage === oData.ErrorCode && oData.ErrorMessage && '' !== oData.ErrorMessage)
					{
						PluginStore.plugins.error(oData.ErrorMessage);
					}
					else
					{
						PluginStore.plugins.error(Translator.getNotification(oData.ErrorCode));
					}
				}
			}

			__webpack_require__(/*! App/Admin */ 18).reloadPluginList();
		};

		module.exports = PluginsAdminSettings;

	}());

/***/ },
/* 132 */
/*!*********************************************!*\
  !*** ./dev/Settings/Admin/Prem/Branding.js ***!
  \*********************************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),

			Utils = __webpack_require__(/*! Common/Utils */ 1),

			BrandingAdminSettings = __webpack_require__(/*! Settings/Admin/Branding */ 125)
		;

		/**
		 * @constructor
		 */
		function BrandingPremAdminSettings()
		{
			BrandingAdminSettings.call(this);
		}

		BrandingPremAdminSettings.prototype.onBuild = function (oDom)
		{
			BrandingAdminSettings.prototype.onBuild.call(this, oDom);

			if (this.capa && this.capa() && !this.community)
			{
				var
					self = this,
					Remote = __webpack_require__(/*! Remote/Admin/Ajax */ 17)
				;

				_.delay(function () {

					var
						f1 = Utils.settingsSaveHelperSimpleFunction(self.loginLogo.trigger, self),
						f2 = Utils.settingsSaveHelperSimpleFunction(self.loginDescription.trigger, self),
						f3 = Utils.settingsSaveHelperSimpleFunction(self.loginCss.trigger, self),
						f4 = Utils.settingsSaveHelperSimpleFunction(self.userLogo.trigger, self),
						f5 = Utils.settingsSaveHelperSimpleFunction(self.userLogoTitle.trigger, self),
						f6 = Utils.settingsSaveHelperSimpleFunction(self.loginBackground.trigger, self),
						f7 = Utils.settingsSaveHelperSimpleFunction(self.userCss.trigger, self),
						f8 = Utils.settingsSaveHelperSimpleFunction(self.welcomePageUrl.trigger, self),
						f9 = Utils.settingsSaveHelperSimpleFunction(self.welcomePageDisplay.trigger, self),
						f10 = Utils.settingsSaveHelperSimpleFunction(self.userLogoMessage.trigger, self),
						f11 = Utils.settingsSaveHelperSimpleFunction(self.userIframeMessage.trigger, self)
					;

					self.loginLogo.subscribe(function (sValue) {
						Remote.saveAdminConfig(f1, {
							'LoginLogo': Utils.trim(sValue)
						});
					});

					self.loginDescription.subscribe(function (sValue) {
						Remote.saveAdminConfig(f2, {
							'LoginDescription': Utils.trim(sValue)
						});
					});

					self.loginCss.subscribe(function (sValue) {
						Remote.saveAdminConfig(f3, {
							'LoginCss': Utils.trim(sValue)
						});
					});

					self.userLogo.subscribe(function (sValue) {
						Remote.saveAdminConfig(f4, {
							'UserLogo': Utils.trim(sValue)
						});
					});

					self.userLogoTitle.subscribe(function (sValue) {
						Remote.saveAdminConfig(f5, {
							'UserLogoTitle': Utils.trim(sValue)
						});
					});

					self.userLogoMessage.subscribe(function (sValue) {
						Remote.saveAdminConfig(f10, {
							'UserLogoMessage': Utils.trim(sValue)
						});
					});

					self.userIframeMessage.subscribe(function (sValue) {
						Remote.saveAdminConfig(f11, {
							'UserIframeMessage': Utils.trim(sValue)
						});
					});

					self.loginBackground.subscribe(function (sValue) {
						Remote.saveAdminConfig(f6, {
							'LoginBackground': Utils.trim(sValue)
						});
					});

					self.userCss.subscribe(function (sValue) {
						Remote.saveAdminConfig(f7, {
							'UserCss': Utils.trim(sValue)
						});
					});

					self.welcomePageUrl.subscribe(function (sValue) {
						Remote.saveAdminConfig(f8, {
							'WelcomePageUrl': Utils.trim(sValue)
						});
					});

					self.welcomePageDisplay.subscribe(function (sValue) {
						Remote.saveAdminConfig(f9, {
							'WelcomePageDisplay': Utils.trim(sValue)
						});
					});

					self.loginPowered.subscribe(function (bValue) {
						Remote.saveAdminConfig(null, {
							'LoginPowered': bValue ? '1' : '0'
						});
					});

				}, 50);
			}
		};

		module.exports = BrandingPremAdminSettings;

	}());

/***/ },
/* 133 */
/*!**********************************************!*\
  !*** ./dev/Settings/Admin/Prem/Licensing.js ***!
  \**********************************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			ko = __webpack_require__(/*! ko */ 3),

			Settings = __webpack_require__(/*! Storage/Settings */ 9),
			LicenseStore = __webpack_require__(/*! Stores/Admin/License */ 70)
		;

		/**
		 * @constructor
		 */
		function LicensingPremAdminSettings()
		{
			this.licensing = LicenseStore.licensing;
			this.licensingProcess = LicenseStore.licensingProcess;
			this.licenseValid = LicenseStore.licenseValid;
			this.licenseExpired = LicenseStore.licenseExpired;
			this.licenseError = LicenseStore.licenseError;
			this.licenseTrigger = LicenseStore.licenseTrigger;

			this.adminDomain = ko.observable('');
			this.subscriptionEnabled = ko.observable(!!Settings.settingsGet('SubscriptionEnabled'));

			this.licenseTrigger.subscribe(function () {
				if (this.subscriptionEnabled())
				{
					__webpack_require__(/*! App/Admin */ 18).reloadLicensing(true);
				}
			}, this);
		}

		LicensingPremAdminSettings.prototype.onBuild = function ()
		{
			if (this.subscriptionEnabled())
			{
				__webpack_require__(/*! App/Admin */ 18).reloadLicensing(false);
			}
		};

		LicensingPremAdminSettings.prototype.onShow = function ()
		{
			this.adminDomain(Settings.settingsGet('AdminDomain'));
		};

		LicensingPremAdminSettings.prototype.showActivationForm = function ()
		{
			__webpack_require__(/*! Knoin/Knoin */ 5).showScreenPopup(__webpack_require__(/*! View/Popup/Activate */ 95));
		};

		LicensingPremAdminSettings.prototype.showTrialForm = function ()
		{
			__webpack_require__(/*! Knoin/Knoin */ 5).showScreenPopup(__webpack_require__(/*! View/Popup/Activate */ 95), [true]);
		};

		/**
		 * @return {boolean}
		 */
		LicensingPremAdminSettings.prototype.licenseIsUnlim = function ()
		{
			return 1898625600 === this.licenseExpired() || 1898625700 === this.licenseExpired();
		};

		/**
		 * @return {string}
		 */
		LicensingPremAdminSettings.prototype.licenseExpiredMomentValue = function ()
		{
			var
				moment = __webpack_require__(/*! moment */ 52),
				iTime = this.licenseExpired(),
				oM = moment.unix(iTime)
			;

			return this.licenseIsUnlim() ? 'Never' :
				(iTime && (oM.format('LL') + ' (' + oM.from(moment()) + ')'));
		};

		module.exports = LicensingPremAdminSettings;

	}());

/***/ },
/* 134 */
/*!****************************************!*\
  !*** ./dev/Settings/Admin/Security.js ***!
  \****************************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),
			ko = __webpack_require__(/*! ko */ 3),

			Enums = __webpack_require__(/*! Common/Enums */ 4),
			Utils = __webpack_require__(/*! Common/Utils */ 1),
			Links = __webpack_require__(/*! Common/Links */ 13),

			AppAdminStore = __webpack_require__(/*! Stores/Admin/App */ 33),
			CapaAdminStore = __webpack_require__(/*! Stores/Admin/Capa */ 48),

			Settings = __webpack_require__(/*! Storage/Settings */ 9),
			Remote = __webpack_require__(/*! Remote/Admin/Ajax */ 17)
		;

		/**
		 * @constructor
		 */
		function SecurityAdminSettings()
		{
			this.useLocalProxyForExternalImages = AppAdminStore.useLocalProxyForExternalImages;

			this.weakPassword = AppAdminStore.weakPassword;

			this.capaOpenPGP = CapaAdminStore.openPGP;

			this.capaTwoFactorAuth = CapaAdminStore.twoFactorAuth;
			this.capaTwoFactorAuthForce = CapaAdminStore.twoFactorAuthForce;

			this.capaTwoFactorAuth.subscribe(function (bValue) {
				if (!bValue)
				{
					this.capaTwoFactorAuthForce(false);
				}
			}, this);

			this.verifySslCertificate = ko.observable(!!Settings.settingsGet('VerifySslCertificate'));
			this.allowSelfSigned = ko.observable(!!Settings.settingsGet('AllowSelfSigned'));

			this.verifySslCertificate.subscribe(function (bValue) {
				if (!bValue)
				{
					this.allowSelfSigned(true);
				}
			}, this);

			this.adminLogin = ko.observable(Settings.settingsGet('AdminLogin'));
			this.adminLoginError = ko.observable(false);
			this.adminPassword = ko.observable('');
			this.adminPasswordNew = ko.observable('');
			this.adminPasswordNew2 = ko.observable('');
			this.adminPasswordNewError = ko.observable(false);

			this.adminPasswordUpdateError = ko.observable(false);
			this.adminPasswordUpdateSuccess = ko.observable(false);

			this.adminPassword.subscribe(function () {
				this.adminPasswordUpdateError(false);
				this.adminPasswordUpdateSuccess(false);
			}, this);

			this.adminLogin.subscribe(function () {
				this.adminLoginError(false);
			}, this);

			this.adminPasswordNew.subscribe(function () {
				this.adminPasswordUpdateError(false);
				this.adminPasswordUpdateSuccess(false);
				this.adminPasswordNewError(false);
			}, this);

			this.adminPasswordNew2.subscribe(function () {
				this.adminPasswordUpdateError(false);
				this.adminPasswordUpdateSuccess(false);
				this.adminPasswordNewError(false);
			}, this);

			this.saveNewAdminPasswordCommand = Utils.createCommand(this, function () {

				if ('' === Utils.trim(this.adminLogin()))
				{
					this.adminLoginError(true);
					return false;
				}

				if (this.adminPasswordNew() !== this.adminPasswordNew2())
				{
					this.adminPasswordNewError(true);
					return false;
				}

				this.adminPasswordUpdateError(false);
				this.adminPasswordUpdateSuccess(false);

				Remote.saveNewAdminPassword(this.onNewAdminPasswordResponse, {
					'Login': this.adminLogin(),
					'Password': this.adminPassword(),
					'NewPassword': this.adminPasswordNew()
				});

			}, function () {
				return '' !== Utils.trim(this.adminLogin()) && '' !== this.adminPassword();
			});

			this.onNewAdminPasswordResponse = _.bind(this.onNewAdminPasswordResponse, this);
		}

		SecurityAdminSettings.prototype.onNewAdminPasswordResponse = function (sResult, oData)
		{
			if (Enums.StorageResultType.Success === sResult && oData && oData.Result)
			{
				this.adminPassword('');
				this.adminPasswordNew('');
				this.adminPasswordNew2('');

				this.adminPasswordUpdateSuccess(true);

				this.weakPassword(!!oData.Result.Weak);
			}
			else
			{
				this.adminPasswordUpdateError(true);
			}
		};

		SecurityAdminSettings.prototype.onBuild = function ()
		{
			this.capaOpenPGP.subscribe(function (bValue) {
				Remote.saveAdminConfig(Utils.emptyFunction, {
					'CapaOpenPGP': bValue ? '1' : '0'
				});
			});

			this.capaTwoFactorAuth.subscribe(function (bValue) {
				Remote.saveAdminConfig(Utils.emptyFunction, {
					'CapaTwoFactorAuth': bValue ? '1' : '0'
				});
			});

			this.capaTwoFactorAuthForce.subscribe(function (bValue) {
				Remote.saveAdminConfig(Utils.emptyFunction, {
					'CapaTwoFactorAuthForce': bValue ? '1' : '0'
				});
			});

			this.useLocalProxyForExternalImages.subscribe(function (bValue) {
				Remote.saveAdminConfig(null, {
					'UseLocalProxyForExternalImages': bValue ? '1' : '0'
				});
			});

			this.verifySslCertificate.subscribe(function (bValue) {
				Remote.saveAdminConfig(null, {
					'VerifySslCertificate': bValue ? '1' : '0'
				});
			});

			this.allowSelfSigned.subscribe(function (bValue) {
				Remote.saveAdminConfig(null, {
					'AllowSelfSigned': bValue ? '1' : '0'
				});
			});
		};

		SecurityAdminSettings.prototype.onHide = function ()
		{
			this.adminPassword('');
			this.adminPasswordNew('');
			this.adminPasswordNew2('');
		};

		/**
		 * @return {string}
		 */
		SecurityAdminSettings.prototype.phpInfoLink = function ()
		{
			return Links.phpInfo();
		};

		module.exports = SecurityAdminSettings;

	}());


/***/ },
/* 135 */
/*!**************************************!*\
  !*** ./dev/Settings/Admin/Social.js ***!
  \**************************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),
			ko = __webpack_require__(/*! ko */ 3),

			Enums = __webpack_require__(/*! Common/Enums */ 4),
			Utils = __webpack_require__(/*! Common/Utils */ 1)
		;

		/**
		 * @constructor
		 */
		function SocialAdminSettings()
		{
			var SocialStore = __webpack_require__(/*! Stores/Social */ 34);

			this.googleEnable = SocialStore.google.enabled;
			this.googleEnableAuth = SocialStore.google.capa.auth;
			this.googleEnableAuthFast = SocialStore.google.capa.authFast;
			this.googleEnableDrive = SocialStore.google.capa.drive;
			this.googleEnablePreview = SocialStore.google.capa.preview;

			this.googleEnableRequireClientSettings = SocialStore.google.require.clientSettings;
			this.googleEnableRequireApiKey = SocialStore.google.require.apiKeySettings;

			this.googleClientID = SocialStore.google.clientID;
			this.googleClientSecret = SocialStore.google.clientSecret;
			this.googleApiKey = SocialStore.google.apiKey;

			this.googleTrigger1 = ko.observable(Enums.SaveSettingsStep.Idle);
			this.googleTrigger2 = ko.observable(Enums.SaveSettingsStep.Idle);
			this.googleTrigger3 = ko.observable(Enums.SaveSettingsStep.Idle);

			this.facebookSupported = SocialStore.facebook.supported;
			this.facebookEnable = SocialStore.facebook.enabled;
			this.facebookAppID = SocialStore.facebook.appID;
			this.facebookAppSecret = SocialStore.facebook.appSecret;

			this.facebookTrigger1 = ko.observable(Enums.SaveSettingsStep.Idle);
			this.facebookTrigger2 = ko.observable(Enums.SaveSettingsStep.Idle);

			this.twitterEnable = SocialStore.twitter.enabled;
			this.twitterConsumerKey = SocialStore.twitter.consumerKey;
			this.twitterConsumerSecret = SocialStore.twitter.consumerSecret;

			this.twitterTrigger1 = ko.observable(Enums.SaveSettingsStep.Idle);
			this.twitterTrigger2 = ko.observable(Enums.SaveSettingsStep.Idle);

			this.dropboxEnable = SocialStore.dropbox.enabled;
			this.dropboxApiKey = SocialStore.dropbox.apiKey;

			this.dropboxTrigger1 = ko.observable(Enums.SaveSettingsStep.Idle);
		}

		SocialAdminSettings.prototype.onBuild = function ()
		{
			var
				self = this,
				Remote = __webpack_require__(/*! Remote/Admin/Ajax */ 17)
			;

			_.delay(function () {

				var
					f1 = Utils.settingsSaveHelperSimpleFunction(self.facebookTrigger1, self),
					f2 = Utils.settingsSaveHelperSimpleFunction(self.facebookTrigger2, self),
					f3 = Utils.settingsSaveHelperSimpleFunction(self.twitterTrigger1, self),
					f4 = Utils.settingsSaveHelperSimpleFunction(self.twitterTrigger2, self),
					f5 = Utils.settingsSaveHelperSimpleFunction(self.googleTrigger1, self),
					f6 = Utils.settingsSaveHelperSimpleFunction(self.googleTrigger2, self),
					f7 = Utils.settingsSaveHelperSimpleFunction(self.googleTrigger3, self),
					f8 = Utils.settingsSaveHelperSimpleFunction(self.dropboxTrigger1, self)
				;

				self.facebookEnable.subscribe(function (bValue) {
					if (self.facebookSupported())
					{
						Remote.saveAdminConfig(Utils.emptyFunction, {
							'FacebookEnable': bValue ? '1' : '0'
						});
					}
				});

				self.facebookAppID.subscribe(function (sValue) {
					if (self.facebookSupported())
					{
						Remote.saveAdminConfig(f1, {
							'FacebookAppID': Utils.trim(sValue)
						});
					}
				});

				self.facebookAppSecret.subscribe(function (sValue) {
					if (self.facebookSupported())
					{
						Remote.saveAdminConfig(f2, {
							'FacebookAppSecret': Utils.trim(sValue)
						});
					}
				});

				self.twitterEnable.subscribe(function (bValue) {
					Remote.saveAdminConfig(Utils.emptyFunction, {
						'TwitterEnable': bValue ? '1' : '0'
					});
				});

				self.twitterConsumerKey.subscribe(function (sValue) {
					Remote.saveAdminConfig(f3, {
						'TwitterConsumerKey': Utils.trim(sValue)
					});
				});

				self.twitterConsumerSecret.subscribe(function (sValue) {
					Remote.saveAdminConfig(f4, {
						'TwitterConsumerSecret': Utils.trim(sValue)
					});
				});

				self.googleEnable.subscribe(function (bValue) {
					Remote.saveAdminConfig(Utils.emptyFunction, {
						'GoogleEnable': bValue ? '1' : '0'
					});
				});

				self.googleEnableAuth.subscribe(function (bValue) {
					Remote.saveAdminConfig(Utils.emptyFunction, {
						'GoogleEnableAuth': bValue ? '1' : '0'
					});
				});

				self.googleEnableDrive.subscribe(function (bValue) {
					Remote.saveAdminConfig(Utils.emptyFunction, {
						'GoogleEnableDrive': bValue ? '1' : '0'
					});
				});

				self.googleEnablePreview.subscribe(function (bValue) {
					Remote.saveAdminConfig(Utils.emptyFunction, {
						'GoogleEnablePreview': bValue ? '1' : '0'
					});
				});

				self.googleClientID.subscribe(function (sValue) {
					Remote.saveAdminConfig(f5, {
						'GoogleClientID': Utils.trim(sValue)
					});
				});

				self.googleClientSecret.subscribe(function (sValue) {
					Remote.saveAdminConfig(f6, {
						'GoogleClientSecret': Utils.trim(sValue)
					});
				});

				self.googleApiKey.subscribe(function (sValue) {
					Remote.saveAdminConfig(f7, {
						'GoogleApiKey': Utils.trim(sValue)
					});
				});

				self.dropboxEnable.subscribe(function (bValue) {
					Remote.saveAdminConfig(Utils.emptyFunction, {
						'DropboxEnable': bValue ? '1' : '0'
					});
				});

				self.dropboxApiKey.subscribe(function (sValue) {
					Remote.saveAdminConfig(f8, {
						'DropboxApiKey': Utils.trim(sValue)
					});
				});

			}, 50);
		};

		module.exports = SocialAdminSettings;

	}());

/***/ },
/* 136 */,
/* 137 */,
/* 138 */,
/* 139 */,
/* 140 */,
/* 141 */,
/* 142 */,
/* 143 */,
/* 144 */,
/* 145 */,
/* 146 */,
/* 147 */
/*!*********************************!*\
  !*** ./dev/View/Admin/Login.js ***!
  \*********************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),
			ko = __webpack_require__(/*! ko */ 3),

			Enums = __webpack_require__(/*! Common/Enums */ 4),
			Utils = __webpack_require__(/*! Common/Utils */ 1),
			Translator = __webpack_require__(/*! Common/Translator */ 6),

			Settings = __webpack_require__(/*! Storage/Settings */ 9),
			Remote = __webpack_require__(/*! Remote/Admin/Ajax */ 17),

			kn = __webpack_require__(/*! Knoin/Knoin */ 5),
			AbstractView = __webpack_require__(/*! Knoin/AbstractView */ 12)
		;

		/**
		 * @constructor
		 * @extends AbstractView
		 */
		function LoginAdminView()
		{
			AbstractView.call(this, 'Center', 'AdminLogin');

			this.logoPowered = !!Settings.settingsGet('LoginPowered');

			this.login = ko.observable('');
			this.password = ko.observable('');

			this.loginError = ko.observable(false);
			this.passwordError = ko.observable(false);

			this.loginErrorAnimation = ko.observable(false).extend({'falseTimeout': 500});
			this.passwordErrorAnimation = ko.observable(false).extend({'falseTimeout': 500});

			this.loginFocus = ko.observable(false);

			this.formHidden = ko.observable(false);

			this.formError = ko.computed(function () {
				return this.loginErrorAnimation() || this.passwordErrorAnimation();
			}, this);

			this.login.subscribe(function () {
				this.loginError(false);
			}, this);

			this.password.subscribe(function () {
				this.passwordError(false);
			}, this);

			this.loginError.subscribe(function (bV) {
				this.loginErrorAnimation(!!bV);
			}, this);

			this.passwordError.subscribe(function (bV) {
				this.passwordErrorAnimation(!!bV);
			}, this);

			this.submitRequest = ko.observable(false);
			this.submitError = ko.observable('');

			this.submitCommand = Utils.createCommand(this, function () {

				Utils.triggerAutocompleteInputChange();

				this.loginError(false);
				this.passwordError(false);

				this.loginError('' === Utils.trim(this.login()));
				this.passwordError('' === Utils.trim(this.password()));

				if (this.loginError() || this.passwordError())
				{
					return false;
				}

				this.submitRequest(true);

				Remote.adminLogin(_.bind(function (sResult, oData) {

					if (Enums.StorageResultType.Success === sResult && oData && 'AdminLogin' === oData.Action)
					{
						if (oData.Result)
						{
							__webpack_require__(/*! App/Admin */ 18).loginAndLogoutReload(true);
						}
						else if (oData.ErrorCode)
						{
							this.submitRequest(false);
							this.submitError(Translator.getNotification(oData.ErrorCode));
						}
					}
					else
					{
						this.submitRequest(false);
						this.submitError(Translator.getNotification(Enums.Notification.UnknownError));
					}

				}, this), this.login(), this.password());

				return true;

			}, function () {
				return !this.submitRequest();
			});

			kn.constructorEnd(this);
		}

		kn.extendAsViewModel(['View/Admin/Login', 'AdminLoginViewModel'], LoginAdminView);
		_.extend(LoginAdminView.prototype, AbstractView.prototype);

		LoginAdminView.prototype.onShow = function ()
		{
			kn.routeOff();

			_.delay(_.bind(function () {
				this.loginFocus(true);
			}, this), 100);

		};

		LoginAdminView.prototype.onHide = function ()
		{
			this.loginFocus(false);
		};

		LoginAdminView.prototype.onBuild = function ()
		{
			Utils.triggerAutocompleteInputChange(true);
		};

		LoginAdminView.prototype.submitForm = function ()
		{
			this.submitCommand();
		};

		module.exports = LoginAdminView;

	}());

/***/ },
/* 148 */
/*!*****************************************!*\
  !*** ./dev/View/Admin/Settings/Menu.js ***!
  \*****************************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),

			Globals = __webpack_require__(/*! Common/Globals */ 8),

			kn = __webpack_require__(/*! Knoin/Knoin */ 5),
			AbstractView = __webpack_require__(/*! Knoin/AbstractView */ 12)
		;

		/**
		 * @param {?} oScreen
		 *
		 * @constructor
		 * @extends AbstractView
		 */
		function MenuSettingsAdminView(oScreen)
		{
			AbstractView.call(this, 'Left', 'AdminMenu');

			this.leftPanelDisabled = Globals.leftPanelDisabled;

			this.menu = oScreen.menu;

			kn.constructorEnd(this);
		}

		kn.extendAsViewModel(['View/Admin/Settings/Menu', 'AdminSettingsMenuViewModel'], MenuSettingsAdminView);
		_.extend(MenuSettingsAdminView.prototype, AbstractView.prototype);

		MenuSettingsAdminView.prototype.link = function (sRoute)
		{
			return '#/' + sRoute;
		};

		MenuSettingsAdminView.prototype.onBuild = function (oDom)
		{
			key('up, down', _.throttle(function (event, handler) {

				var
					sH = '',
					iIndex = -1,
					bUp = handler && 'up' === handler.shortcut,
					$items = $('.b-admin-menu .e-item', oDom)
				;

				if (event && $items.length)
				{
					iIndex = $items.index($items.filter('.selected'));
					if (bUp && iIndex > 0)
					{
						iIndex--;
					}
					else if (!bUp && iIndex < $items.length - 1)
					{
						iIndex++;
					}

					sH = $items.eq(iIndex).attr('href');
					if (sH)
					{
						kn.setHash(sH, false, true);
					}
				}

			}, 200));
		};

		module.exports = MenuSettingsAdminView;

	}());


/***/ },
/* 149 */
/*!*****************************************!*\
  !*** ./dev/View/Admin/Settings/Pane.js ***!
  \*****************************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),
			ko = __webpack_require__(/*! ko */ 3),

			Settings = __webpack_require__(/*! Storage/Settings */ 9),
			Remote = __webpack_require__(/*! Remote/Admin/Ajax */ 17),

			kn = __webpack_require__(/*! Knoin/Knoin */ 5),
			AbstractView = __webpack_require__(/*! Knoin/AbstractView */ 12)
		;

		/**
		 * @constructor
		 * @extends AbstractView
		 */
		function PaneSettingsAdminView()
		{
			AbstractView.call(this, 'Right', 'AdminPane');

			this.adminDomain = ko.observable(Settings.settingsGet('AdminDomain'));
			this.version = ko.observable(Settings.settingsGet('Version'));

			this.capa = !!Settings.settingsGet('PremType');
			this.community = (false);

			this.adminManLoading = ko.computed(function () {
				return '000' !== [
					__webpack_require__(/*! Stores/Admin/Domain */ 69).domains.loading() ? '1' : '0',
					__webpack_require__(/*! Stores/Admin/Plugin */ 72).plugins.loading() ? '1' : '0',
					__webpack_require__(/*! Stores/Admin/Package */ 71).packages.loading() ? '1' : '0'
				].join('');
			}, this);

			this.adminManLoadingVisibility = ko.computed(function () {
				return this.adminManLoading() ? 'visible' : 'hidden';
			}, this).extend({'rateLimit': 300});

			kn.constructorEnd(this);
		}

		kn.extendAsViewModel(['View/Admin/Settings/Pane', 'AdminSettingsPaneViewModel'], PaneSettingsAdminView);
		_.extend(PaneSettingsAdminView.prototype, AbstractView.prototype);

		PaneSettingsAdminView.prototype.logoutClick = function ()
		{
			Remote.adminLogout(function () {
				__webpack_require__(/*! App/Admin */ 18).loginAndLogoutReload(true, true);
			});
		};

		module.exports = PaneSettingsAdminView;

	}());

/***/ },
/* 150 */,
/* 151 */,
/* 152 */,
/* 153 */,
/* 154 */,
/* 155 */,
/* 156 */
/*!**********************************!*\
  !*** ./dev/View/Popup/Plugin.js ***!
  \**********************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),
			ko = __webpack_require__(/*! ko */ 3),
			key = __webpack_require__(/*! key */ 16),

			Enums = __webpack_require__(/*! Common/Enums */ 4),
			Utils = __webpack_require__(/*! Common/Utils */ 1),
			Translator = __webpack_require__(/*! Common/Translator */ 6),

			Remote = __webpack_require__(/*! Remote/Admin/Ajax */ 17),

			kn = __webpack_require__(/*! Knoin/Knoin */ 5),
			AbstractView = __webpack_require__(/*! Knoin/AbstractView */ 12)
		;

		/**
		 * @constructor
		 * @extends AbstractView
		 */
		function PluginPopupView()
		{
			AbstractView.call(this, 'Popups', 'PopupsPlugin');

			var self = this;

			this.onPluginSettingsUpdateResponse = _.bind(this.onPluginSettingsUpdateResponse, this);

			this.saveError = ko.observable('');

			this.name = ko.observable('');
			this.readme = ko.observable('');

			this.configures = ko.observableArray([]);

			this.hasReadme = ko.computed(function () {
				return '' !== this.readme();
			}, this);

			this.hasConfiguration = ko.computed(function () {
				return 0 < this.configures().length;
			}, this);

			this.readmePopoverConf = {
				'placement': 'top',
				'trigger': 'hover',
				'title': Translator.i18n('POPUPS_PLUGIN/TOOLTIP_ABOUT_TITLE'),
				'container': 'body',
				'content': function () {
					return self.readme();
				}
			};

			this.saveCommand = Utils.createCommand(this, function () {

				var oList = {};

				oList['Name'] = this.name();

				_.each(this.configures(), function (oItem) {

					var mValue = oItem.value();
					if (false === mValue || true === mValue)
					{
						mValue = mValue ? '1' : '0';
					}

					oList['_' + oItem['Name']] = mValue;

				}, this);

				this.saveError('');
				Remote.pluginSettingsUpdate(this.onPluginSettingsUpdateResponse, oList);

			}, this.hasConfiguration);

			this.bDisabeCloseOnEsc = true;
			this.sDefaultKeyScope = Enums.KeyState.All;

			this.tryToClosePopup = _.debounce(_.bind(this.tryToClosePopup, this), 200);

			kn.constructorEnd(this);
		}

		kn.extendAsViewModel(['View/Popup/Plugin', 'PopupsPluginViewModel'], PluginPopupView);
		_.extend(PluginPopupView.prototype, AbstractView.prototype);

		PluginPopupView.prototype.onPluginSettingsUpdateResponse = function (sResult, oData)
		{
			if (Enums.StorageResultType.Success === sResult && oData && oData.Result)
			{
				this.cancelCommand();
			}
			else
			{
				this.saveError('');
				if (oData && oData.ErrorCode)
				{
					this.saveError(Translator.getNotification(oData.ErrorCode));
				}
				else
				{
					this.saveError(Translator.getNotification(Enums.Notification.CantSavePluginSettings));
				}
			}
		};

		PluginPopupView.prototype.onShow = function (oPlugin)
		{
			this.name();
			this.readme();
			this.configures([]);

			if (oPlugin)
			{
				this.name(oPlugin['Name']);
				this.readme(oPlugin['Readme']);

				var aConfig = oPlugin['Config'];
				if (Utils.isNonEmptyArray(aConfig))
				{
					this.configures(_.map(aConfig, function (aItem) {
						return {
							'value': ko.observable(aItem[0]),
							'placeholder': ko.observable(aItem[6]),
							'Name': aItem[1],
							'Type': aItem[2],
							'Label': aItem[3],
							'Default': aItem[4],
							'Desc': aItem[5]
						};
					}));
				}
			}
		};

		PluginPopupView.prototype.tryToClosePopup = function ()
		{
			var
				self = this,
				PopupsAskViewModel = __webpack_require__(/*! View/Popup/Ask */ 45)
			;

			if (!kn.isPopupVisible(PopupsAskViewModel))
			{
				kn.showScreenPopup(PopupsAskViewModel, [Translator.i18n('POPUPS_ASK/DESC_WANT_CLOSE_THIS_WINDOW'), function () {
					if (self.modalVisibility())
					{
						Utils.delegateRun(self, 'cancelCommand');
					}
				}]);
			}
		};

		PluginPopupView.prototype.onBuild = function ()
		{
			key('esc', Enums.KeyState.All, _.bind(function () {
				if (this.modalVisibility())
				{
					this.tryToClosePopup();
				}
				return false;
			}, this));
		};

		module.exports = PluginPopupView;

	}());

/***/ }
/******/ ])
