<?php
namespace <%= opts.root_namespace %>\<%= namespace %>\Core;

/**
 * Set up theme defaults and register supported WordPress features.
 *
 * @since 0.1.0
 *
 * @uses add_action()
 *
 * @return void
 */
function setup() {
	$n = function( $function ) {
		return __NAMESPACE__ . "\\$function";
	};

	add_action( 'after_setup_theme',  $n( 'i18n' )        );
	add_action( 'init', $n( 'register_scripts' ) );
	add_action( 'init', $n( 'register_styles' ) );
	add_action( 'wp_enqueue_scripts', $n( 'enqueue_global_scripts' ) );
	add_action( 'wp_enqueue_scripts', $n( 'enqueue_global_styles' ) );
	<% if ( false !== opts.humanstxt ) { %>add_action( 'wp_head',            $n( 'header_meta' ) );<% } %>
}

/**
 * Makes WP Theme available for translation.
 *
 * Translations can be added to the /lang directory.
 * If you're building a theme based on WP Theme, use a find and replace
 * to change 'wptheme' to the name of your theme in all template files.
 *
 * @uses load_theme_textdomain() For translation/localization support.
 *
 * @since 0.1.0
 *
 * @return void
 */
function i18n() {
	load_theme_textdomain( '<%= opts.funcPrefix %>', <%= opts.funcPrefix.toUpperCase() %>_PATH . '/languages' );
 }

/**
 * Register scripts for front-end.
 *
 * @uses wp_register_script() to load front end scripts.
 *
 * @since 0.1.0
 *
 * @return void
 */
function register_scripts() {
	/**
	 * Flag whether to enable loading uncompressed/debugging assets. Default false.
	 * 
	 * @param bool <%= opts.funcPrefix %>_script_debug
	 */
	$debug = apply_filters( '<%= opts.funcPrefix %>_script_debug', false );
	$min = ( $debug || defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ) ? '' : '.min';
	$dir = ( $debug || defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ) ? '.src-browserify' : 'build';

	wp_register_script(
		'<%= opts.funcPrefix %>',
		<%= opts.funcPrefix.toUpperCase() %>_TEMPLATE_URL . "/assets/js/{$dir}/<%= fileSlug %>{$min}.js",
		array(),
		<%= opts.funcPrefix.toUpperCase() %>_VERSION,
		true
	);
}

/**
 * Enqueue global scripts for front-end.
 *
 * @uses wp_enqueue_script() to load front end scripts.
 *
 * @since 0.1.0
 *
 * @return void
 */
function enqueue_global_scripts() {
	wp_enqueue_script( '<%= opts.funcPrefix %>' );
}

/**
 * Register global styles for front-end.
 *
 * @uses wp_register_style() to load front end styles.
 *
 * @since 0.1.0
 *
 * @return void
 */
function register_styles() {
	/**
	 * Flag whether to enable loading uncompressed/debugging assets. Default false.
	 *
	 * @param bool <%= opts.funcPrefix %>_style_debug
	 */
	$debug = apply_filters( '<%= opts.funcPrefix %>_style_debug', false );
	$min = ( $debug || defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ) ? '' : '.min';

	wp_register_style(
		'<%= opts.funcPrefix %>',
		<%= opts.funcPrefix.toUpperCase() %>_URL . "/assets/css/<%= fileSlug %>{$min}.css",
		array(),
		<%= opts.funcPrefix.toUpperCase() %>_VERSION
	);
}

/**
 * Enqueue styles for front-end.
 *
 * @uses wp_enqueue_style() to load front end styles.
 *
 * @since 0.1.0
 *
 * @return void
 */
function enqueue_global_styles() {
	wp_enqueue_style( '<%= opts.funcPrefix %>' );
}

<% if ( false !== opts.humanstxt ) { %>/**
 * Add humans.txt to the <head> element.
 *
 * @uses apply_filters()
 *
 * @since 0.1.0
 *
 * @return void
 */
function header_meta() {
	/**
	 * Filter the path used for the site's humans.txt attribution file
	 *
	 * @param string $humanstxt
	 */
	$humanstxt = apply_filters( '<%= opts.funcPrefix %>_humans', <%= opts.funcPrefix.toUpperCase() %>_TEMPLATE_URL . '/humans.txt' );

	echo '<link type="text/plain" rel="author" href="' . esc_url( $humanstxt ) . '" />';
}<% } %>
