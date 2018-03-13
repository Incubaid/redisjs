const Parser = require('redis-parser');
const { Buffer } = require('buffer/');

function encode(...args) {
  let cmd = '';
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (typeof arg === 'string' || arg instanceof String) {
      cmd += `$${arg.length}\r\n${arg}\r\n`;
    } else if (typeof arg === 'number' || Number.isFinite(arg)) {
      cmd += `:${arg}\r\n`;
    } else {
      const stringifiedArg = JSON.stringify(arg);
      cmd += `$${stringifiedArg.length}\r\n${stringifiedArg}\r\n`;
    }
  }
  return `*${args.length}\r\n${cmd}`;
}

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
      const cmd = encode(methodName, ...redisCmdArgs);
      this.send(cmd, ...callbackFunctions);
    };
  }
}
module.exports = RedisConnection;
