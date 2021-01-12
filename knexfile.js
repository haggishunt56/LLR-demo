//update with your config settings

module.exports = {
  // development environment
  development: {
    client: 'sqlite3',
    connection: {
      filename: "/Users/douglaspollock/Documents/projects/LLR-demo/app/db/sqlite.db"
    }
  },

  // for use on Heroku
  integration: {
    client: 'sqlite3',
    connection: {
      filename: "/Users/douglaspollock/Documents/projects/LLR-demo/app/db/sqlite.db"
    }
  }

  // sit

  // pre-prod

  // for use in prod env
  // production: {
  //   client: 'postgres',
  //   connection: 'postgres://postgres:a@localhost:5432/postgres', // TODO use environment variables to secure db access
  //   searchPath: ['knex', 'public']
  // }
};
