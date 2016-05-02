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
  var wiredep = require('wiredep').stream;

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

  gulp.task('scripts', function () {
    gulp
      .src('./app/**/*.js')
      .pipe(plumber(errorHandler))
      .pipe(jshint())
      .pipe(jshint.reporter('default'))
      .pipe(gulp.dest('./www/'))
      .pipe(browserSync.reload({ stream:true }));
  });

  gulp.task('bower', function () {
    gulp
      .src('./app/**/*.html')
      .pipe(wiredep())
      .pipe(gulp.dest('./www/'));

    gulp
      .src('./www/**/*.html')
      .pipe(inject(gulp.src(['./www/**/*.js', '!./www/components/**/*.js'], { read: false }), { relative: true }))
      .pipe(gulp.dest('./www/'));

    // gulp
    //   .src('./app/components/**/*')
    //   .pipe(gulp.dest('./www/bower_components/'));
  });

  gulp.task('inject', function () {
    gulp
      .pipe(inject(gulp.src(['./www/**/*.html'], { read: false })))
      .pipe(gulp.dest('./www/'));
  });

  gulp.task('default', ['bower', 'styles', 'scripts', 'browser-sync'], function () {
    gulp.watch('app/**/*.scss', ['styles']);
    gulp.watch('app/**/*.js', ['scripts']);
    gulp.watch('app/**/*.html', ['bower']);
    gulp.watch('www/**/*.html', ['bs-reload']);
  });

})();
