const webpack = require('webpack')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const { resolve } = require('path')

const cwd = resolve(process.cwd(), 'test/fixtures')

run()

async function run () {
  await Promise.all([buildServer(), buildClient()])
}

function buildClient () {
  const compiler = webpack({
    mode: 'production',
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
    mode: 'production',
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
    compiler.run((err, stats) => {
      if (err) {
        reject(err)
        return
      }
      resolve(stats.toString({ colors: true }))
    })
  })
    .then(info => process.stdout.write(info))
    .catch(err => process.stdout.write(err.stack))
}
