const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,

  devServer: {
    proxy: {
      "/loginapi": {
        // target: "http://codercba.com:1888/airbnb/api",
        target: "http://localhost:8088",
        changeOrigin: true,
        ws: true,
        secure: false,
        pathRewrite: {
          "^/loginapi": ""
        }
      },
      "/api": {
        // target: "http://codercba.com:1888/airbnb/api",
        target: "http://localhost:8080",
        changeOrigin: true,
        ws: true,
        secure: false,
        pathRewrite: {
          "^/api": ""
        }
      },
    }
  }
})
