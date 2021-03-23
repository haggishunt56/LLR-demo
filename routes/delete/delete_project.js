const queries = require('../../app/db/queries')

module.exports = function (router) {
  // display delete project confirmation page
  router.get('/delete/:proj_id', (req, res) => {
    const id = req.params.proj_id
    queries.searchProjects.getByTpNum(id)
      .then(projectDetails => {
        if (projectDetails[0].project_type === 'project') {
          projectDetails[0].isProject = true
        } else if (projectDetails[0].project_type === 'campaign') {
          projectDetails[0].isCampaign = true
        } else if (projectDetails[0].project_type === 'conference') {
          projectDetails[0].isConference = true
        }
        res.render('delete/delete_project.html', { id, projectDetails })
      })
  })

  // handle instruction to delete project
  router.post('/delete/:proj_id', (req, res) => {
    const id = req.params.proj_id

    queries.searchProjects.getByTpNum(id)
      .then(projectDetails => {
        const type = {}
        if (projectDetails[0].project_type === 'project') {
          type.isProject = true
        } else if (projectDetails[0].project_type === 'campaign') {
          type.isCampaign = true
        } else if (projectDetails[0].project_type === 'conference') {
          type.isConference = true
        }
        queries.delete.deleteProject(id)
          .then(rowsDeleted => {
            queries.delete.deleteAllProjectLessons(id)
              .then(deletedLessons => {
                queries.delete.deleteAllProjectActions(id)
                  .then(res.render('delete/delete_project_success.html', { type, id }))
              })
          })
      })
  })
}
