function autocomplete( input, latInput, lngInput ) {
  if ( !input ) {
    return // skip this function from running if there is no input on the page
  }

  const dropdown = new google.maps.places.Autocomplete( input )
  /* eslint-disable no-param-reassign */
  dropdown.addListener( 'place_changed', () => {
    const place = dropdown.getPlace()
    if ( !place.geometry ) {
      return // Place does not correspond to a known location
    }

    latInput.value = place.geometry.location.lat()
    lngInput.value = place.geometry.location.lng()
  } )
  /* eslint-enable */

  // If someone hits enter on the address field, don't submit the form
  input.on( 'keydown', e => {
    if ( e.keyCode === 13 ) {
      e.preventDefault()
    }
  } )
}

export default autocomplete
