const mongoose = require( 'mongoose' )
const sanitizeHtml = require( 'sanitize-html' )

mongoose.Promise = global.Promise

const reviewSchema = new mongoose.Schema( {
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: 'You must provide a star rating ⭐',
  },
  text: {
    type: String,
    trim: true,
    required: 'Your review must have text!',
  },
  created: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: 'Reviews require an associated user 👤',
  },
  store: {
    type: mongoose.Schema.ObjectId,
    ref: 'Store',
    required: 'There must be an associated store 🍽',
  },
} )

reviewSchema.index(
  {
    author: 1,
    store: 1,
  },
  {
    unique: true,
  },
)

reviewSchema.pre( 'save', async function reviewSchemaPreSave( next ) {
  this.description = sanitizeHtml( this.description )

  next()
} )

// Can use this kind of function to always populate fields inside a model
function autopopulate( next ) {
  this.populate( 'author', 'name email' )
  next()
}

reviewSchema.pre( 'find', autopopulate )
reviewSchema.pre( 'findOne', autopopulate )

module.exports = mongoose.model( 'Review', reviewSchema )
