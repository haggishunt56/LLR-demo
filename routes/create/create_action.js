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
    // const err = {
    //   summarise: {},
    //   projectTpNum: {},
    //   category: {},
    //   lessonType: {},
    //   identifiedBy: {},
    //   identifiedByArea: {},
    //   howIdentified: {},
    //   summary: {},
    //   details: {}
    // }
    //
    // if (req.body.projectTpNum === '') {
    //   err.projectTpNum.blank = true
    //   err.summarise = true
    // }
    // if (req.body.projectTpNum.length > 7) {
    //   err.projectTpNum.tooLong = true
    //   err.summarise = true
    // }
    //
    // if (req.body.category === 'none') {
    //   err.category.blank = true
    //   err.summarise = true
    // }
    // if (req.body.category.length > 45) {
    //   err.category.tooLong = true
    //   err.summarise = true
    // }
    //
    // if (req.body.lessonType === undefined) {
    //   err.lessonType.blank = true
    //   err.summarise = true
    // }
    //
    // if (req.body.identifiedBy === '') {
    //   err.identifiedBy.blank = true
    //   err.summarise = true
    // }
    // if (req.body.identifiedBy.length > 45) {
    //   err.identifiedBy.tooLong = true
    //   err.summarise = true
    // }
    //
    // if (req.body.identifiedByArea === '') {
    //   err.identifiedByArea.blank = true
    //   err.summarise = true
    // }
    // if (req.body.identifiedByArea.length > 45) {
    //   err.identifiedByArea.tooLong = true
    //   err.summarise = true
    // }
    //
    // if (req.body.howIdentified === '') {
    //   err.howIdentified.blank = true
    //   err.summarise = true
    // }
    // if (req.body.howIdentified.length > 128) {
    //   err.howIdentified.tooLong = true
    //   err.summarise = true
    // }
    //
    // if (req.body.summary === '') {
    //   err.summary.blank = true
    //   err.summarise = true
    // }
    // if (req.body.summary.length > 128) {
    //   err.summary.tooLong = true
    //   err.summarise = true
    // }
    //
    // if (req.body.details === '') {
    //   err.details.blank = true
    //   err.summarise = true
    // }
    // if (req.body.details.length > 2000) {
    //   err.details.tooLong = true
    //   err.summarise = true
    // }

    queries
      .createAction(req.body.lessonId, req.body.actionDetails, req.body.actionOwner,
        req.body.day_added, req.body.month_added, req.body.year_added)
      .then(actionCreated => {
        if (req.body.new_action !== undefined) { // new action
          const reqjson = req.body
          queries.searchCategories.getAll()
            .then(categories => {
              const createLesson = [{ 'project_tp_num': req.body.projectTpNum,
                'lesson_id': req.body.lessonId,
                'how_identified': req.body.howIdentified,
                'identified_by': req.body.identifiedBy,
                'identifiers_area': req.body.identifiedByArea }]
              res.render('create/create_action.html', { reqjson, categories, createLesson })
            })
        } else if (req.body.new_lesson !== undefined) { // new lesson
          const reqjson = req.body
          const dateNow = new Date()
          reqjson.day_added = dateNow.getDate()
          reqjson.month_added = dateNow.getMonth()
          reqjson.year_added = dateNow.getFullYear()

          queries.searchCategories.getAll()
            .then(categories => {
              res.render('create/create_lesson.html', { reqjson, categories })
            })
        } else if (req.body.go_home !== undefined) { // return home
          res.redirect('/home')
        } else {
          console.log('something went wrong')
        }
      })

    // queries
    //   .searchProjects
    //   .checkProjectExists(req.body.projectTpNum)
    //   .then(checkProjectExists => {
    //     if (checkProjectExists[0].count === '0') {
    //       err.projectTpNum.notExists = true
    //       err.summarise = true
    //     }
    //
    //     // summarise and send errors
    //     if (JSON.stringify(err.summarise) !== JSON.stringify({})) {
    //       const reqjson = req.body
    //       queries.searchCategories.getAll()
    //         .then(
    //           categories => {
    //             res.render('create/create_lesson.html', { err, reqjson, categories })
    //           }
    //         )
    //     } else { // query database if no errors
    //       queries
    //         .createLesson(req.body.projectTpNum, req.body.category,
    //           req.body.lessonType, req.body.identifiedBy, req.body.identifiedByArea,
    //           req.body.howIdentified, req.body.summary, req.body.details)
    //         .then(createLesson => {
    //           return res.render('create/create_lesson_success.html', { createLesson }) // display success page
    //         })
    //     }
    //   })
  })
}
