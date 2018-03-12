const path = require('path');

module.exports = {
  entry: './src/redisjs.js',
  mode: 'production',
  output: {
    filename: 'redisjs.min.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'RedisConnection',
  },
};
