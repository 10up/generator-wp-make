/**
 * This file defines a mixin for the installers in the WP Make Base object.
 */

// Require dependencies
import chalk from 'chalk';

/**
 * Create the install message for install commands that are run automatically.
 *
 * @param  {array} commands An array of commands run automatically.
 * @return {string}         The string for logging output.
 */
function installMessage( commands ) {
	if ( commands.length ) {
		return `Running ${formatMessage( commands, chalk.yellow.bold )} to install the required dependencies. If this fails, try running the command${commands.length > 1 ? 's' : ''} yourself.`;
	} else {
		return '';
	}
}

/**
 * Create the install message for install commands that are not automatic.
 *
 * @param  {array} commands An array of install commands not run automatically.
 * @return {string}         The string for logging output.
 */
function skipMessage( skipped ) {
	if ( skipped.length ) {
		return `Skipping ${formatMessage( skipped, chalk.red.bold )}. When you are ready  to install these dependencies, run the command${skipped.length > 1 ? 's' : ''} yourself.`;
	} else {
		return '';
	}
}

/**
 * Formats an array of install commands into a logabble format.
 *
 * Takes the base command and appends install to each, runs each through the
 * formatting function injectd (typically a chalk method), and then concatenates
 * the strings with proper english and the oxford comma.
 *
 * With one command passed it becomes just 'command install', formatted. With
 * two commands it becomes 'command1 install and command 2 install'. With three
 * or more commands it becomes 'command1 install, command 2 install, and
 * command 3 install.'
 *
 * @param  {array}    commands            An array of commands to format.
 * @param  {fucntion} [format=chalk.bold] The formatting function for individual
 *                                        commands.
 * @return {string}                       The formatted string of commands.
 */
function formatMessage( commands, format = chalk.bold ) {
	return commands
		.map( cmd => `${cmd} install`)
		.map( format )
		.reduceRight( ( msg, cmd, i ) => {
			if ( i === 0 ) {
				return cmd + msg;
			} else if ( ! msg ) {
				return i > 1 ? `, and ${cmd}` : ` and ${cmd}`;
			} else {
				return `, ${cmd}` + msg;
			}
		}, false);
}

/**
 * Creates a function to output the install and sipped messages on an event.
 *
 * This is used to queue the install messaging to output right before the
 * automatic installs are run. It closures the commands run and skipped so that
 * the text matches what's queued to run in the installation phase.
 *
 * @param  {Array} {commands=[]} The commands that will run automatically.
 * @param  {Array} {skipped=[]}  The commands that are not automatic.
 * @return {void}
 */
function createOutputMessage( { commands = [], skipped = [] } = {} ) {
	return done => {
		if ( commands || skipped ) {
			this.log( '\n\n' );
			this.log( [
				installMessage( commands ),
				skipMessage( skipped )
			].filter().join( '\n\n' ) );
			this.log( '\n\n' );
			done();
		}
	};
}

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
export function installers ( done ) {
	const options = Object.assign(
		{ skipMessage: false },
		this.installOptions || {}
	);

	const cmds = {
		commands: this.installCommands.keys()
			.filter( cmd => this.installCommands[ cmd ] ),
		skipped: this.installCommands.keys()
			.filter( cmd => !this.installCommands[ cmd ] )
	};

	if ( ! options.skipMessage ) {
		this.env.runLoop.add(
			'install',
			createOutputMessage.call( this, cmds ),
			{
				once: 'installMessage',
				run: false
			}
		);
	}

	cmds.commands.map( this.runInstall.bind( this ) );

	done();
}

// Export the mixin.
export default {
	installers
};
