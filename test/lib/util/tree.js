var assert = require('chai').assert;
var tree = require( '../../../lib/util/tree' );

describe('lib > util > tree', function () {
	describe('Setup', function () {
		it('can be imported', function () {
			assert.isOk(tree, 'tree is available');
		});
		it('functions exist', function () {
			assert.isFunction(tree.tree, 'tree.tree is a function');
			assert.isFunction(tree.getSubtree, 'tree.getSubtree is a function');
		});
	});
	describe('getSubtree()', function () {
		beforeEach(function() {
			tree.lifecycle = {
				tree: {
					tree: {
						foo: {
							tree: {
								bar: {
									baz: 'qux'
								}
							}
						}
					},
					quux: 'corge'
				}
			};
		});
		it('get first child', function () {
			var expected = 'corge';
			var actual = tree.getSubtree( 'quux' );
			assert.equal(actual, expected, 'retrieve first child successfully');
		});
		it('get second child', function () {
			var expected = 'qux';
			var actual = tree.getSubtree( 'baz', 'foo/bar' );
			assert.equal(actual, expected, 'retrieve second child successfully');
		});
		it('create a child', function () {
			var expected = {foo: 'bar'};
			var actual = tree.getSubtree( 'bar', 'foo/baz' );
			actual.foo = 'bar';
			assert.deepEqual(actual, expected, 'create a child successfully');
		});
	});
});
