import axios from 'axios'
import md5 from 'md5'
import moment from 'moment'

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

const loadReviews = ( reviewList, storeId ) => {
  axios
    .get( `/api/reviews/${storeId}` )
    .then( ( { data } ) => {
      /* eslint-disable no-param-reassign */
      reviewList.innerHTML = data
        .map( review => `
        <div class="review">

          <div class="review__header">
            <div class="review__author">
              <img class="avatar" src="https://gravatar.com/avatar/${md5( review.author.email )}?s=200&d=retro">
              <span>${review.author.name}</span>
            </div>
            <div class="review__stars">
              ${review.rating}
            </div>
            <div class="review__time">
              ${moment( review.created ).fromNow()}
            </div>
          </div>

          <div class="review__body">
            <p>${review.text}</p>
          </div>

          <div class="review__meta ${review.updated === review.created ? 'hide' : ''}">
            Last updated ${moment( review.updated ).fromNow()}
          </div>
        </div>
        ` )
        .join( '' )
      /* eslint-enable */
    } )
    .catch( console.error )
}

const enableReview = ( reviewForm, reviewList ) => {
  if ( !reviewList ) return

  loadReviews( reviewList, reviewList.dataset.storeId )

  // Can only add listener if the reviewForm is on the page, indicating a logged-in user
  if ( reviewForm ) {
    // const stars = Array.from( reviewForm.querySelectorAll( '.reviewer__stars [type="checkbox"]' ) )
    // const starLabels = Array.from( reviewForm.querySelectorAll( '.reviewer__stars label' ) )
    const errorDiv = reviewForm.querySelector( '.reviewer__errors' )
    // button that users who have previous left a review can use to edit their previous review
    const editReviewButton = reviewForm.querySelector( '.reviewer__edit__button' )
    // Section that users who have previously left a review initially see
    const reviewEditQuestion = reviewForm.querySelector( '.reviewer__edit' )
    // Section that where users can create or edit a review
    const reviewEditForm = reviewForm.querySelector( '.reviewer__form' )
    // Text that users see before or after they edit a review
    const reviewEditText = reviewForm.querySelector( '.reviewer__edit__text' )

    editReviewButton.addEventListener( 'click', () => {
      reviewEditQuestion.classList.add( 'hidden' )
      reviewEditForm.classList.remove( 'hidden' )
    } )

    // starLabels.forEach( label => {
    //   label.on( 'click', function selectStar() {
    //     const associatedStar = stars.find( star => star.name === this.getAttribute( 'for' ) )
    //     stars.forEach( star => {
    //       /* eslint-disable no-param-reassign */
    //       star.checked = false
    //       /* eslint-enable */
    //     } )
    //     associatedStar.checked = true
    //   } )
    // } )

    reviewForm.on( 'submit', function submitReviewForm( ev ) {
      ev.preventDefault()
      const rating = this.rating.value // getStarRating( stars )
      const text = this.text.value

      axios
        .post( this.action, {
          rating,
          text,
        } )
        .then( ( { data } ) => {
          errorDiv.innerHTML = ''
          errorDiv.classList.add( 'hide' )
          reviewEditText.innerText = 'Your review has been submitted! Click below if you would like to edit your review 🙂'
          reviewEditQuestion.classList.remove( 'hidden' )
          reviewEditForm.classList.add( 'hidden' )
          loadReviews( reviewList, data.store )
        } )
        .catch( ( { response } ) => {
          const { status, data } = response
          if ( status === 422 ) {
            if ( Array.isArray( data ) ) {
              errorDiv.innerHTML = data
                .map( validationError => `
              <p>
                ${validationError}
              </p>
              ` )
                .join( '' )
              errorDiv.classList.remove( 'hide' )
            }
            return
          }
          console.error( response )
        } )
    } )
  }
}

export default enableReview
