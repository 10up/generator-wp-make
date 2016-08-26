/**
 * This file defines a mixin for helping with prompting the user for input.
 *
 * These prompts will be defined in the `lifecycle.prompts` property of the
 * lifecycle object. These will be standard yeoman style prompt definitions,
 * except that they support tree-based logic in asking questions.
 */

// Require dependencies
var YeomanBase = require( 'yeoman-generator' ).Base;
var _ = require( 'lodash' );

/**
 * Prompts users for input and records the results.
 *
 * This method allows the prompt portion of the lifecycle to have some extra
 * tools beyond standard yeoman prompts. On any prompt, you can define a prompt
 * "tree" by adding a tree property to the prompt object. Inside the tree, the
 * keys will correspond to the stringified answer of the prompt, and the value
 * will be a new set of prompts based on that input.
 *
 * For instance, if you wanted to ask an additional question if the user said
 * no to a boolean query, you could write it like this:
 *
 *     {
 *     	type:    'confirm',
 *     	name:    'sass',
 *     	message: 'Use Sass?',
 *     	default: true,
 *     	tree: {
 *     		'false': [{
 *     			type:    'confirm',
 *     			name:    'autoprefixer',
 *     			message: 'Use Autoprefixer?',
 *     			default: true
 *     		}]
 *     	}
 *     }
 *
 * This allows for more complex logic trees in your prompts for gathering data
 * than is possible by the normal Yeoman prompts.
 *
 * @param  {Array}   prompts  An array of Yoeman style prompt questions.
 * @return {Promise}          A promise that will resolve to the answered q's.
 */
function prompt ( prompts ) {
	var data, key, i = 0, length = prompts.length;
	var recordProps = function ( props ) {
		data = _.assign( data || {}, props );
		key = ( prompts[ i ].tree ) ? String( data[ prompts[ i ].name ] ) : false;
		if ( false !== key && prompts[ i ].tree[ key ] ) {
			return this.prompt( prompts[ i ].tree[ key ] ).then( function ( subData ) {
				return _.assign( data, subData );
			}.bind( this ) );
		}
		if ( ++i < length ) {
			return YeomanBase.prototype.prompt.call(this, prompts[ i ] ).then( recordProps );
		} else {
			return data;
		}
	}.bind( this );

	return YeomanBase.prototype.prompt.call( this, prompts[ i ] ).then( recordProps );
}

// Export the mixin.
module.exports = {
	prompt: prompt
};
