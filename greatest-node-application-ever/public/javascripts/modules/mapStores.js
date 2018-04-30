import axios from 'axios'

// Adds a marker to the map and push to the array.
function addMarker( markers, location, map, title ) {
  const marker = new google.maps.Marker( {
    position: location,
    map,
    title,
  } )
  markers.push( marker )
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers( markers ) {
  markers.forEach( marker => marker.setMap( null ) )
  markers = []
}

const mapStores = ( map, latInput, lngInput ) => {
  if ( !map ) {
    return // if there is no map don't do anything
  }

  const markers = []

  const googleMap = new google.maps.Map( map, {
    center: { lat: 0, lng: 0 },
    zoom: 15,
  } )
  window.mapper = googleMap

  let lastLat = 0
  let lastLng = 0

  setInterval( () => {
    let mapNeedsUpdate = false

    const latInputValue = parseFloat( latInput.value )
    const lngInputValue = parseFloat( lngInput.value )

    if ( Number.isNaN( latInputValue ) || Number.isNaN( lngInputValue ) ) {
      return // wait for proper input
    }

    if ( latInputValue !== lastLat ) {
      lastLat = latInputValue
      mapNeedsUpdate = true
    }

    if ( lngInputValue !== lastLng ) {
      lastLng = lngInputValue
      mapNeedsUpdate = true
    }

    if ( mapNeedsUpdate ) {
      // Delete old markers
      clearMarkers( markers )

      // Populate new map markers
      axios
        .get( `/api/stores/near?lat=${latInputValue}&lng=${lngInputValue}` )
        .then( res => {
          // Show requested area
          googleMap.setCenter( {
            lat: lastLat,
            lng: lastLng,
          } )
          if ( res.data.length ) {
            res.data.forEach( store => {
              const { name: storeName } = store
              const {
                location: { coordinates },
              } = store
              const [ storeLng, storeLat ] = coordinates
              const markerCoordinates = {
                lat: storeLat,
                lng: storeLng,
              }
              addMarker( markers, markerCoordinates, googleMap, storeName )
            } )
          }
          // TODO: tell them nothing came back
        } )
        .catch( () => {
          // TODO: Report err to tracking service
          // TODO: Tell user there was an error
        } )
    }
  }, 100 )
}

export default mapStores
