const queries = require('../app/db/queries')

module.exports = function (router) {
  // display bulktest page
  router.get('/bulkupload', (req, res) => {
    res.render('./bulkupload.html')
    // res.download('./app/views/LLR_upload_form_v0.0.xls')
  })

  router.post('/bulkupload', function (req, res) {
    if (req.files) {
      // console.log(req.files)
      var file = req.files.file
      var filename = file.name
      // console.log(filename)

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
              for (var i = 0; i < jsonObj.length; i++) {
                queries.addLessonFromObject(jsonObj[i])
                  .then()
                rowsAdded = i
              }
              res.render('./bulkupload.html', { rowsAdded })
            })
        }
      })
    }
  })
}
