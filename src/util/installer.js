/**
 * This file defines a mixin for the installers in the WP Make Base object.
 */

// Require dependencies
import chalk from 'chalk';

function installMessage( commands ) {
	if ( commands.length ) {
		return `Running ${formatMessage( commands, chalk.yellow.bold )} to install the required dependencies. If this fails, try running the command${commands.length > 1 ? 's' : ''} yourself.`;
	} else {
		return '';
	}
}

function skipMessage( commands ) {
	if ( commands.length ) {
		return `Skipping ${formatMessage( commands, chalk.red.bold )}. When you are ready  to install these dependencies, run the command${commands.length > 1 ? 's' : ''} yourself.`;
	} else {
		return '';
	}
}

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
