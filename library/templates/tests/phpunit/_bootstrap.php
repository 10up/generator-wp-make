<?php
if ( ! defined( 'PROJECT' ) ) {
	define( 'PROJECT', __DIR__ . '/php/' );
}

if ( ! file_exists( __DIR__ . '/vendor/autoload.php' ) ) {
	throw new PHPUnit_Framework_Exception(
		'ERROR' . PHP_EOL . PHP_EOL .
		'You must use Composer to install the test suite\'s dependencies!' . PHP_EOL
	);
}

require_once __DIR__ . '/vendor/autoload.php';

require_once __DIR__ . '/tests/phpunit/test-tools/TestCase.php';

WP_Mock::setUsePatchwork( true );
WP_Mock::bootstrap();
WP_Mock::tearDown();