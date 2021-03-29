const queries = require('../../app/db/queries')

module.exports = function (router) {
  router.get('/admin/add_category', (req, res) => {
    res.render('admin/add_category.html')
  })

  router.post('/admin/add_category', (req, res) => {
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
      res.render('admin/add_category.html', { err, reqjson })
    } else {
      queries.createCategory(req.body.category_name)
        .then(addedCategory => {
          queries.searchCategories.getAll()
            .then(categories => {
              res.render('admin/maintain_categories.html', { categories, addedCategory })
            })
            .catch(e => {
              console.log(e)
              return res.render('500.html');
            })
        })
        .catch(e => {
          console.log(e)
          return res.render('500.html');
        })
    }
  })
}
