var Promise     = require("bluebird"),
    wkhtmltopdf = require('wkhtmltopdf'),
    jade        = require('jade'),
    less        = require('less'),
    fs          = require('fs'),
    marked      = require('marked'),
    yaml        = require('js-yaml'),
    i18n        = require("i18n");

// I18n --
i18n.configure({
    locales:['en', 'fr'],
    directory: __dirname + '/locales',
    defaultLocale: 'en'
});

// Promisification --
Promise.promisifyAll(fs);

// Options --
var options = {};
var config = {};
var source = 'config/config.yml';

if(process.argv.length > 2)
  source = 'config/' + process.argv[2] + '.yml';

console.log('Config file set to: ' + source + '.');

// Parse config --
new Promise((resolve, reject) => {
  try {
    config = yaml.safeLoad(fs.readFileSync(source, 'utf8'));
    console.log(config);
    resolve(config);
  } catch (e) {
    reject(e);
  }
})
  // Set options --
  .then(() => {
    // Internationalisation --
    if(config.metadata.locale) {
      i18n.setLocale(config.metadata.locale);
    }

    options = {
      // Create Jade's configuration --
      jade: {
        locale: config.metadata.locale,
        metadata: config.metadata,
        list: config.list,
        css: '',
        absolutePath: 'file:///' + __dirname.replace(/\\/g, '/') + '/', // Fix content not found error --
        md: marked,
        __: i18n.__
      },

      // Create wkhtmltopdf's configuration --
      wk: {
        output: config.output + '.pdf',
        enableLocalFileAccess : true,
      }
    };
  })

  // Read the Less file --
  .then(() => {
    return fs.readFileAsync('template/style.less', 'UTF-8');
  })

  // Compute the CSS file --
  .then((data) => {
    return new Promise((resolve, reject) => {
      less.render(data, {
          paths: ['.', './node_modules/bootstrap/less'],  // Specify search paths for @import directives
          filename: 'style.less', // Specify a filename, for better error messages
          compress: false          // Minify CSS output
        }).then(resolve, reject);
    });
  })
  .then((output) => {
    options.jade.css = output.css;
    console.log("CSS rended from style.less.");
  })

  // Write the CSS output file --
  .then(() => {
    return fs.writeFileAsync(config.output + '.css', options.jade.css);
  })
  .then(() => {
    console.log('File created: '+ config.output + '.css');
  })

  // Compute the HTML file --
  .then(() => {
    return jade.renderFile('template/index.jade', options.jade);
  })
  .then((html) => {
    options.html = html;
    console.log("Html rended from index.jade.");
  })

  // Write the HTML output file --
  .then(() => {
    return fs.writeFileAsync(config.output + '.html', options.html)
  })
  .then(() => {
    console.log('File created: '+ config.output + '.html');
  })

  // Render the PDF --
  .then(() => {
    wkhtmltopdf(options.html, options.wk, (code, signal) => {
      if(code) {
        console.error(code);
        console.error("Please check if the file is writable.");
        return;
      }
      console.log('File created: '+ config.output + '.pdf');
    });
  });
