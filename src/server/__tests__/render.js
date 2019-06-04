import test from 'ava'
import { resolve } from 'path'
import render from '../render'

const cwd = resolve(process.cwd(), 'test/fixtures')

test('render', testRender, '/404.html')

async function testRender (t, input) {
  const renderHTML = await render(cwd)
  const { html, HTTPStatus } = await renderHTML(input)
  t.is(HTTPStatus, 404)
  t.regex(html, new RegExp(input))
}
