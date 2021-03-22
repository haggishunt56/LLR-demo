const queries = require('../../app/db/queries')

module.exports = function (router) {
  // return full detail of a single lesson rendered onto html page
  router.get('/view/:proj_id-:les_id.:action_id', (req, res) => {
    queries
      .searchActions
      .getById(req.params.action_id)
      .then(action_details => {
        if (action_details === '') {
          res.render('404.html')
        } else {
          res.render('view/view_action.html', { action_details })
        }
      })
  })
}
