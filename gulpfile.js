const gulp = require('gulp');
const webpack = require('gulp-webpack');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');
const cleanCSS = require('gulp-clean-css');
const bump = require('gulp-bump');
const mkdirp = require('mkdirp');
const path = require('path');
const header = require('gulp-header');
const fs = require("fs");

const buildDir = "./build";
const distDir = "./dist";
const filename = "ace-collab-ext";

gulp.task('default', ['webpack', 'minify', 'css', 'minify-css'], function () {

});

gulp.task('dist', ['build', 'copy-files'], function () {
  const packageJson = require("./dist/package.json");
  if (packageJson.version.endsWith('SNAPSHOT')) {
    return gulp.src(`${distDir}/package.json`)
      .pipe(bump({version: packageJson.version + '.' + new Date().getTime()}))
      .pipe(gulp.dest(distDir));
  }
});

gulp.task('copy-files', function () {
  return gulp.src(["README.md", "LICENSE.txt"])
    .pipe(gulp.dest(distDir));

});

gulp.task('build', ['default'], function () {
  return gulp.src([`${buildDir}/**/*`, './package.json'])
    .pipe(gulp.dest(distDir));
});

gulp.task('webpack', ["webpack-umd", "webpack-cjs"], function () {
});

gulp.task('webpack-umd', function () {
  return pack("umd", "umd");
});

gulp.task('webpack-cjs', function () {
  return pack("commonjs2", "commonjs");
});

gulp.task('minify', ['minify-umd', 'minify-cjs'], function () {

});

gulp.task('minify-umd', ["webpack-umd"], function () {
  return minify('umd');
});

gulp.task('minify-cjs', ["webpack-cjs"], function () {
  return minify('commonjs');
});

gulp.task('css', function () {
  return gulp.src('src/css/*.css')
    .pipe(gulp.dest(buildDir));
});

gulp.task('minify-css', ['css'], function () {
  return gulp.src(`${buildDir}/${filename}.css`)
    .pipe(sourcemaps.init())
    .pipe(cleanCSS())
    .pipe(rename({extname: '.min.css'}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(buildDir));
});

gulp.task('clean', function () {
  return del([buildDir, 'dist']);
});

function minify(dir) {
  return gulp.src(`${buildDir}/${dir}/${filename}.js`)
    .pipe(sourcemaps.init())
    .pipe(uglify({
      preserveComments: "license"
    }))
    .pipe(rename({extname: '.min.js'}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(`${buildDir}/${dir}`));
}

function pack(type, dir) {
  const outputPath = `${buildDir}/${dir}`;
  mkdirp(outputPath);

  const config = buildWebpackConfig(type);

  const packageJson = JSON.parse(fs.readFileSync("./package.json"));
  const headerTxt = fs.readFileSync("./copyright-header.txt");

  return gulp.src('src/js/index.js')
    .pipe(webpack(config))
    .pipe(header(headerTxt, {package: packageJson}))
    .pipe(gulp.dest(outputPath));
}

function buildWebpackConfig(libraryTarget) {
  return {
    output: {
      path: __dirname + "/lib",
      library: "AceCollabExt",
      libraryTarget: libraryTarget,
      umdNamedDefine: true,
      filename: `${filename}.js`
    },
    module: {
      loaders: [
        {
          test: /(\.js)$/,
          loader: "babel",
          exclude: /(node_modules)/
        },
        {
          test: /(\.js)$/,
          loader: "eslint-loader",
          exclude: /node_modules/
        }
      ]
    },
    resolve: {
      root: path.resolve("./src/js"),
      extensions: ["", ".js"]
    },
    plugins: [],
    externals: {
      "ace": "ace"
    }
  };
}

