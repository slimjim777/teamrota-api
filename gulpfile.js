'use strict';

var gulp = require('gulp');
var react = require('gulp-react');
var browserify = require('gulp-browserify');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var shell = require('gulp-shell');
var jest = require('gulp-jest-iojs');
var runSequence = require('run-sequence');
var minifyCss = require('gulp-minify-css');


// jest-cli needs this for node < 0.12
//require('harmonize')();

var path = {
    NODE: 'node_modules/',
    MEDIA: 'media/',
    SRC: 'src/',
    BUILD: 'build/',
    BUILD_FILE: 'bundle.js',
    DIST: 'media/dist/'
};


// Compile the JSX files to Javascript in the build directory
gulp.task('compile_jsx', function(){
    return gulp.src(path.SRC + '*.js')
        .pipe(react())
        .pipe(gulp.dest(path.BUILD));
});

gulp.task('compile_jsx_components', function(){
    return gulp.src(path.SRC + 'components/*.js')
        .pipe(react())
        .pipe(gulp.dest(path.BUILD + 'components'));
});

gulp.task('compile_jsx_models', function(){
    return gulp.src(path.SRC + 'models/*.js')
        .pipe(react())
        .pipe(gulp.dest(path.BUILD + 'models'));
});

// Concatenate and minimise the Javascript files and copy to dist folder
// (This has two other tasks as dependencies, which will finish first)
gulp.task('build_components', ['compile_jsx', 'compile_jsx_components', 'compile_jsx_models'], function(){
    return gulp.src([path.BUILD + 'app.js'])
        .pipe(browserify({}))
        .on('prebundle', function(bundler) {
            // Make React available externally for dev tools
            bundler.require('react');
        })
        .pipe(rename('bundle.js'))
        //.pipe(uglify())
        .pipe(gulp.dest(path.DIST));
});

gulp.task('jest', function() {
    // So our task doesn't error out when a test fails
    //ignoreErrors: true
    return gulp.src('src/__tests__').pipe(jest({
        scriptPreprocessor: "../../preprocessor.js",
        unmockedModulePathPatterns: [
            "node_modules/react"
        ],
        testDirectoryName: "src",
        testPathIgnorePatterns: [
            "node_modules",
            "src/support"
        ],
        moduleFileExtensions: [
            "js",
            "json",
            "react"
        ]
    }));

});

gulp.task('minify-css', function() {
    return gulp.src(path.MEDIA + 'css/app.css')
        .pipe(minifyCss())
        .pipe(gulp.dest(path.MEDIA + 'css/dist/'));
});

// Copy the bootstrap media files
gulp.task('bootstrap', function() {
    return gulp.src([path.NODE + 'bootstrap/dist/**/*'], {base:path.NODE + 'bootstrap/dist'})
        .pipe(gulp.dest(path.MEDIA + 'bootstrap'));
})

gulp.task('test', function () {
    runSequence('jest');
    gulp.watch([path.SRC + '**/*.js'], ['jest']);
});

gulp.task('build', function () {
    runSequence('build_components');
    gulp.watch([path.SRC + '**/*.js'], ['build_components']);
});

// Default: remember that these tasks get run asynchronously
gulp.task('default', ['build_components', 'bootstrap', 'minify-css']);