module.exports = function (router) {
  // render createwhat page
  router.get('/create', (req, res) => {
    res.render('create/createwhat.html')
  })

  // handle input on create forms
  router.post('/create', (req, res) => {
    if (req.body.lessonproject === 'lesson') { // if lesson selected
      return res.redirect('create_lesson') // display create lesson page
    } else if (req.body.lessonproject === 'project') { // if project selected
      return res.redirect('create_project') // display create project page
    } else if (req.body.lessonproject === 'conference') { // if conference selected
      return res.redirect('create_conference') // display create conference page
    } else if (req.body.lessonproject === 'campaign') { // if campaign selected
      return res.redirect('create_campaign') // display create campaign page
    } else if (JSON.stringify(req.body) === '{}') { // if nothing selected
      var err = '{ "error" : "noSelection" }'
      return res.render('create/createwhat.html', { err }) // display error
    }
  })
}
