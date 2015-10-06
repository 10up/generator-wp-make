module.exports = function (grunt) {
	grunt.registerTask( 'css', ['postcss', 'cssmin'] );
};