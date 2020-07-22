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
    res.render('search/searchwhat.html');
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

//render createwhat page
router.get('/create', (req, res) => {
  res.render('create/createwhat.html');
});

//handle responses to create forms
router.post('/create', function (req, res) {

    if (req.body.lessonproject == 'lesson') { //if lesson selected
      return res.render('create/lesson.html'); //display create lesson page
    }

    else if (req.body.lessonproject == 'project') { //if project selected
      return res.render('create/project.html'); //display create project page
    }

    else if (JSON.stringify(req.body) === '{}') { //if nothing selected
      var err = '{ "error" : "noSelection" }';
      return res.render('create/createwhat.html', {err}); //display error
    }

    else if ('targetDateDay' in req.body) { //create lesson

      //test for blank fields
      let err = {};
      if (req.body.projectTpNum == "") {
        err.projectTpNum = true;
      }
      if (req.body.lessonCategory == "") {
        err.lessonCategory = true;
      }
      if (req.body.lessonType == undefined) {
        err.lessonType = true;
      }
      if (req.body.identifiedBy == "") {
        err.identifiedBy = true;
      }
      if (req.body.identifiedByArea == "") {
        err.identifiedByArea = true;
      }
      if (req.body.howIdentified == "") {
        err.howIdentified = true;
      }
      if (req.body.summary == "") {
        err.summary = true;
      }
      if (req.body.details == "") {
        err.details = true;
      }

      //summarise and send errors
      if (JSON.stringify(err) !== JSON.stringify({})) {
        const reqjson = req.body;
        return res.render('create/lesson.html', {err, reqjson});
      }
      else { //query database
        queries
          .createLesson(req.body.projectTpNum, req.body.lessonCategory,
            req.body.lessonType, req.body.identifiedBy, req.body.identifiedByArea,
            req.body.howIdentified, req.body.summary, req.body.details,
            req.body.targetDateDay, req.body.targetDateMonth,
            req.body.targetDateYear)
          .then(
            createLesson => {
              return res.render('create/lessonsuccess.html', {createLesson}); //display success page
              //res.send(createLesson);
            }
          );
      }
    }

    else { //create project TODO - check for duplicate TP NUMs

      //test for blank fields
      let err = {};
      if (req.body.projectName == "") {
        err.projectName = true;
      }
      if (req.body.projectTpNum == "") {
        err.projectTpNum = true;
      }
      if (req.body.dateStartedDay == "") {
        console.log(req.body.dateStartedDay);
        err.dateStartedDay = true;
      }
      if (req.body.dateStartedMonth == "") {
        err.dateStartedMonth = true;
      }
      if (req.body.dateStartedYear == "") {
        err.dateStartedYear = true;
      }
      if (req.body.portfolio == "") {
        err.portfolio = true;
      }
      if (req.body.srm == "") {
        err.srm = true;
      }
      if (req.body.status == "") {
        err.status = true;
      }

      //summarise and send errors
      if (JSON.stringify(err) !== JSON.stringify({})) {
        const reqjson = req.body;
        return res.render('create/project.html', {err, reqjson});
      }
      else { //query db
        queries
          .createProject(req.body.projectName, req.body.projectTpNum,
            req.body.dateStartedDay, req.body.dateStartedMonth,
            req.body.dateStartedYear, req.body.dateClosedDay,
            req.body.dateClosedMonth, req.body.dateClosedYear, req.body.portfolio,
            req.body.SRM, req.body.status)
          .then(
            createProject => {
              return res.render('create/projectsuccess.html', {createProject}); //display success page
            }
          );
      }
    };
  });

//send bulk upload form as download
router.get('/file/bulkupload', function (req, res) {
  res.download('./app/views/LLR_upload_form_v0.0.xls');
});

router.get('/regex', function (req, res) {
  let regTest = /ab*c/;
  let strTest = 'adbc';

  console.log(regTest);
  console.log(strTest);
  console.log(regTest.exec(strTest));

  res.render('home.html');
})

module.exports = router;
