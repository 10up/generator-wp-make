'use strict';
var assert       = require('chai').assert;
var grunt_config = require('../../../lib/util/grunt-config');

describe('lib > util > grunt-config', function () {
	/**
	 * Confirm the file is loading correctly and tested functions are available
	 */
	describe('Setup', function () {
		it('can be imported', function () {
			assert.isOk(grunt_config, 'grunt-config is available');
		});
	});
});
