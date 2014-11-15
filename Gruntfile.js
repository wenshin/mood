/*global module:false */
module.exports = function(grunt) {
  'use strict';

  var srcPath = 'src/';
  var distPath = 'dist/';

  var modulePrefix = grunt.file.read(srcPath + 'module.prefix');
  var moduleSuffix = grunt.file.read(srcPath + 'module.suffix');

  function mapSrc2DistPath(srcPath, distPath) {
    // Generate a grunt 'files' format src and dist mapping config from a directory
    // e.g.
    // { 'dist/test.js': 'src/test.js', 'dist/test1.js': 'src/test1.js' }
    var config = {};
    var filePaths = grunt.file.expand(srcPath + '**/*.js');
    filePaths.forEach(function(filePath) {
      config[filePath.replace(srcPath, distPath)] = filePath;
    });
    return config;
  }

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    // Task configuration.
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      build: {
        options: {
          banner: modulePrefix,
          footer: moduleSuffix
        },
        files: mapSrc2DistPath(srcPath, distPath)
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {}
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      libtest: {
        src: ['lib/**/*.js', 'test/**/*.js']
      },
      mood: {
        src: ['src/**/*.js']
      }
    },
    qunit: {
      files: ['test/**/*.html']
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      libtest: {
        files: '<%= jshint.libtest.src %>',
        tasks: ['jshint:libtest', 'qunit']
      },
      mood: {
        files: '<%= jshint.mood.src %>',
        tasks: ['concat:build']
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task.
  grunt.registerTask('default', ['jshint', 'qunit', 'concat', 'uglify']);

};
