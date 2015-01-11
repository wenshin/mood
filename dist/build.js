({
  baseUrl: './.tmp',
  optimize: 'uglify2',
  removeCombined: true,
  name: 'mood',
  include: [
    'lib/jquery.core',
    'utils/log', 'utils/chainame', 'utils/helper',
    'utils/processor', 'utils/event', 'utils/tmpl',
    'scope', 'error', 'moattr'
  ],
  out: './build/mood.min.js'
})
