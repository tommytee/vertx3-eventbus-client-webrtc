
module.exports = function makeUser ( body ) {

  var self = this;

  if ( body.userId === self.userId ) return;

  //console.log('makeUser',body);

  var sendMessage = function ( e ) {

    if ( self.valueEntered( e ) ) {

      var message = inputBox.value;

      if ( message.length > 0 ) {

        if ( message === '-wantReply' ||
          message === '-publish2room' ||
          message === '-manyReplies' ) {

          self.sendBotMessage( body.userId, message, textDiv );

        } else {

          eb.send( "chat.room.user." + body.userId, {
            message: message,
            userId: self.userId,
            userColors: self.userColors
          });
        }

        inputBox.value = "";
        textDiv.innerHTML += '<span style="color:' + self.userColors.dark + '">' + message + '</span><br />';
        textDiv.scrollTop = textDiv.scrollHeight;
      }
    }
  }

  var userNameDiv = document.createElement('div');
  userNameDiv.classList.add('user-name-div');
  userNameDiv.innerHTML = body.username;
  userNameDiv.style.color = body.userColors.dark;

  var inputBox = document.createElement('input');
  inputBox.type = 'text';
  inputBox.classList.add('input-box');
  inputBox.onkeydown = sendMessage;
  inputBox.onblur = sendMessage;

  var textDiv = document.createElement('div');
  textDiv.classList.add('text-div')

  var resizer = document.createElement('div');
  resizer.classList.add('resizer');
  resizer.style.backgroundColor = body.userColors.light;
  resizer.style.borderColor = body.userColors.dark;
  resizer.addEventListener('mousedown', initResize, false);

  var userBox = document.createElement('div');
  userBox.classList.add('user-box');
  userBox.style.backgroundColor = body.userColors.light;
  userBox.style.left = Math.floor(Math.random() * 70)  + 'vw';
  userBox.style.top = Math.floor(Math.random() * 36)  + 40 + 'vh';
  userBox.appendChild( userNameDiv);
  userBox.appendChild( textDiv );
  userBox.appendChild( inputBox );
  userBox.appendChild( resizer );

  this.zOrderArray.push( userBox )
  userBox.style.zIndex = this.zOrderArray.length + 20;
  new Draggabilly(userBox).on('pointerDown',function(){self.zOrder(userBox)})

  document.body.appendChild( userBox );

  self.usersInRoom[ body.userId ] = {
    username: body.username,
    userColors:body.userColors,
    userBox: userBox,
    textDiv: textDiv,
    inputBox:inputBox
  }

  var off;

  function initResize(e) {
    e.stopPropagation()
    off = {
      x: ( userBox.clientWidth + userBox.offsetLeft ) - e.clientX,
      y: ( userBox.clientHeight + userBox.offsetTop ) - e.clientY
    }
    window.addEventListener('mousemove', Resize, false);
    window.addEventListener('mouseup', stopResize, false);
  }
  function Resize(e) {
    userBox.style.width = (e.clientX - userBox.offsetLeft) - 10 + off.x +'px';
    userBox.style.height = (e.clientY - userBox.offsetTop) - 10 + off.y +'px';
  }
  function stopResize() {
    window.removeEventListener('mousemove', Resize, false);
    window.removeEventListener('mouseup', stopResize, false);
  }

  var statusHandler = function ( err, update ) {

    //console.log( 'status update',update )

    if ( update.listenerRemoved ) {

      document.body.removeChild( userBox );

      delete self.usersInRoom[ body.userId ];

      eb.unregisterStatusHandler( 'chat.room.user.'+ body.userId, statusHandler);

      var idx = self.zOrderArray.indexOf( userBox );

      if ( idx > - 1 ) {

        self.zOrderArray.splice( idx, 1 );

      }

    }
  };

  eb.registerStatusHandler( 'chat.room.user.'+ body.userId, statusHandler )

  //console.log('registerStatusHandler for address: chat.room.user.'+ body.userId)

}
