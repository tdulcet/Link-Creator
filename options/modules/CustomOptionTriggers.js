/**
 * This modules contains the custom triggers for some options that are added.
 *
 * @module modules/CustomOptionTriggers
 */

import * as AutomaticSettings from "/common/modules/AutomaticSettings/AutomaticSettings.js";

// communication type
const BACKGROUND = "background";

/**
 * Apply the new settings.
 *
 * @private
 * @param  {Object} optionValue
 * @param  {string} [option]
 * @param  {Object} [event]
 * @returns {void}
 */
function apply(optionValue) {
	// trigger update for current session
	browser.runtime.sendMessage({
		type: BACKGROUND,
		optionValue
	});
}

/**
 * Binds the triggers.
 *
 * This is basically the "init" method.
 *
 * @returns {Promise<void>}
 */
export async function registerTrigger() {
	AutomaticSettings.Trigger.registerSave("settings", apply);

	// Thunderbird
	if (globalThis.messenger) {
		document.getElementById("currentTab").disabled = true;
		document.getElementById("newWindow").disabled = true;
		document.getElementById("private").disabled = true;
		document.getElementById("background").disabled = true;
		document.getElementById("lazy").disabled = true;
	} else {
		const isAllowed = await browser.extension.isAllowedIncognitoAccess();

		if (!isAllowed) {
			document.getElementById("private").disabled = true;
		}
	}
}
