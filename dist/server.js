'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _app = require('./app');

var _app2 = _interopRequireDefault(_app);

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

var port = normalizePort(process.env.PORT || '3000');
_app2['default'].set('port', port);

_winston2['default'].info('[SERVER] Environment: ' + _app2['default'].get('env'));
var server = _app2['default'].listen(port, '0.0.0.0', function (err) {
  if (err) throw new Error(err);

  var host = this.address();
  _winston2['default'].info('[SERVER] Started on ' + host.address + ':' + host.port);
});

server.on('close', function () {
  _winston2['default'].info("[SERVER] Closed nodejs application ...");
  disconnect();
});

process.on('SIGTERM', function () {
  server.close();
});

function normalizePort(val) {
  var port = parseInt(val, 10);
  if (isNaN(port)) return val;
  if (port >= 0) return port;
  return false;
}

module.exports = server;