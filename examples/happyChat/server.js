var Router = require('vertx-web-js/router');
var SockJSHandler = require('vertx-web-js/sock_js_handler');
var StaticHandler = require('vertx-web-js/static_handler');
var webRTCHelper = require('vertx3-eventbus-webrtc-helper');

var router = Router.router(vertx);
var eb = vertx.eventBus();
var sockJSHandler = SockJSHandler.create(vertx);

// Allow events for the designated addresses in/out of the event bus bridge
var opts = {
  "inboundPermitteds" : [
    { "addressRegex" : "chat.room\\..+" },
    { "addressRegex" : "webrtc\\..+" }
  ],
  "outboundPermitteds" : [
    { "addressRegex" : "chat.room\\..+" },
    { "addressRegex" : "webrtc\\..+" }
  ]
};

webRTCHelper.init( eb );

router.route('/eventbus/*').handler(sockJSHandler.handle);

sockJSHandler.bridge( opts, webRTCHelper.bridgeEvent );

router.route().handler(StaticHandler.create().handle);

vertx.createHttpServer().requestHandler(router.accept).listen(8090);

require('./server-bot')( eb );
