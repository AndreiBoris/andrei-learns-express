const express = require( 'express' )
const storeController = require( '../controllers/storeController' )

const router = express.Router()

/**
 * Example of route specific middleware
 */
router.get( '/', storeController.myMiddleware, storeController.homePage )

// Old Example stuff
// Do work here
// router.get( '/', ( req, res ) => {
//   /**
//    * Example of sending JSON through Express
//    */
//   // const andy = {
//   //   name: 'Andy',
//   //   age: 40,
//   //   awesome: true,
//   // }
//   // res.json( andy )
//   /**
//    * Example of accessing the URL query parameters
//    */
//   // res.send( req.query )
//   /**
//    * Example of using template with some 'locals' passed to it.
//    */
//   res.render( 'hello', {
//     title: 'I love food',
//     name: 'Andy',
//     dog: req.query.dog,
//   } )
// } )

// /**
//  * Example of using a url slug as a parameter
//  */
// router.get( '/reverse/:name', ( req, res ) => {
//   const reveresed = [ ...req.params.name ].reverse().join( '' )
//   res.send( reveresed )
// } )

module.exports = router
