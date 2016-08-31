var path = require( 'path' );
var gruntConfig = require( 'load-grunt-config' );

module.exports = function ( grunt ) {
	var conf = {
		configPath: [
			path.join( process.cwd(), 'tasks/' ),
			path.join( process.cwd(), 'tasks/options' ),
		],
		data: {
			pkg: grunt.file.readJSON( 'package.json' ),
		},
		jitGrunt: true,
	};

	gruntConfig( grunt, conf );
};
