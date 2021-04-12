const queries = require('../../app/db/queries')

module.exports = function (router) {
  router.post('/create_action', (req, res) => {
    const actionCreated = true
    const err = {
      actionDetails: {},
      actionOwner: {}
    }

    if(req.body.lessonId === '') {
      res.render('500.html')
    } else {
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

      let reqjson = req.body
      const dateRegEx = new RegExp('^0*$')

      if(
          reqjson.target_year === '' ||
          reqjson.target_month === '' ||
          reqjson.target_day === '' ||
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
          ((req.body.target_month === '4' || req.body.target_month === '04') && req.body.target_day > 30) ||
          ((req.body.target_month === '6' || req.body.target_month === '06') && req.body.target_day > 30) ||
          ((req.body.target_month === '9' || req.body.target_month === '09') && req.body.target_day > 30) ||
          (req.body.target_month === '11' && req.body.target_day > 30) ||
          ((req.body.target_month === '2' || req.body.target_month === '02') && req.body.target_day > 28 && !(req.body.target_year % 4 === 0)) ||
          ((req.body.target_month === '2' || req.body.target_month === '02') && req.body.target_day > 29)
        ) {
        err.targetDate = true
        err.summarise = true
      }

      if (err.summarise) {
        createLesson.action_details = req.body.actionDetails
        createLesson.action_owner = req.body.actionOwner
        createLesson.manual = req.body.manual
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
                .catch(e => {
                  console.log(e)
                  return res.render('500.html')
                })
            } else if (req.body.go_home !== undefined) { // return home
              res.redirect('/home')
            } else if (req.body.save === 'Save') { // return to view project page
              res.redirect('/view/' + req.body.projectTpNum + '-' + req.body.lessonId)
            } else {
              console.log('something went wrong')
              res.render('500.html')
            }
          })
          .catch(e => {
            console.log(e)
            return res.render('500.html')
          })
      }
    }
  })
}
