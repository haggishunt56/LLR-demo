const knex = require('./knex');

module.exports = {
  icecream: {
    getAll: function() {
      //SELECT * FROM icecreams;
      return knex('icecreams');
    },
    getOne: function(id) {
      // SELECT * FROM icecreams WHERE id = [id in URL];
      return knex('icecreams').where('id', id);
    },
    create: function(icecream) {
      return knex('icecream').insert(icecream).returning('*');
    }
  }
}
