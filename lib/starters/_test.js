module.exports = function (grunt) {
	grunt.registerTask( 'test', ['phpunit', 'mocha'] );
};
