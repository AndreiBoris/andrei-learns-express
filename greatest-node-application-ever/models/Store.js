const mongoose = require( 'mongoose' )
const slug = require( 'slugs' )
const sanitizeHtml = require( 'sanitize-html' )

mongoose.Promise = global.Promise

const storeSchema = new mongoose.Schema(
  {
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
  },
  // Here we make the virtual fields explicitly visible on the Store model ( when they have been populated )
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

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

storeSchema.statics.getTagsList = function storeSchemaGetTagsList() {
  return this.aggregate()
    .unwind( 'tags' )
    .group( { _id: '$tags', count: { $sum: 1 } } )
    .sort( { count: 'desc' } )
}

storeSchema.statics.getTopStores = function storeSchemaGetTopStores() {
  return this.aggregate( [
    // Lookup stores and populate their reviews
    {
      $lookup: {
        from: 'reviews',
        localField: '_id',
        foreignField: 'store',
        as: 'reviews',
      },
    },
    // filter for only items that have 2 or more reviews

    {
      $addFields: {
        count: { $size: '$reviews' },
      },
    },
    {
      $match: {
        count: { $gt: 1 },
      },
    },
    // ALTERNATIVELY can check if the review at index 1 exists, indicating 2 or more reviews
    // { $match: { 'reviews.1': { $exists: true } } },
    // add the average reviews field
    // {
    //   $addFields: {
    //     average: { $avg: '$reviews.rating' },
    //   },
    // },
    // ALTERNATIVELY can use project to add fields like this
    {
      $project: {
        photo: '$$ROOT.photo',
        name: '$$ROOT.name',
        count: '$$ROOT.count',
        slug: '$$ROOT.slug',
        average: { $avg: '$reviews.rating' },
      },
    },
    // sort it by our new field, highest reviews first
    {
      $sort: {
        average: -1,
      },
    },
    // limit to at most 10
    {
      $limit: 10,
    },
    // Include only needed fields
    // {
    //   $project: {
    //     slug: 1,
    //     name: 1,
    //     photo: 1,
    //     count: 1,
    //     average: 1,
    //   },
    // },
  ] )
}

// find reviews where the stores _id property === reviews store property
storeSchema.virtual( 'reviews', {
  ref: 'Review', // what model to link?
  localField: '_id', // which field on the store?
  foreignField: 'store', // which field on the review?
} )

function autopopulate( next ) {
  this.populate( 'reviews' )

  next()
}

storeSchema.pre( 'find', autopopulate )
storeSchema.pre( 'findOne', autopopulate )

module.exports = mongoose.model( 'Store', storeSchema )
