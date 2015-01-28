'use strict';

var browserify = require('browserify');
var ecstatic = require('ecstatic');
var gulp = require('gulp');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var livereload = require('gulp-livereload');
var path = require('path');
var source = require('vinyl-source-stream');
var watchify = require('watchify');

var config = {
  scripts: {
    source: './src/js/main.js',
    destination: './public/js/',
    filename: 'bundle.js'
  },
  templates: {
    source: './src/**/*.html',
    watch: './src/**/*.html',
    destination: './public/'
  },
  styles: {
    source: './src/**/*.css',
    watch: './src/**/*.css',
    destination: './public/css/'
  },
  assets: {
    source: './src/assets/**/*.*',
    watch: './src/assets/**/*.*',
    destination: './public/'
  }
};

function handleError(err) {
  gutil.log(err);
  gutil.beep();
  return this.emit('end');
}

gulp.task('scripts', function() {
  var build, bundle;
  bundle = browserify({
    entries: [config.scripts.source],
    extensions: config.scripts.extensions,
    debug: false
  });
  build = bundle.bundle().on('error', handleError).pipe(source(config.scripts.filename));
  return build.pipe(gulp.dest(config.scripts.destination));
});

gulp.task('templates', function() {
  return gulp.src(config.templates.source)
    .pipe(gulp.dest(config.templates.destination))
    .on('error', handleError)
    .pipe(livereload({auto: false}));
});

gulp.task('styles', function() {
  return gulp.src(config.styles.source)
  .pipe(concat('style.css'))
  .pipe(gulp.dest(config.styles.destination))
  .pipe(livereload({auto: false}));
});

gulp.task('assets', function() {
  return gulp.src(config.assets.source)
  .pipe(gulp.dest(config.assets.destination));
});

gulp.task('server', function() {
  return require('http').createServer(ecstatic({
    root: path.join(__dirname, 'public')
  })).listen(9001);
});

gulp.task('watch', function() {
  livereload.listen();

  gulp.watch(config.templates.watch, ['templates']);
  gulp.watch(config.styles.watch, ['styles']);
  gulp.watch(config.assets.watch, ['assets']);

  var bundle = watchify(browserify({
    entries: [config.scripts.source],
    extensions: config.scripts.extensions,
    debug: true,
    cache: {},
    packageCache: {},
    fullPaths: true
  }));

  return bundle.on('update', function() {
    return bundle.bundle()
      .on('error', handleError)
      .pipe(source(config.scripts.filename))
      .pipe(gulp.dest(config.scripts.destination))
      .pipe(livereload());
  }).emit('update');
});

gulp.task('no-js', ['templates', 'styles', 'assets']);

gulp.task('build', ['scripts', 'no-js']);

gulp.task('default', ['watch', 'no-js', 'server']);
