import test from 'ava'
import { resolve } from 'path'
import { promises as fs } from 'fs'
import open, { createStatic } from '../open'

test('open', openTest, { url: '/js/main.js', contentType: 'application/javascript' })

async function openTest (t, input) {
  const cwd = resolve(__dirname, '../../../test/fixtures')
  createStatic(cwd)
  const { contentType, data } = await open({ url: input.url })
  t.regex(contentType, new RegExp(input.contentType))
  t.deepEqual(data, await fs.readFile(cwd + input.url))
}
