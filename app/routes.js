const express = require('express')
const router = express.Router()

// Add your routes here - above the module.exports line

router.get('/lessondetails', (req, res) => {
  queries
    .lessons
    .getAll()
    .then(lesson_details => {
      res.json(lesson_details);
    });
});

router.get('/lessondetails/:proj_id', (req, res) => {
  queries
    .lessons
    .getByProject(req.params.proj_id)
    .then(lesson_details => {
      res.json(lesson_details);
    });
});

router.get('/:proj_id/:les_id', (req, res) => {
  queries
    .lessons
    .getByLP(req.params.proj_id, req.params.les_id)
    .then(lesson_details => {
      res.send(lesson_details);
    });
});

module.exports = router
