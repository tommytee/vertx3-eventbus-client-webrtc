module.exports = function( defaultHeaders, headers ) {

  if ( defaultHeaders ) {

    if ( ! headers ) {
      return defaultHeaders;
    }

    for ( var headerName in defaultHeaders ) {
      if ( defaultHeaders.hasOwnProperty( headerName ) ) {

        // user can overwrite the default headers
        if ( typeof headers[ headerName ] === 'undefined' ) {
          headers[ headerName ] = defaultHeaders[ headerName ];
        }

      }
    }

  }

  // headers are required to be a object
  return headers || {};
}
