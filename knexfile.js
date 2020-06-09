//update with your config settings

module.exports = {
  development: {
    client: 'postgres',
    connection: 'postgres://postgres:password@localhost:5432/postgres', //THIS IS NOT SECURE. Password is in plain text.
    searchPath: ['knex', 'public']
  }
  //integration: {} TODO when int env is set up
  //sit
  //pre-prod
  //production: {} TODO when prod DB is set up
};
