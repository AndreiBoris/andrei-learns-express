const mongoose = require( 'mongoose' )
const passport = require( 'passport' )

const User = mongoose.model( 'User' )
const promisify = require( 'es6-promisify' )

exports.login = passport.authenticate( 'local', {
  failureRedirect: '/login',
  failureFlash: 'Failed Login!',
  successRedirect: '/',
  successFlash: 'Successful Login!',
} )

exports.logout = ( req, res ) => {
  req.logout()
  req.flash( 'success', 'You are now logged out! 👋' )
  res.redirect( '/' )
}

exports.isLoggedIn = ( req, res, next ) => {
  if ( req.isAuthenticated() ) {
    next() // carry on, they are logged in
    return
  }
  req.flash( 'error', 'Oops! You must be logged in to do that!' )
  res.redirect( '/login' )
}
