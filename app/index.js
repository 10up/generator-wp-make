'use strict';
var Base = require('extendable-yeoman').Base;
var chalk = require('chalk');

module.exports = Base.extend({
	notify: function () {
		// replace it with a short and sweet description of your generator
		this.log(chalk.magenta('Invoke a subgenerator to get started!'));
		this.log("Available Modules:");
		this.log(chalk.green("\tyo wp-make:plugin"));
		this.log(chalk.green("\tyo wp-make:theme"));
		this.log(chalk.green("\tyo wp-make:child-theme"));
		this.log(chalk.green("\tyo wp-make:library"));
	}
});
