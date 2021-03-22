const queries = require('../app/db/queries')
const csv = require('csvtojson')

module.exports = function (router) {
  router.get('/bulkupload', (req, res) => {
    // display bulk upload page
    res.render('./bulkupload.html')
  })

  router.get('/bulkformdownload', (req, res) => {
    // serve bulk upload form
    res.download('./app/docs/LLRbulkuploadform.csv')
  })

  router.get('/formhelpdownload', (req, res) => {
    // serve bulk upload help document
    res.download('./app/docs/LLRbulkuploadformhelp.xlsx')
  })

  router.post('/bulkupload', function (req, res) {
    // handle bulk upload submission

    if (!req.files) {
      // return error if no file uploaded
      const err = {
        noFileUploaded: true,
        summary: true
      }
      res.render('./bulkupload.html', { err })
    } else {
      var file = req.files.file
      var filename = file.name

      if (!(filename.split('.').pop() == 'csv')) { // test file type
       // return error if something other than csv uploaded
       let err = {
         notCSV: true,
         summary: true
       }
       res.render('./bulkupload.html', { err })
      } else {
        file.mv('./uploads/' + filename, function (err) {
          if (err) {
            res.send(err)
          } else {
            var jsonObj = []
            const csvFilePath = './uploads/' + filename
            var err = {
              projectId: { row: [], notExistsRow: [] },
              dateAdded: { row: [] },
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
            .then(csv => {
              jsonObj = csv // pass values from csv file into jsonObj object, so that they can be used by subsequent functions
            })
            .then(script => err = validateFields(jsonObj, err)) // check that fields are not empty or too long
            .then(script => jsonObj = updateDate(jsonObj)) // format date field
            .then(script => err = checkForProject(jsonObj, err)) // check project exists
            .then(script => err = checkForCategory(jsonObj, err)) // check category exists
            // .then(script => jsonObj = updateCat(jsonObj)) // format category field. Currently not working
            .then(setTimeout(waitForQueries => {
              if (err.summarise) { // if error checking has returned errors
                setTimeout(wait => { res.render('./bulkupload.html', { err }) }, 80) // display errors
              } else { // if no errors
                for (let i = 0; i < jsonObj.length; i++) {
                  queries
                    .searchCategories
                    .getByName(jsonObj[i].Category)
                    .then(cat => {
                      jsonObj[i].Category = cat[0].category_id
                      // does not work currently since i always resolves to 9

                      queries.createLesson(jsonObj[i].ProjectID, jsonObj[i].LessonDateAdded,
                        jsonObj[i].Category, jsonObj[i].WWW_EBI_ID, jsonObj[i].LessonIdentifiedBy,
                        jsonObj[i].LessonIdentifiersArea, jsonObj[i].LessonHowIdentifed,
                        jsonObj[i].Summary, jsonObj[i].LessonDescription)
                        .then()
                        rowsAdded = i + 1
                    })

                  // add lessons to database

                }
                setTimeout(wait => { res.render('./bulkupload.html', { rowsAdded }) }, 80) // display success
              }
            }, 80) /* Application must wait before proceeding, to allow time for
                   queries to return errors. Otherwise, asynchronous
                   operation will continue to create lessons without waiting
                   for the result of error checks. */
            )
          }
        })
      }
    }
  })
}

function validateFields(jsonObj, err) {
  for (let i = 0; i < jsonObj.length; i++) {
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

    if(jsonObj[i].LessonDateAdded === '') {
      err.dateAdded.blank = true
      err.dateAdded.row[i] = i + 2
      err.summarise = true
    }

    var ddRegEx = /\d\d(\/|-|.)\d\d(\/|-|.)\d\d\d\d/g
    var yyyyRegEx = /\d\d\d\d(\/|-|.)\d\d(\/|-|.)\d\d/g
    var dateAdded

    if(ddRegEx.test(jsonObj[i].LessonDateAdded)) {
      // Format dd/mm/yyyy. next line swaps mm and dd fields to create Date object
      dateAdded = new Date(jsonObj[i].LessonDateAdded.substr(3, 2)+"/"+jsonObj[i].LessonDateAdded.substr(0, 2)+"/"+jsonObj[i].LessonDateAdded.substr(6, 4))
    } else if(yyyyRegEx.test(jsonObj[i].LessonDateAdded)) {
      // Format yyyy-mm-dd
      dateAdded = new Date(jsonObj[i].LessonDateAdded)
    }

    if(dateAdded == "Invalid Date" || dateAdded == undefined) {
      err.dateAdded.format = true
      err.dateAdded.row[i] = i + 2
      err.summarise = true
    }

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
  return err
}

function updateDate(jsonObj) {
  for (let i = 0; i < jsonObj.length; i++) {
    var ddRegEx = /\d\d(\/|-|.)\d\d(\/|-|.)\d\d\d\d/g
    var yyyyRegEx = /\d\d\d\d(\/|-|.)\d\d(\/|-|.)\d\d/g

    if(ddRegEx.test(jsonObj[i].LessonDateAdded)) {
      // Format dd/mm/yyyy. next line swaps mm and dd fields to create Date object
      let dateAdded = new Date(jsonObj[i].LessonDateAdded.substr(3, 2)+"/"+jsonObj[i].LessonDateAdded.substr(0, 2)+"/"+jsonObj[i].LessonDateAdded.substr(6, 4))
      jsonObj[i].LessonDateAdded = dateAdded
    } else if(yyyyRegEx.test(jsonObj[i].LessonDateAdded)) {
      // Format yyyy-mm-dd
      let dateAdded = new Date(jsonObj[i].LessonDateAdded)
      jsonObj[i].LessonDateAdded = dateAdded
    }
  }
  return jsonObj
}

function checkForProject(jsonObj, err) {
  for (let i = 0; i < jsonObj.length; i++) {
    queries.searchProjects.checkProjectExists(jsonObj[i].ProjectID)
      .then(project => {
        if (project[0].count === 0) {
          err.projectId.notExists = true
          err.projectId.notExistsRow[i] = i + 2
          err.summarise = true
        }
      })
  }
  return err
}

function checkForCategory(jsonObj, err) {
  for (let i = 0; i < jsonObj.length; i++) {
    queries.searchCategories.getByName(jsonObj[i].Category)
      .then(cat => {
        if (cat === []) {
          err.category.notExists = true
          err.category.notExistsRow[i] = i + 2
          err.summarise = true
        }
      })
  }
  return err
}

function updateCat(jsonObj) {
  for (let i = 0; i < jsonObj.length; i++) {
    queries
      .searchCategories
      .getByName(jsonObj[i].Category)
      .then(cat => {
        jsonObj[i] = cat[0].category_id
        // does not work currently since i always resolves to 9
      })
  }
  return jsonObj
}
