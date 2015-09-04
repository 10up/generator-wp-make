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
		<% if ( opts.sass ) { %>
		sass:   {
			options: {
				precision: 2,
				sourceMap: true
			},
			all: {
				files: {
					'assets/css/<%= fileSlug %>.css': 'assets/css/sass/<%= fileSlug %>.scss'
				}
			}
		},
		<% } %>
		<% if ( opts.autoprefixer ) { %>
		postcss: {
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
		},
		<% } %>
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
		},
		clean: {
			main: ['release/<%%= pkg.version %>']
		},
		copy: {
			// Copy the plugin to a versioned release directory
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
		wp_readme_to_markdown: {
			readme: {
				files: {
					'readme.md': 'readme.txt'
				}
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
	<% if ( opts.sass ) { %>
	grunt.registerTask( 'css', ['sass', 'postcss', 'cssmin'] );
	<% } else if ( opts.autoprefixer ) { %>
	grunt.registerTask( 'css', ['postcss', 'cssmin'] );
	<% } else { %>
	grunt.registerTask( 'css', ['cssmin'] );
	<% } %>

	grunt.registerTask( 'js', ['jshint', 'concat', 'uglify'] );

	grunt.registerTask( 'default', ['css', 'js', 'wp_readme_to_markdown' ] );

	grunt.registerTask( 'build', ['default', 'clean', 'copy', 'compress'] );

	grunt.registerTask( 'test', ['phpunit', 'qunit'] );

	grunt.util.linefeed = '\n';
};
