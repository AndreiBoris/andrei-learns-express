// based on https://gist.github.com/paulirish/12fb951a8b893a454b32

const $ = document.querySelector.bind( document )
const $$ = document.querySelectorAll.bind( document )

// $('.wrapper').on('click', ()=>{}) // kinda thing

window.on = function nodeOnListener( name, fn ) {
  this.addEventListener( name, fn )
}

Node.prototype.on = window.on

NodeList.prototype.__proto__ = Array.prototype // eslint-disable-line

NodeList.prototype.addEventListener = function nodeListAddEventListener( name, fn ) {
  this.forEach( elem => {
    elem.on( name, fn )
  } )
}

NodeList.prototype.on = NodeList.prototype.addEventListener

export { $, $$ }