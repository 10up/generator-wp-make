var assetsPath = 'assets/js/';
var srcPath = assetsPath + 'src/';
var testPath = assetsPath + 'test/';

module.exports = {
	options: {
		configFile: '.eslintrc'
	},
	target: [
		srcPath + '**/*.js',
		testPath + '**/*.js'
	]
};
