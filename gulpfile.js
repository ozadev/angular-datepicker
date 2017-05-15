var gulp = require('gulp');
var concat = require('gulp-concat');
var addsrc = require('gulp-add-src');
var sass = require('gulp-sass');
var tinypng = require('gulp-tinypng-compress');
var autoprefixer = require('gulp-autoprefixer');
var uglify = require('gulp-uglify');
var ngmin = require('gulp-ngmin');
var templateCache = require('gulp-angular-templatecache');

//
//
//

// Main dashboard application

var appSassSources = [
    './src/scss/*.scss',
    './src/js/**/*.scss'
];

var appJsSources = [
    './src/js/datepickerApp.module.js',
    './src/js/**/*js'
];


//
//
//


gulp.task('sass', function () {
    return gulp.src(appSassSources)
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 60 versions'],
            cascade: false
        }))
        .pipe(concat("angular-datepicker.css"))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('sass-min', function () {
    return gulp.src(appSassSources)
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 60 versions'],
            cascade: false
        }))
        .pipe(concat("angular-datepicker.min.css"))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('build', function () {
    return gulp.src('./src/**/*html')
        .pipe(templateCache('template.js', {module: 'ozas.datepicker', root: 'src'}))
        .pipe(addsrc(appJsSources))
        .pipe(concat('angular-datepicker.js'))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('compress', function () {
    return gulp.src('./src/**/*html')
        .pipe(templateCache('template.js', {module: 'ozas.datepicker', root: 'src'}))
        .pipe(addsrc(appJsSources))
        .pipe(concat('angular-datepicker.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/'));
});

gulp.task('watch', function () {
    gulp.watch(appSassSources, ['sass']);
    gulp.watch([appJsSources, './src/**/*html'], ['build']);
});

gulp.task('build-all', ['sass', 'build']);
gulp.task('compress-all', ['sass-min', 'compress']);

gulp.task('default', ['build-all', 'watch']);