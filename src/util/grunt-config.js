/**
 * This file defines the grunt-config helper for creating an AST config object.
 *
 * The object itself is an AST-Config object, but it is set up specifically to
 * work well with the default Gruntfile object in WP Make. This makes the
 * get and set config methods on the AST-Config object work well for the
 * Gruntfile config specifically.
 */

// Require dependencies
import ASTConfig from './ast-config.js';

/**
 * Export the function for creating a Gruntfile flavored AST config.
 *
 * @param  {String} contents The stringified Gruntfile contents.
 * @return {Object}          The AST-Config object for the Gruntfile.
 */
export default ( contents, AST = ASTConfig ) => new AST( contents, {
	type: 'gruntfile',
	query: 'gruntConfig',
	queryMethod: 'callExpression',
	filter: val => val.arguments.at( 1 )
} );
