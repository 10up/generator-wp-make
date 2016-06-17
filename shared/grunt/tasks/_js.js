module.exports = function( grunt ) {
	grunt.registerTask( 'js', [ 'eslint', 'jscs', 'concat', 'uglify' ] );
};
