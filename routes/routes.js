var routes = [
  require('./index.js'),
  require ('./home.js'),
  require ('./search.js'),
  require ('./create.js'),
  require ('./view-lesson.js'),
  require ('./view-project.js'),
  require ('./update-lesson.js'),
  require ('./update-project.js'),
  require ('./delete-lesson.js'),
  require ('./delete-project.js'),
  require ('./misc.js') //this file contains routes which are not currently used
      //such as bulk upload and view all lessons as raw JSON.
]

module.exports = function (router) {
  routes.forEach(function (route) {
    route(router);
  });
}
