const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const router = express.Router();
const queries = require('../app/db/queries');

//return raw json with full details of all lessons in the table
router.get('/lessondetails', (req, res) => {
  queries
    .searchLessons
    .getAll()
    .then(lesson_details => {
      res.json(lesson_details);
    });
});

//return raw json with full details of all lessons related to a single project
router.get('/lessondetails/:proj_id', (req, res) => {
  queries
    .searchLessons
    .getByProject(req.params.proj_id)
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

//render search page
router.get('/searchlesson', (req, res) => {
  res.render('srch.html');
});

//render data onto results table when a user searches for a lesson
router.post('/searchlesson', (req, res) => {
  const reqjson = req.body;
  queries
    .searchLessons
    .getBySearchFields(reqjson.lesson_name, reqjson.project_name,
      reqjson.portfolio, reqjson.category, reqjson.lesson_type,
      reqjson.date_from_day, reqjson.date_from_month, reqjson.date_from_year,
      reqjson.date_to_day, reqjson.date_to_month, reqjson.date_to_year)
    .then(
      lesson_details => {
        res.render('srch.html', {lesson_details, reqjson});
        //res.send(lesson_details);
    });
});

//render home page
router.get('/home', (req, res) => {
  res.render('hom.html');
});

router.get('/createlesson', (req,res) => {
  res.render('createlssn.html');
});

router.post('/createlesson', (req, res) => {
  reqjson = req.body;
  //res.send(reqjson);

  if (reqjson.lesson_type_ebi = "ebi") {
    var lesson_type = "ebi";
  }
  else if (reqjson.lesson_type_www = "www") {
    var lesson_type = "www";
  }
  else {
    var lesson_type = "";
  }
  //res.send(lesson_type);

  queries
    .createLesson
    .createLesson(reqjson.project_tp_num, reqjson.lesson_category,
      lesson_type, reqjson.identified_by, reqjson.identified_by_area,
      reqjson.how_identified, reqjson.summary, reqjson.details,
      reqjson.target_date_day, reqjson.target_date_month,
      reqjson.target_date_year)
    .then(
      createLesson => {
        res.render('create_lesson_success.html', {createLesson});
        //res.send(createLesson);
    });
});

//send bulk upload form as download
router.get('/file/bulkupload', function (req, res) {
  res.download('./app/views/LLR_upload_form_v0.0.xls');
});

module.exports = router;
