module.exports = function (router) {

  //render home page
  router.get('/home', (req, res) => {
    res.render('home.html');
  });

}
