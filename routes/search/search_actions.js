const queries = require('../../app/db/queries')

module.exports = function (router) {
  router.get('/search_actions', (req, res) => {
    res.render('search/search_actions.html')
  })

  router.post('/search_actions', (req, res) => {
    let err = {}
    const reqjson = req.body
    if (reqjson.include_deleted === '_unchecked') {
      reqjson.include_deleted = false
    } else {
      reqjson.include_deleted = true
    }

    if (isNaN(reqjson.lessonId)) {
      err.NaN = true
      err.summarise = true
    }

    const dateRegEx = new RegExp('^0*$')

    if( !(reqjson.dateFromYear === '') || !(reqjson.dateFromMonth === '') || !(reqjson.dateFromDay === '')) { // ignore if date is blank
      if((isNaN(reqjson.dateFromYear) || isNaN(reqjson.dateFromMonth) || isNaN(reqjson.dateFromDay)) || (dateRegEx.test(reqjson.dateFromYear) || dateRegEx.test(reqjson.dateFromMonth) || dateRegEx.test(reqjson.dateFromDay))) { // //if any field is not a number, or if any field is 0, throw err
          err.dateFrom = true
          err.summarise = true
      }
    }

    if( !(reqjson.dateToYear === '') || !(reqjson.dateToMonth === '') || !(reqjson.dateToDay === '')) { // ignore if date is blank
      if((isNaN(reqjson.dateToYear) || isNaN(reqjson.dateToMonth) || isNaN(reqjson.dateToDay)) || (dateRegEx.test(reqjson.dateToYear) || dateRegEx.test(reqjson.dateToMonth) || dateRegEx.test(reqjson.dateToDay))) { // //if any field is not a number, or if any field is 0, throw err
          err.dateTo = true
          err.summarise = true
      }
    }

    if (err.summarise) {
      res.render('search/search_actions.html', { err, reqjson })
    } else {
      queries
        .searchActions
        .getBySearchFields(reqjson.lessonId, reqjson.projectName, reqjson.actionOwner,
          reqjson.dateFromDay, reqjson.dateFromMonth, reqjson.dateFromYear,
          reqjson.dateToDay, reqjson.dateToMonth, reqjson.dateToYear)
        .then(action_details => {
          const rowsReturned = Object.keys(action_details).length
          res.render('search/search_actions.html', { rowsReturned, reqjson, action_details })
        })
        .catch(e => {
          console.log(e)
          return res.render('500.html');
        })
    }
  })
}
