const path = require('path');

module.exports = {
  entry: './index.js',
  mode: 'production',
  output: {
    filename: 'redisjs.min.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'RedisConnection',
  },
};
