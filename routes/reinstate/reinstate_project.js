const queries = require('../../app/db/queries.js')

module.exports = function (router) {
  // display delete project confirmation page
  router.get('/reinstate/:proj_id', (req, res) => {
    const tpNum = req.params.proj_id

    queries.delete.reinstateProject(tpNum)
      .then(queries.delete.reinstateAllProjectLessons(tpNum))
      .then(queries.delete.reinstateAllProjectActions(tpNum))
      .then(rowsReinstated => { res.redirect('../view/' + tpNum) })
      .catch(e => {
        console.log(e)
        return res.render('500.html')
      })
  })
}
