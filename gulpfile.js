'use strict';

const
    gulp = require('gulp'),
    watch = require('gulp-watch'),
    autoprefixer = require('gulp-autoprefixer'),
    //remember = require('gulp-remember'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    rigger = require('gulp-rigger'),
    cssmin = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    imagemin = require('gulp-imagemin'),
    //svgSprite = require('gulp-svg-sprite'),
    cheerio = require('gulp-cheerio'),
    replace = require('gulp-replace'),
    //pngquant = require('imagemin-pngquant'),
    //browserSync = require("browser-sync"),
    //reload = browserSync.reload,
    //debug = require('gulp-debug'),
    plumber = require('gulp-plumber'),
    gulpIf = require('gulp-if'),
    del = require('del'),
    //iconv = require('gulp-iconv'),
    header = require('gulp-header'),
    //babel = require('gulp-babel')
    surge = require('gulp-surge')
;

//const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';
const isDevelopment = true; // dev mode turns on source map

gulp.task('html:build', function () {
    return gulp
        .src([ 'src/*.html', '!src/__*.html', '!src/___*.html' ]) // take html files beyond template parts __.html and ___.html
        .pipe(plumber())
        .pipe(rigger())
        .pipe(header('\ufeff')) // correct utf headers
        .pipe(gulp.dest('dist/'))
});

gulp.task('html:encode', function () {
    return gulp
        .src('dist/*.html')
        .pipe(iconv({ decoding:'win1251', encoding: 'utf8' }))
        .pipe(gulp.dest('dist/*.html'))
});

//gulp.task('html:build_encode', gulp.series('html:build', 'html:encode') );

gulp.task('js:build', function () {
    return gulp
        .src([
            'src/vendor/jquery3.2.1/jquery.min.js',
            'src/vendor/popper-1.11.0/popper.umd.min.js',
            'src/vendor/bootstrap-4.0.0-beta/js/bootstrap.min.js',
            //'src/vendor/maskedinput-1.4.1/jquery.maskedinput.min.js',
            //'src/vendor/inputmask/jquery.inputmask.bundle.min.js',
            //'src/vendor/select-2/js/select2.min.js',
            //'src/vendor/ioncalendar/js/moment-with-locales.min.js',
            //'src/vendor/ioncalendar/js/ion.calendar.min.js',
            'src/vendor/jquery.scrollTo-min/jquery.scrollTo-min.js',
            'src/vendor/slick/slick.js',
            'src/js/script.js'
        ])
        .pipe(plumber())
        .pipe(gulpIf(isDevelopment, sourcemaps.init()))
        .pipe(concat('script.min.js'))
        //.pipe(uglify())
        .pipe(gulpIf(isDevelopment,sourcemaps.write()))
        .pipe(gulp.dest('dist/js/'))
});

gulp.task('css:build', function () {
    return gulp
        .src([
            'src/vendor/bootstrap-4.0.0-beta/scss/bootstrap.scss',
            'src/vendor/bootstrap-4.0.0-beta/scss/bootstrap-grid.scss',
            //'src/vendor/select-2/css/select2.min.css',
            //'src/vendor/ioncalendar/css/ion.calendar.css',
            'src/vendor/slick/slick.css',
            'src/scss/index.scss'
        ])
        .pipe(plumber())
        .pipe(gulpIf(isDevelopment, sourcemaps.init()))
        .pipe(sass())
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(concat('style.min.css'))
        .pipe(cssmin())
        .pipe(gulpIf(isDevelopment,sourcemaps.write()))
        .pipe(gulp.dest('dist/css/'))
});


gulp.task('img:copy', function () {
    return gulp
        .src('src/img/**/*.*' /*, { since: gulp.lastRun('img:copy') } */ )
        .pipe(plumber())
        //.pipe(debug({ title: 'img:copy' }))
        .pipe(gulp.dest('dist/img/'))
});

gulp.task('img:compress:gif', function () {
    return gulp
        .src('dist/img/**/*.gif' /*, { since: gulp.lastRun('img:copy') } */ )
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true})
        ]))
        .pipe(plumber())
        //.pipe(debug({ title: 'img:copy' }))
        .pipe(gulp.dest('dist/img/'))
});

gulp.task('img:compress:jpeg', function () {
    return gulp
        .src('dist/img/**/*.jp*g' /*, { since: gulp.lastRun('img:copy') } */ )
        .pipe(imagemin([
            imagemin.jpegtran({progressive: true})
        ]))
        .pipe(plumber())
        //.pipe(debug({ title: 'img:copy' }))
        .pipe(gulp.dest('dist/img/'))
});

gulp.task('img:compress:png', function () {
    return gulp
        .src('dist/img/**/*.png' /*, { since: gulp.lastRun('img:copy') } */ )
        .pipe(imagemin([
            imagemin.optipng({optimizationLevel: 5})
        ]))
        .pipe(plumber())
        //.pipe(debug({ title: 'img:copy' }))
        .pipe(gulp.dest('dist/img/'))
});

gulp.task('img:compress:svg', function () {
    return gulp
        .src('dist/img/**/*.svg' /*, { since: gulp.lastRun('img:copy') } */ )
        .pipe(imagemin([
            imagemin.svgo({
                plugins: [
                    {removeViewBox: true},
                    {cleanupIDs: false}
                ]
            })
        ]))
        /*.pipe(svgSprite({
            mode: {
                symbol: {
                    sprite: "dist/img/svg/sprite.svg",
                    render: {
                        scss: {
                            dest:'dist/img/svg/_sprite.scss',
                            template: "dist/img/svg/_sprite_template.scss"
                        }
                    }
                }
            }
        }))*/
        .pipe(plumber())
        //.pipe(debug({ title: 'img:copy' }))
        .pipe(gulp.dest('dist/img/'))
});

gulp.task('img:compress', gulp.parallel('img:compress:gif', 'img:compress:jpeg', 'img:compress:png', 'img:compress:svg' ) );


gulp.task('fonts:copy', function () {
    return gulp
        .src('src/fonts/**/*.*' /*, { since: gulp.lastRun('img:copy') } */ )
        .pipe(plumber())
        //.pipe(debug({ title: 'img:copy' }))
        .pipe(gulp.dest('dist/fonts/'))
});

gulp.task('clean', function () {
    return del('dist/')
});

gulp.task('deploy', function () {
    return surge({
        project: './dist/',         // Path to your static build directory
        domain: 'cpagen.surge.sh'  // Your domain or Surge subdomain
    })
});

gulp.task('build', gulp.series('clean', gulp.parallel('css:build', 'js:build', 'html:build', 'img:copy', 'fonts:copy') ) );

gulp.task('build:deploy', gulp.series('build', 'deploy' ) );

gulp.task('build:compress:deploy', gulp.series('build', 'img:compress', 'deploy' ) );

gulp.task('watch', function () {
    gulp.watch('src/*.html',     gulp.parallel('html:build'));
    gulp.watch('src/**/*.js',    gulp.parallel('js:build'));
    gulp.watch('src/**/*.*css',   gulp.parallel('css:build'));
    gulp.watch('src/img/**/*.*', gulp.parallel('img:copy'));
    gulp.watch('src/fonts/**/*.*', gulp.parallel('fonts:copy'));
});

gulp.task('dev', gulp.series('build', 'watch'));


