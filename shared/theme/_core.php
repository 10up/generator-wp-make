<?php
namespace TenUp\<%= namespace %>\Core;

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
	add_action( 'wp_head',            $n( 'header_meta' ) );
	add_action( 'wp_enqueue_scripts', $n( 'scripts' )     );
	add_action( 'wp_enqueue_scripts', $n( 'styles' )      );
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
 * Enqueue scripts for front-end.
 *
 * @uses wp_enqueue_script() to load front end scripts.
 *
 * @since 0.1.0
 *
 * @param bool $debug Whether to enable loading uncompressed/debugging assets. Default false.
 * @return void
 */
function scripts( $debug = false ) {
	wp_enqueue_script(
		'<%= opts.funcPrefix %>',
		<%= opts.funcPrefix.toUpperCase() %>_TEMPLATE_URL . "/assets/js/<%= fileSlug %>.js",
		array(),
		<%= opts.funcPrefix.toUpperCase() %>_VERSION,
		true
	);

	wp_enqueue_script(
		'<%= opts.funcPrefix %>-oldie',
		<%= opts.funcPrefix.toUpperCase() %>_TEMPLATE_URL . "/assets/js/<%= fileSlug %>.oldie.js",
		array(),
		<%= opts.funcPrefix.toUpperCase() %>_VERSION,
		true
	);

	add_filter( 'script_loader_tag', function ( $tag, $handle ) {
		if ( $handle === '<%= opts.funcPrefix %>' ) {
			$tag = '<!--[if gt IE 8]><!-->' . $tag . '<!--<![endif]-->';
		} else if ( $handle === '<%= opts.funcPrefix %>-oldie' ) {
			$tag = '<!--[if lte IE 8]>' . $tag . '<![endif]-->';
		}

		return $tag;
	}, 10, 2 );
}

/**
 * Enqueue styles for front-end.
 *
 * @uses wp_enqueue_style() to load front end styles.
 *
 * @since 0.1.0
 *
 * @param bool $debug Whether to enable loading uncompressed/debugging assets. Default false.
 * @return void
 */
function styles( $debug = false ) {
	wp_enqueue_style(
		'<%= opts.funcPrefix %>',
		<%= opts.funcPrefix.toUpperCase() %>_URL . "/assets/css/<%= fileSlug %>.css",
		array(),
		<%= opts.funcPrefix.toUpperCase() %>_VERSION,
		'screen, handheld, tv, projection'
	);

	wp_enqueue_style(
		'<%= opts.funcPrefix %>-oldie',
		<%= opts.funcPrefix.toUpperCase() %>_URL . "/assets/css/<%= fileSlug %>.oldie.css",
		array(),
		<%= opts.funcPrefix.toUpperCase() %>_VERSION
	);

	$wp_styles->add_data( '<%= opts.funcPrefix %>-oldie', 'conditional', 'lte IE 8' );
}

/**
 * Add humans.txt to the <head> element.
 *
 * @uses apply_filters()
 *
 * @since 0.1.0
 *
 * @return void
 */
function header_meta() {
	$humans = '<link type="text/plain" rel="author" href="' . <%= opts.funcPrefix.toUpperCase() %>_TEMPLATE_URL . '/humans.txt" />';

	echo apply_filters( '<%= opts.funcPrefix %>_humans', $humans );
}
