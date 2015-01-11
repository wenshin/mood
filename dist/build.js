({
  baseUrl: './unit',
  dir: './build',
  optimize: 'uglify2',
  removeCombined: true,
  modules: [
    {
      name: 'mood',
      include: [
        'scope', 'error', 'moattr',
        'utils/chainame', 'utils/helper', 'utils/processor',
        'utils/type', 'utils/event', 'utils/log', 'utils/tmpl',
        'lib/jquery.core'
      ]
    }
  ]
})
