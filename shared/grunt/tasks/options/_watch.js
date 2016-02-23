module.exports = {
	livereload: {
		files: ['assets/css/*.css'],
		options: {
			livereload: true
		}
	},
	css: {
		<% if ( opts.sass ) { %>files: ['assets/css/sass/**/*.scss'],<% } %>
		<% else if ( opts.autoprefixer ) { %>files: ['assets/css/src/*.css'],<% } %>
		<% else { %>files: ['assets/css/*.css', '!assets/css/*.min.css'],<% } %>
		tasks: ['css'],
		options: {
			debounceDelay: 500
		}
	},
	js: {
		files: ['assets/js/src/**/*.js', 'assets/js/vendor/**/*.js'],
			tasks: ['js'],
			options: {
			debounceDelay: 500
		}
	}
};
