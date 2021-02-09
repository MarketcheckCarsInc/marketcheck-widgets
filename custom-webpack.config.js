const webpack = require("webpack");
module.exports = {
  output: {
    library: "marketcheck-api-widgets",
    libraryTarget: "umd",
  },
  plugins: [new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/)],
};
