module.exports = {
  mode: 'production',
  optimization: {
    minimize: false
  },
  entry: "./src/ts/index.ts",
  output: {
    path: __dirname + "dist/lib",
    library: "AceCollabExt",
    libraryTarget: "umd",
    umdNamedDefine: true,
    filename: "ace-collab-ext.js"
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ ".tsx", ".ts", ".js" ],

  },
  plugins: [],
  externals: {
    "brace": "ace"
  }
};
