const queries = require('../app/db/queries')

module.exports = function (router) {

  //display delete project confirmation page
  router.get('/delete/:proj_id', (req, res) => {
    let id = req.params.proj_id;
    res.render('delete/delete_project_confirm.html', {id});
  });

  //handle instruction to delete project
  router.post('/delete/:proj_id', (req, res) => {
    tpNum = req.params.proj_id
    queries.deleteProject(tpNum)
      .then(
        rows_deleted => {
          res.render('delete/delete_project_success.html', {rows_deleted, tpNum});
        }
      )
  });

}
