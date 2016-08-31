module.exports = {
	options: {
		banner: '/*! <%%= pkg.title %> - v<%%= pkg.version %>\n * <%%=pkg.homepage %>\n * Copyright (c) <%%= grunt.template.today("yyyy") %>\n * Licensed GPLv2+\n */\n'
	},
	minify: {
		expand: true,

		cwd: 'assets/css/',
		src: ['.css'],

		dest: 'assets/css/',
		ext: '.min.css'
	}
};
