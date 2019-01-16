const gulp = require('gulp');

const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const notify = require('gulp-notify');
const uglify = require('gulp-uglify-es').default;
const strip = require('gulp-strip-comments');
const stripDebug = require('gulp-strip-debug');
const imagemin =require('gulp-imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');

const dirs = {
    front: {
        scssDev:    './public/layout/front/scss/style.scss',
        cssDist:    './public/layout/front/css/',
        jsDev:      './public/layout/front/scripts/**/*.js',
        jsDist:     './public/layout/front/js/'
    },
    manager: {
        scssDev:    './public/layout/admin/scss/style.scss',
        cssDist:    './public/layout/admin/css/',
        jsDev:      './public/layout/admin/scripts/**/*.js',
        jsDist:     './public/layout/admin/js/'
    },
    images: {
        origin:     './public/layout/gfx/origin/*',
        optimized:  './public/layout/gfx/optimized' 
    }
}

// --- dev tasks

// front styles
gulp.task('front-styles-dev', () => {
    return gulp.src(dirs.front.scssDev)
        .pipe(sourcemaps.init())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(dirs.front.cssDist))
        .pipe(notify({
            title: 'Gulp styles.',
            message: 'Front styles compilled successfully.'
        }));
});

// manager styles
gulp.task('manager-styles-dev', () => {
    return gulp.src(dirs.manager.scssDev)
        .pipe(sourcemaps.init())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(dirs.manager.cssDist))
        .pipe(notify({
            title: 'Gulp styles.',
            message: 'Manager styles compilled successfully.'
        }));
});

// front scripts
gulp.task('front-scripts-dev', () => {
    return gulp.src(dirs.front.jsDev)
        .pipe(sourcemaps.init())
        .pipe(concat('scripts.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(dirs.front.jsDist))
        .pipe(notify({
            title: 'Gulp scripts.',
            message: "Front scripts compilled successfully.",
        }));
});

// manager scripts
gulp.task('manager-scripts-dev', () => {
    return gulp.src(dirs.manager.jsDev)
        .pipe(sourcemaps.init())
        .pipe(concat('scripts.js'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(dirs.manager.jsDist))
        .pipe(notify({
            title: 'Gulp scripts.',
            message: 'Front scripts compilled successfully.'
        }));
});

// --- dist tasks

// front styles
gulp.task('front-styles-dist', () => {
    return gulp.src(dirs.front.scssDev)
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(dirs.front.cssDist))
        .pipe(notify({
            title: 'Gulp styles - dist',
            message: 'Front styles compilled successfully.'
        }));
});

// manager styles
gulp.task('manager-styles-dist', () => {
    return gulp.src(dirs.manager.scssDev)
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(dirs.manager.cssDist))
        .pipe(notify({
            title: 'Gulp styles - dist',
            message: 'Front styles compilled successfully.'
        }));
});

// front scripts
gulp.task('front-scripts-dist', () => {
    return gulp.src(dirs.front.jsDev)
        .pipe(concat('scripts.js'))
        .pipe(uglify())
        .pipe(strip())
        .pipe(stripDebug())
        .pipe(gulp.dest(dirs.front.jsDist))
        .pipe(notify({
            title: 'Gulp scripts - dist',
            message: 'Front scripts compilled successfully.',
        }));
});

// manager scripts
gulp.task('manager-scripts-dist', () => {
    return gulp.src(dirs.manager.jsDev)
        .pipe(concat('scripts.js'))
        .pipe(uglify())
        .pipe(strip())
        .pipe(stripDebug())
        .pipe(gulp.dest(dirs.manager.jsDist))
        .pipe(notify({
            title: 'Gulp scripts - dist',
            message: 'Front scripts compilled successfully.',
        }));
});

// optimize images
gulp.task('images', () => {
    return gulp.src(dirs.images.origin)
        .pipe(imagemin([
            imageminMozjpeg({
                quality: 50
            })
        ]))
        .pipe(gulp.dest(dirs.images.optimized))
        .pipe(notify({
            title: 'Gulp images',
            message: 'Images optimized successfully'
        }))
});

// --- watch tasks
gulp.task('watch:front-styles', () => {
    gulp.watch('./public/layout/front/scss/**/*.scss', gulp.series('front-styles-dev'));
});

gulp.task('watch:manager-styles', () => {
    gulp.watch('./public/layout/admin/scss/**/*.scss', gulp.series('manager-styles-dev'));
});

gulp.task('watch:front-scripts', () => {
    gulp.watch('./public/layout/front/scripts/**/*.js', gulp.series('front-scripts-dev'));
});

gulp.task('watch:manager-scripts', () => {
    gulp.watch('./public/layout/admin/scripts/**/*.js', gulp.series('manager-scripts-dev'));
});

gulp.task('watch:images', () => {
    gulp.watch('./public/layout/gfx/origin/*', gulp.series('images'));
});

gulp.task('default', gulp.parallel('watch:front-styles', 'watch:manager-styles', 'watch:front-scripts', 'watch:manager-scripts', 'watch:images'));
gulp.task('dist', gulp.parallel('front-styles-dist', 'manager-styles-dist', 'front-scripts-dist', 'manager-scripts-dist', 'images'));