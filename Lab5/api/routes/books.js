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
const Book = require('../models/Book')
// ===-------------------------------------------------------------------------------------=== //

// ===-------------------------------------------------------------------------------------=== //
// =-- BOOKS ROUTES
// ===-------------------------------------------------------------------------------------=== //
router.route('/')
  .post((request, response) => {
    const schema = {
      title: Joi.string().min(3).required(),
      author: Joi.string().min(3).required(),
      numberOfPages: Joi.number().required(),
      releaseYear: Joi.number().required()
    }
    const status = Joi.validate(request.body, schema)
    if (status.error) {
      return response.send(status.error.details[0].message)
    } else {
      new Book({
        _id: mongoose.Types.ObjectId(),
        title: request.body.title,
        author: request.body.author,
        numberOfPages: request.body.numberOfPages,
        releaseYear: request.body.releaseYear
      }).save()
        .then(result => { return response.redirect('/api/books') })
        .catch(err => { console.log(err); return response.send(`Sorry, could not create a new book with this data !`) })
    }
  })
  .get((request, response) => {
    Book.find({})
      .exec()
      .then(doc => { return response.send(doc) })
      .catch(err => { console.log(err); return response.send(`Sorry, couldn't fetch the current list of books !`) })
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
    Book.findById(request.params.id)
      .exec()
      .then(doc => { return response.send([doc.title, doc.author, doc.numberOfPages, doc.releaseYear].join('<br>')) })
      .catch(err => { console.log(err); return response.send(`Sorry, couldn't find a book with that id !`) })
  })
  .put((request, response) => {
    const schema = {
      title: Joi.string(),
      author: Joi.string(),
      numberOfPages: Joi.number(),
      releaseYear: Joi.number()
    }
    const status = Joi.validate(request.body, schema)
    if (status.error) {
      response.send(status.error.details[0].message)
    } else {
      Book.findByIdAndUpdate(request.params.id, request.body)
        .exec()
        .then(doc => { return response.redirect(303, `/api/books/${request.params.id}`) })
        .catch(err => { console.log(err); return response.send(`Sorry, couldn't update a book with that id !`) })
    }
  })
  .delete((request, response) => {
    Book.findByIdAndDelete(request.params.id)
      .exec()
      .then(doc => { return response.redirect(303, `/api/books`) })
      .catch(err => { console.log(err); return response.send(`Sorry, couldn't delete a book with that id !`) })
  })
// ===-------------------------------------------------------------------------------------=== //

module.exports = router
