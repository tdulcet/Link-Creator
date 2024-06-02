"use strict";

import * as AddonSettings from "/common/modules/AddonSettings/AddonSettings.js";

const label = "PSL";

const TITLE = "🔗 Link Creator";
// https://bugzilla.mozilla.org/show_bug.cgi?id=1816870
const TAB = "\u00A0\u00A0\u00A0\u00A0";

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
const IRI = new RegExp(aIRI, "gu");
const IRIRE = new RegExp(`^${aIRI}$`, "u");

// URL regular expression
const aURL = String.raw`(((?:https?|ftp):)?//)?((?:(?:${iunreserved}|${pct_encoded}|[${sub_delims}])+)(?::(?:${iunreserved}|${pct_encoded}|[${sub_delims}:])*)?@)?(\[${IPv6address}\]|${IPv4}|((?:(?:\w|${ucschar})(?:(?:[\w-]|${ucschar}){0,61}(?:\w|${ucschar}))?\.)+(?:xn--[a-z\d-]{0,58}[a-z\d]|(?:[a-z]|${ucschar}){2,63}))\.?)(:(\d{1,5}))?((?:/${ipchar}*)*)(\?(?:${ipchar}|[${iprivate}/?])*)?(#(?:${ipchar}|[/?])*)?`;
// const URL = RegExp(aURL, "iu");
const URLRE = new RegExp(`^${aURL}$`, "iu");

// E-mail address regular expression
// \p{Open_Punctuation} \p{Close_Punctuation} \p{Dash_Punctuation} \p{Connector_Punctuation} \p{Math_Symbol}
const aMAIL = String.raw`^((?:(?:[^@"(),:;<>\[\\\].\s]|\\[^():;<>.])+|"(?:[^"\\]|\\.)+")(?:\.(?:(?:[^@"(),:;<>\[\\\].\s]|\\[^():;<>.])+|"(?:[^"\\]|\\.)+"))*)(?:[\p{Ps}\s_]+(?:at|@)[\p{Pe}\s_]+|\s*@\s*)(\[(?:IPv6:(${IPv6address})|(${IPv4}))\]|((?:(?:\w|${ucschar})(?:(?:[\w-]|${ucschar}){0,61}(?:\w|${ucschar}))?(?:[\p{Ps}\s_]+dot[\p{Pe}\s_]+|\.))+(?:xn--[a-z\d-]{0,58}[a-z\d]|(?:[a-z]|${ucschar}){2,63})))$`;
const MAILRE = new RegExp(aMAIL, "iu");
const aEMAIL = String.raw`((?:(?:[^@"(),:;<>\[\\\].\s]|\\[^():;<>.])+|"(?:[^"\\]|\\.)+")(?:\.(?:(?:[^@"(),:;<>\[\\\].\s]|\\[^():;<>.])+|"(?:[^"\\]|\\.)+"))*)@(\[(?:IPv6:(${IPv6address})|(${IPv4}))\]|((?:(?:\w|${ucschar})(?:(?:[\w-]|${ucschar}){0,61}(?:\w|${ucschar}))?\.)+(?:xn--[a-z\d-]{0,58}[a-z\d]|(?:[a-z]|${ucschar}){2,63})))`;
const EMAIL = new RegExp(aEMAIL, "igu");
const EMAILRE = new RegExp(`^${aEMAIL}$`, "iu");

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
	DOMAIN: "domain",
	COPY: "copy",
	SHARE: "share",
	SOURCE: "source",
	SMS: "sms"
});

// URL
const reURL = /^(?:https?|ftp):$/iu;
// Mail to
const reMail = /^mailto:$/iu;
// Tel
const reTel = /^(?:tel|sms):$/iu;

// Thunderbird
// https://bugzilla.mozilla.org/show_bug.cgi?id=1641573
const IS_THUNDERBIRD = Boolean(globalThis.messenger);

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
	mails: null,
	https: null,
	share: null,
	single: null,
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

const notifications = new Map();

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

browser.notifications.onClicked.addListener((notificationId) => {
	const url = notifications.get(notificationId);

	if (url) {
		browser.tabs.create({ url });
	}
});

browser.notifications.onClosed.addListener((notificationId) => {
	notifications.delete(notificationId);
});

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
function validSuffix(hostname) {
	if (settings.suffix && suffixes && hostname) {
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
	} else {
		return true;
	}
	return false;
}

/**
 * Check URL.
 *
 * @param {string} text
 * @param {RegExpMatchArray} iri
 * @returns {boolean}
 */
function checkURL(text, iri) {
	const aurl = URLRE.exec(text);
	if (aurl) {
		if (validSuffix(aurl[5])) {
			return true;
		}
	} else {
		console.error(iri, text);
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
		const [, scheme, authority, , , host, port, aport] = aurl;
		text = (authority ? "" : `http${settings.https || port && Number.parseInt(aport, 10) === 443 ? "s" : ""}:`) + (scheme ? "" : "//") + text;
		const url = new URL(text);
		if (validSuffix(host)) {
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
function getEmail(text) {
	const amail = MAILRE.exec(text);
	if (amail) {
		const [, user, domain, ipv6, ipv4, host] = amail;
		text = ipv6 ? `[${ipv6}]` : ipv4 || domain.replaceAll(/[\p{Ps}\s_]+dot[\p{Pe}\s_]+/giu, ".");
		const { hostname } = new URL(`https://${text}`);
		const mail = `${user}@${ipv6 ? `[IPv6:${hostname.slice(1, -1)}]` : ipv4 ? `[${hostname}]` : hostname}`;
		if (validSuffix(host)) {
			return mail;
		}
	}
	return null;
}

/**
 * Get e-mail address.
 *
 * @param {URL} text
 * @returns {string|null}
 */
function getMail(text) {
	if (reMail.test(text.protocol)) {
		const url = text.href;
		const qmark = url.indexOf("?");
		const {length} = "mailto:";
		let addresses = qmark > length ? url.substring(length, qmark) : url.slice(length);
		try {
			addresses = decodeURIComponent(addresses);
		} catch (error) {
			console.error(error);
		}
		return addresses;
	}
	return null;
}

/**
 * Get e-mail address hostname.
 *
 * @param {string} text
 * @returns {string|null}
 */
function getEmailHost(text) {
	const amail = EMAILRE.exec(text);
	if (amail) {
		const [, , domain, ipv6, ipv4] = amail;
		text = ipv6 ? `[${ipv6}]` : ipv4 || domain;
		return getURL(text)?.href;
	}
	return null;
}

/**
 * Get telephone number.
 *
 * @param {string} text
 * @returns {string|null}
 */
function getPhone(text) {
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
 * Get telephone number.
 *
 * @param {URL} text
 * @returns {string|null}
 */
function getTel(text) {
	if (reTel.test(text.protocol)) {
		const url = text.href;
		// return url.slice("tel:".length);
		const qmark = url.indexOf("?");
		const {length} = "tel:";
		let phone = qmark > length ? url.substring(length, qmark) : url.slice(length);
		try {
			phone = decodeURIComponent(phone);
		} catch (error) {
			console.error(error);
		}
		return phone;
	}
	return null;
}

/**
 * Get URIs.
 *
 * @param {string} text
 * @returns {string[]}
 */
function getURIs(text) {
	return Array.from(text.matchAll(IRI), (airi) => {
		const [iri] = airi;
		const uri = new URL(iri);
		if (reURL.test(uri.protocol)) {
			if (checkURL(iri, airi)) {
				return uri.href;
			}
		} else {
			return uri.href;
		}
		return null;
	}).filter(Boolean);
}

/**
 * Get e-mail addresses.
 *
 * @param {string} text
 * @returns {string[]}
 */
function getMails(text) {
	return Array.from(text.matchAll(EMAIL), (amail) => {
		const [, user, domain, ipv6, ipv4, host] = amail;
		const { hostname } = new URL(`https://${ipv6 ? `[${ipv6}]` : ipv4 || domain}`);
		const mail = `${user}@${ipv6 ? `[IPv6:${hostname.slice(1, -1)}]` : ipv4 ? `[${hostname}]` : hostname}`;
		if (validSuffix(host)) {
			return mail;
		}
		return null;
	}).filter(Boolean);
}

/**
 * Open link in Thunderbird.
 *
 * @param {string} uri
 * @returns {Promise}
 */
function thunderbird(uri) {
	return browser.windows.openDefaultBrowser(uri).catch((error) => {
		console.error(error);

		fallback(uri);
	});
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
		// await menus.removeAll();
		// menuIsShown = false;
		// menus.refresh();
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
	const { linkUrl } = info;

	if (!text && !linkUrl) {
		return;
	}

	text &&= text.trim().normalize();

	const urls = [];

	const [menuItemId, amenuItemId, aamenuItemId, aaamenuItemId] = info.menuItemId.split("-");

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
					console.assert(!URL.canParse || URL.canParse(text), "Error: Invalid URI");
					uri = new URL(text);
					if (reURL.test(uri.protocol)) {
						if (checkURL(text, iri)) {
							url = uri;
						}
					} else {
						url = getURL(text);
					}
				} else {
					url = getURL(text);
					uri = url;
					mail = getEmail(text);
					tel = getPhone(text);
				}
			} else if (linkUrl) {
				console.assert(!URL.canParse || URL.canParse(linkUrl), "Error: Invalid URI");
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
						const addresses = getMail(temp);
						let atemp = temp.href;
						switch (aamenuItemId) {
							case TYPE.GO:
							case TYPE.LINK:
								if (IS_THUNDERBIRD && url) {
									// Only supports HTTP and HTTPS URLs: https://bugzilla.mozilla.org/show_bug.cgi?id=1716200
									thunderbird(atemp);
								} else {
									browser.tabs.update(tab.id, { url: atemp }).catch((error) => {
										console.error(error);

										fallback(atemp);
									});
								}
								break;
							case TYPE.TAB: {
								const options = { url: atemp, active: !settings.background, /* index: tab.index + 1, */ openerTabId: tab.id };
								if (!IS_CHROME) {
									options.discarded = settings.background && settings.lazy;
								}
								browser.tabs.create(options).catch((error) => {
									console.error(error);

									browser.tabs.create({ /* index: tab.index + 1, */ openerTabId: tab.id });
									fallback(atemp);
								});
								break;
							}
							case TYPE.WINDOW:
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
								break;
							case TYPE.PRIVATE:
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
								break;
							case TYPE.DOMAIN:
								if (addresses) {
									const host = getEmailHost(addresses);
									if (host) {
										urls.push(host);
									} else {
										chrome("e-mail address", atext);
									}
								} else {
									chrome("e-mail address", atext);
								}
								break;
							case TYPE.COPY:
								if (!aaamenuItemId) {
									copyToClipboard(atemp, atemp);
								} else if (aaamenuItemId === TYPE.MAIL) {
									if (addresses) {
										copyToClipboard(addresses, atemp);
									} else {
										chrome("e-mail address", atext);
									}
								} else if (aaamenuItemId === TYPE.TEL) {
									const phone = getTel(temp);
									if (phone) {
										copyToClipboard(phone, atemp);
									} else {
										chrome("telephone number", atext);
									}
								}
								break;
							case TYPE.SHARE:
								navigator.share({ title: `Link shared with “${TITLE}”`, url: atemp });
								break;
							case TYPE.SOURCE:
								atemp = `view-source:${atemp}`;
								if (IS_THUNDERBIRD) {
									// Does not work
									thunderbird(atemp);
								} else {
									browser.tabs.create({ url: atemp, /* index: tab.index + 1, */ openerTabId: tab.id });
								}
								break;
							// No default
						}
					} else {
						chrome(amenuItemId === TYPE.URI ? "URI/IRI" : "URL", atext);
					}
					break;
				}
				case TYPE.MAIL:
					if (mail) {
						// This encodes too many characters
						const amail = `mailto:${encodeURIComponent(mail)}`;
						if (aamenuItemId) {
							switch (aamenuItemId) {
								case TYPE.DOMAIN: {
									const host = getEmailHost(mail);
									if (host) {
										urls.push(host);
									} else {
										chrome("e-mail address", atext);
									}
									break;
								}
								case TYPE.COPY:
									copyToClipboard(mail, amail);
									break;
								case TYPE.SHARE:
									navigator.share({ title: `Email Address shared with “${TITLE}”`, url: amail });
									break;
								// No default
							}
						} else {
							// browser.compose.beginNew(null, { to: mail });
							browser.tabs.update(tab.id, { url: amail });
						}
					} else {
						chrome("e-mail address", atext);
					}
					break;
				case TYPE.TEL:
					if (tel) {
						const atel = `tel:${tel}`;
						if (aamenuItemId) {
							switch (aamenuItemId) {
								case TYPE.SMS: {
									const sms = `sms:${tel}`;
									browser.tabs.update(tab.id, { url: sms });
									break;
								}
								case TYPE.COPY:
									copyToClipboard(tel, atel);
									break;
								case TYPE.SHARE:
									navigator.share({ title: `Telephone Number shared with “${TITLE}”`, url: atel });
									break;
								// No default
							}
						} else {
							browser.tabs.update(tab.id, { url: atel });
						}
					} else {
						chrome("telephone number", atext);
					}
					break;
			}
			break;
		}
		case TYPE.ALL:
			switch (amenuItemId) {
				case TYPE.URI: {
					const aurls = getURIs(text);
					if (aurls.length) {
						urls.push(...aurls);
					} else {
						console.error("Error: No URIs found", text);
						notification("❌ No URIs found", "The selected text does not contain any valid URIs. This error should only happen in Chrome/Chromium.");
					}
					break;
				}
				case TYPE.MAIL: {
					const mails = getMails(text);
					if (mails.length) {
						// browser.compose.beginNew(null, { to: mails });
						// This encodes too many characters
						if (settings.single) {
							urls.push(`mailto:${mails.map((mail) => encodeURIComponent(mail)).join(",")}`);
						} else {
							urls.push(...mails.map((mail) => `mailto:${encodeURIComponent(mail)}`));
						}
					} else {
						console.error("Error: No e-mail addresses found", text);
						notification("❌ No e-mail addresses found", "The selected text does not contain any valid e-mail addresses. This error should only happen in Chrome/Chromium.");
					}
					break;
				}
			}
			break;
	}

	if (urls.length) {
		if (IS_THUNDERBIRD) {
			for (const url of urls) {
				const uri = new URL(url);
				if (reURL.test(uri.protocol)) {
					// Only supports HTTP and HTTPS URLs: https://bugzilla.mozilla.org/show_bug.cgi?id=1716200
					await thunderbird(url);
				} else if (reMail.test(uri.protocol)) {
					await browser.tabs.update(tab.id, { url });
				} else {
					await browser.tabs.create({ url });
				}
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
					const options = { url, active: aactive, /* index: aindex, */ openerTabId: tab.id };
					if (!IS_CHROME) {
						options.discarded = !aactive && settings.lazy;
					}
					await browser.tabs.create(options);
					// aindex += 1;
					aactive = false;
					if (settings.delay) {
						await delay(settings.delay * 1000);
					}
				}
			} else if (settings.newTab) {
				const options = { url: urls[0], active: aactive, /* index: aindex, */ openerTabId: tab.id };
				if (!IS_CHROME) {
					options.discarded = !aactive && settings.lazy;
				}
				browser.tabs.create(options);
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
		let urls = null;
		let mails = null;

		if (exampleText) {
			const iri = IRIRE.exec(exampleText);
			console.log(iri);
			if (iri) {
				console.assert(!URL.canParse || URL.canParse(exampleText), "Error: Invalid URI");
				uri = new URL(exampleText);
				if (reURL.test(uri.protocol)) {
					// console.log(URLRE.exec(exampleText));
					if (checkURL(exampleText, iri)) {
						url = uri;
					}
				} else {
					url = getURL(exampleText);
				}
			} else {
				url = getURL(exampleText);
				// uri = url;
				mail = getEmail(exampleText);
				tel = getPhone(exampleText);
			}
			urls = getURIs(exampleText);
			mails = getMails(exampleText);
		} else if (linkUrl) {
			console.assert(!URL.canParse || URL.canParse(linkUrl), "Error: Invalid URI");
			uri = new URL(linkUrl);
			if (reURL.test(uri.protocol)) {
				url = uri;
			}
		}

		if (settings.uri) {
			const aid = `${TYPE.LINK}-${TYPE.URI}`;
			const avisible = Boolean(uri) && (!(settings.urls && url) || url.protocol !== uri.protocol || Boolean(linkUrl && !exampleText));
			const addresses = uri && getMail(uri);
			const host = addresses && getEmailHost(addresses);
			const phone = uri && getTel(uri);
			const temp = uri?.href;
			// console.log(settings.uri, uri, settings.urls, url, linkUrl, avisible);
			if (exampleText) {
				menus.update(`${aid}-${TYPE.GO}`, {
					title: `&Go to ${settings.livePreview && temp ? `“${temp.replaceAll("&", "&&")}”` : "“%s”"}`,
					visible: avisible || !settings.urls,
					enabled: avisible
				});
			}
			if (linkUrl) {
				menus.update(`${aid}-${TYPE.LINK}`, {
					title: `&Open Link${settings.livePreview && temp && !exampleText ? ` “${temp.replaceAll("&", "&&")}”` : ""}`,
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
			menus.update(`${aid}-${TYPE.DOMAIN}`, {
				title: `${TAB}Go to ${settings.livePreview && host ? `“${host.replaceAll("&", "&&")}”` : "domain"}`,
				visible: avisible && Boolean(host)
			});
			menus.update(`${aid}-${TYPE.COPY}`, {
				visible: avisible
			});
			menus.update(`${aid}-${TYPE.COPY}-${TYPE.MAIL}`, {
				visible: avisible && Boolean(addresses)
			});
			menus.update(`${aid}-${TYPE.COPY}-${TYPE.TEL}`, {
				visible: avisible && Boolean(phone)
			});
			if (settings.share && navigator.canShare) {
				menus.update(`${aid}-${TYPE.SHARE}`, {
					visible: avisible,
					enabled: avisible && navigator.canShare({ title: `Link shared with “${TITLE}”`, url: temp })
				});
			}
		}
		if (settings.uris) {
			menus.update(`${TYPE.ALL}-${TYPE.URI}`, {
				title: `Open All ${settings.livePreview && urls?.length ? `${numberFormat.format(urls.length)} ` : ""}Links`,
				visible: Boolean(urls?.length) && urls.length > 1
			});
		}
		if (settings.mails) {
			menus.update(`${TYPE.ALL}-${TYPE.MAIL}`, {
				title: `Mail to All ${settings.livePreview && mails?.length ? `${numberFormat.format(mails.length)} ` : ""}Addresses`,
				visible: Boolean(mails?.length) && mails.length > 1
			});
		}
		if (settings.urls) {
			const aid = `${TYPE.LINK}-${TYPE.URL}`;
			const avisible = Boolean(url) && (Boolean(exampleText) || !(settings.uri && uri));
			const temp = url?.href;
			// console.log(settings.uri, uri, settings.urls, url, avisible);
			if (exampleText) {
				menus.update(`${aid}-${TYPE.GO}`, {
					title: settings.livePreview && temp ? `&Go to “${temp.replaceAll("&", "&&")}”` : "&Go to “%s”",
					enabled: avisible
				});
			}
			if (linkUrl) {
				menus.update(`${aid}-${TYPE.LINK}`, {
					title: `&Open Link${settings.livePreview && temp && !exampleText ? ` “${temp.replaceAll("&", "&&")}”` : ""}`,
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
					enabled: avisible && navigator.canShare({ title: `Link shared with “${TITLE}”`, url: temp })
				});
			}
			if (!IS_THUNDERBIRD) {
				menus.update(`${aid}-${TYPE.SOURCE}`, {
					visible: Boolean(temp)
				});
			}
		}
		if (settings.mail) {
			const aid = `${TYPE.LINK}-${TYPE.MAIL}`;
			const host = mail && getEmailHost(mail);
			menus.update(aid, {
				title: settings.livePreview && mail ? `&Mail to “${mail.replaceAll("&", "&&")}”` : "&Mail to “%s”",
				enabled: Boolean(mail)
			});
			menus.update(`${aid}-${TYPE.DOMAIN}`, {
				title: `${TAB}Go to ${settings.livePreview && host ? `“${host.replaceAll("&", "&&")}”` : "domain"}`,
				visible: Boolean(host)
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
				id: `${aid}-${TYPE.DOMAIN}`,
				title: `${TAB}Go to domain`,
				contexts: ["selection", "link"]
			});
			await menus.create({
				id: `${aid}-${TYPE.COPY}`,
				// title: `${TAB}&Copy Link location`, // Thunderbird
				// title: `${TAB}Copy &Link address`, // Chrome
				title: IS_THUNDERBIRD ? `${TAB}&Copy Link` : `${TAB}Copy &Link`,
				contexts: ["selection", "link"]
			});
			await menus.create({
				id: `${aid}-${TYPE.COPY}-${TYPE.MAIL}`,
				title: IS_THUNDERBIRD ? `${TAB}${TAB}Copy &Email Address` : `${TAB}${TAB}Copy Emai&l Address`,
				contexts: ["selection", "link"]
			});
			await menus.create({
				id: `${aid}-${TYPE.COPY}-${TYPE.TEL}`,
				title: `${TAB}${TAB}C&opy Phone Number`,
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
				id: `${TYPE.ALL}-${TYPE.URI}`,
				title: "Open All Links",
				contexts: ["selection"]
			});
		}
		if (settings.mails) {
			await menus.create({
				id: `${TYPE.ALL}-${TYPE.MAIL}`,
				title: IS_THUNDERBIRD ? "Compose Message to All Addresses" : "Mail to All Addresses",
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
			if (!IS_THUNDERBIRD) {
				await menus.create({
					id: `${aid}-${TYPE.SOURCE}`,
					title: `${TAB}&View Source`,
					contexts: ["selection", "link"]
				});
			}
		}
		if (settings.mail) {
			const aid = `${TYPE.LINK}-${TYPE.MAIL}`;
			await menus.create({
				id: aid,
				title: IS_THUNDERBIRD ? "Compo&se Message to" : "&Mail to",
				contexts: ["selection"]
			});
			await menus.create({
				id: `${aid}-${TYPE.DOMAIN}`,
				title: `${TAB}Go to domain`,
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
				title: `${TAB}C&opy Phone Number`,
				contexts: ["selection"]
			});
			if (settings.share && navigator.canShare) {
				await menus.create({
					id: `${aid}-${TYPE.SHARE}`,
					title: `${TAB}Share Phone Number`,
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
 * @param {number} [retry]
 * @returns {Promise<void>}
 */
function getPSL(date, retry = 0) {
	console.time(label);
	const url = "https://publicsuffix.org/list/public_suffix_list.dat";
	console.log(url);
	return fetch(url).then(async (response) => {
		if (response.ok) {
			const text = await response.text();
			// console.log(text);

			console.timeLog(label);

			const PSL = Object.freeze(text.split("\n").map((r) => r.trim()).filter((r) => r.length && !r.startsWith("//")));
			console.log(PSL.length, new Date(date));

			browser.storage.local.set({ PSL: { PSL, date } });

			console.timeLog(label);

			parsePSL(PSL);
		} else {
			console.error(response);
		}

		console.timeEnd(label);
	}).catch(async (error) => {
		if (retry >= 2) {
			throw error;
		}
		console.error(error);
		await delay((1 << retry) * 1000);
		return getPSL(date, retry + 1);
	});
}

/**
 * Traverse Trie tree of objects to create RegEx.
 *
 * @param {Object.<string, Object|boolean>} tree
 * @returns {string}
 */
function createRegEx(tree) {
	const alternatives = [];
	const characterClass = [];

	for (const char in tree) {
		if (char) {
			const atree = tree[char];
			if ("" in atree && Object.keys(atree).length === 1) {
				characterClass.push(char);
			} else {
				const recurse = createRegEx(atree);
				alternatives.push(recurse + char);
			}
		}
	}

	if (characterClass.length) {
		alternatives.push(characterClass.length === 1 ? characterClass[0] : `[${characterClass.join("")}]`);
	}

	let result = alternatives.length === 1 ? alternatives[0] : `(?:${alternatives.join("|")})`;

	if ("" in tree) {
		if (characterClass.length || alternatives.length > 1) {
			result += "?";
		} else {
			result = `(?:${result})?`;
		}
	}

	return result;
}

/**
 * Convert public suffix list into Trie tree of objects.
 *
 * @param {string[]} arr
 * @returns {string}
 */
function createTree(arr) {
	const tree = {};

	arr.sort((a, b) => b.length - a.length);

	for (const str of arr) {
		let temp = tree;

		for (const char of Array.from(punycode(str.replaceAll("*", "---")).replaceAll("---", "*")).reverse()) {
			if (!(char in temp)) {
				temp[char] = {};
			}
			temp = temp[char];
		}

		// Leaf node
		temp[""] = true;
	}

	Object.freeze(tree);
	return createRegEx(tree).replaceAll(".", String.raw`\.`).replaceAll("*", "[^.]+");
}

/**
 * Parse public suffix list and create regular expressions.
 *
 * @param {readonly string[]} PSL
 * @returns {void}
 */
function parsePSL(PSL) {
	const start = performance.now();
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

	suffixes = createTree(suffixes);
	exceptions = createTree(exceptions);

	console.log(suffixes, exceptions);

	suffixes = new RegExp(String.raw`(?:^|\.)(${suffixes})$`, "u");
	exceptions = new RegExp(String.raw`(?:^|\.)(${exceptions})$`, "u");

	// console.log(suffixes, exceptions);
	const end = performance.now();
	console.log(`The PSL was parsed in ${end - start} ms.`);
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
	settings.mails = asettings.mails;
	settings.https = asettings.https;
	settings.share = asettings.share;
	settings.single = asettings.single;
	settings.newTab = false;
	settings.newWindow = false;
	settings.private = false;
	switch (Number.parseInt(asettings.disposition, 10)) {
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
				const { PSL } = item;

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

browser.runtime.onInstalled.addListener((details) => {
	console.log(details);

	const manifest = browser.runtime.getManifest();
	switch (details.reason) {
		case "install":
			notification(`🎉 ${manifest.name} installed`, `Thank you for installing the “${TITLE}” add-on!\nVersion: ${manifest.version}\n\nOpen the options/preferences page to configure this extension.`);
			break;
		case "update":
			if (settings.send) {
				browser.notifications.create({
					type: "basic",
					iconUrl: browser.runtime.getURL("icons/icon_128.png"),
					title: `✨ ${manifest.name} updated`,
					message: `The “${TITLE}” add-on has been updated to version ${manifest.version}. Click to see the release notes.\n\n❤️ Huge thanks to the generous donors that have allowed me to continue to work on this extension!`
				}).then(async (notificationId) => {
					let url = "";
					if (browser.runtime.getBrowserInfo) {
						const browserInfo = await browser.runtime.getBrowserInfo();

						url = browserInfo.name === "Thunderbird" ? `https://addons.thunderbird.net/thunderbird/addon/link-creator/versions/${manifest.version}` : `https://addons.mozilla.org/firefox/addon/link-creator/versions/${manifest.version}`;
					}
					if (url) {
						notifications.set(notificationId, url);
					}
				});
			}
			break;
	}
});

browser.runtime.setUninstallURL("https://forms.gle/M4KvDiA5GopzKeuCA");
