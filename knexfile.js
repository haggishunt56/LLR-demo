//update with your config settings

module.exports = {
  development: { // development environment
    client: 'sqlite3',
    connection: {
      filename: "./mydb.sqlite"
    }
  },
  integration: { // for use on Heroku

  }
  //sit
  //pre-prod
  // production: { // for use in prod
  //   client: 'postgres',
  //   connection: 'postgres://postgres:a@localhost:5432/postgres', //THIS IS NOT SECURE. Password is in plain text.
  //   searchPath: ['knex', 'public']
  // }
};
