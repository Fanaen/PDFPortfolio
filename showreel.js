var wkhtmltopdf = require('wkhtmltopdf'),
    jade        = require('jade'),
    fs          = require('fs'),
    config      = require('./config/config.js');

// Create Jade's configuration --
var options = {};

// Use the template --
var html = jade.renderFile('template/index.jade', options);
console.log("Html rended from index.jade.");

// Print the HTML --
fs.writeFile(config.output + '.html', html, function(err) {
    if(err) { return console.log(err); }
    console.log('File created: '+ config.output + '.html');
});

// Create wkhtmltopdf's configuration --
var wkOptions = {
  output: config.output + '.pdf'
};

// Render the PDF --
wkhtmltopdf(html, wkOptions, function (code, signal) {
  if(code) {
    console.error(code);
    console.error("Please check if the file is writable.");
    return;
  }
  
  console.log('File created: '+ config.output + '.pdf');
});
