const queries = require('../../app/db/queries')

module.exports = function (router) {
  router.get('/create_action', (req, res) => {
    res.render('create/create_action_man.html')
  })

  router.post('/create_action_man', (req, res) => {
    const actionCreated = true
    const err = {
      lessonId: {},
      actionDetails: {},
      actionOwner: {}
    }

    const regex = new RegExp('^([a-z]|[0-9]|[A-Z]){0,7}-\\d*$')
    if (req.body.lessonIdDisplay == '') {
      err.lessonId.blank = true
      err.summarise = true
    } else if (!regex.test(req.body.lessonIdDisplay)) {
      err.lessonId.invalid = true
      err.summarise = true
    } else {
      req.body.projectTpNum = req.body.lessonIdDisplay.split("-")[0]
      req.body.lessonId = req.body.lessonIdDisplay.split("-")[1]
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

    var reqjson = req.body
    const dateRegEx = new RegExp('^0*$')

    if(
        reqjson.target_year == "" ||
        reqjson.target_month == "" ||
        reqjson.target_day == "" ||
        isNaN(reqjson.target_year) ||
        isNaN(reqjson.target_month) ||
        isNaN(reqjson.target_day) ||
        dateRegEx.test(reqjson.target_year) ||
        dateRegEx.test(reqjson.target_month) ||
        dateRegEx.test(reqjson.target_day) ||
        reqjson.target_day < 0 ||
        reqjson.target_day > 31 ||
        reqjson.target_month < 0 ||
        reqjson.target_month > 12 ||
        reqjson.target_year < 1970 ||
        (reqjson.target_month == 4 && reqjson.target_day > 30) ||
        (reqjson.target_month == 6 && reqjson.target_day > 30) ||
        (reqjson.target_month == 9 && reqjson.target_day > 30) ||
        (reqjson.target_month == 11 && reqjson.target_day > 30) ||
        (reqjson.target_month == 2 && reqjson.target_day > 28 && !(reqjson.target_year % 4 == 0))
        (reqjson.target_month == 2 && reqjson.target_day > 29)
      ) {
      err.targetDate = true
      err.summarise = true
    }

    if (err.summarise) {
      console.log("working")
      res.render('create/create_action_man.html', { err, reqjson })
    } else {
      queries.searchProjects.checkProjectExists(req.body.projectTpNum)
      .then(project => {
        if (project[0].count == 0) {
          err.lessonId.invalid = true
          err.summarise = true
          res.render('create/create_action_man.html', { err, reqjson })
        } else {
          queries
          .createAction(req.body.lessonId, req.body.actionDetails, req.body.actionOwner,
            req.body.target_day, req.body.target_month, req.body.target_year)
          .then(actionCreated => {
            res.redirect('view/' + req.body.projectTpNum + '-' + req.body.lessonId)
          })
        }
      })
    }
  })
}
