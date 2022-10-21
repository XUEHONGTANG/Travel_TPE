const {
    src,
    dest,
    series,
    parallel,
    watch
} = require('gulp');

const fileinclude = require('gulp-file-include');
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync');
const reload = browserSync.reload;

function includeHTML() {
    return src('*.html')
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(dest('./dist'));
}

exports.html =  includeHTML;

// sass
function sassstyle(){ 
    return src('sass/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(dest('dist/css')) 
}

exports.style = sassstyle;

function img_move(){
    return src(['images/*.*' , 'images/**/*.*']).pipe(dest('dist/images'))
}

 //clear old file
 const clean = require('gulp-clean');

 function clear() {
    return src('dist' ,{ read: false ,allowEmpty: true })
    .pipe(clean({force: true}));
    }

    exports.cls = clear;


 // 瀏覽器同步
function browser(done) {
    browserSync.init({
        server: {
            baseDir: "./dist",
            index: "index.html"
        },
        port: 3000
    });
    watch(['*.html' , 'layout/*.html'] , includeHTML).on('change' ,reload)  
    watch(['sass/*.scss' , 'sass/**/*.scss'] , sassstyle).on('change' ,reload)

    done();
}

exports.default = series(parallel(includeHTML , sassstyle, img_move) ,browser)

