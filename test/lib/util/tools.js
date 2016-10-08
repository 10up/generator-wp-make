/**
 * This file contains tests for the tools helper methods.
 */

// Import dependencies
import {assert} from 'chai';
import tools from '../../../lib/util/tools';

/**
 * Run tests on the tools helper methods.
 */
describe('lib > util > tools', function () {
	/**
	 * Confirm the file is loading correctly and tested functions are available
	 */
	describe('Setup', function () {
		it('can be imported', function () {
			assert.isOk(tools, 'tools is available');
		});
		it('functions exist', function () {
			assert.isFunction(tools.starter, 'tools.starter is a function' );
			assert.isFunction(tools.jsonDependency, 'tools.jsonDependency is a function.');
			assert.isFunction(tools.nodeDependency, 'tools.nodeDependency is a function.');
			assert.isFunction(tools.composerDependency, 'tools.composerDependency is a function.');
			assert.isFunction(tools.gruntConfig, 'tools.gruntConfig is a function.');
			assert.isFunction(tools.starterJSON, 'tools.starterJSON is a function.');
		});
	});
	/**
	 * Test the nodeDependency method to ensure it works as epctected.
	 */
	describe('#jsonDependency', function () {
		before( function () {
			this.gst = tools.getSubtree;
			tools.getSubtree = () => this.gstReturn;
		});
		beforeEach( function () {
			this.gstReturn = {};
		});
		after( function () {
			tools.getSubtree = this.gst;
			delete this.gstReturn;
		});
		it( 'will add a dependency to the root json object', function () {
			// Set up mocks
			this.gstReturn = {
				'testing.json': {
					normal: {}
				}
			};
			// Run the test
			tools.jsonDependency(
				{
					type: 'testing.json',
					normalDep: 'normal'
				},
				'fake',
				'1.0.0'
			);
			// Verify the restult
			assert.deepEqual(
				this.gstReturn['testing.json'].normal,
				{ fake: '1.0.0' }
			);
		} );
		it( 'will add a dev dependency to the root json object', function () {
			// Set up mocks
			this.gstReturn = {
				'testing.json': {
					dev: {}
				}
			};
			// Run the test
			tools.jsonDependency(
				{
					type: 'testing.json',
					devDep: 'dev'
				},
				'fake',
				'1.0.0',
				true
			);
			// Verify the restult
			assert.deepEqual(
				this.gstReturn['testing.json'].dev,
				{ fake: '1.0.0' }
			);
		} );
		it( 'will create objects missing in the tree', function () {
			// Create mocks
			this.starterJSON = tools.starterJSON;
			tools.starterJSON = () => ({normal: {}});
			// Run the test
			tools.jsonDependency(
				{
					type: 'testing.json',
					normalDep: 'normal'
				},
				'fake',
				'1.0.0'
			);
			// Verify the restult
			assert.isObject(this.gstReturn['testing.json']);
			assert.isObject(this.gstReturn['testing.json'].normal);
			assert.deepEqual(
				this.gstReturn['testing.json'].normal,
				{fake: '1.0.0'}
			);
			// Restore mocks
			tools.starterJSON = this.starterJSON;
			delete this.starterJSON;
		} );
	} );
	/**
	 * Check the nodeDependency method to ensure it calls jsonDependency right.
	 */
	describe('#nodeDependency', function () {
		it('will call #jsonDependency with package.json', function () {
			// Set up mocks
			this.jsonDependency = tools.jsonDependency;
			tools.jsonDependency = ( ...val ) => { this.depVal = val; };
			// Run the test.
			tools.nodeDependency( 'test', '1.0.0', false );
			// Verify
			assert.deepEqual(
				this.depVal,
				[
					{
						type: 'package.json',
						starter: 'package',
						normalDep: 'dependencies',
						devDep: 'devDependencies'
					},
					'test',
					'1.0.0',
					false
				]
			);
			// Restore
			tools.jsonDependency = this.jsonDependency;
			delete this.jsonDependency;
			delete this.depVal;
		});
	});
	/**
	 * Check composerDependency method to ensure it calls jsonDependency right.
	 */
	describe('#composerDependency', function () {
		it('will call #jsonDependency with composer.json', function () {
			// Set up mocks
			this.jsonDependency = tools.jsonDependency;
			tools.jsonDependency = ( ...val ) => { this.depVal = val; };
			// Run the test.
			tools.composerDependency( 'test', '1.0.0', false );
			// Verify
			assert.deepEqual(
				this.depVal,
				[
					{
						type: 'composer.json',
						starter: 'composer',
						normalDep: 'require',
						devDep: 'require-dev'
					},
					'test',
					'1.0.0',
					false
				]
			);
			// Restore
			tools.jsonDependency = this.jsonDependency;
			delete this.jsonDependency;
			delete this.depVal;
		});
	});
	/**
	 * Test the gruntConfig method to ensure it adds configs to the tree.
	 */
	describe('#gruntConfig', function () {
		it('will add a task config to the grunt task output tree', function () {
			// Set up mocks
			this.mockTree = {};
			tools.getSubtree = (...args) => {
				assert.deepEqual(
					args,
					['modules', 'tasks']
				);
				return this.mockTree;
			};
			// Run the test.
			tools.gruntConfig( 'test', { def: 'thing' } );
			// Verify
			assert.deepEqual(
				this.mockTree,
				{
					'test.js': { def: 'thing' }
				}
			);
			// Restore
			delete tools.getSubtree;
			delete this.mockTree;
		});
	});
	/**
	 * Test all aspects of the starter function.
	 *
	 * This method is crucial to the behavior of this application.
	 */
	describe('#starter', function () {
		afterEach(function () {
			// Reset the mocks
			delete tools.templatePath;
			delete tools.fs;
		});
		it('template does not exist it will throw an error', function() {
			// Create mocks
			// When FS can't read a file, it errors, we'll just mock it always
			// throwing erros to simulate no files reachable.
			tools.templatePath = () => null;
			tools.fs = {
				read: () => { throw new Error('die'); }
			};
			// Run the test.
			assert.throws(
				() => { tools.starter('testing'); },
				'Unable to locate starters/_testing.js.'
			);
		});
		it('sends back the file if found in the templatePath', function() {
			// Create mocks
			// Just pass everything through so the files contents is
			// the file name.
			tools.templatePath = val => val;
			tools.fs = {
				read: val => val
			};
			// Run the test.
			assert.equal(tools.starter('testing'), 'starters/_testing.js');
		});
		it('sends back the global template if local is not found', function () {
			// Create mocks
			// The local request, call error, otherwise do a passthrough.
			tools.templatePath = val => val;
			tools.fs = {
				read: val => {
					if (val === 'starters/_testing.js'){
						throw new Error( 'die' );
					} else {
						return val;
					}
				}
			};
			// Rund the test
			assert.equal(tools.starter('global'), 'starters/_global.js');
		});
		it('allows overriding the extension', function() {
			// Create mocks
			// Just pass everything through so the files contents is
			// the file name.
			tools.templatePath = val => val;
			tools.fs = {
				read: val => val
			};
			// Run the test.
			assert.equal(
				tools.starter('testing', 'json'),
				'starters/_testing.json'
			);
		});
	});
	/**
	 * Make sure the starterJSON method properly wraps the starter method.
	 */
	describe('#starterJSON', function () {
		before(function () {
			this.starter = tools.starter;
			tools.starter = ( ...args ) => {
				this.starterArgs = args;
				return this.starterReturn;
			};
		});
		beforeEach(function () {
			this.starterArgs = undefined;
			this.starterReturn = undefined;
		});
		after(function () {
			tools.starter = this.starter;
			delete this.starterArgs;
			delete this.starterReturn;
		});
		it('decodes valid JSON that is returned', function () {
			// Set up mocks.
			this.starterReturn = '{ "testing": true }';
			// Run test and validate
			assert.isTrue( tools.starterJSON( 'testing' ).testing );
		});
		it('sends back an empty object when the startes is empty', function () {
			// Set up mocks.
			this.starterReturn = '';
			// Run test
			const result = tools.starterJSON( 'testing' );
			// Verify results
			assert.isObject( result );
			assert.deepEqual( result, {} );
		});
		it('throws an error on an invalid JSON', function () {
			// Set up mocks.
			// Valid JSON requires double quotes.
			this.starterReturn = '{ testing: true }';
			// Run test and validate
			assert.throws(() => { tools.starterJSON('testing'); });
		});
		it('send JSON as the type to the starter method', function () {
			// Set up mocks
			this.starterReturn = '';
			// Run test
			tools.starterJSON('testing');
			assert.deepEqual( this.starterArgs, ['testing', 'json'] );
		});
	});
});
