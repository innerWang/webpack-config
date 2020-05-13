'use strict'

const path = require('path')
const paths = require('./paths')

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
  }
}
