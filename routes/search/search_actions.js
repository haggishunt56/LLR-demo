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
        const rowsReturned = Object.keys(action_details).length
        res.render('search/search_actions.html', { rowsReturned, reqjson, action_details })
      })
  })
}
