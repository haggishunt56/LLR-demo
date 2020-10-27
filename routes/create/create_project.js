const queries = require('../../app/db/queries')

module.exports = function (router) {
  router.get('/create_project', (req, res) => {
    queries.searchPortfolios.getActive()
      .then(activePortfolios => {
        res.render('create/create_project.html', { activePortfolios })
      })
  })

  router.post('/create_project', (req, res) => {
    // test for blank fields
    const err = {
      projectName: {},
      projectTpNum: {},
      portfolio: {},
      srm: {},
      status: {},
      dateStarted: {}
    } // TODO include start and close date

    if (req.body.projectName === '') {
      err.projectName.blank = true
      err.summarise = true
    }
    if (req.body.projectName.length > 100) {
      err.projectName.tooLong = true
      err.summarise = true
    }

    if (req.body.projectTpNum === '') {
      err.projectTpNum.blank = true
      err.summarise = true
    } else if (req.body.projectTpNum.length > 7) {
      err.projectTpNum.tooLong = true
      err.summarise = true
    }

    if (req.body.dateStartedDay === '' || req.body.dateStartedMonth === '' ||
        req.body.dateStartedYear === '') {
      err.dateStarted.blank = true
      err.summarise = true
    }

    if (req.body.portfolio === '') {
      err.portfolio.blank = true
      err.summarise = true
    }

    if (req.body.srm === '') {
      err.srm.blank = true
      err.summarise = true
    }
    if (req.body.srm.length > 45) {
      err.srm.tooLong = true
      err.summarise = true
    }

    if (req.body.status === '') {
      err.status.blank = true
      err.summarise = true
    }

    queries
      .searchProjects
      .checkProjectExists(req.body.projectTpNum)
      .then(checkProjectExists => {
        if (checkProjectExists[0].count !== '0') {
          err.projectTpNum.exists = true
          err.summarise = true
        }

        // summarise and send errors
        if (err.summarise) {
          const reqjson = req.body
          queries.searchPortfolios.getActive()
            .then(activePortfolios => {
              return res.render('create/create_project.html', { err, reqjson, activePortfolios })
            })
        } else { // query db if no errors
          queries
            .createProject(req.body.projectName, req.body.projectTpNum,
              req.body.dateStartedDay, req.body.dateStartedMonth,
              req.body.dateStartedYear, req.body.dateClosedDay,
              req.body.dateClosedMonth, req.body.dateClosedYear, req.body.portfolio,
              req.body.srm, req.body.status)
            .then(createProject => {
              const projectTpNum = createProject.rows[0].project_tp_num
              return res.render('create/create_project_success.html', { projectTpNum }) // display success page
            })
        }
      })
  })
}
