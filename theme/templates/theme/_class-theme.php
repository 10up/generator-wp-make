<?php

/**
 * A simple 5.2 compatible namespace class to keep the global scope clean.
 *
 * @package <%= opts.projectTitle %>
 * @since 0.1.0
 */
class <%= classSlug %> {
	/**
	 * Set up theme defaults and register supported WordPress features.
	 *
	 * @since 0.1.0
	 * 
	 * @return void.
	 */
	function setup() {
		self::i18n();
		add_action( 'wp_enqueue_scripts', array( __CLASS__, 'scripts' ) );
		add_action( 'wp_enqueue_scripts', array( __CLASS__, 'styles' ) );
		add_action( 'wp_head', array( __CLASS__, 'header_meta' ) );
	}
	/**
	 * Makes WP Theme available for translation.
	 *
	 * Translations can be added to the /lang directory.
	 * If you're building a theme based on WP Theme, use a find and replace
	 * to change 'wptheme' to the name of your theme in all template files.
	 * 
	 * @uses load_theme_textdomain() For translation/localization support.
	 * @since 0.1.0
	 * 
	 * @return void.
	 */
	public static function i18n() {
		load_theme_textdomain( 'wptheme', <%= opts.funcPrefix.toUpperCase() %>_PATH . '/languages' );
	 }

	/**
	 * Enqueue scripts for front-end.
	 *
	 * @uses wp_enqueue_script() to load front end scripts.
	 * @since 0.1.0
	 *
	 * @return void.
	 */
	public static function scripts() {
		$min = ( defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ) ? '' : '.min';

		wp_enqueue_script(
			'wptheme',
			<%= opts.funcPrefix.toUpperCase() %>_TEMPLATE_URL . "/assets/js/<%= fileSlug %>{$min}.js",
			array(),
			<%= opts.funcPrefix.toUpperCase() %>_VERSION,
			true
		);
	}

	/**
	 * Enqueue styles for front-end.
	 *
	 * @uses wp_enqueue_style() to load front end styles.
	 * @since 0.1.0
	 *
	 * @return void.
	 */
	public static function styles() {
		$min = ( defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ) ? '' : '.min';

		wp_enqueue_style(
			'wptheme',
			<%= opts.funcPrefix.toUpperCase() %>_URL . "/assets/css/<%= fileSlug %>{$min}.css",
			array(),
			<%= opts.funcPrefix.toUpperCase() %>_VERSION
		);
	}

	/**
	 * Add humans.txt to the <head> element.
	 *
	 * @since 0.1.0
	 *
	 * @return void.
	 */
	function wptheme_header_meta() {
		$humans = '<link type="text/plain" rel="author" href="' . <%= opts.funcPrefix.toUpperCase() %>_TEMPLATE_URL . '/humans.txt" />';

		echo apply_filters( 'wptheme_humans', $humans );
	}
}
