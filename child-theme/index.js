'use strict';
var util = require( 'util' );
var _ = require( 'lodash' );
var path = require( 'path' );
var yeoman = require( 'yeoman-generator' );
var chalk = require( 'chalk' );
var async = require( 'async' );
var profile = require( 'yo-profile' ).default;

var ChildThemeGenerator = yeoman.generators.Base.extend( {
	init: function () {
		this.log( chalk.magenta( 'Thanks for generating with WP Make!' ) );

		// Specify profile defaults - all are `undefined` to flag they don't exist
		var options = {
			'license'       : 'GPLv2+',
			'humanstxt'     : undefined,
			'root_namespace': undefined,
			'php_min'       : undefined,
			'wp_tested'     : undefined,
			'wp_min'        : undefined
		};

		// Load defaults from the RC file
		this.defaults = (new profile).load( options, 'wpmake' ).properties;
		
		this.on( 'end', function () {
			var i, length, installs = [],
				chalks = { skipped:[], run:[] },
				installers = [ 'npm', 'bower', 'composer' ];

			this.log( chalk.green.bold( 'Your child-theme has been generated.' ) );

			for ( i = 0, length = installers.length; i < length; i++ ) {
				if ( this.options['skip-install'] || this.options[ 'skip-' + installers[ i ] ] ) {
					chalks.skipped.push( chalk.yellow.bold( installers[ i ] + ' install' ) );
				} else {
					chalks.run.push( chalk.yellow.bold( installers[ i ] + ' install' ) );
					installs.push( _install( installers[ i ],this ) );
				}
			}

			if ( 0 < chalks.skipped.length ) {
				this.log( 'Skipping ' + chalks.skipped.join( ', ' ) + '. Just run yourself when you are ready.' );
			}
			if ( 0 < installs.length ) {
				this.log( 'Running ' + chalks.run.join( ', ' ) + ' for you. If this fails try running yourself.' );
				async.parallel( installs );
			}
		} );
	},

	options: function () {
		var done = this.async();
		this.basename = path.basename( this.env.cwd );
		this.opts = {
			license: this.defaults.license
		};

		var prompts = [
			{
				name:    'parentSlug',
				message: 'Parent Theme Slug',
			},
			{
				name:    'projectTitle',
				message: 'Theme name',
				default: 'WP Theme'
			},
			{
				name:    'funcPrefix',
				message: 'PHP function prefix ( lowercase letters and underscores only )',
				default: 'wptheme'
			},
			{
				name:    'description',
				message: 'Description',
				default: 'The best WordPress theme ever made!'
			}
		];

		prompts.push( {
			name   : 'projectHome',
			message: 'Project homepage',
			default: (undefined !== this.defaults.projectHome) ? this.defaults.projectHome : 'http://wordpress.org/plugins'
		} );

		if ( 'prompt' === this.defaults.root_namespace ) {
			prompts.push( {
				name   : 'root_namespace',
				message: 'Project root namespace',
				default: 'TenUp' 
			} )
		} else if ( this.defaults.root_namespace ) {
			this.opts.root_namespace = this.defaults.root_namespace;
		} else {
			this.opts.root_namespace = 'TenUp';
		}

		if ( undefined === this.defaults.authorName ) {
			prompts.push(
				{
					name:    'authorName',
					message: 'Author name',
					default: this.user.git.name
				}
			);
		} else {
			this.opts.authorName = this.defaults.authorName;
		}

		if ( undefined === this.defaults.authorEmail ) {
			prompts.push(
				{
					name:    'authorEmail',
					message: 'Author email',
					default: this.user.git.email
				}
			);
		} else {
			this.opts.authorEmail = this.defaults.authorEmail;
		}

		if ( undefined === this.defaults.authorUrl ) {
			prompts.push(
				{
					name:    'authorUrl',
					message: 'Author URL',
					default: this.user.git.name
				}
			);
		} else {
			this.opts.authorUrl = this.defaults.authorUrl;
		}

		if ( undefined === this.defaults.sass ) {
			prompts.push(
				{
					type:    'confirm',
					name:    'sass',
					message: 'Use Sass?',
					default: true
				}
			);
		} else {
			this.opts.sass = this.defaults.sass;
		}
		
		// gather initial settings
		this.prompt( prompts, function ( props ) {
			_.extend( this.opts, props );
			this.opts.projectSlug = this.opts.projectTitle.toLowerCase().replace( /[\s]/g, '-' ).replace( /[^a-z-_]/g, '' );
			this.fileSlug = this.opts.projectSlug;
			this.namespace = this.opts.projectTitle.replace( /[\s|-]/g, '_' ).replace( /[^0-9a-zA-Z]+/, '' ).replace( /( ^|_ )( [a-z] )/g, function( match, group1, group2 ){
				return group1 + group2.toUpperCase();
			});
			done();
		}.bind( this ) );
	},

	autoprefixer: function() {
		// If we're running Sass, automatically use autoprefixer.
		if ( this.opts.sass ) {
			this.opts.autoprefixer = true;
			return;
		}

		// See if we want to use it on it's own, but only if not using Sass.
		var done = this.async();
		this.prompt( [{
			type:    'confirm',
			name:    'autoprefixer',
			message: 'Use Autoprefixer?',
			default: true
		}],
		function( props ){
			this.opts.autoprefixer = props.autoprefixer;
			done();
		}.bind( this ) );
	},

	theme: function() {
		this.template( 'theme/_style.css', 'style.css' );
		this.template( 'theme/_functions.php', 'functions.php' );
		this.template( '../../shared/theme/_core.php', 'includes/functions/core.php' );
		if ( this.opts.humanstxt ) {
			this.template( '../../shared/theme/_humans.txt', 'humans.txt' );
		}
		this.copy( 'theme/screenshot.png', 'screenshot.png' );
		this.copy( '../../shared/theme/readme-includes.md', 'includes/readme.md' );
		this.copy( '../../shared/_editorconfig', '.editorconfig' );
	},

	i18n: function() {
		this.template( '../../shared/i18n/_language.pot', 'languages/' + this.opts.funcPrefix + '.pot' );
	},

	images: function() {
		this.copy( '../../shared/images/readme.md', 'images/readme.md' );
		this.copy( '../../shared/images/readme-sources.md', 'images/src/readme.md' );
	},

	js: function() {
		this.template( '../../shared/js/_script.js', 'assets/js/src/' + this.fileSlug + '.js' );
		this.copy( '../../shared/js/readme-vendor.md', 'assets/js/vendor/readme.md' );
	},

	css: function() {
		if ( this.opts.sass ) {
			this.template( 'css/_style.css', 'assets/css/sass/' + this.fileSlug + '.scss' );
		} else if ( this.opts.autoprefixer ) {
			this.template( 'css/_style.css', 'assets/css/src/' + this.fileSlug + '.css' );
		} else {
			this.template( 'css/_style.css', 'assets/css/' + this.fileSlug + '.css' );
		}
		this.copy( '../../shared/css/readme.md', 'assets/css/readme.md' );
	},

	tests: function() {
		//phpunit
		this.template( '../../shared/tests/phpunit/_Core_Tests.php', 'tests/phpunit/Core_Tests.php' );
		this.template( '../../shared/tests/phpunit/_TestCase.php', 'tests/phpunit/test-tools/TestCase.php' );
		this.template( '../../shared/tests/phpunit/_bootstrap.php', 'bootstrap.php.dist' );
		this.copy( '../../shared/tests/phpunit/phpunit.xml.dist', 'phpunit.xml.dist' );
		//qunit
		this.template( '../../shared/tests/qunit/_test.html', 'tests/qunit/' + this.fileSlug + '.html' );
		this.copy( '../../shared/tests/qunit/test.js', 'tests/qunit/tests/' + this.fileSlug + '.js' );
	},

	grunt: function() {
		this.template( 'grunt/_package.json', 'package.json' );
		this.template( '../../shared/grunt/_Gruntfile.js', 'Gruntfile.js' );
		this.copy( '../../shared/grunt/_jshintrc', '.jshintrc' );
		this.copy( '../../shared/grunt/tasks/_template.js', 'tasks/_template.js');
		this.copy( '../../shared/grunt/tasks/options/_template.js', 'tasks/options/_template.js');
		if ( this.opts.sass ) {
			this.template( '../../shared/grunt/tasks/_css-sass.js', 'tasks/css.js' );
			this.template( '../../shared/grunt/tasks/options/_sass.js', 'tasks/options/sass.js' );
			this.template( '../../shared/grunt/tasks/options/_postcss.js', 'tasks/options/postcss.js');
		} else if ( this.opts.autoprefixer ) {
			this.template( '../../shared/grunt/tasks/_css-autoprefixer.js', 'tasks/css.js' );
			this.template( '../../shared/grunt/tasks/options/_postcss.js', 'tasks/options/postcss.js');
		} else {
			this.template( '../../shared/grunt/tasks/_css.js', 'tasks/css.js' );
		}
		this.template( '../../shared/grunt/tasks/options/_cssmin.js', 'tasks/options/cssmin.js' );
		this.template( '../../shared/grunt/tasks/options/_clean.js', 'tasks/options/clean.js' );
		this.template( '../../shared/grunt/tasks/options/_compress.js', 'tasks/options/compress.js' );
		this.template( '../../shared/grunt/tasks/options/_concat.js', 'tasks/options/concat.js' );
		this.template( '../../shared/grunt/tasks/options/_copy.js', 'tasks/options/copy.js' );
		this.template( '../../shared/grunt/tasks/options/_jshint.js', 'tasks/options/jshint.js' );
		this.template( '../../shared/grunt/tasks/options/_phpunit.js', 'tasks/options/phpunit.js' );
		this.template( '../../shared/grunt/tasks/options/_qunit.js', 'tasks/options/qunit.js' );
		this.template( '../../shared/grunt/tasks/options/_uglify.js', 'tasks/options/uglify.js' );
		this.template( '../../shared/grunt/tasks/options/_watch.js', 'tasks/options/watch.js' );
		this.template( '../../shared/grunt/tasks/_build.js', 'tasks/build.js' );
		this.template( '../../shared/grunt/tasks/_default.js', 'tasks/default.js' );
		this.template( '../../shared/grunt/tasks/_js.js', 'tasks/js.js' );
		this.template( '../../shared/grunt/tasks/_test.js', 'tasks/test.js' );
	},

	bower: function() {
		this.template( '../../shared/bower/_bower.json', 'bower.json' );
		this.copy( '../../shared/bower/bowerrc', '.bowerrc' );
	},

	composer: function() {
		this.template( 'composer/_composer.json', 'composer.json' );
	},

	git: function() {
		this.copy( '../../shared/git/gitignore', '.gitignore' );
	}
} );

function _install( command, context ) {
	return function install( cb ) {
		context.emit( command + 'Install' );
		context.spawnCommand( command, ['install'] )
		.on( 'error', cb )
		.on( 'exit', context.emit.bind( context, command + 'Install:end' ) )
		.on( 'exit', function ( err ) {
			if ( err === 127 ) {
				this.log.error( 'Could not find Composer' );
			}
			cb( err );
		}.bind( context ) );
	}
}

module.exports = ChildThemeGenerator;
