var routes = [
  require('./index.js'),

  // home
  require('./home/home.js'),

  // search
  require('./search/search.js'),
  require('./search/search_lessons.js'),
  require('./search/search_projects.js'),
  require('./search/search_campaigns.js'),
  require('./search/search_conferences.js'),
  require('./search/search_trending_category.js'),

  // create
  require('./create/create.js'),
  require('./create/create_action.js'),
  require('./create/create_lesson.js'),
  require('./create/create_project.js'),
  require('./create/create_campaign.js'),
  require('./create/create_conference.js'),

  // view
  require ('./view_lesson.js'),
  require ('./view_project.js'),

  // update
  require ('./update_lesson.js'),
  require ('./update_project.js'),

  // delete
  require ('./delete/delete_lesson.js'),
  require ('./delete/delete_project.js'),

  // reinstate
  require ('./reinstate/reinstate_lesson.js'),
  require ('./reinstate/reinstate_project.js'),

  // service admin
  require('./srvadmin/admin.js'),
  require('./srvadmin/maintain_portfolios.js'),
  require('./srvadmin/edit_portfolio.js'),
  require('./srvadmin/add_portfolio.js'),
  require('./srvadmin/maintain_categories.js'),
  require('./srvadmin/edit_category.js'),
  require('./srvadmin/add_category.js'),

  // user admin

  //misc
  require ('./misc.js') //this file contains routes which are not currently used
      //such as bulk upload and view all lessons as raw JSON.
]

module.exports = function (router) {
  routes.forEach(function (route) {
    route(router);
  });
}
