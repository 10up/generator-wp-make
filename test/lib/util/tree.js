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
				testing: {
					'blue.js': 'green',
					'red.js': 'green',
					'yellow.js': 'green'
				},
				tree: {
					level1: {
						testing: {
							'blue.js': 'green',
							'red.js': 'green',
							'yellow.js': 'green'
						}
					}
				}
			};
		});
		it('will recursively walk tree levels', function() {
			// Set up mocks
			this.mockTree.tree.level1.tree = {
				level2: {
					testing: {
						'blue.js': 'green',
						'red.js': 'green',
						'yellow.js': 'green'
					}
				}
			};
			// Run the test
			tree.tree(
				this.mockTree,
				{testing: val => `${val}.md`}
			);
			// Verfiy the result.
			const expected = {
				'blue.js': 'green.md',
				'red.js': 'green.md',
				'yellow.js': 'green.md'
			};
			assert.deepEqual(
				this.mockTree.testing,
				expected
			);
			assert.deepEqual(
				this.mockTree.tree.level1.testing,
				expected
			);
			assert.deepEqual(
				this.mockTree.tree.level1.tree.level2.testing,
				expected
			);
		});
		it('does not overwrite source with no return', function () {
			// Set up mocks
			this.mockTree.tree.level1.tree = {
				level2: {
					testing: {
						'blue.js': 'green',
						'red.js': 'green',
						'yellow.js': 'green'
					}
				}
			};
			// Run the test
			// Assert the arg we got should be green, but return nothing.
			tree.tree(
				this.mockTree,
				{testing: val => { assert.equal( val, 'green' ); }}
			);
			// Verfiy the result.
			const expected = {
				'blue.js': 'green',
				'red.js': 'green',
				'yellow.js': 'green'
			};
			assert.deepEqual(
				this.mockTree.testing,
				expected
			);
			assert.deepEqual(
				this.mockTree.tree.level1.testing,
				expected
			);
		});
		it('builds path strings off the passed directory', function () {
			// Run the test
			tree.tree(
				this.mockTree,
				{testing: (val, dir) => dir },
				'random/path'
			);
			// Verfiy the result.
			assert.deepEqual(
				this.mockTree.testing,
				{
					'blue.js': 'random/path/blue.js',
					'red.js': 'random/path/red.js',
					'yellow.js': 'random/path/yellow.js'
				}
			);
			assert.deepEqual(
				this.mockTree.tree.level1.testing,
				{
					'blue.js': 'random/path/level1/blue.js',
					'red.js': 'random/path/level1/red.js',
					'yellow.js': 'random/path/level1/yellow.js'
				}
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
			const expected = {
				'blue.js': 'green',
				'red.js': 'green',
				'yellow.js': 'green'
			};
			assert.deepEqual(
				this.mockTree.testing,
				expected
			);
			assert.deepEqual(
				this.mockTree.tree.level1.testing,
				expected
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
					_pre: () => 'baz',
					_post: () => 'baz'
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
					testing: {
						'blue.js': 'green',
						'red.js': 'green',
						'yellow.js': 'green'
					}
				}
			};
			delete this.mockTree.tree.level1.testing;
			// Run the test
			tree.tree(
				this.mockTree,
				{testing: val => `${val}.md`}
			);
			// Verfiy the result
			const expected = {
				'blue.js': 'green.md',
				'red.js': 'green.md',
				'yellow.js': 'green.md'
			};
			assert.deepEqual(
				this.mockTree.testing,
				expected
			);
			assert.notDeepEqual(
				this.mockTree.tree.level1.testing,
				expected
			);
			assert.deepEqual(
				this.mockTree.tree.level1.tree.level2.testing,
				expected
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
		it('can create a type', function () {
			const result = tree.getSubtree( 'glu' );
			assert.isObject( tree.lifecycle.tree.glu );
			assert.deepEqual( result, {} );
		});
		it('can create a branch', function () {
			const result = tree.getSubtree( 'glu', 'foo/bar' );
			assert.isObject( tree.lifecycle.tree.tree.foo.tree.bar.glu );
			assert.deepEqual(result, {});
		});
		it('can create a branch when no sub-tree exists', function () {
			const result = tree.getSubtree( 'bar', 'foo/baz' );
			assert.isObject( tree.lifecycle.tree.tree.foo.tree.baz );
			assert.isObject( tree.lifecycle.tree.tree.foo.tree.baz.bar );
			assert.deepEqual(result, {});
		});
	});
});
