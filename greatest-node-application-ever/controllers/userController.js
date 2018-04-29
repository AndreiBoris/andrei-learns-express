const mongoose = require( 'mongoose' )
const objValues = require( 'lodash/values' )
const objDeepMerge = require( 'lodash/merge' )

const User = mongoose.model( 'User' )
const promisify = require( 'es6-promisify' )
const appValidation = require( '../validation' )

exports.loginForm = ( req, res ) => {
  res.render( 'login', { title: 'Login' } )
}

exports.registerForm = ( req, res ) => {
  res.render( 'register', { title: 'Register' } )
}

exports.validateRegister = ( req, res, next ) => {
  // name
  appValidation.validateName( req )

  // email
  appValidation.validateEmail( req )

  // password
  appValidation.validatePassword( req )

  if ( appValidation.displayErrors( req, res, 'register', { title: 'Register' } ) ) {
    return
  }

  next()
}

exports.validateLogin = ( req, res, next ) => {
  // email
  appValidation.validateEmail( req )

  if ( appValidation.displayErrors( req, res, 'login', { title: 'Login' } ) ) {
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
