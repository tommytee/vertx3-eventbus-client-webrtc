
module.exports = function ( data ) {

  console.log( data );

  if ( data.status.listenerRemoved ) {

    //console.log('onStatus peer left',data);

    if ( this.statusHandlers[ data.address ] ) {

      // check all registered statusHandlers to that address
      var statusHandlers = this.statusHandlers[ data.address ];

      for ( var i = 0; i < statusHandlers.length; i ++ ) {

        if ( data.type === 'err' ) {
          statusHandlers[ i ]( {
            failureCode: data.failureCode,
            failureType: data.failureType,
            message: data.message
          } );

        } else {

          statusHandlers[ i ]( null, data.status );
        }
      }
    }

  }

}