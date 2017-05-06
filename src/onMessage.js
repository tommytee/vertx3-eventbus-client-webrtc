
module.exports = function ( e ) {

  var self = this;

  var json = JSON.parse( e.data );

  //console.log('\non message\n', json)

  if ( json.headers && json.headers.peerId )
    peerCheck( json.headers.peerId );

  if ( json.address === 'webrtc.' + self.peerId ) {

    if ( json.body.body ) {

      if ( json.replyAddress )
        json.body.replyAddress = json.replyAddress;

      self.onIncoming( json.body );

    } else if ( json.body.offerRequest )
      self.onOfferRequest( json.body );

    else if ( json.body.offer )
      self.onOffer( json.body );

    else if ( json.body.signal )
      onSignal( json.body );

    else if ( json.body.status )
      self.onStatus( json.body );

  } else if ( self.handlers[ json.address ] ) {

    console.log('\n##############\n##### x ######\n##############');

  } else if ( self.replyHandlers[ json.address ] ) {

    //console.log( 'main received a reply message and has a handler for it')
    //console.log( json )

    // define a reply function on the message itself
    if ( json.replyAddress ) {

      Object.defineProperty( json, 'reply', {

        value: function ( message, headers, callback ) {

          self.send( json.replyAddress, message, headers, callback );
        }
      } );
    }


    // Might be a reply message
    var handler = self.replyHandlers[ json.address ];

    delete self.replyHandlers[ json.address ];

    if ( json.type === 'err' ) {
      handler( {
        failureCode: json.failureCode,
        failureType: json.failureType,
        message: json.message
      } );

    } else {

      handler( null, json );

    }

  } else {

    if ( json.type === 'err' ) {
      self.onerror( json );
    } else {
      try {
        console.warn( 'No handler found for message: ', json );
      } catch ( e ) {
        // dev tools are disabled so we cannot use console on IE
      }
    }
  }

  function peerCheck(pId) {

    //console.log('peer check: ' + pId);

    if (
      ! self.peers[ pId ] &&
      pId !== self.peerId &&
      ! self.peerOfferStatus[ pId ] &&
      ! self.options.disableWebRTC
    ) {

      self.peerOfferStatus[ pId ] = 'offer sent';

      self.sockJSConn.send( JSON.stringify({
        type: 'send',
        address: 'webrtc.' + pId,
        headers: {},
        body: { offerRequest:self.peerId }
      }) );

    }

  }

  function onSignal( data ) {

    //console.log( 'signal received from ' + data.fromPeerId );

    var peer = self.peers[ data.fromPeerId ]

    if ( peer !== undefined ) {

      peer.signal( data.signal );

    } else {

      console.log('Error Peer not found on signal')
    }

  }

}

