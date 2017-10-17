import gulp from 'gulp';
import sass from 'gulp-sass';
import rename from 'gulp-rename';
import util from 'gulp-util';
import del from 'del';
import cleanCSS from 'gulp-clean-css';
import {create as bsCreate} from 'browser-sync';
const browserSync = bsCreate();

/**
 * Build Settings
 */
let settings = {

    /*
     * Environment to build our application for
     */
    production: !!util.env.production,

    /*
     * Where should the final file be?
     */
    destFolder: 'public/',

    /*
     * Where should the css file be?
     */
    cssDestFolder: 'css/'
};


/**
 * Serve browserSync server
 */
gulp.task('serve', function () {

    browserSync.init({
        server: "./public",
        port: 5000,
        ui: {
            port: 5001
        }
    });

    gulp.watch("scss/**/*.scss", ['sass']);
    gulp.watch("public/*.html").on('change', browserSync.reload);
});

/**
 * Clean all temporary files
 */
gulp.task('clean', function () {
    return del(['*.css']);
});

/**
 * Create css bundle
 */
gulp.task('sass', function () {
    return gulp.src("scss/style.scss")
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(settings.destFolder + settings.cssDestFolder))
        .pipe(settings.production ? cleanCSS({compatibility: 'ie8'}) : util.noop())
        .pipe(settings.production ? rename({suffix: ".min"}) : util.noop())
        .pipe(settings.production ? gulp.dest(settings.destFolder + settings.cssDestFolder) : util.noop())
        .pipe(browserSync.stream());
});

/**
 * Run tasks
 */
gulp.task('default', ['clean', 'sass', 'serve']);