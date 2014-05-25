'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');


var PluginGenerator = yeoman.generators.Base.extend({
	init: function () {
		this.log(chalk.magenta('Thanks for generating with WP Make!'));

		this.on('end', function () {
			var npmInstall = chalk.yellow.bold( 'npm install' ),
			composerInstall = chalk.yellow.bold( 'composer install' );
			
			this.log( 'You plugins has been generated.');

			if( this.options['skip-install'] || ( this.options['skip-npm'] && this.options['skip-composer'] ) ) {
				this.log( 'Just run ' + npmInstall + ' & ' + composerInstall + ' when you are ready' );
			} else if ( this.options['skip-npm'] ) {
				this.log( 'Skipping npm install. Just run ' + npmInstall + ' when you are ready.' );
				this.log( 'Running ' + composerInstall + ' for you. If this fails try running it yourself.' );
				
				_installComposer.apply( this );
			} else if ( this.options['skip-composer'] ) {
				this.log( 'Skipping composer install. Just run ' + composerInstall + ' when you are ready.' );
				this.log( 'Running ' + npmInstall + ' for you. If this fails try running it yourself.' );
				
				this.installDependencies({
					npm: true,
					bower: false,
					skipMessage: true
				});
			} else {
				this.log( 'Running ' + npmInstall + ' & ' + composerInstall + ' for you...' );
				
				this.installDependencies({
					npm: true,
					bower: false,
					skipMessage: true,
					callback: _installComposer.bind(this)
				});
			}
		});
	},

	options: function () {
		var done = this.async();
		this.basename = path.basename( this.env.cwd );

		var prompts = [
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
				default: true
			}
		];
		// gather initial settings
		this.prompt(prompts, function (props) {
			this.opts = props;
			this.fileSlug = this.opts.projectTitle.toLowerCase().replace(/[\s]/, '-').replace( /[^a-z-_]/, '' );
			this.classSlug = this.fileSlug.replace( '-', '_' ).replace( /(^|_)([a-z])/g, function( match, group1, group2 ){
				return group1 + group2.toUpperCase(); 
			});
			done();
		}.bind(this));
	},

	autoprefixer: function() {
		// If we're running Sass, automatically use autoprefixer.
		if ( this.opts.sass ) {
			this.opts.autoprefixer = true;
			return;
		}

		// See if we want to use it on it's own, but only if not using Sass.
		var done = this.async();
		this.prompt([{
			type:    'confirm',
			name:    'autoprefixer',
			message: 'Use Autoprefixer?',
			default: true
		}],
		function(props){
			this.opts.autoprefixer = props.autoprefixer;
			done();
		}.bind(this));
	},

	plugin: function() {
		this.template( 'plugin/_readme.txt', 'readme.txt' );
		this.template( 'plugin/_plugin.php', this.fileSlug + '.php' );
		this.template( 'plugin/_class-plugin.php', 'includes/class-' + this.fileSlug + '.php' );
		this.copy( 'plugin/readme-includes.md', 'includes/readme.md' );
	},

	i18n: function() {
		this.template( 'i18n/_language.pot', 'languages/' + this.opts.funcPrefix + '.pot' );
	},

	images: function() {
		this.copy( 'images/readme.md', 'images/readme.md' );
		this.copy( 'images/readme-sources.md', 'images/src/readme.md' );
	},

	js: function() {
		this.template( 'js/_script.js', 'assets/js/src/' + this.fileSlug + '.js' );
		this.copy( 'js/readme-vendor.md', 'assets/js/vendor/readme.md' );
	},

	css: function() {
		if ( this.opts.sass ) {
			this.template( 'css/_style.css', 'assets/css/sass/' + this.fileSlug + '.scss' );
		} else if ( this.opts.autoprefixer ) {
			this.template( 'css/_style.css', 'assets/css/src/' + this.fileSlug + '.css' );
		} else {
			this.template( 'css/_style.css', 'assets/css/' + this.fileSlug + '.css' );
		}
		this.copy( 'css/readme.md', 'assets/css/readme.md' );
	},

	tests: function() {
		//phpunit
		this.copy( 'tests/phpunit/bootstrap.php', 'bootstrap.php' );
		this.copy( 'tests/phpunit/phpunit.xml.dist', 'phpunit.xml.dist' );
		this.copy( 'tests/phpunit/Class_Test.php', 'tests/phpunit/Class_Test.php' );
	},

	grunt: function() {
		this.template( 'grunt/_package.json', 'package.json' );
		this.template( 'grunt/_Gruntfile.js', 'Gruntfile.js' );
		this.copy( 'grunt/_jshintrc', '.jshintrc' );
	},

	bower: function() {
		this.template( 'bower/_bower.json', 'bower.json' );
		this.copy( 'bower/bowerrc', '.bowerrc' );
	},

	composer: function() {
		this.copy( 'composer/composer.json', 'composer.json' );
	},

	git: function() {
		this.copy( 'git/gitignore', '.gitignore' );
	}
});

function _installComposer() {
	this.spawnCommand( 'composer', ['install'] )
	.on('exit', function (err) {
		if (err === 127) {
			this.log.error('Could not find Composer');
		}
	}.bind(this));
}

module.exports = PluginGenerator;