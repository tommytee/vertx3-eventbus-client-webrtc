
var Peer = require('simple-peer')

module.exports = function ( data ) {

  var self = this;

  if ( self.peerOfferStatus[ data.offerRequest ] === 'offer sent' ) {

    //console.log( '...offer already sent...' );

  } else {

    generateOffer( data.offerRequest );

  }

  function generateOffer( pId ) {

    if ( Peer.WEBRTC_SUPPORT ) {

      //console.log('generateOffer')

      var peer, body, offerId = self.makeUID();

      peer = self.peers[ pId ] = new Peer({initiator: true});
      peer.id = pId;
      peer.setMaxListeners( 50 );

      self.setupPeerEvents( peer )

      peer.on( 'signal', function ( data ) {

        if ( data.type === 'offer' ) {

          body = {
            offer: data,
            offerId: offerId,
            fromPeerId: self.peerId
          }

        } else if ( data.candidate ) {

          body = {
            signal: data,
            offerId: offerId,
            fromPeerId: self.peerId,
            toPeerId: pId
          };

        }

        self.sockJSConn.send( JSON.stringify({
          type: 'send',
          address: 'webrtc.' + pId,
          headers: {},
          body: body
        }) );

      });

    } else {

      console.log( 'no WebRTC');

    }

  }

}
