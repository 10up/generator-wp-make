module.exports = {
	dist: {
		files: {
			'assets/js/<%= fileSlug %>.js': ['assets/js/src/<%= fileSlug %>.js']
		},
		options: {
			browserifyOptions: {
				debug: true
			},
			debug: true,
			transform: [
				['babelify', {
					presets: ['es2015', 'react', 'stage-1'],
					plugins: ['transform-runtime']
				}]
			],
			watch: true
		}
	}
};
