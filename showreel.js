var wkhtmltopdf = require('wkhtmltopdf');

wkhtmltopdf('http://google.com/', { output: 'Showreel.pdf' });
