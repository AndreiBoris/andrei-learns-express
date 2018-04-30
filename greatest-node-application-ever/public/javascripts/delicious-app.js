import '../sass/style.scss'

import { $, $$ } from './modules/bling'

import autocomplete from './modules/autocomplete'
import typeAhead from './modules/typeAhead'
import mapStores from './modules/mapStores'

autocomplete( $( '#address' ), $( '#lat' ), $( '#lng' ) )
typeAhead( $( '.search' ) )
mapStores( $( '#map' ), $( '#lat' ), $( '#lng' ) )
