"use strict";

import * as AddonSettings from "/common/modules/AddonSettings/AddonSettings.js";

const label = "PSL";

const TITLE = "🔗 Link Creator";
const TAB = "    ";

const ALARM = "update";


const pct_encoded = String.raw`%\p{AHex}{2}`;
// const pct_encoded = "(?:%[EFef]\p{AHex}%\p{AHex}{2}|%[89A-Fa-f]\p{AHex})?%\p{AHex}{2}";
const sub_delims = "!$&'()*+,;=";

// [^\p{ASCII}\p{Control}\p{Surrogate}\p{Private_Use}\p{Noncharacter_Code_Point}\p{Default_Ignorable_Code_Point}] // \uFFEF-\uFFFD\u{E0000}-\u{E1000}
const ucschar = String.raw`[^\p{ASCII}\p{Cc}\p{Cs}\p{Co}\p{NChar}]`;
// const ucschar = "\xA0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF\u{10000}-\u{1FFFD}\u{20000}-\u{2FFFD}\u{30000}-\u{3FFFD}\u{40000}-\u{4FFFD}\u{50000}-\u{5FFFD}\u{60000}-\u{6FFFD}\u{70000}-\u{7FFFD}\u{80000}-\u{8FFFD}\u{90000}-\u{9FFFD}\u{A0000}-\u{AFFFD}\u{B0000}-\u{BFFFD}\u{C0000}-\u{CFFFD}\u{D0000}-\u{DFFFD}\u{E1000}-\u{EFFFD}";

// \p{Private_Use}
const iprivate = String.raw`\p{Co}`;
// const iprivate = "\u{E000}-\u{F8FF}\u{F0000}-\u{FFFFD}\u{100000}-\u{10FFFD}";
const iunreserved = String.raw`(?:[a-zA-Z\d._~-]|${ucschar})`;
const ipchar = `(?:${iunreserved}|${pct_encoded}|[${sub_delims}:@])`;

// IPv4 address regular expressions
// \p{ASCII_Hex_Digit}
const octet = String.raw`(?:0x0*\p{AHex}{1,2}|0+[0-3]?[0-7]{1,2}|25[0-5]|(?:2[0-4]|1\d|[1-9])?\d)`;
// Supports dotted octal, decimal and hexadecimal notations/formats
const IPv4 = String.raw`(?:${octet}\.(?:${octet}(?:(?:\.${octet}){2}|\.(?:0x0*\p{AHex}{1,4}|0+[01]?[0-7]{1,5}|(?:6553[0-5]|(?:655[0-2]|65[0-4]\d{1}|6[0-4]\d{2}|[1-5]\d{3}|[1-9]\d{0,2})?\d)))|0x0*\p{AHex}{1,6}|0+[0-7]{1,8}|(?:1677721[0-5]|(?:1677720|16777[01]\d|1677[0-6]\d{2}|167[0-6]\d{3}|16[0-6]\d{4}|1[0-5]\d{5}|[1-9]\d{0,5})?\d))|0x0*\p{AHex}{1,8}|0+[0-3]?[0-7]{1,10}|(?:429496729[0-5]|(?:42949672[0-8]|4294967[01]\d|429496[0-6]\d{2}|42949[0-5]\d{3}|4294[0-8]\d{4}|429[0-3]\d{5}|42[0-8]\d{6}|4[01]\d{7}|[1-3]\d{8}|[1-9]\d{0,7})?\d))`;
// Supports only dotted decimal notation/format
const IPv4address = String.raw`(?:(?:25[0-5]|(?:2[0-4]|[01]?[0-9])?[0-9])\.){3}(?:25[0-5]|(?:2[0-4]|[01]?[0-9])?[0-9])`;

// IPv6 address regular expression
// \p{ASCII_Hex_Digit}
const IPv6address = String.raw`(?:(?:(?:\p{AHex}{1,4}:){6}|::(?:\p{AHex}{1,4}:){5}|(?:\p{AHex}{1,4})?::(?:\p{AHex}{1,4}:){4}|(?:(?:\p{AHex}{1,4}:)?\p{AHex}{1,4})?::(?:\p{AHex}{1,4}:){3}|(?:(?:\p{AHex}{1,4}:){0,2}\p{AHex}{1,4})?::(?:\p{AHex}{1,4}:){2}|(?:(?:\p{AHex}{1,4}:){0,3}\p{AHex}{1,4})?::(?:\p{AHex}{1,4}:)|(?:(?:\p{AHex}{1,4}:){0,4}\p{AHex}{1,4})?::)(?:\p{AHex}{1,4}:\p{AHex}{1,4}|${IPv4address})|(?:(?:\p{AHex}{1,4}:){0,5}\p{AHex}{1,4})?::\p{AHex}{1,4}|(?:(?:\p{AHex}{1,4}:){0,6}\p{AHex}{1,4})?::)(?:%25(?:${iunreserved}|${pct_encoded})+)?`;

// URI/IRI regular expression
const aIRI = String.raw`([a-zA-Z][a-zA-Z\d+.-]*:)(//((?:${iunreserved}|${pct_encoded}|[${sub_delims}:])*@)?(\[${IPv6address}\]|${IPv4address}|(?:${iunreserved}|${pct_encoded}|[${sub_delims}])*)(:\d*)?(?:/${ipchar}*)*|/(?:${ipchar}+(?:/${ipchar}*)*)?|${ipchar}+(?:/${ipchar}*)*)(\?(?:${ipchar}|[${iprivate}/?])*)?(#(?:${ipchar}|[/?])*)?`;
const IRI = RegExp(aIRI, "gu");
const IRIRE = RegExp(`^${aIRI}$`, "u");

// URL regular expression
const aURL = String.raw`(((?:https?|ftp):)?//)?((?:(?:${iunreserved}|${pct_encoded}|[${sub_delims}])+)(?::(?:${iunreserved}|${pct_encoded}|[${sub_delims}:])*)?@)?(\[${IPv6address}\]|${IPv4}|((?:(?:\w|${ucschar})(?:(?:[\w-]|${ucschar}){0,61}(?:\w|${ucschar}))?\.)+(?:xn--[a-z\d-]{0,58}[a-z\d]|(?:[a-z]|${ucschar}){2,63}))\.?)(:(\d{1,5}))?((?:/${ipchar}*)*)(\?(?:${ipchar}|[${iprivate}/?])*)?(#(?:${ipchar}|[/?])*)?`;
// const URL = RegExp(aURL, "iu");
const URLRE = RegExp(`^${aURL}$`, "iu");

// E-mail address regular expression
// \p{Open_Punctuation} \p{Close_Punctuation} \p{Dash_Punctuation} \p{Connector_Punctuation} \p{Math_Symbol}
const aEMAIL = String.raw`^((?:(?:[^@"(),:;<>\[\\\].\s]|\\[^():;<>.])+|"(?:[^"\\]|\\.)+")(?:\.(?:(?:[^@"(),:;<>\[\\\].\s]|\\[^():;<>.])+|"(?:[^"\\]|\\.)+"))*)(?:[\p{Ps}\s]+at[\p{Pe}\s]+|\s*@\s*)(\[(?:IPv6:${IPv6address}|${IPv4})\]|((?:(?:\w|${ucschar})(?:(?:[\w-]|${ucschar}){0,61}(?:\w|${ucschar}))?(?:[\p{Ps}\s]+dot[\p{Pe}\s]+|\.))+(?:xn--[a-z\d-]{0,58}[a-z\d]|(?:[a-z]|${ucschar}){2,63})))$`;
const EMAILRE = RegExp(aEMAIL, "iu");

// Telephone number regular expression
const TELRE = /^(?:(?:\+|00|011)[./\s-]*([17]|2[1-69]?\d|3[578]?\d|42?\d|5[09]?\d|6[789]?\d|8[0578]?\d|9[679]?\d)[./\s-]*)?(?:\(([a-z\d]{1,4})\)[./\s-]*)?(?:([a-z\d]{1,6})[./\s-])?(?:([a-z\d]{1,6})[./\s-])?(?:([a-z\d]{1,6})[./\s-])?(?:([a-z\d]{1,6})[./\s-])?([a-z\d]{1,14})(?:[./;\s-]*e?xt?[./=\s-]*(\d{1,14}))?$/iu;


const numberFormat = new Intl.NumberFormat();

const TYPE = Object.freeze({
	LINK: "link",
	ALL: "all",
	URI: "uri",
	URL: "url",
	MAIL: "mail",
	TEL: "tel",
	GO: "go",
	TAB: "tab",
	WINDOW: "window",
	PRIVATE: "private",
	COPY: "copy",
	SHARE: "share",
	SOURCE: "source",
	SMS: "sms"
});

// URL
const reURL = /^(?:https?|ftp):$/iu;

// Thunderbird
// https://bugzilla.mozilla.org/show_bug.cgi?id=1641573
const IS_THUNDERBIRD = typeof messenger !== "undefined";

// Chrome
const IS_CHROME = Object.getPrototypeOf(browser) !== Object.prototype;

// communication type
const UPDATE_CONTEXT_MENU = "updateContextMenu";
const BACKGROUND = "background";

const menus = browser.menus || browser.contextMenus; // fallback for Thunderbird

const settings = {
	urls: null,
	mail: null,
	tel: null,
	uri: null,
	uris: null,
	https: null,
	share: null,
	suffix: null,
	newTab: null,
	newWindow: null,
	private: null,
	background: null,
	lazy: null,
	livePreview: null,
	delay: null, // Seconds
	send: null
};

let menuIsShown = false;

let isAllowed = null;

let pasteSymbol = null;

let suffixes = null;
let exceptions = null;


/**
 * Create notification.
 *
 * @param {string} title
 * @param {string} message
 * @returns {void}
 */
function notification(title, message) {
	if (settings.send) {
		console.log(title, message);
		browser.notifications.create({
			type: "basic",
			iconUrl: browser.runtime.getURL("icons/icon_128.png"),
			title,
			message
		});
	}
}

/**
 * Copy link to clipboard.
 *
 * @param {string} text
 * @param {string} link
 * @returns {void}
 */
function copyToClipboard(text/* , link */) {
	// https://github.com/mdn/webextensions-examples/blob/master/context-menu-copy-link-with-types/clipboard-helper.js
	/* const atext = encodeXML(text);
	const alink = encodeXML(link);

	const html = `<a href="${alink}">${atext}</a>`; */

	navigator.clipboard.writeText(text);
}

/**
 * Copy URI/IRI to clipboard and show notification when unable to open tab/window directly.
 *
 * @param {string} uri
 * @returns {void}
 */
function fallback(uri) {
	copyToClipboard(uri, uri);
	const url = new URL(uri);
	notification(IS_THUNDERBIRD ? "📋 Copied to clipboard" : `📋 Press ${pasteSymbol}-V and Enter ↵`, `Add-ons ${IS_THUNDERBIRD ? "in Thunderbird " : ""}are currently unable to open “${url.protocol}” links directly, so it has been copied to your clipboard.\nPlease press ${pasteSymbol}-V and Enter ↵ to go.`);
}

/**
 * Show notification when link is invalid.
 * This should only happen in Chrome/Chromium.
 *
 * @param {string} message
 * @param {string} text
 * @returns {void}
 */
function chrome(message, text) {
	console.error(`Error: Not a ${message}`, text);
	notification(`❌ Not a ${message}`, `The selected text/link is not a valid ${message}. This error should only happen in Chrome/Chromium.`);
}

/**
 * Convert phone number letters to numbers.
 *
 * @param {string} text
 * @returns {string}
 */
function lettersToNumbers(text) {
	let output = "";

	for (let letter of text.toLowerCase()) {
		switch (letter) {
			case "a": case "b": case "c":
				letter = "2"; break;
			case "d": case "e": case "f":
				letter = "3"; break;
			case "g": case "h": case "i":
				letter = "4"; break;
			case "j": case "k": case "l":
				letter = "5"; break;
			case "m": case "n": case "o":
				letter = "6"; break;
			case "p": case "q": case "r": case "s":
				letter = "7"; break;
			case "t": case "u": case "v":
				letter = "8"; break;
			case "w": case "x": case "y": case "z":
				letter = "9"; break;
		}
		output += letter;
	}

	return output;
}

/**
 * Convert hostname to lowercase and Punycode: https://en.wikipedia.org/wiki/Punycode.
 *
 * @param {string} hostname
 * @returns {string}
 */
function punycode(hostname) {
	return new URL(`https://${hostname}`).hostname;
}

/**
 * Check if hostname has a valid suffix in the Public Suffix List.
 *
 * @param {string} hostname
 * @returns {boolean}
 */
function validSufix(hostname) {
	const adomain = punycode(hostname);
	const regexResult = suffixes.exec(adomain);
	if (regexResult) {
		const aregexResult = exceptions.exec(adomain);
		const labels = hostname.split(".");
		const alabels = aregexResult ? aregexResult[1].split(".").slice(1) : regexResult[1].split(".");
		if (labels.length > alabels.length) {
			console.log(hostname, alabels.join("."));
			return true;
		}
	}
	return false;
}

/**
 * Get URL.
 *
 * @param {string} text
 * @returns {URL|null}
 */
function getURL(text) {
	const aurl = URLRE.exec(text);
	if (aurl) {
		text = (!aurl[2] ? `http${settings.https || aurl[6] && parseInt(aurl[7], 10) === 443 ? "s" : ""}:` : "") + (!aurl[1] ? "//" : "") + text;
		const url = new URL(text);
		if (settings.suffix && suffixes && aurl[5]) {
			if (validSufix(aurl[5])) {
				return url;
			}
		} else {
			return url;
		}
	}
	return null;
}

/**
 * Get e-mail address.
 *
 * @param {string} text
 * @returns {string|null}
 */
function getMail(text) {
	const amail = EMAILRE.exec(text);
	if (amail) {
		text = `https://${amail[2].replaceAll(/[\p{Ps}\s]+dot[\p{Pe}\s]+/giu, ".")}`;
		const hostname = new URL(text).hostname;
		const mail = `${amail[1]}@${hostname}`;
		if (settings.suffix && suffixes && amail[3]) {
			if (validSufix(hostname)) {
				return mail;
			}
		} else {
			// console.error(text);
			return mail;
		}
	}
	return null;
}

/**
 * Get telephone number.
 *
 * @param {string} text
 * @returns {string|null}
 */
function getTel(text) {
	const atel = TELRE.exec(text);
	if (atel) {
		let output = "";

		if (atel[1]) {
			output += `+${atel[1]}-`;
		}
		for (let i = 2; i <= 6; ++i) {
			if (atel[i]) {
				output += `${lettersToNumbers(atel[i])}-`;
			}
		}
		if (atel[7]) {
			output += lettersToNumbers(atel[7]);
		}
		if (atel[8]) {
			output += `;ext=${atel[8]}`;
		}

		return output;
	}
	return null;
}

/**
 * Delay.
 *
 * @param {number} delay
 * @returns {Promise<void>}
 */
function delay(delay) {
	return new Promise((resolve) => {
		setTimeout(resolve, delay);
	});
}

/**
 * Potentially adjust context menu display if it is shown.
 *
 * @param {Object} info
 * @param {Object} tab
 * @returns {Promise<void>}
 * @throws {Error}
 */
async function handleMenuShown(info, tab) {
	console.log(info);
	let text = info.selectionText;

	// do not show menu entry when no text is selected
	if (!text && !info.linkUrl) {
		return;
	}

	text &&= text.trim().normalize();

	await buildMenu(text, info.linkUrl, tab);

	menus.refresh();
}

/**
 * Handle selection of a context menu item.
 *
 * @param {Object} info
 * @param {Object} tab
 * @returns {Promise<void>}
 * @throws {Error}
 */
async function handleMenuChoosen(info, tab) {
	console.log(info);
	let text = info.selectionText;
	const linkUrl = info.linkUrl;

	if (!text && !linkUrl) {
		return;
	}

	text &&= text.trim().normalize();

	const urls = [];

	const [menuItemId, amenuItemId, aamenuItemId] = info.menuItemId.split("-");

	switch (menuItemId) {
		case TYPE.LINK: {
			const atext = text || linkUrl;
			let uri = null;
			let url = null;
			let mail = null;
			let tel = null;

			if (text) {
				const iri = IRIRE.exec(text);
				if (iri) {
					uri = new URL(text);
					if (reURL.test(iri[1])) {
						if (URLRE.test(text)) {
							url = uri;
						}
					} else {
						url = getURL(text);
					}
				} else {
					url = getURL(text);
					uri = url;
					mail = getMail(text);
					tel = getTel(text);
				}
			} else if (linkUrl) {
				uri = new URL(linkUrl);
				if (reURL.test(uri.protocol)) {
					url = uri;
				}
			}

			switch (amenuItemId) {
				case TYPE.URI:
				case TYPE.URL: {
					const temp = amenuItemId === TYPE.URI ? uri : url;
					if (temp) {
						let atemp = temp.href;
						if (aamenuItemId === TYPE.GO || aamenuItemId === TYPE.LINK) {
							if (IS_THUNDERBIRD) {
								// Only supports HTTP and HTTPS URLs: https://bugzilla.mozilla.org/show_bug.cgi?id=1716200
								browser.windows.openDefaultBrowser(atemp).catch((error) => {
									console.error(error);

									// browser.windows.openDefaultBrowser("");
									fallback(atemp);
								});
							} else {
								browser.tabs.update(tab.id, { url: atemp }).catch((error) => {
									console.error(error);

									fallback(atemp);
								});
							}
						} else if (aamenuItemId === TYPE.TAB) {
							browser.tabs.create({ url: atemp, active: !settings.background, discarded: settings.background && settings.lazy, /* index: tab.index + 1, */ openerTabId: tab.id }).catch((error) => {
								console.error(error);

								browser.tabs.create({ /* index: tab.index + 1, */ openerTabId: tab.id });
								fallback(atemp);
							});
						} else if (aamenuItemId === TYPE.WINDOW) {
							try {
								browser.windows.create({ url: atemp, incognito: tab.incognito, focused: !settings.background }).catch((error) => {
									console.error(error);

									browser.windows.create({ incognito: tab.incognito });
									fallback(atemp);
								});
							} catch (error) {
								console.error(error);

								browser.windows.create({ incognito: tab.incognito });
								fallback(atemp);
							}
						} else if (aamenuItemId === TYPE.PRIVATE) {
							try {
								browser.windows.create({ url: atemp, incognito: true, focused: !settings.background }).catch((error) => {
									console.error(error);

									browser.windows.create({ incognito: true });
									fallback(atemp);
								});
							} catch (error) {
								console.error(error);

								browser.windows.create({ incognito: true });
								fallback(atemp);
							}
						} else if (aamenuItemId === TYPE.COPY) {
							copyToClipboard(atemp, atemp);
						} else if (aamenuItemId === TYPE.SHARE) {
							navigator.share({ title: `Link shared with “${TITLE}”`, url: atemp });
						} else if (aamenuItemId === TYPE.SOURCE) {
							atemp = `view-source:${atemp}`;
							if (IS_THUNDERBIRD) {
								// Does not work
								browser.windows.openDefaultBrowser(atemp).catch((error) => {
									console.error(error);

									// browser.windows.openDefaultBrowser("");
									fallback(atemp);
								});
							} else {
								browser.tabs.create({ url: atemp, active: !settings.background, discarded: settings.background && settings.lazy, /* index: tab.index + 1, */ openerTabId: tab.id });
							}
						}
					} else {
						chrome(amenuItemId === TYPE.URI ? "URI/IRI" : "URL", atext);
					}
					break;
				}
				case TYPE.MAIL: {
					if (mail) {
						// This encodes too many characters
						const amail = `mailto:${encodeURIComponent(mail)}`;
						if (!aamenuItemId) {
							if (IS_THUNDERBIRD) {
								browser.compose.beginNew(null, { to: mail });
								// browser.windows.openDefaultBrowser(amail);
							} else {
								browser.tabs.update(tab.id, { url: amail });
							}
						} else if (aamenuItemId === TYPE.COPY) {
							copyToClipboard(mail, amail);
						} else if (aamenuItemId === TYPE.SHARE) {
							navigator.share({ title: `Email Address shared with “${TITLE}”`, url: amail });
						}
					} else {
						chrome("e-mail address", atext);
					}
					break;
				}
				case TYPE.TEL: {
					if (tel) {
						const atel = `tel:${tel}`;
						if (!aamenuItemId) {
							if (IS_THUNDERBIRD) {
								// Does not work
								browser.windows.openDefaultBrowser(atel).catch((error) => {
									console.error(error);

									// browser.windows.openDefaultBrowser("");
									fallback(atel);
								});
							} else {
								browser.tabs.update(tab.id, { url: atel });
							}
						} else if (aamenuItemId === TYPE.SMS) {
							const sms = `sms:${tel}`;
							if (IS_THUNDERBIRD) {
								// Does not work
								browser.windows.openDefaultBrowser(sms).catch((error) => {
									console.error(error);

									// browser.windows.openDefaultBrowser("");
									fallback(sms);
								});
							} else {
								browser.tabs.update(tab.id, { url: sms });
							}
						} else if (aamenuItemId === TYPE.COPY) {
							copyToClipboard(tel, atel);
						} else if (aamenuItemId === TYPE.SHARE) {
							navigator.share({ title: `Telephone Number shared with “${TITLE}”`, url: atel });
						}
					} else {
						chrome("telephone number", atext);
					}
					break;
				}
			}
			break;
		}
		case TYPE.ALL: {
			const aurls = text.match(IRI);
			if (aurls.length) {
				urls.push(...aurls);
			} else {
				console.error("Error: No URIs found", text);
				notification("❌ No URIs found", "The selected text does not contain any valid URIs. This error should only happen in Chrome/Chromium.");
			}
			break;
		}
	}

	if (urls.length) {
		if (IS_THUNDERBIRD) {
			for (const url of urls) {
				// Only supports HTTP and HTTPS URLs: https://bugzilla.mozilla.org/show_bug.cgi?id=1716200
				await browser.windows.openDefaultBrowser(url).catch((error) => {
					console.error(error);

					// browser.windows.openDefaultBrowser("");
					fallback(url);
				});
				if (settings.delay) {
					await delay(settings.delay * 1000);
				}
			}
		} else if (settings.newWindow) {
			browser.windows.create({ url: urls, incognito: settings.private && isAllowed || tab.incognito, focused: !settings.background });
		} else {
			// let aindex = tab.index + 1;
			let aactive = !settings.background;

			if (urls.length > 1) {
				for (const url of urls) {
					await browser.tabs.create({ url, active: aactive, discarded: !aactive && settings.lazy, /* index: aindex, */ openerTabId: tab.id });
					// aindex += 1;
					aactive = false;
					if (settings.delay) {
						await delay(settings.delay * 1000);
					}
				}
			} else if (settings.newTab) {
				browser.tabs.create({ url: urls[0], active: aactive, discarded: !aactive && settings.lazy, /* index: aindex, */ openerTabId: tab.id });
			} else {
				browser.tabs.update(tab.id, { url: urls[0] });
			}
		}
	}
}

/**
 * Apply (new) menu item settings by (re)creating or updating/refreshing the context menu.
 *
 * @param {string?} [exampleText=null]
 * @param {string?} [linkUrl=null]
 * @param {Object?} [tab=null]
 * @returns {Promise<void>}
 */
async function buildMenu(exampleText, linkUrl, tab) {
	console.log(exampleText, linkUrl);
	if (menuIsShown) {
		let uri = null;
		let url = null;
		let mail = null;
		let tel = null;
		// let aurl = null;
		let urls = null;

		if (exampleText) {
			const iri = IRIRE.exec(exampleText);
			console.log(iri);
			if (iri) {
				uri = new URL(exampleText);
				if (reURL.test(iri[1])) {
					// console.log(URLRE.exec(exampleText));
					if (URLRE.test(exampleText)) {
						url = uri;
					} else {
						console.error(iri, exampleText);
					}
				} else {
					url = getURL(exampleText);
				}
			} else {
				url = getURL(exampleText);
				// uri = url;
				mail = getMail(exampleText);
				tel = getTel(exampleText);
			}
			urls = exampleText.match(IRI);
		} else if (linkUrl) {
			uri = new URL(linkUrl);
			if (reURL.test(uri.protocol)) {
				url = uri;
			}
		}

		if (settings.uri) {
			const aid = `${TYPE.LINK}-${TYPE.URI}`;
			const avisible = Boolean(uri) && (!(settings.urls && url) || url.protocol !== uri.protocol || Boolean(linkUrl && !exampleText));
			uri &&= uri.href;
			// console.log(settings.uri, uri, settings.urls, url, linkUrl, avisible);
			if (exampleText) {
				menus.update(`${aid}-${TYPE.GO}`, {
					title: `&Go to ${settings.livePreview && uri ? ` “${uri.replaceAll("&", "&&")}”` : "“%s”"}`,
					visible: avisible || !settings.urls,
					enabled: avisible
				});
			}
			if (linkUrl) {
				menus.update(`${aid}-${TYPE.LINK}`, {
					title: `&Open Link${settings.livePreview && uri && !exampleText ? ` “${uri.replaceAll("&", "&&")}”` : ""}`,
					visible: avisible && !exampleText
				});
			}
			if (!IS_THUNDERBIRD) {
				menus.update(`${aid}-${TYPE.TAB}`, {
					visible: avisible
				});
				menus.update(`${aid}-${TYPE.WINDOW}`, {
					visible: avisible && !tab.incognito
				});
				menus.update(`${aid}-${TYPE.PRIVATE}`, {
					visible: avisible,
					enabled: avisible && isAllowed
				});
			}
			menus.update(`${aid}-${TYPE.COPY}`, {
				visible: avisible
			});
			if (settings.share && navigator.canShare) {
				menus.update(`${aid}-${TYPE.SHARE}`, {
					visible: avisible,
					enabled: avisible && navigator.canShare({ title: `Link shared with “${TITLE}”`, url: uri })
				});
			}
		}
		if (settings.uris) {
			menus.update(TYPE.ALL, {
				title: `&Open All ${settings.livePreview && urls ? `${numberFormat.format(urls.length)} ` : ""}Links`,
				visible: Boolean(urls) && urls.length > 1
			});
		}
		if (settings.urls) {
			const aid = `${TYPE.LINK}-${TYPE.URL}`;
			const avisible = Boolean(url) && (Boolean(exampleText) || !(settings.uri && uri));
			url &&= url.href;
			// console.log(settings.uri, uri, settings.urls, url, avisible);
			if (exampleText) {
				menus.update(`${aid}-${TYPE.GO}`, {
					title: settings.livePreview && url ? `&Go to “${url.replaceAll("&", "&&")}”` : "&Go to “%s”",
					enabled: avisible
				});
			}
			if (linkUrl) {
				menus.update(`${aid}-${TYPE.LINK}`, {
					title: `&Open Link${settings.livePreview && url && !exampleText ? ` “${url.replaceAll("&", "&&")}”` : ""}`,
					visible: avisible && !exampleText
				});
			}
			if (!IS_THUNDERBIRD) {
				menus.update(`${aid}-${TYPE.TAB}`, {
					visible: avisible
				});
				menus.update(`${aid}-${TYPE.WINDOW}`, {
					visible: avisible && !tab.incognito
				});
				menus.update(`${aid}-${TYPE.PRIVATE}`, {
					visible: avisible,
					enabled: avisible && isAllowed
				});
			}
			menus.update(`${aid}-${TYPE.COPY}`, {
				visible: avisible
			});
			if (settings.share && navigator.canShare) {
				menus.update(`${aid}-${TYPE.SHARE}`, {
					visible: avisible,
					enabled: avisible && navigator.canShare({ title: `Link shared with “${TITLE}”`, url })
				});
			}
			menus.update(`${aid}-${TYPE.SOURCE}`, {
				visible: Boolean(url)
			});
		}
		if (settings.mail) {
			const aid = `${TYPE.LINK}-${TYPE.MAIL}`;
			menus.update(aid, {
				title: settings.livePreview && mail ? `&Mail to “${mail.replaceAll("&", "&&")}”` : "&Mail to “%s”",
				enabled: Boolean(mail)
			});
			menus.update(`${aid}-${TYPE.COPY}`, {
				visible: Boolean(mail)
			});
			if (settings.share && navigator.canShare) {
				menus.update(`${aid}-${TYPE.SHARE}`, {
					visible: Boolean(mail),
					enabled: Boolean(mail) && navigator.canShare({ title: `Email Address shared with “${TITLE}”`, url: mail })
				});
			}
		}
		if (settings.tel) {
			const aid = `${TYPE.LINK}-${TYPE.TEL}`;
			menus.update(aid, {
				title: settings.livePreview && tel ? `Call “${tel}”` : "Call “%s”",
				enabled: Boolean(tel)
			});
			menus.update(`${aid}-${TYPE.SMS}`, {
				visible: Boolean(tel)
			});
			menus.update(`${aid}-${TYPE.COPY}`, {
				visible: Boolean(tel)
			});
			if (settings.share && navigator.canShare) {
				menus.update(`${aid}-${TYPE.SHARE}`, {
					visible: Boolean(tel),
					enabled: Boolean(tel) && navigator.canShare({ title: `Telephone Number shared with “${TITLE}”`, url: tel })
				});
			}
		}
	} else {
		if (settings.uri) {
			const aid = `${TYPE.LINK}-${TYPE.URI}`;
			await menus.create({
				id: `${aid}-${TYPE.GO}`,
				title: "&Go to “%s”",
				contexts: ["selection"]
			});
			await menus.create({
				id: `${aid}-${TYPE.LINK}`,
				title: "&Open Link",
				contexts: ["link"]
			});
			if (!IS_THUNDERBIRD) {
				await menus.create({
					id: `${aid}-${TYPE.TAB}`,
					title: `${TAB}in New &Tab`,
					contexts: ["selection", "link"]
				});
				await menus.create({
					id: `${aid}-${TYPE.WINDOW}`,
					title: `${TAB}in New Win&dow`,
					contexts: ["selection", "link"]
				});
				if (isAllowed || !IS_CHROME) {
					await menus.create({
						id: `${aid}-${TYPE.PRIVATE}`,
						title: `${TAB}in New &${IS_CHROME ? "Incognito" : "Private"} Window`,
						contexts: ["selection", "link"]
					});
				}
			}
			await menus.create({
				id: `${aid}-${TYPE.COPY}`,
				// title: `${TAB}&Copy Link location`, // Thunderbird
				// title: `${TAB}Copy &Link address`, // Chrome
				title: IS_THUNDERBIRD ? `${TAB}&Copy Link` : `${TAB}Copy &Link`,
				contexts: ["selection", "link"]
			});
			if (settings.share && navigator.canShare) {
				await menus.create({
					id: `${aid}-${TYPE.SHARE}`,
					title: `${TAB}Share Link`,
					contexts: ["selection", "link"]
				});
			}
		}
		if (settings.uris) {
			await menus.create({
				id: TYPE.ALL,
				title: "Open All Links",
				contexts: ["selection"]
			});
		}
		if (settings.urls) {
			const aid = `${TYPE.LINK}-${TYPE.URL}`;
			await menus.create({
				id: `${aid}-${TYPE.GO}`,
				title: "&Go to “%s”",
				contexts: ["selection"]
			});
			if (!IS_CHROME && !settings.uri) {
				await menus.create({
					id: `${aid}-${TYPE.LINK}`,
					title: "&Open Link",
					contexts: ["link"]
				});
			}
			if (!IS_THUNDERBIRD) {
				await menus.create({
					id: `${aid}-${TYPE.TAB}`,
					title: `${TAB}in New &Tab`,
					contexts: IS_CHROME || settings.uri ? ["selection"] : ["selection", "link"]
				});
				await menus.create({
					id: `${aid}-${TYPE.WINDOW}`,
					title: `${TAB}in New Win&dow`,
					contexts: IS_CHROME || settings.uri ? ["selection"] : ["selection", "link"]
				});
				if (isAllowed || !IS_CHROME) {
					await menus.create({
						id: `${aid}-${TYPE.PRIVATE}`,
						title: `${TAB}in New &${IS_CHROME ? "Incognito" : "Private"} Window`,
						contexts: IS_CHROME || settings.uri ? ["selection"] : ["selection", "link"]
					});
				}
			}
			await menus.create({
				id: `${aid}-${TYPE.COPY}`,
				// title: `${TAB}&Copy Link location`, // Thunderbird
				// title: `${TAB}Copy &Link address`, // Chrome
				title: IS_THUNDERBIRD ? `${TAB}&Copy Link` : `${TAB}Copy &Link`,
				contexts: IS_CHROME || settings.uri ? ["selection"] : ["selection", "link"]
			});
			if (settings.share && navigator.canShare) {
				await menus.create({
					id: `${aid}-${TYPE.SHARE}`,
					title: `${TAB}Share Link`,
					contexts: IS_CHROME || settings.uri ? ["selection"] : ["selection", "link"]
				});
			}
			await menus.create({
				id: `${aid}-${TYPE.SOURCE}`,
				title: `${TAB}&View Source`,
				contexts: ["selection", "link"]
			});
		}
		if (settings.mail) {
			const aid = `${TYPE.LINK}-${TYPE.MAIL}`;
			await menus.create({
				id: aid,
				title: IS_THUNDERBIRD ? "Compo&se Message to" : "&Mail to",
				contexts: ["selection"]
			});
			await menus.create({
				id: `${aid}-${TYPE.COPY}`,
				title: IS_THUNDERBIRD ? `${TAB}Copy &Email Address` : `${TAB}Copy Emai&l Address`,
				contexts: ["selection"]
			});
			if (settings.share && navigator.canShare) {
				await menus.create({
					id: `${aid}-${TYPE.SHARE}`,
					title: `${TAB}Share Email Address`,
					contexts: ["selection"]
				});
			}
		}
		if (settings.tel) {
			const aid = `${TYPE.LINK}-${TYPE.TEL}`;
			await menus.create({
				id: aid,
				title: "Call",
				contexts: ["selection"]
			});
			await menus.create({
				id: `${aid}-${TYPE.SMS}`,
				title: `${TAB}Message`,
				contexts: ["selection"]
			});
			await menus.create({
				id: `${aid}-${TYPE.COPY}`,
				title: `${TAB}Copy Telephone Number`,
				contexts: ["selection"]
			});
			if (settings.share && navigator.canShare) {
				await menus.create({
					id: `${aid}-${TYPE.SHARE}`,
					title: `${TAB}Share Telephone Number`,
					contexts: ["selection"]
				});
			}
		}

		menuIsShown = true;
	}
}

/**
 * Get the public suffix list.
 *
 * @param {number} date
 * @returns {Promise<void>}
 */
function getPSL(date) {
	console.time(label);
	const url = "https://publicsuffix.org/list/public_suffix_list.dat";
	console.log(url);
	return fetch(url).then(async (response) => {
		if (response.ok) {
			const text = await response.text();
			// console.log(text);

			console.timeLog(label);

			const PSL = Object.freeze(text.split("\n").map((r) => r.trim()).filter((r) => r.length && !r.startsWith("//")));
			console.log(PSL.length, date);

			browser.storage.local.set({ PSL: { PSL, date } });

			console.timeLog(label);

			parsePSL(PSL);

			console.timeEnd(label);
		} else {
			console.error(response);
			console.timeEnd(label);
		}
	});
}

/**
 * Find common prefix.
 *
 * @param {string[]} strs
 * @returns {string}
 */
function prefix(strs) {
	let prefix = "";

	for (const char of strs[0]) {
		const aprefix = prefix + char;
		for (const str of strs) {
			if (!str.startsWith(aprefix)) {
				return prefix;
			}
		}
		prefix = aprefix;
	}

	return prefix;
}

/**
 * Find common suffix.
 *
 * @param {string[]} strs
 * @returns {string}
 */
function suffix(strs) {
	let suffix = "";

	for (const char of Array.from(strs[0]).reverse()) {
		const asuffix = char + suffix;
		for (const str of strs) {
			if (!str.endsWith(asuffix)) {
				return suffix;
			}
		}
		suffix = asuffix;
	}

	return suffix;
}

/**
 * Traverse tree of objects to create RegEx.
 *
 * @param {Object} obj
 * @returns {string}
 */
function traverse(obj) {
	const array = [];

	for (const s in obj) {
		if (s !== "leaf") {
			const length = Object.keys(obj[s]).length;
			let temp = "";

			if (length > 1 || length === 1 && !obj[s].leaf) {
				if (obj[s].leaf) {
					temp += String.raw`(?:${traverse(obj[s])}\.)?`;
				} else {
					temp += String.raw`${traverse(obj[s])}\.`;
				}
			}

			temp += s.replace("---", "[^.]+");
			array.push(temp);
		}
	}

	if (array.length > 1) {
		const aprefix = prefix(array);
		const asuffix = suffix(array);

		if (aprefix.length > 1 || asuffix.length > 1) {
			return `${aprefix}(?:${array.map((x) => x.slice(aprefix.length, asuffix ? -asuffix.length : x.length)).join("|")})${asuffix}`;
		}

		return `(?:${array.join("|")})`;
	}

	return array.join("|");
}

/**
 * Convert public suffix list into tree of objects.
 *
 * @param {string[]} arr
 * @returns {string}
 */
function createRegEx(arr) {
	const tree = {};

	for (const s of arr) {
		let temp = tree;

		for (const l of punycode(s.replaceAll("*", "---")).split(".").reverse()) {
			if (!(l in temp)) {
				temp[l] = {};
			}
			temp = temp[l];
		}

		// Leaf node
		temp.leaf = true;
	}

	Object.freeze(tree);
	return traverse(tree);
}

/**
 * Parse public suffix list and create regular expressions.
 *
 * @param {readonly string[]} PSL
 * @returns {void}
 */
function parsePSL(PSL) {
	suffixes = [];
	exceptions = [];

	for (const r of PSL) {
		if (r.startsWith("!")) {
			exceptions.push(r.slice(1));
		} else {
			suffixes.push(r);
		}
	}

	// console.log(suffixes, exceptions);

	suffixes = createRegEx(suffixes);
	exceptions = createRegEx(exceptions);

	console.log(suffixes, exceptions);

	suffixes = new RegExp(String.raw`(?:^|\.)(${suffixes})$`, "u");
	exceptions = new RegExp(String.raw`(?:^|\.)(${exceptions})$`, "u");

	// console.log(suffixes, exceptions);
}

/**
 * Handle alarm.
 *
 * @param {Object} alarmInfo
 * @returns {void}
 */
function handleAlarm(alarmInfo) {
	if (alarmInfo.name === ALARM) {
		getPSL(alarmInfo.scheduledTime);
	}
}

browser.alarms.onAlarm.addListener(handleAlarm);

// feature detection for this feature, as it is not compatible with Chrome/ium.
if (menus.onShown) {
	menus.onShown.addListener(handleMenuShown);
}
menus.onClicked.addListener(handleMenuChoosen);

/**
 * Set settings.
 *
 * @param {Object} asettings
 * @returns {Promise<void>}
 */
async function setSettings(asettings) {
	settings.urls = asettings.urls;
	settings.mail = asettings.mail;
	settings.tel = asettings.tel;
	settings.uri = asettings.uri;
	settings.uris = asettings.uris;
	settings.https = asettings.https;
	settings.newTab = false;
	settings.newWindow = false;
	settings.private = false;
	switch (parseInt(asettings.disposition, 10)) {
		case 1:
			break;
		case 2:
			settings.newTab = true;
			break;
		case 3:
			settings.newWindow = true;
			break;
		case 4:
			settings.newWindow = true;
			settings.private = true;
			break;
	}
	settings.background = asettings.background;
	settings.lazy = asettings.lazy;
	settings.livePreview = asettings.livePreview;
	settings.delay = asettings.delay;
	settings.send = asettings.send;

	// browser.alarms.clearAll();

	if (asettings.suffix) {
		if (asettings.suffix !== settings.suffix) {
			settings.suffix = asettings.suffix;

			await browser.storage.local.get(["PSL"]).then((item) => {
				console.log(item);
				const d = new Date();
				const PSL = item.PSL;

				if (PSL) {
					parsePSL(PSL.PSL);

					d.setTime(PSL.date);
				} else {
					getPSL(d.getTime());
				}

				d.setDate(d.getDate() + 1);

				browser.alarms.create(ALARM, {
					when: d.getTime(),
					periodInMinutes: 60 * 24
				});
			});
		}
	} else {
		settings.suffix = asettings.suffix;

		browser.alarms.clear(ALARM);
	}
}

/**
 * Init.
 *
 * @public
 * @returns {Promise<void>}
 */
async function init() {
	const platformInfo = await browser.runtime.getPlatformInfo();
	// Remove once https://bugzilla.mozilla.org/show_bug.cgi?id=1595822 is fixed
	if (platformInfo.os === "android") {
		return;
	}

	isAllowed = await browser.extension.isAllowedIncognitoAccess();

	const asettings = await AddonSettings.get("settings");

	setSettings(asettings);

	buildMenu();

	pasteSymbol = platformInfo.os === "mac" ? "\u2318" : "Ctrl";
}

init();

browser.runtime.onMessage.addListener(async (message, sender) => {
	// console.log(message);
	if (message.type === UPDATE_CONTEXT_MENU) {
		let text = message.selection;

		// do not show menu entry when no text is selected
		if (!text) {
			if (menuIsShown) {
				await menus.removeAll();
				menuIsShown = false;
			}
			await buildMenu(text, null, sender.tab);
			return;
		}

		text = text.trim().normalize();

		await buildMenu(text, null, sender.tab);
	} else if (message.type === BACKGROUND) {
		setSettings(message.optionValue);

		await menus.removeAll();
		menuIsShown = false;
		buildMenu();
	}
});
