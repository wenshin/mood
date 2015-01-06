/*global module:false */
module.exports = function(grunt) {
  'use strict';

  var SRC_PATH = 'src/';
  var DIST_PATH = 'dist/';
  var PREFIX = '.prefix';
  var SUFFIX = '.suffix';

  var readWrapper = function(path, name, filesuffix) {
    return grunt.file.read(SRC_PATH + name + filesuffix);
  };

  var modulePrefix = readWrapper(SRC_PATH, 'module', PREFIX);
  var moduleSuffix = readWrapper(SRC_PATH, 'module', SUFFIX);

  function mapSrc2DistPath(srcPath, distPath, ignore) {
    // Generate a grunt 'files' format src and dist mapping config from a directory
    // e.g.
    // { 'dist/test.js': 'src/test.js', 'dist/test1.js': 'src/test1.js' }
    var config = {};
    var filePaths = grunt.file.expand(srcPath + '**/*.js');
    filePaths.forEach(function(filePath) {
      if ( ignore && filePath.indexOf(ignore) !== -1 ) { return; }
      config[filePath.replace(srcPath, distPath)] = filePath;
    });
    return config;
  }

  function wrap(name, ignore) {
    var path = name ? name + '/' : '';
    return mapSrc2DistPath(SRC_PATH + path, DIST_PATH + path, ignore);
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
      buildMood: {
        options: {
          banner: modulePrefix,
          footer: moduleSuffix
        },
        files: wrap()  // src/ to dist/
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: 'dist/<%= pkg.name %>.js',
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
      build: {
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
      build: {
        files: '<%= jshint.build.src %>',
        tasks: ['clean:build', 'concat:buildMood']
      }
    },
    clean: {
      build: ['dist/**/*.js']
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');

  // Default task.
  grunt.registerTask('default', ['jshint', 'qunit', 'concat', 'uglify']);

};
