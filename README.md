# PDFPortfolio
Generate a PDF with multiples images and captions to present your work.

## Get started

Dependencies:
 - [NodeJS](https://nodejs.org/en/)

```shell
# Retrieve the project
git clone https://github.com/Fanaen/PDFPortfolio.git
cd PDFPortfolio

# Install dependencies
npm install

# Prepare folders
mkdir in  # Store images used in the portfolio
mkdir out # Store rendered stylesheets, html and pdf

# Use the sample
cp config/config.example.yml config/config.yml
npm start

# Use a named config fil
cp config/config.example.yml config/<name>.yml
npm start <name>
```
