/**
 * This file defines an object controlling AST-Query object for simpler config.
 *
 * AST-Query is still a little rough and hard to use. This makes grabbing and
 * setting a specific configuration object a little easier. Configuration being
 * something like an object sent out in `module.exports` or the Grunt config
 * object.
 */

// Require dependencies
import util from 'util';
import astQuery from 'ast-query';

export default class Config {
	/**
	 * Constructor for the Config object, wrapping an AST-Query object.
	 *
	 * `contents` is the contents that will be passed to the AST constructor.
	 * It will typically be a string of JS, such as you could run through
	 * something like `eval()` and have it work. But the JS will be stringified
	 * even if a raw object is passed as an example.
	 *
	 * `options` is a little more tricky. With options there is control over
	 * what the deafult object is, as well as basic control over formatting.
	 *
	 * To control the default location in the AST, you can pass a `query`,
	 * `queryMethod`, and `filter` function. These work to call methods on the
	 * AST-Query object to fetch a certain item location from the structured
	 * AST object. `queryMethod` defines what type of query is executed against
	 * the AST. `query` corresponds with the value passed to the query method.
	 * Finally after recieving the results from the query, filter allows the
	 * walking the returned object to the specific item desired. All of this
	 * makes use of the methods available in the AST Query package. See the
	 * [AST Query Docs]{@link https://github.com/SBoudrias/AST-query} for more
	 * more information.
	 *
	 * `formatOpts` allows defining the formatting options that will be passed
	 * to the AST query object and takes effect when it is turned into a string.
	 * This options object is formatted for and passed to
	 * [ESCodeGen]{@link https://github.com/estools/escodegen/wiki/API#options}
	 *
	 * @param  {String} contents The string contents of a JS file.
	 * @param  {Object} opts     Controls default queries and basic formatting.
	 * @return {Object}          The Config object.
	 */
	constructor ( contents, opts, ast = astQuery ) {
		// Set up options with defaults.
		const options = Object.assign(
			{
				type: 'module',
				query: 'module.exports',
				queryMethod: 'assignment',
				formatOpts: {
					format: {
						indent: {
							style: '\t',
							adjustMultilineComment: true
						}
					}
				}
			},
			opts || {}
		);

		// Set up object values.
		this.type = options.type;
		this.query = options.query;
		this.queryMethod = options.queryMethod;
		if ( options.filter && typeof options.filter === 'function' ) {
			this.filter = options.filter;
		} else {
			this.filter = val => val;
		}
		this.ast = ast( String( contents ), options.formatOpts, {
			sourceType: 'module'
		} );
	}

	/**
	 * Gets the defined default location inside the AST and returns it.
	 *
	 * @return {mixed} An AST object, type can vary.
	 */
	getDefault () {
		return this.filter( this.ast[ this.queryMethod ]( this.query ) );
	}

	/**
	 * Sets the defined default location to the new passed value.
	 *
	 * The passed value will be stringified and assigned into the AST at the
	 * default location.
	 *
	 * @param {mixed} options The item to return to the AST, usually a string.
	 * @return {void}
	 */
	setDefault ( newVal ) {
		// Stringify what was sent if needed.
		if ( typeof newVal !== 'string' ) {
			newVal = util.inspect( newVal, { depth: null } );
		}
		// Set the default value to the new string.
		this.getDefault().value( newVal );
	}

	/**
	 * Turns the AST object into into a JS code string.
	 *
	 * @return {String} The stringified JS code.
	 */
	toString () {
		return this.ast.toString();
	}
}
