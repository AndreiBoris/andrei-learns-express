const mongoose = require( 'mongoose' )
const slug = require( 'slugs' )
const sanitizeHtml = require( 'sanitize-html' )

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
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: 'You must supply an author',
  },
} )

// Define our indexes
storeSchema.index( {
  name: 'text',
  description: 'text',
} )
storeSchema.index( {
  location: '2dsphere',
} )

storeSchema.pre( 'save', async function storeSchemaPreSave( next ) {
  this.name = sanitizeHtml( this.name )
  this.description = sanitizeHtml( this.description )
  this.location.address = sanitizeHtml( this.location.address )

  if ( !this.isModified( 'name' ) ) {
    next()
    return
  }

  const baseSlug = slug( this.name )
  // find other stores that have this same slug or variations like slug-1, slug-2, etc.
  const slugRegEx = new RegExp( `^(${baseSlug})((-[0-9]*$)?)$`, 'i' )

  const storesWithSlug = await this.constructor.find( { slug: slugRegEx } )
  const storeSlugs = storesWithSlug.map( store => store.slug )

  this.slug = baseSlug

  // Handle duplicate slugs
  let numberSuffix = storeSlugs.length + 1
  while ( storeSlugs.includes( this.slug ) ) {
    this.slug = `${baseSlug}-${numberSuffix}`
    // Keep attaching new suffixes until we have one that is not already in the database
    numberSuffix += 1
  }

  next()
} )

storeSchema.statics.getTagsList = async function storeSchemaGetTagsList() {
  return this.aggregate()
    .unwind( 'tags' )
    .group( { _id: '$tags', count: { $sum: 1 } } )
    .sort( { count: 'desc' } )
}

module.exports = mongoose.model( 'Store', storeSchema )
