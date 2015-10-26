module.exports = {
	all: {
		options: {
			precision: 2,
			sourceMap: true
		},
		files: {
			'assets/css/<%= fileSlug %>.css': 'assets/css/sass/<%= fileSlug %>.scss'
		}
	}
};