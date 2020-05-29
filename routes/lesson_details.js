const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const router = express.Router();
const queries = require('../app/db/queries');

router.get('/lessondetails', (req, res) => {
  queries
    .lessons
    .getAll()
    .then(lesson_details => {
      res.json(lesson_details);
    });
});

router.get('/lessondetails/:proj_id', (req, res) => {
  queries
    .lessons
    .getByProject(req.params.proj_id)
    .then(lesson_details => {
      res.json(lesson_details);
    });
});

router.get('/:proj_id-:les_id', (req, res) => {
  queries
    .lessons
    .getByProjectLesson(req.params.proj_id, req.params.les_id)
    .then(lesson_details => {
      res.render('lesson_details.html', {lesson_details});
    });
});

router.get('/search', (req, res) => {
  res.render('srch.html');
});

router.post('/search', (req, res) => {
  const reqjson = req.body;
  queries
    .lessons
    .getByProject(reqjson.project_name)
    .then(lesson_details => {
      res.render('srch.html', {lesson_details});
      //res.send(lesson_details[1].date_added);
    });
});

module.exports = router;
