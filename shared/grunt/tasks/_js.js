module.exports = function( grunt ) {
	grunt.registerTask( 'js', [ 'eslint', 'jscs', 'babel', 'browserify', 'uglify' ] );
};
