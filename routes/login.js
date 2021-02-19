module.exports = function (router) {
  // render home page
  router.get('/', (req, res) => {
    res.render('login.html')
  })
}
