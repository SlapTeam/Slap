'use strict';

var gulp          = require('gulp'),
    _             = require('lodash'),
    del           = require('del'),
    glob          = require('glob'),
    flatten       = require('gulp-flatten'),
    fs            = require('fs'),
    path          = require('path'),
    minimatch     = require('minimatch'),
    sass          = require('gulp-sass'),
    bowerFiles    = require('main-bower-files');

// Can filter and sort an array of files based on an array of globbing patterns
var filter = function(files, patterns) {
  var filtered = [];
  patterns.forEach(function(p) {
    if (p[0] === '!') {
      filtered = _.difference(filtered, minimatch.match(filtered, p.substr(1)));
    }
    else {
      filtered = _.union(filtered, minimatch.match(files, p));
    }
  });
  return filtered;
};

gulp.task('clean', function(cb) {
  del(['dist/**/*'], cb);
});

gulp.task('lib', ['clean'], function() {
  return gulp.src(bowerFiles({ filter: /\.js$/ }))
    .pipe(flatten())
    .pipe(gulp.dest('dist/client/lib'));
});

gulp.task('client-scripts', ['clean'], function() {
  return gulp.src(['src/client/**/*.js', 'src/client/**/*.html'])
    .pipe(gulp.dest('dist/client'));
});

gulp.task('extension', ['clean'], function() {
  return gulp.src('src/extension/**/*')
    .pipe(gulp.dest('dist'));
});

gulp.task('client-styles', ['clean'], function() {
  return gulp.src('src/client/styles/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('dist/client/css'));
});

gulp.task('client-fonts', ['clean'], function() {
  return gulp.src('bower_components/bootstrap-sass/fonts/*')
    .pipe(gulp.dest('dist/client/fonts'));
});

gulp.task('script-list', ['lib', 'client-scripts'], function(cb) {
  // Get all scripts
  var files = glob.sync('dist/client/**/*.js');

  // Make them relative and ensure the path separator is correct
  var root = path.join(process.cwd(), 'dist');
  files = _.map(files, function(p) {
    return path.relative(root, p).replace(/\\/g, '/');
  });

  // Sort the list to ensure the scripts are loaded in the right order
  files = filter(files, [
    'client/lib/jquery.js',
    'client/lib/angular.js',
    'client/lib/*',
    'client/init.js',
    '**/*',
    '!client/inject.js',
    'client/inject.js'
  ]);

  // Save the list
  fs.writeFile('dist/clientScripts.js',
    'var clientJsFiles = ' + JSON.stringify(files, null, 2),
    cb);
});

gulp.task('build', ['script-list', 'client-styles', 'client-fonts', 'extension']);

gulp.task('default', ['build'], function() {
  gulp.watch(['src/**/*'], ['build']);
});
