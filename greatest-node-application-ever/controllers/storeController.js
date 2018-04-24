const mongoose = require( 'mongoose' )

const Store = mongoose.model( 'Store' )

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

exports.createStore = async ( req, res ) => {
  /**
   * This works because we've already set up a strict schema in models/Store.js
   */
  const store = await new Store( req.body ).save()

  req.flash( 'success', `Successfully Created ${store.name}! Care to leave a review?` )

  res.redirect( `/store/${store.slug}` )
}

exports.getStores = async ( req, res ) => {
  // Query the database for all stores
  const stores = await Store.find()
  console.log( stores )
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
