var assert = require('chai').assert;
var base = require('../../lib/base');

describe('lib > base', function () {
	/**
	 * Confirm the file is loading correctly and tested functions are available
	 */
	describe('Setup', function () {
		it('can be imported', function () {
			assert.isOk(base, 'base is available');
		});
	});
});
