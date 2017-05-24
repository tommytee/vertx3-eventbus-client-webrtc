
var eb, logger = Java.type("io.vertx.core.logging.LoggerFactory").getLogger('vertx3-eventbus-webrtc-helper');
var userMenu = 'Available commands for me or users:<br>-wantReply <br>-manyReplies <br>-publish2room ';
var userColors = {
  light:'#ddddff',
  dark:'#444400'
}
logger.info =  function () {}
module.exports = function ( ebus ) {

  eb = ebus;
  
  eb.consumer( 'chat.room.user.serverBot', function ( message, error ) {

    if ( error ) {

      logger.error('error on serverBot consumer');
      logger.error( error );

    } else {

      var mes = message.body();

      logger.info( 'message received by serverBot ', JSON.stringify( mes ));

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

  logger.info( 'new user in room ' + mes.roomName + ' user: ' + mes.userId );

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
      message:'Hi. I am serverBot. '+ userMenu,
      userId: 'serverBot',
      userColors:userColors,
      username: 'serverBot'
    });

  }, delay + 1000 );

}

function giveGreeting ( message ) {

  var mes = message.body();

  logger.info('giveGreeting');

  eb.send( 'chat.room.user.'+ mes.userId, {
    message: userMenu,
    userId: 'serverBot',
    userColors:userColors,
    username: 'serverBot'
  } );
}

function wantReply( message ) {

  logger.info('wantReply request from ' + message.body().userId );

  if ( message.replyAddress() ) {

    message.reply('Thanks for checking in with serverBot');

    logger.info('reply sent');

  } else {

    logger.info('asked to reply but no reply function in message');
  }

}

function publish2room ( message, delay ) {

  var mes = message.body();

  logger.info('publish2room request from ' + mes.userId );

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

  logger.info( 'manyReplies' );

  var mes = message.body();

  setTimeout(function () {

    logger.info( '' + JSON.stringify(mes) );
    logger.info( 'sending test message to user ' + mes.userId );

    eb.send( 'chat.room.user.' + mes.userId, {
      message: 'Test message from serverBot, please respond',
      userId: 'serverBot',
      userColors:userColors,
      username: 'serverBot'
    }, function ( message2, error2 ) {

      if ( error2 ) {

        logger.error('error on serverBot reply handler');
        logger.error( error2 );

      } else {

        var mes =  message2.body();

        logger.info( 'serverBot received a reply ', JSON.stringify( mes ));
        logger.info( 'serverBot replying to reply');


        message2.reply('good. please reply again', function ( msg, rep_err ) {

          if ( rep_err ) {

            logger.error('error on serverBot reply reply handler');
            logger.error( rep_err );

          } else {

            var mes =  msg.body();

            logger.info( 'serverBot received reply to a reply', JSON.stringify( mes ));


            msg.reply('good. please reply again', function ( msg, rep_err ) {

              if ( rep_err ) {

                logger.error(
                  'error on serverBot reply reply handler' );

                logger.error( rep_err );

              } else {

                var mes = msg.body();

                logger.info(
                  'serverBot received reply to a reply',
                  JSON.stringify( mes ) );


                msg.reply('good. please reply again', function ( msg, rep_err ) {

                  if ( rep_err ) {

                    logger.error(
                      'error on serverBot reply reply handler' );

                    logger.error( rep_err );

                  } else {

                    var mes = msg.body();

                    logger.info(
                      'serverBot received reply to a reply',
                      JSON.stringify( mes ) );


                    msg.reply('good. please reply again', function ( msg, rep_err ) {

                      if ( rep_err ) {

                        logger.error(
                          'error on serverBot reply reply handler' );

                        logger.error( rep_err );

                      } else {

                        var mes = msg.body();

                        logger.info(
                          'serverBot received reply to a reply',
                          JSON.stringify( mes ) );

                        msg.reply('good. thank you.', function ( msg, rep_err ) {

                          if ( rep_err ) {

                            logger.error(
                              'error on serverBot reply reply handler' );
                            logger.error( rep_err );

                          } else {

                            var mes = msg.body();

                            logger.info(
                              'serverBot received a final reply to a reply',
                              JSON.stringify( mes ) );
                            logger.info(
                              'test complete ' );

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
