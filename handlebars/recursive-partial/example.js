/**
 * @author diode / http://vipin.live/
 */

 // Compile main template
var mainTemplate = $("#mainTemplate").html();
var mainTemplateFunc = Handlebars.compile(mainTemplate);

// Compile template for navigation and register it as partial
var navigationTemplate = $("#navigationTemplate").html();
Handlebars.registerPartial('navigation', navigationTemplate);

// Process main template and apply data
var data = {
  menu : [{
     label : "Item 1",
     menu : [{
       label : "Item 1A",
       link   : "#1A"
     },{
       label : "Item 1B",
       menu   : [{
         label : "Item 1BX",
         link   : "#1BX"
       },{
         label : "Item 1BY",
         link   : "#1BY"
       }]
     }]
    },{
     label : "Item 2",
     menu : [{
       label : "Item 2A",
       link   : "#2A"
     },{
       label : "Item 2B",
       link   : "#2B"
     }]
    }]
};
var html = mainTemplateFunc(data);
$(document.body).html(html);
