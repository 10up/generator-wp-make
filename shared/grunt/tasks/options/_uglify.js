module.exports = {
	all: {
		files: {
			'assets/js/<%= fileSlug %>.min.js': ['assets/js/<%= fileSlug %>.js']
		},
		options: {
			banner: '/*! <%%= pkg.title %> - v<%%= pkg.version %>\n' +
			' * <%%= pkg.homepage %>\n' +
			' * Copyright (c) <%%= grunt.template.today("yyyy") %>;' +
			' * Licensed GPLv2+' +
			' */\n',
			mangle: {
				except: ['jQuery']
			}
		}
	}
};