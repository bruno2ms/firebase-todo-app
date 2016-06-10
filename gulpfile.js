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
  var clean = require('gulp-clean');
  var del = require('del');
  var notify = require('gulp-notify');

  var errorHandler = {
    errorHandler: function throwError(error) {
      console.log(error.message);
      notify.onError("Error: <%= error.message %>");
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

    gulp
      .src(['./app/**/*.json'])
      .pipe(plumber(errorHandler))
      .pipe(gulp.dest('./www/'));
  });

  gulp.task('html', function () {
    gulp
      .src(['./app/**/*.html'])
      .pipe(gulp.dest('./www/'));
  });

  gulp.task('clean', function () {
    del(['./www/']);
  });

  gulp.task('watch', ['jshint', 'styles', 'html', 'images', 'browser-sync'], function () {
    gulp.watch('app/**/*.scss', ['styles']);
    gulp.watch('app/**/*.js', ['jshint']);
    gulp.watch('app/**/*.html', ['html', 'bs-reload']);
    gulp.watch('www/**/*.html', ['bs-reload']);
  });

  gulp.task('default', ['clean', 'watch']);
})();
