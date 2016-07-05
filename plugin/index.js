var Base = require( '../lib/base' );

module.exports = Base.extend({
	type: 'plugin',
	grunt: true,
	installCommands: {
		npm: true,
		composer: true
	},
	initConfig: function() {
		return {
			prompts: [
				{
					name:    'projectTitle',
					message: 'Project title',
					default: 'WP Plugin'
				},
				{
					name:    'funcPrefix',
					message: 'PHP function prefix',
					default: 'wpplugin'
				},
				{
					name:    'description',
					message: 'Description',
					default: 'The best WordPress extension ever made!'
				},
				{
					name:    'projectHome',
					message: 'Project homepage',
					default: 'http://wordpress.org/plugins'
				},
				{
					name:    'authorName',
					message: 'Author name',
					default: this.user.git.name
				},
				{
					name:    'authorEmail',
					message: 'Author email',
					default: this.user.git.email
				},
				{
					name:    'authorUrl',
					message: 'Author URL'
				},
				{
					type:    'confirm',
					name:    'sass',
					message: 'Use Sass?',
					default: true,
					tree: {
						'false': [{
							type:    'confirm',
							name:    'autoprefixer',
							message: 'Use Autoprefixer?',
							default: true
						}]
					}
				}
			],
			tree: {
				json: {
					'.bowerrc': this.starterJSON( 'bowerrc' ),
					'bower.json': this.starterJSON( 'bower' ),
					'composer.json': this.starterJSON( 'composer' ),
					'.jshintrc': this.starterJSON( 'jshintrc' ),
					'package.json': this.starterJSON( 'package' )
				},
				templates: {
					'<%= fileSlug %>.php': '_plugin.php',
					'readme.txt': '_readme.txt',
					'bootstrap.php.dist': '_bootstrap.php'
				},
				copies: {
					'.gitignore': 'gitignore.txt',
					'php.xml.dist': 'phpunit.xml'
				},
				tree: {
					'assets': {
						tree: {
							'js': {
								tree: {
									'src': {
										templates: {
											'<%= fileSlug %>.js': '_script.js'
										}
									}
								}
							},
							'css': {}
						}
					},
					'location': {},
					'includes': {
						tree: {
							'functions': {
								templates: {
									'core.php': '_core.php'
								}
							}
						}
					},
					'images': {
						tree: {
							'src': {}
						}
					},
					'tests': {
						tree: {
							'phpunit': {
								templates: {
									'Core_Tests.php': '_Core_Tests.php'
								},
								tree: {
									templates: {
										'Test_Case.php': '_Test_Case.php',
									}
								}
							},
							'mocha': {},
						}
					},
					'tasks': {
						modules: {
							'clean.js': this.starter( 'clean' ),
							'compress.js': this.starter( 'compress' ),
							'concat.js': this.starter( 'concat' ),
							'copy.js': this.starter( 'copy' ),
							'cssmin.js': this.starter( 'cssmin' ),
							'jshint.js': this.starter( 'jshint' ),
							'phpunit.js': this.starter( 'phpunit' ),
							'mocha.js': this.starter( 'mocha' ),
							'uglify.js': this.starter( 'uglify' ),
							'watch.js': this.starter( 'watch' ),
						}
					},
				}
			}
		};
	},
	intuitParams: function() {
		this.data.projectSlug = this.data.projectTitle.toLowerCase().replace( /[\s]/g, '-' ).replace( /[^a-z-_]/g, '' );
		this.data.fileSlug = this.data.projectSlug;
		this.data.namespace = this.data.projectTitle.replace( /[\s|-]/g, '_' ).replace( /( ^|_ )( [a-z] )/g, function( match, group1, group2 ){
			return group1 + group2.toUpperCase();
		});

		if ( this.data.sass ) {
			this.data.autoprefixer = true;
		}
	},
	updateTree: function() {
		// Get objects
		var rootJSON = this.getSubtree( 'json' ),
			styleSubtree = 'assets/css/',
			styleExtension = 'css';

		// Composer
		if ( this.data.projectHome ) {
			rootJSON['composer.json'].homepage = this.data.projectHome;
		}
		if ( this.data.authorUrl ) {
			rootJSON['composer.json'].authors[0].homepage = this.data.authorUrl;
		}

		// CSS
		if ( this.data.autoprefixer ) {
			this.nodeDependency( 'autoprefixer', '^6.1.0', true );
			this.nodeDependency( 'grunt-postcss', '^0.7.0', true );
			this.gruntConfig( 'postcss', this.starter( 'postcss' ) );
			styleSubtree = 'assets/css/src';
		}

		if ( this.data.sass ) {
			this.nodeDependency( 'grunt-sass', '^1.1.0', true );
			this.gruntConfig( 'sass.js', this.starter( 'sass' ) );
			styleSubtree = 'assets/css/sass';
			styleExtension = 'scss';
		}

		// Confirm that we have styles needed
		var styleTemplates = this.getSubtree( 'templates', styleSubtree );
		styleTemplates['<%= projectSlug %>.' + styleExtension ] = '_style.css';

	}

});
