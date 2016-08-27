/**
 * This file defines a mixin for helping with prompting the user for input.
 *
 * These prompts will be defined in the `lifecycle.prompts` property of the
 * lifecycle object. These will be standard yeoman style prompt definitions,
 * except that they support tree-based logic in asking questions.
 */

// Require dependencies
import Yeoman from 'yeoman-generator';
const ymPrompt = Yeoman.Base.prototype.prompt;

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
export function prompt ( prompts, seed = {}, inquire = ymPrompt ) {
	const query = new Promise(resolve => resolve( seed ));
	var gatherData = ( data ) => {
		if ( prompts.length <= 0 ) {
			return data;
		}
		const question = prompts.shift();
		return inquire.call( this, question ).then( ( newData ) => {
			// Mix the new data into the main data.
			Object.assign( data, newData );
			// Get the stringified value of the question that was just asked.
			const treeKey = String( newData[Object.keys(newData)[0]] );
			// Walk the tree if needed, otherwise send back the data
			return question.tree && question.tree[ treeKey ]
				? prompt.call( this, question.tree[ treeKey ], data, inquire )
				: data;
		} ).then( gatherData );
	};
	return query.then( gatherData );
}

export default {
	prompt: prompt
};
