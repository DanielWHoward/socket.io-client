
/**
 * Module dependencies.
 */

import url from './url';
import parser from './socket.io-parser';
import Manager from './manager';
import debugModule from 'debug';
var debug = debugModule('socket.io-client');

/**
 * Module exports.
 */

/**
 * Managers cache.
 */

var cache = {};

/**
 * Looks up an existing `Manager` for multiplexing.
 * If the user summons:
 *
 *   `io('http://localhost/a');`
 *   `io('http://localhost/b');`
 *
 * We reuse the existing instance based on same scheme/port/host,
 * and we initialize sockets for each namespace.
 *
 * @api public
 */

function lookup (uri, opts) {
  if (typeof uri === 'object') {
    opts = uri;
    uri = undefined;
  }

  opts = opts || {};

  var parsed = url(uri, null);
  var source = parsed.source;
  var id = parsed.id;
  var path = parsed.path;
  var sameNamespace = cache[id] && path in cache[id].nsps;
  var newConnection = opts.forceNew || opts['force new connection'] ||
                      false === opts.multiplex || sameNamespace;

  var io;

  if (newConnection) {
    debug('ignoring socket cache for %s', source);
    io = new Manager(source, opts);
  } else {
    if (!cache[id]) {
      debug('new io instance for %s', source);
      cache[id] = new Manager(source, opts);
    }
    io = cache[id];
  }
  if (parsed.query && !opts.query) {
    opts.query = parsed.query;
  }
  return io.socket(parsed.path, opts);
}

/**
 * Protocol version.
 *
 * @api public
 */

var protocol = parser.protocol;

/**
 * `connect`.
 *
 * @param {String} uri
 * @api public
 */

const connect = lookup;

/**
 * Expose constructors for standalone build.
 *
 * @api public
 */

import { v3 as eio } from 'engine.io-client';
import Socket from './socket';

const v4 = {
  eio,
  name: 'socket.io-client',
  managers: cache,
  protocol,
  Manager,
  Socket,
  io: lookup,
  connect: lookup,
  default: lookup,
}

export { v4 };
