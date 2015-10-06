module.exports = {
	dist: {
		options: {
			processors: [
				require('autoprefixer')({browsers: 'last 2 versions'})
			]
		},
		files: { <% if ( opts.sass ) { %>
			'assets/css/<%= fileSlug %>.css': [ 'assets/css/<%= fileSlug %>.css' ]<% } else { %>
			'assets/css/<%= fileSlug %>.css': [ 'assets/css/src/<%= fileSlug %>.css' ]<% } %>
		}
	}
};