/**
 * This file defines a mixin for helping with prompting the user for input.
 *
 * These prompts will be defined in the `lifecycle.prompts` property of the
 * lifecycle object. These will be standard yeoman style prompt definitions,
 * except that they support tree-based logic in asking questions.
 */

// Require dependencies
var YeomanBase = require( 'yeoman-generator' ).generators.Base;
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
 * @param  {Array}    prompts  An array of Yoeman style prompt questions.
 * @param  {Function} callback A callback to run when all the data is collected.
 * @return {void}
 */
function prompt ( prompts, callback ) {
	var data, key,
		i = 0, length = prompts.length,
		done = this.async();

	var finish = function() {
		if( i === prompts.length - 1 ) {
			callback( data );
			done();
		} else {
			i++;
			YeomanBase.prototype.prompt.call( this, prompts[ i ], recordProps );
		}
	}.bind( this );

	var recordProps = function ( props, callback ) {
		data = _.extend( data || {}, props );
		key = ( prompts[ i ].tree ) ? String( data[ prompts[ i ].name ] ) : false;
		if ( false !== key && prompts[ i ].tree[ key ] ) {
			this.prompt( prompts[ i ].tree[ key ], function ( subData ) {
				data = _.extend( data, subData );
				finish();
			}.bind( this ) );
		} else {
			finish();
		}
	}.bind( this );

	YeomanBase.prototype.prompt.call( this, prompts[ i ], recordProps );
}

// Export the mixin.
module.exports = {
	prompt: prompt
};
