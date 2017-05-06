/**
 * Send a message
 *
 * @param {String} address
 * @param {Object} message
 * @param {Object} [headers]
 * @param {Function} [callback]
 */
module.exports = function ( address, message, headers, callback ) {

  var self = this, replyAddress = false;
  
  // are we ready?
  if ( this.state !== EventBus.OPEN ) {
    throw new Error( 'INVALID_STATE_ERR' );
  }

  if ( typeof headers === 'function' ) {
    callback = headers;
    headers = {};
  }

  var envelope = {
    type: 'send',
    address: address,
    headers: this.mergeHeaders( this.defaultHeaders, headers ),
    body: message
  };

  if ( callback ) {

    replyAddress = this.makeUID();

    console.log('created reply handler at address', replyAddress);

    this.replyHandlers[ replyAddress ] = callback;

  }

  // check if i have handler first
  if ( this.handlers[ address ] ) {

    //console.log('*self send');

    if ( replyAddress )
      envelope.replyAddress = replyAddress;

    this.handlers[ address ][ 0 ]( null, envelope );

  // check if a connected peer wants it
  } else if ( this.peerRegisters[ address ] ) {

    console.log('*peer send');

    if ( replyAddress )
      envelope.replyAddress = replyAddress;

    // sends to first one atm. may implement rr
    self.peers[ Object.keys( this.peerRegisters[ address ] )[ 0 ] ].send(
      JSON.stringify( envelope ) );

  // check if it is a reply to a peer
  } else if ( self.peerReplyRegisters[ address ] ) {

    console.log('*peer reply');

    if ( replyAddress )
      envelope.replyAddress = replyAddress;

    // peerReplyRegisters contains the peerId
    self.peers[ self.peerReplyRegisters[ address ] ].send( JSON.stringify( envelope ) );

    delete self.peerReplyRegisters[ address ];

  } else {

    // must use helper proxy if reply needed
    if ( replyAddress ) {

      //console.log( 'sedning with replyaddrss',replyAddress);

      this.sockJSConn.send( JSON.stringify( {
        type: 'send',
        address: 'webrtc.bridge',
        body: {
          sendWithReply: true,
          envelope: envelope,
          peerId: self.peerId
        },
        replyAddress: replyAddress
      } ) );

    } else {

      //console.log( 'sending with no replyAddress' );

      this.sockJSConn.send( JSON.stringify( envelope ) );

    }
  }

};
