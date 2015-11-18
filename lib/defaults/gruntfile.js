var path = require( 'path' );
var gruntConfig = require( 'load-grunt-config' );

module.exports = function ( grunt ) {
	var conf = {
		configPath: path.join( process.cwd(), 'tasks' ),
		jitGrunt: true,
	};

	gruntConfig( grunt, conf );
};
