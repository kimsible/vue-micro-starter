import test from 'ava'
import { resolve } from 'path'
import render, { createRenderer } from '../render'

test('render', renderTest, '/404.html')

async function renderTest (t, input) {
  await createRenderer(resolve(__dirname, '../../../test/fixtures'))
  const { html, HTTPStatus } = await render({ url: input })
  t.is(HTTPStatus, 404)
  t.regex(html, new RegExp(input))
}
