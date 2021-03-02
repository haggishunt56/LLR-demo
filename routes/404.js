const queries = require('../app/db/queries')

module.exports = function (router) {
  router.get('/:url', (req, res) => {
    res.render('./404.html')
  })

  router.get('/view/:url', (req, res) => {
    res.render('./404.html')
  })

  router.get('/:url/:url', (req, res) => {
    res.render('./404.html')
  })

  router.get('/view/:url/:url', (req, res) => {
    res.render('./404.html')
  })

  router.get('/:url/:url.:url', (req, res) => {
    res.render('./404.html')
  })

  router.get('/view/:url/:url.:url', (req, res) => {
    res.render('./404.html')
  })
}
