module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		steal: {
			options: {
				includeSteal: true
			},
			dist: {
				src: "bithub/bithub.js",
				dest: "bithub"
			}
		}
	});

	// Load the plugin that provides the "uglify" task.
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-steal-node');

	// Default task(s).
	grunt.registerTask('default', ['steal']);
};
