const queries = require('../app/db/queries')

module.exports = function (router) {
  // return raw json with full details of all lessons in the database
  router.get('/lessondetails', (req, res) => {
    queries
      .Lessons
      .getAll()
      .then(lessonDetails => {
        res.json(lessonDetails)
      })
  })

  // send bulk upload form as download
  router.get('/file/bulkupload', function (req, res) {
    res.download('./app/views/LLR_upload_form_v0.0.xls')
  })
}
