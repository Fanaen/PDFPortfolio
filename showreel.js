var wkhtmltopdf = require('wkhtmltopdf'),
    config      = require('./config/config.js');

wkhtmltopdf('http://google.com/', { output: config.output });
