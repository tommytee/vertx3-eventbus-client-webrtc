module.exports = function ( enable ) {

  var self = this;

  if ( enable ) {

    var sendPing = function () {

      self.sockJSConn.send( JSON.stringify( { type: 'ping' } ) );

    };

    if ( self.pingInterval > 0 ) {

      // Send the first ping then send a ping every pingInterval milliseconds
      sendPing();

      self.pingTimerID = setInterval( sendPing, self.pingInterval );

    }

  } else {

    if ( self.pingTimerID ) {

      clearInterval( self.pingTimerID );

      self.pingTimerID = null;

    }

  }
};