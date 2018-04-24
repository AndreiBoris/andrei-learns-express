exports.myMiddleware = ( req, res, next ) => {
  req.name = 'Andy'
  // Set a cookie as part of the response
  res.cookie( 'test-cookie', 'This cookie is a test, yes', { maxAge: 900000 } )
  next()
}

exports.homePage = ( req, res ) => {
  res.render( 'index', { name: req.name } )
}
