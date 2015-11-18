/**
 * This file defines a mixin for the installers in the WP Make Base object.
 */

// Require dependencies
var _ = require( 'lodash' );
var ejs = require( 'ejs' );
var chalk = require( 'chalk' );

/**
 * Runs the installers as needed based on generator configuration.
 *
 * This will automatically run any installers defined in the `installCommands`
 * property of the generator. The keys of the `installCommands` are the
 * programs to run install on (npm, bower, etc), and the values are whether or
 * not the installers should be run during generation by default. True to run
 * them, false to not.
 *
 * Typically you will want to run the installers by default, but anything set
 * to false will not install, but suggest the user run the installer themself
 * when they are ready.
 *
 * @param  {Function} done The function for continuing generation.
 * @return {void}
 */
function install ( done ) {
	var commands = [];
	var msg = {
		commands: [],
		skipped: [],
		installTemplate: ejs.compile(
			"\n\n" +
			'Running <%= commands %> to install the required dependencies.' +
			' If this fails, try running the command' + 
			'<% if ( 1 < commandCount ) { %>s<% } %>' +
			' yourself.' +
			"\n\n"
		),
		skipTemplate: ejs.compile(
			"\n" +
			'Skipping <%= skipped %>. When you are ready to install these dependencies,' +
			' run the command' +
			'<% if ( 1 < skippedCount ) { %>s<% } %>' +
			' yourself.' +
			"\n\n"
		)
	};

	var defaults = _.extend( _.clone ( this.installCommands ), {
		skipMessage: false
	} );

	var options = _.defaults( this.installOptions || {}, defaults );

	if ( ! options.skipMessage ) {
		this.env.runLoop.add( 'install', installMessage.bind( this ), {
			once: 'installMessage',
			run: false
		} );
	}

	for ( var command in this.installCommands ) {
		if ( options[ command ] && ! options.skipInstall ) {
			msg.commands.push( chalk.yellow.bold( command + ' install' ) );
			this.runInstall( command );
		} else {
			msg.skipped.push( chalk.red.bold( command + ' install' ) );
		}
	}

	done();

	/**
	 * Closured function that outputs messages based on the run installers.
	 *
	 * @param  {Function} done The function to continue generation.
	 * @return {void}
	 */
	function installMessage( done ) {
		if ( 2 < msg.commands.length ) {
			msg.commands[ msg.commands.length -1 ] = 'and ' + msg.commands[ msg.commands.length -1 ];
			this.options.commands = msg.commands.join( ', ' );
		} else {
			this.options.commands = msg.commands.join( ' and ' );
		}

		if ( 2 < msg.skipped.length ) {
			msg.skipped[ msg.skipped.length - 1 ] = 'and ' + msg.skipped[ msg.skipped.length -1 ];
			this.options.skipped = msg.skipped.join( ', ' );
		} else {
			this.options.skipped = msg.skipped.join( ' and ' );
		}

		this.options.commandCount = msg.commands.length;
		this.options.skippedCount = msg.skipped.length;

		if ( msg.commands.length ) {
			this.log( msg.installTemplate( this.options ) );
		} else {
			this.log( "\n\n" );
		}

		if ( msg.skipped.length ) {
			this.log( msg.skipTemplate( this.options ) );
		}

		done();
	}
}

// Export the mixin.
module.exports = {
	installers: install
};
