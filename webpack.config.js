const path = require("path"); // node 下的一个包，控制路径相关模块
const HtmlWebPackPlugin = require("html-webpack-plugin");
const { DefinePlugin } = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { env } = require("process");

// commonJS语法
// module.exports = {
//   mode: "development", // 开发模式

//   entry: path.join(__dirname, "src", "index.js"), // 打包文件的入口 .join(webpack.config的当前目录, 目标目录, 文件名)

//   output: {
//     path: path.join(__dirname, "dist"), // 文件打包位置
//     filename: "bundle.js", // 打包的文件名
//   }, // 出口文件

//   module: {
//     rules: [
//       {
//         test: /\.js$/, // 规则触发时期
//         loader: "babel-loader", // 通过插件对代码进行编译
//         include: path.join(__dirname, "src"), // 需要处理的文件
//         exclude: /node_modules/, //排除不需要处理的文件
//       },
//     ], // 配置解析模块的规则
//   },

//   plugins: [
//     new HtmlWebPackPlugin({
//       template: path.join(__dirname, "src", "index.html"), // html 打包后的模板文件
//       filename: "index.html", // 打包的文件名
//     }),
//   ], // 实例化插件：使用插件

//   devServer: {
//     port: 8000,
//     static: path.join(__dirname, "dist"), // 静态资源目录
//   },
// };

module.exports = {
  mode: "development",
  devtool: false,
  // 入口文件可以写相对路径
  entry: "./src/main.js",
  // 出口文件必须写绝对路径
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
  },
  // 规则模块
  module: {
    rules: [
      {
        test: /\.css$/, // 一般情况为正则表达式，用于匹配需要处理文件的类型
        use: [
          // loader 的执行顺序是从下往上，从右往左
          "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 1, // 这里数值代表着：当上一个loader执行过后，cssloader 有监测到css文件发生了变化，此时上一个loader又无法再对变更内容做处理，这时这里的数值则代表让上一个loader可以再次处理；
              esModule: false,
            },
          },
          "postcss-loader",
        ], // 告知webpack要使用loader，由于单个文件可能使用多个loader，所以用数组来配置
      },
      {
        test: /\.less$/,
        use: ["style-loader", "css-loader", "postcss-loader", "less-loader"],
      },
      {
        test: /\.(png|svg|gif|jpe?g)$/,
        type: "asset",
        // 对文件单独构建
        generator: {
          filename: "img/[name].[hash:4][ext]",
        },
        // 对文件进行解析
        parser: {
          dataUrlCondition: {
            maxSize: 1 * 1024,
          },
        },
      },
      {
        test: /\.(ttf|woff2?)$/,
        type: "asset/resource",
        generator: {
          filename: "font/[name].[hash.3][ext]",
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/, // 排除不需要处理的文件
        use: ["babel-loader"],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebPackPlugin({
      title: "Vue",
      template: "./public/index.html",
    }),
    new DefinePlugin({
      BASE_URL: '"./"',
    }),
  ],
};
