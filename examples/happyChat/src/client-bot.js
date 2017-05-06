
var asciiLogo = ' ‹clientBot› '

module.exports = function ( msg ) {

  var self = this;

  var mes = msg.body;

  console.log( asciiLogo + 'message received by clientBot ', mes );

  if ( mes.message ) {

    switch ( mes.message ) {

      case '-publish2room':
        publish2room( msg, 1000 );
        break

      case '-manyReplies':
        manyReplies( msg, 500 );
        break

      case '-wantReply':
        wantReply( msg )
        break
    }

  }

  function publish2room ( msg, delay ) {

    var mes = msg.body;

    console.log( asciiLogo + 'publish2room request from ' + mes.userId );

    setTimeout( function () {

      eb.publish( 'chat.room.' + mes.roomName, {
        userId: self.userId,
        roomName: mes.roomName,
        userColors: self.userColors,
        message: 'Hi Everybody. Im clientBot ‹(•_•)› for ' + self.username
      } );

    }, delay );
  }

  function wantReply ( msg ) {

    console.log( asciiLogo + 'wantReply request from ' + msg.body.userId );

    if ( msg.replyAddress ) {

      msg.reply( 'Thanks for checking in with clientBot' );

      console.log( asciiLogo + 'reply sent' );

    } else {

      console.log(
        asciiLogo + 'asked to reply but no reply function in message' );
    }

  }

  function manyReplies ( msg, delay ) {

    console.log( 'manyReplies' );

    var mes = msg.body;

    setTimeout( function () {

      console.log( asciiLogo + mes );
      console.log( asciiLogo + 'sending test message to user ' + mes.userId );

      eb.send( 'chat.room.user.' + mes.userId, {
        message: 'Test message from clientBot, please respond',
        userId: self.userId,
        userColors: self.userColors,
        username: self.username
      }, function ( error2, message2 ) {

        if ( error2 ) {

          console.log( asciiLogo + 'error on clientBot reply handler' );
          console.log( error2, 'error' );

        } else {

          var mes = message2.body;

          console.log( asciiLogo + 'clientBot received a reply ', mes );
          console.log( asciiLogo + 'clientBot replying to reply' );

          message2.reply( 'good. please reply again',
            function ( rep_err, msg ) {

              if ( rep_err ) {

                console.log(
                  asciiLogo + 'error on clientBot reply reply handler' );
                console.log( rep_err, 'error' );

              } else {

                var mes = msg.body;

                console.log( asciiLogo + 'clientBot received reply to a reply',
                  mes );

                msg.reply( 'good. please reply again',
                  function ( rep_err, msg ) {

                    if ( rep_err ) {

                      console.log(
                        asciiLogo + 'error on clientBot reply reply handler' );

                      console.log( rep_err, 'error' );

                    } else {

                      var mes = msg.body;

                      console.log(
                        asciiLogo + 'clientBot received reply to a reply',
                        mes );

                      msg.reply( 'good. please reply again',
                        function ( rep_err, msg ) {

                          if ( rep_err ) {

                            console.log(
                              asciiLogo +
                              'error on clientBot reply reply handler' );

                            console.log( rep_err, 'error' );

                          } else {

                            var mes = msg.body;

                            console.log(
                              asciiLogo + 'clientBot received reply to a reply',
                              mes );

                            msg.reply( 'good. please reply again',
                              function ( rep_err, msg ) {

                                if ( rep_err ) {

                                  console.log(
                                    asciiLogo +
                                    'error on clientBot reply reply handler' );

                                  console.log( rep_err, 'error' );

                                } else {

                                  var mes = msg.body;

                                  console.log(
                                    asciiLogo +
                                    'clientBot received reply to a reply',
                                    mes );

                                  msg.reply( 'good. thank you.',
                                    function ( rep_err, msg ) {

                                      if ( rep_err ) {

                                        console.log(
                                          asciiLogo +
                                          'error on clientBot reply reply handler' );

                                        console.log( rep_err, 'error' );

                                      } else {

                                        var mes = msg.body;

                                        console.log(
                                          asciiLogo +
                                          'clientBot received a final reply to a reply',
                                          mes );
                                        console.log(
                                          asciiLogo + 'test complete ' );

                                      }
                                    } )

                                }
                              } )

                          }
                        } )

                    }
                  } )

              }

            } );

        }

      } );

    }, delay );

  }

}