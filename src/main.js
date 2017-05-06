/* expects sockjs to be loaded */

module.exports = (function () {
  /**
   *
   * @param url
   * @param options
   * @constructor
   */
  var EventBus = function ( url, options ) {
    var self = this;

    options = options || {};

    this.peerId = makeUID();
    this.pingInterval = options.vertxbus_ping_interval || 5000;
    this.pingTimerID = null;
    this.state = EventBus.CONNECTING;
    this.makeUID = makeUID;
    this.handlers = {}
    this.replyHandlers = {}
    this.statusHandlers = {}
    this.peers = {}
    this.peerRegisters = {}
    this.peerReplyRegisters = {}
    this.peerOfferStatus = {}
    this.mergeHeaders = require('./mergeHeaders')
    this.setupPeerEvents = require('./setupPeerEvents')
    this.onIncoming = require('./onIncoming')
    this.removePeer = require('./removePeer')
    this.onMessage = require('./onMessage')
    this.onOfferRequest = require('./onOfferRequest')
    this.onStatus = require('./onStatus')
    this.onOffer = require('./onOffer')
    this.options = {
      disableWebRTC: ( window.location.hash === '#nowebrtc' )
    }

    if ( this.options.disableWebRTC ) {
      console.log('WebRTC disabled')
      this.defaultHeaders = null;
    } else {
      this.defaultHeaders = { "peerId":this.peerId };
    }

    this.sendPeersRegisterUpdate = function () {
      Object.keys( self.peers ).forEach( function( peerId ){
        self.sendPeerMyRegisterList( self.peers[ peerId ] );
      } )
    }

    this.sendPeerMyRegisterList = function ( peer ) {
      var myRegisters = Object.keys( self.handlers );
      if ( peer._channelReady )
        peer.send( JSON.stringify( { peerRegisters: myRegisters } ) );
    }

    // default event handlers
    this.onerror = function ( err ) {
      try {
        console.error( err );
      } catch ( e ) {
        // dev tools are disabled so we cannot use console on IE
      }
    };

    this.sockJSConn = new SockJS( url, null, options );
    this.sockJSConn.onmessage = self.onMessage.bind( self );
    this.sockJSConn.onclose = function () {
      self.state = EventBus.CLOSED;
      if ( self.pingTimerID ) clearInterval( self.pingTimerID );
      self.onclose && self.onclose();
    };

    this.sockJSConn.onopen = function () {
      self.pingEnabled( true );
      self.state = EventBus.OPEN;
      self.onopen && self.onopen();
      registerPeerAddress();
    };

    function registerPeerAddress () {
      self.sockJSConn.send( JSON.stringify( {
        type: 'register',
        address: 'webrtc.' + self.peerId,
        headers: self.mergeHeaders( self.defaultHeaders, {} )
      } ) );
      //console.log( 'pId: '+ self.peerId )
    }

  };

  EventBus.prototype.send = require('./send');
  EventBus.prototype.publish = require('./publish')
  EventBus.prototype.registerHandler = require('./registerHandler')
  EventBus.prototype.unregisterHandler = require('./unregisterHandler')
  EventBus.prototype.registerStatusHandler = require('./registerStatusHandler')
  EventBus.prototype.unregisterStatusHandler = require('./unregisterStatusHandler')
  EventBus.prototype.pingEnabled = require('./pingEnabled')
  EventBus.prototype.close = function () {
    this.state = EventBus.CLOSING;
    this.sockJSConn.close();
  };

  EventBus.CONNECTING = 0;
  EventBus.OPEN = 1;
  EventBus.CLOSING = 2;
  EventBus.CLOSED = 3;

  function makeUID () {
    return 'xxxxxxxxxxxxxxxx'.replace( /[xy]/g,
      function ( a, b ) {
        return b = Math.random() * 16, (a === 'y' ? b & 3 | 8 : b | 0).toString(16);
      } );
  }

  return EventBus

})()