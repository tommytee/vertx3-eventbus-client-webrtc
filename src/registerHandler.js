
/**
 * Register a new handler
 *
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

  if ( typeof headers === 'function' ) {
    callback = headers;
    headers = {};
  }

  // ensure it is an array
  if ( ! this.handlers[ address ] ) {

    this.handlers[ address ] = [];

    var body = {
      register: true,
      peerId: this.peerId,
      address: address
    };

    this.sockJSConn.send( JSON.stringify( {
      type: 'send',
      address: 'webrtc.bridge',
      headers: this.mergeHeaders( this.defaultHeaders, headers ),
      body: body
    } ) );

    //console.log('sending register')

  }

  this.handlers[ address ].push( callback );

  this.sendPeersRegisterUpdate();
};