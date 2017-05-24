
module.exports =  function ( messageObject ) {

  //console.log('onIncoming messageObject', messageObject);

  var self = this;

  // define a reply function on the message itself
  if ( messageObject.replyAddress ) {

    Object.defineProperty( messageObject, 'reply', {

      value: function ( message, headers, callback ) {

        self.send( messageObject.replyAddress, message, headers, callback );
      }
    } );
  }

  if ( this.handlers[ messageObject.address ] ) {

    // iterate all registered handlers
    var handlers = this.handlers[ messageObject.address ];

    for ( var i = 0; i < handlers.length; i ++ ) {

      if ( messageObject.type === 'err' ) {
        handlers[ i ]( {
          failureCode: messageObject.failureCode,
          failureType: messageObject.failureType,
          message: messageObject.message
        } );

      } else {

        handlers[ i ]( null, messageObject );

        console.log( messageObject );
      }
    }

  } else if (this.replyHandlers[messageObject.address]) {

    // Might be a reply message
    var handler = this.replyHandlers[ messageObject.address ];

    delete this.replyHandlers[ messageObject.address ];

    if ( messageObject.type === 'err' ) {
      handler( {
        failureCode: messageObject.failureCode,
        failureType: messageObject.failureType,
        message: messageObject.message
      } );

    } else {

      handler( null, messageObject );

    }

  }
}