var assert = require('chai').assert;
var mock = require('mock-fs');
var path = require('path');
var tools = require('../../../lib/util/tools');

describe('lib > util > tools', function () {
	/**
	 * Setup the entire stuite of tests with base mocked params
	 */
	before(function() {
		var sanitizedFiles = {
			starters: {
				'_foo.js': 'bar',
			}
		};
		tools.fs = mock.fs(sanitizedFiles);
		tools.fs.exists = function(param) {
			var truthy = false;
			Object.keys(sanitizedFiles.starters).map(function(k) {
				var test = k.split('.');
				if (param.indexOf(test[0]) !== -1) {
					truthy = true;
				}
			});
			return truthy;
		};
		tools.fs.read = function(param) {
			return param;
		};
	});
	after(mock.restore);

	/**
	 * Clean up the mock for each test
	 */
	beforeEach(function() {
		tools.templatePath = function(param) {
			return param;
		};
	});

	/**
	 * Confirm the file is loading correctly and tested functions are available
	 */
	describe('Setup', function () {
		it('can be imported', function () {
			assert.isOk(tools, 'tools is available');
		});
		it('functions exist', function () {
			assert.isFunction(tools.starter, 'tools.starter is a function');
		});
	});

	/**
	 * Test all aspects of the starter function that is the backbone of the
	 * application functionality found in tool library
	 */
	describe('starter()', function () {
		it('template does not exist', function() {
			var expected = '';
			// Create random file name
			var actual = tools.starter( Math.random().toString(36).substring(7) );
			assert.equal(actual, expected, 'File does not exist');
		});
		it('local template does exist', function() {
			var expected = 'starters/_foo.js';
			var actual = tools.starter( 'foo' );
			assert.equal(actual, expected, 'File does not exist');
		});
		it('local template does exist with new end param', function() {
			var expected = 'starters/_foo.bar';
			var actual = tools.starter( 'foo', 'bar' );
			assert.equal(actual, expected, 'File does not exist');
		});
		it('base template does exist', function() {
			tools.templatePath = function() {
				return '';
			};
			var expected = path.join( __dirname, '../../../lib', 'starters/_foo.js' );
			var actual = tools.starter( 'foo' );
			assert.equal(actual, expected, 'File does not exist');
		});
		it('base template does exist with new end param', function() {
			tools.templatePath = function() {
				return '';
			};
			var expected = path.join( __dirname, '../../../lib', 'starters/_foo.bar' );
			var actual = tools.starter( 'foo', 'bar' );
			assert.equal(actual, expected, 'File does not exist');
		});

	});
});
