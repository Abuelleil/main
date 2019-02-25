// ===-------------------------------------------------------------------------------------=== //
// =-- EXTERNAL IMPORT
// ===-------------------------------------------------------------------------------------=== //
const express = require('express')
const router = express.Router()
const Joi = require('joi')
const mongoose = require('mongoose')
// ===-------------------------------------------------------------------------------------=== //

// ===-------------------------------------------------------------------------------------=== //
// =-- INTERNAL IMPORT
// ===-------------------------------------------------------------------------------------=== //
const User = require('../models/User')
// ===-------------------------------------------------------------------------------------=== //

// ===-------------------------------------------------------------------------------------=== //
// =-- USERS ROUTES
// ===-------------------------------------------------------------------------------------=== //
router.route('/')
  .get((request, response) => {
    User.find({})
      .exec()
      .then(doc => { return response.send(doc) })
      .catch(err => { console.log(err); return response.send(`Sorry, couldn't fetch the current list of users !`) })
  })
  .post((request, response) => {
    const schema = {
      name: Joi.string().min(3).required(),
      age: Joi.number().required()
    }
    const status = Joi.validate(request.body, schema)
    if (status.error) {
      return response.send(status.error.details[0].message)
    } else {
      new User({
        _id: mongoose.Types.ObjectId(),
        name: request.body.name,
        age: request.body.age
      }).save()
        .then(result => { return response.redirect('/api/users') })
        .catch(err => { console.log(err); return response.send(`Sorry, could not create a new user with this data !`) })
    }
  })

router.route('/:id')
  .all((request, response, next) => {
    const schema = {
      id: Joi.string().required()
    }
    const status = Joi.validate(request.params, schema)
    if (status.error) {
      return response.send(status.error.details[0].message)
    } else {
      next()
    }
  })
  .get((request, response) => {
    User.findById(request.params.id)
      .exec()
      .then(doc => { return response.send([doc.title, doc.author, doc.numberOfPages, doc.releaseYear].join('<br>')) })
      .catch(err => { console.log(err); return response.send(`Sorry, couldn't find a user with that id !`) })
  })
  .put((request, response) => {
    const schema = {
      name: Joi.string(),
      age: Joi.number()
    }
    const status = Joi.validate(request.body, schema)
    if (status.error) {
      response.send(status.error.details[0].message)
    } else {
      User.findByIdAndUpdate(request.params.id, request.body)
        .exec()
        .then(doc => { return response.redirect(303, `/api/users/${request.params.id}`) })
        .catch(err => { console.log(err); return response.send(`Sorry, couldn't update a user with that id !`) })
    }
  })
  .delete((request, response) => {
    User.findByIdAndDelete(request.params.id)
      .exec()
      .then(doc => { return response.redirect(303, `/api/users`) })
      .catch(err => { console.log(err); return response.send(`Sorry, couldn't delete a user with that id !`) })
  })
// ===-------------------------------------------------------------------------------------=== //

module.exports = router
