const queries = require('../app/db/queries')

module.exports = function (router) {
  // return full detail of a single project rendered onto html page
  router.get('/view/:proj_id', (req, res) => {
    queries
      .searchProjects
      .getByTpNum(req.params.proj_id)
      .then(project_details => {
        if (project_details[0].project_type === 'project') {
          project_details[0].isProject = true
        } else if (project_details[0].project_type === 'campaign') {
          project_details[0].isCampaign = true
        } else if (project_details[0].project_type === 'conference') {
          project_details[0].isConference = true
        }

        queries
          .searchLessons
          .getByProject(req.params.proj_id)
          .then(lesson_details => {
            res.render('view/view_project.html', { project_details, lesson_details })
          })

      })
  })
}
