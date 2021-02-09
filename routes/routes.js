var routes = [
  require('./index.js'),

  // home
  require('./home/home.js'),

  // search
  require('./search/search.js'),
  require('./search/home_search.js'),
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

  // bulk upload
  require('./bulk_upload_new.js'),

  // view
  require('./view_lesson.js'),
  require('./view_project.js'),

  // update
  require('./update_lesson.js'),
  require('./update_project.js'),

  // delete
  require('./delete/delete_lesson.js'),
  require('./delete/delete_project.js'),

  // reinstate
  require('./reinstate/reinstate_lesson.js'),
  require('./reinstate/reinstate_project.js'),

  // service admin
  require('./srvadmin/admin.js'),
  require('./srvadmin/maintain_portfolios.js'),
  require('./srvadmin/edit_portfolio.js'),
  require('./srvadmin/add_portfolio.js'),
  require('./srvadmin/maintain_categories.js'),
  require('./srvadmin/edit_category.js'),
  require('./srvadmin/add_category.js'),

  // user admin
  // TODO

  require('./404.js') //404 handler - MUST be at the bottom of the stack
]

module.exports = function (router) {
  routes.forEach(function (route) {
    route(router)
  })
}
