const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const nodeExternals = require('webpack-node-externals')
const EndWebpackPlugin = require('end-webpack-plugin')

const { WEBPACK_TARGET, NODE_MAIN, NODE_ENV } = process.env

let configureWebpack

if (WEBPACK_TARGET === 'web') {
  configureWebpack = {
    entry: './src/entry-client',
    target: 'web',
    node: false,
    plugins: [
      new VueSSRClientPlugin()
    ]
  }
} else if (WEBPACK_TARGET === 'node') {
  configureWebpack = {
    entry: './src/entry-server',
    target: 'node',
    plugins: [
      new VueSSRServerPlugin()
    ],
    externals: nodeExternals({
      whitelist: /\.css$/
    }),
    output: {
      libraryTarget: 'commonjs2'
    }
  }

  if (NODE_MAIN) {
    configureWebpack = {
      ...configureWebpack,
      devtool: false,
      entry: './src/server',
      output: {
        filename: 'server.js'
      },
      plugins: [
        new EndWebpackPlugin(() => {
          const { dependencies } = require('./package.json')
          require('fs').writeFileSync('./dist/package.json', JSON.stringify({ dependencies, main: 'server' }))
        })
      ]
    }
  }
}

const chainWebpack = config => {
  config.module
    .rule('vue')
    .use('vue-loader')
    .tap(options => ({
      ...options,
      optimizeSSR: false
    }))

  if (WEBPACK_TARGET === 'web') {
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
  }

  if (NODE_MAIN) {
    config.plugins.delete('define')
  }
}

module.exports = {
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  },
  css: {
    extract: NODE_ENV === 'production'
  },
  configureWebpack: {
    ...configureWebpack,
    optimization: {
      splitChunks: undefined
    }
  },
  chainWebpack
}
