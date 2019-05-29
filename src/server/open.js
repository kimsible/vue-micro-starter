import { promises } from 'fs'
import { contentType, lookup } from 'mime-types'

const dist = process.env.CWD || process.cwd()

export default async url => {
  const match = url.match(new RegExp(`^/(css|js|img|favicon|logo)`))
  if (match) {
    const path = dist + url
    const data = await promises.readFile(path)
    return { data, contentType: contentType(lookup(path)) }
  }
}
