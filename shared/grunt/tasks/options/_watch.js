module.exports = {
	livereload: {
		files: ['assets/css/*.css'],
		options: {
			livereload: true
		}
	},
	styles: { <% if ( opts.sass ) { %>
		files: ['assets/css/sass/**/*.scss'],
		tasks: ['sass', 'autoprefixer', 'cssmin'],<% } else if ( opts.autoprefixer ) { %>
		files: ['assets/css/src/*.css'],
		tasks: ['autoprefixer', 'cssmin'],<% } else { %>
		files: ['assets/css/*.css', '!assets/css/*.min.css'],
		tasks: ['cssmin'],<% } %>
		options: {
			debounceDelay: 500
		}
	},
	scripts: {
		files: ['assets/js/src/**/*.js', 'assets/js/vendor/**/*.js'],
			tasks: ['jshint', 'concat', 'uglify'],
			options: {
			debounceDelay: 500
		}
	}
};