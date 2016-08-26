module.exports = {
	all: {
		files: {
			'assets/js/<%= fileSlug %>.js': ['assets/js/<%= fileSlug %>.js']
		},
		options: {
			banner: "/*! <%%= pkg.title %> - v<%%= pkg.version %>\n * <%%= pkg.homepage %>\n * Copyright (c) <%%= grunt.template.today(\"yyyy\") %>\n * Licensed GPLv2+\n */\n",
			mangle: {
				except: [ 'jQuery' ]
			}
		}
	}
};
