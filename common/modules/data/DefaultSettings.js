/**
 * Specifies the default settings of the add-on.
 *
 * @module data/DefaultSettings
 */

/**
 * An object of all default settings.
 *
 * @private
 * @const
 * @type {Object}
 */
const defaultSettings = {
	settings: {
		urls: true,
		mail: true,
		tel: true,
		uri: true,
		uris: true,
		mails: true,
		short: true,
		https: false,
		share: false,
		single: true,
		suffix: true,
		disposition: "2",
		background: true,
		lazy: false,
		livePreview: true,
		delay: 0, // Seconds
		send: true
	}
};

// freeze the inner objects, this is strongly recommend
Object.values(defaultSettings).map(Object.freeze);

/**
 * Export the default settings to be used.
 *
 * @public
 * @const
 * @type {Object}
 */
export const DEFAULT_SETTINGS = Object.freeze(defaultSettings);
