const fs = require('fs-extra');
const CleanCSS = require('clean-css');

fs.copySync('src/css', 'dist/css');

const css = fs.readFileSync('dist/css/ace-collab-ext.css');
const options = {
  sourceMap: true,
  sourceMapInlineSources: true
}
const minified = new CleanCSS(options).minify(css);
fs.writeFileSync( 'dist/css/ace-collab-ext.min.css', minified.styles );
fs.writeFileSync( 'dist/css/ace-collab-ext.css.map', minified.sourceMap.toString() );
