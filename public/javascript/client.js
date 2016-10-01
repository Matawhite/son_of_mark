$(function() {
   var mouse = {
      click: false,
      move: false,
      pos: {x:0, y:0},
      pos_prev: false
   };


   // get canvas element and create context
   var canvas  = document.getElementById('drawing');
   var body = document.querySelector('body');
   var context = canvas.getContext('2d');
   var width   = window.innerWidth/1.6;
   var height  = window.innerHeight/1.6;
   var socket  = io.connect();
   var drawingData = ['drawing'];
   savedData = new Image();


   var loadButton = document.getElementById('loadDrawing');

   // set canvas to full browser width/height
   canvas.width = width;
   canvas.height = height;
   var canvasRect = canvas.getBoundingClientRect();

   // register mouse event handlers
   canvas.onmousedown = function(e){ mouse.click = true; };
   canvas.onmouseup = function(e){ mouse.click = false; };

   canvas.onmousemove = function(e) {
      // normalize mouse position to range 0.0 - 1.0
      mouse.pos.x = (e.clientX - canvasRect.left) / width;
      mouse.pos.y = (e.clientY - canvasRect.top + body.scrollTop) / height;
      mouse.move = true;
   };

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

   socket.on('clearCanvas', function() {
      context.clearRect(0, 0, canvas.width, canvas.height);
   });


//       REFACTOR THIS!!!!!!!!!!!!!!/////////

   //variables and event listeners to change the colors of the line
   var blueButton = document.getElementById("changeToBlue");
   var blackButton = document.getElementById("changeToBlack");
   var redButton = document.getElementById("changeToRed");
   var yellowButton = document.getElementById("changeToYellow");
   var greenButton = document.getElementById("changeToGreen");
   var orangeButton = document.getElementById("changeToOrange");
   var pinkButton = document.getElementById("changeToPink");
   var purpleButton = document.getElementById("changeToPurple");
   var grayButton = document.getElementById("changeToGray");

   var smallButton = document.getElementById("changeToSmall");
   var mediumButton = document.getElementById("changeToMedium");
   var largeButton = document.getElementById("changeToLarge");

   var clearButton = document.getElementById('clearCanvas')

   var colorUsed = "";
   var widthUsed = 1;

   blueButton.addEventListener("click", function() {
      colorUsed = "blue";
   });

   redButton.addEventListener("click", function() {
      colorUsed = "red";
   });

   blackButton.addEventListener("click", function() {
      colorUsed = "black";
   });

   yellowButton.addEventListener("click", function(){
      colorUsed = "yellow";
   });

   greenButton.addEventListener("click", function(){
      colorUsed = "green";
   });

   orangeButton.addEventListener("click", function(){
      colorUsed = "orange";
   });

   pinkButton.addEventListener("click", function(){
      colorUsed = "pink";
   });
   purpleButton.addEventListener("click", function(){
      colorUsed = "purple";
   });
   grayButton.addEventListener("click", function(){
      colorUsed = "gray";
   });


   smallButton.addEventListener("click", function() {
      widthUsed = 1;
   });

   mediumButton.addEventListener("click", function() {
      widthUsed = 5;
   });

   largeButton.addEventListener("click", function() {
      widthUsed = 9;
   });

   clearButton.addEventListener("click", function() {
      clearCanvas();
   });
  //////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////




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
   }
   setInterval(mainLoop, 25);

   function clearCanvas() {
      socket.emit('clearCanvas', true);
   }

   loadButton.addEventListener("click", function(){

     context.drawImage(savedData,0,0)
   })


  var saveButton = document.getElementById('saveDrawing');
  saveButton.addEventListener('click', function(){
    savedData.src = canvas.toDataURL("image/png");
    console.log(savedData.src);
  })




  // //ajax post drawing request
  // var saveButton = document.getElementById('saveDrawing');
  // saveButton.addEventListener("click", function(){
  //   console.log('saved');
  //   $.post('/savedrawing', JSON.stringify(drawingData)).success(function(data){
  //     console.log(data);
  //   },function(err){
  //     console.log(err);
  //   })
  //   return false;
  // })
  //ajax get drawing request
});
