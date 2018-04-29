const mongoose = require( 'mongoose' )
const passport = require( 'passport' )
const crypto = require( 'crypto' )

const User = mongoose.model( 'User' )

const appValidation = require( '../validation' )

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

exports.forgot = async ( req, res ) => {
  // See if a user with this email exists
  appValidation.validateEmail( req )

  if ( appValidation.displayErrors( req, res, 'login', { title: 'Login' } ) ) {
    return
  }

  const user = await User.findOne( {
    email: req.body.email,
  } )

  // *** WARNING *** This is a security issue. Sometime you may not what to tell people whether a user with a certain email exists or not
  if ( !user ) {
    req.flash( 'error', 'This email is not registered with any user in our database.' )
    res.redirect( '/login' )
    return
  }

  // Set reset tokens and expire on their account
  user.resetPasswordToken = crypto.randomBytes( 20 ).toString( 'hex' )
  user.resetPasswordExpires = Date.now() + 3600000 // 1 hour
  user.save()
  // Send them an email with the token
  // TODO: do this properly, for now send token directly
  const resetUrl = `http://${req.headers.host}/account/reset/${user.resetPasswordToken}`

  req.flash( 'success', `You have been emailed a password reset link! ${resetUrl}` )

  // Redirect to login page
  res.redirect( '/login' )
}

function passwordResetTokenHasExpired( user ) {
  return !user || !user.resetPasswordExpires || appValidation.passwordResetTokenExpired( user.resetPasswordExpires )
}

function passwordResetTokenRejected( req, res ) {
  req.flash( 'error', 'Sorry, this password reset token token has expired. Please get another one.' )
  res.redirect( '/login' )
}

exports.reset = async ( req, res ) => {
  // Find a user
  const user = await User.findOne( {
    resetPasswordToken: req.params.token,
  } )

  // Check that the token is not expired
  if ( passwordResetTokenHasExpired( user ) ) {
    passwordResetTokenRejected( req, res )
    return
  }

  // Show password reset form
  res.render( 'reset', { title: 'Password Reset', token: req.params.token } )
}

exports.changePassword = async ( req, res ) => {
  // passwor
  appValidation.validatePassword( req )

  // token
  appValidation.validatePasswordResetToken( req )

  const REDIRECT = true
  if ( appValidation.displayErrors( req, res, `/account/reset/${req.body.token}`, null, REDIRECT ) ) {
    return
  }

  // Find a user
  const user = await User.findOne( {
    resetPasswordToken: req.body.token,
  } )

  // Check that the token corresponds to an existing user AND
  // Check that the token has not expired
  if ( passwordResetTokenHasExpired( user ) ) {
    passwordResetTokenRejected( req, res )
    return
  }

  res.render( 'login', { title: 'SUCCESS' } )
}
