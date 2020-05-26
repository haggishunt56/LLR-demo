const knex = require('./knex');

module.exports = {
  lessons: {
    getAll: function() {
      //SELECT * FROM lesson_details;
      return knex('lesson_details');
    },
    getByID: function(id) {
      //SELECT * FROM lesson_details WHERE lesson_id = [passed to function];
      return knex('lesson_details').where('lesson_id', id); //create and return json files with result of db query
    },
    getByProject: function(id) {
      //SELECT * FROM lesson_details WHERE project_id = [passed to function];
      return knex('lesson_details').where('project_id', id); //create and return json files with result of db query
    },
    getByLP: function(project,lesson) {
      //SELECT * FROM lesson_details WHERE lesson_id = [passed to function], project_id = [passed to function]
      return knex('lesson_details')
        .where('project_id', project)
        .where('lesson_id', lesson)
        ;
    }
  }
}