const path = require('path')
const fs = require('fs')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')
const { DefinePlugin } = webpack
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserJSPlugin = require('terser-webpack-plugin')

const files = require('./files')
const themeConfig = require('./themeConfig')

let pr = (..._path) => path.resolve(__dirname, ..._path)
let buildVer = process.env.ver === 'v3' ? 'v3' : 'v2'
console.log('buildVer', buildVer)

// let pagesSrc = fs.readdirSync(pr('../src/pages/popup/'))

module.exports = {
  entry: {
    ...files.entry,
    background: pr('../src/background.ts'),
    content: pr('../src/content.ts'),
  },
  devtool: false,
  bail: true,
  mode: 'production',
  optimization: {
    minimize: true,
    minimizer: [
      new TerserJSPlugin({
        parallel: true,
        exclude: [
          /(mp4_muxer\.\w+?\.js)|(mp4_muxer\.worker\.\w+?\.js)/,
          'lib/adblock',
        ],
        terserOptions: {
          compress: {
            pure_funcs: ['console.log'],
          },
        },
      }),
      new CssMinimizerPlugin({
        cache: true,
        parallel: true,
      }),
    ],
  },
  module: {
    noParse: /(ffmpeg)|(video_wasm)/,
    rules: [
      {
        test: /\.tsx?$/,
        use: ['babel-loader?cacheDirectory'],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                mode: 'global',
                localIdentName: '[name]__[local]--[hash:base64:5]',
              },
              importLoaders: 2,
            },
          },
          'postcss-loader',
        ],
      },
      {
        test: /\.less$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                modifyVars: themeConfig,
                javascriptEnabled: true,
              },
            },
          },
          {
            loader: 'style-resources-loader',
            options: {
              patterns: path.resolve(__dirname, '../src/style/mixin.less'),
            },
          },
        ],
        exclude: /initVideoFloatBtn/,
      },
      {
        test: /\.less$/i,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                modifyVars: themeConfig,
                javascriptEnabled: true,
              },
            },
          },
          {
            loader: 'style-resources-loader',
            options: {
              patterns: path.resolve(__dirname, '../src/style/mixin.less'),
            },
          },
        ],
        include: /initVideoFloatBtn/,
      },
      {
        test: /\.text/i,
        use: ['text-loader'],
      },
      {
        test: /\.(jpe?g|png|gif|ogg|mp3|mp4)$/,
        use: ['url-loader'],
      },
      {
        test: /\.(svg?)(\?[a-z0-9]+)?$/,
        use: ['url-loader'],
      },
      {
        test: /\.(mkv|ttf|woff2?)$/,
        use: ['url-loader'],
      },
    ],
  },
  cache: {
    type: 'memory',
  },
  stats: {
    cached: true,
    chunks: false,
    chunkModules: false,
    colors: true,
    modules: false,
  },
  context: path.resolve(__dirname, '../src'),
  resolve: {
    alias: {
      '@root': path.resolve(__dirname, '../src'),
    },
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      ignoreOrder: true,
      // chunkFilename: '[name].css',
    }),
    ...files.WebpackPluginList,
    new CopyPlugin({
      patterns: [
        { from: '../src/assets/**/*', to: '' },
        { from: '../src/lib/**/*', to: '' },
        {
          from: `../src/manifest.${buildVer}.json`,
          to: `manifest.json`,
        },
      ],
    }),
    new DefinePlugin({
      'process.env.buildVer': `"${buildVer}"`,
      'process.env.uiDev': `false`,
    }),
  ],
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '../dist_prod'),
    publicPath: '/',
    // libraryTarget: 'amd',
  },
}
