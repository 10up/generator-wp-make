module.exports = {
	main: {
		options: {
			mode: 'zip',
			archive: './release/<%= funcPrefix %>.<%%= pkg.version %>.zip'
		},
		expand: true,
		cwd: 'release/<%%= pkg.version %>/',
		src: [ '**/*' ],
		dest: '<%= funcPrefix %>/'
	}
};
