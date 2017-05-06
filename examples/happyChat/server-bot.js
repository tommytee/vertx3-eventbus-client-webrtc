
var eb, asciiLogo = ' ‹(•_•)› ';
var userMenu = 'Available commands for me or users:<br>-wantReply <br>-manyReplies <br>-publish2room ';
var userColors = {
  light:'#ddddff',
  dark:'#444400'
}

module.exports = function ( ebus ) {

  eb = ebus;
  
  eb.consumer( 'chat.room.user.serverBot', function ( message, error ) {

    if ( error ) {

      console.log(asciiLogo + 'error on serverBot consumer');

      tryLog(error, 'error');

    } else {

      var mes = message.body();

      console.log( asciiLogo + 'message received by serverBot ', JSON.stringify( mes ));

      if ( mes.enter ) {

        sendNewUserGreeting( message, 1000);

      } else if ( mes.message ) {

        switch ( mes.message ) {

          case '-publish2room':
            publish2room( message, 1000 );
            break

          case '-manyReplies':
            manyReplies( message, 500 );
            break

          case '-wantReply':
            wantReply( message )
            break

          case 'hi':
          case 'hello':
          case 'help':
          case '-help':
            giveGreeting( message );
        }

      }

    }

  } )

}

function sendNewUserGreeting ( message, delay ) {

  var mes = message.body();

  console.log( asciiLogo + 'new user in room ' + mes.roomName + ' user: ' + mes.userId );

  setTimeout(function () {

    eb.send( 'chat.room.user.' + mes.userId, {
      userInfo: {
        username: 'serverBot',
        userId: 'serverBot',
        userColors: userColors
      }
    });

  }, delay );

  setTimeout(function () {

    eb.send( 'chat.room.user.' + mes.userId, {
      message:'Hi. I am serverBot. '+ asciiLogo + userMenu,
      userId: 'serverBot',
      userColors:userColors,
      username: 'serverBot'
    });

  }, delay + 1000 );

}

function giveGreeting ( message ) {

  var mes = message.body();

  console.log(asciiLogo + 'giveGreeting');

  eb.send( 'chat.room.user.'+ mes.userId, {
    message: asciiLogo + userMenu,
    userId: 'serverBot',
    userColors:userColors,
    username: 'serverBot'
  } );
}

function wantReply( message ) {

  console.log(asciiLogo + 'wantReply request from ' + message.body().userId );

  if ( message.replyAddress() ) {

    message.reply('Thanks for checking in with serverBot');

    console.log(asciiLogo + 'reply sent');

  } else {

    console.log(asciiLogo + 'asked to reply but no reply function in message');
  }

}

function publish2room ( message, delay ) {

  var mes = message.body();

  console.log(asciiLogo + 'publish2room request from ' + mes.userId );

  setTimeout(function () {

    eb.publish( 'chat.room.' + mes.roomName, {
      message: 'Hi Everybody. Im serverBot ‹(•_•)›',
      userId: 'serverBot',
      userColors:userColors,
      username: 'serverBot'
    });

  }, delay );
}

function manyReplies ( message, delay ) {

  console.log( 'manyReplies' );

  var mes = message.body();

  setTimeout(function () {

    console.log( asciiLogo + '' + JSON.stringify(mes) );
    console.log( asciiLogo + 'sending test message to user ' + mes.userId );

    eb.send( 'chat.room.user.' + mes.userId, {
      message: 'Test message from serverBot, please respond',
      userId: 'serverBot',
      userColors:userColors,
      username: 'serverBot'
    }, function ( message2, error2 ) {

      if ( error2 ) {

        console.log(asciiLogo + 'error on serverBot reply handler');

        tryLog( error2, 'error');

      } else {

        var mes =  message2.body();

        console.log( asciiLogo + 'serverBot received a reply ', JSON.stringify( mes ));
        console.log( asciiLogo + 'serverBot replying to reply');


        message2.reply('good. please reply again', function ( msg, rep_err ) {

          if ( rep_err ) {

            console.log(asciiLogo + 'error on serverBot reply reply handler');

            tryLog( rep_err, 'error');

          } else {

            var mes =  msg.body();

            console.log( asciiLogo + 'serverBot received reply to a reply', JSON.stringify( mes ));


            msg.reply('good. please reply again', function ( msg, rep_err ) {

              if ( rep_err ) {

                console.log(
                  asciiLogo + 'error on serverBot reply reply handler' );

                tryLog( rep_err, 'error' );

              } else {

                var mes = msg.body();

                console.log(
                  asciiLogo + 'serverBot received reply to a reply',
                  JSON.stringify( mes ) );


                msg.reply('good. please reply again', function ( msg, rep_err ) {

                  if ( rep_err ) {

                    console.log(
                      asciiLogo + 'error on serverBot reply reply handler' );

                    tryLog( rep_err, 'error' );

                  } else {

                    var mes = msg.body();

                    console.log(
                      asciiLogo + 'serverBot received reply to a reply',
                      JSON.stringify( mes ) );


                    msg.reply('good. please reply again', function ( msg, rep_err ) {

                      if ( rep_err ) {

                        console.log(
                          asciiLogo + 'error on serverBot reply reply handler' );

                        tryLog( rep_err, 'error' );

                      } else {

                        var mes = msg.body();

                        console.log(
                          asciiLogo + 'serverBot received reply to a reply',
                          JSON.stringify( mes ) );

                        msg.reply('good. thank you.', function ( msg, rep_err ) {

                          if ( rep_err ) {

                            console.log(
                              asciiLogo + 'error on serverBot reply reply handler' );

                            tryLog( rep_err, 'error' );

                          } else {

                            var mes = msg.body();

                            console.log(
                              asciiLogo + 'serverBot received a final reply to a reply',
                              JSON.stringify( mes ) );
                            console.log(
                              asciiLogo + 'test complete ' );

                          }
                        })

                      }
                    })


                  }
                })

              }
            })

          }

        });

      }

    } );

  }, delay);

}

function tryLog( thing, name ) {

  console.log(
    asciiLogo + '\n-------------------------< Try Log begin for: ' +
    name );

  doIt( thing );
  doIt( thing, 'body' );
  doIt( thing, 'message' );

  function doIt ( it, subIt ) {

    if ( subIt ) {

      try {
        console.log( JSON.stringify( it[ subIt ] ) );
      }
      catch ( err ) {

        console.log( asciiLogo + 'ERROR on ' + subIt );
      }

      try {
        console.log( JSON.stringify( it() ) );
      }
      catch ( err ) {

        console.log( asciiLogo + 'ERROR on ' + subIt + '()' );
      }

    } else {

      try {
        console.log( JSON.stringify( it ) );
      }
      catch ( err ) {

        console.log( asciiLogo + 'ERROR on ' );
      }

      try {
        console.log( JSON.stringify( it() ) );
      }
      catch ( err ) {

        console.log( asciiLogo + 'ERROR on () ' );
      }
    }
  }

  console.log( asciiLogo + '-------------------------< Try Log end\n' );

}
