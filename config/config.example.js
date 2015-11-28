var config = {},
    marked = require('marked');

config.output = 'out/Showreel';

config.metadata = {
  name: "John Doe",
  date: "2015",
  description: marked("Description in **Markdown**")
}

module.exports = config;
