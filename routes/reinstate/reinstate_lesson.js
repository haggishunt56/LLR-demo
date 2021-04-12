const queries = require('../../app/db/queries.js')

module.exports = function (router) {
  router.get('/reinstate/:proj_id-:les_id', (req, res) => {
    const tpNum = req.params.proj_id
    const lessonId = req.params.les_id

    queries.delete.reinstateLesson(tpNum, lessonId)
      .then(rowsReinstated => {
        queries.delete.reinstateAllLessonActions(lessonId)
          .then(reinstated => {
            res.redirect('../view/' + tpNum + '-' + lessonId)
          })
          .catch(e => {
            console.log(e)
            return res.render('500.html')
          })
      })
      .catch(e => {
        console.log(e)
        return res.render('500.html')
      })
  })
}
