/**
 * This file defines mixins for assistance in walking the lifecycle tree.
 */

// Require dependencies
import path from 'path';

/**
 * The tree to walk and apply methods to.
 *
 * This function will walk the passed tree object, typically the lifecycle tree,
 * and apply functions to it's different sections depending on the passed
 * methods hash.
 *
 * The methods hash will be key => function pairs.
 *
 * To process all of the 'json' objects for example, pass this for methods:
 *
 *     {
 *     	json: function( specificObject, location ) {
 *     		//do stuff on each JSON object
 *     	}
 *     }
 *
 * This will then walk the tree and run that function on each JSON object. The
 * location parameter passed will be a filepath notated string telling you where
 * in the tree object the specific object is located.
 *
 * This function is used to walkt the lifecycle tree and output all of the files
 * but can be used for other bulk object processing as well.
 *
 * In the methods array, in addition to passing property keys, you can also pass
 * `_pre` and `_post` processing methods. These will run on each tree level
 * before processing any of the items at that level of the tree. The `_pre` and
 * `_post` function will be passed the tree object, and the current directory.
 *
 * @param  {Object} root    The tree object to traverse.
 * @param  {Object} methods A mapping of tree keys to processing functions.
 * @param  {String} dir     The root directory of this tree object.
 * @return {void}
 */
export function tree ( root, methods, dir = '' ) {
	const keys = Object.keys( methods )
		// Make sure all the methods are actually functions.
		.filter( type => typeof methods[ type ] === 'function' );

	// Call pre processor if one is set.
	if ( keys.indexOf( '_pre' ) !== -1 ) {
		methods._pre.call( this, root, dir );
	}

	// Process methods that were passed
	keys
		// Don't process _pre and _post here
		.filter( type => ['_pre', '_post'].indexOf( type ) === -1 )
		// Don't process for branches that are empty
		.filter( type => !! root[ type ] )
		// Get the file names and content and method for each branch type
		.map( type => ({
			type,
			files: root[ type ],
			method: methods[ type ]
		}) )
		// create a new object running the method over each file.
		.map( (branch) => {
			root[ branch.type ] = Object.keys( branch.files )
				// Create an array of objects with name and content keys.
				// Makes for easier processing.
				.reduce( ( files, name ) => {
					return files.concat({
						name,
						method: branch.method,
						source: branch.files[ name ] });
				}, [] )
				// Run the method, and if not undefined, assign the result back
				// Create a new object to replace branch.files
				.reduce( ( files, { method, name, source } ) => {
					const result = method.call(
						this,
						source,
						path.join( dir, name )
					);
					files[ name ] = result === undefined ? source : result;
					return files;
				}, {} );
		} );

	// Call post processor if one is set.
	if ( keys.indexOf( '_post' ) !== -1 ) {
		methods._post.call( this, root, dir );
	}

	// Recursively run for subdirectories, key as the folder name.
	if ( typeof root.tree === 'object' ) {
		Object.keys( root.tree )
			.map( branchKey => [
				root.tree[ branchKey ],
				methods,
				path.join( dir, branchKey )
			] )
			.map( branch => tree.apply( this, branch ) );
	}
}

/**
 * Gets a specific subtree item using file-path notation to walk the tree.
 *
 * It's a little verbose to walk the tree object when you need to get a specific
 * object for additional processing. This method abstracts some of that away by
 * allowing you to specify the object location in the tree as if it were a file
 * path. Path is optional and if omitted, the root of the tree is assumed.
 *
 * If any part of the path requested path doesn't exist, it will be created. In
 * this way, you can use the getSubtree function to help create pieces of the
 * lifecycle tree.
 *
 * The return will be the object full of the type you requested. If you request
 * the root json object for example `this.getSubtree( 'json' );` it will return
 * the full JSON object with filename: value mappings. You can then mutate a
 * specific file, or add one.
 *
 * @param  {String} type The object type to get (json, modules, templates, etc.)
 * @param  {String} path The path in the tree represented as a file path string.
 * @return {Object}      The tree object at that location of the requested type.
 */
export function getSubtree ( type, path = '' ) {
	const subTree = path.split( '/' )
		.reduce( ( branch, subPath ) => {
			// If there is no subPath, just send back the branch.
			if ( subPath === '' ) {
				return branch;
			}
			// If there is no branch tree, create it.
			branch.tree = branch.tree || {};
			// If the subPath doesn't exist in the subTree tree, create it.
			branch.tree[ subPath ] = branch.tree[ subPath ] || {};
			// Send back the subTree Tree's subPath
			return branch.tree[ subPath ];
		}, this.lifecycle.tree );

	// If the requested type doesn't exist in this subTree, create it.
	subTree[ type ] = subTree[ type ] || {};

	return subTree[ type ];
}

// Export the mixin as an object.
export default {
	tree,
	getSubtree
};
