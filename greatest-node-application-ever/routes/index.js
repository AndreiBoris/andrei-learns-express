const express = require( 'express' )

const router = express.Router()

// Do work here
router.get( '/', ( req, res ) => {
  console.log( 'Into the terminal!' )
  res.send( 'Oh yeah!!' )
} )

module.exports = router
