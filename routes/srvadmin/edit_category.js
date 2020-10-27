const queries = require('../../app/db/queries')

module.exports = function (router) {
  router.get('/admin/edit_category/:id', (req, res) => {
    queries.searchCategories.getById(req.params.id)
      .then(category => {
        res.render('admin/edit_category.html', { category })
      })
  })

  router.post('/admin/edit_category/:id', (req, res) => {
    const err = {
      categoryName: {}
    }

    if (req.body.category_name === '') {
      err.categoryName.blank = true
      err.summarise = true
    } else if (req.body.category_name.length > 45) {
      err.portfolioName.tooLong = true
      err.summarise = true
    }

    if (err.summarise) {
      const reqjson = req.body
      queries.searchCategories.getById(req.params.id)
        .then(category => {
          res.render('admin/edit_category.html', { category, err, reqjson })
        })
    } else {
      queries.updateCategory(req.body.category_name, req.params.id)
        .then(category => {
          const changeSuccess = true
          queries.searchCategories.getAll()
            .then(categories => {
              res.render('admin/maintain_categories.html', { categories, changeSuccess })
            })
        })
    }
  })
}
