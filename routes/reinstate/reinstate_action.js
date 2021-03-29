const queries = require('../../app/db/queries.js')

module.exports = function (router) {
  router.get('/reinstate/:proj_id-:les_id.:action_id', (req, res) => {
    const tpNum = req.params.proj_id
    const lessonId = req.params.les_id
    const actionId = req.params.action_id

    queries.delete.reinstateAction(actionId)
      .then(rowsReinstated => {
        res.redirect('../view/' + tpNum + '-' + lessonId + '.' + actionId)
      })
      .catch(e => {
        console.log(e)
        return res.render('500.html');
      })
  })
}
