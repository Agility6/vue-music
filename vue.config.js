module.exports = {
  lintOnSave: false,
  configureWebpack: {
    // 配置路径
    resolve: {
      alias: {
        'common': '@/common'
      }
    },
    devServer: {

      proxy: {
        '/api': {
          target: 'https://c.y.qq.com',
          pathRewrite: {'^/api':''},
          // ws: true,
          changeOrigin: true,
          headers: {
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com'
          }
        }
      }
    }
  },
}
