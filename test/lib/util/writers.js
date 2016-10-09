import {assert} from 'chai';
import writers from '../../../lib/util/writers';

describe('lib > util > writers', function () {
	before(function () {
		// Set up some file-level useful mocks.
		writers.destinationPath = path => path;
		writers.fs = {
			write: (dest, str) => { this.written.push([dest, str]); }
		};
		writers.data = { blue: 'green', east: 'west' };
	});
	beforeEach(function () {
		this.written = [];
	});
	after(function () {
		// Clean up mocks
		delete writers.destinationPath;
		delete writers.fs;
		delete writers.data;
		delete this.written;
	});
	describe('Setup', function () {
		it('can be imported', function () {
			assert.isOk(writers, 'tree is available');
		});
		it('functions exist', function () {
			assert.isFunction(writers.writeJSON, 'writeers.writeJSON is a function');
			assert.isFunction(writers.writeModule, 'writers.writeModule is a function');
			assert.isFunction(writers.writeCopy, 'writers.writeCopy is a function');
			assert.isFunction(writers.writeTemplate, 'writers.writeTemplate is a function');
			assert.isFunction(writers.writeGruntfile, 'writers.writeGruntfile is a function');
		});
	});
	describe('#writeJSON', function () {
		before(function () {
			// Set up function level mocks
			writers.fs.readJSON = ( src, opts ) => this.fsJSON || opts.defaults;
			writers.defaultPad = '\t';
		});
		beforeEach(function () {
			this.fsJSON = {};
		});
		after(function () {
			// Clean up mocks
			delete writers.fs.readJSON;
			delete writers.fsJSON;
			delete writers.defaultPad;
		});
		it('will output a new JSON file', function () {
			// Run test
			writers.writeJSON( { orange: 'red' }, '/test.json' );
			// Verify result
			assert.deepEqual(
				this.written[0],
				['/test.json', '{\n\t"orange": "red"\n}']
			);
		});
		it('will output an empty object with no content passed', function () {
			// Run test
			writers.writeJSON( false, '/test.json' );
			// Verify result
			assert.deepEqual(
				this.written[0],
				['/test.json', '{}']
			);
		});
		it('will merge passed data with existing data', function () {
			// Set up mocks
			this.fsJSON = { purple: 'black' };
			// Run test
			writers.writeJSON( { orange: 'red' }, '/test.json' );
			assert.deepEqual(
				this.written[0],
				['/test.json', '{\n\t"orange": "red",\n\t"purple": "black"\n}']
			);
		});
		it('existin data takes precedence', function() {
			// Set up mocks
			this.fsJSON = { orange: 'blue' };
			// Run test
			writers.writeJSON( { orange: 'red' }, '/test.json' );
			assert.deepEqual(
				this.written[0],
				['/test.json', '{\n\t"orange": "blue"\n}']
			);
		});
		it('allows templating in the name and contents', function () {
			// Run test
			writers.writeJSON( { '<%= east %>': 'grey' }, '/<%= blue %>.json' );
			// Verify result
			assert.deepEqual(
				this.written[0],
				['/green.json', '{\n\t"west": "grey"\n}']
			);
		});
		it('allows alternate whitespace chars', function () {
			// Run test
			writers.writeJSON( { orange: 'red' }, '/test.json', '  ' );
			// Verify result
			assert.deepEqual(
				this.written[0],
				['/test.json', '{\n  "orange": "red"\n}']
			);
		});
	});
	describe('#writeModule', function () {
		it('writes modules to the disk', function () {
			// Run test
			writers.writeModule( { toString: () => 'yellow' }, '/test.js' );
			// Verify result
			assert.deepEqual( this.written[0], ['/test.js', 'yellow'] );
		});
		it('allows templating on file names and contents', function () {
			// Run test
			writers.writeModule(
				{ toString: () => '<%= blue %>' }, '/<%= east %>.js' );
			// Verify result
			assert.deepEqual( this.written[0], ['/west.js', 'green'] );
		});
	});
	describe('#writeCopy', function () {
		before(function(){
			writers.copy = ( src, dest ) => {
				this.written.push( [src, dest] );
			};
		});
		after(function () {
			delete writers.copy;
		});
		it('copies files to the disk', function () {
			// Run test
			writers.writeCopy( '/some/src.md', '/src.md' );
			// Verify result
			assert.deepEqual(
				this.written[0],
				['/some/src.md', '/src.md']
			);
		});
		it('allows templating on destination paths', function () {
			// Run test
			writers.writeCopy( '/some/src.md', '/<%= blue %>.md' );
			// Verify result
			assert.deepEqual(
				this.written[0],
				['/some/src.md', '/green.md']
			);
		});
	});
	describe('#writeTemplate', function () {
		before(function(){
			writers.template = ( src, dest, data ) => {
				this.written.push( [src, dest, data] );
			};
		});
		after(function () {
			delete writers.template;
		});
		it('copies files to the disk', function () {
			// Run test
			writers.writeTemplate( '/some/src.md', '/src.md' );
			// Verify result
			assert.deepEqual(
				this.written[0],
				['/some/src.md', '/src.md', writers.data]
			);
		});
		it('allows templating on destination paths', function () {
			// Run test
			writers.writeTemplate( '/some/src.md', '/<%= blue %>.md' );
			// Verify result
			assert.deepEqual(
				this.written[0],
				['/some/src.md', '/green.md', writers.data]
			);
		});
	});
	describe('#writeGruntfile', function () {
		before(function(){
			writers.grunt = { toString: () => 'gruntfile contents' };
		});
		after(function () {
			delete writers.grunt;
		});
		it('copies files to the disk', function () {
			// Run test
			writers.writeGruntfile( () => {} );
			// Verify result
			assert.deepEqual(
				this.written[0],
				['Gruntfile.js', 'gruntfile contents']
			);
		});
		it('always calls done', function () {
			// Run test
			writers.writeGruntfile( () => { this.doneCalled = true; } );
			// Verify result
			assert.isTrue( this.doneCalled );
			// Clean up
			delete this.doneCalled;
		});
	});
});
