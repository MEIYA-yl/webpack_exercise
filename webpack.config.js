const path = require("path"); // node 下的一个包，控制路径相关模块
const HtmlWebPackPlugin = require("html-webpack-plugin");
const { DefinePlugin } = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "development",
  // 入口文件可以写相对路径
  entry: "./src/main.js",
  devtool: "source-map", // 默认为：eval
  target: "web", // 开发环境下，关闭 .browserslistrc
  // 出口文件必须写绝对路径
  output: {
    filename: "js/index.js",
    path: path.resolve(__dirname, "dist"), // 指定打包后资源位置
    publicPath: "/dist",
  },
  devServer: {
    open: false,
    port: 4000,
    hot: true,
    hotOnly: true,
    compress: true, // 是否开启 gzip 压缩
    publicPath: "/dist",
    contentBase: path.resolve(__dirname, "public"), // 对于直接访问打包后的资源，设置该参数的意义不大
    watchContentBase: true, // 监测 contentBase 指向文件是否发生了改变， 默认：false
    historyApiFallback: true, // 当页面产生404响应时，将页面重定向到index.html
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
  ],
};
