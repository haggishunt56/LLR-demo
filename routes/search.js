const queries = require('../app/db/queries')

module.exports = function (router) {

  //render searchwhat page
  router.get('/search', (req,res) => {
    res.render('search/searchwhat.html');
  });

  //handle input on search forms
  router.post('/search', (req, res) => {
    if (req.body.lessonproject == 'lesson') {
      res.render('search/search_lessons.html');
    }
    else if (req.body.lessonproject == 'project') {
      res.render('search/search_projects.html');
    }
    else if (JSON.stringify(req.body) === '{}') {
      //res.send(req.body);
      var err = '{ "error" : "noSelection" }';
      res.render('search/searchwhat.html', {err});
    }
    else if ('projectName' in req.body) { //search lessons
      const reqjson = req.body;
      queries
        .searchLessons
        .getBySearchFields(reqjson.lessonName, reqjson.projectName,
          reqjson.portfolio, reqjson.category, reqjson.lessonType,
          reqjson.dateFromDay, reqjson.dateFromMonth, reqjson.dateFromYear,
          reqjson.dateToDay, reqjson.dateToMonth, reqjson.dateToYear)
        .then(
          lesson_details => {
            res.render('search/search_lessons.html', {lesson_details, reqjson});
            //res.send(lesson_details);
            //res.send(reqjson);
        });
    }
    else { //search projects
      const reqjson = req.body;
      queries
        .searchProjects
        .getBySearchFields(reqjson.projectName_proj, reqjson.portfolio, reqjson.status,
          reqjson.dateFromDay, reqjson.dateFromMonth, reqjson.dateFromYear,
          reqjson.dateToDay, reqjson.dateToMonth, reqjson.dateToYear)
        .then(
          project_details => {
            res.render('search/search_projects.html', {project_details, reqjson});
          });
    };
  });

}
