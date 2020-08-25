const queries = require('../app/db/queries')

module.exports = function (router) {

  //display delete lesson confirmation page
  router.get('/delete/:proj_id-:les_id', (req, res) => {
    let id = req.params;
    res.render('delete/delete_lesson_confirm.html', {id});
  });

  //handle instruction to delete lesson
  router.post('/delete/:proj_id-:les_id', (req, res) => {
    tpNum = req.params.proj_id
    lessonId = req.params.les_id

    queries.deleteLesson(tpNum, lessonId)
      .then(
        rows_deleted => {
          res.render('delete/delete_lesson_success.html', {tpNum, lessonId});
        }
      )
  });

}
