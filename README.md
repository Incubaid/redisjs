# Redisjs Library

`redisjs` library is a redis client for javascript client side. It uses websocket with a bridge server to proxy the websocket connections to tcp socket connections (i.e [caddy wsproxy](https://github.com/arahmanhamdy/wsproxy))


## Installation

#### using npm:
```bash
npm install https://github.com/arahmanhamdy/redisjs
```

Then you can import RedisConnection into your js files:
```javascript
import RedisConnection from 'redisjs';
```

#### Using minified version
Include the minified script from the build directory into your html file
```html
<script src="build/redisjs.min.js"></script>
```

## Usage
* Create RedisConnection to the caddyserver which acts as websocket proxy

```javascript
const SERVER_DOMAIN = 'localhost:8200';
const redisConnection = new RedisConnection(`${SERVER_DOMAIN}`);

const successCallback = (conn) => {
    // Run your redis commands here in the success callback
};

const errCallback = (err) => {
  console.log(err);
};

redisConnection.connect(successCallback, errCallback);
```

* Run redis commands using methods with the same [redis-commands](https://redis.io/commands) names and arguments

```javascript
// Inside the connection success callback run your commands
conn.set('myNumbers', [1, 2, 3], (res) => {
    console.log(res);
  }, (err) => {
    console.log(`Error: ${err.message}`);
  });

conn.get('myNumbers', (res) => {
    console.log(res);
  }, (err) => {
    console.log(`Error: ${err.message}`);
  });

conn.INVALID_CMD('myNumbers', (res) => {
    console.log(res);
  }, (err) => {
    console.log(`Error: ${err.message}`);
  });
```
