const knex = require('./knex');

module.exports = {
  searchLessons: {
    getAll: function() {
      //SELECT * FROM lesson_details;
      return knex('lesson_details');
    },
    getBySearchFields: function(lessonName, projectName, portfolio, category,
      type, dateFromDay, dateFromMonth, dateFromYear, dateToDay, dateToMonth,
      dateToYear) {
      //SELECT * FROM lesson_details WHERE lesson_name = lessonName, project_name = projectName etc...;

      let query = knex.select().table('lesson_details') //SELECT * FROM lesson_details;
        .leftOuterJoin('project_details', 'project_details.project_tp_num', 'lesson_details.project_tp_num')
        .leftOuterJoin('portfolio_details', 'project_details.portfolio', 'portfolio_details.portfolio_id')
        .leftOuterJoin('user_details', 'user_details.userid', 'lesson_details.uploaded_by')
        .orderBy('lesson_id', 'asc');

      if(lessonName !== "") { //include only if field is not blank
        var initStr = `${lessonName}`;
        var lowBound = initStr.replace(/\*/g, '/\d/');
        var upBound = initStr.replace(/\*/g, '9');

        query.where('lesson_details.lesson_id', '=', lowBound); //`%${lessonName}%`
        //query.where('lesson_details.lesson_id', '<=', upBound)
      }

      if(projectName !== "") { //include only if field is not blank
        var initStr = `${projectName}`;
        var newStr = initStr.replace(/\*/g, '%'); //use * as wildcard (% also works)

        query.where(function() {
          this.where('lesson_details.project_tp_num', 'ilike', newStr)
          .orWhere('project_details.project_name', 'ilike', newStr)
        });
      }

      if(portfolio !== "") {
        query.where('portfolio_details.portfolio_name', 'ilike', `%${portfolio}%`);
      } //include search param only if field is not blank

      if(category !== "") { //include only if field is not blank
        query.where('lesson_details.category', 'ilike', `%${category}%`);
      }

      if(type !== "") { //include only if field is not blank
        if(type === "What went well") {
          type = "WWW";
        }
        else if(type === "Even better if") {
          type = "EBI";
        }
        query.where('lesson_details.www_ebi', 'ilike', `%${type}%`);
      }

      if(dateFromDay !== "") { //include only if field is not blank
        //console.log(`${dateFromYear}`, `${dateFromMonth}`, `${dateFromDay}`);
        dateFrom = new Date(`${dateFromYear}`, `${dateFromMonth}`-1, `${dateFromDay}`, 0, 0, 0);
        query.where('lesson_details.date_added', '>', dateFrom);
      }

      if(dateToDay !== "") { //include only if field is not blank
        dateTo = new Date(`${dateToYear}`, `${dateToMonth}`-1, `${dateToDay}`-(-1), 01, 00, 00);
        query.where('lesson_details.date_added', '<', dateTo);
      }

      return query;

    },
    getByProjectLesson: function(project,lesson) {
      // TODO - update comment below. this is no longer all the query does.
      //SELECT * FROM lesson_details WHERE project_tp_num = [arg], lesson_id = [arg];
      return knex.select(
          '*',
          knex.raw('EXTRACT(YEAR FROM date_added) as year_added'),
          knex.raw('EXTRACT(MONTH FROM date_added) as month_added'),
          knex.raw('EXTRACT(DAY FROM date_added) as day_added'),
          knex.raw('EXTRACT(YEAR FROM target_date) as target_year'),
          knex.raw('EXTRACT(MONTH FROM target_date) as target_month'),
          knex.raw('EXTRACT(DAY FROM target_date) as target_day')
        )
        .from('lesson_details')
        .leftOuterJoin('project_details', 'project_details.project_tp_num', 'lesson_details.project_tp_num')
        .leftOuterJoin('portfolio_details', 'project_details.portfolio', 'portfolio_details.portfolio_id')
        .leftOuterJoin('user_details', 'user_details.userid', 'lesson_details.uploaded_by')
        .where('lesson_details.project_tp_num', project)
        .where('lesson_id', lesson)
      ;
    }
  },
  searchProjects: {
    getBySearchFields: function(projectName, portfolio, status, dateFromDay,
      dateFromMonth, dateFromYear, dateToDay, dateToMonth, dateToYear) {

      let query = knex.select().table('project_details') //SELECT * FROM lesson_details;
        // .leftOuterJoin('project_details', 'project_details.project_tp_num', 'lesson_details.project_tp_num')
        .leftOuterJoin('portfolio_details', 'project_details.portfolio', 'portfolio_details.portfolio_id')
        // .leftOuterJoin('user_details', 'user_details.userid', 'lesson_details.uploaded_by');

      if (projectName !== "") { //include only if search field is not blank
        query.where(function() {
          this.where('project_details.project_name', 'ilike', `%${projectName}%`)
            .orwhere('project_details.project_tp_num', 'ilike', `%${projectName}%`)
        })
      }

      if(portfolio !== "") { //include search param only if field is not blank
        query.where('portfolio_details.portfolio_name', 'ilike', `%${portfolio}%`);
      }

      if (status !== "") { //include only if field is not blank
        query.where('project_details.status', 'ilike', `%${status}%`);
      }

      if(dateFromDay !== "") { //include only if field is not blank
        //console.log(`${dateFromYear}`, `${dateFromMonth}`, `${dateFromDay}`);
        dateFrom = new Date(`${dateFromYear}`, `${dateFromMonth}`-1, `${dateFromDay}`, 0, 0, 0);
        query.where('lesson_details.start_date', '>', dateFrom);
      }

      if(dateToDay !== "") { //include only if field is not blank
        dateTo = new Date(`${dateToYear}`, `${dateToMonth}`-1, `${dateToDay}`-(-1), 01, 00, 00);
        query.where('lesson_details.start_date', '<', dateTo);
      }

      return query;
    },
    getByTpNum: function(project) {

      return knex.select(
        '*',
        knex.raw('EXTRACT(YEAR FROM start_date) as start_year'),
        knex.raw('EXTRACT(MONTH FROM start_date) as start_month'),
        knex.raw('EXTRACT(DAY FROM start_date) as start_day'),
        knex.raw('EXTRACT(YEAR FROM closure_date) as closure_year'),
        knex.raw('EXTRACT(MONTH FROM closure_date) as closure_month'),
        knex.raw('EXTRACT(DAY FROM closure_date) as closure_day')
      )
      .from('project_details')
      .where('project_tp_num', project)
      ;
    }
  },
  createLesson: function(project_tp_num, category, type, identified_by, identifiers_area,
    how_identified, summary, details, target_date_day, target_date_month, target_date_year) {

    let dateAdded = (new Date()).toISOString().slice(0, 19).replace(/-/g, "/").replace("T", " ");
    let targetDate = new Date(`${target_date_year}`, `${target_date_month}`, `${target_date_day}`, 0, 0, 0);
    //INSERT INTO lesson_details VALUES [args]

    return knex.insert({category: `${category}`, date_added: dateAdded, description: `${details}`,
      how_identified: `${how_identified}`, identified_by: `${identified_by}`,
      identifiers_area: `${identifiers_area}`, project_tp_num: `${project_tp_num}`,
      summary: `${summary}`, target_date: targetDate, uploaded_by: '1', www_ebi: `${type}`}, ['lesson_id', 'project_tp_num'])
      .into('lesson_details')
    ;
  },
  createProject: function(projectName, projectTpNum, dateStartedDay,
    dateStartedMonth, dateStartedYear, dateClosedDay, dateClosedMonth,
    dateClosedYear, portfolio, srm, status) {

    var startDate = new Date(`${dateStartedYear}`, `${dateStartedMonth}`, `${dateStartedDay}`, 0, 0, 0);
    var closedDate = new Date(`${dateClosedYear}`, `${dateClosedMonth}`, `${dateClosedDay}`, 0, 0, 0);

    return knex.insert({project_tp_num: `${projectTpNum}`, project_name: `${projectName}`,
      start_date: startDate, closure_date: closedDate, srm: `${srm}`, status:`${status}`,
       portfolio:'1'}, ['project_tp_num'])
      .into('project_details')
    ;
  },
  updateLesson: function(projectId, lessonId, startDay, startMonth, startYear,
    category, type, identifiedBy, identifiersArea, howIdentified, uploadedBy,
    summary, details, targetDateDay, targetDateMonth, targetDateYear) {

    let targetDate = new Date(targetDateYear, targetDateMonth, targetDateDay);
    let startDate = new Date(startYear, startMonth, startDay);

    return knex('lesson_details')
      .where('lesson_id', '=', lessonId)
      .update({
        category: category,
        www_ebi: type,
        identified_by: identifiedBy,
        identifiers_area: identifiersArea,
        how_identified: howIdentified,
        target_date: targetDate,
        summary: summary,
        description: details
      })
      .returning(['*']);
  },
  updateProject: function(projectTpNum, projectName, srm, status, portfolio,
    startDateDay, startDateMonth, startDateYear, closeDateDay, closeDateMonth,
    closeDateYear) {

      let startDate = new Date(startDateYear, startDateMonth, startDateDay);
      let closeDate = new Date(closeDateYear, closeDateMonth, closeDateDay);

      return knex('project_details')
      .where('project_tp_num', '=', projectTpNum)
      .update({
        project_name: projectName,
        start_date: startDate,
        srm: srm,
        status: status,
        portfolio: portfolio,
        closure_date: closeDate
      })
      .returning(['project_tp_num', 'project_name', 'start_date', 'closure_date',
        'srm', 'status', 'portfolio']);
  },
  deleteLesson: function(projectTpNum, lessonId) {
    let query = knex('lesson_details')
      .del()
      .where({project_tp_num:projectTpNum, lesson_id:lessonId});

    return query;
  },
  deleteProject: function(projectTpNum) {
    console.log("working 2...");
    let query = knex('project_details')
      .del()
      .where({project_tp_num:projectTpNum});

      console.log("working 3...");
    return query;
  }
}
