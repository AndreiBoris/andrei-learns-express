import axios from 'axios'

function getStarRating( stars ) {
  const starRange = [ 5, 4, 3, 2, 1 ] // [ 5, 4, ..., 1]
  // return the highest star rating passed
  for ( let i = 0; i < stars.length; i += 1 ) {
    const star = stars[i]
    if ( star.name === `star${starRange[i]}` && star.checked ) {
      return starRange[i]
    }
  }
  return null
}

const loadReviews = () => {
  // axios.get( '/api/reviews/:id' )
}

const enableReview = reviewForm => {
  if ( !reviewForm ) return

  const stars = Array.from( reviewForm.querySelectorAll( '.reviewer__stars [type="checkbox"]' ) )
  const starLabels = Array.from( reviewForm.querySelectorAll( '.reviewer__stars label' ) )

  starLabels.forEach( label => {
    label.on( 'click', function selectStar() {
      const associatedStar = stars.find( star => star.name === this.getAttribute( 'for' ) )
      stars.forEach( star => {
        /* eslint-disable no-param-reassign */
        star.checked = false
        /* eslint-enable */
      } )
      associatedStar.checked = true
    } )
  } )

  reviewForm.on( 'submit', function submitReviewForm( ev ) {
    ev.preventDefault()
    const rating = getStarRating( stars )
    const text = this.text.value

    axios
      .post( this.action, {
        rating,
        text,
      } )
      .then( ( { data } ) => {
        console.log( data )
      } )
      .catch( console.error )
  } )
}

export default enableReview
