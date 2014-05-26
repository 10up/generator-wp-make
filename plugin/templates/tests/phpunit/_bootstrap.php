<?php

require_once __DIR__ . '/vendor/autoload.php';

WP_Mock::bootstrap();

if ( ! defined( '<%= opts.funcPrefix.toUpperCase() %>_DIR' ) ) {
	define( '<%= opts.funcPrefix.toUpperCase() %>_DIR', __DIR__ . '/' );
}

// Place any additional bootstrapping requirements here for PHP Unit.
if ( ! defined( 'WP_LANG_DIR' ) ) {
	define( 'WP_LANG_DIR', 'lang_dir' );
}
if ( ! defined( '<%= opts.funcPrefix.toUpperCase() %>_PATH' ) ) {
	define( '<%= opts.funcPrefix.toUpperCase() %>_PATH', 'path' );
}