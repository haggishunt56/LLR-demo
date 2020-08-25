const queries = require('../app/db/queries')

module.exports = function (router) {

  //return full detail of a single project rendered onto html page
  router.get('/view/:proj_id', (req, res) => {
    queries
      .searchProjects
      .getByTpNum(req.params.proj_id)
      .then(project_details => {
        //res.json(project_details);
        res.render('view/view_project.html', {project_details});
      });
  });
  
}
