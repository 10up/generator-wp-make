module.exports = {
	options: {
		stripBanners: true,
		banner: "/*! <%%= pkg.title %> - v<%%= pkg.version %>\n * <%%= pkg.homepage %>\n * Copyright (c) <%%= grunt.template.today(\"yyyy\") %>\n * Licensed GPLv2+\n */\n"
	},
	main: {
		src: [
			'assets/js/src/'
		],
		dest: 'assets/js/'
	}
};
