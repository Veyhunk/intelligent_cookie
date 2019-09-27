const path = require('path');

module.exports = {
  entry: './src/vue-intelligent-cookie.js',
  output: {
      path: path.resolve(__dirname, 'dist'),
    filename: 'min.js'
  }
};