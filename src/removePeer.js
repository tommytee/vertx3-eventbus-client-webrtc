
module.exports = function ( peer ) {

  var self = this;

  /**
   * should remove any peer registers or peerReplyRegisters
   */
  console.log( 'peer left: ' + peer.id );

  Object.keys( self.peerRegisters ).forEach( function ( address ) {

    if ( self.peerRegisters[ address ][ peer.id ] )
      delete self.peerRegisters[ address ][ peer.id ]
  })

  Object.keys( self.peerReplyRegisters ).forEach( function ( address) {

    if ( self.peerReplyRegisters[ address ] === peer.id )
      delete self.peerReplyRegisters[ address ]
  })

  delete self.peers[ peer.id ];

}