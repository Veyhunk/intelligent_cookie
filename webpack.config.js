const path = require("path");

module.exports = {
  entry: "./src/vue-intelligent-cookie.js", //入口文件
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "min.js", //打包后输出的文件名字
    libraryTarget: "umd",
    // 　libraryTarget：为了支持多种使用场景，我们需要选择合适的打包格式。libraryTarget 属性。这是可以控制 library 如何以不同方式暴露的选项。
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader", //babel的相关配置在.babelrc文件里
      
        options: {
          presets: ['@babel/preset-env']
        }
      }
    ]
  },
  optimization: {
    minimize: true
  }
};