<?php
namespace TenUp\<%= namespace %>\Core;

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

use WP_Mock\Tools\TestCase as BaseTestCase;
use TenUp\<%= namespace %> as Base;

class Core_Test extends Base\TestCase {

	protected $testFiles = [

	];

	/** 
	 * Test load method.
	 */
	public function test_load() {
		\WP_Mock::expectActionAdded( 'init', array( '<%= namespace %>', 'i18n' ) );
		\WP_Mock::expectActionAdded( 'init', array( '<%= namespace %>', 'init' ) );
		\WP_Mock::expectAction( '<%= opts.funcPrefix %>_loaded' );

		<%= namespace %>::load();
		$this->assertConditionsMet();
	}

	/** 
	 * Test initialization method.
	 */
	public function test_init() {
		\WP_Mock::expectAction( '<%= opts.funcPrefix %>_init' );

		<%= namespace %>::init();
		$this->assertConditionsMet();
	}

	/** 
	 * Test internationalization integration.
	 */
	public function test_i18n() {
		\WP_Mock::wpFunction( 'get_locale', array(
			'times' => 1,
			'args' => array(),
			'return' => 'en_US',
		) );
		\WP_Mock::onFilter( 'plugin_locale' )->with( 'en_US', '<%= opts.funcPrefix %>' )->reply( 'en_US' );
		\WP_Mock::wpFunction( 'load_textdomain', array(
			'times' => 1,
			'args' => array( '<%= opts.funcPrefix %>', 'lang_dir/<%= opts.funcPrefix %>/<%= opts.funcPrefix %>-en_US.mo' ),
		) );
		\WP_Mock::wpFunction( 'plugin_basename', array(
			'times' => 1,
			'args' => array( 'path' ),
			'return' => 'path',
		) );
		\WP_Mock::wpFunction( 'load_plugin_textdomain', array(
			'times' => 1,
			'args' => array( '<%= opts.funcPrefix %>', false, 'path/languages/' ),
		) );

		<%= namespace %>::i18n();
		$this->assertConditionsMet();
	}

	/** 
	 * Test activation routine.
	 */
	public function test_activate() {
		\WP_Mock::wpFunction( 'flush_rewrite_rules', array(
			'times' => 1
		) );

		<%= namespace %>::activate();
		$this->assertConditionsMet();
	}

	/** 
	 * Test deactivation routine.
	 */
	public function test_deactivate() {
		<%= namespace %>::deactivate();
	}
}