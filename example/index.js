const SERVER_DOMAIN = 'localhost:8200';
const redisConnection = new RedisConnection(`${SERVER_DOMAIN}`);

const successCallback = (conn) => {
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
};

const errCallback = (err) => {
  console.log(err);
};

redisConnection.connect(successCallback, errCallback);
