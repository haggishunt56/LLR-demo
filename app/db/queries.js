const knex = require('./knex')
  // TODO - replace 'like' with 'ilike' for PSQL

module.exports = {
  searchActions: {
    getAll: function() {
      // SELECT * FROM action_details;
      return knex('action_details');
    },
    getBySearchFields: function(lessonId, projectName, actionOwner, dateFromDay,
      dateFromMonth, dateFromYear, dateToDay, dateToMonth, dateToYear) {
      let query = knex.select()
        .table('action_details') //SELECT * FROM lesson_details;
        .leftOuterJoin('lesson_details', 'lesson_details.lesson_id', 'action_details.lesson_id')
        .leftOuterJoin('project_details', 'lesson_details.project_tp_num', 'project_details.project_tp_num')
        .orderBy('lesson_id', 'asc');

      if (lessonId !== "") { // include only if field is not blank
        query.where('lesson_details.lesson_id', 'like', `%${lessonId}%`);
      }

      if (projectName !== "") { // include only if field is not blank
        query.where(function() {
          this.where('project_details.project_name', 'like', `%${projectName}%`)
          .orWhere('lesson_details.project_tp_num', 'like', `%${projectName}%`);
        })
      }

      if (actionOwner !== "") { // include only if field is not blank
        query.where('action_details.action_owner', 'like', `%${actionOwner}%`);
      }

      if(dateFromDay !== "" && dateFromMonth !== "" && dateFromYear !== "") { // include only if field is not blank
        // dateFrom = new Date(`${dateFromYear}`, `${dateFromMonth}`-1, `${dateFromDay}`, 0, 0, 0); // PSQL
        dateFrom = '' + `${dateFromYear}` + '-' + `${dateFromMonth}` + '-' + `${dateFromDay}` // sqlite3
        query.where('lesson_details.date_added', '>', dateFrom);
      }

      if(dateToDay !== "" && dateToMonth !== "" && dateToYear !== "") { // include only if field is not blank
        // dateTo = new Date(`${dateToYear}`, `${dateToMonth}`-1, `${dateToDay}`-(-1), 01, 00, 00); // PSQL
        dateTo = '' + `${dateToYear}` + '-' + `${dateToMonth}` + '-' + `${dateToDay}` // sqlite3
        query.where('lesson_details.date_added', '<', dateTo);
      }

      return query
    },
    getByLesson: function(lessonId) {
      let query = knex.select()
        .from('action_details')
        .leftOuterJoin('lesson_details', 'lesson_details.lesson_id', 'action_details.lesson_id')
        .where('action_details.lesson_id', lessonId);
      return query
    },
    getById: function(id) {
      let query = knex.select()
        .from('action_details')
        .leftOuterJoin('lesson_details', 'lesson_details.lesson_id', 'action_details.lesson_id')
        .where('action_id', id);
      return query;
    }
  },
  searchLessons: {
    getAll: function() {
      //SELECT * FROM lesson_details;
      return knex('lesson_details');
    },
    searchForParam: function(arg) {
      let query = knex.select()
        .table('lesson_details')
        .leftOuterJoin('project_details', 'project_details.project_tp_num', 'lesson_details.project_tp_num')
        .leftOuterJoin('portfolio_details', 'project_details.portfolio', 'portfolio_details.portfolio_id')
        .leftOuterJoin('user_details', 'user_details.userid', 'lesson_details.uploaded_by')
        // .where('lesson_details.lesson_id', 'like', `%${arg}%`)
        .where('lesson_details.project_tp_num', 'like', `%${arg}%`)
        .orWhere('project_details.project_name', 'like', `%${arg}%`)
        // .orWhere('lesson_details.date_added', 'like', `%${arg}%`)
        .orWhere('lesson_details.category', 'like',`%${arg}%`)
        .orWhere('lesson_details.www_ebi', 'like', `%${arg}%`)
        .orWhere('lesson_details.identified_by', 'like', `%${arg}%`)
        .orWhere('lesson_details.identifiers_area', 'like', `%${arg}%`)
        .orWhere('lesson_details.how_identified', 'like', `%${arg}%`)
        .orWhere('portfolio_details.portfolio_name', 'like', `%${arg}%`)
        // .orWhere('lesson_details.uploaded_by', 'like', `%${arg}%`)
        // .orWhere('lesson_details.completion_date', 'like', `%${arg}%`)
        .orWhere('lesson_details.summary', 'like', `%${arg}%`)
        .orWhere('lesson_details.description', 'like', `%${arg}%`)
        .orderBy('lesson_id', 'asc');
      return query
    },
    getBySearchFields: function(lessonName, projectName, projectType, portfolio, category,
      type, dateFromDay, dateFromMonth, dateFromYear, dateToDay, dateToMonth,
      dateToYear, includeDeleted) {
      //SELECT * FROM lesson_details WHERE lesson_name = lessonName, project_name = projectName etc...;

      let query = knex.select()
        .table('lesson_details') // SELECT * FROM lesson_details;
        .leftOuterJoin('project_details', 'lesson_details.project_tp_num', 'project_details.project_tp_num')
        .leftOuterJoin('portfolio_details', 'project_details.portfolio', 'portfolio_details.portfolio_id')
        .leftOuterJoin('category_details', 'lesson_details.category', 'category_details.category_id')
        .leftOuterJoin('user_details', 'user_details.userid', 'lesson_details.uploaded_by')
        .orderBy('lesson_id', 'asc');

      if(lessonName !== "") { // include only if field is not blank
        var initStr = `${lessonName}`;
        var lowBound = initStr.replace(/\*/g, '/\d/');
        var upBound = initStr.replace(/\*/g, '9');

        query.where('lesson_details.lesson_id', '=', lowBound); //`%${lessonName}%`
        //query.where('lesson_details.lesson_id', '<=', upBound)
      }

      if(projectName !== "") { // include only if field is not blank
        query.where(function() {
          this.where('project_details.project_name', 'like', `%${projectName}%`)
          .orWhere('lesson_details.project_tp_num', 'like', `%${projectName}%`);
        })
      }

      if(projectType !== "") { // include search param only if field is not blank
        query.where('project_details.project_type', 'like', `%${projectType}%`);
      }

      if(portfolio !== "") { // include search param only if field is not blank
        query.where('portfolio_details.portfolio_name', 'like', `%${portfolio}%`);
      }

      if(category !== "none") { //include only if field is not blank
        query.where('category_details.category_name', 'like', `%${category}%`);
      }

      if(type !== "") { // include only if field is not blank
        if(type === "What went well") {
          type = "WWW";
        }
        else if(type === "Even better if") {
          type = "EBI";
        }
        query.where('lesson_details.www_ebi', 'like', `%${type}%`);
      }

      if(dateFromDay !== "" && dateFromMonth !== "" && dateFromYear !== "") { // include only if field is not blank
        // dateFrom = new Date(`${dateFromYear}`, `${dateFromMonth}`-1, `${dateFromDay}`, 0, 0, 0); // PSQL
        dateFrom = '' + `${dateFromYear}` + '-' + `${dateFromMonth}` + '-' + `${dateFromDay}` // sqlite3
        query.where('lesson_details.date_added', '>', dateFrom);
      }

      if(dateToDay !== "" && dateToMonth !== "" && dateToYear !== "") { // include only if field is not blank
        // dateTo = new Date(`${dateToYear}`, `${dateToMonth}`-1, `${dateToDay}`-(-1), 01, 00, 00); // PSQL
        dateTo = '' + `${dateToYear}` + '-' + `${dateToMonth}` + '-' + `${dateToDay}` // sqlite3
        query.where('lesson_details.date_added', '<', dateTo);
      }

      if(!includeDeleted) {
        query.where('lesson_details.deleted', 0)
      }

      return query;

    },
    getByProjectLesson: function(project, lesson) {
      let query = knex.select(
          // knex.raw('lesson_details.lesson_id, lesson_details.project_tp_num, lesson_details.date_added, lesson_details.category, lesson_details.www_ebi, lesson_details.identified_by, lesson_details.identifiers_area, lesson_details.how_identified, user_details.username, lesson_details.summary, lesson_details.description, lesson_details.deleted, project_details.project_name, portfolio_details.portfolio_name'),
          // knex.raw('EXTRACT(YEAR FROM date_added) as year_added'),
          // knex.raw('EXTRACT(MONTH FROM date_added) as month_added'),
          // knex.raw('EXTRACT(DAY FROM date_added) as day_added')
          // knex.raw('EXTRACT(YEAR FROM target_date) as target_year'),
          // knex.raw('EXTRACT(MONTH FROM target_date) as target_month'),
          // knex.raw('EXTRACT(DAY FROM target_date) as target_day')
        )
        .from('lesson_details')
        .leftOuterJoin('project_details', 'project_details.project_tp_num', 'lesson_details.project_tp_num')
        .leftOuterJoin('portfolio_details', 'project_details.portfolio', 'portfolio_details.portfolio_id')
        .leftOuterJoin('category_details', 'lesson_details.category', 'category_details.category_id')
        // .join('user_details', 'user_details.userid', 'lesson_details.uploaded_by')
        //.where('lesson_details.project_tp_num', project)
        .where('lesson_id', lesson)
        .orderBy('lesson_id', 'asc');
      ;

      return query;
    },
    getByProject: function(project) {
      return knex.select(
        // knex.raw('lesson_details.lesson_id, lesson_details.project_tp_num, lesson_details.date_added, lesson_details.category, lesson_details.www_ebi, lesson_details.identified_by, lesson_details.identifiers_area, lesson_details.how_identified, user_details.username, lesson_details.summary, lesson_details.description, lesson_details.deleted')
        // knex.raw('EXTRACT(YEAR FROM date_added) as year_added'),
        // knex.raw('EXTRACT(MONTH FROM date_added) as month_added'),
        // knex.raw('EXTRACT(DAY FROM date_added) as day_added')
      )
        .from('lesson_details')
        .leftOuterJoin('category_details', 'category_details.category_id', 'lesson_details.category')
        .where('lesson_details.project_tp_num', project)
        .orderBy('lesson_id', 'asc');
      ;
    },
    getByCategory: function(category, dateFrom) {
      let query = knex.select()
        .table('lesson_details')
        .leftOuterJoin('category_details', 'lesson_details.category', 'category_details.category_id')
        .where('category_details.category_name', 'like', `%${category}%`)
        .where('lesson_details.date_added', '>', dateFrom)
        .leftOuterJoin('project_details', 'project_details.project_tp_num', 'lesson_details.project_tp_num')
        .leftOuterJoin('portfolio_details', 'project_details.portfolio', 'portfolio_details.portfolio_id')
        .leftOuterJoin('user_details', 'user_details.userid', 'lesson_details.uploaded_by')
        .orderBy('lesson_id', 'asc');
      return query
    },
    getRecentlyAdded: function() {
      let query = knex.select()
        .table('lesson_details')
        .leftOuterJoin('user_details', 'user_details.userid', 'lesson_details.uploaded_by')
        .orderBy('date_added', 'desc')
        .limit(5);
      return query
    }
  },
  searchProjects: {
    getBySearchFields: function(projectName, portfolio, status, dateFromDay,
      dateFromMonth, dateFromYear, dateToDay, dateToMonth, dateToYear, includeDeleted) {

      let query = knex.select().table('project_details') //SELECT * FROM project_details
        .leftOuterJoin('portfolio_details', 'project_details.portfolio', 'portfolio_details.portfolio_id')

      if (projectName !== "") { //include only if search field is not blank
        query.where(function() {
          this.where('project_details.project_name', 'like', `%${projectName}%`)
            .orWhere('project_details.project_tp_num', 'like', `%${projectName}%`)
          })
      }

      if(portfolio !== "") { //include search param only if field is not blank
        query.where('portfolio_details.portfolio_name', 'like', `%${portfolio}%`);
      }

      if (status !== "") { //include only if field is not blank
        query.where('project_details.status', 'like', `%${status}%`);
      }

      if(dateFromDay !== "") { //include only if field is not blank
        // dateFrom = new Date(`${dateFromYear}`, `${dateFromMonth}`-1, `${dateFromDay}`, 0, 0, 0); // PSQL
        dateFrom = '' + `${dateFromYear}` + '-' + `${dateFromMonth}` + '-' + `${dateFromDay}` // sqlite3
        query.where('project_details.start_date', '>', dateFrom);
      }

      if(dateToDay !== "") { //include only if field is not blank
        // dateFrom = new Date(`${dateFromYear}`, `${dateFromMonth}`-1, `${dateFromDay}`, 0, 0, 0); // PSQL
        dateTo = '' + `${dateToYear}` + '-' + `${dateToMonth}` + '-' + `${dateToDay}` // sqlite3
        query.where('project_details.start_date', '<', dateTo);
      }

      if(!includeDeleted) {
        query.where('project_details.deleted', 0)
      }

      query.where('project_details.project_type', 'project');

      return query;
    },
    checkProjectExists: function(project) {
      return knex.count('project_tp_num as count')
        .from('project_details')
        .where('project_tp_num', project)
        ;//.as('count');
    },
    getByTpNum: function(project) {

      return knex.select(
        // '*',
        // knex.raw('EXTRACT(YEAR FROM start_date) as start_year'),
        // knex.raw('EXTRACT(MONTH FROM start_date) as start_month'),
        // knex.raw('EXTRACT(DAY FROM start_date) as start_day'),
        // knex.raw('EXTRACT(YEAR FROM closure_date) as closure_year'),
        // knex.raw('EXTRACT(MONTH FROM closure_date) as closure_month'),
        // knex.raw('EXTRACT(DAY FROM closure_date) as closure_day')
      )
      .leftOuterJoin('portfolio_details', 'project_details.portfolio', 'portfolio_details.portfolio_id')
      .from('project_details')
      .where('project_tp_num', project);
    }
  },
  searchCampaigns: {
    getBySearchFields: function(projectName, portfolio, status, dateFromDay,
      dateFromMonth, dateFromYear, dateToDay, dateToMonth, dateToYear, includeDeleted) {

      let query = knex.select().table('project_details') //SELECT * FROM lesson_details;
        // .leftOuterJoin('project_details', 'project_details.project_tp_num', 'lesson_details.project_tp_num')
        .leftOuterJoin('portfolio_details', 'project_details.portfolio', 'portfolio_details.portfolio_id')
        // .leftOuterJoin('user_details', 'user_details.userid', 'lesson_details.uploaded_by');

      if (projectName !== "") { //include only if search field is not blank
        query.where(function() {
          this.where('project_details.project_name', 'like', `%${projectName}%`)
            .orWhere('project_details.project_tp_num', 'like', `%${projectName}%`)
        })
      }

      if(portfolio !== "") { //include search param only if field is not blank
        query.where('portfolio_details.portfolio_name', 'like', `%${portfolio}%`);
      }

      if (status !== "") { //include only if field is not blank
        query.where('project_details.status', 'like', `%${status}%`);
      }

      if(dateFromDay !== "") { //include only if field is not blank
        //console.log(`${dateFromYear}`, `${dateFromMonth}`, `${dateFromDay}`);
        dateFrom = new Date(`${dateFromYear}`, `${dateFromMonth}`-1, `${dateFromDay}`, 0, 0, 0);
        query.where('project_details.start_date', '>', dateFrom);
      }

      if(dateToDay !== "") { //include only if field is not blank
        dateTo = new Date(`${dateToYear}`, `${dateToMonth}`-1, `${dateToDay}`-(-1), 01, 00, 00);
        query.where('project_details.start_date', '<', dateTo);
      }

      if(includeDeleted == undefined) {
        query.where('project_details.deleted', 'f')
      }

      query.where('project_details.project_type', 'campaign');

      return query;
    }
  },
  searchConferences: {
    getBySearchFields: function(projectName, portfolio, status, dateFromDay,
      dateFromMonth, dateFromYear, dateToDay, dateToMonth, dateToYear, includeDeleted) {

      let query = knex.select().table('project_details') //SELECT * FROM lesson_details;
        // .leftOuterJoin('project_details', 'project_details.project_tp_num', 'lesson_details.project_tp_num')
        .leftOuterJoin('portfolio_details', 'project_details.portfolio', 'portfolio_details.portfolio_id')
        // .leftOuterJoin('user_details', 'user_details.userid', 'lesson_details.uploaded_by');

      if (projectName !== "") { //include only if search field is not blank
        query.where(function() {
          this.where('project_details.project_name', 'like', `%${projectName}%`)
            .orWhere('project_details.project_tp_num', 'like', `%${projectName}%`)
        })
      }

      if(portfolio !== "") { //include search param only if field is not blank
        query.where('portfolio_details.portfolio_name', 'like', `%${portfolio}%`);
      }

      if (status !== "") { //include only if field is not blank
        query.where('project_details.status', 'like', `%${status}%`);
      }

      if(dateFromDay !== "") { //include only if field is not blank
        //console.log(`${dateFromYear}`, `${dateFromMonth}`, `${dateFromDay}`);
        dateFrom = new Date(`${dateFromYear}`, `${dateFromMonth}`-1, `${dateFromDay}`, 0, 0, 0);
        query.where('project_details.start_date', '>', dateFrom);
      }

      if(dateToDay !== "") { //include only if field is not blank
        dateTo = new Date(`${dateToYear}`, `${dateToMonth}`-1, `${dateToDay}`-(-1), 01, 00, 00);
        query.where('project_details.start_date', '<', dateTo);
      }

      if(includeDeleted == undefined) {
        query.where('project_details.deleted', 'f')
      }

      query.where('project_details.project_type', 'conference');

      return query;
    }
  },
  searchPortfolios: {
    getAll: function() {
      return knex('portfolio_details')
      .orderBy([{ column: 'active', order: 'desc' }, { column: 'portfolio_name', order: 'asc' }]);
    },
    getActive: function() {
      return knex('portfolio_details')
      .where('active', 'true')
      .orderBy([{ column: 'active', order: 'desc' }, { column: 'portfolio_name', order: 'asc' }]);
    },
    getById: function(id) {
      return knex('portfolio_details').where('portfolio_id', `${id}`);
    },
    getByName: function(name) {
      let query = knex.select('portfolio_id')
        .from('portfolio_details')
        .where({portfolio_name:name});
      return query
    }
  },
  searchCategories: {
    getAll: function() {
      let query = knex.select().from('category_details')
        .orderBy([{ column: 'category_name', order: 'asc' }]);
      return query
    },
    getById: function(id) {
      return knex('category_details').where('category_id', `${id}`);
    },
    getByName: function(name) {
      return knex('category_details').where('category_name', `${name}`);
    },
    getTrending: function() {
      // PSQL
      // return knex.raw("SELECT category, COUNT(category) volume FROM lesson_details WHERE date_added > now() - interval '1 year' GROUP BY category ORDER BY volume DESC LIMIT 4;")

      // sqlite3
      let query = knex.raw('SELECT category_details.category_name, COUNT(lesson_details.category) AS volume\
        FROM lesson_details\
        LEFT OUTER JOIN category_details ON category_details.category_id = lesson_details.category\
        WHERE date_added > date("now","-24 months")\
        GROUP BY category\
        ORDER BY volume DESC;')

      return query
    }
  },
  createAction: function(lessonId, actionDetails, actionOwner, targetDay, targetMonth, targetYear) {
    let targetDate = (new Date(targetYear, targetMonth - 1, targetDay)).toISOString().slice(0, 19).replace(/-/g, "-").replace("T", " ")
    let query = knex.insert({lesson_id: `${lessonId}`, action_details: `${actionDetails}`,
      action_owner: `${actionOwner}`, target_date: targetDate})
      .into('action_details')
      ;
    return query
  },
  createLesson: function(project_tp_num, dateAdded, category, type, identified_by, identifiers_area,
    how_identified, summary, details) {

      console.log(project_tp_num, dateAdded, category, type, identified_by, identifiers_area,
        how_identified, summary, details)

    return knex.insert({category: `${category}`, date_added: `${dateAdded}`, description: `${details}`,
      how_identified: `${how_identified}`, identified_by: `${identified_by}`,
      identifiers_area: `${identifiers_area}`, project_tp_num: `${project_tp_num}`,
      summary: `${summary}`, uploaded_by: '1', www_ebi: `${type}`})
      //['lesson_id', 'project_tp_num', 'how_identified', 'identified_by', 'identifiers_area', 'date_added']) //returning doesnt work with sqlite
      .into('lesson_details')
    ;

  },
  createProject: function(projectName, projectTpNum, dateAdded, dateClosed, dateClosedExists,
    portfolio, srm, status) {

    if (dateClosedExists) {
      query = knex.raw('INSERT INTO project_details (project_tp_num, project_name, project_type, start_date, closure_date, srm, status, portfolio)\
        SELECT \'' + `${projectTpNum}` + '\',\'' + `${projectName}` + '\', \'project\', \'' + dateAdded + '\', \'' + dateClosed + '\',\'' + `${srm}` + '\',\'' + `${status}` + '\', portfolio_details.portfolio_id\
        FROM portfolio_details WHERE portfolio_name = \'' + `${portfolio}` + '\'\
        ;'
      )
    } //only include value of closed date if data entered
    else {
      query = knex.raw('INSERT INTO project_details (project_tp_num, project_name, project_type, start_date, srm, status, portfolio)\
        SELECT \'' + `${projectTpNum}` + '\',\'' + `${projectName}` + '\', \'project\', \'' + dateAdded + '\', \'' + `${srm}` + '\',\'' + `${status}` + '\', portfolio_details.portfolio_id\
        FROM portfolio_details WHERE portfolio_name = \'' + `${portfolio}` + '\'\
        ;'
      )
    }

    return query;

  },
  createCampaign: function(projectName, projectTpNum, dateAdded, dateClosedDay,
    dateClosedExists, portfolio, srm, status) {

      if (dateClosedExists) {
        query = knex.raw('INSERT INTO project_details (project_tp_num, project_name, project_type, start_date, closure_date, srm, status, portfolio)\
          SELECT \'' + `${projectTpNum}` + '\',\'' + `${projectName}` + '\', \'campaign\', \'' + dateAdded + '\', \'' + dateClosed + '\',\'' + `${srm}` + '\',\'' + `${status}` + '\', portfolio_details.portfolio_id\
          FROM portfolio_details WHERE portfolio_name = \'' + `${portfolio}` + '\'\
          ;'
        )
      } //only include value of closed date if data entered
      else {
        query = knex.raw('INSERT INTO project_details (project_tp_num, project_name, project_type, start_date, srm, status, portfolio)\
          SELECT \'' + `${projectTpNum}` + '\',\'' + `${projectName}` + '\', \'campaign\', \'' + dateAdded + '\', \'' + `${srm}` + '\',\'' + `${status}` + '\', portfolio_details.portfolio_id\
          FROM portfolio_details WHERE portfolio_name = \'' + `${portfolio}` + '\'\
          ;'
        )
      }

      return query;
  },
  createConference: function(projectName, projectTpNum, dateAdded, dateClosed,
    dateClosedExists, portfolio, srm, status) {

      if (dateClosedExists) {
        query = knex.raw('INSERT INTO project_details (project_tp_num, project_name, project_type, start_date, closure_date, srm, status, portfolio)\
          SELECT \'' + `${projectTpNum}` + '\',\'' + `${projectName}` + '\', \'conference\', \'' + dateAdded + '\', \'' + dateClosed + '\',\'' + `${srm}` + '\',\'' + `${status}` + '\', portfolio_details.portfolio_id\
          FROM portfolio_details WHERE portfolio_name = \'' + `${portfolio}` + '\'\
          ;'
        )
      } //only include value of closed date if data entered
      else {
        query = knex.raw('INSERT INTO project_details (project_tp_num, project_name, project_type, start_date, srm, status, portfolio)\
          SELECT \'' + `${projectTpNum}` + '\',\'' + `${projectName}` + '\', \'conference\', \'' + dateAdded + '\', \'' + `${srm}` + '\',\'' + `${status}` + '\', portfolio_details.portfolio_id\
          FROM portfolio_details WHERE portfolio_name = \'' + `${portfolio}` + '\'\
          ;'
        )
      }

      return query;
  },
  createPortfolio: function(name, director, active) {
    return knex.insert({portfolio_name: `${name}`, director_name: `${director}`,
      active: `${active}`}, ['portfolio_name'])
      .into('portfolio_details')
    ;
  },
  createCategory: function(name) {
    return knex.insert({category_name: `${name}`}, ['category_name'])
      .into('category_details')
    ;
  },
  updateAction: function(actionId, actionDetails, actionOwner, targetDay, targetMonth, targetYear) {
    let targetDate = (new Date(targetYear, targetMonth, targetDay)).toISOString().slice(0, 19).replace(/-/g, "-").replace("T", " ")
    let query = knex('action_details')
    .where('action_id', '=', actionId)
    .update({
      action_details: actionDetails,
      action_owner: actionOwner,
      target_date: targetDate
    });
    // .returning('*');
    return query
  },
  updateLesson: function(projectId, lessonId, newTpNum, startDay, startMonth, startYear,
    category, type, identifiedBy, identifiersArea, howIdentified, uploadedBy,
    summary, details) {

    let startDate = new Date(startYear, startMonth, startDay)

    return knex('lesson_details')
      .where('lesson_id', '=', lessonId)
      .update({
        project_tp_num: newTpNum,
        date_added: startYear + '-' + startMonth + '-' + startDay,
        category: category,
        www_ebi: type,
        identified_by: identifiedBy,
        identifiers_area: identifiersArea,
        how_identified: howIdentified,
        summary: summary,
        description: details
      });
      // .returning('*');
  },
  updateProject: function(projectTpNum, projectName, srm, status, portfolio,
    startDate, closeDate, closeDateExists) {

    if (closeDateExists) {
      query = knex.raw('UPDATE project_details\
        SET project_name = \'' + `${projectName}` + '\',\
          start_date = \'' + startDate + '\',\
          closure_date = \'' + closeDate + '\',\
          srm = \'' + `${srm}` + '\',\
          status = \'' + `${status}` + '\',\
          portfolio = \'' + `${portfolio}` + '\'\
        WHERE project_details.project_tp_num = \'' + `${projectTpNum}` + '\';'
      )
    } //only include value of closed date if data entered
    else {
      query = knex.raw('UPDATE project_details\
        SET project_name = \'' + `${projectName}` + '\',\
          start_date = \'' + startDate + '\',\
          srm = \'' + `${srm}` + '\',\
          status = \'' + `${status}` + '\',\
          portfolio = \'' + `${portfolio}` + '\'\
        WHERE project_details.project_tp_num = \'' + `${projectTpNum}` + '\';'
      )
    }

    return query;
  },
  updatePortfolio: function(name, director, active, id) {

    query = knex('portfolio_details')
    .update({
      portfolio_name: `${name}`,
      director_name: `${director}`,
      active: `${active}`
    })
    .where('portfolio_id', `${id}`);

    return query;
  },
  updateCategory: function(name, id) {

    query = knex('category_details')
    .update({
      category_name: `${name}`
    })
    .where('category_id', `${id}`);

    return query;
  },
  deleteAction: function() {
    // TODO
  },
  deleteLessontest: function(lessonId) {
    let query = knex.raw('UPDATE lesson_details SET deleted = 1 WHERE lesson_id = \'' + `${lessonId}` + '\';')

    // ('lesson_details')
    //   .where({lesson_id:lessonId})
    //   .update({deleted:1})
    //   ;
    // //console.log(query)
    return query;
  },
  deleteAction: function(id) {
    return knex('action_details')
      .where({action_id: id})
      .del();
  },
  deleteLesson: function(projectTpNum, lessonId) {
    return knex('lesson_details')
      .where({project_tp_num:projectTpNum, lesson_id:lessonId})
      .del();
  },
  deleteAllProjectLessons: function(projectTpNum) {
    return knex('lesson_details')
      .where({project_tp_num:projectTpNum})
      .del();
  },
  deleteProject: function(projectTpNum) {
    return knex('project_details')
      .where({project_tp_num:projectTpNum})
      .del();
  }
  // reinstateLesson: function(projectTpNum, lessonId) {
  //   return = knex('lesson_details')
  //     .where({project_tp_num:projectTpNum, lesson_id:lessonId})
  //     .update('deleted', 'f');
  // },
  // reinstateAllProjectLessons: function(projectTpNum) {
  //   return = knex('lesson_details')
  //     .where({project_tp_num:projectTpNum})
  //     .update('deleted', 'f');
  // },
  // reinstateProject: function(projectTpNum) {
  //   return = knex('project_details')
  //     .where({project_tp_num:projectTpNum})
  //     .update('deleted', 'f');
  // }
}
