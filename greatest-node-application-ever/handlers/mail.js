const nodemailer = require( 'nodemailer' )
const pug = require( 'pug' )
const juice = require( 'juice' )
const htmlToText = require( 'html-to-text' )
const promisify = require( 'es6-promisify' )

const transportConfig = {
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
}

const transport = nodemailer.createTransport( transportConfig )

const generateHTML = ( filename, options = {} ) => {
  const html = pug.renderFile( `${__dirname}/../views/email/${filename}.pug`, options )

  // Many html email clients are not able to deal with HTML styling that are not inlined. This inlines all HTML
  const inlined = juice( html )

  return inlined
}

exports.send = async options => {
  const html = generateHTML( options.filename, options )
  const text = htmlToText.fromString( html )
  const mailOptions = {
    from: 'Andrei Borissenko <noreply@andybee.com>',
    to: options.user.email,
    subject: options.subject,
    html,
    text,
  }

  const sendMail = promisify( transport.sendMail, transport )

  return sendMail( mailOptions )
}
