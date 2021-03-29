const queries = require('../../app/db/queries')

module.exports = function (router) {
  // render home page
  router.get('/home', (req, res) => {
    queries
    .searchCategories
      .getTrending()
      .then(trending => {
        queries
          .searchLessons
          .getRecentlyAdded()
          .then(recent => {
            res.render('home.html', { trending, recent })
          })
          .catch(e => {
            console.log(e)
            return res.render('500.html');
          })
      })
      .catch(e => {
        console.log(e)
        return res.render('500.html');
      })
  })
}
