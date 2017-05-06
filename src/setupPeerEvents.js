
module.exports = function( peer ) {

  var self = this;

  peer.on( 'close', function () {

    self.removePeer( peer )

  } )
  peer.on( 'connect', function () {

    console.log( 'connect' );

    self.sendPeerMyRegisterList( peer );

  } )
  peer.on( 'data', function ( dataStr ) {

    var data = JSON.parse( dataStr );

    if ( this.destroyed ) return

    //console.log( 'Received  from peer ==-', data )

    if ( data.body ) {

      if ( data.replyAddress ) {

        //console.log('setting reply register address fro incoming message on peer');

        self.peerReplyRegisters[ data.replyAddress ] = peer.id;
      }
      self.onIncoming( data );

    } else if ( data.peerRegisters ) {

      //console.log( 'Received listener address list from peer' );

      data.peerRegisters.forEach( function ( address ) {

        //console.log( address )

        if ( ! self.peerRegisters[ address ] ) {

          self.peerRegisters[ address ] = {};
        }

        self.peerRegisters[ address ][ peer.id ] = true;

      } )

    } else {

    }

  } )
  peer.on( 'stream', function ( stream ) {
    //self.emit('stream', stream)
  } )
  peer.on( 'error', function ( err ) {
    //emitfn.call( this, 'peer-error', err )
    console.log( 'Error in peer %s', err );
  } )

}