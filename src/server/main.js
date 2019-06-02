import { createServer } from 'http'
import { createTransport } from './mail'
import open, { createStatic } from './open'
import render, { createRenderer } from './render'

run()

async function run () {
  const init = [
    createTransport(process.env.SMTP),
    createRenderer(process.cwd()),
    createStatic(process.cwd())
  ]

  try {
    await Promise.all(init)
  } catch (err) {
    process.stdout.write(err + '\n')
  }

  const server = createServer(async (req, res) => {
    const { method } = req
    try {
      if (method === 'GET') {
        const file = await open(req).catch(() => {}) // let the renderer handle errors
        if (file) {
          const { data, contentType } = file
          res.writeHead(200, { contentType }).end(data)
          return
        }
        const { html, HTTPStatus } = await render(req)
        const contentType = 'text/html; charset=UTF-8'
        res.writeHead(HTTPStatus || 200, { contentType }).end(html)
      } else {
        res.writeHead(405).end('Method Not Allowed')
      }
    } catch (err) {
      res.writeHead(500).end('Internal Server Error')
      process.stdout.write(`Error 500 on URL: ${req.url}\n${err}\n`)
    }
  }).listen(process.env.PORT, () => {
    process.stdout.write(`Server listening on port ${server.address().port}\n`)
  })
}
