const Parser = require('redis-parser');
const { Buffer } = require('buffer/');

class RedisConnection {
  constructor(serverURL) {
    const self = this;
    this.url = `ws://${serverURL}`;
    this.socketQueue = [];
    this.isConnected = false;
    this.connection = null;
    this.buffer = null;

    this.parser = new Parser({
      returnReply(data) {
        const callbacks = self.socketQueue.pop();
        if (callbacks.callback) {
          callbacks.callback(data);
        }
      },
      returnError(data) {
        const callbacks = self.socketQueue.pop();
        if (callbacks.errCallback) {
          callbacks.errCallback(data);
        }
      },
    });

    return new Proxy(this, {
      get(target, name) {
        if (!target[name]) {
          return target.getMethod(name);
        }
        return target[name];
      },
    });
  }

  connect(successCallback, errCallback) {
    this.connection = new WebSocket(this.url);
    this.connection.onopen = () => {
      this.isConnected = true;
      if (successCallback) {
        successCallback(this);
      }
    };

    this.connection.onmessage = (msg) => {
      this.parser.execute(Buffer.from(msg.data));
    };

    this.connection.onerror = (error) => {
      this.isConnected = false;
      if (errCallback) {
        errCallback(error);
      }
    };
  }

  send(cmd, callback, errCallback) {
    this.connection.send(cmd);
    this.socketQueue.push({ callback, errCallback });
  }

  getMethod(methodName) {
    return (...args) => {
      const callbackFunctions = args.filter(arg => typeof arg === 'function');
      const redisCmdArgs = args.filter(arg => typeof arg !== 'function');
      let cmd;
      if (redisCmdArgs) {
        cmd = `${methodName} ${redisCmdArgs.join(' ')}\r\n`;
      } else {
        cmd = `${methodName}\r\n`;
      }
      this.send(cmd, ...callbackFunctions);
    };
  }
}
module.exports = RedisConnection;
