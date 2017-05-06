/**
 *
 * @param address
 * @param headers
 * @param callback
 */
module.exports = function ( address, headers, callback ) {

  //console.log('registerStatusHandler', address);

  // are we ready?
  if ( this.state !== EventBus.OPEN ) {
    throw new Error( 'INVALID_STATE_ERR' );
  }

  if ( typeof headers === 'function' ) {
    callback = headers;
    headers = {};
  }

  // ensure it is an array
  if ( ! this.statusHandlers[ address ] ) {

    this.statusHandlers[ address ] = [];

    var body = {
      registerStatus: true,
      peerId: this.peerId,
      address: address
    };

    this.sockJSConn.send( JSON.stringify( {
      type: 'send',
      address: 'webrtc.bridge',
      headers: this.mergeHeaders( this.defaultHeaders, headers ),
      body: body
    } ) );

    //console.log('sending status register')

  }

  this.statusHandlers[ address ].push( callback );

}