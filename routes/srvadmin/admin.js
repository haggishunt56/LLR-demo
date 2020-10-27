module.exports = function (router) {
  router.get('/admin', (req, res) => {
    res.render('admin/admin_main.html')
  })
}
