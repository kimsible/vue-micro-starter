import nodemailer from 'nodemailer'
import { hostname } from 'os'

let transporter, user

export default async envelope => transporter.sendMail({ from: user, to: user, ...envelope })

export async function createTransport (smtp) {
  const options = extractOptions(smtp)
  user = options.user
  transporter = nodemailer.createTransport(options.connection)
  await transporter.verify()
  await transporter.sendMail({ from: user, to: `to@${hostname()}.verify` })
}

export function extractOptions (smtp) {
  try {
    const match = smtp.match(/^smtps?:\/\/(.+):/)
    if (match) { // connection url : smtps://user:pass@smtp.example.com
      return {
        user: match[1],
        connection: smtp
      }
    }
    // well-known service url : hotmail://user:pass
    const [ service, auth ] = smtp.split('://')
    const [ user, pass ] = auth.split(':')
    return {
      user,
      connection: {
        service,
        auth: { user, pass }
      }
    }
  } catch {
    throw new SyntaxError(`Unexpected bad SMTP connection url "${smtp}"`)
  }
}
