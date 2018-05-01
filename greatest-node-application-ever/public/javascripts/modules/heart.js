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
  const button = this.querySelector( '.heart__button' )

  axios.post( postUrl ).then( ( { data } ) => {
    updateHeartCounter( counterDiv, data.user.hearts.length )
    updateHeartButton( button, data.user.hearts.includes( data.storeId ) )
  } )
}

const toggleHeart = ( counterDivSelected, heartForms ) => {
  counterDiv = counterDivSelected

  heartForms.forEach( form => {
    form.on( 'submit', handleHeartFormSubmit )
  } )
}

export default toggleHeart
