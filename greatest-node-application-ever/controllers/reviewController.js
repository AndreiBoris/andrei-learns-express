const mongoose = require( 'mongoose' )
const range = require( 'lodash/range' )

const Store = mongoose.model( 'Store' )
const Review = mongoose.model( 'Review' )
const User = mongoose.model( 'User' )

exports.reviewStore = async ( req, res ) => {
  const reviewQuery = {
    author: req.user._id,
    store: req.params.id,
  }

  const reviewPromise = Review.findOne( reviewQuery ).select( '_id' )
  const storePromise = Store.findById( req.params.id ).select( '_id' )
  const userPromise = User.findById( req.user._id ).select( '_id' )
  const [ store, user, existingReview ] = await Promise.all( [ storePromise, userPromise, reviewPromise ] )

  // TODO: Test what happens when bad store or user is provided

  let review

  if ( existingReview ) {
    // update existing review
    req.body.updated = Date.now()
    review = await Review.findOneAndUpdate( reviewQuery, req.body, {
      new: true, // Return the updated store instead of the old one
      runValidators: true, // Force model to run validators
    } ).exec()
  } else {
    // create a new one
    req.body.author = user._id
    req.body.store = store._id
    review = await new Review( req.body ).save()
  }

  res.json( review )
}

exports.grabStoreReviews = async ( req, res, next ) => {
  const reviews = await Review.find( {
    store: req.params.id,
  } )
    .select( 'rating author text created updated' )
    .populate( 'author', 'name email' )
    .sort( { updated: 'descending' } )

  req.body.reviews = reviews
  next()
}

exports.getStoreReviews = async ( req, res ) => {
  res.json( req.body.reviews )
}
