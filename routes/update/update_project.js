const queries = require('../../app/db/queries')

module.exports = function (router) {
  // display update project page
  router.get('/update/:proj_tp_num', (req, res) => {
    queries
      .searchProjects
      .getByTpNum(req.params.proj_tp_num)
      .then(projectDetails => {
        if (projectDetails[0].project_type === 'project') {
          projectDetails[0].isProject = true
        } else if (projectDetails[0].project_type === 'campaign') {
          projectDetails[0].isCampaign = true
        } else if (projectDetails[0].project_type === 'conference') {
          projectDetails[0].isConference = true
        }
        queries.searchPortfolios.getActive()
          .then(activePortfolios => {
            const startDate = new Date(projectDetails[0].start_date)
            projectDetails[0].start_day = startDate.getDate()
            projectDetails[0].start_month = startDate.getMonth() + 1
            projectDetails[0].start_year = startDate.getFullYear()

            if (!(projectDetails[0].closure_date == undefined)) {
              const endDate = new Date(projectDetails[0].closure_date)
              projectDetails[0].closure_day = endDate.getDate()
              projectDetails[0].closure_month = endDate.getMonth() + 1
              projectDetails[0].closure_year = endDate.getFullYear()
            }
            res.render('../views/update/update_project.html', { projectDetails, activePortfolios })
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

  // handle update project instruction
  router.post('/update/:project_tp_num', (req, res) => { //
    // validate empty fields
    const err = {
      project_name: {},
      srm: {},
      portfolio: {},
      status: {}
    }

    if (req.body.project_name === '') {
      err.project_name.blank = true
      err.summarise = true
    }
    if (req.body.project_name.length > 100) {
      err.project_name.tooLong = true
      err.summarise = true
    }

    const dateRegEx = new RegExp('^0*$')
    if (
      req.body.start_year === '' ||
      req.body.start_month === '' ||
      req.body.start_day === '' ||
      isNaN(req.body.start_year) ||
      isNaN(req.body.start_month) ||
      isNaN(req.body.start_day) ||
      dateRegEx.test(req.body.start_year) ||
      dateRegEx.test(req.body.start_month) ||
      dateRegEx.test(req.body.start_day) ||
      req.body.start_day > 31 ||
      req.body.start_day < 0 ||
      req.body.start_month > 12 ||
      req.body.start_month < 0 ||
      req.body.start_year < 1970 ||
      (req.body.start_month === 4 && req.body.start_day > 30) ||
      (req.body.start_month === 6 && req.body.start_day > 30) ||
      (req.body.start_month === 9 && req.body.start_day > 30) ||
      (req.body.start_month === 11 && req.body.start_day > 30) ||
      (req.body.start_month === 2 && req.body.start_day > 28 && req.body.start_year % 4 !== 0) ||
      (req.body.start_month === 2 && req.body.start_day > 29)
    ) {
      err.startDate = true
      err.summarise = true
    } else {
      req.body.dateStarted = new Date(req.body.start_year, req.body.start_month - 1, req.body.start_day, 0, 0, 0, 0)
    }

    if (
      req.body.closure_year === '' &&
      req.body.closure_month === '' &&
      req.body.closure_day === ''
    ) {
      // do nothing
    } else if (
      isNaN(req.body.closure_year) ||
      isNaN(req.body.closure_month) ||
      isNaN(req.body.closure_day) ||
      dateRegEx.test(req.body.closure_year) ||
      dateRegEx.test(req.body.closure_month) ||
      dateRegEx.test(req.body.closure_day) ||
      req.body.closure_day > 31 ||
      req.body.closure_day < 0 ||
      req.body.closure_month > 12 ||
      req.body.closure_month < 0 ||
      req.body.closure_year < 1970 ||
      (req.body.closure_month === 4 && req.body.closure_day > 30) ||
      (req.body.closure_month === 6 && req.body.closure_day > 30) ||
      (req.body.closure_month === 9 && req.body.closure_day > 30) ||
      (req.body.closure_month === 11 && req.body.closure_day > 30) ||
      (req.body.closure_month === 2 && req.body.closure_day > 28 && req.body.closure_year % 4 !== 0) ||
      (req.body.closure_month === 2 && req.body.closure_day > 29)
    ) {
      err.closedDate = true
      err.summarise = true
    } else {
      req.body.dateClosed = new Date(req.body.closure_year, req.body.closure_month - 1, req.body.closure_day, 0, 0, 0, 0)
      req.body.dateClosedExists = true
    }

    if (req.body.start_day === '') {
      err.start_day = true
    }
    if (req.body.start_month === '') {
      err.start_month = true
    }
    if (req.body.start_year === '') {
      err.start_year = true
    }

    if (req.body.srm === '') {
      err.srm.blank = true
      err.summarise = true
    }
    if (req.body.srm.length > 45) {
      err.srm.tooLong = true
      err.summarise = true
    }

    if (req.body.portfolio_name === '') {
      err.portfolio.blank = true
      err.summarise = true
    }
    if (req.body.portfolio_name.length > 45) {
      err.portfolio.tooLong = true
      err.summarise = true
    }

    if (req.body.status === '') {
      err.status.blank = true
      err.summarise = true
    }
    if (req.body.status.length > 6) {
      err.status.tooLong = true
      err.summarise = true
    }

    if (err.summarise) {
      const projectDetails = [{}]
      projectDetails[0] = req.body
      projectDetails[0].project_tp_num = req.params.project_tp_num
      if (projectDetails[0].project_type === 'project') {
        projectDetails[0].isProject = true
      } else if (projectDetails[0].project_type === 'campaign') {
        projectDetails[0].isCampaign = true
      } else if (projectDetails[0].project_type === 'conference') {
        projectDetails[0].isConference = true
      }
      queries
        .searchPortfolios
        .getActive()
        .then(activePortfolios => {
          return res.render('../views/update/update_project.html', { err, projectDetails, activePortfolios })
        })
        .catch(e => {
          console.log(e)
          return res.render('500.html')
        })
    } else {
      queries.searchPortfolios.getByName(req.body.portfolio_name)
        .then(portfolio => {
          queries
            .updateProject(req.params.project_tp_num, req.body.project_name, req.body.srm,
              req.body.status, portfolio[0].portfolio_id, req.body.dateStarted,
              req.body.dateClosed, req.body.dateClosedExists)
            .then(projectDetails => {
              queries
                .searchProjects
                .getByTpNum(req.params.project_tp_num)
                .then(projectDetails => {
                  if (projectDetails[0].project_type === 'project') {
                    projectDetails[0].isProject = true
                  } else if (projectDetails[0].project_type === 'campaign') {
                    projectDetails[0].isCampaign = true
                  } else if (projectDetails[0].project_type === 'conference') {
                    projectDetails[0].isConference = true
                  }
                  queries
                    .searchLessons
                    .getByProject(req.params.project_tp_num)
                    .then(lesson_details => {
                      res.render('../views/update/update_project_success.html', { projectDetails, lesson_details })
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
            .catch(e => {
              console.log(e)
              return res.render('500.html')
            })
        })
        .catch(e => {
          console.log(e)
          return res.render('500.html')
        })
    }
  })
}
