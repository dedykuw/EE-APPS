var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var cssmin = require('gulp-cssmin');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('css_combiner', function() {
    return gulp.src('public/css/*.css')
        .pipe(concat('application.css'))
        .pipe(autoprefixer())
        .pipe(gulp.dest('public/css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('public/css'))
});
gulp.task('js_vendor_combiner', function() {
    return gulp.src('public/js/vendor/*.js')
        .pipe(sourcemaps.init())
        .pipe(concat('scripts.js'))
        .pipe(sourcemaps.write())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('public/js/vendor/'))
});

gulp.task('build', [ 'css_combiner', 'js_vendor_combiner']);
gulp.task('js', [ 'js_vendor_combiner']);
gulp.task('css', [ 'css_combiner']);