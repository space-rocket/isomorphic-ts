'use strict'
let gulp = require('gulp');
let ts = require('gulp-typescript');
let concat = require('gulp-concat');
let sourcemaps = require('gulp-sourcemaps');
let newer = require('gulp-newer');
let sass = require('gulp-sass');
let nodemon = require('gulp-nodemon');
let path = require('path');
let sequence = require('run-sequence');

// /*  Variables */
let tsProject = ts.createProject('tsconfig.json')
let sourceFiles = 'src/**/*.ts'
let testFiles = 'test/**/*.ts'
let outDir = require('./tsconfig.json').compilerOptions.outDir
let entryPoint = './dist/src/index.js'


gulp.task('sass', function () {

    let bundleConfigs = [{
        entries: [
            './src/sass/variables.scss',
            './src/sass/bootstrap.scss',
            './src/sass/font-awesome.scss',
            './src/sass/custom.scss',
            // './src/sass/media-queries-helpers.scss',
            './src/sass/media-queries.scss'
        ],
        dest: './dist/styles',
        outputName: 'main.min.css'
    }];

    return bundleConfigs.map(function (bundleConfig) {

        return gulp.src(bundleConfig.entries)
            .pipe(newer(path.join(bundleConfig.dest, bundleConfig.outputName)))
            .pipe(concat(bundleConfig.outputName))
            .pipe(sass({outputStyle: 'compressed'}))
            .pipe(gulp.dest(bundleConfig.dest));
    });
});

gulp.task('copy', function () {
  return gulp.src([
    'src/**/*.html',
    'src/**/*.png',
    'src/**/*.svg'
    ])
    .pipe(gulp.dest('dist'));
});


gulp.task('scripts', function() {
	let tsResult = gulp.src('src/**/*.ts')
	  .pipe(sourcemaps.init()) 
		.pipe(ts(tsProject));
 
    return tsResult.js
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(outDir))
});

gulp.task('watch', function () {
  gulp.watch('src/**/*.js', ['scripts'])
  gulp.watch('src/**/*.html', ['copy']);
  gulp.watch('src/**/*.scss', ['sass']);
});

gulp.task('start', function () {
  nodemon({
    watch: 'dist',
    script: 'dist/index.js',
    ext: 'js',
    env: { 'NODE_ENV': 'development' }
  });
});

gulp.task('default', function (callback) {
  sequence(['sass', 'scripts', 'watch', 'copy'], 'start', callback);
});

