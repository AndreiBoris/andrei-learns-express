const mongoose = require( 'mongoose' )

const Store = mongoose.model( 'Store' )
const Review = mongoose.model( 'Review' )
const User = mongoose.model( 'User' )

const appValidation = require( '../validation' )

exports.addReview = async ( req, res ) => {
  appValidation.validateReview( req )

  if ( appValidation.displayErrorsAjax( req, res ) ) {
    return
  }

  const reviewQuery = {
    author: req.user._id,
    store: req.params.id,
  }

  const reviewPromise = Review.findOne( reviewQuery ).select( '_id' )
  const storePromise = Store.findById( reviewQuery.store ).select( '_id' )
  const userPromise = User.findById( reviewQuery.author ).select( '_id' )
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

exports.getStoreReviews = async ( req, res ) => {
  const reviews = await Review.find( {
    store: req.params.id,
  } )
    .select( 'rating author text created updated' )
    .populate( 'author', 'name email' )
    .sort( { created: 'descending' } )

  res.json( reviews )
}
