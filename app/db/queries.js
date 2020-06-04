const knex = require('./knex');

module.exports = {
  lessons: {
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
    getByProject: function(lessonName, projectName, portfolio, category, type, dateFromDay, dateFromMonth, dateFromYear, dateToDay, dateToMonth, dateToYear) {
      //SELECT * FROM lesson_details WHERE project_tp_num = id OR project_name = id;
      return knex.select()
        .table('lesson_details')
        .fullOuterJoin('project_details', 'project_details.project_tp_num', 'lesson_details.project_tp_num')
        .where('lesson_details.project_tp_num', 'ilike', `%${id}%`)
        .orWhere('project_details.project_name', 'ilike', `%${id}%`)
        ;
    },
    getBySearchFields: function(lessonName, projectName, portfolio, category, type, dateFromDay, dateFromMonth, dateFromYear, dateToDay, dateToMonth, dateToYear) {
      //SELECT * FROM lesson_details WHERE lesson_name = lessonName, project_name = projectName etc...;

      let query = knex.select().table('lesson_details') //SELECT * FROM lesson_details;
        .fullOuterJoin('project_details', 'project_details.project_tp_num', 'lesson_details.project_tp_num');

      if(lessonName !== "") { //include search param only if field is not blank
        query.where('lesson_details.lesson_id', 'ilike', `%${lessonName}%`);
      }

      if(projectName !== "") { //include search param only if field is not blank
        query.where(function() {
          this.where('lesson_details.project_tp_num', 'ilike', `%${projectName}%`)
          .orWhere('project_details.project_name', 'ilike', `%${projectName}%`)
        });
      }

      // TODO if(portfolio !== "") {} //include search param only if field is not blank

      if(category !== "") { //include search param only if field is not blank
        query.where('lesson_details.category', 'ilike', `%${category}%`);
      }

      if(type !== "") { //include search param only if field is not blank
        if(type === "What went well") {
          type = "WWW";
        }
        else if(type === "Even better if") {
          type = "EBI";
        }
        query.where('lesson_details.www_ebi', 'ilike', `%${type}%`);
      }

      if(dateFromDay !== "") { //include search param only if field is not blank
        //console.log(`${dateFromYear}`, `${dateFromMonth}`, `${dateFromDay}`);
        dateFrom = new Date(`${dateFromYear}`, `${dateFromMonth}`-1, `${dateFromDay}`, 0, 0, 0);
        query.where('lesson_details.date_added', '>', dateFrom);
        console.log(dateFrom);
      }

      if(dateToDay !== "") { //include search param only if field is not blank
        dateTo = new Date(`${dateToYear}`, `${dateToMonth}`-1, `${dateToDay}`-(-1), 01, 00, 00);
        query.where('lesson_details.date_added', '<', dateTo);
        console.log(dateTo);
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
  }
}
