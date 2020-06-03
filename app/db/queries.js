const knex = require('./knex');

module.exports = {
  lessons: {
    getAll: function() {
      //SELECT * FROM lesson_details;
      return knex('lesson_details');
    },
    getByID: function(id) {
      //SELECT * FROM lesson_details WHERE project_tp_num = [passed to function];
      return knex.select()
        .table('lesson_details')
        .where('lesson_details.project_tp_num', 'like', `%${id}%`)
        ; //create and return json files with result of db query
    },
    getByProject: function(id) {
      //SELECT * FROM lesson_details WHERE project_tp_num = [passed to function];
      return knex.select()
        .table('lesson_details')
        .fullOuterJoin('project_details', 'project_details.project_tp_num', 'lesson_details.project_tp_num')
        .where('lesson_details.project_tp_num', 'ilike', id)
        .orWhere('project_details.project_name', 'ilike', `%${id}%`)
        ;
      //create and return json files with result of db query
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
