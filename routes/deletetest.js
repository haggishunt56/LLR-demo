const queries = require('../app/db/queries')

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = function (router) {
  router.get('/deletetest', (req, res) => {
    console.log("Outputting Proj2-6 details")
    console.log("__________________________")
    const tpNum = "proj2"
    const lessonId = "6"
    queries
      .searchLessons
      .getByProjectLesson(tpNum, lessonId)
      .then(lesson_details => {
        console.log("deleted?")
        console.log(lesson_details[0].deleted)

        console.log("deleting lesson...")
        queries.deleteLesson(tpNum, lessonId)
          .then(deletecheck => {
            console.log("pulling details...")
            setTimeout(function() {
              queries
                .searchLessons
                .getByProjectLesson(tpNum, lessonId)
                .then(lesson_details2 => {
                  console.log("deleted?")
                  console.log(lesson_details2[0].deleted)

                  console.log("deleting project...")
                  setTimeout(function() {
                    queries.deleteAllProjectLessons(tpNum)
                      .then(deletecheck2 => {
                        console.log("pulling details...")

                        setTimeout(function() {
                          queries
                            .searchLessons
                            .getByProjectLesson(tpNum, lessonId)
                            .then(lesson_details3 => {
                              console.log("deleted?")
                              console.log(lesson_details3[0].deleted)

                              res.json()
                            })
                        }, 2000)
                      })
                  }, 2000)
                })
            }, 2000)
          })




        //res.render('view/view_lesson.html', { lesson_details })
      })
  })
}
