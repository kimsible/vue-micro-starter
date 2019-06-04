const { basename, extname } = require('path')
const { exec } = require('child_process')

const files = process.argv.splice(2).reduce((acc, value) => ([
  ...acc,
  '-m',
  basename(value, extname(value)) + '*'
]), [])

if (files.length > 0) {
  exec(`ava ${files.join(' ')}`, (err, stdout) => {
    if (stdout) {
      process.stdout.write(stdout + '\n')
    }
    if (err) {
      if (!stdout.match(/✖ Couldn't find any (matching tests|files to test)/)) {
        process.exit(1)
      }
    }
  })
}
