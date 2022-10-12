# WebPack

## 如何理解webpack底层逻辑：

- webpack通常可以分为流程类或工具类，流程类配置项通常会直接影响webpack打包的编译的规则，涵盖整个项目的生命周期；而工具类相对比较独立，通常用于在编译主流程之外提供额外的工程化能力，基本上一种配置项解决一种工程化问题；

## webpack 基础配置

1. npx webpack --entry ./src/filename.js // 修改默认入口文件路径为
2. npx webpack --output-path ./build // 修改默认出口文件路径为
3. "build":"webpack --config filename.config.js" // 自定义 webpack 配置文件为 filename.config.js
4. output 中的path：
   - publicPath: 打包后 index.html 的内部引用路径。
     - publicPath 参数：空字符串，相当于 / 会被服务器自动拼接到路径当中。如果想手动写入，则需要写成 './' 的方式，以相对路径的方式访问；
     - 打包后的访问路劲以 域名 + publicPath + filename 进行拼接；
5. 自定义指令，在通过tsc对ts文件进行语法检查时，建议写为 "tsc --noEmit" ，（--noEmit：对文件存在语法或其他某种错误执行指令后，不产生新文件）对文件在打包之前实现语法的校验工作；对ts来说：Babel-loader 做polifile填充，ts-loader 做语法校验；

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

#### `style-loader 与 mini-css-extract-plugin`

1. style-loader: 内嵌的style无法并行加载，所以主要用于开发环境，将CSS抽取注入到Html的 <style> 标签当中，内嵌的CSS无法进行并行加载，会造成性能上的缺陷，从而降低页面性能；
2. mini-css-extract-plugin: 主要用于生产环境，用于将CSS抽取成单个文件，然后以<link>的形式引入面页，<link>是并行加载资源，这个插件必须要与html-webpack-plugin插件同时使用才能生效；

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

- 主要是做 css 的兼容性处理，它于css的关系类似于Babel和JavaScript的关系；

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

3. `copy-webpack-plugin`：将 public 本地静态资源文件（本身资源不需要打包）拷贝到webpack打包之后的静态资源目录；

   1. 使用方式及常见问题：

      ```js
      new CopyWebpackPlugin({
        patterns: [
          {
            from: "public",
            globOptions: {
              ignore: ["**/index.html"], // **/ 代表从当前 public 指定的目录下查找文件
            },
          },
        ],
      }),
        
       /**
       		一般不会指定复制到某个地址：to: "./xxx"，不指定时会被默认指向到输出目录下，避免了输出目录地址和指定地址的修改；
       */
      ```

4. `webpack-dev-server` ：监测**本地**数据是否发生了改变并主动更新数据

   1. 以下两种方式都会在文件发生变化后对源代码进行整体的重新编译，对文件再次进行读写不能进行局部编译，存在不必要消耗；

      - 在 package.json 文件中开启 **watch** 属性，默认为false；

      - 在 config 配置文件中 build 命令中添加 --watch 命令；

   2. 所有和插件相关的配置都可以通过 cinfig 文件中配置，写在 `devServer: {}` 选项中；

      - 另外在使用热更新时，需要在入口文件中特别判断：

      ```js
      // webpack.config.js
      // 注意： devServer 在生产环境用不上
      devServer:　{
      	// 指定开启端口号，默认：8080
        port: 3300,
        // 是否在数据发生变化后自动开启新窗口
        open: false,
        // source-map 类型设置：默认为eval，"source-map" 对错误信息进行精确映射，
        devtool: 'cheap-module-source-map', // 精确到行且提供未转义前的代码
        // 开启热更新
      	hot: true,
        // 只对发生变化的数据进行热更新，如果不开启hotOnly当我们某一个组件发生数据书写错误而再次修正时，会导致页面全部内容的刷新，从而丢失其他组件已经编辑后的信息
        hotOnly: true,
        /**
        	指定本地服务所在的目录
        	当指定一个路径时，由于插件监测的时本地数据，所以同样需要修改output中的publicPath路径为相同地址，以便在打包后以正确`	的路径寻找打包资源；
        */
        publicPath: '', // 当为空字符串时，效果等同于output中的publicPath，会被自动补全为 /
        /**
        	对于直接访问打包后的资源，该属性存在的意义不大
      		PC：当index.js引用的文件并未被进行打包，产出文件找不到目标地址时使用；
        */
        static: '', // 绝对路径
        watchContentBase: true, // 监测 contentBase 指向文件是否发生了改变， 默认：false
        historyApiFallback: true, // 当页面产生404响应时，将页面重定向到index.html
      }
      
      // 入口文件：index.js
      /**
      	.accept() 接收两个参数：
      	参数一：以数组的形式接收要使用热更新的模块；
      	参数二：触发后执行的回调
      */
      if (module.hot){
      	module.hot.accept(['./xxxx','./yyyy'], ( )=>{
          
        })
      }
      ```
      
      

5. `webpack-dev-middleware` ：自定义服务端启动命令，自由度更高。需要搭配 **express** 进行使用；

#### 内置插件：

1. `const { DefinePlugin } = require("webpack");` ：自定义 HTML 模板内容;

## 其他配置：优化

### 代码拆分

1. 多入口多打包文件；

2. 将模块依赖单独打包: 多入口的拆包方式

   ```js
   // webpack.config.js
   
   entry: {
     main: { import: './src/main.js', dependOn: 'lodash' },
     lodash: 'lodash',
       
     // 当依赖了多个包时：可以将需拆分的模块写成数组引入
     index: { import: './src/index.js', dependOn: 'shared' }
     shared: ['lodash', 'jquery']
   }
   ```

3. 通过 Optimization 进行精细优化：单入口的拆包方式 https://webpack.docschina.org/configuration/optimization/#optimizationsplitchunks

   ```js
   entry: {
     index: './src/index.js'
   }
   
   optimization: {
     minimizer: [
       new TerserPlugin ({
         extractComments: false,
       }),
     ],
     // 配置 splitChunks 进行精细化自定以设置
     splitCunks: {
   		chunks: 'all', // 默认 async异步打包（对于同步导入的不会被识别，则不会产生拆包），initial 同步、all全部
     	minSize: 20000, // 默认值: 20000(约等于20kb)，如果被拆分的包并未达到设置的大小，则并不会被拆出来而是依旧被包含在出口文件内
    		maxSize: 20000, // 当拆包文件大于 20kb 时，按照minSize规定大小拆分
       // minChunks: 1, // 当目标依赖包需要被拆分成包，该文件必须被引用过 1 次，一般不会和minSize、maxSize同时使用
       
      // 其他配置具体详细信息：https://webpack.docschina.org/plugins/split-chunks-plugin/
     }
   }
   ```

###　import动态导入

- `import ()` 动态导入相当于配置了splitCunks chunks 为asycn 做了异步打包

- 常用参数，其他配置详细信息： https://webpack.docschina.org/configuration/optimization/

  ```js
  optimization: {
    chunkIds: 'named', 
  }
  
  'natural' : 当前打包产物名称按照自然数进行编号排序，如果某个文档当前次不再被依赖那么重新打包时序号都会变。这将导致会被重新缓存，所以不利于浏览器的缓存机制，所以我们一般不去使用
  'named'  :  按照文件模块名称进行打包，在开发环境下介意使用，可以清除知道来源
  ```

  

### runtimeChunk 优化配置

- 其他配置详细信息：https://webpack.docschina.org/configuration/optimization/#optimizationruntimechunk

  ```js
  optimization: {
    runtimeChunk: true, // 会将运行、模块加载和解析的部分拆分出来。该部分内容所包含的是类似于清单性的信息，记录了当前模块如何b被导入、导出的一些信息，便于浏览器做长期的缓存。
  }
  
  // 当在多入口打包场景中：配置了多入口，并对统一文件进行了引用时，使用'true'会为每一个入口配置一份信息，使用'single'只会打包一份出来。
  ```

  

###　术语：

　1. chunk :  依赖
　1. bundle  :  html 可以直接导入的资源
