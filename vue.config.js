const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const nodeExternals = require('webpack-node-externals')
const EndWebpackPlugin = require('end-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

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
    configureMultiCompilerWebpack: [{
      entry: './src/entry-server',
      target: 'node',
      plugins: [
        new VueSSRServerPlugin(),
        new CopyWebpackPlugin([
          {
            from: '*.js',
            to: 'server/',
            context: 'src/server'
          }
        ]),
        new EndWebpackPlugin(() => {
          const { engines, dependencies } = require('./package.json')
          require('fs').writeFileSync('./dist/package.json', JSON.stringify({ engines, type: 'module', dependencies, main: 'server' }))
        })
      ],
      optimization: {
        splitChunks: undefined
      },
      externals: nodeExternals({
        whitelist: /\.css$/
      }),
      output: {
        libraryTarget: 'commonjs2'
      }
    }, {
      entry: './src/entry-client',
      target: 'web',
      plugins: [
        new VueSSRClientPlugin()
      ],
      optimization: {
        splitChunks: undefined
      },
      node: false
    }]
  }
}
