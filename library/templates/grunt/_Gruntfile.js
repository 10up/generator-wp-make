module.exports = function( grunt ) {

	// Project configuration
	grunt.initConfig( {
		pkg:    grunt.file.readJSON( 'package.json' ),
		concat: {
			options: {
				stripBanners: true,
				banner: '/*! <%%= pkg.title %> - v<%%= pkg.version %>\n' +
					' * <%%= pkg.homepage %>\n' +
					' * Copyright (c) <%%= grunt.template.today("yyyy") %>;' +
					' * Licensed GPLv2+' +
					' */\n'
			},
			main: {
				src: [
					'assets/js/src/<%= fileSlug %>.js'
				],
				dest: 'assets/js/<%= fileSlug %>.js'
			}
		},
		jshint: {
			all: [
				'Gruntfile.js',
				'assets/js/src/**/*.js',
				'assets/js/test/**/*.js'
			]
		},
		uglify: {
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
		},
		cssmin: {
			options: {
				banner: '/*! <%%= pkg.title %> - v<%%= pkg.version %>\n' +
					' * <%%=pkg.homepage %>\n' +
					' * Copyright (c) <%%= grunt.template.today("yyyy") %>;' +
					' * Licensed GPLv2+' +
					' */\n',
				processImport: false
			},
			minify: {
				expand: true,

				cwd: 'assets/css/',
				src: ['<%= fileSlug %>.css'],

				dest: 'assets/css/',
				ext: '.min.css'
			}
		},
		watch:  {
			livereload: {
				files: ['assets/css/*.css'],
				options: {
					livereload: true
				}
			},
			styles: {
				files: ['assets/css/*.css', '!assets/css/*.min.css'],
				tasks: ['cssmin'],
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
		},
		clean: {
			main: ['release/<%%= pkg.version %>']
		},
		copy: {
			// Copy the theme to a versioned release directory
			main: {
				src:  [
					'**',
					'!**/.*',
					'!**/readme.md',
					'!node_modules/**',
					'!vendor/**',
					'!tests/**',
					'!release/**',
					'!assets/css/sass/**',
					'!assets/css/src/**',
					'!assets/js/src/**',
					'!images/src/**',
					'!bootstrap.php',
					'!bower.json',
					'!composer.json',
					'!composer.lock',
					'!Gruntfile.js',
					'!package.json',
					'!phpunit.xml',
					'!phpunit.xml.dist'
				],
				dest: 'release/<%%= pkg.version %>/'
			}
		},
		compress: {
			main: {
				options: {
					mode: 'zip',
					archive: './release/<%= opts.funcPrefix %>.<%%= pkg.version %>.zip'
				},
				expand: true,
				cwd: 'release/<%%= pkg.version %>/',
				src: ['**/*'],
				dest: '<%= opts.funcPrefix %>/'
			}
		},
		phpunit: {
			classes: {
				dir: 'tests/phpunit/'
			},
			options: {
				bin: 'vendor/bin/phpunit',
				bootstrap: 'bootstrap.php.dist',
				colors: true,
				testSuffix: 'Tests.php'
			}
		},
		qunit: {
			all: ['tests/qunit/**/*.html']
		}
	} );

	// Load tasks
	require('load-grunt-tasks')(grunt);

	// Register tasks
	grunt.registerTask( 'default', ['jshint', 'concat', 'uglify', 'cssmin' ] );

	grunt.registerTask( 'build', ['default', 'clean', 'copy', 'compress'] );

	grunt.registerTask( 'test', ['phpunit', 'qunit'] );

	grunt.util.linefeed = '\n';
};

module.exports = function (grunt) {

	// require `load-grunt-tasks`, which loads all grunt tasks defined in package.json
	require('load-grunt-tasks')(grunt);
	// load tasks defined in the `/tasks` folder
	grunt.loadTasks('tasks');

	// Function to load the options for each grunt module
	var loadConfig = function (path) {
		var glob = require('glob');
		var object = {};
		var key;

		glob.sync('*', {cwd: path}).forEach(function(option) {
			key = option.replace(/\.js$/,'');
			object[key] = require(path + option);
		});

		return object;
	};

	var config = {
		pkg: grunt.file.readJSON('package.json'),
		env: process.env
	};

	grunt.util._.extend(config, loadConfig('./tasks/options/'));

	grunt.initConfig(config);

};
