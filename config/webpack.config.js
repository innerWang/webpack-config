'use strict'

const path = require('path')
const paths = require('./paths')

const { CleanWebpackPlugin } = require('clean-webpack-plugin')

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
    new CleanWebpackPlugin()
  ]
}
