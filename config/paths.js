/**
 * Base create-react-app ejected config/path.js
 */

'use strict'

const path = require('path')
const fs = require('fs')

// process.cwd() 返回当前Node.js进程工作的目录
// fs.realpathSync() 同步返回解析的规范路径名
const appDirectory = fs.realpathSync(process.cwd())
// path.resolve  将路径或路径片段的序列解析为绝对路径
const resolveApp = relativePath => path.resolve(appDirectory, relativePath)

const envPublicUrl = process.env.PUBLIC_URL

const getPublicUrl = appPackageJson =>
  envPublicUrl || require(appPackageJson).homepage

const moduleFileExtensions = [
  'web.mjs',
  'mjs',
  'web.js',
  'js',
  'web.ts',
  'ts',
  'web.tsx',
  'tsx',
  'json',
  'web.jsx',
  'jsx'
]

// Resolve file paths in the same order as webpack
// fs.existsSync()  同步判断指定路径的文件是否存在，存在则返回true
const resolveModule = (resolveFn, filePath) => {
  const extension = moduleFileExtensions.find(extension =>
    fs.existsSync(resolveFn(`${filePath}.${extension}`))
  )

  if (extension) {
    return resolveFn(`${filePath}.${extension}`)
  }

  return resolveFn(`${filePath}.js`)
}

module.exports = {
  dotenv: resolveApp('.env'),
  appPath: resolveApp('.'),
  appIndexJs: resolveModule(resolveApp, 'src/index'),
  appBuild: resolveApp('build'),
  appPublic: resolveApp('public'),
  appSrc: resolveApp('src'),
  appTsConfig: resolveApp('tsconfig.json'),
  appJsConfig: resolveApp('jsconfig.json'),
  appPackageJson: resolveApp('package.json'),
  publicUrl: getPublicUrl(resolveApp('package.json'))
}

module.exports.moduleFileExtensions = moduleFileExtensions
