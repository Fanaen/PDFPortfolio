var config = {},
    marked = require('marked');

config.output = 'out/Showreel';

config.metadata = {
  name: 'John Doe',
  date: '2015',
  description: marked('Description in **Markdown**')
}

config.list = [
  'exampleOne',
  'exampleTwo'
];

config.exampleOne = {
  mode: 'background',
  title: 'Example one',
  src: '',
};

config.exampleOne = {
  mode: 'simple',
  title: 'Example two',
  src: '',
};

module.exports = config;
