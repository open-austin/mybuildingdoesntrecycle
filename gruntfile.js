module.exports = function(grunt) {
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';

  grunt.loadNpmTasks('grunt-mongo-migrations');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    migrations: {
      path: __dirname + '/migrations',
      template: grunt.file.read( __dirname + "/migrations/_template.js"),
      mongo: process.env.MONGOLAB_URI || 'mongodb://localhost/recycling_' + process.env.NODE_ENV,
      ext: 'js'
    },
    
    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: [
          'test/unit/**/*.js',
          'test/integration/**/*.js'
        ]
      }
    },

    concat: {
      js: {
        files: {
          'public/js/main.js': [
            'assets/lib/spin/javascripts/jquery.spin.js',
            'assets/lib/jquery.scrollTo/jquery.scrollTo.min.js',
            'assets/js/leaflet.js',
            'assets/lib/leaflet.markercluster/dist/leaflet.markercluster.js',
            'assets/js/jquery/jquery.loading.js',
            'assets/js/jquery/jquery.status.js',
            'assets/js/ejs_production.js',
            'assets/js/map.js',
            'assets/js/dialog.js',
            'assets/js/app.js'
            ]
        }
      },
      css: {
        files: {
          'public/css/styles.css': [
            'assets/css/leaflet.css',
            'assets/css/recycling.css',
            'assets/lib/leaflet.markercluster/dist/MarkerCluster.css',
            'assets/lib/leaflet.markercluster/dist/MarkerCluster.Default.css',
            'assets/lib/spin/stylesheets/hquery.spin.css'
            ]
        }
      }
    },

    uglify: {
      options: {
        mangle: false
      },
      main: {
        src: 'public/js/main.js',
        dest: 'public/js/main.min.js'
      }
    },
    
    cssmin: { 
      dist: { 
        src: 'public/css/styles.css', 
        dest: 'public/css/styles.min.css' 
      } 
    }
  });
    
  grunt.registerTask('test',['mochaTest']);
  grunt.registerTask('build', ['concat', 'cssmin','uglify'])
};
