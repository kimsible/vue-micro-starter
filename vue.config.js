const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const nodeExternals = require('webpack-node-externals')
const EndWebpackPlugin = require('end-webpack-plugin')
const { DefinePlugin } = require('webpack')

const { NODE_ENV } = process.env

module.exports = {
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  },
  css: {
    extract: NODE_ENV === 'production'
  },
  chainWebpack: config => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap(options => ({
        ...options,
        optimizeSSR: false
      }))

    config
      .plugin('html')
      .tap(args => {
        args[0].template = './src/template.html'
        if (NODE_ENV === 'production') {
          args[0].minify = {
            collapseWhitespace: true,
            removeComments: false, // do not remove <!--vue-ssr-outlet-->
            removeRedundantAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            useShortDoctype: true
          }
        }
        return args
      })
  },
  pluginOptions: {
    configureMultiCompilerWebpack: config => {
      const serverRunConfig = {
        ...config,
        entry: './src/server',
        target: 'node',
        plugins: [
          ...config.plugins.filter(plugin => !(plugin instanceof DefinePlugin)),
          new EndWebpackPlugin(() => {
            const { engines, dependencies } = require('./package.json')
            require('fs').writeFileSync('./dist/package.json', JSON.stringify({ engines, dependencies, main: 'server' }))
          })
        ],
        optimization: {
          ...config.optimization,
          splitChunks: undefined
        },
        externals: nodeExternals({
          whitelist: /\.css$/
        }),
        output: {
          ...config.output,
          libraryTarget: 'commonjs2',
          filename: 'server.js'
        },
        devtool: false
      }

      const serverConfig = {
        ...config,
        entry: './src/entry-server',
        target: 'node',
        plugins: [
          ...config.plugins,
          new VueSSRServerPlugin()
        ],
        optimization: {
          ...config.optimization,
          splitChunks: undefined
        },
        externals: nodeExternals({
          whitelist: /\.css$/
        }),
        output: {
          ...config.output,
          libraryTarget: 'commonjs2'
        }
      }

      const clientConfig = {
        ...config,
        entry: './src/entry-client',
        target: 'web',
        plugins: [
          ...config.plugins,
          new VueSSRClientPlugin()
        ],
        optimization: {
          ...config.optimization,
          splitChunks: undefined
        },
        node: false
      }
      return [serverRunConfig, serverConfig, clientConfig]
    }
  }
}
