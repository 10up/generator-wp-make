var assert = require('chai').assert;
var module = require('../../../lib/defaults/module');

describe('lib > defaults > module', function () {
	/**
	 * Confirm the file is loading correctly and tested functions are available
	 */
	describe('Setup', function () {
		it('can be imported', function () {
			assert.isOk(module, 'module is available');
		});
	});
});
