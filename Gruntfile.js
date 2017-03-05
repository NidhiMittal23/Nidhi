module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['app/**/*.js'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },
    
    // qunit: {
    //   files: ['test/**/*.html']
    // },
    
    jshint: {
      files: ['Gruntfile.js', 'app/**/*.js'],
      options: {
        // options here to override JSHint defaults
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    },
    
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint']
    }
  });

  // repeaded check on every change you perform, written adheres best practises - jshint
  grunt.loadNpmTasks('grunt-contrib-jshint');
  // only with best practises stability cannotbe gauranteed, qunit or jasmine
  // grunt.loadNpmTasks('grunt-contrib-qunit');
  // having mutiple file is good for developer to read.. but for user he want one file to
  // be include.. concat multiple file to one single file
  grunt.loadNpmTasks('grunt-contrib-concat');
  // then minify code: remove spaces, line change etc.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // grunt test
  grunt.registerTask('test', ['jshint', 'qunit']);
  // grunt
  grunt.registerTask('default', ['jshint', 'concat', 'uglify']);

};