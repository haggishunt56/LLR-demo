const queries = require('../app/db/queries')

module.exports = function (router) {

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

    if (req.body.www_ebi == "") {
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
          req.body.month_added, req.body.year_added, req.body.category, req.body.www_ebi,
          req.body.identified_by, req.body.identifiers_area, req.body.how_identified,
          req.body.username, req.body.summary, req.body.description, req.body.target_date_day,
          req.body.target_date_month, req.body.target_date_year)
        .then(lesson_details => {
          queries
            .searchLessons
            .getByProjectLesson(req.params.proj_id, req.params.les_id)
            .then(lesson_details => {
              //res.json(lesson_details);
              res.render('update/update_lesson_success.html', {lesson_details});
        });
      });
    }
  });


}
