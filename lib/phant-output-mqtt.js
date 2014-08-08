/**
 * phant-output-mqtt
 * https://github.com/sparkfun/phant-output-mqtt
 *
 * Copyright (c) 2014 SparkFun Electronics
 * Licensed under the GPL v3 license.
 */

'use strict';

/**** Module dependencies ****/
var server = require('phant-server-mqtt'),
  util = require('util'),
  events = require('events');

/**** Make PhantOutput an event emitter ****/
util.inherits(PhantOutput, events.EventEmitter);

/**** PhantOutput prototype ****/
var app = PhantOutput.prototype;

/**** Expose PhantOutput ****/
exports = module.exports = PhantOutput;

/**** Initialize a new PhantOutput ****/
function PhantOutput(config) {

  if (!(this instanceof PhantOutput)) {
    return new PhantOutput(config);
  }

  events.EventEmitter.call(this, config);
  util._extend(this, config || {});

  this.server = server.create(this.port, this.backend);

}

/**** Defaults ****/
app.name = 'MQTT Output';
app.port = 1883;
app.backend = false;
app.keychain = false;
app.server = false;

app.write = function(id, data) {

  this.send(this.keychain.publicKey(id), null, data);

};

app.clear = function(id) {

  var pub = this.keychain.publicKey(id);

  this.send(pub, 'clear', pub);

};

app.send = function(pub, event, payload) {

  var message = {
    topic: 'streams/' + pub + (event ? '/' + event : ''),
    payload: JSON.stringify(payload),
    qos: 0,
    retain: false
  };

  this.server.publish(message);

};
