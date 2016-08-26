'use strict';
var assert = require('chai').assert;
var app    = require('../../app');

describe('app > index', function () {
	/**
	 * Confirm the file is loading correctly and tested functions are available
	 */
	describe('Setup', function () {
		it('can be imported', function () {
			assert.isOk(app, 'app is available');
		});
	});
});
