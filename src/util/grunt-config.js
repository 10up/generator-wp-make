/**
 * This file defines the grunt-config helper for creating an AST config object.
 *
 * The object itself is an AST-Config object, but it is set up specifically to
 * work well with the default Gruntfile object in WP Make. This makes the
 * get and set config methods on the AST-Config object work well for the
 * Gruntfile config specifically.
 */

// Require dependencies
var Tree = require( './ast-config.js' );

/**
 * Export the function for creating a Gruntfile flavored AST config.
 *
 * @param  {String} contents The stringified Gruntfile contents.
 * @return {Object}          The AST-Config object for the Gruntfile.
 */
module.exports = function( contents ) {
	return new Tree( contents, {
		type: 'gruntfile',
		query: 'gruntConfig',
		queryMethod: 'callExpression',
		filter: filter,
	} );
};

/**
 * Filters the get and set config values to the correct location in the AST.
 *
 * @param  {Object} value The basic AST.
 * @return {Object}       The AST config filtered to the correct config value.
 */
function filter( value ) {
	return value.arguments.at( 1 );
}
