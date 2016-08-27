/**
 * This file defines an object controlling AST-Query object for simpler config.
 *
 * AST-Query is still a little rough and hard to use. This makes grabbing and
 * setting a specific configuration object a little easier. Configuration being
 * something like an object sent out in `module.exports` or the Grunt config
 * object.
 */

// Require dependencies
var util = require( 'util' );
var _ = require( 'lodash' );
var Tree = require( 'ast-query' );

/**
 * Constructor for the Config object, wrapping an AST-Query object.
 *
 * @param  {String} contents The string contents of a JS file.
 * @param  {Object} opts     Controls how queries are made and basic formatting.
 * @return {Object}          The Config object.
 */
function Config( contents, opts ) {
	this.opts = _.defaults(
		opts || {},
		{
			type: 'module',
			query: 'module.exports',
			queryMethod: 'assignment',
			filter: _.identity,
			formatOpts: {
				format: {
					indent: {
						style: '\t',
						adjustMultilineComment: true
					}
				}
			}
		}
	);

	this.jsFile = new Tree( String( contents ), this.opts.formatOpts );
}

/**
 * Gets the defined options object inside the AST and returns it.
 *
 * @return {mixed} Some kind of AST object, type can vary.
 */
Config.prototype.getOptions = function () {
	return this.opts.filter( this.jsFile[ this.opts.queryMethod ]( this.opts.query ) );
};

/**
 * Sets the defined configuration to the passed object.
 *
 * The passed object will be turned into a string and sent back into the AST.
 *
 * @param {mixed} options The item to return to the AST, usually a string.
 * @return {void}
 */
Config.prototype.setOptions = function ( options ) {
	// Stringify what was sent if needed.
	if ( ! _.isString( options ) ) {
		options = util.inspect( options, { depth: null } );
	}
	this.opts.filter( this.jsFile[ this.opts.queryMethod ]( this.opts.query ) ).value( options );
};

/**
 * Gets the raw AST-Query object and returns it.
 *
 * @return {Object} The AST-Query object.
 */
Config.prototype.getAST = function() {
	return this.jsFile;
};

/**
 * Turns the AST object into into a JS code string.
 *
 * @return {String} The stringified JS code.
 */
Config.prototype.toString = function() {
	return this.jsFile.toString();
};

// Export this object for use.
module.exports = Config;
