import '../sass/style.scss'

import { $, $$ } from './modules/bling'

import autocomplete from './modules/autocomplete'
import typeAhead from './modules/typeAhead'
import makeMap from './modules/mapStores'
import toggleHeart from './modules/heart'
import enableReview from './modules/review'

autocomplete( $( '#address' ), $( '#lat' ), $( '#lng' ) )
typeAhead( $( '.search' ) )
makeMap( $( '#map' ) )
toggleHeart( $( '.heart-count' ), $$( 'form.heart' ) )
enableReview( $( '.reviewer' ), $( '.reviews' ) )
