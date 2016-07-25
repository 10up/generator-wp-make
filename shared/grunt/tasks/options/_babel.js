module.exports = {
	all: {
		options: {
			sourceMap: true,
			comments: false,
			presets: ['es2015']
		},
		files : [{
			expand : true,
			cwd    : 'assets/js/src/',
			src    : ['**/*.js'],
			dest   : 'assets/js/.src-babel/',
			ext    : '.js'
		}]
	}
};
