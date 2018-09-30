/**
 * @author diode / http://vipin.live/
 */

// ES6 Class App
class App{
  start(){
    var output = document.getElementById("output");
    output.innerHTML = "Hello World";
  }
}

// invoke start
var app = new App();
app.start();
