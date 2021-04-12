module.exports = function (router) {
  // render searchwhat page
  router.get('/search', (req, res) => {
    res.render('search/searchwhat.html')
  })

  // handle input on search forms
  router.post('/search', (req, res) => {
    var err
    if (req.body.lessonproject === 'action') {
      res.redirect('/search_actions')
    } else if (req.body.lessonproject === 'lesson') {
      res.redirect('/search_lessons')
    } else if (req.body.lessonproject === 'project') {
      res.redirect('/search_projects')
    } else if (req.body.lessonproject === 'campaign') {
      res.redirect('/search_campaigns')
    } else if (req.body.lessonproject === 'conference') {
      res.redirect('/search_conferences')
    } else if (JSON.stringify(req.body) === '{}') {
      err = '{ "error" : "noSelection" }'
      res.render('search/searchwhat.html', { err })
    } else {
      err = '{ "error" : "unknownError" }'
      res.render('search/searchwhat.html', { err })
    }
  })
}
