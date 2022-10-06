# WebPack

## webpack 基础配置

1. npx webpack --entry ./src/filename.js // 修改默认入口文件路径为
2. npx webpack --output-path ./build // 修改默认出口文件路径为
3. "build":"webpack --config filename.config.js" // 自定义 webpack 配置文件为 filename.config.js

## webpack loader

#### `css-loader 的使用`

- 默认情况下，让 webpack 可以识别 css 语法；

1. `import 'css-loader! ../css/style.css`

   - 行内 loader 的使用方式 'css-loader! ...'

2. 配置文件中使用 loader：

   ```js
   // 方式一：
   		{
   			test: /\.css$/,
   			use:[
   				{
   					loader: 'css-loader',
   					options: [],  // 为loader配置参数，webpack5中query参数被合并到options中
   				}
   			]
   		}
   
   	// 方式二：目标文件只使用一个loader且不需要额外的配置
   		{
   			test: /\.css/,
   			loader: 'css-loader'
   		}
   
   	// 方式三：目标文件会用到多个loader但loader不需要额外的配置
   		{
   			test: /\.css/,
   			loader: ['css-loader']
   		}
   ```

#### `less-loader 的使用`

1. less-loader 的使用建立在 less 环境上；
2. less-loader 只是解析了 less 文件，需要搭配其他 loader 的使用；

#### `browserslitrc 工作流程`

- 实现兼容，实现不同浏览器平台的版本上的使用

1. package.json 文件中使用：

   ```js
   	"browserslitrc":{
   		// default
   		">1%", // 市场占有率 大于1%
   		"last 2 version",  // 最近的两个版本
   		"not dead", // 12 个月内未进行更新的将被定义为 淘汰
   	}
   ```

2. 在根目录中添加 .browserslitrc 配置文件；

#### `postcss 工作流程`

- 主要是做 css 的兼容性处理，postcss 是什么？帮助我们通过 JavaScript 转换样式；

- 环境：`pnpm i postcss -D` ，通过`pnpm i postcss-cli -D` 来在终端中使用 postcss 命令；
- 安装`postcss loader` 通过配置文件，简化 postcss 依赖的使用步骤；

1. 配置文件中的使用方式：

   ```js
   {
     loader: "postcss-loader",
       options: {
         postcssOptions: {
           plugins: [
             "postcss-preset-env",
             /*require("postcss-preset-env"),*/
           ],
         },
       },
   },
   ```

2. 配置单独的 postcss 文件：postcss.config.js ，减少文件冗余；说明文档：https://github.com/postcss/postcss/blob/HEAD/docs/README-cn.md

- 插件：

  - 常用插件集合：`postcss-reset-env`

  - 搭配 `pnpm i autoprefixer -D` （提供厂商前缀）来使用；

  - 搭配 `file-loader` 来使用，1. 当我们将图片作为模块来使用时，装换成一个 js 可以识别的内容；2. 将指定的二进制文件拷贝到指定的目录，没有指定将拷贝到打包文件下；

    1. 由于图片返回的是一个对象，所以需要进行获取：

       - 方式一：file-loader 默认返回一个对象，通过 default 这个键来修正参数；

       - 方式二：配置 loader 参数：

         ```js
         {
           loader: "postcss-loader",
             options: {
               esModule: false, // 不转为 esmodule 进行处理
             },
         },
         ```

       - 方式三：采用 ejs 的模块化导入方式

       - 方式四：采用 background:url() 的方式，但是这里会出现方式一的问题（不是 file-loader）,由于 postcss-loader 是可以解析 css 文件的，但是在设置路径的时候拿到的是一个对象，它默认以 cjs 模块化语法导入；

    2. 自定义输出文件地址、文件名：

       ```js
       {
         test: /\.(png|svg|git|jpe?g)$/,
           use: [
             {
               loader: "file-loader",
               options: {
                 name: "img/[name].[hash:6].[ext]", // 同过hash值防止文件命名重合
                 // outputPath: "img", // 定义文件输出文件夹
               },
             },
           ],
       },
       ```

       - [ext]：文件扩展名

       - [name]：文件名

       - [hash]：文件内容

       - [contentHash]：等同于 [hash]

       - [hash]：限制 hash 值的长度 （没有对输出文件进行配置时，输出的文件名即文件内容 hsah 所组成的文件名）

       - [path]：

  - 搭配 `url-loader` 实现类似于 file-loader 的功能，但是它不会产生图片文件，而是将图片文件以 base64 uri 的方式加载到代码中；

    ```js
    {
      test: /\.(png|svg|git|jpe?g)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              name: "img/[name].[hash:6].[ext]",
              limit: 25 * 1024, // 限制需要缓存的图片范围（小于缓存）
            },
          },
        ],
    },
    ```

    1. 减少了请求次数，首屏加载效率

    2. url-loader 内部可以调用 file-loader

    3. 可以通过 limit 参数限制是否对图片资源进行缓存，且对缓存范围进行限制

  - `asset` **资源类型模块，替代了 url-loader 和 file-loder，同时在最新的 webpack5 中以被内置。**

    1. asset/resource - file-loader

       ```js
       output: { assetModuleFilename: "img/[name].[hash:4][ext]", }// 指定 asset 所指定的资源，一般不会这么做，这将导致所有不同类型的文件都被打包到同一文件地址中

       // 处理图片类型资源
       {
         test: /\.(png|svg|gif|jpe?g)$/,
           type: "asset/resource",
             // 对文件单独构建
             generator: {
               filename: "img/[name].[hash:4][ext]",
             },
       },

       // 处理字体图标
       {
         test: /\.(ttf|woff2?)$/,
           type: "asset/resource",
             generator: {
               filename: "font/[name].[hash.3][ext]",
             },
       },
       ```

    2. asset/inline - url-loader

       ```js
       {
         test: /\.(png|svg|gif|jpe?g)$/,
           //type: "asset/inline",
           type: "asset"
             // 对文件单独构建
             generator: {
               filename: "img/[name].[hash:4][ext]",
             },
               // 对文件进行解析
               parser: {
                 dateUrlCondition: {
                   maxSize: 10 * 1024,
                 },
               },
       },
       ```

    3. asset/source - raw-loader

    4. ...

- postcss 的使用：

  - `npx postcss -o file_name ./path` -o 即 output 输出，将指定的文件输出到 **file_name** 文件夹下；
  - `npx postcss --use autoprefixer -o file_name ./path` 为 **file_name** 文件搭配厂商前缀；

## webpack plugin

**插件的本质是一个类**

#### 三方插件：

1. `pnpm i clean-webpack-plugin -D` ：清除打包后的目录；

2. `pnpm i @babel/core D`：Babel 核心模块包；

   - 构建 Babel 环境依赖：`pnpm i @babel/preset-env -D` 可以处理绝大多数的 js 语法处理；

   1. 在使用 Babel 时常见的问题：

      - 在使用`@babel/preset-env`时，因为兼容的问题（在 4 版本中不会，在 5 新的版本中需要按需导入）会出现部分语法的未转义现象，此时进行按需引入：

        ```js
        // babel.config.js
        presets: [
          [
            "@babel/preset-env",
            {
              /**
              	false: 不对当前的JS处理做 polyfill 的填充
              	usage: 依据用户源代码当中所使用到的新语法进行填充
              	entry: 依据当前筛选出来的浏览器决定填充什么
              		在使用 entry 选项时，需要在入口文件进行引入所需要的polyfill模块
              		import 'core-js/stable'  // 做语法功能
              		import 'regenerator-runtime/runtime'  // 做新语法规范：symbol 等
              */
              useBuiltIns: "entry", // 为所要适配的低版本浏览器支持当前代码中js的新语法
              corejs: 3, // 由于这种配置方式对 core.js 有版本上的要求，但是Babel默认使用2的版本所以需要指定到高版本来使用
            },
          ],
        ];
        ```
   
3. `copy-webpack-plugin`：将 public 本地静态资源文件拷贝到webpack打包之后的静态资源目录；

#### 内置插件：

1. `const { DefinePlugin } = require("webpack");` ：自定义 HTML 模板内容;
