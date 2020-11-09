const queries = require('../app/db/queries')

module.exports = function (router) {
  // display bulktest page
  router.get('/bulktest', (req, res) => {
    res.render('./bulktest.html')
    //res.download('./app/views/LLR_upload_form_v0.0.xls')
  })

  // send bulk upload form as download
  router.post('/bulktest', function (req, res) {

  })

  router.post('/fileuploaddisk',function(req,res){
    if(req.files) {
      // console.log(req.files)
      var file = req.files.file
      var filename = file.name
      // console.log(filename)

      file.mv('./uploads/'+filename, function(err) {
        if(err) {
          res.send(err)
        } else {
          const csv=require('csvtojson')
          const csvFilePath='./uploads/'+filename
          csv()
          .fromFile(csvFilePath)
          .then((jsonObj)=>{
            for(var i = 0; i < jsonObj.length; i++) {
              queries.addLessonFromObject(jsonObj[i])
                // .then(console.log("added"))
              console.log("added")
            }
            res.send("complete")
          })
        }
      })
    }

  });

  // router.get('/blktestnew', (req, res) => {
  //   res.sendFile('C:/Users/Dougie/Documents/projects/testProject/index.html');
  // })
  //
  // router.post('/blktestnew', (req, res) => {
  //   console.log(req.files)
  // })
}
