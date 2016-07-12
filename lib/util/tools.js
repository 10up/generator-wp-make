/**
 * This mixin defines a set of tools to help set up and mutate the lifecycle.
 */

// Require dependencies
var path = require( 'path' );

/**
 * Sets up a node dependency in package.json
 *
 * If package.json has not be defined in the lifecycle tree, it will create it.
 * The package will then be added to the npm dependencies as either a normal or
 * devDependency depending on the dev flag passed.
 *
 * @param  {string} name    The name of the npm package to add.
 * @param  {String} version The semver string to use in package.json.
 * @param  {Bool}   dev     Whether this is a dev dependency or not.
 * @return {void}
 */
function nodeDependency ( name, version, dev ) {
	var type = ( ! dev ) ? 'dependencies' : 'devDependencies',
		rootJSON = this.getSubtree( 'json' );

		if ( ! rootJSON['package.json'] ) {
			rootJSON['package.json'] = this.starterJSON( 'package' );
		}

		if ( ! rootJSON['package.json'][ type ] ) {
			rootJSON['package.json'][ type ] = {};
		}

		rootJSON['package.json'][ type ][ name ] = version;
}

/**
 * Sets up a bower dependency in bower.json
 *
 * If bower.json has not be defined in the lifecycle tree, it will create it.
 * The package will then be added to the bower dependencies as either a normal
 * or devDependency depending on the dev flag passed.
 *
 * @param  {string} name    The name of the bower package to add.
 * @param  {String} version The semver string to use in bower.json.
 * @param  {Bool}   dev     Whether this is a dev dependency or not.
 * @return {void}
 */
function bowerDependency ( name, version, dev ) {
	var type = ( ! dev ) ? 'dependencies' : 'devDependencies',
		rootJSON = this.getSubtree( 'json' );

		if ( ! rootJSON['bower.json'] ) {
			rootJSON['bower.json'] = this.starterJSON( 'bower' );
		}

		if ( ! rootJSON['bower.json'][ type ] ) {
			rootJSON['bower.json'][ type ] = {};
		}

		rootJSON['bower.json'][ type ][ name ] = version;
}

/**
 * Sets up a composer dependency in composer.json
 *
 * If composer.json has not be defined in the lifecycle tree, it will create it.
 * The package will then be added to the composer dependencies as either a
 * normal or dev requirement depending on the dev flag passed.
 *
 * @param  {string} name    The name of the composer package to add.
 * @param  {String} version The semver string to use in composer.json.
 * @param  {Bool}   dev     Whether this is a dev dependency or not.
 * @return {void}
 */
function composerDependency ( name, version, dev ) {
	var type = ( ! dev ) ? 'require' : 'require-dev',
		rootJSON = this.getSubtree( 'json' );

		if ( ! rootJSON['composer.json'] ) {
			rootJSON['composer.json'] = this.starterJSON( 'composer' );
		}

		if ( ! rootJSON['composer.json'][ type ] ) {
			rootJSON['composer.json'][ type ] = {};
		}

		rootJSON['composer.json'][ type ][ name ] = version;
}

/**
 * Sets up a grunt config module in the `/tasks` subfolder.
 *
 * This does not adjust the Gruntfile, but the default Gruntfile.js will load
 * the modules defined in `/tasks` to configure the various tasks. This is an
 * easy shortcut for adding an task configuration module into the `/tasks`
 * directory for grunt to consume.
 *
 * @param  {String} task   The task name to configure.
 * @param  {String} config The JS configuration string to use.
 * @return {void}
 */
function gruntConfig ( task, config ) {
	var options = this.getSubtree( 'modules', 'tasks/options' );
	options[ task + '.js' ] = config;
}

/**
 * This will pull in a string representation of a starter file.
 *
 * If there is a starter file defined in `templates/starters/` then that will
 * be used, if not it will fall back to the pre-defined WP Make starters. To
 * create a starter, simply create a file named `_<template>.<type>` in the
 * starters folder and it can be pulled in using the start helper.
 *
 * This is great for both JSON and Module strings used in AST.
 *
 * @param  {String} template The name of the starter template to retrieve.
 * @param  {String} type     The extension of the starter template.
 * @return {String}          The strinified file contents, or empty.
 */
function starter ( template, type ) {
	type = type || 'js';
	var data = '', templateFile = 'starters/_' + template + '.' + type;

	// First try the template path.
	if( this.fs.exists( this.templatePath( templateFile ) ) ){
		data = this.fs.read( this.templatePath( templateFile ) );
	// Then try the root directory.
	} else if ( this.fs.exists( path.join( __dirname, '..', templateFile ) ) ) {
		data = this.fs.read( path.join( __dirname, '..', templateFile ) );
	}

	return data;
}

/**
 * Gets JSON specific starter data, parsed into a JS object.
 *
 * Handy for setting up JS object starters as actual objects rather than as
 * string since they are easier to manipulate and mutate as JS objects.
 *
 * @param  {String} template The stater JSON template to retrieve.
 * @return {String}          The object defined in the template.
 */
function starterJSON ( template ) {
	var data = this.starter( template, 'json' );
	return ( '' !== data ) ? JSON.parse( data ) : '';
}

// Export the mixin.
module.exports = {
	nodeDependency: nodeDependency,
	bowerDependency: bowerDependency,
	composerDependency: composerDependency,
	gruntConfig: gruntConfig,
	starter: starter,
	starterJSON: starterJSON
};
