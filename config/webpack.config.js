'use strict'

const path = require('path')
const paths = require('./paths')

const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const isEnvDevelopment = process.env.NODE_ENV === 'development'
const isEnvProduction = process.env.NODE_ENV === 'production'

module.exports = {
  mode: isEnvDevelopment ? 'development' : isEnvProduction && 'production',
  entry: paths.appIndexJs,
  output: {
    path: isEnvProduction ? paths.appBuild : undefined,
    // 是否在 bundle 中引入「所包含模块信息」的相关注释
    pathinfo: isEnvDevelopment,
    filename: isEnvProduction
      ? 'static/js/[name].[contenthash:8].js'
      : isEnvDevelopment && 'static/js/bundle.js'
  },
  devServer: {
    // 默认使用项目根目录作为源文件目录，结合 html-webpack-plugin 一起使用时会将打包后的文件存在内存中
    //contentBase: paths.publicUrl,
    //publicPath: '/',
    // 所有路由跳转都先指回index.html，开发单页应用时很有用
    historyApiFallback: true,
    compress: true, //是否启用 gzip 压缩
    inline: true,
    port: 3000,
    open: true, // 启用时默认打开浏览器
    stats: 'errors-only' //终端仅打印 error
  },
  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.(js|jsx|ts|tsx|mjs)$/,
            loader: require.resolve('babel-loader'),
            include: paths.appSrc,
            options: {
              presets: ['@babel/preset-env'],
              plugins: [['@babel/plugin-transform-runtime', { corejs: 3 }]],
              // webpack 特有的babel-loader 配置，使能缓存：./node_modules/.cache/babel-loader/
              cacheDirectory: true
            }
          }
        ]
      }
    ]
  },
  plugins: [
    // 打包前清空output.path所指定的目录中的文件
    new CleanWebpackPlugin(),
    // 根据模板生成 index.html
    new HtmlWebpackPlugin(
      Object.assign(
        {},
        {
          // html 模板的位置
          template: path.resolve(paths.appPublic, 'index.html'),
          // 默认需要使用 ejs 语法在模板中解析该值才可以使用
          title: 'react-cart',
          // 配置后会自动将指定路径的 favicon 打包到 output.path， 同时在生成的 html 文档中插入<link />
          favicon: path.resolve(paths.appPublic, 'favicon.ico')
        },
        isEnvProduction
          ? {
              minify: {
                removeComments: true,
                collapseWhitespace: true
              }
            }
          : undefined
      )
    )
  ]
}
