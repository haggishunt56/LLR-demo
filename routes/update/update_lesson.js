const queries = require('../../app/db/queries')

module.exports = function (router) {
  // display update lesson page
  router.get('/update/:proj_id-:les_id', (req, res) => {
    const id = req.params

    queries
      .searchLessons
      .getByProjectLesson(req.params.proj_id, req.params.les_id)
      .then(lessonDetails => {
        queries.searchCategories.getAll()
          .then(categories => {
            const dateNow = new Date(lessonDetails[0].date_added)
            lessonDetails[0].day_added = dateNow.getDate()
            lessonDetails[0].month_added = dateNow.getMonth() + 1
            lessonDetails[0].year_added = dateNow.getFullYear()

            res.render('update/update_lesson.html', { lessonDetails, id, categories })
          })
      })
  })

  // handle update lesson instruction
  router.post('/update/:proj_id-:les_id', (req, res) => {
    const id = req.params

    // test for blank fields
    const err = {
      project_tp_num: {},
      day_added: {},
      month_added: {},
      year_added: {},
      category: {},
      type: {},
      identified_by: {},
      identifiers_area: {},
      how_identified: {},
      summary: {},
      description: {}
    }

    if (req.body.project_tp_num === '') {
      err.project_tp_num.blank = true
      err.summarise = true
    }
    if (req.body.project_tp_num.length > 6) {
      err.project_tp_num.tooLong = true
      err.summarise = true
    }

    const dateRegEx = new RegExp('^0*$')
    if (
      req.body.year_added === '' ||
      req.body.month_added === '' ||
      req.body.day_added === '' ||
      isNaN(req.body.year_added) ||
      isNaN(req.body.month_added) ||
      isNaN(req.body.day_added) ||
      dateRegEx.test(req.body.year_added) ||
      dateRegEx.test(req.body.month_added) ||
      dateRegEx.test(req.body.day_added) ||
      req.body.day_added > 31 ||
      req.body.day_added < 0 ||
      req.body.month_added > 12 ||
      req.body.month_added < 0 ||
      req.body.year_added < 1970 ||
      (req.body.month_added === 4 && req.body.day_added > 30) ||
      (req.body.month_added === 6 && req.body.day_added > 30) ||
      (req.body.month_added === 9 && req.body.day_added > 30) ||
      (req.body.month_added === 11 && req.body.day_added > 30) ||
      (req.body.month_added === 2 && req.body.day_added > 28 && req.body.year_added % 4 !== 0) ||
      (req.body.month_added === 2 && req.body.day_added > 29)
    ) {
      err.dateAdded = true
      err.summarise = true
    } else {
      req.body.dateAdded = new Date(req.body.year_added, req.body.month_added - 1, req.body.day_added, 0, 0, 0, 0)
    }

    if (req.body.category_name === 'none') {
      err.category.blank = true
      err.summarise = true
    }
    if (req.body.category_name.length > 45) {
      err.category.tooLong = true
      err.summarise = true
    }

    if (req.body.www_ebi === '') {
      err.type.blank = true
      err.summarise = true
    }

    if (req.body.identified_by === '') {
      err.identified_by.blank = true
      err.summarise = true
    }
    if (req.body.identified_by.length > 45) {
      err.identified_by.tooLong = true
      err.summarise = true
    }

    if (req.body.identifiers_area === '') {
      err.identifiers_area.blank = true
      err.summarise = true
    }
    if (req.body.identifiers_area.length > 45) {
      err.identifiers_area.tooLong = true
      err.summarise = true
    }

    if (req.body.how_identified === '') {
      err.how_identified.blank = true
      err.summarise = true
    }
    if (req.body.how_identified.length > 128) {
      err.how_identified.tooLong = true
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

    if (req.body.description === '') {
      err.description.blank = true
      err.summarise = true
    }
    if (req.body.description.length > 2000) {
      err.description.tooLong = true
      err.summarise = true
    }

    // summarise and send errors
    if (err.summarise) {
      const lessonDetails = [{}]
      lessonDetails[0] = req.body
      queries.searchCategories.getAll()
        .then(categories => {
          return res.render('update/update_lesson.html', { err, lessonDetails, id, categories })
        })
    } else { // update lesson
      queries
        .updateLesson(req.params.proj_id, req.params.les_id, req.body.project_tp_num,
          req.body.day_added, req.body.month_added, req.body.year_added, req.body.category,
          req.body.www_ebi, req.body.identified_by, req.body.identifiers_area,
          req.body.how_identified, req.body.username, req.body.summary, req.body.description)
        .then(lessonDetails => {
          queries
            .searchLessons
            .getByProjectLesson(req.body.project_tp_num, req.params.les_id)
            .then(lessonDetails => {
              res.render('update/update_lesson_success.html', { lessonDetails })
            })
        })
    }
  })
}
