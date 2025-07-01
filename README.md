[![Actions Status](https://github.com/tdulcet/Link-Creator/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/tdulcet/Link-Creator/actions/workflows/ci.yml)

# Link Creator
Open selected URIs, URLs, e-mail addresses, telephone numbers and links

Copyright © 2021 Teal Dulcet

![](icons/logo.png)

Firefox, Chromium and Thunderbird add-on/WebExtension to open selected URIs, URLs, email addresses, telephone numbers and links.

* \*Allows opening arbitrary URIs
* Allows opening URLs
	* Supports the optional HTTP/HTTPS and FTP protocols
* Allows opening e-mail addresses (uses the `mailto:` URI)
	* Supports [munged addresses](https://en.wikipedia.org/wiki/Address_munging), such as those of the form `example [at] example [dot] com`
* \*Allows calling and messaging telephone numbers (uses the `tel:` and `sms:` URIs)
	* Automatically converts letters to numbers
* Allows opening multiple URIs or e-mail addresses
* Allows copying the formatted URI, URL, email address or telephone number to your clipboard
* Allows copying the [short URL](https://microformats.org/wiki/rel-shortlink) on supported websites (Firefox and Chrome only)
* Allows viewing the source of URLs (uses the `view-source:` URI)
* Supports [Internationalized domain names](https://en.wikipedia.org/wiki/Internationalized_domain_name) (IDNs), [IRIs](https://en.wikipedia.org/wiki/Internationalized_Resource_Identifier) and [International email](https://en.wikipedia.org/wiki/International_email) addresses
* Shows a live preview of the link(s) that would open
* Supports opening links in the current tab, a new tab (default), a new window or a new private/incognito window (Firefox and Chrome only)
* Supports lazy loading tabs (Firefox and Chrome only)
* Fully compliant with the respective URI/IRI, URL and email address RFC standards, including the errata
* Checks that URL and e-mail address hostnames have a valid public suffix using Mozilla's [Public Suffix List](https://publicsuffix.org/) (PSL)
* The PSL is automatically downloaded and updated directly, without needing to update the entire extension
	* This allows users to enjoy much faster and more frequent updates and thus more accurate information
* Supports URLs and e-mail addresses with [IPv4](https://en.wikipedia.org/wiki/IPv4) and [IPv6](https://en.wikipedia.org/wiki/IPv6) addresses
	* Supports IPv4 addresses in dotted octal, decimal and hexadecimal notations/formats
	* Supports IPv4-mapped, IPv4-compatible and IPv4-embedded IPv6 addresses
* Supports the light/dark mode of your system automatically
* Settings automatically synced between all browser instances and devices (Firefox and Chrome only)
* Follows the [Firefox](https://design.firefox.com/photon) and [Thunderbird](https://style.thunderbird.net/) Photon Design
* Context menu items have access keys

❤️ Please visit [tealdulcet.com](https://www.tealdulcet.com/) to support this extension and my other software development.

\* Requires supported program

## Download

* [Addons.mozilla.org](https://addons.mozilla.org/firefox/addon/link-creator/) (AMO)
* [Addons.thunderbird.net](https://addons.thunderbird.net/thunderbird/addon/link-creator/) (ATN)

## Install from source

Clone the repository:
```bash
git clone --recurse-submodules https://github.com/tdulcet/Link-Creator.git
```

### Firefox

Follow [these instructions](https://extensionworkshop.com/documentation/develop/temporary-installation-in-firefox/) to install it in Firefox

### Thunderbird

1. Rename the [thunderbirdmanifest.json](thunderbirdmanifest.json) file to `manifest.json`
2. Follow [these instructions](https://developer.thunderbird.net/add-ons/hello-world-add-on#installing) to install it in Thunderbird

### Chromium/Chrome

1. Download the [webextension-polyfill](https://github.com/mozilla/webextension-polyfill) (specifically download the `browser-polyfill.js` file [from here](https://unpkg.com/webextension-polyfill/dist/))
2. Rename the [chromemanifest.json](chromemanifest.json) file to `manifest.json`
3. Follow [these instructions](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world) to install it in Chromium/Chrome

## Other Extensions

* [URL Link](https://github.com/fnxweb/urllink) (Firefox and Thunderbird)
* [Text Link](https://github.com/piroor/textlink) (Firefox)
* [Copy ShortURL](https://github.com/fwenzel/copy-shorturl) (Firefox)
* [Link to Text Fragment](https://github.com/GoogleChromeLabs/link-to-text-fragment) (Chrome, Firefox and Safari)

## Contributing

Pull requests welcome! Ideas for contributions:

* Convert to [Manifest V3](https://extensionworkshop.com/documentation/develop/manifest-v3-migration-guide/) (MV3)
* Refactor into more modules
* Add a test suite for the regular expressions
* Support creating [Text Fragment](https://developer.mozilla.org/docs/Web/URI/Fragment/Text_fragments) links (see [bug 1753933](https://bugzilla.mozilla.org/show_bug.cgi?id=1753933))
* Support more than one top level context menu item (see [bug 1294429](https://bugzilla.mozilla.org/show_bug.cgi?id=1294429))
* Support directly opening arbitrary URIs in Thunderbird (see [bug 1716200](https://bugzilla.mozilla.org/show_bug.cgi?id=1716200) and [bug 1828110](https://bugzilla.mozilla.org/show_bug.cgi?id=1828110))
* Support directly opening `data:` and other privileged URIs in Firefox (see [bug 1317166](https://bugzilla.mozilla.org/show_bug.cgi?id=1317166) and [bug 1269456](https://bugzilla.mozilla.org/show_bug.cgi?id=1269456))
* Support directly opening URLs in a private/incognito window in Firefox from Thunderbird (see [bug 1828089](https://bugzilla.mozilla.org/show_bug.cgi?id=1828089))
* Support e-mail addresses in the message header and compose window in Thunderbird
* Get the suffixes directly from the browser instead of downloading the PSL (see [bug 1315558](https://bugzilla.mozilla.org/show_bug.cgi?id=1315558))
* Support removing tracking parameters from URLs (see [bug 1899275](https://bugzilla.mozilla.org/show_bug.cgi?id=1899275))
* Improve the performance
* Sync settings in Thunderbird (see [bug 446444](https://bugzilla.mozilla.org/show_bug.cgi?id=446444))
* Support Firefox for Android (see [bug 1595822](https://bugzilla.mozilla.org/show_bug.cgi?id=1595822))
* Localize the add-on
