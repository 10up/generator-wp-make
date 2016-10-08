import {assert} from 'chai';
import tree from '../../../lib/util/tree';

describe('lib > util > tree', function () {
	/**
	 * Make sure everything imports as expected.
	 */
	describe('Setup', function () {
		it('can be imported', function () {
			assert.isOk(tree, 'tree is available');
		});
		it('functions exist', function () {
			assert.isFunction(tree.tree, 'tree.tree is a function');
			assert.isFunction(tree.getSubtree, 'tree.getSubtree is a function');
		});
	});
	/**
	 * Test the tree walking abilities of getSubtree
	 */
	describe('#getSubtree', function () {
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
		after(function () {
			delete tree.lifecycle;
		});
		it('can get the first child', function () {
			assert.equal(tree.getSubtree( 'quux' ), 'corge');
		});
		it('can get the second child', function () {
			assert.equal(tree.getSubtree( 'baz', 'foo/bar' ), 'qux' );
		});
		it('can create a child', function () {
			const result = tree.getSubtree( 'bar', 'foo/baz' );
			assert.isObject( tree.lifecycle.tree.tree.foo.tree.baz );
			assert.isObject( tree.lifecycle.tree.tree.foo.tree.baz.bar );
			assert.deepEqual(result, {});
		});
	});
});
