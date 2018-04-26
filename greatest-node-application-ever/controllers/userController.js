const mongoose = require( 'mongoose' )
const objValues = require( 'lodash/values' )

const User = mongoose.model( 'User' )
const promisify = require( 'es6-promisify' )

exports.loginForm = ( req, res ) => {
  res.render( 'login', { title: 'Login' } )
}

exports.registerForm = ( req, res ) => {
  res.render( 'register', { title: 'Register' } )
}

function validateName( req ) {
  req.sanitizeBody( 'name' )
  req
    .checkBody( 'name', 'You must supply a name that is at least 3 characters long!' )
    .notEmpty()
    .isLength( { min: 3 } )
}

function validateEmail( req ) {
  req.checkBody( 'email', 'That email is not valid' ).isEmail()
  req.sanitizeBody( 'email' ).normalizeEmail( {
    gmail_remove_dots: true,
    gmail_remove_subaddress: false,
  } )
}

exports.validateRegister = ( req, res, next ) => {
  // name
  validateName( req )

  // email
  validateEmail( req )

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

exports.validateLogin = ( req, res, next ) => {
  // email
  validateEmail( req )

  const errors = req.validationErrors( true )

  if ( errors ) {
    req.flash( 'error', objValues( errors ).map( err => err.msg ) )
    res.render( 'login', { title: 'Login', body: req.body, flashes: req.flash() } )
    return
  }

  next()
}

exports.register = async ( req, res, next ) => {
  // save the new user to the database
  const user = new User( {
    email: req.body.email,
    name: req.body.name,
  } )
  const register = promisify( User.register, User )
  await register( user, req.body.password )

  next() // pass to authController.login
}

exports.account = ( req, res ) => {
  res.render( 'account', { title: 'Edit Your Account' } )
}

exports.updateAccount = async ( req, res ) => {
  const currentUserQuery = {
    _id: req.user._id,
  }
  const updates = {
    $set: {
      name: req.body.name,
      email: req.body.email,
    },
  }

  const user = await User.findOneAndUpdate( currentUserQuery, updates, {
    new: true, // Return the updated store instead of the old one
    runValidators: true, // Force model to run validators
    context: 'query',
  } )

  req.flash( 'success', 'Updated your account information 😮' )

  res.redirect( 'back' )
}
