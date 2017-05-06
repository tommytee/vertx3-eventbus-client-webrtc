
## SockJS Event Bus bridge with WebRTC for Vert.x 3.3.3
vertx3-eventbus-client-webrtc and vertx3-eventbus-webrtc-helper

Automatically upgrades to low-latency UDP data channel ( RTCDataChannel ) for browser to browser communication when available.

All normal Event Bus client methods work (send, publish, register, unregister)

New:

    registerStatusHandler( address, headers, callback )

Is fired when:
 1. the bridge has a client unregister that address
 2. the bridge has a client register that address (not yet)
 
This is useful for knowing when another client disconnects. 
(ie. if you give clients their own address)

passes a status object { listenerRemoved: true }

to remove:

    unregisterStatusHandler( address, headers, callback )
  

## to use
vertx3-eventbus-webrtc-helper is needed on the server side 

    var webRTCHelper = require( 'vertx3-eventbus-webrtc-helper' );

pass it the eventbus

    webRTCHelper.init( eb );
    
add bridge address options to inbound and outbound

        { "addressRegex" : "webrtc\\..+" }

a handle must be added to sockJSHandler for bridge events

    sockJSHandler.bridge( opts, webRTCHelper.bridgeEvent );

to run the example chatApp you will want to npm install in the vertx3-eventbus-client-webrtc dir and in 
the happyChat dir contained within examples.

then from happyChat dir run ( default port 8090 )
    
    npm run latest

atm you can add #nowebrtc to url to disable WebRTC in browser

##Vert.x
requires java 8