$(function () {
    "use strict";
    var SERVER = "$SERVER_DOMAIN/redis";
    // for better performance - to avoid searching in DOM
    var content = $('#content');
    var input = $('#input');
    var status = $('#status');
  
    // if user is running mozilla then use it's built-in WebSocket
    window.WebSocket = window.WebSocket || window.MozWebSocket;
  
    // if browser doesn't support WebSocket, just show
    // some notification and exit
    if (!window.WebSocket) {
      content.html($('<p>',
        { text:'Sorry, but your browser doesn\'t support WebSocket.'}
      ));
      input.hide();
      $('span').hide();
      return;
    }
  
    // open connection
    var connection = new WebSocket('ws://' + SERVER);
  
    connection.onopen = function () {
        status.text('Enter Redis Command: (i.e `KEYS *`)').css('color', "blue");
        input.removeAttr('disabled').focus();
    };
  
    connection.onerror = function (error) {
      // just in there were some problems with connection...
      content.html($('<p>', {
        text: 'Sorry, but there\'s some problem with your '
           + 'connection or the server is down.'
      }));
    };
  
    // most important part - incoming messages
    connection.onmessage = function (message) {
      input.removeAttr('disabled');
      addMessage("Output", message.data);
    };

    input.keydown(function(e) {
      if (e.keyCode === 13) {
        var msg = $(this).val();
        if (!msg) {
          return;
        }
        // send the message as an ordinary text
        connection.send(msg);
        $(this).val('');
        // disable the input field to make the user wait until server
        // sends back response
        input.attr('disabled', 'disabled');
        addMessage("Input", msg);
      }
    });
  
    /**
     * This method is optional. If the server wasn't able to
     * respond to the in 3 seconds then show some error message 
     * to notify the user that something is wrong.
     */
    setInterval(function() {
      if (connection.readyState !== 1) {
        status.text('Error');
        input.attr('disabled', 'disabled').val(
            'Unable to communicate with the WebSocket server.');
      }
    }, 3000);
  
    /**
     * Add message to the chat window
     */
    function addMessage(source, message, dt) {
        var color;
        if (source === "Input")
            color = "red";
        else
            color = "green";
      content.append('<p><span style="color:'+color+'">'
          + source + '</span>: ' + message + '</p>');
    }
  });
