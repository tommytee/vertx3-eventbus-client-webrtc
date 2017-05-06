/**
 * Publish a message
 *
 * @param {String} address
 * @param {Object} message
 * @param {Object} [headers]
 */
module.exports = function ( address, message, headers ) {

  var self = this;

  // are we ready?
  if ( this.state !== EventBus.OPEN ) {
    throw new Error( 'INVALID_STATE_ERR' );
  }

  if ( this.peerRegisters[ address ] ) {

    var peersString = '';

    Object.keys( this.peerRegisters[ address ] ).forEach(function (pId) {

      self.peers[ pId ].send( JSON.stringify( {
        type: 'publish',
        address: address,
        body: message
      } ));

      peersString += pId
    })

    headers = self.mergeHeaders( headers, { peers: peersString } );

    console.log('attached peers header')
  }

  this.sockJSConn.send( JSON.stringify( {
    type: 'publish',
    address: address,
    headers: self.mergeHeaders( this.defaultHeaders, headers ),
    body: message
  } ) );

};