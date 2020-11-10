const queries = require('../app/db/queries')

module.exports = function (router) {
  router.get('/bulkupload', (req, res) => {
    res.render('./bulkupload.html')
    // res.download('./app/views/LLR_upload_form_v0.0.xls')
  })

  router.get('/bulkformdownload', (req, res) => {
    res.download('./app/docs/LLRbulkuploadform.csv')
  })

  router.get('/formhelpdownload', (req, res) => {
    res.download('./app/docs/LLRbulkuploadformhelp.csv')
  })

  router.post('/bulkupload', function (req, res) {
    if (req.files) {
      var file = req.files.file
      var filename = file.name

      // TODO test that file is a .csv extenstion

      file.mv('./uploads/' + filename, function (err) {
        if (err) {
          res.send(err)
        } else {
          const csv = require('csvtojson')
          const csvFilePath = './uploads/' + filename
          csv()
            .fromFile(csvFilePath)
            .then((jsonObj) => {
              let rowsAdded = 0
              /*
              // TODO data validation
              let err = {}
              for (var i = 0; i < jsonObj.length; i++) {
                test jsonObj[i].ProjectID
                test jsonObj[i].Category
                test jsonObj[i].WWW_EBI_ID
                test jsonObj[i].LessonIdentifiedBy
                test jsonObj[i].LessonIdentifiersArea
                test jsonObj[i].LessonHowIdentifed
                test jsonObj[i].Summary
                test jsonObj[i].LessonDescription
              }
              if not err then loop query
              else display error (tell users which rows are the problem)
              */
              for (var i = 0; i < jsonObj.length; i++) {
                queries.createLesson(jsonObj[i].ProjectID, jsonObj[i].Category,
                  jsonObj[i].WWW_EBI_ID, jsonObj[i].LessonIdentifiedBy,
                  jsonObj[i].LessonIdentifiersArea, jsonObj[i].LessonHowIdentifed,
                  jsonObj[i].Summary, jsonObj[i].LessonDescription)
                  .then()
                rowsAdded = i
              }
              rowsAdded++
              res.render('./bulkupload.html', { rowsAdded })
            })
        }
      })
    }
  })
}
