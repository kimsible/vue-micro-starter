export default req => new Promise((resolve, reject) => {
  let buffer = ''
  req.setEncoding('utf8')
  req.on('data', chunk => { buffer += chunk })
  req.on('error', reject)
  req.on('end', () => {
    try {
      const body = JSON.parse(buffer.trim())
      if (typeof body !== 'object') {
        reject(new TypeError('Unexpected non-object parsed body'))
        return
      }
      resolve(body)
    } catch (err) {
      err.message = 'Unexpected bad json body'
      reject(err)
    }
  })
})
