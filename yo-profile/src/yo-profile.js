'use strict';
var _ = require( 'lodash' ),
	rc = require( 'rc' );

// Specify defaults - all are `undefined` to flag they don't exist
var options = {
	'license'  : undefined,
	'humanstxt': undefined,
	'namespace': undefined,
	'php_min'  : undefined,
	'wp_tested': undefined,
	'wp_min'   : undefined
};

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
	_.extend( options, config[ profile ] );
}

// Export the final object
module.exports = options;