var routes = [
  require('./index.js'),

  // home
  require('./home/home.js'),

  // view
  require('./view_lesson.js'),
  require('./view_project.js'),

  // delete
  require('./delete/delete_lesson.js'),
  require('./delete/delete_project.js'),

  // reinstate
  require('./reinstate/reinstate_lesson.js'),
  require('./reinstate/reinstate_project.js'),

]

module.exports = function (router) {
  routes.forEach(function (route) {
    route(router)
  })
}
