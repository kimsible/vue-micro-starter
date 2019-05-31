import { promises as fs } from 'fs'
import { createBundleRenderer } from 'vue-server-renderer'

export default async dist => {
  const files = [
    fs.readFile(dist + '/vue-ssr-server-bundle.json').then(data => JSON.parse(data)),
    fs.readFile(dist + '/vue-ssr-client-manifest.json').then(data => JSON.parse(data)),
    fs.readFile(dist + '/index.html', 'utf8')
  ]

  const [serverBundle, clientManifest, template] = await Promise.all(files)

  const renderer = createBundleRenderer(serverBundle, {
    clientManifest,
    template,
    runInNewContext: false
  })

  return async url => {
    const context = { url }
    const html = await renderer.renderToString(context)
    return { html, HTTPStatus: context.HTTPStatus }
  }
}
