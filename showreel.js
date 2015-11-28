var wkhtmltopdf = require('wkhtmltopdf');

wkhtmltopdf('http://google.com/', { output: 'out/Showreel.pdf' });
