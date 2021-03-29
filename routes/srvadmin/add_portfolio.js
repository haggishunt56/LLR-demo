const queries = require('../../app/db/queries')

module.exports = function (router) {
  router.get('/admin/add_portfolio', (req, res) => {
    res.render('admin/add_portfolio.html')
  })

  router.post('/admin/add_portfolio', (req, res) => {
    const err = {
      portfolioName: {},
      portfolioDirector: {}
    }

    if (req.body.portfolio_name === '') {
      err.portfolioName.blank = true
      err.summarise = true
    }
    if (req.body.portfolio_name.length > 45) {
      err.portfolioName.tooLong = true
      err.summarise = true
    }

    if (req.body.director_name === '') {
      err.portfolioDirector.blank = true
      err.summarise = true
    }
    if (req.body.director_name.length > 45) {
      err.portfolioDirector.tooLong = true
      err.summarise = true
    }

    if (err.summarise) {
      const reqjson = req.body
      res.render('admin/add_portfolio.html', { err, reqjson })
    } else {
      queries.createPortfolio(req.body.portfolio_name, req.body.director_name, req.body.active)
        .then(addedPortfolio => {
          queries.searchPortfolios.getAll()
            .then(portfolios => {
              res.render('admin/maintain_portfolios.html', { portfolios, addedPortfolio })
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
