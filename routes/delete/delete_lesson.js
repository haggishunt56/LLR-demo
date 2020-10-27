const queries = require('../../app/db/queries')

module.exports = function (router) {
  // display delete lesson confirmation page
  router.get('/delete/:proj_id-:les_id', (req, res) => {
    const id = req.params
    res.render('delete/delete_lesson.html', { id })
  })

  // handle instruction to delete lesson
  router.post('/delete/:proj_id-:les_id', (req, res) => {
    const tpNum = req.params.proj_id
    const lessonId = req.params.les_id

    queries.deleteLesson(tpNum, lessonId)
      .then(rowsDeleted => {
        res.render('delete/delete_lesson_success.html', { tpNum, lessonId })
      })
  })
}
