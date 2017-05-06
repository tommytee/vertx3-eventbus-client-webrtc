/**
 *
 * @param address
 * @param headers
 * @param callback
 */
module.exports = function ( address, headers, callback ) {

  //console.log('unregisterStatusHandler', address);

  // are we ready?
  if ( this.state !== EventBus.OPEN ) {
    throw new Error( 'INVALID_STATE_ERR' );
  }

  var statusHandlers = this.statusHandlers[ address ];

  if ( statusHandlers ) {

    if ( typeof headers === 'function' ) {
      callback = headers;
      headers = {};
    }

    var idx = statusHandlers.indexOf( callback );

    if ( idx > - 1 ) {

      statusHandlers.splice( idx, 1 );

      if ( statusHandlers.length === 0 ) {

        this.sockJSConn.send( JSON.stringify( {
          type: 'send',
          address: 'webrtc.bridge',
          headers: this.mergeHeaders( this.defaultHeaders, headers ),
          body: {
            unregisterStatus:true,
            peerId: this.peerId,
            address:address
          }
        }));

        delete this.statusHandlers[ address ];
      }
    }
  }

}