'use strict';
import _ from 'lodash';
import rc from 'rc';

// Specify defaults - all are `undefined` to flag they don't exist
var options = {
	'license'       : undefined,
	'humanstxt'     : undefined,
	'root_namespace': undefined,
	'php_min'       : undefined,
	'wp_tested'     : undefined,
	'wp_min'        : undefined
};

class YoProfile {
	constructor() {
		this._props = {};
	}

	load( defaults ) {
		// Parse the stored config
		var config = rc( 'wpmake' );

		var profile = undefined;
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

		return this;
	}

	get properties() {
		return this._props;
	}
}

export default YoProfile;