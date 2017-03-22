module.exports = {
	all: {
		files: [{
			expand: true,
			cwd: 'assets/js/.src-browserify/',
			src: ['*.js'],
			dest: 'assets/js/build/',
			ext: '.min.js'
		}],
		options: {
			banner: '/*! <%%= pkg.title %> - v<%%= pkg.version %>\n' +
			' * <%%= pkg.homepage %>\n' +
			' * Copyright (c) <%%= grunt.template.today("yyyy") %>;' +
			<% if ( opts.license ) { %>' * Licensed <%= opts.license %>' +<% } %>
			' */\n',
			mangle: {
				except: ['jQuery']
			}
		}
	}
};
