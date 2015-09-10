var gulp = require('gulp');
var concat = require('gulp-concat');
var less = require('gulp-less');

var paths = {
    scripts: ['app/js/**/*.js'],
    styles: ['app/css/*.css'],
    libs: [
      'bower_components/**/angular.js',
      'bower_components/**/angular-route.js',
      'bower_components/**/bootstrap.min.js',
      'bower_components/**/bootstrap.min.css',
      'bower_components/**/jquery.min.js',
      'bower_components/**/jquery.js',
      'bower_components/**/jquery.min.map',
      'bower_components/**/socket.io.js',
      'bower_components/**/angular-json-human.min.css',
      'bower_components/**/angular-json-human.min.js'
    ]
};

gulp.task('scripts', function() {
    // concat and copy all JavaScript
    return gulp.src(paths.scripts)
        .pipe(concat('blog.js'))
        .pipe(gulp.dest('app/dist/js'));
});

gulp.task('styles', function() {
	return gulp.src(paths.styles)
		.pipe(less())
		.pipe(gulp.dest('app/dist/css'));
});

gulp.task('libs', function() {
	return gulp.src(paths.libs)
		.pipe(gulp.dest('app/libs'));
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['libs']);
