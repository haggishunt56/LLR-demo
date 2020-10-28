const queries = require('../app/db/queries')

module.exports = function (router) {
  // display update project page
  router.get('/update/:proj_tp_num', (req, res) => {
    queries
      .searchProjects
      .getByTpNum(req.params.proj_tp_num)
      .then(projectDetails => {
        queries.searchPortfolios.getActive()
          .then(activePortfolios => {
            res.render('../views/update/update_project.html', { projectDetails, activePortfolios })
          })
      })
  })

  // handle update project instruction
  router.post('/update/:project_tp_num', (req, res) => { //
    // validate empty fields
    const err = {
      summarise: {},
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

    if (req.body.portfolio === '') {
      err.portfolio.blank = true
      err.summarise = true
    }
    if (req.body.portfolio.length > 6) {
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

    if (JSON.stringify(err.summarise) !== JSON.stringify({})) {
      const projectDetails = [{}]
      projectDetails[0] = req.body
      projectDetails[0].project_tp_num = req.params.project_tp_num
      queries
        .searchPortfolios
        .getActive()
        .then(activePortfolios => {
          return res.render('../views/update/update_project.html', { err, projectDetails, activePortfolios })
        })
    } else {
      queries
        .updateProject(req.params.project_tp_num, req.body.project_name, req.body.srm,
          req.body.status, req.body.portfolio, req.body.start_day, req.body.start_month,
          req.body.start_year, req.body.closure_day, req.body.closure_month,
          req.body.closure_year)
        .then(projectDetails => {
          queries
            .searchProjects
            .getByTpNum(req.params.project_tp_num)
            .then(projectDetails => {
              res.render('../views/update/update_project_success.html', { projectDetails })
            })
        })
    }
  })
}
