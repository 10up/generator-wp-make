'use strict';
var assert    = require('chai').assert;
var mockery   = require('mockery');
var gruntfile;

describe('lib > defaults > gruntfile', function () {
	before( function() {
		mockery.enable({
			warnOnUnregistered: false
		});
		var gruntConfig = function(param) {
			return param;
		};
		mockery.registerMock('load-grunt-config', gruntConfig);
		gruntfile = require('../../../lib/defaults/gruntfile');
	});
	after( function() {
		mockery.disable();
	});
	/**
	 * Confirm the file is loading correctly and tested functions are available
	 */
	describe('Setup', function () {
		it('can be imported', function () {
			assert.isOk(gruntfile, 'gruntfile is available');
		});
	});
});
