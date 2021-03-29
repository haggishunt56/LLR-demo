const queries = require('../../app/db/queries')

module.exports = function (router) {
  router.post('/home_search', (req, res) => {
    queries
      .searchLessons
      .searchForParam(req.body.search)
      .then(lesson_details => {
        queries.searchCategories.getAll()
          .then(categories => {
            queries.searchPortfolios.getActive()
              .then(activePortfolios => {
                const rowsReturned = Object.keys(lesson_details).length
                res.render('search/search_lessons.html', { lesson_details, rowsReturned, categories, activePortfolios })
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
      .catch(e => {
        console.log(e)
        return res.render('500.html');
      })
  })
}
