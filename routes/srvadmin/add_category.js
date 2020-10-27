const queries = require('../../app/db/queries')

module.exports = function (router) {
  router.get('/admin/add_category', (req, res) => {
    res.render('admin/add_category.html')
  })

  router.post('/admin/add_category', (req, res) => {
    queries.createCategory(req.body.category_name)
      .then(
        addedCategory => {
          queries.searchCategories.getAll()
            .then(
              categories => {
                res.render('admin/maintain_categories.html', { categories, addedCategory })
              }
            )
        }
      )
  })
}
