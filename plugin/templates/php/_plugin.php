<?php
/**
 * Plugin Name: <%= opts.projectTitle %>
 * Plugin URI:  <%= opts.projectHome %>
 * Description: <%= opts.description %>
 * Version:     0.1.0
 * Author:      <%= opts.authorName %>
 * Author URI:  <%= opts.authorUrl %>
 * License:     GPLv2+
 * Text Domain: <%= opts.funcPrefix %>
 * Domain Path: /languages
 */

/**
 * Copyright (c) 2014 10up (email : info@10up.com)
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License, version 2 or, at
 * your discretion, any later version, as published by the Free
 * Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
 */

/**
 * Built using yo wp-make:plugin
 * Copyright (c) 2014 10up, LLC
 * https://github.com/lkwdwrd/generator-wp-make
 */

// Useful global constants
define( '<%= opts.funcPrefix.toUpperCase() %>_VERSION', '0.1.0' );
define( '<%= opts.funcPrefix.toUpperCase() %>_URL',     plugin_dir_url( __FILE__ ) );
define( '<%= opts.funcPrefix.toUpperCase() %>_PATH',    dirname( __FILE__ ) . '/' );
define( '<%= opts.funcPrefix.toUpperCase() %>_INC',     <%= opts.funcPrefix.toUpperCase() %>_PATH . 'includes/' );

/**
 * Default initialization for the plugin:
 * - Registers the default textdomain.
 */
function <%= opts.funcPrefix %>_init() {
	$locale = apply_filters( 'plugin_locale', get_locale(), '<%= opts.funcPrefix %>' );
	load_textdomain( '<%= opts.funcPrefix %>', WP_LANG_DIR . '/<%= opts.funcPrefix %>/<%= opts.funcPrefix %>-' . $locale . '.mo' );
	load_plugin_textdomain( '<%= opts.funcPrefix %>', false, dirname( plugin_basename( __FILE__ ) ) . '/languages/' );
}

/**
 * Activate the plugin
 */
function <%= opts.funcPrefix %>_activate() {
	// First load the init scripts in case any rewrite functionality is being loaded
	<%= opts.funcPrefix %>_init();

	flush_rewrite_rules();
}
register_activation_hook( __FILE__, '<%= opts.funcPrefix %>_activate' );

/**
 * Deactivate the plugin
 * Uninstall routines should be in uninstall.php
 */
function <%= opts.funcPrefix %>_deactivate() {

}
register_deactivation_hook( __FILE__, '<%= opts.funcPrefix %>_deactivate' );

// Wireup actions
add_action( 'init', '<%= opts.funcPrefix %>_init' );

// Wireup filters

// Wireup shortcodes
