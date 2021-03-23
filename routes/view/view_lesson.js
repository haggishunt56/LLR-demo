const queries = require('../../app/db/queries')

module.exports = function (router) {
  // return full detail of a single lesson rendered onto html page
  router.get('/view/:proj_id-:les_id', (req, res) => {
    queries
      .searchLessons
      .getByProjectLesson(req.params.proj_id, req.params.les_id)
      .then(lesson_details => {
        if (lesson_details == '') {
          res.render('404.html')
        } else {
          queries
            .searchActions
            .getByLesson(req.params.les_id)
            .then(action_details => {
              res.render('view/view_lesson.html', { lesson_details, action_details })
            })
        }
      })
  })

  router.post('/add_action/:proj_id-:les_id', (req, res) => {
    let createLesson = {}
    createLesson.projectTpNum = req.params.proj_id
    createLesson.lesson_id = req.params.les_id
    createLesson.manual = true

    res.render('create/create_action.html', { createLesson })
  })
}
