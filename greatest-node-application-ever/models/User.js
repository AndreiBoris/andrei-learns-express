const mongoose = require( 'mongoose' )

const { Schema } = mongoose

mongoose.Promise = global.Promise

const md5 = require( 'md5' )
const validator = require( 'validator' )
const mongodbErrorHandler = require( 'mongoose-mongodb-errors' )
const passportLocalMongoose = require( 'passport-local-mongoose' )

const userSchema = new Schema( {
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    validate: [ validator.isEmail, 'Invalid Email Address' ],
    required: 'Please supply an email address',
  },
  name: {
    type: String,
    required: 'Please supply a name',
    trim: true,
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
} )

userSchema.virtual( 'gravatar' ).get( function userGravatar() {
  // Use a hash to avoid showing the user's email address when creating the gravatar field
  const hash = md5( this.email )
  return `https://gravatar.com/avatar/${hash}?s=200`
} )

//
/**
 * Indicates what field on our schema is used as login username
 *
 * This also assigns some low level methods to our User model, like .register()
 */
userSchema.plugin( passportLocalMongoose, {
  usernameField: 'email',
} )
// Changes errors to more human readable ones
userSchema.plugin( mongodbErrorHandler )

module.exports = mongoose.model( 'User', userSchema )
