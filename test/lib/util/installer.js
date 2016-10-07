import {assert} from 'chai';
import chalk from 'chalk';
import installer from '../../../lib/util/installer';
import {
	installMessage,
	skipMessage,
	formatMessage,
	createOutputMessage,
	installers
} from '../../../lib/util/installer';

describe('lib > util > installer', function () {
	/**
	 * Confirm the file is loading correctly and tested functions are available
	 */
	describe( 'Setup', function () {
		it( 'can be imported', function () {
			assert.isOk(installer, 'installer object is available');
			assert.isOk(installMessage, 'install message is available');
			assert.isOk(skipMessage, 'skip message is available');
			assert.isOk(formatMessage, 'format message is available');
			assert.isOk(createOutputMessage, 'output fn creation is available');
			assert.isOk(installers, 'the main function can be imported');
		});
	});
	/**
	 * Cofirm install message is working correctly.
	 */
	describe( 'installMessage creates a message for output.', function () {
		it( 'returns an empty string when 0 length is passed', function () {
			const msg = installMessage('testing', 0);
			assert.equal(msg, '');
		});
		it( 'concatenates the passed string', function () {
			const msg = installMessage( 'testing', 1 );
			assert.equal(
				msg,
				'Running testing to install the required dependencies. If this fails, try running the command yourself.'
			);
		});
		it( 'pluralizes command with more than one length', function () {
			const msg = installMessage( 'testing', 2 );
			assert.equal(
				msg,
				'Running testing to install the required dependencies. If this fails, try running the commands yourself.'
			);
		});
	});

	/**
	 * Cofirm skip message is working correctly.
	 */
	describe( 'skipMessage creates a message for output.', function () {
		it( 'returns an empty string when 0 length is passed', function () {
			const msg = skipMessage('testing', 0);
			assert.equal(msg, '');
		});
		it( 'concatenates the passed string', function () {
			const msg = skipMessage( 'testing', 1 );
			assert.equal(
				msg,
				'Skipping testing. When you are ready  to install these dependencies, run the command yourself.'
			);
		});
		it( 'pluralizes command with more than one length', function () {
			const msg = skipMessage( 'testing', 2 );
			assert.equal(
				msg,
				'Skipping testing. When you are ready  to install these dependencies, run the commands yourself.'
			);
		});
	});

	/**
	 * Double check formatting is working correctly.
	 */
	describe( 'formatMessage deals with items correctly', function () {
		before( function () {
			this.oneThing = ['one'];
			this.twoThings = ['one', 'two'];
			this.threeThings = ['one', 'two', 'three'];
			this.fourThings = ['one', 'two', 'three', 'four'];
		});
		it( 'takes a single item and simply returns it', function () {
			const msg = formatMessage( this.oneThing, val => val );
			assert.equal( msg, 'one install' );
		});
		it( 'returns two items joined with and, no comma', function () {
			const msg = formatMessage( this.twoThings, val => val );
			assert.equal( msg, 'one install and two install' );
		});
		it( 'comma separates and uses the oxford comma', function () {
			const msg = formatMessage( this.threeThings, val => val );
			assert.equal( msg, 'one install, two install, and three install' );
		});
		it( 'continues to use the commas after three', function() {
			const msg = formatMessage( this.fourThings, val => val );
			assert.equal(
				msg,
				'one install, two install, three install, and four install'
			);
		});
		it( 'uses chalk.bold by default', function () {
			const msg = formatMessage( this.oneThing );
			assert.equal( msg, chalk.bold('one install') );
		});
	});

	/**
	 * Make sure createOutputMessage creates a sane message output function.
	 */
	describe( 'createOutputMessage creates a closure', function () {
		before( function() {
			this.contextMock = {
				log: function( val ) {
					this.logged.push( val );
				}
			};
			this.noop = function(){};
		});
		beforeEach( function() {
			this.contextMock.logged = [];
		});
		it( 'sends back a function', function() {
			const fn = createOutputMessage();
			assert.isFunction( fn );
		});
		it( 'outputs nothing when no commands are passed', function() {
			const fn = createOutputMessage.call( this.contextMock );
			fn( this.noop );
			assert.deepEqual( this.contextMock.logged, [] );
		});
		it( 'outputs only the install message with 0 skipped', function () {
			const fn = createOutputMessage.call(
				this.contextMock,
				{
					commands: ['one']
				}
			);
			fn( this.noop );
			assert.lengthOf( this.contextMock.logged, 3 );
			assert.equal( this.contextMock.logged[0], '\n\n' );
			assert.equal( this.contextMock.logged[2], '\n\n' );
			assert.match( this.contextMock.logged[1], /^Running/ );
			assert.notMatch( this.contextMock.logged[1], /Skipping/ );
		});

		it( 'outputs only the skpped message with 0 installed', function () {
			const fn = createOutputMessage.call(
				this.contextMock,
				{
					skipped: ['one']
				}
			);
			fn( this.noop );
			assert.lengthOf( this.contextMock.logged, 3 );
			assert.equal( this.contextMock.logged[0], '\n\n' );
			assert.equal( this.contextMock.logged[2], '\n\n' );
			assert.match( this.contextMock.logged[1], /^Skipping/ );
			assert.notMatch( this.contextMock.logged[1], /Running/ );
		});

		it( 'outputs both when both message types', function () {
			const fn = createOutputMessage.call(
				this.contextMock,
				{
					commands: ['one'],
					skipped: ['one']
				}
			);
			fn( this.noop );
			assert.lengthOf( this.contextMock.logged, 3 );
			assert.equal( this.contextMock.logged[0], '\n\n' );
			assert.equal( this.contextMock.logged[2], '\n\n' );
			assert.match( this.contextMock.logged[1], /^Running/ );
			assert.match( this.contextMock.logged[1], /\n\nSkipping/);
		});
		it( 'calls done no matter what is passed', function () {
			let callCount = 0;
			const count = () => callCount++;
			const noneFn = createOutputMessage.call( this.contextMock );
			const bothFn = createOutputMessage.call(
				this.contextMock,
				{
					commands: ['one'],
					skipped: ['one']
				}
			);
			noneFn( count );
			bothFn( count );
			assert.equal( callCount, 2 );
		});
	});
});
