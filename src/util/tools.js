/**
 * This mixin defines a set of tools to help set up and mutate the lifecycle.
 */

// Require dependencies
import path from 'path';

/**
 * A generic JSON manager for dependency manager JSON dependency definitions.
 *
 * If the JSON file is not defined in the lifecycle tree, it will create it. The
 * dependency will then be added to the JSON definition based on the dev flag
 * and the passed devDep/normalDep keys. This works for composer, npm, and any
 * other JSON definition that follows this type of pattern.
 *
 * @param {Object} keys    The object defining the specific type of JSON file.
 * @param {string} name    The name of the dependency to add.
 * @param {String} version The version string to use for the dependency.
 * @param {Bool}   dev     Whether this should go in dev or normal dependencies.
 */
export function jsonDependency ( keys, name, version, dev ) {
	const type = dev ? keys.devDep : keys.normalDep;
	const rootJSON = this.getSubtree( 'json' );

	if ( ! rootJSON[ keys.type ] ) {
		rootJSON[ keys.type ] = this.starterJSON( keys.starter );
	}

	if ( ! rootJSON[ keys.type ] ) {
		rootJSON[ keys.type ][ type ] = {};
	}

	rootJSON[ keys.type ][ type ][ name ] = version;
}

/**
 * Runs the jsonDependency method for npm specifically.
 *
 * Sets the type to package.json, normal/dev dependencies to dependencies and
 * devDependencies specifically, and the starter to 'package'.
 *
 * @param  {string}  name    The name of the bower package to add.
 * @param  {string}  version The semver string to use in bower.json.
 * @param  {boolean} dev     Whether this is a dev dependency or not.
 * @return {void}
 */
export function nodeDependency ( name, version, dev ) {
	this.jsonDependency( {
		type: 'package.json',
		starter: 'package',
		normalDep: 'dependencies',
		devDep: 'devDependencies'
	}, name, version, dev );
}

/**
 * Runs the jsonDependency method for composer specifically.
 *
 * Sets the type to composer.json, normal/dev dependencies to require and
 * require-dev specifically, and the starter to 'composer'.
 *
 * @param  {string}  name    The name of the composer package to add.
 * @param  {string}  version The semver string to use in composer.json.
 * @param  {boolean} dev     Whether this is a dev dependency or not.
 * @return {void}
 */
export function composerDependency ( name, version, dev ) {
	this.jsonDependency( {
		type: 'composer.json',
		starter: 'composer',
		normalDep: 'require',
		devDep: 'require-dev'
	}, name, version, dev );
}

/**
 * Sets up a grunt config module in the `/tasks` subfolder.
 *
 * This does not adjust the Gruntfile, but the default Gruntfile.js will load
 * the modules defined in `/tasks` to configure the various tasks. This is an
 * easy shortcut for adding an task configuration module into the `/tasks`
 * directory for grunt to consume.
 *
 * @param  {string} task   The task name to configure.
 * @param  {string} config The JS configuration string to use.
 * @return {void}
 */
export function gruntConfig ( task, config ) {
	this.getSubtree( 'modules', 'tasks' )[ task + '.js' ] = config;
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
 * @param  {string} template The name of the starter template to retrieve.
 * @param  {string} type     The extension of the starter template.
 * @return {string}          The strinified file contents, or empty.
 */
export function starter ( template, type = 'js' ) {
	const templateFile = 'starters/_' + template + '.' + type;

	// First try the template path.
	try {
		return this.fs.read( this.templatePath( templateFile ) );
		// Then try the root directory.
	} catch ( e ) {
		// eat the error if template path fails.
	}
	// Then try the global starters.
	try {
		return this.fs.read( path.join( __dirname, '..', templateFile ) );
	} catch ( e ) {
		// Throw an error if neither is found.
		throw new Error( `Unable to locate ${templateFile}.` );
	}
}

/**
 * Gets JSON specific starter data, parsed into a JS object.
 *
 * Handy for setting up JS object starters as actual objects rather than as
 * string since they are easier to manipulate and mutate as JS objects.
 *
 * @param  {string} template The stater JSON template to retrieve.
 * @return {string}          The object defined in the template.
 */
export function starterJSON ( template ) {
	const data = this.starter( template, 'json' );
	return data !== '' ? JSON.parse( data ) : {};
}

// Export the mixin.
export default {
	nodeDependency,
	composerDependency,
	jsonDependency,
	gruntConfig,
	starter,
	starterJSON
};
