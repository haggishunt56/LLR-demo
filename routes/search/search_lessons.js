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
      err.summarise = true
    }

    const dateRegEx = new RegExp('^0*$')

    if (
      reqjson.dateFromYear !== '' ||
      reqjson.dateFromMonth !== '' ||
      reqjson.dateFromDay !== ''
    ) { // ignore if date is blank
      if (
        isNaN(reqjson.dateFromYear) ||
        isNaN(reqjson.dateFromMonth) ||
        isNaN(reqjson.dateFromDay) ||
        dateRegEx.test(reqjson.dateFromYear) ||
        dateRegEx.test(reqjson.dateFromMonth) ||
        dateRegEx.test(reqjson.dateFromDay)
      ) { // //if any field is not a number, or if any field is 0, throw err
        err.dateFrom = true
        err.summarise = true
      }
    }

    if (
      reqjson.dateToYear !== '' ||
      reqjson.dateToMonth !== '' ||
      reqjson.dateToDay !== ''
    ) { // ignore if date is blank
      if (
        isNaN(reqjson.dateToYear) ||
        isNaN(reqjson.dateToMonth) ||
        isNaN(reqjson.dateToDay) ||
        dateRegEx.test(reqjson.dateToYear) ||
        dateRegEx.test(reqjson.dateToMonth) ||
        dateRegEx.test(reqjson.dateToDay)
      ) { // //if any field is not a number, or if any field is 0, throw err
        err.dateTo = true
        err.summarise = true
      }
    }

    if (err.summarise) {
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
