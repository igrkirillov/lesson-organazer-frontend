const webpack = require("webpack");
const { merge } = require("webpack-merge");
const common = require("./webpack.common");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = merge(common, {
  mode: "production",
  optimization: {
    minimize: false, // не получается настроить extract css
    minimizer: [new CssMinimizerPlugin()],
  },
  plugins: [
    new webpack.NormalModuleReplacementPlugin(
      /\.\/config\.json/,
      "../../config/prod/config.json"
    ),
  ],
});
