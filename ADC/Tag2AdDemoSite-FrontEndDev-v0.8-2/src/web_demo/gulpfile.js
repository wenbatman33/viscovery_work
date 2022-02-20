var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-uglifycss');
var rename = require("gulp-rename");

gulp.task('concat', function () {
    return gulp.src([
        'node_modules/bootstrap/dist/css/bootstrap.min.css',
        'node_modules/video.js/dist/video-js.css',
        'node_modules/bootstrap-toggle/css/bootstrap-toggle.min.css"',
        'node_modules/videojs-overlay/dist/videojs-overlay.css',
        'assets/css/adc.css'
    ])
        .pipe(concat('app.css'))
        .pipe(gulp.dest('assets/css'));
});
gulp.task('minify-css', ['concat'], function () {
    return gulp.src('assets/css/app.css')
        .pipe(minifyCSS({
            keepBreaks: true,
        }))
        .pipe(rename(function (path) {
            path.basename += ".min";
            path.extname = ".css";
        }))
        .pipe(gulp.dest('assets/css/'));
});

gulp.task('uglify', function() {
    return gulp.src([
        'node_modules/jquery/dist/jquery.min.js',
        'node_modules/bootstrap/dist/js/bootstrap.min.js',
        'node_modules/video.js/dist/video.js',
        'node_modules/d3/build/d3.min.js"',
        'node_modules/bootstrap-toggle/js/bootstrap-toggle.min.js',
        'node_modulesnm/videojs-overlay/dist/videojs-overlay.js',
        'node_modules/sine-waves/sine-waves.min.js'
    ])
    .pipe(concat('app.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('assets/js'));
});

gulp.task('default', ['minify-css','uglify']);