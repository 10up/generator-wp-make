<?php

/**
 * This is a very basic test case to get things started. You should probably rename this and make
 * it work for your project. You can use all the tools provided by WP Mock and Mockery to create
 * your tests. Coverage is calculated against your includes/ folder, so try to keep all of your
 * functional code self contained in there.
 *
 * References:
 *   - http://phpunit.de/manual/current/en/index.html
 *   - https://github.com/padraic/mockery
 *   - https://github.com/10up/wp_mock
 */

use WP_Mock\Tools\TestCase;

class <%= classSlug %>_Test extends TestCase {

	/**
	 * Set up before any test methods run.
	 */
	public static function setUpBeforeClass() {
		parent::setUpBeforeClass();
		require_once <%= opts.funcPrefix.toUpperCase() %>_DIR . 'includes/class-<%= fileSlug %>.php';
	}

	/**
	 * Set up before each test method runs.
	 */
	public function setUp() {
		parent::setUp();
	}

	/** 
	 * Test setup method.
	 */
	public function test_setup() {
		\WP_Mock::expectActionAdded( 'init', array( '<%= classSlug %>', 'i18n' ) );
		\WP_Mock::expectActionAdded( 'wp_enqueue_scripts', array( '<%= classSlug %>', 'scripts' ) );
		\WP_Mock::expectActionAdded( 'wp_enqueue_scripts', array( '<%= classSlug %>', 'styles' ) );
		\WP_Mock::expectActionAdded( 'wp_head', array( '<%= classSlug %>', 'header_meta' ) );

		<%= classSlug %>::setup();
		$this->assertConditionsMet();
	}

	/** 
	 * Test internationalization integration.
	 */
	public function test_i18n() {
		\WP_Mock::wpFunction( 'load_theme_textdomain', array(
			'times' => 1,
			'args' => array(
				'<%= opts.funcPrefix %>',
				<%= opts.funcPrefix.toUpperCase() %>_PATH . '/languages'
			),
		) );

		<%= classSlug %>::i18n();
		$this->assertConditionsMet();
	}

	/** 
	 * Test scripts enqueue.
	 */
	public function test_scripts() {
		// Regular
		\WP_Mock::wpFunction( 'wp_enqueue_script', array(
			'times' => 1,
			'args' => array(
				'<%= opts.funcPrefix %>',
				'template_url/assets/js/<%= fileSlug %>.min.js',
				array(),
				'0.0.1',
				true,
			),
		) );

		<%= classSlug %>::scripts();
		$this->assertConditionsMet();
		
		// Debug Mode
		\WP_Mock::wpFunction( 'wp_enqueue_script', array(
			'times' => 1,
			'args' => array(
				'<%= opts.funcPrefix %>',
				'template_url/assets/js/<%= fileSlug %>.js',
				array(),
				'0.0.1',
				true,
			),
		) );

		<%= classSlug %>::scripts( true );
		$this->assertConditionsMet();
	}

	/** 
	 * Test style enqueue.
	 */
	public function test_styles() {
		// Regular
		\WP_Mock::wpFunction( 'wp_enqueue_style', array(
			'times' => 1,
			'args' => array(
				'<%= opts.funcPrefix %>',
				'url/assets/css/<%= fileSlug %>.min.css',
				array(),
				'0.0.1',
			),
		) );

		<%= classSlug %>::styles();
		$this->assertConditionsMet();
		
		// Debug Mode
		\WP_Mock::wpFunction( 'wp_enqueue_style', array(
			'times' => 1,
			'args' => array(
				'<%= opts.funcPrefix %>',
				'url/assets/css/<%= fileSlug %>.css',
				array(),
				'0.0.1',
			),
		) );

		<%= classSlug %>::styles( true );
		$this->assertConditionsMet();
	}

	/** 
	 * Test header meta injection
	 */
	public function test_header_meta() {
		$meta = '<link type="text/plain" rel="author" href="template_url/humans.txt" />';
		\WP_Mock::onFilter( '<%= opts.funcPrefix %>_humans' )->with( $meta )->reply( $meta );

		ob_start();
		<%= classSlug %>::header_meta();
		$result = ob_get_clean();
		$this->assertConditionsMet();
		$this->assertEquals( $meta, $result );
	}

	/**
	 * Clean up run after each test method runs.
	 */
	public function tearDown() {
        parent::tearDown();
    }
	
	/**
	 * Clean up after all test methods have run.
	 */
	public static function tearDownAfterClass() {
		parent::tearDownAfterClass();
    }
}