const queries = require('../../app/db/queries.js')

module.exports = function (router) {
  // display delete lesson confirmation page
  router.get('/reinstate/:proj_id-:les_id', (req, res) => {
    const tpNum = req.params.proj_id
    const lessonId = req.params.les_id

    console.log(tpNum+'-'+lessonId)
    queries.reinstateLesson(tpNum, lessonId)
      .then(rowsReinstated => {
        res.redirect('../view/' + tpNum + '-' + lessonId)
      })
  })
}
