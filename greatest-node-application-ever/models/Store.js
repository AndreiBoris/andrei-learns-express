const mongoose = require( 'mongoose' )
const slug = require( 'slugs' )

mongoose.Promise = global.Promise

const storeSchema = new mongoose.Schema( {
  name: {
    type: String,
    trim: true,
    required: 'Please enter a store name!',
  },
  slug: String,
  description: {
    type: String,
    trim: true,
  },
  tags: [ String ],
  created: {
    type: Date,
    default: Date.now,
  },
  photo: String,
  location: {
    type: {
      type: String,
      default: 'Point',
    },
    coordinates: [
      {
        type: Number,
        required: 'You must supply coordinates!',
      },
    ],
    address: {
      type: String,
      required: 'You must supply an address',
    },
  },
} )

storeSchema.pre( 'save', function storeSchemaPreSave( next ) {
  if ( !this.isModified( 'name' ) ) {
    next()
    return
  }

  this.slug = slug( this.name )

  next()
  // TODO: Make more resilient so slugs are unique
} )

module.exports = mongoose.model( 'Store', storeSchema )
