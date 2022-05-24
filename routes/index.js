const { getenv } = require('../lib/helper')
const express = require('express')

const router = express.Router()

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    CAROUSEL_CSV: getenv('CAROUSEL_CSV', ''),
    CAROUSEL_FIELD: getenv('CAROUSEL_FIELD', ''),
  })
})

module.exports = router
