<?php

/**
 * A simple 5.2 compatible namespace class to keep the global scope clean.
 */
class <%= classSlug %> {
	/**
	 * Runs load methods and fires an action other plugins can hook into.
	 *
	 * @return void.
	 */
	public static function load() {
		self::i18n();
		add_action( 'init', array( __CLASS__, 'init' ) );
		do_action( '<%= opts.funcPrefix %>_loaded' );
	}
	/**
	 * Initializes the plugin and fires an action other plugins can hook into.
	 * 
	 * @return void.
	 */
	public static function init() {
		do_action( '<%= opts.funcPrefix %>_init' );
	}
	/**
	 * Registers the default textdomain.
	 *
	 * @return void.
	 */
	public static function i18n() {
		$locale = apply_filters( 'plugin_locale', get_locale(), '<%= opts.funcPrefix %>' );
		load_textdomain( '<%= opts.funcPrefix %>', WP_LANG_DIR . '/<%= opts.funcPrefix %>/<%= opts.funcPrefix %>-' . $locale . '.mo' );
		load_plugin_textdomain( '<%= opts.funcPrefix %>', false, plugin_basename( <%= opts.funcPrefix.toUpperCase() %>_PATH ) . '/languages/' );
	}

	/**
	 * Activate the plugin
	 *
	 * @return void.
	 */
	public static function activate() {
		// First load the init scripts in case any rewrite functionality is being loaded
		self::init();
		flush_rewrite_rules();
	}

	/**
	 * Deactivate the plugin
	 * 
	 * Uninstall routines should be in uninstall.php
	 *
	 * @return void.
	 */
	public static function deactivate() {

	}
}
