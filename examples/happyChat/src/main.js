
Draggabilly = require('draggabilly')
EventBus = require('../../../src/main')

eb = new EventBus("/eventbus/");

var happyChat = {}

happyChat.init = function () {

  var self = this;

  var inputRoom, enterRoomMask, nameBox, mainText, mainInput;
  var mainRoom, mainResizer, usernameSpan, mainRoomTitle;
  var defaultRooms = {
    happy: {
      title: "Happy Room",
      colors: {
        light:"#ffe5d6",
        dark: "#273c8b"
      }
    },
    support: {
      title: "Support Area",
      colors: {
        light: "#c4dcf3",
        dark: "#301100"
      }
    }
  }

  this.userId = getRandom()
  this.usersInRoom = {}
  this.zOrderArray = []
  this.manyReplies = require('./manyReplies')
  this.sendBotMessage = require('./sendBotMessage')
  this.makeUser = require('./makeUser')
  this.clientBot = require( './client-bot' );
  this.randomName = require('./randomName')

  eb.onopen = function () {}

  window.onload = function () {

    var off;

    inputRoom = document.getElementById('input-room')
    enterRoomMask = document.getElementById('enter-room-mask')
    nameBox = document.getElementById('name-box')
    mainRoom = document.getElementById('main-room')
    mainRoomTitle = document.getElementById('main-room-title')
    mainInput = document.getElementById('main-input')
    mainText = document.getElementById('main-text')
    usernameSpan = document.getElementById('username-span')

    new Draggabilly( document.getElementById('main-room') )

    inputRoom.onkeydown = checkRoomValue;
    inputRoom.onblur = checkRoomValue;

    document.getElementById('change-username').onclick = genUsername;
    document.getElementById('change-color').onclick = genColor;

    document.getElementById('username-span').onclick = function () {
      genUsername()
      genColor()
    };

    showDefaultRooms()
    genUsername()
    genColor()

    inputRoom.focus()

    mainResizer = document.createElement('div');
    mainResizer.classList.add('resizer');
    mainResizer.addEventListener('mousedown', initResize, false);
    mainRoom.appendChild( mainResizer );

    function initResize(e) {
      e.stopPropagation()
      off = {
        x: ( mainRoom.clientWidth + mainRoom.offsetLeft ) - e.clientX - 2,
        y: ( mainRoom.clientHeight + mainRoom.offsetTop ) - e.clientY - 2
      }
      window.addEventListener('mousemove', Resize, false);
      window.addEventListener('mouseup', stopResize, false);
    }
    function Resize(e) {
      mainRoom.style.width = (e.clientX - mainRoom.offsetLeft) + off.x +'px';
      mainRoom.style.height = (e.clientY - mainRoom.offsetTop) + off.y +'px';
    }
    function stopResize(e) {
      window.removeEventListener('mousemove', Resize, false);
      window.removeEventListener('mouseup', stopResize, false);
    }
  }

  function showDefaultRooms () {

    Object.keys( defaultRooms ).forEach(function ( name ) {

      var room = defaultRooms[ name ];

      var roomButton = document.createElement('div');
      roomButton.classList.add('room-button');
      roomButton.innerHTML = room.title;
      roomButton.style.color = room.colors.dark;
      roomButton.style.backgroundColor = room.colors.light;

      roomButton.onclick = function () {

        self.roomName = name;
        enterRoom( name )
      }

      document.getElementById('default-rooms-area').appendChild( roomButton );

    })
  }

  function genUsername () {

    usernameSpan.innerHTML = self.username = self.randomName()
  }

  function genColor () {

    var c2hex = function ( c ) {
      var hex = c.toString( 16 );
      return hex.length === 1 ? "0" + hex : hex;
    }

    var rgbToHex = function ( r, g, b ) {
      return "#" + c2hex( r ) + c2hex( g ) + c2hex( b )
    }

    var r = Math.floor( Math.random() * 100 );
    var g = Math.floor( Math.random() * 100 );
    var b = Math.floor( Math.random() * 100 );

    self.userColors = {
      dark: rgbToHex( r, g, b ),
      light: rgbToHex( r + 156, g + 156, b + 156 )
    }

    usernameSpan.style.color = self.userColors.dark;
    usernameSpan.style.backgroundColor = self.userColors.light;

    nameBox.style.backgroundColor = self.userColors.light;

  }

  function checkRoomValue (e) {

    if ( self.valueEntered( e ) ) {

      //console.log( 'enterRoom',e);
      var rName = inputRoom.value.toLowerCase();

      if ( rName.length > 0 && rName.length < 21 ) {
        // todo: check input
        self.roomName = rName;
        enterRoom()
      }
    }
  }

  function enterRoom ( defRoomName ) {

    console.log( 'userId:', self.userId );

    self.zOrderArray.push( mainRoom )
    new Draggabilly(mainRoom).on('pointerDown',function(){self.zOrder(mainRoom)})

    nameBox.innerHTML =
      '<span style="color:' + self.userColors.dark + '"> ' + self.username + '</span>';
    
    if ( defRoomName ) {

      //console.log( 'default room', defRoomName );

      mainRoom.style.backgroundColor = defaultRooms[ defRoomName ].colors.light;
      mainRoom.style.borderColor = defaultRooms[ defRoomName ].colors.light;
      mainResizer.style.backgroundColor = defaultRooms[ defRoomName ].colors.light;
      mainResizer.style.borderColor = defaultRooms[ defRoomName ].colors.dark;
      mainRoomTitle.innerHTML =
        '<span style="color:'+ defaultRooms[ defRoomName ].colors.dark +'" class="room-title">'+ self.roomName +'</span>';

    } else {

      mainRoom.style.backgroundColor = self.userColors.light;
      mainRoom.style.borderColor = self.userColors.light;
      mainResizer.style.backgroundColor = self.userColors.light;
      mainResizer.style.borderColor = self.userColors.dark;
      mainRoomTitle.innerHTML =
        '<span style="color:'+ self.userColors.dark +'" class="room-title">'+ self.roomName +'</span>';

    }


    document.body.removeChild( enterRoomMask );

    mainInput.onkeydown = sendToRoom;
    mainInput.focus();

    eb.registerHandler( "chat.room." + self.roomName, onRoomMessage );
    eb.registerHandler( "chat.room.user." + self.userId, onUserMessage );

    eb.publish( 'chat.room.' + self.roomName, {
      enter: true,
      username: self.username,
      userId: self.userId,
      userColors: self.userColors
    } );

    eb.send( 'chat.room.user.serverBot', {
      enter: true,
      roomName: self.roomName,
      username: self.username,
      userId: self.userId,
      userColors: self.userColors
    } );

  }

  function onUserMessage ( err, msg ) {

    //console.log( 'received user message' );

    if ( err )
      console.log( err );

    if ( msg.body.message ) {

      //console.log( msg.body )

      if ( self.usersInRoom[ msg.body.userId ] ) {

        var textDiv = self.usersInRoom[ msg.body.userId ].textDiv;

        if ( msg.body.message === 'Test message from serverBot, please respond' ||
          msg.body.message === 'Test message from clientBot, please respond' ) {

          self.manyReplies( msg, self.usersInRoom[ msg.body.userId ].textDiv );

        } else if (
          msg.body.message === '-wantReply' ||
          msg.body.message === '-manyReplies' ||
          msg.body.message === '-publish2room' ) {

          self.clientBot( msg );

        } else {

          textDiv.innerHTML += '<span style="color:' + msg.body.userColors.dark + '">' + msg.body.message + '</span><br />';
          textDiv.scrollTop = textDiv.scrollHeight;

          if ( msg.reply )
            msg.reply( 'Thanks for the message' );

        }

      }

    } else if ( msg.body.userInfo ) {

      self.makeUser( msg.body.userInfo )

    }

    if ( msg.reply ) {

      console.log( 'reply function found on user message')
    }

  }

  function onRoomMessage ( err, msg ) {

    if ( err ) {

      console.log( err );

    } else {

      if ( msg.body.message ) {

        mainText.innerHTML += '<span style="color:' + msg.body.userColors.dark + '">' + msg.body.message + '</span><br />';
        mainText.scrollTop = mainText.scrollHeight;

      } else if ( msg.body.enter ) {

        mainText.innerHTML += '<span class="status-update">'+ msg.body.username +' entered room</span><br />';
        mainText.scrollTop = mainText.scrollHeight;

        if ( self.usersInRoom[ msg.body.userId ] ) {

          console.log( '\n###\n#x#\n### Error user already here' );

        } else {

          self.makeUser( msg.body );

          eb.send( 'chat.room.user.' + msg.body.userId, {
            userInfo: {
              username: self.username,
              userId: self.userId,
              userColors: self.userColors
            }
          } )

        }

      }
    }
  }

  function sendToRoom ( e ) {

    if ( self.valueEntered( e ) ) {

      var message = mainInput.value;

      if ( message.length > 0 ) {

        eb.publish( "chat.room." + self.roomName, {
          userId: self.userId,
          userColors: self.userColors,
          message: message
        } );
        mainInput.value = "";
      }

    }
  }


  function getRandom () {
    return 'xxxxxx'.replace( /[xy]/g,
      function ( a, b ) {
        return b = Math.random() * 16, (a === 'y' ? b & 3 | 8 : b | 0).toString(16);
      } );
  }

  /* https://jsfiddle.net/katowulf/3gtDf/ */
  function randomEl(list) {
    var i = Math.floor(Math.random() * list.length);
    return list[i];
  }

  var adjectives = ["adamant", "adroit", "amatory", "animistic", "antic", "arcadian", "baleful", "bellicose", "bilious", "boorish", "calamitous", "caustic", "cerulean", "comely", "concomitant", "contumacious", "corpulent", "crapulous", "defamatory", "didactic", "dilatory", "dowdy", "efficacious", "effulgent", "egregious", "endemic", "equanimous", "execrable", "fastidious", "feckless", "fecund", "friable", "fulsome", "garrulous", "guileless", "gustatory", "heuristic", "histrionic", "hubristic", "incendiary", "insidious", "insolent", "intransigent", "inveterate", "invidious", "irksome", "jejune", "jocular", "judicious", "lachrymose", "limpid", "loquacious", "luminous", "mannered", "mendacious", "meretricious", "minatory", "mordant", "munificent", "nefarious", "noxious", "obtuse", "parsimonious", "pendulous", "pernicious", "pervasive", "petulant", "platitudinous", "precipitate", "propitious", "puckish", "querulous", "quiescent", "rebarbative", "recalcitant", "redolent", "rhadamanthine", "risible", "ruminative", "sagacious", "salubrious", "sartorial", "sclerotic", "serpentine", "spasmodic", "strident", "taciturn", "tenacious", "tremulous", "trenchant", "turbulent", "turgid", "ubiquitous", "uxorious", "verdant", "voluble", "voracious", "wheedling", "withering", "zealous"];
  var nouns = ["ninja", "chair", "pancake", "statue", "unicorn", "rainbows", "laser", "senor", "bunny", "captain", "nibblets", "cupcake", "carrot", "gnomes", "glitter", "potato", "salad", "toejam", "curtains", "beets", "toilet", "exorcism", "stick figures", "mermaid eggs", "sea barnacles", "dragons", "jellybeans", "snakes", "dolls", "bushes", "cookies", "apples", "ice cream", "ukulele", "kazoo", "banjo", "opera singer", "circus", "trampoline", "carousel", "carnival", "locomotive", "hot air balloon", "praying mantis", "animator", "artisan", "artist", "colorist", "inker", "coppersmith", "director", "designer", "flatter", "stylist", "leadman", "limner", "make-up artist", "model", "musician", "penciller", "producer", "scenographer", "set decorator", "silversmith", "teacher", "auto mechanic", "beader", "bobbin boy", "clerk of the chapel", "filling station attendant", "foreman", "maintenance engineering", "mechanic", "miller", "moldmaker", "panel beater", "patternmaker", "plant operator", "plumber", "sawfiler", "shop foreman", "soaper", "stationary engineer", "wheelwright", "woodworkers"];

}

happyChat.valueEntered = function ( e ) {
  var isIOS = /(iPad|iPhone|iPod)/g.test(navigator.userAgent)
  return e.keyCode === 13 || e.which === 13 || isIOS && e.type === 'blur'
}

happyChat.zOrder = function ( element ) {
  element.style.zIndex = this.zOrderArray.length + 1025;
  var newArray = [];
  for ( var i = 0; i < this.zOrderArray.length; i++ )
    if ( this.zOrderArray[ i ] !== element )
      newArray.push( this.zOrderArray[ i ] )
  this.zOrderArray = newArray;
  for ( i = 0; i < this.zOrderArray.length; i++ )
    this.zOrderArray[ i ].style.zIndex = i + 20;
  this.zOrderArray.push( element )
}

happyChat.init();
