import test from 'ava'
import { createServer, request } from 'http'
import body from '../body'

test('body -- json object input', bodyTest, JSON.stringify({ name: 'body-name', id: 'body-id' }), { name: 'body-name', id: 'body-id' })
test('body -- json string input', bodyTest, JSON.stringify('bad input'), { message: 'Unexpected non-object parsed body', instanceOf: 'TypeError' })
test('body -- string input', bodyTest, 'string input', { message: 'Unexpected bad json body', instanceOf: 'SyntaxError' })

async function bodyTest (t, input, expected) {
  const server = createServer(async (req, res) => {
    try {
      res.end(JSON.stringify(await body(req)))
    } catch (err) {
      res.end(JSON.stringify({ message: err.message, instanceOf: err.constructor.name }))
    }
  }).listen()

  const res = await new Promise((resolve, reject) => {
    const postData = input
    const req = request({
      port: server.address().port,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, resolve)
    req.on('error', reject)
    req.write(postData)
    req.end()
  })

  const output = await body(res)
  t.deepEqual(output, expected)
}
