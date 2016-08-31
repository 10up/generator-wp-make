var assert = require('chai').assert;
var astConfig = require('../../../lib/util/ast-config');

describe('lib > util > ast-config', function () {
	/**
	 * Confirm the file is loading correctly and tested functions are available
	 */
	describe('Setup', function () {
		it('can be imported', function () {
			assert.isOk(astConfig, 'ast_config is available');
		});
	});
});
