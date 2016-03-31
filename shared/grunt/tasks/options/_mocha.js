var mochaPath = 'tests/mocha/';

module.exports = {
	test: {
		src: [ mochaPath + '**/*.html' ],
		options: {
			run: true,
			timeout: 10000
		}
	}
};
