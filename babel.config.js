/**
	babel 的编译过程：
		1. parse： 通过parse把源码转成抽象语法树
		2. transform：遍历AST 调用各种transform插件树对 AST 惊醒增删改查
		3. generate：把转换后的AST打印成目标代码，并生成sourcemap
*/
module.exports = {
  // persets: 预设 babel 的一系列插件的集合
  presets: [
    [
      "@babel/preset-env",
      {
        useBuiltIns: "entry",
        corejs: 3,
      },
    ],
  ],
};
