exports.sanitizePage = page => {
  const integerPage = parseInt( page, 10 )
  if ( Number.isNaN( integerPage ) ) {
    return 1
  }
  return Math.max( 1, integerPage )
}
