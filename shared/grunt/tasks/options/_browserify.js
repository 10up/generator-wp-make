module.exports = {
	all : {
		files : [{
			expand : true,
			cwd    : 'assets/js/.src-babel/',
			src    : ['*.js'],
			dest   : 'assets/js/.src-browserify/',
			ext    : '.js'
		}]
	}
};
