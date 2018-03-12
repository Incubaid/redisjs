const SERVER_DOMAIN = 'localhost:8200';
const redisConnection = new RedisConnection(`${SERVER_DOMAIN}`);

const successCallback = (conn) => {
  conn.set('age', 50, (res) => {
    console.log(res);
  }, (err) => {
    console.log(`Error: ${err.message}`);
  });

  conn.get('age', (res) => {
    console.log(res);
  }, (err) => {
    console.log(`Error: ${err.message}`);
  });

  conn.INVALID_CMD('age', (res) => {
    console.log(res);
  }, (err) => {
    console.log(`Error: ${err.message}`);
  });
};

const errCallback = (err) => {
  console.log(err);
};

redisConnection.connect(successCallback, errCallback);
