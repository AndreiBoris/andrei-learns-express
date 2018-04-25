const express = require( 'express' )
const storeController = require( '../controllers/storeController' )

const router = express.Router()

const { catchErrors } = require( '../handlers/errorHandlers' )

router.get( '/', catchErrors( storeController.getStores ) )
router.get( '/stores', catchErrors( storeController.getStores ) )
router.get( '/stores/:slug', catchErrors( storeController.getStoreBySlug ) )

router.get( '/add', storeController.addStore )
router.get( '/stores/:id/edit', catchErrors( storeController.editStore ) )

router.get( '/tags', catchErrors( storeController.getStoresByTag ) )
router.get( '/tags/:tag', catchErrors( storeController.getStoresByTag ) )

router.post( '/add', storeController.upload, catchErrors( storeController.resize ), catchErrors( storeController.createStore ) )
router.post( '/add/:id', storeController.upload, catchErrors( storeController.resize ), catchErrors( storeController.updateStore ) )

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
