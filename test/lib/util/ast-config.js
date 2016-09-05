import {assert} from 'chai';
import ASTConfig from '../../../lib/util/ast-config';
// import ASTQuery from 'ast-query';

describe('src > util > ast-config', function () {
	/**
	 * Confirm the file is loading correctly and tested functions are available
	 */
	describe( 'Setup', function () {
		it( 'can be imported', function () {
			assert.isOk( ASTConfig, 'ast_config is available' );
		} );
	} );

	describe( 'ASTConfig#constructor', function () {
		before( function () {
			this.astSpy = ( content, options ) => ( {
				content,
				options
			} );
		} );
		it( 'sets up a new object with default arguments', function () {
			// Create a new ASTConfig
			const ast = new ASTConfig( 'contents', undefined, this.astSpy );
			// Verify default values
			assert.equal( ast.type, 'module' );
			assert.equal( ast.query, 'module.exports' );
			assert.equal( ast.queryMethod, 'assignment' );
			// Filter should be a passthrough function by default.
			assert.isFunction( ast.filter );
			assert.equal( ast.filter( 'testing' ), 'testing' );
			// AST should have constructed an object based on the injected spy.
			assert.isObject( ast.ast );
			assert.equal( ast.ast.content, 'contents' );
			assert.isObject( ast.ast.options );
			// The default options should have been sent to the AST Syp.
			assert.isObject( ast.ast.options.format );
			assert.deepEqual( ast.ast.options.format, {
				indent: {
					adjustMultilineComment: true,
					style: '\t'
				}
			});
		} );
		it( 'allows basic options', function() {
			// Create a new ASTConfig
			const ast = new ASTConfig( 'contents', {
				type: 'testType',
				query: 'testQuery',
				queryMethod: 'testQueryMethod'
			}, this.astSpy );
			// Verify overriden values
			assert.equal( ast.type, 'testType' );
			assert.equal( ast.query, 'testQuery' );
			assert.equal( ast.queryMethod, 'testQueryMethod' );
			// verify still default values
			assert.isFunction( ast.filter );
			assert.equal( ast.filter( 'testing' ), 'testing' );
			assert.isObject( ast.ast.options );
		} );
		it( 'allows advanced options', function() {
			// Create a new ASTConfig
			const ast = new ASTConfig( 'contents', {
				filter: () => 'testFilter',
				formatOpts: { format: 'overridden' }
			}, this.astSpy );
			// Verify basic default values
			assert.equal( ast.type, 'module' );
			assert.equal( ast.query, 'module.exports' );
			assert.equal( ast.queryMethod, 'assignment' );
			// Verify overrid of advanced options
			assert.equal( ast.filter(), 'testFilter' );
			assert.deepEqual( ast.ast.options, { format: 'overridden' } );
		} );
		it( 'only allows overriding filter with a function', function() {
			// Create a new ASTConfig
			const ast = new ASTConfig( 'contents', {
				filter: 'Not a function'
			}, this.ASTSpy );
			// Verify filter is still a function and defaults to passthrough.
			assert.isFunction( ast.filter );
			assert.equal( ast.filter( 'testing' ), 'testing' );
		} );
		it( 'will use ASTQuery when no AST constructor is passed', function() {
			const ast = new ASTConfig( 'const test = {};' );
			// Since the AST Query constructor is not exposed, we'll duck punch
			assert.isObject( ast.ast );
			assert.isFunction( ast.ast.assignment );
			assert.isFunction( ast.ast.var );
			assert.isFunction( ast.ast.toString );
		} );
		it( 'will stringify passed content input', function () {
			const ast = new ASTConfig( true, undefined, this.astSpy );
			assert.equal( ast.ast.content, 'true' );
		} );
	} );
	describe( 'ASTConfig#getDefault', function () {
		before( function () {
			this.astSpy = ( content ) => ( {
				content,
				query: ( data ) => `${data} ${content}`
			} );
		} );
		it( 'queries the AST object based on passed settings', function () {
			const ast = new ASTConfig( 'testing', {
				query: 'data',
				queryMethod: 'query'
			}, this.astSpy );
			assert.equal( ast.getDefault(), 'data testing' );
		} );
		it( 'runs the return through the filter method', function() {
			const ast = new ASTConfig( 'testing', {
				query: 'data',
				queryMethod: 'query',
				filter: ( data ) => `${data} filtered`
			}, this.astSpy );
			assert.equal( ast.getDefault(), 'data testing filtered' );
		} );
	} );
	describe( 'ASTConfig#setDefault', function () {
		before( function () {
			this.getSpy = () => ( { value: val => { this.setValue = val; } } );
		} );
		beforeEach( function() {
			delete this.setValue;
		} );
		it( 'runs the #value method on the default location', function () {
			const ast = new ASTConfig( 'testing', undefined, () => undefined );
			ast.getDefault = this.getSpy;
			ast.setDefault( 'a testing string' );
			assert.equal( this.setValue, 'a testing string' );
		} );
		it( 'stringifies things that are not already a string', function () {
			const ast = new ASTConfig( 'testing', undefined, () => undefined );
			ast.getDefault = this.getSpy;
			ast.setDefault( {
				bool: true,
				str: 'testing',
				arr: [1, 2]
			} );
			assert.equal(
				this.setValue,
				'{ bool: true, str: \'testing\', arr: [ 1, 2 ] }'
			);
		} );
	} );
	describe( 'ASTConfig#toString', function () {
		it( 'runs the #toString method on the internal AST', function () {
			this.count = 0;
			const astSpy = () => ( { toString: () => ++this.count } );
			const ast = new ASTConfig( '', undefined, astSpy );
			const result = ast.toString();
			assert.equal( result, 1 );
			assert.equal( this.count, 1 );
		} );
	} );
} );
