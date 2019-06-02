import test from 'ava'
import { extractOptions } from '../mail'

function extractOptionsTest (t, input, expected) {
  const { user, connection } = extractOptions(input)
  t.is(user, expected.user)
  t.deepEqual(connection, expected.connection)
}

async function extractOptionsErrorTest (t, input, expected) {
  await t.throwsAsync(async () => {
    await extractOptions(input)
  }, { instanceOf: expected.instanceOf, message: expected.message })
}

test('mail - extract smtp url', extractOptionsTest, 'smtps://user:pass@smtp.example.com', {
  user: 'user',
  connection: 'smtps://user:pass@smtp.example.com'
})

test('mail - extract well-know service url', extractOptionsTest, 'hotmail://user:pass', {
  user: 'user',
  connection: {
    service: 'hotmail',
    auth: {
      user: 'user',
      pass: 'pass'
    }
  }
})

test('mail - extract empty smtp url', extractOptionsErrorTest, undefined, {
  message: 'Unexpected bad SMTP connection url "undefined"',
  instanceOf: SyntaxError
})

test('mail - extract bad smtp url', extractOptionsErrorTest, 'hotmail:/user:pass', {
  message: 'Unexpected bad SMTP connection url "hotmail:/user:pass"',
  instanceOf: SyntaxError
})
