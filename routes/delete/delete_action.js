const queries = require('../../app/db/queries')

module.exports = function (router) {
  // display delete lesson confirmation page
  router.get('/delete/:proj_id-:les_id.:action_id', (req, res) => {
    const id = req.params
    res.render('delete/delete_action.html', { id })
  })

  // handle instruction to delete lesson
  router.post('/delete/:proj_id-:les_id.:action_id', (req, res) => {
    console.log("working")
    const tpNum = req.params.proj_id
    const lessonId = req.params.les_id
    const actionId = req.params.action_id

    queries.deleteAction(actionId)
      .then(rowsDeleted => {
        res.render('delete/delete_action_success.html', { tpNum, lessonId, actionId })
      })
  })
}
