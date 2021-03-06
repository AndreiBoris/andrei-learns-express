const express = require( 'express' )
const storeController = require( '../controllers/storeController' )
const userController = require( '../controllers/userController' )
const authController = require( '../controllers/authController' )
const reviewController = require( '../controllers/reviewController' )

const router = express.Router()

const { catchErrors } = require( '../handlers/errorHandlers' )

router.get( '/', catchErrors( storeController.getStores ) )
router.get( '/page/:page', catchErrors( storeController.getStores ) )
router.get( '/stores', catchErrors( storeController.getStores ) )
router.get( '/stores/page/:page', catchErrors( storeController.getStores ) )
router.get( '/stores/:slug', catchErrors( storeController.getStoreBySlug ) )
router.get( '/hearts', authController.isLoggedIn, catchErrors( storeController.getHeartedStores ) )
router.get( '/top', catchErrors( storeController.topStores ) )

router.get( '/map', storeController.mapPage )

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

/**
 * API
 */

router.get( '/api/search', catchErrors( storeController.searchStores ) )
router.get( '/api/stores/near', catchErrors( storeController.mapStores ) )
router.post( '/api/stores/:id/heart', catchErrors( storeController.heartStore ) )
router.post( '/api/reviews/:id', authController.isLoggedIn, catchErrors( reviewController.addReview ) )
router.get( '/api/reviews/:id', catchErrors( reviewController.getStoreReviews ) )

module.exports = router
