const queries = require('../../app/db/queries')

module.exports = function (router) {
  // render home page
  router.get('/home', (req, res) => {
    queries
      .getTrendingCategories()
      .then(trending => {
        queries
          .searchLessons
          .getRecentlyAdded()
          .then(recent => {
            res.render('home.html', { trending, recent })
          })
      })
  })
}
