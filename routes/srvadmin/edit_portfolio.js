const queries = require('../../app/db/queries')

module.exports = function (router) {
  router.get('/admin/edit_portfolio/:id', (req, res) => {
    queries.searchPortfolios.getById(req.params.id)
      .then(portfolio => {
        res.render('admin/edit_portfolio.html', { portfolio })
      })
      .catch(e => {
        console.log(e)
        return res.render('500.html')
      })
  })

  router.post('/admin/edit_portfolio/:id', (req, res) => {
    const err = {
      portfolioName: {},
      portfolioDirector: {}
    }

    if (req.body.portfolio_name === '') {
      err.portfolioName.blank = true
      err.summarise = true
    } else if (req.body.portfolio_name.length > 45) {
      err.portfolioName.tooLong = true
      err.summarise = true
    }

    if (req.body.director_name === '') {
      err.portfolioDirector.blank = true
      err.summarise = true
    } else if (req.body.director_name.length > 45) {
      err.portfolioDirector.tooLong = true
      err.summarise = true
    }

    if (err.summarise) {
      const reqjson = req.body
      queries.searchPortfolios.getById(req.params.id)
        .then(portfolio => {
          res.render('admin/edit_portfolio.html', { portfolio, err, reqjson })
        })
        .catch(e => {
          console.log(e)
          return res.render('500.html')
        })
    } else {
      queries.updatePortfolio(req.body.portfolio_name, req.body.director_name, req.body.active, req.params.id)
        .then(portfolio => {
          const changeSuccess = true
          queries.searchPortfolios.getAll()
            .then(portfolios => {
              res.render('admin/maintain_portfolios.html', { portfolios, changeSuccess })
            })
            .catch(e => {
              console.log(e)
              return res.render('500.html')
            })
        })
        .catch(e => {
          console.log(e)
          return res.render('500.html')
        })
    }
  })
}
