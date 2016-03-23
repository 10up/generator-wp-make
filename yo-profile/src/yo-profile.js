'use strict';
import _ from 'lodash';
import rc from 'rc';

/**
 * Object representing a profile loader
 */
class YoProfile {
	/**
	 * Instantiate the object and set the internal collection with an empty object
	 */
	constructor() {
		this._props = {};
	}

	/**
	 * Load the actual rc file into memory and parse it with specific defaults.
	 *
	 * @param {Object} defaults Default profile properties
	 * @param {String} [file]   Optional file name - defaults to `yoprofile` if not specified
	 *
	 * @returns {YoProfile}
	 */
	load( defaults, file ) {
		if ( undefined === file ) {
			file = 'yoprofile';
		}

		// Parse the stored config
		let config = rc( file );

		let profile;
		if ( undefined !== config.profile ) {
			// The profile is explicitly set
			profile = config.profile;
		} else if ( undefined !== config.default ) {
			profile = config.default;
		}

		// If we're specifying a profile, fetch that profile
		if ( undefined !== profile && undefined !== config[ profile ] ) {
			_.extend( defaults, config[ profile ] );
		}

		this._props = defaults;

		// Return the current instance for chaining
		return this;
	}

	/**
	 * Define a property fetcher to expose the internal collection.
	 *
	 * @returns {Object}
	 */
	get properties() {
		return this._props;
	}
}

// Export the module
export default YoProfile;