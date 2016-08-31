module.exports = function (grunt) {
	grunt.registerTask( 'build', ['default', 'clean', 'copy', 'test', 'compress'] );
};
