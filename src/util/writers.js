/**
 * This file defines mixins for writing files to disk
 */

// Import dependencies
import ejs from 'ejs';

/**
 * Writes out a JSON object to the destination file.
 *
 * If the file already exists, the existing object will be run through
 * `Object.assign` with the content object passed. This allows for some
 * mutation of an existing object if desired while ensuring we don't
 * overwrite and destroy the existing JSON object in the file.
 *
 * The contents and file names are run through templating so ejs template
 * tags can be used in both.
 *
 * @param  {Object} contents   The JS object to use as the cntents.
 * @param  {String} location   The file path where the json file will live.
 * @param  {String} pad        Optional. The whitespace to use in output.
 *                             Will default to the defined default.
 * @return {void}
 */
export function writeJSON ( content, location, pad = this.defaultPad) {
	location = this.destinationPath( ejs.render( location, this.data ) );
	const existing = this.fs.readJSON( location, { defaults: '{}' } );

	// Write the file as a template passing the generator data.
	this.fs.write(
		location,
		ejs.render(
			JSON.stringify(
				Object.assign( {}, content, existing ),
				null,
				pad
			),
			this.data
		)
	);
}
/**
 * Writes out a JS module to the file system.
 *
 * The contents and file names are run through templating so ejs template
 * tags can be used in both.
 *
 * @param  {Object} module   The ASTConfig object for this module.
 * @param  {String} location The file path where the module will live.
 * @return {void}
 */
export function writeModule ( module, location ) {
	// Write the module file.
	this.fs.write(
		this.destinationPath( ejs.render( location, this.data ) ),
		ejs.render( module.toString(), this.data )
	);
}
/**
 * Copies files from the source to the desitination.
 *
 * While the file is copied, the file name is run through an ejs template so
 * that dynamic filenames can be defined in the copy templates if needed.
 *
 * @param  {String} source The template path where the file is located.
 * @param  {String} dest   The destination path where the file is written.
 * @return {void}
 */
export function writeCopy ( source, dest ) {
	this.copy( source, ejs.render( dest, this.data ) );
}
/**
  * Copies files from the source to the desitination, running it through ejs.
  *
  * Both the file contents and the file name are run through ejs templating
  * so dynamic filenames and content can be specified based off of the
  * collected data stored in `this.data`.
  *
  * @param  {String} source The template path where the file is located.
  * @param  {String} dest   The destination path where the file is written.
  * @return {void}
  */
export function writeTemplate ( source, dest ) {
	this.template( source, ejs.render( dest, this.data ), this.data );
}
/**
 * If needed, writes the Gruntfile out to the file root as Gruntfile.js.
 *
 * @param  {Function} done The function to continue generation.
 * @return {void}
 */
export function writeGruntfile ( done ) {
	this.fs.write(
		this.destinationPath( 'Gruntfile.js' ),
		this.grunt.toString()
	);
	done();
}

export default {
	writeJSON,
	writeModule,
	writeCopy,
	writeTemplate,
	writeGruntfile
};
