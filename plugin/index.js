'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');


var PluginGenerator = yeoman.generators.Base.extend({
	init: function () {
		this.log(chalk.magenta('Thanks for generating with WP Make!'));

		this.on('end', function () {
    		if (!this.options['skip-install']) {
    			this.installDependencies();
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
				name:    'autoprefixer',
				message: 'Use Autoprefixer?',
				default: true
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
			done();
		}.bind(this));
	},

	plugin: function() {
		this.template( 'plugin/_readme.txt', 'readme.txt' );
		this.template( 'plugin/_plugin.php', this.fileSlug + '.php' );
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
			this.template( 'css/_style.css', 'assets/css/source/' + this.fileSlug + '.css' );
		} else {
			this.template( 'css/_style.css', 'assets/css/' + this.fileSlug + '.css' );
		}
		this.copy( 'css/readme.md', 'assets/css/readme.md' );
	},

	tests: function() {

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

module.exports = PluginGenerator;