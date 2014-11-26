var es = require('event-stream'),
	gulp = require('gulp'),
	connect = require('gulp-connect'),
	browserify = require('gulp-browserify'),
	filter = require('gulp-filter'),
	to5 = require('gulp-6to5'),
	jsx = require('gulp-jsx'),
	rimraf = require('rimraf');

var path = {
  src: {
	  all: './src/**/*.js*',
	  js: './src/**/*.js',
	  jsx: './src/**/*.jsx'
  }
};

// clean the output directory
gulp.task('clean', function(cb){
    rimraf('dist', cb);
});

// TRANSPILE ES6
gulp.task('build', ['clean'], function() {
	es.merge(
		gulp.src(path.src.js).pipe(to5()),
		gulp.src(path.src.jsx).pipe(jsx()).pipe(to5())
	)
      .pipe(gulp.dest('compiled/src'))
      .pipe(browserify())
      .pipe(filter('app.js'))
      .pipe(gulp.dest('compiled/combined'));
});

// WATCH FILES FOR CHANGES
gulp.task('dev', ['clean', 'build', 'server'], function() {
  gulp.watch(path.src.all, ['build']);
});

// WEB SERVER
gulp.task('server', connect.server({
  root: [__dirname],
  port: 8000,
  open: true,
  livereload: false
}));
