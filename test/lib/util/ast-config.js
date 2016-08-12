'use strict';
var assert     = require('chai').assert;
var ast_config = require('../../../lib/util/ast-config');

describe('lib > util > ast-config', function () {
	/**
	 * Confirm the file is loading correctly and tested functions are available
	 */
	describe('Setup', function () {
		it('can be imported', function () {
			assert.isOk(ast_config, 'ast_config is available');
		});
	});
});
