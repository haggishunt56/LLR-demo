const queries = require('../app/db/queries')

module.exports = function (router) {

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
        let err = {summarise:{}, projectName:{}, projectTpNum:{}, portfolio:{}, srm:{}, status:{}, dateStarted:{}}; //TODO include start and close date

        if (req.body.projectName == "") {
          err.projectName.blank = true;
          err.summarise = true;
        }
        if (req.body.projectName.length > 100) {
          err.projectName.tooLong = true;
          err.summarise = true;
        }

        if (req.body.projectTpNum == "") {
          err.projectTpNum.blank = true;
          err.summarise = true;
        }
        else if (req.body.projectTpNum.length > 6) {
          err.projectTpNum.tooLong = true;
          err.summarise = true;
        }

        if (req.body.dateStartedDay == "" || req.body.dateStartedMonth == "" ||
            req.body.dateStartedYear == "") {
          err.dateStarted.blank = true;
          err.summarise = true;
        }

        if (req.body.portfolio == "") {
          err.portfolio.blank = true;
          err.summarise = true;
        }

        if (req.body.srm == "") {
          err.srm.blank = true;
          err.summarise = true;
        }
        if (req.body.srm.length > 45) {
          err.srm.tooLong = true;
          err.summarise = true;
        }

        if (req.body.status == "") {
          err.status.blank = true;
          err.summarise = true;
        }

        queries
          .searchProjects
            .checkProjectExists(req.body.projectTpNum)
            .then(
              checkProjectExists => {
                if (checkProjectExists[0].count !== '0') {
                  err.projectTpNum.exists = true;
                  err.summarise = true;
                }

                //summarise and send errors
                if (JSON.stringify(err.summarise) !== JSON.stringify({})) {
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

              }
            );

      };
    });

}
