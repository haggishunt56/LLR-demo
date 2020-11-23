const queries = require('../app/db/queries')

module.exports = function (router) {
  router.get('/bulkupload', (req, res) => {
    res.render('./bulkupload.html')
  })

  router.get('/bulkformdownload', (req, res) => {
    res.download('./app/docs/LLRbulkuploadform.csv')
  })

  router.get('/formhelpdownload', (req, res) => {
    res.download('./app/docs/LLRbulkuploadformhelp.xlsx')
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
                projectId: {row: [{}]},
                category: {row: [{}]},
                lessonType: {row: [{}]},
                identifiedBy: {row: [{}]},
                identifiersArea: {row: [{}]},
                howIdentifed: {row: [{}]},
                summary: {row: [{}]},
                description: {row: [{}]}
              }

              for (var i = 0; i < jsonObj.length; i++) {
                if (jsonObj[i].ProjectID === '') {
                  err.projectId.blank = true
                  err.projectId.row[i] = i + 2
                  err.summarise = true
                }
                if (jsonObj[i].ProjectID.length > 7) {
                  err.projectId.tooLong = true
                  err.projectId.row[i] = i + 2
                  err.summarise = true
                }
                // TODO checkProjectExists

                if (jsonObj[i].Category === '') {
                  err.category.blank = true
                  err.category.row[i] = i + 2
                  err.summarise = true
                }
                if (jsonObj[i].Category.length > 45) {
                  err.category.tooLong = true
                  err.category.row[i] = i + 2
                  err.summarise = true
                }

                if (!(jsonObj[i].WWW_EBI_ID === 'www' || jsonObj[i].WWW_EBI_ID === 'ebi' || jsonObj[i].WWW_EBI_ID === 'WWW' || jsonObj[i].WWW_EBI_ID === 'EBI')) {
                  err.lessonType.invalidEntry = true
                  err.lessonType.row = i + 2
                  err.summarise = true
                }

                if (jsonObj[i].LessonIdentifiedBy === '') {
                  err.identifiedBy.blank = true
                  err.identifiedBy.row = i + 2
                  err.summarise = true
                }
                if (jsonObj[i].LessonIdentifiedBy.length > 45) {
                  err.identifiedBy.tooLong = true
                  err.identifiedBy.row = i + 2
                  err.summarise = true
                }

                if (jsonObj[i].LessonIdentifiersArea === '') {
                  err.identifiersArea.blank = true
                  err.identifiersArea.row = i + 2
                  err.summarise = true
                }
                if (jsonObj[i].LessonIdentifiersArea.length > 45) {
                  err.identifiersArea.tooLong = true
                  err.identifiersArea.row = i + 2
                  err.summarise = true
                }

                if (jsonObj[i].LessonHowIdentifed === '') {
                  err.howIdentifed.blank = true
                  err.howIdentifed.row = i + 2
                  err.summarise = true
                }
                if (jsonObj[i].LessonHowIdentifed.length > 128) {
                  err.howIdentifed.tooLong = true
                  err.howIdentifed.row = i + 2
                  err.summarise = true
                }

                if (jsonObj[i].Summary === '') {
                  err.summary.blank = true
                  err.summary.row = i + 2
                  err.summarise = true
                }
                if (jsonObj[i].Summary.length > 128) {
                  err.summary.tooLong = true
                  err.summary.row = i + 2
                  err.summarise = true
                }

                if (jsonObj[i].LessonDescription === '') {
                  err.description.blank = true
                  err.description.row = i + 2
                  err.summarise = true
                }
                if (jsonObj[i].LessonDescription.length > 2000) {
                  err.description.tooLong = true
                  err.description.row = i + 2
                  err.summarise = true
                }
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
