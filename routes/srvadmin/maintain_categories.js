const queries = require('../../app/db/queries')

module.exports = function (router) {
  router.get('/admin/maintain_categories', (req, res) => {
    queries.searchCategories.getAll()
      .then(
        categories => {
          res.render('admin/maintain_categories.html', { categories })
        }
      )
  })

  router.post('/admin/maintain_categories', (req, res) => {

  })
}
