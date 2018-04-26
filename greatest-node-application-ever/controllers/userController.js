const mongoose = require( 'mongoose' )
const objValues = require( 'lodash/values' )

exports.loginForm = ( req, res ) => {
  res.render( 'login', { title: 'Login' } )
}

exports.registerForm = ( req, res ) => {
  res.render( 'register', { title: 'Register' } )
}

exports.validateRegister = ( req, res, next ) => {
  // name
  req.sanitizeBody( 'name' )
  req.checkBody( 'name', 'You must supply a name!' ).notEmpty()

  // email
  req.checkBody( 'email', 'That email is not valid' ).isEmail()
  req.sanitizeBody( 'email' ).normalizeEmail( {
    remove_dots: false,
    remove_extension: false,
    gmail_remove_subaddress: false,
  } )

  // password
  req
    .checkBody( 'password', 'Password must be at least 5 characters long and contain a number' )
    .notEmpty()
    .isLength( { min: 5 } )
    .matches( /\d/ )
  req
    .checkBody( 'password-confirm', 'Password confirmation field must have the same value as the password field' )
    .notEmpty()
    .equals( req.body.password )

  const errors = req.validationErrors( true )

  if ( errors ) {
    req.flash( 'error', objValues( errors ).map( err => err.msg ) )
    res.render( 'register', { title: 'Register', body: req.body, flashes: req.flash() } )
    return
  }

  next()
}
