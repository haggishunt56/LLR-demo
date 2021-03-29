const queries = require('../../app/db/queries')

module.exports = function (router) {
  router.get('/admin/maintain_portfolios', (req, res) => {
    queries.searchPortfolios.getAll()
      .then(portfolios => {
        res.render('admin/maintain_portfolios.html', { portfolios })
      })
      .catch(e => {
        console.log(e)
        return res.render('500.html');
      })
  })
}
