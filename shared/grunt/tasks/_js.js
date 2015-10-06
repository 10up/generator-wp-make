module.exports = function (grunt) {
	grunt.registerTask( 'js', ['jshint', 'concat', 'uglify'] );
};