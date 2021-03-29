const queries = require('../../app/db/queries')

module.exports = function (router) {
  router.get('/search_conferences', (req, res) => {
    queries.searchPortfolios.getActive()
      .then(activePortfolios => {
        res.render('search/search_conferences.html', { activePortfolios })
      })
      .catch(e => {
        console.log(e)
        return res.render('500.html');
      })
  })

  router.post('/search_conferences', (req, res) => {
    const reqjson = req.body
    if (reqjson.include_deleted === '_unchecked') {
      reqjson.include_deleted = false
    } else {
      reqjson.include_deleted = true
    }
    queries
      .searchConferences
      .getBySearchFields(reqjson.projectName_proj, reqjson.portfolio, reqjson.status,
        reqjson.dateFromDay, reqjson.dateFromMonth, reqjson.dateFromYear,
        reqjson.dateToDay, reqjson.dateToMonth, reqjson.dateToYear, reqjson.include_deleted)
      .then(project_details => {
        const rowsReturned = Object.keys(project_details).length
        queries.searchPortfolios.getActive()
          .then(activePortfolios => {
            res.render('search/search_conferences.html', { activePortfolios, project_details, reqjson, rowsReturned })
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
