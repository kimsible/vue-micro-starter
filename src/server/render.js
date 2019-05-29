import { readFileSync } from 'fs'
import { createBundleRenderer } from 'vue-server-renderer'

const dist = process.env.CWD || process.cwd()
const serverBundle = JSON.parse(readFileSync(dist + '/vue-ssr-server-bundle.json'))
const clientManifest = JSON.parse(readFileSync(dist + '/vue-ssr-client-manifest.json'))
const template = readFileSync(dist + '/index.html', 'utf8')
const renderer = createBundleRenderer(serverBundle, {
  clientManifest,
  template,
  runInNewContext: false
})

export default async url => {
  const context = { url }
  const html = await renderer.renderToString(context)
  return { html, HTTPStatus: context.HTTPStatus }
}
