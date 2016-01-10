var Promise     = require("bluebird"),
    wkhtmltopdf = require('wkhtmltopdf'),
    jade        = require('jade'),
    less        = require('less'),
    fs          = require('fs'),
    config      = require('./config/config.js');

// Promisification --
Promise.promisifyAll(fs);

// Options --
var options = {
  // Create Jade's configuration --
  jade: {
    metadata: config.metadata,
    list: [],
    css: '',
    absolutePath: 'file:///' + __dirname.replace(/\\/g, '/') + '/' // Fix content not found error --
  },

  // Create wkhtmltopdf's configuration --
  wk: {
    output: config.output + '.pdf',
    enableLocalFileAccess : true,
  }
}

// Parse config --
for (var i = 0; i < config.list.length; i++) {
  var item = config.list[i];

  if(config.hasOwnProperty(item)) {
    options.jade.list.push(config[item]);
  }
}

// Read the Less file --
return fs.readFileAsync('template/style.less', 'UTF-8')

  // Compute the CSS file --
  .then(function(data) {
    return new Promise(function(resolve, reject) {
      less.render(data, {
          paths: ['.', './node_modules/bootstrap/less'],  // Specify search paths for @import directives
          filename: 'style.less', // Specify a filename, for better error messages
          compress: false          // Minify CSS output
        }).then(resolve, reject);
    });
  })
  .then(function(output) {
    options.jade.css = output.css;
    console.log("CSS rended from style.less.");
    return output;
  })
  // Write the CSS output file --
  .then(function(output) {
    return fs.writeFileAsync(config.output + '.css', output.css);
  })
  // Info about writing --
  .then(function() {
    console.log('File created: '+ config.output + '.css');
  })

  // Compute the HTML file --
  .then(function() {
    return jade.renderFile('template/index.jade', options.jade);
  })
  .then(function(html) {
    options.html = html;
    console.log("Html rended from index.jade.");
    return html;
  })

  // Write the HTML output file --
  .then(function(html) {
    return fs.writeFileAsync(config.output + '.html', html)
  })
  .then(function() {
    console.log('File created: '+ config.output + '.html');
  })

  // Render the PDF --
  .then(function() {
    wkhtmltopdf(options.html, options.wk, function (code, signal) {
      if(code) {
        console.error(code);
        console.error("Please check if the file is writable.");
        return;
      }
      console.log('File created: '+ config.output + '.pdf');
    });
  });
