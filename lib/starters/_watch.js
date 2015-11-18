module.exports = {
	livereload: {
		files: [ 'assets/css/*.css' ],
		options: {
			livereload: true
		}
	},
	styles: {
		files: [ 'assets/css/*.css' ],
		tasks: [ 'cssmin' ],
		options: {
			debounceDelay: 500
		}
	},
	scripts: {
		files: [ 'assets/js/src/**/*.js', 'assets/js/vendor/**/*.js' ],
		tasks: [ 'jshint', 'concat', 'uglify' ],
		options: {
			debounceDelay: 500
		}
	}
};
