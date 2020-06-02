const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');

const cssLoaders = extra => {
  const loaders = [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        hmr: true,
        reloadAll: true,
      },
    },
    'css-loader',
  ]

  if (extra) {
    loaders.push(extra);
  }
  return loaders;
}

const optimization = () => {
  const config = {
    splitChunks: {
      chunks: "all"
    }
  }
  config.minimizer = [new OptimizeCssAssetsPlugin(), new TerserWebpackPlugin()]
  return config;
}

module.exports = {
  context: path.resolve(__dirname, "src"),
  mode: "development",
  entry: "./main.js",
  output: {
    filename: "[name].[hash].js",
    path: path.resolve(__dirname, "solar-system"),
  },
  devServer: {
    port: 3000,
    hot: true,
  },
  optimization: optimization(),
  plugins: [
    new HtmlWebpackPlugin({
      template: "../index.html",
      minify: {
        collapseWhitespace: true
      }
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "[name].[hash].css",
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["css-loader"],
      },
      {
        test: /\.s[ac]ss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.(png|jpg|svg|gif)$/,
        use: ["file-loader"],
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/,
        use: ["file-loader"],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
};
