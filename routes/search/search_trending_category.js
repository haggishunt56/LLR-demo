const queries = require('../../app/db/queries')

module.exports = function (router) {
  router.get('/category/:cat', (req, res) => {
    var today = new Date()
    var dd = String(today.getDate()).padStart(2, '0')
    var mm = String(today.getMonth() + 1).padStart(2, '0') // January is 0!
    var yyyy = today.getFullYear()
    var offset = 2
    var searchFrom = '' + yyyy - offset + '-' + mm + '-' + dd

    queries
      .searchLessons
      .getByCategory(req.params.cat, searchFrom)
      .then(lesson_details => {
        const rowsReturned = Object.keys(lesson_details).length
        const reqjson = {}

        reqjson.category = req.params.cat.toLowerCase()
        reqjson.dateFromDay = dd
        reqjson.dateFromMonth = mm
        reqjson.dateFromYear = yyyy - offset

        queries.searchCategories.getAll()
          .then(categories => {
            queries.searchPortfolios.getActive()
              .then(activePortfolios => {
                res.render('search/search_lessons.html', { lesson_details, rowsReturned, reqjson, categories, activePortfolios })
              })
          })
      })
  })
}
