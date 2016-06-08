(function () {
  'use strict';
  var gulp = require('gulp');
  var plumber = require('gulp-plumber');
  var rename = require('gulp-rename');
  var browserSync = require('browser-sync');
  var jshint = require('gulp-jshint');
  var autoprefixer = require('gulp-autoprefixer');
  var sass = require('gulp-sass');
  var imagemin = require('gulp-imagemin');
  var cache = require('gulp-cache');
  var inject = require('gulp-inject');
  var wiredep = require('wiredep');
  var clean = require('gulp-clean');
  var del = require('del');

  var errorHandler = {
    errorHandler: function throwError(error) {
      console.log(error.message);
      this.emit('end');
    },
  };

  gulp.task('browser-sync', function () {
    browserSync({
      server: {
        baseDir: './www/',
      },
    });
  });

  gulp.task('bs-reload', function () {
    browserSync.reload();
  });

  gulp.task('images', function () {
    gulp
      .src('./app/**/*.{jpg,png}')
      .pipe(cache(imagemin({ optimizationLevel: 7, progressive: true, interlaced: true })))
      .pipe(gulp.dest('./www/'));
  });

  gulp.task('styles', function () {
    gulp
      .src(['./app/**/*.scss'])
      .pipe(plumber(errorHandler))
      .pipe(sass())
      .pipe(autoprefixer())
      .pipe(rename({ suffix: '' }))
      .pipe(gulp.dest('./www/'))
      .pipe(browserSync.reload({ stream:true }));
  });

  gulp.task('jshint', function () {
    gulp
      .src(['./app/**/*.js'])
      .pipe(plumber(errorHandler))
      .pipe(jshint())
      .pipe(jshint.reporter('jshint-stylish', {beep: true}))
      .pipe(gulp.dest('./www/'))
      .pipe(browserSync.reload({ stream:true }));
      // .pipe(jshint.reporter('fail'))
  });

  gulp.task('wire', function () {
    var stream = require('wiredep').stream;
    var options = {
        ignorePath: /\.+(\/.*\/)/,
        fileTypes: {
          html: {
            replace: {
              js: '<script src="/lib/{{filePath}}"></script>',
              css: '<link rel="stylesheet" href="/lib/{{filePath}}" />',
            },
          },
        },
      };

    var wiredepJs = wiredep().js;
    if (wiredepJs) {
      gulp
        .src(wiredep().js)
        .pipe(gulp.dest('./www/lib/'));
    }

    gulp
      .src('./app/**/*.html')
      .pipe(stream(options))
      .pipe(inject(gulp.src(['!./www/lib/**/*.{js,css}', './www/**/*.{js,css}'], { read: false }), { ignorePath: '/www/' }))
      .pipe(gulp.dest('./www/'));
  });

  gulp.task('clean', function () {
    del(['./www/']);
  });

  gulp.task('watch', ['jshint', 'styles', 'wire', 'browser-sync'], function () {
    gulp.watch('app/**/*.scss', ['styles']);
    gulp.watch('app/**/*.js', ['jshint']);
    gulp.watch('app/**/*.html', ['wire']);
    gulp.watch('www/**/*.html', ['bs-reload']);
  });

  gulp.task('default', ['clean', 'watch']);
})();
