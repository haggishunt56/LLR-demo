const queries = require('../../app/db/queries')

module.exports = function (router) {
  router.get('/create_lesson', (req, res) => {
    const dateNow = new Date()
    const reqjson = {}
    reqjson.day_added = dateNow.getDate()
    reqjson.month_added = dateNow.getMonth()
    reqjson.year_added = dateNow.getFullYear()

    queries.searchCategories.getAll()
      .then(categories => {
        res.render('create/create_lesson.html', { reqjson, categories })
      })
  })

  router.post('/create_new_lesson', (req, res) => {
    const reqjson = req.body
    const dateNow = new Date()
    reqjson.day_added = dateNow.getDate()
    reqjson.month_added = dateNow.getMonth()
    reqjson.year_added = dateNow.getFullYear()

    queries.searchCategories.getAll()
      .then(categories => {
        res.render('create/create_lesson.html', { reqjson, categories })
      })
  })

  router.post('/create_lesson', (req, res) => {
    const err = {
      summarise: {},
      projectTpNum: {},
      category: {},
      lessonType: {},
      identifiedBy: {},
      identifiedByArea: {},
      howIdentified: {},
      summary: {},
      details: {}
    }

    if (req.body.projectTpNum === '') {
      err.projectTpNum.blank = true
      err.summarise = true
    }
    if (req.body.projectTpNum.length > 7) {
      err.projectTpNum.tooLong = true
      err.summarise = true
    }

    if (req.body.category === 'none') {
      err.category.blank = true
      err.summarise = true
    }
    if (req.body.category.length > 45) {
      err.category.tooLong = true
      err.summarise = true
    }

    if (req.body.lessonType === undefined) {
      err.lessonType.blank = true
      err.summarise = true
    }

    if (req.body.identifiedBy === '') {
      err.identifiedBy.blank = true
      err.summarise = true
    }
    if (req.body.identifiedBy.length > 45) {
      err.identifiedBy.tooLong = true
      err.summarise = true
    }

    if (req.body.identifiedByArea === '') {
      err.identifiedByArea.blank = true
      err.summarise = true
    }
    if (req.body.identifiedByArea.length > 45) {
      err.identifiedByArea.tooLong = true
      err.summarise = true
    }

    if (req.body.howIdentified === '') {
      err.howIdentified.blank = true
      err.summarise = true
    }
    if (req.body.howIdentified.length > 128) {
      err.howIdentified.tooLong = true
      err.summarise = true
    }

    if (req.body.summary === '') {
      err.summary.blank = true
      err.summarise = true
    }
    if (req.body.summary.length > 128) {
      err.summary.tooLong = true
      err.summarise = true
    }

    if (req.body.details === '') {
      err.details.blank = true
      err.summarise = true
    }
    if (req.body.details.length > 2000) {
      err.details.tooLong = true
      err.summarise = true
    }

    queries
      .searchProjects
      .checkProjectExists(req.body.projectTpNum)
      .then(checkProjectExists => {
        if (checkProjectExists[0].count === 0) {
          err.projectTpNum.notExists = true
          err.summarise = true
        }
        const reqjson = req.body

        // summarise and send errors
        if (JSON.stringify(err.summarise) !== JSON.stringify({})) {
          queries.searchCategories.getAll()
            .then(categories => {
              res.render('create/create_lesson.html', { err, reqjson, categories })
            })
        } else { // query database if no errors
          queries
            .searchCategories
            .getByName(req.body.category)
            .then(cat => {
              req.body.category = cat[0].category_id
              queries
                .createLesson(req.body.projectTpNum, req.body.category,
                  req.body.lessonType, req.body.identifiedBy, req.body.identifiedByArea,
                  req.body.howIdentified, req.body.summary, req.body.details)
                .then(lessonId => {
                  const createLesson = req.body
                  createLesson.lesson_id = lessonId
                  res.render('create/create_action.html', { createLesson }) // display success page
                })
            })
        }
      })
  })
}
