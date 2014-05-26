<?php

require_once __DIR__ . '/vendor/autoload.php';

WP_Mock::bootstrap();

if ( ! defined( '<%= opts.funcPrefix.toUpperCase() %>_DIR' ) ) {
	define( '<%= opts.funcPrefix.toUpperCase() %>_DIR', __DIR__ . '/' );
}

// Place any additional bootstrapping requirements here for PHP Unit.
if ( ! defined( '<%= opts.funcPrefix.toUpperCase() %>_VERSION' ) ) {
	define( '<%= opts.funcPrefix.toUpperCase() %>_VERSION', '0.0.1' );
}

if ( ! defined( '<%= opts.funcPrefix.toUpperCase() %>_URL' ) ) {
	define( '<%= opts.funcPrefix.toUpperCase() %>_URL', 'url' );
}

if ( ! defined( '<%= opts.funcPrefix.toUpperCase() %>_TEMPLATE_URL' ) ) {
	define( '<%= opts.funcPrefix.toUpperCase() %>_TEMPLATE_URL', 'template_url' );
}

if ( ! defined( '<%= opts.funcPrefix.toUpperCase() %>_PATH' ) ) {
	define( '<%= opts.funcPrefix.toUpperCase() %>_PATH', 'path' );
}
