const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const router = express.Router();
const queries = require('../app/db/queries');

//return raw json with full details of all lessons in the table
router.get('/lessondetails', (req, res) => {
  queries
    .lessons
    .getAll()
    .then(lesson_details => {
      res.json(lesson_details);
    });
});

//return raw json with full details of all lessons related to a single project
router.get('/lessondetails/:proj_id', (req, res) => {
  queries
    .lessons
    .getByProject(req.params.proj_id)
    .then(lesson_details => {
      res.json(lesson_details);
    });
});

//return full detail of a single lesson rendered onto html page
router.get('/:proj_id-:les_id', (req, res) => {
  queries
    .lessons
    .getByProjectLesson(req.params.proj_id, req.params.les_id)
    .then(lesson_details => {
      res.render('lesson_details.html', {lesson_details});
    });
});

//render search page when a user enters relevant URL
router.get('/search', (req, res) => {
  res.render('srch.html');
});

//render data onto results table when a user searches for a lesson
router.post('/search', (req, res) => {
  const reqjson = req.body;
   //res.send(reqjson);
   queries
    .lessons
    .getByProject(reqjson.project_name)
    .then(lesson_details => {
      res.render('srch.html', {lesson_details});
      //res.send(lesson_details);
    });
});

//send bulk upload form as download
router.get('/file/bulkupload', function (req, res) {
  res.download('./app/views/llupload.xls');
  console.log(res.headersSent);
});

module.exports = router;
