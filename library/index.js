'use strict';
var util = require( 'util' );
var _ = require( 'lodash' );
var path = require( 'path' );
var yeoman = require( 'yeoman-generator' );
var chalk = require( 'chalk' );
var async = require( 'async' );
var profile = require( 'yo-profile' ).default;

var LibGenerator = yeoman.generators.Base.extend({
		init: function() {
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
			
			this.on( 'end', function() {
				var i, length, installs = [],
					chalks = { skipped:[], run:[] },
					installers = ['npm', 'bower', 'composer'];

				this.log( chalk.green.bold( 'Your library has been generated.' ));

				for ( i = 0, length = installers.length; i < length; i++ ) {
					if ( this.options['skip-install'] || this.options[ 'skip-' + installers[ i ] ] ) {
						chalks.skipped.push( chalk.yellow.bold( installers[ i ] + ' install' ));
					} else {
						chalks.run.push( chalk.yellow.bold( installers[ i ] + ' install' ));
						installs.push( _install( installers[ i ],this ));
					}
				}

				if ( 0 < chalks.skipped.length ) {
					this.log( 'Skipping ' + chalks.skipped.join( ', ' ) + '. Just run yourself when you are ready.' );
				}
				if ( 0 < installs.length ) {
					this.log( 'Running ' + chalks.run.join( ', ' ) + ' for you. If this fails try running yourself.' );
					async.parallel( installs );
				}
			});
		},

		options: function() {
			var done = this.async();
			this.basename = path.basename( this.env.cwd );
			this.opts = {
				license: this.defaults.license
			};

			var prompts = [
				{
					name:    'projectTitle',
					message: 'Project Title',
					default: 'WP Library'
				},
				{
					name:    'description',
					message: 'Description',
					default: 'The best WordPress extension ever made!'
				},
				{
					name:    'gitUser',
					message: 'GitHub Account Name',
					default: this.user.git.username
				}
			];

			prompts.push( {
				name   : 'projectHome',
				message: 'Project homepage',
				default: (undefined !== this.defaults.projectHome) ? this.defaults.projectHome : 'http://wordpress.org/plugins'
			} );

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

			// Gather initial settings
			this.prompt( prompts, function( properties ) {
				_.extend( this.opts, properties );

				this.opts.projectSlug = this.opts.projectTitle.toLowerCase().replace( /[\s]/g, '-' ).replace( /[^a-z-_]/g, '' );
				this.fileSlug = this.opts.projectSlug;
				this.namespace = this.opts.projectTitle.replace( /[\s|-]/g, '_' ).replace( /[^0-9a-zA-Z]+/, '' ).replace( /( ^|_ )( [a-z] )/g, function( match, group1, group2 ){
					return group1 + group2.toUpperCase();
				});

				done();
			}.bind( this ) );
		},

		grunt: function() {
			this.template( 'grunt/_package.json', 'package.json' );
			this.template( '../../shared/grunt/_Gruntfile.js', 'Gruntfile.js' );
			this.copy( '../../shared/grunt/_jshintrc', '.jshintrc' );
			this.copy( '../../shared/grunt/tasks/_template.js', 'tasks/_template.js');
			this.copy( '../../shared/grunt/tasks/options/_template.js', 'tasks/options/_template.js');
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
			this.template( '../../shared/grunt/tasks/_css.js', 'tasks/css.js' );
			this.template( '../../shared/grunt/tasks/_default.js', 'tasks/default.js' );
			this.template( '../../shared/grunt/tasks/_js.js', 'tasks/js.js' );
			this.template( '../../shared/grunt/tasks/_test.js', 'tasks/test.js' );
			this.copy( '../../shared/_editorconfig', '.editorconfig' );
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
		},

		tests: function() {
			//phpunit
			this.template( '../../shared/tests/phpunit/_TestCase.php', 'tests/phpunit/test-tools/TestCase.php' );
			this.template( 'tests/phpunit/_bootstrap.php', 'bootstrap.php.dist' );
			this.copy( 'tests/phpunit/phpunit.xml.dist', 'phpunit.xml.dist' );
			//qunit
			this.template( '../../shared/tests/qunit/_test.html', 'tests/qunit/' + this.fileSlug + '.html' );
			this.copy( '../../shared/tests/qunit/test.js', 'tests/qunit/tests/' + this.fileSlug + '.js' );
		},

		library: function() {
			this.template( 'library/_app.php', this.fileSlug + '.php' );
			if ( 'MIT' === this.opts.license ) {
				this.copy( 'library/_LICENSE.md', 'LICENSE.md' );
			}
			this.template( 'library/_README.md', 'README.md' );
			this.copy( '../../shared/theme/readme-includes.md', 'includes/readme.md' );
		}
	}
);

/**
 * Install dependencies
 *
 * @param {string} command
 * @param {object} context
 *
 * @returns {Function}
 *
 * @private
 */
function _install( command, context ) {
	return function install( cb ) {
		context.emit( command + 'Install' );
		context.spawnCommand( command, ['install'] )
			.on( 'error', cb )
			.on( 'exit', context.emit.bind( context, command + 'Install:end' ))
			.on( 'exit', function ( err ) {
				     if ( err === 127 ) {
					     this.log.error( 'Could not find Composer' );
				     }
				     cb( err );
			     }.bind( context ));
	}
}

// Export the module
module.exports = LibGenerator;
