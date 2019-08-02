const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));

// Dashboard
router.get('/map', ensureAuthenticated, (req, res) =>
  res.render('map', {
    user: req.user
  })
);

module.exports = router;
