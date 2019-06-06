import { promises } from 'fs'
import { contentType, lookup } from 'mime-types'

let path

export default async ({ url }) => {
  const match = url.match(new RegExp(`^/(css|js|img|favicon|logo)`))
  if (match) {
    const filepath = path + url
    const data = await promises.readFile(filepath)
    return { data, contentType: contentType(lookup(filepath)) }
  }
}

export const createStatic = cwd => { path = cwd }
