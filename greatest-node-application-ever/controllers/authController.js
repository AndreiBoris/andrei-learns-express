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
