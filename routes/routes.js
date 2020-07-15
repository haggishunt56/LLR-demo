const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const router = express.Router();
const queries = require('../app/db/queries');

//return raw json with full details of all lessons in the table
router.get('/lessondetails', (req, res) => {
  queries
    .Lessons
    .getAll()
    .then(lesson_details => {
      res.json(lesson_details);
    });
});

//return full detail of a single lesson rendered onto html page
router.get('/:proj_id-:les_id', (req, res) => {
  queries
    .searchLessons
    .getByProjectLesson(req.params.proj_id, req.params.les_id)
    .then(lesson_details => {
      //res.json(lesson_details);
      res.render('view/lesson_details.html', {lesson_details});
    });
});

//render home page
router.get('/home', (req, res) => {
  res.render('home.html');
});

//render searchwhat page
router.get('/search', (req,res) => {
  res.render('search/searchwhat.html');
});

//handle responses to search forms
router.post('/search', (req, res) => {
  if (req.body.lessonproject == 'lesson') {
    res.render('search/lessons.html');
  }
  else if (req.body.lessonproject == 'project') {
    res.render('search/projects.html');
  }
  else if (JSON.stringify(req.body) === '{}') {
    //res.send(req.body);
    res.render('search/searchwhat.html'); //TODO validation and error message
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
          res.render('search/lessons.html', {lesson_details, reqjson});
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
          res.render('search/projects.html', {project_details, reqjson});
        });
  };
});

//TOTO return project search results

//render createwhat page
router.get('/create', (req, res) => {
  res.render('create/createwhat.html');
});

//handle responses to create forms
router.post('/create', (req, res) => {
  if (req.body.lessonproject == 'lesson') {
    res.render('create/lesson.html');
  }
  else if (req.body.lessonproject == 'project') {
    res.render('create/project.html');
  }
  else if (JSON.stringify(req.body) === '{}') {
    res.render('create/createwhat.html'); //TODO validation and error message
  }
  else if ('targetDateDay' in req.body) { //create lesson

    if (req.body.lesson_type_ebi == "ebi") {
      var lesson_type = "ebi";
    }
    else if (req.body.lesson_type_www == "www") {
      var lesson_type = "www";
    }
    else {
      var lesson_type = "";
    }
    queries
      .createLesson(req.body.projectTpNum, req.body.lessonCategory,
        lesson_type, req.body.identifiedBy, req.body.identifiedByArea,
        req.body.howIdentified, req.body.summary, req.body.details,
        req.body.targetDateDay, req.body.targetDateMonth,
        req.body.targetDateYear)
      .then(
        createLesson => {
          res.render('create/lessonsuccess.html', {createLesson});
          //res.send(createLesson);
      });
  }
  else { //create project
    queries
      .createProject(req.body.projectName, req.body.projectTpNum,
        req.body.dateStartedDay, req.body.dateStartedMonth,
        req.body.dateStartedYear, req.body.dateClosedDay,
        req.body.dateClosedMonth, req.body.dateClosedYear, req.body.portfolio,
        req.body.SRM, req.body.status)
      .then(
        createProject => {
          res.render('create/projectsuccess.html', {createProject});
      });
  };
});

//send bulk upload form as download
router.get('/file/bulkupload', function (req, res) {
  res.download('./app/views/LLR_upload_form_v0.0.xls');
});

module.exports = router;
