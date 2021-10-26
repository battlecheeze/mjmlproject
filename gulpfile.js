const gulp = require('gulp'),
      mjml = require('gulp-mjml'),
      browserSync = require('browser-sync').create(),
      del = require('del'),
      removeEmptyLines = require('gulp-remove-empty-lines'),
      sass = require('gulp-sass')(require('node-sass')); // << good on compact and nested
      //sass = require('gulp-sass')(require('sass')); << won't let me use compact and nested
      

// Require your own components if need, and your mjmlEngine (possibly with options)
// require('./components)
const mjmlEngine = require('mjml');

const    // source
      globDir = '**/*',
      outputHTML = "src/html/",
      watchHTML = "src/html/" + globDir + ".html,",
      images = "src/images/",
      mjmlWatch = "src/mjml/" + globDir + ".mjml",
      sassWatch = "src/sass/" + globDir + ".scss",
      outputCSS = "src/css/",
      // partials 
      mjmlPartials = "!src/partials/" + globDir + ".mjml",
      // distribution
      imageDist = "dist/images/",
      htmlDist = "dist/html/"
      //archive
      htmlArchive = "!src/html/" + globDir + ".html",
      imageArchive = "!src/images/",
      mjmlArchive = "!src/mjml/archive/" + globDir + ".mjml"
      sassArchive = "!src/sass/archive/" + globDir + ".scss",
      cssArchive = "!src/css/archive" + globDir + ".css";

// If you'd like to get validation errors and , use strict and a custom error handler function. Note that using strict will not render the file in case of error:
/*
function handleError (err) {
  console.log(err.toString());
  this.emit('end');
}

function mjmlEditor() {
   return gulp.src([mjmlWatch, mjmlArchive])
      .pipe(mjml(mjmlEngine, {validationLevel: 'strict'}))
      .on('error', handleError())
      .pipe(removeEmptyLines())
      .pipe(gulp.dest(outputHTML));
}
*/

function mjmlEditor() {
   return gulp.src([mjmlWatch, mjmlArchive])
   .pipe(mjml())
   .pipe(removeEmptyLines())
   .pipe(gulp.dest(outputHTML));
}

function editorCSS() {
   return gulp.src([sassWatch, sassArchive])
   .pipe(sass.sync({
      outputStyle: 'compact'
   }).on('error', sass.logError))
   .pipe(gulp.dest(outputCSS))
   .pipe(browserSync.stream());
}

function mjmlOutput() {
   return gulp.src([mjmlWatch, mjmlArchive])
   .pipe(mjml(mjmlEngine, {
      "minify": true,
      // change the attribute of minifyCSS in node_modues > mjml-core > lib > index.js then find minify
   }))
   .pipe(gulp.dest(htmlDist));
}

function clean() {
   return del([
      htmlDist + globDir,
      imageDist + globDir
   ]);
}

function clearEmptyLines() {
   return gulp.src([outputHTML + globDir + ".html"])
   .pipe(removeEmptyLines())
   .pipe(gulp.dest(htmlDist))
}

function browserSYNC(done) {
   browserSync.init({
      server:{
         baseDir: 'src',
         index: '/html/index.html'
      },
      browser: [
         '/Applications/Firefox Developer Edition.app/Contents/MacOS/firefox', 
         '/Applications/Google Chrome Canary.app/Contents/MacOS/Google\ Chrome\ Canary'
      ]
   });
   done();
}

function watchFiles() {
   //gulp.watch(sassWatch, editorCSS);
   //gulp.watch([sassWatch, outputHTML], gulp.series(editorCSS, mjmlEditor)).on('change', browserSync.reload); << didn't work
   //gulp.watch([sassWatch, outputHTML], gulp.parallel(editorCSS, mjmlEditor)).on('change', browserSync.reload); // it works and it loads both
   gulp.watch(sassWatch, gulp.parallel(editorCSS, mjmlEditor)); // it works and it loads both
   gulp.watch(mjmlWatch, mjmlEditor);
   gulp.watch(outputHTML).on('change', browserSync.reload);
}

exports.mjmlEditor = mjmlEditor;
exports.mjmlOutput = mjmlOutput;
exports.clean = clean;
exports.clearEmptyLines = clearEmptyLines;
exports.browserSYNC = browserSYNC;
exports.watchFiles = watchFiles;
exports.default = gulp.parallel(browserSYNC, watchFiles);
exports.build = gulp.parallel(gulp.series(clean, mjmlOutput), browserSYNC, watchFiles); 
