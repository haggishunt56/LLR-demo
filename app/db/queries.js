const knex = require('./knex');

module.exports = {
  searchLessons: {
    getAll: function() {
      //SELECT * FROM lesson_details;
      return knex('lesson_details');
    },
    getBySearchFields: function(lessonName, projectName, projectType, portfolio, category,
      type, dateFromDay, dateFromMonth, dateFromYear, dateToDay, dateToMonth,
      dateToYear, includeDeleted) {
      //SELECT * FROM lesson_details WHERE lesson_name = lessonName, project_name = projectName etc...;

      let query = knex.select()
        .table('lesson_details') //SELECT * FROM lesson_details;
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

      if(projectType !== "") { //include search param only if field is not blank
        query.where('project_details.project_type', 'ilike', `%${projectType}%`);
      }

      if(portfolio !== "") {
        query.where('portfolio_details.portfolio_name', 'ilike', `%${portfolio}%`);
      } //include search param only if field is not blank

      if(category !== "none") { //include only if field is not blank
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

      if(!includeDeleted) {
        query.where('lesson_details.deleted', 'f')
      }

      return query;

    },
    getByProjectLesson: function(project, lesson) {
      return knex.select(
          knex.raw('lesson_details.lesson_id, lesson_details.project_tp_num, lesson_details.date_added, lesson_details.category, lesson_details.www_ebi, lesson_details.identified_by, lesson_details.identifiers_area, lesson_details.how_identified, user_details.username, lesson_details.summary, lesson_details.description, lesson_details.deleted, project_details.project_name, portfolio_details.portfolio_name'),
          knex.raw('EXTRACT(YEAR FROM date_added) as year_added'),
          knex.raw('EXTRACT(MONTH FROM date_added) as month_added'),
          knex.raw('EXTRACT(DAY FROM date_added) as day_added')
          // knex.raw('EXTRACT(YEAR FROM target_date) as target_year'),
          // knex.raw('EXTRACT(MONTH FROM target_date) as target_month'),
          // knex.raw('EXTRACT(DAY FROM target_date) as target_day')
        )
        .from('lesson_details')
        .rightOuterJoin('project_details', 'project_details.project_tp_num', 'lesson_details.project_tp_num')
        .rightOuterJoin('portfolio_details', 'project_details.portfolio', 'portfolio_details.portfolio_id')
        .rightOuterJoin('user_details', 'user_details.userid', 'lesson_details.uploaded_by')
        .where('lesson_details.project_tp_num', project)
        .where('lesson_id', lesson)
        .orderBy('lesson_id', 'asc');
      ;
    },
    getByCategory: function(category, dateFrom) {
      let query = knex.select()
        .table('lesson_details') //SELECT * FROM lesson_details;
        .where('lesson_details.category', 'ilike', `%${category}%`)
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

      let query = knex.select().table('project_details') //SELECT * FROM lesson_details;
        // .leftOuterJoin('project_details', 'project_details.project_tp_num', 'lesson_details.project_tp_num')
        .leftOuterJoin('portfolio_details', 'project_details.portfolio', 'portfolio_details.portfolio_id')
        // .leftOuterJoin('user_details', 'user_details.userid', 'lesson_details.uploaded_by');

      if (projectName !== "") { //include only if search field is not blank
        query.where('project_details.project_name', 'ilike', `%${projectName}%`)
          .orWhere('project_details.project_tp_num', 'ilike', `%${projectName}%`)
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
        query.where('project_details.start_date', '>', dateFrom);
      }

      if(dateToDay !== "") { //include only if field is not blank
        dateTo = new Date(`${dateToYear}`, `${dateToMonth}`-1, `${dateToDay}`-(-1), 01, 00, 00);
        query.where('project_details.start_date', '<', dateTo);
      }

      if(includeDeleted == undefined) {
        query.where('project_details.deleted', 'f')
      }

      query.where('project_details.project_type', 'project');

      return query;
    },
    checkProjectExists: function(project) {
      return knex.count('project_tp_num').from('project_details')
        .where('project_tp_num', project)
      ;
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
        query.where('project_details.project_name', 'ilike', `%${projectName}%`)
          .orWhere('project_details.project_tp_num', 'ilike', `%${projectName}%`)
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
        query.where('project_details.project_name', 'ilike', `%${projectName}%`)
          .orWhere('project_details.project_tp_num', 'ilike', `%${projectName}%`)
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
      .where('active', true)
      .orderBy([{ column: 'active', order: 'desc' }, { column: 'portfolio_name', order: 'asc' }]);
    },
    getById: function(id) {
      return knex('portfolio_details').where('portfolio_id', `${id}`);
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
    }
  },
  createLesson: function(project_tp_num, category, type, identified_by, identifiers_area,
    how_identified, summary, details) {

    let dateAdded = (new Date()).toISOString().slice(0, 19).replace(/-/g, "/").replace("T", " ");
    //INSERT INTO lesson_details VALUES [args]

    return knex.insert({category: `${category}`, date_added: dateAdded, description: `${details}`,
      how_identified: `${how_identified}`, identified_by: `${identified_by}`,
      identifiers_area: `${identifiers_area}`, project_tp_num: `${project_tp_num}`,
      summary: `${summary}`, uploaded_by: '1', www_ebi: `${type}`},
      ['lesson_id', 'project_tp_num', 'how_identified', 'identified_by', 'identifiers_area', 'date_added'])
      .into('lesson_details')
    ;

  },
  bulkAddLessons: function(obj) {
    let query = knex('lesson_details')
    let dateAdded = (new Date()).toISOString().slice(0, 19).replace(/-/g, "/").replace("T", " ");

    for(var i = 0; i < obj.length; i++) {
      obj[i].dateAdded = dateAdded
      obj[i].uploadedBy = 1
      console.log(obj[i])
      console.log('---------------------------')
      query.insert({project_tp_num:obj[i].ProjectID,  date_added: obj[i].dateAdded, uploaded_by: obj[i].uploadedBy,
        category:obj[i].Category, www_ebi:obj[i].WWW_EBI_ID, identified_by:obj[i].LessonIdentifiedBy,
        identifiers_area:obj[i].LessonIdentifiersArea, how_identified:obj[i].LessonHowIdentifed,
        summary:obj[i].Summary, description:obj[i].LessonDescription})
    }

    return query;
  },
  addLessonFromObject: function(obj) {
    let query = knex('lesson_details')
    let dateAdded = (new Date()).toISOString().slice(0, 19).replace(/-/g, "/").replace("T", " ");

      query.insert({project_tp_num:obj.ProjectID,  date_added: dateAdded, uploaded_by: '1',
        category:obj.Category, www_ebi:obj.WWW_EBI_ID, identified_by:obj.LessonIdentifiedBy,
        identifiers_area:obj.LessonIdentifiersArea, how_identified:obj.LessonHowIdentifed,
        summary:obj.Summary, description:obj.LessonDescription})

    return query;
  },
  createAction: function(lessonId, actionDetails, actionOwner, dayAdded, monthAdded, yearAdded) {
    let dateAdded = (new Date()).toISOString().slice(0, 19).replace(/-/g, "/").replace("T", " ");

    let query = knex.insert({lesson_id: `${lessonId}`, action_details: `${actionDetails}`,
      action_owner: `${actionOwner}`, target_date: dateAdded}) // target date uses current system time. Needs fixed
      .into('action_details')
      ;
    return query
  },
  createProject: function(projectName, projectTpNum, dateStartedDay,
    dateStartedMonth, dateStartedYear, dateClosedDay, dateClosedMonth,
    dateClosedYear, portfolio, srm, status) {

    var startDate = new Date(`${dateStartedYear}`, `${dateStartedMonth}`, `${dateStartedDay}`, 0, 0, 0);
    var closedDate = new Date(`${dateClosedYear}`, `${dateClosedMonth}`, `${dateClosedDay}`, 0, 0, 0);

    const startDateString = '' + `${dateStartedYear}` + '-' + `${dateStartedMonth}` + '-' + `${dateStartedDay}`

    if (`${dateClosedYear}` !== '' && `${dateClosedMonth}` !== '' && `${dateClosedDay}` !== '') {
      const closedDateString = '' + `${dateClosedYear}` + '-' + `${dateClosedMonth}` + '-' + `${dateClosedDay}`;
      query = knex.raw('INSERT INTO project_details (project_tp_num, project_name, project_type, start_date, closure_date, srm, status, portfolio)\
        SELECT \'' + `${projectTpNum}` + '\',\'' + `${projectName}` + '\', \'project\', \'' + startDateString + '\', \'' + closedDateString + '\',\'' + `${srm}` + '\',\'' + `${status}` + '\', portfolio_details.portfolio_id\
        FROM portfolio_details WHERE portfolio_name = \'' + `${portfolio}` + '\'\
        RETURNING project_details.project_tp_num;'
      )
    } //only include value of closed date if data entered
    else {
      query = knex.raw('INSERT INTO project_details (project_tp_num, project_name, project_type, start_date, srm, status, portfolio)\
        SELECT \'' + `${projectTpNum}` + '\',\'' + `${projectName}` + '\', \'project\', \'' + startDateString + '\', \'' + `${srm}` + '\',\'' + `${status}` + '\', portfolio_details.portfolio_id\
        FROM portfolio_details WHERE portfolio_name = \'' + `${portfolio}` + '\'\
        RETURNING project_details.project_tp_num;'
      )
    }

    return query;

  },
  createCampaign: function(projectName, projectTpNum, dateStartedDay,
    dateStartedMonth, dateStartedYear, dateClosedDay, dateClosedMonth,
    dateClosedYear, portfolio, srm, status) {

      var startDate = new Date(`${dateStartedYear}`, `${dateStartedMonth}`, `${dateStartedDay}`, 0, 0, 0);
      var closedDate = new Date(`${dateClosedYear}`, `${dateClosedMonth}`, `${dateClosedDay}`, 0, 0, 0);

      const startDateString = '' + `${dateStartedYear}` + '-' + `${dateStartedMonth}` + '-' + `${dateStartedDay}`

      if (`${dateClosedYear}` !== '' && `${dateClosedMonth}` !== '' && `${dateClosedDay}` !== '') {
        const closedDateString = '' + `${dateClosedYear}` + '-' + `${dateClosedMonth}` + '-' + `${dateClosedDay}`;
        query = knex.raw('INSERT INTO project_details (project_tp_num, project_name, project_type, start_date, closure_date, srm, status, portfolio)\
          SELECT \'' + `${projectTpNum}` + '\',\'' + `${projectName}` + '\', \'campaign\', \'' + startDateString + '\', \'' + closedDateString + '\',\'' + `${srm}` + '\',\'' + `${status}` + '\', portfolio_details.portfolio_id\
          FROM portfolio_details WHERE portfolio_name = \'' + `${portfolio}` + '\'\
          RETURNING project_details.project_tp_num;'
        )
      } //only include value of closed date if data entered
      else {
        query = knex.raw('INSERT INTO project_details (project_name, project_tp_num, project_type, start_date, srm, status, portfolio)\
          SELECT \'' + `${projectName}` + '\',\'' + `${projectTpNum}` + '\', \'campaign\', \'' + startDateString + '\', \'' + `${srm}` + '\',\'' + `${status}` + '\', portfolio_details.portfolio_id\
          FROM portfolio_details WHERE portfolio_name = \'' + `${portfolio}` + '\'\
          RETURNING project_details.project_tp_num;'
        )
      }

      return query;
  },
  createConference: function(projectName, projectTpNum, dateStartedDay,
    dateStartedMonth, dateStartedYear, dateClosedDay, dateClosedMonth,
    dateClosedYear, portfolio, srm, status) {

      var startDate = new Date(`${dateStartedYear}`, `${dateStartedMonth}`, `${dateStartedDay}`, 0, 0, 0);
      var closedDate = new Date(`${dateClosedYear}`, `${dateClosedMonth}`, `${dateClosedDay}`, 0, 0, 0);

      const startDateString = '' + `${dateStartedYear}` + '-' + `${dateStartedMonth}` + '-' + `${dateStartedDay}`

      if (`${dateClosedYear}` !== '' && `${dateClosedMonth}` !== '' && `${dateClosedDay}` !== '') {
        const closedDateString = '' + `${dateClosedYear}` + '-' + `${dateClosedMonth}` + '-' + `${dateClosedDay}`;
        query = knex.raw('INSERT INTO project_details (project_tp_num, project_name, project_type, start_date, closure_date, srm, status, portfolio)\
          SELECT \'' + `${projectTpNum}` + '\',\'' + `${projectName}` + '\', \'conference\', \'' + startDateString + '\', \'' + closedDateString + '\',\'' + `${srm}` + '\',\'' + `${status}` + '\', portfolio_details.portfolio_id\
          FROM portfolio_details WHERE portfolio_name = \'' + `${portfolio}` + '\'\
          RETURNING project_details.project_tp_num;'
        )
      } //only include value of closed date if data entered
      else {
        query = knex.raw('INSERT INTO project_details (project_tp_num, project_name, project_type, start_date, srm, status, portfolio)\
          SELECT \'' + `${projectTpNum}` + '\',\'' + `${projectName}` + '\', \'conference\', \'' + startDateString + '\', \'' + `${srm}` + '\',\'' + `${status}` + '\', portfolio_details.portfolio_id\
          FROM portfolio_details WHERE portfolio_name = \'' + `${portfolio}` + '\'\
          RETURNING project_details.project_tp_num;'
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
  updateLesson: function(projectId, lessonId, startDay, startMonth, startYear,
    category, type, identifiedBy, identifiersArea, howIdentified, uploadedBy,
    summary, details) {

    let startDate = new Date(startYear, startMonth, startDay)

    return knex('lesson_details')
      .where('lesson_id', '=', lessonId)
      .update({
        category: category,
        www_ebi: type,
        identified_by: identifiedBy,
        identifiers_area: identifiersArea,
        how_identified: howIdentified,
        summary: summary,
        description: details
      })
      .returning('*');
  },
  updateProject: function(projectTpNum, projectName, srm, status, portfolio,
    startDateDay, startDateMonth, startDateYear, closeDateDay, closeDateMonth,
    closeDateYear) {

    const startDateString = '' + `${startDateYear}` + '-' + `${startDateMonth}` + '-' + `${startDateDay}`

    if (`${closeDateYear}` !== '' && `${closeDateMonth}` !== '' && `${closeDateDay}` !== '') {

      const closedDateString = '' + `${closeDateYear}` + '-' + `${closeDateMonth}` + '-' + `${closeDateDay}`;
      query = knex.raw('UPDATE project_details\
        SET project_name = \'' + `${projectName}` + '\',\
          start_date = \'' + startDateString + '\',\
          closure_date = \'' + closedDateString + '\',\
          srm = \'' + `${srm}` + '\',\
          status = \'' + `${status}` + '\',\
          portfolio = portfolio_details.portfolio_id\
        FROM portfolio_details\
        WHERE portfolio_details.portfolio_name = \'' + `${portfolio}` + '\' AND project_details.project_tp_num = \'' + `${projectTpNum}` + '\';'
      )

    } //only include value of closed date if data entered
    else {

      query = knex.raw('UPDATE project_details\
        SET project_name = \'' + `${projectName}` + '\',\
          start_date = \'' + startDateString + '\',\
          srm = \'' + `${srm}` + '\',\
          status = \'' + `${status}` + '\',\
          portfolio = portfolio_details.portfolio_id\
        FROM portfolio_details\
        WHERE portfolio_details.portfolio_name = \'' + `${portfolio}` + '\' AND project_details.project_tp_num = \'' + `${projectTpNum}` + '\';'
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
  deleteLesson: function(projectTpNum, lessonId) {
    let query = knex('lesson_details')
      .where({project_tp_num:projectTpNum, lesson_id:lessonId})
      .update('deleted', 't');

    return query;
  },
  deleteAllProjectLessons: function(projectTpNum) {
    let query = knex('lesson_details')
      .where({project_tp_num:projectTpNum})
      .update('deleted', 't');
    return query;
  },
  deleteProject: function(projectTpNum) {
    let query = knex('project_details')
      .where({project_tp_num:projectTpNum})
      .update('deleted', 't');
    return query;
  },
  reinstateLesson: function(projectTpNum, lessonId) {
    let query = knex('lesson_details')
      .where({project_tp_num:projectTpNum, lesson_id:lessonId})
      .update('deleted', 'f');

    return query;
  },
  reinstateAllProjectLessons: function(projectTpNum) {
    let query = knex('lesson_details')
      .where({project_tp_num:projectTpNum})
      .update('deleted', 'f');
    return query;
  },
  reinstateProject: function(projectTpNum) {
    let query = knex('project_details')
      .where({project_tp_num:projectTpNum})
      .update('deleted', 'f');
    return query;
  },
  getTrendingCategories: function() {
    return knex.raw("SELECT category, COUNT(category) volume FROM lesson_details WHERE date_added > now() - interval '1 year' GROUP BY category ORDER BY volume DESC LIMIT 4;")
  }
}
