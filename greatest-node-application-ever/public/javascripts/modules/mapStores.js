import axios from 'axios'
import { $ } from './bling'

const mapOptions = {
  center: { lat: 43.2, lng: -79.8 },
  zoom: 8,
}

const googleAPI = window.google

function loadPlaces( map, lat = 43.2, lng = -79.8 ) {
  axios.get( `/api/stores/near?lat=${lat}&lng=${lng}` ).then( res => {
    const places = res.data
    if ( !places.length ) {
      alert( 'No places found!' )
      return
    }
    // create a bounds
    const bounds = new googleAPI.maps.LatLngBounds()
    // create an info window
    const infoWindow = new googleAPI.maps.InfoWindow()

    const markers = places.map( place => {
      const [ placeLng, placeLat ] = place.location.coordinates
      const position = {
        lat: placeLat,
        lng: placeLng,
      }

      bounds.extend( position )

      const marker = new googleAPI.maps.Marker( { map, position } )
      marker.place = place
      return marker
    } )

    // When someone clicks on a marker, show the details of that place
    markers.forEach( marker => {
      marker.addListener( 'click', function openInfoWindow() {
        const html = `
          <div class="popup">
            <a href="/stores/${this.place.slug}">
              <img src="/uploads/${this.place.photo || 'store.png'}" alt="${this.place.name}">
              <p>
                ${this.place.description} - ${this.place.location.address}
              </p>
            </a>
          </div>
        `

        infoWindow.setContent( html )
        infoWindow.open( map, this )
      } )
    } )

    // zoom the map to fit all markers perfeltly
    map.setCenter( bounds.getCenter() )
    map.fitBounds( bounds )
  } )
}

function makeMap( mapDiv ) {
  if ( !mapDiv ) {
    return
  }
  if ( !googleAPI ) {
    return
  }

  const map = new googleAPI.maps.Map( mapDiv, mapOptions )
  loadPlaces( map )

  const input = $( '[name="geolocate"]' )
  const autocomplete = new googleAPI.maps.places.Autocomplete( input )
  autocomplete.addListener( 'place_changed', () => {
    const place = autocomplete.getPlace()
    loadPlaces( map, place.geometry.location.lat(), place.geometry.location.lng() )
  } )
}

export default makeMap

// // Adds a marker to the map and push to the array.
// function addMarker( markers, location, map, title ) {
//   const marker = new google.maps.Marker( {
//     position: location,
//     map,
//     title,
//   } )
//   markers.push( marker )
// }

// // Removes the markers from the map, but keeps them in the array.
// function clearMarkers( markers ) {
//   markers.forEach( marker => marker.setMap( null ) )
//   markers = []
// }

// const mapStores = ( map, latInput, lngInput ) => {
//   if ( !map ) {
//     return // if there is no map don't do anything
//   }

//   const markers = []

//   const googleMap = new google.maps.Map( map, {
//     center: { lat: 0, lng: 0 },
//     zoom: 15,
//   } )
//   window.mapper = googleMap

//   let lastLat = 0
//   let lastLng = 0

//   setInterval( () => {
//     let mapNeedsUpdate = false

//     const latInputValue = parseFloat( latInput.value )
//     const lngInputValue = parseFloat( lngInput.value )

//     if ( Number.isNaN( latInputValue ) || Number.isNaN( lngInputValue ) ) {
//       return // wait for proper input
//     }

//     if ( latInputValue !== lastLat ) {
//       lastLat = latInputValue
//       mapNeedsUpdate = true
//     }

//     if ( lngInputValue !== lastLng ) {
//       lastLng = lngInputValue
//       mapNeedsUpdate = true
//     }

//     if ( mapNeedsUpdate ) {
//       // Delete old markers
//       clearMarkers( markers )

//       // Populate new map markers
//       axios
//         .get( `/api/stores/near?lat=${latInputValue}&lng=${lngInputValue}` )
//         .then( res => {
//           // Show requested area
//           googleMap.setCenter( {
//             lat: lastLat,
//             lng: lastLng,
//           } )
//           if ( res.data.length ) {
//             res.data.forEach( store => {
//               const { name: storeName } = store
//               const {
//                 location: { coordinates },
//               } = store
//               const [ storeLng, storeLat ] = coordinates
//               const markerCoordinates = {
//                 lat: storeLat,
//                 lng: storeLng,
//               }
//               addMarker( markers, markerCoordinates, googleMap, storeName )
//             } )
//           }
//           // TODO: tell them nothing came back
//         } )
//         .catch( () => {
//           // TODO: Report err to tracking service
//           // TODO: Tell user there was an error
//         } )
//     }
//   }, 100 )
// }

// export default mapStores
