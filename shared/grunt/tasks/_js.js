module.exports = function( grunt ) {
	grunt.registerTask( 'js', [ 'eslint', 'concat', 'uglify' ] );
};
