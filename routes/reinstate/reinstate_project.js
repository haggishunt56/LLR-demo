const queries = require('../../app/db/queries.js')

module.exports = function (router) {
  // display delete project confirmation page
  router.get('/reinstate/:proj_id', (req, res) => {
    const tpNum = req.params.proj_id

    queries.reinstateProject(tpNum)
      .then(queries.reinstateAllProjectLessons(tpNum)
        .then(rowsReinstated => {
          res.redirect('../view/' + tpNum)
        })
      )
  })
}
