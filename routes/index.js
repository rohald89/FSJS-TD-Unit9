const express = require("express");
const router = express.Router();
const { User, Course } = require('../models');
const { asyncHandler } = require('../middleware/async-handler');
const { authenticateUser } = require('../middleware/auth-user');


// return the currently authenticated user along with a 200 HTTP status code.
router.get('/users', authenticateUser, asyncHandler( async (req, res) => {
    const user = req.currentUser;
    res.status(200).json({ 
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      emailAddress: user.emailAddress,
     });
}));

// Create a new user, set the Location header to "/", and return a 201 HTTP status code without content.
router.post('/users', asyncHandler(async (req, res) => {
      await User.create(req.body);
      res.location('/').status(201).end();
  }));


// Return a list of all courses including the User that owns each course and a 200 HTTP status code.
router.get('/courses', asyncHandler(async (req, res) => {
   const courses = await Course.findAll({
     attributes: ['id', 'title', 'description', 'estimatedTime', 'materialsNeeded'],
     include: [
       {
         model: User,
         as:'user',
         attributes: ['id', 'firstName', 'lastName', 'emailAddress']
       }
     ]
   });
   res.json({courses});
}));

// Return the corresponding course along with the User that owns that course and a 200 HTTP status code.
router.get('/courses/:id', asyncHandler(async (req, res, next) => {
  const course = await Course.findByPk(req.params.id, {
    attributes: ['id', 'title', 'description', 'estimatedTime', 'materialsNeeded'],
    include: [
      {
        model: User,
        as:'user',
        attributes: ['id', 'firstName', 'lastName', 'emailAddress']
      }
    ]
  });
  if(!course){
    const error = new Error;
    error.status = 404;
    error.message = 'Course not found';
    next(error);
  } else {
  res.json({ course });
  }
}));

// Create a new course, set the Location header to the URI for the newly created course, and return a 201 HTTP status code without content.
router.post('/courses', authenticateUser, asyncHandler(async (req, res) => {
    const course = await Course.create(req.body);
    res.location(`/courses/${course.id}`).status(201).end();
}));

// Update the corresponding course and return a 204 HTTP status code without content.
router.put('/courses/:id', authenticateUser, asyncHandler( async (req, res, next) => {
  const course = await Course.findByPk(req.params.id);
  if(!course){
      const error = new Error();
      error.status = 404;
      error.message = 'Not able to find this course, please try again';
      next(error);
  } else{
    if(req.currentUser.id === course.userId) {
      await course.update(req.body);
      res.status(204).end();
    } else {
      const error = new Error();
      error.status = 403;
      error.message = 'Only the owner of this course can make changes';
      next(error);
    }
  }
}));

// ADelete the corresponding course and return a 204 HTTP status code without content.
router.delete('/courses/:id', authenticateUser, asyncHandler( async (req, res, next) => {
  const course = await Course.findByPk(req.params.id);
  if(!course){
    const error = new Error();
    error.status = 404;
    error.message = 'This course can not be found';
    next(error);
  } else {
    if(req.currentUser.id === course.userId){
      await course.destroy();
      res.status(204).end();
    } else {
      const error = new Error();
      error.status = 403;
      error.message = 'You are only allowed to delete courses of which you are the owner';
      next(error);
    }
  }
}));

module.exports = router;