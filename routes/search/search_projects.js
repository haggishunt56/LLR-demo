const queries = require('../../app/db/queries')

module.exports = function (router) {
  router.get('/search_projects', (req, res) => {
    queries.searchPortfolios.getActive()
      .then(activePortfolios => {
        res.render('search/search_projects.html', { activePortfolios })
      })
      .catch(e => {
        console.log(e)
        return res.render('500.html')
      })
  })

  router.post('/search_projects', (req, res) => {
    const reqjson = req.body
    if (reqjson.include_deleted === '_unchecked') {
      reqjson.include_deleted = false
    } else {
      reqjson.include_deleted = true
    }

    queries
      .searchProjects
      .getBySearchFields(reqjson.projectName_proj, reqjson.portfolio, reqjson.status,
        reqjson.dateFromDay, reqjson.dateFromMonth, reqjson.dateFromYear,
        reqjson.dateToDay, reqjson.dateToMonth, reqjson.dateToYear, reqjson.include_deleted)
      .then(project_details => {
        const rowsReturned = Object.keys(project_details).length
        queries.searchPortfolios.getActive()
          .then(activePortfolios => {
            res.render('search/search_projects.html', { project_details, reqjson, rowsReturned, activePortfolios })
          })
          .catch(e => {
            console.log(e)
            return res.render('500.html')
          })
      })
      .catch(e => {
        console.log(e)
        return res.render('500.html')
      })
  })
}
