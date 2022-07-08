const path = require('path')
const fs = require('fs')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')
const { DefinePlugin } = webpack
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
  mode: 'development',
  devtool: 'inline-source-map',
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
          // 'style-loader',
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
          // 'style-loader',
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
    }),
    ...files.WebpackPluginList,
    new CopyPlugin({
      patterns: [
        { from: '../src/assets/**/*', to: '' },
        {
          from: `../src/manifest.${buildVer}.json`,
          to: `manifest.json`,
          transform(buffer) {
            let manifest = JSON.parse(buffer.toString())
            manifest.name = manifest.name + '--dev'
            return JSON.stringify(manifest)
          },
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
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/',
  },
}
