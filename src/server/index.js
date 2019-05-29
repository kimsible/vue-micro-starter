import { createServer } from 'http'
import open from './open'
import render from './render'

const { PORT } = process.env
if (!PORT) {
  console.error('Error: undefined environment variable PORT')
  process.exit()
}

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
    const { html, HTTPStatus } = await render(url)
    const contentType = 'text/html; charset=UTF-8'
    res.writeHead(HTTPStatus || 200, { contentType }).end(html)
  } catch (err) {
    res.writeHead(500).end('Internal Server Error')
    console.error(`Error: ${req.url}`)
    console.error(err)
  }
}).listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
