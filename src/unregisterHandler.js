
/**
 * Unregister a handler
 *
 * @param {String} address
 * @param {Object} [headers]
 * @param {Function} callback
 */
module.exports = function ( address, headers, callback ) {
  // are we ready?
  if ( this.state !== EventBus.OPEN ) {
    throw new Error( 'INVALID_STATE_ERR' );
  }

  var handlers = this.handlers[ address ];

  if ( handlers ) {

    if ( typeof headers === 'function' ) {
      callback = headers;
      headers = {};
    }

    var idx = handlers.indexOf( callback );

    if ( idx > - 1 ) {

      handlers.splice( idx, 1 );

      if ( handlers.length === 0 ) {

        this.sockJSConn.send( JSON.stringify( {
          type: 'send',
          address: 'webrtc.bridge',
          headers: this.mergeHeaders( this.defaultHeaders, headers ),
          body: {
            unregister:true,
            peerId: this.peerId,
            address:address
          }
        }));

        delete this.handlers[ address ];
      }
    }
  }
};
