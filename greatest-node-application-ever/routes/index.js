const express = require( 'express' )
const storeController = require( '../controllers/storeController' )
const userController = require( '../controllers/userController' )
const authController = require( '../controllers/authController' )

const router = express.Router()

const { catchErrors } = require( '../handlers/errorHandlers' )

router.get( '/', catchErrors( storeController.getStores ) )
router.get( '/stores', catchErrors( storeController.getStores ) )
router.get( '/stores/:slug', catchErrors( storeController.getStoreBySlug ) )

router.get( '/add', authController.isLoggedIn, storeController.addStore )
router.get( '/stores/:id/edit', catchErrors( storeController.editStore ) )

router.get( '/tags', catchErrors( storeController.getStoresByTag ) )
router.get( '/tags/:tag', catchErrors( storeController.getStoresByTag ) )

router.post( '/add', authController.isLoggedIn, storeController.upload, catchErrors( storeController.resize ), catchErrors( storeController.createStore ) )
router.post( '/add/:id', authController.isLoggedIn, storeController.upload, catchErrors( storeController.resize ), catchErrors( storeController.updateStore ) )

router.get( '/login', userController.loginForm )
router.post( '/login', userController.validateLogin, authController.login )
router.get( '/register', userController.registerForm )

router.post( '/register', userController.validateRegister, userController.register, authController.login )
router.get( '/logout', authController.logout )

router.get( '/account', authController.isLoggedIn, userController.account )
router.post( '/account', authController.isLoggedIn, catchErrors( userController.updateAccount ) )

// Password reset
router.post( '/account/forgot', catchErrors( authController.forgot ) )
router.get( '/account/reset/:token', catchErrors( authController.resetPasswordUser ), catchErrors( authController.reset ) )
router.post(
  '/account/reset/:token',
  authController.confirmedPasswords,
  catchErrors( authController.resetPasswordUser ),
  catchErrors( authController.changePassword ),
)

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
