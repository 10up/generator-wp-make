module.exports = {
	main: {
		options: {
			mode: 'zip',
			archive: './release/<%= opts.funcPrefix %>.<%%= pkg.version %>.zip'
		},
		expand: true,
		cwd: 'release/<%%= pkg.version %>/',
		src: ['**/*'],
		dest: '<%= opts.funcPrefix %>/'
	}
};