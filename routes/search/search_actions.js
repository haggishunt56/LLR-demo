const queries = require('../../app/db/queries')

module.exports = function (router) {
  router.get('/search_actions', (req, res) => {
    res.render('search/search_actions.html')
  })

  router.post('/search_actions', (req, res) => {
    const reqjson = req.body
    queries
      .searchActions
      .getBySearchFields(reqjson.lessonId, reqjson.projectName, reqjson.actionOwner,
        reqjson.dateFromDay, reqjson.dateFromMonth, reqjson.dateFromYear,
        reqjson.dateToDay, reqjson.dateToMonth, reqjson.dateToYear)
      .then(action_details => {
        res.render('search/search_actions.html', { reqjson, action_details })
      })


    // const reqjson = req.body
    // if (reqjson.include_deleted === '_unchecked') {
    //   reqjson.include_deleted = false
    // } else {
    //   reqjson.include_deleted = true
    // }
    //
    // queries
    //   .searchLessons
    //   .getBySearchFields(reqjson.lessonName, reqjson.projectName, reqjson.projectType,
    //     reqjson.portfolio, reqjson.category, reqjson.lessonType,
    //     reqjson.dateFromDay, reqjson.dateFromMonth, reqjson.dateFromYear,
    //     reqjson.dateToDay, reqjson.dateToMonth, reqjson.dateToYear, reqjson.include_deleted)
    //   .then(lesson_details => {
    //     queries.searchCategories.getAll()
    //       .then(categories => {
    //         queries.searchPortfolios.getActive()
    //           .then(activePortfolios => {
    //             const rowsReturned = Object.keys(lesson_details).length
    //             res.render('search/search_lessons.html', { lesson_details, rowsReturned, reqjson, categories, activePortfolios })
    //           })
    //       })
    //   })
  })
}
