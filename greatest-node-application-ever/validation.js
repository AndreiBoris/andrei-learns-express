const objValues = require( 'lodash/values' )
const objDeepMerge = require( 'lodash/merge' )

exports.validateName = req => {
  req.sanitizeBody( 'name' )
  req
    .checkBody( 'name', 'You must supply a name that is at least 3 characters long!' )
    .notEmpty()
    .isLength( { min: 3 } )
}

exports.validateEmail = req => {
  req.checkBody( 'email', 'That email is not valid' ).isEmail()
  req.sanitizeBody( 'email' ).normalizeEmail( {
    gmail_remove_dots: true,
    gmail_remove_subaddress: false,
  } )
}

exports.validatePasswordResetToken = req => {
  req
    .checkBody( 'token', 'The password reset token provided is invalid.' )
    .isHexadecimal()
    .isLength( { min: 40, max: 40 } )
}

exports.passwordResetTokenExpired = expiryDate => expiryDate.getTime() <= new Date().getTime()

exports.validatePassword = req => {
  req
    .checkBody( 'password', 'Password must be at least 5 characters long and contain a number' )
    .notEmpty()
    .isLength( { min: 5 } )
    .matches( /\d/ )
  req
    .checkBody( 'password-confirm', 'Password confirmation field must have the same value as the password field' )
    .notEmpty()
    .equals( req.body.password )
}

exports.displayErrors = ( req, res, view, options = {}, redirect = false ) => {
  const errors = req.validationErrors( true )

  if ( errors ) {
    req.flash( 'error', objValues( errors ).map( err => err.msg ) )

    if ( redirect ) {
      res.redirect( view )
    } else {
      // Add argument options to default options
      const viewOptions = objDeepMerge( { body: req.body, flashes: req.flash() }, options )
      res.render( view, viewOptions ) // show errors to user
    }

    return true // tell caller that errors were found
  }
  return false // tell caller that no errors were found
}
