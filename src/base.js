/**
 * This file contains the main WP Make generator base definition.
 *
 * The Make Base defines most of the functionality to control the lifecycle of a
 * generator. Most generators can be defined with little more than an initConfig
 * method which sends back a lifecycle object controlling the generation
 * lifecycle.
 */

// Import dependencies
import {Base} from 'extendable-yeoman';
import chalk from 'chalk';
import mkdirp from 'mkdirp';
import ASTConfig from './util/ast-config';
import gruntConfig from './util/grunt-config';

// Import mixins
import mixinInstaller from './util/installer';
import mixinPrompt from './util/prompt';
import mixinTree from './util/tree';
import mixinTools from './util/tools';
import mixinWriters from './util/writers';

/**
 * The MakeBase definition for controlling a WP Make generation lifecycle.
 *
 * The MakeBase can be exteded in additional generators to allow controlling of
 * WordPress project generation in a fairly opinionated way. Each project will
 * define a initConfig method that will return a lifecycle object.
 *
 * The lifecycle object controls how a project is generated and consists of two
 * main sections. The prompts section, which defines what questions will be
 * asked of the user, and the tree section, which will define the generated
 * file structure as well as the copies, templates, json objects, and js modules
 * that will create the project.
 *
 * Here is a simple example lifecycle object:
 *
 *     {
 *     	prompts: [
 *     		name: 'projectTitle'
 *     		message: 'Project title',
 *     		default: 'WP Plugin'
 *     	],
 *     	tree: {
 *     		templates: {
 *     			'project.php': '_project.php'
 *     		},
 *     		json: {
 *     			'package.json': '_package.json'
 *     		}
 *     	}
 *     }
 *
 * The generator will then automatically ask the questions in the prompt
 * lifecycle, and then write out the templates according to the tree lifecycle.
 *
 * Additional methods can be used and will be run in sequence between the prompt
 * and tree lifecycles. This allows you to further mutate and add to the data
 * gathered from the user as neede before running into the tree lifecycle. These
 * methods will be run in sequence unless you specifically use the yeoman
 * queue framework to move them outside of this basic lifecycle.
 */
const MakeBase = Base.extend( {
	/**
	 * This is the default whitespace used when outputting JSON and JS code.
	 *
	 * @type {String}
	 */
	defaultPad: '\t',
	/**
	 * This is the default lifecycle object.
	 *
	 * Don't overwrite this. Instead, define a lifecycle object in your
	 * initConfig method and return a lifecycle object. This returned object
	 * will be run through `Object.assign` with this object as the default.
	 *
	 * @type {Object}
	 */
	_lifecycle: {
		prompts: {},
		tree: {},
	},
	/**
	 * This is where data is stored when gathered from inputs.
	 *
	 * This is what is passed to templates during output. It can be added to
	 * if needed using mutation functions in your generator.
	 *
	 * @type {Object}
	 */
	data: {},
	/**
	 * Whether or not this project uses grunt and needs a grunt file.
	 *
	 * If you would like a gruntfile to be created for you, simply set this to
	 * true in your generator. It will output a basic Gruntfile.js. You can
	 * modify this using the AST config options in mutation functions.
	 *
	 * @type {Boolean}
	 */
	grunt: false,
	/**
	 * Defines which install commands are supported by this generator.
	 *
	 * In your extension, you can define which install commands should be run
	 * using this property. Omit an install entirely if you don't support it.
	 * The key is the installer (npm, bower, etc.) and the value is the default
	 * true it will be installed, false the installer is skipped by default.
	 *
	 * @type {Object}
	 */
	installCommands: {
		npm: true,
		composer: true
	},
	/**
	 * Sets up the object, registering methods with the Yeoman run loop.
	 *
	 * @return {Object} The resulting MakeBase object.
	 */
	constructor: function () {
		// Run the baser constructor.
		Base.apply( this, arguments );

		// Prepare overall lifecycle.
		this.env.runLoop.add(
			'initializing',
			this.welcomeMessage,
			{ once: 'wpm:welcome', run: false }
		);
		this.env.runLoop.add(
			'initializing',
			this.initGrunt.bind( this ),
			{ once: 'wpm:initGrunt', run: false }
		);
		this.env.runLoop.add(
			'initializing',
			this.setLifecycle.bind( this ),
			{ once: 'wpm:setLifecycle', run: false }
		);
		this.env.runLoop.add(
			'initializing',
			this.installers.bind( this ),
			{ once: 'wpm:install', run: false }
		);
		this.env.runLoop.add(
			'prompting',
			this.prompts.bind( this ),
			{ once: 'wpm:prompts', run: false }
		);
		this.env.runLoop.add(
			'configuring',
			this.makeObjects.bind( this ),
			{ once: 'wpm:makeObjects', run: false }
		);
		this.env.runLoop.add(
			'writing',
			this.walkTree.bind( this ),
			{ once: 'wpm:walkTree', run: false }
		);
		this.env.runLoop.add(
			'end',
			this.goodbyeMessage,
			{ once: 'wpm:goodbye', run: false }
		);
	},
	/**
	 * Outputs a welcome message to thank users for trying WP Make.
	 *
	 * @param  {Function} done The function to continue generation.
	 * @return {void}
	 */
	welcomeMessage: function ( done ) {
		this.log( chalk.magenta(
			'Thanks for generating with ',
			chalk.bold( 'WP Make' ),
			'!'
		) );
		done();
	},
	/**
	 * Outputs a goodbye message to let users know generation is complete.
	 *
	 * @param  {Function} done The function to continue generation.
	 * @return {void}
	 */
	goodbyeMessage: function ( done ) {
		this.log( chalk.green.bold(
			`Your ${this.type || 'item'} has been generated.`
		) );
		done();
	},
	/**
	 * Optionally initialize a grunt object if grunt is set to true.
	 * @param  {Function} done The function to continue generation.
	 * @return {void}
	 */
	initGrunt: function ( done ) {
		// Optionally intialize grunt config and output.
		if ( this.grunt ) {
			// Read in or create the default gruntfile.
			this.grunt = gruntConfig( this.fs.read(
				this.destinationPath('Gruntfile.js'),
				{ defaults: this.starter('gruntfile') }
			) );
			// Set up gruntfile dump on output.
			this.env.runLoop.add(
				'writing',
				this.writeGruntfile.bind( this ),
				{ once: 'wpm:grunt', run: false }
			);
		}
		done();
	},
	/**
	 * Sets the the `this.lifecycle` object using `initConfig` and `_lifecycle`.
	 *
	 * @param {Function} done The function to continue generation.
	 * @return {void}
	 */
	setLifecycle: function ( done ) {
		// Make sure lifecycle is ready.
		this.lifecycle = Object.assign(
			{},
			this._lifecycle,
			this.initConfig()
		);
		done();
	},
	/**
	 * Runs through the prompst defined in `this.lifecycle.prompts`.
	 *
	 * @param  {Function} done The function to continue generation.
	 * @return {void}
	 */
	prompts: function ( done ) {
		this.prompt( this.lifecycle.prompts ).then( ( props ) => {
			this.data = Object.assign( props, {
				basename: this.basename
			} );
			done();
		} );
	},
	/**
	 * Turns object strings into AST objects for better/safer mutation control.
	 *
	 * @param  {Function} done The function to continue generation.
	 * @return {void}
	 */
	makeObjects: function ( done ) {
		this.tree( this.lifecycle.tree, { modules: this.initModule } );
		done();
	},
	/**
	 * Stub function for creating the initial lifecycle object.
	 *
	 * Override this in your generator to define the generation lifecycle.
	 *
	 * @return {Object} Returns a lifecycle object.
	 */
	initConfig: () => ({}),
	/**
	 * Walks the `lifecycle.tree` to output all of the objects defined.
	 *
	 * @param  {Function} done The function to continue generation.
	 * @return {void}
	 */
	walkTree: function ( done ) {
		this.tree( this.lifecycle.tree, {
			_pre: ( tree, dir ) => mkdirp( dir ),
			json: this.writeJSON,
			modules: this.writeModule,
			copies: this.writeCopy,
			templates: this.writeTemplate
		});
		done();
	},
	/**
	 * Helper function to turn a specific JS string into and AST object.
	 *
	 * The intended use is to create AST queryable module objects. These are
	 * typically pretty simple objects that are simply passing a config value
	 * back to module.exports.
	 *
	 * @param  {String} module     The default module value.
	 * @param  {String} location   The file path to where the module will live.
	 * @param  {String} pad        Optional. The whitespace to use in output.
	 *                             Will default to the defined default.
	 * @return {void}
	 */
	initModule: function ( module, location, pad = this.defaultPad ) {
		module = this.fs.read(
			this.destinationPath( location ),
			{ defaults: module || this.starter( 'module' ) }
		);

		return new ASTConfig(
			module,
			{ formatOpts: { format: { indent: { style: pad } } } }
		);
	}
} );

/**
 * Extends the MakeBase prototype with other mix-ins.
 *
 * These mixins are required for the MakeBase to function properly, but they
 * are defined separately to help keep the functionality organization a little
 * cleaner.
 */
Object.assign(
	MakeBase.prototype,
	mixinInstaller,
	mixinPrompt,
	mixinTools,
	mixinTree,
	mixinWriters
);

// Exports the MakeBase for use.
export default MakeBase;
