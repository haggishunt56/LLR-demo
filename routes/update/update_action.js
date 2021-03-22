const queries = require('../../app/db/queries')

module.exports = function (router) {
  router.get('/update/:proj_id-:les_id.:action_id', (req, res) => {
    queries
      .searchActions
      .getById(req.params.action_id)
      .then(action_details => {
        if (action_details === '') {
          res.render('404.html')
        } else {
          const id = req.params
          var d = new Date(action_details[0].target_date)
          action_details[0].target_day = d.getDate()
          action_details[0].target_month = d.getMonth() + 1
          action_details[0].target_year = d.getFullYear()
          res.render('update/update_action.html', { action_details, id })
        }
      })
  })

  router.post('/update/:proj_id-:les_id.:action_id', (req, res) => {
    const id = req.params

    // test for blank fields
    const err = {
      actionDetails: {},
      actionOwner: {}
    }

    if (req.body.action_details === '') {
      err.actionDetails.blank = true
      err.summarise = true
    }

    if (req.body.action_owner === '') {
      err.actionOwner.blank = true
      err.summarise = true
    } else if (req.body.action_owner.length > 45) {
      err.actionOwner.tooLong = true
      err.summarise = true
    }

    const dateRegEx = new RegExp('^0*$')

    if(
      req.body.target_year === '' ||
      req.body.target_month === '' ||
      req.body.target_day === '' ||
      isNaN(req.body.target_year) ||
      isNaN(req.body.target_month) ||
      isNaN(req.body.target_day) ||
      dateRegEx.test(req.body.target_year) ||
      dateRegEx.test(req.body.target_month) ||
      dateRegEx.test(req.body.target_day) ||
      req.body.target_day < 0 ||
      req.body.target_day > 31 ||
      req.body.target_month < 0 ||
      req.body.target_month > 12 ||
      req.body.target_year < 1970 ||
      (req.body.target_month === 4 && req.body.target_day > 30) ||
      (req.body.target_month === 6 && req.body.target_day > 30) ||
      (req.body.target_month === 9 && req.body.target_day > 30) ||
      (req.body.target_month === 11 && req.body.target_day > 30) ||
      (req.body.target_month === 2 && req.body.target_day > 28 && req.body.target_year % 4 !== 0) ||
      (req.body.target_month === 2 && req.body.target_day > 29)
    ) {
      err.targetDate = true
      err.summarise = true
    }

    // summarise and send errors
    if (err.summarise) {
      let action_details = [{}]
      action_details[0] = req.body
      res.render('update/update_action.html', { err, action_details, id })
    } else { // update lesson
      queries
        .updateAction(req.params.action_id, req.body.action_details, req.body.action_owner,
          req.body.target_day, req.body.target_month, req.body.target_year)
        .then(returnedVal => {
          queries
            .searchActions
            .getById(req.params.action_id)
            .then(action_details => {
              const actionUpdated = true
              res.render('view/view_action.html', { action_details, actionUpdated, id })
            })
        })
    }
  })
}
