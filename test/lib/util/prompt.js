'use strict';
var assert = require('chai').assert;
var prompt = require('../../../lib/util/prompt');

describe('lib > util > prompt', function () {
	/**
	 * Confirm the file is loading correctly and tested functions are available
	 */
	describe('Setup', function () {
		it('can be imported', function () {
			assert.isOk(prompt, 'prompt is available');
		});
		it('functions exist', function () {
			assert.isFunction(prompt.prompt, 'prompt.prompt is a function');
		});
	});
});
