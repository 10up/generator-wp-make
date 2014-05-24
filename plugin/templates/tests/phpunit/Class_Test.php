<?php

use WP_Mock\Tools\TestCase;

class WP_Keen_IO_API_Test extends TestCase {

	/**
	 * Set up before any test methods run.
	 */
	public static function setUpBeforeClass() {
		\WP_Mock::setUpBeforeClass();
		//require_once path/to/tested/file;
	}

	/**
	 * Set up before each test method runs.
	 */
	public function setUp() {
		\WP_Mock::setUp();
	}

	/** 
	 * A very basic test method.
	 */
	public function test() {
		$this->assertTrue( true );
	}

	/**
	 * Clean up run after each test method runs.
	 */
	public function tearDown() {
        \WP_Mock::tearDown();
    }
	
	/**
	 * Clean up after all test methods have run.
	 */
	public static function tearDownAfterClass() {
		\WP_Mock::tearDownAfterClass();
    }
}