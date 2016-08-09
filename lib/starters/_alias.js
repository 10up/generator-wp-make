module.exports = {
	'js': [
		'eslint',
		'jscs',
		'browserify',
		'uglify'
	],

	'css': [
		'cssmin'
	],

	'test': [
		'phpunit',
		'mocha'
	],

	'default': [
		'css',
		'js'
	],

	'build': [
		'default',
		'clean',
		'copy',
		'test',
		'compress'
	]
};
