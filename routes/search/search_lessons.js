const queries = require('../../app/db/queries')

module.exports = function (router) {
  router.get('/search_lessons', (req, res) => {
    queries.searchCategories.getAll()
      .then(categories => {
        queries.searchPortfolios.getActive()
          .then(activePortfolios => {
            res.render('search/search_lessons.html', { categories, activePortfolios })
          })
      })
  })

  router.post('/search_lessons', (req, res) => {
    let err = {}
    const reqjson = req.body
    if (reqjson.include_deleted === '_unchecked') {
      reqjson.include_deleted = false
    } else {
      reqjson.include_deleted = true
    }

    if (isNaN(reqjson.lessonName)) {
      err.NaN = true
    }

    if (err.NaN) {
      queries.searchCategories.getAll()
        .then(categories => {
          queries.searchPortfolios.getActive()
            .then(activePortfolios => {
              res.render('search/search_lessons.html', { err, reqjson, categories, activePortfolios })
            })
        })
    } else {
      queries
        .searchLessons
        .getBySearchFields(reqjson.lessonName, reqjson.projectName, reqjson.projectType,
          reqjson.portfolio, reqjson.category, reqjson.lessonType,
          reqjson.dateFromDay, reqjson.dateFromMonth, reqjson.dateFromYear,
          reqjson.dateToDay, reqjson.dateToMonth, reqjson.dateToYear, reqjson.include_deleted)
        .then(lesson_details => {
          queries.searchCategories.getAll()
            .then(categories => {
              queries.searchPortfolios.getActive()
                .then(activePortfolios => {
                  const rowsReturned = Object.keys(lesson_details).length
                  res.render('search/search_lessons.html', { lesson_details, rowsReturned, reqjson, categories, activePortfolios })
                })
            })
        })
    }
  })
}
