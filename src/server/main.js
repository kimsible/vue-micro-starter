import { createServer } from 'http'
import body from './body'
import mail, { createTransport } from './mail'
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
    if (method === 'POST') {
      try {
        const { replyTo, subject, text, ...rest } = await body(req)
        if (!replyTo || !subject || !text || Object.keys(rest).length) {
          throw new ReferenceError('Unexpected request body arguments')
        }
        mail({ replyTo, subject, text }).catch(err => process.stdout.write(err))
        res.end()
      } catch (err) {
        res.writeHead(400).end(`${err.constructor.name}: ${err.message}`)
      }
      return
    }
    if (method !== 'GET') {
      res.writeHead(405).end('Method Not Allowed')
      return
    }
    try {
      const file = await open(req).catch(() => {}) // let the renderer handle errors
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
      process.stdout.write(`Error 500 on URL: ${req.url}\n${err}\n`)
    }
  }).listen(process.env.PORT, () => {
    process.stdout.write(`Server listening on port ${server.address().port}\n`)
  })
}
