import { createServer } from 'http'
import open, { createStatic } from './open'
import render, { createRenderer } from './render'

const { PORT } = process.env
if (!PORT) {
  process.stdout.write('Error: undefined environment variable PORT')
  process.exit()
}

run()

async function run () {
  await createRenderer(process.cwd())
  createStatic(process.cwd())

  createServer(async (req, res) => {
    const { url, method } = req
    if (!['GET'].includes(method)) {
      res.writeHead(405).end('Method Not Allowed')
      return
    }
    try {
      const file = await open(url).catch(() => {}) // let the renderer handle errors
      if (file) {
        const { data, contentType } = file
        res.writeHead(200, { contentType }).end(data)
        return
      }
      const { html, HTTPStatus } = await render(req)
      const contentType = 'text/html; charset=UTF-8'
      res.writeHead(HTTPStatus || 200, { contentType }).end(html)
    } catch (err) {
      res.writeHead(500).end('Internal Server Error')
      process.stdout.write(`Error: ${req.url}`)
      process.stdout.write(err)
    }
  }).listen(PORT, () => {
    process.stdout.write(`Server listening on port ${PORT}`)
  })
}
