var assert = require('chai').assert;
var installer = require('../../../lib/util/installer');

describe('lib > util > installer', function () {
	/**
	 * Confirm the file is loading correctly and tested functions are available
	 */
	describe('Setup', function () {
		it('can be imported', function () {
			assert.isOk(installer, 'installer is available');
		});
	});
});
