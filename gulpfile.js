var gulp = require('gulp');

var gutil = require('gulp-util');
var plumber = require('gulp-plumber');
var del = require('del');
var gulpSequence = require('gulp-sequence');
var ngtemplates = require('gulp-angular-templatecache');
var ngAnnotate = require('gulp-ng-annotate');
var less = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');
var rename = require('gulp-rename');
var env = process.env.NODE_ENV || "development";
var noop = require("gulp-noop");

var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var webserver = require('gulp-webserver');
var order = require("gulp-order");
var zip = require('gulp-zip');
var RevAll = require('gulp-rev-all');

var config = {
    src: "app",
    app: "app",
    dev: "dev",
    dist: "tmpdist",
    production: !!gutil.env.production,
    development: !!gutil.env.development
};

var libsJS = [
/*
    "node_modules/jquery/dist/jquery.js",
    "app/scripts/libs/jquery.mousewheel.min.js",
    "node_modules/angular/angular.js",
    "node_modules/angular-messages/angular-messages.js",
    "node_modules/angular-ui-router/release/angular-ui-router.js",
    "node_modules/angular-animate/angular-animate.js",
    "node_modules/angular-sanitize/angular-sanitize.js",
    "node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js",
    "node_modules/angular-loading-bar/build/loading-bar.js",
    "node_modules/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.js"
*/
];

gulp.task('webserver', function() {

    if (config.production) {
        return;
    }
    gulp.src('dev')
        .pipe(webserver({
            livereload: true,
            directoryListing: true,
            open: "index.html",
            port: 8008,

            proxies: [
                {source: '/management',target: 'http://localhost:8000/management'}
            ]
        }));
});

gulp.task('clean', function() {
    del("release");
    del("dist");
    del(".tmp");
    return config.production ? del(config.dist) : del(config.dev);
});


gulp.task('ngtemplates', function() {
//    var options = {
//        module: "app",
//        root: "scripts"
//    };
//    var dest = (config.production ? config.dist : config.dev) + "/scripts";
//    return gulp.src(config.src + "/scripts/**/*.html")
//        .pipe(order([config.src + "/scripts/**/*.html"]))
//        .pipe(ngtemplates(options))
//        .pipe(gulp.dest(dest));
});



gulp.task('jsconcat', function() {
//    var dest = (config.production ? config.dist : config.dev) + "/scripts";

//    if (config.production) {
//        return gulp.src([config.src + "/scripts/**/*.js", '!' + config.src + "/scripts/lib/*.js"])
//            .pipe(ngAnnotate())
//            .pipe(plumber())
//            .pipe(order([config.src + "/scripts/app.js", config.src + "/scripts/routes.js", config.src + "/scripts/common/**/*.js", config.src + "/scripts/components/**/*.js"]))
//            .pipe(uglify())
//            .pipe(concat('bundle.js'))
//            .pipe(gulp.dest(dest));
//    } else {
//        return gulp.src([config.src + "/scripts/**/*.js", '!' + config.src + "/scripts/lib/*.js"])
//            .pipe(ngAnnotate())
//            .pipe(plumber())
//            .pipe(order([config.src + "/scripts/app.js", config.src + "/scripts/routes.js", config.src + "/scripts/common/**/*.js", config.src + "/scripts/components/**/*.js"]))
//            .pipe(sourcemaps.init())
//            .pipe(concat('bundle.js'))
//            .pipe(sourcemaps.write())
//            .pipe(gulp.dest(dest));
//    }
});

function onError(err) {
    console.log(err);
}


gulp.task('less', function() {
//    var src = [config.src + "/styles/style.less", config.src + "/scripts/components/**/*.less"];
//    var dest = (config.production ? config.dist : config.dev) + "/styles";
//    return gulp.src(src)
//        .pipe(rename({
//            dirname: ''
//        }))
//        .pipe(plumber())
//        .pipe(less())
//        .pipe(concat('style.css'))
//        .pipe(autoprefixer())

//        .pipe(config.production ? cleanCSS() : noop())
//       .pipe(gulp.dest(dest));
});


gulp.task('copy', function() {
    return gulp.src([
		"*.html",
        "angular_modules/*",
        "css/*",
        "font/*",
        "img/*",
        "lib/**/*",
        "res/*",
        "src/**/*"
    ], {
        cwd: config.src,
        dot: true,
        base: config.src
    })
        .pipe(gulp.dest(config.production ? config.dist : config.dev));
});


gulp.task('css:watch', function() {
    if (config.production) {
        return;
    }
    gulp.watch([config.src + "/css/*.css"], ['copy']);
});

gulp.task('js:watch', function() {
    if (config.production) {
        return;
    }
    gulp.watch([config.src + "/src/*.js", config.src + "src/**/*.js", config.src + "angular_modules/*.js"], ['copy']);
});

gulp.task('res:watch', function() {
    if (config.production) {
        return;
    }
    gulp.watch([config.src + "/res/*.js"], ['copy']);
});

gulp.task('html:watch', function() {
    if (config.production) {
        return;
    }
    gulp.watch([config.src + "/src/**/*.html"], ['copy']);
});

gulp.task('json:watch', function() {
    if (config.production) {
        return;
    }
    gulp.watch([config.src + "/assets/*.json"], ['copy']);
});

gulp.task('indexhttml:watch', function() {
    if (config.production) {
        return;
    }
    gulp.watch([config.src + "/index.html", config.src + "/login.html"], ['copy']);
})

//gulp.task('js', function(){
//    gulp.src('app/**/*.js')
//        .pipe(sourcemaps.init())
//        .pipe(uglify())
//        .pipe(concat('bundle.js'))
//        .pipe(sourcemaps.write())
//        .pipe(gulp.dest('dist'));
//});

gulp.task('bootstrapcopy', function() {


//    var dest = config.production ? config.dist : config.dev;

//    var bootstrap = gulp.src([
//        "node_modules/bootstrap/dist/css/**/*",
//        "node_modules/bootstrap/dist/fonts/**/*"
//    ], {
//        base: 'node_modules/bootstrap/dist'
//    })
//        .pipe(gulp.dest(dest + "/styles/bootstrap"));
//    return bootstrap;

});

/*
gulp.task('jslibconcat', function() {
    return gulp.src(libsJS)
        .pipe(plumber())
        .pipe(concat('lib.js'))
        .pipe(config.production ? uglify() : noop())
        .pipe(gulp.dest((config.production ? config.dist : config.dev) + "/scripts"));
});
*/

gulp.task('deployNoCache', function () {

    if(!config.production){
        return;
    }
    var ignoreImgs = ['index.html'];
    var finalDest = "dist/";
    gulp
    .src(['tmpdist/**'])
    .pipe(RevAll.revision({dontRenameFile:ignoreImgs, dontUpdateReference: []}))
    .pipe(gulp.dest(finalDest))
    .pipe(RevAll.manifestFile())
    .pipe(gulp.dest('manifest'));
});


gulp.task('build', gulpSequence(
    "clean",
    //"jslibconcat",
    //"jsconcat",
    //"ngtemplates",
    //"less",
    "copy",
    //"copyIndexHtml",
    //"images",
    //"bootstrapcopy",
    //"json:watch",
    //"less:watch",
    "css:watch",
    "js:watch",
    "res:watch",
    //"copyUME",
    "html:watch",
    "indexhttml:watch",
    "webserver"
    //"createZip",
    //"deployNoCache"
));

