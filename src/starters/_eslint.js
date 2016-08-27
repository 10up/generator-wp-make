var assetsPath = 'assets/js/',
	srcPath = assetsPath + 'src/',
	testPath = assetsPath + 'test/';

module.exports = {
	options: {
		configFile: '.eslintrc'
	},
	target: [
		srcPath + '**/*.js',
		testPath + '**/*.js'
	]
};
