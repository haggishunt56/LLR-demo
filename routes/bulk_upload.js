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
          let projTpNum = []
          let rowsAdded = 0
          const csv = require('csvtojson')
          const csvFilePath = './uploads/' + filename
          const err = {
            projectId: { row: [], notExistsRow: [] },
            date: { row: [] },
            category: { row: [] },
            lessonType: { row: [] },
            identifiedBy: { row: [] },
            identifiersArea: { row: [] },
            howIdentifed: { row: [] },
            summary: { row: [] },
            description: { row: [] }
          }

          csv()
            .fromFile(csvFilePath)
            .then(jsonObj => {
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
                projTpNum[i] = jsonObj[i].ProjectID

                if(jsonObj[i].LessonDateAdded === '') {
                  err.dateAdded.blank = true
                  err.dateAdded.row[i] = i + 2
                  err.summarise = true
                }
                // TODO - test date format. Currently MUST be YYYY-MM-DD to work

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
                  err.lessonType.row[i] = i + 2
                  err.summarise = true
                }

                if (jsonObj[i].LessonIdentifiedBy === '') {
                  err.identifiedBy.blank = true
                  err.identifiedBy.row[i] = i + 2
                  err.summarise = true
                }
                if (jsonObj[i].LessonIdentifiedBy.length > 45) {
                  err.identifiedBy.tooLong = true
                  err.identifiedBy.row[i] = i + 2
                  err.summarise = true
                }

                if (jsonObj[i].LessonIdentifiersArea === '') {
                  err.identifiersArea.blank = true
                  err.identifiersArea.row[i] = i + 2
                  err.summarise = true
                }
                if (jsonObj[i].LessonIdentifiersArea.length > 45) {
                  err.identifiersArea.tooLong = true
                  err.identifiersArea.row[i] = i + 2
                  err.summarise = true
                }

                if (jsonObj[i].LessonHowIdentifed === '') {
                  err.howIdentifed.blank = true
                  err.howIdentifed.row[i] = i + 2
                  err.summarise = true
                }
                if (jsonObj[i].LessonHowIdentifed.length > 128) {
                  err.howIdentifed.tooLong = true
                  err.howIdentifed.row[i] = i + 2
                  err.summarise = true
                }

                if (jsonObj[i].Summary === '') {
                  err.summary.blank = true
                  err.summary.row[i] = i + 2
                  err.summarise = true
                }
                if (jsonObj[i].Summary.length > 128) {
                  err.summary.tooLong = true
                  err.summary.row[i] = i + 2
                  err.summarise = true
                }

                if (jsonObj[i].LessonDescription === '') {
                  err.description.blank = true
                  err.description.row[i] = i + 2
                  err.summarise = true
                }
                if (jsonObj[i].LessonDescription.length > 2000) {
                  err.description.tooLong = true
                  err.description.row[i] = i + 2
                  err.summarise = true
                }
              }
            })
            .then(checkTpNum => {
              for (var i = 0; i < projTpNum.length; i++) {
                queries.searchProjects.checkProjectExists(projTpNum[i])
                  .then(project => {
                    if (project[0].count === 0) {
                      err.projectId.notExists = true
                      err.projectId.notExistsRow[i] = i + 2
                      err.summarise = true
                    }
                  })
              }
            })
            .then(setTimeout(waitForQueries => {
              let cat = []
              if (!err.summarise) {
                csv()
                  .fromFile(csvFilePath)
                  .then(jsonObj => {
                    for (var i = 0; i < jsonObj.length; i++) {
                      queries.createLesson(jsonObj[i].ProjectID, jsonObj[i].LessonDateAdded,
                        jsonObj[i].Category, jsonObj[i].WWW_EBI_ID, jsonObj[i].LessonIdentifiedBy,
                        jsonObj[i].LessonIdentifiersArea, jsonObj[i].LessonHowIdentifed,
                        jsonObj[i].Summary, jsonObj[i].LessonDescription)
                        .then()
                        rowsAdded = i + 1
                    }
                  })
                setTimeout(wait => { res.render('./bulkupload.html', { rowsAdded }) }, 40)
              } else {
                console.log(err)
                res.render('./bulkupload.html', { err })
              }
            }, 50) //application waits for queries to return errors before proceeding
                   // otherwise asynchronous operation will continue to create
                   // lessons without waiting for the result of error checks.
            )
        }
      })
    } else {
      const err = {
        noFileUploaded: true
      }
      res.render('./bulkupload.html', { err })
    }
  })
}

function createLesson (jsonObj) {
  queries.createLesson(jsonObj[i].ProjectID, jsonObj[i].LessonDateAdded,
    jsonObj[i].Category, jsonObj[i].WWW_EBI_ID, jsonObj[i].LessonIdentifiedBy,
    jsonObj[i].LessonIdentifiersArea, jsonObj[i].LessonHowIdentifed,
    jsonObj[i].Summary, jsonObj[i].LessonDescription)

}
