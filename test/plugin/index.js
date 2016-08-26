'use strict';
var assert = require('chai').assert;
var plugin = require('../../plugin');

describe('plugin > index', function () {
	/**
	 * Confirm the file is loading correctly and tested functions are available
	 */
	describe('Setup', function () {
		it('can be imported', function () {
			assert.isOk(plugin, 'plugin is available');
		});
	});
});
