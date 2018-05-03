import axios from 'axios'
import moment from 'moment'

const loadReviews = ( reviewList, storeId ) => {
  axios
    .get( `/api/reviews/${storeId}` )
    .then( ( { data } ) => {
      /* eslint-disable no-param-reassign */
      reviewList.innerHTML = data
        .map( review => {
          const starRatingHTML = [ 1, 2, 3, 4, 5 ].map( number => `${number <= review.rating ? '★' : '☆'}` ).join( '' )
          return `
        <div class="review">

          <div class="review__header">
            <div class="review__author">
              <img class="avatar" src="${review.author.gravatar}">
              <span>${review.author.name}</span>
            </div>
            <div class="review__stars">
              ${starRatingHTML}
            </div>
            <time class="review__time">
              ${moment( review.created ).fromNow()}
            </time>
          </div>

          <div class="review__body">
            <p>${review.text}</p>
          </div>

          <div class="review__meta ${review.updated === review.created ? 'hide' : ''}">
            Last updated ${moment( review.updated ).fromNow()}
          </div>
        </div>
        `
        } )
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
