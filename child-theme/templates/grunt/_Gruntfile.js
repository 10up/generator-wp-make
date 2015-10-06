module.exports = function( grunt ) {

	// Project configuration
	grunt.initConfig( {
		pkg:    grunt.file.readJSON( 'package.json' ),
		browserify: {
			dist: {
				files: {
					'assets/js/<%= fileSlug %>.js': 'assets/js/src/<%= fileSlug %>.js'
				},
				options: {
					banner: '/*! <%%= pkg.title %> - v<%%= pkg.version %>\n' +
						' * <%%= pkg.homepage %>\n' +
						' * Copyright (c) <%%= grunt.template.today("yyyy") %>;' +
						' * Licensed GPLv2+' +
						' */\n',
					browserifyOptions: {
						debug: true
					}
				}
			}
		},
		jshint: {
			all: [
				'Gruntfile.js',
				'assets/js/src/**/*.js',
				'assets/js/test/**/*.js'
			]
		},
		exorcise: {
			bundle: {
				options: {},
				files: {
					'assets/js/<%= fileSlug %>.js.map': 'assets/js/<%= fileSlug %>.js',
				}
			}
		},
		uglify: {
			oldie: {
				files: {
					'assets/js/<%= fileSlug %>.oldie.js': 'assets/js/<%= fileSlug %>.js'
				},
				options: {
					compress: {
						global_defs: {
							OLDIE: true
						}
					}
				}
			},
			dist: {
				files: {
					'assets/js/<%= fileSlug %>.js': 'assets/js/<%= fileSlug %>.js'
				},
				options: {
					compress: {
						global_defs: {
							OLDIE: false
						}
					},
					preserveComments: 'some',
					sourceMap: true,
					sourceMapIn: 'assets/js/<%= fileSlug %>.js.map'
				}
			}
		},
		<% if ( opts.sass ) { %>
		sass:   {
			all: {
				options: {
					precision: 2,
					sourceMap: true
				},
				files: {
					'assets/css/<%= fileSlug %>.css': 'assets/css/sass/<%= fileSlug %>.scss',
					'assets/css/<%= fileSlug %>.oldie.css': 'assets/css/sass/<%= fileSlug %>.oldie.scss'
				}
			}
		},
		<% } %>
		<% if ( opts.postcss ) { %>
		postcss: {
			dist: {
				options: {
					map: {
						inline: false,
						annotation: 'assets/css/'
					},
					processors: [
						require('autoprefixer')({browsers: 'last 2 versions'}),
						require('cssnano')()
					]
				},
				files: { <% if ( opts.sass ) { %>
					'assets/css/<%= fileSlug %>.css': [ 'assets/css/<%= fileSlug %>.css' ]<% } else { %>
					'assets/css/<%= fileSlug %>.css': [ 'assets/css/src/<%= fileSlug %>.css' ]<% } %>
				}
			},
			oldie: {
				options: {
					processors: [
						require('postcss-unmq')({
							width: 1024
						}),
						require('autoprefixer')({
							browsers: 'ie >= 8'
						}),
						require('pixrem')(),
						require('postcss-opacity')(),
						require('postcss-pseudoelements')(),
						require('cssnano')()
					]
				},
				files: { <% if ( opts.sass ) { %>
					'assets/css/<%= fileSlug %>.oldie.css': [ 'assets/css/<%= fileSlug %>.oldie.css' ]<% } else { %>
					'assets/css/<%= fileSlug %>.oldie.css': [ 'assets/css/src/<%= fileSlug %>.css' ]<% } %>
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
				ext: '.css'
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
				tasks: ['sass', 'postcss'],<% } else if ( opts.postcss ) { %>
				files: ['assets/css/src/*.css'],
				tasks: ['postcss'],<% } else { %>
				files: ['assets/css/*.css'],
				tasks: ['cssmin'],<% } %>
				options: {
					debounceDelay: 500
				}
			},
			scripts: {
				files: ['assets/js/src/**/*.js', 'assets/js/vendor/**/*.js'],
				tasks: ['js'],
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
	<% if ( opts.sass ) { %>
	grunt.registerTask( 'css', ['sass', 'postcss'] );
	<% } else if ( opts.postcss ) { %>
	grunt.registerTask( 'css', ['postcss'] );
	<% } else { %>
	grunt.registerTask( 'css', ['cssmin'] );
	<% } %>

	grunt.registerTask( 'js', ['jshint', 'browserify', 'exorcise', 'uglify'] );

	grunt.registerTask( 'default', ['css', 'js'] );

	grunt.registerTask( 'build', ['default', 'clean', 'copy', 'compress'] );

	grunt.registerTask( 'test', ['phpunit', 'qunit'] );

	grunt.util.linefeed = '\n';
};
