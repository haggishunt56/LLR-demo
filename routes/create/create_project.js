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
      status: {}
    }
    const dateRegEx = new RegExp('^0*$')
    if(
        req.body.dateStartedYear == "" ||
        req.body.dateStartedMonth == "" ||
        req.body.dateStartedDay == "" ||
        isNaN(req.body.dateStartedYear) ||
        isNaN(req.body.dateStartedMonth) ||
        isNaN(req.body.dateStartedDay) ||
        dateRegEx.test(req.body.dateStartedYear) ||
        dateRegEx.test(req.body.dateStartedMonth) ||
        dateRegEx.test(req.body.dateStartedDay) ||
        req.body.dateStartedDay > 31 ||
        req.body.dateStartedDay < 0 ||
        req.body.dateStartedMonth > 12 ||
        req.body.dateStartedMonth < 0 ||
        req.body.dateStartedYear < 1970
        ) {
      err.dateStarted = true
      err.summarise = true
    } else {
      req.body.dateStarted = new Date(req.body.dateStartedYear, req.body.dateStartedMonth - 1, req.body.dateStartedDay, 0, 0, 0, 0)
    }

    if (
        req.body.dateClosedYear == '' &&
        req.body.dateClosedMonth == '' &&
        req.body.dateClosedDay == ''
        ) {
      // do nothing
    } else if(
        isNaN(req.body.dateClosedYear) ||
        isNaN(req.body.dateClosedMonth) ||
        isNaN(req.body.dateClosedDay) ||
        dateRegEx.test(req.body.dateClosedYear) ||
        dateRegEx.test(req.body.dateClosedMonth) ||
        dateRegEx.test(req.body.dateClosedDay) ||
        req.body.dateClosedDay > 31 ||
        req.body.dateClosedDay < 0 ||
        req.body.dateClosedMonth > 12 ||
        req.body.dateClosedMonth < 0 ||
        req.body.dateClosedYear < 1970
        ) {
      err.dateClosed = true
      err.summarise = true
    } else {
      req.body.dateClosed = new Date(req.body.dateClosedYear, req.body.dateClosedMonth - 1, req.body.dateClosedDay, 0, 0, 0, 0)
      req.body.dateClosedExists = true
    }

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
        if (checkProjectExists[0].count !== 0) {
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
              req.body.dateStarted, req.body.dateClosed, req.body.dateClosedExists,
              req.body.portfolio, req.body.srm, req.body.status)
            .then(createProject => {
              const projectTpNum = req.body.projectTpNum
              return res.render('create/create_project_success.html', { projectTpNum }) // display success page
            })
        }
      })
  })
}
