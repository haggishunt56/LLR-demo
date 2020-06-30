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
      res.render('lesson_details.html', {lesson_details});
    });
});

//render home page
router.get('/home', (req, res) => {
  res.render('home.html');
});

//render searchwhat  page
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
    res.render('search/searchwhat.html'); //TODO validation and error message
  }
  else {
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
          //res.send(lesson_details);
      });
  };
});

//TODO render search projects page

//TOTO return project search results

//render createwhat page
router.get('/create', (req, res) => {
  res.render('create/createwhat.html');
});

//handle response to create forms
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
  else {
    reqjson = req.body;
    //res.send(reqjson);

    if (reqjson.lesson_type_ebi == "ebi") {
      var lesson_type = "ebi";
    }
    else if (reqjson.lesson_type_www == "www") {
      var lesson_type = "www";
    }
    else {
      var lesson_type = "";
    }
    //res.send(lesson_type);

    queries
      .createLesson(reqjson.projectTpNum, reqjson.lessonCategory,
        lesson_type, reqjson.identifiedBy, reqjson.identifiedByArea,
        reqjson.howIdentified, reqjson.summary, reqjson.details,
        reqjson.targetDateDay, reqjson.targetDateMonth,
        reqjson.targetDateYear)
      .then(
        createLesson => {
          res.render('create/lessonsuccess.html', {createLesson});
          //res.send(createLesson);
      });
  };
});

//handle route from create leson success to create lesson
router.post('/create/lessonsuccess', (req, res) => {
  router.get('/create/lesson')
})

//render create project page
router.get('/create/project', (req,res) => {
  res.render('create/project.html');
});

//add project to database and show success page
router.post('/create/project', (req, res) => {
  reqjson = req.body;
  queries
    .createProject(reqjson.projectName, reqjson.project_tp_num,
      reqjson.date_started_day, reqjson.date_started_month,
      reqjson.date_started_year, reqjson.date_closed_day,
      reqjson.date_closed_month, reqjson.date_closed_year, reqjson.portfolio,
      reqjson.SRM, reqjson.status)
    .then(
      createProject => {
        res.render('create/projectsuccess.html', {createProject});
    })
    ;
});

//send bulk upload form as download
router.get('/file/bulkupload', function (req, res) {
  res.download('./app/views/LLR_upload_form_v0.0.xls');
});

module.exports = router;
