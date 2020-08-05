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
router.get('/view/:proj_id-:les_id', (req, res) => {
  queries
    .searchLessons
    .getByProjectLesson(req.params.proj_id, req.params.les_id)
    .then(lesson_details => {
      //res.json(lesson_details);
      res.render('view/view_lesson.html', {lesson_details});
    });
});

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

//render home page
router.get('/home', (req, res) => {
  res.render('home.html');
});

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

//render createwhat page
router.get('/create', (req, res) => {
  res.render('create/createwhat.html');
});

//handle input on create forms
router.post('/create', (req, res) => {

    if (req.body.lessonproject == 'lesson') { //if lesson selected
      return res.render('create/create_lesson.html'); //display create lesson page
    }

    else if (req.body.lessonproject == 'project') { //if project selected
      return res.render('create/create_project.html'); //display create project page
    }

    else if (JSON.stringify(req.body) === '{}') { //if nothing selected
      var err = '{ "error" : "noSelection" }';
      return res.render('create/createwhat.html', {err}); //display error
    }

    else if ('targetDateDay' in req.body) { //create lesson

      //validate fields
      let err = {summarise:{}, projectTpNum:{}, category:{}, lessonType:{},
          identifiedBy:{}, identifiedByArea:{}, howIdentified:{}, summary:{},
          details:{}};

      if (req.body.projectTpNum == "") {
        err.projectTpNum.blank = true;
        err.summarise = true;
      }
      if (req.body.projectTpNum.length > 6){
        err.projectTpNum.tooLong = true;
        err.summarise = true;
      }

      if (req.body.category == "") {
        err.category.blank = true;
        err.summarise = true;
      }
      if (req.body.category.length > 45) {
        err.category.tooLong = true;
        err.summarise = true;
      }

      if (req.body.lessonType == undefined) {
        err.lessonType.blank = true;
        err.summarise = true;
      }

      if (req.body.identifiedBy == "") {
        err.identifiedBy.blank = true;
        err.summarise = true;
      }
      if (req.body.identifiedBy.length > 45) {
        err.identifiedBy.tooLong = true;
        err.summarise = true;
      }

      if (req.body.identifiedByArea == "") {
        err.identifiedByArea.blank = true;
        err.summarise = true;
      }
      if (req.body.identifiedByArea.length > 45) {
        err.identifiedByArea.tooLong = true;
        err.summarise = true;
      }

      if (req.body.howIdentified == "") {
        err.howIdentified.blank = true;
        err.summarise = true;
      }
      if (req.body.howIdentified.length > 128) {
        err.howIdentified.tooLong = true;
        err.summarise = true;
      }

      if (req.body.summary == "") {
        err.summary.blank = true;
        err.summarise = true;
      }
      if (req.body.summary.length > 128) {
        err.summary.tooLong = true;
        err.summarise = true;
      }

      if (req.body.details == "") {
        err.details.blank = true;
        err.summarise = true;
      }
      if (req.body.details.length > 2000) {
        err.details.tooLong = true;
        err.summarise = true;
      }
      console.log(err);

      //summarise and send errors
      if (JSON.stringify(err.summarise) !== JSON.stringify({})) {
        const reqjson = req.body;
        return res.render('create/create_lesson.html', {err, reqjson});
      }

      //query database
      else {
        queries
          .createLesson(req.body.projectTpNum, req.body.category,
            req.body.lessonType, req.body.identifiedBy, req.body.identifiedByArea,
            req.body.howIdentified, req.body.summary, req.body.details,
            req.body.targetDateDay, req.body.targetDateMonth,
            req.body.targetDateYear)
          .then(
            createLesson => {
              return res.render('create/create_lesson_success.html', {createLesson}); //display success page
              //res.send(createLesson);
            }
          );
      }
    }

    else { //create project   //TODO - check for duplicate TP NUMs

      //test for blank fields
      let err = {summary:{}, projectName:{}, projectTpNum:{}, portfolio:{}, srm:{}, status:{}, dateStarted:{}}; //TODO include start and close date

      if (req.body.projectName == "") {
        err.projectName.blank = true;
        err.summary = true;
      }
      if (req.body.projectName.length > 100) {
        err.projectName.tooLong = true;
        err.summary = true;
      }

      if (req.body.projectTpNum == "") {
        err.projectTpNum.blank = true;
        err.summary = true;
      }
      if (req.body.projectTpNum.length > 6) {
        err.projectTpNum.tooLong = true;
        err.summary = true;
      }

      if (req.body.dateStartedDay == "" || req.body.dateStartedMonth == "" ||
          req.body.dateStartedYear == "") {
        err.dateStarted.blank = true;
        err.summary = true;
      }

      if (req.body.portfolio == "") {
        err.portfolio.blank = true;
        err.summary = true;
      }

      if (req.body.srm == "") {
        err.srm.blank = true;
        err.summary = true;
      }
      if (req.body.srm.length > 45) {
        err.srm.tooLong = true;
        err.summary = true;
      }

      if (req.body.status == "") {
        err.status.blank = true;
        err.summary = true;
      }

      //summarise and send errors
      if (JSON.stringify(err.summary) !== JSON.stringify({})) {
        const reqjson = req.body;
        return res.render('create/create_project.html', {err, reqjson});
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
              return res.render('create/create_project_success.html', {createProject}); //display success page
            }
          );
      }
    };
  });

//display update lesson page
router.get('/update/:proj_id-:les_id', (req, res) => {
  const id = req.params;
  queries
    .searchLessons
    .getByProjectLesson(req.params.proj_id, req.params.les_id)
    .then(lesson_details => {
      //res.json(id);
      res.render('update/update_lesson.html', {lesson_details, id});
    }
  );
});

//handle update lesson instruction
router.post('/update/:proj_id-:les_id', (req, res) => {

  const id = req.params;

  //test for blank fields
  let err = {summarise:{}, project_tp_num:{}, day_added:{}, month_added:{},
      year_added:{}, category:{}, type:{}, identified_by:{}, identifiers_area:{},
      how_identified:{}, summary:{}, description:{}};

  if (req.body.project_tp_num == "") {
    err.project_tp_num.blank = true;
    err.summarise = true;
  }
  if (req.body.project_tp_num.length > 6) {
    err.project_tp_num.tooLong = true;
    err.summarise = true;
  }

  if (req.body.day_added == "") {
    err.day_added.blank = true;
    err.summarise = true;
  }
  if (req.body.month_added == "") {
    err.month_added.blank = true;
    err.summarise = true;
  }
  if (req.body.year_added == "") {
    err.year_added.blank = true;
    err.summarise = true;
  }

  if (req.body.category == "") {
    err.category.blank = true;
    err.summarise = true;
  }
  if (req.body.category.length > 45) {
    err.category.tooLong = true;
    err.summarise = true;
  }

  if (req.body.type == "") {
    err.type.blank = true;
    err.summarise = true;
  }

  if (req.body.identified_by == "") {
    err.identified_by.blank = true;
    err.summarise = true;
  }
  if (req.body.identified_by.length > 45) {
    err.identified_by.tooLong = true;
    err.summarise = true;
  }

  if (req.body.identifiers_area == "") {
    err.identifiers_area.blank = true;
    err.summarise = true;
  }
  if (req.body.identifiers_area.length > 45) {
    err.identifiers_area.tooLong = true;
    err.summarise = true;
  }

  if (req.body.how_identified == "") {
    err.how_identified.blank = true;
    err.summarise = true;
  }
  if (req.body.how_identified.length > 128) {
    err.how_identified.tooLong = true;
    err.summarise = true;
  }

  if (req.body.summary == "") {
    err.summary.blank = true;
    err.summarise = true;
  }
  if (req.body.summary.length > 128) {
    err.summary.tooLong = true;
    err.summarise = true;
  }

  if (req.body.description == "") {
    err.description.blank = true;
    err.summarise = true;
  }
  if (req.body.description.length > 2000) {
    err.description.tooLong = true;
    err.summarise = true;
  }

  // summarise and send errors
  if (JSON.stringify(err.summarise) !== JSON.stringify({})) {
    const lesson_details = [{}];
    lesson_details[0] = req.body;
    return res.render('update/update_lesson.html', {err, lesson_details, id});
  }
  else { //update lesson
    queries
      .updateLesson(req.params.proj_id, req.params.les_id, req.body.day_added,
        req.body.month_added, req.body.year_added, req.body.category, req.body.type,
        req.body.identified_by, req.body.identifiers_area, req.body.how_identified,
        req.body.username, req.body.summary, req.body.description, req.body.target_date_day,
        req.body.target_date_month, req.body.target_date_year)
      .then(lesson_details => {
        res.render('update/update_lesson_success.html', {lesson_details});
      }
    );
  }
});

//display update project page
router.get('/update/:proj_id', (req, res) => {
  queries
    .searchProjects
    .getByTpNum(req.params.proj_id)
    .then(project_details => {
      //res.json(project_details);
      res.render('update/update_project.html', {project_details});
    }
  );
});

//handle update project instruction
router.post('/update/:project_tp_num', (req, res) => { //

  //validate empty fields
  let err = {summarise:{}, project_name:{}, srm:{}, portfolio:{}, status:{}};

  if (req.body.project_name == "") {
    err.project_name.blank = true;
    err.summarise = true;
  }
  if (req.body.project_name.length > 100) {
    err.project_name.tooLong = true;
    err.summarise = true;
  }

  if (req.body.start_day == "") {
    err.start_day = true;
  }
  if (req.body.start_month == "") {
    err.start_month = true;
  }
  if (req.body.start_year == "") {
    err.start_year = true;
  }

  if (req.body.srm == "") {
    err.srm.blank = true;
    err.summarise = true;
  }
  if (req.body.srm.length > 45) {
    err.srm.tooLong = true;
    err.summarise = true;
  }

  if (req.body.portfolio == "") {
    err.portfolio.blank = true;
    err.summarise = true;
  }
  if (req.body.portfolio.length > 6) {
    err.portfolio.tooLong = true;
    err.summarise = true;
  }

  if (req.body.status == "") {
    err.status.blank = true;
    err.summarise = true;
  }
  if (req.body.status.length > 6) {
    err.status.tooLong = true;
    err.summarise = true;
  }

  if (JSON.stringify(err.summarise) !== JSON.stringify({})) {
    const project_details = [{}];
    project_details[0] = req.body;
    project_details[0].project_tp_num = req.params.project_tp_num;
    return res.render('update/update_project.html', {err, project_details});
  }
  else {
    queries
      .updateProject(req.params.project_tp_num, req.body.project_name, req.body.srm,
        req.body.status, req.body.portfolio, req.body.start_day, req.body.start_month,
        req.body.start_year, req.body.closure_day, req.body.closure_month,
        req.body.closure_year)
      .then(project_details => {
        res.render('update/update_project_success.html', {project_details});
      }
    );
  }

});

//return full detail of a single lesson rendered onto html page, with success banner
router.get('/success/:proj_id-:les_id', (req, res) => {
  queries
    .searchLessons
    .getByProjectLesson(req.params.proj_id, req.params.les_id)
    .then(lesson_details => {
      //res.json(lesson_details);
      res.render('../views/update/update_lesson_success.html', {lesson_details});
    });
});

//send bulk upload form as download
router.get('/file/bulkupload', function (req, res) {
  res.download('./app/views/LLR_upload_form_v0.0.xls');
});

//regex practice
router.get('/regex', function (req, res) {
  let regTest = /ab*c/;
  let strTest = 'adbc';

  console.log(regTest);
  console.log(strTest);
  console.log(regTest.exec(strTest));

  res.render('home.html');
})

module.exports = router;
