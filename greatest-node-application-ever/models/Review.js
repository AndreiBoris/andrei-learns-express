const mongoose = require( 'mongoose' )
const sanitizeHtml = require( 'sanitize-html' )

mongoose.Promise = global.Promise

const reviewSchema = new mongoose.Schema( {
  rating: {
    type: Number,
    min: 0,
    max: 5,
    required: 'You must provide a star rating ⭐',
  },
  description: {
    type: String,
    trim: true,
    required: false,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  store: {
    type: mongoose.Schema.ObjectId,
    ref: 'Store',
    required: 'There must be an associated store!',
  },
} )

reviewSchema.pre( 'save', async function reviewSchemaPreSave( next ) {
  this.description = sanitizeHtml( this.description )

  next()
} )

module.exports = mongoose.model( 'Review', reviewSchema )
