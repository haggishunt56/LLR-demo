const knex = require('./knex');

module.exports = {
  searchLessons: {
    getAll: function() {
      //SELECT * FROM lesson_details;
      return knex('lesson_details');
    },
    getByID: function(id) {
      //SELECT * FROM lesson_details WHERE project_tp_num = id;
      return knex.select()
        .table('lesson_details')
        .where('lesson_details.project_tp_num', 'like', `%${id}%`)
        ; //create and return json files with result of db query
    },
    getBySearchFields: function(lessonName, projectName, portfolio, category, type, dateFromDay, dateFromMonth, dateFromYear, dateToDay, dateToMonth, dateToYear) {
      //SELECT * FROM lesson_details WHERE lesson_name = lessonName, project_name = projectName etc...;

      let query = knex.select().table('lesson_details') //SELECT * FROM lesson_details;
        .leftOuterJoin('project_details', 'project_details.project_tp_num', 'lesson_details.project_tp_num')
        .leftOuterJoin('portfolio_details', 'project_details.portfolio', 'portfolio_details.portfolio_id')
        .leftOuterJoin('user_details', 'user_details.userid', 'lesson_details.uploaded_by');

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
      //SELECT * FROM lesson_details WHERE project_tp_num = [passed to function], lesson_id = [passed to function];
      return knex('lesson_details')
        .where('project_tp_num', project)
        .where('lesson_id', lesson)
      ;
    }
  },
  createLesson: {
    createLesson: function(project_tp_num, category, type, identified_by, identifiers_area,
        how_identified, summary, details, target_date_day, target_date_month, target_date_year) {

      var targetDate = new Date(`${target_date_year}`, `${target_date_month}`, `${target_date_day}`, 0, 0, 0);
      //INSERT INTO lesson_details VALUES [args]

      return knex.insert({category: `${category}`, date_added: '2020-02-23', description: `${details}`,
        how_identified: `${how_identified}`, identified_by: `${identified_by}`,
        identifiers_area: `${identifiers_area}`, project_tp_num: `${project_tp_num}`,
        summary: `${summary}`, target_date: targetDate, uploaded_by: '1', www_ebi: `${type}`}, ['lesson_id', 'project_tp_num'])
        .into('lesson_details')
      ;
    }
  }
}
