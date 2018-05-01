const gulp = require("gulp");
const insert = require("gulp-insert");
const webpackStream = require("webpack-stream");
const webpack = require("webpack");
const babel = require("gulp-babel");
const rename = require("gulp-rename");
const uglify = require("gulp-uglify");
const sourcemaps = require("gulp-sourcemaps");
const del = require("del");
const cleanCSS = require("gulp-clean-css");
const header = require("gulp-header");
const fs = require("fs");
const gulpTypescript = require("gulp-typescript");
const typescript = require("typescript");
const tsProject = gulpTypescript.createProject("tsconfig.json", {
  declaration: true,
  typescript: typescript
});

gulp.task("default", ["dist"], () => {});

gulp.task("dist", [
  "umd",
  "minify-umd",
  "commonjs",
  "typings",
  "append-typings-namespace",
  "css",
  "minify-css",
  "copy-files"], () => {
});

gulp.task("copy-files", () =>
  gulp.src(["README.md", "LICENSE.txt", "package.json"])
    .pipe(gulp.dest("dist"))
);

gulp.task("umd", () => {
  const outputPath = "dist/umd";

  const packageJson = JSON.parse(fs.readFileSync("./package.json"));
  const headerTxt = fs.readFileSync("./copyright-header.txt");

  return gulp.src("./src/ts/index.ts")
    .pipe(webpackStream(require("./webpack.config.js"), webpack))
    .pipe(header(headerTxt, {package: packageJson}))
    .pipe(gulp.dest(outputPath));
});

gulp.task("minify-umd", ["umd"], () =>
  gulp.src("dist/umd/ace-collab-ext.js")
    .pipe(sourcemaps.init())
    .pipe(uglify({
      preserveComments: "license"
    }))
    .pipe(rename({extname: ".min.js"}))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("dist/umd"))
);

gulp.task("commonjs", () =>
  gulp.src("src/ts/*.ts")
    .pipe(babel())
    .pipe(gulp.dest("dist/lib"))
);

gulp.task("typings", () =>
  gulp.src("src/ts/*.ts")
    .pipe(tsProject())
    .dts.pipe(gulp.dest("dist/typings"))
);

gulp.task("append-typings-namespace", ["typings"], () =>
  gulp.src("dist/typings/index.d.ts", {base: './'})
    .pipe(insert.append('\nexport as namespace AceCollabExt;\n'))
    .pipe(gulp.dest("./"))
);

gulp.task("css", () =>
  gulp.src("src/css/*.css")
    .pipe(gulp.dest("dist/css"))
);

gulp.task("minify-css", ["css"], () =>
  gulp.src(`dist/css/ace-collab-ext.css`)
    .pipe(sourcemaps.init())
    .pipe(cleanCSS())
    .pipe(rename({extname: ".min.css"}))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("dist/css"))
);

gulp.task("clean", () => del(["dist"]));
