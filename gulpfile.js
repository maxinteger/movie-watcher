var gulp = require('gulp'),
	less = require('gulp-less'),
	connect = require('gulp-connect'),
	browserify = require('gulp-browserify'),
	filter = require('gulp-filter'),
	to5 = require('gulp-6to5'),
	jsx = require('gulp-jsx'),
	rimraf = require('rimraf');

var path = {
	src: {
		js: './src/**/*.js',
		less: './less/main.less',
		lessAll: './less/**/*.less'
	},
	dist: 'compiled/'
};

// clean the output directory
gulp.task('clean', function(cb){
	return rimraf('compiled-', cb);
});

gulp.task('build-less', function(){
	return gulp.src(path.src.less)
		.pipe(less())
		.pipe(gulp.dest(path.dist + 'css'));
});

gulp.task('build-js', function() {
	gulp.src(path.src.js)
		.pipe(jsx())
		.pipe(to5())
		.pipe(gulp.dest('compiled/src'))
		.pipe(browserify({
			insertGlobals: true,
			debug: true
		}))
		.pipe(filter('app.js'))
		.pipe(gulp.dest(path.dist + 'combined'));
});

// WATCH FILES FOR CHANGES
gulp.task('dev', ['clean', 'build-js', 'build-less', 'server'], function() {
	gulp.watch(path.src.js, ['build-js']);
	gulp.watch(path.src.lessAll, ['build-less']);
});

// WEB SERVER
gulp.task('server', connect.server({
	root: [__dirname],
	port: 8000,
	open: true,
	livereload: false
}));
