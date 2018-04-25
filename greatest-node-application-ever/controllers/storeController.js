const mongoose = require( 'mongoose' )

const Store = mongoose.model( 'Store' )
const multer = require( 'multer' )
const jimp = require( 'jimp' )
const uuid = require( 'uuid' )

const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter( req, file, next ) {
    const isPhoto = file.mimetype.startsWith( 'image/' )
    if ( isPhoto ) {
      // first value is error, which is null here, second value means success and gets passed along
      next( null, true )
    } else {
      next( 'That filetype isn\'t allowed', false )
    }
  },
}

// This will just allow us to upload a photo, we will still need to resize and save
exports.upload = multer( multerOptions ).single( 'photo' )

exports.resize = async ( req, res, next ) => {
  // Check if there is no new file to resize
  if ( !req.file ) {
    next() // Skip to the next middleware
    return
  }

  const extension = req.file.mimetype.split( '/' )[1]

  req.body.photo = `${uuid.v4()}.${extension}`

  // now we resize
  const photo = await jimp.read( req.file.buffer )
  await photo.resize( 800, jimp.AUTO )
  await photo.write( `./public/uploads/${req.body.photo}` )

  // once we have written the photo to file system, keep going!
  next()
}

exports.myMiddleware = ( req, res, next ) => {
  req.name = 'Andy'
  // Set a cookie as part of the response
  res.cookie( 'test-cookie', 'This cookie is a test, yes', { maxAge: 900000 } )
  next()
}

exports.homePage = ( req, res ) => {
  res.render( 'index', { name: req.name } )
}

exports.addStore = ( req, res ) => {
  res.render( 'editStore', { title: 'Add a Store' } )
}

// Will need to get the form to accept file uploads
// Will need logic to upload and resize the file using middleware
// External package multer for file uploading
// External package jimp for file resizing
exports.createStore = async ( req, res ) => {
  /**
   * This works because we've already set up a strict schema in models/Store.js
   */
  const store = await new Store( req.body ).save()

  req.flash( 'success', `Successfully Created ${store.name}! Care to leave a review?` )

  res.redirect( `/stores/${store.slug}` )
}

exports.getStores = async ( req, res ) => {
  // Query the database for all stores
  const stores = await Store.find()

  res.render( 'stores', { title: 'Stores', stores } )
}

exports.editStore = async ( req, res ) => {
  // Find the store given the ID
  const store = await Store.findOne( { _id: req.params.id } )
  // TODO: Confirm user is the owner of the store
  // Render out the edit form
  res.render( 'editStore', { title: `Edit ${store.name}`, store } )
}

exports.updateStore = async ( req, res ) => {
  // set the location data to be a Point
  req.body.location.type = 'Point'

  // Find the store given the ID
  const storeQuery = { _id: req.params.id }
  const storeUpdatedData = req.body

  const store = await Store.findOneAndUpdate( storeQuery, storeUpdatedData, {
    new: true, // Return the updated store instead of the old one
    runValidators: true, // Force model to run validators
  } ).exec()
  // TODO: Confirm user is the owner of the store

  // Show the user the updated store and tell them the update worked
  req.flash( 'success', `Successfully updated <strong>${store.name}</strong>. <a href="/stores/${store.slug}">View store →</a>` )
  res.redirect( `/stores/${store._id}/edit` )
}

exports.getStoreBySlug = async ( req, res, next ) => {
  // Get the store
  const store = await Store.findOne( { slug: req.params.slug } )

  if ( !store ) {
    next()
    return
  }

  // Render the template
  res.render( 'store', { title: store.name, store } )
}

exports.getStoresByTag = async ( req, res ) => {
  const tags = await Store.getTagsList()
  const tag = req.params.tag

  res.render( 'tag', { title: 'Tags', tags, tag } )
}
