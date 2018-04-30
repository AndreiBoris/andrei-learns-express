const axios = require( 'axios' )

function searchResultsHTML( stores ) {
  return stores
    .map( store => `<a class="search__result" href="/stores/${store.slug}">
      <strong>${store.name}</strong>
    </a>` )
    .join( '' )
}

function searchErrorHTML() {
  return `
  <p>Unfortunately something went wrong during search. If this persists, please contact us so that we can fix the issue for you!</p>
  `
}

function nextItemToHighlightIndex( items, currentIndex ) {
  if ( currentIndex >= items.length - 1 ) {
    return 0
  }
  return currentIndex + 1
}

function previousItemToHighlightIndex( items, currentIndex ) {
  if ( currentIndex <= 0 ) {
    return items.length - 1
  }
  return currentIndex - 1
}

function highlightItem( items, index ) {
  items.forEach( item => {
    item.classList.remove( 'search__result--active' )
  } )
  items[index].classList.add( 'search__result--active' )
}

function selectItem( item ) {
  window.location.href = item.href
}

function typeAhead( search ) {
  if ( !search ) return

  const searchInput = search.querySelector( 'input[name="search"]' )
  const searchResults = search.querySelector( '.search__results' )
  let searchResultItems = []
  let currentSelectedSearchIndex = 0

  searchInput.on( 'input', function handleSearchInput() {
    // if there is no value, quit it!
    if ( !this.value ) {
      searchResults.style.display = 'none'
      return
    }

    // SHow the search results
    searchResults.style.display = 'block'
    searchResults.innerHTML = ''
    searchResultItems = []
    currentSelectedSearchIndex = 0

    axios
      .get( `/api/search?q=${this.value}` )
      .then( res => {
        if ( res.data.length ) {
          searchResults.innerHTML = searchResultsHTML( res.data )
          searchResultItems = Array.from( searchResults.querySelectorAll( '.search__result' ) )
          highlightItem( searchResultItems, currentSelectedSearchIndex )
        }
      } )
      .catch( () => {
        // TODO: Report err to tracking service
        searchResults.innerHTML = searchErrorHTML()
      } )
  } )

  // handle keyboard inputs
  searchInput.on( 'keydown', e => {
    // 40 is down
    // 38 is up
    // 13 is enter
    const { keyCode } = e
    // Only respond to keys that are moving the search selection
    if ( ![ 38, 40, 13 ].includes( keyCode ) ) {
      return
    }
    // Only respond when there are search results to look at
    if ( !searchResultItems.length ) {
      return
    }
    if ( keyCode === 38 ) {
      // move up
      currentSelectedSearchIndex = previousItemToHighlightIndex( searchResultItems, currentSelectedSearchIndex )
      highlightItem( searchResultItems, currentSelectedSearchIndex )
    } else if ( keyCode === 40 ) {
      // move down
      currentSelectedSearchIndex = nextItemToHighlightIndex( searchResultItems, currentSelectedSearchIndex )
      highlightItem( searchResultItems, currentSelectedSearchIndex )
    } else if ( keyCode === 13 ) {
      selectItem( searchResultItems[currentSelectedSearchIndex] )
    }
  } )
}

export default typeAhead
