/**
 * @author diode / http://vipin.live/
 */

 // custom helper to find the average of n numbers
Handlebars.registerHelper('average', function(numbers) {
  var sum = 0, count;
  if(numbers && numbers.length){
    count = numbers.length;
    for(var i = 0; i < count; i++){
      sum += numbers[i];
    }
    return sum/count;
  }
  return 0;
});


// compile template
var template = $("#entry-template").html();
var templateFunc = Handlebars.compile(template);

var data = {
  title: "Example",
  numbers : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15]
};

// process template and apply data
var html = templateFunc(data);
$(document.body).html(html);
