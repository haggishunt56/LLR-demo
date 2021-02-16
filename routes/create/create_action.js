const queries = require('../../app/db/queries')

module.exports = function (router) {
  router.get('/create_action', (req, res) => {
    const dateNow = new Date()
    const reqjson = {}
    reqjson.day_added = dateNow.getDate()
    reqjson.month_added = dateNow.getMonth()
    reqjson.year_added = dateNow.getFullYear()

    queries.searchCategories.getAll()
      .then(categories => {
        res.render('create/create_action.html', { reqjson, categories })
      })
  })

  router.post('/create_action', (req, res) => {
    console.log(req.body)
    const actionCreated = true
    const err = {
      actionDetails: {},
      actionOwner: {}
    }

    if (req.body.actionDetails === '') {
      err.actionDetails.blank = true
      err.summarise = true
    }

    if (req.body.actionOwner === '') {
      err.actionOwner.blank = true
      err.summarise = true
    }
    if (req.body.actionOwner.length > 45) {
      err.actionOwner.tooLong = true
      err.summarise = true
    }

    var createLesson = {
      projectTpNum: req.body.projectTpNum,
      howIdentified: req.body.howIdentified,
      identifiedBy: req.body.identifiedBy,
      identifiedByArea: req.body.identifiedByArea,
      lesson_id: req.body.lessonId
    }

    const dateNow = new Date()
    let reqjson = {}
    reqjson.day_added = dateNow.getDate()
    reqjson.month_added = dateNow.getMonth()
    reqjson.year_added = dateNow.getFullYear()

    if (err.summarise) {
      createLesson.action_details = req.body.actionDetails
      createLesson.action_owner = req.body.actionOwner
      res.render('create/create_action.html', { err, createLesson, reqjson, actionCreated })
    } else {
      queries
        .createAction(req.body.lessonId, req.body.actionDetails, req.body.actionOwner,
          req.body.target_day, req.body.target_month, req.body.target_year)
        .then(actionCreated => {
          if (req.body.new_action !== undefined) { // new action
            res.render('create/create_action.html', { reqjson, createLesson, actionCreated })
          } else if (req.body.new_lesson !== undefined) { // new lesson
            reqjson = req.body
            queries.searchCategories.getAll()
              .then(categories => {
                res.render('create/create_lesson.html', { reqjson, categories })
              })
          } else if (req.body.go_home !== undefined) { // return home
            res.redirect('/home')
          } else if (req.body.save !== undefined) { // for manual creation of actions
            res.redirect('view/' + req.body.projectTpNum + '-' + req.body.lessonId)
          } else {
            console.log('something went wrong')
            res.render('500.html')
          }
        })
    }
  })
}
