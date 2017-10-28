module.exports = function(grunt) {
	
    // 1. All configuration goes here 
    grunt.initConfig({
		
        pkg: grunt.file.readJSON('package.json'),
		
		// 2. Configuration for env settings goes here.
		env: {
			local: {
				ENV: 'LOCAL'
			},
			build: {
				ENV: 'BUILD'
			},
			release: {
				ENV: 'RELEASE'
			}
		},
		
		// 2. Configuration for task watch settings goes here.
		watch: {
			scripts: {
				files: [
					'js/*.js',
					'app/languages/*.js',
					'app/app.js',
					'app/controllers/*.js',
					'app/services/*.js',
					'app/directives/*.js',
					'app/custom/*.js',
				],
				tasks: ['clean', 'concat', 'uglify'],
				options: {
            		spawn: false
        		}
			},
			css: {
				files: ['css/*.css'],
				tasks: ['cssmin'],
				options: {
            		spawn: false,
        		}
			}
		},
		
		// 2. Configuration for cleaning files goes here.
		clean: {
			build: ['build'],
			release: ['release']
		},
		
		// 2. Configuration for concatinating files goes here.
        concat: {    
			lang: {
				src: [
					'app/languages/*.js' // All JS in the libs folder
				],
				dest: 'build/lang.js'
			},
			app: {
				src: [
					'app/app.js', 				// This specific file
					'app/controllers/*.js', 	// All JS in the controllers folder
					'app/services/services.js', // This specific file
					'app/directives/*.js', 		// All JS in the directives folder
					'app/custom/custom.js' 		// This specific file
				],
				dest: 'build/app.js'
			},
			library: {
				src: [
					'js/angular-file-upload-shim.min.js', 	// This specific file
					'js/jquery.min.js', 					// This specific file
					'js/bootstrap.min.js', 					// This specific file
					'js/angular.min.js', 					// This specific file
					'js/angular-file-upload.min.js', 		// This specific file
					'js/angular-animate.min.js', 			// This specific file
					'js/angular-route.min.js', 				// This specific file
					'js/angular-sanitize.min.js', 			// This specific file
					'js/angular-cookies.min.js', 			// This specific file
					'js/ui-bootstrap-tpls.js', 				// This specific file
					'js/dialogs.min.js', 					// This specific file
					'js/angular-growl.min.js', 				// This specific file
					'js/jquery.metisMenu.js', 				// This specific file
					'js/xeditable.min.js', 					// This specific file
					'js/angular-infinite-scroll.min.js', 	// This specific file
					'js/angular-count-to.min.js', 			// This specific file
					'js/select.min.js', 					// This specific file
					'js/angulartics.js', 					// This specific file
					'js/angulartics-ga.js', 				// This specific file
					'js/intlTelInput.js', 					// This specific file
					'js/isValidNumber.js' 					// This specific file
				],
				dest: 'build/core.js'
			}
        },
		
		// 2. Configuration for compressing js files goes here.
		uglify: {
			lang: {
				src: 'build/lang.js',
				dest: 'build/lang.min.js'
			},
			app: {
				src: 'build/app.js',
				dest: 'build/app.min.js'
			},
			library: {
				src: 'build/core.js',
				dest: 'build/core.min.js'
			}
		},
		
		// 2. Configuration for compressing css files goes here.
		cssmin: {
			css: {
				files: {
					'css/style.min.css': [
						'css/bootstrap.min.css', 
						'css/font-awesome.min.css',
						'css/dialogs.min.css',
						'css/angular-growl.min.css',
						'css/xeditable.css',
						'css/intlTelInput.css',
						'css/select.min.css',
						'css/base.css',
						'css/custom.css',
						'css/animations.css',
						'css/print.css'
					]
				}
			}
		},
		
		// 2. Configuration for updating html files goes here.
		preprocess: {
			local: {
				src: 'index-src.html',
				dest: 'index.html'
			},
			build: {
				src: 'index-src.html',
				dest: 'index.html'
			},
			release: {
				src: 'index-src.html',
				dest: 'index.jsp'
			}
		},
		
		// 2. Configuration for updating html files goes here.
		imagemin: {
			dynamic: {
				files: [{
					expand: true,
					cwd: 'images/',
					src: ['**/*.{png,jpg,gif}'],
					dest: 'build/images/'
				}]
			}
		}
    });
	
    // 3. Where we tell Grunt we plan to use this plug-in.
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-preprocess');
	grunt.loadNpmTasks('grunt-env');
	
    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
    grunt.registerTask('default', []);
	
	grunt.registerTask('local', ['env:local', 'preprocess:local', 'imagemin']);
	
	grunt.registerTask('build', ['env:build', 'clean:build', 'concat', 'uglify', 'cssmin', 'preprocess:build', 'imagemin']);
	
	grunt.registerTask('release', ['env:release', 'clean:release', 'concat', 'uglify', 'cssmin', 'preprocess:release', 'imagemin']);

};