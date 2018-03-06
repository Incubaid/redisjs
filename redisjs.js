class RedisConnection {
  constructor(serverURL) {
    this.connection = new WebSocket(`ws://${serverURL}`);
    this.socketQueueId = 0;
    this.socketQueue = {};
    this.currentCallbacks = null;
    this.isConnected = false;

    this.connection.onopen = () => {
      this.isConnected = true;
    };

    this.connection.onmessage = (msg) => {
      this.parseResponse(msg.data);
    };

    this.connection.onerror = (error) => {
      this.isConnected = false;
      console.log(error);
    };
  }

  get(key, callback, errCallback) {
    this.send(`GET ${key}`, callback, errCallback);
  }

  send(cmd, callback, errCallback) {
    this.connection.send(`echo $START ${this.socketQueueId}`);
    this.connection.send(cmd);
    this.socketQueue[this.socketQueueId] = { callback, errCallback };
    this.socketQueueId += 1;
  }

  parseResponse(msg) {
    console.log(msg);
    // if (msg.search('$START') !== -1) {
    //   const responseId = msg.split(' ')[1];
    //   this.currentCallbacks = this.socketQueue[responseId];
    // } else if (msg.search('ERR') !== -1) {
    //   this.currentCallbacks.errCallback(msg);
    // } else {
    //   this.currentCallbacks.callback(msg.split(';;'));
    // }
  }
}
// export default RedisConnection;
