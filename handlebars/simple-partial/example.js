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
var data = {};
var html = mainTemplateFunc(data);
$(document.body).html(html);
