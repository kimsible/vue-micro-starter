import { promises as fs } from 'fs'
import { createBundleRenderer } from 'vue-server-renderer'

let renderer

export default async ({ url }) => {
  const context = { url }
  const html = await renderer.renderToString(context)
  return { html, HTTPStatus: context.HTTPStatus }
}

export async function createRenderer (cwd) {
  const files = [
    fs.readFile(cwd + '/vue-ssr-server-bundle.json').then(data => JSON.parse(data)),
    fs.readFile(cwd + '/vue-ssr-client-manifest.json').then(data => JSON.parse(data)),
    fs.readFile(cwd + '/index.html', 'utf8')
  ]

  const [serverBundle, clientManifest, template] = await Promise.all(files)

  renderer = createBundleRenderer(serverBundle, {
    clientManifest,
    template,
    runInNewContext: false
  })
}
