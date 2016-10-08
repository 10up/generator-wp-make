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
	 * Test the tree mapping abilities of the tree method.
	 */
	describe('#tree', function () {
		beforeEach( function () {
			this.mockTree = {
				testing: { foo: 'bar' },
				tree: {
					level1: {
						testing: { foo: 'bar' }
					}
				}
			};
		});
		it('will recursively walk tree levels', function() {
			// Set up mocks
			this.mockTree.tree.level1.tree = {
				level2: {
					testing: { foo: 'bar' }
				}
			};
			// Run the test
			tree.tree(
				this.mockTree,
				{testing: val => { val.foo = 'baz'; }}
			);
			// Verfiy the result.
			assert.deepPropertyVal(
				this.mockTree,
				'testing.foo',
				'baz'
			);
			assert.deepPropertyVal(
				this.mockTree,
				'tree.level1.testing.foo',
				'baz'
			);
			assert.deepPropertyVal(
				this.mockTree,
				'tree.level1.tree.level2.testing.foo',
				'baz'
			);
		});
		it('builds a path string off the passed directory', function () {
			// Run the test
			tree.tree(
				this.mockTree,
				{testing: (val, dir) => { val.foo = dir; }},
				'/some/random/path'
			);
			// Verfiy the result.
			assert.deepPropertyVal(
				this.mockTree,
				'testing.foo',
				'/some/random/path'
			);
			assert.deepPropertyVal(
				this.mockTree,
				'tree.level1.testing.foo',
				'/some/random/path/level1'
			);
		});
		it('allows _pre and _post operators', function () {
			// Run the test
			const result = [];
			tree.tree(
				this.mockTree,
				{
					_pre: (...val) => result.push(['_pre', ...val]),
					_post: (...val) => result.push(['_post', ...val])
				}
			);
			// Verify the results
			assert.deepEqual(
				result,
				[
					['_pre', this.mockTree, ''],
					['_post', this.mockTree, ''],
					['_pre', this.mockTree.tree.level1, 'level1'],
					['_post', this.mockTree.tree.level1, 'level1']
				]
			);
		});
		it('runs all methods with the tree object as context', function () {
			// Set up assertions.
			const contextChecker = function() {
				assert.equal(this, tree);
			};
			//Run the test
			tree.tree(
				this.mockTree,
				{
					_pre: contextChecker,
					testing: contextChecker,
					_post: contextChecker
				}
			);
		});
		it('ignores non-function processors', function () {
			// Run the test
			tree.tree(
				this.mockTree,
				{
					_pre: 'willnotrun',
					testing: 'willnotrun',
					_post: 'willnotrun'
				}
			);
			// Verfiy the result.
			assert.deepPropertyVal(
				this.mockTree,
				'testing.foo',
				'bar'
			);
			assert.deepPropertyVal(
				this.mockTree,
				'tree.level1.testing.foo',
				'bar'
			);
		});
		it('does not allow _pre and _post as tree keys', function () {
			//Set up mocks
			this.mockTree._pre = {foo: 'bar'};
			this.mockTree._post = {foo: 'bar'};
			// Run the test
			tree.tree(
				this.mockTree,
				{
					_pre: val => { val.foo = 'baz'; },
					_post: val => { val.foo = 'baz'; }
				}
			);
			// Verify the results
			assert.propertyVal(this.mockTree._pre, 'foo', 'bar');
			assert.propertyVal(this.mockTree._post, 'foo', 'bar');
		});
		it('skips levels without defined keys', function () {
			// Set up mocks
			this.mockTree.tree.level1.tree = {
				level2: {
					testing: { foo: 'bar' }
				}
			};
			delete this.mockTree.tree.level1.testing;
			// Run the test
			tree.tree(
				this.mockTree,
				{testing: val => { val.foo = 'baz'; }}
			);
			// Verfiy the result
			assert.notDeepProperty(
				this.mockTree,
				'tree.level1.testing'
			);
			assert.deepPropertyVal(
				this.mockTree,
				'testing.foo',
				'baz'
			);
			assert.deepPropertyVal(
				this.mockTree,
				'tree.level1.tree.level2.testing.foo',
				'baz'
			);
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
