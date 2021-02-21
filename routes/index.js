const express = require("express");
const router = express.Router();
const { User, Course } = require('../models');
const { asyncHandler } = require('../middleware/async-handler');
const { authenticateUser } = require('../middleware/auth-user');


// A /api/users GET route that will return the currently authenticated user along with a 200 HTTP status code.
router.get('/users', authenticateUser, asyncHandler( async (req, res) => {
    const user = req.currentUser;
    res.status(200).json({ 
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      emailAddress: user.emailAddress,
     });
}));

// A /api/users POST route that will create a new user, set the Location header to "/", and return a 201 HTTP status code and no content.
router.post('/users', asyncHandler(async (req, res) => {
      await User.create(req.body);
      res.location('/').status(201).json({ "message": "Account successfully created!" });
  }));


// A /api/courses GET route that will return a list of all courses including the User that owns each course and a 200 HTTP status code.
router.get('/courses', asyncHandler(async (req, res) => {
   const courses = await Course.findAll({
     attributes: ['id', 'title', 'description', 'estimatedTime', 'materialsNeeded'],
     include: [
       {
         model: User,
         as:'user'
       }
     ]
   });
   res.json({courses});
}));

// A /api/courses/:id GET route that will return the corresponding course along with the User that owns that course and a 200 HTTP status code.
router.get('/courses/:id', asyncHandler(async (req, res) => {
  console.log(req.params.id);
  const courses = await Course.findByPk(req.params.id, {
    attributes: ['id', 'title', 'description', 'estimatedTime', 'materialsNeeded'],
    include: [
      {
        model: User,
        as:'user'
      }
    ]
  });
  res.json({courses});
}));

// A /api/courses POST route that will create a new course, set the Location header to the URI for the newly created course, and return a 201 HTTP status code and no content.
router.post('/courses', authenticateUser, asyncHandler(async (req, res) => {
    const course = await Course.create(req.body);
    res.location(`/courses/${course.id}`).status(201).end();
}));


// A /api/courses/:id PUT route that will update the corresponding course and return a 204 HTTP status code and no content.
router.put('/courses/:id', authenticateUser, asyncHandler( async (req, res, next) => {
  const course = await Course.findByPk(req.params.id);
  if(course){
    if(req.currentUser.id === course.userId) {
      await course.update(req.body);
      res.status(204).end();
    } else {
      const error = new Error('Only the owner the the course can make changes');
      error.status = 403;
      next(error);
    }
  } else {
    const error = new Error('can not find this course please try again');
    error.status = 404;
    next(error);
  }
  
}));

// A /api/courses/:id DELETE route that will delete the corresponding course and return a 204 HTTP status code and no content.
router.delete('/courses/:id', authenticateUser, asyncHandler( async (req, res) => {

}));

module.exports = router;