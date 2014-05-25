'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');


var WpMakeGenerator = yeoman.generators.Base.extend({
	notify: function () {
		// replace it with a short and sweet description of your generator
		this.log(chalk.magenta('Invoke a subgenerator to get started!'));
		this.log("Available Modules:");
		this.log(chalk.green("\tyo wp-make:plugin"));
		this.log(chalk.green("\tyo wp-make:theme"));
		this.log(chalk.green("\tyo wp-make:child-theme"));
	},
});

module.exports = WpMakeGenerator;