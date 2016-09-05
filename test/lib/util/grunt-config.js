import {assert} from 'chai';
import gruntConfig from '../../../lib/util/grunt-config';
import ASTConfig from '../../../lib/util/ast-config';

describe('lib > util > grunt-config', function () {
	/**
	 * Confirm the file is loading correctly and tested functions are available
	 */
	describe( 'Setup', function () {
		it( 'can be imported', function () {
			assert.isOk(gruntConfig, 'grunt-config is available');
		});

	});
	describe( 'The Grunt AST helper function', function () {
		it( 'by default returns an instance of ASTConfig', function () {
			const config = gruntConfig( 'var blue = 1;' );
			assert.instanceOf( config, ASTConfig );
		} );
		it( 'Automatically sets defaults for grunt AST', function () {
			// Create a config instance with an astSpy to check passed input.
			const config = gruntConfig( '', function ( content, opts ) {
				this.content = content;
				this.opts = opts;
			} );
			// Check to see if we got the expected keys and types.
			// Do not necessarily assume exactly what is passed.
			// Only assume that those keys *are* passed.
			assert.equal( config.content, '' );
			assert.property( config.opts, 'type' );
			assert.isString( config.opts.type );
			assert.property( config.opts, 'query' );
			assert.isString( config.opts.query );
			assert.property( config.opts, 'queryMethod' );
			assert.isString( config.opts.queryMethod );
			assert.property( config.opts, 'filter' );
			assert.isFunction( config.opts.filter );
			assert.equal(
				config.opts.filter( {
					arguments: {
						at: val => val
					}
				} ),
				1
			);
		} );
		it( 'sends a filter to get the aguments value at 1', function () {
			// Create a config instance with an astSpy to check passed input.
			const config = gruntConfig( '', function ( content, opts ) {
				this.content = content;
				this.opts = opts;
			} );
			// Check to see the filter method calls arguments.at( 1 );
			assert.equal(
				config.opts.filter( {
					arguments: {
						at: val => val
					}
				} ),
				1
			);
		} );
	} );
});
