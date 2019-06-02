const { basename, extname } = require('path')
const { exec } = require('child_process')

const files = process.argv.splice(2).reduce((acc, value) => ([
  ...acc,
  '-m',
  basename(value, extname(value)) + '*'
]), [])

process.stdout.write(files.join(' ') + '\n')
exec(`ava ${files.join(' ')}`, (err, stdout) => {
  if (stdout) {
    process.stdout.write(stdout + '\n')
  }
  if (err) {
    if (!stdout.match(/✖ Couldn't find any matching tests/)) {
      process.exit(1)
    }
  }
})
