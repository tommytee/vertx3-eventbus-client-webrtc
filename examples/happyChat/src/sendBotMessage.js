module.exports = function ( sendToUserId, message, textDiv ) {

  var self = this

  if ( message === '-wantReply' ) {

    eb.send( "chat.room.user." + sendToUserId, {
        message: message,
        userId: self.userId,
        roomName: self.roomName,
        userColors: self.userColors
      },
      function ( err, msg ) {

        if ( err ) {

          console.log( err );

        } else {

          console.log( 'serverBot says: ' + msg.body );

          textDiv.innerHTML += msg.body + '<br />';
          textDiv.scrollTop = textDiv.scrollHeight;
        }

      } )

  } else {

    eb.send( "chat.room.user." + sendToUserId, {
      message: message,
      userId: self.userId,
      roomName: self.roomName,
      userColors: self.userColors
    } );
  }

}