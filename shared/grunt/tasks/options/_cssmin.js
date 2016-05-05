module.exports = {
	options: {
		banner: '/*! <%%= pkg.title %> - v<%%= pkg.version %>\n' +
		' * <%%=pkg.homepage %>\n' +
		' * Copyright (c) <%%= grunt.template.today("yyyy") %>;' +
		<% if ( opts.license ) { %>' * Licensed <%= opts.license %>' +<% } %>
		' */\n'
	},
	minify: {
		expand: true,

		cwd: 'assets/css/',
		src: ['<%= fileSlug %>.css'],

		dest: 'assets/css/',
		ext: '.min.css'
	}
};
