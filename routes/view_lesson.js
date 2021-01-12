const queries = require('../app/db/queries')

module.exports = function (router) {
  // return full detail of a single lesson rendered onto html page
  router.get('/view/:proj_id-:les_id', (req, res) => {
    queries
      .searchLessons
      .getByProjectLesson(req.params.proj_id, req.params.les_id)
      .then(lesson_details => {
        console.log(lesson_details[0])
        res.render('view/view_lesson.html', { lesson_details })
      })
  })
}
