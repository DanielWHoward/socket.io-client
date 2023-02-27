import { v4 as eio } from 'engine.io-client';
import { protocol, Manager, ManagerOptions, Socket, SocketOptions, io } from "./index.js";
import { v4 } from "./v3/index.js";

/**
 These versions are super confusing and obnoxious.
 socket.io-client protocol 5 uses engine.io protocol 4
 socket.io-client protocol 4 uses engine.io protocol 3
 Internally, just call it by the engine.io version
 On export, rename v4 to v5 and v3 to v4
 */
const v5 = {
  eio,
  protocol,
  Manager,
  Socket,
  io,
  connect: io,
};
const versions = [
  v5,
  v4,
];
function getEioProtocolVersion(v: number) {
  return versions.find(el => el.eio.protocol === v);
}
export {
  v5,
  v4,
  versions,
  getEioProtocolVersion,
};
