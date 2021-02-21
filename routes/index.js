const express = require("express");
const router = express.Router();
const { User } = require('../models');
const { asyncHandler } = require('../middleware/async-handler');
const { authenticateUser } = require('../middleware/auth-user');


// A /api/users GET route that will return the currently authenticated user along with a 200 HTTP status code.
router.get('/users', authenticateUser, asyncHandler( async (req, res) => {
    const user = req.currentUser;

    res.status(200).json({ user });
}));

// A /api/users POST route that will create a new user, set the Location header to "/", and return a 201 HTTP status code and no content.
router.post('/users', asyncHandler(async (req, res) => {
    try {
      await User.create(req.body);
      res.status(201).json({ "message": "Account successfully created!" });
    } catch (error) {
      if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
        const errors = error.errors.map(err => err.message);
        res.status(400).json({ errors });   
      } else {
        throw error;
      }
    }
  }));


// A /api/courses GET route that will return a list of all courses including the User that owns each course and a 200 HTTP status code.
router.get('/courses', (req, res) => {

});

// A /api/courses/:id GET route that will return the corresponding course along with the User that owns that course and a 200 HTTP status code.
router.get('/courses/:id', (req, res) => {

});

// A /api/courses POST route that will create a new course, set the Location header to the URI for the newly created course, and return a 201 HTTP status code and no content.
router.post('/courses', (req, res) => {

});


// A /api/courses/:id PUT route that will update the corresponding course and return a 204 HTTP status code and no content.
router.put('/courses/:id', (req, res) => {

});

// A /api/courses/:id DELETE route that will delete the corresponding course and return a 204 HTTP status code and no content.
router.delete('/courses/:id', (req, res) => {

});

module.exports = router;