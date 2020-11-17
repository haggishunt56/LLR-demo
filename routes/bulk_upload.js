const queries = require('../app/db/queries')

module.exports = function (router) {
  router.get('/bulkupload', (req, res) => {
    res.render('./bulkupload.html')
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

              // TODO data validation
              const err = {
                projectId: {},
                category: {},
                lessonType: {},
                identifiedBy: {},
                identifiersArea: {},
                howIdentifed: {},
                summary: {},
                description: {}
              }
              for (var i = 0; i < jsonObj.length; i++) {
                if (jsonObj[i].ProjectID === '') {
                  err.projectId.blank = true
                  err.summarise = true
                }
                if (jsonObj[i].ProjectID.length > 7) {
                  err.projectId.tooLong = true
                  err.summarise = true
                }
                // TODO checkProjectExists

                if (jsonObj[i].Category === '') {
                  err.category.blank = true
                  err.summarise = true
                }
                if (jsonObj[i].Category.length > 45) {
                  err.category.tooLong = true
                  err.summarise = true
                }

                if (!(jsonObj[i].WWW_EBI_ID === 'www' || jsonObj[i].WWW_EBI_ID === 'ebi' || jsonObj[i].WWW_EBI_ID === 'WWW' || jsonObj[i].WWW_EBI_ID === 'EBI')) {
                  err.lessonType.invalidEntry = true
                  err.summarise = true
                }

                // test jsonObj[i].LessonIdentifiedBy
                // test jsonObj[i].LessonIdentifiersArea
                // test jsonObj[i].LessonHowIdentifed
                // test jsonObj[i].Summary
                // test jsonObj[i].LessonDescription
              }

              if (!err.summarise) {
                for (i = 0; i < jsonObj.length; i++) {
                  queries.createLesson(jsonObj[i].ProjectID, jsonObj[i].Category,
                    jsonObj[i].WWW_EBI_ID, jsonObj[i].LessonIdentifiedBy,
                    jsonObj[i].LessonIdentifiersArea, jsonObj[i].LessonHowIdentifed,
                    jsonObj[i].Summary, jsonObj[i].LessonDescription)
                    .then()
                  rowsAdded = i
                }
                rowsAdded++
                res.render('./bulkupload.html', { rowsAdded })
              } else {
                res.render('./bulkupload.html', { err })
              }
            })
        }
      })
    }
  })
}
