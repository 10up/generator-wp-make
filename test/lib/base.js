import {assert} from 'chai';
import MakeBase from '../../lib/base';
import ASTConfig from '../../lib/util/ast-config';
import helpers from 'yeoman-test';

describe('lib > base', function () {
	before(function () {
		this.logger = (message) => this.logged.push(message);
	});
	beforeEach( function () {
		this.logged = [];
	});
	after( function () {
		delete this.logger;
		delete this.logged;
	});
	/**
	 * Confirm the file is loading correctly and tested functions are available
	 */
	describe('Setup', function () {
		it('can be imported', function () {
			assert.isOk(MakeBase, 'MakeBase is available');
		});
		it('returns a Yeoman Generater constructor function', function () {
			assert.isFunction(MakeBase, 'MakeBase is a function');
			assert.isFunction(MakeBase.prototype.constructor);
			const app = helpers.createGenerator(
				'dummy:app',
				[[MakeBase, 'dummy:app']]
			);
			assert.instanceOf( app, MakeBase );
		});
	});
	describe('#constructor', function () {
		it( 'registers methods with the run loop', function () {
			// Create a dummy instance with the Yeoman helper.
			const app = helpers.createGenerator(
				'dummy:app',
				[[MakeBase, 'dummy:app']]
			);
			// The queue annoying and not well mockable.
			// So instead we'll just dig into the object and check it...
			const queues = app.env.runLoop.__queues__;
			const initQueue = queues.initializing.__queue__;
			const promptQueue = queues.prompting.__queue__;
			const configQueue = queues.configuring.__queue__;
			const writeQueue = queues.writing.__queue__;
			const endQueue = queues.end.__queue__;
			// Check to make sure the once flags are in the queues.
			// Does a deccent job of ensuring the function is actually
			// registered with the environments run loop. Not perfect, but
			// better than nothing.
			assert.includeMembers(
				initQueue.reduce( ( prev, cur ) => [...prev, cur.name], [] ),
				[
					'wpm:welcome',
					'wpm:initGrunt',
					'wpm:setLifecycle',
					'wpm:install'
				]
			);
			assert.includeMembers(
				promptQueue.reduce( ( prev, cur ) => [...prev, cur.name], [] ),
				['wpm:prompts']
			);
			assert.includeMembers(
				configQueue.reduce( ( prev, cur ) => [...prev, cur.name], [] ),
				['wpm:makeObjects']
			);
			assert.includeMembers(
				writeQueue.reduce( ( prev, cur ) => [...prev, cur.name], [] ),
				['wpm:walkTree']
			);
			assert.includeMembers(
				endQueue.reduce( ( prev, cur ) => [...prev, cur.name], [] ),
				['wpm:goodbye']
			);
		});
	});
	describe('#welcomeMessage', function () {
		it('logs a string saying "thanks"', function () {
			MakeBase.prototype.welcomeMessage.call(
				{ log: this.logger },
				() => {}
			);
			assert.include(
				this.logged[0],
				'Thanks for generating with'
			);
		});
		it('calls done after output', function () {
			MakeBase.prototype.welcomeMessage.call(
				{ log: this.logger },
				() => {
					assert.lengthOf( this.logged, 1 );
				}
			);
		});
	});
	describe('#goodbyeMessage', function () {
		it('logs a string saying "done"', function () {
			MakeBase.prototype.goodbyeMessage.call(
				{ log: this.logger },
				() => {}
			);
			assert.include(
				this.logged[0],
				'has been generated.'
			);
		});
		it('calls done after output', function () {
			MakeBase.prototype.goodbyeMessage.call(
				{ log: this.logger },
				() => {
					assert.lengthOf( this.logged, 1 );
				}
			);
		});
	});
	describe('#initGrunt', function () {
		it('creates a grunt config when grunt is truthy', function () {
			// Create mocks.
			const context = {
				grunt: true,
				destinationPath: val => val,
				starter: val => val,
				fs: {
					read: () => 'var test = "testing";'
				},
				env: {
					runLoop: {
						add: (...val) => { this.runLoop = val; }
					}
				},
				writeGruntfile: () => {}
			};
			// Run the test
			MakeBase.prototype.initGrunt.call( context, () => {} );
			// Verify results
			assert.instanceOf( context.grunt, ASTConfig );
			assert.equal( this.runLoop[0], 'writing' );
			assert.isFunction( this.runLoop[1] );
			assert.deepEqual(
				this.runLoop[2],
				{ once: 'wpm:grunt', run: false }
			);
			// Clean up mocks
			delete this.runLoop;
		});
		it('skips setup if grunt is false', function () {
			// Create mocks.
			const context = { grunt: false };
			// Run test and verify.
			// Since we did not mock functions, if it tries to run any of the
			// internals, it will throw an error.
			assert.doesNotThrow( () => {
				MakeBase.prototype.initGrunt.call( context, () => {} );
			});
		});
		it('always calls done', function() {
			// Create mocks
			const context = { grunt: false };
			// Run the test
			MakeBase.prototype.initGrunt.call(
				context,
				() => { this.doneCalled = true; }
			);
			// Verify result
			assert.isTrue( this.doneCalled );
			// Clean up
			delete this.doneCalled;
		});
	});
	describe('#setLifecycle', function () {
		it('combines the default and config into the lifecycle', function () {
			// Create mocks
			const context = {
				_lifecycle: { blue: 'green' },
				initConfig: () => ({ red: 'orange' })
			};
			// Run the test
			MakeBase.prototype.setLifecycle.call( context, () => {} );
			// Verify result
			assert.deepEqual(
				context.lifecycle,
				{
					blue: 'green',
					red: 'orange'
				}
			);
		});
		it('creates a new object', function () {
			// Create mocks
			const context = {
				_lifecycle: { blue: 'green' },
				initConfig: () => ({ red: 'orange' })
			};
			// Run the test
			MakeBase.prototype.setLifecycle.call( context, () => {} );
			// Verify result
			assert.notEqual( context.lifecycle, context._lifecycle );
		});
		it('uses this._lifecycle as the default object', function () {
			// Create mocks
			const context = {
				_lifecycle: { blue: 'green' },
				initConfig: () => ({ blue: 'orange' })
			};
			// Run the test
			MakeBase.prototype.setLifecycle.call( context, () => {} );
			// Verify result
			assert.deepEqual( context.lifecycle, { blue: 'orange' } );
		});
		it('always calls the done function', function () {
			// Create mocks
			const context = { _lifecycle: {}, initConfig: () => ({}) };
			// Run the test
			MakeBase.prototype.setLifecycle.call(
				context,
				() => { this.doneCalled = true; }
			);
			// Verify result
			assert.isTrue( this.doneCalled );
			// Clean up
			delete this.doneCalled;
		});
	});
	describe('#prompts', function () {
		it('runs the prompt method and then sets the data', function () {
			// Create mocks
			const context = {
				lifecycle: {
					prompts: 'arbitrary prompt object'
				},
				prompt: ( prompts ) => {
					this.promptArg = prompts;
					return {
						then: (fn) => fn({testing: 'test'})
					};
				},
				basename: 'testgen'
			};
			// Run the test
			MakeBase.prototype.prompts.call( context, () => {} );
			// Verify the result
			assert.equal( this.promptArg, 'arbitrary prompt object');
			assert.deepEqual(
				context.data,
				{
					testing: 'test',
					basename: 'testgen'
				}
			);
		});
		it('always uses the defined basename', function () {
			// Create mocks
			const context = {
				lifecycle: {},
				prompt: () => ({
					then: (fn) => fn({basename: 'test'})
				}),
				basename: 'testgen'
			};
			// Run the test
			MakeBase.prototype.prompts.call( context, () => {} );
			// Verify the result
			assert.equal( context.data.basename, 'testgen');
		});
		it('calls done after this.data has been set', function () {
			// Create mocks
			const context = {
				lifecycle: {},
				prompt: () => ({
					then: (fn) => fn({})
				}),
				basename: 'testgen'
			};
			// Run the test
			MakeBase.prototype.prompts.call(
				context,
				() => {
					this.doneCalled = true;
					assert.isObject( context.data );
				}
			);
			// Verify done was called.
			assert.isTrue( this.doneCalled );
			// Clean up
			delete this.doneCalled;
		});
	});
});
