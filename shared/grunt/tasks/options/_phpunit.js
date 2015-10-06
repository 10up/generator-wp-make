module.exports = {
	classes: {
		dir: 'tests/phpunit/'
	},
	options: {
		bin: 'vendor/bin/phpunit',
		bootstrap: 'bootstrap.php.dist',
		colors: true,
		testSuffix: 'Tests.php'
	}
};