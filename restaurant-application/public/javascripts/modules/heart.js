import axios from 'axios'

let counterDiv

function updateHeartCounter( counter, count ) {
  if ( !counter ) return

  /* eslint-disable no-param-reassign */
  counter.innerText = count
  /* eslint-enable */
}

function updateHeartButton( button, pressed ) {
  if ( pressed ) {
    button.classList.add( 'heart__button--hearted' )
  } else {
    button.classList.remove( 'heart__button--hearted' )
  }
}

function handleHeartFormSubmit( ev ) {
  ev.preventDefault()

  const postUrl = this.action

  axios
    .post( postUrl )
    .then( ( { data } ) => {
      updateHeartCounter( counterDiv, data.user.hearts.length )
      const isHearted = data.user.hearts.includes( data.storeId )
      updateHeartButton( this.heart, isHearted )
      if ( isHearted ) {
        this.heart.classList.add( 'heart__button--float' )
        // Once the animation ends, remove the float class
        this.heart.addEventListener(
          'animationend',
          event => {
            console.log( 'HEART HAS FLOWN' )
            if ( event.animationName === 'fly' ) {
              this.heart.classList.remove( 'heart__button--float' )
            }
          },
          {
            once: true,
          },
        )
      }
    } )
    .catch( console.error )
}

const toggleHeart = ( counterDivSelected, heartForms ) => {
  counterDiv = counterDivSelected

  heartForms.forEach( form => {
    form.on( 'submit', handleHeartFormSubmit )
  } )
}

export default toggleHeart
