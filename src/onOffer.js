var Peer = require('simple-peer')

module.exports = function ( data ) {

  var self = this;

  //console.log('offer received from ' + data.fromPeerId );

  if ( Peer.WEBRTC_SUPPORT ) {

    var peer = self.peers[ data.fromPeerId ] = new Peer( { initiator: false } )

    peer.id = data.fromPeerId
    peer.setMaxListeners( 50 )

    self.setupPeerEvents( peer )

    peer.on( 'signal', function ( signalData ) {

      var body = {
        signal: signalData,
        offerId: data.offerId,
        fromPeerId: self.peerId,
        toPeerId: data.fromPeerId
      }

      self.sockJSConn.send( JSON.stringify({
        type: 'send',
        address: 'webrtc.' + data.fromPeerId,
        headers: {},
        body: body
      }) )

    } )

    peer.signal( data.offer )

  } else {

    console.log( 'no WebRTC')

  }

}