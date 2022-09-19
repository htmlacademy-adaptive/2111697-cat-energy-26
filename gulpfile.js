import gulp from "gulp";
import plumber from "gulp-plumber";
import less from "gulp-less";
import postcss from "gulp-postcss";
import csso from "postcss-csso";
import rename from "gulp-rename";
import autoprefixer from "autoprefixer";
import browser from "browser-sync";
import htmlmin from "gulp-htmlmin";
import terser from "gulp-terser";
import squoosh from "gulp-libsquoosh";
import svgo from "gulp-svgmin";
import svgstore from "gulp-svgstore";
import { deleteAsync as del } from "del";

// Styles

export const styles = () => {
  return gulp
    .src("source/less/style.less", { sourcemaps: true })
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss([autoprefixer(), csso()]))
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css", { sourcemaps: "." }))
    .pipe(browser.stream());
};

// Html
const html = () => {
  return gulp
    .src("source/*.html")
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("build"));
};

// Scripts
const scripts = () => {
  return gulp.src("source/js/*.js").pipe(terser()).pipe(gulp.dest("build/js"));
};

// Images
const optimizeImages = () => {
  return gulp
    .src("source/img/**/*.{jpg,png}")
    .pipe(squoosh())
    .pipe(gulp.dest("build/img"));
};

const copyImages = () => {
  return gulp.src("source/img/**/*.{jpg,png}").pipe(gulp.dest("build/img"));
};
// Webp
const createWebP = () => {
  return gulp
    .src("source/img/**/*.{jpg,png}")
    .pipe(
      squoosh({
        webp: {},
      })
    )
    .pipe(gulp.dest("build/img"));
};

//Svg
const svg = () => {
  return gulp.src("source/img/*.svg").pipe(svgo()).pipe(gulp.dest("build/img"));
};

const sprite = () =>
  gulp
    .src("source/icons/*.svg")
    .pipe(svgo())
    .pipe(
      svgstore({
        inlineSvg: true,
      })
    )
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"));

// Copy
export const copy = (done) => gulp.src("source/public/**/*").pipe(gulp.dest("build"));

//Clean
export const clean = () =>  del("build");

// Server

const server = (done) => {
  browser.init({
    server: {
      baseDir: "build",
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
};

//Reload
const reload = (done) => {
  browser.reload();
  done();
};

// Watcher

const watcher = () => {
  gulp.watch("source/less/**/*.less", styles);
  gulp.watch("source/icons/*.svg", sprite);
  gulp.watch("source/*.html").on("change", gulp.series(html, reload));
};

//Build

const initialBuild = gulp.parallel(
  styles,
  html,
  scripts,
  svg,
  createWebP,
  sprite
);

export const build = gulp.series(
  clean,
  copy,
  optimizeImages,
  initialBuild,
  sprite
);

export default gulp.series(
  clean,
  copy,
  copyImages,
  initialBuild,

  server,
  watcher
);
