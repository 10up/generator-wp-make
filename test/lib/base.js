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
		it('mixes in helpers to the prototype', function () {
			assert.isFunction(MakeBase.prototype.installers);
			assert.isFunction(MakeBase.prototype.prompt);
			assert.isFunction(MakeBase.prototype.starter);
			assert.isFunction(MakeBase.prototype.tree);
			assert.isFunction(MakeBase.prototype.writeCopy);
		});
		it('has several default properties in the prototype', function () {
			assert.equal( MakeBase.prototype.defaultPad, '\t' );
			assert.isObject( MakeBase.prototype._lifecycle );
			assert.isObject( MakeBase.prototype._lifecycle.prompts );
			assert.isObject( MakeBase.prototype._lifecycle.tree );
			assert.isObject( MakeBase.prototype.data );
			assert.isFalse( MakeBase.prototype.grunt );
			assert.isObject( MakeBase.prototype.installCommands );
			assert.isTrue( MakeBase.prototype.installCommands.npm );
			assert.isTrue( MakeBase.prototype.installCommands.composer );
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
	describe('#makeObjects', function () {
		it('is a wrapper method to call this.tree', function() {
			// Create mocks
			const context = {
				lifecycle: { tree: 'the tree object' },
				tree: ( tree, methods ) => {
					this.treeVal = tree;
					this.methodsVal = methods;
				},
				initModule: 'module method'
			};
			// Run the test
			MakeBase.prototype.makeObjects.call( context, () => {} );
			// Verify the resutls.
			assert.equal( this.treeVal, 'the tree object' );
			assert.property( this.methodsVal, 'modules' );
			assert.equal( this.methodsVal.modules, 'module method' );
			// Clean up
			delete this.treeVal;
			delete this.methodsVal;
		});
		it('always calls done', function () {
			// Create mocks
			const context = {
				lifecycle: { tree: 'the tree object' },
				tree: () => {},
				initModule: 'module method'
			};
			// Run the test
			MakeBase.prototype.makeObjects.call(
				context,
				() => { this.doneCalled = true; }
			);
			// Verify the resutls.
			assert.isTrue( this.doneCalled );
			// Clean up
			delete this.doneCalled;
		});
	});
	describe('#initConfig', function () {
		it('is a stub method that returns an object', function () {
			assert.isObject( MakeBase.prototype.initConfig() );
		});
	});
	describe('#walkTree', function () {
		it('is a wrapper method to call this.tree', function () {
			//Create mocks
			const context = {
				lifecycle: {
					tree: 'the tree object'
				},
				writeJSON: 'json method',
				writeModule: 'modules method',
				writeCopy: 'copies method',
				writeTemplate: 'templates method',
				tree: ( tree, methods ) => {
					this.treeVal = tree;
					this.methodsVal = methods;
				}
			};
			//Run the test
			MakeBase.prototype.walkTree.call( context, () => {} );
			// Verify the result
			assert.equal( this.treeVal, 'the tree object' );
			assert.property( this.methodsVal, '_pre' );
			assert.property( this.methodsVal, 'json' );
			assert.property( this.methodsVal, 'modules' );
			assert.property( this.methodsVal, 'copies' );
			assert.property( this.methodsVal, 'templates' );
			assert.isFunction( this.methodsVal._pre );
			assert.equal( this.methodsVal.json, 'json method' );
			assert.equal( this.methodsVal.modules, 'modules method' );
			assert.equal( this.methodsVal.copies, 'copies method' );
			assert.equal( this.methodsVal.templates, 'templates method' );
			// Clean up
			delete this.treeVal;
			delete this.methodsVal;
		});
		it('always calls done', function () {
			// Create mocks
			const context = {
				lifecycle: { tree: 'the tree object' },
				writeJSON: 'json method',
				writeModule: 'modules method',
				writeCopy: 'copies method',
				writeTemplate: 'templates method',
				tree: () => {},
			};
			// Run the test
			MakeBase.prototype.makeObjects.call(
				context,
				() => { this.doneCalled = true; }
			);
			// Verify the resutls.
			assert.isTrue( this.doneCalled );
			// Clean up
			delete this.doneCalled;
		});
	});
	describe('#initModule', function () {
		it('reads and existing module in if it exists', function () {
			// Create mocks
			const context = {
				defaultPad: '\t',
				fs: {
					read: (path) => `var testing = "${path}";`
				},
				destinationPath: val => val
			};
			// Run the test
			const result = MakeBase.prototype.initModule.call(
				context,
				'skip starter',
				'/a/dummy/path'
			);
			// Verify result
			assert.instanceOf( result, ASTConfig );
			assert.equal(
				result.toString(),
				'var testing = \'/a/dummy/path\';'
			);
		});
		it('will default to a passed string', function () {
			// Create mocks
			const context = {
				defaultPad: '\t',
				fs: {
					read: (path, opts) => opts.defaults
				},
				destinationPath: val => val
			};
			// Run the test
			const result = MakeBase.prototype.initModule.call(
				context,
				'var test = "testing";',
				'/dummy/path'
			);
			// Verify result
			assert.instanceOf( result, ASTConfig );
			assert.equal(
				result.toString(),
				'var test = \'testing\';'
			);
		});
		it('will grab a starter if falsey values are passed', function () {
			// Create mocks
			const context = {
				defaultPad: '\t',
				fs: {
					read: (path, opts) => opts.defaults
				},
				destinationPath: val => val,
				starter: () => 'var test = "testing";'
			};
			// Run the test
			const result = MakeBase.prototype.initModule.call(
				context,
				false,
				'/dummy/path'
			);
			// Verify result
			assert.instanceOf( result, ASTConfig );
			assert.equal(
				result.toString(),
				'var test = \'testing\';'
			);
		});
		it('will use the defaultPad for indentation by default', function () {
			// Create mocks
			const context = {
				defaultPad: '\t',
				fs: {
					read: () => 'if( true ){\nvar test = \'test\';\n}'
				},
				destinationPath: val => val
			};
			// Run the test
			const result = MakeBase.prototype.initModule.call(
				context,
				'skip starter',
				'/dummy/path'
			);
			// Verify result
			assert.include(
				result.toString(),
				'\t'
			);
		});
		it('allows custom pad if desired', function () {
			// Create mocks
			const context = {
				defaultPad: '\t',
				fs: {
					read: () => 'if( true ){\nvar test = \'test\';\n}'
				},
				destinationPath: val => val
			};
			// Run the test
			const result = MakeBase.prototype.initModule.call(
				context,
				'skip starter',
				'/dummy/path',
				'    '
			);
			// Verify result
			assert.notInclude(
				result.toString(),
				'\t'
			);
			assert.include(
				result.toString(),
				'    '
			);
		});
	});
});
