## 前言

- 安装, `yarn add webpack webpack-cli -D`

- 运行， `./node_modules/.bin/webpack`，注意需要`webpack.config.js`

- 局部安装依赖后会在`./node_modules/.bin`目录下创建依赖对应的软链接，通过在`package.json`中添加`scripts`则可以直接从`.bin`下寻找依赖进行执行，简化命令

  ```json
  {
    "scripts": {
      "start": "webpack"
    }
  }
  ```

## webpack 入门

webpack 是一个模块打包机，主要是分析项目结构，找到 JavaScript 模块或其他的浏览器不能运行的拓展语言(如 Scss， TypeScript 等)，并将其转换和打包为浏览器可使用的格式

- Gulp/Grunt 是一种能够优化前端的开发流程的工具
- Webpack 是一种模块化的解决方案

Gulp/Grunt 主要是在一个配置文件中，指明对某些文件进行编译、组合、压缩等的具体流程，然后工具会按照这个流程完成流程中指定的任务。

webpack 则是找到主入口文件，从这个文件找到项目的所有依赖，使用 loaders 对其进行处理，最后打包为一个或多个浏览器可识别的 JavaScript 文件。

### 0. 基本配置

#### 1.entry

#### 2.output

- `filename`：输出 bundle 的名称，若使用了`code splitting`、多个 entry point 或者使用插件来创建多个 bundle，则需要使用以下方式来替换，针对每个 bundle 起一个唯一的名称

  ```js
  filename: '[name].bundle.js' // 使用入口名称
  filename: '[id].bundle.js' // 使用内部 chunk id
  filename: '[name].[hash].bundle.js' // 使用每次构建过程中，唯一的 hash 生成
  filename: '[chunkhash].bundle.js' // 使用基于每个 chunk 内容的 hash
  ```

- `chunkFilename`：非入口(non-entry) chunk 文件的名称

  一般为了防止缓存引起的问题，会在 filename 中添加 hash 等文件指纹配置，若觉得 hash 太长，可以指定长度`[hash:6]`

#### 3. resolve

该项配置主要设置模块如何被解析

- `resolve.modules`告诉 webpack 解析模块时应该搜索的目录,主要是告诉 webpack 去哪个路径寻找第三方模块，默认是`node_modules`
- `resolve.alias`创建 import 或 require 的别名，来确保模块引入变得更简单
- `resolve.extensions`配置自动解析的扩展名，需要将高频的放在前面，若不配置，则默认找`.js`

若使用了绝对路径后，发现 vscode 智能代码导航失效了，可以配置`jsconfig.json`

```js
//webpack.config.js
module.exports = {
  //....
  resolve: {
    modules: ['./src/components', 'node_modules'] //从左到右依次查找
  },
  alias: {
		'@':
  },
  extensions: ['.jsx', '.js']
}

```

#### 4. module

主要用于配置 rules

#### 5. optimization

- `minimize`: 告诉 webpack 使用 minimizer 中指定的插件压缩 bundle，`production`模式下默认为`true`
  注意：
  当将用于压缩 css 的 optimize-css-assets-webpack-plugin 配置在此选项而不是 plugins 时，需要同时配置 js 的压缩
- `minimizer` : 配置输出的文件压缩插件
- `splitChunks` : 代码分割，抽离公共代码，替代原先的`CommonsChunkPlugin`
  - `chunks`: 用于优化的 chunks 的类型，可选`all`(所有引入的库)、`async`(异步引入的库)、`initial`(同步引入的库)
  - `minChunks`: 最小引用次数
  - `name`: 分离出来的代码块的名称，设置为 true 时会自动根据 chunks 及 cache group 的 key 生成名称，官方推荐在生产模式将其设置为 false
  - `cacheGroups`: 可以继承或者复写来自`splitChunks.*`的配置项，此外还可以配置`test`、`priority`、`reuseExistingChunk`
    - `priority`: 设置权重
    - `test`: 用于控制当前组可选择的模块

需要注意的是优化只能在`production`模式下进行，一般是判断 `process.env.NODE_ENV`，但是`process.env`默认并不包含`NODE_ENV`属性，命令行方式可以采用`cross-env`来设置属性方便`webpack`读取

```shell
# 安装
$ yarn add cross-env -D

# package.json
{
    "scripts": {
        "start": "cross-env NODE_ENV=development webpack-dev-server ",
        "build": "cross-env NODE_ENV=production webpack"
    }
}

```

#### 6. externals

我们可以将一些依赖存在 CDN 上，在 index.html 中通过`<script>`标签引入，但是使用时仍然期望可以通过 import 去引用，且希望 webpack 不将其打包进 bundle 文件，即可以将其配置在 externals 属性上。

### 1. source map

使用 source map 可以定位到源码，方便排查问题，想要配置 source map 的类型，需要通过`devtool`属性进行配置，可配置的值例如`cheap-module-eval-source-map`(可以定位到源代码的行，不适合生产环境)

### 2. webpack-dev-server 本地服务器

webpack-dev-server 是一个基于 node.js 构建的本地开发服务器，使用前需要先安装对应的依赖

```shell
$ yarn add webpack-dev-server -D
```

安装后需要配置`devServer`属性，该属性是一个对象，其中的可配置项不限于下述几项：

- `contentBase`：告诉服务器从哪个目录中提供内容。只有在你想要提供静态文件时才需要，`devServer.publicPath` 将用于确定应该从哪里提供 bundle，并且此选项优先。默认情况下，将使用项目根目录作为提供内容的目录。将其设置为 `false` 以禁用 `contentBase`。若想要在启动服务时自动打开主页，需要结合 html-webpack-plugin 插件使用
- `historyApiFallback`: 开发单页应用时十分有用，依赖于 HTML5 的 history API，设置为 `true`时所有的跳转指向 `index.html`
- `inline`: 当设置为 `true`时，若**源文件改变则会自动刷新页面**，且构建消息会出现在控制台！！！
- `port`: 设置监听端口，默认为`8080`
- `hot`: 设置为 true 时表示启用 webpack 的模块热替换特性

对应修改配置文件，然后使用如下命令即可以开启本地服务器，页面会在浏览器中自动打开：

```shell
$ npx webpack-dev-server --open
```

- 修改 `contentBase` 指定的目录中对应的文件，手动刷新浏览器则可以看到更新；
- 修改源代码保存时则可以看到**页面自动刷新**，更新也会同步显示

需要注意的是，如果 webpack 的规则变了，需要重新`build`后重启 `WDS`

### 3. Loaders

通过使用不同的 `loader`，`webpack`有能力调用外部的脚本和工具，实现对不同的格式文件的处理，如分析转换`scss`为`css`，或者把`ES6`等语法的`js 文件`转换为浏览器兼容的版本，还比如将`jsx`转换为`js`。

需要使用的`loaders`都必须安装对应的依赖，`loader` 可以使我们在使用`import`加载文件后进行预处理

`loader`的使用配置在 **`module.rules`**中，此处 `rules`属性是数组

```js
// webpack.config.js

module.exports = {
  module: {
    rules: [
      {
        /**  规则详情  **/
      },
    ],
  },
}
```

`rules` 的每一个[**`Rule`**](https://webpack.js.org/configuration/module/#rule)中的字段含义为：

- `exclude`： 屏蔽不需要处理的文件夹
- `include`： 添加必须处理的文件夹
- `use`：是一个数组，每一个元素指定所使用的 `loader` 及对应的`options`，可以链式**从右到左**调用多个 loader，若对于该规则只使用一个 loader， 可以直接设置`Rule.loader`及`Rule.options/Rule.query`的值
  - `loader`: 所使用的`loader`的名称(**必需!!!**)
  - `options`：
- `test`：一个用于匹配`loaders`所处理的文件拓展名的正则表达式(**必需!!!**)
- `oneOf`：仅使用该数组中第一个匹配的规则

#### 1. Babel

Babel 是一个编译 JavaScript 的平台，其核心功能位于`babel-core`的包中，对于所需要使用的扩展功能，我们都需要安装对应的包，如解析 ES6 的`babel-env-preset`和解析 JSX 的`babel-preset-react`包。

```shell
# babel-loader 8.x | babel 7.x
$ npm install babel-loader @babel/core @babel/preset-env


# @babel/preset-react
# @babel/plugin-transform-runtime
#
```

```js
// 示例， 使用 babel-loader 8.x
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-transform-runtime'],
          },
        },
      },
    ],
  },
}
```

`babel-loader`的一些特定`options`的属性设置：

- `cacheDirectory`： 默认为`false`，当有设置时，会用来缓存`loader`的执行结果，之后的 webpack 构建，将会尝试读取缓存，来避免在每次执行时，可能产生的、高性能消耗的 Babel 重新编译过程，设置为`true`时则默认使用`node_modules/.cache/babel-loader`

`babel-loader`的一些问题：

- 很慢！尽量保证转义比较少的文件，如使用`exclude`；使用`cacheDirectory`将转义结果缓存到文件系统，提升速度

- 引入`babel-plugin-transform-runtime`使所有公共方法从其中被引用

`babel`的配置完全可以写在 `webpack.config.js`的`loader 对应的 options`中，但是若`babel`的配置过于复杂，可在`.babelrc`中单独进行配置，`webpack` 会自动调用该文件读取配置内容

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
      },
    ],
  },
}
```

##### 1.1 babel 的 polyfill 及 polyfill 的按需引入

代码中的 es6 或者更高级的语法浏览器无法解析，则需要注入 polyfill

- 方法一：安装`@babel/polyfill`，在`index.js`中通过`import '@bable/polyfill'`

  - 缺点：会引入不必要的 polyfill，污染全局环境，且造成打包体积过大
  - 改进： 使用`@babel/preset-env`的`useBuiltIns`配置选项

- 方法二： 安装`@babel/plugin-transform-runtime`(开发模式的依赖)和`@babel/runtime`(生产模式的依赖)，并安装对应的`@babel/corejs-3`，对 runtime 插件进行配置

##### 1.2 动态导入

配置`import()`动态导入所对应的按需加载，需要 `@babel/plugin-syntax-dynamic-import` 的插件支持，但是此插件已包含在`@babel/preset-env`中，所以不需要额外配置

安装：

- babel-loader 和 @babel/core 需要一起安装才可以使用 babel-loader

- @babel/preset-env ，配置 package.json/browserslist，将此插件配置在 presets 中

  ​ 装完此插件就有了一堆 plugin 和 @babel/runtime(原因是：@babel/plugin-transform-regenerator 依赖于 regenerator-transform 依赖于@babel/runtime)

- 安装 `@babel/plugin-transform-runtime` 和 `@babel/corejs-3`(此项安装在 dependencies 中)，配置 plugins，即可实现 polyfill 且按需引入

#### 2. css-loader 和 style-loader

- `css-loader` 使我们可以使用`@import`或者`url(...)`的方法实现`require()`的功能，即加载`.css`文件转换为`CommonJS`对象
- `style-loader`使我们可以将计算后的样式通过`<style>`标签加入页面中

两者结合则可以把样式表嵌入打包后的`JS`文件中

##### 2.1. css modules

全局的类名的维护和修改都十分麻烦， `css modules`将 JS 的 模块化思想带入到 CSS 中，所有的类名和动画名都只作用于当前模块，需要针对 `css-loader`进行配置

```js
{
  loader: 'css-loader',
  options: {
    // modules 设置为 true 或者 对象 时启用 css modules
    modules: {
      localIdentName: '[path][name]__[local]--[hash:base64:5]'
    }
  }
}
```

##### 2.2 CSS 预处理器

CSS 预处理器用一种专门的编程语言，是对 原生 css 的扩展，可以使用`mixins`、`variables`等语法来写 CSS，以进行 Web 页面样式设计，然后再编译成正常的 CSS 文件，以供项目使用。

`Sass`、`LESS`、`Stylus` 是目前最主流的 CSS 预处理器。

```js
// webpack.config.js
// 需要安装 sass-loader 和 node-sass / dart-sass
{
  use: [
    'style-loader',
    { loader: 'css-loader', options: { importLoaders: 2 } },
    'postcss-loader',
    {
      loader: 'sass-loader',
      options: { prependData: `$primary-color: #025ad3;` },
    },
  ]
}
```

##### 2.3 CSS 后处理器

CSS 后处理器是对 CSS 进行处理，并最终生成 CSS 的 处理器，在预处理器之后进行处理。

比较出名的如自动处理浏览器兼容性的 `Autoprefixer`，编译前编译后都是 css

Autoprefixer 会读取 browserlist ，根据设置的所需兼容的浏览器版本进行处理

```css
/**   源码   **/
.container {
  display: flex;
}

/**   经 Autoprefixer编译   **/
.container {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox; /**  IE **/
  display: flex;
}
```

可以使用 `PostCSS`后处理框架，以`JavaScript` 对 CSS 进行更改

```js
// webpack.config.js
{
  use: [
    'style-loader',
    { loader: 'css-loader', options: { importLoaders: 1 } },
    'postcss-loader',
  ]
}

// postcss.config.js
module.exports = {
  plugins: [require('autoprefixer')],
}

// package.json
{
  browserlist: ['last 2 version', '>1%', 'ios 7']
}
```

#### 3 url-loader 和 file-loader

https://cloud.tencent.com/developer/article/1367537

url-loader 与 file-loader 类似，但是会在文件大小低于指定的限制(字节)时，可以返回一个 DataURL，这样会减少网络请求，不仅仅用于 css!!!

url-loader 的 options：

- **limit ** : 字节限制，小于该值时会将文件处理返回一个 Data URL， CRA 设置的是 约 10k
- **mimetype**: 指定媒体类型
- **fallback**: 指定文件大于`limit`时用于处理的 loader，默认为 `file-loader`

- **encoding**： 编码方式，默认 base64

file-loader 主要解决 css 中图片引入路径的问题，当通过`url()`引入一张图片设置背景时，若没有使用 file-loader，则会报错

使用 file-loader 时，默认生成的文件名就是文件内容 md5 的哈希值并保留原始的扩展名

file-loader 的 options：

- **name**： 默认是 `[hash]:[ext]`，可自定义文件名模板

对于 url-loader 手动配置时需要配置 options.esModule 为 false，否则 `<img src={require('../aa.png')} />`会变为 `<img src="[object Module]">`，

- **疑惑**， cra 并没有配置，为嘛不会出问题？？

#### 4 cache-loader

在一些性能开销较大的 loader 前面使用此 loader，将结果缓存到磁盘中，保存和读取缓存也会有时间开销，建议只对性能开销比较大的 loader 进行此处理

#### 5 eslint-loader

使用时需要：

- 安装 eslint-loader eslint
- 在 webpackOptions.module.rules 中增加一个 eslint 的配置项
- 安装 babel-eslint
- 添加 .eslintrc.js 文件，设置 env、parser 等配置项
- 安装 eslint-plugin-react ，在 .eslintrc.js 的 extends 中增加配置

到上述为止，eslint 主要会对代码质量上的错误进行提示，若想对于代码风格错误有更全面的提示，可以配置 prettier

- 安装 prettier、eslint-config-prettier、 eslint-plugin-prettier
- 在 .eslintrc.js 中增加 prettier 的配置
- 新增 .prettierrc 文件，自定义规则

**需要注意的是**，prettier 从 v2.0.0 开始配置项的默认值有更改！(含 `trailing comma`，`arrow parens`，`end of line`)。

对于 end of line 的更改，需要在仓库的`.gitattributes`文件中添加`* text=auto eol=lf`配置. 然后 windows 用户再去 clone 仓库以保证 checkout 的时候不会将 `lf`转换为`crlf`。

<br>

### 4. Plugins

用于扩展 webpack 的功能，loader 是用于处理单个文件的，plugin 则直接在整个构建过程中生效

使用插件也是需要安装，并在`webpack.config.js`中的`plugins`数组中添加一个该插件的实例

当使用插件对输出结果处理时，应当在文件输出到磁盘之前处理。

#### 1. HTMLWebpackPlugin

依据一个简单的`index.html`模板，生成一个自动引用你打包后的 JS 文件的新`index.html`。这在每次生成的 js 文件名称不同时非常有用。

**HTMLWebpackPlugin**插件会根据指定的`index.html`模板，自动添加所依赖的`css、js、favicon`等文件，生成最终的 html 页面。

使用该插件需要安装后引入，new 一个实例，new 操作时可传入的配置项可以参考 [这里](https://github.com/jantimon/html-webpack-plugin#configuration)

各个配置项的的示例可以参考[这里](https://github.com/jantimon/html-webpack-plugin/tree/master/examples)

- `filename`, 是指生成的文件的名称，默认`index.html`，可配置路径，路径相对于 `output.path`
- `title`，生成的 html 文档的标题，配置后还需要在模板中使用模板引擎语法获取该值
- `template`，使用的模板文件，没有指定 loader 时，默认使用`ejs-loader`
- `favicon`，可能由于缓存不显示，需要强制刷新
- `minify`，配置压缩参数

```shell
$ yarn add html-webpack-plugin -D
```

```js
// webpack.config.json
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      template: 'public/index.html',
    }),
  ],
}
```

htmlwebpackplugin 的配置项可以灵活用于各项定制化的配置，如主题配置等等

在模板中可以直接引用的变量包含：

- htmlWebpackPlugin 读取指定给该插件的数据
  - htmlWebpackPlugin.options
  - htmlWebpackPlugin.tags
    - headTags
    - bodyTags
  - htmlWebpackPlugin.files 可以通过此变量直接引用编译过程中使用的文件
    - publicPath 、 js 、....
- webpackConfig 可以通过此变量直接读取 webpack 的配置
- compilation 可以通过此变量直接读取 webpack 的 Compilation Object

#### 2. HotModuleReplacement

HMR 允许我们在修改组件代码后，自动刷新实时预览后的结果，

启用 HMR 需要：

- 更新 webpack-dev-server 的配置，添加 `hot`选项的配置
- 启用 webpack 内置的 HMR 插件
- 在 JS 代码中使用 webpack 提供的 API (`module.hot`)才能实现热加载

```js
// webpack.config.js
const webpack = require('webpack')

module.exports = {
  devServer: {
+    hot: true
  },
  plugins: [
+    new webpack.NamedModulesPlugin(),
+    new webpack.HotModuleReplacementPlugin()
  ]
}


// index.js
import Greeter from './Greeter'
ReactDom.render(<Greeter />, document.getElementById('root'))

if (module.hot) {
  module.hot.accept(Greeter, function() {
    console.log('Accepting the updated Greeter module....')
    ReactDom.render(<Greeter />, document.getElementById('root'))
  })
}
```

进行如上配置后，修改源代码，可以发现浏览器不再刷新，当然 Greeter 更新时会自动重新渲染组件，此时组件内部 state 会丢失，但是保存在像 Redux store 等外部数据容器中的状态则可以保持；若需要保持组件的内部状态，则可以使用 `react-hot-loader`

> ​ todo: 使用 react-hot-loader

#### 3. CopyWebpackPlugin

功能： 将文件或者文件夹拷贝到构建的输出目录

#### 4. CleanWebpackPlugin

功能：在 build 之前自动清空存放 build 文件目录

使用：仅需安装依赖然后在 配置文件的`plugins`中添加一个实例即可

#### 5. mini-css-extract-plugin

针对每一个包含 `css` 的 `js` 文件，将其中的`css`单独抽离到一个文件中，推荐与`css-loader`一起使用

使用：

- 安装依赖
- 在`plugins` 中 新增一个实例
- 将所使用的`css-loader`替换为 `MiniCssExtractPlugin.loader`

`MiniCssExtractPlugin.loader`的配置项：

- `publicPath`：指定抽离出来的文件的存放位置，默认是 `webpackOptions.output.publicPath`

- `esModule`：`mini-css-extract-plugin`默认使用`commonJS`语法生成 JS 模块，将此项设置为`true`则是使用`ES module`语法
- `hmr`：该插件支持在开发模式下对真正的 css 文件进行热重载，在`mode = development`时设置为`true`，用于在开发模式时开启`HMR`

- `reloadAll`：`hmr`不好使时，将其设置为 `true`以强制重载

默认情况此插件只能在`mode = production`时使用

#### 6. terser-webpack-plugin

功能：用于`JS` 文件的压缩

- 注意：`UglifyjsWebpackPlugin` 也是 js 代码压缩插件，但是已经被弃用

使用：

- 安装依赖，但是 webpack 的依赖项已经安装此模块，可以再次手动安装，方便维护
- 在`webpackOptions.optimization.minimizer`数组中，增加一个实例，传递配置项给构造函数

配置项：

- `test`： 所需要处理的文件类型
- `include`： 一定会处理的文件
- `exclude`: 需要屏蔽的文件
- `chunkFilter`： 过滤哪些模块需要压缩，默认所有都需要
- `cache`： 使能缓存，缓存位置为`./node_modules/.cache/terser-webpack-plugin`，目前不适配于 webpack5
- `parallel`：多线程并行处理提高构建速度，设置为 `Number`类型时表示线程数量
- `sourceMap`
- `minify`:

- `terserOptions`: 压缩的[配置项](https://github.com/terser/terser#minify-options)

#### 7. optimize-css-assets-webpack-plugin

功能：用于`CSS` 文件的压缩，默认使用预处理器 `cssnano`，也可以自己制定想要使用的预处理器

将 `OptimizeCssPlugin` 直接配置在 `plugins` 里面，那么 `js` 和 `css` 都能够正常压缩，如果你将这个配置在 `optimization`，那么需要再配置一下 `js` 的压缩

#### 8. DefinePlugin

功能： 用于创建一个在**编译**时可以配置的全局变量，对于开发模式及发布模式的构建需要不同的行为十分有用

使用：

- 是`webpack`内置插件，不需要安装

因为这个插件直接执行文本替换，给定的值必须包含字符串本身内的**实际引号**

#### 9. EnvironmentPlugin

功能：`EnvironmentPlugin` 是一个通过 [`DefinePlugin`](https://www.webpackjs.com/plugins/define-plugin) 来设置 [`process.env`](https://nodejs.org/api/process.html#process_process_env) 环境变量的快捷方式。

#### 10. InterpolateHtmlPlugin

功能：`create-react-app`中使用的插件，使用此插件可以在`HTML模板文件`中使用`%var%`来读取变量

#### 11. webpack-bundle-analyzer

功能：使用可视化来分析代码分割，使用 webpack 打包代码后默认会自动在 `http://127.0.0.1:8888`页面显示分析图

使用：

- 安装依赖
- `webpackOptions.plugins`中新增一个实例

#### 12. IgnorePlugin

功能：webpack 的内置插件，用来忽略第三方包指定目录

如打包时只打包核心功能，对于国际化等内容通过手动引入，减小 bundle 文件体积

## webpack 其他

- `webpack watch+nodemon`支持 SSR 热调试
- webpack4 默认支持 Tree-Shaking，
  - 条件： 生产模式下，采用 ES6 的`import`语法进行模块导入(注意动态导入无法做 tree-shaking)
