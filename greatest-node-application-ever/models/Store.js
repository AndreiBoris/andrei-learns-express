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

storeSchema.pre( 'save', async function storeSchemaPreSave( next ) {
  if ( !this.isModified( 'name' ) ) {
    next()
    return
  }

  this.slug = slug( this.name )
  // find ohter stores that have this same slug or variations like slug-1, slug-2, etc.
  const slugRegEx = new RegExp( `^(${this.slug})((-[0-9]*$)?)$`, 'i' )

  const storesWithSlug = await this.constructor.find( { slug: slugRegEx } )

  if ( storesWithSlug.length ) {
    this.slug = `${this.slug}-${storesWithSlug.length + 1}`
  }

  // TODO: Requires a check that the new slug created isn't actually inside storesWithSlug and to keep changing until this is not the case

  next()
  // TODO: Make more resilient so slugs are unique
} )

module.exports = mongoose.model( 'Store', storeSchema )
