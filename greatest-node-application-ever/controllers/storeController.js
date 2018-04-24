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
