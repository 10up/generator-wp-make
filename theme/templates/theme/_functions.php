<?php

/**
 * <%= opts.projectTitle %> functions and definitions
 *
 * When using a child theme (see http://codex.wordpress.org/Theme_Development and
 * http://codex.wordpress.org/Child_Themes), you can override certain functions
 * (those wrapped in a function_exists() call) by defining them first in your child theme's
 * functions.php file. The child theme's functions.php file is included before the parent
 * theme's file, so the child theme functions would be used.
 *
 * @package <%= opts.projectTitle %>
 * @since 0.1.0
 */

// Useful global constants
define( '<%= opts.funcPrefix.toUpperCase() %>_VERSION',      '0.1.0' );
define( '<%= opts.funcPrefix.toUpperCase() %>_URL',          get_stylesheet_directory_uri() );
define( '<%= opts.funcPrefix.toUpperCase() %>_TEMPLATE_URL', get_template_directory_uri() );
define( '<%= opts.funcPrefix.toUpperCase() %>_PATH',         get_template_directory() );
define( '<%= opts.funcPrefix.toUpperCase() %>_INC',          <%= opts.funcPrefix.toUpperCase() %>_PATH . 'includes/' );

// Include files
require_once <%= opts.funcPrefix.toUpperCase() %>_INC . 'class-<%= fileSlug %>.php';

// Wireup actions
add_action( 'after_setup_theme', array( '<%= classSlug %>', 'setup' ) );

// Wireup filters
