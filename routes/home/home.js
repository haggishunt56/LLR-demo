const queries = require('../../app/db/queries')

module.exports = function (router) {
  // render home page
  router.get('/home', (req, res) => {
    queries
      .getTrendingCategories()
      .then(trending => {
        res.render('home.html', { trending })
      })
  })
}
