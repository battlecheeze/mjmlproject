const gulp = require('gulp'),
      mjml = require('gulp-mjml'),
      browserSync = require('browser-sync'),
      del = require('del');

// Require your own components if need, and your mjmlEngine (possibly with options)
// require('./components)
const mjmlEngine = require('mjml');

const    // source
      globDir = '**/*',
      outputHTML = "src/html/",
      mjmlWatch = "src/mjml/" + globDir + ".mjml";

// If you'd like to get validation errors and , use strict and a custom error handler function. Note that using strict will not render the file in case of error:
/*
function handleError(err) {
   console.log(err.toString());
   this.emit('end');
}
*/

/*
function mjmlEditor() {
   return gulp.src(mjmlWatch)
      .pipe(mjml(mjmlEngine, {validationLevel: 'strict'}))
      .on('error', handleError())
      .pipe(gulp.dest(outputHTML));
}
*/

function mjmlEditor() {
   return gulp.src(mjmlWatch)
   .pipe(mjml())
   .pipe(gulp.dest(outputHTML));
}

function browserSYNC(done) {
   browserSync.init({
      server:{
         baseDir: 'src',
         index: '/html/index.html'
      }
   });
}

function watchFiles() {
   gulp.watch(mjmlWatch, mjmlEditor);
   gulp.watch(outputHTML + globDir + ".html").on('change', browserSync.reload);
}

exports.mjmlEditor = mjmlEditor;
exports.browserSYNC = browserSYNC;
exports.watchFiles = watchFiles;
exports.default = gulp.parallel(browserSYNC, watchFiles);

