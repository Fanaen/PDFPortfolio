var wkhtmltopdf = require('wkhtmltopdf'),
    jade        = require('jade'),
    less        = require('less'),
    fs          = require('fs'),
    config      = require('./config/config.js');

// Create Jade's configuration --
var jadeOptions = {
  youAreUsingJade: true,
  css: '',
  absolutePath: 'file:///' + __dirname.replace(/\\/g, '/') // Fix content not found error --
};

// Create wkhtmltopdf's configuration --
var wkOptions = {
  output: config.output + '.pdf',
  enableLocalFileAccess : true
};

// Render the css --
var renderCSS = function() {
  // Read the style file --
  fs.readFile('template/style.less', {encoding: 'UTF-8'}, function(err,data){
      if (!err){

        // Compute the file --
        less.render(data, {
            paths: ['.', './node_modules/bootstrap/less'],  // Specify search paths for @import directives
            filename: 'style.less', // Specify a filename, for better error messages
            compress: true          // Minify CSS output
          },
          function (e, output) {
            jadeOptions.css = output.css;
            console.log("CSS rended from style.less.");

            // Print the HTML --
            fs.writeFile(config.output + '.css', output.css, function(err) {
              if(err) { return console.log(err); }
              console.log('File created: '+ config.output + '.css');
            });

            // Pursue the rendering --
            renderHTML();
        });
      }
      else{
        console.log(err);
      }
  });
};

// Render the HTML --
var renderHTML = function() {
  // Use the template --
  var html = jade.renderFile('template/index.jade', jadeOptions);
  console.log("Html rended from index.jade.");

  // Print the HTML --
  fs.writeFile(config.output + '.html', html, function(err) {
    if(err) { return console.log(err); }
    console.log('File created: '+ config.output + '.html');
  });

  // Pursue the rendering --
  renderPDF(html);
};

// Render the PDF --
var renderPDF = function(html) {
  // Render the PDF --
  wkhtmltopdf(html, wkOptions, function (code, signal) {
    if(code) {
      console.error(code);
      console.error("Please check if the file is writable.");
      return;
    }

    console.log('File created: '+ config.output + '.pdf');
  });
};

// Run the rendering --
renderCSS();
