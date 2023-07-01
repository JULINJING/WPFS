const { defineConfig } = require('@vue/cli-service')
// vue.config.js 添加下面配置 
const CopyWebpackPlugin = require('copy-webpack-plugin')
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
const webpack = require('webpack')
const path = require('path')

module.exports = defineConfig({
  publicPath: '/',
  assetsDir: 'static',
  outputDir: 'dist',
  transpileDependencies: true,
  lintOnSave: false,
  productionSourceMap: false, // 不需要生产环境的 source map
  filenameHashing: true, // 文件名哈希
  runtimeCompiler: true,
  configureWebpack: (config) => {
    if (process.env.VUE_APP_MARS3D_SOURCE === 'module') {
      const cesiumSourcePath = 'node_modules/mars3d-cesium/Build/Cesium/' // cesium库安装目录
      const cesiumRunPath = './mars3d-cesium/' // cesium运行时路径

      let plugins = [
        // 标识cesium资源所在的主目录，cesium内部资源加载、多线程等处理时需要用到
        new webpack.DefinePlugin({
          CESIUM_BASE_URL: JSON.stringify(path.join(config.output.publicPath, cesiumRunPath))
        }),
        // Cesium相关资源目录需要拷贝到系统目录下面（部分CopyWebpackPlugin版本的语法可能没有patterns）
        new CopyWebpackPlugin({
          patterns: [
            { from: path.join(cesiumSourcePath, 'Workers'), to: path.join(config.output.path, cesiumRunPath, 'Workers') },
            { from: path.join(cesiumSourcePath, 'Assets'), to: path.join(config.output.path, cesiumRunPath, 'Assets') },
            { from: path.join(cesiumSourcePath, 'ThirdParty'), to: path.join(config.output.path, cesiumRunPath, 'ThirdParty') },
            { from: path.join(cesiumSourcePath, 'Widgets'), to: path.join(config.output.path, cesiumRunPath, 'Widgets') }
          ]
        }),
        new NodePolyfillPlugin()
      ]
      return {
        module: { unknownContextCritical: false }, // 配置加载的模块类型，cesium时必须配置
        plugins: plugins
      }
    } else {
      return {
        externals: { 'mars3d-cesium': 'Cesium' } //排除使用 mars3d-cesium
      }
    }
  },
  css: {
    // 启用 CSS modules
    // requireModuleExtension: false,
    // 是否使用css分离插件
    extract: true,
    // 开启 CSS source maps，一般不建议开启
    sourceMap: false,
    // css预设器配置项
    loaderOptions: {
      sass: {
        additionalData: '@import "mars3d-cesium/Build/Cesium/Widgets/widgets.css";',
      },
    },
  }
})
// const { defineConfig } = require('@vue/cli-service')
// module.exports = defineConfig({
//   transpileDependencies: true,
//   lintOnSave: false,
//   runtimeCompiler: true
// })