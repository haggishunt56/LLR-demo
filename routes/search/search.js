module.exports = function (router) {
  // render searchwhat page
  router.get('/search', (req, res) => {
    res.render('search/searchwhat.html')
  })

  // handle input on search forms
  router.post('/search', (req, res) => {
    if (req.body.lessonproject === 'lesson') {
      res.render('search/search_lessons.html')
    } else if (req.body.lessonproject === 'project') {
      res.render('search/search_projects.html')
    } else if (req.body.lessonproject === 'campaign') {
      res.render('search/search_campaigns.html')
    } else if (req.body.lessonproject === 'conference') {
      res.render('search/search_conferences.html')
    } else if (JSON.stringify(req.body) === '{}') {
      var err = '{ "error" : "noSelection" }'
      res.render('search/searchwhat.html', { err })
    }
  })
}
