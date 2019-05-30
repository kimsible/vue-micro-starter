const webpack = require('webpack')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const { resolve } = require('path')

const cwd = resolve(__dirname, '../fixtures')

run()

async function run () {
  await Promise.all([buildServer(), buildClient()])
}

function buildClient () {
  const compiler = webpack({
    entry: cwd + '/app.js',
    target: 'web',
    externals: ['vue'],
    output: {
      path: cwd
    },
    plugins: [
      new VueSSRClientPlugin()
    ]
  })
  return compile(compiler)
}

function buildServer () {
  const compiler = webpack({
    entry: cwd + '/app.js',
    target: 'node',
    externals: ['vue'],
    output: {
      path: cwd,
      libraryTarget: 'commonjs2'
    },
    plugins: [
      new VueSSRServerPlugin()
    ]
  })
  return compile(compiler)
}

function compile (compiler) {
  return new Promise((resolve, reject) => {
    compiler.run(err => {
      if (err) {
        reject(err)
        return
      }
      resolve()
    })
  })
}
