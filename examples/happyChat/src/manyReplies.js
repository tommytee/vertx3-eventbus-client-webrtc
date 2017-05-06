
module.exports = function ( msg, textDiv ) {

  console.log( 'manyReplies' );

  console.log('this');
  console.log( this );

  textDiv.innerHTML += msg.body.message + '<br />';
  textDiv.scrollTop = textDiv.scrollHeight;
  msg.reply( 'ok bot, this is my response', function ( err, msg ) {

    if ( err ) {

      console.log( 'error: ' + err );

    } else {

      console.log( 'bot says: ' + msg.body );

      textDiv.innerHTML += msg.body + '<br />';
      textDiv.scrollTop = textDiv.scrollHeight;
      if ( msg.reply )
        msg.reply( 'this is my second reply', function ( err, msg ) {

          if ( err ) {

            console.log( 'error: ' + err );

          } else {

            console.log( 'bot says: ' + msg.body );

            textDiv.innerHTML += msg.body + '<br />';
            textDiv.scrollTop = textDiv.scrollHeight;
            if ( msg.reply )
              msg.reply( 'this is my third reply', function ( err, msg ) {

                if ( err ) {

                  console.log( 'error: ' + err );

                } else {

                  console.log( 'bot says: ' + msg.body );

                  textDiv.innerHTML += msg.body + '<br />';
                  textDiv.scrollTop = textDiv.scrollHeight;
                  if ( msg.reply )
                    msg.reply( 'this is my fourth reply',
                      function ( err, msg ) {

                        if ( err ) {

                          console.log( 'error: ' + err );

                        } else {

                          console.log( 'bot says: ' + msg.body );

                          textDiv.innerHTML += msg.body + '<br />';
                          textDiv.scrollTop = textDiv.scrollHeight;
                          if ( msg.reply )
                            msg.reply( 'this is my fifth reply',
                              function ( err, msg ) {

                                if ( err ) {

                                  console.log( 'error: ' + err );

                                } else {

                                  console.log( 'bot says: ' + msg.body );

                                  textDiv.innerHTML += msg.body + '<br />';
                                  textDiv.scrollTop = textDiv.scrollHeight;
                                  if ( msg.reply )
                                    msg.reply( 'this is my sixth reply' );

                                }
                              } )
                        }
                      } )
                }
              } )
          }
        } )
    }
  } )
}