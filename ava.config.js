export default {
  require: [
    'esm'
  ],
  babel: false,
  compileEnhancements: false,
  failFast: false,
  failWithoutAssertions: false,
  helpers: [
    'test/helpers/**/*'
  ],
  files: [
    'test/**/*',
    '!test/fixtures/**/*'
  ],
  sources: [
    'src/**/*'
  ]
}
