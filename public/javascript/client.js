$(function() {
   var mouse = {
      click: false,
      move: false,
      pos: {x:0, y:0},
      pos_prev: false
   };

    var touch = {
      drawing: false,
      move: false,
      pos: {x:0, y:0},
      pos_prev: {}
   };

   $('.dropdown-toggle').dropdown()
    savedData = new Image();



   var canvas  = document.getElementById('drawing');
   var body = document.querySelector('body');
   var context = canvas.getContext('2d');
   var width   = window.innerWidth/1.6;
   var height  = window.innerHeight/1.6;
   var socket  = io.connect();
   var loadButton = document.getElementById('loadDrawing');
   var clearButton = document.getElementById('clearCanvas')
   var smallButton = document.getElementById("changeToSmall");
   var mediumButton = document.getElementById("changeToMedium");
   var largeButton = document.getElementById("changeToLarge");
   var widthUsed = 1;
   var colorUsed;

   // set canvas to full browser width/height
   canvas.width = width;
   canvas.height = height;
   var canvasRect = canvas.getBoundingClientRect();

   // register mouse event handlers
   canvas.onmousedown = function(e){ mouse.click = true; };

   canvas.addEventListener('touchstart', function(e) {
      touch.drawing = true;
      touch.pos.x = (e.changedTouches[0].clientX - canvasRect.left) / width;
      touch.pos.y = (e.changedTouches[0].clientY - canvasRect.top + body.scrollTop) / height;
   });
   canvas.onmouseup = function(e){ mouse.click = false; };

   canvas.addEventListener('touchend', function(e) {
      touch.drawing = false;
   });

   canvas.onmousemove = function(e) {
      // normalize mouse position to range 0.0 - 1.0
      mouse.pos.x = (e.clientX - canvasRect.left) / width;
      mouse.pos.y = (e.clientY - canvasRect.top + body.scrollTop) / height;
      mouse.move = true;
   };

   canvas.addEventListener('touchmove', function(e) {
      touch.move = true;
      touch.pos.x = (e.changedTouches[0].clientX - canvasRect.left) / width;
      touch.pos.y = (e.changedTouches[0].clientY - canvasRect.top + body.scrollTop) / height;
   });

   // draw line received from server
   socket.on('draw_line', function(data) {
      //variables and methods to draw the line
      var line = data.line;
      context.beginPath();
      context.moveTo(line[0].x * width, line[0].y * height);
      context.lineTo(line[1].x * width, line[1].y * height);
      //add color
      context.strokeStyle = data.color;
      //add width
      context.lineWidth = data.width;
      context.stroke();

      var getDrawingData = {
        startX: line[0].x * width,
        startY: line[0].y * height,
        lineToX: line[1].x * width,
        lineToY: line[1].y * height,
        color: data.color,
        width: data.width
      }
   });

   socket.on('touch_line', function(data) {
      // variables and methods to draw the line with touch
      var line = data.line;
      context.beginPath();
      context.moveTo(line[0].x * width, line[0].y * height);
         context.lineTo(line[1].x * width, line[1].y * height);
         // add color
         context.strokeStyle = data.color;
         // add width
         context.lineWidth = data.width;
         context.stroke();
   });

   socket.on('clearCanvas', function() {
      context.clearRect(0, 0, canvas.width, canvas.height);
   });

   // prevent the page to scroll
   document.body.addEventListener("touchstart", function (e) {
      if (e.target == canvas) {
         e.preventDefault();
      }
   }, false);
   document.body.addEventListener("touchend", function (e) {
      if (e.target == canvas) {
         e.preventDefault();
      }
   }, false);
   document.body.addEventListener("touchmove", function (e) {
      if (e.target == canvas) {
         e.preventDefault();
      }
   }, false);

   smallButton.addEventListener("click", function() {
     console.log('clicked')
     widthUsed = 1;
  });

  mediumButton.addEventListener("click", function() {
     console.log('clicked')
     widthUsed = 5;
  });

  largeButton.addEventListener("click", function() {
     console.log('clicked')
     widthUsed = 9;
  });


   // main loop, running every 25ms
   function mainLoop() {
      // check if the user is drawing
      if (mouse.click && mouse.move && mouse.pos_prev) {
         // send line to to the server
         socket.emit('draw_line', {
            line: [ mouse.pos, mouse.pos_prev ],
            color: colorUsed,
            width: widthUsed
         });
         mouse.move = false;
      }
      mouse.pos_prev = {x: mouse.pos.x, y: mouse.pos.y};

      if (touch.drawing && touch.move && touch.pos_prev) {

          socket.emit('touch_line', {
             line: [touch.pos, touch.pos_prev],
             color: colorUsed,
             width: widthUsed
          });
          touch.move = false
       }
       touch.pos_prev = {x: touch.pos.x, y: touch.pos.y};
   }
   setInterval(mainLoop, 50);

   function clearCanvas() {
      socket.emit('clearCanvas', true);
   }

   $('#picker').on('mouseout', function(){
     colorUsed = $('#colorChanging').val();
   })

clearButton.addEventListener("click", function() {
         clearCanvas();
      });

var saveButton = document.getElementById('saveDrawing');
  saveButton.addEventListener('click', function(){
    savedData.src = canvas.toDataURL("image/png");
    var data = {
      source: savedData.src
    }
    $.post('/savedrawing', data).success(function(){
      console.log('success');
    },function(err){
      console.log(err);
    })
  })

   loadButton.addEventListener("click", function(){
     $.get('/loadDrawing').success(function(data){
       savedData.src = data.source
       context.drawImage(savedData,0,0)
     })
   })

});
