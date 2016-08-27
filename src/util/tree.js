/**
 * This file defines mixins for assistance in walking the lifecycle tree.
 */

// Require dependencies
var _ = require( 'lodash' );
var path = require( 'path' );

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
 * @param  {Object} tree    The tree object to traverse.
 * @param  {Object} methods A mapping of tree keys to processing functions.
 * @param  {String} dir     The root directory of this tree object.
 * @return {void}
 */
function tree ( tree, methods, dir ) {
	var child, type, fn, _pre, _post;
	dir = dir || '';

	// Make sure tree is actually an object.
	if ( 'object' !== typeof tree ) {
		throw new Error( 'trees must be objects.' );
	}

	// Call pre processor if one is set.
	if ( methods._pre ) {
		methods._pre.call( this, tree, dir );
	}

	// Process methods that were passed
	for ( type in methods ) {
		if ( '_pre' === type || '_post' === type ) {
			continue;
		}
		if ( tree[ type ] ) {
			fn = methods[ type ].bind( this );
			_.each( tree[ type ], processor );
		}
	}

	// Call post processor if one is set.
	if ( methods._post ) {
		methods._post.call( this, tree, dir );
	}

	// Recursively run for subdirectories, key as the folder name.
	if ( 'object' === typeof tree.tree ) {
		for ( child in tree.tree ) {
			this.tree( tree.tree[ child ], methods, path.join( dir, child ) );
		}
	}

	/**
	 * Closured function for bulk processing wp make lifecycle trees.
	 *
	 * @param  {Mixed}  data Data for the tree, could be whatever is required.
	 * @param  {String} name The location in the tree represented as a directory path.
	 * @return {void}
	 */
	function processor ( data, name ) {
		fn( data, path.join( dir, name ) );
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
function getSubtree ( type, path  ) {
	var path = ( 'string' === typeof path ) ? path.split( '/' ) : '',
	subPath, tree = this.lifecycle.tree;

	// Walk the tree to get to the correct item.
	while ( path.length ) {
		subPath = path.shift();
		// Make sure a subtree is available.
		if ( ! tree.tree ) {
			tree.tree = {}
		}
		// Make sure we have the sub path
		if ( ! tree.tree[ subPath ] ) {
			tree.tree[ subPath ] = {};
		}

		tree = tree.tree[ subPath ];
	}

	if ( ! tree[ type ] ) {
		tree[ type ] = {};
	}

	return tree[ type ];
}

// Export the mixin.
module.exports = {
	tree: tree,
	getSubtree: getSubtree
};
